import { afterEach, describe, expect, it, vi } from "vitest";
import { createFormToken, HONEYPOT_FIELD, isSpam, TOKEN_FIELD, verifyFormToken } from "@/lib/spam";

const T0 = 1_800_000_000_000;

describe("verifyFormToken", () => {
  it("accepts a token submitted after a human-plausible delay", () => {
    expect(verifyFormToken(createFormToken("contact", T0), "contact", T0 + 10_000)).toBe("ok");
  });

  it("rejects submissions faster than a person can type", () => {
    expect(verifyFormToken(createFormToken("contact", T0), "contact", T0 + 1_000)).toBe("too-fast");
  });

  it("rejects tokens older than six hours", () => {
    expect(verifyFormToken(createFormToken("contact", T0), "contact", T0 + 7 * 3_600_000)).toBe("expired");
  });

  it("rejects a token issued for a different form", () => {
    expect(verifyFormToken(createFormToken("prayer", T0), "contact", T0 + 10_000)).toBe("invalid");
  });

  it("rejects a token whose timestamp was altered", () => {
    const [id, , signature] = createFormToken("contact", T0).split(".");
    expect(verifyFormToken(`${id}.${T0 - 60_000}.${signature}`, "contact", T0 + 10_000)).toBe("invalid");
  });

  it.each([undefined, null, 42, "", "a.b", "contact.123.sig.extra"])("rejects malformed token %j", (token) => {
    expect(verifyFormToken(token, "contact", T0)).toBe("invalid");
  });
});

describe("isSpam", () => {
  afterEach(() => vi.useRealTimers());

  function form(fields: Record<string, string>) {
    const data = new FormData();
    for (const [key, value] of Object.entries(fields)) data.set(key, value);
    return data;
  }

  it("lets a real visitor through", () => {
    vi.useFakeTimers({ now: T0 + 30_000 });
    expect(isSpam(form({ [TOKEN_FIELD]: createFormToken("contact", T0) }), "contact")).toEqual({ spam: false });
  });

  it("flags a filled honeypot even when the token is valid", () => {
    vi.useFakeTimers({ now: T0 + 30_000 });
    const data = form({ [TOKEN_FIELD]: createFormToken("contact", T0), [HONEYPOT_FIELD]: "https://spam.example" });
    expect(isSpam(data, "contact")).toEqual({ spam: true, reason: "honeypot" });
  });

  it("flags a submission without a token", () => {
    expect(isSpam(form({}), "contact")).toEqual({ spam: true, reason: "invalid" });
  });
});
