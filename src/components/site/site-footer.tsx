import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/site/wordmark";
import { SocialIcon, getSocialChannels } from "@/components/site/social-links";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/navigation";
import type { SiteSettingsView } from "@/lib/content";
import { telHref } from "@/lib/safe-url";

/**
 * Deep royal footer under a kente band: a bold sign-off with the two main actions,
 * then the wordmark, contact details, links and social icons, then the legal line.
 */
export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const year = new Date().getFullYear();
  const address = [settings.addressLine, settings.city, settings.region].filter(Boolean).join(", ");
  const phoneHref = telHref(settings.phone);
  const social = getSocialChannels(settings);
  const links = [...PRIMARY_NAV, ...SECONDARY_NAV];

  return (
    <footer className="on-dark bg-navy-950 text-white">
      <div aria-hidden="true" className="kente h-3" />
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 sm:pt-20">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-2xl font-display text-display-lg font-extrabold text-white">
            Come and worship <span className="text-gold">with us.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/plan-your-visit" variant="gold" arrow>
              Plan your visit
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 pt-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark name={settings.ministryName} logo={settings.logo} tone="dark" />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-mist">
              {settings.footerText || "A church in Ghana. Everyone is welcome."}
            </p>
            {social.length > 0 && (
              <ul className="mt-6 flex items-center gap-3">
                {social.map(({ network, href, label }) => (
                  <li key={network}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-gold hover:text-navy-900"
                    >
                      <SocialIcon network={network} className="h-5 w-5" />
                      <span className="sr-only">{label} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer" className="lg:col-span-4">
            <p className="label text-gold">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.9375rem]">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-white/85 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="label text-gold">Find us</p>
            <address className="mt-5 space-y-3 text-[0.9375rem] not-italic leading-relaxed text-white/85">
              {address && <p>{address}</p>}
              {settings.phone && phoneHref && (
                <p>
                  <a href={phoneHref} className="font-display text-lg font-bold text-white transition-colors hover:text-gold">
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className="break-all transition-colors hover:text-gold">
                    {settings.email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[0.8125rem] text-mist lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
          <p>
            © {year} {settings.ministryName}
          </p>
          <p>
            Created by{" "}
            <a
              href="https://www.sunleonrouterenterprise.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
            >
              Sunleon Router Enterprise<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:justify-self-end">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
