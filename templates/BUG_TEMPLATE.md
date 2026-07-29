---
title: Bug Template
status: Active
authority: Project
owner: Engineering
dependencies:
  - ../docs/06_PROJECT/BACKLOG.md
review_cycle: Quarterly
---

# BUG-xxx — [Symptom in one line]

- **Severity**: S1 site down / booking or crisis-resources broken (fix immediately, interrupt any session) · S2 flow degraded or a11y-critical (fix this or next session, insert atop backlog milestone) · S3 cosmetic/content (schedule in backlog)
- **Found by**: session / weekly review / monitoring / human report
- **Environment**: production | preview · device/viewport · browser

## Reproduction
1. … (exact steps; include route and viewport)
Expected: … / Actual: …

## Requirement Violated
FR/NFR/UX/E id (if none applies, consider whether a requirement is missing — propose it).

## Root Cause
(filled at fix time — mandatory before closing; "unclear" is not closable)

## Fix
- [ ] Regression test written FIRST, reproducing the bug (TESTING_AND_VALIDATION_PLAN regression policy)
- [ ] Fix implemented · [ ] Full suite green · [ ] CHANGELOG entry
- If S1/S2: note whether rollback was used before fix.
