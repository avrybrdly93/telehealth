---
title: Design Tokens
status: Active
authority: Design
owner: Engineering
dependencies:
  - DESIGN_SYSTEM.md
review_cycle: Quarterly
---

# Design Tokens

Single source of truth. Implement as CSS custom properties (and framework theme config mapping to the same values). Changing any token value is a Tier 2 decision.

## Color

| Token | Value | Use |
|---|---|---|
| --color-bg | #FAF9F7 | Page background (warm off-white) |
| --color-surface | #FFFFFF | Cards, form fields |
| --color-ink | #1F2A2E | Primary text (near-black, blue-green cast) |
| --color-ink-soft | #4A5A60 | Secondary text — 7.0:1 on bg |
| --color-primary | #2C5F5D | Deep teal-green: primary buttons, links |
| --color-primary-hover | #234B49 | Hover/active |
| --color-primary-tint | #E7EFEE | Selected states, info backgrounds |
| --color-accent | #C08A5D | Warm ochre: sparing use — active nav marker, blockquote rule. Never for buttons/links |
| --color-error | #A63D2F | Error text/border — 4.9:1 on surface |
| --color-error-bg | #FBEFED | Error field background |
| --color-success | #2F6B44 | Success text |
| --color-focus | #1A73A7 | Focus outlines (distinct from primary) |
| --color-border | #DDD8D2 | Hairlines, input borders (3.1:1 vs surface for inputs — meets UI contrast) |

Rules: primary on white = 6.9:1 (AA for all text sizes). Never introduce a color outside this table without a token + Tier 2 log.

## Typography

Families: `--font-display`: "Source Serif 4", Georgia, serif (headings). `--font-body`: "Inter", system-ui, sans-serif (everything else). Self-host both (PERFORMANCE_BUDGET.md); weights: display 600; body 400, 500, 600 only.

Scale (rem; base 18px body per Persona 2 needs):

| Token | Size/line | Use |
|---|---|---|
| --text-display | 3rem / 1.15 (mobile 2.25rem) | H1, one per page |
| --text-h2 | 2rem / 1.25 (mobile 1.625rem) | Section heads |
| --text-h3 | 1.375rem / 1.35 | Sub-heads, card titles |
| --text-body | 1.125rem / 1.6 | Default prose |
| --text-small | 0.9375rem / 1.5 | Captions, legal, helper text — never below this |

## Spacing (8px scale)
--space-1: 4px · --space-2: 8px · --space-3: 16px · --space-4: 24px · --space-5: 32px · --space-6: 48px · --space-7: 64px · --space-8: 96px. No off-scale values.

## Radii, Shadow, Motion
--radius-s: 6px (inputs, buttons) · --radius-m: 12px (cards) · --radius-full: 999px (pills).
--shadow-1: 0 2px 8px rgba(31,42,46,0.08) — the only shadow.
--motion-fast: 150ms ease-out · --motion-base: 200ms ease-out.

## Breakpoint tokens
--bp-tablet: 640px · --bp-desktop: 1024px (must match DESIGN_SYSTEM.md).
