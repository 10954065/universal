import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePagePermission } from "@/lib/session";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, Notice, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Leadership" };

export default async function AdminLeadershipPage() {
  await requirePagePermission("content:manage");
  const leaders = await db.leadershipProfile.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

  return (
    <AdminPage title="Leadership" actions={<AdminLinkButton href="/admin/leadership/new">Add leader</AdminLinkButton>}>
      <div className="mb-6">
        <Notice tone="warning">
          Publish only approved profiles with confirmed names and titles. Four studio portraits are in the Media library, but they have not been matched to names. Please confirm who is pictured before using them.
        </Notice>
      </div>
      <DataTable head={["Name", "Role", "Order", "Status", ""]} empty={leaders.length === 0 && <EmptyRow>No leadership profiles yet.</EmptyRow>}>
        {leaders.map((leader) => (
          <tr key={leader.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{leader.name}</td>
            <td className="px-4 py-3 text-muted">{leader.role}</td>
            <td className="px-4 py-3 text-muted">{leader.sortOrder}</td>
            <td className="px-4 py-3">
              <StatusBadge status={leader.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/leadership/${leader.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
