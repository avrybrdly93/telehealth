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

### StepIndicator (BL-035, D-013)
"Step n of 4" + labeled dots. Rendered statically (no `client:*` directive) inside `BookingFlow`,
the hydrated island that owns step state — re-renders as `currentStep` changes, which the status
text's `aria-live="polite" aria-atomic="true"` region picks up automatically (ACCESSIBILITY.md
"Scheduling flow steps announce progress to screen readers"). Only the current step's dot carries
`aria-current="step"`; done/upcoming dots are distinguished visually (filled vs. outlined vs. bare
marker) so state is never color-only. No interactive states — it's a status display, not a
control. Props: `currentStep: number`, `labels: string[]`.

### FAQAccordion (BL-010, D-005)
Native <details>/<summary> based; one open at a time NOT enforced (let users compare); chevron
rotates via CSS on the element's own `[open]` state; content indexable (no display:none until
JS — render open-capable HTML). No client JS — the browser's native disclosure behavior handles
open/close and keyboard operation (Enter/Space on the focused `<summary>`), so this ships zero
script. Focus state: 2px --color-focus outline on `<summary>`, offset 2px. `prefers-reduced-motion`
disables the chevron rotation transition. Props: `items: { id, question, answer }[]`.

### Alert (BL-022, D-009)
Variants `info`/`success` (primary-tint bg, `--color-success` icon for success) / `error`
(error-bg, `--color-error` icon+text). Icon + text always (never color-only). `role="alert"`
(assertive) for `error`; `role="status"` (polite) for `info`/`success` — a background success
message shouldn't interrupt a screen reader mid-sentence the way an assertive announcement would.
No focus/hover/active/disabled states (not interactive); accepts `tabIndex={-1}` + arbitrary HTML
attributes (`hidden`, `id`, `data-*`) via passthrough so a page can render it statically and toggle
visibility/focus with vanilla JS (see ContactForm below). Used for E-020/E-030 full states and
Flow 2's contact-form success state. Props: `variant: 'info' | 'success' | 'error'`.

### ContactForm (BL-022, D-009)
`/contact`'s form (Flow 2, FR-030/031): Name/Email (required) · Phone (optional) · Message
(required, helper text "Please don't include medical details" per FR-030) · honeypot decoy field
(off-screen — not `display:none` — `aria-hidden`, `tabindex="-1"`, never reachable by keyboard or
AT) · submit button · success/error `Alert`s (hidden by default). Composed from
TextInput/TextArea/Button/Alert, server-rendered to static HTML with **no client hydration** —
interactivity (client validation matching E-010's icon+text pattern, honeypot short-circuit,
submit → success/E-030-failure) is a plain script (`ContactForm.client.ts`), the same vanilla-JS-
island pattern BL-007 established for SiteHeader, chosen specifically to stay within
PERFORMANCE_BUDGET.md's 15KB content-page JS budget rather than pay for a React runtime (D-009).
Posts to `/api/contact`, which does not exist yet on this GitHub Pages deployment — see D-009
(Tier 3, Proposed): hosting platform / email vendor undecided. A real submission today correctly
surfaces the E-030 failure state (network 404), not a fabricated success.

### BookingFlow (BL-035/036, D-013)
`/book`'s island shell (Flow 1, FR-020/021/022/024, UX-010/011): renders `StepIndicator`, the
`CrisisResources` `strip` variant + phone alternative (persistent on every step per FR-024), and
the current step's content. **Hydrated React island** (`client:load`) — this codebase's first, per
D-013's reasoning (the `/book`-specific 70KB JS budget in PERFORMANCE_BUDGET.md exists for exactly
this, unlike every vanilla-JS island before it). BL-035 shipped Step 1 (service selection): two
`Card` `selectable` cards ("First appointment (new patient)" / "Follow-up (existing patients)",
FR-020), with the eligibility summary (CA · 18+ · not for emergencies, FR-022 early disclosure)
shown above them, plus a "Continue" button (disabled until a service is chosen). BL-036 adds Step
2 (provider preference, FR-021): `Card` `selectable` cards for each `getCollection('providers')`
entry (name + credential line, passed in as the `providers` prop — content-collection-free, same
`phone`-prop precedent) plus an equal-weight "No preference — earliest available" third option,
deliberately *not* pre-checked on arrival (collapsing "hasn't decided" and "explicitly chose no
preference" into one checked state would misrepresent an undecided visitor as having decided) and
a "Back" button. No Continue-to-Step-3 control yet — same reasoning D-013 gave for Step 1 before
BL-036 built Step 2: there is nowhere to continue to until BL-037 builds Step 3. Step transitions
use real browser history (`pushState` forward, native back navigation via a `popstate` listener
backing both the hardware back button and the in-page "Back" button) so UX-011's "browser back
preserves selections" holds through either path; in-step option changes still use `replaceState`
(BL-035's original reasoning: a same-step refinement isn't a new navigable history entry).
Selection persists to URL params + `sessionStorage` via `lib/booking-state.ts` (never cookies,
UX-011), tracked via `booking_step_view`/`booking_service_selected`/`booking_provider_selected`
(`lib/analytics.ts`) — `booking_step_view` fires on mount and on every step change. Astro
server-renders this island's markup regardless of the `client:load` directive, so a no-JS visitor
already sees real Step 1 content (native radio selection works via ordinary browser behavior) but
cannot reach Step 2 (the Continue button has no `onClick` without hydration); `book.astro`'s
`<noscript>` block (E-050) names this gap. Props: `phone: string`, `providers:
BookingProviderOption[]` (`{ slug, name, credentialLine }`, sorted by `order`).

### Hero (BL-010, D-005)
Homepage-only, above-the-fold section: H1 (naming services + "California"), one-sentence
subheading, primary Button (`size="large"`, links to /book) + secondary text-variant Button
(links to /pricing). No image (PAGE_SPECIFICATIONS.md `/` §1 permits none; omitted to clear the
FR-010 375px fold test). No client JS — server-rendered like Button/Card. Focus/hover/active/
disabled states inherited from Button; heading and body text scale via --text-display/--text-body
tokens, no custom breakpoints beyond Button's own.

### PricingTable (BL-013, D-006)
Semantic `<table>` (not a Card grid — genuinely tabular data): `<caption>` "Appointment types and
pricing", header row (`scope="col"`: Appointment / Duration / Price), one body row per appointment
type with `scope="row"` on the appointment-name cell. No interactive elements, so no focus/hover/
active/disabled states apply and no client JS ships (E-050) — Astro renders it to static HTML like
Card/Hero. Props: `rows: { name, durationLabel, price }[]`. Price cell never renders an asterisk or
"starting at" (COPY_GUIDELINES.md `/pricing` rule; asserted directly in the component's test).

### Breadcrumbs (BL-032, D-011)
Condition pages only (PAGE_SPECIFICATIONS.md `/conditions/[slug]`). `<nav aria-label="Breadcrumb">`
wrapping an `<ol>`; every item but the last is a link, the last renders as plain text with
`aria-current="page"` (it's the current page, not a destination). `/` separators are
`aria-hidden`, decorative only — the DOM order already conveys hierarchy to assistive tech. No
interactive state, no client JS (rendered like Hero/PricingTable, zero hydration). Props:
`items: { label, href? }[]`.

### Also specified in PAGE_SPECIFICATIONS.md where used: SkipLink.

## Adding a Component
1. Confirm no existing component fits (composition first). 2. Tier 2 decision log. 3. Add entry here with states + a11y notes. 4. Implement with tests.
