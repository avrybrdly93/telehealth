---
title: Analytics Plan
status: Active
authority: Operations
owner: Product
dependencies:
  - ../05_SECURITY/DATA_BOUNDARIES.md
  - ../05_SECURITY/PRIVACY_MODEL.md
review_cycle: Quarterly
---

# Analytics Plan

Privacy constraints are prior to measurement desires: cookieless, aggregate, no user-level tracking (PRIVACY_MODEL.md; DATA_BOUNDARIES Boundary 4). We measure the funnel, not the person.

## Event Schema (complete allowlist — adding an event is Tier 2; adding a *property* is Tier 3 if it could carry user data)

| Event | Fired when | Properties |
|---|---|---|
| pageview | Route view (auto) | route, referrer domain, device class |
| cta_book_click | Any Book CTA | source_route, cta_position (hero/nav/footer/inline) |
| booking_step_view | /book step renders | step (1–4) |
| booking_service_selected | Step 1 choice | service (intake/followup) |
| booking_provider_selected | Step 2 choice | provider_slug or "no_preference" |
| booking_handoff | Vendor navigation fired | service, provider_slug/none |
| contact_submit_success / contact_submit_error | Flow 2 outcomes | route only (never field contents) |
| crisis_resource_click | tel/sms 988 or crisis link | source_route |
| error_view | E-020/E-030/E-040 shown | error_id, route |

## KPI Definitions (dashboards built on the above)
- **Booking funnel**: pageview→cta_book_click→step1→step4 handoff; step-over-step conversion; overall visitor→handoff (proxy for BG-002 until vendor confirms) 
- **Vendor reconciliation (human, monthly)**: handoff count vs vendor's confirmed bookings → true BG-002 conversion + show rate for BG-001/004.
- **Content performance**: condition/service page entrances → cta_book_click rate (informs CONTENT_STRATEGY priorities).
- **SEO**: Search Console tracked-query positions (BG-003 set: recorded here at launch by founders).
- **Health signals**: error_view rates; crisis_resource_click is monitored for placement adequacy but NEVER optimized for reduction.

## Review Cadence
Weekly glance (weekly review session includes anomaly check: error spikes, funnel cliffs) · monthly human KPI review → improvement candidates into CONTINUOUS_IMPROVEMENT.md loop.

## Implementation Rules
Single analytics wrapper module (ARCHITECTURE.md extensibility); events tested against this schema (BL-023); no query strings in route property; script deferred, ≤5KB (PERFORMANCE_BUDGET.md).
