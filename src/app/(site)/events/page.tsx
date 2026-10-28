import type { Metadata } from "next";
import Link from "next/link";
import { getLibraryPhotos, getPastEvents, getUpcomingEvents } from "@/lib/content";
import { formatShortDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/site/page-header";
import { EventRow } from "@/components/events/event-row";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming gatherings, programmes and special services at Universal Trinity Ministry.",
  alternates: { canonical: "/events" },
};

interface Props {
  searchParams: Promise<{ view?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const view = (await searchParams).view === "past" ? "past" : "upcoming";
  const [upcoming, past, photos] = await Promise.all([getUpcomingEvents(), getPastEvents(24), getLibraryPhotos("praise-hand-raised.jpg")]);

  const tabClass = (active: boolean) =>
    `inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${
      active ? "border-gold text-navy-900" : "border-transparent text-muted hover:text-navy-900"
    }`;

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Gather, grow and *celebrate*"
        intro="Special services, programmes and community gatherings. Everyone is welcome."
        image={photos.get("praise-hand-raised.jpg") ?? null}
        crumbs={[{ label: "Events", href: "/events" }]}
      />
      <section className="py-16 sm:py-20" aria-labelledby="event-list-heading">
        <Container>
          <h2 id="event-list-heading" className="sr-only">
            {view === "upcoming" ? "Upcoming events" : "Past events"}
          </h2>
          <nav aria-label="Event lists" className="flex gap-8 border-b border-line">
            <Link href="/events" aria-current={view === "upcoming" ? "page" : undefined} className={tabClass(view === "upcoming")}>
              Upcoming ({upcoming.length})
            </Link>
            <Link href="/events?view=past" aria-current={view === "past" ? "page" : undefined} className={tabClass(view === "past")}>
              Past events
            </Link>
          </nav>

          {view === "upcoming" ? (
            upcoming.length > 0 ? (
              <div className="mt-6 border-b border-navy-900/15">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-12">
                <EmptyState
                  title="New gatherings are being planned"
                  action={
                    <ButtonLink href="/plan-your-visit" variant="outline">
                      Join a regular service
                    </ButtonLink>
                  }
                >
                  There are no upcoming events published right now. Please check back soon.
                </EmptyState>
              </div>
            )
          ) : past.length > 0 ? (
            <ul className="mt-6 divide-y divide-line">
              {past.map((event) => (
                <li key={event.id} className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:items-baseline">
                  <time dateTime={event.startsAt.toISOString()} className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
                    {formatShortDate(event.startsAt)}
                  </time>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-navy-900">
                      <Link href={`/events/${event.slug}`} className="hover:underline hover:decoration-gold hover:underline-offset-4">
                        {event.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-muted">{event.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12">
              <EmptyState title="No past events yet">Our event history will appear here.</EmptyState>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
