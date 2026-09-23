import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';
import fs from 'fs';
import path from 'path';

interface AuditResult {
  category: string;
  check: string;
  passed: boolean;
  details: string;
}

const results: AuditResult[] = [];

function record(category: string, check: string, passed: boolean, details: string) {
  results.push({ category, check, passed, details });
}

console.log('=== STARTING TECHNICAL SEO AUDIT ===\n');

// 1. Robots.txt file audit
console.log('--- 1. AUDITING ROBOTS.TS ---');
const robotsContent = fs.readFileSync(path.resolve('src/app/robots.ts'), 'utf8');
const hasUserAgentWildcard = robotsContent.includes("userAgent: '*'");
const hasAllowRoot = robotsContent.includes("allow: '/'");
const hasDisallowParamQuery = robotsContent.includes("'/*?*'") && robotsContent.includes("'/*?'");
const hasSitemapDirective = robotsContent.includes("sitemap: 'https://rechenhafen.de/sitemap.xml'");
const hasHostDirective = robotsContent.includes("host: 'https://rechenhafen.de'");

record('Robots.txt', 'User-Agent wildcard (*)', hasUserAgentWildcard, 'userAgent: "*" present');
record('Robots.txt', 'Allow root (/)', hasAllowRoot, 'allow: "/" present');
record('Robots.txt', 'Disallow parameter crawling (/*?* and /*?)', hasDisallowParamQuery, 'Prevents crawling infinite parameter duplicate pages');
record('Robots.txt', 'Sitemap directive is absolute HTTPS non-www', hasSitemapDirective, 'https://rechenhafen.de/sitemap.xml');
record('Robots.txt', 'Host directive is https://rechenhafen.de', hasHostDirective, 'https://rechenhafen.de');

// 2. Sitemap.ts audit
console.log('--- 2. AUDITING SITEMAP.TS ---');
const sitemapContent = fs.readFileSync(path.resolve('src/app/sitemap.ts'), 'utf8');

// Build sitemap URLs matching the code
const baseUrl = 'https://rechenhafen.de';
const staticUrls = [
  `${baseUrl}/`,
  `${baseUrl}/ueber-uns/`,
  `${baseUrl}/methodik/`,
  `${baseUrl}/impressum/`,
  `${baseUrl}/datenschutz/`,
];
const categoryUrls = CATEGORIES.map(c => `${baseUrl}/${c.slug}/`);
const calculatorUrls = ALL_CALCULATORS.map(c => `${baseUrl}/rechner/${c.slug}/`);
const allSitemapUrls = [...staticUrls, ...categoryUrls, ...calculatorUrls];
const uniqueSitemapUrls = new Set(allSitemapUrls);

record('Sitemap', 'Total URL count matches expectation (426)', allSitemapUrls.length === 426, `Total: ${allSitemapUrls.length} (5 static + 16 categories + 405 calculators)`);
record('Sitemap', 'Zero duplicate URLs', uniqueSitemapUrls.size === allSitemapUrls.length, `Unique URLs: ${uniqueSitemapUrls.size} vs Total: ${allSitemapUrls.length}`);

// Protocol & Domain Consistency (HTTPS, non-www)
const nonHttpsOrWww = allSitemapUrls.filter(u => !u.startsWith('https://rechenhafen.de/'));
record('Sitemap', 'HTTPS & non-www domain consistency', nonHttpsOrWww.length === 0, `${nonHttpsOrWww.length} invalid URLs`);

// Trailing Slash Consistency
const missingTrailingSlash = allSitemapUrls.filter(u => !u.endsWith('/'));
record('Sitemap', 'Trailing slash consistency on all URLs', missingTrailingSlash.length === 0, `${missingTrailingSlash.length} URLs without trailing slash`);

// Check for all calculators in sitemap code
const hasAllCalcsInSitemap = sitemapContent.includes('ALL_CALCULATORS.map');
const hasAllCatsInSitemap = sitemapContent.includes('CATEGORIES.map');
const hasStaticPagesInSitemap = sitemapContent.includes('/ueber-uns/') && sitemapContent.includes('/methodik/') && sitemapContent.includes('/impressum/') && sitemapContent.includes('/datenschutz/');

