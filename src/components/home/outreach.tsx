import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";
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

/** Text left, layered photographs right; published outreach programmes listed beneath. */
export function Outreach({ heading, text, image, secondaryImage, programmes, index }: OutreachProps & { index?: string }) {
  return (
    <section aria-labelledby="outreach-heading" className="overflow-hidden bg-sand py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="reveal lg:col-span-5">
            <SectionHeading id="outreach-heading" eyebrow="Community & outreach" index={index} title={heading} size="md" />
            <p className="mt-7 text-lg leading-relaxed text-muted">{text}</p>
            {programmes.length > 0 && (
              <ul className="mt-10 divide-y divide-navy-900/12 border-y border-navy-900/15">
                {programmes.map((programme) => {
                  const href = safeHref(programme.ctaHref);
                  return (
                    <li key={programme.id} className="py-5">
                      <h3 className="font-display text-2xl font-semibold text-navy-900">{programme.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-muted">{programme.summary}</p>
                      {href && programme.ctaLabel && (
                        <a href={href} className="mt-2 inline-block text-sm font-semibold text-navy-900 underline decoration-gold-ink underline-offset-4">
                          {programme.ctaLabel}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-10">
              <ButtonLink href="/contact" variant="navy" arrow>
                Get involved
              </ButtonLink>
            </div>
          </div>
          <div className="reveal relative lg:col-span-7 lg:pl-8">
            <div className="relative ml-auto aspect-[4/3] w-full overflow-hidden sm:w-[86%]">
              {image && <Photo image={image} sizes="(min-width: 1024px) 50vw, 100vw" />}
            </div>
            {secondaryImage && (
              <div className="relative -mt-24 hidden aspect-square w-[42%] overflow-hidden border-[6px] border-sand sm:block">
                <Photo image={secondaryImage} sizes="25vw" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
