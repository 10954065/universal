"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ destination }: { destination: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error: signInError } = await authClient.signIn.email({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (signInError) {
      setPending(false);
      // One message for every failure, so attackers cannot tell which accounts exist.
      setError(signInError.status === 429 ? "Too many attempts. Please wait a few minutes and try again." : "The email or password is incorrect, or the account is inactive.");
      return;
    }
    router.replace(destination);
    router.refresh();
  }

  const input = "mt-2 h-12 w-full border border-navy-900/20 bg-white px-4 text-base text-navy-900 focus:border-navy-900 focus:outline-2 focus:outline-gold";
  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div aria-live="polite" role="status">
        {error && <p className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{error}</p>}
      </div>
      <div>
        <label htmlFor="login-email" className="text-sm font-semibold text-navy-900">
          Email address
        </label>
        <input id="login-email" name="email" type="email" autoComplete="username" required className={input} />
      </div>
      <div>
        <label htmlFor="login-password" className="text-sm font-semibold text-navy-900">
          Password
        </label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required minLength={12} className={input} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center bg-navy-900 text-sm font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-navy-700 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
