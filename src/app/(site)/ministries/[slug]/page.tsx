import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, Mail, Phone, User, type LucideIcon } from "lucide-react";
import { getMinistryBySlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import { telHref } from "@/lib/safe-url";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { PageHeader } from "@/components/site/page-header";
import { ShareLinks } from "@/components/site/share-links";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ministry = await getMinistryBySlug((await params).slug);
  if (!ministry) return { title: "Ministry not found" };
  return {
    title: ministry.name,
    description: ministry.summary,
    alternates: { canonical: `/ministries/${ministry.slug}` },
    openGraph: ministry.image ? { images: [{ url: ministry.image.url, alt: ministry.image.alt }] } : undefined,
  };
}

export default async function MinistryPage({ params }: Props) {
  const ministry = await getMinistryBySlug((await params).slug);
  if (!ministry) notFound();

  const details: { icon: LucideIcon; label: string; value: string }[] = [];
  if (ministry.leaderName) details.push({ icon: User, label: "Led by", value: ministry.leaderName });
  if (ministry.meetingInfo) details.push({ icon: CalendarClock, label: "When we meet", value: ministry.meetingInfo });
  const phone = telHref(ministry.contactPhone);

  return (
    <>
      <PageHeader
        eyebrow="Ministry"
        title={ministry.name}
        intro={ministry.summary}
        image={ministry.image}
        crumbs={[
          { label: "Our Ministries", href: "/ministries" },
          { label: ministry.name, href: `/ministries/${ministry.slug}` },
        ]}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {ministry.description ? (
                <RichText markdown={ministry.description} />
              ) : (
                <p className="text-lg leading-relaxed text-muted">More about this ministry will be shared soon. Get in touch to find out how to take part.</p>
              )}
              <div className="mt-12">
                <ShareLinks url={absoluteUrl(`/ministries/${ministry.slug}`)} title={ministry.name} />
              </div>
            </div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border border-line bg-ivory-100 p-8 lg:sticky lg:top-28">
                <h2 className="font-display text-2xl font-semibold text-navy-900">Get involved</h2>
                {details.length > 0 && (
                  <dl className="mt-6 space-y-5">
                    {details.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex gap-4">
                        <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
                        <div>
                          <dt className="eyebrow text-muted">{label}</dt>
                          <dd className="mt-1 text-navy-900">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                )}
                {(ministry.contactEmail || phone) && (
                  <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
                    {ministry.contactEmail && (
                      <li className="flex items-center gap-3">
                        <Mail aria-hidden="true" className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
                        <a href={`mailto:${ministry.contactEmail}`} className="break-all text-navy-900 underline decoration-gold-ink/50 underline-offset-4">
                          {ministry.contactEmail}
                        </a>
                      </li>
                    )}
                    {phone && (
                      <li className="flex items-center gap-3">
                        <Phone aria-hidden="true" className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
                        <a href={phone} className="text-navy-900 underline decoration-gold-ink/50 underline-offset-4">
                          {ministry.contactPhone}
                        </a>
                      </li>
                    )}
                  </ul>
                )}
                <ButtonLink href={`/contact?subject=${encodeURIComponent(ministry.name)}`} variant="navy" arrow className="mt-8 w-full">
                  Ask about joining
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
