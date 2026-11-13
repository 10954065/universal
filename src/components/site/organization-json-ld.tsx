import { getPublishedLeaders, getSiteSettings, getServiceTimes } from "@/lib/content";
import { getSocialChannels } from "@/components/site/social-links";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/**
 * Church / Organization structured data built strictly from configured settings.
 * Address, telephone and email are included only when an administrator has entered them.
 */
export async function OrganizationJsonLd() {
  const [settings, services, leaders] = await Promise.all([getSiteSettings(), getServiceTimes(), getPublishedLeaders()]);
  const overseer = leaders[0];
  const hasAddress = Boolean(settings.addressLine && settings.city);
  const sameAs = getSocialChannels(settings)
    .filter((channel) => channel.network !== "whatsapp")
    .map((channel) => channel.href);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    // "Church" is only asserted once a physical address is confirmed.
    "@type": hasAddress ? "Church" : "Organization",
    name: settings.ministryName,
    alternateName: settings.shortName,
    url: siteUrl(),
    ...(settings.seoDescription ? { description: settings.seoDescription } : {}),
    ...(settings.tagline ? { slogan: settings.tagline } : {}),
    ...(settings.logo ? { logo: absoluteUrl(settings.logo.url) } : {}),
    areaServed: { "@type": "Country", name: settings.country },
    ...(overseer
      ? {
          employee: {
            "@type": "Person",
            name: overseer.name,
            jobTitle: overseer.role,
            url: absoluteUrl(`/leadership#${overseer.slug}`),
            ...(overseer.image ? { image: absoluteUrl(overseer.image.url) } : {}),
          },
        }
      : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.addressLine,
            addressLocality: settings.city,
            ...(settings.region ? { addressRegion: settings.region } : {}),
            addressCountry: settings.country,
          },
        }
      : {}),
    ...(hasAddress && services.length
      ? {
          openingHoursSpecification: services.map((service) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: `https://schema.org/${service.day.charAt(0)}${service.day.slice(1).toLowerCase()}`,
            opens: service.startTime,
            ...(service.endTime ? { closes: service.endTime } : {}),
          })),
        }
      : {}),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.ministryName,
    alternateName: settings.shortName,
    url: siteUrl(),
    inLanguage: "en-GH",
  };
  return (
    <>
      <JsonLd data={data} />
      <JsonLd data={website} />
    </>
  );
}
