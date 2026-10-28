"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminNavGroup } from "@/components/admin/admin-nav";

export function AdminNavLinks({ groups }: { groups: AdminNavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" className="space-y-6 px-3 py-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">{group.label}</p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-10 items-center px-2 text-sm transition-colors ${active ? "bg-navy-700 font-semibold text-ivory" : "text-mist hover:bg-navy-800 hover:text-ivory"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
