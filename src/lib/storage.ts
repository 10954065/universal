import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/*
 * Media storage driver:
 * - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (required on Vercel, whose filesystem is read-only);
 * - otherwise the local `public/uploads` folder (development, or a persistent VPS).
 */

export function storageDriver(): "vercel-blob" | "local" {
  return process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "local";
}

export async function putFile(key: string, data: Buffer, contentType: string): Promise<{ url: string; storageKey: string }> {
  if (storageDriver() === "vercel-blob") {
    const blob = await put(`media/${key}`, data, { access: "public", contentType, addRandomSuffix: false });
    return { url: blob.url, storageKey: `blob:${blob.url}` };
  }
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, key), data);
  return { url: `/uploads/${key}`, storageKey: `local:${key}` };
}

/** Deletes an uploaded file. Bundled library photos (`static/…`) are never deleted from disk. */
export async function deleteFile(storageKey: string): Promise<void> {
  if (storageKey.startsWith("blob:")) {
    await del(storageKey.slice(5));
  } else if (storageKey.startsWith("local:")) {
    const name = path.basename(storageKey.slice(6));
    await unlink(path.join(process.cwd(), "public", "uploads", name)).catch(() => undefined);
  }
}
