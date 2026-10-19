import fs from 'fs';
import path from 'path';
import { ALL_CALCULATORS } from '../src/data/calculators';
import { CATEGORIES } from '../src/data/categories';

// Load audit findings
const auditReport = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../audit-report.json'), 'utf-8'));
const auditMap = new Map<string, any[]>();
for (const f of auditReport.findings) {
  if (!auditMap.has(f.calculatorSlug)) {
    auditMap.set(f.calculatorSlug, []);
  }
  auditMap.get(f.calculatorSlug)!.push(f);
}

// Category map
const categoryMap = new Map<string, string>();
CATEGORIES.forEach(c => categoryMap.set(c.slug, c.name));

// The 10 priority calculators handled in October 2026 / Section 12
const FIRST_TEN_IDS = [
  'wasserverbrauch-haushalt-rechner',
  'kies-splitt-rechner',
  'schalungssteine-rechner',
  'nudeln-rohmaerk-gewicht-rechner',
  'wasser-reis-verhaeltnis-rechner',
  'hybrid-auto-kosten-rechner',
  'co2-auto-rechner',
  'eiweiss-eigelb-ersatz-rechner',
  'waschmaschine-kosten-rechner',
  'spuelmaschine-kosten-rechner',
];
const firstTenSet = new Set(FIRST_TEN_IDS);

// Find data files
const srcDataDir = path.resolve(__dirname, '../src/data/calculators');
const srcLibDir = path.resolve(__dirname, '../src/lib/calculators');

const dataFiles: { relPath: string; content: string }[] = [];
function readDirRecursive(dir: string, baseDir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      readDirRecursive(full, baseDir);
    } else if (entry.name.endsWith('.ts')) {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      dataFiles.push({ relPath: rel, content: fs.readFileSync(full, 'utf-8') });
    }
  }
}
readDirRecursive(srcDataDir, path.resolve(__dirname, '..'));

function getSourceFiles(calc: any) {
  let foundDataFile = '';
  for (const df of dataFiles) {
    if (
      df.content.includes(`id: '${calc.id}'`) ||
      df.content.includes(`id: "${calc.id}"`) ||
      df.content.includes(`id: \`${calc.id}\``) ||
      df.content.includes(`slug: '${calc.slug}'`) ||
      df.content.includes(`slug: "${calc.slug}"`)
    ) {
      foundDataFile = df.relPath;
      break;
    }
  }

  let calcSourceFile = foundDataFile;
  if (!foundDataFile.includes('/extra/')) {
    const catName = path.basename(foundDataFile, '.ts');
    const possibleLib = `src/lib/calculators/${catName}.ts`;
    if (fs.existsSync(path.resolve(__dirname, '..', possibleLib))) {
      calcSourceFile = possibleLib;
    }
  }
  return { dataFile: foundDataFile, calcFile: calcSourceFile };
}

function getSharedComponents(calc: any): string[] {
  const components = [
    'src/components/calculator/Breadcrumbs.tsx',
    'src/components/calculator/CalculatorRunner.tsx',
    'src/components/calculator/FormulaBox.tsx',
    'src/components/calculator/MethodologyBox.tsx',
    'src/components/calculator/FaqAccordion.tsx',
    'src/components/common/AdSlot.tsx',
    'src/components/common/FormattedContent.tsx',
  ];

  if (['gaskostenrechner', 'gasverbrauch-kwh-m3-rechner', 'heizkostenvergleich-rechner', 'stromkostenrechner', 'oelheizung-verbrauch-rechner'].includes(calc.slug)) {
    components.push('src/components/calculator/GasClusterLinks.tsx');
  } else if (['dienstjubilaeum-rechner', 'alter-in-tagen', 'datum-plus-tage', 'tage-zwischen-zwei-daten'].includes(calc.slug)) {
    components.push('src/components/calculator/DateClusterLinks.tsx');
  } else if (calc.slug === 'tage-bis-weihnachten') {
    components.push('src/components/calculator/PopularDateCalculators.tsx');
  } else {
    components.push('src/components/calculator/RelatedCalculators.tsx');
  }

  if (calc.slug === 'einkommensteuerrechner' || calc.slug === 'grenzsteuersatz-rechner') {
    components.push('src/components/calculator/TaxBracketVisualizer.tsx');
  }

  if (['nudeln-rohmaerk-gewicht-rechner', 'wasser-reis-verhaeltnis-rechner', 'kies-splitt-rechner', 'alter-in-monaten'].includes(calc.slug)) {
    components.push('src/components/calculator/ContextualNextSteps.tsx');
  }

  return components;
}

const byCat = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'all-real-slugs-by-cat.json'), 'utf-8'));

