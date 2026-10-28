import type { Metadata } from "next";
import {
  getHomepage,
  getLatestSermon,
  getLibraryPhotos,
  getPublishedMinistries,
  getPublishedOutreach,
  getServiceTimes,
  getSiteSettings,
  getUpcomingEvents,
} from "@/lib/content";
import { formatClock, WEEKDAY_LABELS } from "@/lib/format";
import { stripEmphasis } from "@/components/ui/emphasis";
import { Hero } from "@/components/home/hero";
import { Welcome } from "@/components/home/welcome";
import { Services } from "@/components/home/services";
import { MinistriesShowcase } from "@/components/home/ministries-showcase";
import { FeaturedSermon } from "@/components/home/featured-sermon";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { Scripture } from "@/components/home/scripture";
import { Outreach } from "@/components/home/outreach";
import { VisitInvitation } from "@/components/home/visit-invitation";
import { OrganizationJsonLd } from "@/components/site/organization-json-ld";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { isEmailConfigured } from "@/lib/email";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomepage()]);
  return {
    title: { absolute: settings.seoTitle || `${settings.ministryName} | ${stripEmphasis(home?.heroHeading ?? "Welcome")}` },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, home, services, ministries, latestSermon, events, outreach, photos] = await Promise.all([
    getSiteSettings(),
    getHomepage(),
    getServiceTimes(),
    getPublishedMinistries(),
    getLatestSermon(),
    getUpcomingEvents(3),
    getPublishedOutreach(),
    getLibraryPhotos("worship-singer.jpg", "outreach-field-front.jpg", "congregation-standing.jpg"),
  ]);

  if (!home) {
    return (
      <section className="px-5 py-32 text-center">
        <h1 className="font-display text-display-lg text-navy-900">Welcome</h1>
        <p className="mt-4 text-muted">The homepage has not been configured yet. Run the database seed or edit it in the dashboard.</p>
      </section>
    );
  }

  const sermon = home.featuredSermon?.status === "PUBLISHED" ? home.featuredSermon : latestSermon;
  const firstService = services[0];
  const nextGathering = firstService
    ? `Join us ${WEEKDAY_LABELS[firstService.day]}s at ${formatClock(firstService.startTime)}${firstService.location ? `, ${firstService.location}` : ""}`
    : null;

  // Sections render in this order.
  const visible = {
    welcome: true,
    services: home.showServices,
    ministries: home.showMinistries && ministries.length > 0,
    sermon: home.showSermon && Boolean(sermon),
    events: home.showEvents,
    outreach: home.showOutreach && Boolean(home.outreachHeading && home.outreachText),
  };

  return (
    <>
      <OrganizationJsonLd />
      <Hero
        eyebrow={home.heroEyebrow}
        heading={home.heroHeading}
        text={home.heroText}
        image={home.heroImage}
        primary={{ label: home.primaryCtaLabel, href: home.primaryCtaHref }}
        secondary={{ label: home.secondaryCtaLabel, href: home.secondaryCtaHref }}
        nextGathering={nextGathering}
      />
      <Welcome
        heading={home.welcomeHeading}
        text={home.welcomeText}
        image={home.welcomeImage}
        accentImage={photos.get("worship-singer.jpg") ?? null}
      />
      {visible.services && <Services services={services} />}
      {visible.ministries && <MinistriesShowcase ministries={ministries} />}
      {visible.sermon && sermon && <FeaturedSermon sermon={sermon} />}
      {visible.events && <UpcomingEvents events={events} />}
      {home.showScripture && home.scriptureText && home.scriptureReference && (
        <Scripture text={home.scriptureText} reference={home.scriptureReference} translation={home.scriptureTranslation} />
      )}
      {visible.outreach && (
        <Outreach
          heading={home.outreachHeading!}
          text={home.outreachText!}
          image={home.outreachImage}
          secondaryImage={photos.get("outreach-field-front.jpg") ?? null}
          programmes={outreach}
        />
      )}
      <VisitInvitation image={photos.get("congregation-standing.jpg") ?? null} />
      {home.showNewsletter && settings.newsletterEnabled && isEmailConfigured() && <NewsletterSection />}
    </>
  );
}
