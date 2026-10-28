import { execSync } from "node:child_process";
import { assertTestDatabase, TEST_DATABASE_URL } from "../support/test-database";

/** Applies migrations to the test database once before the integration suite runs. */
export default function setup() {
  assertTestDatabase(TEST_DATABASE_URL);
  execSync("npx prisma migrate deploy", { stdio: "pipe", env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL } });
}
