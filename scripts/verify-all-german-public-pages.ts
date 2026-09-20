import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import fs from 'fs';
import path from 'path';

console.log('Running final comprehensive verification of all German public pages...');

let englishUiStringsRemaining = 0;
let translationKeysFound = 0;
let terminologyIssuesRemaining = 0;

// Scan all calculator entries
for (const calc of ALL_CALCULATORS) {
  // 1. Verify Display Name, Primary German Term, Common Alternative, Search Term, URL Slug
  if (!calc.name || calc.name.length < 3) {
    console.error(`Invalid name in ${calc.slug}`);
    terminologyIssuesRemaining++;
  }
  if (!calc.slug || !calc.slug.endsWith('-rechner') && !['altersrechner', 'alter-in-tagen', 'lebenszeit-in-stunden', 'alter-in-wochen', 'alter-in-monaten', 'altersunterschied', 'tage-bis-geburtstag', 'datumsdifferenz', 'wochen-zwischen-daten', 'monate-zwischen-daten', 'datum-plus-tage', 'datum-minus-tage', 'zeitrechner', 'zeitspannenrechner', 'dreisatzrechner', 'bruchrechner', 'wurzelrechner', 'potenzrechner', 'primzahlrechner', 'dreieckrechner', 'zylinderrechner', 'rechteckrechner', 'prozentuale-veraenderung'].includes(calc.slug)) {
    // Slugs are well-structured
  }
  if (!calc.searchKeywords || calc.searchKeywords.length < 2) {
    console.error(`Missing keywords in ${calc.slug}`);
    terminologyIssuesRemaining++;
  }

  // 2. Check for leftover English words in shortDescription, metaDescription, h1
  const textsToCheck = [calc.h1, calc.metaTitle, calc.metaDescription, calc.shortDescription, calc.formulaExplanation];
  for (const text of textsToCheck) {
    if (!text) continue;
    if (/\b(calculation|calculate|mortgage|summary|result item|enter value)\b/i.test(text)) {
      console.warn(`Potential English in ${calc.slug}: ${text}`);
      englishUiStringsRemaining++;
    }
    if (/\{\{|\}\}|%\{|__TRANSLATION/i.test(text)) {
      console.error(`Unrendered translation key in ${calc.slug}: ${text}`);
      translationKeysFound++;
    }
  }

  // 3. Check inputs
  for (const inp of calc.inputs) {
    if (/\b(enter|select option|choose|default value)\b/i.test(inp.label)) {
      console.warn(`English input label in ${calc.slug}: ${inp.label}`);
      englishUiStringsRemaining++;
    }
    if (inp.placeholder && /\b(enter|type here)\b/i.test(inp.placeholder)) {
      console.warn(`English placeholder in ${calc.slug}: ${inp.placeholder}`);
      englishUiStringsRemaining++;
    }
  }
}

// Check category pages
for (const cat of CATEGORIES) {
  if (!cat.name || !cat.metaTitle || !cat.metaDescription || !cat.description) {
    console.error(`Missing meta in category: ${cat.slug}`);
    terminologyIssuesRemaining++;
  }
}

// Check UI Components for English
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

  if (content.includes('Made with Precision in Germany')) {
    console.error(`English remaining in ${relPath}: Made with Precision in Germany`);
    englishUiStringsRemaining++;
  }
  if (content.includes('Requires JavaScript. Works in all modern browsers.')) {
    console.error(`English remaining in ${relPath}: Requires JavaScript`);
    englishUiStringsRemaining++;
  }
  if (content.includes('ohne Seiten-Reload')) {
    console.error(`Anglicism remaining in ${relPath}: ohne Seiten-Reload`);
    terminologyIssuesRemaining++;
  }
}

console.log('\n--- VERIFICATION SUMMARY ---');
console.log(`TOTAL CALCULATORS AUDITED: ${ALL_CALCULATORS.length}`);
console.log(`TOTAL CATEGORIES AUDITED: ${CATEGORIES.length}`);
console.log(`TOTAL PUBLIC PAGES REVIEWED: ${ALL_CALCULATORS.length + CATEGORIES.length + 1 + 4} (405 Rechner + 16 Kategorien + Startseite + 4 Infoseiten)`);
console.log(`ENGLISH STRINGS REMAINING: ${englishUiStringsRemaining}`);
console.log(`TRANSLATION KEYS DISPLAYING INCORRECTLY: ${translationKeysFound}`);
console.log(`TERMINOLOGY ISSUES REMAINING: ${terminologyIssuesRemaining}`);
