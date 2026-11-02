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
        <span aria-hidden="true" className="block h-[2px] w-8 bg-navy-900" />
        <span aria-hidden="true" className="block h-[2px] w-5 bg-navy-900 transition-[width] duration-300 group-hover:w-8" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        id="site-menu"
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-navy-900 backdrop:bg-black/30 open:animate-[rise_0.5s_var(--ease-out-soft)] motion-reduce:open:animate-none"
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="mx-auto flex min-h-full max-w-[72rem] flex-col px-5 pb-10 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <p className="font-semibold tracking-[-0.02em]">{ministryName}</p>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="pressable -mr-2 inline-flex h-11 w-11 items-center justify-center"
            >
              <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
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
                      className={`block py-1.5 text-[2.25rem] font-medium leading-tight tracking-[-0.03em] transition-opacity sm:text-[3rem] ${
                        active ? "underline decoration-2 underline-offset-8" : "hover:opacity-55"
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
                  <Link href={item.href} onClick={close} className="label group inline-flex min-h-11 items-center gap-3 text-navy-900">
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
