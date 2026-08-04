import styles from './StepIndicator.module.css';

// Implements COMPONENT_LIBRARY.md#StepIndicator (BL-035, D-013): "Step n of 4" + labeled dots;
// aria-live="polite" announcement on change (ACCESSIBILITY.md "Scheduling flow steps announce
// progress to screen readers"). Rendered statically with no client:* directive of its own — it
// has no interactive state; BookingFlow (the hydrated island around it) re-renders it as
// `currentStep` changes, and the aria-live region below picks up that DOM change automatically.
export interface StepIndicatorProps {
  currentStep: number;
  labels: string[];
}

export function StepIndicator({ currentStep, labels }: StepIndicatorProps) {
  const totalSteps = labels.length;
  const currentLabel = labels[currentStep - 1] ?? '';

  return (
    <div className={styles.wrapper} role="group" aria-label="Booking progress">
      <p className={styles.status} aria-live="polite" aria-atomic="true">
        Step {currentStep} of {totalSteps}: {currentLabel}
      </p>
      <ol className={styles.dots}>
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const state =
            stepNumber === currentStep ? 'current' : stepNumber < currentStep ? 'done' : 'upcoming';
          return (
            <li key={label} className={[styles.dot, styles[state]].filter(Boolean).join(' ')}>
              <span className={styles.dotMarker} aria-hidden="true" />
              <span
                className={styles.dotLabel}
                aria-current={stepNumber === currentStep ? 'step' : undefined}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
