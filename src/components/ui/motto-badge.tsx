import Image from "next/image";
import type { PhotoSource } from "@/components/ui/photo";

interface MottoBadgeProps {
  /** Words set around the ring, e.g. the motto in Twi and English. */
  words: string[];
  logo: PhotoSource | null;
  className?: string;
}

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Round seal: the motto runs around a slowly turning ring with the logo held still in the centre.
 * Decorative only; the same words appear as real text elsewhere on the page.
 * The caller positions it (absolute or relative) through className.
 */
export function MottoBadge({ words, logo, className = "" }: MottoBadgeProps) {
  const ring = `${words.map((word) => word.toUpperCase()).join("  ✦  ")}  ✦  `;
  return (
    <div aria-hidden="true" className={`aspect-square rounded-full bg-gold text-navy-900 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)] ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full">
        <defs>
          <path id="motto-ring" d={`M100,100 m-${RADIUS},0 a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`} />
        </defs>
        <text className="font-display" fontSize="13" fontWeight="800" letterSpacing="1" fill="currentColor">
          <textPath href="#motto-ring" textLength={CIRCUMFERENCE} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[24%] overflow-hidden rounded-full bg-white">
        {logo && <Image src={logo.url} alt="" fill sizes="96px" className="object-contain p-2" />}
      </div>
    </div>
  );
}
