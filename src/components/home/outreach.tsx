import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { safeHref } from "@/lib/safe-url";

export interface OutreachItem {
  id: string;
  title: string;
  summary: string;
  ctaLabel: string | null;
  ctaHref: string | null;
}

interface OutreachProps {
  heading: string;
  text: string;
  image: PhotoSource | null;
  secondaryImage: PhotoSource | null;
  programmes: OutreachItem[];
}

/**
 * Text on the left and a rounded photograph on the right with a second photograph
 * set into its corner as a gold-ringed circle; published programmes follow as cards.
 */
export function Outreach({ heading, text, image, secondaryImage, programmes }: OutreachProps) {
  const photo = image ?? secondaryImage;
  const inset = image && secondaryImage ? secondaryImage : null;
  return (
    <section aria-labelledby="outreach-heading" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="reveal lg:col-span-5">
            <p className="label text-gold-ink">Outreach</p>
            <h2 id="outreach-heading" className="mt-4 text-display-lg text-navy-900">
              {heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-800">{text}</p>
            <ButtonLink href="/contact" variant="primary" arrow className="mt-8">
              Get involved
            </ButtonLink>
          </div>
          <div className="reveal relative lg:col-span-7">
            <div aria-hidden="true" className="absolute -right-4 -top-4 h-2/3 w-2/3 rounded-tile bg-royal sm:-right-6 sm:-top-6" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-navy-900 lg:aspect-[5/6]">
              {photo && <Photo image={photo} sizes="(min-width: 1024px) 36rem, 100vw" />}
            </div>
            {inset && (
              <div className="absolute -bottom-8 -left-4 aspect-square w-36 overflow-hidden rounded-full bg-navy-900 ring-8 ring-gold sm:-left-8 sm:w-48">
                <Photo image={inset} alt="" sizes="12rem" />
              </div>
            )}
          </div>
        </div>

        {programmes.length > 0 && (
          <ul className="reveal mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {programmes.map((programme) => {
              const href = safeHref(programme.ctaHref);
              return (
                <li key={programme.id} className="relative flex flex-col overflow-hidden rounded-card bg-ivory p-8 pt-10 ring-1 ring-line">
                  <span aria-hidden="true" className="kente absolute inset-x-0 top-0 h-2" />
                  <h3 className="text-display-sm text-navy-900">{programme.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{programme.summary}</p>
                  {href && programme.ctaLabel && (
                    <a href={href} className="label mt-auto pt-5 text-royal hover:text-navy-900">
                      {programme.ctaLabel}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
