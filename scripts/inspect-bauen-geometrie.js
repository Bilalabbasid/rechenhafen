const fs = require('fs');

function extractSlugs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  return matches.map(m => m[1]);
}

console.log('bauen.ts slugs:', extractSlugs('src/data/calculators/bauen.ts'));
console.log('geometrie.ts slugs:', extractSlugs('src/data/calculators/geometrie.ts'));
