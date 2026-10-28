/**
 * Creates (or promotes) a staff account from the command line.
 *
 *   npm run admin:create -- --email pastor@example.org --name "Full Name" [--role SUPER_ADMIN]
 *
 * The password is read from the ADMIN_PASSWORD environment variable if set;
 * otherwise a strong random password is generated and printed ONCE.
 * No password is ever hard-coded or stored in plain text.
 */
import "dotenv/config";
import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const ROLES = ["SUPER_ADMIN", "CONTENT_ADMIN", "MINISTRY_STAFF"] as const;
type Role = (typeof ROLES)[number];

async function main() {
  const { values } = parseArgs({
    options: { email: { type: "string" }, name: { type: "string" }, role: { type: "string", default: "SUPER_ADMIN" } },
  });
  const email = values.email?.trim().toLowerCase();
  const name = values.name?.trim();
  const role = values.role as Role;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Provide a valid --email");
  if (!name) throw new Error('Provide --name "Full Name"');
  if (!ROLES.includes(role)) throw new Error(`--role must be one of ${ROLES.join(", ")}`);

  const supplied = process.env.ADMIN_PASSWORD;
  if (supplied && supplied.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  const password = supplied ?? randomBytes(15).toString("base64url");

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  try {
    const hash = await hashPassword(password);
    const existing = await db.user.findUnique({ where: { email } });
    const user =
      existing ??
      (await db.user.create({ data: { id: randomBytes(16).toString("hex"), email, name, role, emailVerified: true, active: true } }));

    if (existing) await db.user.update({ where: { id: user.id }, data: { role, active: true, name } });

    const account = await db.account.findFirst({ where: { userId: user.id, providerId: "credential" } });
    if (account) {
      await db.account.update({ where: { id: account.id }, data: { password: hash } });
    } else {
      await db.account.create({ data: { id: randomBytes(16).toString("hex"), userId: user.id, accountId: user.id, providerId: "credential", password: hash } });
    }
    await db.auditLog.create({ data: { action: existing ? "user.promoted" : "user.created", entity: "User", entityId: user.id, summary: `CLI: ${email} as ${role}` } });

    console.info(`\n${existing ? "Updated" : "Created"} ${role} account for ${email}.`);
    if (!supplied) {
      console.info(`Temporary password (shown once — store it securely and change it after signing in):\n\n  ${password}\n`);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
