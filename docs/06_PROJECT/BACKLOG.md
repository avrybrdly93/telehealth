---
title: Backlog
status: Active
authority: Project
owner: Product
dependencies:
  - PROJECT_STATUS.md
  - ../01_PRODUCT/SERVICE_REQUIREMENTS.md
review_cycle: Weekly
---

# Backlog

## How to use (agents)
- Take the topmost item with status `Ready` whose Deps are all `Done`. Order = priority.
- Sizing: **S** ≈ one session, **M** ≈ two sessions (checkpoint mid-way), **L** = must be split before starting (grooming task).
- Statuses: Ready · In Progress · Blocked · Needs Human Review · Done.
- New items use ../../templates/FEATURE_TEMPLATE.md fields; bugs are inserted above features of the same milestone using ../../templates/BUG_TEMPLATE.md.
- References column lists the docs to read in Phase 1 of the session.

## Bugs

| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BUG-001 | GitHub Pages deploy workflow fails: `withastro/action@v3` defaults to Node 20, Astro 7.1.6 requires Node >=22.12.0 | S | — | Done | templates/BUG_TEMPLATE.md, .github/workflows/deploy.yml | `Deploy to GitHub Pages` workflow run succeeds (build + deploy jobs both green) on a push to `main` |
| BUG-002 | Playwright/Lighthouse hit a 404: astro.config.mjs's `base: '/telehealth'` (added for GitHub Pages) never propagated to playwright.config.ts's baseURL or lighthouserc.cjs's collect.url | S | — | Done | templates/BUG_TEMPLATE.md, playwright.config.ts, lighthouserc.cjs | `pnpm exec playwright test` and `lhci autorun` both pass locally against the built site |
| BUG-003 | `font-display: swap`'s post-paint font swap caused a real CLS budget breach (0.15 vs 0.1) on `/services/medication-management`, first caught because lighthouserc.cjs only ever collected `/` — never measured on other routes before | S | — | Done | templates/BUG_TEMPLATE.md, lighthouserc.cjs, src/layouts/BaseLayout.astro | `lhci autorun` passes CLS budget on every URL in lighthouserc.cjs's `collect.url` |

## Milestone M1 — Foundation

| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BL-001 | Scaffold Astro+TS project, repo structure per ARCHITECTURE.md, CI skeleton (lint/typecheck/build), CLAUDE.md at root | M | — | Done | ARCHITECTURE, TECH_STACK, CODING_STANDARDS, CLAUDE_DEVELOPMENT_PROTOCOL | `pnpm build` green in CI; repo dirs match ARCHITECTURE.md; CLAUDE.md ≤60 lines with 3 absolute rules |
| BL-002 | Design tokens as CSS custom properties + global styles + font self-hosting | S | BL-001 | Done | DESIGN_TOKENS, DESIGN_SYSTEM, PERFORMANCE_BUDGET | tokens.css matches DESIGN_TOKENS.md exactly; fonts woff2 subsetted ≤120KB; sample page renders both families |
| BL-003 | Content collections + zod schemas (services, providers, conditions, faq, legal) + practice.ts constants with named placeholders | M | BL-001 | Done | ARCHITECTURE §Content boundary, CODING_STANDARDS §Content | invalid frontmatter fails build; placeholder constants flagged NEEDS_HUMAN |
| BL-004 | Core components batch 1: Button, TextInput, TextArea, Checkbox, Card (+tests, all states) | M | BL-002 | Done | COMPONENT_LIBRARY, ACCESSIBILITY, ERROR_STATES E-010 | each component: 5 states, keyboard test, axe-clean in test harness |
| BL-005 | SiteHeader, SiteFooter, CrisisResources, SkipLink + base layout | M | BL-004 | Done | COMPONENT_LIBRARY, INFORMATION_ARCHITECTURE §Navigation, UX-020 | crisis block canonical copy verbatim; mobile menu focus-trapped; axe clean |
| BL-006 | Playwright + axe + LHCI wired into CI with budgets | S | BL-001 | Done | TESTING_AND_VALIDATION_PLAN, PERFORMANCE_BUDGET | CI runs e2e/axe/LHCI on preview; a deliberate violation fails the pipeline |
| BL-007 | Reduce SiteHeader JS payload under the 15KB content-page budget | S | BL-006 | Done | PERFORMANCE_BUDGET, TECH_STACK §Framework, DECISION_LOG D-004, COMPONENT_LIBRARY#SiteHeader | LHCI `resource-summary:script:size` passes at `error` severity on `/` (flip lighthouserc.cjs back from `warn`); SiteHeader.test.tsx + tests/e2e/mobile-menu.spec.ts behavior (focus trap, Esc, aria-expanded) still pass |

