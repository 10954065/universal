import type { Permission } from "@/lib/permissions";

export interface AdminNavItem {
  label: string;
  href: string;
  permission: Permission;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  { label: "Overview", items: [{ label: "Dashboard", href: "/admin", permission: "dashboard:view" }] },
  {
    label: "Website content",
    items: [
      { label: "Homepage", href: "/admin/homepage", permission: "content:manage" },
      { label: "Announcements", href: "/admin/announcements", permission: "content:manage" },
      { label: "Service times", href: "/admin/services", permission: "content:manage" },
      { label: "Sermons", href: "/admin/sermons", permission: "content:manage" },
      { label: "Events", href: "/admin/events", permission: "content:manage" },
      { label: "Ministries", href: "/admin/ministries", permission: "content:manage" },
      { label: "Leadership", href: "/admin/leadership", permission: "content:manage" },
      { label: "Outreach", href: "/admin/outreach", permission: "content:manage" },
      { label: "Page content", href: "/admin/pages", permission: "content:manage" },
      { label: "Media library", href: "/admin/media", permission: "content:manage" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Enquiries", href: "/admin/enquiries", permission: "enquiries:manage" },
      { label: "Prayer requests", href: "/admin/prayer", permission: "prayer:read" },
      { label: "Event registrations", href: "/admin/registrations", permission: "registrations:view" },
      { label: "Subscribers", href: "/admin/subscribers", permission: "subscribers:manage" },
    ],
  },
  {
    label: "Giving",
    items: [
      { label: "Donations", href: "/admin/donations", permission: "donations:view" },
      { label: "Giving setup", href: "/admin/giving", permission: "giving:manage" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Site settings", href: "/admin/settings", permission: "settings:manage" },
      { label: "Staff accounts", href: "/admin/users", permission: "users:manage" },
      { label: "Audit log", href: "/admin/audit", permission: "audit:view" },
    ],
  },
];
