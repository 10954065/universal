import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatShortDate, formatTime } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage() {
  await requirePagePermission("content:manage");
  const events = await db.event.findMany({ orderBy: { startsAt: "desc" }, include: { _count: { select: { registrations: true } } }, take: 300 });
  const now = new Date();

  return (
    <AdminPage title="Events" description="Past events stay in the public event history unless archived or unpublished." actions={<AdminLinkButton href="/admin/events/new">New event</AdminLinkButton>}>
      <DataTable head={["Event", "When", "Registrations", "Status", ""]} empty={events.length === 0 && <EmptyRow>No events yet.</EmptyRow>}>
        {events.map((event) => (
          <tr key={event.id}>
            <td className="px-4 py-3 font-medium text-navy-900">
              {event.title}
              {event.isSample && <span className="ml-2 text-xs font-semibold text-gold-ink">SAMPLE</span>}
              {(event.endsAt ?? event.startsAt) < now && <span className="ml-2 text-xs text-muted">(past)</span>}
            </td>
            <td className="px-4 py-3 text-muted">
              {formatShortDate(event.startsAt)}, {formatTime(event.startsAt)}
            </td>
            <td className="px-4 py-3 text-muted">
              {event.registrationEnabled ? (
                <Link href={`/admin/registrations?event=${event.id}`} className="underline underline-offset-4">
                  {event._count.registrations}
                </Link>
              ) : (
                "None"
              )}
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={event.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/events/${event.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
