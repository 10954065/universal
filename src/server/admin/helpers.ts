import "server-only";
import { z } from "zod";
import { ForbiddenError } from "@/lib/session";
import { fieldErrorsOf } from "@/lib/validation";
import type { FormState } from "@/lib/form-state";

/*
 * Shared parsing for admin server actions. Form fields arrive as strings; these
 * helpers turn empty strings into null and validate the rest.
 */

export const text = (max: number) => z.string().trim().max(max);
export const requiredText = (max: number, message = "This field is required.") => z.string().trim().min(1, message).max(max);
export const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : null));
export const nullableUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : null))
  .refine((value) => value === null || /^https:\/\/[^\s]+$/i.test(value), "Use a full https:// link.");
export const nullableHref = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => (value ? value : null))
  .refine((value) => value === null || /^(\/(?!\/)[^\s]*|https:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/i.test(value), "Use a site path like /events or a full https:// link.");
export const nullableEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .optional()
  .transform((value) => (value ? value : null))
  .refine((value) => value === null || z.email().safeParse(value).success, "Enter a valid email address.");
export const checkbox = z.preprocess((value) => value === "on" || value === "true", z.boolean());
export const publishStatus = z.enum(["DRAFT", "PUBLISHED"]);
export const nullableId = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((value) => (value ? value : null));
export const sortOrder = z.coerce.number().int().min(0).max(9999).catch(0);

/** Converts "2026-11-02T17:00" (ministry time, GMT) to a Date, or null when empty. */
export const nullableDateTime = z
  .string()
  .trim()
  .optional()
  .transform((value, context) => {
    if (!value) return null;
    const date = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? new Date(`${value}:00Z`) : null;
    if (!date || Number.isNaN(date.getTime())) {
      context.addIssue({ code: "custom", message: "Enter a valid date and time." });
      return z.NEVER;
    }
    return date;
  });

export type Parsed<T> = { ok: true; data: T } | { ok: false; state: FormState };

export function parseForm<T extends z.ZodType>(schema: T, formData: FormData): Parsed<z.infer<T>> {
  const result = schema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, state: { status: "error", message: "Please correct the highlighted fields.", fieldErrors: fieldErrorsOf(result.error) } };
}

/** Converts thrown errors into a safe form state (never leaks internals). */
export function failure(error: unknown, context: string): FormState {
  if (error instanceof ForbiddenError) return { status: "error", message: error.message };
  if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
    return { status: "error", message: "That value is already in use. Please choose another (for example a different web address)." };
  }
  console.error(`[admin] ${context} failed:`, error instanceof Error ? error.message : "unknown");
  return { status: "error", message: "The change could not be saved. Please try again." };
}

export const saved = (message = "Changes saved."): FormState => ({ status: "success", message });
