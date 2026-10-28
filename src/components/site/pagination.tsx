import Link from "next/link";

interface PaginationProps {
  page: number;
  pageCount: number;
  hrefForPage: (page: number) => string;
}

export function Pagination({ page, pageCount, hrefForPage }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (candidate) => candidate === 1 || candidate === pageCount || Math.abs(candidate - page) <= 1,
  );
  const linkClass = "inline-flex h-11 min-w-11 items-center justify-center border px-3 text-sm font-medium transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={hrefForPage(page - 1)} rel="prev" className={`${linkClass} border-navy-900/20 hover:border-navy-900`}>
          Previous
        </Link>
      )}
      {pages.map((candidate, index) => (
        <span key={candidate} className="flex items-center gap-2">
          {index > 0 && candidate - (pages[index - 1] ?? candidate) > 1 && <span aria-hidden="true" className="px-1 text-muted">…</span>}
          <Link
            href={hrefForPage(candidate)}
            aria-current={candidate === page ? "page" : undefined}
            className={`${linkClass} ${candidate === page ? "border-navy-900 bg-navy-900 text-ivory" : "border-navy-900/20 hover:border-navy-900"}`}
          >
            <span className="sr-only">Page </span>
            {candidate}
          </Link>
        </span>
      ))}
      {page < pageCount && (
        <Link href={hrefForPage(page + 1)} rel="next" className={`${linkClass} border-navy-900/20 hover:border-navy-900`}>
          Next
        </Link>
      )}
    </nav>
  );
}
