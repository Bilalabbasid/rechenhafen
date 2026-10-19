/**
 * Safe client-side storage for calculator favorites and recently used calculators.
 * 
 * Privacy & Security Guarantees:
 * - Only stores calculator slugs (identifiers) and minimal timestamps.
 * - NEVER persists user inputs, calculated results, dates of birth, financial, or health data.
 * - Safe for SSR (Server-Side Rendering) and environments where localStorage is disabled or throws.
 * - Entirely local to the user's browser ("Nur in diesem Browser gespeichert").
 */

const FAVORITES_STORAGE_KEY = 'rechenhafen_favorites';
const RECENT_STORAGE_KEY = 'rechenhafen_recent';
const MAX_RECENT_ITEMS = 6;

export interface RecentCalculatorItem {
  slug: string;
  timestamp: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Retrieves the list of favorite calculator slugs.
 */
export function getFavoriteSlugs(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length < 100);
    }
  } catch {
    // Storage quota or privacy sandbox error
  }
  return [];
}

/**
 * Checks whether a given calculator slug is in favorites.
 */
export function isCalculatorFavorite(slug: string): boolean {
  if (!slug) return false;
  return getFavoriteSlugs().includes(slug);
}

/**
 * Toggles a calculator in the favorites list.
 * Returns true if now favorited, false if removed.
 */
export function toggleFavoriteCalculator(slug: string): boolean {
  if (!slug || !isBrowser()) return false;
  try {
    const current = getFavoriteSlugs();
    const index = current.indexOf(slug);
    let updated: string[];
    let isNowFav: boolean;

    if (index >= 0) {
      updated = current.filter((s) => s !== slug);
      isNowFav = false;
    } else {
      updated = [slug, ...current.filter((s) => s !== slug)].slice(0, 50);
      isNowFav = true;
    }

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rechenhafen_favorites_changed', { detail: { slug, isFavorited: isNowFav } }));
    return isNowFav;
  } catch {
    return false;
  }
}

/**
 * Removes a calculator from favorites.
 */
export function removeFavoriteCalculator(slug: string): void {
  if (!slug || !isBrowser()) return;
  try {
    const current = getFavoriteSlugs();
    const updated = current.filter((s) => s !== slug);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rechenhafen_favorites_changed', { detail: { slug, isFavorited: false } }));
  } catch {
    // Fail-safe
  }
}

/**
 * Retrieves recently interacted calculators (ordered newest first).
 */
export function getRecentCalculators(): RecentCalculatorItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is RecentCalculatorItem => 
          item && typeof item === 'object' && typeof item.slug === 'string' && typeof item.timestamp === 'number'
        )
        .slice(0, MAX_RECENT_ITEMS);
    }
  } catch {
    // Fail-safe
  }
  return [];
}

/**
 * Records an active interaction with a calculator (NOT on passive pageview).
 * Only stores the slug and interaction timestamp.
 */
export function recordCalculatorInteraction(slug: string): void {
  if (!slug || !isBrowser()) return;
  try {
    const current = getRecentCalculators().filter((item) => item.slug !== slug);
    const updated: RecentCalculatorItem[] = [
      { slug, timestamp: Date.now() },
      ...current,
    ].slice(0, MAX_RECENT_ITEMS);

    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('rechenhafen_recent_changed', { detail: { slug } }));
  } catch {
    // Fail-safe
  }
}

/**
 * Clears the recently used calculator history.
 */
export function clearRecentCalculators(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(RECENT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('rechenhafen_recent_changed', { detail: {} }));
  } catch {
    // Fail-safe
  }
}
