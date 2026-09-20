import { ALL_CALCULATORS } from '../src/data/calculators';

const queries = [
  'prozent',
  'dreisatz',
  'ggt',
  'wurzel',
  'potenz',
  'binaer',
  'prim',
  'spar',
  'rente',
  'gehalt',
  'brutto',
  'netto',
  'steuer',
  'miet',
  'kauf',
  'strom',
  'heiz',
  'gas',
  'sprit',
  'reifen',
  'auto',
];

for (const q of queries) {
  const matches = ALL_CALCULATORS.filter(c => c.slug.includes(q)).map(c => c.slug);
  console.log(`Query "${q}":`, matches);
}
