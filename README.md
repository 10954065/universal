# Universal Trinity Ministry website and dashboard

The public website for Universal Trinity Ministry (Ghana) and the private dashboard staff use to run it.

- **Public site:** home, about, leadership, ministries, sermons, events, plan your visit, giving, prayer requests, contact, privacy and terms.
- **Dashboard (`/admin`):** edit every page, publish sermons and events, manage photos, read enquiries and prayer requests, see event registrations, subscribers and online gifts, and manage staff accounts.

Before launch, the ministry must supply the information listed in [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md). The site never invents ministry facts: anything not yet supplied is shown as an editable draft or hidden.

## Technology

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL with Prisma 7 |
| Sign-in | Better Auth (email and password, no public sign-up) |
| Email | Resend (optional) |
| Online giving | Paystack (optional) |
| Image storage | Vercel Blob in production, `public/uploads` locally |
| Tests | Vitest (unit and integration), Playwright (end-to-end) |

## Run it locally

You need Node.js 20.9 or newer and Docker.

```bash
npm install
cp .env.example .env            # then fill in BETTER_AUTH_SECRET (see below)
npm run db:up                   # PostgreSQL on localhost:5447 (also creates utm_test)
npm run db:migrate              # create the tables
npm run db:seed                 # settings, page sections, photos, draft ministries
npm run admin:create you@example.org "Your Name"
npm run dev                     # http://localhost:3000
```

`admin:create` prints a one-time temporary password. Sign in at `/admin/login` and change it under **My account**.

To see the sermon and event pages with content while developing, set `SEED_SAMPLE_CONTENT="true"` in `.env` and run `npm run db:seed` again. This adds sermons and events titled **"[Sample] ..."**, which are hidden from search engines. The seed refuses to create them when `NODE_ENV=production`.

Generate secrets with:

```bash
openssl rand -base64 32
```

## Environment variables

