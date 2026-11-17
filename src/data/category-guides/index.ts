import { CategoryGuideMap } from './types';
import { GELD_RECHT_GUIDES } from './geldRecht';
import { ALLTAG_GESUNDHEIT_GUIDES } from './alltagGesundheit';
import { MATHE_KUECHE_GUIDES } from './matheKueche';

export type { CategoryGuide, CategoryGuideMap } from './types';

/** Guide content per category slug; each group file covers different categories. */
export const CATEGORY_GUIDES: CategoryGuideMap = {
  ...GELD_RECHT_GUIDES,
  ...ALLTAG_GESUNDHEIT_GUIDES,
  ...MATHE_KUECHE_GUIDES,
};
