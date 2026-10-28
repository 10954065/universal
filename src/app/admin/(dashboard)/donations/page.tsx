import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate } from "@/lib/format";
import { isPaystackConfigured } from "@/lib/paystack";
import { requirePagePermission } from "@/lib/session";
import { AdminPage, DataTable, EmptyRow, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Donations" };

const STATUSES = ["SUCCESS", "PENDING", "FAILED", "ABANDONED"] as const;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

interface Props {
  searchParams: Promise<{ status?: string; from?: string; to?: string; category?: string }>;
}

export default async function DonationsPage({ searchParams }: Props) {
  await requirePagePermission("donations:view");
  const params = await searchParams;
  const status = STATUSES.find((value) => value === params.status);
  const from = ISO_DATE.test(params.from ?? "") ? params.from : undefined;
  const to = ISO_DATE.test(params.to ?? "") ? params.to : undefined;
  const where = {
    ...(status ? { status } : {}),
    ...(params.category ? { categoryId: params.category } : {}),
    createdAt: { ...(from ? { gte: new Date(`${from}T00:00:00Z`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59Z`) } : {}) },
  };

  const [donations, totals, categories] = await Promise.all([
    db.donation.findMany({ where, include: { category: true, transactions: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { createdAt: "desc" }, take: 500 }),
    db.donation.aggregate({ where: { ...where, status: "SUCCESS" }, _sum: { amountMinor: true }, _count: true }),
    db.givingCategory.findMany({ orderBy: { name: "asc" } }),
  ]);
  const exportQuery = new URLSearchParams({ ...(status ? { status } : {}), ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString();
  const input = "h-10 border border-navy-900/20 bg-white px-3 text-sm";

  return (
    <AdminPage
      title="Donations"
      description="Online gifts processed by Paystack. A gift is only marked successful after server-side verification with Paystack — staff cannot mark gifts as paid."
      actions={
        <a href={`/admin/export/donations?${exportQuery}`} download className="min-h-10 border border-navy-900/25 px-4 py-2 text-sm font-medium hover:border-navy-900">
          Export CSV
        </a>
      }
    >
      {!isPaystackConfigured() && (
        <div className="mb-6">
          <Notice tone="warning">Online giving is not configured. Records appear here once Paystack keys are set and online giving is enabled.</Notice>
        </div>
      )}
      <form className="mb-6 flex flex-wrap items-end gap-3" aria-label="Filter donations">
        <label className="text-sm">
          <span className="block font-semibold text-navy-900">Status</span>
          <select name="status" defaultValue={status ?? ""} className={`${input} mt-1`}>
            <option value="">All</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value.toLowerCase()}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-semibold text-navy-900">Category</span>
          <select name="category" defaultValue={params.category ?? ""} className={`${input} mt-1`}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="block font-semibold text-navy-900">From</span>
          <input type="date" name="from" defaultValue={from} className={`${input} mt-1`} />
        </label>
        <label className="text-sm">
          <span className="block font-semibold text-navy-900">To</span>
          <input type="date" name="to" defaultValue={to} className={`${input} mt-1`} />
        </label>
        <button className="min-h-10 bg-navy-900 px-4 text-sm font-semibold text-ivory">Filter</button>
      </form>
      <Panel className="mb-6">
        <p className="text-sm text-muted">Verified total for this view</p>
        <p className="font-display text-4xl font-semibold text-navy-900">{formatMoney(totals._sum.amountMinor ?? 0)}</p>
        <p className="text-sm text-muted">{totals._count} successful gift(s)</p>
      </Panel>
      <DataTable head={["Reference", "Donor", "Category", "Amount", "Date", "Status", "Last event"]} empty={donations.length === 0 && <EmptyRow>No donations match.</EmptyRow>}>
        {donations.map((donation) => {
          const last = donation.transactions[0];
          return (
            <tr key={donation.id}>
              <td className="px-4 py-3 font-mono text-xs text-navy-900">{donation.reference}</td>
              <td className="px-4 py-3 text-muted">
                {donation.donorName ?? "—"}
                <span className="block text-xs">{donation.donorEmail}</span>
              </td>
              <td className="px-4 py-3 text-muted">{donation.category?.name ?? "General"}</td>
              <td className="px-4 py-3 font-medium text-navy-900">{formatMoney(donation.amountMinor, donation.currency)}</td>
              <td className="px-4 py-3 text-muted">{formatShortDate(donation.createdAt)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={donation.status} />
              </td>
              <td className="px-4 py-3 text-xs text-muted">{last ? `${last.kind.toLowerCase()}${last.message ? `: ${last.message}` : ""}` : "—"}</td>
            </tr>
          );
        })}
      </DataTable>
    </AdminPage>
  );
}
