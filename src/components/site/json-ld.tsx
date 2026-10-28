import { headers } from "next/headers";

/**
 * Emits schema.org structured data. JSON is serialised with `<` escaped so
 * editor-supplied text can never close the script element.
 */
export async function JsonLd({ data }: { data: Record<string, unknown> }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: json }} />;
}
