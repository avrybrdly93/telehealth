import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SkipLink } from './SkipLink';

// Implements COMPONENT_LIBRARY.md — SkipLink (also specified in PAGE_SPECIFICATIONS.md).
describe('SkipLink', () => {
  it('links to the default main-content target', async () => {
    const { container } = render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('links to a custom target when provided', () => {
    render(<SkipLink targetId="content" />);
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#content',
    );
  });

  it('is the first focusable element reachable by keyboard', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <a href="/other">Other link</a>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveFocus();
  });
});
