import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import pg from "pg";
import { assertTestDatabase, TEST_DATABASE_URL } from "../support/test-database";

export const E2E_ADMIN_EMAIL = "e2e.admin@example.org";

/**
 * Prepares the *_test database: migrations, seed (with sample content), a clean
 * rate-limit table, and a Super Administrator whose password is random per run.
 */
export default async function globalSetup() {
  assertTestDatabase(TEST_DATABASE_URL);
  const run = (command: string, extra: Record<string, string> = {}) =>
    execSync(command, { stdio: "pipe", env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL, ...extra } });

  run("npx prisma migrate deploy");
  run("npx tsx prisma/seed.ts", { SEED_SAMPLE_CONTENT: "true" });

  // Fresh form and sign-in rate limits for every run.
  const client = new pg.Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  try {
    await client.query("TRUNCATE rate_limit");
  } finally {
    await client.end();
  }

  const password = randomBytes(18).toString("base64url");
  run(`npx tsx scripts/create-admin.ts ${E2E_ADMIN_EMAIL} "E2E Administrator" SUPER_ADMIN`, { ADMIN_PASSWORD: password });
  // Test workers start after global setup and inherit this variable.
  process.env.E2E_ADMIN_PASSWORD = password;
}
