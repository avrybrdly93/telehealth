import styles from './CrisisResources.module.css';

// Implements COMPONENT_LIBRARY.md#CrisisResources — copy is canonical, never paraphrased.
// UX-020/FR-024/Flow 4 (USER_FLOWS.md): footer block on every page; compact strip on
// every /book step and /contact.
export type CrisisResourcesVariant = 'footer' | 'strip';

interface CrisisResourcesProps {
  variant?: CrisisResourcesVariant;
}

export function CrisisResources({ variant = 'footer' }: CrisisResourcesProps) {
  const className = variant === 'strip' ? styles.strip : styles.footer;

  return (
    <div className={className} role="note" aria-label="Crisis resources">
      <p className={styles.text}>
        <strong>{"If you're in crisis or thinking about suicide:"}</strong>{' '}
        <a className={styles.link} href="tel:988">
          call
        </a>{' '}
        or{' '}
        <a className={styles.link} href="sms:988">
          text
        </a>{' '}
        <strong>988</strong> (Suicide & Crisis Lifeline), available 24/7.{' '}
        <strong>
          If this is an emergency, call{' '}
          <a className={styles.link} href="tel:911">
            911
          </a>
          .
        </strong>
      </p>
    </div>
  );
}
