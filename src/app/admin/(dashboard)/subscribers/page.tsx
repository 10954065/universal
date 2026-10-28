import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteSubscriber, unsubscribeSubscriber } from "@/server/admin/inbox-actions";
import { ConfirmButton } from "@/components/admin/form";
import { AdminPage, DataTable, EmptyRow, Notice, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Subscribers" };

export default async function SubscribersPage() {
  await requirePagePermission("subscribers:manage");
  const subscribers = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 1000 });
  const active = subscribers.filter((subscriber) => subscriber.status === "ACTIVE").length;

  return (
    <AdminPage
      title="Subscribers"
      description={`${active} active subscriber(s). Only people who confirmed by email are active.`}
      actions={
        <a href="/admin/export/subscribers" download className="min-h-10 border border-navy-900/25 px-4 py-2 text-sm font-medium hover:border-navy-900">
          Export active (CSV)
        </a>
      }
    >
      <div className="mb-6">
        <Notice>Use the export only for sending ministry updates, and include an unsubscribe link in every email you send.</Notice>
      </div>
      <DataTable head={["Email", "Signed up", "Status", ""]} empty={subscribers.length === 0 && <EmptyRow>No subscribers yet.</EmptyRow>}>
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{subscriber.email}</td>
            <td className="px-4 py-3 text-muted">{formatShortDate(subscriber.consentAt)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={subscriber.status} />
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-2">
                {subscriber.status !== "UNSUBSCRIBED" && (
                  <ConfirmButton action={unsubscribeSubscriber} hidden={{ id: subscriber.id }} tone="neutral" label="Unsubscribe" confirmText={`Stop sending updates to ${subscriber.email}?`} />
                )}
                <ConfirmButton action={deleteSubscriber} hidden={{ id: subscriber.id }} label="Delete" confirmText={`Permanently delete ${subscriber.email} and their consent record?`} />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
