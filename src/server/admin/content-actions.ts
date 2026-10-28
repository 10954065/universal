"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authorize } from "@/lib/session";
import type { FormState } from "@/lib/form-state";
import {
  checkbox,
  failure,
  nullableDateTime,
  nullableEmail,
  nullableHref,
  nullableId,
  nullableText,
  nullableUrl,
  parseForm,
  publishStatus,
  requiredText,
  saved,
  sortOrder,
} from "@/server/admin/helpers";

// ─── Homepage ───────────────────────────────────────────────────────────

const homepageSchema = z.object({
  heroEyebrow: requiredText(80),
  heroHeading: requiredText(160),
  heroText: requiredText(400),
  heroImageId: nullableId,
  primaryCtaLabel: requiredText(40),
  primaryCtaHref: nullableHref.refine((value) => value !== null, "Required."),
  secondaryCtaLabel: requiredText(40),
  secondaryCtaHref: nullableHref.refine((value) => value !== null, "Required."),
  welcomeHeading: requiredText(160),
  welcomeText: requiredText(1500),
  welcomeImageId: nullableId,
  scriptureText: nullableText(800),
  scriptureReference: nullableText(80),
  scriptureTranslation: nullableText(40),
  outreachHeading: nullableText(160),
  outreachText: nullableText(1500),
  outreachImageId: nullableId,
  featuredSermonId: nullableId,
  showServices: checkbox,
  showMinistries: checkbox,
  showSermon: checkbox,
  showEvents: checkbox,
  showScripture: checkbox,
  showOutreach: checkbox,
  showNewsletter: checkbox,
});

export async function saveHomepage(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(homepageSchema, formData);
    if (!parsed.ok) return parsed.state;
    const data = { ...parsed.data, primaryCtaHref: parsed.data.primaryCtaHref!, secondaryCtaHref: parsed.data.secondaryCtaHref! };
    await db.homepageContent.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    await audit(user.id, "homepage.updated", "HomepageContent", "1");
    return saved("Homepage updated.");
  } catch (error) {
    return failure(error, "saveHomepage");
  }
}

// ─── Site settings ──────────────────────────────────────────────────────

const settingsSchema = z.object({
  ministryName: requiredText(120),
  shortName: requiredText(20),
  tagline: nullableText(200),
  logoId: nullableId,
  email: nullableEmail,
  phone: nullableText(40),
  whatsapp: nullableText(40),
  addressLine: nullableText(200),
  city: nullableText(80),
  region: nullableText(80),
  country: requiredText(80),
  mapEmbedUrl: nullableUrl.refine((value) => value === null || value.startsWith("https://www.google.com/maps/embed"), "Paste the src link from Google Maps → Share → Embed a map."),
  directionsUrl: nullableUrl,
  facebookUrl: nullableUrl,
  instagramUrl: nullableUrl,
  youtubeUrl: nullableUrl,
  tiktokUrl: nullableUrl,
  xUrl: nullableUrl,
  seoTitle: nullableText(70),
  seoDescription: nullableText(170),
  ogImageId: nullableId,
  footerText: nullableText(300),
  givingIntro: nullableText(600),
  bankInstructions: nullableText(2000),
  momoInstructions: nullableText(2000),
  givingContact: nullableText(200),
  onlineGivingEnabled: checkbox,
  newsletterEnabled: checkbox,
  prayerRetentionDays: z.coerce.number().int().min(7, "At least 7 days.").max(730, "At most 2 years."),
});

export async function saveSettings(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("settings:manage");
    const parsed = parseForm(settingsSchema, formData);
    if (!parsed.ok) return parsed.state;
    await db.siteSettings.upsert({ where: { id: 1 }, update: parsed.data, create: { id: 1, ...parsed.data } });
    await audit(user.id, "settings.updated", "SiteSettings", "1");
    return saved("Settings saved.");
  } catch (error) {
    return failure(error, "saveSettings");
  }
}

