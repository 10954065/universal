# Universal Trinity Ministry Implementation Plan

## 1. Audit (2026-10-28)

| Item | Finding |
| --- | --- |
| Existing code | None. Greenfield project. |
| Brand assets | 61 photographs (48 unique after de-duplication): worship, preaching, prayer, congregation group photos, children, women's and men's fellowship, an outreach team, and four studio clergy portraits. No logo file. |
| Verified facts visible in photos | Ministry name **Universal Trinity Ministry**; the backdrop at one venue reads **"Shiloh Emmanuel Temple"**; stage scripture reads "...he restores my soul" (Psalm 23); outreach T-shirts read "Let us trade our salvation too" with a John 3:16 reference. |
| Facts *not* verifiable | Mission/vision banners are visible but too low-resolution to transcribe. Phone numbers are printed on the banners but are illegible. Names and roles of the people photographed are unknown. |
| Tooling | Node 24, npm 11, Docker 29, GitHub CLI authenticated. No local PostgreSQL install; Docker is used for development. |

Because none of the people in the photographs are identified, the site never captions a photo with a name or title, and no leadership profile is published until an administrator enters verified details.

## 2. Architecture

- **Next.js 16 (App Router), React 19, TypeScript strict.** Server Components by default. Client components only for menus, dialogs, forms, filters and media players.
- **Tailwind CSS v4** with design tokens declared in `src/app/globals.css` (`@theme`).
- **PostgreSQL + Prisma ORM** (driver adapter `@prisma/adapter-pg`). Migrations are committed. `docker-compose.yml` provides a local database.
- **Better Auth** for email/password sessions stored in Postgres. Public sign-up is disabled. Administrators are created through a CLI script or by a Super Administrator.
- **Role-based access control** (`SUPER_ADMIN`, `CONTENT_ADMIN`, `MINISTRY_STAFF`) enforced on the server in every server action and route handler via `requirePermission()`.
- **Zod** validation shared by client and server. Forms use server actions with `useActionState`, so they work before JavaScript loads.
- **Spam & abuse controls**: honeypot field, signed form-timing token, and a Postgres-backed rate limiter (works on serverless where in-memory limiters do not).
- **Email**: Resend HTTP API, enabled only when `RESEND_API_KEY` is set. Form submissions are always stored in the database first, so a mail outage never loses an enquiry.
- **Payments**: Paystack (GHS, card + Mobile Money). Disabled until keys are configured. Server-side initialization, server-side verification, and HMAC-SHA512 webhook verification. Receipts are shown only for verified transactions.
- **Media**: uploads go to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, or to `public/uploads` on a persistent server.
- **Testing**: Vitest (unit + DB integration) and Playwright (end-to-end, responsive checks).

## 3. Content model principles

1. Every piece of public content has a `status` (`DRAFT` / `PUBLISHED`). Public queries only return `PUBLISHED` rows.
2. Long-form page copy (About, mission, beliefs, visit details, legal pages) lives in `PageSection` rows keyed by slot. Empty or draft sections are simply not rendered.
3. Proposed marketing copy (hero headline, welcome introduction) ships as editable defaults and is listed in the launch checklist for approval.
4. The development seed creates only clearly-labelled sample sermons/events and only when `SEED_SAMPLE_CONTENT=true`. The production seed creates settings, the media library, and draft page sections only.

## 4. Phases

1. Audit & plan *(this document, launch checklist)*
2. Design system & application foundation
3. Public website
4. Database, validation & backend workflows
5. Authentication & administration dashboard
6. Integrations (email, media storage, Paystack, analytics hook)
7. SEO, accessibility & performance
8. Testing & hardening
9. Deployment readiness
10. Final review & handover

Each phase is committed separately to `github.com/10954065/universal`.
