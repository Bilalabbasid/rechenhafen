import { ALL_CALCULATORS } from '../src/data/calculators';

// Sample 5 calculators with inputValues
const withInputValues = ALL_CALCULATORS.filter(c => c.workedExample && c.workedExample.inputValues).slice(0, 5);
console.log('Sample inputValues:');
for (const c of withInputValues) {
  console.log(c.slug, JSON.stringify(c.workedExample.inputValues));
  console.log('Result:', c.workedExample.result || c.workedExample.resultSummary);
}

// Sample 5 calculators with inputs
const withInputs = ALL_CALCULATORS.filter(c => c.workedExample && c.workedExample.inputs).slice(0, 5);
console.log('\nSample inputs:');
for (const c of withInputs) {
  console.log(c.slug, JSON.stringify(c.workedExample.inputs));
  console.log('Result:', c.workedExample.result || c.workedExample.resultSummary);
}
