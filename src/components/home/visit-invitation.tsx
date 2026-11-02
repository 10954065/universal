import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

/** Quiet closing invitation: a centred line, two buttons and a small photograph beneath. */
export function VisitInvitation({ image }: { image: PhotoSource | null }) {
  return (
    <section aria-labelledby="invite-heading" className="pb-24 sm:pb-32">
      <Container>
        <div className="reveal text-center">
          <h2 id="invite-heading" className="text-display-lg text-navy-900">
            Plan your first visit
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-navy-800">Let us know you are coming and someone will be there to welcome you.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/plan-your-visit" className="plausible-event-name=Plan+Visit+Click">
              Plan your visit
            </ButtonLink>
            <ButtonLink href="/prayer" variant="outline">
              Request prayer
            </ButtonLink>
          </div>
        </div>
        {image && (
          <div className="reveal relative mx-auto mt-16 aspect-[3/4] w-full max-w-[18rem] overflow-hidden bg-navy-900">
            <Photo image={image} sizes="18rem" alt="" />
          </div>
        )}
      </Container>
    </section>
  );
}
