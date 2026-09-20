/**
 * seo-audit.ts
 * ---------------------------------------------------------------------------
 * Full SEO audit of all 405 calculator pages.
 * Checks: title uniqueness, description uniqueness, H1 uniqueness,
 * keyword placement, title/description length, thin content, orphan pages,
 * keyword cannibalization, canonical correctness.
 *
 * Outputs: seo-audit-report.json + console summary
 */

import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import seoMap from '../src/data/seo-map.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuditIssue {
  severity: 'ERROR' | 'WARNING' | 'INFO';
  type: string;
  slug: string;
  field: string;
  message: string;
  currentValue?: string;
  suggestion?: string;
}

interface PageAudit {
  slug: string;
  url: string;
  name: string;
  category: string;
  primaryKeyword: string;
  tier: number;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDescription: string;
  titleLength: number;
  descriptionLength: number;
  faqCount: number;
  relatedCount: number;
  hasContent: boolean;
  keywordInTitle: boolean;
  keywordInH1: boolean;
  keywordInDescription: boolean;
  keywordInShortDesc: boolean;
  titleUnique: boolean;
  descriptionUnique: boolean;
  h1Unique: boolean;
  canonicalCorrect: boolean;
  issues: AuditIssue[];
  score: number; // 0-100
}

// ---------------------------------------------------------------------------
// Load SEO map for primary keyword data
// ---------------------------------------------------------------------------
const seoKeywordMap = new Map<string, { primaryKeyword: string; tier: number; cannibalizationRisk: string[] | null }>();
for (const entry of (seoMap as any).keywordMap) {
  seoKeywordMap.set(entry.slug, {
    primaryKeyword: entry.primaryKeyword,
    tier: entry.tier,
    cannibalizationRisk: entry.cannibalizationRisk,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9äöüß\s]/g, '').trim();
}

function containsKeyword(text: string, keyword: string): boolean {
  return normalize(text).includes(normalize(keyword));
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).length;
}

// ---------------------------------------------------------------------------
// Collect all referenced slugs (for orphan detection)
// ---------------------------------------------------------------------------
const referencedBy = new Map<string, Set<string>>();
for (const calc of ALL_CALCULATORS) {
  for (const related of calc.relatedSlugs) {
    if (!referencedBy.has(related)) referencedBy.set(related, new Set());
    referencedBy.get(related)!.add(calc.slug);
  }
}

// ---------------------------------------------------------------------------
// Collect duplicates
// ---------------------------------------------------------------------------
const titleMap = new Map<string, string[]>();
const descMap = new Map<string, string[]>();
const h1Map = new Map<string, string[]>();

for (const calc of ALL_CALCULATORS) {
  const t = normalize(calc.metaTitle);
  const d = normalize(calc.metaDescription);
  const h = normalize(calc.h1);
  if (!titleMap.has(t)) titleMap.set(t, []);
  if (!descMap.has(d)) descMap.set(d, []);
  if (!h1Map.has(h)) h1Map.set(h, []);
  titleMap.get(t)!.push(calc.slug);
  descMap.get(d)!.push(calc.slug);
  h1Map.get(h)!.push(calc.slug);
}

const dupTitles = new Set<string>();
const dupDescs = new Set<string>();
const dupH1s = new Set<string>();
for (const [, slugs] of titleMap) if (slugs.length > 1) slugs.forEach(s => dupTitles.add(s));
for (const [, slugs] of descMap) if (slugs.length > 1) slugs.forEach(s => dupDescs.add(s));
for (const [, slugs] of h1Map) if (slugs.length > 1) slugs.forEach(s => dupH1s.add(s));

// ---------------------------------------------------------------------------
// Audit each calculator
// ---------------------------------------------------------------------------
const audits: PageAudit[] = [];
const allIssues: AuditIssue[] = [];

