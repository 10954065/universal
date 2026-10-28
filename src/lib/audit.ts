import "server-only";
import { db } from "@/lib/db";

/**
 * Records who changed what. Summaries must never contain private content
 * (prayer text, message bodies, passwords) — only identifiers and titles.
 */
export async function audit(userId: string, action: string, entity: string, entityId?: string | null, summary?: string) {
  try {
    await db.auditLog.create({ data: { userId, action, entity, entityId: entityId ?? null, summary: summary?.slice(0, 300) ?? null } });
  } catch {
    // Auditing must not break the primary operation, but the failure is surfaced in server logs.
    console.error(`[audit] failed to record ${action} ${entity}`);
  }
}
