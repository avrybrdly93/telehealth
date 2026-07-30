import styles from './SkipLink.module.css';

// Implements ACCESSIBILITY.md#Operable — skip-to-content link, first in DOM.
interface SkipLinkProps {
  targetId?: string;
}

export function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      Skip to main content
    </a>
  );
}