// ─── Announcements ──────────────────────────────────────────────────────

const announcementSchema = z.object({
  id: nullableId,
  message: requiredText(240),
  linkLabel: nullableText(40),
  linkHref: nullableHref,
  active: checkbox,
  startsAt: nullableDateTime,
  endsAt: nullableDateTime,
});

export async function saveAnnouncement(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(announcementSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) return { status: "error", fieldErrors: { endsAt: ["Must be after the start."] } };
    const record = id ? await db.announcement.update({ where: { id }, data }) : await db.announcement.create({ data });
    await audit(user.id, id ? "announcement.updated" : "announcement.created", "Announcement", record.id, data.message.slice(0, 80));
    if (!id) redirect(`/admin/announcements?id=${record.id}&saved=1`);
    return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveAnnouncement");
  }
}

export async function deleteAnnouncement(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  await db.announcement.delete({ where: { id } });
  await audit(user.id, "announcement.deleted", "Announcement", id);
  redirect("/admin/announcements");
}

// ─── Service times ──────────────────────────────────────────────────────

const clock = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour time, e.g. 09:30.");

const serviceSchema = z.object({
  id: nullableId,
  name: requiredText(80),
  day: z.enum(["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
  startTime: clock,
  endTime: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null))
    .refine((value) => value === null || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), "Use 24-hour time, e.g. 11:30."),
  location: nullableText(120),
  onlineUrl: nullableUrl,
  notes: nullableText(300),
  sortOrder,
  active: checkbox,
});

export async function saveService(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(serviceSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    const record = id ? await db.serviceTime.update({ where: { id }, data }) : await db.serviceTime.create({ data });
    await audit(user.id, id ? "service.updated" : "service.created", "ServiceTime", record.id, data.name);
    if (!id) redirect(`/admin/services?id=${record.id}&saved=1`);
    return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveService");
  }
}

export async function deleteService(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  await db.serviceTime.delete({ where: { id } });
  await audit(user.id, "service.deleted", "ServiceTime", id);
  redirect("/admin/services");
}

// ─── Page sections ──────────────────────────────────────────────────────

const sectionSchema = z.object({ id: requiredText(40), title: requiredText(120), body: z.string().max(30_000), status: publishStatus });

export async function savePageSection(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(sectionSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    if (data.status === "PUBLISHED" && !data.body.trim()) return { status: "error", fieldErrors: { body: ["Add content before publishing."] } };
    const record = await db.pageSection.update({ where: { id }, data });
    await audit(user.id, "page-section.updated", "PageSection", record.id, `${record.key} → ${data.status}`);
    return saved(data.status === "PUBLISHED" ? "Saved and published." : "Saved as draft (not visible on the website).");
  } catch (error) {
    return failure(error, "savePageSection");
  }
}

// ─── Giving categories ──────────────────────────────────────────────────

const givingCategorySchema = z.object({
  id: nullableId,
  name: requiredText(80),
  description: nullableText(300),
  active: checkbox,
  sortOrder,
});

export async function saveGivingCategory(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("giving:manage");
    const parsed = parseForm(givingCategorySchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const record = id ? await db.givingCategory.update({ where: { id }, data }) : await db.givingCategory.create({ data: { ...data, slug } });
    await audit(user.id, id ? "giving-category.updated" : "giving-category.created", "GivingCategory", record.id, data.name);
    if (!id) redirect(`/admin/giving?id=${record.id}&saved=1`);
    return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveGivingCategory");
  }
}

export async function deleteGivingCategory(formData: FormData) {
  const user = await authorize("giving:manage");
  const id = String(formData.get("id"));
  // Donations keep their history; the category link is cleared (onDelete: SetNull).
  await db.givingCategory.delete({ where: { id } });
  await audit(user.id, "giving-category.deleted", "GivingCategory", id);
  redirect("/admin/giving");
}
