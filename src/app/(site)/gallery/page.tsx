import type { Metadata } from "next";
import Image from "next/image";
import { GALLERY } from "@/lib/gallery";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from worship services, fellowship gatherings and Universal Trinity Basic School.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Gallery"
        intro="Moments from our services, fellowships and school."
        crumbs={[{ label: "Gallery", href: "/gallery" }]}
      />
      {GALLERY.map((group) => (
        <section key={group.id} aria-labelledby={`gallery-${group.id}`} className="py-14 sm:py-20">
          <Container>
            <h2 id={`gallery-${group.id}`} className="reveal text-display-md text-navy-900">
              {group.title}
            </h2>
            <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {group.photos.map((photo) => (
                <li key={photo.file} className="reveal mb-4 break-inside-avoid">
                  <Image
                    src={`/images/gallery/${photo.file}`}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 23rem, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full bg-sand"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}
    </>
  );
}
