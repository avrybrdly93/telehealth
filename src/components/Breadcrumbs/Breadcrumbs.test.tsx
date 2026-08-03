import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

// Implements COMPONENT_LIBRARY.md#Breadcrumbs, PAGE_SPECIFICATIONS.md `/conditions/[slug]`.
describe('Breadcrumbs', () => {
  const items = [{ label: 'Home', href: '/' }, { label: 'Depression' }];

  it('renders every item, linking all but the current (last) one', () => {
    render(<Breadcrumbs items={items} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');

    expect(screen.queryByRole('link', { name: 'Depression' })).toBeNull();
    const current = screen.getByText('Depression');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('exposes itself as a labeled navigation landmark', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('is axe-clean', async () => {
    const { container } = render(<Breadcrumbs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
