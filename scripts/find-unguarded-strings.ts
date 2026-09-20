import fs from 'fs';
import path from 'path';

const dirs = [
  path.join(__dirname, '../src/data/calculators'),
  path.join(__dirname, '../src/data/calculators/extra'),
];

const patterns = [
  /([a-zA-Z0-9_]+)\.toUpperCase\(\)/g,
  /([a-zA-Z0-9_]+)\.toLowerCase\(\)/g,
  /([a-zA-Z0-9_]+)\.startsWith\(/g,
  /([a-zA-Z0-9_]+)\.replace\(/g,
  /([a-zA-Z0-9_]+)\.split\(/g,
];

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      for (const p of patterns) {
        let match;
        while ((match = p.exec(line)) !== null) {
          const varName = match[1];
          if (!['String', 'Math', 'JSON', 'Object', 'Array', 'formatNumber', 'formatCurrency', 'formatPercent', 'c', 'calc'].includes(varName)) {
            // Check if line or preceding lines guard this variable
            if (!line.includes(`String(${varName}`) && !line.includes(`${varName} ?`) && !line.includes(`${varName} &&`) && !line.includes(`${varName} ||`) && !line.includes(`${varName}?.`)) {
              console.log(`${f}:${idx + 1}: ${line.trim()}`);
            }
          }
        }
      }
    });
  }
}
