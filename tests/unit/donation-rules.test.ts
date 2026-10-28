import { describe, expect, it } from "vitest";
import { createDonationReference, evaluateVerification, parseAmountToMinor, type StoredDonation } from "@/lib/donation-rules";

describe("parseAmountToMinor", () => {
  it.each([
    ["50", 5000],
    ["50.5", 5050],
    ["50.05", 5005],
    ["1,250.00", 125000],
    [" 12.34 ", 1234],
    ["0.29", 29],
    ["0.07", 7],
  ])("parses %j as %i pesewas", (input, expected) => {
    expect(parseAmountToMinor(input)).toBe(expected);
  });

  it.each(["", "abc", "-5", "1.234", "1e3", "12.", ".5", "5 000", "10000000000"])("rejects %j", (input) => {
    expect(parseAmountToMinor(input)).toBeNull();
  });
});

describe("evaluateVerification", () => {
  const pending: StoredDonation = { reference: "UTM-1-ABC", amountMinor: 5000, currency: "GHS", status: "PENDING" };
  const paid = { status: "success", reference: "UTM-1-ABC", amount: 5000, currency: "GHS" };

  it("accepts a payment whose reference, amount and currency all match", () => {
    expect(evaluateVerification(pending, paid)).toEqual({ status: "SUCCESS" });
  });

  it("treats currency case-insensitively", () => {
    expect(evaluateVerification(pending, { ...paid, currency: "ghs" }).status).toBe("SUCCESS");
  });

  it("fails a payment for a different amount", () => {
    const result = evaluateVerification(pending, { ...paid, amount: 100 });
    expect(result.status).toBe("FAILED");
    expect(result.problem).toMatch(/Amount mismatch/);
  });

  it("fails a payment in a different currency", () => {
    expect(evaluateVerification(pending, { ...paid, currency: "NGN" })).toEqual({ status: "FAILED", problem: "Currency mismatch" });
  });

  it("ignores a transaction for a different reference", () => {
    expect(evaluateVerification(pending, { ...paid, reference: "UTM-OTHER" })).toEqual({ status: "PENDING", problem: "Reference mismatch" });
  });

  it.each([
    ["failed", "FAILED"],
    ["reversed", "FAILED"],
    ["abandoned", "ABANDONED"],
    ["ongoing", "PENDING"],
  ])("maps provider status %s to %s", (status, expected) => {
    expect(evaluateVerification(pending, { ...paid, status }).status).toBe(expected);
  });

  it("never downgrades a successful donation", () => {
    expect(evaluateVerification({ ...pending, status: "SUCCESS" }, { ...paid, status: "failed" })).toEqual({ status: "SUCCESS" });
  });
});

describe("createDonationReference", () => {
  it("builds a URL-safe reference from time and randomness", () => {
    expect(createDonationReference("ab-c_d!e", 0)).toBe("UTM-0-ABCDE");
    expect(createDonationReference("abcdefghijklmnop", 1_700_000_000_000)).toMatch(/^UTM-[0-9A-Z]+-ABCDEFGHIJ$/);
  });
});
