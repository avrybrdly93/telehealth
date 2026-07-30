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
- **Phase**: M1 Foundation — done (BL-001–BL-007). M2 Content Pages underway: BL-010, BL-011
  done.
- **Last session**: 2026-07-30 (session 10) — built `/services` + `/services/[slug]` (BL-011);
  found and fixed BUG-003 (font-swap CLS regression) along the way.
- **Build status**: green — lint/typecheck/format/build/`pnpm test` (44/44)/`playwright test`
  (28/28, 2 skipped)/`lhci autorun` (exit 0 on all 4 routes now collected; Perf 100/A11y 100/
  BP 96/SEO 100, CLS 0 everywhere). Cross-browser (Safari/Firefox) not verified — only Chromium
  available here.
- **Deployed**: not re-verified this session — pushed to this session's branch only (auto-merge
  workflow handles `main`); known `GITHUB_TOKEN` gap below still applies.

## Current Focus
Milestone M2 — Content Pages: BL-010, BL-011 done. Next unblocked (deps met): BL-012 (providers —
needs photos, Needs Human Review), BL-013 (pricing, now unblocked by BL-011), BL-014 (About/First
Visit), BL-015 (FAQ page, can reuse FAQAccordion), BL-016 (legal shell + 404).

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
Start BL-013 (pricing, now unblocked), BL-015 (FAQ page, can reuse FAQAccordion), or BL-012
(providers — bios stay NEEDS_HUMAN/Needs Human Review until real content lands).

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
