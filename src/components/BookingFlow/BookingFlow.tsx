import { useEffect, useState } from 'react';
import { StepIndicator } from '../StepIndicator/StepIndicator';
import { CrisisResources } from '../CrisisResources/CrisisResources';
import { Card } from '../Card/Card';
import { trackEvent } from '../../lib/analytics';
import {
  bookingSelectionToParams,
  mergeBookingSelection,
  parseBookingSelection,
  readStoredBookingSelection,
  writeStoredBookingSelection,
  type BookingSelection,
} from '../../lib/booking-state';
import type { BookingService } from '../../lib/analytics';
import styles from './BookingFlow.module.css';

// Implements USER_FLOWS.md Flow 1, PAGE_SPECIFICATIONS.md §/book, BL-035, DECISION_LOG.md D-013.
// This item's scope is Step 1 (service selection) only — Steps 2-4 are BL-036/037/021, which is
// why `currentStep` below is always 1 and there is no "Continue" affordance yet (D-013 §4: there
// is nowhere to continue to until BL-036 builds Step 2).
export const BOOKING_STEP_LABELS = ['Service', 'Provider', 'Acknowledgments', 'Handoff'];

const SERVICE_OPTIONS: { value: BookingService; title: string; description: string }[] = [
  {
    value: 'intake',
    title: 'First appointment (new patient)',
    description: 'Your first visit with the practice.',
  },
  {
    value: 'followup',
    title: 'Follow-up (existing patients)',
    description: 'You have already had an initial evaluation with us.',
  },
];

interface BookingFlowProps {
  /** `PLACEHOLDER_PHONE` from lib/practice.ts — passed as a prop so this island stays server-data-free. */
  phone: string;
}

export function BookingFlow({ phone }: BookingFlowProps) {
  const [selection, setSelection] = useState<BookingSelection>({});

  // Hydrate from URL params (wins, e.g. a Flow 3 deep link `/book?provider=slug`) merged with
  // sessionStorage (UX-011 — never cookies), then re-sync both so they agree. Runs once on mount;
  // window/sessionStorage don't exist during SSR, so this can't run at render time.
  useEffect(() => {
    const fromUrl = parseBookingSelection(new URLSearchParams(window.location.search));
    const fromStorage = readStoredBookingSelection(window.sessionStorage);
    const merged = mergeBookingSelection(fromUrl, fromStorage);
    setSelection(merged);
    trackEvent('booking_step_view', { step: '1' });
  }, []);

  function selectService(service: BookingService) {
    const next: BookingSelection = { ...selection, service };
    setSelection(next);
    writeStoredBookingSelection(window.sessionStorage, next);
    const params = bookingSelectionToParams(next);
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    // replaceState, not pushState: selecting a service is a same-step refinement, not a new
    // navigable history entry (a new entry per click would make browser-back repeatedly re-select
    // stale options instead of leaving the page, per UX-011's "back preserves selections" intent).
    window.history.replaceState(window.history.state, '', url);
    trackEvent('booking_service_selected', { service });
  }

  return (
    <div className={styles.flow}>
      <StepIndicator currentStep={1} labels={BOOKING_STEP_LABELS} />

      <div className={styles.crisisStrip}>
        <CrisisResources variant="strip" />
      </div>
      <p className={styles.phoneAlternative}>
        Prefer to book by phone? Call <a href={`tel:${phone}`}>{phone}</a>.
      </p>

      <section aria-labelledby="booking-step-1-heading">
        <h1 id="booking-step-1-heading" className={styles.heading}>
          What kind of appointment do you need?
        </h1>

        {/* FR-022 early disclosure: eligibility shown up front, not as a rejection at the end. */}
        <p className={styles.eligibility}>
          This flow is for patients located in California, 18 years or older, and not currently
          experiencing an emergency.
        </p>

        <div className={styles.options} role="radiogroup" aria-label="Appointment type">
          {SERVICE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              variant="selectable"
              id={`booking-service-${option.value}`}
              name="booking-service"
              value={option.value}
              title={option.title}
              description={option.description}
              selected={selection.service === option.value}
              onChange={() => selectService(option.value)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
