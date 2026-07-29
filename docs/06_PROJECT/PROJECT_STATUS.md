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
- **Phase**: M1 Foundation — BL-001 done
- **Last session**: 2026-07-29 — completed BL-001 (Astro+TS scaffold, CI skeleton)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build` all pass locally; CI workflow added)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation (BL-001 → BL-006). BL-001 done. Next session: start
BL-002 (design tokens) or BL-003 (content collections + practice.ts) — both
now unblocked; BL-002 is smaller (S), recommend taking it first.

## In Progress
_(none — a session marks its item here with a "Next step:" note precise enough for a cold start)_

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain (fills practice.ts placeholders) |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview |

## Tomorrow's Focus
Start BL-002 (design tokens as CSS custom properties + global styles + font
self-hosting) — References: DESIGN_TOKENS, DESIGN_SYSTEM, PERFORMANCE_BUDGET.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
