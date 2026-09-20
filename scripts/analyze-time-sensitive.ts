import { ALL_CALCULATORS } from '../src/data/calculators';

const currentlyTimeSensitive = ALL_CALCULATORS.filter(c => c.isTimeSensitive);
console.log(`Currently marked time-sensitive (${currentlyTimeSensitive.length}):`);
for (const c of currentlyTimeSensitive) {
  console.log(`- ${c.slug}: ${c.name} (Source: ${c.timeSensitiveMeta?.source || 'N/A'})`);
}

// Search for calculators that mention taxes, laws, statutory fees, minimum wage, citizen's income, etc.
const keywords = [
  'steuer', 'pauschale', 'mindestlohn', 'buergergeld', 'bürgergeld', 'arbeitslosengeld',
  'elterngeld', 'kindergeld', 'mutterschaftsgeld', 'krankengeld', 'kurzarbeitergeld',
  'pflegegeld', 'bafög', 'bafoeg', 'sozialabgaben', 'renten', 'minijob', 'midijob',
  'einspeiseverguetung', 'co2-abgabe', 'co2-preis', 'grundsteuer', 'grunderwerbsteuer',
  'vorfaelligkeit', 'dienstwagen', 'geldwerter vorteil', 'pendlerpauschale',
  'strompreis', 'gaspreis', 'gesetz', 'geg', 'din 277', 'din 1333'
];

const potentialTimeSensitive: typeof ALL_CALCULATORS = [];
for (const c of ALL_CALCULATORS) {
  if (c.isTimeSensitive) continue;
  const fullText = `${c.slug} ${c.name} ${c.metaDescription} ${c.formulaExplanation}`.toLowerCase();
  for (const kw of keywords) {
    if (fullText.includes(kw)) {
      potentialTimeSensitive.push(c);
      break;
    }
  }
}

console.log(`\nPotential time-sensitive calculators needing review (${potentialTimeSensitive.length}):`);
for (const c of potentialTimeSensitive) {
  console.log(`- [${c.category}] ${c.slug}: ${c.name}`);
}
