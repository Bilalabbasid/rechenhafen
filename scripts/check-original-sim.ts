import fs from 'fs';
import path from 'path';

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

const orig = JSON.parse(fs.readFileSync(path.join(__dirname, 'original-content.json'), 'utf8'));
const slugs = Object.keys(orig);

const items = slugs.map(s => {
  const item = orig[s];
  const text = [item.intro || '', item.details || '', ...(item.faqs || []).map((f: any) => `${f.question} ${f.answer}`)].join(' ');
  return {
    slug: s,
    text,
    ngrams: getNGrams(text, 3),
  };
});

let highSim = 0;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const sim = jaccardSimilarity(items[i].ngrams, items[j].ngrams);
    if (sim > 0.35) {
      console.log(`Original high sim: ${items[i].slug} <-> ${items[j].slug} = ${sim.toFixed(3)}`);
      highSim++;
    }
  }
}
console.log(`Total original items: ${items.length}, High similarity pairs (>0.35): ${highSim}`);
