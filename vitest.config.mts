import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { TEST_DATABASE_URL } from "./tests/support/test-database";

const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

// Integration tests run against a separate database. The global setup refuses
// to run unless the database name ends in "_test", so dev/production data is safe.

export default defineConfig({
  resolve: {
    alias: {
      "@": path("./src"),
      // `server-only` throws outside a React Server Components bundle; tests run plain Node.
      "server-only": path("./tests/support/server-only.ts"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          environment: "node",
          env: {
            BETTER_AUTH_SECRET: "unit-test-secret-that-is-long-enough",
            // Some modules construct the Prisma client on import. It never connects in unit tests.
            DATABASE_URL: "postgresql://unit:unit@127.0.0.1:1/unit_test",
          },
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          environment: "node",
          globalSetup: ["tests/integration/global-setup.ts"],
          // Tests share one database, so files run one at a time.
          fileParallelism: false,
          testTimeout: 20_000,
          hookTimeout: 60_000,
          env: {
            DATABASE_URL: TEST_DATABASE_URL,
            BETTER_AUTH_SECRET: "integration-test-secret-long-enough",
            NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
            RESEND_API_KEY: "",
            EMAIL_FROM: "",
          },
        },
      },
    ],
  },
});
