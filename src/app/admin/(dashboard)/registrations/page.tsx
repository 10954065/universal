import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteRegistration } from "@/server/admin/library-actions";
import { ConfirmButton } from "@/components/admin/form";
import { AdminPage, DataTable, EmptyRow, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Event registrations" };

interface Props {
  searchParams: Promise<{ event?: string }>;
}

export default async function RegistrationsPage({ searchParams }: Props) {
  await requirePagePermission("registrations:view");
  const { event: eventId } = await searchParams;
  const events = await db.event.findMany({
    where: { registrationEnabled: true },
    orderBy: { startsAt: "desc" },
    select: { id: true, title: true, startsAt: true, registrationCapacity: true, registrations: { select: { attendees: true } } },
  });
  const selected = eventId
    ? await db.event.findUnique({ where: { id: eventId }, include: { registrations: { orderBy: { createdAt: "asc" } } } })
    : null;
  const totalPeople = selected?.registrations.reduce((sum, registration) => sum + registration.attendees, 0) ?? 0;

  return (
    <AdminPage title="Event registrations" description="People who registered through the website.">
      <div className="grid gap-8 xl:grid-cols-[20rem_1fr]">
        <Panel title="Events">
          {events.length === 0 ? (
            <p className="text-sm text-muted">No events accept registrations yet.</p>
          ) : (
            <ul className="space-y-1">
              {events.map((event) => {
                const people = event.registrations.reduce((sum, registration) => sum + registration.attendees, 0);
                return (
                  <li key={event.id}>
                    <Link
                      href={`/admin/registrations?event=${event.id}`}
                      className={`block border px-3 py-2 text-sm ${event.id === eventId ? "border-navy-900 bg-ivory" : "border-transparent hover:border-line"}`}
                    >
                      <span className="font-medium text-navy-900">{event.title}</span>
                      <span className="block text-xs text-muted">
                        {formatShortDate(event.startsAt)} · {people}
                        {event.registrationCapacity ? ` / ${event.registrationCapacity}` : ""} people
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
        {selected ? (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-navy-900">
                {selected.title} <span className="text-base font-normal text-muted">— {totalPeople} people</span>
              </h2>
              <a href={`/admin/export/registrations?event=${selected.id}`} download className="min-h-10 border border-navy-900/25 px-4 py-2 text-sm font-medium hover:border-navy-900">
                Export CSV
              </a>
            </div>
            <DataTable head={["Name", "Email", "Phone", "People", "Notes", ""]} empty={selected.registrations.length === 0 && <EmptyRow>No registrations yet.</EmptyRow>}>
              {selected.registrations.map((registration) => (
                <tr key={registration.id}>
                  <td className="px-4 py-3 font-medium text-navy-900">{registration.name}</td>
                  <td className="px-4 py-3 text-muted">{registration.email}</td>
                  <td className="px-4 py-3 text-muted">{registration.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{registration.attendees}</td>
                  <td className="max-w-xs px-4 py-3 text-muted">{registration.notes ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <ConfirmButton action={deleteRegistration} hidden={{ id: registration.id }} label="Remove" confirmText={`Remove ${registration.name}'s registration?`} />
                  </td>
                </tr>
              ))}
            </DataTable>
          </div>
        ) : (
          <Panel>
            <p className="text-muted">Choose an event to see who has registered.</p>
          </Panel>
        )}
      </div>
    </AdminPage>
  );
}
