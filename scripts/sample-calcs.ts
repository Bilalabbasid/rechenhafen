import { ALL_CALCULATORS } from '../src/data/calculators';

const samples = ALL_CALCULATORS.filter(c => c.slug.includes('fliesen') || c.slug.includes('tapeten') || c.slug.includes('waermepumpe') || c.slug.includes('bmi') || c.slug.includes('kuendigung')).slice(0, 5);

for (const c of samples) {
  console.log('===', c.slug, '===');
  console.log('Title:', c.title);
  console.log('Formula:', c.formula);
  console.log('FormulaExplanation:', c.formulaExplanation);
  console.log('Inputs:', c.inputs.map(i => `${i.label} (${i.unit || 'Wert'})`).join(', '));
  console.log('Outputs:', c.outputs.map(o => `${o.label} (${o.unit || 'Wert'})`).join(', '));
  console.log('WorkedExample:', c.workedExample ? c.workedExample.title + ': ' + c.workedExample.description : 'none');
}
