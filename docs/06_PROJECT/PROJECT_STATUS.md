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
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031 Done; **BL-032 Needs Human
  Review (built + tested this session)**. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-03 (session 24) — checked D-009 first (still Proposed, DECISION_LOG.md
  unchanged), so per session 23's "Tomorrow's Focus" claimed **BL-032** (3 condition pages).
  Added `Breadcrumbs` (D-011, `src/components/Breadcrumbs`) — first component in the library, no
  new pattern: `.tsx`, no client hydration, same precedent as Hero/PricingTable. Expanded
  `src/content/conditions/{depression,anxiety,adhd}.md` from stub/disclaimer-only content to full
  draft copy per CONTENT_STRATEGY.md's Condition Page Standard (what it feels like, how care helps
  by category — no drug names — one NIMH-cited stat each, verified against nimh.nih.gov via
  WebSearch rather than invented); wired `relatedFaqSlugs` to real FAQ entries. Built
  `src/pages/conditions/[slug].astro` per PAGE_SPECIFICATIONS.md's `/conditions/[slug]` spec:
  breadcrumbs, overview, how-care-helps, a link to the matching service (astro-rendered through
  `withBase()`, not a raw markdown link — markdown body links would have repeated BUG-005's
  missing-base bug), related-FAQ links (pointed at `/faq`'s group anchors, since individual FAQ
  items have no anchor of their own), an inline `CrisisResources` strip on the depression page only
  (CONTENT_STRATEGY.md "esp. depression page"), and a Book CTA. Linked provider bios' "Conditions
  treated" list (previously plain text) through to these new pages. Registered all 3 routes in
  `SITE_ROUTES` (sitemap + e2e coverage) and `lighthouserc.cjs` (LHCI budget coverage).
- **Build status**: green — lint/typecheck/format all clean (same pre-existing `z`-deprecated
  hints), `pnpm test` **97/97** (+3 new `Breadcrumbs.test.tsx` cases, up from session 23's 94/94),
  `pnpm build` (23 pages, clean, up from 20). `pnpm exec playwright test` (both viewports): **172
  passed**, 2 correctly skipped (same desktop-only skips as every prior session). `lhci autorun`
  **re-run this session** (3 new routes): all 20 URLs passed every budget assertion. `pnpm run
  check:readability`: all 3 condition files now **pass** at grade <=8 after a simplification pass
  (adhd 13.8→7.9, anxiety 11.5→7.9, depression 10.4→7.7) — this also satisfies BL-018's acceptance
  criteria for these same files, though BL-018 itself wasn't touched this session (BL-032 was the
  one claimed task; flipping BL-018's CI severity is a separate, quick follow-on for next session).
- **Deployed**: not yet — this session's commits are pushed to `claude/modest-meitner-2xct39` (a
  pre-existing branch for this session, not restarted from `main` — session 23's
  `claude/modest-meitner-u3yv13` branch's merge status wasn't independently re-verified this
  session; if it's still open, its commits will already be in this branch's history via `main`).
  Confirm `deploy.yml`/`ci.yml` both go green on the next auto-merge before assuming production
  reflects this. **Not run this session**: session 23's outstanding Google Rich Results Test
  against the deployed BL-031 structured data — still pending, carried forward.

## Current Focus
Milestone M4 — SEO & Launch: BL-030/BL-031 Done; BL-032 Needs Human Review (code/tests done,
clinical content review pending, Tier 3 hard gate per CONTENT_STRATEGY.md). BL-018 now trivially
unblocked (its 3 target files pass readability) — good candidate for next session. M3: BL-022 still
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
