import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

const byCategory: Record<string, Array<{
  slug: string;
  name: string;
  formula: string;
  formulaExplanation: string;
  inputs: Array<{ label: string; unit?: string }>;
  example?: string;
}>> = {};

for (const calc of ALL_CALCULATORS) {
  if (!byCategory[calc.category]) byCategory[calc.category] = [];
  byCategory[calc.category].push({
    slug: calc.slug,
    name: calc.name,
    formula: calc.formula,
    formulaExplanation: calc.formulaExplanation,
    inputs: calc.inputs.map(i => ({ label: i.label, unit: i.unit })),
    example: calc.workedExample?.description
  });
}

for (const [cat, calcs] of Object.entries(byCategory)) {
  console.log(`${cat}: ${calcs.length} calculators`);
}

fs.writeFileSync(
  path.join(__dirname, 'calcs-by-category.json'),
  JSON.stringify(byCategory, null, 2),
  'utf8'
);
