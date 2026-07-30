import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

// Implements COMPONENT_LIBRARY.md#Hero, PAGE_SPECIFICATIONS.md `/` §1, FR-010.
describe('Hero', () => {
  const props = {
    heading:
      'Psychiatric evaluations and follow-up appointments by video, for adults across California.',
    subheading: "We'll build a plan of care together, starting with a video visit.",
    primaryCtaHref: '/book',
    primaryCtaLabel: 'Book an appointment',
    secondaryCtaHref: '/pricing',
    secondaryCtaLabel: 'See pricing',
  };

  it('renders exactly one h1 naming California, plus primary and secondary CTAs', () => {
    render(<Hero {...props} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/California/);

    const primary = screen.getByRole('link', { name: 'Book an appointment' });
    expect(primary).toHaveAttribute('href', '/book');

    const secondary = screen.getByRole('link', { name: 'See pricing' });
    expect(secondary).toHaveAttribute('href', '/pricing');
  });

  it('uses verb-first, specific button copy (COPY_GUIDELINES.md microcopy)', () => {
    render(<Hero {...props} />);
    expect(screen.queryByRole('link', { name: /^(submit|learn more|click here)$/i })).toBeNull();
  });

  it('is axe-clean', async () => {
    const { container } = render(<Hero {...props} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
