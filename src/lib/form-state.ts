import type { FieldErrors } from "@/lib/validation";

/** Shape returned by every form server action and consumed by useActionState. */
export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  /** Submitted values echoed back so fields keep their content after a validation error. */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };

/** Echoes back submitted text values (never files) so the visitor does not lose their typing. */
export function echoValues(formData: FormData, fields: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value.slice(0, 5000);
  }
  return values;
}
