import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

/** Closing invitation: a royal panel edged in kente, the call to action on the left and a photograph on the right. */
export function VisitInvitation({ image }: { image: PhotoSource | null }) {
  return (
    <section aria-labelledby="invite-heading" className="py-24 sm:py-32">
      <Container>
        <div className="reveal on-dark glow-royal relative isolate overflow-hidden rounded-tile text-white">
          <div aria-hidden="true" className="kente h-3" />
          <div className="grid lg:grid-cols-2">
            <div className="px-7 py-14 sm:px-14 sm:py-20">
              <p className="label text-gold">You are welcome here</p>
              <h2 id="invite-heading" className="mt-5 text-display-lg text-white">
                Plan your <span className="text-gold">first visit</span>
              </h2>
              <p className="mt-5 max-w-md text-xl leading-relaxed text-mist">Let us know you are coming and someone will be there to welcome you.</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/plan-your-visit" variant="gold" arrow className="plausible-event-name=Plan+Visit+Click">
                  Plan your visit
                </ButtonLink>
                <ButtonLink href="/prayer" variant="outline-light">
                  Request prayer
                </ButtonLink>
              </div>
            </div>
            {image && (
              <div className="relative min-h-80 lg:min-h-full">
                <Photo image={image} sizes="(min-width: 1024px) 38rem, 100vw" alt="" />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-900/50 to-transparent lg:bg-linear-to-r lg:from-navy-900 lg:via-navy-900/20" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
