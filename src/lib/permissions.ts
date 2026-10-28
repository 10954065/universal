/*
 * Role-based access control. Pure (no I/O) so it can be unit tested and shared by
 * server guards and navigation. The UI hides what a role cannot use, but the
 * server is the authority: every admin action calls authorize(permission).
 */

export type Role = "SUPER_ADMIN" | "CONTENT_ADMIN" | "MINISTRY_STAFF";

export type Permission =
  | "dashboard:view"
  | "content:manage" // homepage, pages, sermons, events, ministries, leadership, outreach, announcements, services, media
  | "registrations:view"
  | "enquiries:manage"
  | "prayer:read"
  | "subscribers:manage"
  | "donations:view"
  | "giving:manage"
  | "settings:manage"
  | "users:manage"
  | "audit:view";

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  SUPER_ADMIN: [
    "dashboard:view",
    "content:manage",
    "registrations:view",
    "enquiries:manage",
    "prayer:read",
    "subscribers:manage",
    "donations:view",
    "giving:manage",
    "settings:manage",
    "users:manage",
    "audit:view",
  ],
  CONTENT_ADMIN: ["dashboard:view", "content:manage", "registrations:view", "enquiries:manage", "subscribers:manage"],
  // Pastoral staff: people-facing records, including private prayer requests. No website editing.
  MINISTRY_STAFF: ["dashboard:view", "registrations:view", "enquiries:manage", "prayer:read"],
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Administrator",
  CONTENT_ADMIN: "Content Administrator",
  MINISTRY_STAFF: "Ministry Staff",
};

export const ROLES = Object.keys(ROLE_PERMISSIONS) as Role[];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && value in ROLE_PERMISSIONS;
}

export function can(role: unknown, permission: Permission): boolean {
  return isRole(role) && ROLE_PERMISSIONS[role].includes(permission);
}

export function permissionsFor(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}
