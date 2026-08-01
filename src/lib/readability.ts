/**
 * Textstat-style readability analysis for patient-facing copy.
 * Implements TECH_STACK.md §Tooling "Readability check" and COPY_GUIDELINES.md
 * §Style Rules ("Reading level ≤ 8th grade for patient-facing pages (UX-002; checked
 * in CI)"). Pure text-processing helpers only — no filesystem access — so they can be
 * unit tested directly; scripts/check-readability.ts wires these to /src/content.
 */

/** COPY_GUIDELINES.md §Style Rules: "Reading level ≤ 8th grade for patient-facing pages." */
export const READABILITY_GRADE_THRESHOLD = 8;

/**
 * Approximate syllable count for a single word, using the common heuristic (vowel-group
 * counting with silent-e/-es/-ed suffix trimming) that textstat-style tools use in place
 * of a dictionary lookup. Approximate by design — good enough to flag copy that reads far
 * above an 8th-grade level, not a linguistically exact syllabifier.
 *
 * @example countSyllablesInWord('appointment') // 3
 */
export function countSyllablesInWord(word: string): number {
  const normalized = word.toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.length === 0) return 0;
  if (normalized.length <= 3) return 1;

  const reduced = normalized.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const vowelGroups = reduced.match(/[aeiouy]{1,2}/g);
  return vowelGroups ? vowelGroups.length : 1;
}

/** Splits text into sentences on `.`/`!`/`?` boundaries, dropping empty fragments. */
export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+(?=\s|$)/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

/** Splits text into word tokens (letters and internal apostrophes only, e.g. "don't"). */
export function splitWords(text: string): string[] {
  return text.match(/[A-Za-z']+/g) ?? [];
}

export interface ReadabilityResult {
  /** Flesch-Kincaid Grade Level. */
  grade: number;
  words: number;
  sentences: number;
  syllables: number;
  avgWordsPerSentence: number;
}

/**
 * Flesch-Kincaid Grade Level over `text`, plus the underlying counts. Returns `null` when
 * there's no analyzable prose (empty/whitespace-only input) rather than a misleading number.
 * Text with no trailing `.`/`!`/`?` is still treated as one (final) sentence.
 *
 * @example analyzeReadability('A video visit is an appointment over live video.')
 */
export function analyzeReadability(text: string): ReadabilityResult | null {
  const words = splitWords(text);
  const sentences = splitSentences(text);
  if (words.length === 0 || sentences.length === 0) return null;

  const syllables = words.reduce((total, word) => total + countSyllablesInWord(word), 0);
  const avgWordsPerSentence = words.length / sentences.length;
  const grade = 0.39 * avgWordsPerSentence + 11.8 * (syllables / words.length) - 15.59;

  return {
    grade,
    words: words.length,
    sentences: sentences.length,
    syllables,
    avgWordsPerSentence,
  };
}

/**
 * Strips common Markdown syntax down to plain prose, so readability stats aren't skewed by
 * `#`/`*`/`[]()` characters that aren't part of the sentence.
 */
export function stripMarkdownSyntax(markdown: string): string {
  return markdown
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]+/g, '')
    .trim();
}

/**
 * Reads a single `key: value` scalar field out of a raw YAML frontmatter block, stripping
 * surrounding quotes if present. Returns `null` if the key is absent or its value is empty —
 * deliberately not a general YAML parser, only the single-line-scalar subset this project's
 * content frontmatter (content.config.ts) actually uses for prose fields.
 */
export function extractFrontmatterValue(frontmatter: string, key: string): string | null {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  if (!match) return null;

  let value = match[1].trim();
  const isDoubleQuoted = value.startsWith('"') && value.endsWith('"');
  const isSingleQuoted = value.startsWith("'") && value.endsWith("'");
  if (isDoubleQuoted || isSingleQuoted) {
    value = value.slice(1, -1);
  }
  return value.length > 0 ? value : null;
}

/**
 * True if `text` contains an unfilled `NEEDS_HUMAN_*`/`PLACEHOLDER_*` token (practice.ts's
 * placeholder convention, CODING_STANDARDS.md §Content Files). Placeholder copy isn't real
 * prose yet and shouldn't be graded for reading level.
 */
export function containsPlaceholder(text: string): boolean {
  return /NEEDS_HUMAN|PLACEHOLDER_/.test(text);
}
