import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar";

const event = {
  slug: "prayer-evening",
  title: "Prayer, Praise; Worship",
  summary: "An evening of prayer.\nAll are welcome.",
  startsAt: new Date("2026-11-01T17:00:00Z"),
  endsAt: null,
  venue: "Main Sanctuary",
  address: "Accra",
};
const URL_ = "https://example.org/events/prayer-evening";

describe("buildIcs", () => {
  const ics = buildIcs(event, URL_, "Universal Trinity Ministry");
  const lines = ics.split("\r\n");

  it("produces a single VEVENT with UTC times and a two-hour default length", () => {
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("DTSTART:20261101T170000Z");
    expect(ics).toContain("DTEND:20261101T190000Z");
    expect(ics).toContain("UID:prayer-evening@example.org");
  });

  it("escapes commas, semicolons and newlines (RFC 5545)", () => {
    expect(ics).toContain("SUMMARY:Prayer\\, Praise\\; Worship");
    expect(ics).toContain("An evening of prayer.\\nAll are welcome.");
    expect(ics).toContain("LOCATION:Main Sanctuary\\, Accra");
  });

  it("uses CRLF line endings and folds long lines", () => {
    expect(ics.endsWith("\r\n")).toBe(true);
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(75);
  });
});

describe("googleCalendarUrl", () => {
  it("links to a pre-filled Google Calendar event", () => {
    const url = new URL(googleCalendarUrl(event, URL_));
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe("20261101T170000Z/20261101T190000Z");
    expect(url.searchParams.get("text")).toBe(event.title);
  });
});
