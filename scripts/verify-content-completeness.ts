import { ALL_CALCULATORS } from '../src/data/calculators';
import { DATUM_ZEIT_CONTENT } from './content-definitions/datumZeit';
import { MATHEMATIK_CONTENT } from './content-definitions/mathematik';
import { FINANZEN_CONTENT } from './content-definitions/finanzen';
import { KREDIT_CONTENT } from './content-definitions/kredit';
import { AUTO_CONTENT } from './content-definitions/auto';
import { WOHNEN_CONTENT } from './content-definitions/wohnen';
import { HAUSHALT_CONTENT } from './content-definitions/haushalt';
import { ARBEIT_CONTENT } from './content-definitions/arbeit';
import { GESUNDHEIT_CONTENT } from './content-definitions/gesundheit';
import { FAMILIE_CONTENT } from './content-definitions/familie';
import { BAUEN_CONTENT } from './content-definitions/bauen';
import { GEOMETRIE_CONTENT } from './content-definitions/geometrie';
import { EINHEITEN_CONTENT } from './content-definitions/einheiten';
import { KOCHEN_CONTENT } from './content-definitions/kochen';
import { BUSINESS_CONTENT } from './content-definitions/business';
import { STATISTIK_CONTENT } from './content-definitions/statistik';

const ALL_CONTENT = {
  ...DATUM_ZEIT_CONTENT,
  ...MATHEMATIK_CONTENT,
  ...FINANZEN_CONTENT,
  ...KREDIT_CONTENT,
  ...AUTO_CONTENT,
  ...WOHNEN_CONTENT,
  ...HAUSHALT_CONTENT,
  ...ARBEIT_CONTENT,
  ...GESUNDHEIT_CONTENT,
  ...FAMILIE_CONTENT,
  ...BAUEN_CONTENT,
  ...GEOMETRIE_CONTENT,
  ...EINHEITEN_CONTENT,
  ...KOCHEN_CONTENT,
  ...BUSINESS_CONTENT,
  ...STATISTIK_CONTENT,
};

console.log(`Total calculators in ALL_CALCULATORS: ${ALL_CALCULATORS.length}`);
console.log(`Total defined content entries: ${Object.keys(ALL_CONTENT).length}`);

const missingSlugs: string[] = [];
for (const calc of ALL_CALCULATORS) {
  if (!ALL_CONTENT[calc.slug]) {
    missingSlugs.push(calc.slug);
  }
}

if (missingSlugs.length > 0) {
  console.error(`ERROR: ${missingSlugs.length} calculators missing from content definitions:`, missingSlugs);
} else {
  console.log('SUCCESS: All 405 calculators have bespoke content definitions!');
}

// Check generic phrases
const genericPatterns = [
  /mit unserem kostenlosen rechner/i,
  /dieses praktische tool/i,
  /unser rechner erm(ö|oe)glicht es/i,
  /schnell und einfach/i,
  /mit dem .* ermitteln sie wichtige kennzahlen/i,
  /achten sie bei der eingabe auf konsistente einheiten/i,
];

let patternMatches = 0;
for (const [slug, item] of Object.entries(ALL_CONTENT)) {
  const text = `${item.intro} ${item.details} ${item.faqs.map(f => `${f.question} ${f.answer}`).join(' ')}`;
  for (const pat of genericPatterns) {
    if (pat.test(text)) {
      console.warn(`[${slug}] Matches generic pattern: ${pat}`);
      patternMatches++;
    }
  }
}
console.log(`Generic pattern matches: ${patternMatches}`);

// Compute Jaccard 3-gram similarity across all 405
function getNGrams(text: string, n = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9äöüß\s]/g, '').trim().split(/\s+/).filter(Boolean);
  const ngrams = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.add(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const elem of setA) {
    if (setB.has(elem)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const items = Object.entries(ALL_CONTENT).map(([slug, item]) => ({
  slug,
  ngrams: getNGrams(`${item.intro} ${item.details} ${item.faqs.map(f => `${f.question} ${f.answer}`).join(' ')}`, 3),
}));

let highSimPairs = 0;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const sim = jaccardSimilarity(items[i].ngrams, items[j].ngrams);
    if (sim > 0.35) {
      console.log(`High sim pair (>0.35): ${items[i].slug} <-> ${items[j].slug} = ${sim.toFixed(3)}`);
      highSimPairs++;
    }
  }
}
console.log(`Pairwise Jaccard 3-gram high similarity pairs (>0.35): ${highSimPairs}`);
