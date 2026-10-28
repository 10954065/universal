import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  // Only same-site admin paths are accepted as a post-login destination (no open redirect).
  const destination = next && /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin";
  if (await getCurrentUser()) redirect(destination);

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="on-dark grain relative hidden flex-col justify-between bg-navy-900 p-12 text-ivory lg:flex">
        <p className="font-display text-2xl font-semibold">
          Universal Trinity <span className="text-gold">Ministry</span>
        </p>
        <blockquote className="max-w-md font-display text-3xl italic leading-snug">
          &ldquo;Let all things be done decently and in order.&rdquo;
          <cite className="eyebrow mt-4 block not-italic text-gold">1 Corinthians 14:40 (KJV)</cite>
        </blockquote>
      </div>
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl font-semibold text-navy-900">Staff sign in</h1>
          <p className="mt-2 text-muted">For authorised ministry staff only.</p>
          <LoginForm destination={destination} />
        </div>
      </div>
    </main>
  );
}
