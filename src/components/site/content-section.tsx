import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";

interface ContentSectionProps {
  title: string;
  body: string;
  label?: string;
  tone?: "ivory" | "sand";
}

/** Two-column editorial block: sticky title on the left, CMS Markdown on the right. */
export function ContentSection({ title, body, label, tone = "ivory" }: ContentSectionProps) {
  return (
    <section className={`py-20 sm:py-24 ${tone === "sand" ? "bg-sand" : ""}`}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="reveal lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              {label && <p className="eyebrow text-gold-ink">{label}</p>}
              <h2 className="mt-4 font-display text-display-md font-semibold text-navy-900">{title}</h2>
            </div>
          </div>
          <div className="reveal lg:col-span-7 lg:col-start-6">
            <RichText markdown={body} className="max-w-prose" />
          </div>
        </div>
      </Container>
    </section>
  );
}
