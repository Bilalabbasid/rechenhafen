const ts = require('typescript');
const fs = require('fs');
const file = 'src/data/calculators/extra/gesundheitFamilie.ts';
const content = fs.readFileSync(file, 'utf8');

const result = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const mod = {};
const fn = new Function('exports', 'require', result.outputText);
const mockRequire = (id) => {
  if (id === '@/lib/formatters') {
    return {
      formatNumber: (n) => String(n),
      formatCurrency: (n) => n + ' €',
      formatPercent: (n) => n + ' %'
    };
  }
  return {};
};
fn(mod, mockRequire);
const calcs = mod.EXTRA_GESUNDHEIT_FAMILIE;
console.log('Total calculators in gesundheitFamilie:', calcs.length);
const catCounts = {};
for (const c of calcs) {
  catCounts[c.category] = (catCounts[c.category] || 0) + 1;
}
console.log('Categories:', catCounts);

