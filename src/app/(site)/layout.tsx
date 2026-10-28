import { SiteChrome } from "@/components/site/site-chrome";

// Public pages read live CMS content and carry a per-request CSP nonce.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
