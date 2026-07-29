---
title: Design System
status: Active
authority: Design
owner: Product
dependencies:
  - DESIGN_TOKENS.md
  - COMPONENT_LIBRARY.md
  - ../02_UX/ACCESSIBILITY.md
review_cycle: Quarterly
---

# Design System

## Brand Direction

A premium psychiatry practice: closer to a well-designed private clinic than a health-tech startup. Reference quality bar (bar only — never copy): high-end professional-services sites. Reject: teal-gradient telehealth clichés, illustration-heavy "friendly startup" style, hospital-portal density.

Attributes → visual decisions:
- **Calm** → muted palette, generous whitespace (min 96px between page sections on desktop, 64px mobile), no parallax/auto-motion.
- **Human** → warm off-white background (not pure #fff), serif display type for headings, real photography.
- **Trustworthy** → restrained color use (one accent), consistent alignment to grid, visible credentials.
- **Modern** → crisp type scale, subtle depth (1 shadow level), fast interactions (≤ 200ms transitions).

## Layout System
- 12-column fluid grid, max content width 1200px, gutters 24px (16px mobile).
- Breakpoints: 0–639 (mobile), 640–1023 (tablet), 1024+ (desktop). Design mobile-first; every component spec includes 375px behavior.
- Prose measure: 65–75 characters max.
- Vertical rhythm on the 8px spacing scale (DESIGN_TOKENS.md).

## Depth, Motion, Imagery
- Depth: flat surfaces; `shadow-1` only on cards and sticky header. No stacked shadow levels.
- Motion: opacity/transform only, 150–200ms, ease-out; honor prefers-reduced-motion (ACCESSIBILITY.md). No scroll-triggered animation in MVP.
- Imagery rules in IMAGE_GUIDELINES.md.

## Governance
- Tokens (DESIGN_TOKENS.md) are the only source of color/type/space values. Hardcoded values in components are lint errors (CODING_STANDARDS.md).
- New components: Tier 2 decision + entry in COMPONENT_LIBRARY.md before use on a second page.
- Page-level composition rules live in PAGE_SPECIFICATIONS.md.
