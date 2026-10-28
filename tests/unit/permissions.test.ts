import { describe, expect, it } from "vitest";
import { can, isRole, permissionsFor, ROLES, type Permission } from "@/lib/permissions";

const ALL: Permission[] = [
  "dashboard:view",
  "content:manage",
  "registrations:view",
  "enquiries:manage",
  "prayer:read",
  "subscribers:manage",
  "donations:view",
  "giving:manage",
  "settings:manage",
  "users:manage",
  "audit:view",
];

describe("role permissions", () => {
  it("gives the Super Administrator every permission", () => {
    for (const permission of ALL) expect(can("SUPER_ADMIN", permission)).toBe(true);
  });

  it("lets Content Administrators edit the website but not see prayer, giving, staff or settings", () => {
    expect(can("CONTENT_ADMIN", "content:manage")).toBe(true);
    expect(can("CONTENT_ADMIN", "subscribers:manage")).toBe(true);
    for (const denied of ["prayer:read", "donations:view", "giving:manage", "settings:manage", "users:manage", "audit:view"] as const) {
      expect(can("CONTENT_ADMIN", denied)).toBe(false);
    }
  });

  it("lets Ministry Staff read prayer requests but not edit content or manage subscribers", () => {
    expect(can("MINISTRY_STAFF", "prayer:read")).toBe(true);
    expect(can("MINISTRY_STAFF", "enquiries:manage")).toBe(true);
    expect(can("MINISTRY_STAFF", "content:manage")).toBe(false);
    expect(can("MINISTRY_STAFF", "subscribers:manage")).toBe(false);
    expect(can("MINISTRY_STAFF", "donations:view")).toBe(false);
  });

  it("grants every role access to the dashboard", () => {
    for (const role of ROLES) expect(permissionsFor(role)).toContain("dashboard:view");
  });

  it("denies unknown or missing roles", () => {
    expect(can("ADMIN", "dashboard:view")).toBe(false);
    expect(can(undefined, "dashboard:view")).toBe(false);
    expect(can(null, "content:manage")).toBe(false);
  });

  it("does not treat inherited object properties as roles", () => {
    for (const name of ["toString", "constructor", "__proto__", "hasOwnProperty"]) {
      expect(isRole(name)).toBe(false);
      expect(can(name, "dashboard:view")).toBe(false);
    }
  });
});
