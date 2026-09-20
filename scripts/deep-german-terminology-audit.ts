import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import fs from 'fs';
import path from 'path';

console.log(`Starting comprehensive German language & terminology audit across all 405 calculators...`);

interface IssueReport {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  field: string;
  current: string;
  recommendation: string;
}

const reports: IssueReport[] = [];

// Helper to check for space before "Rechner" when preceded by a noun (Deppenleerzeichen)
// e.g. "Prozent Rechner" instead of "Prozentrechner" or "Prozent-Rechner"
const DEPPENLEERZEICHEN_REGEX = /\b([A-ZÄÖÜ][a-zäöüß]{3,})\s+Rechner\b/;

// Words that are English or false friends in German UI / text
const EN_UI_WORDS = [
  'calculate', 'calculator', 'please', 'submit', 'reset', 'clear', 'default',
  'food cost', 'customer acquisition cost', 'customer lifetime value'
];

for (const calc of ALL_CALCULATORS) {
  const loc = calc.slug;

  // 1. Verify Display Name & Title formatting (Deppenleerzeichen & Durchkopplung)
  const deppenMatch = calc.name.match(DEPPENLEERZEICHEN_REGEX);
  if (deppenMatch) {
    // E.g. "Wareneinsatzquote Rechner" -> "Wareneinsatzquote-Rechner"
    reports.push({
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      category: calc.category,
      type: 'DEPPENLEERZEICHEN',
      field: 'name',
      current: calc.name,
      recommendation: `Kopplung mit Bindestrich: ${calc.name.replace(deppenMatch[0], deppenMatch[1] + '-Rechner')}`
    });
  }

  // 2. Check Display Name for awkward English parentheticals
  if (calc.name.includes('(Customer Acquisition Cost') || calc.name.includes('(Customer Lifetime Value') || calc.name.includes('(Food Cost')) {
    reports.push({
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      category: calc.category,
      type: 'AWKWARD_ENGLISH_NAME',
      field: 'name',
      current: calc.name,
      recommendation: 'Natürlicher deutscher Rechnername'
    });
  }

  // 3. Verify Search Terms & Keywords
  // German users search for terms like "zinseszins berechnen", "spritkosten rechner", etc.
  if (!calc.searchKeywords || calc.searchKeywords.length < 3) {
    reports.push({
      id: calc.id,
      slug: calc.slug,
      name: calc.name,
      category: calc.category,
      type: 'INSUFFICIENT_KEYWORDS',
      field: 'searchKeywords',
      current: JSON.stringify(calc.searchKeywords || []),
      recommendation: 'Mindestens 3 relevante deutsche Suchbegriffe'
    });
  }

  // 4. Check Inputs
  for (const inp of calc.inputs) {
    if (inp.label.includes('Download-Rate')) {
      reports.push({
        id: calc.id,
        slug: calc.slug,
        name: calc.name,
        category: calc.category,
        type: 'TERMINOLOGY',
        field: `input:${inp.id}.label`,
        current: inp.label,
        recommendation: 'Download-Geschwindigkeit (Mbit/s)'
      });
    }

    if (inp.label.toLowerCase().includes('rate') && !inp.label.toLowerCase().includes('monatsrate') && !inp.label.toLowerCase().includes('sparrate') && !inp.label.toLowerCase().includes('tilgungsrate') && !inp.label.toLowerCase().includes('kreditrate') && !inp.label.toLowerCase().includes('herzfrequenz') && !inp.label.toLowerCase().includes('pulsrate') && !inp.label.toLowerCase().includes('übertragungsrate') && !inp.label.toLowerCase().includes('churn rate') && !inp.label.toLowerCase().includes('conversion-rate') && !inp.label.toLowerCase().includes('geburtenrate') && !inp.label.toLowerCase().includes('sterberate') && !inp.label.toLowerCase().includes('abtragsrate') && !inp.label.toLowerCase().includes('fehlerquote')) {
      // Check if "rate" is used generically instead of "Zinssatz", "Quote" or "Rate"
      if (inp.label === 'Rate' || inp.label === 'Zinsrate') {
        reports.push({
          id: calc.id,
          slug: calc.slug,
          name: calc.name,
          category: calc.category,
          type: 'TERMINOLOGY',
          field: `input:${inp.id}.label`,
          current: inp.label,
          recommendation: 'Präziser Begriff (Zinssatz, Monatsrate oder Sparrate)'
        });
      }
    }
  }

  // 5. Check Result Labels
  if (calc.calculate) {
    try {
      const sampleInputs: Record<string, any> = {};
      for (const inp of calc.inputs) {
        sampleInputs[inp.id] = inp.defaultValue;
      }
      const res = calc.calculate(sampleInputs);
      if (res.primary && (res.primary.label.toLowerCase() === 'total' || res.primary.label.toLowerCase() === 'result')) {
        reports.push({
          id: calc.id,
          slug: calc.slug,
          name: calc.name,
          category: calc.category,
          type: 'ENGLISH_RESULT_LABEL',
          field: 'result.primary.label',
          current: res.primary.label,
          recommendation: 'Deutsches Label (z. B. Gesamtsumme, Endergebnis)'
        });
      }
    } catch (e) {
      // ignore calculation errors in audit
    }
  }

  // 6. Check FAQs
  if (calc.faqs) {
    for (let i = 0; i < calc.faqs.length; i++) {
      const faq = calc.faqs[i];
      if (faq.question.includes('? ?') || faq.question.endsWith('??')) {
        reports.push({
          id: calc.id,
          slug: calc.slug,
          name: calc.name,
          category: calc.category,
          type: 'PUNCTUATION',
          field: `faqs[${i}].question`,
          current: faq.question,
          recommendation: 'Einfaches Fragezeichen'
        });
      }
    }
  }

  // 7. Check Worked Example
  if (calc.workedExample) {
    if (calc.workedExample.title && calc.workedExample.title.toLowerCase().includes('example')) {
      reports.push({
        id: calc.id,
        slug: calc.slug,
        name: calc.name,
        category: calc.category,
        type: 'ENGLISH_IN_EXAMPLE',
        field: 'workedExample.title',
        current: calc.workedExample.title,
        recommendation: 'Deutscher Titel (z. B. Beispielrechnung)'
      });
    }
  }
}

console.log(`\nAudit Results:`);
console.log(`Total calculators checked: ${ALL_CALCULATORS.length}`);
console.log(`Issues found: ${reports.length}`);

for (const r of reports) {
  console.log(`- [${r.type}] ${r.slug} (${r.field}): "${r.current}" -> ${r.recommendation}`);
}
