import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

// Implements COMPONENT_LIBRARY.md#Checkbox and ERROR_STATES.md#E-011.
describe('Checkbox', () => {
  it('toggles via a clickable label and via keyboard (space)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container } = render(
      <Checkbox label="I confirm I am located in California" onChange={handleChange} />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'I confirm I am located in California',
    });
    await user.click(screen.getByText('I confirm I am located in California'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toHaveFocus();

    checkbox.blur();
    await user.tab();
    expect(checkbox).toHaveFocus();
    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows E-011 inline error text (not a modal) wired via aria-describedby', async () => {
    const { container } = render(
      <Checkbox
        label="I confirm I am located in California"
        error="This appointment is only available to patients located in California."
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');

    const describedBy = checkbox.getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'This appointment is only available to patients located in California.',
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disables the field', () => {
    render(<Checkbox label="I agree" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('accepts a ReactNode error containing a real link (BL-037 "not in CA" FAQ link)', async () => {
    const { container } = render(
      <Checkbox
        label="I am located in California at the time of my appointment."
        error={
          <>
            This care is only available in California.{' '}
            <a href="/faq#getting-started">our answer about California-only care</a>
          </>
        }
      />,
    );

    const link = screen.getByRole('link', { name: 'our answer about California-only care' });
    expect(link).toHaveAttribute('href', '/faq#getting-started');

    const checkbox = screen.getByRole('checkbox');
    const describedBy = checkbox.getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)).toContainElement(link);
    expect(await axe(container)).toHaveNoViolations();
  });
});
