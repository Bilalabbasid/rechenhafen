const fs = require('fs');
const file = process.argv[2];
if (!file) {
  console.error('No file specified');
  process.exit(1);
}
let content = fs.readFileSync(file, 'utf-8');
content = content.split('\\`').join('`');
content = content.split('\\$').join('$');
fs.writeFileSync(file, content, 'utf-8');
console.log('Cleaned', file);
