import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getFavoriteSlugs,
  isCalculatorFavorite,
  toggleFavoriteCalculator,
  removeFavoriteCalculator,
  getRecentCalculators,
  recordCalculatorInteraction,
  clearRecentCalculators,
} from '@/lib/storage/favorites';
import {
  trackCalculatorStart,
  trackCalculatorResult,
  trackValidationError,
  trackCalculatorFavorite,
  trackResultCopied,
  trackRelatedCalculatorClicked,
} from '@/lib/analytics/ga4';
import { setConsentStatus, CONSENT_STORAGE_KEY } from '@/lib/analytics/consent';

describe('Calculator Return-Visit Features & Storage Safety', () => {
  let mockStorage: Record<string, string> = {};
  let listeners: Record<string, EventListener[]> = {};

  beforeEach(() => {
    mockStorage = {};
    listeners = {};

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

    (global as any).window = {
      localStorage: mockLocalStorage,
      dispatchEvent: vi.fn((event: any) => {
        const handlers = listeners[event.type] || [];
        handlers.forEach((h) => h(event));
        return true;
      }),
      addEventListener: vi.fn((event: string, handler: EventListener) => {
        listeners[event] = listeners[event] || [];
        listeners[event].push(handler);
      }),
      removeEventListener: vi.fn((event: string, handler: EventListener) => {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter((h) => h !== handler);
        }
      }),
    };
  });

  it('toggles favorites and persists only the slug', () => {
    expect(isCalculatorFavorite('nudeln-rohmaerk-gewicht-rechner')).toBe(false);

    // Add to favorites
    const isNowFav = toggleFavoriteCalculator('nudeln-rohmaerk-gewicht-rechner');
    expect(isNowFav).toBe(true);
    expect(isCalculatorFavorite('nudeln-rohmaerk-gewicht-rechner')).toBe(true);
    expect(getFavoriteSlugs()).toEqual(['nudeln-rohmaerk-gewicht-rechner']);

    // Check raw storage: must strictly contain array of slugs, NO user inputs or results
    expect(mockStorage['rechenhafen_favorites']).toBe(JSON.stringify(['nudeln-rohmaerk-gewicht-rechner']));

    // Remove from favorites
    const isNowRemoved = toggleFavoriteCalculator('nudeln-rohmaerk-gewicht-rechner');
    expect(isNowRemoved).toBe(false);
    expect(isCalculatorFavorite('nudeln-rohmaerk-gewicht-rechner')).toBe(false);
    expect(getFavoriteSlugs()).toEqual([]);
  });

  it('removes an individual favorite by slug', () => {
    toggleFavoriteCalculator('rechner-a');
    toggleFavoriteCalculator('rechner-b');
    expect(getFavoriteSlugs()).toContain('rechner-a');
    expect(getFavoriteSlugs()).toContain('rechner-b');

    removeFavoriteCalculator('rechner-a');
    expect(getFavoriteSlugs()).not.toContain('rechner-a');
    expect(getFavoriteSlugs()).toContain('rechner-b');
  });

  it('records recent calculator interactions based on user activity', () => {
    expect(getRecentCalculators()).toEqual([]);

    recordCalculatorInteraction('wasser-reis-verhaeltnis-rechner');
    const recents = getRecentCalculators();
    expect(recents.length).toBe(1);
    expect(recents[0].slug).toBe('wasser-reis-verhaeltnis-rechner');
    expect(typeof recents[0].timestamp).toBe('number');

    // Add another interaction: newest must be first
    recordCalculatorInteraction('kies-splitt-rechner');
    const updated = getRecentCalculators();
    expect(updated[0].slug).toBe('kies-splitt-rechner');
    expect(updated[1].slug).toBe('wasser-reis-verhaeltnis-rechner');

    // Clear history
    clearRecentCalculators();
    expect(getRecentCalculators()).toEqual([]);
  });

  it('fails safely when localStorage is unavailable or throws', () => {
    (global as any).window.localStorage.getItem = vi.fn(() => {
      throw new Error('SecurityError: The operation is insecure.');
    });
    (global as any).window.localStorage.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });

    // Should return safe empty defaults without throwing
    expect(() => getFavoriteSlugs()).not.toThrow();
    expect(getFavoriteSlugs()).toEqual([]);
    expect(() => getRecentCalculators()).not.toThrow();
    expect(getRecentCalculators()).toEqual([]);
    expect(() => toggleFavoriteCalculator('test-slug')).not.toThrow();
  });
});

describe('Privacy-Conscious Analytics Event Pipeline', () => {
  let gtagSpy: ReturnType<typeof vi.fn>;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    gtagSpy = vi.fn();

    (global as any).window = {
      localStorage: {
        getItem: vi.fn((key: string) => mockStorage[key] || null),
        setItem: vi.fn((key: string, val: string) => {
          mockStorage[key] = val;
        }),
      },
      dataLayer: [],
      gtag: gtagSpy,
    };
  });

  it('does not send custom analytics events before consent is granted', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TESTID123');
    // Consent not given in storage
    mockStorage[CONSENT_STORAGE_KEY] = 'denied';

    trackCalculatorStart('nudeln-rohmaerk-gewicht-rechner');
    trackCalculatorResult('nudeln-rohmaerk-gewicht-rechner');
    trackValidationError('nudeln-rohmaerk-gewicht-rechner', 'invalid_number');
    trackCalculatorFavorite('nudeln-rohmaerk-gewicht-rechner', 'add');

    expect(gtagSpy).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it('transmits only allowlisted event metadata when consent is given', () => {
    // Grant consent
    mockStorage[CONSENT_STORAGE_KEY] = 'granted';
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TESTID123');

    trackCalculatorStart('nudeln-rohmaerk-gewicht-rechner');
    expect(gtagSpy).toHaveBeenCalledWith('event', 'calculator_start', {
      calculator_slug: 'nudeln-rohmaerk-gewicht-rechner',
    });

    trackValidationError('nudeln-rohmaerk-gewicht-rechner', 'range_underflow', 'dryGrams');
    expect(gtagSpy).toHaveBeenCalledWith('event', 'validation_error', {
      calculator_slug: 'nudeln-rohmaerk-gewicht-rechner',
      error_type: 'range_underflow',
      field_id: 'dryGrams',
    });

    trackCalculatorFavorite('wasser-reis-verhaeltnis-rechner', 'add');
    expect(gtagSpy).toHaveBeenCalledWith('event', 'calculator_favorite_add', {
      calculator_slug: 'wasser-reis-verhaeltnis-rechner',
    });

    trackRelatedCalculatorClicked('nudeln-rohmaerk-gewicht-rechner', 'portionsrechner');
    expect(gtagSpy).toHaveBeenCalledWith('event', 'related_calculator_clicked', {
      from_calculator_slug: 'nudeln-rohmaerk-gewicht-rechner',
      to_calculator_slug: 'portionsrechner',
    });

    vi.unstubAllEnvs();
  });
});
