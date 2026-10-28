import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";

export interface MinistryTile {
  slug: string;
  name: string;
  summary: string;
  image: PhotoSource | null;
}

/**
 * Bento composition: the first ministry is featured large, the rest tile around it.
 * Tiles keep their summary visible (not hover-only) for touch and screen-reader users.
 */
export function MinistriesShowcase({ ministries, index }: { ministries: MinistryTile[]; index?: string }) {
  const shown = ministries.slice(0, 5);
  return (
    <section aria-labelledby="ministries-heading" className="py-24 sm:py-32">
      <Container>
        <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="ministries-heading"
            eyebrow="Our ministries"
            index={index}
            title="Find your *place* to belong"
            intro="Every member has a part to play. Discover where you can grow, serve and build friendships."
          />
          <ButtonLink href="/ministries" variant="text" className="shrink-0">
            All ministries
          </ButtonLink>
        </div>

        <ul className="mt-14 grid auto-rows-[16rem] gap-4 sm:grid-cols-2 lg:auto-rows-[15rem] lg:grid-cols-4">
          {shown.map((ministry, index) => (
            <li
              key={ministry.slug}
              className={`reveal group relative overflow-hidden bg-navy-900 ${
                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              } ${index === 3 && shown.length === 5 ? "lg:col-span-2" : ""}`}
            >
              {ministry.image && (
                <Photo
                  image={ministry.image}
                  alt=""
                  sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className="opacity-90 transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
              )}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-navy-950/0" />
              <div className="on-dark absolute inset-x-0 bottom-0 p-6">
                <h3 className={`font-display font-semibold text-ivory ${index === 0 ? "text-4xl" : "text-2xl"}`}>
                  <Link href={`/ministries/${ministry.slug}`} className="after:absolute after:inset-0">
                    {ministry.name}
                  </Link>
                </h3>
                <p className={`mt-2 text-sm leading-relaxed text-mist ${index === 0 ? "max-w-md text-base" : "line-clamp-2"}`}>{ministry.summary}</p>
              </div>
              <span aria-hidden="true" className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center bg-ivory/0 text-ivory transition-colors duration-300 group-hover:bg-gold group-hover:text-navy-950">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
