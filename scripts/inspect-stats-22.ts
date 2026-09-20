import { ALL_CALCULATORS } from '../src/data/calculators';

const targetSlugs = [
  'mittelwert-median-modus-rechner',
  'varianz-standardabweichung-stichprobe-rechner',
  'korrelationskoeffizient-rechner',
  'z-score-normalverteilung-rechner',
  'p-wert-hypothesentest-rechner',
  't-test-rechner',
  'konfidenzintervall-rechner',
  'stichprobengroesse-rechner',
  'quartile-box-plot-rechner',
  'binomialverteilung-rechner',
  'poisson-verteilung-rechner',
  'kombinatorik-n-ueber-k-rechner',
  'lineare-regression-rechner',
  'kovarianz-rechner',
  'variationskoeffizient-rechner',
  'geometrisches-mittel-rechner',
  'harmonisches-mittel-rechner',
  'bayes-theorem-rechner',
  'wahrscheinlichkeit-wuerfel-muenze-rechner',
  'perzentil-rechner',
  'effektstaerke-cohens-d-rechner',
  'chi-quadrat-unabhaengigkeitstest-rechner'
];

for (const slug of targetSlugs) {
  const calc = ALL_CALCULATORS.find(c => c.slug === slug);
  if (!calc) {
    console.log('Not found:', slug);
    continue;
  }
  const defaultInputs: Record<string, any> = {};
  for (const inp of calc.inputs) defaultInputs[inp.id] = inp.defaultValue;
  const res = calc.calculate(defaultInputs);
  console.log(`=== ${slug} ===`);
  console.log('Formula:', calc.formula);
  console.log('Primary:', res.primary);
  console.log('Details count:', res.details?.length);
  if (calc.workedExample) {
    console.log('Worked Example:', calc.workedExample.title);
  }
}
