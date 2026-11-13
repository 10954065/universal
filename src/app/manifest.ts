import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

/** Web app manifest: name, colours and home-screen icons drawn from the ministry's logo. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  return {
    name: settings.ministryName,
    short_name: settings.shortName,
    description: settings.seoDescription ?? undefined,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
