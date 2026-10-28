import { getEventBySlug, getSiteSettings } from "@/lib/content";
import { buildIcs } from "@/lib/calendar";
import { absoluteUrl } from "@/lib/site-url";

/** Downloadable iCalendar file for a published event. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || event.status !== "PUBLISHED") return new Response("Not found", { status: 404 });

  const settings = await getSiteSettings();
  const ics = buildIcs(event, absoluteUrl(`/events/${event.slug}`), settings.ministryName);
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
