---
title: Privacy Model
status: Active
authority: Security
owner: Founders
dependencies:
  - DATA_BOUNDARIES.md
review_cycle: Quarterly
---

# Privacy Model

## Philosophy

Visiting a psychiatry website is itself sensitive. A person's presence here can imply health information about them. Therefore we minimize not only what we collect, but what *anyone else* can infer:

1. **Collect nothing by default.** Content pages set no cookies and store nothing.
2. **No third-party surveillance.** No ad pixels (Meta/Google Ads), no fingerprinting, no session recording, no heatmaps, no embedded social widgets, no third-party fonts/CDNs that see visitor IPs. Analytics is cookieless and aggregate-only (ANALYTICS_PLAN.md).
3. **The URL is data.** No health-condition details in query params we generate; the booking flow encodes only service type and provider slug. Referrer-Policy strict-origin-when-cross-origin so condition-page paths don't leak to external sites.
4. **Email is a one-way street.** Contact submissions flow to the practice inbox and are not stored by the site. The form explicitly discourages medical details (FR-030) and the privacy policy explains handling.

## Data Inventory (complete list — anything absent is prohibited)

| Data | Source | Purpose | Storage | Retention |
|---|---|---|---|---|
| Contact form: name, email, phone (opt), message | User | Respond to inquiry | Practice email inbox only | Practice email policy |
| Aggregate analytics: page, referrer domain, device class, country/region | Cookieless script | Funnel + SEO measurement (BG-002/003) | Analytics provider, aggregate | 24 months |
| Server/CDN logs | Platform default | Ops/security | Platform | Platform minimum; no custom logging of bodies ever |
| Booking selections (service, provider) | User | Build vendor handoff URL | sessionStorage only, cleared on handoff | Session |

## User-Facing Commitments (mirrored in the privacy policy page)
- We don't sell or share personal information (CCPA "share" included).
- We don't use advertising trackers.
- What you type in the contact form goes to our practice inbox and nowhere else.
- Scheduling details you provide after the handoff are governed by our scheduling partner's safeguards and our clinical privacy practices (NPP lives with clinical ops, not this site).

## Change Control
Any change to the Data Inventory table = Tier 3 + privacy policy update in the same release.
