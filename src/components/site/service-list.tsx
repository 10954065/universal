import Link from "next/link";
import { MonitorPlay } from "lucide-react";
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

/** Gatherings as numbered white cards. Shows a friendly fallback when no schedule is published. */
export function ServiceList({ services, tone = "light" }: ServiceListProps) {
  const dark = tone === "dark";
  const card = dark ? "bg-white/[0.06] text-white" : "bg-ivory text-navy-900";
  const soft = dark ? "text-mist" : "text-muted";

  if (services.length === 0) {
    return (
      <div className={`p-8 sm:p-12 ${card}`}>
        <p className="text-display-sm">Our service schedule is being updated.</p>
        <p className={`mt-3 max-w-xl leading-relaxed ${soft}`}>
          We would love to welcome you in person. Please{" "}
          <Link href="/contact" className="underline underline-offset-4">
            get in touch
          </Link>{" "}
          and we will share our current gathering times.
        </p>
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
            <p className="text-2xl tabular-nums">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-10 text-[1.375rem] font-medium leading-snug tracking-[-0.02em]">{service.name}</h3>
            <p className="mt-1 text-[1.375rem] leading-snug tracking-[-0.02em]">
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
