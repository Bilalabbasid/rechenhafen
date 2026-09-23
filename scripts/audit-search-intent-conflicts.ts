import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS, getCalculatorBySlug } from '../src/data/calculators';

// Load seo-map.json
const seoMap = JSON.parse(fs.readFileSync(path.resolve('src/data/seo-map.json'), 'utf8'));

console.log('=== AUDITING SEARCH INTENT CONFLICTS ===\n');

// 1. Check User's Specific Examples:
const specificExamples = [
  { name: 'Zinsrechner vs Zinseszinsrechner', queryA: 'zins', queryB: 'zinseszins' },
  { name: 'Spritkosten vs Benzinkosten', queryA: 'spritkosten', queryB: 'benzin' },
  { name: 'Fahrtkosten vs Pendelkosten', queryA: 'fahrtkosten', queryB: 'pendler' },
  { name: 'Alter in Tagen vs Altersrechner', queryA: 'alter-in-tagen', queryB: 'altersrechner' },
  { name: 'Kreditrate vs Kreditrechner', queryA: 'kreditrate', queryB: 'kreditrechner' },
];

console.log('--- 1. CHECKING USER-REQUESTED EXAMPLES ---');
for (const ex of specificExamples) {
  const matchA = ALL_CALCULATORS.filter(c => c.slug.includes(ex.queryA) || c.name.toLowerCase().includes(ex.queryA)).map(c => c.slug);
  const matchB = ALL_CALCULATORS.filter(c => c.slug.includes(ex.queryB) || c.name.toLowerCase().includes(ex.queryB)).map(c => c.slug);
  console.log(`\nExample: ${ex.name}`);
  console.log(`  Query A ("${ex.queryA}") matches:`, matchA);
  console.log(`  Query B ("${ex.queryB}") matches:`, matchB);
}

// 2. Scan ALL_CALCULATORS for potential intent conflicts
console.log('\n--- 2. SCANNING ALL CALCULATORS FOR INTENT CONFLICTS ---');

interface ConflictCandidate {
  slugA: string;
  slugB: string;
  calcA: any;
  calcB: any;
  reason: string;
}

const candidates: ConflictCandidate[] = [];
const checkedPairs = new Set<string>();

for (let i = 0; i < ALL_CALCULATORS.length; i++) {
  for (let j = i + 1; j < ALL_CALCULATORS.length; j++) {
    const a = ALL_CALCULATORS[i];
    const b = ALL_CALCULATORS[j];
    const pairKey = [a.slug, b.slug].sort().join('::');
    if (checkedPairs.has(pairKey)) continue;
    checkedPairs.add(pairKey);

    // Rule 1: Similar slug stem (e.g. autokredit-rechner vs autokreditrechner)
    const normA = a.slug.replace(/-/g, '').toLowerCase();
    const normB = b.slug.replace(/-/g, '').toLowerCase();
    if (normA === normB || (normA.includes(normB) && normA.length - normB.length <= 4) || (normB.includes(normA) && normB.length - normA.length <= 4)) {
      candidates.push({
        slugA: a.slug,
        slugB: b.slug,
        calcA: a,
        calcB: b,
        reason: 'Identical or nearly identical slug stem',
      });
      continue;
    }

    // Rule 2: Substantial keyword overlap in searchKeywords
    const setA = new Set(a.searchKeywords.map((k: string) => k.toLowerCase().trim()));
    const setB = new Set(b.searchKeywords.map((k: string) => k.toLowerCase().trim()));
    const intersection = [...setA].filter(k => setB.has(k));
    if (intersection.length >= 2 && a.category === b.category) {
      candidates.push({
        slugA: a.slug,
        slugB: b.slug,
        calcA: a,
        calcB: b,
        reason: `Shared keywords (${intersection.length}): ${intersection.join(', ')}`,
      });
      continue;
    }
  }
}

console.log(`\nFound ${candidates.length} potential conflict pairs.\n`);

for (const c of candidates) {
  console.log(`[PAIR] ${c.slugA} vs ${c.slugB}`);
  console.log(`  Name A: ${c.calcA.name}`);
  console.log(`  Name B: ${c.calcB.name}`);
  console.log(`  H1 A: ${c.calcA.h1}`);
  console.log(`  H1 B: ${c.calcB.h1}`);
  console.log(`  Reason: ${c.reason}`);
  console.log('');
}
