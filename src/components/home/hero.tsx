import Link from "next/link";
import { ButtonLink, LineArrow } from "@/components/ui/button";
import { stripEmphasis } from "@/components/ui/emphasis";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { SocialIcon, type SocialChannel } from "@/components/site/social-links";
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
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  nextService?: NextService | null;
  social: SocialChannel[];
}

/**
 * Full-screen photograph. The headline sits low on the left, a "Follow" rail
 * runs up the left edge, a "Discover" cue runs down the right, and a frosted
 * card floats bottom right with this week's service.
 */
export function Hero({ eyebrow, heading, text, image, primary, secondary, nextService, social }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading" className="on-dark relative isolate flex h-[calc(100svh-4rem)] min-h-[38rem] items-end bg-navy-950 text-white">
      {image && <Photo image={image} priority quality={60} sizes="100vw" className="-z-10" />}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

      {social.length > 0 && (
        <div className="absolute left-6 top-14 hidden flex-col items-center gap-5 md:flex lg:left-10">
          <ul className="flex flex-col items-center gap-4">
            {social.map(({ network, href, label }) => (
              <li key={network}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60">
                  <SocialIcon network={network} className="h-6 w-6" />
                  <span className="sr-only">{label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="h-14 w-px bg-white/80" />
          <span aria-hidden="true" className="rail-label label text-white">
            Follow
          </span>
        </div>
      )}

      <Link
        href="#visit"
        className="absolute bottom-10 right-6 hidden flex-col items-center gap-4 text-white transition-opacity hover:opacity-70 md:flex lg:right-10"
      >
        <span aria-hidden="true" className="nudge-down flex flex-col items-center gap-1 text-[0.625rem] leading-none">
          <span>▼</span>
          <span className="opacity-70">▼</span>
          <span className="opacity-40">▼</span>
        </span>
        <span className="rail-label label">Discover</span>
        <span aria-hidden="true" className="h-14 w-px bg-white/80" />
      </Link>

      <div className="mx-auto w-full max-w-[72rem] px-5 pb-12 sm:px-8 sm:pb-16 md:px-24">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="animate-rise motion-reduce:animate-none">
            {eyebrow && <p className="label text-white/80">{eyebrow}</p>}
            <h1 id="hero-heading" className="mt-4 max-w-2xl text-display-lg text-white">
              {stripEmphasis(heading)}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={safeHref(primary.href) ?? "/plan-your-visit"} variant="light" className="plausible-event-name=Plan+Visit+Click">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={safeHref(secondary.href) ?? "/about"} variant="outline-light">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>

          {nextService && (
            <aside aria-label="This week" className="frost hidden rounded-2xl p-7 text-navy-900 shadow-[0_20px_60px_rgb(0_0_0/0.25)] lg:block">
              <p className="text-lg font-medium uppercase tracking-[-0.01em]">{nextService.name}</p>
              <p className="mt-3 leading-snug">{nextService.when}</p>
              {nextService.location && <p className="mt-1 text-sm text-muted">{nextService.location}</p>}
              <Link href="/plan-your-visit" className="label group mt-6 inline-flex items-center gap-3 text-navy-900">
                Plan your visit
                <LineArrow length="w-10 group-hover:w-14" />
              </Link>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
