import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

const orig = JSON.parse(fs.readFileSync(path.join(__dirname, 'original-content.json'), 'utf8'));
const origSlugs = new Set(Object.keys(orig));

const missing = ALL_CALCULATORS.filter(c => !origSlugs.has(c.slug));
console.log(`Total calculators: ${ALL_CALCULATORS.length}`);
console.log(`In original-content: ${origSlugs.size}`);
console.log(`Remaining needing bespoke content: ${missing.length}`);

// Group by category
const byCat: Record<string, number> = {};
for (const m of missing) {
  byCat[m.category] = (byCat[m.category] || 0) + 1;
}
console.log('Missing by category:', byCat);
