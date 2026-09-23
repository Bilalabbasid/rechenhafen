import fs from 'fs';
import path from 'path';
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

function formatStringLiteral(str: string): string {
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function updateCalculatorBlock(block: string, updates: {
  intro: string;
  details: string;
  faqs: Array<{ question: string; answer: string }>;
}): string {
  let updated = block;

  const formattedContent = `content: {\n      intro: ${formatStringLiteral(updates.intro)},\n      details: ${formatStringLiteral(updates.details)},\n    },`;
  if (updated.includes('content: {')) {
    updated = updated.replace(/content:\s*\{[\s\S]*?\},/, formattedContent);
  } else {
    if (updated.includes('faqs: [')) {
      updated = updated.replace('faqs: [', `${formattedContent}\n    faqs: [`);
    } else if (updated.includes('relatedSlugs: [')) {
      updated = updated.replace('relatedSlugs: [', `${formattedContent}\n    relatedSlugs: [`);
    }
  }

  const faqsStr = `faqs: [\n` + updates.faqs.map(f => `      { question: ${formatStringLiteral(f.question)}, answer: ${formatStringLiteral(f.answer)} },`).join('\n') + `\n    ],`;
  if (updated.includes('faqs: [')) {
    updated = updated.replace(/faqs:\s*\[[\s\S]*?\],/, faqsStr);
  } else if (updated.includes('relatedSlugs: [')) {
    updated = updated.replace('relatedSlugs: [', `${faqsStr}\n    relatedSlugs: [`);
  }

  return updated;
}

function getCalculatorRange(fileContent: string, slug: string): { start: number; end: number; block: string } | null {
  const marker = `slug: '${slug}'`;
  const marker2 = `slug: "${slug}"`;
  let pos = fileContent.indexOf(marker);
  if (pos === -1) pos = fileContent.indexOf(marker2);
  if (pos === -1) return null;

  let start = -1;
  for (let i = pos; i >= 0; i--) {
    const char = fileContent[i];
    if (char === '{') {
      const prevText = fileContent.slice(Math.max(0, i - 10), i);
      if (prevText.includes('\n')) {
        start = i;
        break;
      }
    }
  }
  if (start === -1) return null;

  let depth = 0;
  let inStr: string | null = null;
  let isEscaped = false;
  let end = -1;

  for (let i = start; i < fileContent.length; i++) {
    const char = fileContent[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === '\\') {
      isEscaped = true;
      continue;
    }
    if (inStr) {
      if (char === inStr) inStr = null;
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      inStr = char;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '/') {
      const nextNl = fileContent.indexOf('\n', i);
      if (nextNl !== -1) i = nextNl;
      continue;
    }
    if (char === '/' && fileContent[i + 1] === '*') {
      const closeComm = fileContent.indexOf('*/', i);
      if (closeComm !== -1) i = closeComm + 1;
      continue;
    }

    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) return null;
  return { start, end, block: fileContent.slice(start, end) };
}

console.log('\n=== Applying bespoke content to all 405 calculators across 24 files ===');

const baseDir = path.join(__dirname, '../src/data/calculators');
const extraDir = path.join(baseDir, 'extra');

const files = [
  ...fs.readdirSync(baseDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(baseDir, f)),
  ...fs.readdirSync(extraDir).filter(f => f.endsWith('.ts') && f !== 'index.ts').map(f => path.join(extraDir, f)),
];

let totalUpdated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const ranges: Array<{ slug: string; start: number; end: number; block: string }> = [];

  for (const calc of ALL_CALCULATORS) {
    if (content.includes(`slug: '${calc.slug}'`) || content.includes(`slug: "${calc.slug}"`)) {
      const range = getCalculatorRange(content, calc.slug);
      if (range) {
        ranges.push({ slug: calc.slug, ...range });
      }
    }
  }

  if (ranges.length === 0) continue;

  ranges.sort((a, b) => b.start - a.start);

  for (const r of ranges) {
    const bespoke = ALL_CONTENT[r.slug];
    if (!bespoke) {
      console.warn(`No bespoke content found for slug: ${r.slug}`);
      continue;
    }

    const newBlock = updateCalculatorBlock(r.block, bespoke);
    content = content.slice(0, r.start) + newBlock + content.slice(r.end);
    totalUpdated++;
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${ranges.length} calculators in ${path.basename(file)}`);
}

console.log(`\nSuccessfully applied bespoke content to ${totalUpdated} calculators!`);
