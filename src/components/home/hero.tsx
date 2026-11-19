import { Crown } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Emphasis } from "@/components/ui/emphasis";
import { MottoBadge } from "@/components/ui/motto-badge";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { safeHref } from "@/lib/safe-url";

export interface NextService {
  name: string;
  when: string;
  location: string | null;
}

interface HeroProps {
  eyebrow: string;
  heading: string;
  text: string;
  image: PhotoSource | null;
  logo: PhotoSource | null;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  nextService?: NextService | null;
}

/**
 * Gives the heading its gold accent. Editors can mark words with *asterisks*;
 * when they have not, the words after the last comma are lit ("Through Christ, *We Reign.*").
 */
function accentHeading(heading: string): string {
  if (heading.includes("*")) return heading;
  const split = heading.lastIndexOf(", ");
  return split > 0 ? `${heading.slice(0, split + 1)} *${heading.slice(split + 2)}*` : heading;
}

/**
 * Full-screen photograph washed in royal blue from the left. A gold motto pill,
 * an extra-bold headline, the two calls to action and this week's service sit
 * on the left; the turning motto seal sits bottom right; a kente band closes the edge.
 */
export function Hero({ eyebrow, heading, text, image, logo, primary, secondary, nextService }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 text-white">
      {/* On tall screens the cover crop draws the photo far wider than the viewport, so ask for a larger file. */}
      {image && <Photo image={image} priority quality={75} sizes="(orientation: portrait) 260vw, 100vw" className="-z-20" />}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-navy-950 from-15% via-navy-950/55 to-navy-950/0 md:bg-linear-to-r md:from-navy-950 md:via-navy-950/80 md:to-transparent"
      />
      <div aria-hidden="true" className="absolute -left-40 -top-40 -z-10 h-136 w-136 rounded-full bg-royal/45 blur-3xl" />

      <div className="mx-auto flex min-h-[max(38rem,calc(100svh-7rem))] w-full max-w-site flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:px-10">
        <div className="max-w-3xl animate-rise motion-reduce:animate-none">
          {eyebrow && (
            <p className="label inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-navy-900">
              <Crown aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
              {eyebrow}
            </p>
          )}
          <h1 id="hero-heading" className="mt-6 text-display-hero text-white">
            <Emphasis text={accentHeading(heading)} accentClassName="text-gold" />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">{text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={safeHref(primary.href) ?? "/plan-your-visit"} variant="gold" arrow className="plausible-event-name=Plan+Visit+Click">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={safeHref(secondary.href) ?? "/about"} variant="outline-light">
              {secondary.label}
            </ButtonLink>
          </div>

          {nextService && (
            <p className="mt-10 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-white/10 px-5 py-3 text-[0.9375rem] text-white backdrop-blur-md">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgb(247_179_43/0.3)]" />
              <span className="font-display font-bold">{nextService.name}</span>
              <span className="text-white/80">{nextService.when}</span>
              {nextService.location && <span className="text-white/60">{nextService.location}</span>}
            </p>
          )}
        </div>
      </div>

      <MottoBadge
        words={[eyebrow, heading.replace(/\*/g, "")]}
        logo={logo}
        className="absolute bottom-14 right-6 hidden w-36 md:block lg:bottom-16 lg:right-12 lg:w-44"
      />

      <div aria-hidden="true" className="kente h-3" />
    </section>
  );
}
