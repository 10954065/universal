import type { Metadata } from "next";
import Link from "next/link";
import { getLibraryPhotos, getPublishedMinistries } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Photo } from "@/components/ui/photo";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Our Ministries",
  description: "Discover the ministries of Universal Trinity Ministry and find a place to grow, serve and belong.",
  alternates: { canonical: "/ministries" },
};

export default async function MinistriesPage() {
  const [ministries, photos] = await Promise.all([getPublishedMinistries(), getLibraryPhotos("children-families.jpg")]);

  return (
    <>
      <PageHeader
        eyebrow="Our ministries"
        title="Grow, serve and *belong*"
        intro="There is a place for everyone to grow in faith, use their gifts and build lasting friendships."
        image={photos.get("children-families.jpg") ?? null}
        crumbs={[{ label: "Our Ministries", href: "/ministries" }]}
      />
      <section className="py-20 sm:py-28">
        <Container>
          {ministries.length === 0 ? (
            <EmptyState
              title="Ministry details are being prepared"
              action={
                <ButtonLink href="/contact" variant="outline">
                  Ask how to get involved
                </ButtonLink>
              }
            >
              We are putting together information about each of our ministries. Get in touch and we will help you find where you fit.
            </EmptyState>
          ) : (
            <ol className="grid gap-x-10 gap-y-16 md:grid-cols-2">
              {ministries.map((ministry, index) => (
                <li key={ministry.id} className={`reveal group relative ${index % 2 === 1 ? "md:mt-20" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    {ministry.image && (
                      <Photo
                        image={ministry.image}
                        alt=""
                        sizes="(min-width: 768px) 45vw, 100vw"
                        className="transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    )}
                  </div>
                  <div className="mt-6 flex items-baseline gap-5">
                    <span aria-hidden="true" className="font-display text-xl text-gold-ink [font-variant-numeric:lining-nums]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-display text-display-sm font-semibold text-navy-900">
                        <Link
                          href={`/ministries/${ministry.slug}`}
                          className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-gold group-hover:decoration-1 group-hover:underline-offset-4"
                        >
                          {ministry.name}
                        </Link>
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted">{ministry.summary}</p>
                      {ministry.meetingInfo && <p className="mt-3 text-sm font-medium text-navy-800">{ministry.meetingInfo}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Container>
      </section>
    </>
  );
}
