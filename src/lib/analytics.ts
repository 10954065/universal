/**
 * Privacy-conscious analytics events. Only event names and non-identifying
 * properties are sent — never form contents, prayer text, names, emails or
 * payment details. No-op when analytics is not configured.
 */
export type AnalyticsEvent =
  | "Plan Visit Click"
  | "Sermon Play"
  | "Event Registration"
  | "Contact Submitted"
  | "Visit Enquiry Submitted"
  | "Donation Started";

type Plausible = (event: string, options?: { props?: Record<string, string | number> }) => void;

export function track(event: AnalyticsEvent, props?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: Plausible }).plausible;
  if (typeof plausible === "function") plausible(event, props ? { props } : undefined);
}
