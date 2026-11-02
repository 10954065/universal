import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { createFormToken } from "@/lib/spam";
import { NEWSLETTER_CONSENT_TEXT } from "@/lib/validation";

/** Ministry updates sign-up. Rendered only once email delivery is configured and enabled. */
export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-heading" className="bg-sand py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="newsletter-heading" className="text-display-md font-semibold text-navy-900">
            Ministry updates by email
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">Devotionals, programme announcements and news. We will never share your email address.</p>
        </div>
        <div className="mx-auto mt-10 max-w-xl">
          <NewsletterForm token={createFormToken("newsletter")} consentText={NEWSLETTER_CONSENT_TEXT} />
        </div>
      </Container>
    </section>
  );
}
