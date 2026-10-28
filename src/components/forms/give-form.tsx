"use client";

import { useActionState } from "react";
import { startDonation } from "@/server/donation-actions";
import { initialFormState } from "@/lib/form-state";
import { track } from "@/lib/analytics";
import { FormMessage, SpamGuard, SubmitButton, TextField } from "@/components/forms/fields";

interface GiveFormProps {
  token: string;
  categories: { id: string; name: string }[];
}

export function GiveForm({ token, categories }: GiveFormProps) {
  const [state, action] = useActionState(startDonation, initialFormState);

  return (
    <form action={action} onSubmit={() => track("Donation Started")} noValidate className="relative space-y-5">
      <SpamGuard token={token} />
      <FormMessage state={state} />
      <TextField
        formId="give"
        name="amount"
        label="Amount (GH₵)"
        inputMode="decimal"
        placeholder="e.g. 50.00"
        required
        maxLength={12}
        state={state}
      />
      {categories.length > 0 && (
        <div>
          <label htmlFor="give-categoryId" className="block text-sm font-semibold text-navy-900">
            Giving towards <span className="ml-2 text-xs font-normal text-muted">(optional)</span>
          </label>
          <select
            id="give-categoryId"
            name="categoryId"
            defaultValue={state.values?.categoryId ?? ""}
            className="mt-2 h-12 w-full border border-navy-900/20 bg-white px-4 text-base text-navy-900 focus:border-navy-900"
          >
            <option value="">General offering</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <TextField formId="give" name="name" label="Your name" autoComplete="name" maxLength={120} state={state} />
      <TextField
        formId="give"
        name="email"
        type="email"
        label="Email address"
        hint="Paystack sends your payment receipt here."
        autoComplete="email"
        required
        maxLength={254}
        state={state}
      />
      <SubmitButton pendingLabel="Connecting to Paystack…">Continue to secure payment</SubmitButton>
    </form>
  );
}
