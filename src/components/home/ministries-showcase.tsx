import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

export interface MinistryTile {
  slug: string;
  name: string;
  summary: string;
  image: PhotoSource | null;
}

interface MinistriesShowcaseProps {
  ministries: MinistryTile[];
  image: PhotoSource | null;
}

const MAX_TILES = 5;

// Tiles without their own photograph take one of these grounds, in turn.
const FALLBACK_GROUNDS = ["bg-royal", "bg-flame", "bg-kente-green", "bg-navy-900"];

/** Bento of photo tiles: the first ministry fills a tall tile, the rest sit beside it, each with a gold arrow. */
export function MinistriesShowcase({ ministries, image }: MinistriesShowcaseProps) {
  const shown = ministries.slice(0, MAX_TILES);
  return (
    <section aria-labelledby="ministries-heading" className="bg-sand py-24 sm:py-32">
      <Container>
        <div className="reveal flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="label text-gold-ink">Find your place</p>
            <h2 id="ministries-heading" className="mt-4 text-display-lg text-navy-900">
              Our <span className="text-royal">ministries</span>
            </h2>
          </div>
          <ButtonLink href="/ministries" variant="outline" className="self-start sm:self-auto">
            All ministries
          </ButtonLink>
        </div>

        <ul className="mt-12 grid auto-rows-[17rem] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {shown.map((ministry, index) => {
            const photo = ministry.image ?? (index === 0 ? image : null);
            const lead = index === 0;
            return (
              <li
                key={ministry.slug}
                className={`reveal group relative isolate overflow-hidden rounded-tile ${photo ? "bg-navy-900" : FALLBACK_GROUNDS[index % FALLBACK_GROUNDS.length]} ${lead ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
              >
                {photo ? (
                  <Photo
                    image={photo}
                    alt=""
                    sizes={lead ? "(min-width: 1024px) 24rem, 100vw" : "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"}
                    className="-z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div aria-hidden="true" className="kente absolute inset-x-0 top-0 -z-10 h-2" />
                )}
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-gold text-navy-900 transition-transform duration-300 group-hover:rotate-45"
                >
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <h3 className={lead ? "text-display-md" : "text-display-sm"}>
                    <Link href={`/ministries/${ministry.slug}`} className="after:absolute after:inset-0">
                      {ministry.name}
                    </Link>
                  </h3>
                  <p className={`mt-2 leading-snug text-white/85 ${lead ? "line-clamp-3" : "line-clamp-2"}`}>{ministry.summary}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
