---
title: Patient Personas
status: Active
authority: Product
owner: Product
dependencies:
  - PATIENT_JOURNEY.md
  - ../02_UX/UX_RESEARCH_AND_PATIENT_JOURNEY.md
review_cycle: Quarterly
---

# Patient Personas

These personas drive copy, IA, and flow decisions. Every page spec must name which persona(s) it primarily serves.

## Persona 1 — "Maya", the Overwhelmed Professional (primary)
- 32, product manager in LA. Anxiety + suspected ADHD. Self-pay is acceptable if pricing is clear.
- Searches at 11pm on her phone: "adhd psychiatrist california online".
- **Needs**: fast answers on price, provider credibility, how soon she can be seen.
- **Fears**: being judged; opaque costs; getting funneled into a subscription mill.
- **Design implications**: pricing ≤ 2 taps from anywhere (UX-003); provider bios establishing credibility via credentials and approach statement (license numbers removed per DECISION_LOG.md D-014, 2026-08-16); "what happens at your first visit" content; booking possible without phone call.

## Persona 2 — "Robert", the Cautious Parent-of-Self-Advocate (secondary)
- 58, Central Valley, mild tech comfort, long-untreated depression, encouraged by his adult daughter.
- **Needs**: large readable text, plain language, reassurance about talking to a "psychiatrist" vs stigma, phone number as an alternative to web booking.
- **Fears**: technology failing him; being a burden; medication stigma.
- **Design implications**: 18px+ base font, high contrast (ACCESSIBILITY.md), visible phone contact (FR-032), jargon-free service descriptions, generous tap targets.

## Persona 3 — "Danielle", the Researcher Caregiver (influencer, not the patient)
- 41, Bay Area, evaluating options for her spouse. Compares 4–5 practices in one sitting.
- **Needs**: scannable differentiation, credentials verification, FAQ depth (superbills, cancellation policy, medication approach).
- **Design implications**: FAQ page with real policy answers (FR-016), comparison-friendly service pages, About page that explains practice philosophy.

## Anti-Persona
- Person in acute crisis seeking immediate help. We are not built for them — the site's job is to route them to 988/911 quickly and compassionately (UX-020), never into the booking funnel.
