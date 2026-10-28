import { applyVerifiedTransaction, isValidWebhookSignature, verifyTransaction } from "@/lib/paystack";

/**
 * Paystack webhook. The signature is verified against the raw body, and the
 * transaction is then re-verified with Paystack's API before any status change —
 * the webhook payload alone is never trusted.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!isValidWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const reference = event.data?.reference;
  if (typeof reference !== "string" || !/^UTM-[A-Z0-9-]{4,40}$/.test(reference)) {
    // Not one of ours — acknowledge so Paystack stops retrying.
    return new Response("Ignored", { status: 200 });
  }

  if (event.event === "charge.success" || event.event === "charge.failed") {
    try {
      const txn = await verifyTransaction(reference);
      await applyVerifiedTransaction(txn, "WEBHOOK");
    } catch (error) {
      console.error("[paystack-webhook] verification failed:", error instanceof Error ? error.message : "unknown");
      // 500 makes Paystack retry later.
      return new Response("Verification failed", { status: 500 });
    }
  }
  return new Response("OK", { status: 200 });
}
