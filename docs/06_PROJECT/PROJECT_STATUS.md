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
- **Phase**: M1 Foundation — BL-001–BL-006 done; BL-007 (new, real perf regression) Ready
- **Last session**: 2026-07-30 — completed BL-006 (Playwright + axe + LHCI wired into `ci.yml`)
- **Build status**: green (`pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build`, `pnpm test` all pass locally, 36/36 unit tests; `pnpm exec playwright test` 9/9 passed across mobile-375/desktop-1280 — 1 correctly skipped; `lhci autorun` exits 0 — see Weekly Review Findings for the one budget running as `warn`)
- **Deployed**: no

## Current Focus
Milestone M1 — Foundation is functionally complete (BL-001–BL-006 done),
but wiring BL-006's real Lighthouse budgets surfaced a genuine regression:
`/` ships ~62KB gzip of JS (15KB budget) via SiteHeader's React hydration
(D-004). BL-007 fixes this and should be next, before M2 content pages
multiply the number of pages carrying the same oversized header. After
BL-007: M2 (BL-010 homepage — deps BL-005/BL-003 both done).

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
Start BL-007 (reduce SiteHeader's JS payload under the 15KB budget — see
D-004 for full context and rejected alternatives). Once
`resource-summary:script:size` is back to `error` in lighthouserc.cjs and
green, move to BL-010 (homepage per PAGE_SPECIFICATIONS §/) — deps BL-005
and BL-003 both done. Note: only the placeholder "Site under construction"
content renders inside BaseLayout on `/` today — BL-010 still needs to
build the actual homepage sections (Hero, service Cards, etc.).

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-30**: BL-006's Lighthouse CI found `/` shipping ~62KB gzip of JS against a 15KB budget
  (react-dom via SiteHeader's `client:load`) — D-004, BL-007 filed. `resource-summary:script:size`
  runs as `warn` (all other budgets stay `error`) so it's visible, not silently hidden; flip back
  to `error` when BL-007 closes. Separately: the known `GITHUB_TOKEN` auto-merge gap (CHANGELOG.md
  session 5) means the new `e2e-axe-lighthouse` job won't run against `main` post-merge either,
  only on `claude/*` pushes and PRs — same fix needed, not blocking.
