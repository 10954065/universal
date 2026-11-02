import { Container } from "@/components/ui/container";

interface ScriptureProps {
  text: string;
  reference: string;
  translation: string | null;
}

/** A single verse set large on a white band, with the reference in small monospace. */
export function Scripture({ text, reference, translation }: ScriptureProps) {
  return (
    <section aria-label="Scripture" className="bg-ivory py-24 sm:py-36">
      <Container>
        <figure className="reveal mx-auto max-w-4xl text-center">
          <blockquote className="text-display-md text-navy-900">
            <p>{text}</p>
          </blockquote>
          <figcaption className="label mt-10 text-muted">
            <cite className="not-italic">
              {reference}
              {translation ? ` (${translation})` : ""}
            </cite>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
