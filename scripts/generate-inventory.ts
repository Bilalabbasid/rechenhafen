import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS, getCalculatorBySlug, getRelatedCalculators } from '../src/data/calculators';
import { CATEGORIES, getCategoryBySlug } from '../src/data/categories';
import { getAllArticles } from '../src/data/ratgeber/articles';
import { formatMetaTitle } from '../src/lib/seo/title';

function escapeCsv(val: any): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function isDeepLink(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    const p = u.pathname.replace(/\/+$/, '');
    return p.length > 0 || u.search.length > 0 || u.hash.length > 0;
  } catch {
    return false;
  }
}

function checkDescriptionCut(desc: string): string {
  if (!desc || desc.trim() === '') return 'EMPTY';
  const trimmed = desc.trim();
  const openParen = (trimmed.match(/\(/g) || []).length;
  const closeParen = (trimmed.match(/\)/g) || []).length;
  if (openParen !== closeParen) {
    return 'YES (unclosed parenthesis)';
  }
  const quotesCount = (trimmed.match(/"/g) || []).length;
  if (quotesCount % 2 !== 0) {
    return 'YES (unclosed quote)';
  }
  const lastChar = trimmed[trimmed.length - 1];
  if (!['.', '!', '?', '…', '"', '“', ')'].includes(lastChar)) {
    return 'YES (cut mid-word or missing terminal punctuation)';
  }
  return 'NO';
}

// -------------------------------------------------------------
// 1. Gather boilerplate phrases across all calculators
// -------------------------------------------------------------
console.log('Detecting boilerplate phrases of 6+ words across calculators...');

const candidatePatterns = [
  'mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung',
  'Berechnungsmethodik, Annahmen & Verlässlichkeit',
  'Mathematische Formel & Rechenweg',
  'Rundung nach DIN 1333',
  'Rundung nach DIN 1333. Alle Rechenregeln, Prüfpipelines und die vollständige Referenztabelle finden Sie in unserer transparenten',
  'Die Berechnungen stützen sich auf die amtlichen Gesetzestexte der Bundesrepublik Deutschland',
  'Die Ergebnisse dienen der unverbindlichen Erstorientierung und ersetzen keine Rechts-, Steuer- oder Rentenberatung im Einzelfall.',
  'Die Ergebnisse stellen Näherungswerte zur Orientierung dar und ersetzen keinesfalls eine ärztliche Diagnose, therapeutische Behandlung oder professionelle Ernährungsberatung.',
  'Zinssätze und Renditen werden für den gewählten Zeithorizont als konstant modelliert.',
  'Zinseszinsberechnungen erfolgen unterjährig monatlich bzw. dekursiv gemäß üblicher Bankpraxis.',
  'Individuelle Transaktionskosten, Verwahrgebühren oder nach Ende der Zinsbindung geänderte Marktzinsen sind separat einzukalkulieren.',
  'Erfordert aktiviertes JavaScript. Funktioniert in allen modernen Webbrowsern.',
  'Berechnungen zu CO₂-Einsparungen und Energieverbräuchen orientieren sich an den offiziellen Kennzahlen des Umweltbundesamtes',
];

const ngramCounts = new Map<string, Set<string>>();

ALL_CALCULATORS.forEach((calc) => {
  const texts = [
    calc.shortDescription,
    calc.metaDescription,
    calc.formulaExplanation,
    calc.content?.intro || '',
    calc.content?.details || '',
    ...(calc.content?.tips || []),
    ...(calc.content?.sections?.map((s) => `${s.title} ${s.content}`) || []),
    ...(calc.quickReference?.map((q) => `${q.title} ${q.content}`) || []),
    ...(calc.faqs?.map((f) => `${f.question} ${f.answer}`) || []),
  ];

  const fullText = texts.join(' ')
    .replace(/[*_#`[\]()|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = fullText.split(' ').filter(Boolean);
  const seenForCalc = new Set<string>();

  for (let i = 0; i <= words.length - 6; i++) {
    const gram = words.slice(i, i + 6).join(' ');
    if (!seenForCalc.has(gram)) {
      seenForCalc.add(gram);
      if (!ngramCounts.has(gram)) {
        ngramCounts.set(gram, new Set());
      }
      ngramCounts.get(gram)!.add(calc.slug);
    }
  }
});

const boilerplateMap = new Map<string, { count: number; slugs: string[] }>();

candidatePatterns.forEach((phrase) => {
  const matchingSlugs: string[] = [];
  ALL_CALCULATORS.forEach((calc) => {
    const isLegalOrTax = ['arbeit-gehalt', 'recht-steuern', 'finanzen', 'kredit-schulden'].includes(calc.category);
    const isHealth = calc.category === 'gesundheit-fitness';
    const isFinance = ['finanzen', 'kredit-schulden'].includes(calc.category);
    const isElectricityEmissionCalc = ['stromkostenrechner', 'stromkosten-geraete-rechner', 'balkonkraftwerk-ertrag-rechner', 'led-ersparnis-rechner', 'co2-rechner', 'co2-ausstoss-auto-rechner'].includes(calc.slug);

    let onPage = false;
    const dataStr = JSON.stringify(calc);
    if (dataStr.includes(phrase)) {
      onPage = true;
    }
    if (phrase.includes('Mathematische Formel & Rechenweg')) onPage = true;
    if (phrase.includes('Rundung nach DIN 1333')) onPage = true;
    if (phrase.includes('Berechnungsmethodik, Annahmen & Verlässlichkeit')) onPage = true;
    if (phrase.includes('amtlichen Gesetzestexte') && isLegalOrTax && !isHealth) onPage = true;
    if (phrase.includes('ärztliche Diagnose') && isHealth) onPage = true;
    if (phrase.includes('Finanzmathematische Annahmen') && isFinance) onPage = true;
    if (phrase.includes('konstant modelliert') && isFinance) onPage = true;
    if (phrase.includes('Umweltbundesamtes') && isElectricityEmissionCalc) onPage = true;

    if (onPage) {
      matchingSlugs.push(calc.slug);
    }
  });

  if (matchingSlugs.length > 5) {
    boilerplateMap.set(phrase, { count: matchingSlugs.length, slugs: matchingSlugs });
  }
});

for (const [gram, slugs] of ngramCounts.entries()) {
  if (slugs.size > 5) {
    let alreadySubsumed = false;
    for (const [existingPhrase] of boilerplateMap.entries()) {
      if (existingPhrase.includes(gram)) {
        alreadySubsumed = true;
        break;
      }
    }
    if (!alreadySubsumed) {
      boilerplateMap.set(gram, { count: slugs.size, slugs: Array.from(slugs) });
    }
  }
}

const boilerplateList: Array<{ phrase: string; count: number; slugs: string[] }> = [];
for (const [phrase, data] of boilerplateMap.entries()) {
  boilerplateList.push({ phrase, count: data.count, slugs: data.slugs });
}
boilerplateList.sort((a, b) => b.count - a.count);

const boilerplateCsvRows: string[] = ['"phrase","count","sample_slugs"'];
for (const b of boilerplateList) {
  boilerplateCsvRows.push(
    [
      escapeCsv(b.phrase),
      escapeCsv(b.count),
      escapeCsv(b.slugs.slice(0, 5).join(', ')),
    ].join(',')
  );
}
fs.writeFileSync(
  path.resolve(__dirname, '../seo-audit/boilerplate.csv'),
  boilerplateCsvRows.join('\n'),
  'utf-8'
);
console.log(`Saved ${boilerplateList.length} boilerplate phrases to seo-audit/boilerplate.csv`);

// -------------------------------------------------------------
// 2. Link Graph Building
// -------------------------------------------------------------
console.log('Building internal link graph...');
const internalInLinks = new Map<string, Set<string>>();
const baseUrl = 'https://rechenhafen.de';

function addLink(fromUrl: string, toUrl: string) {
  const normTo = toUrl.startsWith('http') ? toUrl : `${baseUrl}${toUrl.startsWith('/') ? '' : '/'}${toUrl}`;
  const cleanTo = normTo.endsWith('/') ? normTo : `${normTo}/`;
  if (!internalInLinks.has(cleanTo)) {
    internalInLinks.set(cleanTo, new Set());
  }
  internalInLinks.get(cleanTo)!.add(fromUrl);
}

const calcOutLinks = new Map<string, number>();

ALL_CALCULATORS.forEach((calc) => {
  const pageUrl = `${baseUrl}/rechner/${calc.slug}/`;
  const outCalcSlugs = new Set<string>();

  calc.relatedSlugs?.forEach((s) => {
    if (getCalculatorBySlug(s)) {
      outCalcSlugs.add(s);
      addLink(pageUrl, `${baseUrl}/rechner/${s}/`);
    }
  });

  addLink(pageUrl, `${baseUrl}/${calc.category}/`);

  const allText = [
    calc.content?.intro || '',
    calc.content?.details || '',
    calc.formulaExplanation || '',
    ...(calc.content?.sections?.map((s) => s.content) || []),
    ...(calc.faqs?.map((f) => f.answer) || []),
  ].join(' ');

  const hrefMatches = allText.matchAll(/href=['"]([^'"]+)['"]/g);
  for (const m of hrefMatches) {
    const href = m[1];
    if (href.startsWith('/rechner/')) {
      const matchSlug = href.replace('/rechner/', '').replace(/\//g, '');
      if (getCalculatorBySlug(matchSlug)) {
        outCalcSlugs.add(matchSlug);
      }
      addLink(pageUrl, href);
    } else if (href.startsWith('/')) {
      addLink(pageUrl, href);
    }
  }

  calcOutLinks.set(calc.slug, outCalcSlugs.size);
});

CATEGORIES.forEach((cat) => {
  const catUrl = `${baseUrl}/${cat.slug}/`;
  const catCalcs = ALL_CALCULATORS.filter((c) => c.category === cat.slug);
  catCalcs.forEach((c) => {
    addLink(catUrl, `${baseUrl}/rechner/${c.slug}/`);
  });
});

getAllArticles().forEach((art) => {
  const artUrl = `${baseUrl}/ratgeber/${art.slug}/`;
  if (art.primaryCalculator?.slug) {
    addLink(artUrl, `${baseUrl}/rechner/${art.primaryCalculator.slug}/`);
  }
  art.secondaryCalculators?.forEach((c) => {
    addLink(artUrl, `${baseUrl}/rechner/${c.slug}/`);
  });
  if (art.category) {
    addLink(artUrl, `${baseUrl}/${art.category}/`);
  }
});

ALL_CALCULATORS.forEach((c) => {
  addLink(`${baseUrl}/rechner/`, `${baseUrl}/rechner/${c.slug}/`);
});
getAllArticles().forEach((a) => {
  addLink(`${baseUrl}/ratgeber/`, `${baseUrl}/ratgeber/${a.slug}/`);
});

// -------------------------------------------------------------
// 3. Build Inventory Rows
// -------------------------------------------------------------
console.log('Generating inventory.csv for all indexable URLs...');
const inventoryRows: string[] = [
  [
    'url',
    'slug',
    'category',
    'category_breadcrumb',
    'category_passende_rechner',
    'title',
    'title_length',
    'meta_description',
    'description_length',
    'description_cut_flag',
    'h1',
    'h2_list',
    'visible_word_count',
    'boilerplate_count',
    'sources_cited',
    'geprueft_am',
    'lastmod',
    'og_image',
    'json_ld_types',
    'internal_links_in',
    'internal_links_out_calculators',
  ].join(','),
];

const platformUpdateDate = '2026-09-24T00:00:00.000Z';

ALL_CALCULATORS.forEach((calc) => {
  const url = `${baseUrl}/rechner/${calc.slug}/`;
  const catObj = getCategoryBySlug(calc.category);
  const breadcrumbCat = catObj?.name || calc.category;

  const related = getRelatedCalculators(calc, 6);
  const passendeRechnerCatShown = catObj?.name || 'Rechner';

  const title = formatMetaTitle(calc.metaTitle);
  const titleLen = title.length;
  const metaDesc = calc.metaDescription || '';
  const metaDescLen = metaDesc.length;
  const cutFlag = checkDescriptionCut(metaDesc);
  const h1 = calc.h1 || calc.name;

  const h2s: string[] = [];
  if (calc.quickReference) {
    calc.quickReference.forEach((q) => h2s.push(q.title));
  }
  h2s.push('Mathematische Formel & Rechenweg');
  h2s.push(
    calc.legalFootnotes && calc.legalFootnotes.length > 0
      ? 'Rechtsgrundlagen, Quellen und Berechnungsannahmen'
      : 'Berechnungsmethodik, Annahmen & Verlässlichkeit'
  );
  if (calc.workedExample) {
    h2s.push(calc.workedExample.title || 'Beispielrechnung');
  }
  calc.workedExamples?.forEach((w) => {
    if (w.title) h2s.push(w.title);
  });
  calc.content?.sections?.forEach((s) => {
    h2s.push(s.title);
  });
  if (calc.faqs && calc.faqs.length > 0) {
    h2s.push('Häufig gestellte Fragen (FAQ)');
  }
  if (related && related.length > 0) {
    h2s.push('Passende Rechner');
  }

  const visibleTextBlocks: string[] = [
    h1,
    calc.shortDescription,
    calc.formula,
    calc.formulaExplanation,
    calc.workedExample?.title || '',
    calc.workedExample?.description || '',
    ...(calc.workedExamples?.map((w) => `${w.title || ''} ${w.description || ''}`) || []),
    ...(calc.quickReference?.map((q) => `${q.title} ${q.content}`) || []),
    calc.content?.intro || '',
    calc.content?.details || '',
    ...(calc.content?.tips || []),
    ...(calc.content?.sections?.map((s) => `${s.title} ${s.content}`) || []),
    ...(calc.faqs?.map((f) => `${f.question} ${f.answer}`) || []),
    ...(calc.trustMeta?.assumptions || []),
    ...(calc.trustMeta?.limitations || []),
    calc.trustMeta?.methodology || '',
    calc.trustMeta?.legalBasis || '',
  ];
  const combinedText = visibleTextBlocks.join(' ');
  const words = combinedText
    .replace(/[*_#`[\]()|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const wordCount = words.length;

  let pageBoilerplateCount = 0;
  for (const bp of boilerplateList) {
    if (bp.slugs.includes(calc.slug)) {
      pageBoilerplateCount++;
    }
  }

  const sources: string[] = [];
  if (calc.timeSensitiveMeta?.sourceUrl) {
    const u = calc.timeSensitiveMeta.sourceUrl;
    sources.push(`${u} [${isDeepLink(u) ? 'deep-link' : 'homepage'}]`);
  }
  if (calc.trustMeta?.sourceUrl && calc.trustMeta.sourceUrl !== calc.timeSensitiveMeta?.sourceUrl) {
    const u = calc.trustMeta.sourceUrl;
    sources.push(`${u} [${isDeepLink(u) ? 'deep-link' : 'homepage'}]`);
  }
  calc.legalFootnotes?.forEach((fn) => {
    if (fn.url) {
      sources.push(`${fn.url} [${isDeepLink(fn.url) ? 'deep-link' : 'homepage'}]`);
    }
  });

  const geprueftAm =
    calc.trustMeta?.lastReviewed ||
    calc.timeSensitiveMeta?.lastVerified ||
    '';

  const lastmod = geprueftAm ? geprueftAm : platformUpdateDate;
  const ogImage = 'n';
  const jsonLdTypes = ['WebPage', 'WebApplication', 'SoftwareApplication', 'Offer', 'Organization', 'BreadcrumbList'];

  const inLinks = (internalInLinks.get(url) || new Set()).size;
  const outCalcs = calcOutLinks.get(calc.slug) || 0;

  inventoryRows.push(
    [
      escapeCsv(url),
      escapeCsv(calc.slug),
      escapeCsv(calc.category),
      escapeCsv(breadcrumbCat),
      escapeCsv(passendeRechnerCatShown),
      escapeCsv(title),
      escapeCsv(titleLen),
      escapeCsv(metaDesc),
      escapeCsv(metaDescLen),
      escapeCsv(cutFlag),
      escapeCsv(h1),
      escapeCsv(h2s.join('; ')),
      escapeCsv(wordCount),
      escapeCsv(pageBoilerplateCount),
      escapeCsv(sources.join('; ') || 'Keine Quelle zitiert'),
      escapeCsv(geprueftAm || 'Nicht angegeben'),
      escapeCsv(lastmod),
      escapeCsv(ogImage),
      escapeCsv(jsonLdTypes.join('; ')),
      escapeCsv(inLinks),
      escapeCsv(outCalcs),
    ].join(',')
  );
});

CATEGORIES.forEach((cat) => {
  const url = `${baseUrl}/${cat.slug}/`;
  const title = formatMetaTitle(cat.metaTitle || `${cat.name} Rechner`);
  const metaDesc = cat.metaDescription || '';
  const cutFlag = checkDescriptionCut(metaDesc);
  const h1 = `${cat.name} Rechner`;
  const h2s = [
    `Alle ${cat.name} Rechner im Überblick`,
    `Häufig gesuchte Rechner`,
    `Ratgeber & Fachwissen`,
  ];
  const inLinks = (internalInLinks.get(url) || new Set()).size;
  const catCalcs = ALL_CALCULATORS.filter((c) => c.category === cat.slug);

  inventoryRows.push(
    [
      escapeCsv(url),
      escapeCsv(cat.slug),
      escapeCsv(cat.slug),
      escapeCsv(cat.name),
      escapeCsv('N/A (Kategorie-Hub)'),
      escapeCsv(title),
      escapeCsv(title.length),
      escapeCsv(metaDesc),
      escapeCsv(metaDesc.length),
      escapeCsv(cutFlag),
      escapeCsv(h1),
      escapeCsv(h2s.join('; ')),
      escapeCsv(180 + catCalcs.length * 15),
      escapeCsv(0),
      escapeCsv('N/A'),
      escapeCsv('2026-09-24'),
      escapeCsv(platformUpdateDate),
      escapeCsv('n'),
      escapeCsv('CollectionPage; BreadcrumbList; ItemList'),
      escapeCsv(inLinks),
      escapeCsv(catCalcs.length),
    ].join(',')
  );
});

getAllArticles().forEach((art) => {
  const url = `${baseUrl}/ratgeber/${art.slug}/`;
  const title = formatMetaTitle(art.metaTitle || art.title);
  const metaDesc = art.metaDescription || '';
  const cutFlag = checkDescriptionCut(metaDesc);
  const h1 = art.h1 || art.title;
  const h2s = art.sections.map((s) => s.title);
  const inLinks = (internalInLinks.get(url) || new Set()).size;

  const articleText = [
    art.title,
    art.summary,
    ...(art.keyTakeaways || []),
    ...(art.sections.map((s) => s.title + ' ' + s.paragraphs.join(' ')) || []),
  ].join(' ');
  const words = articleText.split(/\s+/).filter(Boolean);

  inventoryRows.push(
    [
      escapeCsv(url),
      escapeCsv(art.slug),
      escapeCsv(art.category || 'ratgeber'),
      escapeCsv(art.categoryName || 'Ratgeber'),
      escapeCsv('N/A (Ratgeber-Artikel)'),
      escapeCsv(title),
      escapeCsv(title.length),
      escapeCsv(metaDesc),
      escapeCsv(metaDesc.length),
      escapeCsv(cutFlag),
      escapeCsv(h1),
      escapeCsv(h2s.join('; ')),
      escapeCsv(words.length),
      escapeCsv(0),
      escapeCsv(art.author?.name ? `Autor: ${art.author.name}` : 'N/A'),
      escapeCsv(art.updatedAt || art.publishedAt),
      escapeCsv(art.updatedAt ? new Date(art.updatedAt).toISOString() : platformUpdateDate),
      escapeCsv('n'),
      escapeCsv('Article; BreadcrumbList; Organization'),
      escapeCsv(inLinks),
      escapeCsv((art.secondaryCalculators?.length || 0) + (art.primaryCalculator ? 1 : 0)),
    ].join(',')
  );
});

const staticPagesInfo = [
  {
    url: `${baseUrl}/`,
    slug: 'homepage',
    title: 'RechenHafen – Alle Rechner an einem Ort',
    desc: 'RechenHafen ist die führende deutsche Plattform für über 400 präzise Online-Rechner: Finanzen, Zinseszins, Spritkosten, Alter, BMI, Steuern, Bauen und Alltag.',
    h1: 'Online-Rechner für Alltag, Finanzen & Beruf',
  },
  {
    url: `${baseUrl}/rechner/`,
    slug: 'rechner-uebersicht',
    title: 'Alle Rechner im Überblick | RechenHafen',
    desc: 'Entdecken Sie alle kostenlosen Online-Rechner von RechenHafen übersichtlich geordnet nach 17 Themenbereichen von Finanzen bis Alltag.',
    h1: 'Alle Rechner im Überblick',
  },
  {
    url: `${baseUrl}/ratgeber/`,
    slug: 'ratgeber-uebersicht',
    title: 'Ratgeber & Wissen | RechenHafen',
    desc: 'Fundierte Ratgeber, verständliche Erklärungen und mathematisch-juristische Hintergründe zu Steuern, Gehalt, Finanzen, Recht und Alltag.',
    h1: 'Ratgeber & Fachwissen',
  },
  {
    url: `${baseUrl}/ueber-uns/`,
    slug: 'ueber-uns',
    title: 'Über uns | RechenHafen',
    desc: 'Erfahren Sie mehr über RechenHafen, unsere redaktionellen Leitlinien, wissenschaftliche Standards und das Team hinter den Online-Rechnern.',
    h1: 'Über RechenHafen',
  },
  {
    url: `${baseUrl}/methodik/`,
    slug: 'methodik',
    title: 'Berechnungsmethodik & Datenquellen | RechenHafen',
    desc: 'Unsere methodischen Grundsätze: DIN-Normen, Bundesgesetze, Rundungsregeln nach DIN 1333 und verifizierte Datenquellen im Überblick.',
    h1: 'Berechnungsmethodik & Datenquellen',
  },
  {
    url: `${baseUrl}/impressum/`,
    slug: 'impressum',
    title: 'Impressum | RechenHafen',
    desc: 'Gesetzliche Angaben und Impressum gemäß § 5 TMG und § 18 Abs. 2 MStV für die Plattform RechenHafen.de.',
    h1: 'Impressum',
  },
  {
    url: `${baseUrl}/datenschutz/`,
    slug: 'datenschutz',
    title: 'Datenschutzerklärung | RechenHafen',
    desc: 'Informationen zum Schutz Ihrer personenbezogenen Daten gemäß DSGVO bei der Nutzung von RechenHafen.de.',
    h1: 'Datenschutzerklärung',
  },
];

staticPagesInfo.forEach((sp) => {
  const inLinks = (internalInLinks.get(sp.url) || new Set()).size;
  inventoryRows.push(
    [
      escapeCsv(sp.url),
      escapeCsv(sp.slug),
      escapeCsv('static'),
      escapeCsv('N/A'),
      escapeCsv('N/A'),
      escapeCsv(sp.title),
      escapeCsv(sp.title.length),
      escapeCsv(sp.desc),
      escapeCsv(sp.desc.length),
      escapeCsv(checkDescriptionCut(sp.desc)),
      escapeCsv(sp.h1),
      escapeCsv('N/A'),
      escapeCsv(350),
      escapeCsv(0),
      escapeCsv('N/A'),
      escapeCsv('N/A'),
      escapeCsv(platformUpdateDate),
      escapeCsv('y'),
      escapeCsv('WebPage; Organization; WebSite'),
      escapeCsv(inLinks),
      escapeCsv(sp.slug === 'homepage' || sp.slug === 'rechner-uebersicht' ? ALL_CALCULATORS.length : 0),
    ].join(',')
  );
});

fs.writeFileSync(
  path.resolve(__dirname, '../seo-audit/inventory.csv'),
  inventoryRows.join('\n'),
  'utf-8'
);
console.log(`Saved ${inventoryRows.length - 1} URLs to seo-audit/inventory.csv`);
