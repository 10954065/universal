import type { Metadata } from "next";
import { getLibraryPhotos, getServiceTimes, getSiteSettings } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/site/page-header";
import { ContactDetails, LocationMap } from "@/components/site/contact-details";
import { ServiceList } from "@/components/site/service-list";
import { ContactForm } from "@/components/forms/contact-form";
import { createFormToken } from "@/lib/spam";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Universal Trinity Ministry. Send us a message, find our service times and connect with us online.",
  alternates: { canonical: "/contact" },
};

interface Props {
  searchParams: Promise<{ subject?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const [settings, services, photos] = await Promise.all([getSiteSettings(), getServiceTimes(), getLibraryPhotos("joyful-member.jpg")]);
  const subject = ((await searchParams).subject ?? "").slice(0, 120);

  return (
    <>
      <PageHeader
        title="Contact us"
        intro="Send us a message and someone from the church will get back to you."
        image={photos.get("joyful-member.jpg") ?? null}
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-display-sm font-semibold text-navy-900">Reach us directly</h2>
              <div className="mt-8">
                <ContactDetails settings={settings} />
              </div>
              <div className="mt-10">
                <LocationMap settings={settings} title={`Map showing the location of ${settings.ministryName}`} />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="border border-line bg-ivory-100 p-6 sm:p-10">
                <h2 className="font-display text-display-sm font-semibold text-navy-900">Send a message</h2>
                <p className="mt-3 text-muted">We read every message and aim to reply within a few days.</p>
                <div className="mt-8">
                  <ContactForm token={createFormToken("contact")} defaultSubject={subject} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section aria-labelledby="contact-services" className="bg-sand py-16 sm:py-20">
        <Container>
          <h2 id="contact-services" className="font-display text-display-sm font-semibold text-navy-900">
            Service times
          </h2>
          <div className="mt-8">
            <ServiceList services={services} />
          </div>
        </Container>
      </section>
    </>
  );
}
