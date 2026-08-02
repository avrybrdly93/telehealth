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
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030 Done. **BUG-005 and BUG-006 both
  Done** — site-wide internal navigation and the provider-photo placeholder were both 404ing in
  production on the `/telehealth` base; both now fixed and verified against a real build.
- **Last session**: 2026-08-02 (session 22) — claimed **BUG-006 (S3)** per session 21's
  "Tomorrow's Focus" (BL-022 still gated on D-009, still Proposed per DECISION_LOG.md — checked
  first, not re-attempted). Same root cause as BUG-005: `PROVIDER_PHOTO_PLACEHOLDER` was a
  hardcoded root-relative string in 4 files (`index.astro`, `about.astro`, `providers/index.astro`,
  `providers/[slug].astro`), missing the `/telehealth` base. Fixed by reusing `withBase()` directly
  (already imported in all 4 files for their hrefs) rather than adding a separate asset-path
  helper — broadened its doc comment to cover `img src` as well as `href` since the underlying
  behavior (prepend base to a root-relative internal path) is identical for both. Added
  `tests/e2e/provider-photo.spec.ts` asserting the built `<img src>` on all 4 pages against
  `playwright.config.ts`'s `BASE_URL`, both viewports.
- **Build status**: green — lint/typecheck/format/`pnpm test` (90/90, unchanged)/`pnpm build` all
  pass. `pnpm exec playwright test`: 148/150 passed, 2 correctly skipped (same desktop-only skips
  as every prior session) — the 8 new cases are the only count change from session 21's 140/142.
  `lhci autorun` not re-run this session (no page markup/weight changed, only one `src` attribute
  value per placeholder occurrence); prior session's baseline stands, flagged as
  unverified-this-session rather than assumed green.
- **Deployed**: not yet — this session's commits are pushed to `claude/modest-meitner-gi9xl3`
  (restarted from `main` at the start of this session, since session 21's branch had already been
  auto-merged) but not yet merged/deployed. Confirm `deploy.yml`/`ci.yml` both go green on the
  next auto-merge before assuming production reflects this fix.

## Current Focus
Milestone M4 — SEO & Launch: BL-030, BUG-005, and BUG-006 all Done. BL-031 (structured data) is
Ready — its Deps (BL-030 Done, BL-012/BL-015 Needs Human Review) mean the *content* isn't
finalized, but per session 21's guidance the schema work itself can build on BL-030's canonical/OG
groundwork and BL-015's grouped content model for FAQPage JSON-LD now. M3: BL-022 still In
Progress, still gated on D-009 — do not re-attempt until DECISION_LOG.md shows it resolved.

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
before touching it again. If still Proposed: BL-031 (structured data) is next — Ready, and can use
BL-030's canonical/OG groundwork plus BL-015's grouped content model for FAQPage JSON-LD (note its
Deps list BL-012/BL-015 as Needs Human Review, not Done — the schema/markup work doesn't need
final content, but don't publish/index anything gated on that content until it clears review).
BL-020 (booking flow) still needs a grooming/split pass before it's startable (L→split); BL-021
depends on BL-020. BL-018 (flip readability CI to blocking) stays Blocked on BL-032. Once
BL-020/BL-021 ship `/book`, wire the still-unwired `booking_step_view`/`booking_service_selected`/
`booking_provider_selected`/`booking_handoff` events from `src/lib/analytics.ts` into that flow —
the schema and `trackEvent()` are already there. Also confirm this session's `claude/modest-
meitner-gi9xl3` branch actually merged/deployed (`deploy.yml`/`ci.yml` green) before assuming
BUG-006's fix is live.

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
