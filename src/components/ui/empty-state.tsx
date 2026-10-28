import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
}

/** Shown when a list is empty, instead of placeholder content. */
export function EmptyState({ title, children, action, tone = "light" }: EmptyStateProps) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative overflow-hidden border px-6 py-12 text-center sm:px-12 sm:py-16 ${
        dark ? "border-ivory/15 bg-navy-800/40" : "border-line bg-ivory-100"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 40 40" className={`mx-auto h-9 w-9 ${dark ? "text-gold" : "text-gold-ink"}`}>
        <path d="M20 4v32M8 14h24" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
      <p className={`mt-5 font-display text-display-sm font-semibold ${dark ? "text-ivory" : "text-navy-900"}`}>{title}</p>
      {children && <div className={`mx-auto mt-3 max-w-xl leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>{children}</div>}
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
