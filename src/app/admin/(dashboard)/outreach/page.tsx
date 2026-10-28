import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getMediaOptions, STATUS_OPTIONS } from "@/lib/admin-data";
import { requirePagePermission } from "@/lib/session";
import { deleteOutreach, saveOutreach } from "@/server/admin/library-actions";
import { AdminForm, ConfirmButton, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, FormGrid, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Outreach" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function AdminOutreachPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await searchParams;
  const [programmes, editing, media] = await Promise.all([
    db.outreachProgramme.findMany({ orderBy: { sortOrder: "asc" } }),
    id && id !== "new" ? db.outreachProgramme.findUnique({ where: { id } }) : null,
    getMediaOptions(),
  ]);
  const showForm = id === "new" || Boolean(editing);

  return (
    <AdminPage
      title="Outreach programmes"
      description="Published programmes are listed in the homepage outreach section."
      actions={<AdminLinkButton href="/admin/outreach?id=new">Add programme</AdminLinkButton>}
    >
      <div className="mb-6">
        <Notice tone="warning">Publish only real programmes. Do not include impact figures unless they are verified.</Notice>
      </div>
      {showForm && (
        <Panel title={editing ? "Edit programme" : "New programme"} className="mb-8">
          <AdminForm action={saveOutreach} key={editing?.id ?? "new"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <Field name="title" label="Title" required defaultValue={editing?.title} />
            <TextArea name="summary" label="Summary" required defaultValue={editing?.summary} rows={3} maxLength={400} />
            <TextArea name="details" label="Details" defaultValue={editing?.details} rows={5} />
            <FormGrid>
              <Field name="ctaLabel" label="Button text" defaultValue={editing?.ctaLabel} />
              <Field name="ctaHref" label="Button link" defaultValue={editing?.ctaHref} />
              <Field name="sortOrder" type="number" label="Display order" defaultValue={editing?.sortOrder ?? 0} min={0} />
              <Select name="status" label="Visibility" defaultValue={editing?.status ?? "DRAFT"} options={STATUS_OPTIONS} />
            </FormGrid>
            <ImagePicker name="imageId" label="Image" media={media} defaultValue={editing?.imageId} />
          </AdminForm>
          {editing && (
            <div className="mt-4">
              <ConfirmButton action={deleteOutreach} hidden={{ id: editing.id }} label="Delete programme" confirmText="This programme will be permanently deleted." />
            </div>
          )}
        </Panel>
      )}
      <DataTable head={["Programme", "Status", ""]} empty={programmes.length === 0 && <EmptyRow>No programmes yet.</EmptyRow>}>
        {programmes.map((programme) => (
          <tr key={programme.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{programme.title}</td>
            <td className="px-4 py-3">
              <StatusBadge status={programme.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/outreach?id=${programme.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
