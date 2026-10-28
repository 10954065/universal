import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { applyVerifiedTransaction } from "@/lib/paystack";
import { resetDatabase } from "./reset";

type Transaction = Parameters<typeof applyVerifiedTransaction>[0];

const REFERENCE = "UTM-TEST-0001";
const paid: Transaction = { id: 987654, status: "success", reference: REFERENCE, amount: 5000, currency: "GHS", channel: "mobile_money", paid_at: "2026-11-01T10:00:00.000Z" };

async function createPendingDonation() {
  return db.donation.create({ data: { reference: REFERENCE, amountMinor: 5000, currency: "GHS", donorEmail: "donor@example.org" } });
}

describe("applyVerifiedTransaction", () => {
  beforeEach(resetDatabase);
  afterAll(() => db.$disconnect());

  it("marks a matching payment as successful and records the verification", async () => {
    await createPendingDonation();
    const updated = await applyVerifiedTransaction(paid, "VERIFIED");
    expect(updated).toMatchObject({ status: "SUCCESS", channel: "mobile_money", providerTxnId: "987654" });
    expect(updated?.paidAt?.toISOString()).toBe("2026-11-01T10:00:00.000Z");
    const log = await db.donationTransaction.findMany();
    expect(log).toHaveLength(1);
    expect(log[0]).toMatchObject({ kind: "VERIFIED", status: "success", amountMinor: 5000, message: null });
  });

  it("fails a payment whose amount does not match and records why", async () => {
    await createPendingDonation();
    const updated = await applyVerifiedTransaction({ ...paid, amount: 100 }, "WEBHOOK");
    expect(updated?.status).toBe("FAILED");
    const [entry] = await db.donationTransaction.findMany();
    expect(entry?.kind).toBe("VERIFICATION_FAILED");
    expect(entry?.message).toMatch(/Amount mismatch/);
  });

  it("is idempotent when the webhook and the callback both arrive", async () => {
    await createPendingDonation();
    await applyVerifiedTransaction(paid, "VERIFIED");
    await applyVerifiedTransaction(paid, "WEBHOOK");
    const donation = await db.donation.findUniqueOrThrow({ where: { reference: REFERENCE } });
    expect(donation.status).toBe("SUCCESS");
    expect(await db.donationTransaction.count()).toBe(2);
  });

  it("never downgrades a successful donation", async () => {
    await createPendingDonation();
    await applyVerifiedTransaction(paid, "VERIFIED");
    await applyVerifiedTransaction({ ...paid, status: "failed" }, "WEBHOOK");
    expect((await db.donation.findUniqueOrThrow({ where: { reference: REFERENCE } })).status).toBe("SUCCESS");
  });

  it("ignores references this server never created", async () => {
    expect(await applyVerifiedTransaction({ ...paid, reference: "UTM-UNKNOWN" }, "WEBHOOK")).toBeNull();
    expect(await db.donationTransaction.count()).toBe(0);
  });
});
