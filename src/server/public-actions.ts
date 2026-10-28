"use server";

import { createHash, randomBytes } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/content";
import { emailLayout, escapeHtml, isEmailConfigured, sendEmail, staffInbox } from "@/lib/email";
import { echoValues, type FormState } from "@/lib/form-state";
import { formatEventWindow } from "@/lib/format";
import { consumeRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site-url";
import { isSpam } from "@/lib/spam";
import { contactSchema, fieldErrorsOf, NEWSLETTER_CONSENT_TEXT, newsletterSchema, prayerSchema, registrationSchema, visitSchema } from "@/lib/validation";

/*
 * Public form handlers. Server Actions are public HTTP endpoints, so every
 * handler: rejects bots (honeypot + signed timing token), rate-limits by a
 * hashed client fingerprint, validates with Zod, and stores data before any
 * email is attempted. Error messages never reveal internal details.
 */

const GENERIC_ERROR = "Something went wrong on our side. Please try again in a moment.";
const RATE_LIMITED = "You have sent several submissions in a short time. Please wait a while and try again.";
// Bots receive a success-shaped reply so they learn nothing; nothing is stored.
const SPAM_SUCCESS: FormState = { status: "success", message: "Thank you." };

/** Bot check, run before anything else. */
function guard(formData: FormData, formId: keyof typeof RATE_LIMITS): FormState | null {
  return isSpam(formData, formId).spam ? SPAM_SUCCESS : null;
}

/** Counts only valid submissions, so a visitor correcting typos is never locked out. */
async function rateLimited(formId: keyof typeof RATE_LIMITS, formData: FormData, fields: string[]): Promise<FormState | null> {
  const { allowed } = await consumeRateLimit(formId, RATE_LIMITS[formId]);
  return allowed ? null : { status: "error", message: RATE_LIMITED, values: echoValues(formData, fields) };
}

function entries(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

async function notifyStaff(subject: string, heading: string, lines: [string, string][]) {
  const to = staffInbox();
  if (!to) return;
  const settings = await getSiteSettings();
  const html = lines
    .map(([label, value]) => `<p style="margin:0 0 12px"><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replace(/\n/g, "<br>")}</p>`)
    .join("");
  await sendEmail({
    to,
    subject,
    html: emailLayout(settings.ministryName, escapeHtml(heading), `${html}<p><a href="${absoluteUrl("/admin")}">Open the dashboard</a></p>`),
    text: `${heading}\n\n${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${absoluteUrl("/admin")}`,
  });
}

// ─── Contact ────────────────────────────────────────────────────────────

export async function submitContact(_previous: FormState, formData: FormData): Promise<FormState> {
  const blocked = guard(formData, "contact");
  if (blocked) return blocked;

  const parsed = contactSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, ["name", "email", "phone", "subject", "message"]) };
  }
  const data = parsed.data;
  const limited = await rateLimited("contact", formData, ["name", "email", "phone", "subject", "message"]);
  if (limited) return limited;
  try {
    await db.contactEnquiry.create({ data: { type: "CONTACT", ...data } });
  } catch {
    console.error("[contact] failed to store enquiry");
    return { status: "error", message: GENERIC_ERROR, values: echoValues(formData, ["name", "email", "phone", "subject", "message"]) };
  }
  await notifyStaff(`New enquiry: ${data.subject ?? "Website message"}`, "New contact enquiry", [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone ?? "Not given"],
    ["Subject", data.subject ?? "None"],
    ["Message", data.message],
  ]);
  return { status: "success", message: `Thank you, ${data.name.split(" ")[0]}. Your message has been received and a member of our team will be in touch.` };
}

// ─── Plan your visit ────────────────────────────────────────────────────

