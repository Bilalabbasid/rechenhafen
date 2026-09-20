import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import fs from 'fs';
import path from 'path';

// Known English terms or false friends or machine-translation markers
const ENGLISH_SUSPECTS = [
  /\bcalculate\b/i,
  /\bcalculator\b/i,
  /\bresult\b/i,
  /\bresults\b/i,
  /\binput\b/i,
  /\binputs\b/i,
  /\benter\b/i,
  /\bplease\b/i,
  /\bdefault\b/i,
  /\bmonthly\b/i,
  /\byearly\b/i,
  /\bdaily\b/i,
  /\binterest rate\b/i,
  /\bprincipal\b/i,
  /\bloan\b/i,
  /\bmortgage\b/i,
  /\btax\b/i,
  /\btaxes\b/i,
  /\bgross\b/i,
  /\bnet\b/i,
  /\baverage\b/i,
  /\btotal\b/i,
  /\bsubmit\b/i,
  /\breset\b/i,
  /\bclear\b/i,
  /\bmade with\b/i,
  /\bprecision in germany\b/i,
  /\bfaq\b/i, // FAQ is ok, but check context
  /\bformula\b/i,
  /\bexample\b/i,
  /\bcategory\b/i,
  /\bweight\b/i,
  /\bheight\b/i,
  /\bage\b/i,
  /\bdistance\b/i,
  /\bspeed\b/i,
  /\bpower\b/i,
  /\benergy\b/i,
  /\bconsumption\b/i,
  /\bcost\b/i,
  /\bcosts\b/i,
  /\bprice\b/i,
  /\bamount\b/i,
  /\bvalue\b/i,
  /\brate\b/i,
  /\byears\b/i,
  /\bmonths\b/i,
  /\bdays\b/i,
  /\bhours\b/i,
  /\bminutes\b/i,
  /\bseconds\b/i,
  /\bplaceholder\b/i,
  /\blorem\b/i,
  /\bipsum\b/i,
  /\bundefined\b/i,
  /\bnull\b/i,
  /\bNaN\b/
];

// Typical AI filler patterns in German
const AI_FILLER_PATTERNS = [
  /in der heutigen (schnelllebigen )?welt/i,
  /egal ob jung oder alt/i,
  /mit nur wenigen klicks/i,
  /kinderleicht/i,
  /im handumdrehen/i,
  /lassen sie den rechner die magie/i,
  /ein unverzichtbares werkzeug/i,
  /ob sie nun ein/i,
  /tauchen sie ein in/i
];

// Deppenleerzeichen detection (e.g. "Rechner Name Rechner")
const DEPPENLEERZEICHEN_PATTERNS = [
  /[A-ZÄÖÜ][a-zäöüß]+\s+Rechner\b/, // except when preceded by prep or part of name
];

interface AuditIssue {
  type: 'ENGLISH_TERM' | 'AI_FILLER' | 'UNNATURAL_DE' | 'DU_SIE_INCONSISTENCY' | 'TYPO' | 'TERMINOLOGY';
  location: string;
  field: string;
  text: string;
  suggestion?: string;
}

const issues: AuditIssue[] = [];

console.log('Scanning 405 calculators and UI files for German language quality...');

// 1. Scan UI components and Pages
const UI_FILES = [
  'src/components/common/Header.tsx',
  'src/components/common/Footer.tsx',
  'src/components/common/SearchBar.tsx',
  'src/components/calculator/CalculatorRunner.tsx',
  'src/components/calculator/FormulaBox.tsx',
  'src/components/calculator/FaqAccordion.tsx',
  'src/components/calculator/RelatedCalculators.tsx',
  'src/components/calculator/Breadcrumbs.tsx',
  'src/app/page.tsx',
  'src/app/[kategorie]/page.tsx',
  'src/app/rechner/[slug]/page.tsx',
  'src/app/ueber-uns/page.tsx',
  'src/app/methodik/page.tsx',
  'src/app/impressum/page.tsx',
  'src/app/datenschutz/page.tsx',
];

