# Website Audit

Date: 2026-05-01
Project: `bot` / `sachsenhausentour.de`
Scope: source review of the Next.js application, booking flow, admin flow, configuration surface, and local build/test/lint health

## Executive Summary

The codebase is functional enough to show the public site and expose a booking/admin workflow, but it currently has several high-risk trust and consistency problems.

The most important issues are:

1. The public `POST /api/checkout/confirm` endpoint trusts client input, does not verify payment status with Stripe, can create "confirmed" bookings, and can send arbitrary confirmation emails.
2. Capacity checks are not enforced atomically, so the site can oversell the same slot under concurrency.
3. There is a hardcoded default admin password in `scripts/seed-admin.ts`.
4. Booking mutations are too permissive: any authenticated user can update booking status and trigger refunds, and updates are not validated.
5. Date, blackout, pricing, and config values are duplicated in incompatible formats across the UI, API routes, content files, and seed/fallback logic.

This is not just a security problem. It is also an architecture problem: the app has no single source of truth for booking configuration, pricing, or booking finalization.

## Methodology

I reviewed:

- App Router routes in `src/app/`
- server-side logic in `src/app/api/`
- auth, MongoDB, Stripe, and config code in `src/lib/`
- data models in `src/models/`
- booking/admin UI flows in `src/components/`
- content/config files in `src/content/` and `src/config/`
- helper scripts in `scripts/`
- local project documentation in `README.md`, `CLAUDE.md`, and local Next docs under `node_modules/next/dist/docs/`

