import { defineConfig, devices } from '@playwright/test';

// Implements BL-006 / TESTING_AND_VALIDATION_PLAN.md#E2E — mobile (375px) + desktop projects
// against the built static site served by `astro preview`.
const PORT = 4321;
// Must match astro.config.mjs's `base` (GitHub Pages project-site path) — BUG-002. Trailing
// slash matters: tests/e2e/routeUrl.ts joins route paths against this with a leading slash
// stripped, which only appends correctly onto a baseURL that already ends in "/".
export const BASE_URL = `http://127.0.0.1:${PORT}/telehealth/`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-375',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } },
    },
    {
      name: 'desktop-1280',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `pnpm exec astro preview --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
