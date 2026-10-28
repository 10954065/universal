import type { Metadata } from "next";
import { getLibraryPhotos, getPageSections, getServiceTimes, getSiteSettings } from "@/lib/content";
import { createFormToken } from "@/lib/spam";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/site/page-header";
import { ServiceList } from "@/components/site/service-list";
import { ContactDetails, LocationMap } from "@/components/site/contact-details";
import { VisitForm } from "@/components/forms/visit-form";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description: "Planning your first visit to Universal Trinity Ministry? Find service times, what to expect and how to let us know you are coming.",
  alternates: { canonical: "/plan-your-visit" },
};

export default async function PlanYourVisitPage() {
  const [settings, services, sections, photos] = await Promise.all([
    getSiteSettings(),
    getServiceTimes(),
    getPageSections("visit"),
    getLibraryPhotos("minister-banner.jpg"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Plan your visit"
        title="We saved you a *seat*"
        intro="Visiting a new church can feel like a big step. Here is everything you need to know before you come."
        image={photos.get("minister-banner.jpg") ?? null}
        crumbs={[{ label: "Plan Your Visit", href: "/plan-your-visit" }]}
      >
        <a href="#let-us-know" className="inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] text-navy-900 underline decoration-gold-ink underline-offset-[6px]">
          Let us know you&apos;re coming
        </a>
      </PageHeader>

      <section aria-labelledby="visit-times" className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading id="visit-times" eyebrow="When" index="01" title="Service *times*" size="md" />
            </div>
            <div className="lg:col-span-8">
              <ServiceList services={services} />
            </div>
          </div>
        </Container>
      </section>

      {sections.length > 0 && (
        <section aria-labelledby="visit-expect" className="bg-sand py-20 sm:py-24">
          <Container>
            <SectionHeading id="visit-expect" eyebrow="Before you come" index="02" title="What to *expect*" size="md" />
            <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2">
              {sections.map((section) => (
                <div key={section.key} className="reveal border-t border-navy-900/15 pt-8">
                  <h3 className="font-display text-display-sm font-semibold text-navy-900">{section.title}</h3>
                  <RichText markdown={section.body} className="mt-4" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section aria-labelledby="visit-where" className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading id="visit-where" eyebrow="Where" index={sections.length > 0 ? "03" : "02"} title="Finding *us*" size="md" />
              <div className="mt-10">
                <ContactDetails settings={settings} />
              </div>
            </div>
            <div className="lg:col-span-7">
              <LocationMap settings={settings} title={`Map showing the location of ${settings.ministryName}`} />
            </div>
          </div>
        </Container>
      </section>

      <section id="let-us-know" aria-labelledby="visit-form-heading" className="scroll-mt-24 border-t border-line bg-ivory-100 py-20 sm:py-24">
        <Container size="site">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading
                id="visit-form-heading"
                eyebrow="Let us know"
                title="We'll look out for *you*"
                size="md"
                intro="Tell us when you plan to come and we will make sure someone is ready to welcome you."
              />
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <VisitForm token={createFormToken("visit")} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
