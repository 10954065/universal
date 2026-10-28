import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="py-32">
      <Container>
        <SectionHeading as="h1" eyebrow="Universal Trinity Ministry" index="01" title="Design *foundation*" intro="Homepage sections arrive in phase 3." />
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/plan-your-visit" arrow>Plan Your Visit</ButtonLink>
          <ButtonLink href="/about" variant="outline">Explore Our Ministry</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
