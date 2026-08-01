import { describe, expect, it } from 'vitest';
import {
  analyzeReadability,
  containsPlaceholder,
  countSyllablesInWord,
  extractFrontmatterValue,
  splitSentences,
  splitWords,
  stripMarkdownSyntax,
} from './readability';

describe('countSyllablesInWord', () => {
  it('counts short words as one syllable', () => {
    expect(countSyllablesInWord('the')).toBe(1);
    expect(countSyllablesInWord('a')).toBe(1);
    expect(countSyllablesInWord('cat')).toBe(1);
  });

  it('counts multi-syllable words above one', () => {
    expect(countSyllablesInWord('appointment')).toBeGreaterThan(1);
    expect(countSyllablesInWord('psychiatric')).toBeGreaterThan(2);
  });

  it('strips non-letter characters before counting', () => {
    expect(countSyllablesInWord("don't")).toBe(countSyllablesInWord('dont'));
  });

  it('returns 0 for a string with no letters', () => {
    expect(countSyllablesInWord('123')).toBe(0);
  });
});

describe('splitSentences', () => {
  it('splits on sentence-ending punctuation', () => {
    expect(splitSentences('One. Two! Three?')).toEqual(['One', 'Two', 'Three']);
  });

  it('drops empty fragments from consecutive punctuation', () => {
    expect(splitSentences('Wait... really?')).toEqual(['Wait', 'really']);
  });

  it('treats text with no terminator as a single trailing sentence', () => {
    expect(splitSentences('no terminator here')).toEqual(['no terminator here']);
  });

  it('returns an empty array for empty input', () => {
    expect(splitSentences('')).toEqual([]);
  });
});

describe('splitWords', () => {
  it('extracts words and drops standalone punctuation/numbers', () => {
    expect(splitWords('A 60-minute visit, today.')).toEqual(['A', 'minute', 'visit', 'today']);
  });

  it('keeps internal apostrophes for contractions', () => {
    expect(splitWords("You'll leave with a plan.")).toContain("You'll");
  });
});

describe('analyzeReadability', () => {
  it('returns null for empty or whitespace-only text', () => {
    expect(analyzeReadability('')).toBeNull();
    expect(analyzeReadability('   ')).toBeNull();
  });

  it('still analyzes text with no trailing sentence terminator', () => {
    expect(analyzeReadability('no terminator here')).not.toBeNull();
  });

  it('computes plausible counts for a simple sentence', () => {
    const result = analyzeReadability('A video visit is an appointment over live video.');
    expect(result).not.toBeNull();
    expect(result?.sentences).toBe(1);
    expect(result?.words).toBe(9);
    expect(result?.grade).toBeGreaterThan(0);
  });

  it('scores a longer, denser sentence with a higher grade than a short simple one', () => {
    const simple = analyzeReadability('You can talk to your provider by video.');
    const complex = analyzeReadability(
      'Notwithstanding preliminary considerations, the psychiatric evaluation ' +
        'necessitates comprehensive documentation of longitudinal symptomatology.',
    );
    expect(simple).not.toBeNull();
    expect(complex).not.toBeNull();
    expect(complex!.grade).toBeGreaterThan(simple!.grade);
  });
});

describe('stripMarkdownSyntax', () => {
  it('removes headings, list bullets, and blockquote markers', () => {
    const input = '# Heading\n- item one\n> quoted line\nplain text';
    const stripped = stripMarkdownSyntax(input);
    expect(stripped).not.toContain('#');
    expect(stripped).not.toMatch(/^- /m);
    expect(stripped).not.toMatch(/^> /m);
    expect(stripped).toContain('plain text');
  });

  it('converts links to their link text and strips emphasis markers', () => {
    const stripped = stripMarkdownSyntax(
      'See our **[cancellation policy](/pricing)** for details.',
    );
    expect(stripped).toContain('cancellation policy');
    expect(stripped).not.toContain('[');
    expect(stripped).not.toContain('**');
  });
});

describe('extractFrontmatterValue', () => {
  const frontmatter = ['name: Depression', 'summary: "A quoted value"', 'order: 1'].join('\n');

  it('reads an unquoted scalar value', () => {
    expect(extractFrontmatterValue(frontmatter, 'name')).toBe('Depression');
  });

  it('strips surrounding quotes', () => {
    expect(extractFrontmatterValue(frontmatter, 'summary')).toBe('A quoted value');
  });

  it('returns null for a missing key', () => {
    expect(extractFrontmatterValue(frontmatter, 'missing')).toBeNull();
  });
});

describe('containsPlaceholder', () => {
  it('detects the NEEDS_HUMAN placeholder convention', () => {
    expect(containsPlaceholder('NEEDS_HUMAN_PROVIDER_MD_BIO')).toBe(true);
  });

  it('detects the PLACEHOLDER_ convention', () => {
    expect(containsPlaceholder('See PLACEHOLDER_CANCELLATION_POLICY for details.')).toBe(true);
  });

  it('returns false for real prose', () => {
    expect(containsPlaceholder('A video visit is an appointment over live video.')).toBe(false);
  });
});
