import * as fs from 'fs';
import * as path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

const searchItems = ALL_CALCULATORS.map((calc) => ({
  id: calc.id,
  slug: calc.slug,
  name: calc.name,
  category: calc.category,
  keywords: Array.from(new Set([
    calc.slug,
    calc.name.toLowerCase(),
    calc.shortName?.toLowerCase() || '',
    calc.category.toLowerCase(),
    calc.subcategory?.toLowerCase() || '',
    ...(calc.searchKeywords || []).map((k) => k.toLowerCase()),
  ])).filter(Boolean),
}));

const content = `// Auto-generated lightweight search index for 405 calculators
export interface SearchItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchItem[] = ${JSON.stringify(searchItems, null, 2)};
`;

const targetPath = path.join(__dirname, '../src/data/searchIndex.ts');
fs.writeFileSync(targetPath, content, 'utf-8');
console.log(`Generated ${targetPath} with ${searchItems.length} items.`);
