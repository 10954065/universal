import "server-only";
import { db } from "@/lib/db";

/** Media library options for image pickers in admin forms. */
export async function getMediaOptions() {
  return db.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, url: true, alt: true } });
}

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft (not visible on the website)" },
  { value: "PUBLISHED", label: "Published (visible to everyone)" },
];
