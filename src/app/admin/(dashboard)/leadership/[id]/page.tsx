import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMediaOptions, STATUS_OPTIONS } from "@/lib/admin-data";
import { requirePagePermission } from "@/lib/session";
import { deleteLeader, saveLeader } from "@/server/admin/library-actions";
import { AdminForm, ConfirmButton, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit leader" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditLeaderPage({ params, searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [leader, media] = await Promise.all([isNew ? null : db.leadershipProfile.findUnique({ where: { id } }), getMediaOptions()]);
  if (!isNew && !leader) notFound();

  return (
    <AdminPage title={isNew ? "Add leader" : `Edit: ${leader!.name}`}>
      {saved && (
        <div className="mb-6">
          <Notice>Profile created.</Notice>
        </div>
      )}
      <Panel>
        <AdminForm action={saveLeader}>
          {leader && <input type="hidden" name="id" value={leader.id} />}
          <FormGrid>
            <Field name="name" label="Full name" required defaultValue={leader?.name} />
            <Field name="role" label="Official title / role" required defaultValue={leader?.role} placeholder="Senior Pastor" />
          </FormGrid>
          <ImagePicker name="imageId" label="Portrait" media={media} defaultValue={leader?.imageId} />
          <TextArea name="bio" label="Biography" defaultValue={leader?.bio} rows={8} hint="Markdown supported." />
          <TextArea name="responsibilities" label="Ministry responsibilities" defaultValue={leader?.responsibilities} rows={3} maxLength={600} />
          <FormGrid>
            <Field name="facebookUrl" label="Facebook (approved)" defaultValue={leader?.facebookUrl} />
            <Field name="instagramUrl" label="Instagram (approved)" defaultValue={leader?.instagramUrl} />
            <Field name="xUrl" label="X (approved)" defaultValue={leader?.xUrl} />
            <Field name="slug" label="Web anchor" defaultValue={leader?.slug} hint="Leave blank to create from the name." />
            <Field name="sortOrder" type="number" label="Display order" defaultValue={leader?.sortOrder ?? 0} min={0} />
            <Select name="status" label="Visibility" defaultValue={leader?.status ?? "DRAFT"} options={STATUS_OPTIONS} />
          </FormGrid>
        </AdminForm>
      </Panel>
      {leader && (
        <div className="mt-6">
          <ConfirmButton action={deleteLeader} hidden={{ id: leader.id }} label="Delete profile" confirmText={`${leader.name}'s profile will be permanently deleted.`} />
        </div>
      )}
    </AdminPage>
  );
}
