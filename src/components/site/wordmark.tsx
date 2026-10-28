import Image from "next/image";
import Link from "next/link";
import type { PhotoSource } from "@/components/ui/photo";

interface WordmarkProps {
  name: string;
  logo: PhotoSource | null;
  tone?: "light" | "dark";
}

/**
 * Temporary typographic wordmark. When the ministry uploads its official logo
 * (Site settings), the logo image is shown instead.
 */
export function Wordmark({ name, logo, tone = "light" }: WordmarkProps) {
  const dark = tone === "dark";
  const words = name.trim().split(/\s+/);
  const last = words.length > 1 ? words.pop() : undefined;

  return (
    <Link href="/" className="group inline-flex items-center" aria-label={logo ? `${name}, home page` : undefined}>
      {logo ? (
        <span className="relative block h-11 w-40">
          <Image src={logo.url} alt="" fill sizes="160px" className="object-contain object-left" preload />
        </span>
      ) : (
        <span className="flex flex-col leading-none">
          <span className={`whitespace-nowrap font-display text-[1.45rem] font-semibold tracking-tight sm:text-[1.6rem] ${dark ? "text-ivory" : "text-navy-900"}`}>
            {words.join(" ")}
          </span>
          {last && (
            <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.42em] ${dark ? "text-gold" : "text-gold-ink"}`}>
              {last}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
