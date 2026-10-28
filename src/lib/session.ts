import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { can, isRole, type Permission, type Role } from "@/lib/permissions";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export class ForbiddenError extends Error {
  constructor(message = "You do not have permission to do that.") {
    super(message);
  }
}

/**
 * Returns the signed-in, active staff member for this request, or null.
 * Role and active flag are read fresh from the database (not trusted from the session cache),
 * so role changes and deactivations take effect immediately.
 */
export const getCurrentUser = cache(async (): Promise<StaffUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.user.id }, select: { id: true, name: true, email: true, role: true, active: true } });
  if (!user?.active || !isRole(user.role)) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
});

/** For admin pages: redirects to sign-in when signed out, or to the dashboard when the role lacks permission. */
export async function requirePagePermission(permission: Permission): Promise<StaffUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}

/** For server actions and route handlers: throws instead of redirecting. */
export async function authorize(permission: Permission): Promise<StaffUser> {
  const user = await getCurrentUser();
  if (!user || !can(user.role, permission)) throw new ForbiddenError();
  return user;
}
