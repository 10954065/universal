import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "site" | "prose" | "wide";
}

const widths = {
  site: "max-w-site",
  prose: "max-w-prose",
  wide: "max-w-[90rem]",
} as const;

export function Container({ children, className = "", size = "site" }: ContainerProps) {
  return <div className={`mx-auto w-full px-5 sm:px-8 lg:px-10 ${widths[size]} ${className}`}>{children}</div>;
}
