"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, isActivePath } from "@/lib/navigation";

/**
 * Header links. A short gold underline slides in from the left on hover
 * and stays under the current page; it simply appears for reduced motion.
 */
export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden justify-self-center xl:block">
      <ul className="flex items-center gap-6 2xl:gap-8">
        {PRIMARY_NAV.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center whitespace-nowrap font-display text-[0.9375rem] font-semibold transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-gold after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none ${
                  active ? "text-royal after:scale-x-100" : "text-navy-900 after:scale-x-0 hover:text-royal hover:after:scale-x-100"
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
