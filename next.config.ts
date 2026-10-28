import type { NextConfig } from "next";

// Headers applied to every response. The Content-Security-Policy is set per request in src/proxy.ts.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  experimental: {
    // Admin image uploads go through a server action (validated to 10 MB in media-actions.ts).
    serverActions: { bodySizeLimit: "11mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // 60 is used only for the full-bleed homepage hero, which sits under a dark gradient.
    qualities: [60, 75],
    deviceSizes: [400, 640, 828, 1080, 1280, 1600, 2048],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Administrative pages must never be indexed or cached by shared caches.
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
