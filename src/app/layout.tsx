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
  const ogImage = settings.ogImage?.url ?? "/images/ministry/congregation-shiloh.jpg";
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: settings.seoTitle || settings.ministryName, template: `%s | ${settings.ministryName}` },
    description,
    applicationName: settings.ministryName,
    openGraph: {
      type: "website",
      siteName: settings.ministryName,
      locale: "en_GH",
      images: [{ url: ogImage, alt: settings.ministryName }],
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/icon.svg" },
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
