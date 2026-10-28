import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/site/wordmark";
import { SocialLinks } from "@/components/site/social-links";
import { LEGAL_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/navigation";
import type { SiteSettingsView } from "@/lib/content";
import { telHref } from "@/lib/safe-url";

export function SiteFooter({ settings }: { settings: SiteSettingsView }) {
  const year = new Date().getFullYear();
  const address = [settings.addressLine, settings.city, settings.region].filter(Boolean).join(", ");
  const phoneHref = telHref(settings.phone);

  return (
    <footer className="on-dark grain relative overflow-hidden bg-navy-900 text-mist">
      <Container size="wide" className="pb-10 pt-20 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark name={settings.ministryName} logo={settings.logo} tone="dark" />
            <p className="mt-6 max-w-sm leading-relaxed">
              {settings.footerText || "A church in Ghana. Everyone is welcome."}
            </p>
            <div className="mt-8">
              <SocialLinks settings={settings} />
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="eyebrow text-gold">Explore</p>
              <ul className="mt-5 space-y-1">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-9 items-center text-ivory/85 transition-colors hover:text-gold">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-gold">Connect</p>
              <ul className="mt-5 space-y-1">
                {SECONDARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="inline-flex min-h-9 items-center text-ivory/85 transition-colors hover:text-gold">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow text-gold">Reach us</p>
              <address className="mt-5 space-y-3 not-italic leading-relaxed">
                {address && <p className="text-ivory/85">{address}</p>}
                {settings.phone && phoneHref && (
                  <p>
                    <a href={phoneHref} className="text-ivory/85 transition-colors hover:text-gold">
                      {settings.phone}
                    </a>
                  </p>
                )}
                {settings.email && (
                  <p>
                    <a href={`mailto:${settings.email}`} className="break-all text-ivory/85 transition-colors hover:text-gold">
                      {settings.email}
                    </a>
                  </p>
                )}
                {!address && !settings.phone && !settings.email && (
                  <p>
                    <Link href="/contact" className="text-ivory/85 underline decoration-gold/50 underline-offset-4 hover:text-gold">
                      Send us a message
                    </Link>
                  </p>
                )}
              </address>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.ministryName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
