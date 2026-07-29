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

## 2026-07-29 — session 1
- [BL-001] Scaffolded Astro (static output) + React islands project per ARCHITECTURE.md/TECH_STACK.md: TypeScript strict, ESLint (typescript-eslint + jsx-a11y) + Prettier, repo directory structure (/src/{components,pages,content,lib,styles}, /api, /tests, /public), GitHub Actions CI (lint → typecheck → format → build), root CLAUDE.md updated with commands and the three absolute rules.
- Notes: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm format` all green locally. eslint-plugin-astro was evaluated but dropped — its eslint>=10 peer requirement conflicts with eslint-plugin-jsx-a11y's eslint<=9 requirement; TECH_STACK.md only specifies jsx-a11y, so kept eslint 9 and skipped the astro-specific linter.

## 2026-07-29 — session 0
- Documentation repository created (all /docs and /templates files). Code not yet started.
- Decisions: D-001, D-002, D-003 (see DECISION_LOG.md)
