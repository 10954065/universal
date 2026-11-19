import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ServiceList, type ServiceItem } from "@/components/site/service-list";

/** Deep royal band: a bold invitation with a gold button beside it, then the gatherings as numbered cards. */
export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section aria-labelledby="services-heading" className="on-dark glow-royal py-24 text-white sm:py-32">
      <Container>
        <div className="reveal flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="label text-gold">Worship with us</p>
            <h2 id="services-heading" className="mt-4 text-display-lg text-white">
              Service <span className="text-gold">times</span>
            </h2>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-mist">Everyone is welcome. Feel free to bring a friend.</p>
          </div>
          <ButtonLink href="/plan-your-visit" variant="gold" arrow className="self-start lg:self-auto plausible-event-name=Plan+Visit+Click">
            Plan your visit
          </ButtonLink>
        </div>
        <div className="reveal mt-14">
          <ServiceList services={services} tone="dark" />
        </div>
      </Container>
    </section>
  );
}
