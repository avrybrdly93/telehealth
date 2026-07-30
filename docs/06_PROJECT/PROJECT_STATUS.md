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
- **Phase**: M1 Foundation — BL-001, BL-002, BL-003, BL-004 done
- **Last session**: 2026-07-29 — completed BL-004 (core components batch 1: Button, TextInput, TextArea, Checkbox, Card)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build`, `pnpm test` all pass locally; unit tests now wired into CI between typecheck and build)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation (BL-001 → BL-006). BL-001–BL-004 done.
Next session: BL-005 (SiteHeader, SiteFooter, CrisisResources, SkipLink +
base layout) — now unblocked (dep BL-004 done) and is the natural next step
toward BL-010 (homepage). BL-006 (CI e2e/axe/LHCI) has no component
dependency and could also run in parallel.

## In Progress
- **BL-005** (started 2026-07-30): SiteHeader, SiteFooter, CrisisResources, SkipLink + base layout. Next step: see Phase 5 close-out note below once this session ends.

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview — Tier 3; no src/content/legal/*.md files exist yet (deferred to BL-016) |

## Tomorrow's Focus
Start BL-005 (SiteHeader, SiteFooter, CrisisResources, SkipLink + base
layout) — References: COMPONENT_LIBRARY, INFORMATION_ARCHITECTURE
§Navigation, UX-020. Note: BL-004 components aren't wired into any page
yet (no page exists to place them on) — full cross-browser/viewport
verification (QUALITY_STANDARD.md) happens once BL-005/BL-010 actually
render them; this session's verification was via the Vitest/Testing
Library/jest-axe component harness only.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-29**: `.github/workflows/auto-merge-claude.yml` (new this session, human-added) pushes to `main` using the default `GITHUB_TOKEN`. GitHub does not trigger other workflows (including `ci.yml`'s `on: push: branches: [main]`) from `GITHUB_TOKEN`-authored pushes — confirmed via Actions API: no CI run exists for either of this session's two auto-merges onto `main`, even though `.github/workflows/ci.yml` last ran (and failed) on the pre-merge commit. Practical effect: CI silently stops re-verifying `main` after every claude/ branch auto-merge; a session's local `pnpm build`/lint/format is currently the only check. Fix requires human action: either add a PAT/GitHub App token as a secret for the auto-merge job to push with (so `on: push` fires normally), or add an explicit `workflow_dispatch`/`workflow_run` trigger. Flagged to the user; not blocking BL-003.