I also ran:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm ls lightningcss @rolldown/binding-darwin-arm64 --all`

I did not run a live dependency vulnerability scan against the network, and I did not inspect actual secret values from `.env.local`.

## Current Architecture

At a high level the app is:

- public marketing site: App Router pages under `src/app/(site)/`
- booking flow: `BookingWidget` -> `POST /api/checkout` -> Stripe PaymentIntent -> client-side `POST /api/checkout/confirm` -> optional Stripe webhook backfill
- admin flow: `next-auth` credentials login -> `/admin/*` pages -> `/api/admin/*` CRUD routes
- persistence: MongoDB via Mongoose
- payments: Stripe
- transactional email: Nodemailer/SMTP

### Intended layering

`CLAUDE.md` describes a 3-layer structure:

- components = reusable/pure view layer
- content = all copy and structured data
- pages = thin assembly only

The implementation no longer matches that design:

- `src/app/(site)/page.tsx` is 551 lines
- `src/app/(site)/about/page.tsx` is 303 lines
- `src/app/(site)/es/page.tsx` is 295 lines
- pages contain large amounts of hardcoded structure and copy
- many section components and content types exist but are not actually used

This mismatch matters because it is one of the reasons pricing, meeting-point, SEO, and booking details now drift across the application.

## Severity Summary

### Critical

- public booking-confirm endpoint can create confirmed bookings and send emails without payment verification

### High

- overselling/race conditions in slot capacity handling
- hardcoded admin seed credentials in repository
- booking update/refund endpoint is overly permissive
- blackout/date format mismatch breaks booking enforcement
- pricing/config duplication creates contradictory runtime behavior

### Medium

- multiple active tour configs can exist with arbitrary selection
- admin create/update routes bypass validation
- no visible rate limiting on admin login or public booking endpoints
- security headers are not configured
- build/test toolchain is broken locally due invalid/missing native optional deps
- deprecated `middleware` convention on Next 16
- blog routing/draft handling is inconsistent
- structured data is duplicated and contradictory

### Low

- broken legal links and incomplete locale implementation
- dead code, unused dependencies, and redundant config objects
- public confirmation page trusts query params and can show fake success states

## Detailed Findings

### 1. `POST /api/checkout/confirm` trusts the browser instead of Stripe

Files:

- `src/app/api/checkout/confirm/route.ts:125-186`
- `src/components/booking/CheckoutForm.tsx:66-96`

Why this is serious:

- The endpoint is public.
- It accepts `name`, `email`, `phone`, `date`, `time`, `guests`, `total`, and `paymentId` from the browser.
- It does not verify the `paymentId` against Stripe.
- It does not confirm that the payment intent belongs to the submitted customer/date/time/amount.
- It saves a booking with `status: 'confirmed'`.
- It sends a customer confirmation email and an internal notification email.

Practical impact:

- Anyone can call this endpoint directly and create fake confirmed bookings.
- Anyone can cause the system to email arbitrary recipients with a forged "booking confirmed" message.
- The database can be polluted with fake or malformed bookings before the webhook ever runs.

Additional problems inside the same route:

- `paymentId` is not part of the required-field validation in `src/app/api/checkout/confirm/route.ts:130-134`.
- the HTML email template interpolates unescaped user-controlled values in `buildCustomerEmail()` at `src/app/api/checkout/confirm/route.ts:16-97`
- it hardcodes `currency: 'eur'` in `src/app/api/checkout/confirm/route.ts:155`
- it derives money from a user-supplied `total` string in `src/app/api/checkout/confirm/route.ts:140`

Recommended fix:

- Make Stripe webhooks the only source of truth for booking creation/finalization.
- If the client still calls a post-payment endpoint, use it only for UX follow-up, never for persistence.
- Verify the payment intent server-side with Stripe and match amount, currency, metadata, and status before doing anything else.
- Escape or sanitize interpolated HTML email fields.

### 2. Slot capacity can be oversold under concurrency

Files:

- `src/app/api/checkout/route.ts:63-87`
- `src/app/api/webhook/route.ts:32-77`
- `src/app/api/checkout/confirm/route.ts:137-160`

What happens now:

- `POST /api/checkout` calculates remaining capacity by aggregating existing confirmed bookings.
- If capacity exists, it creates a Stripe PaymentIntent.
- Final booking creation happens later, either in the public confirm route or the webhook.

Why this fails:

- Two customers can pass the capacity check at the same time.
- Both can pay successfully.
- There is no reservation hold, no transactional decrement, and no second authoritative capacity check at finalization time.

Practical impact:

- same slot can be sold beyond `maxGuestsPerSlot`
- refunds and manual customer support cleanup become the only correction path

Recommended fix:

- introduce a reservation model with expiry, or
- perform authoritative capacity enforcement in a transaction at booking-finalization time, or
- move to a slot-inventory document that can be atomically updated

### 3. Hardcoded admin credentials exist in the repository

File:

- `scripts/seed-admin.ts:31-46`

Why this is serious:

- The script seeds `admin@sachsenhausentour.de`
- The password is hardcoded as `Admin2025!`
- The script logs the credentials back to the console

Practical impact:

- Anyone with repo access knows the default admin credential pattern.
- If this script has ever been run unchanged in a real environment, the admin account is predictable.
- This is especially dangerous because the application uses credential-based auth.

Recommended fix:

- remove hardcoded credentials immediately
- require admin email/password from environment variables or interactive secure input
- rotate any real password that may have been created from this script

### 4. Booking mutation/refund permissions are too broad

File:

- `src/app/api/admin/bookings/[id]/route.ts:37-77`

Problems:

- only `session?.user` is required
- admin role is not required
- any authenticated user can:
  - edit `notes`
  - edit `assignedGuide`
  - edit `status`
  - call `action: 'cancel'` and trigger a Stripe refund

There is also a data-integrity bypass:

- `status` is accepted from request body in `src/app/api/admin/bookings/[id]/route.ts:46-50`
- a caller can mark a booking `refunded` or `cancelled` without the Stripe refund branch ever running

Recommended fix:

- separate `staff` and `admin` permissions explicitly
- allow only admin refunds/cancellations unless business rules require otherwise
- disallow direct status mutation from the API and force status changes through explicit actions
- validate allowed transitions on the server

### 5. Blackout-date and booking-date formats are inconsistent across the stack

Files:

- `src/components/booking/BookingCalendar.tsx:9-23`
- `src/components/booking/BookingCalendar.tsx:85-88`
- `src/components/booking/BookingWidget.tsx:76-83`
- `src/components/booking/BookingWidget.tsx:123-130`
- `src/app/api/checkout/route.ts:35-50`
- `src/models/TourConfig.ts:14-15`
- `src/app/admin/(dashboard)/tours/page.tsx:257-269`
- `src/app/api/admin/stats/route.ts:15-32`

Observed formats:

- calendar component expects blackout dates as ISO `YYYY-MM-DD`
- `TourConfig` comments also say blackout dates are ISO
- booking widget sends selected booking date as `en-GB` `DD/MM/YYYY`
- checkout route compares `config.blackoutDates.includes(date)` using that `DD/MM/YYYY` value
- admin tours page instructs users to enter blackout dates as `DD/MM/YYYY`
- dashboard stats also use `en-GB` string dates for "today"

Why this matters:

- if blackout dates are stored as ISO, the client calendar blocks them but the server-side checkout route does not
- if blackout dates are stored as `DD/MM/YYYY`, the checkout route may block them but the calendar component will not
- reporting becomes locale/timezone sensitive because `tourDate` is stored as display text, not normalized data

This is one of the most important consistency bugs in the app.

Recommended fix:

- store all dates in ISO format only
- use a typed server-side date object or ISO date string for all booking records
- format for display only at the UI edge

### 6. Pricing and tour config are duplicated with contradictory values

Files:

- `src/lib/tour-config.ts:18-31`
- `src/config/site.ts:15-22`
- `src/content/en/book.ts:74-81`
- `src/content/en/book.ts:154-161`
- `src/app/(site)/book/page.tsx:45-58`
- `scripts/seed-admin.ts:56-71`
- `src/__tests__/booking-pipeline.test.ts:43-58`

Contradictions found:

- fallback config price: `5900` cents (`src/lib/tour-config.ts`)
- seeded default tour price: `2900` cents (`scripts/seed-admin.ts`)
- marketing copy repeatedly says `€29`
- booking page converts dynamic DB price to euros, but many other pages are hardcoded
- fallback config has one time slot; static content ships two time slots

Practical impact:

- if the DB is down, the site can silently fall back to a different price and slot structure
- marketing pages, checkout, emails, structured data, and admin can all disagree

Recommended fix:

- define one authoritative tour-config source
- remove price/meeting-point/duration duplication from content/config unless it is explicitly derived
- add a config drift test that fails if static copy and active config disagree

### 7. Multiple active tour configs can exist, and the app chooses one arbitrarily

Files:

- `src/models/TourConfig.ts:40-45`
- `src/lib/tour-config.ts:40-43`
- `src/app/api/checkout/route.ts:24-33`
- `src/app/api/admin/tours/route.ts:18-28`

Problem:

- the schema allows many documents with `active: true`
- both public config loading and checkout use `findOne({ active: true })`
- admin create route can create more configs without enforcing uniqueness

Practical impact:

- price, slots, blackout dates, and meeting point become non-deterministic if more than one active document exists

Recommended fix:

- enforce one active config with a unique partial index or by using a singleton document

### 8. Admin create/update routes bypass strong validation

Files:

- `src/app/api/admin/tours/route.ts:25-28`
- `src/app/api/admin/tours/[id]/route.ts:36-45`
- `src/app/api/admin/users/[id]/route.ts:20-29`
- `src/app/api/admin/bookings/[id]/route.ts:46-50`
- `src/app/api/checkout/confirm/route.ts:142-160`

Problems:

- `TourConfig.create(body)` accepts raw request bodies
- `findByIdAndUpdate(id, body, { new: true })` is used without `runValidators: true`
- user patch route is whitelisted, but still updates without validators
- booking patch route updates status-like fields without transition validation
- booking upsert in checkout confirm uses `findOneAndUpdate(..., { upsert: true })` without validators

Practical impact:

- malformed data can be stored
- enum constraints can be bypassed on updates
- negative/invalid prices, bad time slots, invalid roles, or malformed blackout lists can slip into production

Recommended fix:

- validate input with a schema layer such as Zod or Valibot before Mongoose
- enable `runValidators: true` on updates
- whitelist fields on every mutation route

### 9. No visible brute-force or abuse controls on auth and public endpoints

Files:

- `src/lib/auth.ts:28-79`
- `src/app/admin/login/page.tsx:18-35`
- `src/middleware.ts:5-37`
- `src/app/api/checkout/route.ts`
- `src/app/api/checkout/confirm/route.ts`

Observed:

- credential auth has no rate limit or lockout logic
- public booking endpoints have no rate limit
- email-sending endpoint is public

Practical impact:

- admin login can be brute-forced
- checkout/confirm can be spammed
- SMTP can be abused through the confirmation route

Recommended fix:

- add rate limiting by IP and route
- add login throttling and optionally captcha after repeated failures
- move email sending behind verified payment state only

### 10. Security headers are not configured

File:

- `next.config.ts:1-7`

Observed:

- `next.config.ts` is effectively empty
- no CSP
- no HSTS
- no `X-Frame-Options` / `frame-ancestors`
- no `Referrer-Policy`
- no `Permissions-Policy`

This is not the root cause of the booking issues above, but it is a missing baseline hardening layer.

Recommended fix:

- configure headers centrally in Next config/proxy
- set a CSP that explicitly allows Stripe, images, fonts, and required media origins

### 11. Tooling/install health is broken locally

Command results:

- `npm run lint` failed with 3 errors and 9 warnings
- `npm test` failed before tests ran because `@rolldown/binding-darwin-arm64` is missing/invalid
- `npm run build` failed because `lightningcss.darwin-arm64.node` is missing
- build also emitted a Next 16 deprecation warning for `middleware`
- `npm ls lightningcss @rolldown/binding-darwin-arm64 --all` reported `@rolldown/binding-darwin-arm64` as invalid

Why this matters:

- the repo is not in a reliable build/test state
- real regressions may be masked by environment/package issues

Relevant code references:

- `src/components/sections/ReviewSlider.tsx:270-273`
- `src/app/admin/(dashboard)/bookings/page.tsx:65-67`
- `src/app/admin/(dashboard)/users/page.tsx:27-29`

Lint-specific problems:

- `react-hooks/set-state-in-effect` errors in `ReviewSlider`, admin bookings page, and admin users page
- several unused imports/props indicate dead or drifting code

Recommended fix:

- repair the local dependency install
- re-run lint/build/test in CI
- treat the current build failure as a release blocker

### 12. The project is still using deprecated `middleware` on Next 16

Files:

- `src/middleware.ts:1-42`
- local build output from `npm run build`

Why it matters:

- Next 16 warned: `The "middleware" file convention is deprecated. Please use "proxy" instead.`
- auth enforcement is therefore sitting on a framework-debt path

Recommended fix:

- migrate to the current `proxy` convention and re-check auth integration against Next 16 docs

### 13. Post-login redirect handling is not sanitized

Files:

- `src/middleware.ts:24-25`
- `src/app/admin/login/page.tsx:10-11`
- `src/app/admin/login/page.tsx:33`

Problem:

- login page reads `callbackUrl` from query params and pushes to it directly after login

Risk:

- possible open redirect or at least broken post-login navigation if an attacker injects an external or malformed `callbackUrl`

Recommended fix:

- only allow same-origin internal paths
- reject absolute URLs and dangerous schemes

### 14. Blog routing and draft handling are inconsistent

Files:

- `src/app/(site)/blog/page.tsx:17-45`
- `src/app/(site)/blog/[slug]/page.tsx:7-15`
- `src/app/sitemap.ts:38-51`

Problems:

- blog index marks some posts as `draft: true`
- those drafts still exist as real pages under static routes
- dynamic `[slug]` page returns a generic 200 page for any arbitrary slug instead of a 404
- sitemap excludes drafts, but routes still resolve

Practical impact:

- inconsistent SEO surface
- arbitrary low-quality pages can be indexed if linked
- "draft" is only a listing concern, not a routing concern

Recommended fix:

- use a real content registry
- return `notFound()` for unknown slugs
- gate draft pages consistently

### 15. Structured data is duplicated and contradictory

Files:

- `src/components/seo/OrganizationSchema.tsx:3-47`
- `src/app/(site)/about/page.tsx:43-87`
- `src/app/(site)/layout.tsx:13-17`
- `src/app/(site)/about/page.tsx:300`

Observed:

- the shared site layout already injects one `OrganizationSchema`
- the about page defines and injects a second, different `OrganizationSchema`

Differences include:

- different schema type
- different logo reference
- different `aggregateRating` values
- different review counts

Practical impact:

- search engines receive contradictory structured data for the same organization

Recommended fix:

- keep one authoritative organization schema component
- if the about page needs more data, extend the shared schema rather than duplicating it

### 16. Legal links and locale support are incomplete

Files:

- `src/config/navigation.ts:23-26`
- `src/config/site.ts:7-8`
- `src/app/(site)/es/page.tsx`

Observed:

- footer links point to `/imprint` and `/privacy`
- there are no corresponding routes under `src/app/`
- `siteConfig.locales` claims `['en', 'de', 'es']`
- there is no `/de` route and no `src/content/de/`
- `next-intl` is installed but unused

Practical impact:

- broken legal navigation
- partial/incomplete localization story
- unnecessary dependency weight and architecture confusion

### 17. Confirmation page is not authoritative

File:

- `src/app/(site)/book/confirmation/page.tsx:9-16`
- `src/app/(site)/book/confirmation/page.tsx:25-29`
- `src/app/(site)/book/confirmation/page.tsx:69-72`

Problem:

- the page renders booking success details directly from query params
- it does not fetch a verified booking record

Practical impact:

- anyone can open a fake success URL and see a convincing confirmation screen
- if `/api/checkout/confirm` fails or the DB write fails, the user can still see success

Recommended fix:

- redirect to a server-validated booking reference page keyed by a trusted token or booking id

### 18. Internal navigation and config are duplicated in several low-signal ways

Files:

- `src/components/ui/Button.tsx:52-57`
- `src/lib/stripe.ts:16-20`
- `src/components/booking/StripeProvider.tsx:7-12`
- `src/components/booking/BookingWidget.tsx:25-38`
- `src/components/booking/BookingWidget.tsx:47`
- `src/config/theme.ts:1-28`

Examples:

- `Button` renders internal links as raw `<a>` instead of Next `Link`
- `getStripePublishableKey()` exists but the client does not use it
- Stripe live/test mode is selected in two separate ways:
  - server: `STRIPE_LIVE`
  - client: `NEXT_PUBLIC_STRIPE_LIVE`
- `checkoutUrl` is passed into `BookingWidget` but never used
- `theme.ts` exists but theme values are separately defined in `globals.css`

These are not the highest-risk issues, but they are strong evidence of config drift.

### 19. Many reusable section components and content types appear to be dead or half-adopted

Files:

- `src/components/sections/index.ts:1-12`
- `src/components/sections/AboutCompany.tsx`
- `src/components/sections/Comparison.tsx`
- `src/components/sections/GuideVoice.tsx`
- `src/components/sections/HowToGet.tsx`
- `src/components/sections/Pricing.tsx`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/WhyBook.tsx`
- `src/components/sections/WhyVisit.tsx`
- `src/content/types.ts:216-234`
- `src/app/(site)/page.tsx:69-551`

Observed pattern:

- the repo contains a sizeable reusable section system
- the homepage and other pages still manually render much of the same structure inline
- content types model many sections that are not actually driving the pages

Practical impact:

- larger maintenance surface
- harder refactors
- repeated markup and copy drift
- more places for pricing/SEO/UX details to fall out of sync

## Notable Inconsistencies

These are separate from severity ranking because they affect trust and maintainability even when they are not immediate exploits.

### Price inconsistency

- marketing copy repeatedly says `EUR29`
- seed script creates `2900`
- fallback/test config uses `5900`

### Time-slot inconsistency

- static booking content ships two slots in `src/content/en/book.ts:171-185`
- fallback config only has one slot in `src/lib/tour-config.ts:23-25`

### Meeting-point inconsistency

- editable in DB config
- duplicated in:
  - `src/config/site.ts`
  - `src/lib/tour-config.ts`
  - `src/content/en/book.ts`
  - `src/components/seo/TourSchema.tsx`
  - `src/app/api/checkout/confirm/route.ts`

### Review-count inconsistency

- homepage displays `320+ reviews` in `src/app/(site)/page.tsx:106-121`
- shared organization schema emits `4363` reviews in `src/components/seo/OrganizationSchema.tsx:32-38`
- about-page schema emits `320` reviews in `src/app/(site)/about/page.tsx:64-71`

### Locale inconsistency

- config says `en`, `de`, `es`
- implementation is effectively `en` plus one custom `es` page

### Framework/docs inconsistency

- repo docs still describe "Next.js 14+" in `CLAUDE.md:5`
- actual app uses Next `16.2.3`
- framework also warns the current `middleware` convention is deprecated

## Security Posture Summary

### Stronger points

- passwords are hashed with bcrypt before storage in the admin create route
- webhook signature verification exists in `src/app/api/webhook/route.ts:23-28`
- session checks are present on admin routes
- auth errors are reasonably generic on login

### Weak points

- booking finalization trusts the client
- a repo script contains default admin credentials
- no obvious request throttling
- configuration drift undermines server-side enforcement
- authorization boundaries are too coarse on booking operations

## Architecture Assessment

### What is working

- simple and understandable App Router structure
- clear separation between public pages and admin pages
- Mongoose model layer is small and readable
- Stripe/Mongo/email integrations are isolated to a small number of files

### What is not working

- configuration is split across DB, content files, static config, scripts, schemas, and templates
- booking creation is implemented in three places:
  - public confirm route
  - webhook route
  - backfill script
- pages are much fatter than the documented architecture intends
- admin pages are largely client-only dashboards with mount-time fetching, which increases JS and weakens App Router advantages

## Redundancy Inventory

### Business constants duplicated

- price
- duration
- meeting point
- departure time
- review counts
- logo/schema details

### Booking persistence duplicated

- `src/app/api/checkout/confirm/route.ts`
- `src/app/api/webhook/route.ts`
- `scripts/backfill-bookings.ts`

### Auth checks duplicated

- middleware-level token checks
- per-route `auth()` checks
- repeated role logic in route handlers

### Stripe mode selection duplicated

- `src/lib/stripe.ts`
- `src/components/booking/StripeProvider.tsx`

### UI sections duplicated

- reusable section components exist
- homepage and language page still hand-roll much of the same patterns

### Documentation duplicated and stale

- `README.md` is still create-next-app boilerplate
- `CLAUDE.md` architecture rules no longer match the codebase

## Build/Test Health

### `npm run lint`

Status: failed

Key errors:

- `src/app/admin/(dashboard)/bookings/page.tsx`
- `src/app/admin/(dashboard)/users/page.tsx`
- `src/components/sections/ReviewSlider.tsx`

Warnings also show drift:

- unused imports
- unused props
- stale eslint-disable directives

### `npm test`

Status: failed before running tests

Root problem:

- missing/invalid native binding for `rolldown`

### `npm run build`

Status: failed

Root problems:

- missing `lightningcss` native binary
- deprecation warning for `middleware`

Conclusion:

- the repo is not in a release-ready local state even before application-level bugs are considered

## Priority Remediation Plan

### Phase 0: immediate

1. Disable or rewrite `POST /api/checkout/confirm` so it cannot create bookings or send emails without verified Stripe state.
2. Remove hardcoded admin credentials from `scripts/seed-admin.ts` and rotate any password that may have been used.
3. Restrict refund/cancel/status operations to clearly defined roles.
4. Standardize all booking and blackout dates to ISO.

### Phase 1: within days

1. Make Stripe webhook processing the only authoritative booking-finalization path.
2. Add request validation schemas to every route.
3. Enforce one active `TourConfig`.
4. Centralize tour config values and remove conflicting fallbacks/static copies.
5. Add abuse throttling for login and public booking endpoints.

### Phase 2: within 1-2 weeks

1. Add CSP and other security headers.
2. Migrate deprecated `middleware` to the Next 16-supported `proxy` approach.
3. Fix the local package install/build/test chain.
4. Replace query-param confirmation page with a server-validated confirmation page.
5. Clean up draft-blog routing and legal-route gaps.

### Phase 3: structural cleanup

1. Refactor large pages into the documented component/content architecture or update the docs to match reality.
2. Remove dead section components and unused dependencies such as `next-intl` and `framer-motion` if they are not actually part of the product plan.
3. Consolidate SEO schema generation into a single source.

## Suggested Target Design

If the site is going to keep the current stack, the safest medium-term shape is:

- one singleton `TourConfig`
- one authoritative booking-finalization path via Stripe webhook
- one normalized booking date format: ISO
- one source of business truth for price, meeting point, slots, and duration
- explicit RBAC for `admin` vs `staff`
- schema validation at route boundaries
- server-validated confirmation page

## Final Assessment

The website is salvageable without a full rewrite, but the booking flow should not be treated as trustworthy in its current form.

The main risk is not a single bug. It is the combination of:

- client-trusted booking finalization
- duplicated write paths
- duplicated config
- weak validation
- incomplete role boundaries

That combination means the app can drift into states that are both insecure and operationally hard to reason about.
