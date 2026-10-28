/**
 * Returns the href if it is a site-relative path or an http(s)/mailto/tel URL; otherwise undefined.
 * Blocks javascript:, data: and other executable schemes in editor-supplied links.
 */
export function safeHref(href: string | null | undefined): string | undefined {
  if (!href) return undefined;
  const value = href.trim();
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (value.startsWith("#")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Accepts only absolute https URLs (for social profiles, streaming links, etc.). */
export function safeExternalUrl(href: string | null | undefined): string | undefined {
  if (!href) return undefined;
  try {
    const url = new URL(href.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Only Google Maps embed URLs may be framed (matches the CSP frame-src allowance). */
export function safeMapEmbedUrl(href: string | null | undefined): string | undefined {
  const url = safeExternalUrl(href);
  if (!url) return undefined;
  const parsed = new URL(url);
  return parsed.hostname === "www.google.com" && parsed.pathname.startsWith("/maps/embed") ? url : undefined;
}

/** Builds a WhatsApp click-to-chat link from a phone number in any common format. */
export function whatsappHref(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("0")) digits = `233${digits.slice(1)}`; // Ghana local format
  return /^\d{9,15}$/.test(digits) ? `https://wa.me/${digits}` : undefined;
}

export function telHref(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined;
  const cleaned = phone.replace(/[^\d+]/g, "");
  return cleaned.length >= 7 ? `tel:${cleaned}` : undefined;
}
