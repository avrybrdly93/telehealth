---
title: Coding Standards
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - TECH_STACK.md
  - ../03_DESIGN/DESIGN_TOKENS.md
review_cycle: Quarterly
---

# Coding Standards

## General
- TypeScript strict; no `any` (use `unknown` + narrowing); no `@ts-ignore` without linked backlog ID.
- Functions ≤ 40 lines; files ≤ 250 lines; extract before exceeding.
- No dead code, no commented-out code. TODOs must reference a backlog ID: `// TODO(BL-042): …`.
- Errors handled explicitly; never swallow (`catch {}` is banned).

## Naming
- Components: PascalCase, one per directory: `CrisisResources/CrisisResources.tsx|.astro` + `CrisisResources.test.tsx` + optional `README.md` for complex ones.
- Files otherwise kebab-case; content files kebab-case matching URL slug.
- Booleans read as predicates (`isEligible`, `hasError`). Event handlers `handleX`; props callbacks `onX`.
- Domain vocabulary matches COPY_GUIDELINES.md glossary: code says `appointment`, `provider`, `videoVisit` — never `slot`, `doctor` (except MD-specific), `session`.

## Components
- Props typed and documented; no prop drilling > 2 levels (restructure instead).
- Styling: tokens only. Raw hex/px color or off-scale spacing values are lint failures (custom lint rule; until built, enforced in review).
- Every interactive component ships all five states (COMPONENT_LIBRARY.md) and its test asserts keyboard operability.
- Islands are leaf-level and minimal; content pages must render complete HTML without JS (E-050).

## Content Files
- All frontmatter zod-validated at build; a content error fails the build (never ships silently broken pages).
- Prices, credentials, phone, email defined once in a `practice.ts` constants module and referenced — never inlined in copy files.

## Git
- Trunk-based, direct-to-main: commit and push to `main` after each green step. CI runs on every push to main; a red main is fixed or reverted before any new work begins.
- Tier 3 content (pricing, provider credentials, crisis-resource copy, legal pages, any new data collection) is never pushed directly — it stops at a DECISION_LOG.md proposal per DECISION_FRAMEWORK.md, regardless of the direct-to-main workflow.
- Commits: `[BL-xxx] imperative summary` ≤ 72 chars; body explains why when non-obvious. Small commits — one per green step — so any push is individually revertible.
- Never force-push main or rewrite published history; never commit secrets (CI secret-scan; .env in .gitignore from day one).

## Comments & Docs
- Comment the why, not the what. Every module that implements a requirement cites it: `// Implements FR-023 — vendor handoff`.
- Public helpers get JSDoc with one example.
