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
 * Opening band for inner pages: a large title and intro on white,
 * with the page photograph presented beneath as a wide rounded tile.
 */
export function PageHeader({ eyebrow, title, intro, image, crumbs, children }: PageHeaderProps) {
  return (
    <section className="pb-4 pt-10 sm:pt-14">
      <Container>
        <div className="animate-rise motion-reduce:animate-none">
          {crumbs && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className="eyebrow mt-10 text-danger">{eyebrow}</p>}
          <h1 className={`${eyebrow ? "mt-3" : crumbs ? "mt-10" : "mt-4"} max-w-4xl font-display text-display-xl font-semibold text-navy-900`}>
            <Emphasis text={title} />
          </h1>
          {intro && <div className="mt-6 max-w-2xl text-xl leading-relaxed text-muted sm:text-[1.375rem] sm:leading-[1.45]">{intro}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {image && (
          <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-tile bg-sand sm:aspect-[16/9] lg:aspect-[21/9]">
            <Photo image={image} priority sizes="(min-width: 1200px) 1200px, 100vw" />
          </div>
        )}
      </Container>
    </section>
  );
}
