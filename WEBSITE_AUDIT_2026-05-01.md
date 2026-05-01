# Website Audit

Date: 2026-05-01
Last Revalidated: 2026-05-01 (pricing & caching update)
Project: `bot` / `sachsenhausentour.de`
Scope: unresolved security, architecture, redundancy, and inconsistency issues only

This version intentionally tracks open issues only. Resolved findings were removed from the detailed register so the document can be used as a live backlog rather than a historical changelog.

## Current Validation State

- `npm test`: passed (`73/73`)
- `npm run build`: passed
- `npm run lint`: passed with `9` warnings, `0` errors
- `npm audit --json`: `2` moderate vulnerabilities, both in the `next -> postcss` chain (`GHSA-qx2v-qp2m-jg93`)

## Open Issue Summary

### Critical

- No currently confirmed critical findings

### High

- slot capacity can still be oversold under concurrency
- server-side mutation validation is still too weak on several admin and booking write paths
- business configuration is still duplicated across DB-backed config, content, static config, scripts, and SEO output

### Medium

- booking finalization is still split across multiple write paths, and a replayed valid `paymentId` can still resend emails
- RBAC is inconsistent across `/admin` pages and `/api/admin/*` read routes
- date normalization is incomplete across booking, stats, admin UI, and content
- active `TourConfig` reads are still loosely defined
- there is no visible rate limiting or brute-force protection on login and public booking endpoints
- security headers are present, but the current CSP is still permissive
- post-login redirect handling is still unsanitized
- the public confirmation page is still not authoritative
- blog routing and draft handling are inconsistent
- structured data is duplicated and contradictory
- locale support and legal routes are incomplete
- the project still carries an open dependency advisory in `next` / `postcss`
- the app still relies on legacy `src/middleware.ts`

### Low

- architecture drift and dead or half-adopted section/content systems still increase maintenance cost and redundancy
- unused imports, props, and stale lint directives remain

## Open Findings

### 1. Slot capacity can still be oversold under concurrency

Files:

- `src/app/api/checkout/route.ts:63-87`

Current behavior:

- checkout checks remaining capacity by aggregating existing confirmed bookings
- if capacity is available, it creates a Stripe PaymentIntent
- no reservation is held and no atomic inventory update happens at payment-finalization time

Risk:

- two customers can pass the capacity check at the same time
- both can pay successfully
- the same slot can be sold beyond `maxGuestsPerSlot`

Recommendation:

- introduce a reservation model with expiry, or
- move to an atomic slot-inventory document, or
- enforce capacity again during final booking creation inside a transaction

### 2. Booking finalization is still split across multiple write paths

Files:

- `src/app/api/checkout/confirm/route.ts:135-230`
- `src/app/api/webhook/route.ts:13-77`
- `scripts/backfill-bookings.ts:23-69`

Current behavior:

- the public confirm route verifies Stripe, then upserts a booking and sends email
- the Stripe webhook also creates or updates bookings
- the backfill script contains a third booking-creation path

Open risk:

- business rules are duplicated across three separate implementations
- a replayed valid `paymentId` can still trigger customer and internal email again in the confirm route
- booking finalization is still not webhook-authoritative

Recommendation:

- make the webhook the only authoritative booking-finalization path
- use the client-facing confirm route only for UX follow-up if needed
- record email-sent state so a valid `paymentId` cannot resend confirmation indefinitely

### 3. Server-side mutation validation is still too weak

Files:

- `src/app/api/admin/tours/route.ts:19-28`
- `src/app/api/admin/tours/[id]/route.ts:27-45`
- `src/app/api/admin/users/[id]/route.ts:7-35`
- `src/app/api/admin/bookings/[id]/route.ts:33-109`
- `src/app/api/checkout/confirm/route.ts:182-203`

Current behavior:

- several routes still accept raw request bodies or raw update objects
- `findByIdAndUpdate()` / `findOneAndUpdate()` calls still omit `runValidators: true`
- there is no route-boundary schema layer such as Zod or Valibot

Risk:

- malformed blackout dates, bad roles, invalid slot payloads, or broken pricing data can still enter the database
- Mongoose schema guarantees are weaker on updates than they appear from the model definitions

Recommendation:

- validate every route body before touching Mongoose
- use explicit field whitelists everywhere
- add `runValidators: true` on update paths

### 4. RBAC is still inconsistent across `/admin` surfaces

Files:

