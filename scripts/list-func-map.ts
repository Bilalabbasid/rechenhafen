import { ALL_CALCULATORS } from '../src/data/calculators';

const map: Record<string, string[]> = {};

for (const c of ALL_CALCULATORS) {
  const name = c.calculate.name || 'anonymous';
  if (!map[name]) map[name] = [];
  map[name].push(c.slug);
}

for (const [name, slugs] of Object.entries(map).sort((a,b) => b[1].length - a[1].length)) {
  console.log(`${name}: ${slugs.length} calculators (e.g. ${slugs.slice(0, 3).join(', ')})`);
}
