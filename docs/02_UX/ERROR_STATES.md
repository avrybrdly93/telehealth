---
title: Error States
status: Active
authority: UX
owner: Engineering
dependencies:
  - COPY_GUIDELINES.md
  - USER_FLOWS.md
review_cycle: Quarterly
---

# Error States

Principle: an error is a moment of maximum anxiety for our users. Every error state must say (1) what happened, (2) that it's fixable, (3) exactly what to do next — and always leave a human fallback (phone number).

## Error Copy Pattern
`[What happened, plainly]. [What to do]. [Fallback].`
Never: blame ("You entered an invalid…" → prefer "That email doesn't look complete"), codes without translation, dead ends, humor.

## Catalog

| ID | Situation | Treatment |
|---|---|---|
| E-010 | Form field invalid | Inline message under field on blur + on submit; field border + icon + text (no color-only); focus moves to first error; aria-describedby wired |
| E-011 | Required checkbox unchecked (booking Step 3) | Continue stays disabled; inline text explains each requirement; "not in CA" case links FAQ answer about California-only care; never a modal |
| E-020 | Vendor scheduling URL unreachable at handoff | Full-state message: "Our scheduling system isn't responding right now. Please call [number] to book, or try again in a few minutes." Retry button + tel: link; crisis strip remains |
| E-030 | Contact form submit fails | Preserve entered text; message: "Your message didn't send. You can try again, or email us directly at [address]." mailto fallback |
| E-040 | 404 | On-brand page (FR-041): "We couldn't find that page." Links: Home, Services, Contact; crisis strip present; logged for weekly review |
| E-041 | 500/unexpected | Static fallback page (must not depend on app JS): apology + phone/email + crisis strip |
| E-050 | JS disabled / failed to load | All content pages fully readable (static rendering, NFR-003); /book shows non-JS fallback: phone booking instructions |
| E-060 | Offline (mobile) | Browser default acceptable for MVP; content pages should be cache-friendly so back navigation works |

## Loading & Empty States
- Loading > 300ms → skeleton (not spinner) matching layout to prevent CLS.
- Loading > 5s on booking handoff → show E-020 treatment proactively.
- No empty states exist in MVP (no user-generated content); if one is introduced, design it in the page spec first.

## Logging Rules
Client errors logged per ../08_OPERATIONS/ANALYTICS_PLAN.md — event name + route only. Never log form field contents (../05_SECURITY/DATA_BOUNDARIES.md).
