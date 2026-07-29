---
title: Accessibility Standard
status: Active
authority: UX
owner: Engineering
dependencies:
  - ../03_DESIGN/DESIGN_TOKENS.md
  - ../04_ENGINEERING/TESTING_AND_VALIDATION_PLAN.md
review_cycle: Quarterly
---

# Accessibility Standard

Target: **WCAG 2.1 AA** across all pages and flows. Accessibility failures classified critical/serious by axe-core block merge (QUALITY_STANDARD.md). This is a clinical-population site: our users disproportionately experience cognitive load, medication side effects affecting focus, and motor/vision differences.

## Blocking Requirements

### Perceivable
- Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large ≥ 24px/19px bold). UI component boundaries ≥ 3:1.
- Never color-only meaning (form errors get icon + text; links in prose are underlined).
- All informative images have specific alt text; decorative images alt="". Provider photos alt = "Photo of [Name], [Credential]".
- Text resizable to 200% without loss; layout uses rem, not px, for type.

### Operable
- Full keyboard operability; logical tab order; no keyboard traps; skip-to-content link first in DOM.
- Visible focus indicator: 2px outline, ≥ 3:1 contrast against adjacent colors, never `outline: none` without replacement.
- Touch targets ≥ 44×44px with ≥ 8px spacing.
- No content flashing; no interaction-blocking animation; honor `prefers-reduced-motion` (all transitions → ≤ 0.01s).
- No time limits anywhere, including the booking flow.

### Understandable
- `lang="en"` set; per-element lang for any non-English text.
- Labels/instructions on all inputs; errors identified in text, associated via aria-describedby, focus moved to first error on submit.
- Navigation consistent across pages (IA doc); components behave consistently.

### Robust
- Semantic HTML first; ARIA only when HTML can't express it. Landmarks: header/nav/main/footer once each.
- Scheduling flow steps announce progress to screen readers (aria-live on step change).
- Test with VoiceOver (iOS/macOS) + NVDA for the booking and contact flows before launch.

## Verification (see TESTING_AND_VALIDATION_PLAN.md)
- CI: axe-core on every route; Lighthouse a11y ≥ 95.
- Manual keyboard + screen-reader script run for Flows 1–2 at launch and after any change to those flows.
- Accessibility Statement page (FR-040) lists conformance status and a contact for barriers.