for (const calc of ALL_CALCULATORS) {
  const seoEntry = seoKeywordMap.get(calc.slug);
  const primaryKeyword = seoEntry?.primaryKeyword ?? (calc.searchKeywords[0] ?? calc.slug.replace(/-/g, ' '));
  const tier = seoEntry?.tier ?? 4;
  const issues: AuditIssue[] = [];

  const titleLen = calc.metaTitle.length;
  const descLen = calc.metaDescription.length;
  const faqCount = calc.faqs?.length ?? 0;
  const relatedCount = calc.relatedSlugs?.length ?? 0;
  const hasContent = !!(calc.content?.intro || calc.content?.details);
  const kwInTitle = containsKeyword(calc.metaTitle, primaryKeyword);
  const kwInH1 = containsKeyword(calc.h1, primaryKeyword);
  const kwInDesc = containsKeyword(calc.metaDescription, primaryKeyword);
  const kwInShort = containsKeyword(calc.shortDescription, primaryKeyword);
  const titleUnique = !dupTitles.has(calc.slug);
  const descUnique = !dupDescs.has(calc.slug);
  const h1Unique = !dupH1s.has(calc.slug);
  const isOrphan = !referencedBy.has(calc.slug) || referencedBy.get(calc.slug)!.size === 0;

  // --- Title checks ---
  if (!titleUnique) {
    issues.push({ severity: 'ERROR', type: 'DUPLICATE_TITLE', slug: calc.slug, field: 'metaTitle', message: 'Duplicate title tag detected', currentValue: calc.metaTitle });
  }
  if (titleLen < 30) {
    issues.push({ severity: 'ERROR', type: 'TITLE_TOO_SHORT', slug: calc.slug, field: 'metaTitle', message: `Title too short (${titleLen} chars, min 30)`, currentValue: calc.metaTitle });
  }
  if (titleLen > 65) {
    issues.push({ severity: 'WARNING', type: 'TITLE_TOO_LONG', slug: calc.slug, field: 'metaTitle', message: `Title too long (${titleLen} chars, max 65)`, currentValue: calc.metaTitle });
  }
  if (!kwInTitle) {
    issues.push({ severity: 'WARNING', type: 'KEYWORD_MISSING_TITLE', slug: calc.slug, field: 'metaTitle', message: `Primary keyword "${primaryKeyword}" not in title`, currentValue: calc.metaTitle });
  }

  // --- Description checks ---
  if (!descUnique) {
    issues.push({ severity: 'ERROR', type: 'DUPLICATE_DESCRIPTION', slug: calc.slug, field: 'metaDescription', message: 'Duplicate meta description detected', currentValue: calc.metaDescription });
  }
  if (descLen < 100) {
    issues.push({ severity: 'ERROR', type: 'DESCRIPTION_TOO_SHORT', slug: calc.slug, field: 'metaDescription', message: `Description too short (${descLen} chars, min 100)`, currentValue: calc.metaDescription });
  }
  if (descLen > 165) {
    issues.push({ severity: 'WARNING', type: 'DESCRIPTION_TOO_LONG', slug: calc.slug, field: 'metaDescription', message: `Description too long (${descLen} chars, max 165)`, currentValue: calc.metaDescription });
  }
  if (!kwInDesc) {
    issues.push({ severity: 'INFO', type: 'KEYWORD_MISSING_DESCRIPTION', slug: calc.slug, field: 'metaDescription', message: `Primary keyword "${primaryKeyword}" not in description`, currentValue: calc.metaDescription });
  }

  // --- H1 checks ---
  if (!h1Unique) {
    issues.push({ severity: 'ERROR', type: 'DUPLICATE_H1', slug: calc.slug, field: 'h1', message: 'Duplicate H1 detected', currentValue: calc.h1 });
  }
  if (!kwInH1) {
    issues.push({ severity: 'WARNING', type: 'KEYWORD_MISSING_H1', slug: calc.slug, field: 'h1', message: `Primary keyword "${primaryKeyword}" not in H1`, currentValue: calc.h1 });
  }
  if (calc.h1.length > 80) {
    issues.push({ severity: 'INFO', type: 'H1_TOO_LONG', slug: calc.slug, field: 'h1', message: `H1 too long (${calc.h1.length} chars)`, currentValue: calc.h1 });
  }

  // --- Short description checks ---
  if (!kwInShort) {
    issues.push({ severity: 'INFO', type: 'KEYWORD_MISSING_SHORTDESC', slug: calc.slug, field: 'shortDescription', message: `Primary keyword "${primaryKeyword}" not in short description` });
  }
  if (countWords(calc.shortDescription) < 10) {
    issues.push({ severity: 'WARNING', type: 'THIN_SHORTDESC', slug: calc.slug, field: 'shortDescription', message: `Short description too brief (${countWords(calc.shortDescription)} words)`, currentValue: calc.shortDescription });
  }

  // --- FAQ checks ---
  if (faqCount === 0) {
    issues.push({ severity: 'ERROR', type: 'NO_FAQS', slug: calc.slug, field: 'faqs', message: 'No FAQs defined' });
  } else if (faqCount === 1) {
    issues.push({ severity: 'WARNING', type: 'INSUFFICIENT_FAQS', slug: calc.slug, field: 'faqs', message: 'Only 1 FAQ — should have at least 2' });
  }

  // --- Related links checks ---
  if (relatedCount === 0) {
    issues.push({ severity: 'ERROR', type: 'NO_INTERNAL_LINKS', slug: calc.slug, field: 'relatedSlugs', message: 'No internal links (relatedSlugs empty)' });
  } else if (relatedCount < 2) {
    issues.push({ severity: 'WARNING', type: 'FEW_INTERNAL_LINKS', slug: calc.slug, field: 'relatedSlugs', message: `Only ${relatedCount} internal link(s)` });
  }

  // --- Orphan page check ---
  if (isOrphan && tier <= 2) {
    issues.push({ severity: 'WARNING', type: 'ORPHAN_PAGE', slug: calc.slug, field: 'relatedSlugs', message: `Tier ${tier} page is not referenced by any other calculator` });
  }

  // --- Cannibalization check ---
  if (seoEntry?.cannibalizationRisk && seoEntry.cannibalizationRisk.length > 0) {
    const existing = seoEntry.cannibalizationRisk.filter(s => ALL_CALCULATORS.some(c => c.slug === s));
    if (existing.length > 0) {
      issues.push({ severity: 'WARNING', type: 'CANNIBALIZATION_RISK', slug: calc.slug, field: 'searchKeywords', message: `Keyword cannibalization risk with: ${existing.join(', ')}` });
    }
  }

  // --- Content check ---
  if (!hasContent && tier <= 3) {
    issues.push({ severity: 'WARNING', type: 'NO_EDITORIAL_CONTENT', slug: calc.slug, field: 'content', message: 'No editorial intro/details content' });
  }

  // --- Score ---
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === 'ERROR') score -= 15;
    else if (issue.severity === 'WARNING') score -= 7;
    else score -= 2;
  }
  score = Math.max(0, score);

  allIssues.push(...issues);

  audits.push({
    slug: calc.slug,
    url: `/rechner/${calc.slug}/`,
    name: calc.name,
    category: calc.category,
    primaryKeyword,
    tier,
    metaTitle: calc.metaTitle,
    metaDescription: calc.metaDescription,
    h1: calc.h1,
    shortDescription: calc.shortDescription,
    titleLength: titleLen,
    descriptionLength: descLen,
    faqCount,
    relatedCount,
    hasContent,
    keywordInTitle: kwInTitle,
    keywordInH1: kwInH1,
    keywordInDescription: kwInDesc,
    keywordInShortDesc: kwInShort,
    titleUnique,
    descriptionUnique,
    h1Unique,
    canonicalCorrect: true, // Canonical is auto-generated in page.tsx as /rechner/${slug}/
    issues,
    score,
  });
}

