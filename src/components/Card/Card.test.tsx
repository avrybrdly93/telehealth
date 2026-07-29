import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

// Implements COMPONENT_LIBRARY.md#Card.
describe('Card', () => {
  it('renders the service variant with a link', async () => {
    const { container } = render(
      <Card
        variant="service"
        title="Psychiatric evaluation"
        summary="A thorough first video visit to build your treatment plan."
        priceFrom="$250"
        href="/services/evaluation"
        linkText="See pricing"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Psychiatric evaluation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See pricing' })).toHaveAttribute(
      'href',
      '/services/evaluation',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the provider variant with credential-specific alt text', async () => {
    const { container } = render(
      <Card
        variant="provider"
        photoSrc="/images/dr-md.jpg"
        photoAlt="Photo of Dr. Test Provider, MD"
        name="Dr. Test Provider"
        credentialLine="MD, LIC #000000"
        approach="I focus on collaborative, whole-person psychiatric care."
        href="/providers/dr-md"
        linkText="View bio"
      />,
    );
    expect(screen.getByRole('img', { name: 'Photo of Dr. Test Provider, MD' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the selectable variant with radio semantics, a check icon, and no color-only signal', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { container, rerender } = render(
      <Card
        variant="selectable"
        id="provider-md"
        name="provider"
        value="md"
        title="No preference"
        description="We'll match you with the next available provider."
        selected={false}
        onChange={handleChange}
      />,
    );

    const radio = screen.getByRole('radio', { name: /No preference/ });
    expect(container.querySelector('svg')).not.toBeInTheDocument();

    await user.click(radio);
    expect(handleChange).toHaveBeenCalledWith('md');

    rerender(
      <Card
        variant="selectable"
        id="provider-md"
        name="provider"
        value="md"
        title="No preference"
        description="We'll match you with the next available provider."
        selected
        onChange={handleChange}
      />,
    );
    expect(screen.getByRole('radio')).toBeChecked();
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('is keyboard operable for the selectable variant', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Card
        variant="selectable"
        id="provider-pmhnp"
        name="provider"
        value="pmhnp"
        title="PMHNP"
        selected={false}
        onChange={handleChange}
      />,
    );

    await user.tab();
    expect(screen.getByRole('radio')).toHaveFocus();
    await user.keyboard(' ');
    expect(handleChange).toHaveBeenCalledWith('pmhnp');
  });
});
