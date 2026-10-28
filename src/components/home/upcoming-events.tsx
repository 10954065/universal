import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventRow, type EventSummary } from "@/components/events/event-row";

export function UpcomingEvents({ events, index }: { events: EventSummary[]; index?: string }) {
  return (
    <section aria-labelledby="events-heading" className="py-24 sm:py-32">
      <Container>
        <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading id="events-heading" eyebrow="What's coming up" index={index} title="Upcoming *events*" />
          {events.length > 0 && (
            <ButtonLink href="/events" variant="text" className="shrink-0">
              View all events
            </ButtonLink>
          )}
        </div>
        <div className="reveal mt-12">
          {events.length > 0 ? (
            <div className="border-b border-navy-900/15">
              {events.map((event) => (
                <EventRow key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="New gatherings are being planned"
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
