const ts = require('typescript');
const fs = require('fs');

const file = 'src/data/calculators/extra/einheitenKochen.ts';
const content = fs.readFileSync(file, 'utf8');

const transpiled = ts.transpileModule(content, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

const mod = {};
const mockRequire = (id) => {
  return {
    formatNumber: (n, d = 2) => Number(n).toFixed(d),
    formatCurrency: (n) => Number(n).toFixed(2) + ' €',
    formatPercent: (n) => Number(n).toFixed(1) + ' %',
  };
};

const fn = new Function('exports', 'require', transpiled);
fn(mod, mockRequire);

const list = mod.EXTRA_EINHEITEN_KOCHEN;
console.log('Total calculators in EXTRA_EINHEITEN_KOCHEN:', list.length);

const catCounts = {};
for (const c of list) {
  catCounts[c.category] = (catCounts[c.category] || 0) + 1;
}
console.log('Categories:', catCounts);

let calcErrors = 0;
for (const c of list) {
  const defaultInputs = {};
  for (const inp of c.inputs) {
    defaultInputs[inp.id] = inp.defaultValue;
  }
  try {
    const res = c.calculate(defaultInputs);
    if (!res || !res.primary) {
      console.error(`Invalid result for ${c.slug}:`, res);
      calcErrors++;
    }
    if (isNaN(res.primary.value) || !isFinite(res.primary.value)) {
      console.error(`NaN/Infinity in primary value for ${c.slug}:`, res.primary.value);
      calcErrors++;
    }
  } catch (err) {
    console.error(`Calculation error in ${c.slug}:`, err.message);
    calcErrors++;
  }
}
console.log(`Calculation tests finished with ${calcErrors} errors.`);
