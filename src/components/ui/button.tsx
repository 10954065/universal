import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "navy" | "gold" | "light" | "outline" | "outline-light" | "text" | "text-light";

const base =
  "pressable group inline-flex items-center justify-center gap-3 font-display text-[0.875rem] font-bold uppercase tracking-[0.08em] disabled:pointer-events-none disabled:opacity-50";

const pill = "min-h-13 rounded-full px-8";
const lift = "shadow-[0_10px_30px_-12px_rgb(10_26_85/0.55)]";

const variants: Record<ButtonVariant, string> = {
  primary: `${pill} ${lift} bg-royal text-white hover:bg-navy-900`,
  navy: `${pill} ${lift} bg-navy-900 text-white hover:bg-royal`,
  gold: `${pill} ${lift} bg-gold text-navy-900 hover:bg-gold-300`,
  light: `${pill} ${lift} bg-white text-navy-900 hover:bg-gold`,
  outline: `${pill} text-navy-900 shadow-[inset_0_0_0_2px_var(--color-navy-900)] hover:bg-navy-900 hover:text-white`,
  "outline-light": `${pill} text-white shadow-[inset_0_0_0_2px_rgb(255_255_255/0.75)] hover:bg-white hover:text-navy-900`,
  text: "min-h-11 text-royal hover:text-navy-900",
  "text-light": "min-h-11 text-gold hover:text-white",
};

export function buttonClasses(variant: ButtonVariant = "primary", className = ""): string {
  return `${base} ${variants[variant]} ${className}`;
}

/** Long hairline arrow that stretches on hover ("LEARN MORE ———→"). */
export function LineArrow({ length = "w-16 group-hover:w-24" }: { length?: string }) {
  return (
    <span aria-hidden="true" className={`relative inline-block h-0.5 ${length} rounded-full bg-current transition-[width] duration-300 ease-out`}>
      <svg viewBox="0 0 8 8" className="absolute -right-px -top-1 h-2.5 w-2.5">
        <path d="M1 0.5 7.5 4 1 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  className?: string;
  /** Adds the hairline arrow. Text links always carry one. */
  arrow?: boolean;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", className = "", arrow = false, children, ...props }: ButtonLinkProps) {
  const isText = variant === "text" || variant === "text-light";
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      {children}
      {(arrow || isText) && <LineArrow length={isText ? "w-16 group-hover:w-24" : "w-6 group-hover:w-9"} />}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}
