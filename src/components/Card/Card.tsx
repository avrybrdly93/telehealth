import type { ReactNode } from 'react';
import styles from './Card.module.css';

// Implements COMPONENT_LIBRARY.md#Card.
interface ServiceCardProps {
  variant: 'service';
  title: string;
  summary: string;
  priceFrom: string;
  href: string;
  linkText: string;
}

interface ProviderCardProps {
  variant: 'provider';
  photoSrc: string;
  photoAlt: string;
  name: string;
  credentialLine: string;
  approach: string;
  href: string;
  linkText: string;
}

interface SelectableCardProps {
  variant: 'selectable';
  id: string;
  name: string;
  value: string;
  title: string;
  description?: string;
  selected: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export type CardProps = ServiceCardProps | ProviderCardProps | SelectableCardProps;

export function Card(props: CardProps) {
  if (props.variant === 'service') return <ServiceCard {...props} />;
  if (props.variant === 'provider') return <ProviderCard {...props} />;
  return <SelectableCard {...props} />;
}

function ServiceCard({ title, summary, priceFrom, href, linkText }: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.summary}>{summary}</p>
      <p className={styles.priceFrom}>From {priceFrom}</p>
      <a className={styles.link} href={href}>
        {linkText}
      </a>
    </article>
  );
}

function ProviderCard({
  photoSrc,
  photoAlt,
  name,
  credentialLine,
  approach,
  href,
  linkText,
}: ProviderCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.photo} src={photoSrc} alt={photoAlt} />
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.credentialLine}>{credentialLine}</p>
      <p className={styles.approach}>{approach}</p>
      <a className={styles.link} href={href}>
        {linkText}
      </a>
    </article>
  );
}

/** Radio semantics; selected state is border + tint + a check icon, never color-only. */
function SelectableCard({
  id,
  name,
  value,
  title,
  description,
  selected,
  onChange,
  disabled,
}: SelectableCardProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const labelClassName = [styles.card, styles.selectableLabel, selected ? styles.selected : '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={labelClassName} htmlFor={id}>
      <input
        className={styles.radio}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        aria-describedby={descriptionId}
        onChange={() => onChange(value)}
      />
      <span className={styles.selectableBody}>
        <span className={styles.selectableTitle}>{title}</span>
        {description && (
          <span id={descriptionId} className={styles.selectableDescription}>
            {description}
          </span>
        )}
      </span>
      {selected && <CheckIcon />}
    </label>
  );
}

function CheckIcon(): ReactNode {
  return (
    <svg
      className={styles.checkIcon}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
