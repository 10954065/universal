import Link from "next/link";
import { MapPin, MonitorPlay } from "lucide-react";
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

/** Editorial timetable of gatherings. Shows a friendly fallback when no schedule is published. */
export function ServiceList({ services, tone = "light" }: ServiceListProps) {
  const dark = tone === "dark";

  if (services.length === 0) {
    return (
      <div className={`border-y py-10 ${dark ? "border-ivory/15" : "border-navy-900/15"}`}>
        <p className={`font-display text-display-sm font-semibold ${dark ? "text-ivory" : "text-navy-900"}`}>
          Our service schedule is being updated.
        </p>
        <p className={`mt-3 max-w-xl leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>
          We would love to welcome you in person. Please{" "}
          <Link href="/contact" className={`underline underline-offset-4 ${dark ? "decoration-gold text-ivory" : "decoration-gold-ink text-navy-900"}`}>
            get in touch
          </Link>{" "}
          and we will share our current gathering times.
        </p>
      </div>
    );
  }

  return (
    <ul className={`divide-y border-y ${dark ? "divide-ivory/15 border-ivory/15" : "divide-navy-900/12 border-navy-900/15"}`}>
      {services.map((service) => {
        const online = safeExternalUrl(service.onlineUrl);
        const time = service.endTime ? `${formatClock(service.startTime)} to ${formatClock(service.endTime)}` : formatClock(service.startTime);
        return (
          <li key={service.id} className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline">
            <p className={`font-display text-3xl font-semibold ${dark ? "text-gold" : "text-gold-ink"}`}>{WEEKDAY_LABELS[service.day]}</p>
            <div>
              <h3 className={`text-lg font-semibold ${dark ? "text-ivory" : "text-navy-900"}`}>{service.name}</h3>
              <div className={`mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] ${dark ? "text-mist" : "text-muted"}`}>
                {service.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    {service.location}
                  </span>
                )}
                {online && (
                  <a
                    href={online}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 underline underline-offset-4 ${dark ? "decoration-gold/60 hover:text-ivory" : "decoration-gold-ink/60 hover:text-navy-900"}`}
                  >
                    <MonitorPlay aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                    Join online<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
              {service.notes && <p className={`mt-2 text-sm ${dark ? "text-mist" : "text-muted"}`}>{service.notes}</p>}
            </div>
            <p className={`text-base font-medium tabular-nums sm:text-right ${dark ? "text-ivory" : "text-navy-900"}`}>{time}</p>
          </li>
        );
      })}
    </ul>
  );
}
