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
- **Phase**: M1 Foundation — BL-001, BL-002, BL-003, BL-004, BL-005 done
- **Last session**: 2026-07-30 — completed BL-005 (SiteHeader, SiteFooter, CrisisResources, SkipLink + BaseLayout, wired into index.astro)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build`, `pnpm test` all pass locally, 36/36 tests; also smoke-tested in a real Chromium browser via Playwright at 375px and 1280px — header/footer/skip-link/crisis copy render, mobile menu opens/closes with correct `aria-expanded`, Esc closes and returns focus, focus trap holds, no console errors besides a pre-existing missing favicon.ico)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation (BL-001 → BL-006). BL-001–BL-005 done; only
BL-006 (Playwright + axe + LHCI in CI) remains, and it has no component
dependency (dep BL-001 done). Next session: BL-006, or BL-010 (homepage —
deps BL-005 and BL-003 both now done) if CI wiring is deprioritized.

## In Progress
_(none — a session marks its item here with a "Next step:" note precise enough for a cold start)_

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview — Tier 3; no src/content/legal/*.md files exist yet (deferred to BL-016) |

## Tomorrow's Focus
Start BL-006 (Playwright + axe + LHCI wired into CI with budgets) —
References: TESTING_AND_VALIDATION_PLAN, PERFORMANCE_BUDGET. Alternative:
BL-010 (homepage per PAGE_SPECIFICATIONS §/) is also unblocked now that
BL-005 and BL-003 are both done. Note: only the placeholder "Site under
construction" content now renders inside BaseLayout on `/` — BL-010 still
needs to build the actual homepage sections (Hero, service Cards, etc.).

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-29**: `.github/workflows/auto-merge-claude.yml` (new this session, human-added) pushes to `main` using the default `GITHUB_TOKEN`. GitHub does not trigger other workflows (including `ci.yml`'s `on: push: branches: [main]`) from `GITHUB_TOKEN`-authored pushes — confirmed via Actions API: no CI run exists for either of this session's two auto-merges onto `main`, even though `.github/workflows/ci.yml` last ran (and failed) on the pre-merge commit. Practical effect: CI silently stops re-verifying `main` after every claude/ branch auto-merge; a session's local `pnpm build`/lint/format is currently the only check. Fix requires human action: either add a PAT/GitHub App token as a secret for the auto-merge job to push with (so `on: push` fires normally), or add an explicit `workflow_dispatch`/`workflow_run` trigger. Flagged to the user; not blocking BL-003.
