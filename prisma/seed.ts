/**
 * Seeds the baseline content every installation needs. Safe to run repeatedly:
 * existing rows are never overwritten, so edits made in the dashboard survive.
 *
 *   npm run db:seed
 *
 * Sample sermons/events are created ONLY when SEED_SAMPLE_CONTENT=true and
 * NODE_ENV is not "production". They are titled "[Sample] ..." and flagged isSample.
 */
import "dotenv/config";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { HOMEPAGE, PAGE_SECTIONS, PHOTOS, SUGGESTED_MINISTRIES, type SeedPhoto } from "./seed-data";
import { ABOUT_SECTIONS, FOOTER_TEXT, LEADERS, LEADERSHIP_SECTIONS, LOGO, MOTTO, type OfficialSection } from "./official-content";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const PHOTO_DIR = path.join(process.cwd(), "public", "images", "ministry");
const MINISTRY_NAME = "Universal Trinity Ministry";

/** Reads width/height from a baseline or progressive JPEG's SOF marker. */
function jpegSize(file: string): { width: number; height: number } | null {
  const buf = readFileSync(file);
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) return null;
    const marker = buf[offset + 1]!;
    const length = buf.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

/** Registers a bundled JPEG from public/images/ministry in the media library. */
async function upsertPhoto(photo: SeedPhoto) {
  const filePath = path.join(PHOTO_DIR, photo.file);
  const size = jpegSize(filePath);
  const storageKey = `static/ministry/${photo.file}`;
  return db.mediaAsset.upsert({
    where: { storageKey },
    update: {},
    create: {
      storageKey,
      url: `/images/ministry/${photo.file}`,
      alt: photo.alt,
      width: size?.width,
      height: size?.height,
      mimeType: "image/jpeg",
      sizeBytes: statSync(filePath).size,
      focalX: photo.focalX ?? 50,
      focalY: photo.focalY ?? 50,
    },
  });
}

async function seedMedia() {
  const byFile = new Map<string, string>();
  for (const photo of PHOTOS) {
    const asset = await upsertPhoto(photo);
    byFile.set(photo.file, asset.id);
  }
  return byFile;
}

async function seedBaseline(media: Map<string, string>) {
  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1, ministryName: MINISTRY_NAME } });

  await db.homepageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroHeading: HOMEPAGE.heroHeading,
      heroText: HOMEPAGE.heroText,
      heroImageId: media.get(HOMEPAGE.heroImage),
      welcomeHeading: HOMEPAGE.welcomeHeading,
      welcomeText: HOMEPAGE.welcomeText,
      welcomeImageId: media.get(HOMEPAGE.welcomeImage),
      scriptureText: HOMEPAGE.scriptureText,
      scriptureReference: HOMEPAGE.scriptureReference,
      scriptureTranslation: HOMEPAGE.scriptureTranslation,
      outreachHeading: HOMEPAGE.outreachHeading,
      outreachText: HOMEPAGE.outreachText,
      outreachImageId: media.get(HOMEPAGE.outreachImage),
    },
  });

  for (const section of PAGE_SECTIONS) {
    await db.pageSection.upsert({
      where: { key: section.key },
      update: {},
      create: {
        key: section.key,
        page: section.page,
        title: section.title,
        sortOrder: section.sortOrder,
        editorNote: section.editorNote,
        body: (section.body ?? "").replaceAll("{ministry}", MINISTRY_NAME),
        status: section.publish ? "PUBLISHED" : "DRAFT",
      },
    });
  }

  for (const [index, ministry] of SUGGESTED_MINISTRIES.entries()) {
    await db.ministry.upsert({
      where: { slug: ministry.slug },
      update: {},
      create: { ...ministry, image: undefined, imageId: media.get(ministry.image), sortOrder: index, status: "DRAFT" },
    });
  }
}

/** Applies the ministry's official logo and motto, filling only settings that are still empty. */
async function seedOfficialSettings() {
  const filePath = path.join(process.cwd(), "public", "images", "brand", LOGO.file);
  const png = readFileSync(filePath);
  const storageKey = `static/brand/${LOGO.file}`;
  const logo = await db.mediaAsset.upsert({
    where: { storageKey },
    update: {},
    create: {
      storageKey,
      url: `/images/brand/${LOGO.file}`,
      alt: LOGO.alt,
      // PNG IHDR: width and height follow the 8-byte signature and chunk header.
      width: png.readUInt32BE(16),
      height: png.readUInt32BE(20),
      mimeType: "image/png",
      sizeBytes: png.length,
    },
  });
  await db.siteSettings.updateMany({ where: { id: 1, logoId: null }, data: { logoId: logo.id } });
  await db.siteSettings.updateMany({ where: { id: 1, tagline: null }, data: { tagline: MOTTO.english } });
  await db.siteSettings.updateMany({ where: { id: 1, footerText: null }, data: { footerText: FOOTER_TEXT } });
}

