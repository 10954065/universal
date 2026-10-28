"use client";

import { useActionState } from "react";
import { submitContact } from "@/server/public-actions";
import { initialFormState } from "@/lib/form-state";
import { track } from "@/lib/analytics";
import { FormMessage, SpamGuard, SubmitButton, SuccessPanel, TextAreaField, TextField } from "@/components/forms/fields";

export function ContactForm({ token, defaultSubject = "" }: { token: string; defaultSubject?: string }) {
  const [state, action] = useActionState(async (previous: typeof initialFormState, formData: FormData) => {
    const next = await submitContact(previous, formData);
    if (next.status === "success") track("Contact Submitted");
    return next;
  }, initialFormState);

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative space-y-6">
      <SpamGuard token={token} />
      <FormMessage state={state} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField formId="contact" name="name" label="Your name" autoComplete="name" required maxLength={120} state={state} />
        <TextField formId="contact" name="email" type="email" label="Email address" autoComplete="email" required maxLength={254} state={state} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField formId="contact" name="phone" type="tel" label="Phone number" autoComplete="tel" maxLength={30} state={state} />
        <TextField formId="contact" name="subject" label="Subject" maxLength={150} defaultValue={defaultSubject} state={state} />
      </div>
      <TextAreaField formId="contact" name="message" label="Message" required maxLength={5000} rows={6} state={state} />
      <p className="text-sm text-muted">
        We use your details only to reply to you. See our{" "}
        <a href="/privacy" className="underline underline-offset-4">
          privacy policy
        </a>
        .
      </p>
      <SubmitButton>Send message</SubmitButton>
    </form>
  );
}
