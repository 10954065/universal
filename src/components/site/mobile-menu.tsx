"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { X } from "lucide-react";
import { LineArrow } from "@/components/ui/button";
import { PRIMARY_NAV, SECONDARY_NAV, isActivePath } from "@/lib/navigation";

/**
 * Full-screen menu, available at every screen size.
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
        aria-controls="site-menu"
        className="pressable group -mr-2 inline-flex h-11 w-12 flex-col items-end justify-center gap-[7px] px-2"
      >
        <span aria-hidden="true" className="block h-[3px] w-8 rounded-full bg-navy-900" />
        <span aria-hidden="true" className="block h-[3px] w-5 rounded-full bg-gold transition-[width] duration-300 group-hover:w-8" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Site menu"
        className="on-dark glow-royal m-0 h-dvh max-h-none w-full max-w-none p-0 text-white backdrop:bg-black/40 open:animate-[rise_0.5s_var(--ease-out-soft)] motion-reduce:open:animate-none"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="mx-auto flex min-h-full max-w-[72rem] flex-col px-5 pb-10 sm:px-8">
          <div className="flex h-20 items-center justify-between">
            <p className="font-display font-extrabold uppercase tracking-[-0.01em]">{ministryName}</p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="pressable -mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-navy-900"
            >
              <X aria-hidden="true" className="h-6 w-6" strokeWidth={2.5} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Site" className="mt-10 grid flex-1 gap-12 md:grid-cols-[1fr_auto]">
            <ul>
              {PRIMARY_NAV.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`block py-1.5 font-display text-[2.5rem] font-extrabold leading-tight tracking-[-0.04em] transition-colors sm:text-[3.5rem] ${
                        active ? "text-gold" : "text-white hover:text-gold"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="space-y-1 md:pt-4">
              {SECONDARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="label group inline-flex min-h-11 items-center gap-3 text-mist hover:text-gold">
                    {item.label}
                    <LineArrow length="w-8 group-hover:w-12" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
