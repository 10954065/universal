import type { SiteSettingsView } from "@/lib/content";
import { safeExternalUrl, whatsappHref } from "@/lib/safe-url";

type Network = "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "whatsapp";

// Simplified brand glyphs (24×24). Lucide no longer ships brand icons.
const PATHS: Record<Network, string> = {
  facebook: "M14 8.5V6.8c0-.8.5-1 .9-1H17V2.5h-2.9C11 2.5 10.3 4.8 10.3 6.3v2.2H8v3.4h2.3V21.5H14v-9.6h2.7l.4-3.4H14Z",
  instagram:
    "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.9-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3.6c2.7 0 3 0 4.1.1 2.8.1 4.1 1.5 4.2 4.2.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4.1-4.2 4.2-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.8-.1-4.1-1.5-4.2-4.2C3.6 15 3.6 14.7 3.6 12s0-3 .1-4.1C3.8 5.2 5.1 3.8 7.9 3.7 9 3.6 9.3 3.6 12 3.6ZM12 2c-2.7 0-3.1 0-4.1.1C4.2 2.2 2.2 4.2 2.1 7.9 2 8.9 2 9.3 2 12s0 3.1.1 4.1c.1 3.7 2.1 5.7 5.8 5.8 1 .1 1.4.1 4.1.1s3.1 0 4.1-.1c3.7-.1 5.7-2.1 5.8-5.8.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-3.7-2.1-5.7-5.8-5.8C15.1 2 14.7 2 12 2Z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
  tiktok:
    "M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.7a7.7 7.7 0 0 0 4.4 1.4V6.8a4.4 4.4 0 0 1-4.4-4.8Z",
  x: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z",
  whatsapp:
    "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z",
};

const LABELS: Record<Network, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X (Twitter)",
  whatsapp: "WhatsApp",
};

export function SocialIcon({ network, className = "h-5 w-5" }: { network: Network; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={PATHS[network]} />
    </svg>
  );
}

/** Lists only the official channels configured in Site settings. Renders nothing when none are set. */
export function getSocialChannels(settings: SiteSettingsView): { network: Network; href: string }[] {
  const candidates: [Network, string | undefined][] = [
    ["facebook", safeExternalUrl(settings.facebookUrl)],
    ["instagram", safeExternalUrl(settings.instagramUrl)],
    ["youtube", safeExternalUrl(settings.youtubeUrl)],
    ["tiktok", safeExternalUrl(settings.tiktokUrl)],
    ["x", safeExternalUrl(settings.xUrl)],
    ["whatsapp", whatsappHref(settings.whatsapp)],
  ];
  return candidates.filter((entry): entry is [Network, string] => Boolean(entry[1])).map(([network, href]) => ({ network, href }));
}

export function SocialLinks({ settings, tone = "dark" }: { settings: SiteSettingsView; tone?: "light" | "dark" }) {
  const channels = getSocialChannels(settings);
  if (channels.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {channels.map(({ network, href }) => (
        <li key={network}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-11 w-11 items-center justify-center border transition-colors ${
              tone === "dark"
                ? "border-ivory/20 text-ivory hover:border-gold hover:text-gold"
                : "border-navy-900/20 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-ivory"
            }`}
          >
            <SocialIcon network={network} />
            <span className="sr-only">
              {LABELS[network]} (opens in a new tab)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
