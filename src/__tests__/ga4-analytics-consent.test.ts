import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getConsentStatus,
  setConsentStatus,
  hasAnalyticsConsent,
  subscribeToConsentChanges,
  CONSENT_STORAGE_KEY,
} from '@/lib/analytics/consent';
import {
  getMeasurementId,
  trackPageView,
  trackCalculatorView,
  trackCalculationCompleted,
  trackResultCopied,
  trackRelatedCalculatorClicked,
  trackValidationError,
} from '@/lib/analytics/ga4';
import { getCalculatorBySlug } from '@/data/calculators';

describe('Google Analytics 4 & Consent Management', () => {
  let mockStorage: Record<string, string> = {};
  let gtagSpy: ReturnType<typeof vi.fn>;
  let originalEnv: string | undefined;

  beforeEach(() => {
    mockStorage = {};
    gtagSpy = vi.fn();
    originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    // Set up mock window and localStorage
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        mockStorage[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
    };

    const listeners: Record<string, EventListener[]> = {};

    (global as any).window = {
      localStorage: mockLocalStorage,
      dataLayer: [],
      gtag: gtagSpy,
      addEventListener: vi.fn((event: string, handler: EventListener) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: EventListener) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      }),
      dispatchEvent: vi.fn((event: Event) => {
        const handlers = listeners[event.type] || [];
        handlers.forEach((h) => h(event));
        return true;
      }),
    };

    (global as any).CustomEvent = class CustomEvent {
      type: string;
      detail: any;
      constructor(type: string, params?: { detail?: any }) {
        this.type = type;
        this.detail = params?.detail;
      }
    };
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv;
    vi.restoreAllMocks();
  });

  describe('Consent State Handling', () => {
    it('returns "pending" when no consent is stored', () => {
      expect(getConsentStatus()).toBe('pending');
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it('sets and retrieves "granted" consent', () => {
      setConsentStatus('granted');
      expect(getConsentStatus()).toBe('granted');
      expect(hasAnalyticsConsent()).toBe(true);
      expect(mockStorage[CONSENT_STORAGE_KEY]).toBe('granted');
    });

    it('sets and retrieves "denied" consent', () => {
      setConsentStatus('denied');
      expect(getConsentStatus()).toBe('denied');
      expect(hasAnalyticsConsent()).toBe(false);
      expect(mockStorage[CONSENT_STORAGE_KEY]).toBe('denied');
    });

    it('notifies subscribers when consent status changes', () => {
      const subscriber = vi.fn();
      const unsubscribe = subscribeToConsentChanges(subscriber);

      setConsentStatus('granted');
      expect(subscriber).toHaveBeenCalledWith('granted');

      setConsentStatus('denied');
      expect(subscriber).toHaveBeenCalledWith('denied');

      unsubscribe();
    });
  });

  describe('GA4 Tracking Suppression Prior to Consent', () => {
    it('does not send any GA4 events when consent is pending', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345';
      expect(hasAnalyticsConsent()).toBe(false);

      trackPageView('/rechner/gaskostenrechner/');
      trackCalculatorView('gaskostenrechner', 'energie');
      trackCalculationCompleted('gaskostenrechner', 'energie');
      trackResultCopied('gaskostenrechner');
      trackRelatedCalculatorClicked('gaskostenrechner', 'stromrechner');
      trackValidationError('gaskostenrechner', 'invalid_number');

      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('does not send any GA4 events when consent is explicitly denied', () => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345';
      setConsentStatus('denied');

      trackPageView('/rechner/schalungssteine-rechner/');
      trackCalculatorView('schalungssteine-rechner', 'bauen');
      trackCalculationCompleted('schalungssteine-rechner', 'bauen');
      trackResultCopied('schalungssteine-rechner');
      trackRelatedCalculatorClicked('schalungssteine-rechner', 'betonrechner');
      trackValidationError('schalungssteine-rechner', 'range_underflow');

      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('does not dispatch events if NEXT_PUBLIC_GA_MEASUREMENT_ID is empty or missing', () => {
      setConsentStatus('granted');
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

      expect(getMeasurementId()).toBeUndefined();
      trackCalculatorView('gaskostenrechner', 'energie');
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('GA4 Event Schema and Privacy Verification After Consent', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345';
      setConsentStatus('granted');
    });

    it('dispatches page_view with non-personal metadata', () => {
      trackPageView('/rechner/gaskostenrechner/', 'Gaskostenrechner');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/rechner/gaskostenrechner/',
        page_title: 'Gaskostenrechner',
      });
    });

    it('dispatches calculator_view with calculator_slug and calculator_category only', () => {
      trackCalculatorView('gaskostenrechner', 'energie');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'calculator_view', {
        calculator_slug: 'gaskostenrechner',
        calculator_category: 'energie',
      });
    });

    it('dispatches calculation_completed with calculator_slug and calculator_category and NO result values', () => {
      trackCalculationCompleted('schalungssteine-rechner', 'bauen');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'calculation_completed', {
        calculator_slug: 'schalungssteine-rechner',
        calculator_category: 'bauen',
      });

      // Verify no sensitive parameters exist
      const callArgs = gtagSpy.mock.calls[0];
      const payload = callArgs[2];
      expect(payload).not.toHaveProperty('value');
      expect(payload).not.toHaveProperty('inputs');
      expect(payload).not.toHaveProperty('result');
      expect(payload).not.toHaveProperty('income');
      expect(payload).not.toHaveProperty('credit');
    });

    it('dispatches result_copied with calculator_slug only', () => {
      trackResultCopied('maximaler-kredit-rechner');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'result_copied', {
        calculator_slug: 'maximaler-kredit-rechner',
      });

      const payload = gtagSpy.mock.calls[0][2];
      expect(Object.keys(payload)).toEqual(['calculator_slug']);
    });

    it('dispatches related_calculator_clicked with from and to slugs', () => {
      trackRelatedCalculatorClicked('tage-zwischen-zwei-daten', 'tage-bis-weihnachten');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'related_calculator_clicked', {
        from_calculator_slug: 'tage-zwischen-zwei-daten',
        to_calculator_slug: 'tage-bis-weihnachten',
      });
    });

    it('dispatches validation_error with error_type and NO user input values', () => {
      trackValidationError('maximaler-kredit-rechner', 'range_overflow');
      expect(gtagSpy).toHaveBeenCalledTimes(1);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'validation_error', {
        calculator_slug: 'maximaler-kredit-rechner',
        error_type: 'range_overflow',
      });

      const payload = gtagSpy.mock.calls[0][2];
      expect(payload).not.toHaveProperty('value');
      expect(payload).not.toHaveProperty('input');
      expect(payload.error_type).toBe('range_overflow');
    });
  });

  describe('Priority Calculators Verification', () => {
    const prioritySlugs = [
      'gaskostenrechner',
      'schalungssteine-rechner',
      'maximaler-kredit-rechner', // The exact calculator Google shows for "wie viel kredit bekomme ich"
      'tage-zwischen-zwei-daten',
      'tage-bis-weihnachten',
    ];

    it.each(prioritySlugs)('priority calculator %s is properly defined and registered', (slug) => {
      const calc = getCalculatorBySlug(slug);
      expect(calc).toBeDefined();
      expect(calc?.slug).toBe(slug);
      expect(calc?.category).toBeDefined();
      expect(typeof calc?.category).toBe('string');
      expect(calc?.inputs.length).toBeGreaterThan(0);
    });

    it('verifies that maximaler-kredit-rechner targets "wie viel kredit bekomme ich"', () => {
      const calc = getCalculatorBySlug('maximaler-kredit-rechner');
      expect(calc).toBeDefined();
      expect(calc?.searchKeywords).toContain('wie viel kredit bekomme ich');
      expect(calc?.h1.toLowerCase()).toContain('wie viel kredit bekomme ich');
    });
  });
});