/** Publishes official page copy: creates missing sections and fills ones that are still empty. */
async function seedOfficialSections(sections: OfficialSection[]) {
  for (const section of sections) {
    const existing = await db.pageSection.findUnique({ where: { key: section.key }, select: { body: true } });
    if (!existing) {
      await db.pageSection.create({ data: { ...section, status: "PUBLISHED", editorNote: "Official wording supplied by the ministry." } });
    } else if (existing.body.trim() === "") {
      await db.pageSection.update({ where: { key: section.key }, data: { title: section.title, body: section.body, sortOrder: section.sortOrder, status: "PUBLISHED" } });
    }
  }
}

/** Publishes the ministry's leader profiles; a profile that already exists is left as edited. */
async function seedOfficialLeaders() {
  for (const [index, leader] of LEADERS.entries()) {
    const portrait = leader.photo ? await upsertPhoto({ file: leader.photo, alt: `Portrait of ${leader.name}`, focalY: 25 }) : null;
    await db.leadershipProfile.upsert({
      where: { slug: leader.slug },
      update: {},
      create: { slug: leader.slug, name: leader.name, role: leader.role, bio: leader.bio, imageId: portrait?.id, sortOrder: index, status: "PUBLISHED" },
    });
  }
}

async function seedSamples(media: Map<string, string>) {
  const speaker = await db.speaker.upsert({ where: { slug: "sample-speaker" }, update: {}, create: { slug: "sample-speaker", name: "Sample Speaker" } });
  const category = await db.sermonCategory.upsert({ where: { slug: "sunday-service" }, update: {}, create: { slug: "sunday-service", name: "Sunday Service" } });
  const sermons = [
    { slug: "sample-the-lord-is-my-shepherd", title: "[Sample] The Lord Is My Shepherd", scripture: "Psalm 23", days: 7, image: "pulpit-shepherd.jpg" },
    { slug: "sample-walking-in-love", title: "[Sample] Walking in Love", scripture: "1 Corinthians 13:4-7", days: 14, image: "pulpit-preacher-1.jpg" },
    { slug: "sample-a-house-of-prayer", title: "[Sample] A House of Prayer", scripture: "Matthew 21:13", days: 21, image: "prayer-man.jpg" },
  ];
  for (const sermon of sermons) {
    await db.sermon.upsert({
      where: { slug: sermon.slug },
      update: {},
      create: {
        slug: sermon.slug,
        title: sermon.title,
        scripture: sermon.scripture,
        preachedAt: new Date(Date.now() - sermon.days * 86_400_000),
        summary: "Sample content for local development only. Replace or delete before launch.",
        speakerId: speaker.id,
        categoryId: category.id,
        thumbnailId: media.get(sermon.image),
        status: "PUBLISHED",
        isSample: true,
      },
    });
  }
  const events = [
    { slug: "sample-community-prayer-evening", title: "[Sample] Community Prayer Evening", days: 10, registration: true, image: "prayer-bowed.jpg" },
    { slug: "sample-youth-fellowship", title: "[Sample] Youth Fellowship Gathering", days: 24, registration: false, image: "youth-member.jpg" },
  ];
  for (const event of events) {
    const startsAt = new Date(Date.now() + event.days * 86_400_000);
    startsAt.setUTCHours(17, 0, 0, 0);
    await db.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: {
        slug: event.slug,
        title: event.title,
        summary: "Sample event for local development only. Replace or delete before launch.",
        startsAt,
        endsAt: new Date(startsAt.getTime() + 2 * 3_600_000),
        venue: "Sample venue",
        imageId: media.get(event.image),
        status: "PUBLISHED",
        registrationEnabled: event.registration,
        registrationCapacity: event.registration ? 80 : null,
        isSample: true,
      },
    });
  }
  console.info("Sample sermons and events created (flagged isSample).");
}

async function main() {
  const media = await seedMedia();
  await seedBaseline(media);
  await seedOfficialSettings();
  await seedOfficialSections(ABOUT_SECTIONS);
  await seedOfficialSections(LEADERSHIP_SECTIONS);
  await seedOfficialLeaders();
  console.info(`Seeded ${media.size} photos, settings, homepage, ${PAGE_SECTIONS.length} page sections, ${SUGGESTED_MINISTRIES.length} draft ministries.`);

  if (process.env.SEED_SAMPLE_CONTENT === "true") {
    if (process.env.NODE_ENV === "production") {
      console.warn("SEED_SAMPLE_CONTENT ignored: refusing to create sample content when NODE_ENV=production.");
    } else {
      await seedSamples(media);
    }
  }
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
