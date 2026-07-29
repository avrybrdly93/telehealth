---
title: Quality Standard
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - ../04_ENGINEERING/TESTING_AND_VALIDATION_PLAN.md
  - ../04_ENGINEERING/PERFORMANCE_BUDGET.md
  - ../02_UX/ACCESSIBILITY.md
review_cycle: Quarterly
---

# Quality Standard

## Definition of Done

A backlog item is DONE only when ALL of the following are true:

### Functional
- [ ] All acceptance criteria in the backlog item pass.
- [ ] Works on mobile viewport (375px) and desktop (1280px).
- [ ] Works in Chrome, Safari, Firefox (latest), and iOS Safari.

### Code
- [ ] Passes lint and type checks with zero errors (../04_ENGINEERING/CODING_STANDARDS.md).
- [ ] New logic has automated tests per TESTING_AND_VALIDATION_PLAN.md.
- [ ] No console errors or warnings in browser.
- [ ] No TODO comments without a linked backlog ID.

### Accessibility (blocking)
- [ ] axe-core automated scan: zero critical/serious violations.
- [ ] Fully keyboard operable; visible focus states.
- [ ] Meets contrast and target-size rules in ../02_UX/ACCESSIBILITY.md.

### Performance (blocking)
- [ ] Within budgets in PERFORMANCE_BUDGET.md (verified via Lighthouse CI).

### Content
- [ ] Patient-facing copy conforms to ../02_UX/COPY_GUIDELINES.md (tone, reading level, no medical advice, no guarantees of outcomes).
- [ ] Crisis resources present where required.

### Process
- [ ] PROJECT_STATUS.md and BACKLOG.md updated.
- [ ] CHANGELOG.md entry added.
- [ ] Repository builds and deploys cleanly.

## Quality Gates by Severity

| Gate | Failure action |
|---|---|
| Build/type/lint errors | Fix before anything else |
| Test failures | Fix or revert the causing change this session |
| Accessibility critical/serious | Blocks merge, no exceptions |
| Performance budget breach | Blocks merge; Tier 2 decision may adjust budget with rationale |
| Copy guideline violation | Blocks merge for clinical-claim issues; otherwise fix-forward within session |

## What "Premium" Means Operationally
- No layout shift on load (CLS ≤ 0.1).
- No lorem ipsum, placeholder images, or "coming soon" pages in production.
- Every interactive element has hover, focus, active, and disabled states.
- Empty states, loading states, and error states are designed, not defaulted (../02_UX/ERROR_STATES.md).
