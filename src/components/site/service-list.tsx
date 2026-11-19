import Link from "next/link";
import { CalendarClock, MonitorPlay } from "lucide-react";
import { formatClock, WEEKDAY_LABELS } from "@/lib/format";
import { safeExternalUrl } from "@/lib/safe-url";

export interface ServiceItem {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string | null;
  location: string | null;
  onlineUrl: string | null;
  notes: string | null;
}

interface ServiceListProps {
  services: ServiceItem[];
  tone?: "light" | "dark";
}

/** Gatherings as numbered rounded cards. Shows a friendly fallback when no schedule is published. */
export function ServiceList({ services, tone = "light" }: ServiceListProps) {
  const dark = tone === "dark";
  const card = dark ? "rounded-card bg-white/[0.07] text-white ring-1 ring-white/15" : "rounded-card bg-ivory text-navy-900 ring-1 ring-line";
  const soft = dark ? "text-mist" : "text-muted";

  if (services.length === 0) {
    return (
      <div className={`flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:p-12 ${card}`}>
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold text-navy-900">
          <CalendarClock className="h-7 w-7" strokeWidth={2} />
        </span>
        <div>
          <p className="text-display-sm">Our service schedule is being updated.</p>
          <p className={`mt-3 max-w-xl leading-relaxed ${soft}`}>
            We would love to welcome you in person. Please{" "}
            <Link href="/contact" className={`font-semibold underline decoration-2 underline-offset-4 ${dark ? "decoration-gold" : "decoration-gold-ink"}`}>
              get in touch
            </Link>{" "}
            and we will share our current gathering times.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {services.map((service, index) => {
        const online = safeExternalUrl(service.onlineUrl);
        const time = service.endTime ? `${formatClock(service.startTime)} to ${formatClock(service.endTime)}` : formatClock(service.startTime);
        return (
          <li key={service.id} className={`flex flex-col p-8 sm:p-10 ${card}`}>
            <p className="flex h-12 w-12 items-center justify-center rounded-full bg-gold font-display text-lg font-extrabold tabular-nums text-navy-900">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-8 text-display-sm">{service.name}</h3>
            <p className={`mt-2 font-display text-xl font-semibold leading-snug tracking-[-0.02em] ${dark ? "text-gold" : "text-royal"}`}>
              {WEEKDAY_LABELS[service.day]}s, {time}
            </p>
            {service.location && <p className={`mt-6 font-mono text-[0.875rem] ${soft}`}>{service.location}</p>}
            {service.notes && <p className={`mt-2 text-sm ${soft}`}>{service.notes}</p>}
            {online && (
              <a href={online} target="_blank" rel="noopener noreferrer" className="label mt-6 inline-flex items-center gap-2 hover:opacity-60">
                <MonitorPlay aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                Join online<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