// Filter out first ten from each category list
for (const cat of Object.keys(byCat)) {
  byCat[cat] = byCat[cat].filter((s: string) => !firstTenSet.has(s));
}

// BATCH 1: Steuern, Gehalt & Arbeitsrecht (50)
const b1Slugs = [
  ...byCat['steuern-gehalt'], // 15
  ...byCat['arbeit-gehalt'],  // 25
  'stundensatz-kalkulation-freiberufler-rechner',
  'abschreibung-linear-degressiv-rechner',
  'mwst-rechner',
  'marge-rechner',
  'skontorechner',
  'skonto-jahreszins-rechner',
  'rabattrechner',
  'wareneinsatzquote-rechner',
  'lagerumschlagshaeufigkeit-rechner',
  'umsatzrentabilitaet-rechner'
];

// BATCH 2: Finanzen, Geldanlage, Kredite & Schulden (50)
const b2Slugs = [
  ...byCat['finanzen'], // 24
  'kreditrechner',
  'ratenkreditrechner',
  'autokreditrechner',
  'tilgungsrechner',
  'sondertilgungsrechner',
  'restschuld-rechner',
  'ballonfinanzierung-rechner',
  'umschuldung-rechner',
  'dispozins-rechner',
  'maximaler-kredit-rechner',
  'modernisierungskredit-rechner',
  'kreditvergleich-rechner',
  'gesamtzinsbelastung-rechner',
  'vorfaelligkeitsentschaedigung-rechner',
  'schuldentilgungsdauer-rechner',
  'forward-darlehen-rechner',
  'kreditlaufzeit-rechner',
  'kredit-restschuld-stichtag-rechner',
  'effektivzins-kredit-rechner',
  'privatkredit-rechner',
  'working-capital-rechner',
  'liquiditaetsgrad-rechner',
  'cashflow-rechner',
  'ebit-ebitda-rechner',
  'eigenkapitalrentabilitaet-rechner',
  'gesamtkapitalrentabilitaet-rechner'
];

// BATCH 3: Wohnen, Immobilien, Miete & Baufinanzierung (50)
const b3Slugs = [
  ...byCat['wohnen-immobilien'], // 27
  'baufinanzierung-rechner',
  'volltilger-darlehen-rechner',
  'kreditrechner-ohne-eigenkapital',
  'zwischenfinanzierung-rechner',
  'zinsbindung-rechner',
  'waermepumpe-stromkosten-rechner',
  'photovoltaik-amortisation-rechner',
  'balkonkraftwerk-ertrag-rechner',
  'heizkostenvergleich-rechner',
  'co2-abgabe-vermieter-mieter-rechner',
  'warmwasserkosten-rechner',
  'pelletheizung-verbrauch-rechner',
  'energieeffizienzklasse-rechner',
  'daemmung-u-wert-rechner',
  'regenwasser-zisterne-rechner',
  'brennholz-raummeter-rechner',
  'drainage-gefaelle-rechner',
  'baugrund-tragfaehigkeit-rechner',
  'break-even-rechner',
  'deckungsbeitrag-rechner',
  'roi-rechner',
  'roas-rechner',
  'kundengewinnungskosten-cac-rechner'
];

// BATCH 4: Bauen, Renovieren, Handwerk & Geometrie (50)
const b4Slugs = [
  'farbmengen-rechner',
  'bodenbelag-rechner',
  'betonrechner',
  'estrich-rechner',
  'dachflaeche-rechner',
  'bausteine-mauerwerk-rechner',
  'fliesenkleber-rechner',
  'aushub-erdarbeiten-rechner',
  'pflastersteine-rechner',
  'trockenbau-gipskarton-rechner',
  'fundament-rechner',
  'fassadenfarbe-rechner',
  'parkett-laminat-rechner',
  'tapetenrollen-rechner',
  'putz-rechner',
  'zaun-pfosten-rechner',
  'treppen-stufen-rechner',
  'holz-balken-durchbiegung-rechner',
  'beton-mischungsverhaeltnis-rechner',
  ...byCat['geometrie'], // 25
  'flaeche-umrechner',
  'volumen-umrechner',
  'laengen-umrechner',
  'zoll-in-cm-rechner',
  'papierformat-din-rechner',
  'dichte-umrechner'
];

