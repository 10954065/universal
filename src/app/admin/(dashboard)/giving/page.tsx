import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePagePermission } from "@/lib/session";
import { deleteGivingCategory, saveGivingCategory } from "@/server/admin/content-actions";
import { AdminForm, Checkbox, ConfirmButton, Field } from "@/components/admin/form";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, FormGrid, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Giving setup" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function GivingSetupPage({ searchParams }: Props) {
  await requirePagePermission("giving:manage");
  const { id } = await searchParams;
  const [categories, editing] = await Promise.all([
    db.givingCategory.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { donations: true } } } }),
    id && id !== "new" ? db.givingCategory.findUnique({ where: { id } }) : null,
  ]);
  const showForm = id === "new" || Boolean(editing);

  return (
    <AdminPage
      title="Giving setup"
      description={
        <>
          Approved giving categories for online gifts. Bank and Mobile Money details live in{" "}
          <Link href="/admin/settings" className="underline underline-offset-4">
            Site settings
          </Link>
          .
        </>
      }
      actions={<AdminLinkButton href="/admin/giving?id=new">Add category</AdminLinkButton>}
    >
      <div className="mb-6">
        <Notice>Only add categories the ministry has approved (for example Tithe, Offering, Building Fund).</Notice>
      </div>
      {showForm && (
        <Panel title={editing ? "Edit category" : "New category"} className="mb-8">
          <AdminForm action={saveGivingCategory} key={editing?.id ?? "new"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <FormGrid>
              <Field name="name" label="Name" required defaultValue={editing?.name} />
              <Field name="sortOrder" type="number" label="Display order" defaultValue={editing?.sortOrder ?? 0} min={0} />
            </FormGrid>
            <Field name="description" label="Description" defaultValue={editing?.description} />
            <Checkbox name="active" label="Available for giving" defaultChecked={editing?.active ?? true} />
          </AdminForm>
          {editing && (
            <div className="mt-4">
              <ConfirmButton action={deleteGivingCategory} hidden={{ id: editing.id }} label="Delete category" confirmText="Existing donation records are kept but will no longer show this category." />
            </div>
          )}
        </Panel>
      )}
      <DataTable head={["Category", "Gifts recorded", "Status", ""]} empty={categories.length === 0 && <EmptyRow>No giving categories yet.</EmptyRow>}>
        {categories.map((category) => (
          <tr key={category.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{category.name}</td>
            <td className="px-4 py-3 text-muted">{category._count.donations}</td>
            <td className="px-4 py-3">
              <StatusBadge status={category.active ? "ACTIVE" : "ARCHIVED"} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/giving?id=${category.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
