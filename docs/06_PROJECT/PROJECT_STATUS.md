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
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030 Done (this session).
- **Last session**: 2026-08-02 (session 20) — D-009 checked, still Proposed, so per prior
  "Tomorrow's Focus" claimed BL-030 (metadata system, sitemap, robots, canonicals, OG images)
  instead of re-attempting BL-022. Tried `@astrojs/sitemap` first, then removed it mid-session —
  a new runtime dependency is Tier 3 (DECISION_FRAMEWORK.md), not something to add without human
  approval — and hand-rolled `src/pages/sitemap.xml.ts` instead (over a new shared
  `src/lib/routes.ts#SITE_ROUTES`, no new dependency); `public/robots.txt` added;
  `BaseLayout.astro` now emits `<link rel="canonical">` and full OG/Twitter tags per page from the
  `title`/`description` props every page already passes (no per-page changes needed); one
  self-hosted default OG image (`public/images/og-default.jpg`, 1200×630, 45KB, real homepage
  copy — IMAGE_GUIDELINES.md's per-page-dynamic OG image is not implemented, judged out of
  BL-030's acceptance criteria, not a silent gap). While verifying canonical URLs, found and filed
  **BUG-005 (S1)** — see Weekly Review Findings — a real production bug, not fixed this session
  per scope discipline.
- **Build status**: green — lint/typecheck/format/`pnpm test` (90/90, unchanged)/`pnpm build` all
  pass. `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same desktop-only skips
  as every prior session) — includes `nav-audit.spec.ts` (UX-003), which passes despite BUG-005
  because its URL assertion is unanchored (see BUG-005). `lhci autorun` not re-run this session
  (no page markup/weight changed beyond the new self-hosted OG image, which isn't render-blocking
  or in any budgeted resource-summary category); prior session's 17/17 pass stands as the last
  verified baseline — flagging this as unverified-this-session rather than assuming green.
- **Deployed**: not yet pushed this session — see commits below once pushed; will confirm via
  `git fetch`/Actions API in the close-out commit.

## Current Focus
Milestone M4 — SEO & Launch: BL-030 Done. BL-031 (structured data) is next and can now build on
BL-030's canonical/OG groundwork. **BUG-005 (S1, site-wide broken internal navigation)** was filed
this session and should be the next session's claimed item regardless of milestone — see Weekly
Review Findings and BACKLOG.md. M3: BL-022 still In Progress, still gated on D-009 — do not
re-attempt until DECISION_LOG.md shows it resolved.

## In Progress
| Item | Next step |
|---|---|
| BUG-005 | Claimed session 21 (2026-08-02) per this file's own "Tomorrow's Focus". Fixing: add `withBase()` helper to `src/lib/routes.ts` (uses `import.meta.env.BASE_URL`, same pattern `BaseLayout.astro` already uses); route every hardcoded internal `href` in the 13 affected source files through it; fix `SiteHeader.astro`'s `isCurrent()` base/trailing-slash mismatch; replace `nav-audit.spec.ts`'s unanchored URL regex with a real anchored assertion. |
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
**Claim BUG-005 first** (S1, filed this session) — every internal `href` site-wide drops the
`/telehealth` base and 404s on production; see BACKLOG.md for the full repro and fix acceptance
criteria. After that: BL-022 stays In Progress until a human resolves D-009 — check
DECISION_LOG.md's status first before touching it again. If still Proposed: BL-031 (structured
data) is Ready and can use BL-030's new canonical/OG groundwork plus BL-015's grouped content
model for FAQPage JSON-LD. BL-020 (booking flow) still needs a grooming/split pass before it's
startable (L→split); BL-021 depends on BL-020. BL-018 (flip readability CI to blocking) stays
Blocked on BL-032. Once BL-020/BL-021 ship `/book`, wire the still-unwired `booking_step_view`/
`booking_service_selected`/`booking_provider_selected`/`booking_handoff` events from
`src/lib/analytics.ts` into that flow — the schema and `trackEvent()` are already there.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-08-02 (session 20)**: While adding canonical URLs for BL-030, found and filed **BUG-005
  (S1)**: every hardcoded internal `href` site-wide (SiteHeader nav/logo/Book button, SiteFooter,
  and every page's CTAs/cross-links — 13 source files) is root-relative with no `/telehealth`
  base prefix, so on the live GitHub Pages deployment clicking any in-app link 404s (confirmed
  live against `pnpm preview`: `href="/pricing"` click lands on `/pricing`, not
  `/telehealth/pricing`). Same root cause also silently breaks `SiteHeader`'s `aria-current="page"`
  in production. `tests/e2e/nav-audit.spec.ts` (UX-003) didn't catch this — its
  `toHaveURL(/\/pricing\/?(?:[?#]|$)/)` assertion is unanchored and matches the base-dropped URL
  too. Not fixed this session per scope discipline (one claimed item — BL-030 — per session); see
  BACKLOG.md BUG-005 for full repro and fix acceptance criteria. Recommend this as the next
  session's claimed item given S1 severity (BUG_TEMPLATE.md: "fix immediately, interrupt any
  session") — this session judged the fix (shared href-base helper across ~13 files + a real
  anchored e2e assertion) too large to safely fold into BL-030's diff without its own
  checkpointed session, so it's filed rather than rushed.
