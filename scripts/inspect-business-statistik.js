const fs = require('fs');

function extractSlugs(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  return matches.map(m => m[1]);
}

console.log('business.ts slugs:', extractSlugs('src/data/calculators/business.ts'));
console.log('statistik.ts slugs:', extractSlugs('src/data/calculators/statistik.ts'));
