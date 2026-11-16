import { buildSearchItems, type SearchEntry, type SearchableItem } from './searchCore';

let indexPromise: Promise<SearchableItem[]> | null = null;

/**
 * Loads the compact search index once per page view (fetched from /search-index.json, which is
 * generated at build time). A failed request is not cached, so the next keystroke retries.
 */
export function loadSearchIndex(): Promise<SearchableItem[]> {
  if (!indexPromise) {
    indexPromise = fetch('/search-index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`search index: HTTP ${res.status}`);
        return res.json() as Promise<SearchEntry[]>;
      })
      .then(buildSearchItems)
      .catch((err) => {
        indexPromise = null;
        throw err;
      });
  }
  return indexPromise;
}
