import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { PricingTable } from './PricingTable';

// Implements COMPONENT_LIBRARY.md#PricingTable / PAGE_SPECIFICATIONS.md `/pricing`.
describe('PricingTable', () => {
  const rows = [
    { name: 'Initial Psychiatric Evaluation', durationLabel: '60 minutes', price: '$250' },
    { name: 'Follow-up Appointment', durationLabel: '20–30 minutes', price: '$120' },
  ];

  it('renders one row per appointment type with an accessible row header', () => {
    render(<PricingTable rows={rows} />);

    expect(
      screen.getByRole('rowheader', { name: 'Initial Psychiatric Evaluation' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Follow-up Appointment' })).toBeInTheDocument();
    expect(screen.getByText('60 minutes')).toBeInTheDocument();
    expect(screen.getByText('$250')).toBeInTheDocument();
    expect(screen.getByText('20–30 minutes')).toBeInTheDocument();
    expect(screen.getByText('$120')).toBeInTheDocument();
  });

  it('never renders an asterisk or "starting at" near a price (COPY_GUIDELINES.md)', () => {
    render(<PricingTable rows={rows} />);

    expect(screen.queryByText(/\*/)).not.toBeInTheDocument();
    expect(screen.queryByText(/starting at/i)).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<PricingTable rows={rows} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
