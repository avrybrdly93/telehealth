#!/usr/bin/env node
/**
 * BL-017: textstat-style readability CI check over patient-facing content.
 * Implements TECH_STACK.md §Tooling "Readability check | textstat-style script in CI
 * over /src/content (UX-002)" and COPY_GUIDELINES.md §Style Rules ("Reading level ≤
 * 8th grade for patient-facing pages... Legal pages exempt").
 *
 * Scope: markdown content collections under src/content/{services,providers,conditions,faq}.
 * Deliberately excludes `legal` (COPY_GUIDELINES.md's explicit exemption) and static prose
 * embedded directly in .astro page templates, which is out of TECH_STACK.md's stated
 * "/src/content" scope for this check — see DECISION_LOG.md D-008 for the conflict this
 * resolves against BACKLOG.md BL-017's looser "patient-facing page/content copy" phrasing.
 *
 * Run: pnpm run check:readability
 */
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import {
  analyzeReadability,
  containsPlaceholder,
  extractFrontmatterValue,
  READABILITY_GRADE_THRESHOLD,
  stripMarkdownSyntax,
} from '../src/lib/readability.ts';

const CONTENT_ROOT = join(import.meta.dirname, '..', 'src', 'content');

// Collection -> patient-facing string frontmatter fields to grade alongside the markdown
// body, per content.config.ts's schemas. `legal` is intentionally absent (exempt).
const PROSE_FIELDS_BY_COLLECTION: Record<string, string[]> = {
  services: ['summary', 'whoItsFor'],
  providers: ['approachStatement'],
  conditions: ['overview', 'howCareHelps'],
  faq: ['question'],
};

type FileStatus = 'pass' | 'fail' | 'skipped';

interface FileResult {
  collection: string;
  slug: string;
  status: FileStatus;
  reason?: string;
  grade?: number;
  avgWordsPerSentence?: number;
}

/** Splits a content file's raw text into its YAML frontmatter block and markdown body. */
function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: '', body: raw };
  return { frontmatter: match[1], body: match[2] };
}

function analyzeFile(collection: string, filePath: string, slug: string): FileResult {
  const raw = readFileSync(filePath, 'utf-8');
  const { frontmatter, body } = splitFrontmatter(raw);

  const proseFields = PROSE_FIELDS_BY_COLLECTION[collection] ?? [];
  const frontmatterProse = proseFields
    .map((field) => extractFrontmatterValue(frontmatter, field))
    .filter((value): value is string => value !== null);

  const bodyProse = stripMarkdownSyntax(body);
  const combined = [...frontmatterProse, bodyProse].join(' ').trim();

  if (combined.length === 0) {
    return { collection, slug, status: 'skipped', reason: 'no prose content found' };
  }
  if (containsPlaceholder(combined)) {
    return {
      collection,
      slug,
      status: 'skipped',
      reason: 'NEEDS_HUMAN/PLACEHOLDER content — not real copy yet',
    };
  }

  const result = analyzeReadability(combined);
  if (result === null) {
    return { collection, slug, status: 'skipped', reason: 'no analyzable sentences' };
  }

  const status: FileStatus = result.grade <= READABILITY_GRADE_THRESHOLD ? 'pass' : 'fail';
  return {
    collection,
    slug,
    status,
    grade: result.grade,
    avgWordsPerSentence: result.avgWordsPerSentence,
    reason:
      status === 'fail'
        ? `grade ${result.grade.toFixed(1)} exceeds threshold ${READABILITY_GRADE_THRESHOLD}`
        : undefined,
  };
}

function collectResults(): FileResult[] {
  const results: FileResult[] = [];
  for (const collection of Object.keys(PROSE_FIELDS_BY_COLLECTION)) {
    const dir = join(CONTENT_ROOT, collection);
    const files = readdirSync(dir).filter((file) => extname(file) === '.md');
    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      results.push(analyzeFile(collection, join(dir, file), slug));
    }
  }
  return results;
}

function report(results: FileResult[]): boolean {
  const collections = Object.keys(PROSE_FIELDS_BY_COLLECTION).join(', ');
  console.log(
    `Readability check (UX-002, Flesch-Kincaid grade <= ${READABILITY_GRADE_THRESHOLD}) ` +
      `over src/content/{${collections}}\n`,
  );

  for (const result of results) {
    const label = `${result.collection}/${result.slug}`;
    if (result.status === 'pass') {
      console.log(
        `  PASS  ${label}  grade ${result.grade!.toFixed(1)}, ` +
          `avg ${result.avgWordsPerSentence!.toFixed(1)} words/sentence`,
      );
    } else if (result.status === 'fail') {
      console.log(`  FAIL  ${label}  ${result.reason}`);
    } else {
      console.log(`  SKIP  ${label}  ${result.reason}`);
    }
  }

  const passed = results.filter((result) => result.status === 'pass');
  const failed = results.filter((result) => result.status === 'fail');
  const skipped = results.filter((result) => result.status === 'skipped');

  console.log(
    `\n${passed.length} passed, ${failed.length} failed, ${skipped.length} skipped ` +
      `(placeholder/no content).`,
  );

  return failed.length === 0;
}

function main(): void {
  const results = collectResults();
  const ok = report(results);
  if (!ok) {
    console.error(
      `\nReadability check failed: one or more files exceed the ` +
        `${READABILITY_GRADE_THRESHOLD}th-grade threshold (COPY_GUIDELINES.md §Style Rules).`,
    );
    process.exit(1);
  }
}

main();
