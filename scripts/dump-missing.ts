import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

const orig = JSON.parse(fs.readFileSync(path.join(__dirname, 'original-content.json'), 'utf8'));
const origSlugs = new Set(Object.keys(orig));

const missing = ALL_CALCULATORS.filter(c => !origSlugs.has(c.slug));

const summary = missing.map(c => ({
  slug: c.slug,
  name: c.name,
  category: c.category,
  inputs: c.inputs.map(i => `${i.label} (${i.unit || ''})`).join(', '),
  formula: c.formula,
  formulaExplanation: c.formulaExplanation,
  workedExample: c.workedExample ? `${c.workedExample.title}: ${c.workedExample.description} -> ${c.workedExample.resultSummary || c.workedExample.result}` : ''
}));

fs.writeFileSync(path.join(__dirname, 'missing-calcs.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(`Saved ${summary.length} missing calculator profiles to missing-calcs.json`);
