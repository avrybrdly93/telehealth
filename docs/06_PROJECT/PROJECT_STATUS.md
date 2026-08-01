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
  BL-012, BL-013, BL-014, BL-015, BL-016, BL-017 done (BL-012/BL-015 content Needs Human Review).
- **Last session**: 2026-08-01 (session 17) — shipped BL-017: `scripts/check-readability.ts`
  (textstat-style Flesch-Kincaid check, `src/lib/readability.ts` pure logic + 22 Vitest unit
  tests), wired into `ci.yml` non-blocking (D-008). Retroactively found and fixed 4 real
  above-8th-grade files tied to Done items (BL-011's `psychiatric-evaluation.md`, three BL-015
  FAQ entries) with meaning-preserving phrasing edits. Filed BL-018 for 3 remaining
  `conditions/*.md` failures, root-caused to COPY_GUIDELINES.md's mandatory verbatim disclaimer
  sentence, not fixable this session (see D-008).
- **Build status**: green — lint/typecheck/format/`pnpm test` (69/69, +22)/`pnpm build`/
  `check:readability` (13 pass/3 known-fail/2 skipped, non-blocking) all pass locally on the
  session's commits. `playwright test`/`lhci autorun` not re-run this session (no `.astro`/route
  changes; content-file wording edits only) — unchanged from session 16's 132/134 + 16/16 green.
- **Deployed**: not yet pushed this session — see commits below once pushed; will confirm via
  `git fetch`/Actions API in the close-out commit.

## Current Focus
Milestone M2 — Content Pages: BL-010, BL-011, BL-013, BL-014, BL-015, BL-016, BL-017 done;
BL-012/BL-015 done pending human content (Needs Human Review). Next unblocked: BL-020/BL-021/
BL-022/BL-023 (M3) or BL-030 (M4) — see Tomorrow's Focus.

## In Progress
_(none — a session marks its item here with a "Next step:" note precise enough for a cold start)_

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview, and Accessibility Statement — Tier 3; `src/content/legal/*.md` are placeholder shells only (`reviewStatus: needs-human-review`), shipped by BL-016 |
| FAQ content | `/faq`'s 13 Q&As are AI-drafted per COPY_GUIDELINES.md and need clinical/practice review before publish (same Needs Human Review status as BL-012); cancellation-policy and payment-methods answers are placeholders pending the practice-constants item above |

## Tomorrow's Focus
M2 has no more unclaimed Ready items. Per BACKLOG.md's top-to-bottom priority order, next Ready
items with satisfied deps: BL-020 (booking flow steps 1–3, L→needs grooming/split before starting)
or BL-022/BL-023 (M3, simpler S/M sizing) in-milestone order, or BL-030 (metadata/sitemap/robots/OG,
M4) if M3 is deferred. BL-031 (structured data) can use BL-015's grouped content model for FAQPage
JSON-LD once BL-030 lands. BL-018 (flip readability CI to blocking) stays Blocked on BL-032.

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-07-31 (session 14)**: While claiming BL-014, found its acceptance criteria ("copy passes
  readability CI") references tooling that doesn't exist — `TECH_STACK.md` and
  `TESTING_AND_VALIDATION_PLAN.md` both describe a readability CI script over patient-facing copy
  (UX-002) that was never built in any prior session. Filed as BL-017 rather than building it
  ad hoc inside BL-014 (scope discipline); BL-014's copy was instead manually checked (Flesch-
  Kincaid estimate ~6.6–8.2, avg sentence length 11.5–13.8 words/sentence — see CHANGELOG.md).
  Every prior M2 page (BL-010/011/012/013) has the same gap and should be swept once BL-017 lands.
