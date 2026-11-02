import { Wordmark } from "@/components/site/wordmark";
import { DesktopNav } from "@/components/site/desktop-nav";
import { MobileMenu } from "@/components/site/mobile-menu";
import type { PhotoSource } from "@/components/ui/photo";

interface SiteHeaderProps {
  ministryName: string;
  logo: PhotoSource | null;
}

/** Plain white bar: wordmark left, links centred, menu button right. */
export function SiteHeader({ ministryName, logo }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-ivory">
      <div className="mx-auto grid h-16 max-w-[76rem] grid-cols-[auto_1fr_auto] items-center gap-8 px-5 sm:px-8">
        <Wordmark name={ministryName} logo={logo} />
        <DesktopNav />
        <div className="flex justify-end">
          <MobileMenu ministryName={ministryName} />
        </div>
      </div>
    </header>
  );
}