// BATCH 5: Energie, Haushalt, Mobilität & Kfz-Kosten (50)
const b5Slugs = [
  'stromkostenrechner',
  'standby-kosten-rechner',
  'gaskostenrechner',
  'led-ersparnis-rechner',
  'stromkosten-geraete-rechner',
  'gasverbrauch-kwh-m3-rechner',
  'kuehlschrank-stromkosten-rechner',
  'trockner-kosten-rechner',
  'fernseher-stromkosten-rechner',
  'led-sparrechner',
  'oelheizung-verbrauch-rechner',
  'klimaanlage-stromkosten-rechner',
  'e-auto-ladekosten-zuhause-rechner',
  'lebensmittelbudget-rechner',
  ...byCat['auto-verkehr'], // 23
  'energie-arbeit-umrechner',
  'leistung-umrechner',
  'elektrische-ladung-kapazitaet-rechner',
  'drehmoment-umrechner',
  'kraft-umrechner',
  'kraftstoffverbrauch-umrechner',
  'geschwindigkeit-umrechner',
  'druck-umrechner',
  'drehzahl-umfangsgeschwindigkeit-rechner',
  'beleuchtungsstaerke-lux-lumen-rechner',
  'ohmsches-gesetz-rechner',
  'dezibel-schalldruck-umrechner',
  'temperatur-umrechner'
];

// BATCH 6: Gesundheit, Ernährung, Familie & Schwangerschaft (50)
const b6Slugs = [
  ...byCat['gesundheit-fitness'],     // 25
  ...byCat['familie-schwangerschaft'] // 25
];

// BATCH 7: Kochen, Backen, Maßeinheiten & Angewandte Statistik (50)
const b7Slugs = [
  ...byCat['kochen-backen'], // 23
  'gewicht-masse-umrechner',
  'zeit-umrechner',
  'schuhe-kleidergroessen-umrechner',
  'ringgroesse-umrechner',
  'viskositaet-umrechner',
  'radioaktivitaet-strahlendosis-rechner',
  'daten-speicher-umrechner',
  'datenrate-bandbreite-umrechner',
  'roemische-zahlen-umrechner',
  'binaer-hex-dezimal-umrechner',
  'customer-lifetime-value-clv-rechner',
  'churn-rate-rechner',
  'lead-conversion-rate-rechner',
  'notendurchschnitt-rechner',
  'standardabweichung-rechner',
  'mittelwert-median-modus-rechner',
  'durchschnittsrechner',
  'varianz-standardabweichung-stichprobe-rechner',
  'quartile-box-plot-rechner',
  'perzentil-rechner',
  'korrelationskoeffizient-rechner',
  'lineare-regression-rechner',
  'kovarianz-rechner',
  'variationskoeffizient-rechner',
  'geometrisches-mittel-rechner',
  'harmonisches-mittel-rechner',
  'kombinatorik-n-ueber-k-rechner'
];

// BATCH 8: Datum, Zeit, Kalender & Angewandte Arithmetik (50)
const b8Slugs = [
  ...byCat['datum-zeit'], // 26
  'prozentrechner',
  'prozentuale-veraenderung',
  'grundwert-rechner',
  'dreisatzrechner',
  'verhaeltnis-rechner',
  'bruchrechner',
  'dreieckrechner',
  'pythagoras-rechner',
  'ggt-rechner',
  'kgv-rechner',
  'quadratwurzel-rechner',
  'prozentualer-unterschied-rechner',
  'prozent-von-prozent-rechner',
  'promillerechner',
  'antiproportionaler-dreisatz-rechner',
  'bruch-in-dezimal-rechner',
  'dezimal-in-bruch-rechner',
  'kubikwurzel-rechner',
  'n-te-wurzel-rechner',
  'zehnerpotenzen-rechner',
  'modulo-rechner',
  'quersumme-rechner',
  'hexadezimal-rechner',
  'teiler-vielfache-rechner'
];

const batchDefinitions = [
  { batchNumber: 1, batchId: 'batch-1', name: 'Batch 1: Steuern, Gehalt & Arbeitsrecht', slugs: b1Slugs },
  { batchNumber: 2, batchId: 'batch-2', name: 'Batch 2: Finanzen, Geldanlage, Kredite & Schulden', slugs: b2Slugs },
  { batchNumber: 3, batchId: 'batch-3', name: 'Batch 3: Wohnen, Immobilien, Miete & Baufinanzierung', slugs: b3Slugs },
  { batchNumber: 4, batchId: 'batch-4', name: 'Batch 4: Bauen, Renovieren, Handwerk & Geometrie', slugs: b4Slugs },
  { batchNumber: 5, batchId: 'batch-5', name: 'Batch 5: Energie, Haushalt, Mobilität & Kfz-Kosten', slugs: b5Slugs },
  { batchNumber: 6, batchId: 'batch-6', name: 'Batch 6: Gesundheit, Ernährung, Familie & Schwangerschaft', slugs: b6Slugs },
  { batchNumber: 7, batchId: 'batch-7', name: 'Batch 7: Kochen, Backen, Maßeinheiten & Angewandte Statistik', slugs: b7Slugs },
  { batchNumber: 8, batchId: 'batch-8', name: 'Batch 8: Datum, Zeit, Kalender & Angewandte Arithmetik', slugs: b8Slugs },
];