All variables are documented in [.env.example](.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL, no trailing slash. Used for canonical links, the sitemap, emails and payment redirects. |
| `DATABASE_URL` | Yes | PostgreSQL connection string. |
| `BETTER_AUTH_SECRET` | Yes | 32+ random characters. Signs sessions and anti-spam form tokens. |
| `BETTER_AUTH_URL` | Yes | Same as the site URL. Sign-in requests from any other origin are rejected. |
| `CRON_SECRET` | Yes in production | Protects the daily data-retention job. |
| `BLOB_READ_WRITE_TOKEN` | Yes on Vercel | Image uploads. Without it, uploads fail on Vercel (read-only filesystem). |
| `RESEND_API_KEY`, `EMAIL_FROM` | Optional | Confirmation emails and staff notifications. Without them, submissions are still saved and visible in the dashboard. |
| `STAFF_NOTIFICATION_EMAIL` | Optional | Inbox that is told about new enquiries. Prayer request text is never emailed. |
| `PAYSTACK_SECRET_KEY` | Optional | Online giving. The **Give online** form only appears when this is set *and* online giving is switched on in **Site settings**. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Privacy-friendly analytics. Empty disables it. |

Never commit `.env`. It is ignored by git.

## Staff roles

Every permission is checked on the server, not just hidden in the menu.

| Role | Can |
| --- | --- |
| Super Administrator | Everything, including site settings, staff accounts, giving records, prayer requests and the audit log. |
| Content Administrator | Edit the website and media; handle enquiries, registrations and subscribers. Cannot see prayer requests or giving. |
| Ministry Staff | Enquiries, event registrations and prayer requests. Cannot edit the website. |

Super Administrators add staff under **Staff accounts**, which shows a temporary password once. Deactivating an account signs that person out everywhere. The last active Super Administrator cannot be removed.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run db:up` | Start local PostgreSQL in Docker |
| `npm run db:migrate` | Create a migration from schema changes (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:seed` | Insert default settings and content (safe to re-run) |
| `npm run admin:create <email> "<full name>" [role]` | Create or reset a staff account from the command line. Role is SUPER_ADMIN (default), CONTENT_ADMIN or MINISTRY_STAFF. |
| `npm test` | Unit and integration tests |
| `npm run test:e2e` | End-to-end tests in Chromium (desktop and mobile) |

## Tests

```bash
npm run db:up
npm run test:unit                 # no database needed
npm run test:integration          # uses the utm_test database
npx playwright install chromium   # first time only
npm run test:e2e                  # builds the app and runs it on port 3300 against utm_test
```

Integration and end-to-end tests refuse to run unless the database name ends in `_test`, so they cannot touch real data. Override the database with `TEST_DATABASE_URL`.

## Deploy to Vercel with Neon

1. **Database.** Create a Neon project in the region closest to Ghana that Neon offers (for example `eu-central-1`). Copy the **pooled** connection string for the app. Keep the direct (non-pooled) one for running migrations.
2. **Project.** Import this repository into Vercel. The defaults are correct: framework Next.js, build command `npm run build`, which also runs `prisma generate`.
3. **Storage.** In the Vercel project, open **Storage** and create a **Blob** store. This adds `BLOB_READ_WRITE_TOKEN`.
4. **Environment variables.** Add everything marked *Yes* in the table above for **Production**. Use the final domain for `NEXT_PUBLIC_SITE_URL` and `BETTER_AUTH_URL`. Do not set `SEED_SAMPLE_CONTENT`.
5. **Tables and first account.** From your machine, point at the production database once:

   ```bash
   DATABASE_URL="<direct Neon URL>" npm run db:deploy
   DATABASE_URL="<direct Neon URL>" npm run db:seed
   DATABASE_URL="<direct Neon URL>" npm run admin:create pastor@example.org "Full Name"
   ```

   Run `npm run db:deploy` again whenever a release adds a migration, before or immediately after deploying it.
6. **Deploy.** Then add the domain under **Settings**, then **Domains**, in Vercel.
7. **Scheduled job.** [vercel.json](vercel.json) runs `/api/cron/retention` daily at 03:00 GMT. It deletes prayer requests older than the retention period set in **Site settings** (default 180 days) and newsletter sign-ups never confirmed within 30 days. Vercel sends `CRON_SECRET` automatically.
8. **Preview deployments.** Give previews their own Neon branch so they never write to the live database.

### Email (Resend)

1. Verify the ministry's domain in Resend (add the DNS records it lists).
2. Set `RESEND_API_KEY`, `EMAIL_FROM` (an address on that domain) and, optionally, `STAFF_NOTIFICATION_EMAIL`.
3. Turn on **Newsletter sign-up** in **Site settings** only after email works. Sign-ups use double opt-in: people are added only after clicking the confirmation link.

### Online giving (Paystack)

1. The ministry opens its own Paystack account (Ghana) and completes verification.
2. Set `PAYSTACK_SECRET_KEY`. Use the test key (it starts with `sk_test_`) first.
3. In the Paystack dashboard, set the **Webhook URL** to `https://<domain>/api/paystack/webhook`.
4. Add giving categories in **Giving setup**, then switch on **Online giving** in **Site settings**.
5. Make a test gift. It should appear under **Donations** as *success* only after Paystack confirms it. Then switch to the live key (it starts with `sk_live_`).

A gift is marked successful only when Paystack's server confirms the reference, amount and currency. Webhooks must carry a valid HMAC-SHA512 signature. Staff cannot mark a gift as paid.

## Security and privacy

- **Content Security Policy:** a per-request nonce. Admin pages are `noindex` and never cached.
- **Public forms:**
  - a hidden honeypot field;
  - a signed timing token that rejects submissions sent faster than a person can type;
  - rate limits stored in Postgres, keyed by a salted hash of the visitor's IP address (raw IPs are never stored);
  - server-side validation of every field.
- **Uploaded images:** re-encoded, with hidden metadata (including GPS location) removed.
- **Prayer requests:** visible only to roles with prayer access. They are never emailed, exported or written to the audit log, and they are deleted automatically after the retention period.
- **CSV exports:** subscribers, registrations and donations can be exported. Exports escape spreadsheet formulas, and every export is recorded in the audit log.

## Where things are edited

| On the site | Dashboard section |
| --- | --- |
| Hero, welcome text, featured scripture, homepage sections | Homepage |
| About, beliefs, plan-your-visit text, privacy, terms | Page content |
| Logo, contact details, social links, giving instructions, newsletter and giving switches, prayer retention | Site settings |
| Giving categories | Giving setup |
| Service times | Service times |
| Banner at the top of every page | Announcements |
| Sermons, events, ministries, leadership, outreach | Their own sections |
| Photos and their descriptions | Media library |

Drafts are never shown publicly. Publish when the ministry has approved the wording.

## Project layout

```text
prisma/            schema, migrations, seed
scripts/           create-admin, photo optimisation
src/app/(site)/    public pages
src/app/admin/     dashboard
src/app/api/       auth, Paystack webhook, retention job
src/components/    UI, site, forms, admin
src/lib/           data access, validation, auth, payments, email, formatting
src/server/        Server Actions (public forms, dashboard)
tests/             unit, integration, e2e
docs/              plan and launch checklist
```

## Not included

- **No bulk newsletter sending.** Export confirmed subscribers as CSV and send through a mailing service, with an unsubscribe link in every email.
- **No member accounts, online booking payments or live-stream hosting.** Sermons link to YouTube, Vimeo or audio files hosted elsewhere.
