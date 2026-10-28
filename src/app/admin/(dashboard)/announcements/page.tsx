import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatShortDate, toLocalDateTimeInput } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteAnnouncement, saveAnnouncement } from "@/server/admin/content-actions";
import { AdminForm, Checkbox, ConfirmButton, Field } from "@/components/admin/form";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, FormGrid, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Announcements" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function AnnouncementsPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await searchParams;
  const [announcements, editing] = await Promise.all([
    db.announcement.findMany({ orderBy: { createdAt: "desc" } }),
    id && id !== "new" ? db.announcement.findUnique({ where: { id } }) : null,
  ]);
  const showForm = id === "new" || Boolean(editing);
  const now = new Date();

  return (
    <AdminPage
      title="Announcements"
      description="A short message shown in a bar above the site header. Only the newest active announcement within its dates is shown. With none active, the bar is hidden."
      actions={<AdminLinkButton href="/admin/announcements?id=new">New announcement</AdminLinkButton>}
    >
      {showForm && (
        <Panel title={editing ? "Edit announcement" : "New announcement"} className="mb-8">
          <AdminForm action={saveAnnouncement} key={editing?.id ?? "new"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field name="message" label="Message" required maxLength={240} defaultValue={editing?.message} placeholder="e.g. Join us this Friday for a special prayer meeting" />
            <FormGrid>
              <Field name="linkLabel" label="Link text" maxLength={40} defaultValue={editing?.linkLabel} />
              <Field name="linkHref" label="Link" defaultValue={editing?.linkHref} hint="/events/your-event or https://…" />
              <Field name="startsAt" type="datetime-local" label="Show from" defaultValue={toLocalDateTimeInput(editing?.startsAt)} hint="Ghana time. Leave blank to show immediately." />
              <Field name="endsAt" type="datetime-local" label="Show until" defaultValue={toLocalDateTimeInput(editing?.endsAt)} hint="Leave blank to show until switched off." />
            </FormGrid>
            <Checkbox name="active" label="Active" defaultChecked={editing?.active ?? true} />
          </AdminForm>
          {editing && (
            <div className="mt-4">
              <ConfirmButton action={deleteAnnouncement} hidden={{ id: editing.id }} label="Delete announcement" confirmText="This announcement will be permanently removed." />
            </div>
          )}
        </Panel>
      )}

      <DataTable head={["Message", "Window", "Status", ""]} empty={announcements.length === 0 && <EmptyRow>No announcements yet.</EmptyRow>}>
        {announcements.map((item) => {
          const live = item.active && (!item.startsAt || item.startsAt <= now) && (!item.endsAt || item.endsAt > now);
          return (
            <tr key={item.id}>
              <td className="max-w-md px-4 py-3 text-navy-900">{item.message}</td>
              <td className="px-4 py-3 text-muted">
                {item.startsAt ? formatShortDate(item.startsAt) : "Now"} – {item.endsAt ? formatShortDate(item.endsAt) : "No end"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={live ? "ACTIVE" : item.active ? "PENDING" : "ARCHIVED"} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link href={`/admin/announcements?id=${item.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                  Edit
                </Link>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </AdminPage>
  );
}
