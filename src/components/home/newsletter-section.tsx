import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { createFormToken } from "@/lib/spam";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/validation";

/** Ministry updates sign-up. Rendered only once email delivery is configured and enabled. */
export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-heading" className="border-t border-line bg-ivory-100 py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow text-gold-ink">Stay connected</p>
            <h2 id="newsletter-heading" className="mt-4 font-display text-display-md font-semibold text-navy-900">
              Ministry updates, <em className="font-medium text-gold-ink">in your inbox</em>
            </h2>
            <p className="mt-4 leading-relaxed text-muted">Devotionals, programme announcements and news. We will never share your email address.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <NewsletterForm token={createFormToken("newsletter")} consentText={NEWSLETTER_CONSENT_TEXT} />
          </div>
        </div>
      </Container>
    </section>
  );
}
