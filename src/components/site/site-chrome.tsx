import type { ReactNode } from "react";
import { getActiveAnnouncement, getSiteSettings } from "@/lib/content";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

/** Skip link, announcement, header and footer shared by public pages and the 404 page. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [settings, announcement] = await Promise.all([getSiteSettings(), getActiveAnnouncement()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-navy-900 px-5 py-3 font-semibold text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      {announcement && <AnnouncementBar message={announcement.message} linkLabel={announcement.linkLabel} linkHref={announcement.linkHref} />}
      <SiteHeader ministryName={settings.ministryName} logo={settings.logo} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
