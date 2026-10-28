import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePagePermission } from "@/lib/session";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, Notice, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Ministries" };

export default async function AdminMinistriesPage() {
  await requirePagePermission("content:manage");
  const ministries = await db.ministry.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <AdminPage title="Ministries" actions={<AdminLinkButton href="/admin/ministries/new">New ministry</AdminLinkButton>}>
      <div className="mb-6">
        <Notice tone="warning">
          Eight suggested ministries were created as drafts. Publish only those that exist at Universal Trinity Ministry, and update their descriptions and photos.
        </Notice>
      </div>
      <DataTable head={["Ministry", "Leader", "Order", "Status", ""]} empty={ministries.length === 0 && <EmptyRow>No ministries yet.</EmptyRow>}>
        {ministries.map((ministry) => (
          <tr key={ministry.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{ministry.name}</td>
            <td className="px-4 py-3 text-muted">{ministry.leaderName ?? "—"}</td>
            <td className="px-4 py-3 text-muted">{ministry.sortOrder}</td>
            <td className="px-4 py-3">
              <StatusBadge status={ministry.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/ministries/${ministry.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
