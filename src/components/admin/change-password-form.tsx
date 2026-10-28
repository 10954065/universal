"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const MIN_PASSWORD_LENGTH = 12;

const FIELDS = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: `New password (${MIN_PASSWORD_LENGTH}+ characters)`, autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
] as const;

export function ChangePasswordForm() {
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newPassword = String(form.get("newPassword") ?? "");
    if (newPassword.length < MIN_PASSWORD_LENGTH) return setMessage({ tone: "error", text: `Use at least ${MIN_PASSWORD_LENGTH} characters.` });
    if (newPassword !== form.get("confirmPassword")) return setMessage({ tone: "error", text: "The new passwords do not match." });

    setPending(true);
    const { error } = await authClient.changePassword({
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (error) return setMessage({ tone: "error", text: "Your current password is incorrect, or the new password is not allowed." });
    formElement.reset();
    setMessage({ tone: "ok", text: "Password changed. You have been signed out of other devices." });
  }

  const input = "mt-2 h-11 w-full border border-navy-900/20 bg-white px-3.5 text-[0.9375rem] focus:border-navy-900";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div aria-live="polite" role="status">
        {message && (
          <p className={`border-l-2 px-4 py-3 text-sm font-medium ${message.tone === "ok" ? "border-success text-success" : "border-danger text-danger"}`}>{message.text}</p>
        )}
      </div>
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={`pw-${field.name}`} className="text-sm font-semibold text-navy-900">
            {field.label}
          </label>
          <input id={`pw-${field.name}`} name={field.name} type="password" required autoComplete={field.autoComplete} className={input} />
        </div>
      ))}
      <button disabled={pending} className="min-h-11 bg-navy-900 px-6 text-sm font-semibold text-ivory hover:bg-navy-700 disabled:opacity-60">
        {pending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}
