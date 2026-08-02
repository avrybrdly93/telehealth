import { CrisisResources } from '../CrisisResources/CrisisResources';
import { PLACEHOLDER_EMAIL, PLACEHOLDER_PHONE } from '../../lib/practice';
import { withBase } from '../../lib/routes';
import styles from './SiteFooter.module.css';

// Implements COMPONENT_LIBRARY.md#SiteFooter — four zones in order: nav links,
// contact block, CrisisResources, legal links + FR-014 eligibility + license disclosure.
const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/providers', label: 'Providers' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/terms', label: 'Terms of Service' },
  { href: '/legal/accessibility', label: 'Accessibility Statement' },
  { href: '/legal/telehealth-consent', label: 'Telehealth Consent' },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.navZone} aria-label="Footer">
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a className={styles.navLink} href={withBase(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.contactZone}>
        <a className={styles.contactLink} href={`tel:${PLACEHOLDER_PHONE}`}>
          {PLACEHOLDER_PHONE}
        </a>
        <a className={styles.contactLink} href={`mailto:${PLACEHOLDER_EMAIL}`}>
          {PLACEHOLDER_EMAIL}
        </a>
      </div>

      <div className={styles.crisisZone}>
        <CrisisResources />
      </div>

      <div className={styles.legalZone}>
        <ul className={styles.legalList}>
          {LEGAL_LINKS.map((link) => (
            <li key={link.href}>
              <a className={styles.legalLink} href={withBase(link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.eligibilityLine}>
          Care is currently available only to adults (18+) located in California at the time of
          their visit.
        </p>
        <p className={styles.licenseLine}>Licensed in California.</p>
      </div>
    </footer>
  );
}
