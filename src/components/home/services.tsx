import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ServiceList, type ServiceItem } from "@/components/site/service-list";

/** Centred invitation with a single outlined button, then the gatherings as numbered cards. */
export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section aria-labelledby="services-heading" className="py-24 sm:py-32">
      <Container>
        <div className="reveal text-center">
          <h2 id="services-heading" className="text-display-lg text-navy-900">
            Service times
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-navy-800">Everyone is welcome. Feel free to bring a friend.</p>
          <div className="mt-8">
            <ButtonLink href="/plan-your-visit" variant="outline" className="plausible-event-name=Plan+Visit+Click">
              Plan your visit
            </ButtonLink>
          </div>
        </div>
        <div className="reveal mt-16">
          <ServiceList services={services} />
        </div>
      </Container>
    </section>
  );
}
