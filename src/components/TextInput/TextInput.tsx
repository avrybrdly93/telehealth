import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import styles from './TextInput.module.css';

// Implements COMPONENT_LIBRARY.md#TextInput and ERROR_STATES.md#E-010.
export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className'
> {
  id?: string;
  label: string;
  helperText?: string;
  error?: string;
}

/** Visible label above the field; error state adds an icon + message (never color-only), wired via aria-describedby. */
export function TextInput({ id, label, helperText, error, required, ...rest }: TextInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const describedBy = [!error && helperText && helperId, error && errorId]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
        {required && (
          <>
            {' '}
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          </>
        )}
      </label>
      <input
        {...rest}
        id={inputId}
        required={required}
        className={`${styles.input} ${error ? styles.hasError : ''}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy || undefined}
      />
      {helperText && !error && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
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
