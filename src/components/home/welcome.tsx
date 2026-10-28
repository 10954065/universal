import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { SectionHeading } from "@/components/ui/section-heading";

interface WelcomeProps {
  heading: string;
  text: string;
  image: PhotoSource | null;
  accentImage: PhotoSource | null;
}

/** Asymmetric welcome: wide photograph with an overlapping portrait, text offset to the right. */
export function Welcome({ heading, text, image, accentImage }: WelcomeProps) {
  return (
    <section aria-labelledby="welcome-heading" className="overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="reveal relative lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden">
              {image && <Photo image={image} sizes="(min-width: 1024px) 55vw, 100vw" />}
            </div>
            {accentImage && (
              <div className="absolute -bottom-12 right-4 hidden aspect-[3/4] w-[34%] overflow-hidden border-[6px] border-ivory shadow-[0_30px_60px_-30px_rgba(16,27,45,0.5)] sm:block lg:-right-10">
                <Photo image={accentImage} sizes="20vw" />
              </div>
            )}
          </div>
          <div className="reveal lg:col-span-5 lg:pl-10">
            <SectionHeading id="welcome-heading" title={heading} size="md" />
            <p className="mt-7 text-lg leading-relaxed text-muted">{text}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink href="/about" variant="navy" arrow>
                About Us
              </ButtonLink>
              <ButtonLink href="/leadership" variant="text">
                Meet our leadership
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
