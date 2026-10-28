import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
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
      <span className={`eyebrow ${dark ? "text-gold" : "text-gold-ink"}`}>{parts.weekday}</span>
      <span className={`mt-2 font-display text-6xl font-semibold [font-variant-numeric:lining-nums] ${dark ? "text-ivory" : "text-navy-900"}`}>{parts.day}</span>
      <span className={`mt-1 text-sm font-medium uppercase tracking-[0.18em] ${dark ? "text-mist" : "text-muted"}`}>
        {parts.month} {parts.year}
      </span>
    </time>
  );
}

/** One event as a wide editorial row: date numeral, details, image. */
export function EventRow({ event }: { event: EventSummary }) {
  const cancelled = event.status === "CANCELLED";
  return (
    <article className="group relative grid gap-6 border-t border-navy-900/15 py-9 sm:grid-cols-[8rem_1fr] lg:grid-cols-[9rem_1fr_17rem] lg:gap-10">
      <EventDate date={event.startsAt} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          {cancelled && <span className="bg-danger px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">Cancelled</span>}
          {event.registrationEnabled && !cancelled && (
            <span className="border border-sage-ink/40 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-sage-ink">Registration open</span>
          )}
        </div>
        <h3 className="mt-3 font-display text-display-sm font-semibold text-navy-900">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            <span className={cancelled ? "line-through decoration-1" : ""}>{event.title}</span>
          </Link>
        </h3>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">{event.summary}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.9375rem] text-navy-800">
          <span>
            {formatTime(event.startsAt)}
            {event.endsAt ? ` to ${formatTime(event.endsAt)}` : ""}
          </span>
          {event.venue && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              {event.venue}
            </span>
          )}
        </p>
      </div>
      <div className="relative hidden aspect-[4/3] overflow-hidden lg:block">
        {event.image ? (
          <Photo image={event.image} sizes="17rem" alt="" className="transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none" />
        ) : (
          <div className="grain absolute inset-0 bg-sand" />
        )}
        <span aria-hidden="true" className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center bg-ivory text-navy-900 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
        </span>
      </div>
    </article>
  );
}
