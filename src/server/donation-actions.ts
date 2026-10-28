"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/content";
import { createDonationReference, MAX_DONATION_MINOR, MIN_DONATION_MINOR, parseAmountToMinor } from "@/lib/donation-rules";
import { echoValues, type FormState } from "@/lib/form-state";
import { initializeTransaction, isOnlineGivingAvailable } from "@/lib/paystack";
import { consumeRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site-url";
import { isSpam } from "@/lib/spam";
import { emailField, fieldErrorsOf } from "@/lib/validation";

const donationSchema = z.object({
  amount: z
    .string()
    .transform((value, context) => {
      const minor = parseAmountToMinor(value);
      if (minor === null) {
        context.addIssue({ code: "custom", message: "Please enter an amount such as 50 or 50.00." });
        return z.NEVER;
      }
      return minor;
    })
    .refine((minor) => minor >= MIN_DONATION_MINOR, "The minimum online gift is GH₵ 1.00.")
    .refine((minor) => minor <= MAX_DONATION_MINOR, "For gifts above GH₵ 100,000 please contact us."),
  categoryId: z.string().trim().max(40).optional().transform((value) => value || undefined),
  name: z.string().trim().max(120).optional().transform((value) => value || undefined),
  email: emailField,
});

/** Creates a PENDING donation and redirects the donor to Paystack's hosted checkout. */
export async function startDonation(_previous: FormState, formData: FormData): Promise<FormState> {
  const fields = ["amount", "categoryId", "name", "email"];
  if (isSpam(formData, "donation").spam) return { status: "error", message: "Please refresh the page and try again." };

  const settings = await getSiteSettings();
  if (!isOnlineGivingAvailable(settings.onlineGivingEnabled)) {
    return { status: "error", message: "Online giving is not available at the moment." };
  }
  const { allowed } = await consumeRateLimit("donation", RATE_LIMITS.donation);
  if (!allowed) return { status: "error", message: "Too many attempts. Please wait a while and try again." };

  const parsed = donationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, fields) };
  }
  const { amount, categoryId, name, email } = parsed.data;

  const category = categoryId ? await db.givingCategory.findFirst({ where: { id: categoryId, active: true } }) : null;
  if (categoryId && !category) return { status: "error", message: "Please choose a valid giving category.", values: echoValues(formData, fields) };

  const reference = createDonationReference(randomBytes(8).toString("base64url"));
  let checkoutUrl: string;
  try {
    const donation = await db.donation.create({
      data: { reference, amountMinor: amount, currency: "GHS", categoryId: category?.id, donorName: name, donorEmail: email, status: "PENDING" },
    });
    const { authorizationUrl } = await initializeTransaction({
      email,
      amountMinor: amount,
      currency: "GHS",
      reference,
      callbackUrl: absoluteUrl("/give/thank-you"),
      category: category?.name,
    });
    await db.donationTransaction.create({ data: { donationId: donation.id, kind: "INITIALIZED", status: "pending", amountMinor: amount } });
    checkoutUrl = authorizationUrl;
  } catch (error) {
    console.error("[donation] initialization failed:", error instanceof Error ? error.message : "unknown");
    return { status: "error", message: "We could not start the payment. No money has been taken. Please try again later.", values: echoValues(formData, fields) };
  }
  redirect(checkoutUrl);
}
