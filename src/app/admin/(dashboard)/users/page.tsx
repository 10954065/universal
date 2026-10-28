import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatShortDate } from "@/lib/format";
import { ROLE_LABELS, ROLES } from "@/lib/permissions";
import { requirePagePermission } from "@/lib/session";
import { createStaff, resetStaffPassword, updateStaff } from "@/server/admin/user-actions";
import { AdminForm, Checkbox, Field, Select } from "@/components/admin/form";
import { AdminPage, FormGrid, Notice, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Staff accounts" };

const ROLE_OPTIONS = ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }));

export default async function UsersPage() {
  const me = await requirePagePermission("users:manage");
  const users = await db.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });

  return (
    <AdminPage title="Staff accounts" description="Who can sign in to this dashboard, and what they can do.">
      <div className="mb-8 grid gap-4 text-sm md:grid-cols-3">
        <Notice>
          <strong>Super Administrator</strong> — everything, including settings, giving records, staff accounts and prayer requests.
        </Notice>
        <Notice>
          <strong>Content Administrator</strong> — website content, media, enquiries, registrations and subscribers. No prayer requests or giving records.
        </Notice>
        <Notice>
          <strong>Ministry Staff</strong> — enquiries, event registrations and private prayer requests. Cannot edit the website.
        </Notice>
      </div>

      <Panel title="Add a staff member" className="mb-8">
        <AdminForm action={createStaff} submitLabel="Create account">
          <FormGrid>
            <Field name="name" label="Full name" required />
            <Field name="email" type="email" label="Email" required />
            <Select name="role" label="Role" required defaultValue="MINISTRY_STAFF" options={ROLE_OPTIONS} />
          </FormGrid>
        </AdminForm>
      </Panel>

      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id}>
            <Panel>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="font-semibold text-navy-900">
                    {user.name} {user.id === me.id && <span className="text-xs font-normal text-muted">(you)</span>}
                  </p>
                  <p className="text-sm text-muted">{user.email}</p>
                  <p className="mt-1 text-xs text-muted">Added {formatShortDate(user.createdAt)}</p>
                </div>
                <div className="grid gap-4 lg:w-[34rem] lg:grid-cols-[1fr_auto]">
                  <AdminForm action={updateStaff} submitLabel="Update" key={`${user.id}-${user.role}-${user.active}`}>
                    <input type="hidden" name="id" value={user.id} />
                    <Select name="role" label="Role" defaultValue={user.role} options={ROLE_OPTIONS} />
                    <Checkbox name="active" label="Can sign in" defaultChecked={user.active} hint="Unticking signs them out everywhere." />
                  </AdminForm>
                  <AdminForm action={resetStaffPassword} submitLabel="Reset password">
                    <input type="hidden" name="id" value={user.id} />
                  </AdminForm>
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
