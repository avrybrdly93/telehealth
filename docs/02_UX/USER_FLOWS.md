---
title: User Flows
status: Active
authority: UX
owner: Product
dependencies:
  - INFORMATION_ARCHITECTURE.md
  - ../01_PRODUCT/SERVICE_REQUIREMENTS.md
  - ERROR_STATES.md
review_cycle: Monthly
---

# User Flows

## Flow 1 — Booking (primary; implements FR-020…024, UX-010, UX-011)

Step 0 (entry): any "Book an appointment" CTA → /book.
Step 1 — **Service**: choose "First appointment (new patient)" or "Follow-up (existing patients)". Eligibility summary shown here (CA · 18+ · not for emergencies + crisis strip). ➜ FR-020, FR-022 disclosure early.
Step 2 — **Provider preference**: cards for Dr. [MD] and [PMHNP], plus equal-weight "No preference — earliest available". Skippable. ➜ FR-021.
Step 3 — **Acknowledgments**: three explicit checkboxes (in CA at time of visit / 18+ / not an emergency). Unchecked → continue disabled with inline guidance, never a dead end. ➜ FR-022.
Step 4 — **Handoff**: summary of selections + "Continue to secure scheduling" → vendor URL with service/provider parameters. Explain: "You'll finish booking on our secure scheduling partner." ➜ FR-023.

Rules:
- Progress indicator "Step n of 4" on all steps.
- Browser back preserves selections (UX-011). State in URL params or session storage — never cookies.
- Persistent strip on all steps: "In crisis? Call or text 988. Emergencies: 911." + phone alternative "Prefer to book by phone? Call [number]." ➜ FR-024.
- No email/name collected in our flow; the vendor collects identity data under BAA.

Edge cases → ERROR_STATES.md: vendor URL unreachable; user under 18 selects cannot-check; user outside CA.

## Flow 2 — Contact (FR-030/031)
/contact → form (name, email, phone optional, message with "no medical details" helper text) → client validation → submit → success state with expected response time ("within 1 business day") → email delivered to practice inbox. Failure → retry guidance + phone/email fallback (ERROR_STATES.md E-030).

## Flow 3 — Evaluate-then-book (Danielle path)
Any page → Providers → bio → sticky/end-of-page Book CTA → Flow 1 with provider pre-selected (deep link /book?provider=slug pre-fills Step 2).

## Flow 4 — Crisis exit (anti-persona)
Any page → footer/strip crisis block → tel:988 / sms:988 / 911 guidance → optional /faq#emergencies for CA crisis resources list. This flow must never be more than one interaction away. ➜ UX-020.

## Flow Diagrams
Maintain Mermaid diagrams for Flows 1–2 alongside implementation in the repo (docs drift checked in weekly review).
