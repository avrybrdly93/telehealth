import styles from './Breadcrumbs.module.css';

// Implements COMPONENT_LIBRARY.md#Breadcrumbs (BL-032, D-011). Rendered statically with no
// client:* directive (same "ships zero JS" treatment as Hero/PricingTable) — it has no
// interactive state, so there is nothing for hydration to add.
export interface BreadcrumbItem {
  label: string;
  /** Omit on the final (current-page) item — it renders as text, not a link. */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {item.href ? (
              <a className={styles.link} href={item.href}>
                {item.label}
              </a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
