---
title: Project Status
status: Active
authority: Project
owner: Engineering
dependencies:
  - BACKLOG.md
  - CHANGELOG.md
review_cycle: Every session
---

# Project Status

> Updated by the agent at the END of every session (EXECUTION_LOOP.md Phase 5). This file is the first thing every session reads. Keep it under 60 lines: current truth only — history lives in CHANGELOG.md.

## Snapshot
- **Phase**: M1/M2 done. M3 Booking & Contact — underway: **BL-035/036/037 Done** (sessions 28-30,
  `/book` Steps 1-3 complete); BL-021 Ready (deps satisfied); BL-022 In Progress (blocked on
  D-009). M4 SEO & Launch — underway: BL-030/BL-031/BL-018 Done; BL-032 Needs Human Review;
  BL-033 In Progress (blocked on D-012). BUG-005/006 Done.
- **Last session**: 2026-08-04 (session 30) — D-009/D-012 still Proposed (untouched); shipped
  **BL-037**: `/book` Step 3 (eligibility acknowledgments, FR-022/E-011) — three `Checkbox`
  acknowledgments (in CA / 18+ / not an emergency), each explaining itself inline when unchecked
  (`Checkbox`'s `error` prop widened `string`→`ReactNode` for a real FAQ link), Continue enabled
  once all three are checked; Step 2 gained its own Continue button. Closes BL-020's original
  acceptance criteria in full — new `tests/e2e/booking-flow.spec.ts` (10 cases) proves
  BOOK-02/03/04/05 end-to-end for the first time. Full detail (incl. the BOOK-02 "Step 4 entry
  point" judgment call and a Playwright hidden-radio testing nuance, not a site bug) in
  CHANGELOG.md session 30.
- **Build status**: typecheck/lint/format clean, build 21 pages, `pnpm test` **143/143** (+12),
  `pnpm exec playwright test` **272 passed**, 2 skipped (+10, no regressions). `lhci autorun`
  (live Chrome) against `/` and `/book/` only: zero assertion failures, `/book` JS ~66KB (<70KB
  budget). Not run: remaining 18 URLs' lhci, cross-browser beyond Chromium.
- **Deployed**: pushed directly to `main` at every commit this session (no branch workaround
  needed). `main`'s HEAD is this session's close-out commit. Not independently re-confirmed:
  `ci.yml`/`deploy.yml` actually firing (no Actions-API access here); the Google Rich Results Test
  against deployed BL-031 data; the `deploy.yml` `smoke` job (BL-033) on a real hosted runner —
  all carried forward.

## Current Focus
M3: **BL-035/036/037 Done** — `/book` Steps 1-3 ship, full back-chain + E-011 + crisis-strip
coverage proven end-to-end. **BL-021 is next** (S, Ready, deps BL-037 Done): vendor handoff Step 4
+ `buildBookingUrl` + mock-vendor e2e (BOOK-01). BL-022 stays In Progress, gated on D-009 — don't
re-attempt until DECISION_LOG.md shows it resolved. M4: BL-030/031/018 Done; BL-032 Needs Human
Review (Tier 3 clinical-content gate); BL-033 In Progress, gated on D-012.

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |
| BL-033 | D-012 (DECISION_LOG.md, Tier 3, Proposed) needs a human to pick a header-delivery mechanism (CDN/proxy in front of GitHub Pages, a hosting migration that also resolves D-009, or explicitly accept the gap as documented residual risk) and an uptime-monitor vendor. Once resolved: wire the chosen mechanism to deliver the still-missing `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS headers, stand up the monitor with alerting on `/` (and `/book`, now that it exists), then flip BL-033 to Done. CSP + Referrer-Policy meta tags, e2e coverage, and the homepage/sitemap smoke job are already shipped and tested. Do not re-attempt the vendor/platform pieces until D-012 changes. |

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview, and Accessibility Statement — Tier 3; `src/content/legal/*.md` are placeholder shells only (`reviewStatus: needs-human-review`), shipped by BL-016 |
| FAQ content | `/faq`'s 13 Q&As are AI-drafted per COPY_GUIDELINES.md and need clinical/practice review before publish (same Needs Human Review status as BL-012); cancellation-policy and payment-methods answers are placeholders pending the practice-constants item above |

## Tomorrow's Focus
BL-022/BL-033 stay In Progress until a human resolves D-009/D-012 respectively — check
DECISION_LOG.md's status on both first before touching either again. Run the Google Rich Results
Test against deployed `/`, `/providers/dr-md`, `/faq` to close out BL-031 (carried forward several
sessions). **BL-037 is Done (session 30) — start BL-021** (S, Ready, deps BL-037 Done): vendor
handoff Step 4 + `buildBookingUrl(selection)` + mock-vendor e2e (FR-023, ARCHITECTURE
§Extensibility, DATA_BOUNDARIES B2, BOOK-01). `BookingFlow`'s `currentStep` type is `1 | 2 | 3`
today — BL-021 widens it to include `4`, adds the `currentStep === 4` content block (selection
summary + "Continue to secure scheduling" per USER_FLOWS.md Flow 1 Step 4), and wires Step 3's
already-enabled "Continue" button's `onClick` to navigate there (currently none — see CHANGELOG.md
session 30 note 5). `booking_handoff` is still unwired — BL-021's job, with the DATA_BOUNDARIES
§Enforcement network assertion BOOK-01 requires. Also still unconfirmed: session 26's push
actually triggering `deploy.yml`/`ci.yml` (incl. `smoke`) green (no Actions-API access here).

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-08-02 (session 21)**: While fixing BUG-005 (routing every internal `href` through the new
  `withBase()` helper), found the same missing-`/telehealth`-base root cause in 4 files'
  `PROVIDER_PHOTO_PLACEHOLDER` `<img src>` (`providers/index.astro`, `providers/[slug].astro`,
  `about.astro`, `index.astro`) — confirmed 404ing in built `dist/providers/index.html` the same
  way BUG-005's hrefs were. Lower severity (S3): decorative placeholder with `alt=""`, a
  broken-image/professionalism issue, not a broken flow or a11y regression. Filed as **BUG-006**
  rather than expanding BUG-005's diff — `withBase()`'s doc comment scopes it to hrefs, not asset
  `src`s, and fixing both root causes in one session diff would blur the boundary between what
  BUG-005's acceptance criteria actually covered and what was opportunistically added.
