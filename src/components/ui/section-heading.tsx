import type { ReactNode } from "react";
import { Emphasis } from "@/components/ui/emphasis";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  index?: string;
  title: string;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  size?: "lg" | "md";
  className?: string;
}

/** Eyebrow label + serif heading + optional intro. Used to open most sections. */
export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  intro,
  tone = "light",
  align = "left",
  as: Tag = "h2",
  size = "lg",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-3 ${centered ? "justify-center" : ""} ${dark ? "text-gold" : "text-gold-ink"}`}>
          {index && <span className="font-display text-base tracking-normal [font-variant-numeric:lining-nums]">{index}</span>}
          <span aria-hidden="true" className="rule-gold" />
          <span>{eyebrow}</span>
        </p>
      )}
      <Tag
        id={id}
        className={`mt-5 font-display font-semibold ${size === "lg" ? "text-display-lg" : "text-display-md"} ${dark ? "text-ivory" : "text-navy-900"}`}
      >
        <Emphasis text={title} accentClassName={dark ? "text-gold" : "text-gold-ink"} />
      </Tag>
      {intro && <div className={`mt-6 text-lg leading-relaxed ${dark ? "text-mist" : "text-muted"}`}>{intro}</div>}
    </div>
  );
}
