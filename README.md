---
title: Repository Index
status: Active
authority: Project
owner: Founders
dependencies:
  - docs/00_AI_OPERATING_SYSTEM/MISSION.md
review_cycle: Quarterly
---

# Telehealth Psychiatry — Documentation Operating System

Authoritative documentation for building and maintaining the practice's website. Read docs/00_AI_OPERATING_SYSTEM/MISSION.md for what this repository is and the session contract.

## For AI Agents — Session Entry Point

Every work session:
1. Read `docs/06_PROJECT/PROJECT_STATUS.md`
2. Read `docs/06_PROJECT/BACKLOG.md` — resume In-Progress or take top Ready item
3. Follow `docs/00_AI_OPERATING_SYSTEM/EXECUTION_LOOP.md` (all 5 phases; Phase 5 close-out is mandatory even if cut off mid-item)
4. Claude Code specifics: `docs/04_ENGINEERING/CLAUDE_DEVELOPMENT_PROTOCOL.md` (includes the ~5-sessions/day cadence and CLAUDE.md requirements)

## Map

| Folder | Contents | Start with |
|---|---|---|
| docs/00_AI_OPERATING_SYSTEM | How agents behave: mission, principles, decision tiers, quality gates, session loop, review | MISSION.md |
| docs/01_PRODUCT | Vision, business goals, telehealth spec, MVP scope, personas, journey, FR/NFR/UX requirements | SERVICE_REQUIREMENTS.md |
| docs/02_UX | Research assumptions, IA/routes, flows, copy rules, accessibility standard, error states | USER_FLOWS.md |
| docs/03_DESIGN | Design system, tokens, components, page specs, imagery | DESIGN_TOKENS.md |
| docs/04_ENGINEERING | Architecture, stack, standards, Claude protocol, testing, deployment, performance budgets | ARCHITECTURE.md |
| docs/05_SECURITY | Compliance posture, privacy model, data boundaries (read-only to agents), risk register | DATA_BOUNDARIES.md |
| docs/06_PROJECT | Status, backlog, roadmap, changelog, decision log | PROJECT_STATUS.md |
| docs/07_MARKETING | SEO, content, local search | SEO_STRATEGY.md |
| docs/08_OPERATIONS | Analytics, improvement loop, maintenance | ANALYTICS_PLAN.md |
| templates | Feature, page, decision, bug templates | — |

## Authority & Conflicts
Document authority hierarchy on conflict: 05_SECURITY > 00_AI_OPERATING_SYSTEM > 01_PRODUCT > 02_UX/03_DESIGN > 04_ENGINEERING > others. Full rules: docs/00_AI_OPERATING_SYSTEM/DECISION_FRAMEWORK.md.

## Three Absolute Rules (never overridden by any session goal)
1. No data collection beyond docs/05_SECURITY/DATA_BOUNDARIES.md — propose, don't implement.
2. No edits to crisis-resource copy, pricing, provider credentials, or legal pages without human-approved Tier 3 decisions.
3. Every session ends with the Phase 5 close-out (status, backlog, changelog updated; build green).
