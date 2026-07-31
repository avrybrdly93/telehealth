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
  BL-012, BL-013, BL-014, BL-015 done (BL-012/BL-015 content Needs Human Review).
- **Last session**: 2026-07-31 (session 15) — first checked a reported GitHub Pages deploy
  failure (`withastro/action@v3` exit 1): could not reproduce it (see CHANGELOG.md). Then shipped
  BL-015: `/faq` page (13 Q&As across all 5 required groups, `#emergencies` anchor).
- **Build status**: green — lint/typecheck/format/`pnpm test` (47/47)/`pnpm build`/
  `playwright test` (92/94, 2 correctly skipped — same desktop-only skips as prior sessions)/
  `lhci autorun` (11/11 URLs, all assertions passed, exit 0) all pass locally on the session's
  commits.
- **Deployed**: not yet re-verified for this session's commits (auto-merge + `workflow_run`
  hadn't fired as of session close — see BUG-004/D-007 for the mechanism, confirmed working as of
  session 13's live test). Next session should confirm this session's `/faq` is live on GitHub
  Pages.

## Current Focus
Milestone M2 — Content Pages: BL-010, BL-011, BL-013, BL-014, BL-015 done; BL-012/BL-015 done
pending human content (Needs Human Review). Next unblocked: BL-016 (legal shell + 404), BL-017
(readability CI script — see below).

## In Progress
_(none — a session marks its item here with a "Next step:" note precise enough for a cold start)_

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview — Tier 3; no src/content/legal/*.md files exist yet (deferred to BL-016) |
| FAQ content | `/faq`'s 13 Q&As are AI-drafted per COPY_GUIDELINES.md and need clinical/practice review before publish (same Needs Human Review status as BL-012); cancellation-policy and payment-methods answers are placeholders pending the practice-constants item above |

## Tomorrow's Focus
Start BL-016 (legal shell + 404). BL-017 (readability CI script, never built) remains unblocked
and opportunistic — see CHANGELOG.md session 14/15. BL-031 (structured data) can use BL-015's
grouped content model for FAQPage JSON-LD once BL-030 lands.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-31 (session 14)**: While claiming BL-014, found its acceptance criteria ("copy passes
  readability CI") references tooling that doesn't exist — `TECH_STACK.md` and
  `TESTING_AND_VALIDATION_PLAN.md` both describe a readability CI script over patient-facing copy
  (UX-002) that was never built in any prior session. Filed as BL-017 rather than building it
  ad hoc inside BL-014 (scope discipline); BL-014's copy was instead manually checked (Flesch-
  Kincaid estimate ~6.6–8.2, avg sentence length 11.5–13.8 words/sentence — see CHANGELOG.md).
  Every prior M2 page (BL-010/011/012/013) has the same gap and should be swept once BL-017 lands.
