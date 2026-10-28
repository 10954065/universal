import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarPlus, Clock, Download, Mail, MapPin, Phone } from "lucide-react";
import { getEventBySlug, getRegisteredAttendees, getSiteSettings } from "@/lib/content";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatEventWindow } from "@/lib/format";
import { safeExternalUrl, telHref } from "@/lib/safe-url";
import { absoluteUrl } from "@/lib/site-url";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { PageHeader } from "@/components/site/page-header";
import { JsonLd } from "@/components/site/json-ld";
import { ShareLinks } from "@/components/site/share-links";
import { EventRegistrationPanel } from "@/components/events/event-registration-panel";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getEventBySlug((await params).slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: event.image ? { images: [{ url: event.image.url, alt: event.image.alt }] } : undefined,
    robots: event.isSample ? { index: false } : undefined,
  };
}

const chipClass =
  "inline-flex min-h-11 items-center gap-2 border border-navy-900/20 px-4 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900";

export default async function EventPage({ params }: Props) {
  const event = await getEventBySlug((await params).slug);
  if (!event) notFound();
  const [settings, registeredCount] = await Promise.all([getSiteSettings(), getRegisteredAttendees(event.id)]);

  const url = absoluteUrl(`/events/${event.slug}`);
  const ended = (event.endsAt ?? event.startsAt) < new Date();
  const cancelled = event.status === "CANCELLED";
  const location = [event.venue, event.address].filter(Boolean).join(", ");
  const phone = telHref(event.contactPhone);
  const externalRegistration = safeExternalUrl(event.externalRegistrationUrl) ?? null;

  return (
    <>
      {!event.isSample && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description: event.summary,
            startDate: event.startsAt.toISOString(),
            ...(event.endsAt ? { endDate: event.endsAt.toISOString() } : {}),
            eventStatus: cancelled ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            ...(event.venue ? { location: { "@type": "Place", name: event.venue, ...(event.address ? { address: event.address } : {}) } } : {}),
            ...(event.image ? { image: [absoluteUrl(event.image.url)] } : {}),
            organizer: { "@type": "Organization", name: settings.ministryName, url: absoluteUrl("/") },
            url,
          }}
        />
      )}

      <PageHeader
        eyebrow={cancelled ? "Cancelled" : ended ? "Past event" : undefined}
        title={event.title}
        intro={event.summary}
        image={event.image}
        crumbs={[
          { label: "Events", href: "/events" },
          { label: event.title, href: `/events/${event.slug}` },
        ]}
      />

      {cancelled && (
        <div role="status" className="bg-danger px-5 py-4 text-center font-semibold text-white">
          This event has been cancelled.
        </div>
      )}

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <dl className="grid gap-6 border-y border-line py-8 sm:grid-cols-2">
                <div className="flex gap-4">
                  <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
                  <div>
                    <dt className="eyebrow text-muted">When</dt>
                    <dd className="mt-1.5 text-navy-900">{formatEventWindow(event.startsAt, event.endsAt)}</dd>
                  </div>
                </div>
                {location && (
                  <div className="flex gap-4">
                    <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
                    <div>
                      <dt className="eyebrow text-muted">Where</dt>
                      <dd className="mt-1.5 text-navy-900">{location}</dd>
                    </div>
                  </div>
                )}
              </dl>

              {event.description && <RichText markdown={event.description} className="mt-10" />}

              {!ended && !cancelled && (
                <div className="mt-10 flex flex-wrap gap-3">
                  <a href={googleCalendarUrl(event, url)} target="_blank" rel="noopener noreferrer" className={chipClass}>
                    <CalendarPlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    Add to Google Calendar<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <a href={`/events/${event.slug}/calendar.ics`} className={chipClass}>
                    <Download aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    Download calendar file (.ics)
                  </a>
                </div>
              )}

              <div className="mt-12">
                <ShareLinks url={url} title={event.title} />
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="space-y-6 lg:sticky lg:top-28">
                <EventRegistrationPanel
                  event={{
                    id: event.id,
                    slug: event.slug,
                    title: event.title,
                    registrationEnabled: event.registrationEnabled,
                    registrationCapacity: event.registrationCapacity,
                    registrationDeadline: event.registrationDeadline,
                    registeredCount,
                  }}
                  closed={ended || cancelled}
                  externalUrl={externalRegistration}
                />
                {(event.contactEmail || phone) && (
                  <div className="border border-line p-6">
                    <h2 className="eyebrow text-gold-ink">Questions?</h2>
                    <ul className="mt-4 space-y-3 text-[0.9375rem]">
                      {event.contactEmail && (
                        <li className="flex items-center gap-3">
                          <Mail aria-hidden="true" className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
                          <a href={`mailto:${event.contactEmail}`} className="break-all text-navy-900 underline decoration-gold-ink/50 underline-offset-4">
                            {event.contactEmail}
                          </a>
                        </li>
                      )}
                      {phone && (
                        <li className="flex items-center gap-3">
                          <Phone aria-hidden="true" className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
                          <a href={phone} className="text-navy-900 underline decoration-gold-ink/50 underline-offset-4">
                            {event.contactPhone}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <ButtonLink href="/events" variant="text">
                  All events
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
