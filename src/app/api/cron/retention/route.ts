import { timingSafeEqual } from "node:crypto";
import { runRetention } from "@/lib/retention";

/**
 * Daily data-retention job (scheduled in vercel.json). Requires
 * `Authorization: Bearer $CRON_SECRET`. Vercel Cron sends this automatically.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await runRetention();
  return Response.json({ ok: true, ...result });
}
