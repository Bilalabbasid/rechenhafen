import fs from 'fs';
import path from 'path';

const orig = JSON.parse(fs.readFileSync(path.join(__dirname, 'original-content.json'), 'utf8'));

let zeroFaqs = 0;
let oneFaq = 0;
let twoOrMoreFaqs = 0;

for (const slug of Object.keys(orig)) {
  const f = orig[slug].faqs || [];
  if (f.length === 0) zeroFaqs++;
  else if (f.length === 1) oneFaq++;
  else twoOrMoreFaqs++;
}

console.log(`Original content items: ${Object.keys(orig).length}`);
console.log(`Zero FAQs: ${zeroFaqs}, One FAQ: ${oneFaq}, Two or more FAQs: ${twoOrMoreFaqs}`);
