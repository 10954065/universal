import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Each serverless instance keeps its own pool, so keep it small.
const MAX_CONNECTIONS_PER_INSTANCE = 5;

function createClient() {
  // The pooled URL (added by Prisma Postgres) survives many parallel instances;
  // the direct DATABASE_URL is kept for migrations.
  const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, max: MAX_CONNECTIONS_PER_INSTANCE }) });
}

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