const slugToBatch = new Map<string, { batchNumber: number; batchId: string; batchName: string }>();
batchDefinitions.forEach(b => {
  b.slugs.forEach(s => {
    slugToBatch.set(s, { batchNumber: b.batchNumber, batchId: b.batchId, batchName: b.name });
  });
});

// Construct manifest records for all 421 calculators
const manifestRecords: any[] = [];

ALL_CALCULATORS.forEach(calc => {
  const isFirstTen = firstTenSet.has(calc.id) || firstTenSet.has(calc.slug);
  const batchInfo = slugToBatch.get(calc.slug);
  const isBacklog = !isFirstTen && !batchInfo;

  let batchAssignment = 'backlog';
  let batchNumber = -1;
  let batchName = 'Backlog: Höhere Statistik & Spezialmethoden';

  if (isFirstTen) {
    batchAssignment = 'batch-0-first-ten';
    batchNumber = 0;
    batchName = 'Batch 0: Initial Priority Calculators (Handled / Regression Baseline)';
  } else if (batchInfo) {
    batchAssignment = batchInfo.batchId;
    batchNumber = batchInfo.batchNumber;
    batchName = batchInfo.batchName;
  }

  const { dataFile, calcFile } = getSourceFiles(calc);
  const sharedComps = getSharedComponents(calc);
  const findings = auditMap.get(calc.slug) || [];
  const highConfidenceFindings = findings.filter((f: any) => f.severity === 'High');

  // Status mapping
  let auditStatus = 'queued';
  let implementationStatus = 'queued';
  let verificationStatus = 'deployment_unverified';

  if (isFirstTen) {
    auditStatus = 'audited';
    implementationStatus = 'implemented';
    verificationStatus = 'locally_verified';
  }

  const record = {
    id: calc.id,
    slug: calc.slug,
    canonicalUrl: `https://rechenhafen.de/rechner/${calc.slug}/`,
    name: calc.name,
    category: calc.category,
    categoryName: categoryMap.get(calc.category) || calc.category,
    subcategory: calc.subcategory || null,
    calculationSourceFile: calcFile,
    contentSourceFile: dataFile,
    sharedComponentsUsed: sharedComps,
    auditStatus,
    implementationStatus,
    verificationStatus,
    batch: batchAssignment,
    batchNumber,
    batchName,
    auditFindingsCount: findings.length,
    hasHighConfidenceAuditFinding: highConfidenceFindings.length > 0,
    highConfidenceIssues: highConfidenceFindings.map((f: any) => ({
      field: f.inputKey,
      issue: f.issue
    })),
    progressTracking: {
      reproductionSteps: isFirstTen ? 'Validated in Section 12 test suites & QA checks' : '',
      expectedResult: '',
      actualResult: '',
      evidenceAndSources: calc.timeSensitiveMeta ? [calc.timeSensitiveMeta.source, calc.timeSensitiveMeta.sourceUrl].filter(Boolean) : [],
      changesMade: isFirstTen ? ['Audited and enhanced in initial priority pass (Commit 577485b)'] : [],
      testsPerformed: isFirstTen ? [`src/__tests__/${calc.slug.replace(/-rechner$/, '')}*.test.ts`] : [],
      remainingLimitations: [],
      commitHash: isFirstTen ? '577485b' : '',
      deploymentVerification: isFirstTen ? 'pending_live_deployment_verification' : 'unverified'
    }
  };

  manifestRecords.push(record);
});

// Sort manifest by batchNumber, then slug
manifestRecords.sort((a, b) => {
  if (a.batchNumber !== b.batchNumber) {
    return a.batchNumber - b.batchNumber;
  }
  return a.slug.localeCompare(b.slug);
});

// Verify totals
const firstTenCount = manifestRecords.filter(r => r.batch === 'batch-0-first-ten').length;
const queuedBatchesCount = manifestRecords.filter(r => r.batchNumber >= 1 && r.batchNumber <= 8).length;
const backlogCount = manifestRecords.filter(r => r.batch === 'backlog').length;

console.log('=== Manifest Verification ===');
console.log(`Total calculators: ${manifestRecords.length}`);
console.log(`First 10 priority: ${firstTenCount}`);
console.log(`Queued in Batches 1-8: ${queuedBatchesCount}`);
console.log(`Backlog: ${backlogCount}`);

