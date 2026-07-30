import styles from './SiteHeader.module.css';

// Vanilla-JS behavior for SiteHeader.astro (BL-007) — scroll shadow + focus-trapped mobile
// menu (Esc closes, returns focus to toggle). Ships as a plain script, no framework runtime.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initSiteHeader(header: HTMLElement) {
  const toggle = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const toggleLabel = toggle?.querySelector<HTMLElement>('[data-menu-toggle-label]');
  const menu = header.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !toggleLabel || !menu) return;

  function updateScrolled() {
    header.classList.toggle(styles.scrolled, window.scrollY > 0);
  }
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });

  let keydownHandler: ((event: KeyboardEvent) => void) | null = null;

  function closeMenu() {
    menu!.hidden = true;
    toggle!.setAttribute('aria-expanded', 'false');
    toggleLabel!.textContent = 'Menu';
    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  }

  function openMenu() {
    menu!.hidden = false;
    toggle!.setAttribute('aria-expanded', 'true');
    toggleLabel!.textContent = 'Close menu';

    const focusable = Array.from(menu!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    focusable[0]?.focus();

    keydownHandler = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        toggle!.focus();
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
    };
    document.addEventListener('keydown', keydownHandler);
  }

  toggle.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });
}
