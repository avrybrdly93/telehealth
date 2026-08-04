import { useEffect, useState } from 'react';
import { StepIndicator } from '../StepIndicator/StepIndicator';
import { CrisisResources } from '../CrisisResources/CrisisResources';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { trackEvent } from '../../lib/analytics';
import { withBase } from '../../lib/routes';
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

// Implements USER_FLOWS.md Flow 1, PAGE_SPECIFICATIONS.md §/book, BL-035/036/037,
// DECISION_LOG.md D-013. This item's scope is Steps 1-3 (service selection, provider preference,
// eligibility acknowledgments) — Step 4 (vendor handoff, buildBookingUrl) is BL-021. Step 3's
// "Continue" is deliberately built with no onward navigation yet, same reasoning D-013 §4 gave
// for Step 1 before BL-036 built Step 2 and for Step 2 before BL-037 built Step 3: there is
// nowhere to continue to (no Step 4 content block) until BL-021 lands. Unlike those two cases,
// though, Step 3's Continue button itself IS this item's deliverable — E-011 requires it to exist
// and to be enabled/disabled by validation regardless of what it will eventually navigate to;
// BOOK-02 (TESTING_AND_VALIDATION_PLAN.md) is satisfied by that enabled state (having "arrived at
// Step 4's entry point" per BACKLOG.md's BL-037 row), not by an in-app Step 4 screen — BOOK-01
// (the real vendor-handoff walkthrough) is explicitly BL-021's acceptance criterion, not this
// one's.
export const BOOKING_STEP_LABELS = ['Service', 'Provider', 'Acknowledgments', 'Handoff'];

// "Step" here means "currently visible screen", 1|2|3 for now (grows to include 4 once BL-021
// builds the handoff screen) — distinct from BookingSelection, which only ever holds user-facing
// data (service, provider), never UI/navigation state, per booking-state.ts's doc comment.
type CurrentStep = 1 | 2 | 3;
const STEP_ANALYTICS_VALUE: Record<CurrentStep, BookingStep> = { 1: '1', 2: '2', 3: '3' };

// FR-022/E-011: three explicit, independently-tracked acknowledgments. Deliberately NOT part of
// `BookingSelection` (booking-state.ts) or synced to the URL/sessionStorage — DATA_BOUNDARIES.md
// Boundary 2 only requires these travel to the vendor at handoff (BL-021's job), and UX-011's
// persisted-state guarantee exists so selections "survive a reload or appear in a deep link";
// nothing about "did the user already check this box" needs either, so plain component state
// (reset on reload, same as every other in-memory UI-only flag in this codebase) is correct here,
// not an extension of the persisted-state mechanism.
interface Acknowledgments {
  ca: boolean;
  adult: boolean;
  notEmergency: boolean;
}

const ACKNOWLEDGMENTS_INITIAL: Acknowledgments = { ca: false, adult: false, notEmergency: false };

type AcknowledgmentKey = keyof Acknowledgments;

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
  // Pure UI validation state, not persisted — see the `Acknowledgments` doc comment above.
  const [acknowledgments, setAcknowledgments] = useState<Acknowledgments>(ACKNOWLEDGMENTS_INITIAL);

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

  function goToStep3() {
    setCurrentStep(3);
    syncUrl(selection, 3, true);
  }

  function goBack() {
    // Not a manual setCurrentStep(step - 1): a real history navigation keeps the browser's
    // back/forward stack consistent with what's on screen, so the popstate listener above is the
    // single source of truth for currentStep on every path (every step's "Back" button included),
    // not just hardware back. Used by both Step 2's and Step 3's "Back" buttons.
    window.history.back();
  }

  function toggleAcknowledgment(key: AcknowledgmentKey) {
    setAcknowledgments((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const allAcknowledged =
    acknowledgments.ca && acknowledgments.adult && acknowledgments.notEmergency;

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

          {/* FR-021: skippable, so unlike Step 1's Continue this one is never gated on a
              selection — arriving with no provider chosen is a valid, equal-weight outcome, not
              an incomplete one. */}
          <div className={styles.actions}>
            <Button variant="secondary" onClick={goBack}>
              Back
            </Button>
            <Button onClick={goToStep3}>Continue</Button>
          </div>
        </section>
      )}

      {currentStep === 3 && (
        <section aria-labelledby="booking-step-3-heading">
          <h1 id="booking-step-3-heading" className={styles.heading}>
            Before you continue
          </h1>

          {/* FR-022/E-011: three explicit checkboxes, each unmet one explained inline right where
              it lives — never a modal, never a single generic error only surfaced on submit. */}
          <p className={styles.stepIntro}>Please confirm all three to continue.</p>

          <div className={styles.acknowledgments}>
            <Checkbox
              label="I am located in California at the time of my appointment."
              checked={acknowledgments.ca}
              onChange={() => toggleAcknowledgment('ca')}
              error={
                !acknowledgments.ca && (
                  <>
                    This flow is only for patients located in California at the time of their
                    appointment. Read{' '}
                    <a href={withBase('/faq#getting-started')}>
                      our answer about California-only care
                    </a>
                    .
                  </>
                )
              }
            />
            <Checkbox
              label="I am 18 years of age or older."
              checked={acknowledgments.adult}
              onChange={() => toggleAcknowledgment('adult')}
              error={
                !acknowledgments.adult &&
                'This scheduling flow is only available to patients 18 years of age or older.'
              }
            />
            <Checkbox
              label="I am not currently experiencing a mental health emergency."
              checked={acknowledgments.notEmergency}
              onChange={() => toggleAcknowledgment('notEmergency')}
              error={
                !acknowledgments.notEmergency &&
                'This flow is for non-emergency care only. If this is an emergency, use the crisis resources above.'
              }
            />
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" onClick={goBack}>
              Back
            </Button>
            <Button disabled={!allAcknowledged}>Continue</Button>
          </div>
        </section>
      )}
    </div>
  );
}
