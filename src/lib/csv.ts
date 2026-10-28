/**
 * Builds RFC 4180 CSV. Cells starting with = + - @ (or tab/CR) are prefixed with an
 * apostrophe so spreadsheet apps never execute them as formulas (CSV injection).
 */
export function toCsv(header: string[], rows: (string | number | boolean | Date | null | undefined)[][]): string {
  const cell = (value: string | number | boolean | Date | null | undefined): string => {
    if (value === null || value === undefined) return "";
    let text = value instanceof Date ? value.toISOString() : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  // A BOM makes Excel open UTF-8 (e.g. "GH₵") correctly.
  return `﻿${[header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n")}\r\n`;
}
