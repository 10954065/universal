import Link from "next/link";
import { safeHref } from "@/lib/safe-url";

interface AnnouncementBarProps {
  message: string;
  linkLabel: string | null;
  linkHref: string | null;
}

/** Optional strip above the header. Rendered only when an active announcement exists. */
export function AnnouncementBar({ message, linkLabel, linkHref }: AnnouncementBarProps) {
  const href = safeHref(linkHref);
  const external = href ? /^https?:\/\//.test(href) : false;
  return (
    <aside aria-label="Announcement" className="on-dark relative z-50 bg-navy-950 text-ivory">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-2.5 text-center text-[0.8125rem] sm:px-8">
        <span className="inline-flex items-center gap-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold" />
          {message}
        </span>
        {href && linkLabel && (
          <Link
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-semibold text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </aside>
  );
}
