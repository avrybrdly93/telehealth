import { defineConfig, devices } from '@playwright/test';

// Implements BL-006 / TESTING_AND_VALIDATION_PLAN.md#E2E — mobile (375px) + desktop projects
// against the static site, served by `astro preview` (the built output, the default and the
// production-fidelity mode) or by `astro dev` when `E2E_SERVER=dev` (BL-040).
//
// Both modes serve the same pages from the same components; they differ in what the failure of
// a test means. `preview` runs the real build output, so it can catch build-time regressions —
// BUG-005's missing `/telehealth` base and BUG-006's `<img src>` were both *built-HTML* bugs
// that a dev server, which resolves `import.meta.env.BASE_URL` identically but never emits a
// dist tree, could still surface but not prove. `dev` runs Vite's transform pipeline, so it is
// the mode that catches a source-level break without waiting on a build. Keeping the suite green
// under both is the point: a spec that only passes in one of them is asserting something about
// the server rather than about the site.
const PORT = Number(process.env.E2E_PORT ?? 3000);
const USE_DEV_SERVER = process.env.E2E_SERVER === 'dev';
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
    command: USE_DEV_SERVER
      ? `pnpm exec astro dev --host 127.0.0.1 --port ${PORT}`
      : `pnpm exec astro preview --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Astro 7's `dev` daemonizes itself when `am-i-vibing` detects a coding-agent environment
    // (`CLAUDECODE` set — see astro/dist/cli/dev/index.js `isRunByAgent`). The command then
    // returns immediately and Playwright, which owns this server's lifecycle, either races the
    // detached process or reports "process exited early" and can never shut it down. Blanking
    // the variable for the child only (an empty value is falsy to `am-i-vibing`'s `checkEnvVar`,
    // and it consults env only — `checkProcesses` is off by default) keeps the server in the
    // foreground where Playwright can supervise and kill it. A no-op wherever the variable is
    // unset, CI included.
    env: { CLAUDECODE: '' },
  },
});
