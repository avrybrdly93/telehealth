import { Button } from '../Button/Button';
import styles from './Hero.module.css';

// Implements COMPONENT_LIBRARY.md#Hero and PAGE_SPECIFICATIONS.md's `/` §1 (FR-010, UX-001):
// H1 value proposition naming services + California + primary Book button + secondary text
// link, all visible above the fold at 375px without scrolling. No image per spec ("no image
// carousel; single calm photo or none") — omitted here to keep the section compact enough to
// clear the FR-010 fold test on small viewports (docs/06_PROJECT/DECISION_LOG.md D-005).
interface HeroProps {
  heading: string;
  subheading: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaLabel: string;
}

export function Hero({
  heading,
  subheading,
  primaryCtaHref,
  primaryCtaLabel,
  secondaryCtaHref,
  secondaryCtaLabel,
}: HeroProps) {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.subheading}>{subheading}</p>
      <div className={styles.actions}>
        <Button href={primaryCtaHref} size="large">
          {primaryCtaLabel}
        </Button>
        <Button href={secondaryCtaHref} variant="text">
          {secondaryCtaLabel}
        </Button>
      </div>
    </section>
  );
}
