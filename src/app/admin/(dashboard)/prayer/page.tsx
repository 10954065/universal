import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatLongDate, formatShortDate } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { applyRetentionNow, deletePrayer, setPrayerStatus } from "@/server/admin/inbox-actions";
import { ConfirmButton } from "@/components/admin/form";
import { AdminPage, DataTable, EmptyRow, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Prayer requests" };

interface Props {
  searchParams: Promise<{ id?: string; purged?: string }>;
}

export default async function PrayerRequestsPage({ searchParams }: Props) {
  const user = await requirePagePermission("prayer:read");
  const { id, purged } = await searchParams;
  const settings = await db.siteSettings.findUnique({ where: { id: 1 }, select: { prayerRetentionDays: true } });

  let selected = id ? await db.prayerRequest.findUnique({ where: { id } }) : null;
  if (selected?.status === "NEW") selected = await db.prayerRequest.update({ where: { id: selected.id }, data: { status: "READ" } });

  const requests = await db.prayerRequest.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
    select: { id: true, anonymous: true, name: true, status: true, createdAt: true },
    take: 300,
  });

  return (
    <AdminPage
      title="Prayer requests"
      description={`Private. Visible only to staff with prayer access. Requests are permanently deleted ${settings?.prayerRetentionDays ?? 180} days after they arrive.`}
      actions={
        <ConfirmButton
          action={applyRetentionNow}
          hidden={{}}
          tone="neutral"
          label="Apply retention now"
          confirmText={`Permanently delete every request older than ${settings?.prayerRetentionDays ?? 180} days? This also runs automatically every day.`}
        />
      }
    >
      <div className="mb-6 space-y-3">
        <Notice tone="warning">Please do not copy, forward or discuss requests outside the prayer team. Signed in as {user.name}.</Notice>
        {purged !== undefined && <Notice>{purged} expired request(s) deleted.</Notice>}
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_28rem]">
        <DataTable head={["From", "Received", "Status"]} empty={requests.length === 0 && <EmptyRow>No prayer requests.</EmptyRow>}>
          {requests.map((request) => (
            <tr key={request.id} className={request.id === selected?.id ? "bg-gold/10" : ""}>
              <td className="px-4 py-3">
                <Link href={`/admin/prayer?id=${request.id}`} className="font-medium text-navy-900 underline-offset-4 hover:underline">
                  {request.anonymous || !request.name ? "Anonymous" : request.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{formatShortDate(request.createdAt)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={request.status} />
              </td>
            </tr>
          ))}
        </DataTable>
        {selected && (
          <Panel title={selected.anonymous || !selected.name ? "Anonymous request" : selected.name}>
            <p className="text-xs text-muted">Received {formatLongDate(selected.createdAt)}</p>
            {selected.contact && <p className="mt-2 text-sm text-navy-900">Follow-up contact: {selected.contact}</p>}
            <p className="mt-5 whitespace-pre-line leading-relaxed text-navy-900">{selected.request}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
              {(["PRAYED_FOR", "ARCHIVED"] as const).map((status) => (
                <form key={status} action={setPrayerStatus}>
                  <input type="hidden" name="id" value={selected.id} />
                  <input type="hidden" name="status" value={status} />
                  <button className="min-h-10 border border-navy-900/25 px-4 text-sm font-medium hover:border-navy-900" disabled={selected.status === status}>
                    {status === "PRAYED_FOR" ? "Mark prayed for" : "Archive"}
                  </button>
                </form>
              ))}
              <ConfirmButton action={deletePrayer} hidden={{ id: selected.id }} label="Delete now" confirmText="This prayer request will be permanently deleted." />
            </div>
          </Panel>
        )}
      </div>
    </AdminPage>
  );
}
