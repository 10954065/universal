import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Emphasis } from "@/components/ui/emphasis";
import { Photo, type PhotoSource } from "@/components/ui/photo";
import { Breadcrumbs, type Crumb } from "@/components/site/breadcrumbs";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  image?: PhotoSource | null;
  crumbs?: Crumb[];
  children?: ReactNode;
}

/**
 * Opening band for inner pages. With an image it becomes an editorial split:
 * text on ivory, photograph bleeding off the right edge.
 */
export function PageHeader({ eyebrow, title, intro, image, crumbs, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ivory">
      <div className={image ? "lg:grid lg:min-h-[34rem] lg:grid-cols-12" : ""}>
        <Container className={`relative z-10 py-16 sm:py-20 ${image ? "lg:col-span-7 lg:flex lg:items-center lg:py-24" : "lg:py-28"}`}>
          <div className="animate-rise motion-reduce:animate-none">
            {crumbs && <Breadcrumbs items={crumbs} />}
            <p className="eyebrow mt-8 flex items-center gap-3 text-gold-ink">
              <span aria-hidden="true" className="rule-gold" />
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-display-xl font-semibold text-navy-900">
              <Emphasis text={title} />
            </h1>
            {intro && <div className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{intro}</div>}
            {children && <div className="mt-9">{children}</div>}
          </div>
        </Container>
        {image && (
          <div className="relative aspect-[16/10] lg:col-span-5 lg:aspect-auto">
            <Photo image={image} priority sizes="(min-width: 1024px) 42vw, 100vw" />
            <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-ivory to-transparent lg:block" />
          </div>
        )}
      </div>
    </section>
  );
}
