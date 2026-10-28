import { getActiveAnnouncement, getSiteSettings } from "@/lib/content";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

// Public pages read live CMS content and carry a per-request CSP nonce.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, announcement] = await Promise.all([getSiteSettings(), getActiveAnnouncement()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-navy-900 px-5 py-3 font-semibold text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      {announcement && (
        <AnnouncementBar message={announcement.message} linkLabel={announcement.linkLabel} linkHref={announcement.linkHref} />
      )}
      <SiteHeader ministryName={settings.ministryName} logo={settings.logo} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
