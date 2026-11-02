import Link from "next/link";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { formatDateParts, formatTime } from "@/lib/format";

export interface EventSummary {
  slug: string;
  title: string;
  summary: string;
  startsAt: Date;
  endsAt: Date | null;
  venue: string | null;
  status: string;
  registrationEnabled: boolean;
  image: PhotoSource | null;
}

export function EventDate({ date, tone = "light" }: { date: Date; tone?: "light" | "dark" }) {
  const parts = formatDateParts(date);
  const dark = tone === "dark";
  return (
    <time dateTime={date.toISOString()} className="flex flex-col items-start leading-none">
      <span className={`label ${dark ? "text-mist" : "text-muted"}`}>{parts.weekday}</span>
      <span className={`mt-2 text-[3.25rem] font-medium tracking-[-0.04em] tabular-nums ${dark ? "text-white" : "text-navy-900"}`}>{parts.day}</span>
      <span className={`label mt-2 ${dark ? "text-mist" : "text-muted"}`}>
        {parts.month} {parts.year}
      </span>
    </time>
  );
}

function EventBadges({ event }: { event: EventSummary }) {
  const cancelled = event.status === "CANCELLED";
  if (!cancelled && !event.registrationEnabled) return null;
  return (
    <p className={`label ${cancelled ? "text-danger" : "text-success"}`}>{cancelled ? "Cancelled" : "Registration open"}</p>
  );
}

function eventWhen(event: EventSummary): string {
  const time = `${formatTime(event.startsAt)}${event.endsAt ? ` to ${formatTime(event.endsAt)}` : ""}`;
  return event.venue ? `${time}, ${event.venue}` : time;
}

/** One event as a wide white row: date numeral, details, photograph. */
export function EventRow({ event }: { event: EventSummary }) {
  const cancelled = event.status === "CANCELLED";
  return (
    <article className="group relative grid gap-6 bg-ivory p-6 sm:grid-cols-[7rem_1fr] sm:p-10 lg:grid-cols-[7rem_1fr_15rem] lg:items-center lg:gap-10">
      <EventDate date={event.startsAt} />
      <div className="min-w-0">
        <EventBadges event={event} />
        <h3 className="mt-2 text-display-sm text-navy-900">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            <span className={cancelled ? "line-through decoration-1" : ""}>{event.title}</span>
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted">{event.summary}</p>
        <p className="mt-3 font-mono text-[0.875rem] text-muted">{eventWhen(event)}</p>
      </div>
      <div className="relative hidden aspect-[4/3] overflow-hidden bg-sand-300 lg:block">
        {event.image && (
          <Photo image={event.image} sizes="15rem" alt="" className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none" />
        )}
      </div>
    </article>
  );
}

/** Calendar card: photograph on top, a white caption block beneath. */
export function EventCard({ event }: { event: EventSummary }) {
  const parts = formatDateParts(event.startsAt);
  const cancelled = event.status === "CANCELLED";
  return (
    <article className="group relative flex w-full flex-col bg-ivory">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900">
        {event.image ? (
          <Photo
            image={event.image}
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 50vw, 100vw"
            alt=""
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-end p-6">
            <span className="text-[5rem] font-medium leading-[0.85] tracking-[-0.05em] text-white tabular-nums">{parts.day}</span>
            <span className="label mt-3 text-mist">
              {parts.month} {parts.year}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <EventBadges event={event} />
        <h3 className="mt-1 text-xl font-medium leading-snug tracking-[-0.015em] text-navy-900">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            <span className={cancelled ? "line-through decoration-1" : ""}>{event.title}</span>
          </Link>
        </h3>
        <p className="mt-auto pt-4 font-mono text-[0.8125rem] text-muted">
          <time dateTime={event.startsAt.toISOString()}>
            {parts.weekday}, {parts.day} {parts.month}
          </time>
          , {eventWhen(event)}
        </p>
      </div>
    </article>
  );
}
