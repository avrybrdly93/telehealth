import styles from './FAQAccordion.module.css';

// Implements COMPONENT_LIBRARY.md#FAQAccordion: native <details>/<summary>, no JS required,
// content indexable pre-JS (no display:none until JS runs), chevron rotates via CSS using the
// element's own [open] state. Multiple items may be open at once (not enforced closed).
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className={styles.accordion}>
      {items.map((item) => (
        <details key={item.id} className={styles.item}>
          <summary className={styles.summary}>
            <span className={styles.question}>{item.question}</span>
            <ChevronIcon />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className={styles.chevron}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 7.5l5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
