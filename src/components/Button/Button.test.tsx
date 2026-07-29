import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

// Implements COMPONENT_LIBRARY.md#Button — five states + keyboard + axe (QUALITY_STANDARD.md).
describe('Button', () => {
  it('renders default, disabled, and loading states without a11y violations', async () => {
    const { container, rerender } = render(<Button>Book an appointment</Button>);
    expect(screen.getByRole('button', { name: 'Book an appointment' })).toBeEnabled();
    expect(await axe(container)).toHaveNoViolations();

    rerender(<Button disabled>Book an appointment</Button>);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<Button isLoading>Book an appointment</Button>);
    const loadingButton = screen.getByRole('button');
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard operable and fires onClick on both click and Enter', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>See pricing</Button>);

    const button = screen.getByRole('button', { name: 'See pricing' });
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('renders as a link when href is given and blocks the click while loading', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { container } = render(
      <Button href="/book" isLoading onClick={handleClick}>
        Continue to scheduling
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Continue to scheduling' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    expect(handleClick).not.toHaveBeenCalled();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies the secondary and text variants', () => {
    const { rerender } = render(<Button variant="secondary">Continue</Button>);
    expect(screen.getByRole('button').className).toMatch(/secondary/);

    rerender(<Button variant="text">Continue</Button>);
    expect(screen.getByRole('button').className).toMatch(/text/);
  });
});
