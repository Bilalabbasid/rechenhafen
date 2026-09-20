import { ALL_CALCULATORS } from '../src/data/calculators';

const allSlugs = new Set(ALL_CALCULATORS.map(c => c.slug));
const missingMap = new Map<string, string[]>();

for (const calc of ALL_CALCULATORS) {
  for (const rel of calc.relatedSlugs || []) {
    if (!allSlugs.has(rel)) {
      const list = missingMap.get(rel) || [];
      list.push(calc.slug);
      missingMap.set(rel, list);
    }
  }
}

console.log(`Found ${missingMap.size} missing relatedSlugs:`);
for (const [missingSlug, referrers] of missingMap.entries()) {
  // Find closest match among allSlugs
  let candidate = '';
  for (const s of allSlugs) {
    if (s.includes(missingSlug) || missingSlug.includes(s)) {
      candidate = s;
      break;
    }
  }
  console.log(`- "${missingSlug}" (referred by ${referrers.length} calcs: ${referrers.slice(0, 3).join(', ')}) -> Suggestion: ${candidate || 'NONE'}`);
}
