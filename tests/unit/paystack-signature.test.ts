import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidWebhookSignature } from "@/lib/paystack";

const KEY = "sk_test_unit_only";
const BODY = JSON.stringify({ event: "charge.success", data: { reference: "UTM-1-ABC", amount: 5000 } });
const sign = (body: string, key = KEY) => createHmac("sha512", key).update(body).digest("hex");

describe("isValidWebhookSignature", () => {
  it("accepts Paystack's HMAC-SHA512 signature of the raw body", () => {
    expect(isValidWebhookSignature(BODY, sign(BODY), KEY)).toBe(true);
  });

  it("rejects a signature made with a different key", () => {
    expect(isValidWebhookSignature(BODY, sign(BODY, "sk_test_attacker"), KEY)).toBe(false);
  });

  it("rejects a body that was changed after signing", () => {
    expect(isValidWebhookSignature(BODY.replace("5000", "500000"), sign(BODY), KEY)).toBe(false);
  });

  it("rejects missing signatures, missing keys and malformed values", () => {
    expect(isValidWebhookSignature(BODY, null, KEY)).toBe(false);
    expect(isValidWebhookSignature(BODY, sign(BODY), "")).toBe(false);
    expect(isValidWebhookSignature(BODY, "abc", KEY)).toBe(false);
  });
});
