---
title: Changelog
status: Active
authority: Project
owner: Engineering
dependencies:
  - PROJECT_STATUS.md
review_cycle: Every session
---

# Changelog

Format (newest first). One entry per session that changed anything.

```
## YYYY-MM-DD — session N
- [BL-xxx] What shipped (user-visible phrasing where possible)
- Decisions: D-xxx (if any)
- Notes: regressions found/fixed, items re-scoped
```

Rules: agent-written in Phase 5; never rewrite past entries; releases to production get a `— DEPLOYED` suffix on the entry.

---

## 2026-07-29 — session 3
- [BL-003] Added `src/content.config.ts` defining 5 content collections (services, providers, conditions, faq, legal) with zod schemas per ARCHITECTURE.md §Content boundary, using Astro's content-layer `glob()` loader and `reference()` for cross-collection links (e.g. a service's `providerSlugs` must resolve to real `providers` entries). Verified invalid frontmatter fails `pnpm build` (missing required fields, bad enum value, wrong type all correctly rejected with `InvalidContentEntryDataError`).
- Extended `src/lib/practice.ts` with `PROVIDER_KEYS`/`SERVICE_KEYS` tuples and `PROVIDER_NAMES`/`PROVIDER_CREDENTIALS`/`PROVIDER_LICENSE_NUMBERS`/`SERVICE_PRICES` records — all NEEDS_HUMAN placeholders — so content frontmatter references a stable key (`providerKey: 'md'`, `priceKey: 'evaluation'`) instead of ever inlining a price or credential (CODING_STANDARDS.md §Content Files).
- Added minimal sample content: 2 services (evaluation, follow-up — durations/modality from TELEHEALTH_SPECIFICATION.md), 3 conditions (depression, anxiety, ADHD — each with the required educational disclaimer per COPY_GUIDELINES.md rule 2), 2 FAQ entries in the "Getting started" group. Deliberately left provider bio prose (`approachStatement`, `education`, body) as NEEDS_HUMAN placeholders and added no `legal` content files — both are Tier 3 (DECISION_FRAMEWORK.md: provider bios, legal pages) and belong to BL-012/BL-016 with human sign-off, not this schema-scaffolding item.
- Notes: no new runtime dependency — `z`/`reference` come from `astro:content`, already bundled with Astro. `astro check` reports a pre-existing upstream `'z' is deprecated` hint (zod v4 internal type re-export via Astro); 0 errors/0 warnings, not introduced by this change. Pre-existing Prettier formatting issue in `.github/workflows/auto-merge-claude.yml` noted but out of scope (not touched this session).

## 2026-07-29 — session 2
- [BL-002] Added `src/styles/tokens.css` (all DESIGN_TOKENS.md color/type/spacing/radius/shadow/motion/breakpoint values as CSS custom properties, with the mobile→tablet type-scale override for `--text-display`/`--text-h2`) and `src/styles/global.css` (self-hosted `@font-face` rules, modern reset, base element styles, focus-visible outline, `prefers-reduced-motion` handling — all token-driven, no hardcoded values). Self-hosted Inter (variable, weights 400–600) and Source Serif 4 (600), Latin-subset woff2 downloaded from Google Fonts and served from `/public/fonts` — combined 68.2KB, well under the 120KB budget. Sample page (`src/pages/index.astro`) imports global.css and renders an h1 (display font) + p (body font) to prove both families load.
- Notes: verified with Playwright/Chromium against `astro preview` — both fonts report `document.fonts` status `loaded`, computed `font-family` matches expected values, font requests return 200, no console errors (one unrelated 404 for the browser's default favicon request — out of scope for this item). Inlined CSS is 2.4KB, well under the 30KB budget.
- Fixed a pre-existing CI bug from BL-001: `.github/workflows/ci.yml` set both a `version` input on `pnpm/action-setup@v4` and package.json's `packageManager` field, which the action now rejects as conflicting. Removed the redundant `version` input.

## 2026-07-29 — session 1
- [BL-001] Scaffolded Astro (static output) + React islands project per ARCHITECTURE.md/TECH_STACK.md: TypeScript strict, ESLint (typescript-eslint + jsx-a11y) + Prettier, repo directory structure (/src/{components,pages,content,lib,styles}, /api, /tests, /public), GitHub Actions CI (lint → typecheck → format → build), root CLAUDE.md updated with commands and the three absolute rules.
- Notes: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm format` all green locally. eslint-plugin-astro was evaluated but dropped — its eslint>=10 peer requirement conflicts with eslint-plugin-jsx-a11y's eslint<=9 requirement; TECH_STACK.md only specifies jsx-a11y, so kept eslint 9 and skipped the astro-specific linter.

## 2026-07-29 — session 0
- Documentation repository created (all /docs and /templates files). Code not yet started.
- Decisions: D-001, D-002, D-003 (see DECISION_LOG.md)
