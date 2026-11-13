import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { getSiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import { RevealObserver } from "@/components/site/reveal-observer";
import "./globals.css";

// Inter carries headlines and body text; IBM Plex Mono sets the small spaced labels.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SHARE_CARD = "/images/brand/share-card.jpg";

// The names people search for: the ministry, its leader, motto and congregations.
const SEARCH_KEYWORDS = [
  "Universal Trinity Ministry",
  "UTM church",
  "UTM Ghana",
  "church in Ghana",
  "Christian ministry in Ghana",
  "Bishop Esther Korkor Wilson",
  "Kristo Nti Yeyɛ Adehyieɛ",
  "Through Christ We Reign",
  "Ebenezer Temple Adenta Frafraha",
  "Holy Ghost Temple Somanya",
  "Shiloh Emmanuel Temple Dodowa",
  "Miracle Temple Ayikuma",
  "church in Adenta",
  "church in Somanya",
  "church in Dodowa",
  "sermons",
  "prayer requests",
];

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description =
    settings.seoDescription ||
    "Universal Trinity Ministry is a church in Ghana. Find service times, watch sermons and plan your visit.";
  // An image chosen in Site settings wins; otherwise the branded 1200x630 card is shared.
  const ogImage = settings.ogImage
    ? { url: settings.ogImage.url, alt: settings.ogImage.alt || settings.ministryName }
    : { url: SHARE_CARD, width: 1200, height: 630, alt: `${settings.ministryName}: ${settings.tagline ?? "Through Christ, We Reign."}` };
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: settings.seoTitle || settings.ministryName, template: `%s | ${settings.ministryName}` },
    description,
    applicationName: settings.ministryName,
    keywords: SEARCH_KEYWORDS,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
    openGraph: {
      type: "website",
      siteName: settings.ministryName,
      locale: "en_GH",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint so scroll-reveal never flashes content. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <RevealObserver />
        {plausibleDomain && (
          <Script
            nonce={nonce}
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
