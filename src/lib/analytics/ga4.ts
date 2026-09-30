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
 * Tracks calculator view event.
 * Parameters: calculator_slug, calculator_category
 */
export function trackCalculatorView(calculatorSlug: string, calculatorCategory: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculator_view', {
    calculator_slug: calculatorSlug,
    calculator_category: calculatorCategory || 'allgemein',
  });
}

/**
 * Tracks successful calculation completion event.
 * Parameters: calculator_slug, calculator_category
 * Note: Never includes input numbers, parameters, or calculated results.
 */
export function trackCalculationCompleted(calculatorSlug: string, calculatorCategory: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('calculation_completed', {
    calculator_slug: calculatorSlug,
    calculator_category: calculatorCategory || 'allgemein',
  });
}

/**
 * Tracks when a user copies calculation results to the clipboard.
 * Parameters: calculator_slug
 * Note: Only tracks the action itself; result contents are never sent.
 */
export function trackResultCopied(calculatorSlug: string): void {
  if (!calculatorSlug) return;
  sendGa4Event('result_copied', {
    calculator_slug: calculatorSlug,
  });
}

/**
 * Tracks when a user clicks on a related calculator recommendation.
 * Parameters: from_calculator_slug, to_calculator_slug
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

/**
 * Tracks validation error encounters during input.
 * Parameters: calculator_slug, error_type
 * Note: Tracks non-personal error categories (e.g., 'range_error', 'invalid_date') without user values.
 */
export function trackValidationError(calculatorSlug: string, errorType: string): void {
  if (!calculatorSlug || !errorType) return;
  sendGa4Event('validation_error', {
    calculator_slug: calculatorSlug,
    error_type: errorType,
  });
}
