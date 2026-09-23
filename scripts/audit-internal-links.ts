import { ALL_CALCULATORS, getCalculatorBySlug, getRelatedCalculators } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

interface LinkIssue {
  slug: string;
  issue: string;
  details: string;
}

const issues: LinkIssue[] = [];

// 1. Audit relatedSlugs on all calculators
console.log('=== 1. AUDITING RELATED SLUGS ON ALL CALCULATORS ===');
let brokenRelatedCount = 0;
const calcSlugSet = new Set(ALL_CALCULATORS.map(c => c.slug));

for (const calc of ALL_CALCULATORS) {
  if (!calc.relatedSlugs || calc.relatedSlugs.length === 0) {
    issues.push({
      slug: calc.slug,
      issue: 'NO_RELATED_SLUGS',
      details: 'Calculator has empty relatedSlugs array',
    });
  }

  for (const rSlug of calc.relatedSlugs || []) {
    if (!calcSlugSet.has(rSlug)) {
      brokenRelatedCount++;
      issues.push({
        slug: calc.slug,
        issue: 'BROKEN_RELATED_SLUG',
        details: `Points to non-existent slug: "${rSlug}"`,
      });
    } else if (rSlug === calc.slug) {
      issues.push({
        slug: calc.slug,
        issue: 'SELF_REFERENCING_RELATED',
        details: `Calculator links to itself in relatedSlugs`,
      });
    }
  }
}

console.log(`Total broken relatedSlugs found: ${brokenRelatedCount}`);

// 2. Compute inbound link graph
console.log('\n=== 2. COMPUTING INBOUND LINK GRAPH ===');
const inboundLinks: Record<string, { count: number; sources: string[] }> = {};

for (const c of ALL_CALCULATORS) {
  inboundLinks[c.slug] = { count: 0, sources: [] };
}

// Inbound from Category Pages
for (const cat of CATEGORIES) {
  const catCalcs = ALL_CALCULATORS.filter(c => c.category === cat.slug);
  for (const c of catCalcs) {
    inboundLinks[c.slug].count += 1;
    inboundLinks[c.slug].sources.push(`Category:${cat.slug}`);
  }
}

// Inbound from Homepage
const POPULAR_SLUGS = [
  'teilzeit-gehaltsrechner',
  'prozentrechner',
  'zinseszinsrechner',
  'arbeitstage-rechner',
  'stundenlohnrechner',
  'spritkostenrechner',
  'kaufnebenkosten-rechner',
  'tilgungsrechner',
  'bmi-rechner',
  'altersrechner',
  'mwst-rechner',
  'stromkostenrechner',
];

for (const s of POPULAR_SLUGS) {
  if (inboundLinks[s]) {
    inboundLinks[s].count += 2; // quick badge + popular grid
    inboundLinks[s].sources.push('Homepage:popular');
  }
}

// Top 3 in each category card on homepage
for (const cat of CATEGORIES) {
  const top3 = ALL_CALCULATORS.filter(c => c.category === cat.slug).slice(0, 3);
  for (const c of top3) {
    inboundLinks[c.slug].count += 1;
    inboundLinks[c.slug].sources.push(`Homepage:card:${cat.slug}`);
  }
}

// Inbound from Calculator Pages (via getRelatedCalculators(calc, 6))
for (const calc of ALL_CALCULATORS) {
  const related = getRelatedCalculators(calc, 6);
  for (const rel of related) {
    if (inboundLinks[rel.slug]) {
      inboundLinks[rel.slug].count += 1;
      inboundLinks[rel.slug].sources.push(`Calc:${calc.slug}`);
    }
  }
}

// Check orphans and weakly linked
const orphans = ALL_CALCULATORS.filter(c => inboundLinks[c.slug].count === 0);
const weaklyLinked = ALL_CALCULATORS.filter(c => inboundLinks[c.slug].count <= 2);

console.log(`Orphan calculators (0 links): ${orphans.length}`);
console.log(`Weakly linked calculators (<= 2 links): ${weaklyLinked.length}`);

