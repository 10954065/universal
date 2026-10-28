// Ghana observes GMT all year (no daylight saving). All public dates render in this zone.
export const MINISTRY_TIME_ZONE = "Africa/Accra";
const LOCALE = "en-GB";

export const WEEKDAY_LABELS: Record<string, string> = {
  SUNDAY: "Sunday",
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
};

export const WEEKDAY_ORDER = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

function fmt(date: Date, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: MINISTRY_TIME_ZONE, ...options }).format(date);
}

/** "Sunday, 2 November 2026" */
export function formatLongDate(date: Date): string {
  return fmt(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/** "2 Nov 2026" */
export function formatShortDate(date: Date): string {
  return fmt(date, { day: "numeric", month: "short", year: "numeric" });
}

/** "9:30 am" */
export function formatTime(date: Date): string {
  return fmt(date, { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

export function formatDateParts(date: Date): { day: string; month: string; weekday: string; year: string } {
  return {
    day: fmt(date, { day: "numeric" }),
    month: fmt(date, { month: "short" }),
    weekday: fmt(date, { weekday: "short" }),
    year: fmt(date, { year: "numeric" }),
  };
}

/** Converts a stored "HH:MM" 24-hour string into "9:30 am". Returns the input when malformed. */
export function formatClock(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const hours = Number(match[1]);
  const minutes = match[2];
  if (hours > 23) return value;
  const suffix = hours >= 12 ? "pm" : "am";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes} ${suffix}`;
}

export function formatEventWindow(startsAt: Date, endsAt: Date | null): string {
  const start = `${formatLongDate(startsAt)} · ${formatTime(startsAt)}`;
  if (!endsAt) return start;
  const sameDay = formatShortDate(startsAt) === formatShortDate(endsAt);
  return sameDay ? `${start} – ${formatTime(endsAt)}` : `${start} – ${formatLongDate(endsAt)} · ${formatTime(endsAt)}`;
}

/** Formats an amount held in minor units (pesewas) as "GH₵ 50.00". */
export function formatMoney(amountMinor: number, currency = "GHS"): string {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(amountMinor / 100);
}

/** Converts a datetime-local input value (interpreted in ministry time, GMT) to a Date. */
export function parseLocalDateTime(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a Date for a datetime-local input, in ministry time (GMT). */
export function toLocalDateTimeInput(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 16);
}
