const fs = require('fs');

const file = 'src/data/calculators/extra/gesundheitFamilie.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace parts.push(` at beginning
if (content.startsWith('parts.push(`')) {
  content = content.replace('parts.push(`', '');
} else if (content.startsWith('parts.push(')) {
  content = content.replace('parts.push(', '');
}

// Clean any escaped backticks
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed gesundheitFamilie.ts');
