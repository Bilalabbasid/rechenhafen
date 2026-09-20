import { ALL_CALCULATORS, getCalculatorBySlug } from '../src/data/calculators';

// Let's test a selection of calculators across our highlighted domains
const testSlugs = [
  'zinseszinsrechner', 'etf-sparplan-rechner', 'sparrechner', 'sparzielrechner', '72er-regel-rechner',
  'kreditrechner', 'ratenkreditrechner', 'annuitaetendarlehen-rechner', 'tilgungsrechner', 'baufinanzierung-rechner', 'sondertilgungsrechner',
  'renditerechner', 'cagr-rechner', 'roi-rechner', 'bruttomietrendite-rechner', 'eigenkapitalrendite-rechner',
  'prozentrechner', 'prozentuale-veraenderung', 'grundwert-rechner', 'prozentsatz-rechner', 'prozentwert-rechner', 'mwst-rechner', 'rabattrechner',
  'spritkostenrechner', 'spritverbrauch-rechner', 'pendlerpauschale-rechner', 'co2-auto-rechner',
  'stromkostenrechner', 'standby-kosten-rechner', 'photovoltaik-amortisation-rechner',
  'laengen-umrechner', 'gewicht-umrechner', 'temperatur-umrechner', 'druck-umrechner', 'leistung-umrechner',
  'kreisrechner', 'zylinderrechner', 'rechteckrechner', 'pythagoras-rechner', 'trapez-rechner', 'kugel-oberflaeche-rechner', 'quader-volumen-rechner',
  'durchschnittsrechner', 'standardabweichung-rechner', 'mittelwert-median-modus-rechner', 'z-score-rechner', 'korrelationskoeffizient-pearson-rechner',
  'bmi-rechner', 'kalorienbedarf-rechner', 'grundumsatz-bmr-rechner', 'gesamtenergieumsatz-tdee-rechner', 'koerperfett-navy-rechner',
  'altersrechner', 'alter-in-tagen', 'datumsdifferenz', 'schaltjahr-rechner', 'arbeitstage-rechner', 'arbeitszeitrechner'
];

console.log(`Checking ${testSlugs.length} core calculators...`);
for (const slug of testSlugs) {
  const calc = getCalculatorBySlug(slug);
  if (!calc) {
    console.error(`MISSING: ${slug}`);
    continue;
  }
  const defaultInputs: Record<string, any> = {};
  for (const inp of calc.inputs) {
    defaultInputs[inp.id] = inp.defaultValue;
  }
  const res = calc.calculate(defaultInputs);
  console.log(`[${slug}] Primary: "${res.primary.label}" = ${res.primary.value} (${res.primary.formattedValue})`);
}
