import type { Metadata } from "next";
import { getPublishedLeaders } from "@/lib/content";
import { safeExternalUrl } from "@/lib/safe-url";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Photo } from "@/components/ui/photo";
import { RichText } from "@/components/ui/rich-text";
import { PageHeader } from "@/components/site/page-header";
import { SocialIcon } from "@/components/site/social-links";

export const metadata: Metadata = {
  title: "Our Leadership",
  description: "Meet the leaders who serve and shepherd Universal Trinity Ministry.",
  alternates: { canonical: "/leadership" },
};

export default async function LeadershipPage() {
  const leaders = await getPublishedLeaders();

  return (
    <>
      <PageHeader
        title="Our leaders"
        intro="The pastors and leaders of our church."
        crumbs={[
          { label: "About Us", href: "/about" },
          { label: "Our Leadership", href: "/leadership" },
        ]}
      />
      <section className="py-20 sm:py-28">
        <Container>
          {leaders.length === 0 ? (
            <EmptyState
              title="Leader profiles will be added soon"
              action={
                <ButtonLink href="/contact" variant="outline">
                  Contact the ministry
                </ButtonLink>
              }
            >
              Please check back soon.
            </EmptyState>
          ) : (
            <ul className="space-y-24">
              {leaders.map((leader, index) => {
                const socials = [
                  ["facebook", safeExternalUrl(leader.facebookUrl)],
                  ["instagram", safeExternalUrl(leader.instagramUrl)],
                  ["x", safeExternalUrl(leader.xUrl)],
                ] as const;
                const flipped = index % 2 === 1;
                return (
                  <li key={leader.id} id={leader.slug} className="reveal grid scroll-mt-28 items-center gap-10 md:grid-cols-12 md:gap-14">
                    <div className={`relative aspect-[4/5] overflow-hidden bg-sand md:col-span-5 ${flipped ? "md:order-2 md:col-start-8" : ""}`}>
                      {leader.image && <Photo image={leader.image} alt={`Portrait of ${leader.name}`} sizes="(min-width: 768px) 40vw, 100vw" />}
                    </div>
                    <div className={`md:col-span-6 ${flipped ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                      <p className="eyebrow text-gold-ink">{leader.role}</p>
                      <h2 className="mt-4 font-display text-display-md font-semibold text-navy-900">{leader.name}</h2>
                      {leader.bio && <RichText markdown={leader.bio} className="mt-6" />}
                      {leader.responsibilities && (
                        <div className="mt-8 border-l-2 border-gold pl-5">
                          <p className="eyebrow text-muted">Responsibilities</p>
                          <p className="mt-2 leading-relaxed text-navy-800">{leader.responsibilities}</p>
                        </div>
                      )}
                      <ul className="mt-8 flex gap-2">
                        {socials.map(([network, href]) =>
                          href ? (
                            <li key={network}>
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 w-11 items-center justify-center border border-navy-900/20 text-navy-900 transition-colors hover:bg-navy-900 hover:text-ivory"
                              >
                                <SocialIcon network={network} />
                                <span className="sr-only">
                                  {leader.name} on {network} (opens in a new tab)
                                </span>
                              </a>
                            </li>
                          ) : null,
                        )}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
