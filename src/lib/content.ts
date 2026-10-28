import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { buildSermonWhere, SERMONS_PER_PAGE, type SermonFilters } from "@/lib/sermon-query";
import { WEEKDAY_ORDER } from "@/lib/format";

/*
 * Read-only queries used by public pages. Every query here filters to published
 * content; draft, private and administrative data is never selected.
 * `cache` de-duplicates identical calls within one request (layout + page).
 */

const image = { select: { url: true, alt: true, width: true, height: true, focalX: true, focalY: true } } as const;

export const getSiteSettings = cache(async () => {
  const settings = await db.siteSettings.findUnique({ where: { id: 1 }, include: { logo: image, ogImage: image } });
  return (
    settings ?? {
      id: 1,
      ministryName: "Universal Trinity Ministry",
      shortName: "UTM",
      tagline: null,
      logoId: null,
      logo: null,
      email: null,
      phone: null,
      whatsapp: null,
      addressLine: null,
      city: null,
      region: null,
      country: "Ghana",
      mapEmbedUrl: null,
      directionsUrl: null,
      facebookUrl: null,
      instagramUrl: null,
      youtubeUrl: null,
      tiktokUrl: null,
      xUrl: null,
      seoTitle: null,
      seoDescription: null,
      ogImageId: null,
      ogImage: null,
      footerText: null,
      givingIntro: null,
      bankInstructions: null,
      momoInstructions: null,
      givingContact: null,
      onlineGivingEnabled: false,
      newsletterEnabled: false,
      prayerRetentionDays: 180,
      updatedAt: new Date(0),
    }
  );
});

export type SiteSettingsView = Awaited<ReturnType<typeof getSiteSettings>>;

export const getHomepage = cache(async () =>
  db.homepageContent.findUnique({
    where: { id: 1 },
    include: {
      heroImage: image,
      welcomeImage: image,
      outreachImage: image,
      featuredSermon: { include: { speaker: true, category: true, thumbnail: image } },
    },
  }),
);

export const getActiveAnnouncement = cache(async () => {
  const now = new Date();
  return db.announcement.findFirst({
    where: {
      active: true,
      AND: [{ OR: [{ startsAt: null }, { startsAt: { lte: now } }] }, { OR: [{ endsAt: null }, { endsAt: { gt: now } }] }],
    },
    orderBy: { createdAt: "desc" },
  });
});

export const getServiceTimes = cache(async () => {
  const services = await db.serviceTime.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }] });
  return [...services].sort(
    (a, b) => a.sortOrder - b.sortOrder || WEEKDAY_ORDER.indexOf(a.day) - WEEKDAY_ORDER.indexOf(b.day) || a.startTime.localeCompare(b.startTime),
  );
});

export const getPageSections = cache(async (page: string) =>
  db.pageSection.findMany({
    where: { page, status: "PUBLISHED", NOT: { body: "" } },
    orderBy: { sortOrder: "asc" },
    select: { key: true, title: true, body: true },
  }),
);

/** Returns published sections for a page as a key → section map. */
export async function getPageSectionMap(page: string) {
  const sections = await getPageSections(page);
  return new Map(sections.map((section) => [section.key, section]));
}

export const getPublishedMinistries = cache(async () =>
  db.ministry.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { image } }),
);

export const getMinistryBySlug = cache(async (slug: string) =>
  db.ministry.findFirst({ where: { slug, status: "PUBLISHED" }, include: { image } }),
);

export const getPublishedLeaders = cache(async () =>
  db.leadershipProfile.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { image } }),
);

export const getPublishedOutreach = cache(async () =>
  db.outreachProgramme.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" }, include: { image } }),
);

// ─── Sermons ────────────────────────────────────────────────────────────

const sermonInclude = { speaker: true, category: true, thumbnail: image } as const;

export async function getSermonPage(filters: SermonFilters) {
  const where = buildSermonWhere(filters);
  const [total, sermons] = await Promise.all([
    db.sermon.count({ where }),
    db.sermon.findMany({
      where,
      include: sermonInclude,
      orderBy: { preachedAt: "desc" },
      skip: (filters.page - 1) * SERMONS_PER_PAGE,
      take: SERMONS_PER_PAGE,
    }),
  ]);
  return { total, sermons, pageCount: Math.max(1, Math.ceil(total / SERMONS_PER_PAGE)) };
}

export const getSermonFacets = cache(async () => {
  const [speakers, categories] = await Promise.all([
    db.speaker.findMany({ where: { sermons: { some: { status: "PUBLISHED" } } }, orderBy: { name: "asc" } }),
    db.sermonCategory.findMany({ where: { sermons: { some: { status: "PUBLISHED" } } }, orderBy: { name: "asc" } }),
  ]);
  return { speakers, categories };
});

export const getSermonBySlug = cache(async (slug: string) =>
  db.sermon.findFirst({ where: { slug, status: "PUBLISHED" }, include: sermonInclude }),
);

export async function getRelatedSermons(sermon: { id: string; speakerId: string | null; categoryId: string | null }) {
  const related = [
    ...(sermon.speakerId ? [{ speakerId: sermon.speakerId }] : []),
    ...(sermon.categoryId ? [{ categoryId: sermon.categoryId }] : []),
  ];
  return db.sermon.findMany({
    where: { status: "PUBLISHED", id: { not: sermon.id }, ...(related.length ? { OR: related } : {}) },
    include: sermonInclude,
    orderBy: { preachedAt: "desc" },
    take: 3,
  });
}

export const getLatestSermon = cache(async () =>
  db.sermon.findFirst({ where: { status: "PUBLISHED" }, include: sermonInclude, orderBy: { preachedAt: "desc" } }),
);

// ─── Events ─────────────────────────────────────────────────────────────

/** An event is "upcoming" until it ends (or, with no end time, until it starts). */
function upcomingWhere(now: Date) {
  return { OR: [{ endsAt: { gte: now } }, { endsAt: null, startsAt: { gte: now } }] };
}

export async function getUpcomingEvents(limit?: number) {
  const now = new Date();
  return db.event.findMany({
    where: { status: { in: ["PUBLISHED", "CANCELLED"] }, ...upcomingWhere(now) },
    include: { image },
    orderBy: [{ featured: "desc" }, { startsAt: "asc" }],
    take: limit,
  });
}

export async function getPastEvents(limit = 12) {
  const now = new Date();
  return db.event.findMany({
    where: { status: { in: ["PUBLISHED", "ARCHIVED"] }, NOT: upcomingWhere(now) },
    include: { image },
    orderBy: { startsAt: "desc" },
    take: limit,
  });
}

export const getEventBySlug = cache(async (slug: string) =>
  db.event.findFirst({
    where: { slug, status: { in: ["PUBLISHED", "CANCELLED", "ARCHIVED"] } },
    include: { image },
  }),
);

/** Total people registered (sum of party sizes) — what event capacity is measured against. */
export async function getRegisteredAttendees(eventId: string): Promise<number> {
  const result = await db.eventRegistration.aggregate({ where: { eventId }, _sum: { attendees: true } });
  return result._sum.attendees ?? 0;
}

/** Looks up library photos by file name (e.g. "worship-singer.jpg"), for decorative accents. */
export const getLibraryPhotos = cache(async (...files: string[]) => {
  const assets = await db.mediaAsset.findMany({
    where: { storageKey: { in: files.map((file) => `static/ministry/${file}`) } },
    select: { storageKey: true, ...image.select },
  });
  return new Map(assets.map((asset) => [asset.storageKey.replace("static/ministry/", ""), asset]));
});

export const getActiveGivingCategories = cache(async () =>
  db.givingCategory.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
);
