import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

interface WelcomeProps {
  heading: string;
  text: string;
  image: PhotoSource | null;
}

/** The welcome as a bold statement beside a full-colour photograph framed by a gold block. */
export function Welcome({ heading, text, image }: WelcomeProps) {
  return (
    <section aria-labelledby="welcome-heading" className="overflow-hidden py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {image && (
            <div className="reveal relative lg:col-span-5">
              <div aria-hidden="true" className="absolute -bottom-5 -left-5 h-3/4 w-3/4 rounded-tile bg-gold sm:-bottom-7 sm:-left-7" />
              <div aria-hidden="true" className="kente absolute -right-3 top-10 h-24 w-3 rounded-full" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-navy-900 shadow-[0_30px_60px_-25px_rgb(10_26_85/0.5)]">
                <Photo image={image} sizes="(min-width: 1024px) 28rem, 100vw" />
              </div>
            </div>
          )}
          <div className={`reveal ${image ? "lg:col-span-7" : "lg:col-span-12 text-center"}`}>
            <h2 id="welcome-heading" className="label inline-flex rounded-full bg-navy-900 px-4 py-2 text-gold">
              {heading}
            </h2>
            <p className="mt-7 text-display-md text-navy-900">{text}</p>
            <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${image ? "" : "justify-center"}`}>
              <ButtonLink href="/about" variant="primary" arrow>
                About us
              </ButtonLink>
              <ButtonLink href="/leadership" variant="outline">
                Our leaders
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
