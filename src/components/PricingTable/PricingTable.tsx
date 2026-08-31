import styles from './PricingTable.module.css';

// Implements PAGE_SPECIFICATIONS.md `/pricing` (BL-013): initial evaluation and follow-up
// with exact prices and durations. No asterisks or "starting at" (COPY_GUIDELINES.md).
export interface PricingRow {
  name: string;
  durationLabel: string;
  price: string;
}

interface PricingTableProps {
  rows: PricingRow[];
}

export function PricingTable({ rows }: PricingTableProps) {
  // BUG-009: the price cell is deliberately `white-space: nowrap` (a price must never wrap
  // mid-value), so a long value cannot be made to fit by wrapping and instead widened the whole
  // document — 526px of content in a 375px viewport, i.e. the entire /pricing page scrolled
  // sideways. A scroll container keeps that overflow inside the table where it belongs. It is
  // `role="region"` with a label and `tabIndex={0}` because a scrollable box that only a mouse
  // can pan is an axe `scrollable-region-focusable` violation and, more to the point, unusable
  // from a keyboard.
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex -- the rule's point is that a
     non-interactive element should not sit in the tab order. A scroll container is the standard
     exception: it *is* operable (it pans), and axe's own `scrollable-region-focusable` rule fails
     the opposite choice, so the two linters disagree and the accessibility one is right here.
     Scoped to this one element; re-enabled immediately below. */
  return (
    <div
      className={styles.scroller}
      role="region"
      aria-label="Appointment types and pricing"
      tabIndex={0}
    >
      <table className={styles.table}>
        <caption className={styles.caption}>Appointment types and pricing</caption>
        <thead>
          <tr>
            <th scope="col">Appointment</th>
            <th scope="col">Duration</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <th scope="row">{row.name}</th>
              <td>{row.durationLabel}</td>
              <td className={styles.price}>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
}
