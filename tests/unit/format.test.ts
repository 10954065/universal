import { describe, expect, it } from "vitest";
import { formatClock, formatEventWindow, formatLongDate, formatMoney, formatShortDate, formatTime, parseLocalDateTime, toLocalDateTimeInput } from "@/lib/format";

describe("Ghana time (GMT, no daylight saving)", () => {
  it("shows a late-evening UTC time on the same calendar day", () => {
    const date = new Date("2026-11-01T23:30:00Z");
    expect(formatLongDate(date)).toContain("Sunday");
    expect(formatLongDate(date)).toContain("1 November 2026");
    expect(formatShortDate(date)).toBe("1 Nov 2026");
    expect(formatTime(date)).toBe("11:30 pm");
  });

  it("describes an event window, collapsing the date when it ends the same day", () => {
    const start = new Date("2026-11-01T17:00:00Z");
    expect(formatEventWindow(start, new Date("2026-11-01T19:00:00Z"))).toMatch(/5:00 pm to 7:00 pm$/);
    expect(formatEventWindow(start, null)).toMatch(/5:00 pm$/);
    expect(formatEventWindow(start, new Date("2026-11-03T12:00:00Z"))).toContain("3 November 2026");
  });
});

describe("formatClock", () => {
  it.each([
    ["09:30", "9:30 am"],
    ["9:05", "9:05 am"],
    ["00:15", "12:15 am"],
    ["12:00", "12:00 pm"],
    ["18:45", "6:45 pm"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatClock(input)).toBe(expected);
  });

  it("returns malformed values unchanged", () => {
    expect(formatClock("25:00")).toBe("25:00");
    expect(formatClock("after service")).toBe("after service");
  });
});

describe("formatMoney", () => {
  it("formats pesewas as cedis", () => {
    expect(formatMoney(5000)).toMatch(/50\.00/);
    expect(formatMoney(5000)).toContain("₵");
    expect(formatMoney(123456)).toMatch(/1,234\.56/);
  });
});

describe("datetime-local round trip", () => {
  it("interprets editor input as ministry time and formats it back", () => {
    const date = parseLocalDateTime("2026-11-02T09:30");
    expect(date?.toISOString()).toBe("2026-11-02T09:30:00.000Z");
    expect(toLocalDateTimeInput(date)).toBe("2026-11-02T09:30");
  });

  it("rejects malformed or impossible values", () => {
    expect(parseLocalDateTime("2026-11-02")).toBeNull();
    expect(parseLocalDateTime("2026-13-40T99:99")).toBeNull();
    expect(toLocalDateTimeInput(null)).toBe("");
  });
});
