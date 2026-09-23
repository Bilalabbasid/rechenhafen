import fs from 'fs';
import path from 'path';

const orig = JSON.parse(fs.readFileSync(path.join(__dirname, 'original-content.json'), 'utf8'));
const origSlugs = Object.keys(orig);

const baseDir = 'src/data/calculators';
const extraDir = 'src/data/calculators/extra';

const baseFiles = fs.readdirSync(path.join(process.cwd(), baseDir)).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const extraFiles = fs.readdirSync(path.join(process.cwd(), extraDir)).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let baseCount = 0;
let extraCount = 0;

for (const s of origSlugs) {
  let found = false;
  for (const bf of baseFiles) {
    const c = fs.readFileSync(path.join(process.cwd(), baseDir, bf), 'utf8');
    if (c.includes(`slug: '${s}'`) || c.includes(`slug: "${s}"`)) {
      baseCount++;
      found = true;
      break;
    }
  }
  if (!found) {
    for (const ef of extraFiles) {
      const c = fs.readFileSync(path.join(process.cwd(), extraDir, ef), 'utf8');
      if (c.includes(`slug: '${s}'`) || c.includes(`slug: "${s}"`)) {
        extraCount++;
        found = true;
        break;
      }
    }
  }
}

console.log(`Original content items in base files: ${baseCount}`);
console.log(`Original content items in extra files: ${extraCount}`);
