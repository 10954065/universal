import type { Metadata } from "next";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/format";
import { applyVerifiedTransaction, isPaystackConfigured, verifyTransaction } from "@/lib/paystack";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Thank you", robots: { index: false, follow: false } };

interface Props {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}

/**
 * Paystack redirects here after checkout. The redirect itself proves nothing:
 * the transaction is verified server-to-server before anything is confirmed.
 */
export default async function GiveThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = (params.reference ?? params.trxref ?? "").slice(0, 64);
  const valid = /^UTM-[A-Z0-9-]{4,40}$/.test(reference);

  let donation = valid ? await db.donation.findUnique({ where: { reference }, include: { category: true } }) : null;
  let verificationFailed = false;

  if (donation && donation.status === "PENDING" && isPaystackConfigured()) {
    try {
      const txn = await verifyTransaction(reference);
      await applyVerifiedTransaction(txn, "VERIFIED");
      donation = await db.donation.findUnique({ where: { reference }, include: { category: true } });
    } catch {
      verificationFailed = true;
    }
  }

  const status = donation?.status;
  const view =
    status === "SUCCESS"
      ? { icon: CheckCircle2, tone: "text-success", title: "Thank you for your gift", text: "Your payment has been verified. A receipt from Paystack has been sent to your email." }
      : status === "FAILED" || status === "ABANDONED"
        ? { icon: XCircle, tone: "text-danger", title: "The payment was not completed", text: "No gift was recorded. If money left your account, please contact us with your reference." }
        : { icon: Clock, tone: "text-gold-ink", title: "We are confirming your payment", text: verificationFailed ? "We could not reach the payment provider just now. Your payment will be confirmed automatically, so there is no need to pay again." : "This can take a moment. Your payment will be confirmed automatically. Please do not pay again." };

  return (
    <section className="py-24 sm:py-32">
      <Container size="prose">
        {!donation ? (
          <div className="text-center">
            <h1 className="font-display text-display-md font-semibold text-navy-900">We could not find that payment</h1>
            <p className="mt-4 text-muted">If you were charged, please contact us and include your payment reference.</p>
            <ButtonLink href="/contact?subject=Giving%20enquiry" variant="navy" className="mt-8">
              Contact us
            </ButtonLink>
          </div>
        ) : (
          <div className="text-center" role="status">
            <view.icon aria-hidden="true" className={`mx-auto h-14 w-14 ${view.tone}`} strokeWidth={1.25} />
            <h1 className="mt-6 font-display text-display-md font-semibold text-navy-900">{view.title}</h1>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{view.text}</p>
            <dl className="mx-auto mt-10 max-w-sm divide-y divide-line border-y border-line text-left text-[0.9375rem]">
              <div className="flex justify-between py-3">
                <dt className="text-muted">Amount</dt>
                <dd className="font-semibold text-navy-900">{formatMoney(donation.amountMinor, donation.currency)}</dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-muted">Giving towards</dt>
                <dd className="text-navy-900">{donation.category?.name ?? "General offering"}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-muted">Reference</dt>
                <dd className="break-all font-mono text-sm text-navy-900">{donation.reference}</dd>
              </div>
            </dl>
            <ButtonLink href="/" variant="outline" className="mt-10">
              Return home
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
