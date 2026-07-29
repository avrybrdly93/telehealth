---
title: Testing and Validation Plan
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - ../00_AI_OPERATING_SYSTEM/QUALITY_STANDARD.md
  - ../02_UX/ACCESSIBILITY.md
  - PERFORMANCE_BUDGET.md
review_cycle: Quarterly
---

# Testing and Validation Plan

## Test Pyramid

| Layer | Tool | Scope | Gate |
|---|---|---|---|
| Static | tsc, ESLint, Prettier, secret scan | Everything | Zero errors |
| Content validation | zod at build + readability script | All /src/content | Build fails on schema error; readability ≥ threshold warns→blocks for patient pages (UX-002) |
| Unit/component | Vitest + Testing Library | Logic (buildBookingUrl, validation), each component's states + keyboard behavior | All pass; new logic requires tests |
| E2E | Playwright, mobile (375px) + desktop projects | Flow 1 booking end-to-end to handoff URL assertion; Flow 2 contact incl. failure path (mocked); nav; crisis-strip presence assertions on every /book step | All pass |
| Accessibility | axe-core over every route (both viewports) | All pages + each booking step | Zero critical/serious (blocking) |
| Performance | Lighthouse CI | Budgets per PERFORMANCE_BUDGET.md, all routes | Blocking |

## Required E2E Assertions (minimum set)
- BOOK-01: complete Flow 1 with provider preference → handoff URL contains service+provider params (FR-023).
- BOOK-02: complete Flow 1 via "No preference" (FR-021).
- BOOK-03: browser back from Step 3 → Step 2 selections intact (UX-011).
- BOOK-04: unchecked acknowledgments keep Continue disabled with guidance visible (E-011).
- BOOK-05: crisis strip + phone alternative visible on Steps 1–4 (FR-024/UX-020).
- CONTACT-01: valid submit → success state; CONTACT-02: server failure → E-030 treatment, input preserved.
- GLOBAL-01: every route renders h1 exactly once, title/description unique (NFR-005); GLOBAL-02: footer crisis block on every route.

## Manual Validation (launch + on change to covered flows)
- Screen reader script: VoiceOver (iOS) + NVDA through Flows 1–2 (ACCESSIBILITY.md).
- Real-device pass: one iOS Safari + one Android Chrome device, throttled to Slow 4G.
- Human copy review of any clinical/pricing/legal text (Tier 3).

## Test Data Rules
- Fixtures use obviously fake data ("Test Provider, LIC #000000"). Never real license numbers or real patient-like narratives in test content.
- Vendor handoff tested against a mock URL in CI; one manual production smoke test against the real vendor before launch and after vendor config changes.

## Regression Policy
Every bug fixed gets a test reproducing it first (cite BUG id in test name). Deleting/skipping a test requires a Tier 2 log entry.
