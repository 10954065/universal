import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRelatedSermons, getSermonBySlug } from "@/lib/content";
import { formatLongDate } from "@/lib/format";
import { parseVideoUrl } from "@/lib/media-embed";
import { absoluteUrl } from "@/lib/site-url";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { ShareLinks } from "@/components/site/share-links";
import { SermonCard } from "@/components/sermons/sermon-card";
import { SermonPlayer } from "@/components/sermons/sermon-player";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sermon = await getSermonBySlug((await params).slug);
  if (!sermon) return { title: "Sermon not found" };
  const video = parseVideoUrl(sermon.videoUrl);
  const image = sermon.thumbnail?.url ?? video?.thumbnailUrl;
  return {
    title: sermon.title,
    description: sermon.summary || [sermon.speaker?.name, sermon.scripture].filter(Boolean).join(", ") || undefined,
    alternates: { canonical: `/sermons/${sermon.slug}` },
    openGraph: { type: "article", publishedTime: sermon.preachedAt.toISOString(), ...(image ? { images: [{ url: image }] } : {}) },
    robots: sermon.isSample ? { index: false } : undefined,
  };
}

export default async function SermonPage({ params }: Props) {
  const sermon = await getSermonBySlug((await params).slug);
  if (!sermon) notFound();
  const related = await getRelatedSermons(sermon);
  const video = parseVideoUrl(sermon.videoUrl);
  const url = absoluteUrl(`/sermons/${sermon.slug}`);

  return (
    <>
      {video && !sermon.isSample && (
        // VideoObject only for real, published video sermons.
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: sermon.title,
            description: sermon.summary || sermon.title,
            thumbnailUrl: [sermon.thumbnail ? absoluteUrl(sermon.thumbnail.url) : video.thumbnailUrl].filter(Boolean),
            uploadDate: sermon.preachedAt.toISOString(),
            embedUrl: video.embedUrl.split("?")[0],
            url,
          }}
        />
      )}

      <section className="on-dark grain bg-navy-900 pb-16 pt-12 sm:pb-24">
        <Container>
          <div className="[&_a]:text-mist [&_a:hover]:text-ivory [&_span[aria-current]]:text-ivory">
            <Breadcrumbs
              items={[
                { label: "Sermons", href: "/sermons" },
                { label: sermon.title, href: `/sermons/${sermon.slug}` },
              ]}
            />
          </div>
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <SermonPlayer
                title={sermon.title}
                videoUrl={sermon.videoUrl}
                audioUrl={sermon.audioUrl}
                poster={sermon.thumbnail ? { url: sermon.thumbnail.url, alt: sermon.thumbnail.alt } : null}
              />
            </div>
            <div className="lg:col-span-4">
              {sermon.category && <p className="eyebrow text-gold">{sermon.category.name}</p>}
              <h1 className="mt-4 font-display text-display-md font-semibold text-ivory">{sermon.title}</h1>
              <dl className="mt-8 space-y-4 border-t border-ivory/15 pt-6 text-[0.9375rem]">
                {sermon.speaker && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-mist">Speaker</dt>
                    <dd className="text-right text-ivory">{sermon.speaker.name}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-mist">Preached</dt>
                  <dd className="text-right text-ivory">
                    <time dateTime={sermon.preachedAt.toISOString()}>{formatLongDate(sermon.preachedAt)}</time>
                  </dd>
                </div>
                {sermon.scripture && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-mist">Scripture</dt>
                    <dd className="text-right font-display text-xl italic text-gold">{sermon.scripture}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {sermon.summary && <p className="font-display text-2xl leading-snug text-navy-900">{sermon.summary}</p>}
              {sermon.notes && <RichText markdown={sermon.notes} className="mt-8" />}
              {sermon.transcript && (
                <details className="group mt-10 border-y border-line py-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold text-navy-900">
                    Read the transcript
                    <span aria-hidden="true" className="text-gold-ink transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-5 whitespace-pre-line leading-relaxed text-muted">{sermon.transcript}</div>
                </details>
              )}
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <ShareLinks url={url} title={sermon.title} />
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-ivory-100 py-16 sm:py-20">
          <Container>
            <h2 id="related-heading" className="font-display text-display-sm font-semibold text-navy-900">
              More messages
            </h2>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <SermonCard sermon={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
