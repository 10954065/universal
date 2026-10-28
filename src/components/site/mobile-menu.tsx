"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Menu, X } from "lucide-react";
import { PRIMARY_NAV, SECONDARY_NAV, isActivePath } from "@/lib/navigation";

/**
 * Full-screen menu for screens narrower than the desktop nav breakpoint.
 * Uses the native <dialog> element: it traps focus, closes on Escape,
 * makes the rest of the page inert, and returns focus to the trigger.
 */
export function MobileMenu({ ministryName }: { ministryName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        className="inline-flex h-11 w-11 items-center justify-center text-navy-900 transition-colors hover:bg-sand xl:hidden"
      >
        <Menu aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        aria-label="Site menu"
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-navy-900 p-0 text-ivory backdrop:bg-navy-950/60 open:animate-[rise_0.45s_var(--ease-out-soft)] motion-reduce:open:animate-none"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="flex min-h-full flex-col px-6 pb-10 pt-5 sm:px-10">
          <div className="flex h-14 items-center justify-between">
            <p className="font-display text-xl font-semibold">{ministryName}</p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="inline-flex h-11 w-11 items-center justify-center text-ivory transition-colors hover:bg-navy-700"
            >
              <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {PRIMARY_NAV.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-2 font-display text-[2rem] font-medium leading-tight sm:text-4xl"
                    >
                      <span aria-hidden="true" className="w-6 font-sans text-xs tracking-widest text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`transition-colors group-hover:text-gold ${active ? "text-gold" : ""}`}>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-10 grid gap-2 border-t border-ivory/15 pt-8 sm:grid-cols-3">
              {SECONDARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="inline-flex min-h-11 items-center text-sm font-medium uppercase tracking-[0.16em] text-mist transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/plan-your-visit"
            onClick={close}
            className="mt-10 inline-flex min-h-13 items-center justify-center bg-gold px-6 text-sm font-semibold uppercase tracking-[0.16em] text-navy-950 transition-colors hover:bg-gold-300"
          >
            Plan Your Visit
          </Link>
        </div>
      </dialog>
    </>
  );
}
