import Link from "next/link";
import { Play } from "lucide-react";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { formatShortDate } from "@/lib/format";
import { parseVideoUrl } from "@/lib/media-embed";

export interface SermonSummary {
  slug: string;
  title: string;
  preachedAt: Date;
  scripture: string | null;
  summary: string;
  videoUrl: string | null;
  audioUrl: string | null;
  speaker: { name: string } | null;
  category: { name: string } | null;
  thumbnail: PhotoSource | null;
}

/** Thumbnail order: uploaded image, then YouTube frame, then a typographic panel. */
export function SermonThumbnail({ sermon, sizes, priority = false }: { sermon: SermonSummary; sizes: string; priority?: boolean }) {
  const video = parseVideoUrl(sermon.videoUrl);
  if (sermon.thumbnail) return <Photo image={sermon.thumbnail} sizes={sizes} priority={priority} alt="" />;
  if (video?.thumbnailUrl) {
    return <Photo image={{ url: video.thumbnailUrl, alt: "", width: 480, height: 360 }} sizes={sizes} priority={priority} alt="" />;
  }
  return (
    <div className="absolute inset-0 flex items-end bg-gradient-to-br from-navy-800 to-navy-950 p-6">
      <p className="text-xl font-semibold tracking-[-0.015em] text-white/90">{sermon.scripture ?? "The Word"}</p>
    </div>
  );
}

export function SermonCard({ sermon }: { sermon: SermonSummary }) {
  const hasMedia = Boolean(sermon.videoUrl || sermon.audioUrl);
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-navy-900">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none">
          <SermonThumbnail sermon={sermon} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
        </div>
        {hasMedia && (
          <span aria-hidden="true" className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-[0_4px_16px_rgb(0_0_0/0.2)] backdrop-blur-md">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.875rem] font-medium text-muted">
          {[sermon.category?.name, formatShortDate(sermon.preachedAt)].filter(Boolean).join(", ")}
        </p>
        <h3 className="mt-1.5 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-navy-900">
          <Link href={`/sermons/${sermon.slug}`} className="after:absolute after:inset-0 group-hover:text-gold-ink">
            {sermon.title}
          </Link>
        </h3>
        <p className="mt-1 text-[0.9375rem] text-muted">{[sermon.speaker?.name, sermon.scripture].filter(Boolean).join(", ")}</p>
      </div>
    </article>
  );
}
