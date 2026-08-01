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
  Needs Human Review). M3 Booking & Contact — underway: BL-022 In Progress (this session).
- **Last session**: 2026-08-01 (session 18) — claimed BL-022 (Contact page). Found a real
  docs-vs-deployment conflict before building: ARCHITECTURE.md/TECH_STACK.md describe the contact
  form's backend as a serverless function on Netlify/Vercel, but the site is actually deployed
  static-only to GitHub Pages and no hosting/email-vendor decision was ever recorded — filed as
  D-009 (Tier 3, Proposed, blocks only itself per DECISION_FRAMEWORK.md). Built and shipped
  everything buildable without that decision: `/contact` page, new `Alert` component (E-020/E-030
  full-state banner, was spec'd but never implemented — same gap Hero/PricingTable were in before
  BL-010/013), new `ContactForm` component (name/email/phone/message, honeypot, client validation,
  success/E-030-failure states) as a vanilla-JS progressive enhancement — not a `client:load`
  React island — per D-010, to avoid repeating D-004/BL-007's JS-budget regression. The form posts
  to `/api/contact`, which 404s on this deployment today (no backend exists yet); this is
  documented, honest, expected behavior, not a bug — real visitors see the E-030 failure state
  with phone/email fallback until D-009 is resolved and a function is built.
- **Build status**: green — lint/typecheck/format/`pnpm test` (82/82, +13)/`pnpm build` all pass.
  `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same desktop-only skips as
  every prior session: mobile-menu and homepage-fold don't apply to the desktop viewport).
  `pnpm exec lhci autorun`: 17/17 URLs (16 previous + new `/contact`) pass every budget assertion
  at `error` severity, including `resource-summary:script:size` — `/contact` ships 0KB of
  *external* script (the vanilla-JS behavior is inlined, same as SiteHeader's), 5.8KB document
  (40KB budget), 78.8KB total (500KB budget). Full numbers in DECISION_LOG.md D-010.
- **Deployed**: not yet pushed this session — see commits below once pushed; will confirm via
  `git fetch`/Actions API in the close-out commit.

## Current Focus
Milestone M3 — Booking & Contact: BL-022 In Progress (contact page UI shipped; backend gated on
D-009, a human hosting/email-vendor decision). BL-020/BL-021 still Ready (BL-020 needs a
grooming/split pass first). BL-023 (Analytics wrapper) is Ready and unblocked (BL-010 Done) — next
pickup if a following session doesn't resume BL-022's Next step first.

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states) is shipped and tested today. |

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
DECISION_LOG.md's status first. If still Proposed, don't re-attempt the backend; pick BL-023
(Analytics wrapper, Ready, Deps BL-010 Done, S-sized) instead, per this repo's own "Tier 3 blocks
only itself, pick the next backlog item and continue" rule. BL-020 (booking flow) still needs a
grooming/split pass before it's startable (L→split). BL-030 (metadata/sitemap/robots/OG, M4) is
Ready if M3 items are blocked/claimed. BL-031 (structured data) can use BL-015's grouped content
model for FAQPage JSON-LD once BL-030 lands. BL-018 (flip readability CI to blocking) stays
Blocked on BL-032.

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
