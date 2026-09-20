import { ALL_CALCULATORS } from '../src/data/calculators';

let count = 0;
for (const c of ALL_CALCULATORS) {
  if (c.isTimeSensitive) {
    count++;
    console.log(`[TIME-SENSITIVE] ${c.slug}: ${c.name} (${c.timeSensitiveMeta?.source || 'No source'})`);
  }
}
console.log(`Total time-sensitive calculators flagged: ${count} / ${ALL_CALCULATORS.length}`);
