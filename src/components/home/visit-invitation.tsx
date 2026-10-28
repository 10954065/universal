import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

/** Closing invitation band over a darkened congregation photograph. */
export function VisitInvitation({ image }: { image: PhotoSource | null }) {
  return (
    <section aria-labelledby="invite-heading" className="on-dark relative isolate overflow-hidden bg-navy-950 py-28 sm:py-36">
      {image && <Photo image={image} sizes="100vw" alt="" className="-z-10 opacity-35" />}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
      <Container>
        <div className="reveal max-w-2xl">
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span aria-hidden="true" className="rule-gold" />
            You are invited
          </p>
          <h2 id="invite-heading" className="mt-6 font-display text-display-lg font-semibold text-ivory">
            We would love to <em className="font-medium text-gold">meet you.</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mist">
            Planning your first visit? Let us know you are coming and we will look out for you.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/plan-your-visit" arrow className="plausible-event-name=Plan+Visit+Click">
              Plan Your Visit
            </ButtonLink>
            <ButtonLink href="/prayer" variant="outline-light">
              Request prayer
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
