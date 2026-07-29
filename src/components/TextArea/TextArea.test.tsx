import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TextArea } from './TextArea';

// Implements COMPONENT_LIBRARY.md#TextInput (TextArea) and ERROR_STATES.md#E-010.
describe('TextArea', () => {
  it('associates a visible label and is keyboard focusable', async () => {
    const user = userEvent.setup();
    const { container } = render(<TextArea label="What brings you in?" />);

    const textarea = screen.getByLabelText('What brings you in?');
    await user.tab();
    expect(textarea).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows helper text associated via aria-describedby when there is no error', () => {
    render(<TextArea label="Message" helperText="Please don't include medication names." />);
    const textarea = screen.getByLabelText('Message');
    const helperId = textarea.getAttribute('aria-describedby');
    expect(document.getElementById(helperId as string)).toHaveTextContent(
      "Please don't include medication names.",
    );
  });

  it('renders an error with icon + text, wired via aria-describedby', async () => {
    const { container } = render(<TextArea label="Message" error="Please enter a message." />);
    const textarea = screen.getByLabelText('Message');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    const describedBy = textarea.getAttribute('aria-describedby');
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Please enter a message.',
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('disables the field', () => {
    render(<TextArea label="Message" disabled />);
    expect(screen.getByLabelText('Message')).toBeDisabled();
  });
});
