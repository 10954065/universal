import type { Metadata } from "next";
import { getLibraryPhotos } from "@/lib/content";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { SiteChrome } from "@/components/site/site-chrome";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default async function NotFound() {
  const photos = await getLibraryPhotos("pulpit-shepherd.jpg");
  const image = photos.get("pulpit-shepherd.jpg");

  return (
    <SiteChrome>
      <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-28 sm:py-40">
        {image && <Photo image={image} alt="" sizes="100vw" className="-z-10 opacity-25" />}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-950/50" />
        <Container>
          <p className="eyebrow flex items-center gap-3 text-gold">
            <span aria-hidden="true" className="rule-gold" />
            Error 404
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-display-xl font-semibold text-ivory">
            This page has <em className="font-medium text-gold">wandered off.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
            The page you were looking for may have moved or no longer exists. Let us help you find your way home.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
