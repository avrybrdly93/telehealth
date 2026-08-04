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
- **Phase**: M1 Foundation — done (BL-001–BL-007). M2 Content Pages — done (BL-012/BL-015 content
  Needs Human Review). M3 Booking & Contact — underway: **BL-035 Done** (2026-08-04 session 28,
  `/book` Step 1); BL-036/BL-037 Ready (deps satisfied); BL-022 In Progress (blocked on D-009,
  human input); BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031/BL-018 Done; BL-032 Needs
  Human Review. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-04 (session 28) — D-009/D-012 both still Proposed (checked first, per
  protocol), so BL-022/BL-033 stayed untouched; claimed and shipped **BL-035** in full. Recorded
  **D-013** (DECISION_LOG.md): `BaseLayout` `chrome="minimal"` variant for `/book`'s reduced-chrome
  spec; `BookingFlow` as this codebase's first hydrated React island (`client:load`, within the
  `/book`-specific 70KB JS budget); `lib/booking-state.ts`'s `BookingSelection` shape as the
  contract BL-036/037/021 build against. Built `StepIndicator` (COMPONENT_LIBRARY.md entry, 6
  tests) and `BookingFlow` (Step 1: service selection via `Card` `selectable`, eligibility summary,
  `CrisisResources` strip + phone alternative, E-050 no-JS fallback; 7 tests) plus
  `booking-state.ts` (12 tests). Found and fixed two real bugs before considering this done: (1)
  `StepIndicator` rendered a literal `"undefined"` CSS class on non-current dots (added a
  regression test); (2) the initial `<noscript>` fallback duplicated the already-SSR'd
  `CrisisResources` strip and falsely claimed the island "renders nothing" without JS — Astro
  server-renders island markup regardless of `client:*`, so a no-JS visitor already sees real Step
  1 content; corrected the copy and DECISION_LOG.md/COMPONENT_LIBRARY.md's descriptions to match.
  Adding `/book` to `SITE_ROUTES` broke two generic e2e checks that assumed every route has a full
  footer/nav (GLOBAL-02, UX-003) — both got documented, deliberate `/book` exceptions (its minimal
  chrome has no footer nav by design) rather than silent skips.
- **Build status**: `pnpm typecheck` (0 errors, same pre-existing 34 `z`-deprecated hints),
  `pnpm lint` (clean), `pnpm build` (21 pages incl. `/book`), `pnpm test` (**122/122**, up from 97 —
  24 new tests), `pnpm exec playwright test` (**262 passed**, 2 correctly skipped — same baseline
  as prior sessions plus new `/book` coverage). `lhci autorun` run live this session (Chrome at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) against `/book/` and `/` only (not the full
  20-URL suite, to keep runtime reasonable) using a new `assertMatrix` in `lighthouserc.cjs` that
  gives `/book` its own PERFORMANCE_BUDGET.md "islands" budgets (70KB JS/100KB image/300KB total)
  instead of the content-page ones (15KB/350KB/500KB) — both URLs passed with zero assertion
  failures. **Not run**: the remaining 18 URLs' `lhci autorun` (unaffected by this session's diff,
  same as several prior sessions' partial-lhci pattern) and any cross-browser check beyond
  Chromium — this environment has no Safari/Firefox available.
- **Deployed**: this session's commits are on `claude/modest-meitner-7nlrox`, **not yet merged to
  `main`** — this run's harness configuration required committing to a dedicated branch rather
  than pushing directly to `main` (a deviation from this repo's normal convention, `claude.md`'s
  "commit and push directly to main"); a human or a future session with main-push authority should
  merge/fast-forward `main` from this branch. Still outstanding, carried forward again: the Google
  Rich Results Test against deployed BL-031 structured data, and confirming the `deploy.yml`
  `smoke` job (BL-033, session 26) on a real hosted-runner run.

## Current Focus
Milestone M3 — Booking & Contact: **BL-035 Done** (2026-08-04 session 28) — `/book` Step 1 ships.
**BL-036 is now the next actionable item** (S, Ready, deps BL-035 Done): Step 2/provider
preference. Then BL-037 (Step 3, deps BL-036), then BL-021 (vendor handoff, deps BL-037). BL-022
still In Progress, still gated on D-009 — do not re-attempt until DECISION_LOG.md shows it
resolved. M4 — SEO & Launch: BL-030/BL-031/BL-018 Done; BL-032 Needs Human Review (code/tests done,
clinical content review pending, Tier 3 hard gate per CONTENT_STRATEGY.md); BL-033 In Progress
(blocked on D-012, a human header-delivery-mechanism + uptime-monitor-vendor decision).

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
First, a human needs to merge/fast-forward `main` from `claude/modest-meitner-7nlrox` (see
"Deployed" above) — until that happens, `/book` and this session's other changes aren't live.
BL-022 stays In Progress until a human resolves D-009; BL-033 stays In Progress until a human
resolves D-012 — check DECISION_LOG.md's status on both first before touching either again. Run
the Google Rich Results Test against the deployed `/`, `/providers/dr-md`, and `/faq` URLs once a
session's branch merges/deploys, to close out BL-031's acceptance criteria fully (still not done,
carried forward several sessions now). **BL-035 is Done (session 28) — start BL-036** (S, Ready,
deps BL-035 Done): Step 2/provider preference — cards for Dr. [MD]/[PMHNP] plus an equal-weight
"No preference" default, reusing `BookingFlow`'s state pattern and `lib/booking-state.ts`'s
`provider` field (already in the `BookingSelection` shape). Then BL-037 (Step 3, deps BL-036),
then BL-021 (vendor handoff, deps BL-037). `booking_step_view`/`booking_service_selected` are
already wired (BL-035); `booking_provider_selected`/`booking_handoff` are still unwired — BL-036/
BL-021's job respectively. Also confirm session 26's push to `main` actually triggered
`deploy.yml`/`ci.yml` (including the `smoke` job) and both went green — still not independently
confirmed from this environment (no live-browser access to the deployed GitHub Pages URL or the
Actions API).

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
