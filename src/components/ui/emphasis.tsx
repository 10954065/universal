import { Fragment } from "react";

/**
 * Renders editor-supplied headings, turning `*words*` into an italic accent.
 * Plain text only — no HTML is ever interpreted.
 */
export function Emphasis({ text, accentClassName = "text-gold-ink" }: { text: string; accentClassName?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
          <em key={index} className={`font-medium italic ${accentClassName}`}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Removes emphasis markers, for use in metadata and alt text. */
export function stripEmphasis(text: string): string {
  return text.replace(/\*([^*]+)\*/g, "$1");
}
