import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatShortDate, formatTime } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { AdminPage, DataTable, EmptyRow } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Audit log" };

export default async function AuditLogPage() {
  await requirePagePermission("audit:view");
  const entries = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300, include: { user: { select: { name: true } } } });

  return (
    <AdminPage title="Audit log" description="The latest 300 changes made in the dashboard. Private content is never recorded here.">
      <DataTable head={["When", "Who", "Action", "Details"]} empty={entries.length === 0 && <EmptyRow>No activity yet.</EmptyRow>}>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <td className="whitespace-nowrap px-4 py-3 text-muted">
              {formatShortDate(entry.createdAt)} {formatTime(entry.createdAt)}
            </td>
            <td className="px-4 py-3 text-navy-900">{entry.user?.name ?? "System"}</td>
            <td className="px-4 py-3 font-mono text-xs text-navy-900">{entry.action}</td>
            <td className="px-4 py-3 text-muted">{entry.summary ?? entry.entityId ?? ""}</td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
