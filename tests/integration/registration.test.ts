import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";
import { initialFormState } from "@/lib/form-state";
import { createFormToken, HONEYPOT_FIELD, TOKEN_FIELD } from "@/lib/spam";
import { registerForEvent } from "@/server/public-actions";
import { resetDatabase } from "./reset";

// Each call looks like a different visitor so the per-visitor rate limit does not interfere.
let visitor = 0;
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": `10.0.${Math.floor(visitor / 250)}.${visitor++ % 250}` }),
}));

const DAY = 86_400_000;

async function createEvent(overrides: Partial<Parameters<typeof db.event.create>[0]["data"]> = {}) {
  return db.event.create({
    data: {
      slug: "youth-camp",
      title: "Youth Camp",
      summary: "A weekend away.",
      startsAt: new Date(Date.now() + 7 * DAY),
      status: "PUBLISHED",
      registrationEnabled: true,
      registrationCapacity: 3,
      ...overrides,
    },
  });
}

function registration(eventId: string, email: string, extra: Record<string, string> = {}) {
  const form = new FormData();
  const fields = { eventId, name: "Ama Mensah", email, attendees: "1", [TOKEN_FIELD]: createFormToken("registration", Date.now() - 10_000), ...extra };
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return form;
}

describe("registerForEvent", () => {
  beforeEach(resetDatabase);
  afterAll(() => db.$disconnect());

  it("registers a visitor for a published event", async () => {
    const event = await createEvent();
    const result = await registerForEvent(initialFormState, registration(event.id, "ama@example.org"));
    expect(result.status).toBe("success");
    expect(await db.eventRegistration.count({ where: { eventId: event.id } })).toBe(1);
  });

  it("never overbooks when many people register at the same moment", async () => {
    const event = await createEvent({ registrationCapacity: 3 });
    const results = await Promise.all(Array.from({ length: 8 }, (_, i) => registerForEvent(initialFormState, registration(event.id, `person${i}@example.org`))));
    expect(results.filter((r) => r.status === "success")).toHaveLength(3);
    expect(results.filter((r) => r.status === "error").every((r) => r.message === "This event is now fully booked.")).toBe(true);
    const booked = await db.eventRegistration.aggregate({ where: { eventId: event.id }, _sum: { attendees: true } });
    expect(booked._sum.attendees).toBe(3);
  });

  it("tells a group when only some places remain", async () => {
    const event = await createEvent({ registrationCapacity: 3 });
    await registerForEvent(initialFormState, registration(event.id, "first@example.org", { attendees: "2" }));
    const result = await registerForEvent(initialFormState, registration(event.id, "group@example.org", { attendees: "2" }));
    expect(result).toMatchObject({ status: "error", message: "Only 1 place remains." });
  });

  it("rejects a second registration with the same email", async () => {
    const event = await createEvent();
    await registerForEvent(initialFormState, registration(event.id, "ama@example.org"));
    const result = await registerForEvent(initialFormState, registration(event.id, "AMA@example.org"));
    expect(result.message).toBe("This email address is already registered for this event.");
  });

  it("refuses draft events, past events and passed deadlines", async () => {
    const draft = await createEvent({ slug: "draft", status: "DRAFT" });
    const past = await createEvent({ slug: "past", startsAt: new Date(Date.now() - DAY) });
    const closed = await createEvent({ slug: "closed", registrationDeadline: new Date(Date.now() - 60_000) });
    expect((await registerForEvent(initialFormState, registration(draft.id, "a@example.org"))).message).toBe("Registration is not available for this event.");
    expect((await registerForEvent(initialFormState, registration(past.id, "a@example.org"))).message).toBe("This event has already taken place.");
    expect((await registerForEvent(initialFormState, registration(closed.id, "a@example.org"))).message).toBe("The registration deadline has passed.");
    expect(await db.eventRegistration.count()).toBe(0);
  });

  it("silently drops bot submissions without storing anything", async () => {
    const event = await createEvent();
    const result = await registerForEvent(initialFormState, registration(event.id, "bot@example.org", { [HONEYPOT_FIELD]: "http://spam.example" }));
    expect(result.status).toBe("success");
    expect(await db.eventRegistration.count()).toBe(0);
  });
});
