import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Alert.module.css';

// Implements COMPONENT_LIBRARY.md#Alert — info/error/success full-state banner used for
// E-020/E-030 (ERROR_STATES.md) and Flow 2's contact-form success state. Icon + text, never
// color-only. `error` uses an assertive live region (role="alert"); `info`/`success` use a
// polite one (role="status") so a background success message doesn't interrupt a screen reader
// mid-sentence the way an assertive announcement would.
export type AlertVariant = 'info' | 'success' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'role'> {
  variant: AlertVariant;
  children: ReactNode;
}

const ICONS: Record<AlertVariant, ReactNode> = {
  info: (
    <>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="4.75" r="0.9" fill="currentColor" />
    </>
  ),
  success: (
    <>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8.3l2 2 4-4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  error: (
    <>
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
    </>
  ),
};

/** Full-state banner (not an inline field error — see TextInput/TextArea for E-010). */
export function Alert({ variant, children, ...rest }: AlertProps) {
  return (
    <div
      {...rest}
      className={`${styles.alert} ${styles[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <svg
        className={styles.icon}
        width="20"
        height="20"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        {ICONS[variant]}
      </svg>
      <div className={styles.text}>{children}</div>
    </div>
  );
}
