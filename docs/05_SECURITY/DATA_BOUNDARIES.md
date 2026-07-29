---
title: Data Boundaries
status: Active
authority: Security
owner: Founders
dependencies:
  - PRIVACY_MODEL.md
review_cycle: Quarterly
---

# Data Boundaries

This is the most load-bearing document in /docs. The architecture's compliance posture depends on these boundaries holding. Violations are release-blocking regardless of any other consideration.

## Boundary 1 — The site never handles PHI

Prohibited anywhere in this codebase (forms, params, logs, analytics, error reports, test fixtures, code comments):
- Names/identifiers **combined with** health context (a contact form name is fine; a field asking "reason for visit" is not).
- Diagnoses, symptoms, medications, treatment history, appointment records.
- DOB, SSN, insurance IDs, member numbers.
- Any free-text field that invites clinical content. The single message field survives only with the "please don't include medical details" label (FR-030) and non-persistence (PRIVACY_MODEL.md).

If a user volunteers medical details in the contact form anyway: the system's job is unchanged (deliver to practice inbox, store nothing); handling of the received email is a clinical-ops responsibility. The site must never make this more likely (no prompts like "tell us about your symptoms").

## Boundary 2 — Identity data collection belongs to the vendor
The scheduling handoff (FR-023) happens **before** we would need name, DOB, contact, or intake info. Our flow collects only: service type, provider preference, three boolean acknowledgments. If a proposed feature needs more, the feature moves behind the vendor boundary or into Phase 2 — it does not move data to our side.

## Boundary 3 — No persistence layer
No database, no KV store, no file writes of user input, no queue. sessionStorage for flow state only, cleared at handoff. Introducing any persistence = Tier 3 + this document's revision + security review.

## Boundary 4 — Telemetry is aggregate
Analytics events carry: event name, route, device class. Never: input contents, query strings with user data, IP-based precise geo, user IDs. Error logging carries message + route + stack, with input values scrubbed.

## Boundary 5 — Third parties see nothing extra
Every third-party request from a visitor's browser must appear in the CSP allowlist and in PRIVACY_MODEL.md's inventory rationale. Fonts/assets self-hosted (also a performance rule).

## Enforcement
- CI check: forms in codebase diffed against an allowlist of approved field names; new field fails build until this doc is updated via Tier 3.
- E2E assertion: /book network traffic contains no requests with user-entered data except the final vendor navigation.
- Weekly review includes a data-boundary spot check (REVIEW_PROCESS.md).
