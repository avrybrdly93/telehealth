---
title: Performance Budget
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - TECH_STACK.md
  - ../03_DESIGN/IMAGE_GUIDELINES.md
review_cycle: Quarterly
---

# Performance Budget

Budgets are CI-enforced (Lighthouse CI) and blocking (QUALITY_STANDARD.md). Test condition: emulated mobile, Slow 4G, mid-tier device throttling.

## Core Web Vitals (every route)

| Metric | Budget |
|---|---|
| LCP | ≤ 2.0s |
| CLS | ≤ 0.1 |
| INP | ≤ 200ms |
| TTFB (CDN) | ≤ 500ms |

## Lighthouse Scores (mobile, every route)
Performance ≥ 90 · Accessibility ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95.

## Transfer Budgets (per route, compressed)

| Resource | Content pages | /book (islands) |
|---|---|---|
| HTML | ≤ 40KB | ≤ 40KB |
| CSS | ≤ 30KB | ≤ 30KB |
| JS | ≤ 15KB | ≤ 70KB |
| Fonts | ≤ 120KB total (2 families, subsetted, woff2, self-hosted, font-display: swap) | same |
| Images | ≤ 350KB initial viewport | ≤ 100KB |
| **Total initial** | ≤ 500KB | ≤ 300KB |

## Standing Rules
- Third-party JS: analytics only, ≤ 5KB, deferred. Any addition is Tier 3.
- No blocking scripts in head; no runtime CSS-in-JS; no polyfills for evergreen-only features.
- Images per IMAGE_GUIDELINES.md (dimensions set, lazy below fold, AVIF/WebP).
- Budget changes are Tier 2 with rationale; loosening a Core Web Vital is Tier 3.

## Verification Cadence
CI per PR + weekly production Lighthouse run (DEPLOYMENT_AND_OPERATIONS_PLAN.md) + monthly real-device spot check logged in MAINTENANCE_PLAN.md.
