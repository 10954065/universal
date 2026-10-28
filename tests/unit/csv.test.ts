import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";

const body = (csv: string) => csv.replace(/^﻿/, "").split("\r\n");

describe("toCsv", () => {
  it("starts with a BOM and uses CRLF line endings", () => {
    const csv = toCsv(["A"], [["1"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv.endsWith("\r\n")).toBe(true);
  });

  it("quotes commas, quotes and newlines", () => {
    expect(body(toCsv(["Name"], [['Ama "Grace", Mensah'], ["line1\nline2"]])).slice(1, 3)).toEqual(['"Ama ""Grace"", Mensah"', '"line1\nline2"']);
  });

  it.each(["=HYPERLINK(\"http://evil\")", "+1+1", "-2+3", "@SUM(A1)", "\tcmd"])("neutralises spreadsheet formula %j", (value) => {
    expect(body(toCsv(["X"], [[value]]))[1]?.replace(/^"/, "").startsWith("'")).toBe(true);
  });

  it("renders empty values, numbers and dates", () => {
    expect(body(toCsv(["a", "b", "c", "d"], [[null, undefined, 42, new Date("2026-11-01T00:00:00Z")]]))[1]).toBe(",,42,2026-11-01T00:00:00.000Z");
  });
});
