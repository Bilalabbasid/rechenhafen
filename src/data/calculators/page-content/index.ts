import { PageContentMap } from './types';
import { MATHE_PAGE_CONTENT } from './mathe';
import { EINHEITEN_PAGE_CONTENT } from './einheiten';
import { GELD_PAGE_CONTENT } from './geld';
import { ARBEIT_PAGE_CONTENT } from './arbeit';
import { WOHNEN_PAGE_CONTENT } from './wohnen';
import { AUTO_PAGE_CONTENT } from './auto';
import { HAUSHALT_PAGE_CONTENT } from './haushalt';
import { FAMILIE_PAGE_CONTENT } from './familie';
import { GESUNDHEIT_PAGE_CONTENT } from './gesundheit';
import { FINANZEN_BUSINESS_PAGE_CONTENT } from './finanzenBusiness';
import { BAUEN_PAGE_CONTENT } from './bauen';
import { KOCHEN_PAGE_CONTENT } from './kochen';
import { DATUM_PAGE_CONTENT } from './datum';
import { GEOMETRIE_PAGE_CONTENT } from './geometrie';

/** Date of the last content batch; pages with an overlay report it as their content update. */
export const PAGE_CONTENT_UPDATED_AT = '2026-11-15';

/** Page-specific content overlays, keyed by calculator slug. Each group file covers different slugs. */
export const PAGE_CONTENT: PageContentMap = {
  ...MATHE_PAGE_CONTENT,
  ...EINHEITEN_PAGE_CONTENT,
  ...GELD_PAGE_CONTENT,
  ...ARBEIT_PAGE_CONTENT,
  ...WOHNEN_PAGE_CONTENT,
  ...AUTO_PAGE_CONTENT,
  ...HAUSHALT_PAGE_CONTENT,
  ...FAMILIE_PAGE_CONTENT,
  ...GESUNDHEIT_PAGE_CONTENT,
  ...FINANZEN_BUSINESS_PAGE_CONTENT,
  ...BAUEN_PAGE_CONTENT,
  ...KOCHEN_PAGE_CONTENT,
  ...DATUM_PAGE_CONTENT,
  ...GEOMETRIE_PAGE_CONTENT,
};
