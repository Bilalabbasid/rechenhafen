import { ALL_CALCULATORS, getCalculatorBySlug } from '../src/data/calculators';

for (const c of ALL_CALCULATORS) {
  for (const rel of c.relatedSlugs) {
    if (!getCalculatorBySlug(rel)) {
      console.log(`BROKEN in '${c.slug}': '${rel}'`);
    }
  }
}
