import { db } from "@/lib/db";
import { assertTestDatabase } from "../support/test-database";

const TABLES = ['"DonationTransaction"', '"Donation"', '"EventRegistration"', '"Event"', '"PrayerRequest"', '"NewsletterSubscriber"', '"rate_limit"', '"SiteSettings"'];

/** Empties every table the integration tests write to. Only ever runs against a *_test database. */
export async function resetDatabase() {
  assertTestDatabase(process.env.DATABASE_URL ?? "");
  await db.$executeRawUnsafe(`TRUNCATE ${TABLES.join(", ")} RESTART IDENTITY CASCADE`);
}
