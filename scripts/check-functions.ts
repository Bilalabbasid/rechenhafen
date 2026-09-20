import { ALL_CALCULATORS } from '../src/data/calculators';

let inlineCount = 0;
let namedCount = 0;
const funcNames: Record<string, number> = {};

for (const c of ALL_CALCULATORS) {
  const name = c.calculate.name;
  if (name) {
    namedCount++;
    funcNames[name] = (funcNames[name] || 0) + 1;
  } else {
    inlineCount++;
  }
}

console.log('Total calculators:', ALL_CALCULATORS.length);
console.log('Named functions:', namedCount, 'Anonymous/Inline:', inlineCount);
console.log('Unique function names:', Object.keys(funcNames).length);
