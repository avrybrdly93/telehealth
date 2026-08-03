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
  Needs Human Review). M3 Booking & Contact — underway: BL-020 **Split** into BL-035/BL-036/BL-037
  (2026-08-03 session 27, all three `Ready`); BL-022 In Progress (blocked on D-009, human input);
  BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031/**BL-018 Done**; BL-032 Needs Human
  Review. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-03 (session 27) — checked D-009 and D-012 first (both still Proposed,
  unchanged), so BL-022/BL-033 stayed untouched; claimed **BL-020**'s grooming/split pass (the only
  `Ready` item, but explicitly sized "L→split at grooming" — too big for one session). Read
  USER_FLOWS.md Flow 1, FR-020/021/022/023, E-011, COMPONENT_LIBRARY.md's StepIndicator/
  CrisisResources/Card entries, PAGE_SPECIFICATIONS.md's `/book` spec, and ARCHITECTURE.md's
  Extensibility Commitments before splitting; no prior `L→split` precedent existed in
  BACKLOG.md/CHANGELOG.md, so this session set the pattern (row kept with status `Split`, pointing
  at its children, rather than deleted). Split along Flow 1's own step boundaries into **BL-035**
  (M — `/book` scaffold: island shell, state-persistence architecture, new `StepIndicator`
  component, `CrisisResources` wiring, Step 1/service-selection), **BL-036** (S — Step 2/provider
  preference, deps BL-035), **BL-037** (S — Step 3/acknowledgments + E-011 validation, deps
  BL-036, closes out original BL-020's BOOK-02/03/04/05 criteria). BL-021's Deps updated from
  BL-020 to BL-037. No booking-flow code written — pure grooming, per this session's scope.
- **Build status**: green on the checks this docs-only diff actually needed — `pnpm typecheck`
  (0 errors/0 warnings, same pre-existing 34 `z`-deprecated hints), `pnpm lint` (clean),
  `pnpm build` (20 pages, unchanged). Also ran once for extra confidence: `pnpm test` (97/97,
  unchanged), `check:readability` (16 passed/0 failed/2 skipped, unchanged),
  `pnpm exec playwright test` (**252 passed**, 2 correctly skipped — identical to session 26's
  baseline). **`lhci autorun` not completed/not claimed this session** — its Chrome healthcheck
  needed `CHROME_PATH` pointed at a manually-installed Playwright Chromium; the run was in
  progress (4/20 URLs done) when it was judged not worth continuing to wait on for a diff
  (BACKLOG.md/PROJECT_STATUS.md/CHANGELOG.md only) that cannot affect Lighthouse budgets, so it
  was killed rather than left unobserved. Last known-green lhci result remains session 26's
  (20/20 URLs, all budgets passed).
- **Deployed**: this session's commits are on `claude/modest-meitner-180u5v`, pushed directly to
  `main` per this repo's established convention (auto-merge-claude.yml). Still outstanding,
  carried forward again: the Google Rich Results Test against deployed BL-031 structured data, and
  confirming the `deploy.yml` `smoke` job (BL-033, session 26) on a real hosted-runner run.

## Current Focus
Milestone M3 — Booking & Contact: BL-020 **Split** (2026-08-03 session 27) into BL-035 (M, Ready,
deps BL-005 Done — the next actionable item), BL-036 (S, deps BL-035), BL-037 (S, deps BL-036);
BL-021's Deps now BL-037. BL-022 still In Progress, still gated on D-009 — do not re-attempt until
DECISION_LOG.md shows it resolved. M4 — SEO & Launch: BL-030/BL-031/BL-018 Done; BL-032 Needs
Human Review (code/tests done, clinical content review pending, Tier 3 hard gate per
CONTENT_STRATEGY.md); BL-033 In Progress (blocked on D-012, a human header-delivery-mechanism +
uptime-monitor-vendor decision).

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |
| BL-033 | D-012 (DECISION_LOG.md, Tier 3, Proposed) needs a human to pick a header-delivery mechanism (CDN/proxy in front of GitHub Pages, a hosting migration that also resolves D-009, or explicitly accept the gap as documented residual risk) and an uptime-monitor vendor. Once resolved: wire the chosen mechanism to deliver the still-missing `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS headers, stand up the monitor with alerting on `/` (and `/book` once it exists), then flip BL-033 to Done. CSP + Referrer-Policy meta tags, e2e coverage, and the homepage/sitemap smoke job are already shipped and tested. Do not re-attempt the vendor/platform pieces until D-012 changes. |

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
BL-022 stays In Progress until a human resolves D-009; BL-033 stays In Progress until a human
resolves D-012 — check DECISION_LOG.md's status on both first before touching either again. Run
the Google Rich Results Test against the deployed `/`, `/providers/dr-md`, and `/faq` URLs once a
session's branch merges/deploys, to close out BL-031's acceptance criteria fully (still not done,
carried forward several sessions now). **BL-020 is now split (session 27) — start BL-035** (Ready,
deps BL-005 Done): `/book` route + island shell + state-persistence architecture (URL params/
sessionStorage, UX-011) + new `StepIndicator` component + `CrisisResources` strip wiring + Step 1
(service selection, FR-020). Then BL-036 (Step 2, deps BL-035), BL-037 (Step 3, deps BL-036), then
BL-021 (vendor handoff, deps now BL-037). Once the full `/book` flow ships, wire the still-unwired
`booking_step_view`/`booking_service_selected`/`booking_provider_selected`/`booking_handoff`
events from `src/lib/analytics.ts` into it — the schema and `trackEvent()` are already there. Also
confirm session 26's push to `main` actually triggered `deploy.yml`/`ci.yml` (including the new
`smoke` job) and both went green — still not independently confirmed from this environment (no
live-browser access to the deployed GitHub Pages URL or the Actions API).

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
