import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import type { SiteSettingsView } from "@/lib/content";
import { safeExternalUrl, safeMapEmbedUrl, telHref, whatsappHref } from "@/lib/safe-url";
import { SocialIcon, SocialLinks } from "@/components/site/social-links";

/** Official contact channels. Only those configured in Site settings are shown. */
export function ContactDetails({ settings }: { settings: SiteSettingsView }) {
  const address = [settings.addressLine, settings.city, settings.region, settings.country].filter(Boolean).join(", ");
  const hasAddress = Boolean(settings.addressLine || settings.city);
  const phone = telHref(settings.phone);
  const whatsapp = whatsappHref(settings.whatsapp);
  const directions = safeExternalUrl(settings.directionsUrl);

  const rows = [
    hasAddress && {
      icon: <MapPin aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />,
      label: "Visit",
      content: (
        <>
          <span>{address}</span>
          {directions && (
            <a href={directions} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-gold-ink underline-offset-4">
              <Navigation aria-hidden="true" className="h-3.5 w-3.5" />
              Get directions<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </>
      ),
    },
    phone && {
      icon: <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />,
      label: "Call",
      content: <a href={phone} className="underline decoration-gold-ink/50 underline-offset-4 hover:decoration-gold-ink">{settings.phone}</a>,
    },
    whatsapp && {
      icon: <SocialIcon network="whatsapp" />,
      label: "WhatsApp",
      content: (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline decoration-gold-ink/50 underline-offset-4 hover:decoration-gold-ink">
          Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
        </a>
      ),
    },
    settings.email && {
      icon: <Mail aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />,
      label: "Email",
      content: <a href={`mailto:${settings.email}`} className="break-all underline decoration-gold-ink/50 underline-offset-4 hover:decoration-gold-ink">{settings.email}</a>,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; content: React.ReactNode }[];

  return (
    <div>
      {rows.length > 0 ? (
        <dl className="divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-5 py-6">
              <span className="mt-0.5 text-gold-ink">{row.icon}</span>
              <div>
                <dt className="eyebrow text-muted">{row.label}</dt>
                <dd className="mt-1.5 flex flex-col text-lg text-navy-900">{row.content}</dd>
              </div>
            </div>
          ))}
        </dl>
      ) : (
        <p className="border-y border-line py-6 leading-relaxed text-muted">
          Our official phone number, email and address will be published here shortly. In the meantime, the form on this page reaches our team directly.
        </p>
      )}
      <div className="mt-8">
        <SocialLinks settings={settings} tone="light" />
      </div>
    </div>
  );
}

/** Embedded map, shown only when an administrator has configured a confirmed Google Maps embed URL. */
export function LocationMap({ settings, title }: { settings: SiteSettingsView; title: string }) {
  const src = safeMapEmbedUrl(settings.mapEmbedUrl);
  if (!src) return null;
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border border-line bg-sand">
      <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full" />
    </div>
  );
}
