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
- **Phase**: M1 Foundation — BL-001, BL-002, BL-003 done
- **Last session**: 2026-07-29 — completed BL-003 (content collections + zod schemas + practice.ts placeholders)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build` all pass locally; also fixed a pre-existing red-main Format-check failure in `.github/workflows/auto-merge-claude.yml`)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation (BL-001 → BL-006). BL-001, BL-002, BL-003 done.
Next session: BL-004 (core components batch 1) — now unblocked (dep BL-002
done) and is the natural next step toward BL-005/BL-010. BL-006 (CI e2e/axe/
LHCI) has no component dependency and could also run in parallel.

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
Start BL-004 (core components batch 1: Button, TextInput, TextArea,
Checkbox, Card + tests) — References: COMPONENT_LIBRARY, ACCESSIBILITY,
ERROR_STATES E-010.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
