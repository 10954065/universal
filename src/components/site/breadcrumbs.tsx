import Link from "next/link";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl } from "@/lib/site-url";

export interface Crumb {
  label: string;
  href: string;
}

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-navy-900">
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link href={crumb.href} className="underline-offset-4 transition-colors hover:text-navy-900 hover:underline">
                      {crumb.label}
                    </Link>
                    <span aria-hidden="true" className="text-gold-ink">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.label,
            item: absoluteUrl(crumb.href),
          })),
        }}
      />
    </>
  );
}
