---
title: Review Process
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - QUALITY_STANDARD.md
  - EXECUTION_LOOP.md
review_cycle: Quarterly
---

# Review Process

## Self-Review (every session, before Phase 5)

The agent reviews its own diff as if reviewing a stranger's PR:

1. **Diff read-through**: `git diff main` line by line. Question every line you can't justify from a doc.
2. **Checklist pass**: QUALITY_STANDARD.md Definition of Done.
3. **Adversarial pass** — ask:
   - What happens on slow 3G? On a 375px screen? With JavaScript disabled (for content pages)?
   - Can a keyboard-only user complete this flow?
   - Could this copy be read as a treatment guarantee or medical advice?
   - Does this collect, log, or transmit any data not allowed by DATA_BOUNDARIES.md?
4. **Regression pass**: run the full test suite, not just new tests.

## Weekly Consistency Review (first session after each Monday)

One session per week is a review session instead of a build session:
1. Verify PROJECT_STATUS.md matches reality (build the project, click the deployed site).
2. Scan for doc/code drift: components not in COMPONENT_LIBRARY.md, routes not in INFORMATION_ARCHITECTURE.md, requirements without implementation status.
3. Run Lighthouse + axe on all routes; log regressions as bugs using ../../templates/BUG_TEMPLATE.md.
4. Groom BACKLOG.md: close stale items, re-order priorities, split oversized items.
5. Output: a "Weekly Review" entry in PROJECT_STATUS.md listing findings and created backlog items.

## Human Review Triggers

Flag for human review (mark item "Needs Human Review" in BACKLOG.md) when the change involves:
- Clinical/medical copy, provider credentials, pricing, or legal pages
- Any Tier 3 decision
- Visual changes to the homepage hero or scheduling flow
- Anything the agent is <90% confident satisfies the security docs

## Review Tone

Reviews produce specific, actionable findings ("CTA contrast 3.8:1, needs 4.5:1 — see ACCESSIBILITY.md §Contrast"), never vague notes ("improve accessibility").
