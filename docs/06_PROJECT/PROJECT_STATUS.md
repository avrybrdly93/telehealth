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
- **Phase**: M1 Foundation — done (BL-001–BL-007). M2 Content Pages underway: BL-010, BL-011,
  BL-012, BL-013 done (BL-012 content Needs Human Review).
- **Last session**: 2026-07-31 (session 13) — fixed BUG-004 (D-007): `ci.yml`/`deploy.yml` now
  fire automatically after a `claude/*` auto-merge via a `workflow_run` trigger, closing the
  `GITHUB_TOKEN` gap that let `main` silently drift ahead of the deployed site. No page/component
  work this session — infra-only, per this run's stated first priority.
- **Build status**: green — lint/typecheck/format/`pnpm test` (47/47)/build all pass locally on
  the session's commit. `playwright test`/`lhci autorun` not re-run locally this session (no
  frontend change); CI's own e2e/axe/Lighthouse job (part of the live verification below) passed.
- **Deployed**: verified live and green — this session's fix commit (0e86083) was auto-merged to
  `main` (run 30637909699), which then triggered both `deploy.yml` (run 30637925559) and `ci.yml`
  (run 30637925630) via the new `workflow_run` path; both completed with conclusion `success`.
  GitHub Pages is now confirmed current with `main`, not just locally built.

## Current Focus
Milestone M2 — Content Pages: BL-010, BL-011, BL-013 done; BL-012 done pending human content
(Needs Human Review). Next unblocked: BL-014 (About/First Visit), BL-015 (FAQ, reuse
FAQAccordion), BL-016 (legal shell + 404).

## In Progress
- **BL-014** (About + Your First Visit pages) — started 2026-07-31 (session 14). Next step if
  interrupted: build `/about` and `/your-first-visit` per PAGE_SPECIFICATIONS.md, add both routes
  to `tests/e2e/routes.ts` and `lighthouserc.cjs`, verify lint/typecheck/test/build/e2e/LHCI green,
  close out per EXECUTION_LOOP.md Phase 5.

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview — Tier 3; no src/content/legal/*.md files exist yet (deferred to BL-016) |

## Tomorrow's Focus
Start BL-014 (About/First Visit), BL-015 (FAQ, reuse FAQAccordion), or BL-016 (legal shell +
404). BL-012/BL-013 are shipped; no further engineering needed on either until real practice
facts (provider content/photos, cancellation policy, payment methods) arrive.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-31 (session 13)**: The `GITHUB_TOKEN` auto-merge gap tracked here since 2026-07-30
  (originally CHANGELOG.md session 5) is fixed — see BUG-004/D-007. `ci.yml`/`deploy.yml` now
  fire via a `workflow_run` trigger keyed off `auto-merge-claude.yml` completing, verified live
  against a real auto-merge this session. No further action needed unless GitHub changes how
  `workflow_run` cascade exemptions work.
