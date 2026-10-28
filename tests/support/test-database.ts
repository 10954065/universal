/**
 * The database used by the integration and end-to-end suites. It defaults to the
 * `utm_test` database created by docker-compose (scripts/docker-init.sql).
 */
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://utm:utm_local_dev_only@localhost:5447/utm_test";

/** Throws unless the URL points at a database whose name ends in "_test". */
export function assertTestDatabase(url: string): void {
  const name = new URL(url).pathname.slice(1);
  if (!name.endsWith("_test")) {
    throw new Error(`Refusing to run tests against "${name}". Test databases must be named *_test.`);
  }
}
