---
title: Execution Loop
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - QUALITY_STANDARD.md
  - ../06_PROJECT/BACKLOG.md
  - ../06_PROJECT/PROJECT_STATUS.md
review_cycle: Quarterly
---

# Execution Loop

## Purpose

Defines the exact procedure for every AI agent work session. The project is designed for **multiple short autonomous sessions per day** (typically ~5). Each session must be independently valuable and leave the repo deployable — assume the session may be interrupted by usage limits at any time.

## Session Procedure

### Phase 1 — Orient (always, ~2 min)
1. Read ../06_PROJECT/PROJECT_STATUS.md. Note "Current Focus" and any "Blocked" or "In Progress" items.
2. If an item is marked In Progress from a prior session, resume it. Otherwise select the highest-priority item in ../06_PROJECT/BACKLOG.md whose dependencies are Done.
3. Read the documents listed in that backlog item's "References" field.
4. Mark the item In Progress in BACKLOG.md and PROJECT_STATUS.md with a session timestamp.

### Phase 2 — Plan (small items: skip; items ≥ M complexity: required)
1. Break the item into commit-sized steps, each independently shippable.
2. Identify decision tier (DECISION_FRAMEWORK.md) for anything nonstandard. Tier 3 → write proposal, mark item Blocked, return to Phase 1 step 2.

### Phase 3 — Build
1. Implement one step at a time. After each step: build, lint, test.
2. Commit after each green step with message format: `[BACKLOG-ID] <imperative summary>`.
3. Never leave the working tree dirty across a step boundary.

### Phase 4 — Verify
Run the full Definition of Done checklist in QUALITY_STANDARD.md. Fix failures now; do not defer.

### Phase 5 — Close Out (never skip — do this even if the item is unfinished)
1. Update BACKLOG.md: item → Done, or leave In Progress with a "Next step:" note precise enough for a cold-start session.
2. Update PROJECT_STATUS.md (see its own format rules).
3. Append CHANGELOG.md entry.
4. Record any Tier 2 decisions in DECISION_LOG.md.
5. Confirm build passes. End session.

## Budget Rule (limit-aware sessions)

Because sessions can be cut off by usage limits:
- **Front-load risk**: do the uncertain/hard part of an item first.
- **Checkpoint every 20–30 minutes of work**: commit + one-line status note.
- If you estimate the remaining work exceeds the remaining session, stop building and run Phase 5 early. A clean handoff beats a bigger diff.

## Prohibited in Any Session
- Starting a second backlog item while the first is un-checkpointed.
- Force-pushing or rewriting published history.
- Editing 05_SECURITY documents (propose changes via DECISION_LOG.md instead).
- Deleting failing tests to get green.
