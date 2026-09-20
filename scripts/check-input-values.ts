import { ALL_CALCULATORS } from '../src/data/calculators';

let arrayCount = 0;
let objectCount = 0;
const arraySlugs: string[] = [];

for (const c of ALL_CALCULATORS) {
  const we = c.workedExample;
  if (!we) continue;
  if (Array.isArray(we.inputValues)) {
    arrayCount++;
    arraySlugs.push(c.slug);
  } else if (we.inputs && typeof we.inputs === 'object') {
    objectCount++;
  }
}

console.log(`WorkedExamples with array inputValues: ${arrayCount}`);
console.log(`WorkedExamples with object inputs: ${objectCount}`);
console.log('Sample slugs with array inputValues:', arraySlugs.slice(0, 10));