- `src/middleware.ts:21-35`
- `src/app/admin/(dashboard)/layout.tsx:9-19`
- `src/components/admin/AdminSidebar.tsx:17-22`
- `src/app/api/admin/bookings/route.ts:6-45`
- `src/app/api/admin/bookings/[id]/route.ts:17-45`
- `src/app/api/admin/stats/route.ts:7-54`
- `src/app/api/admin/tours/route.ts:7-28`
- `src/app/api/admin/tours/[id]/route.ts:7-45`
- `src/app/api/admin/users/route.ts:7-67`

Current behavior:

- middleware only checks that a token exists for `/admin/*` and `/api/admin/*`
- the admin dashboard layout does not perform a server-side role gate
- some routes are admin-only, but several admin read endpoints accept any authenticated user
- the sidebar always exposes Bookings, Tours, and Users navigation

Risk:

- permissions are hard to reason about
- customer booking data is still broader than a strict least-privilege model would suggest
- the UI can lead users into mixed 200/403 behavior depending on the page and route

Recommendation:

- define a clear capability matrix for `admin` vs `staff`
- enforce it at both the edge layer and route layer
- hide navigation a role cannot use

### 5. Date handling is still inconsistent

Files:

- `src/components/booking/BookingWidget.tsx:79-86`
- `src/app/api/admin/stats/route.ts:15-32`
- `src/app/admin/(dashboard)/tours/page.tsx:263-276`

Current behavior:

- the booking widget now submits ISO dates
- dashboard stats still compute `today` using `toLocaleDateString('en-GB')`
- the tours admin UI still instructs operators to enter blackout dates as `DD/MM/YYYY`

Risk:

- bookings, blackout enforcement, and reporting are no longer speaking one consistent date format
- "today's bookings" can miscount when stored booking dates are ISO

Recommendation:

- normalize all persisted booking and blackout dates to ISO
- remove `DD/MM/YYYY` guidance from admin UI
- compute reporting dates using the same canonical format the booking system stores

### 6. Business configuration is partially centralized but still has residual duplication

Files:

- `src/lib/tour-config.ts:31-52` (canonical fallback config)
- `src/config/site.ts:1-23` (static site metadata — no longer carries price)
- `src/app/admin/(dashboard)/tours/page.tsx` (admin UI now edits pricing tiers, original price, discount badge)
- `scripts/seed-admin.ts:54-80`
- `src/components/sections/BookingSidebar.tsx:95-105` (now receives pricing via props, but still has prop defaults)
- `src/components/sections/VisitorInfo.tsx:19-26` (now receives pricing via props, but still has prop defaults)
- `src/components/seo/TourSchema.tsx:10-54` (now receives price via props)
- `src/app/api/checkout/confirm/route.ts:47-103`

Progress since last review:

- all page-level prices (homepage, tour, book, Spanish page, blog posts) now read from `getActiveTourConfig()` at render time
- `BookingSidebar`, `VisitorInfo`, `MobileBookingBar`, `TourSchema`, and `OrganizationSchema` all receive pricing via server-component props
- hardcoded `€29` removed from `site.ts` description, content files, and FAQ answers
- admin UI now has full pricing tier management (label, price, note, highlight) plus original price and discount badge fields
- all pages with DB reads marked `force-dynamic` to prevent stale static caching

Remaining risk:

- components still carry prop defaults (e.g. `pricePerPerson = 2900`) that could diverge from DB if a parent stops passing props
- `FALLBACK_CONFIG` in `tour-config.ts` is a second source of truth that only activates when DB is unreachable
- meeting point, duration, departure time, and transport assumptions still exist in multiple places outside pricing
- seed script still has its own defaults that may drift from `FALLBACK_CONFIG`

Recommendation:

- remove prop defaults from components — require explicit props or fail visibly
- keep `FALLBACK_CONFIG` but add a monitoring alert when it is used
- centralize non-pricing business data (meeting point, duration, transport) the same way pricing was centralized

### 7. Active `TourConfig` selection is still loosely defined

Files:

- `src/lib/tour-config.ts:59-64`
- `src/app/api/checkout/route.ts:24-27`
- `src/models/TourConfig.ts:74-94`

Current behavior:

- model hooks now try to deactivate other active configs on both `save` and `findOneAndUpdate`
- runtime reads still use `findOne({ active: true })`
- pages now use `force-dynamic` so every request gets a fresh DB read

Risk:

- application behavior still depends on "whichever active row is returned first" if data drift or race conditions create multiple active configs
- the singleton enforcement via hooks can be bypassed by direct MongoDB operations outside Mongoose

