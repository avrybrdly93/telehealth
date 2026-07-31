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
  return (
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
  );
}
