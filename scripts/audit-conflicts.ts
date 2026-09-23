import { ALL_CALCULATORS } from '../src/data/calculators';
import seoMap from '../src/data/seo-map.json';

interface SlugInfo {
  slug: string;
  name: string;
  h1: string;
  category: string;
  metaTitle: string;
  formula: string;
}

const calculators: SlugInfo[] = ALL_CALCULATORS.map(c => ({
  slug: c.slug,
  name: c.name,
  h1: c.h1,
  category: c.category,
  metaTitle: c.metaTitle,
  formula: c.formula,
}));

console.log(`Total calculators: ${calculators.length}`);

// 1. Check for normalized slug duplicates or stem collisions
const stemMap = new Map<string, string[]>();
for (const c of calculators) {
  // Strip common endings like -rechner, rechner
  const clean = c.slug.replace(/-rechner$/, '').replace(/rechner$/, '').replace(/-/g, '');
  if (!stemMap.has(clean)) stemMap.set(clean, []);
  stemMap.get(clean)!.push(c.slug);
}

console.log('\n--- STEM / TOKEN SIMILARITIES ---');
for (const [stem, slugs] of stemMap.entries()) {
  if (slugs.length > 1) {
    console.log(`Stem '${stem}':`, slugs);
  }
}

// 2. Pairwise similarity on slugs
console.log('\n--- PAIRWISE SIMILARITY > 0.7 ---');
function similarity(s1: string, s2: string): number {
  const set1 = new Set(s1.split('-'));
  const set2 = new Set(s2.split('-'));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

const pairsChecked = new Set<string>();
for (let i = 0; i < calculators.length; i++) {
  for (let j = i + 1; j < calculators.length; j++) {
    const c1 = calculators[i];
    const c2 = calculators[j];
    const sim = similarity(c1.slug, c2.slug);
    if (sim >= 0.6 && c1.category === c2.category) {
      console.log(`[${c1.category}] Sim ${sim.toFixed(2)}: ${c1.slug} <-> ${c2.slug}`);
    }
  }
}
