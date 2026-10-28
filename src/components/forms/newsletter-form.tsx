"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/server/public-actions";
import { initialFormState } from "@/lib/form-state";
import { CheckboxField, FormMessage, SpamGuard, SubmitButton, SuccessPanel, TextField } from "@/components/forms/fields";

export function NewsletterForm({ token, consentText }: { token: string; consentText: string }) {
  const [state, action] = useActionState(subscribeNewsletter, initialFormState);

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative space-y-5">
      <SpamGuard token={token} />
      <FormMessage state={state} />
      <TextField formId="newsletter" name="email" type="email" label="Email address" autoComplete="email" required maxLength={254} state={state} />
      <CheckboxField formId="newsletter" name="consent" required state={state} label={consentText} />
      <SubmitButton pendingLabel="Subscribing…">Subscribe</SubmitButton>
    </form>
  );
}
