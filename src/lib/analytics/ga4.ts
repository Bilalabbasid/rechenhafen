import { hasAnalyticsConsent } from './consent';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Retrieves the configured public Google Analytics 4 Measurement ID.
 */
export function getMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || typeof id !== 'string') return undefined;
  const trimmed = id.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Helper to dispatch privacy-safe events to GA4.
 * Guarantees that no data is dispatched if:
 * 1. Code is executing outside the browser,
 * 2. Visitor has not explicitly granted analytics consent,
 * 3. No Measurement ID is configured,
 * 4. Window.gtag is uninitialized.
 * 
 * Strict Privacy Contract:
 * - Only allowlisted identifiers (slugs, field IDs, error categories) are transmitted.
 * - NEVER sends user inputs, results, dates of birth, financial or health data, or copied content.
 */
function sendGa4Event(eventName: string, params: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const measurementId = getMeasurementId();
  if (!measurementId) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/**
 * Tracks a single pageview after navigation.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  sendGa4Event('page_view', {
    page_path: pagePath,
    ...(pageTitle ? { page_title: pageTitle } : {}),
  });
}

/**
 * Tracks calculator view event on mount.
 */
export function trackCalculatorView(calculatorSlug: string, calculatorCategory: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculator_view', {
    calculator_slug: calculatorSlug,
    calculator_category: calculatorCategory || 'allgemein',
  });
}

/**
 * Tracks calculator_start: fired once on first meaningful user interaction.
 * Default automatic results on load do NOT trigger this event.
 */
export function trackCalculatorStart(calculatorSlug: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculator_start', {
    calculator_slug: calculatorSlug,
  });
}

/**
 * Tracks calculator_result: fired when a valid result is produced after user interaction.
 */
export function trackCalculatorResult(calculatorSlug: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculator_result', {
    calculator_slug: calculatorSlug,
  });
}

/**
 * Tracks calculation_completed event.
 */
export function trackCalculationCompleted(calculatorSlug: string, calculatorCategory: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculation_completed', {
    calculator_slug: calculatorSlug,
    calculator_category: calculatorCategory || 'allgemein',
  });
}

/**
 * Tracks result_copied / calculator_copy_result: successful copy action to clipboard.
 * Note: Never includes the copied content or result values.
 */
export function trackResultCopied(calculatorSlug: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('result_copied', {
    calculator_slug: calculatorSlug,
  });
}

export function trackCalculatorCopyResult(calculatorSlug: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculator_copy_result', {
    calculator_slug: calculatorSlug,
  });
}

/**
 * Tracks related_calculator_clicked / calculator_related_click: when user clicks a contextual next-step or related calculator.
 */
export function trackRelatedCalculatorClicked(
  fromCalculatorSlug: string,
  toCalculatorSlug: string
): void {
  if (!toCalculatorSlug) return;
  sendGa4Event('related_calculator_clicked', {
    from_calculator_slug: fromCalculatorSlug || 'unknown',
    to_calculator_slug: toCalculatorSlug,
  });
}

export function trackCalculatorRelatedClick(
  fromCalculatorSlug: string,
  toCalculatorSlug: string
): void {
  if (!toCalculatorSlug) return;
  sendGa4Event('calculator_related_click', {
    from_calculator_slug: fromCalculatorSlug || 'unknown',
    to_calculator_slug: toCalculatorSlug,
  });
}

/**
 * Tracks calculator_favorite_add or calculator_favorite_remove.
 */
export function trackCalculatorFavorite(calculatorSlug: string, action: 'add' | 'remove'): void {
  if (!calculatorSlug) return;
  sendGa4Event(`calculator_favorite_${action}`, {
    calculator_slug: calculatorSlug,
  });
}

/**
 * Tracks validation error encounters during input.
 * Parameters: calculator_slug, error_type, field_id
 */
export function trackValidationError(
  calculatorSlug: string,
  errorType: string,
  fieldId?: string
): void {
  if (!calculatorSlug || !errorType) return;
  sendGa4Event('validation_error', {
    calculator_slug: calculatorSlug,
    error_type: errorType,
    ...(fieldId ? { field_id: fieldId } : {}),
  });
}

export function trackCalculatorValidationError(
  calculatorSlug: string,
  errorType: string,
  fieldId?: string
): void {
  if (!calculatorSlug || !errorType) return;
  sendGa4Event('calculator_validation_error', {
    calculator_slug: calculatorSlug,
    error_type: errorType,
    ...(fieldId ? { field_id: fieldId } : {}),
  });
}
