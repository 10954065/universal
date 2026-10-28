import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceList, type ServiceItem } from "@/components/site/service-list";

export function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section aria-labelledby="services-heading" className="grain relative bg-sand py-24 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <SectionHeading
              id="services-heading"
              title="Service times"
              size="md"
              intro="Everyone is welcome. Feel free to bring a friend."
            />
            <div className="mt-9">
              <ButtonLink href="/plan-your-visit" variant="outline" arrow className="plausible-event-name=Plan+Visit+Click">
                Plan your visit
              </ButtonLink>
            </div>
          </div>
          <div className="reveal lg:col-span-8">
            <ServiceList services={services} />
          </div>
        </div>
      </Container>
    </section>
  );
}
