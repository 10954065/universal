import { describe, expect, it } from "vitest";
import { registrationState, type RegistrationEvent } from "@/lib/registration";

const NOW = new Date("2026-11-01T12:00:00Z");
const base: RegistrationEvent = {
  id: "e1",
  slug: "camp",
  title: "Camp",
  registrationEnabled: true,
  registrationCapacity: 50,
  registrationDeadline: new Date("2026-11-05T00:00:00Z"),
  registeredCount: 10,
};

describe("registrationState", () => {
  it("is open when enabled, before the deadline and with places left", () => {
    expect(registrationState(base, false, null, NOW)).toBe("open");
  });

  it("is full when capacity is reached", () => {
    expect(registrationState({ ...base, registeredCount: 50 }, false, null, NOW)).toBe("full");
  });

  it("treats a missing capacity as unlimited", () => {
    expect(registrationState({ ...base, registrationCapacity: null, registeredCount: 5000 }, false, null, NOW)).toBe("open");
  });

  it("closes after the deadline", () => {
    expect(registrationState({ ...base, registrationDeadline: new Date("2026-10-31T00:00:00Z") }, false, null, NOW)).toBe("deadline");
  });

  it("prefers an external registration link", () => {
    expect(registrationState({ ...base, registrationEnabled: false }, false, "https://forms.example", NOW)).toBe("external");
  });

  it("offers nothing when registration is not enabled", () => {
    expect(registrationState({ ...base, registrationEnabled: false }, false, null, NOW)).toBe("none");
  });

  it("shows closed for past events that had registration", () => {
    expect(registrationState(base, true, null, NOW)).toBe("closed");
    expect(registrationState({ ...base, registrationEnabled: false }, true, null, NOW)).toBe("none");
  });
});
