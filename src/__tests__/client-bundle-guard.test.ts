import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// The calculator registry (`@/data/calculators`) contains every engine and all page texts.
// Imported by a client component it ships >1 MB of JavaScript to every visitor and runs all
// page-content computations in the browser (Lighthouse: ~2,8 s script evaluation on mobile).
// Client components must use the small /search-index.json via `@/lib/search/clientIndex`.
const FORBIDDEN_IN_CLIENT = [
  /from ['"]@\/data\/calculators(\/index)?['"]/,
  /import\(['"]@\/data\/calculators(\/index)?['"]\)/,
  /from ['"]@\/lib\/search\/searchEngine['"]/,
  /from ['"]@\/data\/calculators\/page-content/,
];

function listSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listSourceFiles(path);
    return /\.(tsx?|jsx?)$/.test(name) ? [path] : [];
  });
}

describe('client bundle guard', () => {
  it('no client component imports the full calculator registry or server search', () => {
    const offenders: string[] = [];
    for (const file of [...listSourceFiles('src/components'), ...listSourceFiles('src/app'), ...listSourceFiles('src/lib')]) {
      const src = readFileSync(file, 'utf8');
      if (!/^\s*['"]use client['"]/.test(src)) continue;
      for (const re of FORBIDDEN_IN_CLIENT) {
        if (re.test(src)) offenders.push(`${file} (${re.source})`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
