---
title: Mission
status: Active
authority: Product
owner: Founders
dependencies:
  - PRINCIPLES.md
  - ../01_PRODUCT/PRODUCT_VISION.md
review_cycle: Quarterly
---

# Mission

## What This Repository Is

This repository is the authoritative operating system for building and maintaining the telehealth psychiatry website. Every AI agent session (Claude Code or otherwise) MUST treat these documents as the source of truth. When code and documentation conflict, the documentation wins unless the DECISION_LOG.md records an approved exception.

## The Mission

Build a premium, trustworthy telehealth psychiatry experience that makes it simple for California patients to understand available care, trust the providers, and begin treatment.

## What Success Looks Like

1. A California patient in distress can go from landing page to a booked appointment in under 5 minutes on a phone.
2. The site earns trust through clarity, calm design, and clinical credibility — not marketing pressure.
3. The codebase can be extended to a patient portal, insurance billing, and multi-provider scheduling without rearchitecture.
4. No patient is ever harmed, misled, or exposed by anything this site does.

## Non-Negotiables

- **Patient safety first.** Crisis resources (988 Suicide & Crisis Lifeline, 911) must be visible on every page footer and every scheduling step. See UX-020 in ../01_PRODUCT/SERVICE_REQUIREMENTS.md.
- **No PHI on the marketing site.** The MVP collects only minimal contact/scheduling info. See ../05_SECURITY/DATA_BOUNDARIES.md.
- **No medical advice in site copy.** Educational content only, reviewed against ../02_UX/COPY_GUIDELINES.md.
- **Accessibility is a launch requirement, not a backlog item.** WCAG 2.1 AA. See ../02_UX/ACCESSIBILITY.md.

## Session Contract for AI Agents

Every agent session must:
1. Read PROJECT_STATUS.md and BACKLOG.md before writing code.
2. Work only on the highest-priority unblocked backlog item unless directed otherwise.
3. Follow EXECUTION_LOOP.md end to end, including tests and status updates.
4. Leave the repository in a deployable state at session end.
