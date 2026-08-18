import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * BUG-008 regression guard.
 *
 * Deploy run 113 (`49f1d9c`) failed with:
 *
 *   HttpError: Deployment request failed for 49f1d9c… due to in progress
 *   deployment. Please cancel a5f1631… first or wait for it to complete.
 *
 * The `build` job was green; only `actions/deploy-pages@v4` failed, because run
 * 112's Pages deployment was still in flight 46 seconds earlier. GitHub allows
 * exactly one Pages deployment at a time, and `deploy.yml` had no `concurrency:`
 * block to serialise its runs, so the newer commit's build was discarded.
 *
 * This test cannot prove a deploy succeeds — BUG-007 settled that YAML which
 * parses is not evidence, and the acceptance criterion for BUG-008 is a live
 * green run. What it does prove is that the guard is still there: deleting the
 * `concurrency` block, or flipping `cancel-in-progress` to `true` (which would
 * abort an in-flight deployment mid-upload rather than queue behind it), reds
 * this test instead of silently reintroducing the race months from now.
 *
 * Parsed by hand rather than with a YAML library: the repository has no YAML
 * dependency, and adding one to read three lines is not worth it. The parse is
 * deliberately strict about indentation so that a malformed block fails loudly
 * rather than being read as absent.
 */

// Resolved from the Vitest root (the repository root) rather than from
// import.meta.url: these run in the jsdom environment, where import.meta.url is
// not a file: URL and fileURLToPath rejects it.
const workflowPath = resolve(process.cwd(), '.github/workflows/deploy.yml');

/** Returns the `key: value` pairs nested one level under a top-level YAML key. */
function topLevelBlock(source: string, key: string): Record<string, string> | null {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line === `${key}:`);
  if (start === -1) return null;

  const entries: Record<string, string> = {};
  for (const line of lines.slice(start + 1)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
    // Any line that is not indented ends the block.
    if (!/^\s/.test(line)) break;
    const match = /^ {2}([\w-]+):\s*(.+?)\s*$/.exec(line);
    if (!match) break;
    entries[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
  return entries;
}

describe('deploy.yml (BUG-008)', () => {
  const source = readFileSync(workflowPath, 'utf8');

  it('declares a top-level concurrency block, without which two landings race', () => {
    const occurrences = source.split('\n').filter((line) => line === 'concurrency:').length;
    expect(occurrences).toBe(1);
    expect(topLevelBlock(source, 'concurrency')).not.toBeNull();
  });

  it('serialises on a repository-wide group, because Pages allows one deployment at a time', () => {
    // The group must not be keyed on ref, SHA or run id: the two runs that
    // collided in BUG-008 were both on `main` but were separate runs, and a
    // per-run group would not have serialised them.
    expect(topLevelBlock(source, 'concurrency')?.group).toBe('pages');
  });

  it('queues rather than cancels, so an in-flight deployment is never aborted mid-upload', () => {
    expect(topLevelBlock(source, 'concurrency')?.['cancel-in-progress']).toBe('false');
  });

  it('still has every trigger that can start a deploy, so the fix did not narrow the pipeline', () => {
    // Three trigger paths means overlapping runs are reachable, which is the
    // precondition for BUG-008. Losing one silently would "fix" the race by
    // removing a way to deploy — assert they all survive.
    expect(source).toMatch(/^ {2}push:$/m);
    expect(source).toMatch(/^ {2}workflow_dispatch:$/m);
    expect(source).toMatch(/^ {2}workflow_run:$/m);
  });
});
