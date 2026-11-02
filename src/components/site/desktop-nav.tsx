"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden justify-self-center xl:block">
      <ul className="flex items-center gap-8">
        {PRIMARY_NAV.filter((item) => item.href !== "/").map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center text-[0.9375rem] transition-opacity duration-200 ${
                  active ? "text-navy-900 underline decoration-1 underline-offset-[6px]" : "text-navy-900 hover:opacity-60"
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
