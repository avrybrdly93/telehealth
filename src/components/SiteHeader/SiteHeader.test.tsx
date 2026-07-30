import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

// Implements COMPONENT_LIBRARY.md#SiteHeader — UX-001 (only Book is button-styled),
// mobile menu focus-trapped + Esc closes + aria-expanded (BL-005 acceptance).
describe('SiteHeader', () => {
  it('renders desktop nav links and the Book button', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(screen.getAllByRole('link', { name: 'Book an appointment' })[0]).toHaveAttribute(
      'href',
      '/book',
    );
  });

  it('marks the current page with aria-current', () => {
    render(<SiteHeader currentPath="/pricing" />);
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Services' })).not.toHaveAttribute('aria-current');
  });

  it('toggles the mobile menu open and closed with correct aria-expanded', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const toggle = screen.getByRole('button', { name: 'Menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Site menu' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the mobile menu on Escape and returns focus to the toggle', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
  });

  it('traps focus within the open mobile menu', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole('button', { name: 'Menu' }));

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll('a[href], button');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    expect(first).toHaveFocus();

    last.focus();
    await user.tab();
    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('is axe-clean when closed and when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<SiteHeader />);
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
