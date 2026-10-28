import type { Metadata } from "next";
import { EyeOff, Lock, Trash2 } from "lucide-react";
import { getLibraryPhotos, getSiteSettings } from "@/lib/content";
import { createFormToken } from "@/lib/spam";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/site/page-header";
import { PrayerForm } from "@/components/forms/prayer-form";

export const metadata: Metadata = {
  title: "Prayer Requests",
  description: "Share a prayer request with the Universal Trinity Ministry prayer team. Requests are private and can be made anonymously.",
  alternates: { canonical: "/prayer" },
};

export default async function PrayerPage() {
  const [settings, photos] = await Promise.all([getSiteSettings(), getLibraryPhotos("prayer-bowed.jpg")]);
  const promises = [
    { icon: Lock, title: "Kept private", text: "Requests are never published. Only authorised members of our prayer team can read them." },
    { icon: EyeOff, title: "Anonymous if you prefer", text: "You can submit without a name or contact details. Nothing identifying is stored." },
    {
      icon: Trash2,
      title: "Not kept forever",
      text: `Requests are permanently deleted ${settings.prayerRetentionDays} days after they are received. They are never shared with third-party services.`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Prayer requests"
        intro="Tell us what you would like us to pray about. You can include your name or stay anonymous."
        image={photos.get("prayer-bowed.jpg") ?? null}
        crumbs={[{ label: "Prayer Requests", href: "/prayer" }]}
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-display-sm italic leading-snug text-navy-900">
                &ldquo;Casting all your care upon him; for he careth for you.&rdquo;
              </p>
              <p className="eyebrow mt-4 text-gold-ink">1 Peter 5:7 (KJV)</p>
              <ul className="mt-12 space-y-8">
                {promises.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-navy-900 text-gold">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h2 className="font-semibold text-navy-900">{title}</h2>
                      <p className="mt-1 leading-relaxed text-muted">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="border border-line bg-ivory-100 p-6 sm:p-10">
                <h2 className="font-display text-display-sm font-semibold text-navy-900">Share your request</h2>
                <div className="mt-8">
                  <PrayerForm token={createFormToken("prayer")} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
