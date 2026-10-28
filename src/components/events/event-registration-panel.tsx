import { ExternalLink } from "lucide-react";
import { formatLongDate } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { RegistrationForm } from "@/components/forms/registration-form";
import { createFormToken } from "@/lib/spam";
import { registrationState, type RegistrationEvent, type RegistrationState } from "@/lib/registration";

interface PanelProps {
  event: RegistrationEvent;
  closed: boolean;
  externalUrl: string | null;
}

export function EventRegistrationPanel({ event, closed, externalUrl }: PanelProps) {
  const state = registrationState(event, closed, externalUrl);
  if (state === "none") return null;

  const messages: Partial<Record<RegistrationState, string>> = {
    closed: "Registration for this event has closed.",
    deadline: "The registration deadline has passed.",
    full: "This event is fully booked. Please contact us to join the waiting list.",
  };

  return (
    <div className="border border-line bg-ivory-100 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-navy-900">Register</h2>
      {state === "external" && externalUrl && (
        <>
          <p className="mt-3 leading-relaxed text-muted">Registration for this event is handled on an external page.</p>
          <a href={externalUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("navy", "mt-6 w-full")}>
            Register now
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </>
      )}
      {messages[state] && <p className="mt-3 leading-relaxed text-muted">{messages[state]}</p>}
      {state === "open" && (
        <>
          {event.registrationDeadline && <p className="mt-3 text-sm text-muted">Register by {formatLongDate(event.registrationDeadline)}.</p>}
          {event.registrationCapacity !== null && (
            <p className="mt-2 text-sm text-muted">{event.registrationCapacity - event.registeredCount} places remaining.</p>
          )}
          <RegistrationForm
            eventId={event.id}
            token={createFormToken("registration")}
            maxAttendees={Math.min(20, event.registrationCapacity === null ? 20 : event.registrationCapacity - event.registeredCount)}
          />
        </>
      )}
    </div>
  );
}
