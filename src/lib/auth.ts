import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

/*
 * Authentication: Better Auth with email + password, sessions stored in Postgres
 * (httpOnly, SameSite=Lax, Secure over HTTPS). Public sign-up is disabled —
 * accounts are created by `npm run admin:create` or by a Super Administrator.
 * Passwords are hashed with scrypt by Better Auth.
 */
export const auth = betterAuth({
  appName: "Universal Trinity Ministry",
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: { type: "string", input: false, defaultValue: "MINISTRY_STAFF" },
      active: { type: "boolean", input: false, defaultValue: true },
    },
  },
  session: {
    expiresIn: 60 * 60 * 12, // 12 hours
    updateAge: 60 * 60, // refresh at most hourly
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimit",
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 300, max: 5 },
      "/change-password": { window: 300, max: 5 },
    },
  },
  databaseHooks: {
    session: {
      create: {
        // Deactivated staff cannot start new sessions.
        before: async (session) => {
          const user = await db.user.findUnique({ where: { id: session.userId }, select: { active: true } });
          return user?.active ? { data: session } : false;
        },
      },
    },
  },
  plugins: [nextCookies()],
});
