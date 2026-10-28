import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Lightweight, privacy-friendly spam protection (no third-party CAPTCHA):
 * 1. A honeypot field that real visitors never see or fill in.
 * 2. A signed timestamp token: submissions faster than a human could type,
 *    or replayed hours later, are rejected.
 */

export const HONEYPOT_FIELD = "website";
export const TOKEN_FIELD = "formToken";
const MIN_FILL_MS = 2500;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.BETTER_AUTH_SECRET;
  if (!value || value.length < 16) throw new Error("BETTER_AUTH_SECRET must be set (32+ random characters).");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(`form-token:${payload}`).digest("base64url");
}

export function createFormToken(formId: string, now = Date.now()): string {
  const payload = `${formId}.${now}`;
  return `${payload}.${sign(payload)}`;
}

export type TokenCheck = "ok" | "invalid" | "too-fast" | "expired";

export function verifyFormToken(token: unknown, formId: string, now = Date.now()): TokenCheck {
  if (typeof token !== "string") return "invalid";
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const [id, issued, signature] = parts as [string, string, string];
  if (id !== formId || !/^\d{10,16}$/.test(issued)) return "invalid";

  const expected = Buffer.from(sign(`${id}.${issued}`));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";

  const age = now - Number(issued);
  if (age < MIN_FILL_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

/** True when the submission looks automated. */
export function isSpam(formData: FormData, formId: string): { spam: boolean; reason?: TokenCheck | "honeypot" } {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { spam: true, reason: "honeypot" };
  const check = verifyFormToken(formData.get(TOKEN_FIELD), formId);
  return check === "ok" ? { spam: false } : { spam: true, reason: check };
}
