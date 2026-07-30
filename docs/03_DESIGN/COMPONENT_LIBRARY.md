---
title: Component Library
status: Active
authority: Design
owner: Engineering
dependencies:
  - DESIGN_TOKENS.md
  - ../02_UX/ACCESSIBILITY.md
  - ../02_UX/ERROR_STATES.md
review_cycle: Monthly
---

# Component Library

Every component used on ≥ 1 production page must have an entry here (props, states, a11y notes). Missing entry = doc drift defect. All components: tokens only, all five interactive states (default/hover/focus/active/disabled), 375px behavior defined.

## Core Components (MVP set)

### Button
Variants: `primary` (bg --color-primary, white text), `secondary` (1.5px primary border, primary text, transparent bg), `text` (underlined link-style). Sizes: default 48px height, large 56px (hero/booking only). Min touch 44px. Focus: 2px --color-focus outline offset 2px. Loading state: spinner replaces label, width locked (no layout shift), aria-busy. Copy rules per COPY_GUIDELINES.md microcopy.

### TextInput / TextArea
Visible label above field (never placeholder-as-label), optional helper text below, error state per E-010 (border --color-error, bg --color-error-bg, icon + message wired via aria-describedby). Height 48px; textarea min 120px.

### Checkbox
24px box, label clickable, used in booking Step 3 acknowledgments. Error/incomplete treatment per E-011.

### Card
Surface bg, radius-m, shadow-1, padding space-5 (space-4 mobile). Variants: `service` (title, 2-line summary, price-from line, text-button link), `provider` (photo 4:5, name, credential line, 1-line approach, link), `selectable` (booking flow: radio semantics, selected = 2px primary border + primary-tint bg — plus check icon, not color-only).

### SiteHeader
Sticky, surface bg, shadow-1 on scroll only. Desktop: logo · nav links · phone (tel:) · Book button. Mobile: logo · Book button · menu toggle → full-screen menu (focus-trapped, Esc closes, aria-expanded). Only the Book button is button-styled (UX-001).

### SiteFooter
Four zones in order: (1) nav links, (2) contact block (tel/mailto), (3) **CrisisResources**, (4) legal links + FR-014 eligibility line + license disclosure.

### CrisisResources (fixed component — copy is canonical, never paraphrased)
> **If you're in crisis or thinking about suicide:** call or text **988** (Suicide & Crisis Lifeline), available 24/7. **If this is an emergency, call 911.**
Renders: footer block on every page; compact strip variant on every /book step and /contact (UX-020, FR-024). tel: and sms: links. Visual weight: calm, clearly bounded (primary-tint bg), never alarming red.

### StepIndicator
"Step n of 4" + labeled dots; aria-live="polite" announcement on change (ACCESSIBILITY.md).

### FAQAccordion
Native <details>/<summary> based; one open at a time NOT enforced (let users compare); chevron rotates; content indexable (no display:none until JS — render open-capable HTML).

### Alert
Variants info (primary-tint) / error (error-bg) / success. Icon + text. Used for E-020/E-030 full states.

### Hero (BL-010, D-005)
Homepage-only, above-the-fold section: H1 (naming services + "California"), one-sentence
subheading, primary Button (`size="large"`, links to /book) + secondary text-variant Button
(links to /pricing). No image (PAGE_SPECIFICATIONS.md `/` §1 permits none; omitted to clear the
FR-010 375px fold test). No client JS — server-rendered like Button/Card. Focus/hover/active/
disabled states inherited from Button; heading and body text scale via --text-display/--text-body
tokens, no custom breakpoints beyond Button's own.

### Also specified in PAGE_SPECIFICATIONS.md where used: PricingTable, SkipLink, Breadcrumbs (condition pages only).

## Adding a Component
1. Confirm no existing component fits (composition first). 2. Tier 2 decision log. 3. Add entry here with states + a11y notes. 4. Implement with tests.
