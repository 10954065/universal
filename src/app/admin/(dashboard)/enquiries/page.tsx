import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatLongDate, formatShortDate, formatTime } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteEnquiry, updateEnquiry } from "@/server/admin/inbox-actions";
import { AdminForm, ConfirmButton, Select, TextArea } from "@/components/admin/form";
import { AdminPage, DataTable, EmptyRow, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Enquiries" };

const STATUSES = ["NEW", "READ", "IN_PROGRESS", "RESOLVED", "ARCHIVED"] as const;

interface Props {
  searchParams: Promise<{ id?: string; status?: string; type?: string }>;
}

export default async function EnquiriesPage({ searchParams }: Props) {
  await requirePagePermission("enquiries:manage");
  const { id, status, type } = await searchParams;
  const statusFilter = STATUSES.find((value) => value === status);
  const typeFilter = type === "VISIT" || type === "CONTACT" ? type : undefined;

  let selected = id ? await db.contactEnquiry.findUnique({ where: { id } }) : null;
  // Opening an enquiry marks it as read.
  if (selected?.status === "NEW") selected = await db.contactEnquiry.update({ where: { id: selected.id }, data: { status: "READ" } });

  const enquiries = await db.contactEnquiry.findMany({
    where: { ...(statusFilter ? { status: statusFilter } : { status: { not: "ARCHIVED" } }), ...(typeFilter ? { type: typeFilter } : {}) },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const filterLink = (label: string, query: string, active: boolean) => (
    <Link key={label} href={`/admin/enquiries${query}`} className={`min-h-9 border px-3 py-1.5 text-sm ${active ? "border-navy-900 bg-navy-900 text-ivory" : "border-line bg-white"}`}>
      {label}
    </Link>
  );

  return (
    <AdminPage title="Enquiries" description="Messages from the contact form and people planning a visit. Archived messages are hidden unless filtered.">
      <div className="mb-6 flex flex-wrap gap-2">
        {filterLink("Open", "", !statusFilter && !typeFilter)}
        {filterLink("New", "?status=NEW", statusFilter === "NEW")}
        {filterLink("Visits", "?type=VISIT", typeFilter === "VISIT")}
        {filterLink("Resolved", "?status=RESOLVED", statusFilter === "RESOLVED")}
        {filterLink("Archived", "?status=ARCHIVED", statusFilter === "ARCHIVED")}
      </div>
      <div className="grid gap-8 xl:grid-cols-[1fr_26rem]">
        <DataTable head={["From", "Type", "Received", "Status"]} empty={enquiries.length === 0 && <EmptyRow>No enquiries here.</EmptyRow>}>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id} className={enquiry.id === selected?.id ? "bg-gold/10" : ""}>
              <td className="px-4 py-3">
                <Link href={`/admin/enquiries?id=${enquiry.id}${status ? `&status=${status}` : ""}`} className="font-medium text-navy-900 underline-offset-4 hover:underline">
                  {enquiry.name}
                </Link>
                <p className="text-xs text-muted">{enquiry.subject ?? enquiry.email}</p>
              </td>
              <td className="px-4 py-3 text-muted">{enquiry.type === "VISIT" ? "Visit" : "Contact"}</td>
              <td className="px-4 py-3 text-muted">{formatShortDate(enquiry.createdAt)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={enquiry.status} />
              </td>
            </tr>
          ))}
        </DataTable>
        {selected && (
          <Panel title={selected.name}>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd>
                  <a href={`mailto:${selected.email}`} className="break-all text-navy-900 underline">
                    {selected.email}
                  </a>
                </dd>
              </div>
              {selected.phone && (
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd className="text-navy-900">{selected.phone}</dd>
                </div>
              )}
              {selected.type === "VISIT" && (
                <div>
                  <dt className="text-muted">Planned visit</dt>
                  <dd className="text-navy-900">
                    {selected.visitDate ? formatLongDate(selected.visitDate) : "Date not given"}, party of {selected.partySize ?? 1}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted">Received</dt>
                <dd className="text-navy-900">
                  {formatLongDate(selected.createdAt)}, {formatTime(selected.createdAt)}
                </dd>
              </div>
              {selected.message && (
                <div>
                  <dt className="text-muted">Message</dt>
                  <dd className="mt-1 whitespace-pre-line leading-relaxed text-navy-900">{selected.message}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 border-t border-line pt-6">
              <AdminForm action={updateEnquiry} key={selected.id}>
                <input type="hidden" name="id" value={selected.id} />
                <Select name="status" label="Status" defaultValue={selected.status} options={STATUSES.map((value) => ({ value, label: value.replace("_", " ").toLowerCase() }))} />
                <TextArea name="staffNotes" label="Staff notes" defaultValue={selected.staffNotes} rows={3} />
              </AdminForm>
              <div className="mt-4">
                <ConfirmButton action={deleteEnquiry} hidden={{ id: selected.id }} label="Delete enquiry" confirmText="This message and its notes will be permanently deleted." />
              </div>
            </div>
          </Panel>
        )}
      </div>
    </AdminPage>
  );
}
