import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Alert } from './Alert';

// Implements COMPONENT_LIBRARY.md#Alert and ERROR_STATES.md#E-020/E-030.
describe('Alert', () => {
  it('renders success/info as a polite status region', () => {
    render(<Alert variant="success">Thanks for reaching out.</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Thanks for reaching out.');
  });

  it('renders error as an assertive alert region', () => {
    render(<Alert variant="error">Your message didn't send.</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent("Your message didn't send.");
  });

  it('always renders an icon (never color-only)', () => {
    const { container } = render(<Alert variant="error">Failed</Alert>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('passes through arbitrary attributes (e.g. hidden, data-*, id)', () => {
    render(
      <Alert variant="success" id="contact-success" hidden data-contact-success>
        Sent
      </Alert>,
    );
    const el = screen.getByText('Sent').closest('[role="status"]');
    expect(el).toHaveAttribute('id', 'contact-success');
    expect(el).toHaveAttribute('hidden');
    expect(el).toHaveAttribute('data-contact-success');
  });

  it('is axe-clean for every variant', async () => {
    for (const variant of ['info', 'success', 'error'] as const) {
      const { container, unmount } = render(<Alert variant={variant}>Message</Alert>);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
