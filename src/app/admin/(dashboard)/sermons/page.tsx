import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Sermons" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminSermonsPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const sermons = await db.sermon.findMany({
    where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { speaker: { name: { contains: q, mode: "insensitive" } } }] } : undefined,
    include: { speaker: true },
    orderBy: { preachedAt: "desc" },
    take: 200,
  });

  return (
    <AdminPage title="Sermons" description="Publish messages with YouTube, Vimeo or audio recordings." actions={<AdminLinkButton href="/admin/sermons/new">New sermon</AdminLinkButton>}>
      <form className="mb-6 flex max-w-md gap-2" role="search">
        <label htmlFor="sermon-search" className="sr-only">
          Search sermons
        </label>
        <input id="sermon-search" name="q" defaultValue={q} placeholder="Search title or speaker" className="h-10 flex-1 border border-navy-900/20 bg-white px-3 text-sm" />
        <button className="min-h-10 border border-navy-900/25 px-4 text-sm font-medium">Search</button>
      </form>
      <DataTable head={["Title", "Speaker", "Preached", "Status", ""]} empty={sermons.length === 0 && <EmptyRow>No sermons yet.</EmptyRow>}>
        {sermons.map((sermon) => (
          <tr key={sermon.id}>
            <td className="px-4 py-3 font-medium text-navy-900">
              {sermon.title}
              {sermon.isSample && <span className="ml-2 text-xs font-semibold text-gold-ink">SAMPLE</span>}
            </td>
            <td className="px-4 py-3 text-muted">{sermon.speaker?.name ?? "—"}</td>
            <td className="px-4 py-3 text-muted">{formatShortDate(sermon.preachedAt)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={sermon.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/sermons/${sermon.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
