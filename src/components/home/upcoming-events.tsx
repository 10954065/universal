import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard, type EventSummary } from "@/components/events/event-row";

export function UpcomingEvents({ events }: { events: EventSummary[] }) {
  return (
    <section aria-labelledby="events-heading" className="py-24 sm:py-32">
      <Container>
        <div className="reveal flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="label text-gold-ink">What&apos;s on</p>
            <h2 id="events-heading" className="mt-4 text-display-lg text-navy-900">
              Upcoming <span className="text-royal">events</span>
            </h2>
          </div>
          {events.length > 0 && (
            <ButtonLink href="/events" variant="text" className="self-start sm:self-auto">
              All events
            </ButtonLink>
          )}
        </div>
        <div className="reveal mt-10">
          {events.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {events.map((event) => (
                <li key={event.slug} className="flex">
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No upcoming events"
              action={
                <ButtonLink href="/contact" variant="outline">
                  Ask about upcoming events
                </ButtonLink>
              }
            >
              There are no upcoming events published right now. Check back soon, or join us at one of our regular services.
            </EmptyState>
          )}
        </div>
      </Container>
    </section>
  );
}
