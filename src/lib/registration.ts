export interface RegistrationEvent {
  id: string;
  slug: string;
  title: string;
  registrationEnabled: boolean;
  registrationCapacity: number | null;
  registrationDeadline: Date | null;
  /** Total people already registered (sum of party sizes). */
  registeredCount: number;
}

export type RegistrationState = "none" | "external" | "open" | "full" | "deadline" | "closed";

/** Decides what the registration panel should offer for an event. */
export function registrationState(event: RegistrationEvent, closed: boolean, externalUrl: string | null, now = new Date()): RegistrationState {
  if (closed) return event.registrationEnabled || externalUrl ? "closed" : "none";
  if (externalUrl) return "external";
  if (!event.registrationEnabled) return "none";
  if (event.registrationDeadline && event.registrationDeadline < now) return "deadline";
  if (event.registrationCapacity !== null && event.registeredCount >= event.registrationCapacity) return "full";
  return "open";
}
