import { Container } from "@/components/ui/container";

interface ScriptureProps {
  text: string;
  reference: string;
  translation: string | null;
}

/** Large centred scripture quotation with a hairline frame. */
export function Scripture({ text, reference, translation }: ScriptureProps) {
  return (
    <section aria-label="Scripture" className="relative overflow-hidden bg-ivory py-24 sm:py-36">
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
      <Container size="site">
        <figure className="reveal relative mx-auto max-w-4xl bg-ivory px-2 text-center sm:px-12">
          <span aria-hidden="true" className="block font-display text-[7rem] leading-[0.6] text-gold">
            &ldquo;
          </span>
          <blockquote className="mt-6 font-display text-display-md font-medium italic text-navy-900">
            <p>{text}</p>
          </blockquote>
          <figcaption className="mt-10 flex items-center justify-center gap-4">
            <span aria-hidden="true" className="rule-gold" />
            <cite className="eyebrow not-italic text-gold-ink">
              {reference}
              {translation ? ` · ${translation}` : ""}
            </cite>
            <span aria-hidden="true" className="rule-gold" />
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
