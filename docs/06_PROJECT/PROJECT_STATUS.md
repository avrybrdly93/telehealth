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
  human input), BL-023 Done. M4 SEO & Launch — underway: **BL-030 and BL-031 both Done.** BUG-005
  and BUG-006 both Done.
- **Last session**: 2026-08-02 (session 23) — checked D-009 first (still Proposed, DECISION_LOG.md
  unchanged), so claimed **BL-031** (structured data) per session 21/22's "Tomorrow's Focus". Added
  `src/lib/structuredData.ts` (`buildMedicalBusinessSchema`/`buildPhysicianSchema`/
  `buildFaqPageSchema`/`serializeJsonLd`, pure + unit-tested) and wired all three: `MedicalBusiness`
  site-wide via `BaseLayout.astro` (no `address` field — LOCAL_SEARCH_STRATEGY.md prohibits fake
  address markup; `areaServed: California` instead); `Physician` on both provider bio pages
  (`jobTitle` sourced from `credential`/practice.ts rather than a hardcoded per-role string, so it
  stays accurate); `FAQPage` on `/faq` (all 13 Q&As, answers plain-texted via
  `readability.ts#stripMarkdownSyntax`). Confirmed via a real `pnpm build` that each script tag
  parses as valid JSON with the right `@type` and no stray placeholder beyond the site's existing
  `NEEDS_HUMAN_*` convention.
- **Build status**: green — lint/typecheck/format all clean (same pre-existing `z`-deprecated
  hints), `pnpm test` **94/94** (+4 new `structuredData.test.ts` cases, up from session 22's
  90/90), `pnpm build` (17 pages, clean). `pnpm exec playwright test`: 148/150 passed, 2 correctly
  skipped (same desktop-only skips as every prior session; unchanged from session 22). `lhci
  autorun` **re-run this session** (new `<script>` markup on every page, unlike session 22's
  src-attribute-only change): 17/17 URLs passed every budget assertion at `error` severity.
- **Deployed**: not yet — this session's commits are pushed to `claude/modest-meitner-u3yv13`
  (restarted from `main` at the start of this session, since session 22's branch had already been
  auto-merged) but not yet merged/deployed. Confirm `deploy.yml`/`ci.yml` both go green on the next
  auto-merge before assuming production reflects this fix. **Not run this session**: the actual
  Google Rich Results Test (external tool against a live URL) — needs this to deploy first; next
  session should run it against the deployed `/`, `/providers/dr-md`, and `/faq` URLs.

## Current Focus
Milestone M4 — SEO & Launch: BL-030, BL-031, BUG-005, and BUG-006 all Done. M3: BL-022 still In
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
before touching it again. Run the Google Rich Results Test against the deployed `/`,
`/providers/dr-md`, and `/faq` URLs once this session's branch merges/deploys, to close out
BL-031's acceptance criteria fully (code-level verification only done this session). If D-009 is
still Proposed: BL-032 (3 condition pages) and BL-033 (security headers + smoke tests) are both
Ready in M4 next. BL-020 (booking flow) still needs a grooming/split pass before it's startable
(L→split); BL-021 depends on BL-020. BL-018 (flip readability CI to blocking) stays Blocked on
BL-032. Once BL-020/BL-021 ship `/book`, wire the still-unwired `booking_step_view`/
`booking_service_selected`/`booking_provider_selected`/`booking_handoff` events from
`src/lib/analytics.ts` into that flow — the schema and `trackEvent()` are already there. Also
confirm this session's `claude/modest-meitner-u3yv13` branch actually merged/deployed
(`deploy.yml`/`ci.yml` green) before assuming BL-031's fix is live.

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
