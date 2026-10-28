import { describe, expect, it } from "vitest";
import { safeExternalUrl, safeHref, safeMapEmbedUrl, telHref, whatsappHref } from "@/lib/safe-url";

describe("safeHref", () => {
  it.each(["/about", "/events?view=past", "#top", "https://example.org/x", "http://example.org", "mailto:info@example.org", "tel:+233241234567"])(
    "allows %s",
    (href) => {
      expect(safeHref(href)).toBe(href);
    },
  );

  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", " javascript:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:x", "//evil.example", "not a url", "", null, undefined])(
    "blocks %j",
    (href) => {
      expect(safeHref(href)).toBeUndefined();
    },
  );
});

describe("safeExternalUrl", () => {
  it("accepts https only", () => {
    expect(safeExternalUrl("https://facebook.com/ministry")).toBe("https://facebook.com/ministry");
    expect(safeExternalUrl("http://facebook.com/ministry")).toBeUndefined();
    expect(safeExternalUrl("javascript:alert(1)")).toBeUndefined();
  });
});

describe("safeMapEmbedUrl", () => {
  it("only allows Google Maps embeds", () => {
    expect(safeMapEmbedUrl("https://www.google.com/maps/embed?pb=abc")).toBe("https://www.google.com/maps/embed?pb=abc");
    expect(safeMapEmbedUrl("https://www.google.com/search?q=x")).toBeUndefined();
    expect(safeMapEmbedUrl("https://evil.example/maps/embed?pb=abc")).toBeUndefined();
  });
});

describe("phone links", () => {
  it("converts Ghana local numbers to international WhatsApp links", () => {
    expect(whatsappHref("024 123 4567")).toBe("https://wa.me/233241234567");
    expect(whatsappHref("+233 24 123 4567")).toBe("https://wa.me/233241234567");
    expect(whatsappHref("123")).toBeUndefined();
  });

  it("builds tel: links and rejects fragments", () => {
    expect(telHref("+233 (24) 123-4567")).toBe("tel:+233241234567");
    expect(telHref("12")).toBeUndefined();
  });
});
