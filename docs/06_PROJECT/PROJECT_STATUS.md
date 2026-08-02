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
  human input), BL-023 Done (this session).
- **Last session**: 2026-08-01 (session 19) — BL-022 stayed In Progress: D-009 (hosting
  platform + email vendor, Tier 3) is still Proposed, unresolved by a human, so per this file's
  own prior "Tomorrow's Focus" the session did not re-attempt the backend and picked BL-023
  (Analytics wrapper) instead. Built `src/lib/analytics.ts`: a single wrapper module implementing
  ANALYTICS_PLAN.md's full event schema, with `trackEvent()` runtime-enforcing the property
  allowlist per event (drops anything not on the schema even past a forced TS cast) and
  stripping query strings from route-shaped properties (DATA_BOUNDARIES.md Boundary 4). Wired
  `pageview`/`cta_book_click`/`crisis_resource_click` globally via a new `BaseLayout.astro`
  bootstrap script (`src/lib/analytics.client.ts`, delegated click listener, `data-cta-position`
  tags added to the SiteHeader/Hero Book buttons) and `contact_submit_success`/
  `contact_submit_error`/`error_view` into `ContactForm.client.ts`'s existing success/failure
  handlers — the honeypot spam-trap path deliberately does not fire `contact_submit_success`
  since it isn't a real Flow 2 outcome. `booking_*` events are defined in the schema but unwired:
  `/book` (BL-020/BL-021) doesn't exist yet. No analytics vendor is configured on this deployment
  (DEMO/PROTOTYPE, no real credentials) — the default transport is an honest no-op, same
  documented-gap pattern D-009/`/api/contact` uses; `setAnalyticsTransport()` is the seam for a
  real provider later, `setAnalyticsConsent()` the seam for a future consent manager
  (ARCHITECTURE.md's extensibility commitment) — neither needed this session per D-002 (cookieless
  aggregate analytics needs no consent banner).
- **Build status**: green — lint/typecheck/format/`pnpm test` (90/90, +8)/`pnpm build` all pass.
  `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same desktop-only skips as
  every prior session). `pnpm exec lhci autorun`: 17/17 URLs pass every budget assertion at
  `error` severity — `resource-summary:script:size` on content pages rose from prior sessions'
  baseline to 2.10KB (15KB budget, ample headroom), `/contact` (which also loads ContactForm's
  own script) to 3.91KB; document/total sizes unaffected (analytics wrapper carries no markup).
- **Deployed**: not yet pushed this session — see commits below once pushed; will confirm via
  `git fetch`/Actions API in the close-out commit.

## Current Focus
Milestone M3 — Booking & Contact: BL-022 still In Progress, still gated on D-009 (a human
hosting/email-vendor decision) — do not re-attempt until DECISION_LOG.md shows it resolved.
BL-023 (Analytics wrapper) is Done. BL-020/BL-021 still Ready (BL-020 needs a grooming/split pass
first) — next pickup for a following session if D-009 is still unresolved.

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and now client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |
| BL-030 | D-009 checked, still Proposed, so per prior "Tomorrow's Focus" claimed BL-030 (metadata/sitemap/robots/OG) instead — Ready, unblocked (BL-010 Done). In progress this session. |

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
BL-022 stays In Progress until a human resolves D-009 (hosting platform + email vendor) — check
DECISION_LOG.md's status first before touching it again. If still Proposed: BL-020 (booking flow)
still needs a grooming/split pass before it's startable (L→split); BL-021 depends on BL-020.
BL-030 (metadata/sitemap/robots/OG, M4) is Ready and unblocked (BL-010 Done) — a reasonable next
pickup. BL-031 (structured data) can use BL-015's grouped content model for FAQPage JSON-LD once
BL-030 lands. BL-018 (flip readability CI to blocking) stays Blocked on BL-032. Once BL-020/BL-021
ship `/book`, wire the still-unwired `booking_step_view`/`booking_service_selected`/
`booking_provider_selected`/`booking_handoff` events from `src/lib/analytics.ts` into that flow —
the schema and `trackEvent()` are already there, no wrapper changes expected.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-08-01 (session 18)**: While claiming BL-022, found ARCHITECTURE.md/TECH_STACK.md describe
  the contact form's backend as a serverless function hosted on "Netlify or Vercel (pick once at
  project start, record Tier 2 decision)" — but `DECISION_LOG.md` has no such entry, and the site
  is actually deployed static-only to GitHub Pages (`astro.config.mjs`'s `output: 'static'`,
  `.github/workflows/deploy.yml`, BUG-001/002/004), a host with no serverless-function runtime.
  Filed as D-009 (Tier 3, Proposed) rather than guessing a platform or building an unverifiable
  integration; per DECISION_FRAMEWORK.md, Tier 3 items block only themselves, so this session
  built everything on `/contact` that doesn't depend on the answer (page, form UI, client
  validation, honeypot, success/E-030-failure states — see D-009/D-010) and left BL-022 In
  Progress rather than fabricating a "Done"/delivered claim. Same shape as session 14's BL-017
  finding: file the gap precisely, build what's genuinely buildable, don't build around it ad hoc.