// 3. Crawl Depth Analysis
console.log('\n=== 3. CRAWL DEPTH ANALYSIS ===');
// Depth 0: Homepage
// Depth 1: Pages linked directly from Homepage
// Depth 2: Pages linked from Depth 1
const depthMap: Record<string, number> = {};

// Depth 1 calculators (linked directly from homepage)
const depth1Slugs = new Set<string>();
for (const s of POPULAR_SLUGS) depth1Slugs.add(s);
for (const cat of CATEGORIES) {
  const top3 = ALL_CALCULATORS.filter(c => c.category === cat.slug).slice(0, 3);
  for (const c of top3) depth1Slugs.add(c.slug);
}

for (const c of ALL_CALCULATORS) {
  if (depth1Slugs.has(c.slug)) {
    depthMap[c.slug] = 1;
  } else {
    // Linked from Category page (Category is at depth 1, so calc is at depth 2)
    depthMap[c.slug] = 2;
  }
}

const depth1Count = Object.values(depthMap).filter(d => d === 1).length;
const depth2Count = Object.values(depthMap).filter(d => d === 2).length;
const depth3OrMore = Object.values(depthMap).filter(d => d >= 3).length;

console.log(`Crawl Depth 1 (Directly from Homepage): ${depth1Count}`);
console.log(`Crawl Depth 2 (Via Category Page): ${depth2Count}`);
console.log(`Crawl Depth >= 3: ${depth3OrMore}`);

// 4. Audit Specific Topical Clusters requested by user
console.log('\n=== 4. AUDITING TOPICAL CLUSTERS ===');
const clusters = [
  {
    name: 'FINANCE',
    slugs: ['zinseszinsrechner', 'sparrechner', 'sparzielrechner', 'renditerechner', 'inflationsrechner'],
  },
  {
    name: 'CAR / MOBILITY',
    slugs: ['spritkostenrechner', 'fahrtkostenrechner', 'pendlerpauschale-rechner', 'verbrauch-rechner-kfz', 'kilometerkosten-rechner'],
  },
  {
    name: 'AGE / DATE',
    slugs: ['altersrechner', 'alter-in-tagen', 'geburtstermin-rechner', 'datumsdifferenz', 'arbeitstage-rechner'],
  },
  {
    name: 'HEALTH',
    slugs: ['bmi-rechner', 'kalorienbedarf-rechner', 'grundumsatz-bmr-rechner', 'tdee-gesamtenergiebedarf-rechner', 'koerperfettanteil-kfa-rechner', 'proteinbedarf-rechner'],
  },
];

for (const cluster of clusters) {
  console.log(`\nCluster [${cluster.name}]:`);
  for (const s of cluster.slugs) {
    const calc = getCalculatorBySlug(s);
    if (!calc) {
      console.log(`  [MISSING SLUG] ${s}`);
      continue;
    }
    const related = getRelatedCalculators(calc, 6).map(r => r.slug);
    const linksClusterMembers = cluster.slugs.filter(other => other !== s && related.includes(other));
    console.log(`  ${s} (inbound: ${inboundLinks[s]?.count || 0}) -> cluster links: [${linksClusterMembers.join(', ')}]`);
  }
}

// 5. Check Top 20 Most Linked & Least Linked
const sortedByInbound = [...ALL_CALCULATORS].sort((a, b) => inboundLinks[b.slug].count - inboundLinks[a.slug].count);
console.log('\n=== TOP 10 MOST LINKED CALCULATORS ===');
for (let i = 0; i < 10; i++) {
  const c = sortedByInbound[i];
  console.log(`  ${c.slug}: ${inboundLinks[c.slug].count} inbound links`);
}

console.log('\n=== LEAST LINKED CALCULATORS (BOTTOM 10) ===');
for (let i = sortedByInbound.length - 10; i < sortedByInbound.length; i++) {
  const c = sortedByInbound[i];
  console.log(`  ${c.slug}: ${inboundLinks[c.slug].count} inbound links`);
}
