import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMediaOptions, STATUS_OPTIONS } from "@/lib/admin-data";
import { requirePagePermission } from "@/lib/session";
import { deleteMinistry, saveMinistry } from "@/server/admin/library-actions";
import { AdminForm, ConfirmButton, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit ministry" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditMinistryPage({ params, searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [ministry, media] = await Promise.all([isNew ? null : db.ministry.findUnique({ where: { id } }), getMediaOptions()]);
  if (!isNew && !ministry) notFound();

  return (
    <AdminPage title={isNew ? "New ministry" : `Edit: ${ministry!.name}`}>
      {saved && (
        <div className="mb-6">
          <Notice>Ministry created.</Notice>
        </div>
      )}
      <Panel>
        <AdminForm action={saveMinistry}>
          {ministry && <input type="hidden" name="id" value={ministry.id} />}
          <FormGrid>
            <Field name="name" label="Name" required defaultValue={ministry?.name} />
            <Field name="slug" label="Web address" defaultValue={ministry?.slug} hint="Leave blank to create from the name." />
          </FormGrid>
          <TextArea name="summary" label="Summary" required defaultValue={ministry?.summary} rows={2} maxLength={300} />
          <TextArea name="description" label="Full description" defaultValue={ministry?.description} rows={8} hint="Markdown supported." />
          <FormGrid>
            <Field name="leaderName" label="Leader" defaultValue={ministry?.leaderName} hint="Only if confirmed." />
            <Field name="meetingInfo" label="When it meets" defaultValue={ministry?.meetingInfo} placeholder="Saturdays, 4:00 pm" />
            <Field name="contactEmail" type="email" label="Contact email" defaultValue={ministry?.contactEmail} />
            <Field name="contactPhone" type="tel" label="Contact phone" defaultValue={ministry?.contactPhone} />
            <Field name="sortOrder" type="number" label="Display order" defaultValue={ministry?.sortOrder ?? 0} min={0} />
            <Select name="status" label="Visibility" defaultValue={ministry?.status ?? "DRAFT"} options={STATUS_OPTIONS} />
          </FormGrid>
          <ImagePicker name="imageId" label="Image" media={media} defaultValue={ministry?.imageId} />
        </AdminForm>
      </Panel>
      {ministry && (
        <div className="mt-6">
          <ConfirmButton action={deleteMinistry} hidden={{ id: ministry.id }} label="Delete ministry" confirmText={`“${ministry.name}” will be permanently deleted.`} />
        </div>
      )}
    </AdminPage>
  );
}
