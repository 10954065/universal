"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import sharp, { type OutputInfo } from "sharp";
import { z } from "zod";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authorize } from "@/lib/session";
import { deleteFile, putFile } from "@/lib/storage";
import { slugify } from "@/lib/slug";
import type { FormState } from "@/lib/form-state";
import { failure, parseForm, requiredText, saved } from "@/server/admin/helpers";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_EDGE = 2400;

/**
 * Uploads an image. Files are decoded and re-encoded with sharp, which:
 * - rejects anything that is not really an image (content, not just extension, is checked),
 * - applies EXIF orientation then strips ALL metadata (including GPS location),
 * - limits dimensions so pages stay fast.
 */
export async function uploadMedia(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const file = formData.get("file");
    const alt = String(formData.get("alt") ?? "").trim().slice(0, 300);
    if (!(file instanceof File) || file.size === 0) return { status: "error", fieldErrors: { file: ["Choose an image to upload."] } };
    if (file.size > MAX_UPLOAD_BYTES) return { status: "error", fieldErrors: { file: ["Images must be under 10 MB."] } };
    if (!ACCEPTED.has(file.type)) return { status: "error", fieldErrors: { file: ["Use a JPEG, PNG, WebP or AVIF image."] } };
    if (!alt) return { status: "error", fieldErrors: { alt: ["Describe the image for visitors who use screen readers."] } };

    let output: { data: Buffer; info: OutputInfo };
    try {
      output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 80_000_000 })
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
    } catch {
      return { status: "error", fieldErrors: { file: ["That file could not be read as an image."] } };
    }

    const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const key = `${base}-${randomBytes(4).toString("hex")}.jpg`;
    const stored = await putFile(key, output.data, "image/jpeg");
    const asset = await db.mediaAsset.create({
      data: {
        url: stored.url,
        storageKey: stored.storageKey,
        alt,
        width: output.info.width,
        height: output.info.height,
        mimeType: "image/jpeg",
        sizeBytes: output.data.length,
        uploadedById: user.id,
      },
    });
    await audit(user.id, "media.uploaded", "MediaAsset", asset.id, key);
    return saved("Image uploaded.");
  } catch (error) {
    return failure(error, "uploadMedia");
  }
}

const mediaSchema = z.object({
  id: requiredText(40),
  alt: requiredText(300, "Alt text is required."),
  focalX: z.coerce.number().int().min(0).max(100),
  focalY: z.coerce.number().int().min(0).max(100),
});

export async function updateMedia(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await authorize("content:manage");
    const parsed = parseForm(mediaSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, ...data } = parsed.data;
    await db.mediaAsset.update({ where: { id }, data });
    await audit(user.id, "media.updated", "MediaAsset", id);
    return saved();
  } catch (error) {
    return failure(error, "updateMedia");
  }
}

export async function deleteMedia(formData: FormData) {
  const user = await authorize("content:manage");
  const id = String(formData.get("id"));
  const asset = await db.mediaAsset.delete({ where: { id } });
  await deleteFile(asset.storageKey);
  await audit(user.id, "media.deleted", "MediaAsset", id, asset.storageKey);
  redirect("/admin/media");
}
