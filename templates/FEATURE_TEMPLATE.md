---
title: Feature Template
status: Active
authority: Project
owner: Product
dependencies:
  - ../docs/06_PROJECT/BACKLOG.md
review_cycle: Quarterly
---

# Feature: [Name]

## Backlog Row (paste into BACKLOG.md)
| ID | Item | Size | Deps | Status | References | Acceptance criteria |
|---|---|---|---|---|---|---|
| BL-xxx | [one-line] | S/M/L | BL-yyy | Ready | [docs to read] | [testable criteria] |

## Problem
Which persona, which journey stage, what friction/goal. Cite PATIENT_PERSONAS.md / PATIENT_JOURNEY.md.

## Requirements Touched
FR/NFR/UX IDs implemented or affected. New requirements? Add them to SERVICE_REQUIREMENTS.md in the same change (Tier depends on content).

## Scope
In: … / Out: … / Explicitly deferred: …

## Data & Privacy Check (mandatory)
- New data collected/stored/transmitted? [none | list → STOP: Tier 3 + DATA_BOUNDARIES review]
- New third-party requests? [none | list → Tier 3]

## Design
Components used (COMPONENT_LIBRARY.md) · new components needed (Tier 2) · page spec updates required.

## Acceptance Criteria (testable, becomes e2e/unit assertions)
- [ ] …
- [ ] a11y: axe-clean, keyboard path verified
- [ ] within performance budget

## Success Metric (post-ship)
Metric, expected direction, measurement window (wire to ANALYTICS_PLAN.md events).
