import { ButtonLink } from "@/components/ui/button";
import { Wordmark } from "@/components/site/wordmark";
import { DesktopNav } from "@/components/site/desktop-nav";
import { MobileMenu } from "@/components/site/mobile-menu";
import type { PhotoSource } from "@/components/ui/photo";

interface SiteHeaderProps {
  ministryName: string;
  logo: PhotoSource | null;
}

/** White bar: wordmark left, pill links centred, a gold visit button and the menu right. */
export function SiteHeader({ ministryName, logo }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-5 sm:px-8">
        <Wordmark name={ministryName} logo={logo} />
        <DesktopNav />
        <div className="flex items-center justify-end gap-4">
          <div className="hidden md:block">
            <ButtonLink href="/plan-your-visit" variant="gold" className="!min-h-11 !px-6 !text-[0.8125rem] plausible-event-name=Plan+Visit+Click">
              Plan your visit
            </ButtonLink>
          </div>
          <MobileMenu ministryName={ministryName} />
        </div>
      </div>
    </header>
  );
}
