"use client";

import { useActionState } from "react";
import { registerForEvent } from "@/server/public-actions";
import { initialFormState } from "@/lib/form-state";
import { track } from "@/lib/analytics";
import { FormMessage, SpamGuard, SubmitButton, SuccessPanel, TextAreaField, TextField } from "@/components/forms/fields";

export function RegistrationForm({ eventId, token, maxAttendees }: { eventId: string; token: string; maxAttendees: number }) {
  const [state, action] = useActionState(async (previous: typeof initialFormState, formData: FormData) => {
    const next = await registerForEvent(previous, formData);
    if (next.status === "success") track("Event Registration");
    return next;
  }, initialFormState);

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative mt-6 space-y-5">
      <SpamGuard token={token} />
      <input type="hidden" name="eventId" value={eventId} />
      <FormMessage state={state} />
      <TextField formId="register" name="name" label="Full name" autoComplete="name" required maxLength={120} state={state} />
      <TextField formId="register" name="email" type="email" label="Email address" autoComplete="email" required maxLength={254} state={state} />
      <TextField formId="register" name="phone" type="tel" label="Phone" autoComplete="tel" maxLength={30} state={state} />
      <TextField formId="register" name="attendees" type="number" label="Number attending" min={1} max={maxAttendees} defaultValue="1" required state={state} />
      <TextAreaField formId="register" name="notes" label="Notes" hint="Dietary or access needs, for example." maxLength={1000} rows={3} state={state} />
      <SubmitButton pendingLabel="Registering...">Register</SubmitButton>
    </form>
  );
}
