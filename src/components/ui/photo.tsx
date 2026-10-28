import Image from "next/image";

export interface PhotoSource {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  focalX?: number;
  focalY?: number;
}

interface PhotoProps {
  image: PhotoSource;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Must be listed in `images.qualities` in next.config.ts. */
  quality?: 60 | 75;
  /** Overrides the stored alt text (e.g. "" when the image is purely decorative next to a caption). */
  alt?: string;
}

/**
 * Fills its (positioned) parent, cropping around the stored focal point so faces stay in frame.
 * The parent sets the aspect ratio, which prevents layout shift.
 */
export function Photo({ image, sizes, className = "", priority = false, quality = 75, alt }: PhotoProps) {
  return (
    <Image
      src={image.url}
      alt={alt ?? image.alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={priority}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : undefined}
      className={`object-cover ${className}`}
      style={{ objectPosition: `${image.focalX ?? 50}% ${image.focalY ?? 50}%` }}
    />
  );
}
