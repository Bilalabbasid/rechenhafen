import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

const map = ALL_CALCULATORS.map(calc => {
  const cat = CATEGORIES.find(c => c.slug === calc.category);
  return {
    slug: calc.slug,
    name: calc.name,
    category: calc.category,
    categoryName: cat?.name ?? '',
    keywords: calc.searchKeywords || []
  };
});

const outPath = path.join(process.cwd(), 'seo_keywords_raw.json');
fs.writeFileSync(outPath, JSON.stringify(map, null, 2), 'utf8');
console.log(`Written ${map.length} calculators to ${outPath}`);
