import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/site/wordmark";
import { DesktopNav } from "@/components/site/desktop-nav";
import { MobileMenu } from "@/components/site/mobile-menu";
import type { PhotoSource } from "@/components/ui/photo";

interface SiteHeaderProps {
  ministryName: string;
  logo: PhotoSource | null;
}

export function SiteHeader({ ministryName, logo }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-ivory/92 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/80">
      <Container size="wide" className="flex h-20 items-center justify-between gap-6">
        <Wordmark name={ministryName} logo={logo} />
        <DesktopNav />
        <div className="flex items-center gap-3">
          <ButtonLink href="/plan-your-visit" variant="navy" className="hidden !min-h-11 !px-5 sm:inline-flex">
            Plan Your Visit
          </ButtonLink>
          <MobileMenu ministryName={ministryName} />
        </div>
      </Container>
    </header>
  );
}
