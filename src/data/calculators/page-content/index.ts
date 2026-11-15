import { PageContentMap } from './types';
import { MATHE_PAGE_CONTENT } from './mathe';
import { EINHEITEN_PAGE_CONTENT } from './einheiten';
import { GELD_PAGE_CONTENT } from './geld';
import { ARBEIT_PAGE_CONTENT } from './arbeit';
import { WOHNEN_PAGE_CONTENT } from './wohnen';

/** Date of the last content batch; pages with an overlay report it as their content update. */
export const PAGE_CONTENT_UPDATED_AT = '2026-11-15';

/** Page-specific content overlays, keyed by calculator slug. Each group file covers different slugs. */
export const PAGE_CONTENT: PageContentMap = {
  ...MATHE_PAGE_CONTENT,
  ...EINHEITEN_PAGE_CONTENT,
  ...GELD_PAGE_CONTENT,
  ...ARBEIT_PAGE_CONTENT,
  ...WOHNEN_PAGE_CONTENT,
};