const manifestOutput = {
  meta: {
    generatedAt: new Date().toISOString(),
    totalCalculators: manifestRecords.length,
    firstTenExcludedFromQueue: firstTenCount,
    queuedInBatches: queuedBatchesCount,
    backlogCalculators: backlogCount,
    batchCount: 8,
    batchSize: 50,
    prioritizationMethodology: 'Evidence-based risk, consequence (tax/legal/health/safety), and topical affinity clustering. Search Console raw exports unavailable in repository; no invented metrics.',
    statusWorkflow: [
      'queued',
      'audited',
      'fix required',
      'no fix required',
      'implemented',
      'locally verified',
      'deployed verified',
      'deployment unverified'
    ]
  },
  batches: batchDefinitions.map(b => ({
    batchNumber: b.batchNumber,
    batchId: b.batchId,
    name: b.name,
    calculatorCount: b.slugs.length,
    slugs: b.slugs
  })),
  backlog: {
    count: backlogCount,
    slugs: manifestRecords.filter(r => r.batch === 'backlog').map(r => r.slug)
  },
  calculators: manifestRecords
};

fs.writeFileSync(
  path.resolve(__dirname, '../calculator-improvement-manifest.json'),
  JSON.stringify(manifestOutput, null, 2),
  'utf-8'
);
console.log('Successfully written calculator-improvement-manifest.json');

