import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { PLACEHOLDER_PHONE, PLACEHOLDER_PRACTICE_NAME } from '../../lib/practice';
import styles from './SiteHeader.module.css';

// Implements COMPONENT_LIBRARY.md#SiteHeader and INFORMATION_ARCHITECTURE.md#Global-Navigation.
// Only the Book button is button-styled (UX-001); mobile menu is focus-trapped, Esc closes.
const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/providers', label: 'Providers' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];

const MOBILE_MENU_LINKS = [...NAV_LINKS, { href: '/contact', label: 'Contact' }];

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface SiteHeaderProps {
  currentPath?: string;
}

export function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const menu = menuRef.current;
    const focusable = menu
      ? Array.from(menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  function isCurrent(href: string) {
    return currentPath === href;
  }

  return (
    <header className={[styles.header, isScrolled ? styles.scrolled : ''].join(' ').trim()}>
      <div className={styles.bar}>
        <a className={styles.logo} href="/">
          {PLACEHOLDER_PRACTICE_NAME}
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.desktopNavList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className={styles.navLink}
                  href={link.href}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a className={styles.phone} href={`tel:${PLACEHOLDER_PHONE}`}>
            {PLACEHOLDER_PHONE}
          </a>
          <Button href="/book" size="default">
            Book an appointment
          </Button>
          <button
            ref={toggleButtonRef}
            type="button"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="site-header-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={styles.menuToggleLabel}>{isMenuOpen ? 'Close menu' : 'Menu'}</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="site-header-mobile-menu"
          ref={menuRef}
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav aria-label="Mobile">
            <ul className={styles.mobileNavList}>
              {MOBILE_MENU_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    className={styles.mobileNavLink}
                    href={link.href}
                    aria-current={isCurrent(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button href="/book" size="large">
            Book an appointment
          </Button>
        </div>
      )}
    </header>
  );
}
