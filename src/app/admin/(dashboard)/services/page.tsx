import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatClock, WEEKDAY_LABELS, WEEKDAY_ORDER } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteService, saveService } from "@/server/admin/content-actions";
import { AdminForm, Checkbox, ConfirmButton, Field, Select, TextArea } from "@/components/admin/form";
import { AdminLinkButton, AdminPage, DataTable, EmptyRow, FormGrid, Notice, Panel, StatusBadge } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Service times" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function ServicesPage({ searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await searchParams;
  const [services, editing] = await Promise.all([
    db.serviceTime.findMany({ orderBy: [{ sortOrder: "asc" }, { startTime: "asc" }] }),
    id && id !== "new" ? db.serviceTime.findUnique({ where: { id } }) : null,
  ]);
  const showForm = id === "new" || Boolean(editing);

  return (
    <AdminPage
      title="Service times"
      description="Shown on the homepage, Plan Your Visit and Contact pages. With no active services, visitors are invited to get in touch."
      actions={<AdminLinkButton href="/admin/services?id=new">Add service</AdminLinkButton>}
    >
      {services.length === 0 && !showForm && (
        <div className="mb-6">
          <Notice tone="warning">No service times are published yet. Please add the ministry&apos;s confirmed schedule.</Notice>
        </div>
      )}
      {showForm && (
        <Panel title={editing ? "Edit service" : "New service"} className="mb-8">
          <AdminForm action={saveService} key={editing?.id ?? "new"}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <FormGrid>
              <Field name="name" label="Service name" required defaultValue={editing?.name} placeholder="Sunday Worship Service" />
              <Select name="day" label="Day" required defaultValue={editing?.day ?? "SUNDAY"} options={WEEKDAY_ORDER.map((day) => ({ value: day, label: WEEKDAY_LABELS[day]! }))} />
              <Field name="startTime" type="time" label="Starts" required defaultValue={editing?.startTime} />
              <Field name="endTime" type="time" label="Ends" defaultValue={editing?.endTime} />
              <Field name="location" label="Location" defaultValue={editing?.location} placeholder="Main sanctuary" />
              <Field name="onlineUrl" label="Online link" defaultValue={editing?.onlineUrl} hint="YouTube or Facebook live link, if any." />
              <Field name="sortOrder" type="number" label="Display order" defaultValue={editing?.sortOrder ?? 0} min={0} />
            </FormGrid>
            <TextArea name="notes" label="Notes" defaultValue={editing?.notes} rows={2} maxLength={300} />
            <Checkbox name="active" label="Show on website" defaultChecked={editing?.active ?? true} />
          </AdminForm>
          {editing && (
            <div className="mt-4">
              <ConfirmButton action={deleteService} hidden={{ id: editing.id }} label="Delete service" confirmText="This service time will be removed from the website." />
            </div>
          )}
        </Panel>
      )}

      <DataTable head={["Service", "Day & time", "Location", "Status", ""]} empty={services.length === 0 && <EmptyRow>No services yet.</EmptyRow>}>
        {services.map((service) => (
          <tr key={service.id}>
            <td className="px-4 py-3 font-medium text-navy-900">{service.name}</td>
            <td className="px-4 py-3 text-muted">
              {WEEKDAY_LABELS[service.day]} {formatClock(service.startTime)}
              {service.endTime ? ` – ${formatClock(service.endTime)}` : ""}
            </td>
            <td className="px-4 py-3 text-muted">{service.location ?? "—"}</td>
            <td className="px-4 py-3">
              <StatusBadge status={service.active ? "ACTIVE" : "ARCHIVED"} />
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/services?id=${service.id}`} className="font-semibold text-navy-900 underline underline-offset-4">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminPage>
  );
}
