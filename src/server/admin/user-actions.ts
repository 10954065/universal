"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";
import { authorize } from "@/lib/session";
import type { FormState } from "@/lib/form-state";
import { ROLES, type Role } from "@/lib/permissions";
import { emailField } from "@/lib/validation";
import { checkbox, failure, parseForm, requiredText } from "@/server/admin/helpers";

const roleField = z.enum(ROLES as [Role, ...Role[]]);

function temporaryPassword(): string {
  return randomBytes(15).toString("base64url");
}

const createSchema = z.object({ name: requiredText(120), email: emailField, role: roleField });

/** Creates a staff account with a one-time temporary password shown to the Super Administrator. */
export async function createStaff(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await authorize("users:manage");
    const parsed = parseForm(createSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { name, email, role } = parsed.data;
    if (await db.user.findUnique({ where: { email } })) return { status: "error", fieldErrors: { email: ["An account with this email already exists."] } };

    const password = temporaryPassword();
    const id = randomBytes(16).toString("hex");
    await db.$transaction([
      db.user.create({ data: { id, name, email, role, emailVerified: true, active: true } }),
      db.account.create({ data: { id: randomBytes(16).toString("hex"), userId: id, accountId: id, providerId: "credential", password: await hashPassword(password) } }),
    ]);
    await audit(admin.id, "user.created", "User", id, `${email} as ${role}`);
    return {
      status: "success",
      message: `Account created for ${email}. Temporary password (shown once, so share it securely and ask them to change it): ${password}`,
    };
  } catch (error) {
    return failure(error, "createStaff");
  }
}

const updateSchema = z.object({ id: requiredText(40), role: roleField, active: checkbox });

export async function updateStaff(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await authorize("users:manage");
    const parsed = parseForm(updateSchema, formData);
    if (!parsed.ok) return parsed.state;
    const { id, role, active } = parsed.data;

    // Guard against locking everyone out: the last active Super Administrator must remain.
    if (role !== "SUPER_ADMIN" || !active) {
      const otherSupers = await db.user.count({ where: { role: "SUPER_ADMIN", active: true, NOT: { id } } });
      if (otherSupers === 0) return { status: "error", message: "At least one active Super Administrator is required." };
    }
    await db.user.update({ where: { id }, data: { role, active } });
    // Deactivation ends every existing session immediately.
    if (!active) await db.session.deleteMany({ where: { userId: id } });
    await audit(admin.id, "user.updated", "User", id, `role=${role} active=${active}`);
    return { status: "success", message: "Account updated." };
  } catch (error) {
    return failure(error, "updateStaff");
  }
}

export async function resetStaffPassword(_state: FormState, formData: FormData): Promise<FormState> {
  try {
    const admin = await authorize("users:manage");
    const id = String(formData.get("id") ?? "");
    const account = await db.account.findFirst({ where: { userId: id, providerId: "credential" } });
    if (!account) return { status: "error", message: "This account has no password sign-in." };
    const password = temporaryPassword();
    await db.account.update({ where: { id: account.id }, data: { password: await hashPassword(password) } });
    await db.session.deleteMany({ where: { userId: id } });
    await audit(admin.id, "user.password-reset", "User", id);
    return { status: "success", message: `Password reset. New temporary password (shown once): ${password}` };
  } catch (error) {
    return failure(error, "resetStaffPassword");
  }
}
