import { ALL_CALCULATORS, getCalculatorBySlug } from '../src/data/calculators';

const slugsToCheck = [
  'industrieminuten-rechner',
  'kuendigungsfrist-rechner',
  'spardauer-rechner',
  'teilzeitrechner',
  'balkonkraftwerk-rechner',
  'skonto-jahreszins-rechner',
  'entnahmeplan-rechner',
  'pendlerpauschale-rechner',
  'ballonfinanzierung-rechner',
  'gewerbesteuerrechner',
  'zinseszinsrechner',
  'kreditrechner',
  'tilgungsrechner',
  'bmi-rechner',
];

for (const slug of slugsToCheck) {
  const calc = getCalculatorBySlug(slug);
  if (calc) {
    console.log(`[FOUND] ${slug}:`);
    console.log(`  H1: ${calc.h1}`);
    console.log(`  Inputs: ${calc.inputs.map(i => i.id).join(', ')}`);
    console.log(`  Category: ${calc.category}`);
  } else {
    console.log(`[MISSING] ${slug}`);
  }
}
