interface CalendarEvent {
  slug: string;
  title: string;
  summary: string;
  startsAt: Date;
  endsAt: Date | null;
  venue: string | null;
  address: string | null;
}

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

/** 20261102T170000Z */
function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function endOf(event: CalendarEvent): Date {
  return event.endsAt ?? new Date(event.startsAt.getTime() + DEFAULT_DURATION_MS);
}

function location(event: CalendarEvent): string {
  return [event.venue, event.address].filter(Boolean).join(", ");
}

export function googleCalendarUrl(event: CalendarEvent, url: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${icsDate(event.startsAt)}/${icsDate(endOf(event))}`,
    details: `${event.summary}\n\n${url}`,
    location: location(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escapes text per RFC 5545 §3.3.11. */
function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (match) => `\\${match}`);
}

/** Folds lines longer than 75 octets per RFC 5545 §3.1. */
function fold(line: string): string {
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

export function buildIcs(event: CalendarEvent, url: string, organiser: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${escapeIcs(organiser)}//Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${new URL(url).hostname}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(event.startsAt)}`,
    `DTEND:${icsDate(endOf(event))}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(`${event.summary}\n\n${url}`)}`,
    ...(location(event) ? [`LOCATION:${escapeIcs(location(event))}`] : []),
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(fold).join("\r\n")}\r\n`;
}