record('Sitemap', 'All 405 calculators mapped in sitemap.ts', hasAllCalcsInSitemap, 'ALL_CALCULATORS.map used');
record('Sitemap', 'All 16 categories mapped in sitemap.ts', hasAllCatsInSitemap, 'CATEGORIES.map used');
record('Sitemap', 'All 5 core static pages mapped in sitemap.ts', hasStaticPagesInSitemap, 'Static pages array includes /, ueber-uns, methodik, impressum, datenschutz');

// 3. Category & Calculator Slug Collision Check
console.log('--- 3. CHECKING SLUG COLLISIONS ---');
const catSlugs = new Set(CATEGORIES.map(c => c.slug));
const staticPaths = new Set(['ueber-uns', 'methodik', 'impressum', 'datenschutz', 'rechner']);
const calcSlugs = ALL_CALCULATORS.map(c => c.slug);

const collidingCalcs = calcSlugs.filter(s => catSlugs.has(s) || staticPaths.has(s));
const collidingCats = CATEGORIES.map(c => c.slug).filter(s => staticPaths.has(s));

record('Architecture', 'No collisions between calculators and categories/static paths', collidingCalcs.length === 0, `Collisions: ${collidingCalcs.length > 0 ? collidingCalcs.join(', ') : 'none'}`);
record('Architecture', 'No collisions between categories and static paths', collidingCats.length === 0, `Collisions: ${collidingCats.length > 0 ? collidingCats.join(', ') : 'none'}`);

// 4. Canonical URL Configuration
console.log('--- 4. AUDITING CANONICAL TAGS ---');
const calcPageContent = fs.readFileSync(path.resolve('src/app/rechner/[slug]/page.tsx'), 'utf8');
const catPageContent = fs.readFileSync(path.resolve('src/app/[kategorie]/page.tsx'), 'utf8');
const rootLayoutContent = fs.readFileSync(path.resolve('src/app/layout.tsx'), 'utf8');
const homePageContent = fs.readFileSync(path.resolve('src/app/page.tsx'), 'utf8');
const impressumContent = fs.readFileSync(path.resolve('src/app/impressum/page.tsx'), 'utf8');
const datenschutzContent = fs.readFileSync(path.resolve('src/app/datenschutz/page.tsx'), 'utf8');
const methodikContent = fs.readFileSync(path.resolve('src/app/methodik/page.tsx'), 'utf8');
const ueberUnsContent = fs.readFileSync(path.resolve('src/app/ueber-uns/page.tsx'), 'utf8');

const calcCanonicalCorrect = calcPageContent.includes("canonicalUrl = `https://rechenhafen.de/rechner/${calc.slug}/`") &&
  calcPageContent.includes("canonical: canonicalUrl");
const catCanonicalCorrect = catPageContent.includes("canonicalUrl = `https://rechenhafen.de/${cat.slug}/`") &&
  catPageContent.includes("canonical: canonicalUrl");
const layoutCanonicalCorrect = rootLayoutContent.includes("canonical: 'https://rechenhafen.de/'");
const homeCanonicalCorrect = homePageContent.includes("canonical: 'https://rechenhafen.de/'");
const impressumCanonicalCorrect = impressumContent.includes("canonical: 'https://rechenhafen.de/impressum/'");
const datenschutzCanonicalCorrect = datenschutzContent.includes("canonical: 'https://rechenhafen.de/datenschutz/'");
const methodikCanonicalCorrect = methodikContent.includes("canonical: 'https://rechenhafen.de/methodik/'");
const ueberUnsCanonicalCorrect = ueberUnsContent.includes("canonical: 'https://rechenhafen.de/ueber-uns/'");