Recommendation:

- enforce a stronger singleton strategy
- consider a unique partial index or a dedicated singleton document

### 8. No visible brute-force or abuse controls exist on auth and public booking endpoints

Files:

- `src/lib/auth.ts:28-79`
- `src/app/admin/login/page.tsx:18-35`
- `src/app/api/checkout/route.ts:12-117`
- `src/app/api/checkout/confirm/route.ts:135-230`

Current behavior:

- no visible login throttling
- no visible route rate limiting
- the confirm route is public and still sends email

Risk:

- admin credentials can be brute-forced
- checkout and confirm routes can be spammed
- SMTP side effects can be abused

Recommendation:

- add IP-based and route-based throttling
- add login cooldowns or captcha after repeated failures
- remove email side effects from public client-triggered paths

### 9. Security headers exist, but the CSP is still too permissive

File:

- `next.config.ts:3-45`

Current behavior:

- baseline headers are now configured
- the CSP still includes:
  - `script-src 'unsafe-inline' 'unsafe-eval'`
  - `img-src https: http:`

Risk:

- hardening is better than before, but still looser than it should be for a production booking flow

Recommendation:

- tighten CSP for production
- remove `unsafe-eval` if not required
- remove `http:` from `img-src`
- add an explicit `frame-ancestors` policy in CSP

### 10. Post-login redirect handling is still not sanitized

Files:

- `src/middleware.ts:24-25`
- `src/app/admin/login/page.tsx:10-11`
- `src/app/admin/login/page.tsx:33`

Current behavior:

- the login page reads `callbackUrl` from query params and pushes to it directly

Risk:

- malformed or attacker-controlled callback values can still produce broken or unsafe post-login navigation

Recommendation:

- only allow same-origin internal paths
- reject absolute URLs and dangerous schemes

### 11. The public confirmation page is still not authoritative

Files:

- `src/app/(site)/book/confirmation/page.tsx:9-16`
- `src/app/(site)/book/confirmation/page.tsx:25-72`
- `src/components/booking/CheckoutForm.tsx:87-95`

Current behavior:

- the confirmation page renders booking details from query parameters
- it does not fetch a verified booking record

Risk:

- anyone can construct a convincing fake success URL
- users can see success even if booking persistence or email delivery failed

Recommendation:

- replace query-param rendering with a server-validated booking reference page

### 12. Blog routing and draft handling are still inconsistent

Files:

- `src/app/(site)/blog/page.tsx:17-45`
- `src/app/(site)/blog/[slug]/page.tsx:7-15`

Current behavior:

- the blog index marks some posts as draft
- those posts still exist as real routed pages
- the dynamic `[slug]` page returns a generic 200 placeholder for arbitrary slugs instead of `notFound()`

Risk:

- low-quality or placeholder pages can be indexed
- draft status is only a listing concept, not a routing rule

Recommendation:

- use one content registry
- route only known published slugs
- return `notFound()` for unknown or draft slugs

### 13. Structured data is still duplicated and contradictory

Files:

- `src/components/seo/OrganizationSchema.tsx:11-48`
- `src/app/(site)/layout.tsx:12-20`
- `src/app/(site)/about/page.tsx:43-92`

Current behavior:

- the shared site layout injects one organization schema
- the about page injects a second, different organization schema
- review counts and schema details still disagree

Risk:

- search engines receive contradictory organization data

Recommendation:

- keep one authoritative organization schema generator
- extend it where needed instead of duplicating it per page

### 14. Locale support and legal routes are still incomplete

Files:

- `src/config/site.ts:7-8`
- `src/app/(site)/es/page.tsx`
- `src/config/navigation.ts`

Current behavior:

- config still advertises `en`, `de`, and `es`
- there is no `/de` route
- the app still only has one custom Spanish page rather than a coherent i18n structure
- legal navigation still points to incomplete or missing routes

Risk:

- broken or misleading navigation
- incomplete internationalization surface
- confusing architecture because config promises more than the app implements

Recommendation:

- either implement the supported locales and legal routes fully, or remove them from config and navigation

### 15. Dependency advisories remain open

Evidence:

- `npm audit --json`

Current state:

- `2` moderate vulnerabilities are still reported
- affected chain: `next -> postcss`
- advisory: `GHSA-qx2v-qp2m-jg93`

Risk:

- dependency security posture is not fully clean even though app-level tests and builds pass

Recommendation:

- review the advisory against the actual deployment/runtime exposure
- update dependencies once a safe and credible upgrade path is confirmed

