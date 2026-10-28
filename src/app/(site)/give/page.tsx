import type { Metadata } from "next";
import { Building2, Smartphone } from "lucide-react";
import { getActiveGivingCategories, getLibraryPhotos, getPageSectionMap, getSiteSettings } from "@/lib/content";
import { isOnlineGivingAvailable } from "@/lib/paystack";
import { createFormToken } from "@/lib/spam";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHeader } from "@/components/site/page-header";
import { GiveForm } from "@/components/forms/give-form";

export const metadata: Metadata = {
  title: "Give",
  description: "Support the work of Universal Trinity Ministry through bank transfer, Mobile Money or secure online giving.",
  alternates: { canonical: "/give" },
};

export default async function GivePage() {
  const [settings, categories, sections, photos] = await Promise.all([
    getSiteSettings(),
    getActiveGivingCategories(),
    getPageSectionMap("give"),
    getLibraryPhotos("worship-seated.jpg"),
  ]);
  const online = isOnlineGivingAvailable(settings.onlineGivingEnabled);
  const why = sections.get("give.why");
  const faq = sections.get("give.faq");
  const methods = [
    settings.bankInstructions && { icon: Building2, title: "Bank transfer", body: settings.bankInstructions },
    settings.momoInstructions && { icon: Smartphone, title: "Mobile Money", body: settings.momoInstructions },
  ].filter(Boolean) as { icon: typeof Building2; title: string; body: string }[];

  return (
    <>
      <PageHeader
        title="Giving"
        intro={
          settings.givingIntro ??
          "Your generosity helps us worship, teach, care for one another and serve our community. Thank you for partnering with us."
        }
        image={photos.get("worship-seated.jpg") ?? null}
        crumbs={[{ label: "Give", href: "/give" }]}
      />

      {why && (
        <section className="py-16 sm:py-20">
          <Container size="prose">
            <h2 className="font-display text-display-md font-semibold text-navy-900">{why.title}</h2>
            <RichText markdown={why.body} className="mt-6" />
          </Container>
        </section>
      )}

      <section aria-labelledby="ways-to-give" className="bg-sand py-20 sm:py-24">
        <Container>
          <SectionHeading id="ways-to-give" title="Ways to give" size="md" />
          <div className={`mt-12 grid gap-6 ${online ? "lg:grid-cols-12" : ""}`}>
            <div className={online ? "space-y-6 lg:col-span-6" : "grid gap-6 md:grid-cols-2"}>
              {methods.map(({ icon: Icon, title, body }) => (
                <article key={title} className="border border-navy-900/10 bg-ivory p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center bg-navy-900 text-gold">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold text-navy-900">{title}</h3>
                  <RichText markdown={body} className="mt-4" />
                </article>
              ))}
              {methods.length === 0 && (
                <article className="border border-navy-900/10 bg-ivory p-8 md:col-span-2">
                  <h3 className="font-display text-2xl font-semibold text-navy-900">Giving details coming soon</h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    Our official bank and Mobile Money details will be published here once confirmed. For now, please contact us and we will share how you can give.
                  </p>
                  <ButtonLink href="/contact?subject=Giving" variant="outline" className="mt-6">
                    Ask about giving
                  </ButtonLink>
                </article>
              )}
            </div>
            {online && (
              <div className="lg:col-span-6">
                <div className="border border-navy-900/10 bg-ivory p-8">
                  <h3 className="font-display text-2xl font-semibold text-navy-900">Give online</h3>
                  <p className="mt-3 leading-relaxed text-muted">Card and Mobile Money payments are processed securely by Paystack. We never see or store your card details.</p>
                  <div className="mt-6">
                    <GiveForm token={createFormToken("donation")} categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {!online && methods.length > 0 && <p className="mt-8 text-sm text-muted">Online card and Mobile Money giving is not yet available on this website.</p>}
        </Container>
      </section>

      {faq && (
        <section className="py-20 sm:py-24">
          <Container size="prose">
            <h2 className="font-display text-display-md font-semibold text-navy-900">{faq.title}</h2>
            <RichText markdown={faq.body} className="mt-8" />
          </Container>
        </section>
      )}

      <section className="border-t border-line py-14">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-lg text-navy-800">
            Questions about giving{settings.givingContact ? `? Contact ${settings.givingContact}.` : "? We are happy to help."}
          </p>
          <ButtonLink href="/contact?subject=Giving%20enquiry" variant="navy" arrow>
            Giving enquiries
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
