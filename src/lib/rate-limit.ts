import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db";

/*
 * Postgres-backed fixed-window rate limiter. Works across serverless instances
 * (unlike in-memory counters). Clients are identified by a salted hash of their
 * IP address. Raw IP addresses are never stored.
 */

export interface RateLimitRule {
  /** Maximum requests per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  contact: { limit: 5, windowSeconds: 3600 },
  visit: { limit: 5, windowSeconds: 3600 },
  prayer: { limit: 5, windowSeconds: 3600 },
  registration: { limit: 10, windowSeconds: 3600 },
  newsletter: { limit: 5, windowSeconds: 3600 },
  donation: { limit: 10, windowSeconds: 3600 },
} satisfies Record<string, RateLimitRule>;

export async function clientFingerprint(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${process.env.BETTER_AUTH_SECRET ?? ""}:${ip}`)
    .digest("base64url")
    .slice(0, 32);
}

/**
 * Atomically counts a request against `bucket` and returns whether it is allowed.
 * A single upsert statement avoids race conditions between concurrent requests.
 */
export async function consumeRateLimit(bucket: string, rule: RateLimitRule, identity?: string): Promise<{ allowed: boolean; remaining: number }> {
  const who = identity ?? (await clientFingerprint());
  const key = `form:${bucket}:${who}`;
  const now = Date.now();
  const windowStart = now - rule.windowSeconds * 1000;

  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "rate_limit" ("id", "key", "count", "lastRequest")
    VALUES (${crypto.randomUUID()}, ${key}, 1, ${BigInt(now)})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "rate_limit"."lastRequest" < ${BigInt(windowStart)} THEN 1 ELSE "rate_limit"."count" + 1 END,
      "lastRequest" = CASE WHEN "rate_limit"."lastRequest" < ${BigInt(windowStart)} THEN ${BigInt(now)} ELSE "rate_limit"."lastRequest" END
    RETURNING "count"`;

  const count = Number(rows[0]?.count ?? rule.limit + 1);
  return { allowed: count <= rule.limit, remaining: Math.max(0, rule.limit - count) };
}
