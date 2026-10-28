import type { Metadata } from "next";
import { getHomepage, getLibraryPhotos, getPageSectionMap, getPublishedLeaders } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Photo } from "@/components/ui/photo";
import { RichText } from "@/components/ui/rich-text";
import { PageHeader } from "@/components/site/page-header";
import { ContentSection } from "@/components/site/content-section";
import { VisitInvitation } from "@/components/home/visit-invitation";

export const metadata: Metadata = {
  title: "About Us",
  description: "Get to know Universal Trinity Ministry — who we are, what we believe and how you can be part of our church family.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [sections, home, leaders, photos] = await Promise.all([
    getPageSectionMap("about"),
    getHomepage(),
    getPublishedLeaders(),
    getLibraryPhotos("congregation-shiloh.jpg", "praise-hand-raised.jpg", "children-bible-reading.jpg", "prayer-man.jpg", "congregation-standing.jpg"),
  ]);
  const overview = sections.get("about.overview");
  const mission = sections.get("about.mission");
  const vision = sections.get("about.vision");
  const longForm = ["about.values", "about.beliefs", "about.history"].map((key) => sections.get(key)).filter((section) => section !== undefined);
  const hasStory = Boolean(overview || mission || vision || longForm.length);
  const mosaic = ["praise-hand-raised.jpg", "children-bible-reading.jpg", "prayer-man.jpg"].map((file) => photos.get(file)).filter((photo) => photo !== undefined);

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A family of *faith*"
        intro={home?.welcomeText}
        image={photos.get("congregation-shiloh.jpg") ?? null}
        crumbs={[{ label: "About Us", href: "/about" }]}
      />

      {overview && <ContentSection label="Welcome" title={overview.title} body={overview.body} />}

      {(mission || vision) && (
        <section aria-label="Mission and vision" className="on-dark grain bg-navy-900 py-20 sm:py-28">
          <Container>
            <div className={`grid gap-px bg-ivory/10 ${mission && vision ? "lg:grid-cols-2" : ""}`}>
              {[mission, vision].filter((item) => item !== undefined).map((item) => (
                <div key={item.key} className="reveal bg-navy-900 p-8 sm:p-12">
                  <p className="eyebrow text-gold">{item.key === "about.mission" ? "Why we exist" : "Where we are going"}</p>
                  <h2 className="mt-4 font-display text-display-md font-semibold text-ivory">{item.title}</h2>
                  <RichText markdown={item.body} className="mt-6 [&_p]:font-display [&_p]:text-2xl [&_p]:italic [&_p]:leading-snug [&_p]:text-ivory" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {mosaic.length === 3 && (
        <section aria-label="Life at the ministry" className="py-16 sm:py-20">
          <Container size="wide">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.2fr_0.8fr_1fr] sm:gap-4">
              {mosaic.map((photo, index) => (
                <div
                  key={photo.url}
                  className={`reveal relative overflow-hidden ${index === 0 ? "col-span-2 aspect-[16/10] sm:col-span-1 sm:aspect-auto sm:h-[26rem]" : "aspect-square sm:aspect-auto sm:h-[26rem]"} ${index === 1 ? "sm:mt-16" : ""}`}
                >
                  <Photo image={photo} sizes="(min-width: 640px) 33vw, 50vw" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {longForm.map((section, index) => (
        <ContentSection key={section.key} title={section.title} body={section.body} tone={index % 2 === 0 ? "sand" : "ivory"} />
      ))}

      {!hasStory && (
        <section className="pb-20">
          <Container size="prose">
            <EmptyState
              title="Our full story is coming soon"
              action={
                <ButtonLink href="/contact" variant="outline">
                  Ask us a question
                </ButtonLink>
              }
            >
              We are preparing a fuller introduction to our mission, vision and beliefs. In the meantime, we would be glad to hear from you.
            </EmptyState>
          </Container>
        </section>
      )}

      {leaders.length > 0 && (
        <section className="border-t border-line py-20">
          <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow text-gold-ink">Leadership</p>
              <h2 className="mt-3 font-display text-display-sm font-semibold text-navy-900">Meet the people who serve and shepherd our church.</h2>
            </div>
            <ButtonLink href="/leadership" variant="navy" arrow>
              Our leadership
            </ButtonLink>
          </Container>
        </section>
      )}

      <VisitInvitation image={photos.get("congregation-standing.jpg") ?? null} />
    </>
  );
}
