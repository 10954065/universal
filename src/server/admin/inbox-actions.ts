"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authorize } from "@/lib/session";
import { runRetention } from "@/lib/retention";
import type { FormState } from "@/lib/form-state";
import { failure, nullableText, parseForm, requiredText, saved } from "@/server/admin/helpers";

// ─── Enquiries ──────────────────────────────────────────────────────────

const enquirySchema = z.object({
  id: requiredText(40),
  status: z.enum(["NEW", "READ", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]),
  staffNotes: nullableText(4000),
});

export async function updateEnquiry(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("enquiries:manage");
    const parsed = parseForm(enquirySchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    await db.contactEnquiry.update({ where: { id }, data });
    await audit(user.id, "enquiry.updated", "ContactEnquiry", id, `status set to ${data.status}`);
    return saved();
  } catch (error) {
    return failure(error, "updateEnquiry");
  }
}

export async function deleteEnquiry(formData: FormData) {
  const user = await authorize("enquiries:manage");
  const id = String(formData.get("id"));
  await db.contactEnquiry.delete({ where: { id } });
  await audit(user.id, "enquiry.deleted", "ContactEnquiry", id);
  redirect("/admin/enquiries");
}

// ─── Prayer requests (private) ──────────────────────────────────────────

export async function setPrayerStatus(formData: FormData) {
  const user = await authorize("prayer:read");
  const id = String(formData.get("id"));
  const status = z.enum(["NEW", "READ", "PRAYED_FOR", "ARCHIVED"]).parse(formData.get("status"));
  await db.prayerRequest.update({ where: { id }, data: { status } });
  // The audit trail records the status change only, never the request text.
  await audit(user.id, "prayer.status", "PrayerRequest", id, status);
  redirect(`/admin/prayer?id=${id}`);
}

export async function deletePrayer(formData: FormData) {
  const user = await authorize("prayer:read");
  const id = String(formData.get("id"));
  await db.prayerRequest.delete({ where: { id } });
  await audit(user.id, "prayer.deleted", "PrayerRequest", id);
  redirect("/admin/prayer");
}

export async function applyRetentionNow() {
  const user = await authorize("prayer:read");
  const result = await runRetention();
  await audit(user.id, "retention.run", "PrayerRequest", null, `${result.prayerRequestsDeleted} deleted`);
  redirect(`/admin/prayer?purged=${result.prayerRequestsDeleted}`);
}

// ─── Subscribers ────────────────────────────────────────────────────────

export async function unsubscribeSubscriber(formData: FormData) {
  const user = await authorize("subscribers:manage");
  const id = String(formData.get("id"));
  await db.newsletterSubscriber.update({ where: { id }, data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date(), confirmTokenHash: null } });
  await audit(user.id, "subscriber.unsubscribed", "NewsletterSubscriber", id);
  redirect("/admin/subscribers");
}

export async function deleteSubscriber(formData: FormData) {
  const user = await authorize("subscribers:manage");
  const id = String(formData.get("id"));
  await db.newsletterSubscriber.delete({ where: { id } });
  await audit(user.id, "subscriber.deleted", "NewsletterSubscriber", id);
  redirect("/admin/subscribers");
}
