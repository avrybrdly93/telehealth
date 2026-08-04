import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { StepIndicator } from './StepIndicator';

// Implements COMPONENT_LIBRARY.md#StepIndicator, BL-035, DECISION_LOG.md D-013.
const LABELS = ['Service', 'Provider', 'Acknowledgments', 'Handoff'];

describe('StepIndicator', () => {
  it('renders "Step n of 4" with the current step label', () => {
    render(<StepIndicator currentStep={1} labels={LABELS} />);
    expect(screen.getByText('Step 1 of 4: Service')).toBeInTheDocument();
  });

  it('marks only the current step dot with aria-current="step"', () => {
    render(<StepIndicator currentStep={2} labels={LABELS} />);
    expect(screen.getByText('Provider')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('Service')).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Acknowledgments')).not.toHaveAttribute('aria-current');
  });

  it('updates the announced status text when currentStep changes', () => {
    const { rerender } = render(<StepIndicator currentStep={1} labels={LABELS} />);
    expect(screen.getByText('Step 1 of 4: Service')).toBeInTheDocument();

    rerender(<StepIndicator currentStep={2} labels={LABELS} />);
    expect(screen.getByText('Step 2 of 4: Provider')).toBeInTheDocument();
    expect(screen.queryByText('Step 1 of 4: Service')).not.toBeInTheDocument();
  });

  it('exposes the status text via an aria-live polite region', () => {
    render(<StepIndicator currentStep={1} labels={LABELS} />);
    const status = screen.getByText('Step 1 of 4: Service');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('is axe-clean', async () => {
    const { container } = render(<StepIndicator currentStep={1} labels={LABELS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
