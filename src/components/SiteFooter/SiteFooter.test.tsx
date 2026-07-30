import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PLACEHOLDER_EMAIL, PLACEHOLDER_PHONE } from '../../lib/practice';
import { SiteFooter } from './SiteFooter';

// Implements COMPONENT_LIBRARY.md#SiteFooter — FR-014, UX-020, GLOBAL-02 (footer on every route).
describe('SiteFooter', () => {
  it('renders the four zones in order: nav, contact, crisis, legal', () => {
    render(<SiteFooter />);
    const footer = screen.getByRole('contentinfo');
    const zoneTexts = [
      'Services',
      PLACEHOLDER_PHONE,
      'crisis or thinking about suicide',
      'Privacy Policy',
    ];
    const positions = zoneTexts.map((text) => footer.textContent?.indexOf(text) ?? -1);
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('renders contact links using practice.ts constants', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('link', { name: PLACEHOLDER_PHONE })).toHaveAttribute(
      'href',
      `tel:${PLACEHOLDER_PHONE}`,
    );
    expect(screen.getByRole('link', { name: PLACEHOLDER_EMAIL })).toHaveAttribute(
      'href',
      `mailto:${PLACEHOLDER_EMAIL}`,
    );
  });

  it('states California-only + 18+ eligibility (FR-014) and license disclosure', () => {
    render(<SiteFooter />);
    expect(screen.getByText(/adults \(18\+\)/i)).toBeInTheDocument();
    expect(screen.getByText(/California at the time of their visit/i)).toBeInTheDocument();
    expect(screen.getByText(/Licensed in California/i)).toBeInTheDocument();
  });

  it('includes the crisis resources block with a role', () => {
    render(<SiteFooter />);
    expect(screen.getByRole('note', { name: 'Crisis resources' })).toBeInTheDocument();
  });

  it('is axe-clean', async () => {
    const { container } = render(<SiteFooter />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
