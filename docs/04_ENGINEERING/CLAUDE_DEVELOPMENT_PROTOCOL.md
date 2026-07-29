---
title: Claude Development Protocol
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - ../00_AI_OPERATING_SYSTEM/EXECUTION_LOOP.md
  - ../00_AI_OPERATING_SYSTEM/DECISION_FRAMEWORK.md
  - ../06_PROJECT/BACKLOG.md
review_cycle: Monthly
---

# Claude Development Protocol

How Claude Code specifically operates in this repository. EXECUTION_LOOP.md defines the session phases; this file adds Claude-specific mechanics.

## Session Bootstrap (paste-ready prompt)

Each session starts with (or equivalent via CLAUDE.md):

> Read docs/06_PROJECT/PROJECT_STATUS.md and docs/06_PROJECT/BACKLOG.md. Resume any In-Progress item; otherwise take the top unblocked item. Follow docs/00_AI_OPERATING_SYSTEM/EXECUTION_LOOP.md exactly, including Phase 5 close-out. You may be cut off by usage limits at any time — checkpoint accordingly.

A repository-root `CLAUDE.md` must exist containing: pointer to this protocol, the bootstrap instruction above, build/test commands, and the three absolute rules below. Keep CLAUDE.md ≤ 60 lines; it points to docs, it doesn't duplicate them.

## Absolute Rules (verbatim into CLAUDE.md)
1. Never add a form field, tracking call, or stored datum beyond docs/05_SECURITY/DATA_BOUNDARIES.md. Propose via DECISION_LOG.md instead.
2. Never edit crisis-resource copy, pricing values, provider credentials, or legal pages without a human-approved Tier 3 decision.
3. End every session with Phase 5 close-out even if work is incomplete.

## Cadence Design (≈5 sessions/day, usage-limit aware)

Backlog items are sized so **1 session ≈ 1 S item or half an M item** (see BACKLOG.md sizing). Suggested daily rhythm:
- Sessions 1–4: build sessions (EXECUTION_LOOP.md Phases 1–5).
- Session 5: short verification session — run full test/a11y/LHCI suite, fix or file regressions, groom top of backlog, update PROJECT_STATUS.md "Tomorrow's focus" line. If a build session was cut off mid-item, session 5 instead completes its Phase 5 close-out.
- Monday's first session is the Weekly Consistency Review (REVIEW_PROCESS.md), replacing a build session.

## Context Discipline
- Read only the docs the current item's References field lists, plus PROJECT_STATUS.md and this protocol. Don't ingest the whole /docs tree per session.
- When a doc contradicts code, follow DECISION_FRAMEWORK.md conflict hierarchy and log it.
- If a needed fact is missing from docs (e.g., actual provider names, prices, vendor URL): use a clearly named placeholder constant in `practice.ts` (`PLACEHOLDER_PRICE_INTAKE`), add a Tier 3 "needs human input" entry, and continue. Never invent real-sounding clinical facts, credentials, or prices.

## Tool Conduct
- Run the project's own scripts (pnpm lint/test/build) rather than ad-hoc checks; CI parity.
- No installing new dependencies without the tier process.
- Destructive git operations, deploy-config changes, and DNS/domain anything: out of bounds → propose only.
