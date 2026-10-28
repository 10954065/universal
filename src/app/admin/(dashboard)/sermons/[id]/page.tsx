import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMediaOptions, STATUS_OPTIONS } from "@/lib/admin-data";
import { toLocalDateTimeInput } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteSermon, saveSermon } from "@/server/admin/library-actions";
import { AdminForm, ConfirmButton, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit sermon" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditSermonPage({ params, searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [sermon, media, speakers, categories] = await Promise.all([
    isNew ? null : db.sermon.findUnique({ where: { id }, include: { speaker: true, category: true } }),
    getMediaOptions(),
    db.speaker.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
    db.sermonCategory.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  if (!isNew && !sermon) notFound();

  return (
    <AdminPage
      title={isNew ? "New sermon" : "Edit sermon"}
      actions={
        sermon?.status === "PUBLISHED" ? (
          <Link href={`/sermons/${sermon.slug}`} target="_blank" className="text-sm font-semibold underline underline-offset-4">
            View on website
          </Link>
        ) : undefined
      }
    >
      {saved && (
        <div className="mb-6">
          <Notice>Sermon created.</Notice>
        </div>
      )}
      <Panel>
        <AdminForm action={saveSermon}>
          {sermon && <input type="hidden" name="id" value={sermon.id} />}
          <Notice tone="warning">Only publish real sermons, with the correct speaker and date.</Notice>
          <Field name="title" label="Title" required defaultValue={sermon?.title} maxLength={160} />
          <FormGrid>
            <Field name="speakerName" label="Speaker" defaultValue={sermon?.speaker?.name} hint="Type a name; new speakers are added automatically." list="speaker-names" />
            <Field name="categoryName" label="Series / category" defaultValue={sermon?.category?.name} list="category-names" />
            <Field name="preachedAt" type="datetime-local" label="Date preached" required defaultValue={toLocalDateTimeInput(sermon?.preachedAt)} />
            <Field name="scripture" label="Scripture reference" defaultValue={sermon?.scripture} placeholder="John 3:16" />
            <Field name="videoUrl" label="Video link" defaultValue={sermon?.videoUrl} hint="YouTube or Vimeo address." />
            <Field name="audioUrl" label="Audio link" defaultValue={sermon?.audioUrl} hint="Direct https link to an MP3/M4A file." />
          </FormGrid>
          <datalist id="speaker-names">
            {speakers.map((speaker) => (
              <option key={speaker.name} value={speaker.name} />
            ))}
          </datalist>
          <datalist id="category-names">
            {categories.map((category) => (
              <option key={category.name} value={category.name} />
            ))}
          </datalist>
          <TextArea name="summary" label="Short description" defaultValue={sermon?.summary} rows={3} maxLength={600} />
          <TextArea name="notes" label="Sermon notes" defaultValue={sermon?.notes} rows={8} hint="Markdown supported." />
          <TextArea name="transcript" label="Transcript" defaultValue={sermon?.transcript} rows={6} hint="Optional, but improves accessibility." />
          <FormGrid>
            <ImagePicker name="thumbnailId" label="Thumbnail" hint="Optional — YouTube's thumbnail is used otherwise." media={media} defaultValue={sermon?.thumbnailId} />
            <div className="space-y-5">
              <Field name="slug" label="Web address" defaultValue={sermon?.slug} hint="Leave blank to create from the title." />
              <Select name="status" label="Visibility" defaultValue={sermon?.status ?? "DRAFT"} options={STATUS_OPTIONS} />
            </div>
          </FormGrid>
        </AdminForm>
      </Panel>
      {sermon && (
        <div className="mt-6">
          <ConfirmButton action={deleteSermon} hidden={{ id: sermon.id }} label="Delete sermon" confirmText={`“${sermon.title}” will be permanently deleted.`} />
        </div>
      )}
    </AdminPage>
  );
}
