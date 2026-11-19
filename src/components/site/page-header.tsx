import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Emphasis } from "@/components/ui/emphasis";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";

interface PageHeaderProps {
  /** Short status shown above the title, e.g. "Cancelled". Omit on normal pages. */
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  image?: PhotoSource | null;
  crumbs?: Crumb[];
  children?: ReactNode;
}

/**
 * Opening band for inner pages: an extra-bold title and intro on deep royal blue
 * edged in kente, with the page photograph rising out of the band as a wide rounded tile.
 */
export function PageHeader({ eyebrow, title, intro, image, crumbs, children }: PageHeaderProps) {
  return (
    <>
      <section className="on-dark glow-royal relative isolate overflow-hidden text-white">
        <Container className={`pt-12 sm:pt-16 ${image ? "pb-36 sm:pb-52" : "pb-16 sm:pb-24"}`}>
          <div className="animate-rise motion-reduce:animate-none">
            {crumbs && <Breadcrumbs items={crumbs} tone="dark" />}
            {eyebrow && <p className="eyebrow mt-10 inline-flex rounded-full bg-danger px-4 py-2 text-white">{eyebrow}</p>}
            <h1 className={`${eyebrow ? "mt-5" : crumbs ? "mt-10" : "mt-4"} max-w-4xl text-display-xl text-white`}>
              <Emphasis text={title} accentClassName="text-gold" />
            </h1>
            {intro && <div className="mt-6 max-w-2xl text-xl leading-relaxed text-mist sm:text-[1.375rem] sm:leading-[1.45]">{intro}</div>}
            {children && <div className="mt-8">{children}</div>}
          </div>
        </Container>
        <div aria-hidden="true" className="kente absolute inset-x-0 bottom-0 h-3" />
      </section>
      {image && (
        <Container>
          <div className="relative -mt-28 aspect-[4/3] overflow-hidden rounded-tile bg-sand shadow-[0_40px_80px_-30px_rgb(5_13_51/0.55)] ring-8 ring-paper sm:-mt-40 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Photo image={image} priority sizes="(min-width: 1200px) 1200px, 100vw" />
          </div>
        </Container>
      )}
    </>
  );
}
