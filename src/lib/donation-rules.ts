/*
 * Pure donation rules (no I/O), unit tested in tests/unit/donation-rules.test.ts.
 */

export const MIN_DONATION_MINOR = 100; // GH₵ 1.00
export const MAX_DONATION_MINOR = 10_000_000; // GH₵ 100,000.00

/** Parses "50", "50.5" or "1,250.00" into pesewas without floating-point error. Returns null if invalid. */
export function parseAmountToMinor(input: string): number | null {
  const cleaned = input.trim().replace(/,/g, "");
  const match = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(2, "0"));
  return whole * 100 + fraction;
}

export type DonationOutcome = "SUCCESS" | "FAILED" | "ABANDONED" | "PENDING";

export interface ProviderTransaction {
  status: string;
  reference: string;
  amount: number;
  currency: string;
}

export interface StoredDonation {
  reference: string;
  amountMinor: number;
  currency: string;
  status: DonationOutcome;
}

/**
 * Decides the new donation status from a provider-verified transaction.
 * A payment is only accepted as successful when reference, amount and currency
 * all match what this server recorded when the donation was created.
 * A successful donation is never downgraded.
 */
export function evaluateVerification(stored: StoredDonation, txn: ProviderTransaction): { status: DonationOutcome; problem?: string } {
  if (stored.status === "SUCCESS") return { status: "SUCCESS" };
  if (txn.reference !== stored.reference) return { status: stored.status, problem: "Reference mismatch" };
  if (txn.status === "success") {
    if (txn.amount !== stored.amountMinor) return { status: "FAILED", problem: `Amount mismatch: expected ${stored.amountMinor}, received ${txn.amount}` };
    if (txn.currency.toUpperCase() !== stored.currency.toUpperCase()) return { status: "FAILED", problem: "Currency mismatch" };
    return { status: "SUCCESS" };
  }
  if (txn.status === "failed" || txn.status === "reversed") return { status: "FAILED" };
  if (txn.status === "abandoned") return { status: "ABANDONED" };
  return { status: "PENDING" };
}

/** Donation references: prefix + time + randomness, safe for URLs. */
export function createDonationReference(random: string, now = Date.now()): string {
  return `UTM-${now.toString(36).toUpperCase()}-${random.replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase()}`;
}
