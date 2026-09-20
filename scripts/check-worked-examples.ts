import { ALL_CALCULATORS } from '../src/data/calculators';

let hasInputsObj = 0;
let hasInputValuesArray = 0;
let hasResult = 0;
let hasResultSummary = 0;

for (const c of ALL_CALCULATORS) {
  const we = c.workedExample;
  if (!we) continue;
  if (we.inputs && typeof we.inputs === 'object' && !Array.isArray(we.inputs)) hasInputsObj++;
  if (we.inputValues) hasInputValuesArray++;
  if (we.result) hasResult++;
  if (we.resultSummary) hasResultSummary++;
}

console.log('Worked examples count:', ALL_CALCULATORS.length);
console.log('Has inputs object (key-value):', hasInputsObj);
console.log('Has inputValues (display array or obj):', hasInputValuesArray);
console.log('Has result:', hasResult);
console.log('Has resultSummary:', hasResultSummary);
