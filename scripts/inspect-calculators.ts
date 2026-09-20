import { ALL_CALCULATORS } from '../src/data/calculators';

console.log('Total calculators:', ALL_CALCULATORS.length);

let withWorkedExamples = 0;
let timeSensitiveCount = 0;
const workedExampleKeys = new Set<string>();

for (const c of ALL_CALCULATORS) {
  if (c.workedExample) {
    withWorkedExamples++;
    Object.keys(c.workedExample).forEach(k => workedExampleKeys.add(k));
  }
  if (c.isTimeSensitive) timeSensitiveCount++;
}

console.log('With worked example:', withWorkedExamples);
console.log('Flagged timeSensitive:', timeSensitiveCount);
console.log('Worked example keys:', Array.from(workedExampleKeys));
