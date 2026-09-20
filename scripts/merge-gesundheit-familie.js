const fs = require('fs');
const path = require('path');

const part1Path = path.join(__dirname, 'generators/generate-gesundheit-familie-part1.js');
const part2Path = path.join(__dirname, 'generators/generate-gesundheit-familie-part2.js');
const targetPath = path.join(__dirname, '../src/data/calculators/extra/gesundheitFamilie.ts');

const lines1 = fs.readFileSync(part1Path, 'utf8').split(/\r?\n/);
const lines2 = fs.readFileSync(part2Path, 'utf8').split(/\r?\n/);

// In part1: line 8 (index 7) starts the code: `import { CalculatorDefinition }...`
// line 1369 (index 1368) is `  },`
// In part2: line 4 (index 3) starts `  // ==================== FAMILIE...`
// line 1396 (index 1395) is `];`

// Let's find index where import starts
const start1 = lines1.findIndex(l => l.includes("import { CalculatorDefinition }"));
let end1 = -1;
for (let i = lines1.length - 1; i >= 0; i--) {
  if (lines1[i].trim() === '},' && lines1[i+1] && lines1[i+1].includes(');')) {
    end1 = i;
    break;
  }
}

const start2 = lines2.findIndex(l => l.includes('// ==================== FAMILIE'));
const end2 = lines2.findIndex((l, idx) => idx > start2 && l.trim() === '];');

console.log({ start1, end1, start2, end2 });

let combined = lines1.slice(start1, end1 + 1).concat(lines2.slice(start2, end2 + 1)).join('\n');

// Clean escaped backticks and escaped dollar signs
combined = combined.replace(/\\`/g, '`');
combined = combined.replace(/\\\$/g, '$');

fs.writeFileSync(targetPath, combined, 'utf8');
console.log('Successfully wrote to', targetPath);
