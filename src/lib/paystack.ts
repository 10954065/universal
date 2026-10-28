import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { evaluateVerification, type ProviderTransaction } from "@/lib/donation-rules";

/*
 * Paystack integration (https://paystack.com/docs/api/transaction/).
 * - The secret key stays on the server; the browser only ever receives Paystack's hosted checkout URL.
 * - A donation is marked successful ONLY after a server-to-server verification
 *   (callback page or signed webhook) confirms reference, amount and currency.
 */

const API = "https://api.paystack.co";

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_"));
}

/** Online giving is available only when the ministry has switched it on AND keys are configured. */
export function isOnlineGivingAvailable(enabledInSettings: boolean): boolean {
  return enabledInSettings && isPaystackConfigured();
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

async function paystack<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json", ...init?.headers },
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!response.ok || !body?.status || !body.data) {
    throw new Error(`Paystack ${path.split("/")[1]} failed (${response.status}): ${body?.message ?? "no message"}`);
  }
  return body.data;
}

export async function initializeTransaction(input: {
  email: string;
  amountMinor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  category?: string;
}): Promise<{ authorizationUrl: string }> {
  const data = await paystack<{ authorization_url: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      channels: ["card", "mobile_money", "bank_transfer"],
      metadata: { category: input.category ?? "General" },
    }),
  });
  const url = new URL(data.authorization_url);
  if (url.protocol !== "https:" || !url.hostname.endsWith("paystack.com")) throw new Error("Unexpected checkout URL");
  return { authorizationUrl: url.toString() };
}

interface PaystackTransaction {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
}

export async function verifyTransaction(reference: string): Promise<PaystackTransaction> {
  return paystack<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Verifies the `x-paystack-signature` header (HMAC-SHA512 of the raw body with the secret key). */
export function isValidWebhookSignature(rawBody: string, signature: string | null, key = process.env.PAYSTACK_SECRET_KEY): boolean {
  if (!signature || !key) return false;
  const expected = Buffer.from(createHmac("sha512", key).update(rawBody).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/**
 * Applies a provider-verified transaction to the stored donation and records an
 * audit entry. Idempotent: replays of the same webhook or callback are harmless.
 */
export async function applyVerifiedTransaction(txn: PaystackTransaction, source: "VERIFIED" | "WEBHOOK") {
  const donation = await db.donation.findUnique({ where: { reference: txn.reference } });
  if (!donation) return null;

  const provider: ProviderTransaction = { status: txn.status, reference: txn.reference, amount: txn.amount, currency: txn.currency };
  const { status, problem } = evaluateVerification(donation, provider);

  return db.$transaction(async (tx) => {
    await tx.donationTransaction.create({
      data: {
        donationId: donation.id,
        kind: problem ? "VERIFICATION_FAILED" : source,
        status: txn.status,
        amountMinor: txn.amount,
        message: problem ?? null,
      },
    });
    if (status === donation.status) return donation;
    return tx.donation.update({
      where: { id: donation.id },
      data: {
        status,
        providerTxnId: String(txn.id),
        channel: txn.channel ?? null,
        verifiedAt: new Date(),
        ...(status === "SUCCESS" ? { paidAt: txn.paid_at ? new Date(txn.paid_at) : new Date() } : {}),
      },
    });
  });
}