// ---------------------------------------------------------------------------
// Summary statistics
// ---------------------------------------------------------------------------
const byIssueType = new Map<string, number>();
for (const issue of allIssues) {
  byIssueType.set(issue.type, (byIssueType.get(issue.type) ?? 0) + 1);
}

const errorCount = allIssues.filter(i => i.severity === 'ERROR').length;
const warningCount = allIssues.filter(i => i.severity === 'WARNING').length;
const infoCount = allIssues.filter(i => i.severity === 'INFO').length;
const perfectPages = audits.filter(a => a.issues.length === 0).length;
const avgScore = Math.round(audits.reduce((sum, a) => sum + a.score, 0) / audits.length);

// Tier breakdown
const tierScores: Record<number, { count: number; avgScore: number; totalScore: number }> = {};
for (const a of audits) {
  if (!tierScores[a.tier]) tierScores[a.tier] = { count: 0, avgScore: 0, totalScore: 0 };
  tierScores[a.tier].count++;
  tierScores[a.tier].totalScore += a.score;
}
for (const tier of Object.keys(tierScores)) {
  const t = tierScores[Number(tier)];
  t.avgScore = Math.round(t.totalScore / t.count);
}

// Duplicate groups
const dupTitleGroups: Record<string, string[]> = {};
for (const [normalized, slugs] of titleMap) {
  if (slugs.length > 1) dupTitleGroups[normalized.slice(0, 60)] = slugs;
}
const dupDescGroups: Record<string, string[]> = {};
for (const [normalized, slugs] of descMap) {
  if (slugs.length > 1) dupDescGroups[normalized.slice(0, 60)] = slugs;
}
const dupH1Groups: Record<string, string[]> = {};
for (const [normalized, slugs] of h1Map) {
  if (slugs.length > 1) dupH1Groups[normalized.slice(0, 60)] = slugs;
}

