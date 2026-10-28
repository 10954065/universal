import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Runs before every page request:
 * 1. Generates a per-request nonce and a strict Content Security Policy.
 * 2. Redirects visitors without a session cookie away from /admin (an optimistic
 *    check only — every admin page and action re-verifies the session and role).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !getSessionCookie(request)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  const analytics = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? " https://plausible.io" : "";
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}${analytics}`,
    // Inline style attributes are needed for image focal points and next/image.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://i.ytimg.com https://*.public.blob.vercel-storage.com",
    "font-src 'self'",
    "media-src 'self' https:",
    `connect-src 'self'${analytics}${isDev ? " ws:" : ""}`,
    "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    // Paystack checkout is reached by redirect after the giving form posts.
    "form-action 'self' https://checkout.paystack.com",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];
  return directives.join("; ");
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|images|uploads|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
