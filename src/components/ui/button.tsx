import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "gold" | "navy" | "outline" | "outline-light" | "text";

const base =
  "group inline-flex items-center justify-center gap-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-300 ease-out disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  gold: "min-h-12 bg-gold px-7 text-navy-950 hover:bg-gold-300 active:translate-y-px",
  navy: "min-h-12 bg-navy-900 px-7 text-ivory hover:bg-navy-700 active:translate-y-px",
  outline: "min-h-12 border border-navy-900/25 px-7 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-ivory",
  "outline-light": "min-h-12 border border-ivory/40 px-7 text-ivory hover:border-ivory hover:bg-ivory hover:text-navy-900",
  text: "min-h-11 text-navy-900 underline decoration-gold decoration-1 underline-offset-[6px] hover:decoration-2",
};

export function buttonClasses(variant: ButtonVariant = "gold", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

/** Arrow glyph that nudges right on hover. */
export function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 10" className="h-2.5 w-5 transition-transform duration-300 group-hover:translate-x-1">
      <path d="M0 5h18M14 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  className?: string;
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({ variant = "gold", className = "", arrow = false, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "gold", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
