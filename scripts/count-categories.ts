import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

const counts = new Map<string, number>();
for (const cat of CATEGORIES) counts.set(cat.slug, 0);
for (const c of ALL_CALCULATORS) counts.set(c.category, (counts.get(c.category) || 0) + 1);

console.log('=== CALCULATORS PER CATEGORY ===');
for (const [cat, count] of counts) {
  console.log(`${cat.padEnd(25)} ${count}`);
}
