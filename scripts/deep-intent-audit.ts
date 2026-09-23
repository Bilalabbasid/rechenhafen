import { ALL_CALCULATORS } from '../src/data/calculators';

console.log('=== DEEP SEARCH INTENT & FORMULA AUDIT ===\n');

interface DuplicateCandidate {
  slugA: string;
  slugB: string;
  nameA: string;
  nameB: string;
  h1A: string;
  h1B: string;
  formulaA: string;
  formulaB: string;
  inputsA: string[];
  inputsB: string[];
  similarity: number;
  reason: string;
}

const duplicates: DuplicateCandidate[] = [];

for (let i = 0; i < ALL_CALCULATORS.length; i++) {
  for (let j = i + 1; j < ALL_CALCULATORS.length; j++) {
    const a = ALL_CALCULATORS[i];
    const b = ALL_CALCULATORS[j];

    // Check slug similarity
    const cleanA = a.slug.replace(/-/g, '');
    const cleanB = b.slug.replace(/-/g, '');
    const slugDist = cleanA === cleanB;

    // Check input ids similarity
    const inA = (a.inputs || []).map(inp => inp.id).sort();
    const inB = (b.inputs || []).map(inp => inp.id).sort();
    const sharedInputs = inA.filter(id => inB.includes(id));
    const inputJaccard = (sharedInputs.length) / Math.max(1, (new Set([...inA, ...inB])).size);

    // Check keywords overlap
    const kwA = new Set((a.searchKeywords || []).map(k => k.toLowerCase()));
    const kwB = new Set((b.searchKeywords || []).map(k => k.toLowerCase()));
    const sharedKw = [...kwA].filter(k => kwB.has(k));

    if (slugDist || (inputJaccard >= 0.75 && a.category === b.category) || sharedKw.length >= 2) {
      duplicates.push({
        slugA: a.slug,
        slugB: b.slug,
        nameA: a.name,
        nameB: b.name,
        h1A: a.h1,
        h1B: b.h1,
        formulaA: a.formula || '',
        formulaB: b.formula || '',
        inputsA: inA,
        inputsB: inB,
        similarity: inputJaccard,
        reason: slugDist ? 'Identical slug without hyphens' : sharedKw.length >= 2 ? `Shared keywords: ${sharedKw.join(', ')}` : `High input similarity: ${(inputJaccard * 100).toFixed(0)}%`,
      });
    }
  }
}

console.log(`Found ${duplicates.length} potential conflict pairs.\n`);

for (const d of duplicates) {
  console.log(`--------------------------------------------------`);
  console.log(`PAIR: ${d.slugA} vs ${d.slugB}`);
  console.log(`  Name A: ${d.nameA}`);
  console.log(`  Name B: ${d.nameB}`);
  console.log(`  H1 A: ${d.h1A}`);
  console.log(`  H1 B: ${d.h1B}`);
  console.log(`  Inputs A: ${d.inputsA.join(', ')}`);
  console.log(`  Inputs B: ${d.inputsB.join(', ')}`);
  console.log(`  Reason: ${d.reason}`);
}
