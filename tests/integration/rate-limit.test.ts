import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { consumeRateLimit } from "@/lib/rate-limit";
import { resetDatabase } from "./reset";

const RULE = { limit: 3, windowSeconds: 3600 };

describe("consumeRateLimit (Postgres)", () => {
  beforeEach(resetDatabase);
  afterAll(() => db.$disconnect());

  it("allows requests up to the limit, then blocks", async () => {
    const results = [];
    for (let i = 0; i < 5; i++) results.push(await consumeRateLimit("contact", RULE, "visitor-a"));
    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false, false]);
    expect(results[0]?.remaining).toBe(2);
  });

  it("counts concurrent requests exactly once each", async () => {
    const results = await Promise.all(Array.from({ length: 12 }, () => consumeRateLimit("contact", RULE, "burst")));
    expect(results.filter((r) => r.allowed)).toHaveLength(RULE.limit);
    const row = await db.rateLimit.findUnique({ where: { key: "form:contact:burst" } });
    expect(row?.count).toBe(12);
  });

  it("keeps separate counters per form and per visitor", async () => {
    for (let i = 0; i < 3; i++) await consumeRateLimit("contact", RULE, "visitor-a");
    expect((await consumeRateLimit("prayer", RULE, "visitor-a")).allowed).toBe(true);
    expect((await consumeRateLimit("contact", RULE, "visitor-b")).allowed).toBe(true);
  });

  it("starts a fresh window once the previous one has passed", async () => {
    for (let i = 0; i < 4; i++) await consumeRateLimit("contact", RULE, "visitor-a");
    await db.rateLimit.update({ where: { key: "form:contact:visitor-a" }, data: { lastRequest: BigInt(Date.now() - 2 * 3_600_000) } });
    expect(await consumeRateLimit("contact", RULE, "visitor-a")).toEqual({ allowed: true, remaining: 2 });
  });
});
