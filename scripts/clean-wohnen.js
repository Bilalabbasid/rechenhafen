const fs = require('fs');
let content = fs.readFileSync('src/data/calculators/extra/wohnenHaushalt.ts', 'utf-8');
content = content.split('\\`').join('`');
content = content.split('\\$').join('$');
fs.writeFileSync('src/data/calculators/extra/wohnenHaushalt.ts', content, 'utf-8');
console.log('Successfully cleaned wohnenHaushalt.ts');
