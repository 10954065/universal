import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SermonPlayer } from "@/components/sermons/sermon-player";
import type { SermonSummary } from "@/components/sermons/sermon-card";
import { formatLongDate } from "@/lib/format";

/** The latest message: details on the left, the player on the right. */
export function FeaturedSermon({ sermon }: { sermon: SermonSummary }) {
  return (
    <section aria-labelledby="sermon-heading" className="pb-24 sm:pb-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="reveal lg:col-span-5">
            <p className="label text-muted">Latest sermon</p>
            <h2 id="sermon-heading" className="mt-4 text-display-md text-navy-900">
              {sermon.title}
            </h2>
            <p className="mt-5 font-mono text-[0.875rem] leading-relaxed text-muted">
              {[sermon.speaker?.name, formatLongDate(sermon.preachedAt), sermon.scripture].filter(Boolean).join(", ")}
            </p>
            {sermon.summary && <p className="mt-5 text-lg leading-relaxed text-navy-800">{sermon.summary}</p>}
            <div className="mt-8 flex flex-col gap-2">
              <ButtonLink href={`/sermons/${sermon.slug}`} variant="text" className="self-start">
                Watch the message
              </ButtonLink>
              <ButtonLink href="/sermons" variant="text" className="self-start">
                All sermons
              </ButtonLink>
            </div>
          </div>
          <div className="reveal lg:col-span-7">
            <SermonPlayer
              title={sermon.title}
              videoUrl={sermon.videoUrl}
              audioUrl={sermon.audioUrl}
              poster={sermon.thumbnail ? { url: sermon.thumbnail.url, alt: sermon.thumbnail.alt } : null}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
