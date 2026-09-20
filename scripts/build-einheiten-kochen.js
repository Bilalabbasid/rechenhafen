const fs = require('fs');
const path = require('path');

const e1 = JSON.parse(fs.readFileSync('scripts/generators/calcs-einheiten.json', 'utf8'));
const e2 = JSON.parse(fs.readFileSync('scripts/generators/calcs-einheiten-part2.json', 'utf8'));
const k1 = JSON.parse(fs.readFileSync('scripts/generators/calcs-kochen.json', 'utf8'));
const k2 = JSON.parse(fs.readFileSync('scripts/generators/calcs-kochen-part2.json', 'utf8'));
const k3 = JSON.parse(fs.readFileSync('scripts/generators/calcs-kochen-part3.json', 'utf8'));

const allCalcs = [...e1, ...e2, ...k1, ...k2, ...k3];
console.log('Total calculators to serialize for einheitenKochen:', allCalcs.length);

function serializeCalc(c) {
  let s = '  {\n';
  s += `    id: ${JSON.stringify(c.id)},\n`;
  s += `    slug: ${JSON.stringify(c.slug)},\n`;
  s += `    name: ${JSON.stringify(c.name)},\n`;
  s += `    shortName: ${JSON.stringify(c.shortName)},\n`;
  s += `    category: ${JSON.stringify(c.category)},\n`;
  s += `    subcategory: ${JSON.stringify(c.subcategory)},\n`;
  s += `    metaTitle: ${JSON.stringify(c.metaTitle)},\n`;
  s += `    metaDescription: ${JSON.stringify(c.metaDescription)},\n`;
  s += `    h1: ${JSON.stringify(c.h1)},\n`;
  s += `    shortDescription: ${JSON.stringify(c.shortDescription)},\n`;
  s += `    searchKeywords: ${JSON.stringify(c.searchKeywords)},\n`;
  s += `    inputs: ${JSON.stringify(c.inputs, null, 6).replace(/\n/g, '\n    ')},\n`;
  s += `    calculate: (inputs: Record<string, any>) => {\n`;
  const calcLines = c.calculateCode.split('\n');
  for (const line of calcLines) {
    s += `      ${line}\n`;
  }
  s += `    },\n`;
  s += `    formula: ${JSON.stringify(c.formula)},\n`;
  s += `    formulaExplanation: ${JSON.stringify(c.formulaExplanation)},\n`;
  s += `    workedExample: ${JSON.stringify(c.workedExample, null, 6).replace(/\n/g, '\n    ')},\n`;
  s += `    faqs: ${JSON.stringify(c.faqs, null, 6).replace(/\n/g, '\n    ')},\n`;
  s += `    relatedSlugs: ${JSON.stringify(c.relatedSlugs)},\n`;
  s += '  },\n';
  return s;
}

let code = `import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_EINHEITEN_KOCHEN: CalculatorDefinition[] = [
`;

for (const c of allCalcs) {
  code += serializeCalc(c);
}

code += '];\n';

const targetFile = path.join(__dirname, '../src/data/calculators/extra/einheitenKochen.ts');
fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully written', targetFile);
