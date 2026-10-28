"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authorize } from "@/lib/session";
import { slugify, uniqueSlug } from "@/lib/slug";
import type { FormState } from "@/lib/form-state";
import { parseVideoUrl, isPlayableAudioUrl } from "@/lib/media-embed";
import {
  checkbox,
  failure,
  nullableDateTime,
  nullableEmail,
  nullableId,
  nullableText,
  nullableUrl,
  parseForm,
  publishStatus,
  requiredText,
  saved,
  sortOrder,
} from "@/server/admin/helpers";

/** Slug from the form, or derived from the title; guaranteed unique for the model. */
async function resolveSlug(input: string | null, title: string, exists: (slug: string) => Promise<boolean>) {
  return uniqueSlug(input ? slugify(input) : title, exists);
}

// ─── Sermons ────────────────────────────────────────────────────────────

const sermonSchema = z.object({
  id: nullableId,
  title: requiredText(160),
  slug: nullableText(80),
  speakerName: nullableText(120),
  categoryName: nullableText(80),
  preachedAt: nullableDateTime.refine((value) => value !== null, "Enter the date preached."),
  scripture: nullableText(120),
  summary: z.string().trim().max(600),
  notes: z.string().max(20_000),
  transcript: nullableText(100_000),
  videoUrl: nullableUrl.refine((value) => value === null || parseVideoUrl(value) !== null, "Use a YouTube or Vimeo link."),
  audioUrl: nullableUrl.refine((value) => value === null || isPlayableAudioUrl(value), "Use a direct https link to an .mp3, .m4a, .ogg or .wav file."),
  thumbnailId: nullableId,
  status: publishStatus,
});

async function findOrCreate(kind: "speaker" | "category", name: string | null): Promise<string | null> {
  if (!name) return null;
  const slug = slugify(name);
  if (!slug) return null;
  if (kind === "speaker") return (await db.speaker.upsert({ where: { slug }, update: {}, create: { slug, name } })).id;
  return (await db.sermonCategory.upsert({ where: { slug }, update: {}, create: { slug, name } })).id;
}

export async function saveSermon(_state: FormState, formData: FormData): Promise<FormState> {
  let createdId: string | null = null;
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(sermonSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, speakerName, categoryName, slug, ...rest } = parsed.data;
    const data = {
      ...rest,
      preachedAt: rest.preachedAt!,
      speakerId: await findOrCreate("speaker", speakerName),
      categoryId: await findOrCreate("category", categoryName),
      slug: await resolveSlug(slug, rest.title, async (candidate) => Boolean(await db.sermon.findFirst({ where: { slug: candidate, NOT: id ? { id } : undefined } }))),
    };
    const record = id ? await db.sermon.update({ where: { id }, data }) : await db.sermon.create({ data });
    await audit(user.id, id ? "sermon.updated" : "sermon.created", "Sermon", record.id, `${record.title} (${record.status})`);
    if (!id) createdId = record.id;
    else return saved(record.status === "PUBLISHED" ? "Saved. This sermon is live." : "Saved as draft.");
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveSermon");
  }
  redirect(`/admin/sermons/${createdId}?saved=1`);
}

export async function deleteSermon(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  const sermon = await db.sermon.delete({ where: { id } });
  await audit(user.id, "sermon.deleted", "Sermon", id, sermon.title);
  redirect("/admin/sermons");
}

// ─── Events ─────────────────────────────────────────────────────────────

const eventSchema = z.object({
  id: nullableId,
  title: requiredText(160),
  slug: nullableText(80),
  summary: requiredText(300),
  description: z.string().max(20_000),
  imageId: nullableId,
  startsAt: nullableDateTime.refine((value) => value !== null, "Enter the start date and time."),
  endsAt: nullableDateTime,
  venue: nullableText(160),
  address: nullableText(300),
  contactEmail: nullableEmail,
  contactPhone: nullableText(40),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"]),
  featured: checkbox,
  registrationEnabled: checkbox,
  registrationCapacity: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || (Number.isInteger(value) && value > 0 && value <= 100_000), "Enter a whole number, or leave blank for unlimited."),
  registrationDeadline: nullableDateTime,
  externalRegistrationUrl: nullableUrl,
});

export async function saveEvent(_state: FormState, formData: FormData): Promise<FormState> {
  let createdId: string | null = null;
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(eventSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, slug, ...rest } = parsed.data;
    if (rest.endsAt && rest.startsAt && rest.endsAt <= rest.startsAt) return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: { endsAt: ["Must be after the start."] } };
    const data = {
      ...rest,
      startsAt: rest.startsAt!,
      slug: await resolveSlug(slug, rest.title, async (candidate) => Boolean(await db.event.findFirst({ where: { slug: candidate, NOT: id ? { id } : undefined } }))),
    };
    const record = id ? await db.event.update({ where: { id }, data }) : await db.event.create({ data });
    await audit(user.id, id ? "event.updated" : "event.created", "Event", record.id, `${record.title} (${record.status})`);
    if (!id) createdId = record.id;
    else return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveEvent");
  }
  redirect(`/admin/events/${createdId}?saved=1`);
}