## Milestone M2 — Content Pages

| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BL-010 | Homepage per spec | M | BL-005, BL-003 | Done | PAGE_SPECIFICATIONS §/, FR-010, COPY_GUIDELINES | FR-010 fold test at 375px passes; GLOBAL-01/02 assertions pass |
| BL-011 | Services index + 2 service pages (content files + template) | M | BL-010 | Done | PAGE_SPECIFICATIONS §/services, TELEHEALTH_SPECIFICATION | prices from practice.ts; durations stated; NFR-007 demo: page = content file only |
| BL-012 | Providers index + 2 bio pages | S | BL-010 | In Progress (2026-07-31 session 11) | PAGE_SPECIFICATIONS §/providers, FR-011, IMAGE_GUIDELINES | credential/license fields from constants; photo alt pattern correct; Needs Human Review before publish |
| BL-013 | Pricing page | S | BL-011 | Ready | PAGE_SPECIFICATIONS §/pricing, FR-013, UX-003 | reachable ≤2 interactions from every page (nav audit test) |
| BL-014 | About + Your First Visit pages | S | BL-010 | Ready | PAGE_SPECIFICATIONS, FR-012, FR-015 | copy passes readability CI |
| BL-015 | FAQ page (≥12 Q&As) with accordion + #emergencies anchor | S | BL-010 | Ready | FR-016, COMPONENT_LIBRARY §FAQAccordion, Flow 4 | FAQPage schema validates (FR-051); content Needs Human Review |
| BL-016 | Legal pages shell + accessibility statement draft; 404 page | S | BL-010 | Ready | FR-040, FR-041, E-040 | legal copy marked Blocked pending human text; 404 has crisis strip |

## Milestone M3 — Booking & Contact

| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BL-020 | Booking flow steps 1–3 (island) with state preservation + StepIndicator | L→split at grooming | BL-005 | Ready | USER_FLOWS Flow 1, FR-020/021/022, UX-010/011, E-011 | BOOK-02/03/04/05 e2e pass |
| BL-021 | Vendor handoff step 4 + buildBookingUrl + mock-vendor e2e | S | BL-020 | Ready | FR-023, ARCHITECTURE §Extensibility, DATA_BOUNDARIES B2 | BOOK-01 passes; network assertion per DATA_BOUNDARIES §Enforcement |
| BL-022 | Contact page + serverless function + email delivery + failure states | M | BL-005 | Ready | Flow 2, FR-030/031, E-030, SECURITY_AND_COMPLIANCE §controls | CONTACT-01/02 pass; rate limit + honeypot verified; no persistence |
| BL-023 | Analytics wrapper + events per ANALYTICS_PLAN + consent-gating seam | S | BL-010 | Ready | ANALYTICS_PLAN, DATA_BOUNDARIES B4, PRIVACY_MODEL | event payloads match schema; no user-input data in any event (test) |

## Milestone M4 — SEO & Launch

| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BL-030 | Metadata system, sitemap, robots, canonicals, OG images | S | BL-010 | Ready | FR-050, NFR-005, SEO_STRATEGY | GLOBAL-01 passes; sitemap validates |
| BL-031 | Structured data (MedicalBusiness, Physician, FAQPage) | S | BL-030, BL-012, BL-015 | Ready | FR-051, SEO_STRATEGY §Schema | Rich Results test passes for all three types |
| BL-032 | 3 condition pages (depression, anxiety, adhd) drafts | M | BL-011, BL-030 | Ready | PAGE_SPECIFICATIONS §/conditions, CONTENT_STRATEGY, R-010 | educational disclaimer present; Needs Human Review (provider) before publish |
| BL-033 | Security headers + smoke tests + uptime monitoring | S | BL-006 | Ready | DEPLOYMENT_AND_OPERATIONS_PLAN, SECURITY_AND_COMPLIANCE §controls | header scan passes in smoke; monitor alerting verified |
| BL-034 | Launch checklist execution (MVP acceptance criteria) | M | all above | Blocked (deps) | MVP_SCOPE §acceptance | every checkbox evidenced in DECISION_LOG entry |

## Icebox (do not start; Phase 2 candidates)
Patient portal shell · insurance info pages · blog CMS · Spanish localization · additional providers template · online payment of superbill copies.
