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
- **Phase**: M1 Foundation — BL-001, BL-002 done
- **Last session**: 2026-07-29 — completed BL-002 (design tokens, global styles, self-hosted fonts)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build` all pass locally; CI workflow from BL-001)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation (BL-001 → BL-006). BL-001, BL-002 done. Next
session: start BL-003 (content collections + practice.ts) or BL-004 (core
components batch 1) — BL-004 depends on BL-002 (now done) and is the more
natural next step toward BL-005/BL-010; BL-003 has no UI dependency and can
run in parallel. Recommend BL-003 next since it unblocks BL-010/011/012.

## In Progress
- **BL-003** (started 2026-07-29): Content collections + zod schemas + practice.ts placeholders. Next step: define `src/content.config.ts` (services, providers, conditions, faq, legal collections using `astro:content` glob loaders), extend `src/lib/practice.ts` with NEEDS_HUMAN placeholder records for provider names/credentials/license numbers and service prices, then add minimal sample content files per collection to validate schemas at build.

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain (fills practice.ts placeholders) |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview |

## Tomorrow's Focus
Start BL-003 (content collections + zod schemas + practice.ts constants) —
References: ARCHITECTURE §Content boundary, CODING_STANDARDS §Content.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
