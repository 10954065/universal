import { z } from "zod";

/*
 * Shared validation for every public form. The server always re-validates with
 * these schemas; client hints (required, maxLength) are a convenience only.
 */

const trimmed = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const optionalText = (max: number) =>
  trimmed(max)
    .optional()
    .transform((value) => (value ? value : undefined));

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "That email address is too long.")
  .pipe(z.email("Please enter a valid email address."));

const phoneField = trimmed(30)
  .optional()
  .transform((value) => (value ? value : undefined))
  .refine((value) => value === undefined || /^[+\d][\d\s()-]{6,}$/.test(value), "Please enter a valid phone number.");

const nameField = trimmed(120).min(2, "Please tell us your name.");
const checkbox = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const contactSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  subject: optionalText(150),
  message: trimmed(5000).min(10, "Please write a little more so we can help."),
});

export const visitSchema = z.object({
  name: nameField,
  email: emailField,
  phone: phoneField,
  visitDate: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => value === undefined || /^\d{4}-\d{2}-\d{2}$/.test(value), "Please choose a valid date.")
    .transform((value) => (value ? new Date(`${value}T00:00:00Z`) : undefined))
    .refine((value) => value === undefined || value.getTime() >= Date.now() - 86_400_000, "Please choose a date in the future."),
  partySize: z.coerce.number().int().min(1, "At least one person.").max(50, "For groups larger than 50, please contact us.").default(1),
  message: optionalText(2000),
});

export const prayerSchema = z
  .object({
    anonymous: checkbox,
    name: optionalText(120),
    contact: optionalText(254),
    request: trimmed(4000).min(5, "Please share your prayer request."),
    consent: checkbox.refine((value) => value, "Please confirm you understand how your request will be handled."),
  })
  // Anonymous requests never keep identifying details, even if typed before ticking the box.
  .transform((data) => (data.anonymous ? { ...data, name: undefined, contact: undefined } : data));

export const registrationSchema = z.object({
  eventId: z.string().trim().min(1).max(40),
  name: nameField,
  email: emailField,
  phone: phoneField,
  attendees: z.coerce.number().int().min(1, "At least one person.").max(20, "For groups larger than 20, please contact us.").default(1),
  notes: optionalText(1000),
});

export const NEWSLETTER_CONSENT_TEXT =
  "I would like to receive ministry news, devotionals and programme announcements by email. I can unsubscribe at any time.";

export const newsletterSchema = z.object({
  email: emailField,
  consent: checkbox.refine((value) => value, "Please confirm you would like to receive updates."),
});

export type FieldErrors = Record<string, string[] | undefined>;

/** Flattens Zod issues into `{ field: [messages] }` for form display. */
export function fieldErrorsOf(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] = [...(errors[key] ?? []), issue.message];
  }
  return errors;
}
