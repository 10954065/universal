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

/** Text on the left and a photograph on the right; published programmes follow as white cards. */
export function Outreach({ heading, text, image, secondaryImage, programmes }: OutreachProps) {
  const photo = image ?? secondaryImage;
  return (
    <section aria-labelledby="outreach-heading" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="reveal lg:col-span-5">
            <h2 id="outreach-heading" className="text-display-lg text-navy-900">
              {heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-800">{text}</p>
            <ButtonLink href="/contact" variant="text" className="mt-6">
              Get involved
            </ButtonLink>
          </div>
          <div className="reveal relative aspect-[4/5] overflow-hidden bg-navy-900 lg:col-span-7 lg:aspect-[5/6]">
            {photo && <Photo image={photo} sizes="(min-width: 1024px) 36rem, 100vw" />}
          </div>
        </div>

        {programmes.length > 0 && (
          <ul className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {programmes.map((programme) => {
              const href = safeHref(programme.ctaHref);
              return (
                <li key={programme.id} className="flex flex-col bg-ivory p-8">
                  <h3 className="text-xl font-medium tracking-[-0.015em] text-navy-900">{programme.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{programme.summary}</p>
                  {href && programme.ctaLabel && (
                    <a href={href} className="label mt-auto pt-5 text-navy-900 hover:opacity-60">
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