export async function submitVisit(_previous: FormState, formData: FormData): Promise<FormState> {
  const blocked = guard(formData, "visit");
  if (blocked) return blocked;

  const fields = ["name", "email", "phone", "visitDate", "partySize", "message"];
  const parsed = visitSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, fields) };
  }
  const data = parsed.data;
  const limited = await rateLimited("visit", formData, fields);
  if (limited) return limited;
  try {
    await db.contactEnquiry.create({
      data: {
        type: "VISIT",
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: "Planning a visit",
        message: data.message ?? "",
        visitDate: data.visitDate,
        partySize: data.partySize,
      },
    });
  } catch {
    console.error("[visit] failed to store enquiry");
    return { status: "error", message: GENERIC_ERROR, values: echoValues(formData, fields) };
  }
  await notifyStaff("New visit planned", "Someone is planning to visit", [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone ?? "Not given"],
    ["Planned date", data.visitDate ? data.visitDate.toISOString().slice(0, 10) : "Not specified"],
    ["Party size", String(data.partySize)],
    ["Message", data.message ?? "None"],
  ]);
  return { status: "success", message: `Wonderful, ${data.name.split(" ")[0]}! We have your details and look forward to welcoming you.` };
}

// ─── Prayer requests (private) ──────────────────────────────────────────

export async function submitPrayer(_previous: FormState, formData: FormData): Promise<FormState> {
  const blocked = guard(formData, "prayer");
  if (blocked) return blocked;

  const fields = ["name", "contact", "request"];
  const parsed = prayerSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, fields) };
  }
  const data = parsed.data;
  const limited = await rateLimited("prayer", formData, fields);
  if (limited) return limited;
  try {
    await db.prayerRequest.create({
      data: { anonymous: data.anonymous, name: data.name, contact: data.contact, request: data.request, consent: data.consent },
    });
  } catch {
    // Never log the request itself.
    console.error("[prayer] failed to store request");
    return { status: "error", message: GENERIC_ERROR, values: echoValues(formData, fields) };
  }
  // The notification deliberately contains no prayer content or personal details.
  await notifyStaff("New prayer request", "A new prayer request has been received", [["Next step", "Sign in to the dashboard to read it privately."]]);
  return { status: "success", message: "Thank you for trusting us with your request. Our prayer team will be praying for you." };
}

// ─── Event registration ─────────────────────────────────────────────────

class RegistrationError extends Error {}

export async function registerForEvent(_previous: FormState, formData: FormData): Promise<FormState> {
  const blocked = guard(formData, "registration");
  if (blocked) return blocked;

  const fields = ["name", "email", "phone", "attendees", "notes"];
  const parsed = registrationSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, fields) };
  }
  const data = parsed.data;
  const limited = await rateLimited("registration", formData, fields);
  if (limited) return limited;

  try {
    const event = await db.$transaction(async (tx) => {
      // Lock the event row so concurrent registrations cannot overbook capacity.
      await tx.$queryRaw`SELECT "id" FROM "Event" WHERE "id" = ${data.eventId} FOR UPDATE`;
      const event = await tx.event.findUnique({ where: { id: data.eventId } });
      const now = new Date();
      if (!event || event.status !== "PUBLISHED" || !event.registrationEnabled || event.externalRegistrationUrl) {
        throw new RegistrationError("Registration is not available for this event.");
      }
      if ((event.endsAt ?? event.startsAt) < now) throw new RegistrationError("This event has already taken place.");
      if (event.registrationDeadline && event.registrationDeadline < now) throw new RegistrationError("The registration deadline has passed.");
      if (event.registrationCapacity !== null) {
        const booked = await tx.eventRegistration.aggregate({ where: { eventId: event.id }, _sum: { attendees: true } });
        const remaining = event.registrationCapacity - (booked._sum.attendees ?? 0);
        if (remaining < data.attendees) {
          throw new RegistrationError(remaining > 0 ? `Only ${remaining} ${remaining === 1 ? "place remains" : "places remain"}.` : "This event is now fully booked.");
        }
      }
      await tx.eventRegistration.create({
        data: { eventId: event.id, name: data.name, email: data.email, phone: data.phone, attendees: data.attendees, notes: data.notes },
      });
      return event;
    });

    const settings = await getSiteSettings();
    const when = formatEventWindow(event.startsAt, event.endsAt);
    await sendEmail({
      to: data.email,
      subject: `You're registered: ${event.title}`,
      html: emailLayout(
        settings.ministryName,
        "You're registered",
        `<p>Dear ${escapeHtml(data.name)},</p><p>Thank you for registering for <strong>${escapeHtml(event.title)}</strong>.</p><p>${escapeHtml(when)}${event.venue ? `<br>${escapeHtml(event.venue)}` : ""}</p><p><a href="${absoluteUrl(`/events/${event.slug}`)}">View event details</a></p>`,
      ),
      text: `Dear ${data.name},\n\nThank you for registering for ${event.title}.\n${when}${event.venue ? `\n${event.venue}` : ""}\n\n${absoluteUrl(`/events/${event.slug}`)}`,
    });
    return { status: "success", message: `You're registered for ${event.title}. We look forward to seeing you!` };
  } catch (error) {
    if (error instanceof RegistrationError) return { status: "error", message: error.message, values: echoValues(formData, fields) };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "This email address is already registered for this event.", values: echoValues(formData, fields) };
    }
    console.error("[registration] failed to register");
    return { status: "error", message: GENERIC_ERROR, values: echoValues(formData, fields) };
  }
}

