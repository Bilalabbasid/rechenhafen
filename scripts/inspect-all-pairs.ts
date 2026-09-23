import { ALL_CALCULATORS } from '../src/data/calculators';
import seoMap from '../src/data/seo-map.json';

const pairsToExamine = [
  { a: 'zinseszinsrechner', b: 'sparzielrechner', topic: 'Zinsrechner / Zinseszinsrechner / Sparrechner' },
  { a: 'spritkostenrechner', b: 'fahrtkostenrechner', topic: 'Spritkostenrechner vs Benzinkosten / Fahrtkosten' },
  { a: 'fahrtkostenrechner', b: 'pendlerpauschale-rechner', topic: 'Fahrtkostenrechner vs Pendelkosten / Pendlerpauschale' },
  { a: 'altersrechner', b: 'alter-in-tagen', topic: 'Altersrechner vs Alter-in-Tagen' },
  { a: 'kreditrechner', b: 'ratenkreditrechner', topic: 'Kreditrechner vs Kreditrate / Ratenkredit' },
  { a: 'sparzielrechner', b: 'sparziel-rechner', topic: 'sparzielrechner vs sparziel-rechner' },
  { a: 'autokreditrechner', b: 'autokredit-rechner', topic: 'autokreditrechner vs autokredit-rechner' },
  { a: 'standardabweichung-rechner', b: 'varianz-standardabweichung-stichprobe-rechner', topic: 'Standardabweichung vs Stichprobenvarianz' },
  { a: 'kreisrechner', b: 'kreis-umfang-rechner', topic: 'Kreisrechner vs Kreis-Umfang-Rechner' },
  { a: 'datumsdifferenz', b: 'tage-zwischen-zwei-daten', topic: 'Datumsdifferenz vs Tage zwischen zwei Daten' },
  { a: 'inflationsrechner', b: 'kaufkraftverlust-rechner', topic: 'Inflationsrechner vs Kaufkraftverlust' },
  { a: 'geburtstagsrechner', b: 'tage-bis-geburtstag', topic: 'Geburtstagsrechner vs Tage bis Geburtstag' },
  { a: 'prozentrechner', b: 'prozent-von-prozent-rechner', topic: 'Prozentrechner vs Prozent von Prozent' },
];

console.log('=== DETAILED PAIRWISE CONFLICT AUDIT ===\n');

for (const pair of pairsToExamine) {
  const ca = ALL_CALCULATORS.find(c => c.slug === pair.a);
  const cb = ALL_CALCULATORS.find(c => c.slug === pair.b);
  const seoa = seoMap.keywordMap.find((x: any) => x.slug === pair.a);
  const seob = seoMap.keywordMap.find((x: any) => x.slug === pair.b);

  console.log(`--------------------------------------------------------------------------------`);
  console.log(`TOPIC: ${pair.topic}`);
  console.log(`URL A: /rechner/${pair.a}/ (Exists: ${!!ca})`);
  if (ca) {
    console.log(`  Title A: ${ca.title}`);
    console.log(`  H1 A: ${ca.h1}`);
    console.log(`  Primary KW A: ${seoa?.primaryKeyword || 'N/A'}`);
    console.log(`  Formula A: ${ca.formula}`);
    console.log(`  Inputs A: ${ca.inputs.map(i => i.id).join(', ')}`);
  }
  console.log(`URL B: /rechner/${pair.b}/ (Exists: ${!!cb})`);
  if (cb) {
    console.log(`  Title B: ${cb.title}`);
    console.log(`  H1 B: ${cb.h1}`);
    console.log(`  Primary KW B: ${seob?.primaryKeyword || 'N/A'}`);
    console.log(`  Formula B: ${cb.formula}`);
    console.log(`  Inputs B: ${cb.inputs.map(i => i.id).join(', ')}`);
  }
}
