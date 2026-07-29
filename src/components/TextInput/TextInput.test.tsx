import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

// Implements COMPONENT_LIBRARY.md#TextInput and ERROR_STATES.md#E-010.
describe('TextInput', () => {
  it('associates a visible label and is keyboard focusable', async () => {
    const user = userEvent.setup();
    const { container } = render(<TextInput label="Email address" />);

    const input = screen.getByLabelText('Email address');
    await user.tab();
    expect(input).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows helper text associated via aria-describedby when there is no error', () => {
    render(<TextInput label="Phone" helperText="We'll only call about your appointment." />);
    const input = screen.getByLabelText('Phone');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    expect(document.getElementById(helperId as string)).toHaveTextContent(
      "We'll only call about your appointment.",
    );
  });

  it('renders an error with icon + text (not color-only), wired via aria-describedby', async () => {
    const { container } = render(
      <TextInput label="Email address" error="That email doesn't look complete." />,
    );
    const input = screen.getByLabelText('Email address');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const describedBy = input.getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      "That email doesn't look complete.",
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disables the field', () => {
    render(<TextInput label="Email address" disabled />);
    expect(screen.getByLabelText('Email address')).toBeDisabled();
  });
});