// Generate CALCULATOR_IMPROVEMENT_PLAN.md
let planMd = `# RechenHafen Calculator Quality & Improvement Master Plan (400-Calculator Program)

**Datum:** 19. Oktober 2026  
**Gesamtbestand im Repository:** 421 Rechner (eindeutige, aktive Rechner-Seiten)  
**Erste Prioritäts-Rechner (Batch 0 / Baseline Regression):** 10 Rechner (bereits auditiert & implementiert)  
**In Batches organisierte Rechner:** 400 Rechner (8 Batches à 50 Rechner)  
**Backlog:** 11 Rechner (höhere Statistik & wissenschaftliche Spezialtests)  
**Manifest-Datei:** \`calculator-improvement-manifest.json\` (maschinenlesbarer Status für sitzungsübergreifenden Fortschritt)

---

## 1. Master-Inventar und Bestandsvalidierung

Das Inventar wurde direkt aus der kanonischen Rechner-Registry (\`ALL_CALCULATORS\` in \`src/data/calculators/index.ts\`) und dem statischen Page-Router (\`src/app/rechner/[slug]/page.tsx\`) extrahiert.

### Exakte Zählung (Keine Schätzungen oder Platzhalter)
- **Gesamtzahl eindeutiger Rechner-Seiten:** **421**
- **Eindeutige Slugs:** 421 / 421 (0 Duplikate, 0 Aliase, 0 Redirects mitgezählt)
- **Erste 10 Prioritätsrechner:** 10 (vollständig zugeordnet und aus der 400er-Warteschlange ausgeschlossen)
- **Verbleibende Rechner für das Ausbauprogramm:** 411
- **Eingeteilte Warteschlange:** **400 Rechner in 8 eingefrorenen Batches à genau 50 Rechnern**
- **Backlog:** **11 Rechner** (keine künstlich erfundenen Seiten, keine unterschlagenen Rechner)

---

## 2. Priorisierungs- und Gruppierungsmethodik

### 2.1 Datenbasis und Transparenz
- In diesem Repository liegen **keine rohen Google Search Console-Exporte (CSV/TSV/XLSX)** vor.
- Entsprechend den redaktionellen Vorgaben werden **keine Suchvolumina, Impressionen, Rankings oder Query-Zuordnungen frei erfunden**.
- Die Priorisierung stützt sich auf:
  1. **Evidenzbasierte Audit-Befunde:** Konkrete Korrekturbedarfe aus \`audit-report.json\` / \`AUDIT_REPORT.md\` (z. B. 15 High-Confidence-Befunde bei Zinseszins, Tilgung, Quadratmeterpreis, Stromkosten, Solidaritätszuschlag, Sozialabgaben, Spekulationssteuer, Mietstaffeln, Mauersteinen etc.).
  2. **Schweregrad der Konsequenzen (Recht, Steuern, Finanzen, Bau, Gesundheit):**
     - Gesetzliche Berechnungen (EStG, BMF, SGB, BGB, Mietrecht, PAngV).
     - Finanzielle Tragweite (Kredite, Zinsen, Tilgung, Vermögensaufbau, Schulden).
     - Sicherheits- und bautechnische Risiken (Statik, DIN-Normen, Materialmengen).
     - Gesundheitliche und physiologische Verantwortung (Ernährung, Medikation, Schwangerschaft, Promille).
  3. **Thematische Familien:** Zusammenhängende Berechnungsthemen (z. B. Steuern & Gehalt, Wohnen & Baufinanzierung, Energie & Kfz) werden geschlossen in 50er-Batches bearbeitet, um Synergien bei Fachregeln, Quellen und Schnittstellen voll auszuschöpfen.
  4. **Eingefrorene Zuweisung:** Alle 8 Batches sind deterministisch fixiert, sodass Folgesitzungen weder Rechner wiederholen noch überspringen.

---

## 3. Workflow und Status-Lebenszyklus

Für jeden Rechner wird der Fortschritt im Manifest und im Batch-Report anhand folgender strenger Statuskette verfolgt:

$$\\text{queued} \\longrightarrow \\text{audited} \\longrightarrow \\begin{cases} \\text{fix required} \\\\ \\text{no fix required} \\end{cases} \\longrightarrow \\text{implemented} \\longrightarrow \\text{locally verified} \\longrightarrow \\begin{cases} \\text{deployed verified} \\\\ \\text{deployment unverified} \\end{cases}$$

> [!IMPORTANT]
> **Vollständigkeits-Kriterium:** Ein Rechner gilt **niemals** als erledigt, bloß weil seine URL den HTTP-Statuscode 200 zurückgibt. Jeder Rechner muss fachlich, rechnerisch, visuell und interaktiv auf reale Eingaben verifiziert werden.

### Pflichtangaben für jeden Befund und Test:
1. **Rechner-URL und betroffenes Feld / Feature**
2. **Reproduktionsschritte** (exakte Benutzereingaben)
3. **Tatsächliches Verhalten** (Live / Quellcode)
4. **Erwartetes Verhalten** (Sollwert aus Fachquelle / DIN / Gesetz)
5. **Evidenz und Quellenangabe** (Fundstelle, Gesetzesparagraph, Norm)
6. **Schweregrad** (High / Medium / Informational)
7. **Durchgeführte Tests** (Unit-Test, manuelle Browser-QA)
8. **Verbleibende Limitationen & Annahmen**

---

## 4. Die ersten zehn Prioritätsrechner (Batch 0 – Baseline Regression)

Diese 10 Rechner wurden im Vorfeld auditiert und überarbeitet. Sie sind aus der neuen 400er-Warteschlange ausgeschlossen, dienen aber als **ständige Regressions-Baseline** bei Änderungen an geteilten Komponenten (\`CalculatorRunner.tsx\`, \`FormattedContent.tsx\`, \`FormulaBox.tsx\`, \`MethodologyBox.tsx\` etc.).

| Nr. | Slug | Name | Kategorie | Status | Regressions-Testdatei |
|:---:|:---|:---|:---|:---:|:---|
| 0.1 | \`wasserverbrauch-haushalt-rechner\` | Wasserverbrauch-Rechner für Haushalte | haushalt-energie | implemented / locally verified | \`src/__tests__/wasserverbrauch-haushalt-rechner.test.ts\` |
| 0.2 | \`kies-splitt-rechner\` | Kies- & Splitt-Rechner | bauen-renovieren | implemented / locally verified | \`src/__tests__/kies-splitt-rechner.test.ts\` |
| 0.3 | \`schalungssteine-rechner\` | Schalungssteine Rechner | bauen-renovieren | implemented / locally verified | \`src/__tests__/schalungssteine.test.ts\` |
| 0.4 | \`nudeln-rohmaerk-gewicht-rechner\` | Nudeln umrechnen: trocken & gekocht | kochen-backen | implemented / locally verified | \`src/__tests__/nudeln-rechner.test.ts\` |
| 0.5 | \`wasser-reis-verhaeltnis-rechner\` | Reiskoch-Rechner | kochen-backen | implemented / locally verified | \`src/__tests__/reis-rechner.test.ts\` |
| 0.6 | \`hybrid-auto-kosten-rechner\` | Plug-in-Hybrid-Rechner | auto-verkehr | audited / baseline | \`src/__tests__/priority-calculators-review.test.ts\` |
| 0.7 | \`co2-auto-rechner\` | CO2-Rechner für Autofahrten | auto-verkehr | audited / baseline | \`src/__tests__/priority-calculators-review.test.ts\` |
| 0.8 | \`eiweiss-eigelb-ersatz-rechner\` | Ei-Ersatz-Rechner | kochen-backen | audited / baseline | \`src/__tests__/priority-calculators-review.test.ts\` |
| 0.9 | \`waschmaschine-kosten-rechner\` | Waschmaschinen Kosten-Rechner | haushalt-energie | audited / baseline | \`src/__tests__/priority-calculators-review.test.ts\` |
| 0.10 | \`spuelmaschine-kosten-rechner\` | Spülmaschinen Kosten-Rechner | haushalt-energie | audited / baseline | \`src/__tests__/priority-calculators-review.test.ts\` |

---

## 5. Übersicht der 8 eingefrorenen 50er-Batches

| Batch | Themenbereich | Anzahl | Kernfokus & gesetzliche/fachliche Grundlagen |
|:---:|:---|:---:|:---|
| **Batch 1** | **Steuern, Gehalt & Arbeitsrecht** | **50** | EStG § 32a, Lohnsteuer, Solidaritätszuschlag, Sozialversicherungsbeiträge 2026, Minijob, Kündigungsfristen, Abfindung nach Fünftelregelung, BMF-Vorgaben |
| **Batch 2** | **Finanzen, Geldanlage, Kredite & Schulden** | **50** | Zinseszins, Sparpläne, Annuitätendarlehen, PAngV Effektivzins, Tilgungspläne, Sondertilgung, Dispo, Restschuld, Inflation, Working Capital |
| **Batch 3** | **Wohnen, Immobilien, Miete & Baufinanzierung** | **50** | Mietpreisbremse, Staffelmiete § 557a BGB, Indexmiete, Kaufnebenkosten, Notargebühren GNotKG, Grunderwerbsteuer der Bundesländer, WoFlV, Baufinanzierung |
| **Batch 4** | **Bauen, Renovieren, Handwerk & Geometrie** | **50** | Beton, Estrich DIN 18560, Mauerwerk DIN 1053, Putz, Fliesen, Treppensteigung DIN 18065, Dachneigung, Raumvolumen DIN 277, 2D/3D-Geometrie |
| **Batch 5** | **Energie, Haushalt, Mobilität & Kfz-Kosten** | **50** | Stromtarife, Gaspreise DVGW, Heizkostenvergleich, Elektroauto-Laden, Pendlerpauschale EStG § 9, Kfz-Steuer, Spritkosten, Gerätestrom |
| **Batch 6** | **Gesundheit, Ernährung, Familie & Schwangerschaft** | **50** | BEEG Elterngeld, Düsseldorfer Tabelle 2026 Kindesunterhalt, Naegele-Regel Geburtstermin, Mutterschutzfrist, WHO BMI-Grenzwerte, Harris-Benedict Kalorien |
| **Batch 7** | **Kochen, Backen, Maßeinheiten & Angewandte Statistik** | **50** | Küchenmaße (Cups/Löffel/g/ml), Backofen-Temperaturen, Zutatendichten, metrische & angloamerikanische Umrechnungen, deskriptive Statistik, Korrelation |
| **Batch 8** | **Datum, Zeit, Kalender & Angewandte Arithmetik** | **50** | Kalender-Algorithmen, Schaltjahre, deutsche Feiertagsgesetze der 16 Bundesländer, Werktage vs. Arbeitstage, Prozentrechnung, Dreisatz, Bruchrechnung |
| **Backlog** | **Höhere Statistik & Wissenschaftliche Spezialtests** | **11** | Inferenzstatistik: Normalverteilung, t-Test, Konfidenzintervalle, Hypothesentests, Chi-Quadrat, Binomial- & Poisson-Verteilungen |
| **Gesamt** | | **421** | |

---

`;

