import Image from "next/image";
import Link from "next/link";
import type { PhotoSource } from "@/components/ui/photo";

interface WordmarkProps {
  name: string;
  logo: PhotoSource | null;
  tone?: "light" | "dark";
}

/**
 * Heavy typographic wordmark. When the ministry uploads its official logo
 * (Site settings), the logo image is shown instead.
 */
export function Wordmark({ name, logo, tone = "light" }: WordmarkProps) {
  const dark = tone === "dark";

  return (
    <Link href="/" className="inline-flex min-h-11 items-center" aria-label={logo ? `${name}, home page` : undefined}>
      {logo ? (
        <span className="relative block h-10 w-40">
          <Image src={logo.url} alt="" fill sizes="160px" className="object-contain object-left" preload />
        </span>
      ) : (
        <span
          className={`whitespace-nowrap text-[0.9375rem] font-extrabold uppercase leading-none tracking-[-0.02em] min-[400px]:text-[1.0625rem] ${dark ? "text-white" : "text-navy-900"}`}
        >
          {name}
        </span>
      )}
    </Link>
  );
}
