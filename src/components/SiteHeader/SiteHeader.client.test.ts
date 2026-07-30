import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initSiteHeader } from './SiteHeader.client';

// Implements COMPONENT_LIBRARY.md#SiteHeader — UX-001 (only Book is button-styled),
// mobile menu focus-trapped + Esc closes + aria-expanded (BL-005 acceptance, BL-007 rewrite).
// Exercises initSiteHeader directly against a fixture matching SiteHeader.astro's markup,
// since the component itself is now server-rendered (no React/RTL involved).
function renderFixture() {
  document.body.innerHTML = `
    <header data-site-header>
      <div>
        <a href="/">Practice</a>
        <nav aria-label="Primary">
          <ul>
            <li><a href="/services">Services</a></li>
          </ul>
        </nav>
        <div>
          <button type="button" data-menu-toggle aria-expanded="false" aria-controls="site-header-mobile-menu">
            <span data-menu-toggle-label>Menu</span>
          </button>
        </div>
      </div>
      <div
        id="site-header-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-mobile-menu
        hidden
      >
        <nav aria-label="Mobile">
          <ul>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <a href="/book">Book an appointment</a>
      </div>
    </header>
  `;
  const header = document.querySelector<HTMLElement>('[data-site-header]')!;
  initSiteHeader(header);
  return {
    toggle: document.querySelector<HTMLButtonElement>('[data-menu-toggle]')!,
    menu: document.querySelector<HTMLElement>('[data-mobile-menu]')!,
  };
}

describe('initSiteHeader', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('toggles the mobile menu open and closed with correct aria-expanded', () => {
    const { toggle, menu } = renderFixture();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(menu.hidden).toBe(true);

    toggle.click();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(menu.hidden).toBe(false);
    expect(toggle.textContent).toContain('Close menu');

    toggle.click();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(menu.hidden).toBe(true);
    expect(toggle.textContent).toContain('Menu');
  });

  it('moves focus into the menu on open', () => {
    const { toggle, menu } = renderFixture();
    toggle.click();
    expect(menu.querySelector('a[href="/services"]')).toHaveFocus();
  });

  it('closes the mobile menu on Escape and returns focus to the toggle', () => {
    const { toggle, menu } = renderFixture();
    toggle.click();
    expect(menu.hidden).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menu.hidden).toBe(true);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });

  it('traps focus within the open mobile menu', () => {
    const { toggle, menu } = renderFixture();
    toggle.click();

    const focusable = menu.querySelectorAll<HTMLElement>('a[href]');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    expect(first).toHaveFocus();

    last.focus();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );
    expect(first).toHaveFocus();

    first.focus();
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(last).toHaveFocus();
  });

  describe('scroll shadow', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    });

    it('adds the scrolled class once the page has scrolled', () => {
      renderFixture();
      const header = document.querySelector<HTMLElement>('[data-site-header]')!;
      expect(header.className).toBe('');

      Object.defineProperty(window, 'scrollY', { value: 40, configurable: true });
      window.dispatchEvent(new Event('scroll'));
      expect(header.className).not.toBe('');
    });
  });

  it('is axe-clean when closed and when open', async () => {
    const { toggle } = renderFixture();
    const header = document.querySelector<HTMLElement>('[data-site-header]')!;
    expect(await axe(header)).toHaveNoViolations();

    toggle.click();
    expect(await axe(header)).toHaveNoViolations();
  });
});
