# Launch Checklist: Information Required from the Ministry

Nothing below has been invented. Each item is either empty in the CMS or is marked as proposed copy awaiting approval. Most items can be entered directly in the admin dashboard (`/admin`) without a developer.

## Identity & brand
- [ ] Official logo (SVG or high-resolution PNG). A typographic wordmark is used until supplied. *(Dashboard: Site settings)*
- [ ] Confirm official name and branch naming: photos show "Universal Trinity Ministry, Shiloh Emmanuel Temple". Are there other branches? (The photos show two different sanctuaries.)
- [ ] Confirm brand colours, or approve the proposed navy / ivory / gold palette.
- [ ] Permission to publish each photograph and the people in them (especially photos of children).

## About
- [ ] Mission statement. A banner in the photos shows one but it is not legible enough to transcribe. *(Dashboard: Page content, About)*
- [ ] Vision statement (same as above).
- [ ] Core values.
- [ ] Statement of faith / beliefs.
- [ ] Ministry history and founding story.
- [ ] Denomination or affiliation, if any.
- [ ] Approve or replace the proposed hero headline: "Growing in Faith. Living in Love. Sharing the Hope of Christ."
- [ ] Approve or replace the proposed welcome introduction.

## Leadership
- [ ] Names, official titles, biographies and approved photos. Four studio clergy portraits exist in the media library but are **not** attributed to anyone.

## Services & visiting
- [ ] Service names, days, start/end times, venue(s). *(Dashboard: Service times)*
- [ ] Online streaming link, if any.
- [ ] Physical address, directions, and confirmed map location.
- [ ] Parking, accessibility, children's facilities, dress guidance (only if the ministry wants these published).

## Contact & social
- [ ] Official phone number(s). The banners in the photos show numbers but they are not legible.
- [ ] Official email address.
- [ ] WhatsApp number for enquiries.
- [ ] Official Facebook, Instagram, YouTube, TikTok URLs.

## Ministries
- [ ] Confirm which departments exist (eight suggested categories are seeded as **drafts**), with leader, meeting time and contact for each.

## Giving
- [ ] Approved giving categories (tithe, offering, building fund, etc.).
- [ ] Bank name, account name, account number, branch.
- [ ] Mobile Money network, number and registered name.
- [ ] Decision on online giving; if yes, a verified Paystack account in the ministry's name and its **secret key** (test key first, then live). *(Developer sets it as an environment variable; never sent by email or chat.)*
- [ ] Refund / donation policy wording.

## Content
- [ ] Sermons: titles, speakers, dates, scripture references, YouTube/Vimeo/audio links.
- [ ] Upcoming events.
- [ ] Featured scripture and the Bible translation the ministry prefers (KJV and WEB are public domain; most modern translations require permission).
- [ ] Outreach programmes to feature (no impact figures are published until supplied).

## Legal & privacy
- [ ] Review the Privacy Policy template (Ghana Data Protection Act, 2012 (Act 843) considerations), especially retention periods.
- [ ] Review Terms and Conditions.
- [ ] Prayer request retention period (default 180 days).
- [ ] Data controller contact details.

## Technical
- [ ] Domain name.
- [ ] Hosting account (Vercel recommended) and managed PostgreSQL (e.g. Neon, Supabase).
- [ ] Resend account + verified sending domain for emails, and the staff inbox that should receive enquiry notifications.
- [ ] Decision on the newsletter sign-up (switch on only once email works).
- [ ] First Super Administrator's name and email, and the list of other staff with their roles.
- [ ] Analytics provider decision (optional).

## Before going live (developer)
These are set up by the developer; see the README's deployment section.
- [ ] Production environment variables set, including `CRON_SECRET` and `BLOB_READ_WRITE_TOKEN`.
- [ ] `npm run db:deploy` and `npm run db:seed` run against the production database. `SEED_SAMPLE_CONTENT` is **not** set, so no "[Sample]" sermons or events exist in production.
- [ ] If online giving is on: Paystack webhook URL set to `https://<domain>/api/paystack/webhook`, and one test gift verified end to end.
- [ ] A test enquiry, prayer request and (if enabled) newsletter sign-up sent from the live site and seen in the dashboard.
- [ ] Every page reviewed while signed out: no draft wording, placeholder text or unapproved photos visible.
- [ ] Privacy Policy and Terms approved by the ministry.