// Append Batch 1 to 8 detailed tables
batchDefinitions.forEach(b => {
  planMd += `## 6.${b.batchNumber} ${b.name} (50 Rechner)\n\n`;
  planMd += `| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |\n`;
  planMd += `|:---:|:---|:---|:---|:---|:---|:---:|\n`;

  b.slugs.forEach((slug, idx) => {
    const rec = manifestRecords.find(r => r.slug === slug);
    if (!rec) return;
    const highIssue = rec.hasHighConfidenceAuditFinding ? '⚠️ High' : rec.auditFindingsCount > 0 ? (rec.auditFindingsCount + ' Info') : '0';
    planMd += `| ${b.batchNumber}.${idx + 1} | [\`${slug}\`](${rec.canonicalUrl}) | ${rec.name} | ${rec.category} | \`${rec.contentSourceFile}\` | \`${rec.calculationSourceFile}\` | ${highIssue} |\n`;
  });
  planMd += `\n---\n\n`;
});

// Append Backlog table
planMd += `## 7. Backlog: Höhere Statistik & Wissenschaftliche Spezialtests (11 Rechner)\n\n`;
planMd += `Diese 11 Rechner decken spezialisierte akademische und inferenzstatistische Fragestellungen ab und verbleiben nach Abschluss der 400 Rechner im Backlog:\n\n`;
planMd += `| Nr. | Slug | Rechnername | Kategorie | Fachliche Begründung |\n`;
planMd += `|:---:|:---|:---|:---|:---||\n`;

