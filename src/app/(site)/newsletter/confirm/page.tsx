import type { Metadata } from "next";
import { confirmSubscription } from "@/server/newsletter-actions";
import { buttonClasses, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Confirm subscription", robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ token?: string; result?: string }>;
}

export default async function ConfirmSubscriptionPage({ searchParams }: Props) {
  const { token, result } = await searchParams;

  return (
    <section className="py-24 sm:py-32">
      <Container size="prose" className="text-center">
        {result === "confirmed" ? (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">You&apos;re subscribed</h1>
            <p className="mt-4 text-muted">Thank you. You will now receive ministry updates by email. You can unsubscribe at any time.</p>
            <ButtonLink href="/" variant="outline" className="mt-8">
              Return home
            </ButtonLink>
          </>
        ) : result === "invalid" || !token ? (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">This link is no longer valid</h1>
            <p className="mt-4 text-muted">It may already have been used. If you still want updates, please subscribe again from the homepage.</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">Confirm your subscription</h1>
            <p className="mt-4 text-muted">Press the button below to start receiving ministry updates by email.</p>
            <form action={confirmSubscription} className="mt-8">
              <input type="hidden" name="token" value={token.slice(0, 100)} />
              <button type="submit" className={buttonClasses("navy")}>
                Confirm subscription
              </button>
            </form>
          </>
        )}
      </Container>
    </section>
  );
}
