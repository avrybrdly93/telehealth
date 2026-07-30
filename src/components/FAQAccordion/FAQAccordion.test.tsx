import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FAQAccordion } from './FAQAccordion';

// Implements COMPONENT_LIBRARY.md#FAQAccordion.
const ITEMS = [
  { id: 'video-visit', question: 'What happens during a video visit?', answer: 'Answer one.' },
  { id: 'california', question: 'Do I need to be in California?', answer: 'Answer two.' },
];

describe('FAQAccordion', () => {
  it('renders each item as a native disclosure, closed by default', () => {
    render(<FAQAccordion items={ITEMS} />);

    for (const item of ITEMS) {
      const group = screen.getByText(item.question).closest('details');
      expect(group).not.toBeNull();
      expect(group).not.toHaveAttribute('open');
    }
  });

  it('renders answer content in the DOM even before opening (indexable pre-JS)', () => {
    render(<FAQAccordion items={ITEMS} />);
    expect(screen.getByText('Answer one.')).toBeInTheDocument();
    expect(screen.getByText('Answer two.')).toBeInTheDocument();
  });

  it('summaries are natively focusable (keyboard operability)', () => {
    render(<FAQAccordion items={ITEMS} />);

    const [first, second] = screen.getAllByText(/.+/, { selector: 'summary span' });
    const firstSummary = first.closest('summary');
    const secondSummary = second.closest('summary');

    firstSummary?.focus();
    expect(firstSummary).toHaveFocus();
    secondSummary?.focus();
    expect(secondSummary).toHaveFocus();
  });

  it('allows more than one item open at once (click toggles the native disclosure)', async () => {
    const user = userEvent.setup();
    render(<FAQAccordion items={ITEMS} />);

    const [first, second] = screen.getAllByText(/.+/, { selector: 'summary span' });
    const firstDetails = first.closest('details');
    const secondDetails = second.closest('details');

    await user.click(first);
    await user.click(second);

    expect(firstDetails).toHaveAttribute('open');
    expect(secondDetails).toHaveAttribute('open');
  });

  it('is axe-clean', async () => {
    const { container } = render(<FAQAccordion items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
