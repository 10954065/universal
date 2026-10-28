import "server-only";

/*
 * Transactional email through the Resend HTTP API.
 * When RESEND_API_KEY is not configured, sendEmail reports `skipped` — it never
 * pretends a message was delivered. Callers store submissions in the database
 * first, so nothing is lost when email is unavailable.
 */

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type EmailResult = { status: "sent"; id: string } | { status: "skipped"; reason: string } | { status: "failed"; reason: string };

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return { status: "skipped", reason: "Email delivery is not configured." };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      // Log status only — never the message body or recipient details.
      console.error(`[email] Resend responded ${response.status}`);
      return { status: "failed", reason: `Provider responded ${response.status}` };
    }
    const data = (await response.json()) as { id?: string };
    return { status: "sent", id: data.id ?? "" };
  } catch (error) {
    console.error("[email] delivery error:", error instanceof Error ? error.name : "unknown");
    return { status: "failed", reason: "Network error" };
  }
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

/** Wraps content in a simple, accessible branded email layout. All inputs must already be escaped. */
export function emailLayout(ministryName: string, heading: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f8f5ef;font-family:Arial,Helvetica,sans-serif;color:#242424">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #e3dccd">
<tr><td style="background:#101b2d;padding:24px 32px;color:#c8a45d;font-family:Georgia,serif;font-size:20px">${escapeHtml(ministryName)}</td></tr>
<tr><td style="padding:32px"><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;color:#101b2d">${heading}</h1>${bodyHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

/** Staff notification inbox, if configured. */
export function staffInbox(): string | null {
  return process.env.STAFF_NOTIFICATION_EMAIL || null;
}
