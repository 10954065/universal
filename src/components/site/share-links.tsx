"use client";

import { useState } from "react";
import { Check, Link2, Mail } from "lucide-react";
import { SocialIcon } from "@/components/site/social-links";

interface ShareLinksProps {
  url: string;
  title: string;
}

/** Plain share links (no third-party scripts or tracking pixels), plus copy-to-clipboard. */
export function ShareLinks({ url, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: <SocialIcon network="whatsapp" className="h-4 w-4" /> },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <SocialIcon network="facebook" className="h-4 w-4" /> },
    { label: "X", href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`, icon: <SocialIcon network="x" className="h-4 w-4" /> },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} /> },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const itemClass =
    "inline-flex h-10 items-center gap-2 border border-navy-900/15 px-3.5 text-sm font-medium text-navy-900 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-ivory";

  return (
    <div>
      <p className="eyebrow text-gold-ink">Share</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {targets.map((target) => (
          <li key={target.label}>
            <a href={target.href} target="_blank" rel="noopener noreferrer" className={itemClass}>
              {target.icon}
              {target.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} className={itemClass}>
            {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <span role="status" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </span>
        </li>
      </ul>
    </div>
  );
}
