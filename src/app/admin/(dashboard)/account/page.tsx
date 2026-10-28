import type { Metadata } from "next";
import { ROLE_LABELS } from "@/lib/permissions";
import { requirePagePermission } from "@/lib/session";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { AdminPage, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requirePagePermission("dashboard:view");
  return (
    <AdminPage title="My account">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Profile">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">Name</dt>
              <dd className="text-navy-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="text-navy-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Role</dt>
              <dd className="text-navy-900">{ROLE_LABELS[user.role]}</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Change password">
          <ChangePasswordForm />
        </Panel>
      </div>
    </AdminPage>
  );
}
