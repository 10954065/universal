"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import type { FormState } from "@/lib/form-state";

const inputBase =
  "w-full rounded-xl border bg-white px-4 text-[1.0625rem] text-navy-900 transition-[border-color,box-shadow] placeholder:text-muted/70 focus:border-navy-900 focus:shadow-[0_0_0_4px_rgb(18_18_18/0.08)] focus:outline-none aria-[invalid=true]:border-danger";

interface FieldShellProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  errors?: string[];
  children: (describedBy: string | undefined) => ReactNode;
}

function FieldShell({ id, label, hint, required, errors, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-danger">
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-muted">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children(describedBy)}</div>
      {errorId && (
        <p id={errorId} className="mt-2 text-sm font-medium text-danger">
          {errors?.join(" ")}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends Omit<ComponentProps<"input">, "id" | "name"> {
  name: string;
  label: string;
  hint?: string;
  state: FormState;
  formId: string;
}

export function TextField({ name, label, hint, state, formId, required, defaultValue, ...props }: TextFieldProps) {
  const id = `${formId}-${name}`;
  const errors = state.fieldErrors?.[name];
  return (
    <FieldShell id={id} label={label} hint={hint} required={required} errors={errors}>
      {(describedBy) => (
        <input
          id={id}
          name={name}
          required={required}
          aria-invalid={errors?.length ? true : undefined}
          aria-describedby={describedBy}
          defaultValue={state.values?.[name] ?? defaultValue}
          className={`${inputBase} h-12 ${errors?.length ? "border-danger" : "border-line"}`}
          {...props}
        />
      )}
    </FieldShell>
  );
}

interface TextAreaFieldProps extends Omit<ComponentProps<"textarea">, "id" | "name"> {
  name: string;
  label: string;
  hint?: string;
  state: FormState;
  formId: string;
}

export function TextAreaField({ name, label, hint, state, formId, required, rows = 5, defaultValue, ...props }: TextAreaFieldProps) {
  const id = `${formId}-${name}`;
  const errors = state.fieldErrors?.[name];
  return (
    <FieldShell id={id} label={label} hint={hint} required={required} errors={errors}>
      {(describedBy) => (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-invalid={errors?.length ? true : undefined}
          aria-describedby={describedBy}
          defaultValue={state.values?.[name] ?? defaultValue}
          className={`${inputBase} py-3 leading-relaxed ${errors?.length ? "border-danger" : "border-line"}`}
          {...props}
        />
      )}
    </FieldShell>
  );
}

interface CheckboxFieldProps extends Omit<ComponentProps<"input">, "id" | "name" | "type"> {
  name: string;
  label: ReactNode;
  state: FormState;
  formId: string;
}

export function CheckboxField({ name, label, state, formId, ...props }: CheckboxFieldProps) {
  const id = `${formId}-${name}`;
  const errors = state.fieldErrors?.[name];
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          aria-invalid={errors?.length ? true : undefined}
          aria-describedby={errorId}
          className="mt-0.5 h-5 w-5 shrink-0 accent-accent"
          {...props}
        />
        <label htmlFor={id} className="text-[0.9375rem] leading-relaxed text-navy-800">
          {label}
        </label>
      </div>
      {errorId && (
        <p id={errorId} className="ml-8 mt-2 text-sm font-medium text-danger">
          {errors?.join(" ")}
        </p>
      )}
    </div>
  );
}

/** Hidden anti-spam fields. The honeypot is invisible to people and assistive technology. */
export function SpamGuard({ token }: { token: string }) {
  return (
    <>
      <input type="hidden" name="formToken" value={token} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
    </>
  );
}

export function SubmitButton({ children, pendingLabel = "Sending..." }: { children: ReactNode; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClasses("primary", "w-full gap-2 sm:w-auto")}>
      {pending && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {pending ? pendingLabel : children}
    </button>
  );
}

/** Polite live region announcing form-level errors to screen readers. */
export function FormMessage({ state }: { state: FormState }) {
  return (
    <div aria-live="polite" role="status">
      {state.status === "error" && state.message && (
        <p className="rounded-xl bg-danger/[0.07] px-4 py-3 text-[0.9375rem] font-medium text-danger">{state.message}</p>
      )}
    </div>
  );
}

/** Replaces the form once the submission is confirmed by the server. */
export function SuccessPanel({ message, children }: { message?: string; children?: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="rounded-tile bg-sand p-10 text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-success" strokeWidth={1.5} />
      <p className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-navy-900">{message ?? "Thank you."}</p>
      {children && <div className="mt-4 text-muted">{children}</div>}
    </div>
  );
}
