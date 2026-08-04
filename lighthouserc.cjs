// Implements BL-006 / PERFORMANCE_BUDGET.md — budgets below are transcribed 1:1 from that doc.
// Any change to a numeric threshold here is a budget change and requires the Tier 2/3 process
// PERFORMANCE_BUDGET.md's "Standing Rules" describes; do not edit ad hoc to unblock a build.
//
// Lighthouse (lab) has no first-class INP audit — INP is a field metric. `total-blocking-time`
// is the standard lab proxy for input responsiveness and is asserted in its place.
const KB = 1024;

module.exports = {
  ci: {
    collect: {
      // Must match astro.config.mjs's `base` (GitHub Pages project-site path) — BUG-002.
      // Every shipped route needs its own budget check (PERFORMANCE_BUDGET.md "every route").
      url: [
        'http://127.0.0.1:4321/telehealth/',
        'http://127.0.0.1:4321/telehealth/services/',
        'http://127.0.0.1:4321/telehealth/services/psychiatric-evaluation/',
        'http://127.0.0.1:4321/telehealth/services/medication-management/',
        'http://127.0.0.1:4321/telehealth/conditions/depression/',
        'http://127.0.0.1:4321/telehealth/conditions/anxiety/',
        'http://127.0.0.1:4321/telehealth/conditions/adhd/',
        'http://127.0.0.1:4321/telehealth/providers/',
        'http://127.0.0.1:4321/telehealth/providers/dr-md/',
        'http://127.0.0.1:4321/telehealth/providers/np-pmhnp/',
        'http://127.0.0.1:4321/telehealth/pricing/',
        'http://127.0.0.1:4321/telehealth/about/',
        'http://127.0.0.1:4321/telehealth/your-first-visit/',
        'http://127.0.0.1:4321/telehealth/faq/',
        'http://127.0.0.1:4321/telehealth/book/',
        'http://127.0.0.1:4321/telehealth/contact/',
        'http://127.0.0.1:4321/telehealth/legal/privacy/',
        'http://127.0.0.1:4321/telehealth/legal/terms/',
        'http://127.0.0.1:4321/telehealth/legal/accessibility/',
        'http://127.0.0.1:4321/telehealth/legal/telehealth-consent/',
        // 404.astro builds to a root-level 404.html (not a /404/ folder), per Astro/GitHub Pages'
        // custom-error-page convention — no trailing slash here, matching how routeUrl.ts joins
        // '/404' onto playwright's baseURL (BUG-002).
        'http://127.0.0.1:4321/telehealth/404',
      ],
      startServerCommand: 'pnpm exec astro preview --host 127.0.0.1 --port 4321',
      startServerReadyPattern: 'Local.*4321',
      startServerReadyTimeout: 30000,
      numberOfRuns: 1,
      settings: {
        chromePath: process.env.CHROME_PATH,
        // CI containers commonly run Chrome as root, where the sandbox is unsupported.
        chromeFlags: ['--no-sandbox'],
      },
    },
    assert: {
      // BL-035/DECISION_LOG.md D-013: /book is a hydrated React island (this codebase's first)
      // and gets its own, wider transfer budgets — PERFORMANCE_BUDGET.md's "/book (islands)"
      // column, distinct from every other ("content pages") route. assertMatrix (rather than a
      // single `assertions` block) is required so /book isn't held to the 15KB content-page JS
      // budget it was never meant to fit. The two patterns are mutually exclusive (the catch-all
      // explicitly excludes `/book/`) so no URL is ever checked against conflicting thresholds
      // for the same metric.
      assertMatrix: [
        {
          matchingUrlPattern: '^(?!.*/book/).*$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],

            // Core Web Vitals
            'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 200 }],
            'server-response-time': ['error', { maxNumericValue: 500 }],

            // Transfer budgets — content pages column (PERFORMANCE_BUDGET.md)
            'resource-summary:document:size': ['error', { maxNumericValue: 40 * KB }],
            'resource-summary:stylesheet:size': ['error', { maxNumericValue: 30 * KB }],
            'resource-summary:script:size': ['error', { maxNumericValue: 15 * KB }],
            'resource-summary:font:size': ['error', { maxNumericValue: 120 * KB }],
            'resource-summary:image:size': ['error', { maxNumericValue: 350 * KB }],
            'resource-summary:total:size': ['error', { maxNumericValue: 500 * KB }],
          },
        },
        {
          matchingUrlPattern: '.*/book/.*',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'categories:accessibility': ['error', { minScore: 0.95 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'categories:seo': ['error', { minScore: 0.95 }],

            // Core Web Vitals
            'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 200 }],
            'server-response-time': ['error', { maxNumericValue: 500 }],

            // Transfer budgets — /book (islands) column (PERFORMANCE_BUDGET.md)
            'resource-summary:document:size': ['error', { maxNumericValue: 40 * KB }],
            'resource-summary:stylesheet:size': ['error', { maxNumericValue: 30 * KB }],
            'resource-summary:script:size': ['error', { maxNumericValue: 70 * KB }],
            'resource-summary:font:size': ['error', { maxNumericValue: 120 * KB }],
            'resource-summary:image:size': ['error', { maxNumericValue: 100 * KB }],
            'resource-summary:total:size': ['error', { maxNumericValue: 300 * KB }],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
