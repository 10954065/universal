import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPage({ title, description, actions, children }: { title: string; description?: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold text-navy-900">{title}</h1>
          {description && <div className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function AdminLinkButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center gap-2 px-4 text-sm font-semibold transition-colors ${
        variant === "primary" ? "bg-navy-900 text-ivory hover:bg-navy-700" : "border border-navy-900/25 text-navy-900 hover:border-navy-900"
      }`}
    >
      {children}
    </Link>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-line bg-white p-5 sm:p-7 ${className}`}>
      {title && <h2 className="mb-5 font-display text-2xl font-semibold text-navy-900">{title}</h2>}
      {children}
    </section>
  );
}

/** Responsive table wrapper: scrolls horizontally on small screens instead of breaking layout. */
export function DataTable({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="border-b border-line bg-ivory-100 text-xs uppercase tracking-wider text-muted">
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-4 py-3 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return <p className="px-4 py-10 text-center text-muted">{children}</p>;
}

const tones: Record<string, string> = {
  PUBLISHED: "bg-success/10 text-success",
  ACTIVE: "bg-success/10 text-success",
  SUCCESS: "bg-success/10 text-success",
  RESOLVED: "bg-success/10 text-success",
  PRAYED_FOR: "bg-success/10 text-success",
  DRAFT: "bg-sand text-navy-800",
  PENDING: "bg-gold/20 text-gold-ink",
  NEW: "bg-gold/20 text-gold-ink",
  IN_PROGRESS: "bg-navy-900/10 text-navy-800",
  READ: "bg-navy-900/10 text-navy-800",
  CANCELLED: "bg-danger/10 text-danger",
  FAILED: "bg-danger/10 text-danger",
  ABANDONED: "bg-danger/10 text-danger",
  UNSUBSCRIBED: "bg-sand text-muted",
  ARCHIVED: "bg-sand text-muted",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${tones[status] ?? "bg-sand text-navy-800"}`}>
      {status.replace(/_/g, " ").toLowerCase()}
    </span>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warning"; children: ReactNode }) {
  return (
    <div className={`border-l-2 px-4 py-3 text-sm leading-relaxed ${tone === "warning" ? "border-gold bg-gold/10 text-navy-900" : "border-navy-600 bg-navy-900/5 text-navy-800"}`}>
      {children}
    </div>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}
