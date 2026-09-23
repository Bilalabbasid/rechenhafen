import { ALL_CALCULATORS } from '../src/data/calculators';

console.log(`Total Calculators: ${ALL_CALCULATORS.length}`);

const missingFormula = ALL_CALCULATORS.filter(c => !c.formula || c.formula.trim().length < 3);
const missingExplanation = ALL_CALCULATORS.filter(c => !c.formulaExplanation || c.formulaExplanation.trim().length < 10);
const missingExample = ALL_CALCULATORS.filter(c => !c.workedExample || !c.workedExample.title);

console.log(`Missing Formula: ${missingFormula.length}`);
console.log(`Missing Explanation: ${missingExplanation.length}`);
console.log(`Missing Worked Example: ${missingExample.length}`);

// Check categories
const cats = new Map<string, number>();
for (const c of ALL_CALCULATORS) {
  cats.set(c.category, (cats.get(c.category) || 0) + 1);
}

console.log('\nCalculators per category:');
for (const [cat, count] of cats.entries()) {
  console.log(`  - ${cat}: ${count}`);
}
