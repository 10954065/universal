"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {PRIMARY_NAV.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-3.5 text-[0.8125rem] font-medium tracking-wide transition-colors after:absolute after:inset-x-3.5 after:bottom-2 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-300 hover:text-navy-900 ${
                  active ? "text-navy-900 after:scale-x-100" : "text-navy-700/80 after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