export async function deleteEvent(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  const event = await db.event.delete({ where: { id } });
  await audit(user.id, "event.deleted", "Event", id, event.title);
  redirect("/admin/events");
}

export async function deleteRegistration(formData: FormData) {
  const user = await authorize("registrations:view");
  const id = String(formData.get("id"));
  const registration = await db.eventRegistration.delete({ where: { id } });
  await audit(user.id, "registration.deleted", "EventRegistration", id);
  redirect(`/admin/registrations?event=${registration.eventId}`);
}

// ─── Ministries, leadership, outreach ───────────────────────────────────

const ministrySchema = z.object({
  id: nullableId,
  name: requiredText(120),
  slug: nullableText(80),
  summary: requiredText(300),
  description: z.string().max(20_000),
  imageId: nullableId,
  leaderName: nullableText(120),
  meetingInfo: nullableText(200),
  contactEmail: nullableEmail,
  contactPhone: nullableText(40),
  status: publishStatus,
  sortOrder,
});

export async function saveMinistry(_state: FormState, formData: FormData): Promise<FormState> {
  let createdId: string | null = null;
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(ministrySchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, slug, ...rest } = parsed.data;
    const data = {
      ...rest,
      slug: await resolveSlug(slug, rest.name, async (candidate) => Boolean(await db.ministry.findFirst({ where: { slug: candidate, NOT: id ? { id } : undefined } }))),
    };
    const record = id ? await db.ministry.update({ where: { id }, data }) : await db.ministry.create({ data });
    await audit(user.id, id ? "ministry.updated" : "ministry.created", "Ministry", record.id, `${record.name} (${record.status})`);
    if (!id) createdId = record.id;
    else return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveMinistry");
  }
  redirect(`/admin/ministries/${createdId}?saved=1`);
}

export async function deleteMinistry(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  const record = await db.ministry.delete({ where: { id } });
  await audit(user.id, "ministry.deleted", "Ministry", id, record.name);
  redirect("/admin/ministries");
}

const leaderSchema = z.object({
  id: nullableId,
  name: requiredText(120),
  slug: nullableText(80),
  role: requiredText(120),
  imageId: nullableId,
  bio: z.string().max(10_000),
  responsibilities: nullableText(600),
  facebookUrl: nullableUrl,
  instagramUrl: nullableUrl,
  xUrl: nullableUrl,
  status: publishStatus,
  sortOrder,
});

export async function saveLeader(_state: FormState, formData: FormData): Promise<FormState> {
  let createdId: string | null = null;
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(leaderSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, slug, ...rest } = parsed.data;
    const data = {
      ...rest,
      slug: await resolveSlug(slug, rest.name, async (candidate) => Boolean(await db.leadershipProfile.findFirst({ where: { slug: candidate, NOT: id ? { id } : undefined } }))),
    };
    const record = id ? await db.leadershipProfile.update({ where: { id }, data }) : await db.leadershipProfile.create({ data });
    await audit(user.id, id ? "leader.updated" : "leader.created", "LeadershipProfile", record.id, `${record.name} (${record.status})`);
    if (!id) createdId = record.id;
    else return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveLeader");
  }
  redirect(`/admin/leadership/${createdId}?saved=1`);
}

export async function deleteLeader(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  const record = await db.leadershipProfile.delete({ where: { id } });
  await audit(user.id, "leader.deleted", "LeadershipProfile", id, record.name);
  redirect("/admin/leadership");
}

const outreachSchema = z.object({
  id: nullableId,
  title: requiredText(120),
  summary: requiredText(400),
  details: z.string().max(10_000),
  imageId: nullableId,
  ctaLabel: nullableText(40),
  ctaHref: nullableText(300),
  status: publishStatus,
  sortOrder,
});

export async function saveOutreach(_state: FormState, formData: FormData): Promise<FormState> {
  let createdId: string | null = null;
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(outreachSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    const record = id ? await db.outreachProgramme.update({ where: { id }, data }) : await db.outreachProgramme.create({ data });
    await audit(user.id, id ? "outreach.updated" : "outreach.created", "OutreachProgramme", record.id, record.title);
    if (!id) createdId = record.id;
    else return saved();
  } catch (error) {
    unstable_rethrow(error);
    return failure(error, "saveOutreach");
  }
  redirect(`/admin/outreach?id=${createdId}&saved=1`);
}

export async function deleteOutreach(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  await db.outreachProgramme.delete({ where: { id } });
  await audit(user.id, "outreach.deleted", "OutreachProgramme", id);
  redirect("/admin/outreach");
}
