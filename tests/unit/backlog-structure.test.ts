import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * BUG-012 regression guard.
 *
 * `BACKLOG.md` is this repository's authoritative task list, and every session
 * is required to tally its Status column before deciding there is nothing to
 * claim. Three structural defects made that file lie, in two different ways.
 *
 *   1. `BUG-005`'s Item cell quoted a Playwright regex containing a bare
 *      alternation pipe. GFM read it as a cell separator, so the row had eight
 *      cells against a seven-cell header. Cells past the header count are
 *      dropped on render, and a positional parse landed on the Deps cell (an
 *      em dash) instead of the Status cell. Sessions 147-164 each reported that
 *      row as an unexplained "em-dash" bucket; session 165 diagnosed it and
 *      sessions 166-185 parsed around it. Nobody escaped the pipe.
 *   2. A blank line between the `BUG-011` and `BUG-009` rows terminated the
 *      Bugs table, leaving `BUG-009` and `BUG-010` with no header or delimiter
 *      row of their own. GFM rendered them as a paragraph of literal pipes.
 *   3. `BL-039` through `BL-042` each carried a stray eighth cell, so all four
 *      rendered with their Acceptance criteria column dropped.
 *
 * The shared lesson is that a Markdown table degrades silently: it renders
 * *something* either way, and the parse recipe a session inherits can agree
 * with itself for eighteen runs while being wrong. So this guards the file's
 * shape rather than its content — cell counts against each table's own header,
 * and no blank line inside a table.
 *
 * Parsed by hand rather than with a Markdown library, for the same reason
 * `deploy-workflow.test.ts` hand-parses YAML: the repository has no Markdown
 * parser dependency and adding one to count pipes is not worth it.
 */

const backlogPath = resolve(process.cwd(), 'docs/06_PROJECT/BACKLOG.md');

/**
 * Splits a table row on its unescaped pipes and returns the cells between the
 * leading and trailing delimiters.
 *
 * A `\|` is an escaped pipe: GFM renders it as a literal `|` inside the cell
 * rather than treating it as a separator. Splitting on every pipe is precisely
 * the bug this file guards against, so the escape is honoured here by swapping
 * escaped pipes for a sentinel that cannot occur in the source.
 */
function cells(row: string): string[] {
  const SENTINEL = '\u0000';
  const parts = row.replaceAll('\\|', SENTINEL).split('|');
  return parts.slice(1, -1).map((cell) => cell.replaceAll(SENTINEL, '\\|'));
}

const isDelimiterRow = (line: string): boolean => /^\|[\s:-]+(\|[\s:-]+)*\|$/.test(line);
const isTableRow = (line: string): boolean => line.startsWith('|');

interface Table {
  /** 1-indexed line number of the header row, for failure messages. */
  headerLine: number;
  headerCells: number;
  rows: { line: number; source: string }[];
}

/** Finds every GFM table: a header row followed immediately by a delimiter row. */
function parseTables(source: string): Table[] {
  const lines = source.split('\n');
  const tables: Table[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (!isTableRow(lines[i]) || !isDelimiterRow(lines[i + 1] ?? '')) continue;

    const table: Table = {
      headerLine: i + 1,
      headerCells: cells(lines[i]).length,
      rows: [],
    };
    let j = i + 2;
    while (j < lines.length && isTableRow(lines[j])) {
      table.rows.push({ line: j + 1, source: lines[j] });
      j += 1;
    }
    tables.push(table);
    i = j - 1;
  }

  return tables;
}

describe('BACKLOG.md table structure', () => {
  const source = readFileSync(backlogPath, 'utf8');
  const tables = parseTables(source);

  it('finds every milestone table in the file', () => {
    // Five tables today: Bugs plus M1-M4. A new milestone adds one; this is
    // here so that a parse returning zero tables cannot pass the rest of the
    // suite vacuously.
    expect(tables.length).toBeGreaterThanOrEqual(5);
  });

  it('gives every row exactly as many cells as its own header', () => {
    const offenders = tables.flatMap((table) =>
      table.rows
        .filter((row) => cells(row.source).length !== table.headerCells)
        .map(
          (row) =>
            `line ${row.line} (${cells(row.source)[0]?.trim()}): ` +
            `${cells(row.source).length} cells, header at line ${table.headerLine} has ${table.headerCells}`,
        ),
    );

    // A row with too many cells loses its trailing columns on render; one with
    // too few shifts nothing but signals a hand-edit that dropped a separator.
    // An unescaped `|` inside a cell is the usual cause — escape it as `\|`.
    expect(offenders).toEqual([]);
  });

  it('leaves no table row stranded outside a table', () => {
    const lines = source.split('\n');
    const claimed = new Set(
      tables.flatMap((table) => [
        table.headerLine,
        table.headerLine + 1,
        ...table.rows.map((r) => r.line),
      ]),
    );

    const stranded = lines
      .map((line, index) => ({ line: index + 1, source: line }))
      .filter(({ line, source: text }) => isTableRow(text) && !claimed.has(line))
      .map(({ line, source: text }) => `line ${line}: ${text.slice(0, 60)}…`);

    // This is what a blank line inside a table produces: the rows after the gap
    // belong to no header, so GFM emits them as a paragraph of literal pipes.
    expect(stranded).toEqual([]);
  });

  it('resolves BUG-005 to a Done status once escaped pipes are honoured', () => {
    const row = source.split('\n').find((line) => line.startsWith('| BUG-005 |'));
    expect(row).toBeDefined();

    const parsed = cells(row!);
    expect(parsed).toHaveLength(7);
    expect(parsed[4].trim()).toBe('Done');
  });

  it('still defeats a split on every pipe, which is why the recipe must honour escapes', () => {
    // Worth pinning rather than glossing. Escaping the pipe fixes what GFM
    // renders and what an escape-aware parse reads, but `\|` is still a pipe
    // character: a naive `awk -F'|'` sees eight fields here and always will,
    // because the cell legitimately quotes a regex alternation.
    //
    // This session's first draft of BUG-012 claimed the two recipes would
    // agree after the fix. They do not, and the test that asserted it failed.
    // The belief was wrong, not the assertion, so the criterion was corrected
    // and this case records why, per CLAUDE.md's rule against weakening a
    // failing test into agreement.
    const row = source.split('\n').find((line) => line.startsWith('| BUG-005 |'))!;
    expect(row.split('|').slice(1, -1)).toHaveLength(8);
    expect(cells(row)).toHaveLength(7);
  });
});
