import { ALL_CALCULATORS } from '../src/data/calculators';

const list = ALL_CALCULATORS.map(c => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  category: c.category,
  subcategory: c.subcategory,
  inputs: c.inputs.map(i => ({ id: i.id, label: i.label, type: i.type, defaultValue: i.defaultValue, unit: i.unit })),
  formula: c.formula,
  isTimeSensitive: c.isTimeSensitive,
  hasWorkedExample: Boolean(c.workedExample),
  workedExample: c.workedExample
}));

import fs from 'fs';
fs.writeFileSync('scripts/calculators-inventory.json', JSON.stringify(list, null, 2));
console.log('Saved 405 calculators inventory to scripts/calculators-inventory.json');
