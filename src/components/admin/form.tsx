"use client";

import Image from "next/image";
import { createContext, useActionState, useContext, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Check, ImageIcon, X } from "lucide-react";
import { initialFormState, type FormState } from "@/lib/form-state";

/*
 * Admin form kit. <AdminForm> runs a server action via useActionState and shares
 * the returned state with fields through context, so pages compose forms
 * declaratively and validation errors appear beside the right field.
 */

const FormStateContext = createContext<FormState>(initialFormState);

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

interface AdminFormProps {
  action: Action;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  encType?: "multipart/form-data";
}

export function AdminForm({ action, children, submitLabel = "Save changes", className = "" }: AdminFormProps) {
  const [state, formAction] = useActionState(action, initialFormState);
  return (
    <FormStateContext.Provider value={state}>
      <form action={formAction} noValidate className={`space-y-6 ${className}`}>
        <FormBanner />
        {children}
        <div className="flex items-center gap-4 border-t border-line pt-6">
          <Submit label={submitLabel} />
        </div>
      </form>
    </FormStateContext.Provider>
  );
}

function FormBanner() {
  const state = useContext(FormStateContext);
  return (
    <div aria-live="polite" role="status">
      {state.status === "error" && state.message && <p className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm font-medium text-danger">{state.message}</p>}
      {state.status === "success" && state.message && (
        <p className="flex items-center gap-2 border-l-2 border-success bg-success/5 px-4 py-3 text-sm font-medium text-success">
          <Check aria-hidden="true" className="h-4 w-4" />
          {state.message}
        </p>
      )}
    </div>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center gap-2 bg-navy-900 px-6 text-sm font-semibold text-ivory transition-colors hover:bg-navy-700 disabled:opacity-60"
    >
      {pending && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory" />}
      {pending ? "Saving…" : label}
    </button>
  );
}

const control =
  "w-full border bg-white px-3.5 text-[0.9375rem] text-navy-900 focus:border-navy-900 focus:outline-2 focus:outline-offset-0 focus:outline-gold aria-[invalid=true]:border-danger";

interface BaseFieldProps {
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
}

function useField(name: string) {
  const state = useContext(FormStateContext);
  const errors = state.fieldErrors?.[name];
  return { errors, invalid: Boolean(errors?.length) };
}

function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
      {label}
      {required && (
        <span aria-hidden="true" className="ml-1 text-danger">
          *
        </span>
      )}
    </label>
  );
}

function Help({ id, hint, errors }: { id: string; hint?: ReactNode; errors?: string[] }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {errors?.length ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-danger">
          {errors.join(" ")}
        </p>
      ) : null}
    </>
  );
}

function describedBy(id: string, hint: unknown, invalid: boolean) {
  return [hint ? `${id}-hint` : null, invalid ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export function Field({
  name,
  label,
  hint,
  required,
  defaultValue,
  type = "text",
  ...rest
}: BaseFieldProps & { defaultValue?: string | number | null; type?: string; placeholder?: string; maxLength?: number; min?: number | string; max?: number | string; step?: string; autoComplete?: string; list?: string }) {
  const { errors, invalid } = useField(name);
  const id = `f-${name}`;
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className={`${control} mt-2 h-11 ${invalid ? "border-danger" : "border-navy-900/20"}`}
        {...rest}
      />
      <Help id={id} hint={hint} errors={errors} />
    </div>
  );
}

export function FileField({ name, label, hint, required, accept }: BaseFieldProps & { accept: string }) {
  const { errors, invalid } = useField(name);
  const id = `f-${name}`;
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className="mt-2 block w-full text-sm text-navy-900 file:mr-4 file:min-h-10 file:border-0 file:bg-navy-900 file:px-4 file:text-sm file:font-semibold file:text-ivory"
      />
      <Help id={id} hint={hint} errors={errors} />
    </div>
  );
}

export function TextArea({ name, label, hint, required, defaultValue, rows = 5, maxLength }: BaseFieldProps & { defaultValue?: string | null; rows?: number; maxLength?: number }) {
  const { errors, invalid } = useField(name);
  const id = `f-${name}`;
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        maxLength={maxLength}
        defaultValue={defaultValue ?? ""}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className={`${control} mt-2 py-2.5 leading-relaxed ${invalid ? "border-danger" : "border-navy-900/20"}`}
      />
      <Help id={id} hint={hint} errors={errors} />
    </div>
  );
}

