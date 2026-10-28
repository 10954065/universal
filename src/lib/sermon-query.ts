import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";

export const SERMONS_PER_PAGE = 9;

const optionalSlug = z
  .string()
  .trim()
  .max(100)
  .regex(/^[a-z0-9-]*$/)
  .optional()
  .catch(undefined);

export const sermonFiltersSchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  speaker: optionalSlug,
  category: optionalSlug,
  page: z.coerce.number().int().min(1).max(1000).catch(1).default(1),
});

export type SermonFilters = z.infer<typeof sermonFiltersSchema>;

/** Parses untrusted URL search params into safe filters. Invalid values are dropped, never thrown. */
export function parseSermonFilters(params: Record<string, string | string[] | undefined>): SermonFilters {
  const pick = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  return sermonFiltersSchema.parse({
    q: pick("q") || undefined,
    speaker: pick("speaker") || undefined,
    category: pick("category") || undefined,
    page: pick("page") ?? 1,
  });
}

/** Builds the Prisma `where` clause for the public sermon library. Always restricted to PUBLISHED. */
export function buildSermonWhere(filters: SermonFilters): Prisma.SermonWhereInput {
  const and: Prisma.SermonWhereInput[] = [{ status: "PUBLISHED" }];
  if (filters.speaker) and.push({ speaker: { slug: filters.speaker } });
  if (filters.category) and.push({ category: { slug: filters.category } });
  if (filters.q) {
    const contains = { contains: filters.q, mode: "insensitive" as const };
    and.push({
      OR: [{ title: contains }, { summary: contains }, { scripture: contains }, { speaker: { name: contains } }],
    });
  }
  return { AND: and };
}

/** Builds a sermon-library URL preserving the active filters. */
export function sermonListHref(filters: Partial<SermonFilters>): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.speaker) params.set("speaker", filters.speaker);
  if (filters.category) params.set("category", filters.category);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  const query = params.toString();
  return query ? `/sermons?${query}` : "/sermons";
}
