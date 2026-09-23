import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';

// Helper to compute n-grams
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

// Check for generic AI boilerplate phrases
const genericPatterns = [
  /mit dem .* ermitteln sie wichtige kennzahlen/i,
  /das tool f(ü|ue)hrt die mathematische berechnung/i,
  /achten sie bei der eingabe auf konsistente einheiten/i,
  /die berechnung basiert auf anerkannten fachlichen formeln/i,
  /alle berechnungen erfolgen deterministisch/i,
  /vergleichen sie verschiedene szenarien/i,
  /welche eingabewerte sind f(ü|ue)r den .* besonders wichtig/i,
  /f(ü|ue)r ein pr(ä|ae)zises ergebnis sollten die ausgangsgr(ö|oe)(ß|ss)en/i,
  /dieses praktische tool/i,
  /mit unserem kostenlosen rechner/i,
  /unser rechner erm(ö|oe)glicht es/i,
  /schnell und einfach/i,
  /schnell und methodisch fundiert/i,
];

let genericMatches = 0;
const pagesWithGeneric = new Set<string>();

for (const calc of ALL_CALCULATORS) {
  const allText = [
    calc.shortDescription || '',
    calc.content?.intro || '',
    calc.content?.details || '',
    ...(calc.faqs || []).map(f => `${f.question} ${f.answer}`),
  ].join(' ');

  for (const pat of genericPatterns) {
    if (pat.test(allText)) {
      genericMatches++;
      pagesWithGeneric.add(calc.slug);
    }
  }
}

console.log(`=== GENERIC / TEMPLATED CONTENT AUDIT ===`);
console.log(`Pages with generic boilerplate patterns: ${pagesWithGeneric.size} / ${ALL_CALCULATORS.length}`);
console.log(`Total pattern match occurrences: ${genericMatches}`);

// Compute pairwise similarities across all calculators (intro + details + faqs)
const texts = ALL_CALCULATORS.map(c => ({
  slug: c.slug,
  ngrams: getNGrams([
    c.content?.intro || '',
    c.content?.details || '',
    ...(c.faqs || []).map(f => `${f.question} ${f.answer}`),
  ].join(' '), 3),
}));

let highSimPairs = 0;
const highSimPages = new Set<string>();

for (let i = 0; i < texts.length; i++) {
  for (let j = i + 1; j < texts.length; j++) {
    const sim = jaccardSimilarity(texts[i].ngrams, texts[j].ngrams);
    if (sim > 0.35) {
      highSimPairs++;
      highSimPages.add(texts[i].slug);
      highSimPages.add(texts[j].slug);
    }
  }
}

console.log(`High-similarity page pairs (Jaccard > 0.35 on 3-grams): ${highSimPairs}`);
console.log(`Total pages involved in high similarity: ${highSimPages.size}`);