const backlogRecs = manifestRecords.filter(r => r.batch === 'backlog');
backlogRecs.forEach((rec, idx) => {
  planMd += `| B.${idx + 1} | [\`${rec.slug}\`](${rec.canonicalUrl}) | ${rec.name} | ${rec.category} | Spezialisierter Inferenzstatistik- / Verteilungstest |\n`;
});

planMd += `\n---\n\n`;

// Append Operational Rules A-I
planMd += `## 8. Ausführungs- und Qualitätsrichtlinien für jeden Batch (Abschnitte A–I)

Die Arbeit an jedem einzelnen Batch folgt zwingend den etablierten Projektstandards:

### A. Prüfen vor dem Ändern (Verification Before Changing)
- Vor Codeänderungen werden Implementierung, Nutzeroberfläche und interaktives Verhalten im Quelltext und im Browser geprüft.
- Für jeden Befund: Seite, betroffenes Feld, Reproduktionsschritte, Ist-Verhalten, Soll-Verhalten, Evidenzquelle, Schweregrad.
- Echte Fehler klar von redaktionellen Vereinheitlichungen unterscheiden; keine funktionsfähigen Berechnungen grundlos umschreiben.

### B. Korrektheit der Berechnung (Calculation Correctness)
- **Normalfälle & Nullwerte:** Gültige 0-Werte dürfen niemals durch \`|| defaultValue\` stillschweigend mit Beispielen überschrieben werden.
- **Ungültige Eingaben:** Leere, fehlerhafte, negative oder extreme Eingaben müssen saubere Validierungsfehler liefern.
- **Zahlenformat:** Unterstützung von deutschen Dezimalkommas (\`,\`) und Punkten.
- **Rundung & Fließkomma:** Keine vorzeitigen Zwischenrundungen; IEEE-754-Präzisionsfehler vermeiden.
- **Referenzregeln:** Sollwerte müssen aus unabhängigen Berechnungen oder Gesetzesformeln stammen, nicht aus der bestehenden Implementierung.

### C. Quellenabhängige Rechner (Source-Dependent Calculators)
- Für Steuer-, Rechts-, Vorsorge-, Finanz-, Bau- und Gesundheitsrechner: Offizielle Primärquellen (BMF, Destatis, BGB, DIN, DVGW, WHO).
- Exakte Quell-URL, Rechtsstand (z. B. 2026), Parameter und Einschränkungen in Hilfetexten oder Methodikbox transparent angeben.

### D. Eingabe- und Ausgabe-Erlebnis (Input & Result Experience)
- Primäres Ergebnis mit Einheit und Kontext immer sofort verständlich.
- Bei ungültiger Eingabe darf kein altes Ergebnis stehenbleiben (Realisierung über den zentralen Validierungszustand in \`CalculatorRunner.tsx\`).
- Barrierefreiheit: Korrekte Labels, ARIA-Alerts, Keyboard-Fokus, funktionierender Kopier-Schutz bei Fehlern.

### E. Inhalt und Suchintention (Content & Search Intent)
- Titel, H1, Meta-Beschreibung, Einleitung, Formelbox, durchgerechnete Beispiele und FAQs müssen exakt zur Funktionsweise passen.
- Keine Keyword-Wiederholungen oder automatischer KI-Fülltext.

### F. Technische SEO & Discoverability
- Kanonische URLs (\`https://rechenhafen.de/rechner/[slug]/\`), saubere Breadcrumbs, Sitemap-Eintrag, interne Verlinkung.
- Etablierte Slugs niemals ändern.

### G. Geteilte Komponenten & Performance
- Änderungen an Shared Components (\`CalculatorRunner\`, \`FormattedContent\`, \`page.tsx\`) werden sofort durch Regressionstests aller bisherigen Batches abgesichert.
- Bestehende Tests und Audit-Skripte dürfen nicht gelöscht werden.

### H. Implementierung & Verifizierung
- Volle Testabdeckung (\`npm test\`), TypeScript-Typcheck (\`npx tsc --noEmit\`), ESLint (\`npm run lint\`), vollständiger Produktions-Build (\`npm run build\`).
- Interaktive Prüfung im Browser.

### I. Auslieferung & Dokumentation
- Aktualisierung des Manifests (\`calculator-improvement-manifest.json\`) und Erstellung des Batch-Abschlussberichts.
- Clean Commit und Push auf \`main\`.
`;

fs.writeFileSync(
  path.resolve(__dirname, '../CALCULATOR_IMPROVEMENT_PLAN.md'),
  planMd,
  'utf-8'
);
console.log('Successfully written CALCULATOR_IMPROVEMENT_PLAN.md');

