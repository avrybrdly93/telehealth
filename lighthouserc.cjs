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
      url: ['http://127.0.0.1:4321/telehealth/'],
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
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
