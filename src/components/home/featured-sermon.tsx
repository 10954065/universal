import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SermonPlayer } from "@/components/sermons/sermon-player";
import type { SermonSummary } from "@/components/sermons/sermon-card";
import { formatLongDate } from "@/lib/format";

/** Editorial sermon feature on navy: player left, message details right. */
export function FeaturedSermon({ sermon, index }: { sermon: SermonSummary; index?: string }) {
  return (
    <section aria-labelledby="sermon-heading" className="on-dark grain relative bg-navy-900 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Latest message" index={index} title="Hear the *Word*" tone="dark" size="md" className="reveal" />
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="reveal lg:col-span-7">
            <SermonPlayer
              title={sermon.title}
              videoUrl={sermon.videoUrl}
              audioUrl={sermon.audioUrl}
              poster={sermon.thumbnail ? { url: sermon.thumbnail.url, alt: sermon.thumbnail.alt } : null}
            />
          </div>
          <div className="reveal lg:col-span-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-ivory/15 pb-8 text-sm">
              <div>
                <dt className="eyebrow text-gold">Preached</dt>
                <dd className="mt-2 text-ivory">{formatLongDate(sermon.preachedAt)}</dd>
              </div>
              {sermon.speaker && (
                <div>
                  <dt className="eyebrow text-gold">Speaker</dt>
                  <dd className="mt-2 text-ivory">{sermon.speaker.name}</dd>
                </div>
              )}
              {sermon.scripture && (
                <div className="col-span-2">
                  <dt className="eyebrow text-gold">Scripture</dt>
                  <dd className="mt-2 font-display text-2xl italic text-ivory">{sermon.scripture}</dd>
                </div>
              )}
            </dl>
            <h3 id="sermon-heading" className="mt-8 font-display text-display-md font-semibold text-ivory">
              {sermon.title}
            </h3>
            {sermon.summary && <p className="mt-5 leading-relaxed text-mist">{sermon.summary}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={`/sermons/${sermon.slug}`} arrow>
                View message
              </ButtonLink>
              <ButtonLink href="/sermons" variant="outline-light">
                Sermon library
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
