"use server";

import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

/*
 * Confirmation and unsubscribe happen on an explicit button press (POST), not on
 * page load, so email security scanners that prefetch links cannot trigger them.
 */

export async function confirmSubscription(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) redirect("/newsletter/confirm?result=invalid");
  const hash = createHash("sha256").update(token).digest("hex");
  const updated = await db.newsletterSubscriber.updateMany({
    where: { confirmTokenHash: hash, status: "PENDING" },
    data: { status: "ACTIVE", confirmedAt: new Date(), confirmTokenHash: null },
  });
  redirect(`/newsletter/confirm?result=${updated.count === 1 ? "confirmed" : "invalid"}`);
}

export async function unsubscribe(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) redirect("/newsletter/unsubscribe?result=invalid");
  const updated = await db.newsletterSubscriber.updateMany({
    where: { unsubscribeToken: token, status: { not: "UNSUBSCRIBED" } },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date(), confirmTokenHash: null },
  });
  redirect(`/newsletter/unsubscribe?result=${updated.count === 1 ? "done" : "invalid"}`);
}
