export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation, in display order. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
];

/** Additional links shown in the mobile menu and footer. */
export const SECONDARY_NAV: readonly NavItem[] = [
  { label: "Our Leadership", href: "/leadership" },
  { label: "Prayer Requests", href: "/prayer" },
  { label: "Plan Your Visit", href: "/plan-your-visit" },
];

export const LEGAL_NAV: readonly NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
