---
title: Telehealth Service Specification
status: Active
authority: Product
owner: Clinical Team
dependencies:
  - SERVICE_REQUIREMENTS.md
  - ../05_SECURITY/DATA_BOUNDARIES.md
review_cycle: Quarterly
---

# Telehealth Service Specification

## Clinical Services Offered

| Service | Provider(s) | Duration | Modality |
|---|---|---|---|
| Initial psychiatric evaluation (adult) | MD, PMHNP | 60 min | Video |
| Follow-up / medication management | MD, PMHNP | 20–30 min | Video |

Conditions treated (site may list): depression, anxiety disorders, ADHD, bipolar disorder, OCD, PTSD, insomnia. The site describes conditions educationally; it never promises treatment outcomes.

## Service Boundaries (must appear on the site)

- **California residents only.** Patient must be physically located in California at appointment time.
- **Adults 18+** (Phase 1).
- **Not for emergencies.** Every scheduling entry point displays: emergencies → 911; crisis → call/text 988.
- **Out of scope**: court-ordered evaluations, disability paperwork as a standalone service, inpatient care. Controlled-substance policies are stated by providers during care, not adjudicated by the website.

## The Telehealth Encounter (context for the website; the website does not host video)

1. Patient books via the scheduling flow (FR-020 series).
2. Patient receives confirmation with video link from the scheduling/EHR vendor (vendor system, outside MVP codebase).
3. Visit occurs on the vendor's HIPAA-compliant video platform under a signed BAA (vendor obligation — see ../05_SECURITY/SECURITY_AND_COMPLIANCE_PLAN.md).
4. Superbill available on request.

## Website's Role vs Vendor's Role

| Capability | Website (this repo) | Vendor |
|---|---|---|
| Service education, provider bios, pricing | ✔ | |
| Start of scheduling flow (service + provider selection) | ✔ | |
| Slot inventory, booking record, reminders, intake forms, video, payment | | ✔ |
| PHI storage | ✖ never | ✔ under BAA |

The website hands off to the vendor at the earliest point that PHI-adjacent data (reason for visit, DOB, etc.) would be collected. This boundary is normative: see ../05_SECURITY/DATA_BOUNDARIES.md.