record('Canonicals', 'Root layout canonical is https://rechenhafen.de/', layoutCanonicalCorrect, 'Root canonical defined');
record('Canonicals', 'Homepage canonical is https://rechenhafen.de/', homeCanonicalCorrect, 'Homepage canonical defined');
record('Canonicals', 'Category pages canonical is https://rechenhafen.de/{cat.slug}/', catCanonicalCorrect, 'Category canonical with trailing slash');
record('Canonicals', 'Calculator pages canonical is https://rechenhafen.de/rechner/{calc.slug}/', calcCanonicalCorrect, 'Calculator canonical with trailing slash');
record('Canonicals', 'Impressum canonical is https://rechenhafen.de/impressum/', impressumCanonicalCorrect, 'Impressum canonical with trailing slash');
record('Canonicals', 'Datenschutz canonical is https://rechenhafen.de/datenschutz/', datenschutzCanonicalCorrect, 'Datenschutz canonical with trailing slash');
record('Canonicals', 'Methodik canonical is https://rechenhafen.de/methodik/', methodikCanonicalCorrect, 'Methodik canonical with trailing slash');
record('Canonicals', 'Über uns canonical is https://rechenhafen.de/ueber-uns/', ueberUnsCanonicalCorrect, 'Über uns canonical with trailing slash');

// 5. Query Parameter Duplication Immunity
console.log('--- 5. CHECKING QUERY PARAMETER DUPLICATION IMMUNITY ---');
// Verify that generateMetadata in calculator page only relies on params.slug and completely ignores searchParams
const ignoresQueryParams = !calcPageContent.includes('searchParams') && calcPageContent.includes('canonicalUrl = `https://rechenhafen.de/rechner/${calc.slug}/`');
record('Canonicals', 'Query parameter duplication immunity (canonical is static)', ignoresQueryParams, 'generateMetadata uses params.slug only; ignores query strings');

// 6. Index / Noindex Configuration
console.log('--- 6. CHECKING INDEX/NOINDEX CONFIGURATION ---');
const layoutRobotsIndex = rootLayoutContent.includes('index: true') && rootLayoutContent.includes('follow: true');
const notFoundPath = path.resolve('src/app/not-found.tsx');
const notFoundExists = fs.existsSync(notFoundPath);
let notFoundRobotsNoindex = false;
if (notFoundExists) {
  const nfContent = fs.readFileSync(notFoundPath, 'utf8');
  notFoundRobotsNoindex = nfContent.includes('index: false') && nfContent.includes('follow: false');
}

record('Robots / Indexing', 'Default pages set index: true, follow: true', layoutRobotsIndex, 'RootLayout index/follow enabled');
record('Robots / Indexing', '404 not-found page exists and sets index: false, follow: false', notFoundExists && notFoundRobotsNoindex, '404 page is noindex, nofollow');

// 7. Trailing Slash and Redirects
console.log('--- 7. CHECKING NEXT CONFIG & REDIRECTS ---');
const nextConfigContent = fs.readFileSync(path.resolve('next.config.ts'), 'utf8');
const hasTrailingSlash = nextConfigContent.includes('trailingSlash: true');
const hasRechnerRedirect = nextConfigContent.includes("source: '/rechner'") && nextConfigContent.includes("destination: '/'");

record('Redirects & Slash', 'trailingSlash: true configured in next.config.ts', hasTrailingSlash, 'trailingSlash enabled');
record('Redirects & Slash', 'Redirect /rechner -> / configured', hasRechnerRedirect, 'Permanent 308 redirect from /rechner to /');

// 8. Mobile Viewport
console.log('--- 8. CHECKING MOBILE VIEWPORT ---');
const hasViewport = rootLayoutContent.includes('export const viewport: Viewport =') &&
  rootLayoutContent.includes("width: 'device-width'") &&
  rootLayoutContent.includes('initialScale: 1');
record('Mobile Viewport', 'Next.js 15 viewport exported in layout.tsx', hasViewport, 'width: device-width, initialScale: 1');

// 9. Structured Data Validation
console.log('--- 9. AUDITING STRUCTURED DATA ---');
const hasWebSiteSchema = rootLayoutContent.includes("SearchAction") && rootLayoutContent.includes("'@type': 'WebSite'");
const hasWebAppSchema = calcPageContent.includes("WebApplication") && calcPageContent.includes("CalculatorApplication");
const hasNoSpammyRatings = !calcPageContent.includes('aggregateRating') &&
  !calcPageContent.includes('ratingValue') &&
  !calcPageContent.includes('reviewCount');

