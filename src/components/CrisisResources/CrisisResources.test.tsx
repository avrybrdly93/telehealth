import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { CrisisResources } from './CrisisResources';

// Implements COMPONENT_LIBRARY.md#CrisisResources — canonical copy verbatim (BL-005 acceptance).
const CANONICAL_TEXT =
  "If you're in crisis or thinking about suicide: call or text 988 (Suicide & Crisis Lifeline), available 24/7. If this is an emergency, call 911.";

function normalizedText(container: HTMLElement) {
  return container.textContent?.replace(/\s+/g, ' ').trim();
}

describe('CrisisResources', () => {
  it('renders the canonical copy verbatim in the footer variant', async () => {
    const { container } = render(<CrisisResources />);
    expect(normalizedText(container)).toBe(CANONICAL_TEXT);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the canonical copy verbatim in the strip variant', async () => {
    const { container } = render(<CrisisResources variant="strip" />);
    expect(normalizedText(container)).toBe(CANONICAL_TEXT);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('wires tel: and sms: links for 988 and tel: for 911', () => {
    render(<CrisisResources />);
    expect(screen.getByRole('link', { name: 'call' })).toHaveAttribute('href', 'tel:988');
    expect(screen.getByRole('link', { name: 'text' })).toHaveAttribute('href', 'sms:988');
    expect(screen.getByRole('link', { name: '911' })).toHaveAttribute('href', 'tel:911');
  });
});
