/**
 * SEO Title Helper for RechenHafen.de
 *
 * Normalizes page meta titles so that Next.js layout template (`%s | RechenHafen`)
 * renders the brand suffix exactly once.
 */

/**
 * Strips redundant brand suffixes such as "| RechenHafen" or "– RechenHafen" from raw titles.
 */
export function formatMetaTitle(rawTitle?: string): string {
  if (!rawTitle) return '';
  // Remove any trailing "| RechenHafen..." or "– RechenHafen..." or "- RechenHafen..."
  return rawTitle.replace(/\s*([|–-])\s*RechenHafen.*$/i, '').trim();
}
