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
          <h2 id="invite-heading" className="font-display text-display-lg font-semibold text-ivory">
            Plan your first visit
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-mist">
            Let us know you are coming and someone will be there to welcome you.
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
