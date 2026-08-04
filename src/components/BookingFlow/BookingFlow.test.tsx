import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setAnalyticsTransport, type AnalyticsEventName } from '../../lib/analytics';
import { BOOKING_SESSION_STORAGE_KEY } from '../../lib/booking-state';
import { BookingFlow } from './BookingFlow';

// Implements USER_FLOWS.md Flow 1 Step 1, PAGE_SPECIFICATIONS.md §/book, BL-035, D-013.
describe('BookingFlow', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.history.replaceState(null, '', '/book');
  });

  afterEach(() => {
    setAnalyticsTransport(() => {});
  });

  it('renders Step 1 of 4 with both service options and the eligibility summary', () => {
    render(<BookingFlow phone="555-0100" />);
    expect(screen.getByText('Step 1 of 4: Service')).toBeInTheDocument();
    expect(screen.getByText('First appointment (new patient)')).toBeInTheDocument();
    expect(screen.getByText('Follow-up (existing patients)')).toBeInTheDocument();
    expect(screen.getByText(/California, 18 years or older/)).toBeInTheDocument();
  });

  it('renders the crisis strip and a phone alternative', () => {
    render(<BookingFlow phone="555-0100" />);
    expect(screen.getByRole('note', { name: 'Crisis resources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '555-0100' })).toHaveAttribute('href', 'tel:555-0100');
  });

  it('tracks booking_step_view on mount', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    render(<BookingFlow phone="555-0100" />);

    expect(calls).toContainEqual(['booking_step_view', { step: '1' }]);
  });

  it('selecting a service marks it selected and persists to sessionStorage + the URL', async () => {
    const user = userEvent.setup();
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    render(<BookingFlow phone="555-0100" />);

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
    render(<BookingFlow phone="555-0100" />);

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

    render(<BookingFlow phone="555-0100" />);

    expect(screen.getByRole('radio', { name: /Follow-up/ })).toBeChecked();
  });

  it('is axe-clean', async () => {
    const { container } = render(<BookingFlow phone="555-0100" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
