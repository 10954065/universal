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

/** A large black-and-white photograph with the first three ministries stacked over its right edge as white cards. */
export function MinistriesShowcase({ ministries, image }: MinistriesShowcaseProps) {
  const shown = ministries.slice(0, 3);
  const photo = image ?? shown.find((ministry) => ministry.image)?.image ?? null;
  return (
    <section aria-labelledby="ministries-heading" className="pb-24 sm:pb-32">
      <Container>
        <h2 id="ministries-heading" className="reveal text-display-lg text-navy-900">
          Ministries
        </h2>
        <div className="mt-10 lg:grid lg:grid-cols-12">
          <div className="reveal relative aspect-[4/3] overflow-hidden bg-navy-900 lg:col-span-9 lg:col-start-1 lg:row-start-1 lg:aspect-auto lg:min-h-[38rem]">
            {photo && <Photo image={photo} alt="" sizes="(min-width: 1024px) 46rem, 100vw" className="grayscale" />}
          </div>
          <ul className="relative z-10 -mt-12 space-y-4 px-4 sm:px-8 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-0 lg:self-center lg:px-0">
            {shown.map((ministry) => (
              <li key={ministry.slug} className="reveal bg-ivory p-7 shadow-[0_20px_50px_rgb(0_0_0/0.08)] sm:p-8">
                <h3 className="text-display-sm text-navy-900">{ministry.name}</h3>
                <p className="mt-3 leading-relaxed text-muted">{ministry.summary}</p>
                <ButtonLink href={`/ministries/${ministry.slug}`} variant="text" className="mt-4">
                  Learn more<span className="sr-only"> about {ministry.name}</span>
                </ButtonLink>
              </li>
            ))}
          </ul>
        </div>
        {ministries.length > shown.length && (
          <div className="reveal mt-12 text-center">
            <ButtonLink href="/ministries" variant="outline">
              All ministries
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
