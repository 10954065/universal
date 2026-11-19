import Image from "next/image";
import Link from "next/link";
import type { PhotoSource } from "@/components/ui/photo";

interface WordmarkProps {
  name: string;
  logo: PhotoSource | null;
  tone?: "light" | "dark";
}

/**
 * Heavy typographic wordmark. When the ministry's logo is set (Site settings),
 * it sits beside the name as the mark; on dark grounds it rests on a white disc
 * so the blue lettering in the logo stays legible.
 */
export function Wordmark({ name, logo, tone = "light" }: WordmarkProps) {
  const dark = tone === "dark";

  return (
    <Link href="/" className="inline-flex min-h-11 min-w-0 items-center gap-2.5">
      {logo && (
        <span className={`relative block shrink-0 ${dark ? "h-16 w-16 rounded-full bg-white" : "h-12 w-14"}`}>
          <Image src={logo.url} alt="" fill sizes="64px" className={`object-contain ${dark ? "p-1.5" : ""}`} preload />
        </span>
      )}
      <span
        className={`max-w-44 font-display text-[0.9375rem] font-extrabold uppercase leading-[1.1] tracking-[-0.02em] min-[460px]:max-w-none min-[460px]:whitespace-nowrap min-[460px]:text-[1.125rem] min-[460px]:leading-none ${dark ? "text-white" : "text-navy-900"}`}
      >
        {name}
      </span>
    </Link>
  );
}
