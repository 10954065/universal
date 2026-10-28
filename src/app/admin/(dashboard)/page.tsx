import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { formatMoney, formatShortDate } from "@/lib/format";
import { isPaystackConfigured } from "@/lib/paystack";
import { can } from "@/lib/permissions";
import { requirePagePermission } from "@/lib/session";
import { storageDriver } from "@/lib/storage";
import { AdminPage, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Overview" };

interface Props {
  searchParams: Promise<{ denied?: string }>;
}

export default async function AdminOverviewPage({ searchParams }: Props) {
  const user = await requirePagePermission("dashboard:view");
  const { denied } = await searchParams;
  const now = new Date();

  const showContent = can(user.role, "content:manage");
  const showEnquiries = can(user.role, "enquiries:manage");
  const showPrayer = can(user.role, "prayer:read");
  const showSubscribers = can(user.role, "subscribers:manage");
  const showDonations = can(user.role, "donations:view");
  const showRegistrations = can(user.role, "registrations:view");

  const [sermons, upcomingEvents, registrations, newEnquiries, unreadPrayer, subscribers, donationTotal, sampleCount, recentEnquiries] = await Promise.all([
    showContent ? db.sermon.count({ where: { status: "PUBLISHED" } }) : null,
    showContent || showRegistrations ? db.event.count({ where: { status: "PUBLISHED", startsAt: { gte: now } } }) : null,
    showRegistrations ? db.eventRegistration.aggregate({ where: { event: { startsAt: { gte: now } } }, _sum: { attendees: true } }) : null,
    showEnquiries ? db.contactEnquiry.count({ where: { status: "NEW" } }) : null,
    showPrayer ? db.prayerRequest.count({ where: { status: "NEW" } }) : null,
    showSubscribers ? db.newsletterSubscriber.count({ where: { status: "ACTIVE" } }) : null,
    showDonations ? db.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amountMinor: true } }) : null,
    showContent ? db.sermon.count({ where: { isSample: true } }).then(async (count) => count + (await db.event.count({ where: { isSample: true } }))) : 0,
    showEnquiries ? db.contactEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, type: true, status: true, createdAt: true } }) : [],
  ]);

  const stats = [
    sermons !== null && { label: "Published sermons", value: sermons, href: "/admin/sermons" },
    upcomingEvents !== null && { label: "Upcoming events", value: upcomingEvents, href: showContent ? "/admin/events" : "/admin/registrations" },
    registrations !== null && { label: "People registered (upcoming)", value: registrations._sum.attendees ?? 0, href: "/admin/registrations" },
    newEnquiries !== null && { label: "New enquiries", value: newEnquiries, href: "/admin/enquiries" },
    unreadPrayer !== null && { label: "Unread prayer requests", value: unreadPrayer, href: "/admin/prayer" },
    subscribers !== null && { label: "Active subscribers", value: subscribers, href: "/admin/subscribers" },
    donationTotal !== null && isPaystackConfigured() && { label: "Verified online gifts", value: formatMoney(donationTotal._sum.amountMinor ?? 0), href: "/admin/donations" },
  ].filter(Boolean) as { label: string; value: number | string; href: string }[];

  const integrations = [
    { name: "Email delivery (Resend)", ok: isEmailConfigured(), note: "Set RESEND_API_KEY and EMAIL_FROM" },
    { name: "Online giving (Paystack)", ok: isPaystackConfigured(), note: "Set PAYSTACK_SECRET_KEY, then enable in Site settings" },
    { name: "Media storage", ok: true, note: storageDriver() === "vercel-blob" ? "Vercel Blob" : "Local disk (public/uploads)" },
    { name: "Analytics (Plausible)", ok: Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN), note: "Optional: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN" },
  ];

  return (
    <AdminPage title={`Welcome, ${user.name.split(" ")[0]}`} description="An overview of the ministry website and the people reaching out through it.">
      <div className="space-y-6">
        {denied && <Notice tone="warning">Your role does not include access to that page.</Notice>}
        {sampleCount > 0 && (
          <Notice tone="warning">
            {sampleCount} sample sermon(s)/event(s) created for development are in the database. Delete them before launch. They are titled &quot;[Sample]&quot;.
          </Notice>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <li key={stat.label}>
              <Link href={stat.href} className="block border border-line bg-white p-6 transition-colors hover:border-navy-900">
                <p className="font-display text-5xl font-semibold text-navy-900 [font-variant-numeric:lining-nums]">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 lg:grid-cols-2">
          {showEnquiries && (
            <Panel title="Latest enquiries">
              {recentEnquiries.length === 0 ? (
                <p className="text-muted">No enquiries yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {recentEnquiries.map((enquiry) => (
                    <li key={enquiry.id} className="flex items-center justify-between gap-4 py-3">
                      <Link href={`/admin/enquiries?id=${enquiry.id}`} className="font-medium text-navy-900 hover:underline">
                        {enquiry.name}
                        <span className="ml-2 text-xs text-muted">{enquiry.type === "VISIT" ? "Planning a visit" : "Contact"}</span>
                      </Link>
                      <span className="flex items-center gap-3 text-xs text-muted">
                        {formatShortDate(enquiry.createdAt)} <StatusBadge status={enquiry.status} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}
          <Panel title="Integrations">
            <ul className="divide-y divide-line text-sm">
              {integrations.map((item) => (
                <li key={item.name} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium text-navy-900">{item.name}</p>
                    <p className="text-xs text-muted">{item.note}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold uppercase ${item.ok ? "text-success" : "text-gold-ink"}`}>{item.ok ? "Configured" : "Not configured"}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AdminPage>
  );
}
