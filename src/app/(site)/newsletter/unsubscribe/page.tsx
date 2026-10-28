import type { Metadata } from "next";
import { unsubscribe } from "@/server/newsletter-actions";
import { buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ token?: string; result?: string }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token, result } = await searchParams;

  return (
    <section className="py-24 sm:py-32">
      <Container size="prose" className="text-center">
        {result === "done" ? (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">You have been unsubscribed</h1>
            <p className="mt-4 text-muted">You will no longer receive ministry updates by email.</p>
          </>
        ) : result === "invalid" || !token ? (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">This link is no longer valid</h1>
            <p className="mt-4 text-muted">You may already be unsubscribed. If you keep receiving emails, please contact us.</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-display-md font-semibold text-navy-900">Unsubscribe from updates</h1>
            <p className="mt-4 text-muted">Press the button below and we will stop sending you ministry updates.</p>
            <form action={unsubscribe} className="mt-8">
              <input type="hidden" name="token" value={token.slice(0, 100)} />
              <button type="submit" className={buttonClasses("navy")}>
                Unsubscribe
              </button>
            </form>
          </>
        )}
      </Container>
    </section>
  );
}
