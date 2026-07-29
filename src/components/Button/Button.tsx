import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

// Implements COMPONENT_LIBRARY.md#Button.
export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonSize = 'default' | 'large';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: undefined };

type ButtonAsAnchor = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/** Renders an <a> when `href` is given, otherwise a <button>. Loading keeps width locked (no layout shift) via a visually-hidden label. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'default', isLoading = false, children, ...rest } = props;

  const classNames = [
    styles.button,
    styles[variant],
    size === 'large' ? styles.large : '',
    isLoading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, onClick, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <a
        {...anchorRest}
        href={href}
        className={classNames}
        aria-busy={isLoading || undefined}
        aria-disabled={isLoading || undefined}
        onClick={isLoading ? (event) => event.preventDefault() : onClick}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type="button"
      {...buttonRest}
      className={classNames}
      aria-busy={isLoading || undefined}
      disabled={isLoading || buttonRest.disabled}
    >
      {content}
    </button>
  );
}
