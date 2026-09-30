export type ConsentStatus = 'granted' | 'denied' | 'pending';

export const CONSENT_STORAGE_KEY = 'rechenhafen_consent_analytics';
export const CONSENT_CHANGED_EVENT = 'rechenhafen_consent_changed';

/**
 * Returns the current visitor consent status for analytics tracking.
 * Safe to call on both server (returns 'pending') and client.
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'pending';
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'granted' || stored === 'denied') {
      return stored;
    }
  } catch {
    // Private browsing or storage restricted
    return 'denied';
  }

  return 'pending';
}

/**
 * Sets visitor consent preference in localStorage and dispatches a notification event.
 */
export function setConsentStatus(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // Storage quota or restriction fallback
  }

  try {
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, {
        detail: { status },
      })
    );
  } catch {
    // Fallback if CustomEvent is not supported
  }
}

/**
 * Checks whether analytics tracking has been explicitly granted by the visitor.
 */
export function hasAnalyticsConsent(): boolean {
  return getConsentStatus() === 'granted';
}

/**
 * Subscribes a listener to consent status updates across tabs and within the current session.
 */
export function subscribeToConsentChanges(
  listener: (status: ConsentStatus) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ status: ConsentStatus }>;
    const status = customEvent.detail?.status || getConsentStatus();
    listener(status);
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) {
      listener(getConsentStatus());
    }
  };

  window.addEventListener(CONSENT_CHANGED_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
