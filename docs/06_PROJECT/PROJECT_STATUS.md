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
  Needs Human Review). M3 Booking & Contact — underway: BL-022 In Progress (blocked on D-009,
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031/**BL-018 Done**; BL-032
  Needs Human Review. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-03 (session 25) — checked D-009 first (still Proposed, unchanged), so
  per session 24's "Tomorrow's Focus" claimed **BL-018** (flip readability CI to blocking): its dep
  BL-032 already drafted `conditions/{depression,anxiety,adhd}.md` passing grade <=8, so this was a
  CI-config-only change, no content edit. Confirmed locally that all 3 files still pass, then
  removed `continue-on-error: true` from `ci.yml`'s readability step and updated its now-stale
  D-008 non-blocking-rationale comment.
- **Build status**: green — lint/typecheck/format all clean (same pre-existing `z`-deprecated
  hints), `pnpm test` **97/97**, `pnpm build` (20 pages, clean). `check:readability` (now
  **blocking** in CI): 16 passed, 0 failed, 2 skipped (placeholder provider bios) — exit 0.
  `pnpm exec playwright test` (both viewports): **172 passed**, 2 correctly skipped (same
  desktop-only skips as every prior session). `lhci autorun`: all 20 URLs passed every budget
  assertion. No app code changed this session — CI workflow + docs only.
- **Deployed**: not yet — this session's one commit is pushed to `claude/compassionate-rubin-yfmpy7`
  (a pre-existing branch for this session; its prior history was already in `main` per this
  session's Phase 1 fetch, i.e. it had no unmerged commits carried over). Confirm
  `deploy.yml`/`ci.yml` both go green on the next auto-merge — this is the first push against the
  now-blocking readability step, so also confirm `ci.yml` doesn't unexpectedly fail there. Still
  outstanding, carried forward again: the Google Rich Results Test against deployed BL-031
  structured data.

## Current Focus
Milestone M4 — SEO & Launch: BL-030/BL-031/BL-018 Done; BL-032 Needs Human Review (code/tests
done, clinical content review pending, Tier 3 hard gate per CONTENT_STRATEGY.md). M3: BL-022 still
In Progress, still gated on D-009 — do not re-attempt until DECISION_LOG.md shows it resolved.

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |

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
BL-022 stays In Progress until a human resolves D-009 — check DECISION_LOG.md's status first
before touching it again. Run the Google Rich Results Test against the deployed `/`,
`/providers/dr-md`, and `/faq` URLs once a session's branch merges/deploys, to close out BL-031's
acceptance criteria fully (still not done, carried forward several sessions now). If D-009 is still
Proposed: BL-033 (security headers + smoke tests + uptime monitoring) is Ready in M4 next — deps
(BL-006) Done, no grooming needed. BL-020 (booking flow) still needs a grooming/split pass before
it's startable (L→split); BL-021 depends on BL-020. Once BL-020/BL-021 ship `/book`, wire the
still-unwired `booking_step_view`/`booking_service_selected`/`booking_provider_selected`/
`booking_handoff` events from `src/lib/analytics.ts` into that flow — the schema and `trackEvent()`
are already there. Also confirm this session's `claude/compassionate-rubin-yfmpy7` branch actually
merged/deployed (`deploy.yml`/`ci.yml` green, readability step included) before assuming BL-018's
fix is live.

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
