---
title: Image Guidelines
status: Active
authority: Design
owner: Product
dependencies:
  - DESIGN_SYSTEM.md
  - ../04_ENGINEERING/PERFORMANCE_BUDGET.md
review_cycle: Quarterly
---

# Image Guidelines

## Principles
Photography must feel real and calm. Our images either show **our actual clinicians** or **quiet, human environments** (light-filled rooms, California landscapes). If an image could appear on any telehealth site, don't use it.

## Banned
- Stock clichés: head-in-hands despair, brain illustrations, pill piles, fake video-call screenshots, white-coat models with stethoscopes (psychiatrists don't wear them), forced-smile "diverse team" stock groups.
- Any image of a real patient or anything implying a specific person is a patient.
- Text baked into images (accessibility + localization).

## Required
- **Provider photos**: professional photos of the actual MD and PMHNP; consistent treatment (same background tone, natural light, warm neutral palette); 4:5 crop for cards, square for schema/OG. Alt text: "Photo of [Name], [Credential]".
- Decorative environment images: muted tones aligned to token palette; alt="".
- OG/social image per page template: 1200×630, brand colors, page title text rendered by build (not hand-made per page).

## Technical (enforced by PERFORMANCE_BUDGET.md)
- Formats: AVIF with WebP fallback; JPEG last resort. No PNG for photos.
- Responsive srcset at 400/800/1200/1600w; explicit width/height attributes (CLS ≤ 0.1).
- Lazy-load everything below the fold; hero image (if any) preloaded, ≤ 120KB.
- Max weight per image as served: 200KB.
- All images self-hosted/CDN — no third-party hotlinks.

## Licensing
Every non-original image needs recorded license (source, license type, date) in an IMAGE_CREDITS file in the repo. No license record → cannot ship.
