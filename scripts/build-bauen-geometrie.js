const fs = require('fs');
const path = require('path');

const b1 = JSON.parse(fs.readFileSync('scripts/generators/calcs-bauen-part1.json', 'utf8'));
const b2 = JSON.parse(fs.readFileSync('scripts/generators/calcs-bauen-part2.json', 'utf8'));
const geo = JSON.parse(fs.readFileSync('scripts/generators/calcs-geometrie.json', 'utf8'));

const allCalcs = [...b1, ...b2, ...geo];
console.log('Total calculators to serialize:', allCalcs.length);

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
  // Indent calculateCode lines
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

export const EXTRA_BAUEN_GEOMETRIE: CalculatorDefinition[] = [
`;

for (const c of allCalcs) {
  code += serializeCalc(c);
}

code += '];\n';

const targetFile = path.join(__dirname, '../src/data/calculators/extra/bauenGeometrie.ts');
fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully written', targetFile);
