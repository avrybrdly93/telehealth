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
- **Phase**: M1 Foundation — done (BL-001–BL-007 all Done)
- **Last session**: 2026-07-30 — verified BUG-001's deploy fix goes green on `main`; found and fixed BUG-002 (Playwright/LHCI 404s from an unpropagated `base` path); shipped BL-007 (SiteHeader JS payload)
- **Build status**: green — `pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build`, `pnpm test` (36/36), `pnpm exec playwright test` (9/9, 1 correctly skipped), and `lhci autorun` (exit 0, every budget including `resource-summary:script:size` now at `error`) all pass locally.
- **Deployed**: yes — manually dispatched `Deploy to GitHub Pages` against `main`'s HEAD (run 30550349368): both `build` and `deploy` jobs succeeded. This session's own commits (BUG-002 fix, BL-007) have not yet triggered a fresh deploy run themselves; whoever next pushes to `main` (or dispatches manually) will pick them up.

## Current Focus
Milestone M1 — Foundation is now fully done (BL-001–BL-007). Next up is M2:
BL-010 (homepage per PAGE_SPECIFICATIONS §/) — deps BL-005 and BL-003 both
done. Note: only the placeholder "Site under construction" content renders
inside BaseLayout on `/` today — BL-010 needs to build the actual homepage
sections (Hero, service Cards, etc.).

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
Start BL-010 (homepage per PAGE_SPECIFICATIONS §/) — deps BL-005 and BL-003
both done. Build the actual homepage sections (Hero, service Cards, etc.)
in place of the current "Site under construction" placeholder.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-30**: The known `GITHUB_TOKEN` auto-merge gap (CHANGELOG.md session 5) still applies:
  `.github/workflows/auto-merge-claude.yml` pushes to `main` with the default `GITHUB_TOKEN`, so
  GitHub doesn't fire `on: push` workflows (`ci.yml`, `deploy.yml`) for those merges — confirmed
  again this session (session 7's BUG-001 fix and close-out commits landed on `main` without
  triggering either workflow; had to manually `workflow_dispatch` `deploy.yml` to verify it).
  Every session's own `pnpm build`/lint/format/test run is the only real check after an
  auto-merge until this gets a PAT/App-token fix or an explicit `workflow_run` trigger. Not
  blocking any backlog item, but worth flagging again since it's now bitten two different
  sessions' verification steps (BUG-001 here, and indirectly enabled BUG-002 going undetected
  for as long as it did).