for (const relPath of UI_FILES) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');

  // Check for English patterns in template strings or text
  if (content.includes('Made with Precision in Germany')) {
    issues.push({
      type: 'ENGLISH_TERM',
      location: relPath,
      field: 'Footer',
      text: 'Made with Precision in Germany',
      suggestion: 'Entwickelt und gepflegt in Deutschland'
    });
  }

  // Check for other accidental English UI terms
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // skip imports and technical attributes
    if (line.includes('import ') || line.includes('className=') || line.includes('href=') || line.includes('key=')) return;
    
    for (const pattern of AI_FILLER_PATTERNS) {
      if (pattern.test(line)) {
        issues.push({
          type: 'AI_FILLER',
          location: `${relPath}:${idx + 1}`,
          field: 'Text',
          text: line.trim()
        });
      }
    }
  });
}

// 2. Scan all 405 calculators
let duCount = 0;
let sieCount = 0;

for (const calc of ALL_CALCULATORS) {
  const loc = `calc:${calc.slug}`;

  // Check titles and slugs
  if (!calc.name || calc.name.trim().length === 0) {
    issues.push({ type: 'UNNATURAL_DE', location: loc, field: 'name', text: 'Empty calculator name' });
  }

  // Check English words in name
  if (/\b(calculator|calc)\b/i.test(calc.name)) {
    issues.push({ type: 'ENGLISH_TERM', location: loc, field: 'name', text: calc.name });
  }

  // Check descriptions
  const allTexts = [
    { field: 'shortDescription', val: calc.shortDescription },
    { field: 'formulaExplanation', val: calc.formulaExplanation },
    { field: 'content.intro', val: calc.content?.intro || '' },
    { field: 'content.details', val: calc.content?.details || '' },
  ];

  for (const item of allTexts) {
    if (!item.val) continue;

    // Check for Du vs Sie
    if (/\b(du|dich|dir|dein|deine|deinem|deinen|deiner|deines)\b/i.test(item.val)) {
      duCount++;
    }
    if (/\b(Sie|Ihnen|Ihr|Ihre|Ihrem|Ihren|Ihrer|Ihres)\b/.test(item.val)) {
      sieCount++;
    }

    for (const filler of AI_FILLER_PATTERNS) {
      if (filler.test(item.val)) {
        issues.push({
          type: 'AI_FILLER',
          location: loc,
          field: item.field,
          text: item.val
        });
      }
    }
  }

  // Check Inputs
  for (const inp of calc.inputs) {
    if (!inp.label) {
      issues.push({ type: 'UNNATURAL_DE', location: loc, field: `input:${inp.id}`, text: 'Missing label' });
    }
    if (/\b(enter|select|input|choose)\b/i.test(inp.label)) {
      issues.push({ type: 'ENGLISH_TERM', location: loc, field: `input:${inp.id}.label`, text: inp.label });
    }
    if (inp.placeholder && /\b(enter|type|eg|e\.g\.)\b/i.test(inp.placeholder)) {
      issues.push({ type: 'ENGLISH_TERM', location: loc, field: `input:${inp.id}.placeholder`, text: inp.placeholder });
    }
    if (inp.options) {
      for (const opt of inp.options) {
        if (/\b(select|none|default)\b/i.test(opt.label)) {
          issues.push({ type: 'ENGLISH_TERM', location: loc, field: `input:${inp.id}.opt:${opt.value}`, text: opt.label });
        }
      }
    }
  }

  // Check FAQs
  if (calc.faqs) {
    for (const faq of calc.faqs) {
      for (const filler of AI_FILLER_PATTERNS) {
        if (filler.test(faq.question) || filler.test(faq.answer)) {
          issues.push({
            type: 'AI_FILLER',
            location: loc,
            field: 'faq',
            text: faq.question
          });
        }
      }
    }
  }

  // Check Terminology specifics:
  // E.g. "Gasrechner" vs "Gasverbrauch", "Zinsrechner", "Mehrwertsteuer" vs "Umsatzsteuer", "Körpergewicht", "Stundenlohn"
  if (calc.category === 'finanzen' && calc.name.toLowerCase().includes('zinssatz rechner')) {
    issues.push({
      type: 'TERMINOLOGY',
      location: loc,
      field: 'name',
      text: calc.name,
      suggestion: 'Zinssatzrechner oder Zinsrechner'
    });
  }
}

console.log(`\nScan Summary:`);
console.log(`Total calculators scanned: ${ALL_CALCULATORS.length}`);
console.log(`Pronoun occurrences: Sie-Form=${sieCount}, Du-Form=${duCount}`);
console.log(`Total issues flagged: ${issues.length}`);

if (issues.length > 0) {
  console.log('\nSample flagged issues:');
  console.log(JSON.stringify(issues.slice(0, 20), null, 2));
}
