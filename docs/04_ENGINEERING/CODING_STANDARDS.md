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
- Prices, license numbers, phone, email defined once in a `practice.ts` constants module and referenced — never inlined in copy files.

## Git
- Trunk-based: short-lived branches `feat/BL-xxx-slug`, `fix/BL-xxx-slug`; merge via PR (even solo — CI gate).
- Commits: `[BL-xxx] imperative summary` ≤ 72 chars; body explains why when non-obvious.
- Never force-push shared branches; never commit secrets (CI secret-scan; .env in .gitignore from day one).

## Comments & Docs
- Comment the why, not the what. Every module that implements a requirement cites it: `// Implements FR-023 — vendor handoff`.
- Public helpers get JSDoc with one example.
