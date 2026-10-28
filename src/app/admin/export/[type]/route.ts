import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toCsv } from "@/lib/csv";
import { authorize, ForbiddenError } from "@/lib/session";

/**
 * CSV exports for staff. Each export re-checks the specific permission on the server.
 * Prayer requests are deliberately NOT exportable.
 */
export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const url = new URL(request.url);
  try {
    if (type === "subscribers") {
      const user = await authorize("subscribers:manage");
      const rows = await db.newsletterSubscriber.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "asc" } });
      await audit(user.id, "export.subscribers", "NewsletterSubscriber", null, `${rows.length} rows`);
      return csv("active-subscribers", toCsv(["Email", "Confirmed at", "Consent given at", "Consent wording"], rows.map((r) => [r.email, r.confirmedAt, r.consentAt, r.consentText])));
    }

    if (type === "registrations") {
      const user = await authorize("registrations:view");
      const eventId = url.searchParams.get("event") ?? "";
      const event = await db.event.findUnique({ where: { id: eventId }, include: { registrations: { orderBy: { createdAt: "asc" } } } });
      if (!event) return new Response("Not found", { status: 404 });
      await audit(user.id, "export.registrations", "Event", event.id, `${event.registrations.length} rows`);
      return csv(
        `registrations-${event.slug}`,
        toCsv(["Name", "Email", "Phone", "Attending", "Notes", "Registered at"], event.registrations.map((r) => [r.name, r.email, r.phone, r.attendees, r.notes, r.createdAt])),
      );
    }

    if (type === "donations") {
      const user = await authorize("donations:view");
      const status = url.searchParams.get("status");
      const from = url.searchParams.get("from");
      const to = url.searchParams.get("to");
      const rows = await db.donation.findMany({
        where: {
          ...(status && ["PENDING", "SUCCESS", "FAILED", "ABANDONED"].includes(status) ? { status: status as "SUCCESS" } : {}),
          createdAt: { ...(from ? { gte: new Date(`${from}T00:00:00Z`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59Z`) } : {}) },
        },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      });
      await audit(user.id, "export.donations", "Donation", null, `${rows.length} rows`);
      return csv(
        "donations",
        toCsv(
          ["Reference", "Status", "Amount", "Currency", "Category", "Donor name", "Donor email", "Channel", "Paid at", "Verified at", "Created at"],
          rows.map((r) => [r.reference, r.status, (r.amountMinor / 100).toFixed(2), r.currency, r.category?.name, r.donorName, r.donorEmail, r.channel, r.paidAt, r.verifiedAt, r.createdAt]),
        ),
      );
    }
    return new Response("Not found", { status: 404 });
  } catch (error) {
    if (error instanceof ForbiddenError) return new Response("Forbidden", { status: 403 });
    throw error;
  }
}

function csv(name: string, body: string) {
  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
