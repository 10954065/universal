import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { can, ROLE_LABELS } from "@/lib/permissions";
import type { StaffUser } from "@/lib/session";
import { ADMIN_NAV } from "@/components/admin/admin-nav";
import { AdminNavLinks } from "@/components/admin/admin-nav-links";
import { SignOutButton } from "@/components/admin/sign-out-button";

/** Dashboard frame: navy sidebar on desktop, collapsible menu on mobile. Links are filtered by role. */
export function AdminShell({ user, children }: { user: StaffUser; children: ReactNode }) {
  const groups = ADMIN_NAV.map((group) => ({ ...group, items: group.items.filter((item) => can(user.role, item.permission)) })).filter(
    (group) => group.items.length > 0,
  );

  const nav = <AdminNavLinks groups={groups} />;

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#admin-main" className="sr-only z-50 bg-navy-900 px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <aside className="on-dark bg-navy-900 text-ivory lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="font-display text-xl font-semibold">
            UTM <span className="text-gold">Dashboard</span>
          </Link>
          <Link href="/" target="_blank" className="inline-flex items-center gap-1 text-xs text-mist hover:text-gold">
            View site <ExternalLink aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only">(opens in a new tab)</span>
          </Link>
        </div>
        <details className="group border-t border-ivory/10 lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 text-sm font-semibold">
            Menu <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="pb-4">{nav}</div>
        </details>
        <div className="hidden lg:block">{nav}</div>
        <div className="border-t border-ivory/10 px-5 py-5 text-sm">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-mist">{ROLE_LABELS[user.role]}</p>
          <div className="mt-3 flex gap-4">
            <Link href="/admin/account" className="text-mist underline underline-offset-4 hover:text-gold">
              My account
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main id="admin-main" className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  );
}
