import { ALL_CALCULATORS } from '../src/data/calculators';
import seoMap from '../src/data/seo-map.json';

const seoList = Object.entries(seoMap).map(([slug, data]: [string, any]) => ({
  slug,
  primaryKeyword: data.primaryKeyword,
  secondaryKeywords: data.secondaryKeywords || [],
  category: data.category,
}));

console.log(`Loaded ${seoList.length} items from seo-map.json`);

// Check for duplicate primary keywords
const kwMap = new Map<string, string[]>();
for (const item of seoList) {
  const kw = item.primaryKeyword.toLowerCase().trim();
  if (!kwMap.has(kw)) kwMap.set(kw, []);
  kwMap.get(kw)!.push(item.slug);
}

for (const [kw, slugs] of kwMap.entries()) {
  if (slugs.length > 1) {
    console.log(`DUPLICATE PRIMARY KEYWORD: "${kw}" -> ${slugs.join(', ')}`);
  }
}

// Check the specific user-requested examples:
const examples = [
  ['zinsrechner', 'zinseszinsrechner'],
  ['spritkostenrechner', 'benzinkostenrechner'],
  ['fahrtkostenrechner', 'pendlerpauschale-rechner', 'pendelkostenrechner'],
  ['alter-in-tagen', 'altersrechner'],
  ['kreditrate-rechner', 'kreditrechner', 'ratenkreditrechner'],
  ['sparzielrechner', 'sparziel-rechner'],
  ['autokreditrechner', 'autokredit-rechner'],
  ['brutto-netto-rechner', 'gehaltsrechner'],
  ['mehrwertsteuerrechner', 'umsatzsteuerrechner'],
];

console.log('\n--- CHECKING USER EXAMPLES & RELATED KEYWORDS ---');
for (const group of examples) {
  console.log(`\nGroup: ${group.join(' vs ')}`);
  for (const slug of group) {
    const calc = ALL_CALCULATORS.find(c => c.slug === slug);
    const seo = (seoMap as any)[slug];
    if (calc) {
      console.log(`  [EXISTS] slug: "${calc.slug}" | title: "${calc.title}" | h1: "${calc.h1}"`);
      if (seo) {
        console.log(`           primaryKW: "${seo.primaryKeyword}" | secondary: ${seo.secondaryKeywords?.slice(0, 3).join(', ')}`);
      }
    } else {
      console.log(`  [NOT FOUND IN REPOSITORY] slug: "${slug}"`);
    }
  }
}
