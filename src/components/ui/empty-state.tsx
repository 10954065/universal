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
    <div className={`rounded-tile px-6 py-14 text-center sm:px-12 sm:py-20 ${dark ? "bg-white/[0.07]" : "bg-sand"}`}>
      <p className={`text-display-sm font-semibold ${dark ? "text-ivory" : "text-navy-900"}`}>{title}</p>
      {children && <div className={`mx-auto mt-3 max-w-xl text-lg leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>{children}</div>}
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
