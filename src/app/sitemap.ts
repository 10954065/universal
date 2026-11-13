import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/** Lists every public page plus published (non-sample) sermons, events and ministries. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [sermons, events, ministries] = await Promise.all([
    db.sermon.findMany({ where: { status: "PUBLISHED", isSample: false }, select: { slug: true, updatedAt: true } }),
    db.event.findMany({ where: { status: { in: ["PUBLISHED", "CANCELLED", "ARCHIVED"] }, isSample: false }, select: { slug: true, updatedAt: true } }),
    db.ministry.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  // Listing pages join the sitemap once they have something to list (empty ones are noindex).
  const staticPaths = [
    "",
    "/about",
    "/leadership",
    "/ministries",
    ...(sermons.length ? ["/sermons"] : []),
    ...(events.length ? ["/events"] : []),
    "/give",
    "/contact",
    "/plan-your-visit",
    "/prayer",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 })),
    ...sermons.map((item) => ({ url: `${base}/sermons/${item.slug}`, lastModified: item.updatedAt })),
    ...events.map((item) => ({ url: `${base}/events/${item.slug}`, lastModified: item.updatedAt })),
    ...ministries.map((item) => ({ url: `${base}/ministries/${item.slug}`, lastModified: item.updatedAt })),
  ];
}
