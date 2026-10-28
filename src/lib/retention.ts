import "server-only";
import { db } from "@/lib/db";

const DAY_MS = 86_400_000;
const PENDING_SUBSCRIBER_DAYS = 30;

/**
 * Applies the retention policy:
 * - prayer requests older than the configured retention period are permanently deleted;
 * - newsletter sign-ups never confirmed within 30 days are deleted;
 * - expired rate-limit counters are cleared.
 */
export async function runRetention(now = new Date()) {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 }, select: { prayerRetentionDays: true } });
  const prayerDays = Math.max(1, settings?.prayerRetentionDays ?? 180);

  const [prayers, subscribers, rateLimits] = await Promise.all([
    db.prayerRequest.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - prayerDays * DAY_MS) } } }),
    db.newsletterSubscriber.deleteMany({ where: { status: "PENDING", createdAt: { lt: new Date(now.getTime() - PENDING_SUBSCRIBER_DAYS * DAY_MS) } } }),
    db.rateLimit.deleteMany({ where: { key: { startsWith: "form:" }, lastRequest: { lt: BigInt(now.getTime() - DAY_MS) } } }),
  ]);

  return { prayerRequestsDeleted: prayers.count, pendingSubscribersDeleted: subscribers.count, rateLimitsCleared: rateLimits.count };
}
