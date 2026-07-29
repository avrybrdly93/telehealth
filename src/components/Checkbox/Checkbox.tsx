import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import styles from './Checkbox.module.css';

// Implements COMPONENT_LIBRARY.md#Checkbox and ERROR_STATES.md#E-011.
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className' | 'type'
> {
  id?: string;
  label: string;
  error?: string;
}

/** 24px box, clickable label. `error` renders inline explanatory text below (never a modal, never color-only). */
export function Checkbox({ id, label, error, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const errorId = `${checkboxId}-error`;

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={checkboxId}>
        <input
          {...rest}
          type="checkbox"
          id={checkboxId}
          className={styles.input}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span className={styles.text}>{label}</span>
      </label>
      {error && (
        <span id={errorId} className={styles.errorText}>
          <svg
            className={styles.errorIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
