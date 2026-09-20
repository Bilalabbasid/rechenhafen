const fs = require('fs');

function extractSlugs(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  return matches.map(m => m[1]);
}

console.log('einheiten.ts slugs:', extractSlugs('src/data/calculators/einheiten.ts'));
console.log('kochen.ts slugs:', extractSlugs('src/data/calculators/kochen.ts'));
