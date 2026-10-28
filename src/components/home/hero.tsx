import { ButtonLink } from "@/components/ui/button";
import { Emphasis } from "@/components/ui/emphasis";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { safeHref } from "@/lib/safe-url";

interface HeroProps {
  eyebrow: string;
  heading: string;
  text: string;
  image: PhotoSource | null;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  nextGathering?: string | null;
}

/**
 * Split hero: navy typographic panel on the left, photograph on the right.
 * On mobile the photograph sits above the text so the subject is never covered.
 */
export function Hero({ eyebrow, heading, text, image, primary, secondary, nextGathering }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="on-dark relative overflow-hidden bg-navy-950">
      <div className="grid lg:min-h-[min(52rem,calc(100svh-5rem))] lg:grid-cols-12">
        <div className="relative aspect-[4/5] max-h-[70svh] w-full sm:aspect-[16/11] lg:order-2 lg:col-span-5 lg:aspect-auto lg:max-h-none">
          {image && <Photo image={image} priority quality={60} sizes="(min-width: 1024px) 42vw, 100vw" />}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/0 lg:to-transparent"
          />
        </div>

        <div className="grain relative z-10 -mt-24 px-5 pb-16 sm:px-8 lg:order-1 lg:col-span-7 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:py-24 lg:pl-[max(2.5rem,calc((100vw-78rem)/2+2.5rem))] lg:pr-14">
          <div className="animate-rise motion-reduce:animate-none">
            <p className="eyebrow text-gold">{eyebrow}</p>
            <h1 id="hero-heading" className="mt-6 font-display text-[clamp(2.6rem,1.4rem+3.6vw,5rem)] font-semibold leading-[1.02] text-ivory">
              <Emphasis text={heading} accentClassName="text-gold" />
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-mist sm:text-xl">{text}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={safeHref(primary.href) ?? "/plan-your-visit"} arrow className="plausible-event-name=Plan+Visit+Click">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={safeHref(secondary.href) ?? "/about"} variant="outline-light">
                {secondary.label}
              </ButtonLink>
            </div>
            {nextGathering && (
              <p className="mt-12 flex items-center gap-3 border-t border-ivory/15 pt-6 text-sm text-mist">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
                {nextGathering}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
