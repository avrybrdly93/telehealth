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
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030 Done. **BUG-005 Done (this
  session)** — site-wide internal navigation was 404ing in production; now fixed and deployed.
- **Last session**: 2026-08-02 (session 21) — claimed **BUG-005 (S1)** per prior session's
  "Tomorrow's Focus", ahead of milestone work. Root cause: Astro doesn't rewrite plain string
  `href`s for a non-root `base`. Added `src/lib/routes.ts#withBase()` (uses
  `import.meta.env.BASE_URL`, same pattern `BaseLayout.astro` already used for fonts/OG images) and
  routed every hardcoded internal `href` through it — `SiteHeader.astro` (logo, nav, mobile menu,
  Book button, plus its `isCurrent()` base/trailing-slash comparison), `SiteFooter.tsx` (nav +
  legal links), and all 11 page files, including `index.astro`'s `<Hero>` CTA props found mid-fix
  (same root cause, not in the original repro list). `tests/e2e/nav-audit.spec.ts`'s assertion was
  unanchored and had stayed green through this exact bug — replaced with a regex anchored to the
  real base+path, proved it actually catches the regression by temporarily stubbing `withBase()`
  back to identity (all 17 desktop cases failed as expected) before restoring the fix. While
  fixing, found the same root cause in 4 files' `PROVIDER_PHOTO_PLACEHOLDER` `<img src>` — filed
  as **BUG-006 (S3)** rather than expanding this session's diff (`withBase()` is documented for
  hrefs, not asset `src`s).
- **Build status**: green — lint/typecheck/format/`pnpm test` (90/90, unchanged)/`pnpm build` all
  pass. `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same desktop-only skips
  as every prior session) — `nav-audit.spec.ts` (UX-003) now genuinely verifies the fix with its
  anchored assertion, not just staying green. `lhci autorun` not re-run this session (no page
  markup/weight changed, only `href`/`src` attribute values); prior session's 17/17 pass stands as
  the last verified baseline — flagging this as unverified-this-session rather than assuming green.
- **Deployed**: confirmed — `deploy.yml` run 30743836704 (head `214a5a2`, the BUG-005 fix commits)
  completed with conclusion `success`; `ci.yml` run for the same commit also green. Live site's
  internal links now resolve under `/telehealth/...` correctly.

## Current Focus
Milestone M4 — SEO & Launch: BL-030 and BUG-005 both Done. BL-031 (structured data) is Ready and
can build on BL-030's canonical/OG groundwork. **BUG-006 (S3, provider-photo placeholder `<img
src>` missing base)** is filed but low severity — not urgent, can slot into any future session.
M3: BL-022 still In Progress, still gated on D-009 — do not re-attempt until DECISION_LOG.md shows
it resolved.

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
before touching it again. If still Proposed: BL-031 (structured data) is Ready and can use
BL-030's canonical/OG groundwork plus BL-015's grouped content model for FAQPage JSON-LD.
BUG-006 (S3, provider-photo placeholder `<img src>` missing base) is Ready and small — reasonable
to fold into whichever session picks up next, low urgency. BL-020 (booking flow) still needs a
grooming/split pass before it's startable (L→split); BL-021 depends on BL-020. BL-018 (flip
readability CI to blocking) stays Blocked on BL-032. Once BL-020/BL-021 ship `/book`, wire the
still-unwired `booking_step_view`/`booking_service_selected`/`booking_provider_selected`/
`booking_handoff` events from `src/lib/analytics.ts` into that flow — the schema and
`trackEvent()` are already there.

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
