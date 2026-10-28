import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { runRetention } from "@/lib/retention";
import { resetDatabase } from "./reset";

const DAY = 86_400_000;
const NOW = new Date("2026-11-01T12:00:00Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * DAY);

function subscriber(email: string, status: "PENDING" | "ACTIVE", createdAt: Date) {
  return db.newsletterSubscriber.create({
    data: { email, status, createdAt, consentText: "consent", consentAt: createdAt, unsubscribeToken: `token-${email}` },
  });
}

describe("runRetention", () => {
  beforeEach(resetDatabase);
  afterAll(() => db.$disconnect());

  it("deletes prayer requests older than the configured retention period only", async () => {
    await db.siteSettings.create({ data: { id: 1, prayerRetentionDays: 30 } });
    await db.prayerRequest.createMany({
      data: [
        { request: "old", consent: true, createdAt: daysAgo(31) },
        { request: "recent", consent: true, createdAt: daysAgo(29) },
      ],
    });
    const result = await runRetention(NOW);
    expect(result.prayerRequestsDeleted).toBe(1);
    expect((await db.prayerRequest.findMany()).map((p) => p.request)).toEqual(["recent"]);
  });

  it("uses 180 days when no settings have been saved", async () => {
    await db.prayerRequest.createMany({
      data: [
        { request: "old", consent: true, createdAt: daysAgo(181) },
        { request: "kept", consent: true, createdAt: daysAgo(179) },
      ],
    });
    expect((await runRetention(NOW)).prayerRequestsDeleted).toBe(1);
  });

  it("removes unconfirmed sign-ups after 30 days but keeps confirmed subscribers", async () => {
    await subscriber("stale@example.org", "PENDING", daysAgo(31));
    await subscriber("fresh@example.org", "PENDING", daysAgo(2));
    await subscriber("active@example.org", "ACTIVE", daysAgo(400));
    expect((await runRetention(NOW)).pendingSubscribersDeleted).toBe(1);
    expect((await db.newsletterSubscriber.findMany({ orderBy: { email: "asc" } })).map((s) => s.email)).toEqual(["active@example.org", "fresh@example.org"]);
  });

  it("clears expired form rate-limit counters", async () => {
    await db.rateLimit.createMany({
      data: [
        { key: "form:contact:old", count: 3, lastRequest: BigInt(daysAgo(2).getTime()) },
        { key: "form:contact:new", count: 1, lastRequest: BigInt(NOW.getTime()) },
      ],
    });
    expect((await runRetention(NOW)).rateLimitsCleared).toBe(1);
  });
});
