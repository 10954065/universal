import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/site/wordmark";
import { SocialIcon, getSocialChannels } from "@/components/site/social-links";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/navigation";
import type { SiteSettingsView } from "@/lib/content";
import { telHref } from "@/lib/safe-url";

/** White footer: a row of links and outlined buttons, the wordmark and social icons, then the legal line. */
export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const year = new Date().getFullYear();
  const address = [settings.addressLine, settings.city, settings.region].filter(Boolean).join(", ");
  const phoneHref = telHref(settings.phone);
  const social = getSocialChannels(settings);
  const links = [...PRIMARY_NAV.filter((item) => item.href !== "/"), ...SECONDARY_NAV];

  return (
    <footer className="bg-ivory text-navy-900">
      <div className="mx-auto max-w-[76rem] px-5 pb-8 pt-14 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[0.875rem]">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-9 items-center transition-opacity hover:opacity-60">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/plan-your-visit" variant="outline" className="!min-h-10 !px-5 !text-[0.75rem]">
              Plan your visit
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" className="!min-h-10 !px-5 !text-[0.75rem]">
              Contact us
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Wordmark name={settings.ministryName} logo={settings.logo} />
            <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
              {settings.footerText || "A church in Ghana. Everyone is welcome."}
            </p>
            <address className="mt-4 space-y-1 font-mono text-[0.8125rem] not-italic text-muted">
              {address && <p>{address}</p>}
              {settings.phone && phoneHref && (
                <p>
                  <a href={phoneHref} className="hover:text-navy-900">
                    {settings.phone}
                  </a>
                </p>
              )}
              {settings.email && (
                <p>
                  <a href={`mailto:${settings.email}`} className="break-all hover:text-navy-900">
                    {settings.email}
                  </a>
                </p>
              )}
            </address>
          </div>
          {social.length > 0 && (
            <ul className="flex items-center gap-5">
              {social.map(({ network, href, label }) => (
                <li key={network}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60">
                    <SocialIcon network={network} className="h-5 w-5" />
                    <span className="sr-only">{label} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 font-mono text-[0.75rem] uppercase tracking-[0.12em] text-muted lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
          <p>
            © {year} {settings.ministryName}
          </p>
          <p>
            Created by{" "}
            <a href="https://www.sunleonrouterenterprise.com/" target="_blank" rel="noopener noreferrer" className="text-navy-900 underline underline-offset-4 transition-opacity hover:opacity-60">
              Sunleon Router Enterprise<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 lg:justify-self-end">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-navy-900">
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
