import { useEffect, useState } from 'react';
import { StepIndicator } from '../StepIndicator/StepIndicator';
import { CrisisResources } from '../CrisisResources/CrisisResources';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { trackEvent } from '../../lib/analytics';
import {
  bookingSelectionToParams,
  mergeBookingSelection,
  parseBookingSelection,
  readStoredBookingSelection,
  writeStoredBookingSelection,
  type BookingSelection,
} from '../../lib/booking-state';
import type { BookingService, BookingStep } from '../../lib/analytics';
import styles from './BookingFlow.module.css';

// Implements USER_FLOWS.md Flow 1, PAGE_SPECIFICATIONS.md §/book, BL-035/036, DECISION_LOG.md
// D-013. This item's scope is Steps 1-2 (service selection, provider preference) — Steps 3-4 are
// BL-037/021, which is why there is no "Continue" affordance on Step 2 yet (same reasoning D-013
// §4 gave for Step 1 before BL-036 built Step 2: there is nowhere to continue to until BL-037
// builds Step 3).
export const BOOKING_STEP_LABELS = ['Service', 'Provider', 'Acknowledgments', 'Handoff'];

// "Step" here means "currently visible screen", 1|2 for now (grows to 1|2|3|4 as BL-037/021
// land) — distinct from BookingSelection, which only ever holds user-facing data (service,
// provider), never UI/navigation state, per booking-state.ts's doc comment.
type CurrentStep = 1 | 2;
const STEP_ANALYTICS_VALUE: Record<CurrentStep, BookingStep> = { 1: '1', 2: '2' };

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

// FR-021: "No preference" is an equal-weight third option, not a lesser/default-looking one — it
// gets its own selectable Card exactly like the two named providers, not a separate skip control.
// Deliberately not pre-checked before the user interacts (see `selected` below): collapsing
// "hasn't decided yet" and "explicitly chose no preference" into one visually-checked state on
// arrival would misrepresent a choice the user hasn't made.
const NO_PREFERENCE_VALUE = 'none';

/** A provider option this step can render — server-supplied so the island stays content-collection-free (matches BL-035's `phone` prop precedent). */
export interface BookingProviderOption {
  slug: string;
  name: string;
  credentialLine: string;
}

interface BookingFlowProps {
  /** `PLACEHOLDER_PHONE` from lib/practice.ts — passed as a prop so this island stays server-data-free. */
  phone: string;
  /** From `getCollection('providers')` in book.astro, sorted by `order` — same server-data-free reasoning as `phone`. */
  providers: BookingProviderOption[];
}

export function BookingFlow({ phone, providers }: BookingFlowProps) {
  const [selection, setSelection] = useState<BookingSelection>({});
  const [currentStep, setCurrentStep] = useState<CurrentStep>(1);

  // Hydrate from URL params (wins, e.g. a Flow 3 deep link `/book?provider=slug`) merged with
  // sessionStorage (UX-011 — never cookies), then re-sync both so they agree. Runs once on mount;
  // window/sessionStorage don't exist during SSR, so this can't run at render time.
  useEffect(() => {
    const fromUrl = parseBookingSelection(new URLSearchParams(window.location.search));
    const fromStorage = readStoredBookingSelection(window.sessionStorage);
    const merged = mergeBookingSelection(fromUrl, fromStorage);
    setSelection(merged);
  }, []);

  // Fires on mount (currentStep starts at 1) and again whenever step navigation changes it —
  // covers both the Continue/Back buttons and real browser back/forward (the popstate handler
  // below also drives this by updating currentStep).
  useEffect(() => {
    trackEvent('booking_step_view', { step: STEP_ANALYTICS_VALUE[currentStep] });
  }, [currentStep]);

  // Step transitions use real browser history (pushState going forward, native back navigation
  // going back) so the hardware/software back button and this component's own "Back" link are
  // the same mechanism, and UX-011's "browser back preserves selections" holds for either.
  useEffect(() => {
    function onPopState(event: PopStateEvent) {
      const step = (event.state as { step?: CurrentStep } | null)?.step ?? 1;
      setCurrentStep(step);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function syncUrl(next: BookingSelection, step: CurrentStep, push: boolean) {
    const params = bookingSelectionToParams(next);
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    if (push) {
      window.history.pushState({ step }, '', url);
    } else {
      // replaceState, not pushState: selecting an option is a same-step refinement, not a new
      // navigable history entry (a new entry per click would make browser-back repeatedly
      // re-select stale options instead of leaving the step, per UX-011's intent).
      window.history.replaceState({ step }, '', url);
    }
  }

  function selectService(service: BookingService) {
    const next: BookingSelection = { ...selection, service };
    setSelection(next);
    writeStoredBookingSelection(window.sessionStorage, next);
    syncUrl(next, currentStep, false);
    trackEvent('booking_service_selected', { service });
  }

  function selectProvider(providerSlug: string) {
    const next: BookingSelection = { ...selection, provider: providerSlug };
    setSelection(next);
    writeStoredBookingSelection(window.sessionStorage, next);
    syncUrl(next, currentStep, false);
    trackEvent('booking_provider_selected', { provider_slug: providerSlug });
  }

  function goToStep2() {
    setCurrentStep(2);
    syncUrl(selection, 2, true);
  }

  function goToStep1() {
    // Not a manual setCurrentStep(1): a real history navigation keeps the browser's back/forward
    // stack consistent with what's on screen, so the popstate listener above is the single source
    // of truth for currentStep on every path (this button included), not just hardware back.
    window.history.back();
  }

  return (
    <div className={styles.flow}>
      <StepIndicator currentStep={currentStep} labels={BOOKING_STEP_LABELS} />

      <div className={styles.crisisStrip}>
        <CrisisResources variant="strip" />
      </div>
      <p className={styles.phoneAlternative}>
        Prefer to book by phone? Call <a href={`tel:${phone}`}>{phone}</a>.
      </p>

      {currentStep === 1 && (
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

          <div className={styles.actions}>
            <Button onClick={goToStep2} disabled={!selection.service}>
              Continue
            </Button>
          </div>
          {!selection.service && (
            <p className={styles.continueHint}>Select an appointment type above to continue.</p>
          )}
        </section>
      )}

      {currentStep === 2 && (
        <section aria-labelledby="booking-step-2-heading">
          <h1 id="booking-step-2-heading" className={styles.heading}>
            Do you have a provider preference?
          </h1>

          {/* FR-021: optional and skippable — "No preference" carries no wait-time penalty, it's
              simply the third equal-weight option below, not a separate skip control. */}
          <p className={styles.stepIntro}>
            This step is optional. If you don't have a preference, we'll match you with the next
            available provider.
          </p>

          <div className={styles.options} role="radiogroup" aria-label="Provider preference">
            {providers.map((provider) => (
              <Card
                key={provider.slug}
                variant="selectable"
                id={`booking-provider-${provider.slug}`}
                name="booking-provider"
                value={provider.slug}
                title={provider.name}
                description={provider.credentialLine}
                selected={selection.provider === provider.slug}
                onChange={() => selectProvider(provider.slug)}
              />
            ))}
            <Card
              variant="selectable"
              id="booking-provider-none"
              name="booking-provider"
              value={NO_PREFERENCE_VALUE}
              title="No preference — earliest available"
              selected={selection.provider === NO_PREFERENCE_VALUE}
              onChange={() => selectProvider(NO_PREFERENCE_VALUE)}
            />
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={goToStep1}>
              Back
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
