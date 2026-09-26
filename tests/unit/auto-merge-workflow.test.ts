import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * BUG-011 regression guard.
 *
 * Two pushes to a single `claude/*` branch queue two runs of
 * `auto-merge-claude.yml`. The `auto-merge-main` concurrency group serialises
 * them, so the second run's job starts only after the first has merged the
 * branch and deleted the ref. The second run then fetched a branch that no
 * longer existed, the fetch failed, and the `Open issue on merge conflict` step
 * fired.
 *
 * That is how issue #6 came to exist. Session 183 landed cleanly — both of its
 * commits (`5d39d2c`, `8a28d60`) are on `main` — and the issue body still told a
 * human "Until merged, new routine runs won't see this branch's work". The one
 * artefact claiming work was stranded was itself proof that none was.
 *
 * Like the BUG-008 guard beside it, this test cannot prove the workflow behaves
 * correctly on a real double push — BUG-007 settled that YAML which parses is
 * not evidence, and BUG-011's acceptance criteria keep the live path explicit.
 * What it proves is that the distinction survives: collapsing "the branch is
 * already gone" back into "the merge failed" reds this test rather than quietly
 * resuming the false issues months from now.
 *
 * Hand-parsed for the same reason as deploy-workflow.test.ts: this repository
 * carries no YAML dependency, and adding one to read a handful of lines is not
 * worth it.
 */

// Resolved from the Vitest root (the repository root) rather than from
// import.meta.url, which is not a file: URL under the jsdom environment.
const workflowPath = resolve(process.cwd(), '.github/workflows/auto-merge-claude.yml');

/** Returns the body of the `run: |` block belonging to the named step. */
function runBlockOf(source: string, stepName: string): string {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === `- name: ${stepName}`);
  if (start === -1) return '';
  const runAt = lines.findIndex((line, i) => i > start && /^\s+run: \|\s*$/.test(line));
  if (runAt === -1) return '';
  const indent = (lines[runAt].match(/^\s*/) ?? [''])[0].length;
  const body: string[] = [];
  for (const line of lines.slice(runAt + 1)) {
    if (line.trim() !== '' && (line.match(/^\s*/) ?? [''])[0].length <= indent) break;
    body.push(line);
  }
  return body.join('\n');
}

/** Returns the `if:` expression guarding the named step, or null. */
function ifGuardOf(source: string, stepName: string): string | null {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === `- name: ${stepName}`);
  if (start === -1) return null;
  for (const line of lines.slice(start + 1)) {
    if (line.trim().startsWith('- name:')) break;
    const match = /^\s+if:\s*(.+?)\s*$/.exec(line);
    if (match) return match[1];
  }
  return null;
}

describe('auto-merge-claude.yml (BUG-011)', () => {
  const source = readFileSync(workflowPath, 'utf8');
  const mergeStep = runBlockOf(source, 'Merge branch into main');

  it('has a mergeable step body to assert against', () => {
    // Guards the parser itself: every assertion below is vacuous on an empty
    // string, so a renamed step must fail loudly here rather than pass silently.
    expect(mergeStep).not.toBe('');
    expect(mergeStep).toContain('git merge --no-edit');
  });

  it('checks the branch still exists before fetching it', () => {
    // The absent-ref case has to be detected before `git fetch` is reached,
    // because it is the fetch's failure that used to be misreported.
    expect(mergeStep).toContain('git ls-remote --exit-code --heads origin');
    const checkAt = mergeStep.indexOf('ls-remote');
    const fetchAt = mergeStep.indexOf('git fetch origin');
    expect(checkAt).toBeGreaterThanOrEqual(0);
    expect(fetchAt).toBeGreaterThanOrEqual(0);
    expect(checkAt).toBeLessThan(fetchAt);
  });

  it('exits zero on an already-landed branch, so no conflict issue is filed', () => {
    // exit 0 is the whole point: a non-zero exit here reaches the issue step.
    expect(mergeStep).toMatch(/already_landed=true/);
    expect(mergeStep).toMatch(/exit 0/);
  });

  it('records already_landed as an explicit output rather than leaving it inferred', () => {
    expect(mergeStep).toMatch(/already_landed=true"?\s*>>\s*"?\$GITHUB_OUTPUT/);
    expect(mergeStep).toMatch(/already_landed=false"?\s*>>\s*"?\$GITHUB_OUTPUT/);
  });

  it('does not delete a branch that was already deleted', () => {
    // `git push origin --delete` against an absent ref fails and would take the
    // job red, so "the merge step succeeded" is no longer sufficient on its own.
    const guard = ifGuardOf(source, 'Delete merged branch');
    expect(guard).not.toBeNull();
    expect(guard).toContain("steps.merge.outcome == 'success'");
    expect(guard).toContain("steps.merge.outputs.already_landed != 'true'");
  });

  it('still opens an issue on a genuine conflict', () => {
    // The fix narrows the trigger; it must not remove it. A real conflict
    // leaving no trace is a worse failure than the false positive this fixes.
    const guard = ifGuardOf(source, 'Open issue on merge conflict');
    expect(guard).toBe("steps.merge.outcome == 'failure'");
    expect(source).toContain('gh issue create');
  });

  it('keeps the concurrency group the absent-ref check depends on', () => {
    // The ls-remote check is only race-free because the earlier run has fully
    // finished before this one starts. Remove or narrow this group and that
    // reasoning goes with it.
    expect(source).toMatch(/^ {2}group: auto-merge-main/m);
    expect(source).toMatch(/^ {2}cancel-in-progress: false/m);
  });
});