### 16. The app still relies on legacy `src/middleware.ts`

Files:

- `src/middleware.ts:1-42`

Current state:

- the build passes, but the repo still uses the legacy middleware entrypoint rather than the current Next 16 direction

Risk:

- auth and routing control are sitting on framework debt
- future upgrades are more likely to produce friction in exactly the request path that guards admin access

Recommendation:

- migrate the edge/auth gate to the current supported approach and revalidate behavior afterward

### 17. Architecture drift and dead or half-adopted section/content systems still increase redundancy

Files:

- `src/app/(site)/page.tsx`
- `src/app/(site)/about/page.tsx`
- `src/app/(site)/es/page.tsx`
- `src/components/sections/index.ts`
- `src/components/sections/AboutCompany.tsx`
- `src/components/sections/Comparison.tsx`
- `src/components/sections/GuideVoice.tsx`
- `src/components/sections/HowToGet.tsx`
- `src/components/sections/Pricing.tsx`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/WhyBook.tsx`
- `src/components/sections/WhyVisit.tsx`
- `src/content/types.ts`

Current behavior:

- large pages still inline a lot of structure and copy
- the repo also contains a reusable section/content system that is only partially adopted

Risk:

- more redundancy
- more copy drift
- harder refactors and lower confidence when changing business details

Recommendation:

- either refactor pages to the documented component/content model, or simplify the repo by removing the half-adopted abstraction layer

## Notable Open Inconsistencies

### Transport inclusion conflict

- `src/components/sections/VisitorInfo.tsx:115-117` says the guided tour price includes the round-trip S-Bahn journey
- `src/content/en/home.ts:347-348` says a separate ABC ticket is required and is not included
- `src/app/(site)/tour/page.tsx:81-83` also tells visitors to bring a valid transit ticket

### Review-count conflict

- homepage UI presents one review volume
- shared organization schema presents another
- the about-page schema presents a third

### Locale conflict

- config advertises `de`
- the app does not implement `/de`

### Source-of-truth conflict (partially resolved)

- pricing now flows from MongoDB through `getActiveTourConfig()` to all pages and SEO schemas
- admin UI can edit pricing tiers, original price, and discount badge
- however, component prop defaults and `FALLBACK_CONFIG` still create secondary sources
- non-pricing business data (meeting point, duration, transport) still has no single owner

## Priority Remediation Plan

### Phase 0: immediate

1. Make capacity enforcement atomic.
2. Add route-level schemas and `runValidators: true` on update paths.
3. Stop replayed valid `paymentId` calls from resending customer/internal email.
4. Sanitize `callbackUrl`.
5. Finish ISO normalization in stats and admin date editing.

### Phase 1: within days

1. Make Stripe webhook processing the only authoritative booking-finalization path.
2. Define and enforce explicit `admin` vs `staff` permissions.
3. ~~Centralize business config so booking, admin, SEO, and content read the same values.~~ **Partially done** — pricing now centralized via `getActiveTourConfig()` + admin UI; non-pricing config (meeting point, duration, transport) still duplicated.
4. Add login and public-endpoint rate limiting.
5. Replace the query-param confirmation page with a verified server-side confirmation flow.

### Phase 2: within 1-2 weeks

1. Tighten CSP and remove unnecessary permissive directives.
2. Resolve the `next` / `postcss` advisory with a credible upgrade plan.
3. Clean up blog draft routing and placeholder slug handling.
4. Finish legal-route and locale decisions.
5. Migrate legacy `src/middleware.ts` to the current supported edge/proxy model.

### Phase 3: structural cleanup

1. Remove dead or half-adopted section/content abstractions, or fully adopt them.
2. Consolidate SEO schema generation into one source.
3. Remove unused props, imports, config objects, and stale lint suppressions.

## Final Assessment

The codebase is in a much healthier build/test state than before. Pricing is now centralized: all pages read from MongoDB via `getActiveTourConfig()`, the admin panel supports full pricing tier management, and `force-dynamic` ensures prices are never stale-cached. The remaining issues are still clustered around trust boundaries and non-pricing source-of-truth problems.

The highest operational risk is still the combination of:

- non-atomic slot capacity enforcement
- duplicated booking-finalization paths
- weak mutation validation
- inconsistent RBAC
- residual business config duplication (non-pricing fields)

As long as those stay open, the app can still move into states that are valid enough to compile and pass tests, but unreliable enough to create booking errors, incorrect reporting, misleading content, or customer-support incidents.