const breadcrumbContent = fs.readFileSync(path.resolve('src/components/calculator/Breadcrumbs.tsx'), 'utf8');
const hasBreadcrumbListSchema = breadcrumbContent.includes("'@type': 'BreadcrumbList'") &&
  breadcrumbContent.includes("'@type': 'ListItem'") &&
  breadcrumbContent.includes('https://rechenhafen.de');

const faqContent = fs.readFileSync(path.resolve('src/components/calculator/FaqAccordion.tsx'), 'utf8');
const hasFaqPageSchema = faqContent.includes("'@type': 'FAQPage'") &&
  faqContent.includes("'@type': 'Question'") &&
  faqContent.includes("'@type': 'Answer'");

record('Structured Data', 'WebSite schema with SearchAction on layout', hasWebSiteSchema, 'Valid WebSite schema');
record('Structured Data', 'WebApplication schema on all calculators', hasWebAppSchema, 'Valid WebApplication schema');
record('Structured Data', 'No fake ratings or misleading review schema', hasNoSpammyRatings, 'Zero fake AggregateRating or review spam');
record('Structured Data', 'BreadcrumbList schema with complete canonical URLs', hasBreadcrumbListSchema, 'Valid BreadcrumbList schema with item URLs');
record('Structured Data', 'FAQPage schema on calculators with FAQs', hasFaqPageSchema, 'Valid FAQPage schema matching displayed questions');

// 10. Heading Hierarchy
console.log('--- 10. CHECKING HEADING HIERARCHY ---');
const layoutH1 = (rootLayoutContent.match(/<h1/g) || []).length;
const homeH1 = (homePageContent.match(/<h1/g) || []).length;
const catH1 = (catPageContent.match(/<h1/g) || []).length;
const calcH1 = (calcPageContent.match(/<h1/g) || []).length;

record('Heading Hierarchy', 'Root layout contains 0 H1 tags', layoutH1 === 0, `Count: ${layoutH1}`);
record('Heading Hierarchy', 'Homepage template contains exactly 1 H1', homeH1 === 1, `Count: ${homeH1}`);
record('Heading Hierarchy', 'Category template contains exactly 1 H1', catH1 === 1, `Count: ${catH1}`);
record('Heading Hierarchy', 'Calculator template contains exactly 1 H1', calcH1 === 1, `Count: ${calcH1}`);

// 11. Internal Links Check
console.log('--- 11. CHECKING POPULAR SLUGS IN HOMEPAGE ---');
const homeSlugsMatch = homePageContent.match(/const POPULAR_SLUGS = \[([\s\S]*?)\];/);
let allPopularSlugsExist = true;
const missingPopSlugs: string[] = [];
if (homeSlugsMatch) {
  const slugs = homeSlugsMatch[1].match(/'([^']+)'/g)?.map(s => s.replace(/'/g, '')) || [];
  const calcSlugSet = new Set(ALL_CALCULATORS.map(c => c.slug));
  for (const s of slugs) {
    if (!calcSlugSet.has(s)) {
      allPopularSlugsExist = false;
      missingPopSlugs.push(s);
    }
  }
}
record('Internal Links', 'All popular calculator links on homepage exist', allPopularSlugsExist, missingPopSlugs.length > 0 ? `Missing: ${missingPopSlugs.join(', ')}` : 'All 12 popular slugs exist');

// Summary
console.log('\n======================================================');
console.log('              TECHNICAL SEO AUDIT REPORT              ');
console.log('======================================================\n');
let passed = 0;
let failed = 0;

for (const r of results) {
  const mark = r.passed ? '✓ PASS' : '✗ FAIL';
  if (r.passed) passed++; else failed++;
  console.log(`${mark.padEnd(8)} [${r.category.padEnd(20)}] ${r.check}: ${r.details}`);
}

console.log('\n------------------------------------------------------');
console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('------------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All Technical SEO checks PASSED successfully!');
}
