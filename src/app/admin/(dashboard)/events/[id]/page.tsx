import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMediaOptions } from "@/lib/admin-data";
import { toLocalDateTimeInput } from "@/lib/format";
import { requirePagePermission } from "@/lib/session";
import { deleteEvent, saveEvent } from "@/server/admin/library-actions";
import { AdminForm, Checkbox, ConfirmButton, Field, ImagePicker, Select, TextArea } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit event" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

const EVENT_STATUS = [
  { value: "DRAFT", label: "Draft (not visible)" },
  { value: "PUBLISHED", label: "Published" },
  { value: "CANCELLED", label: "Cancelled (shown with a cancelled notice)" },
  { value: "ARCHIVED", label: "Archived (only in past events)" },
];

export default async function EditEventPage({ params, searchParams }: Props) {
  await requirePagePermission("content:manage");
  const { id } = await params;
  const { saved } = await searchParams;
  const isNew = id === "new";
  const [event, media] = await Promise.all([isNew ? null : db.event.findUnique({ where: { id } }), getMediaOptions()]);
  if (!isNew && !event) notFound();

  return (
    <AdminPage
      title={isNew ? "New event" : "Edit event"}
      actions={
        event ? (
          <>
            {event.registrationEnabled && (
              <Link href={`/admin/registrations?event=${event.id}`} className="text-sm font-semibold underline underline-offset-4">
                Registrations
              </Link>
            )}
            {event.status !== "DRAFT" && (
              <Link href={`/events/${event.slug}`} target="_blank" className="text-sm font-semibold underline underline-offset-4">
                View on website
              </Link>
            )}
          </>
        ) : undefined
      }
    >
      {saved && (
        <div className="mb-6">
          <Notice>Event created.</Notice>
        </div>
      )}
      <Panel>
        <AdminForm action={saveEvent}>
          {event && <input type="hidden" name="id" value={event.id} />}
          <Field name="title" label="Title" required defaultValue={event?.title} maxLength={160} />
          <TextArea name="summary" label="Summary" required defaultValue={event?.summary} rows={2} maxLength={300} hint="One or two sentences shown in event lists." />
          <TextArea name="description" label="Full description" defaultValue={event?.description} rows={8} hint="Markdown supported." />
          <FormGrid>
            <Field name="startsAt" type="datetime-local" label="Starts" required defaultValue={toLocalDateTimeInput(event?.startsAt)} hint="Ghana time." />
            <Field name="endsAt" type="datetime-local" label="Ends" defaultValue={toLocalDateTimeInput(event?.endsAt)} />
            <Field name="venue" label="Venue" defaultValue={event?.venue} />
            <Field name="address" label="Address" defaultValue={event?.address} />
            <Field name="contactEmail" type="email" label="Contact email" defaultValue={event?.contactEmail} />
            <Field name="contactPhone" type="tel" label="Contact phone" defaultValue={event?.contactPhone} />
          </FormGrid>
          <ImagePicker name="imageId" label="Event image" media={media} defaultValue={event?.imageId} />

          <fieldset className="space-y-5 border border-line p-5">
            <legend className="px-2 text-sm font-semibold text-navy-900">Registration</legend>
            <Checkbox name="registrationEnabled" label="Accept registrations on this website" defaultChecked={event?.registrationEnabled} />
            <FormGrid>
              <Field name="registrationCapacity" type="number" label="Capacity (people)" defaultValue={event?.registrationCapacity ?? ""} min={1} hint="Blank = unlimited." />
              <Field name="registrationDeadline" type="datetime-local" label="Registration closes" defaultValue={toLocalDateTimeInput(event?.registrationDeadline)} />
            </FormGrid>
            <Field name="externalRegistrationUrl" label="Or: external registration link" defaultValue={event?.externalRegistrationUrl} hint="If set, visitors are sent to this page instead of the built-in form." />
          </fieldset>

          <FormGrid>
            <Field name="slug" label="Web address" defaultValue={event?.slug} hint="Leave blank to create from the title." />
            <Select name="status" label="Status" defaultValue={event?.status ?? "DRAFT"} options={EVENT_STATUS} />
          </FormGrid>
          <Checkbox name="featured" label="Feature at the top of upcoming events" defaultChecked={event?.featured} />
        </AdminForm>
      </Panel>
      {event && (
        <div className="mt-6">
          <ConfirmButton action={deleteEvent} hidden={{ id: event.id }} label="Delete event" confirmText="The event and all of its registrations will be permanently deleted. To keep history, set the status to Archived instead." />
        </div>
      )}
    </AdminPage>
  );
}
