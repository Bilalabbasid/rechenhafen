/**
 * SEO Title Helper for RechenHafen.de
 *
 * Normalizes page meta titles so that Next.js layout template (`%s | RechenHafen`)
 * renders the brand suffix exactly once.
 */

/**
 * Strips redundant brand suffixes such as "| RechenHafen" or "– RechenHafen" from raw titles.
 */
const BRAND_SUFFIX = ' | RechenHafen';
/** Longest title (incl. brand suffix) that search engines show without cutting it off. */
export const MAX_TITLE_LENGTH = 60;

/**
 * Next.js title for a page: keeps the " | RechenHafen" suffix (via the layout template) only
 * when the whole title still fits into MAX_TITLE_LENGTH characters. Longer titles are used on
 * their own, so the descriptive part is not cut off and Bing stops flagging "Title too long".
 */
export function brandedTitle(rawTitle?: string): string | { absolute: string } {
  const title = formatMetaTitle(rawTitle);
  return title.length + BRAND_SUFFIX.length <= MAX_TITLE_LENGTH ? title : { absolute: title };
}

export function formatMetaTitle(rawTitle?: string): string {
  if (!rawTitle) return '';
  // Remove any trailing "| RechenHafen..." or "– RechenHafen..." or "- RechenHafen..."
  return rawTitle.replace(/\s*([|–-])\s*RechenHafen.*$/i, '').trim();
}
