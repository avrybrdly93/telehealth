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
  Needs Human Review). M3 Booking & Contact — underway: **BL-035/BL-036 Done** (2026-08-04,
  sessions 28-29, `/book` Steps 1-2); BL-037 Ready (deps satisfied); BL-022 In Progress (blocked on
  D-009, human input); BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031/BL-018 Done; BL-032
  Needs Human Review. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-04 (session 29) — D-009/D-012 both still Proposed (checked first, per
  protocol), so BL-022/BL-033 stayed untouched; claimed and shipped **BL-036** in full: `/book`
  Step 2 (provider preference, FR-021) — `Card` `selectable` cards per `getCollection('providers')`
  entry plus an equal-weight "No preference" option, a pushState/popstate-backed step-navigation
  mechanism (Continue on Step 1, Back on Step 2, hardware back button — all one code path), and
  `booking_provider_selected` wired. Full detail, including two documented design decisions ("No
  preference" as an explicit selection value, not a delete-on-select; real browser history over
  local-only step state) in CHANGELOG.md session 29.
- **Build status**: `pnpm typecheck` (0 errors, same pre-existing 34 `z`-deprecated hints),
  `pnpm lint` (clean), `pnpm build` (21 pages), `pnpm test` (**131/131**, up from 122 — 9 new),
  `pnpm exec playwright test` (**262 passed**, 2 correctly skipped — same baseline as prior
  sessions). `lhci autorun` run live (Chrome at
  `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) against `/book/` and `/` only (not the full
  20-URL suite — unaffected routes, same partial-lhci pattern as prior sessions): both passed with
  zero assertion failures (`/book`'s JS transfer now ~67KB, still under the 70KB budget). **Not
  run**: the remaining 18 URLs' `lhci autorun` and any cross-browser check beyond Chromium (no
  Safari/Firefox in this environment).
- **Deployed**: confirmed this session that `main`'s HEAD is session 28's close-out commit
  (`e51ad3b`) — the prior "not yet merged to `main`" note was stale. `ci.yml`/`deploy.yml` both
  green against it. This session's own commits are on `claude/compassionate-rubin-4gmjdw` (this
  run's harness configuration again required a dedicated branch, not a direct push to `main`); a
  human or a future session with main-push authority should merge/fast-forward `main` from it.
  Still outstanding, carried forward again: the Google Rich Results Test against deployed BL-031
  structured data, and confirming the `deploy.yml` `smoke` job (BL-033, session 26) on a real
  hosted-runner run.

## Current Focus
Milestone M3 — Booking & Contact: **BL-035/BL-036 Done** — `/book` Steps 1-2 ship. **BL-037 is now
the next actionable item** (S, Ready, deps BL-036 Done): Step 3, eligibility acknowledgments. Then
BL-021 (vendor handoff, deps BL-037). BL-022 still In Progress, still gated on D-009 — do not
re-attempt until DECISION_LOG.md shows it resolved. M4 — SEO & Launch: BL-030/BL-031/BL-018 Done;
BL-032 Needs Human Review (code/tests done, clinical content review pending, Tier 3 hard gate per
CONTENT_STRATEGY.md); BL-033 In Progress (blocked on D-012, a human header-delivery-mechanism +
uptime-monitor-vendor decision).

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
First, a human needs to merge/fast-forward `main` from `claude/compassionate-rubin-4gmjdw` (see
"Deployed" above) — until that happens, `/book` Step 2 and this session's other changes aren't
live. BL-022 stays In Progress until a human resolves D-009; BL-033 stays In Progress until a human
resolves D-012 — check DECISION_LOG.md's status on both first before touching either again. Run
the Google Rich Results Test against the deployed `/`, `/providers/dr-md`, and `/faq` URLs once a
session's branch merges/deploys, to close out BL-031's acceptance criteria fully (still not done,
carried forward several sessions now). **BL-036 is Done (session 29) — start BL-037** (S, Ready,
deps BL-036 Done): Step 3, eligibility acknowledgments (FR-022, E-011) — three explicit checkboxes
(in CA at time of visit / 18+ / not an emergency), Continue disabled until all three are checked
with inline text explaining each unmet requirement (never a modal, E-011), a "not in CA" case
linking the FAQ answer about California-only care. `BookingFlow`'s `currentStep` type (currently
`1 | 2`) needs widening to `1 | 2 | 3`, `STEP_ANALYTICS_VALUE` extended, and a third
`currentStep === 3` block following the same pushState-forward/popstate-back pattern Step 2 already
established — no new state-persistence work needed (acknowledgment checkboxes are pure UI
validation state, not part of `BookingSelection`, since nothing about them needs to survive a
reload or appear in a deep link). Once BL-037 ships, BOOK-02/03/04/05 (the full 3-step back-chain,
E-011, and crisis-strip-on-every-step checks) become verifiable end-to-end for the first time —
worth a dedicated Playwright e2e spec at that point, not before (no single step's Vitest coverage
substitutes for a real cross-step navigation test). Then BL-021 (vendor handoff, deps BL-037).
`booking_step_view`/`booking_service_selected`/`booking_provider_selected` are already wired
(BL-035/036); `booking_handoff` is still unwired — BL-021's job. Also confirm session 26's push to
`main` actually triggered `deploy.yml`/`ci.yml` (including the `smoke` job) and both went green —
still not independently confirmed from this environment (no live-browser access to the deployed
GitHub Pages URL or the Actions API).

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
