import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrorsOf, newsletterSchema, prayerSchema, registrationSchema, visitSchema } from "@/lib/validation";

describe("contactSchema", () => {
  const valid = { name: "Ama Mensah", email: "  Ama@Example.ORG ", message: "I would like to know more about the youth ministry." };

  it("normalises email and drops empty optional fields", () => {
    const result = contactSchema.parse({ ...valid, phone: "", subject: "" });
    expect(result.email).toBe("ama@example.org");
    expect(result.phone).toBeUndefined();
    expect(result.subject).toBeUndefined();
  });

  it("reports each invalid field", () => {
    const result = contactSchema.safeParse({ name: "A", email: "not-an-email", phone: "abc", message: "hi" });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(fieldErrorsOf(result.error)).sort()).toEqual(["email", "message", "name", "phone"]);
  });

  it("enforces maximum lengths", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("prayerSchema", () => {
  it("removes name and contact when the request is anonymous", () => {
    const result = prayerSchema.parse({ anonymous: "on", name: "Kofi", contact: "kofi@example.org", request: "Please pray for my family.", consent: "on" });
    expect(result.name).toBeUndefined();
    expect(result.contact).toBeUndefined();
  });

  it("requires consent", () => {
    const result = prayerSchema.safeParse({ request: "Please pray for my family." });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrorsOf(result.error).consent).toBeDefined();
  });
});

describe("visitSchema", () => {
  it("rejects a visit date in the past", () => {
    expect(visitSchema.safeParse({ name: "Ama Mensah", email: "a@b.org", visitDate: "2020-01-05" }).success).toBe(false);
  });

  it("defaults the party size to one", () => {
    expect(visitSchema.parse({ name: "Ama Mensah", email: "a@b.org" }).partySize).toBe(1);
  });
});

describe("registrationSchema", () => {
  it("limits the number of attendees per registration", () => {
    const base = { eventId: "e1", name: "Ama Mensah", email: "a@b.org" };
    expect(registrationSchema.safeParse({ ...base, attendees: "0" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...base, attendees: "21" }).success).toBe(false);
    expect(registrationSchema.parse({ ...base, attendees: "3" }).attendees).toBe(3);
  });
});

describe("newsletterSchema", () => {
  it("requires explicit consent", () => {
    expect(newsletterSchema.safeParse({ email: "a@b.org" }).success).toBe(false);
    expect(newsletterSchema.parse({ email: "a@b.org", consent: "on" }).consent).toBe(true);
  });
});
