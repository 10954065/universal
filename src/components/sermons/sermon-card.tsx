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

/** Thumbnail order: uploaded image → YouTube frame → typographic panel. */
export function SermonThumbnail({ sermon, sizes, priority = false }: { sermon: SermonSummary; sizes: string; priority?: boolean }) {
  const video = parseVideoUrl(sermon.videoUrl);
  if (sermon.thumbnail) return <Photo image={sermon.thumbnail} sizes={sizes} priority={priority} alt="" />;
  if (video?.thumbnailUrl) {
    return <Photo image={{ url: video.thumbnailUrl, alt: "", width: 480, height: 360 }} sizes={sizes} priority={priority} alt="" />;
  }
  return (
    <div className="grain absolute inset-0 flex items-end bg-navy-800 p-6">
      <p className="font-display text-2xl italic text-gold">{sermon.scripture ?? "The Word"}</p>
    </div>
  );
}

export function SermonCard({ sermon }: { sermon: SermonSummary }) {
  const hasMedia = Boolean(sermon.videoUrl || sermon.audioUrl);
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none">
          <SermonThumbnail sermon={sermon} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        {hasMedia && (
          <span aria-hidden="true" className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-ivory/95 text-navy-900">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="eyebrow text-gold-ink">
          {[sermon.category?.name, formatShortDate(sermon.preachedAt)].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-3 font-display text-[1.65rem] font-semibold leading-tight text-navy-900">
          <Link href={`/sermons/${sermon.slug}`} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold group-hover:decoration-1 group-hover:underline-offset-4">
            {sermon.title}
          </Link>
        </h3>
        <p className="mt-2 text-[0.9375rem] text-muted">
          {[sermon.speaker?.name, sermon.scripture].filter(Boolean).join(" — ")}
        </p>
      </div>
    </article>
  );
}
