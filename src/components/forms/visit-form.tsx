"use client";

import { useActionState } from "react";
import { submitVisit } from "@/server/public-actions";
import { initialFormState } from "@/lib/form-state";
import { track } from "@/lib/analytics";
import { FormMessage, SpamGuard, SubmitButton, SuccessPanel, TextAreaField, TextField } from "@/components/forms/fields";

export function VisitForm({ token }: { token: string }) {
  const [state, action] = useActionState(async (previous: typeof initialFormState, formData: FormData) => {
    const next = await submitVisit(previous, formData);
    if (next.status === "success") track("Visit Enquiry Submitted");
    return next;
  }, initialFormState);

  if (state.status === "success") return <SuccessPanel message={state.message}>Someone from our team will be in touch before your visit.</SuccessPanel>;

  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={action} noValidate className="relative space-y-6">
      <SpamGuard token={token} />
      <FormMessage state={state} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField formId="visit" name="name" label="Your name" autoComplete="name" required maxLength={120} state={state} />
        <TextField formId="visit" name="email" type="email" label="Email address" autoComplete="email" required maxLength={254} state={state} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <TextField formId="visit" name="phone" type="tel" label="Phone" autoComplete="tel" maxLength={30} state={state} />
        <TextField formId="visit" name="visitDate" type="date" label="Planned date" min={today} state={state} />
        <TextField formId="visit" name="partySize" type="number" label="How many of you?" min={1} max={50} defaultValue="1" required state={state} />
      </div>
      <TextAreaField
        formId="visit"
        name="message"
        label="Anything we should know?"
        hint="For example, questions about children, accessibility or where to park."
        maxLength={2000}
        rows={4}
        state={state}
      />
      <SubmitButton>Let us know you're coming</SubmitButton>
    </form>
  );
}
