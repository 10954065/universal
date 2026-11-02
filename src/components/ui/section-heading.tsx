import type { ReactNode } from "react";
import { Emphasis } from "@/components/ui/emphasis";

interface SectionHeadingProps {
  id?: string;
  title: string;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  size?: "lg" | "md";
  className?: string;
}

/** Large headline with an optional intro. Used to open most sections. */
export function SectionHeading({
  id,
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
      <Tag
        id={id}
        className={`font-display font-semibold ${size === "lg" ? "text-display-lg" : "text-display-md"} ${dark ? "text-ivory" : "text-navy-900"}`}
      >
        <Emphasis text={title} accentClassName={dark ? "text-gold" : "text-gold-ink"} />
      </Tag>
      {intro && (
        <div className={`mt-5 max-w-2xl text-xl leading-relaxed sm:text-[1.375rem] sm:leading-[1.45] ${centered ? "mx-auto" : ""} ${dark ? "text-mist" : "text-muted"}`}>
          {intro}
        </div>
      )}
    </div>
  );
}
