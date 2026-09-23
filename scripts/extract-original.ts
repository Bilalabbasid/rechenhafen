import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Extract original content and FAQs from git commit 7d52698
const baseDir = 'src/data/calculators';
const extraDir = 'src/data/calculators/extra';

const files = [
  ...fs.readdirSync(path.join(process.cwd(), baseDir)).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => `${baseDir}/${f}`),
  ...fs.readdirSync(path.join(process.cwd(), extraDir)).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => `${extraDir}/${f}`),
];

const originalMap: Record<string, {
  intro?: string;
  details?: string;
  faqs?: Array<{ question: string; answer: string }>;
}> = {};

for (const f of files) {
  const content = execSync(`git show 7d52698:${f}`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf8');
  
  // Extract calculator blocks
  const slugRegex = /slug:\s*['"]([a-z0-9-]+)['"]/g;
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    const slug = match[1];
    const pos = match.index;
    const block = content.slice(pos, pos + 3000);

    let intro: string | undefined;
    let details: string | undefined;
    const faqs: Array<{ question: string; answer: string }> = [];

    const introMatch = block.match(/intro:\s*(['"`])([\s\S]*?)\1/);
    if (introMatch) intro = introMatch[2];

    const detailsMatch = block.match(/details:\s*(['"`])([\s\S]*?)\1/);
    if (detailsMatch) details = detailsMatch[2];

    const faqMatches = block.matchAll(/question:\s*(['"`])([\s\S]*?)\1,\s*answer:\s*(['"`])([\s\S]*?)\3/g);
    for (const fm of faqMatches) {
      faqs.push({ question: fm[2], answer: fm[4] });
    }

    if (intro || details || faqs.length > 0) {
      originalMap[slug] = { intro, details, faqs: faqs.length > 0 ? faqs : undefined };
    }
  }
}

console.log(`Extracted original content for ${Object.keys(originalMap).length} calculators from git!`);
fs.writeFileSync(path.join(__dirname, 'original-content.json'), JSON.stringify(originalMap, null, 2), 'utf8');