export function Select({
  name,
  label,
  hint,
  required,
  defaultValue,
  options,
}: BaseFieldProps & { defaultValue?: string | null; options: { value: string; label: string }[] }) {
  const { errors, invalid } = useField(name);
  const id = `f-${name}`;
  return (
    <div>
      <Label id={id} label={label} required={required} />
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy(id, hint, invalid)}
        className={`${control} mt-2 h-11 ${invalid ? "border-danger" : "border-navy-900/20"}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Help id={id} hint={hint} errors={errors} />
    </div>
  );
}

export function Checkbox({ name, label, hint, defaultChecked }: Omit<BaseFieldProps, "required"> & { defaultChecked?: boolean }) {
  const id = `f-${name}`;
  return (
    <div className="flex items-start gap-3">
      <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} aria-describedby={hint ? `${id}-hint` : undefined} className="mt-0.5 h-5 w-5 accent-navy-900" />
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-navy-900">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="mt-0.5 text-xs text-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}

export interface MediaOption {
  id: string;
  url: string;
  alt: string;
}

/** Chooses an image from the media library using an accessible modal dialog. */
export function ImagePicker({ name, label, hint, media, defaultValue }: BaseFieldProps & { media: MediaOption[]; defaultValue?: string | null }) {
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = media.find((item) => item.id === selected);

  return (
    <div>
      <p className="text-sm font-semibold text-navy-900">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <input type="hidden" name={name} value={selected ?? ""} />
      <div className="mt-2 flex items-center gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-line bg-sand">
          {current ? (
            <Image src={current.url} alt={current.alt} fill sizes="112px" className="object-cover" />
          ) : (
            <ImageIcon aria-hidden="true" className="absolute inset-0 m-auto h-6 w-6 text-muted" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => dialogRef.current?.showModal()} className="min-h-10 border border-navy-900/25 px-4 text-sm font-medium hover:border-navy-900">
            {current ? "Change image" : "Choose image"}
          </button>
          {current && (
            <button type="button" onClick={() => setSelected(null)} className="min-h-10 px-3 text-sm text-danger underline underline-offset-4">
              Remove
            </button>
          )}
        </div>
      </div>
      <dialog ref={dialogRef} aria-label={`Choose ${label.toLowerCase()}`} className="m-auto max-h-[85vh] w-[min(64rem,calc(100vw-2rem))] bg-ivory p-0 backdrop:bg-navy-950/60">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ivory px-5 py-3">
          <p className="font-semibold text-navy-900">Media library</p>
          <button type="button" onClick={() => dialogRef.current?.close()} className="inline-flex h-10 w-10 items-center justify-center hover:bg-sand">
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 lg:grid-cols-5">
          {media.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(item.id);
                  dialogRef.current?.close();
                }}
                aria-pressed={item.id === selected}
                className={`group relative block aspect-[4/3] w-full overflow-hidden border-2 ${item.id === selected ? "border-gold" : "border-transparent hover:border-navy-900/40"}`}
              >
                <Image src={item.url} alt={item.alt} fill sizes="200px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      </dialog>
    </div>
  );
}

/** Button that asks for confirmation in a dialog before submitting a destructive server action. */
export function ConfirmButton({
  action,
  hidden,
  label,
  confirmText,
  tone = "danger",
}: {
  action: (formData: FormData) => Promise<void>;
  hidden: Record<string, string>;
  label: string;
  confirmText: string;
  tone?: "danger" | "neutral";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonClass =
    tone === "danger"
      ? "min-h-10 border border-danger/40 px-4 text-sm font-medium text-danger hover:bg-danger hover:text-white"
      : "min-h-10 border border-navy-900/25 px-4 text-sm font-medium text-navy-900 hover:border-navy-900";
  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={buttonClass}>
        {label}
      </button>
      <dialog ref={dialogRef} aria-label={label} className="m-auto w-[min(28rem,calc(100vw-2rem))] bg-ivory p-6 backdrop:bg-navy-950/60">
        <p className="font-display text-2xl font-semibold text-navy-900">{label}</p>
        <p className="mt-3 leading-relaxed text-muted">{confirmText}</p>
        <form action={action} className="mt-6 flex justify-end gap-3">
          {Object.entries(hidden).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <button type="button" autoFocus onClick={() => dialogRef.current?.close()} className="min-h-10 border border-navy-900/25 px-4 text-sm font-medium">
            Cancel
          </button>
          <ConfirmSubmit tone={tone} label={label} />
        </form>
      </dialog>
    </>
  );
}

function ConfirmSubmit({ tone, label }: { tone: "danger" | "neutral"; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`min-h-10 px-4 text-sm font-semibold text-white ${tone === "danger" ? "bg-danger" : "bg-navy-900"} disabled:opacity-60`}>
      {pending ? "Working…" : label}
    </button>
  );
}
