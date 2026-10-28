import { notFound } from "next/navigation";
import { getPageSections } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { PageHeader } from "@/components/site/page-header";

/** Renders a published legal document (privacy policy, terms) from the CMS. */
export async function LegalPage({ page, href, eyebrow }: { page: string; href: string; eyebrow: string }) {
  const sections = await getPageSections(page);
  const [document] = sections;
  if (!document) notFound();

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={document.title} crumbs={[{ label: document.title, href }]} />
      <section className="py-16 sm:py-20">
        <Container size="prose">
          <RichText markdown={document.body} />
        </Container>
      </section>
    </>
  );
}
