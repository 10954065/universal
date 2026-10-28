"use client";

import { useActionState, useState } from "react";
import { submitPrayer } from "@/server/public-actions";
import { initialFormState } from "@/lib/form-state";
import { CheckboxField, FormMessage, SpamGuard, SubmitButton, SuccessPanel, TextAreaField, TextField } from "@/components/forms/fields";

/** Prayer request form. Anonymous mode removes the identifying fields entirely. */
export function PrayerForm({ token }: { token: string }) {
  const [state, action] = useActionState(submitPrayer, initialFormState);
  const [anonymous, setAnonymous] = useState(false);

  if (state.status === "success") return <SuccessPanel message={state.message} />;

  return (
    <form action={action} noValidate className="relative space-y-6">
      <SpamGuard token={token} />
      <FormMessage state={state} />
      <CheckboxField
        formId="prayer"
        name="anonymous"
        state={state}
        checked={anonymous}
        onChange={(event) => setAnonymous(event.currentTarget.checked)}
        label={<span className="font-semibold">Submit anonymously — do not record my name or contact details</span>}
      />
      {!anonymous && (
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField formId="prayer" name="name" label="Your name" autoComplete="name" maxLength={120} state={state} />
          <TextField
            formId="prayer"
            name="contact"
            label="Email or phone"
            hint="Only if you would like someone to follow up with you."
            autoComplete="email"
            maxLength={254}
            state={state}
          />
        </div>
      )}
      <TextAreaField formId="prayer" name="request" label="Your prayer request" required maxLength={4000} rows={7} state={state} />
      <CheckboxField
        formId="prayer"
        name="consent"
        state={state}
        required
        label={
          <>
            I understand this request will be read privately by authorised members of the ministry&apos;s prayer team, will not be published, and will be deleted after
            the retention period described in the{" "}
            <a href="/privacy" className="underline underline-offset-4">
              privacy policy
            </a>
            .
          </>
        }
      />
      <SubmitButton pendingLabel="Sending securely…">Send prayer request</SubmitButton>
    </form>
  );
}