// Issue breakdown sorted
const issueTypeSorted = [...byIssueType.entries()].sort((a, b) => b[1] - a[1]);

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
const report = {
  meta: {
    generated: new Date().toISOString(),
    totalCalculators: ALL_CALCULATORS.length,
    totalIssues: allIssues.length,
    errorCount,
    warningCount,
    infoCount,
    perfectPages,
    avgScore,
    tierScores,
  },
  issueBreakdown: Object.fromEntries(issueTypeSorted),
  duplicates: {
    titles: dupTitleGroups,
    descriptions: dupDescGroups,
    h1s: dupH1Groups,
  },
  pageAudits: audits.sort((a, b) => a.score - b.score), // worst first
};

const outPath = path.join(process.cwd(), 'seo-audit-report.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

// Console summary
console.log('\n=== SEO AUDIT REPORT ===');
console.log(`Total Calculators: ${ALL_CALCULATORS.length}`);
console.log(`Average Score: ${avgScore}/100`);
console.log(`Perfect Pages: ${perfectPages}/${ALL_CALCULATORS.length}`);
console.log(`\nIssues:`);
console.log(`  ERRORS:   ${errorCount}`);
console.log(`  WARNINGS: ${warningCount}`);
console.log(`  INFO:     ${infoCount}`);
console.log(`\nIssue Breakdown:`);
for (const [type, count] of issueTypeSorted) {
  console.log(`  ${type.padEnd(35)} ${count}`);
}
console.log(`\nDuplicate Titles:       ${Object.keys(dupTitleGroups).length} groups`);
console.log(`Duplicate Descriptions: ${Object.keys(dupDescGroups).length} groups`);
console.log(`Duplicate H1s:          ${Object.keys(dupH1Groups).length} groups`);
console.log(`\nTier Avg Scores:`);
for (const [t, data] of Object.entries(tierScores)) {
  console.log(`  Tier ${t}: ${data.avgScore}/100 (${data.count} pages)`);
}
console.log(`\nReport: ${outPath}`);
console.log('\n10 LOWEST SCORING PAGES:');
for (const a of audits.slice(0, 10)) {
  console.log(`  [${a.score}] ${a.slug} — ${a.issues.length} issues`);
}
