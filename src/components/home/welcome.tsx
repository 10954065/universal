import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo, type PhotoSource } from "@/components/ui/photo";

interface WelcomeProps {
  heading: string;
  text: string;
  image: PhotoSource | null;
}

/** The welcome as a single statement centred over a dark, black-and-white photograph. */
export function Welcome({ heading, text, image }: WelcomeProps) {
  return (
    <section aria-labelledby="welcome-heading" className="pb-24 sm:pb-32">
      <Container>
        <div className="reveal on-dark relative isolate flex min-h-[28rem] items-center justify-center overflow-hidden bg-navy-900 px-6 py-20 text-center sm:px-16">
          {image && <Photo image={image} sizes="(min-width: 1024px) 62rem, 100vw" alt="" className="-z-10 opacity-45 grayscale" />}
          <div>
            <h2 id="welcome-heading" className="label text-white/80">
              {heading}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-display-md text-white">{text}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
              <ButtonLink href="/about" variant="text-light">
                About us
              </ButtonLink>
              <ButtonLink href="/leadership" variant="text-light">
                Our leaders
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