// ─── Newsletter (double opt-in) ─────────────────────────────────────────

export async function subscribeNewsletter(_previous: FormState, formData: FormData): Promise<FormState> {
  const blocked = guard(formData, "newsletter");
  if (blocked) return blocked;

  const settings = await getSiteSettings();
  if (!settings.newsletterEnabled || !isEmailConfigured()) {
    return { status: "error", message: "Email updates are not available yet." };
  }
  const parsed = newsletterSchema.safeParse(entries(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: echoValues(formData, ["email"]) };
  }
  const { email } = parsed.data;
  const limited = await rateLimited("newsletter", formData, ["email"]);
  if (limited) return limited;
  // The same reply is returned whether or not the address is already subscribed (no enumeration).
  const reply: FormState = { status: "success", message: "Please check your inbox and confirm your subscription." };

  try {
    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.status === "ACTIVE") return reply;

    const token = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      update: { status: "PENDING", confirmTokenHash: tokenHash, consentText: NEWSLETTER_CONSENT_TEXT, consentAt: new Date(), unsubscribedAt: null },
      create: {
        email,
        status: "PENDING",
        confirmTokenHash: tokenHash,
        consentText: NEWSLETTER_CONSENT_TEXT,
        consentAt: new Date(),
        unsubscribeToken: randomBytes(24).toString("base64url"),
      },
    });
    const confirmUrl = absoluteUrl(`/newsletter/confirm?token=${token}`);
    const result = await sendEmail({
      to: subscriber.email,
      subject: `Confirm your subscription to ${settings.ministryName}`,
      html: emailLayout(
        settings.ministryName,
        "Please confirm your subscription",
        `<p>Thank you for your interest in updates from ${escapeHtml(settings.ministryName)}.</p><p><a href="${confirmUrl}" style="display:inline-block;background:#101b2d;color:#f8f5ef;padding:12px 20px;text-decoration:none">Confirm subscription</a></p><p style="color:#5b6270;font-size:13px">If you did not request this, you can ignore this email and you will not be subscribed.</p>`,
      ),
      text: `Confirm your subscription: ${confirmUrl}\n\nIf you did not request this, ignore this email.`,
    });
    if (result.status !== "sent") return { status: "error", message: "We could not send the confirmation email. Please try again later." };
    return reply;
  } catch {
    console.error("[newsletter] subscription failed");
    return { status: "error", message: GENERIC_ERROR };
  }
}
