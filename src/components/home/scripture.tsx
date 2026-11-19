import { Container } from "@/components/ui/container";

interface ScriptureProps {
  text: string;
  reference: string;
  translation: string | null;
}

/** A single verse set large on a saffron band under a giant quotation mark, with the reference on a navy pill. */
export function Scripture({ text, reference, translation }: ScriptureProps) {
  return (
    <section aria-label="Scripture" className="relative overflow-hidden bg-gold py-24 sm:py-32">
      <span aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none font-display text-[18rem] font-extrabold leading-none text-navy-900/10 sm:text-[26rem]">
        &ldquo;
      </span>
      <Container>
        <figure className="reveal relative mx-auto max-w-4xl text-center">
          <blockquote className="text-display-md text-navy-900">
            <p>{text}</p>
          </blockquote>
          <figcaption className="label mt-10 inline-flex rounded-full bg-navy-900 px-5 py-2.5 text-gold">
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
