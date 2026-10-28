import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePagePermission } from "@/lib/session";
import { storageDriver } from "@/lib/storage";
import { deleteMedia, updateMedia, uploadMedia } from "@/server/admin/media-actions";
import { AdminForm, ConfirmButton, Field, FileField } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Media library" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function MediaLibraryPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await searchParams;
  const [assets, selected] = await Promise.all([
    db.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    id ? db.mediaAsset.findUnique({ where: { id } }) : null,
  ]);
  const onVercelWithoutBlob = Boolean(process.env.VERCEL) && storageDriver() === "local";

  return (
    <AdminPage title="Media library" description={`${assets.length} images. Uploads are resized and all hidden metadata (including GPS location) is removed.`}>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset, index) => (
            <li key={asset.id}>
              <Link
                href={`/admin/media?id=${asset.id}`}
                aria-current={asset.id === id ? "true" : undefined}
                className={`relative block aspect-[4/3] overflow-hidden border-2 ${asset.id === id ? "border-gold" : "border-transparent hover:border-navy-900/40"}`}
              >
                <Image src={asset.url} alt={asset.alt} fill sizes="240px" loading={index < 8 ? "eager" : "lazy"} className="object-cover" style={{ objectPosition: `${asset.focalX}% ${asset.focalY}%` }} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-6">
          {selected && (
            <Panel title="Image details">
              <div className="relative mb-5 aspect-[4/3] overflow-hidden bg-sand">
                <Image src={selected.url} alt={selected.alt} fill sizes="22rem" className="object-cover" style={{ objectPosition: `${selected.focalX}% ${selected.focalY}%` }} />
              </div>
              <p className="mb-4 text-xs text-muted">
                {selected.width}×{selected.height} · {(selected.sizeBytes / 1024).toFixed(0)} KB
              </p>
              <AdminForm action={updateMedia} key={selected.id}>
                <input type="hidden" name="id" value={selected.id} />
                <Field name="alt" label="Alt text" required defaultValue={selected.alt} hint="Describe what is visible. Do not name people unless they have agreed." />
                <FormGrid>
                  <Field name="focalX" type="number" label="Focus left→right %" min={0} max={100} defaultValue={selected.focalX} />
                  <Field name="focalY" type="number" label="Focus top→bottom %" min={0} max={100} defaultValue={selected.focalY} />
                </FormGrid>
              </AdminForm>
              <div className="mt-4">
                <ConfirmButton action={deleteMedia} hidden={{ id: selected.id }} label="Delete image" confirmText="Pages using this image will show no image in its place." />
              </div>
            </Panel>
          )}
          <Panel title="Upload an image">
            {onVercelWithoutBlob && (
              <div className="mb-4">
                <Notice tone="warning">Set BLOB_READ_WRITE_TOKEN to enable uploads on Vercel.</Notice>
              </div>
            )}
            <AdminForm action={uploadMedia} submitLabel="Upload">
              <FileField name="file" label="Image" required accept="image/jpeg,image/png,image/webp,image/avif" hint="JPEG, PNG, WebP or AVIF, up to 10 MB." />
              <Field name="alt" label="Alt text" required hint="Describe the image for screen-reader users." />
            </AdminForm>
          </Panel>
        </div>
      </div>
    </AdminPage>
  );
}
