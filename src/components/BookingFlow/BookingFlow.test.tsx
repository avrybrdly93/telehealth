import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setAnalyticsTransport, type AnalyticsEventName } from '../../lib/analytics';
import { BOOKING_SESSION_STORAGE_KEY } from '../../lib/booking-state';
import { BookingFlow, type BookingProviderOption } from './BookingFlow';

// Implements USER_FLOWS.md Flow 1 Steps 1-3, PAGE_SPECIFICATIONS.md §/book, BL-035/036/037,
// D-013, E-011.
const PROVIDERS: BookingProviderOption[] = [
  {
    slug: 'dr-md',
    name: 'NEEDS_HUMAN_PROVIDER_MD_NAME',
    credentialLine: 'MD, NEEDS_HUMAN_PROVIDER_MD_CREDENTIALS',
  },
  {
    slug: 'np-pmhnp',
    name: 'NEEDS_HUMAN_PROVIDER_PMHNP_NAME',
    credentialLine: 'PMHNP, NEEDS_HUMAN_PROVIDER_PMHNP_CREDENTIALS',
  },
];

function renderFlow() {
  return render(<BookingFlow phone="555-0100" providers={PROVIDERS} />);
}

async function selectServiceAndContinue() {
  const user = userEvent.setup();
  await user.click(screen.getByRole('radio', { name: /First appointment/ }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  return user;
}

/** Advances all the way to Step 3 via "No preference" (BOOK-02's path), returning the user handle. */
async function reachStep3ViaNoPreference() {
  const user = await selectServiceAndContinue();
  await user.click(screen.getByRole('radio', { name: /No preference/ }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  return user;
}

async function checkAllAcknowledgments(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('checkbox', { name: /located in California at the time of my appointment/ }),
  );
  await user.click(screen.getByRole('checkbox', { name: /18 years of age or older/ }));
  await user.click(
    screen.getByRole('checkbox', { name: /not currently experiencing a mental health emergency/ }),
  );
}

describe('BookingFlow', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, '', '/book');
  });

  afterEach(() => {
    setAnalyticsTransport(() => {});
  });

  it('renders Step 1 of 4 with both service options and the eligibility summary', () => {
    renderFlow();
    expect(screen.getByText('Step 1 of 4: Service')).toBeInTheDocument();
    expect(screen.getByText('First appointment (new patient)')).toBeInTheDocument();
    expect(screen.getByText('Follow-up (existing patients)')).toBeInTheDocument();
    expect(screen.getByText(/California, 18 years or older/)).toBeInTheDocument();
  });

  it('renders the crisis strip and a phone alternative', () => {
    renderFlow();
    expect(screen.getByRole('note', { name: 'Crisis resources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '555-0100' })).toHaveAttribute('href', 'tel:555-0100');
  });

  it('tracks booking_step_view on mount', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    renderFlow();

    expect(calls).toContainEqual(['booking_step_view', { step: '1' }]);
  });

  it('selecting a service marks it selected and persists to sessionStorage + the URL', async () => {
    const user = userEvent.setup();
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    renderFlow();

    const intakeOption = screen.getByRole('radio', { name: /First appointment/ });
    await user.click(intakeOption);

    expect(intakeOption).toBeChecked();
    expect(calls).toContainEqual(['booking_service_selected', { service: 'intake' }]);
    expect(window.sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY)).toBe(
      JSON.stringify({ service: 'intake' }),
    );
    expect(window.location.search).toBe('?service=intake');
  });

  it('choosing the other option switches the selection instead of allowing both', async () => {
    const user = userEvent.setup();
    renderFlow();

    const intakeOption = screen.getByRole('radio', { name: /First appointment/ });
    const followupOption = screen.getByRole('radio', { name: /Follow-up/ });

    await user.click(intakeOption);
    expect(intakeOption).toBeChecked();

    await user.click(followupOption);
    expect(followupOption).toBeChecked();
    expect(intakeOption).not.toBeChecked();
  });

  it('hydrates an existing selection from sessionStorage on mount', () => {
    window.sessionStorage.setItem(
      BOOKING_SESSION_STORAGE_KEY,
      JSON.stringify({ service: 'followup' }),
    );

    renderFlow();

    expect(screen.getByRole('radio', { name: /Follow-up/ })).toBeChecked();
  });

  it('Step 1 Continue is disabled until a service is selected', async () => {
    const user = userEvent.setup();
    renderFlow();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(continueButton).toBeDisabled();
    expect(screen.getByText(/Select an appointment type above to continue/)).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /First appointment/ }));
    expect(continueButton).toBeEnabled();
  });

  it('is axe-clean on Step 1', async () => {
    const { container } = renderFlow();
    expect(await axe(container)).toHaveNoViolations();
  });

  describe('Step 2 — provider preference', () => {
    it('Continue advances to Step 2, showing both providers and a no-preference option', async () => {
      renderFlow();
      await selectServiceAndContinue();

      expect(screen.getByText('Step 2 of 4: Provider')).toBeInTheDocument();
      expect(screen.getByText('NEEDS_HUMAN_PROVIDER_MD_NAME')).toBeInTheDocument();
      expect(screen.getByText('NEEDS_HUMAN_PROVIDER_PMHNP_NAME')).toBeInTheDocument();
      expect(screen.getByText('No preference — earliest available')).toBeInTheDocument();
      // FR-024: crisis strip persists across steps.
      expect(screen.getByRole('note', { name: 'Crisis resources' })).toBeInTheDocument();
    });

    it('tracks booking_step_view step 2 when Continue is clicked', async () => {
      const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
      setAnalyticsTransport((event, properties) => calls.push([event, properties]));
      renderFlow();

      await selectServiceAndContinue();

      expect(calls).toContainEqual(['booking_step_view', { step: '2' }]);
    });

    it('no provider option is pre-selected on arrival', async () => {
      renderFlow();
      await selectServiceAndContinue();

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).not.toBeChecked();
      }
    });

    it('selecting a provider persists it to sessionStorage + the URL and tracks the event', async () => {
      const user = userEvent.setup();
      const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
      setAnalyticsTransport((event, properties) => calls.push([event, properties]));
      renderFlow();
      await selectServiceAndContinue();

      const mdOption = screen.getByRole('radio', { name: /NEEDS_HUMAN_PROVIDER_MD_NAME/ });
      await user.click(mdOption);

      expect(mdOption).toBeChecked();
      expect(calls).toContainEqual(['booking_provider_selected', { provider_slug: 'dr-md' }]);
      expect(window.sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY)).toBe(
        JSON.stringify({ service: 'intake', provider: 'dr-md' }),
      );
      expect(window.location.search).toBe('?service=intake&provider=dr-md');
    });

    it('explicitly choosing "No preference" is a real selection, not a no-op', async () => {
      const user = userEvent.setup();
      renderFlow();
      await selectServiceAndContinue();

      const noPreference = screen.getByRole('radio', { name: /No preference/ });
      await user.click(noPreference);

      expect(noPreference).toBeChecked();
      expect(window.sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY)).toBe(
        JSON.stringify({ service: 'intake', provider: 'none' }),
      );
    });

    it('the Back button returns to Step 1 with the service selection intact (browser-back path)', async () => {
      const user = userEvent.setup();
      renderFlow();
      await selectServiceAndContinue();

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(screen.getByText('Step 1 of 4: Service')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /First appointment/ })).toBeChecked();
    });

    it('hardware browser back also returns to Step 1 with the selection intact', async () => {
      renderFlow();
      await selectServiceAndContinue();
      expect(screen.getByText('Step 2 of 4: Provider')).toBeInTheDocument();

      window.history.back();
      // popstate fires asynchronously relative to history.back() in jsdom; flush the microtask
      // queue via findBy* so the assertion waits for the listener to run.
      expect(await screen.findByText('Step 1 of 4: Service')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /First appointment/ })).toBeChecked();
    });

    it('is axe-clean on Step 2', async () => {
      const { container } = renderFlow();
      await selectServiceAndContinue();
      expect(await axe(container)).toHaveNoViolations();
    });

    it('Continue advances to Step 3 without requiring a provider selection (FR-021 skippable)', async () => {
      const user = userEvent.setup();
      renderFlow();
      await selectServiceAndContinue();

      await user.click(screen.getByRole('button', { name: 'Continue' }));

      expect(screen.getByText('Step 3 of 4: Acknowledgments')).toBeInTheDocument();
    });

    it('tracks booking_step_view step 3 when Continue is clicked', async () => {
      const user = userEvent.setup();
      const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
      setAnalyticsTransport((event, properties) => calls.push([event, properties]));
      renderFlow();
      await selectServiceAndContinue();

      await user.click(screen.getByRole('button', { name: 'Continue' }));

      expect(calls).toContainEqual(['booking_step_view', { step: '3' }]);
    });
  });

  describe('Step 3 — eligibility acknowledgments (E-011)', () => {
    it('renders three unchecked acknowledgment checkboxes and a disabled Continue', async () => {
      renderFlow();
      await reachStep3ViaNoPreference();

      expect(screen.getByText('Step 3 of 4: Acknowledgments')).toBeInTheDocument();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
      for (const checkbox of checkboxes) {
        expect(checkbox).not.toBeChecked();
      }
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
      // FR-024: crisis strip persists across steps.
      expect(screen.getByRole('note', { name: 'Crisis resources' })).toBeInTheDocument();
    });

    it('shows inline text explaining each unmet requirement, never a modal', async () => {
      renderFlow();
      await reachStep3ViaNoPreference();

      expect(
        screen.getByText(/only for patients located in California at the time of their/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/only available to patients 18 years of age or older/),
      ).toBeInTheDocument();
      expect(screen.getByText(/for non-emergency care only/)).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('the "not in CA" guidance links the real FAQ answer about California-only care', async () => {
      renderFlow();
      await reachStep3ViaNoPreference();

      const faqLink = screen.getByRole('link', { name: 'our answer about California-only care' });
      expect(faqLink).toHaveAttribute('href', '/faq#getting-started');
    });

    it('checking a box clears its own inline guidance without affecting the others', async () => {
      const user = userEvent.setup();
      renderFlow();
      await reachStep3ViaNoPreference();

      await user.click(
        screen.getByRole('checkbox', {
          name: /located in California at the time of my appointment/,
        }),
      );

      expect(
        screen.queryByText(/only for patients located in California at the time of their/),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(/only available to patients 18 years of age or older/),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    });

    it('BOOK-02: completing Steps 1-3 via "No preference" and checking all three enables Continue', async () => {
      const user = userEvent.setup();
      renderFlow();
      await reachStep3ViaNoPreference();

      await checkAllAcknowledgments(user);

      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('BOOK-03: the Back button returns to Step 2 with the provider selection intact', async () => {
      const user = userEvent.setup();
      renderFlow();
      await reachStep3ViaNoPreference();

      await user.click(screen.getByRole('button', { name: 'Back' }));

      expect(screen.getByText('Step 2 of 4: Provider')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /No preference/ })).toBeChecked();
    });

    it('BOOK-03: hardware browser back also returns to Step 2 with the selection intact', async () => {
      renderFlow();
      await reachStep3ViaNoPreference();
      expect(screen.getByText('Step 3 of 4: Acknowledgments')).toBeInTheDocument();

      window.history.back();
      expect(await screen.findByText('Step 2 of 4: Provider')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /No preference/ })).toBeChecked();
    });

    it('acknowledgments are not persisted to sessionStorage or the URL', async () => {
      const user = userEvent.setup();
      renderFlow();
      await reachStep3ViaNoPreference();

      await checkAllAcknowledgments(user);

      expect(window.sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY)).toBe(
        JSON.stringify({ service: 'intake', provider: 'none' }),
      );
      expect(window.location.search).toBe('?service=intake&provider=none');
    });

    it('is axe-clean on Step 3, including with unmet-requirement guidance visible', async () => {
      const { container } = renderFlow();
      await reachStep3ViaNoPreference();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
