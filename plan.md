# RechenHafen.de Evidence-Based Quality Fixes Plan

## 1. Raw Markdown Visible to Visitors (Section A)
- **Issue:** Calculator long-form prose and content sections contain literal raw Markdown syntax (such as `**bold**`, backticks, bullet `- `, numbered steps `1. `) due to limited parser handling in `renderFormattedText` in `src/app/rechner/[slug]/page.tsx` and `src/components/calculator/FaqAccordion.tsx`.
- **Affected URLs / Components:**
  - `/rechner/gaskostenrechner/`
  - `/rechner/dienstfahrrad-jobrad-rechner/`
  - `src/components/common/FormattedContent.tsx`
  - `src/app/rechner/[slug]/page.tsx`
  - `src/app/ratgeber/[slug]/page.tsx`
  - `src/components/calculator/FaqAccordion.tsx`
  - `src/components/calculator/FormulaBox.tsx`
  - `src/components/calculator/CalculatorRunner.tsx`
- **Exact Fix:**
  - Implemented `src/components/common/FormattedContent.tsx` providing safe, non-HTML-injecting semantic parsing:
    - Bold `**text**` → `<strong>`
    - Bullets `- `, `• ` → `<ul><li>`
    - Numbered steps `1. `, `2. ` → `<ol><li>`
    - Inline code / formula backticks `` `code` `` → `<code className="...">`
    - Links `[label](href)` → Next.js `<Link href="...">`
    - Markdown tables `| ... |` → `<table>`
    - Proper paragraph splitting without monolithic blocks
  - Integrated into all calculator and ratgeber long-form rendering paths.
  - Added automated test in `src/__tests__/formatted-content.test.tsx` checking all 405+ calculators for unrendered `**` or backticks.
- **Tests to Run:** `npx vitest run src/__tests__/formatted-content.test.tsx`
- **Result:** PASSED (6 tests passing, 0 raw markdown syntax visible).

## 2. Correct JobRad / Dienstrad Legal Explanation (Section B)
- **Issue:** Explanatory text describes the 0.25% taxable benefit sequence incorrectly (rounding gross retail price to 100 € first and then quartering). Official BMF guidance specifies: quarter the UVP first, round that quarter DOWN to full 100 €, then take 1% per month.
- **Affected URLs / Components:**
  - `/rechner/dienstfahrrad-jobrad-rechner/`
  - `src/data/calculators/extra/autoArbeit.ts`
- **Exact Fix:**
  - Updated calculation and prose: `quarterUvpRounded = Math.floor((price * 0.25) / 100) * 100; taxableBenefit = quarterUvpRounded * 0.01;`
  - Corrected sequence in formula, formulaExplanation, content sections, FAQs, worked examples, and directAnswer.
  - Added explicit disclaimers: fast S-Pedelecs (>25 km/h) treated under 0.5% motor vehicle rules; individual agreements differ; RechenHafen is independent and not affiliated with JobRad GmbH.
  - Linked official BMF guidance: `https://amtliche-handbuecher.bundesfinanzministerium.de/lsth/2025/B-Anhaenge/Anhang-24/IV/IV-4/inhalt.html`.
  - Added unit test suite `src/__tests__/dienstfahrrad-jobrad.test.ts`.
- **Tests to Run:** `npx vitest run src/__tests__/dienstfahrrad-jobrad.test.ts`
- **Result:** PASSED (7 tests passing, exact official BMF sequence verified).

## 3. Gas Cost Results & Copy Consistency (Section C)
- **Issue:** Inconsistent terminology on `/rechner/gaskostenrechner/` claiming "monatlicher Abschlag" instead of "rechnerischer Monatsdurchschnitt" / "Orientierungswert pro Monat". Need to ensure 0 € work price and 0 € base charge return 0 € without restoring defaults.
- **Affected URLs / Components:**
  - `/rechner/gaskostenrechner/`
  - `src/data/calculators/haushalt.ts`
  - `src/lib/calculators/haushalt.ts`
- **Exact Fix:**
  - Replaced "monatlicher Abschlag" across intro, metaDescription, shortDescription, worked examples, and FAQs with "rechnerischer Monatsdurchschnitt" / "Orientierungswert pro Monat" / "ca. 93,33 € pro Monat (rechnerischer Durchschnitt)".
  - Prominent result note: "Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen."
  - Verified 0 € work price and 0 € base charge calculate correctly to 0 € and are not treated as empty.
  - Added unit test suite `src/__tests__/gaskostenrechner.test.ts`.
- **Tests to Run:** `npx vitest run src/__tests__/gaskostenrechner.test.ts`
- **Result:** PASSED (4 tests passing).

## 4. Upgrade Schalungssteine Rechner (Section D)
- **Issue:** Calculator needed practical construction planning capabilities for search intent: wall types, openings, block breakdown, concrete volume, separate waste reserve, and prominent safety disclaimer.
- **Affected URLs / Components:**
  - `/rechner/schalungssteine-rechner/`
  - `src/data/calculators/extra/bauenGeometrie.ts`
- **Exact Fix:**
  - Added wall types: Gerade Mauer (`straight`), L-Form (`l_shape`), U-Form (`u_shape`), geschlossenes Rechteck / Pool (`rectangle_pool`).
  - Added optional opening dimensions: `openingWidth` and `openingHeight` in m (with fallback to `openingsArea`).
  - Separated results into: Normalsteine (`standardBlocks`), Eck- & Endsteine (`cornerEndBlocks`), Steinlagen / Schichten (`courses`), Füllbeton (`concreteBaseM3` & `concreteM3`), and Steinreserve (`stoneReserveAmount`).
  - Added prominent safety disclaimer: "Der Rechner ermittelt Materialmengen. Er ersetzt keine Statik, Bewehrungsplanung oder Herstellervorgaben."
  - Kept manufacturer values distinct from default assumptions (50 × 25 cm, 8 Steine/m²).
  - Added unit test suite `src/__tests__/schalungssteine.test.ts`.
- **Tests to Run:** `npx vitest run src/__tests__/schalungssteine.test.ts`
- **Result:** PASSED (5 tests passing).

## 5. Global Quality Gate & Audit Report (Section E)
- **Issue:** Reusable audit script covering 400+ calculators for raw markdown, 0-fallback inputs, missing "Beispielwert" labels, missing Stand/sources for financial/legal calculators, metadata mismatches, broken links, canonical/sitemap issues, duplicate calculators.
- **Affected URLs / Components:**
  - `scripts/audit-calculators.ts`
  - `audit-report.json`
  - `AUDIT_REPORT.md`
  - `src/data/calculators/extra/finanzenKredit.ts` (fixed broken internal link to `/rechner/dividendenrendite-rechner/`)
- **Exact Fix:**
  - Implemented `scripts/audit-calculators.ts` and added `npm run audit`.
  - Audited 421 calculators; resolved broken internal link in `kapitalertragsteuer-rechner`.
  - Generated `audit-report.json` and human-readable `AUDIT_REPORT.md` categorized into Critical (0), High (0), Medium (1043), Informational (0).
- **Tests to Run:** `npm run audit`
- **Result:** PASSED (0 Critical, 0 High).

## 6. Verification & Production Build
- **Typecheck:** `npx tsc --noEmit` -> 0 errors.
- **Lint:** `npm run lint` -> 0 errors / 0 warnings.
- **Unit Tests:** `npm test` -> 17 test files, 244 tests passing.
- **Production Build:** `npm run build` -> 467 static pages built cleanly.
- **Live Page Verification:** `scripts/test-live-pages.ts` tested against local production server (`http://localhost:3005`):
  - `/rechner/gaskostenrechner/` (Status: 200, 0 raw markdown, consistent average wording & notice)
  - `/rechner/dienstfahrrad-jobrad-rechner/` (Status: 200, 0 raw markdown, 8,00 € benefit, BMF reference, independence statement)
  - `/rechner/schalungssteine-rechner/` (Status: 200, 0 raw markdown, wall types, block breakdown, safety disclaimer)
  - `/rechner/kapitalertragsteuer-rechner/` (Status: 200, 0 raw markdown, valid internal link to dividendenrendite-rechner)
  - `/rechner/dividendenrendite-rechner/` (Status: 200, target link valid)

## 7. SEO & User-Value Internal-Link Clusters (Gas & Date Clusters)
- **Goal:** Build two genuinely useful internal-link clusters based on Google Search Console signals to clarify user journeys, support dual-intent queries (kWh vs. m³), and strengthen topical relationships without site redesigns or slug changes.
- **Affected URLs & Components:**
  - **Gas Cluster (7 pages):**
    1. `/rechner/gaskostenrechner/`
    2. `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/`
    3. `/rechner/gasverbrauch-kwh-m3-rechner/`
    4. `/ratgeber/gaskosten-berechnen/`
    5. `/rechner/heizkostenvergleich-rechner/`
    6. `/rechner/stromkostenrechner/`
    7. `/rechner/oelheizung-verbrauch-rechner/`
  - **Date Cluster (4 pages):**
    1. `/rechner/dienstjubilaeum-rechner/`
    2. `/rechner/alter-in-tagen/`
    3. `/rechner/datum-plus-tage/`
    4. `/rechner/tage-zwischen-zwei-daten/`
  - **Components Created & Updated:**
    - `src/components/calculator/GasClusterLinks.tsx`: Context-specific "Passende Rechner & Ratgeber" section with custom intent badges (`m3`, `kwh`, `compare`, `guide`), natural anchor texts, and clear user reasons.
    - `src/components/calculator/DateClusterLinks.tsx`: Compact "Weitere Datumsrechner" section maintaining distinct intents (employment anniversary, age in days, future/past date, date difference).
    - `src/components/calculator/CalculatorRunner.tsx`: Decision aid banner directly above inputs on `gaskostenrechner` ("kWh auf Ihrer Rechnung vorhanden?" vs. "Nur m³ am Zähler vorhanden?").
    - `src/app/rechner/[slug]/page.tsx` & `src/app/ratgeber/[slug]/page.tsx`: Integrated cluster navigation sections, deduplicating generic cards.
    - `src/data/calculators/haushalt.ts`, `src/data/calculators/extra/wohnenHaushalt.ts`, `src/data/calculators/extra/datumMath.ts`, `src/data/calculators/datumZeit.ts`: Updated `relatedSlugs` with bidirectional relationships.
- **Links Added & Justifications:**
  - **From `/rechner/gaskostenrechner/`:**
    - `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/` (Zählerstände in m³ -> Step-by-step thermal conversion guide)
    - `/rechner/gasverbrauch-kwh-m3-rechner/` (Zählerstände in m³ -> Direct calculator tool)
    - `/ratgeber/gaskosten-berechnen/` (kWh bekannt -> Cost breakdown & formula guide)
    - `/rechner/heizkostenvergleich-rechner/` (Vergleich -> Heating system cost comparison)
    - `/rechner/oelheizung-verbrauch-rechner/` (Vergleich -> Oil heating consumption estimator)
    - `/rechner/stromkostenrechner/` (Haushaltsenergie -> Household electricity cost calculator)
  - **From `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/`:**
    - `/rechner/gasverbrauch-kwh-m3-rechner/` (Direkt online rechnen -> Tool for instant conversion)
    - `/rechner/gaskostenrechner/` (Kosten berechnen -> Gaskostenrechner once kWh is known)
    - `/ratgeber/gaskosten-berechnen/` (Ratgeber -> In-depth billing & formula guide)
    - `/rechner/heizkostenvergleich-rechner/` (Heizsysteme -> Compare gas costs with alternatives)
  - **From `/rechner/gasverbrauch-kwh-m3-rechner/`:**
    - `/rechner/gaskostenrechner/` (Gaskosten ermitteln -> Full cost calculation once kWh is derived)
    - `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/` (Brennwert & Z-Zahl Ratgeber -> Detailed explanations of parameters)
    - `/ratgeber/gaskosten-berechnen/` (Gasrechnung verstehen -> Understanding supplier billing)
    - `/rechner/heizkostenvergleich-rechner/` (Vergleich -> Alternative heating options)
    - `/rechner/oelheizung-verbrauch-rechner/` (Ölheizung -> Oil heating comparison)
  - **From `/ratgeber/gaskosten-berechnen/`:**
    - `/rechner/gaskostenrechner/` (Online-Rechner -> Direct cost calculator)
    - `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/` (Zählerstand umrechnen -> Thermal calculation guide)
    - `/rechner/gasverbrauch-kwh-m3-rechner/` (m³ in kWh Rechner -> Direct gas consumption calculator)
    - `/rechner/heizkostenvergleich-rechner/` (Heizkosten vergleichen -> System comparison tool)
  - **From `/rechner/heizkostenvergleich-rechner/`:**
    - `/rechner/gaskostenrechner/` (Gas detailliert -> Detailed gas cost calculation)
    - `/rechner/gasverbrauch-kwh-m3-rechner/` (m³ in kWh -> Gas meter reading conversion)
    - `/rechner/oelheizung-verbrauch-rechner/` (Ölheizung -> Oil heating calculation)
    - `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/` (Ratgeber -> Meter reading guide)
    - `/rechner/stromkostenrechner/` (Strom & Wärmepumpe -> Electricity tariff calculation)
  - **From `/rechner/stromkostenrechner/`:**
    - `/rechner/gaskostenrechner/` (Heizenergie Gas -> Gas cost calculation)
    - `/rechner/gasverbrauch-kwh-m3-rechner/` (Zählerstände in m³ -> Gas meter conversion)
    - `/rechner/heizkostenvergleich-rechner/` (Heizkosten vergleichen -> Alternative comparison)
    - `/rechner/stromkosten-geraete-rechner/` (Gerätekosten -> Appliance breakdown)
  - **From `/rechner/oelheizung-verbrauch-rechner/`:**
    - `/rechner/heizkostenvergleich-rechner/` (Alternativen vergleichen -> Compare oil vs heat pump vs gas)
    - `/rechner/gaskostenrechner/` (Gas-Alternative -> Gas heating calculation)
    - `/ratgeber/gaszaehler-m3-in-kwh-umrechnen/` (Ratgeber Erdgas -> Gas meter guide)
    - `/rechner/stromkostenrechner/` (Stromkosten -> Electricity costs)
  - **From Date Cluster pages (`/rechner/dienstjubilaeum-rechner/`, `/rechner/alter-in-tagen/`, `/rechner/datum-plus-tage/`, `/rechner/tage-zwischen-zwei-daten/`):**
    - Interlinked with distinct search intent badges ("Betriebszugehörigkeit & Jubiläum", "Lebensdauer & Biografie", "Zukunfts- & Fristenrechnung", "Kalender- & Fristdifferenz") and natural anchors.
- **Copy Safeguards Maintained:**
  - Strictly retained "rechnerischer Monatsdurchschnitt" across all references (never promise as supplier "Abschlag").
  - Zero unsupported gas price claims or invented statistics.
  - Calculators stay above the fold with zero layout shift (CLS).
- **Quality Gates & Test Results:**
  - Automated tests: `src/__tests__/seo-cluster-navigation.test.ts` (13 tests verifying 200 HTTP targets, trailing slashes, zero self-links, zero duplicates, zero raw markdown).
  - All unit tests: `npm test` -> 19 test files, 264 tests passing (100% pass).
  - Linter: `npm run lint` -> 0 errors / 0 warnings.
  - TypeScript type check: `npx tsc --noEmit` -> 0 errors.
  - Production build: `npm run build` -> 467/467 static pages built cleanly.

## 8. October 2026 Live Observations & Quality Audit Fixes

### 8.1 Sugar-Substitute Consistency (`/rechner/zucker-ersatz-rechner/`)
- **Evidence & Confirmed Mismatch:**
  - Agavendicksaft option previously stated "ca. 125 % Süßkraft – ca. 75 g je 100 g Zucker", but entering 100 g sugar returned 75 g agave. Under an assumed relative sweetness of 1.25, the correct calculation is 100 / 1.25 = 80 g, not 75 g.
  - Honig option previously stated "ca. 120 % Süßkraft – ca. 80 g je 100 g Zucker", but entering 100 g sugar returned 80 g honey. Under an assumed relative sweetness of 1.20, the correct calculation is 100 / 1.20 = 83 g, not 80 g.
  - Calculation direction dropdown label was hardcoded to "Zucker durch Erythrit ersetzen", which was misleading when selecting agave, honey, birch sugar, or stevia.
  - Liquid guidance previously offered a blanket "Keine Flüssigkeitsanpassung nötig" for Erythrit, which overpromised on recipe outcome.
- **Exact Changes (`src/data/calculators/extra/einheitenKochen.ts`):**
  - Unified all sugar substitutes under a documented relative sweetness model: g_sub = Math.round(g_sugar / S), with calorie calculation g_sub * kcalPerGram.
  - Agavendicksaft: updated relative sweetness to 1.25, ratio to 0.80 (80 g per 100 g sugar), option label to "Agavendicksaft (ca. 125 % Süßkraft – ca. 80 g je 100 g Zucker)".
  - Honig: updated relative sweetness to 1.20, ratio to 0.83 (83 g per 100 g sugar), option label to "Honig (ca. 120 % Süßkraft – ca. 83 g je 100 g Zucker)".
  - Direction label updated to: "Zucker durch eine Alternative ersetzen (Zucker → Alternative)" (forward) and "Erythrit durch Zucker ersetzen (Erythrit → Zucker)" (reverse, explicitly restricted to Erythrit).
  - Replaced blanket liquid recommendation for Erythrit/dry substitutes with: "Der Rechner berechnet keine Anpassung der Teigflüssigkeit. Beachten Sie die Hinweise Ihres Rezepts.". For liquid sweeteners (honey, agave, maple syrup), preserved explicit note: "Richtwert: Teigflüssigkeit um ca. X ml je 100 g Zucker reduzieren (rezeptabhängig)".
  - Preserved working behaviors: 100 g sugar -> ~143 g Erythrit; 80 g Erythrit -> 56 g sugar equivalent; zero stays zero; empty input triggers validation error.

### 8.2 Human-Readable Result Summaries in CalculatorRunner
- **Evidence & Confirmed Mismatch:**
  - Under "Ihre Eingaben" (basisGrid), raw select keys were rendered directly to visitors, e.g. sugar_to_sub, erythrit_to_sugar, erythrit, agave, and standard on the heating-oil calculator.
  - Zero inputs could risk being formatted as empty dashes or omitted.
  - Dependent fields (e.g. dependsOn arrays) could show inactive inputs in summary.
- **Exact Changes (`src/components/calculator/CalculatorRunner.tsx`):**
  - Updated basisGrid renderer to inspect inputDef.options for any select field and map raw values to their human-readable German option labels (preserving internal identifiers in code while showing clean German UI text).
  - Formatted numerical values using formatNumber(val, { decimals: ... }) with German locale, explicitly preserving meaningful 0 as "0" instead of falling back to dashes.
  - Added support for array dependsOn.value checks so inactive conditional inputs are cleanly hidden from the summary.

### 8.3 Article Promises & Authorship Integrity (`/ratgeber/`)
- **Evidence & Confirmed Mismatch:**
  - CTA in `/ratgeber/erythrit-statt-zucker-backen/` promised "mit einstellbarer Süßkraft und Kalorienvergleich", but the calculator has fixed transparent sweetness assumptions rather than a custom sweetness slider/input.
  - Article claimed that every product labelled "1:1" must be a mixture with other sweeteners.
  - Editorial review tags claimed external review bodies: "Fachredaktion Ernährung & Gesundheit", "Qualitätsprüfung Küche", "Fachredaktion Energie & Haustechnik", and "Fachprüfung Heizung & Gebäude".
- **Exact Changes (`src/data/ratgeber/articles.ts`):**
  - Updated CTA text to accurately describe the existing tool: "Rechnen Sie beliebige Zuckermengen für Ihr Rezept kostenlos in Erythrit oder Xylit um – mit transparenten Süßkraft-Annahmen und Kalorienvergleich.".
  - Revised 1:1 mixture paragraph: users are advised to verify the ingredient list and the specific manufacturer substitution instructions, avoiding blanket assertions.
  - Replaced fabricated review credentials with transparent internal editorial attributions:
    - Erythrit: Author: Redaktion RechenHafen (Redaktion und Recherche); Reviewer: Redaktion RechenHafen (Interne Qualitätssicherung & Plausibilitätsprüfung).
    - Heizöl: Author: Redaktion RechenHafen (Redaktion und Recherche); Reviewer: Redaktion RechenHafen (Interne Qualitätssicherung & Datenabgleich).

### 8.4 Heating-Oil Copy & Physics Alignment (`/rechner/oelheizung-verbrauch-rechner/`)
- **Evidence & Confirmed Mismatch:**
  - Calculator name/heading mentioned "Wohnfläche & Baujahr", but the actual inputs only use living area and an insulation condition model (insulationStandard).
  - Prose promised that tank balances allow users to calculate annual consumption "exakt".
  - Used "Brennwert" for the 10 kWh/litre assumption. In fuel physics, 10 kWh/l corresponds to the lower heating value (Heizwert Hi) of heating oil EL; the gross calorific value (Brennwert Hs) is approximately 10.6 kWh/l.
- **Exact Changes (`src/data/calculators/extra/wohnenHaushalt.ts`, `GasClusterLinks.tsx`, `searchIndex.ts`, `seo-map.json`):**
  - Aligned calculator name to: "Heizölverbrauch schätzen: Wohnfläche und Dämmzustand", while preserving the high-ranking target metaTitle and H1: "Heizölverbrauch berechnen: Liter & Kosten pro Jahr".
  - Replaced "exakt ermitteln" with clear guidance that accuracy depends on precise tank readings and delivery records.
  - Updated kwhEquivalent secondary result label to: "Rechnerischer Brennstoff-Energiegehalt (Heizwert Hi)" and clarified in formula explanation and methodology that 10 kWh/l is Hi, Hs is approx 10.6 kWh/l, and boiler conversion efficiency (Nutzungsgrad) is not modeled.
  - Preserved distinction between model-based floor area estimate and actual consumption from tank readings.

### 8.5 Gas Cost Result Labels, Pricing Scope & Methodology (`/rechner/gaskostenrechner/`)
- **Evidence & Confirmed Mismatch:**
  - Annual result card displayed "Der Wert ist Jahreskosten ÷ 12", which belongs to the monthly average result, not the annual total.
  - "Was kostet Gas pro Monat?" and FAQ provided euro ranges by dwelling size without stating underlying price assumptions.
  - Input label for pricePerKwh suggested "0 € bei mietvertraglicher Pauschale", which misleadingly implied gas is free under a warm rent package.
  - BDEW homepage was broadly referenced as "Amtliche Datenquelle" instead of the specific BDEW Gaspreisanalyse.
  - Methodology box included irrelevant German electricity mix emission factors on gas and oil calculator pages.
- **Exact Changes (`src/lib/calculators/haushalt.ts`, `src/data/calculators/haushalt.ts`, `MethodologyBox.tsx`, `page.tsx`):**
  - Attached correct explanations to results:
    - Annual total: "Verbrauchskosten plus Grundpreis für ein Jahr."
    - Monthly average: "Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen."
  - Removed duplicate "Jahreskosten ÷ 12" statements from generic card footers.
  - Converted dwelling size cost tables in article prose and FAQ into explicit worked examples with stated gross assumptions (0,11 €/kWh, 12 €/Monat Grundpreis) and disclaimed them as illustrative examples, not current market promises.
  - Clarified that entered prices are gross prices and taxes/levies are already included, not added again.
  - Replaced misleading 0 € flat rental instruction with scope guidance: "Für Mietverhältnisse mit pauschaler Warmmiete ohne eigene Gasrechnung ist dieser Rechner nicht ausgelegt.".
  - Updated data source link to the exact BDEW publication: https://www.bdew.de/service/daten-und-grafiken/bdew-gaspreisanalyse/, accurately categorized as a verified reference source (Verifizierte Referenzquelle).
  - Scoped electricity emissions methodology box in MethodologyBox.tsx so it only displays for calculators that actually compute electricity/CO2 metrics.

### 8.6 Targeted SEO, Structured Data & Technical Investigation
- **Title Preservation:**
  - Strictly preserved target titles:
    - Zucker in Erythrit umrechnen: Rechner & Tabelle
    - Heizölverbrauch berechnen: Liter & Kosten pro Jahr
    - Gaskostenrechner: m³ oder kWh in Euro berechnen
- **Structured Data Audit (691 Product Impressions in GSC):**
  - Inspected src/app/rechner/[slug]/page.tsx and shared JSON-LD schemas. Commit 264182f (Oct 5) already removed invalid Offer / Product structures and replaced them with isAccessibleForFree: true under WebApplication schema. No Product or fabricated review/rating markup exists in the current codebase. The GSC export reflects Google's historical indexation window prior to the schema cleanup.
- **Gas Guide Investigation (`/ratgeber/gaszaehler-m3-in-kwh-umrechnen/`):**
  - Reported impressions declined from 255 to 8 between the provided periods.
  - Technical audit confirmed:
    - HTTP status: 200 OK.
    - Robots directive: index, follow.
    - Canonical URL: https://rechenhafen.de/ratgeber/gaszaehler-m3-in-kwh-umrechnen/ (self-referencing).
    - Sitemap inclusion: verified in sitemap.ts.
    - Internal linking: strongly linked from /rechner/gaskostenrechner/, /rechner/gasverbrauch-kwh-m3-rechner/, /ratgeber/gaskosten-berechnen/, /rechner/heizkostenvergleich-rechner/, and /rechner/oelheizung-verbrauch-rechner/.
    - Conclusion: The decline is not caused by technical de-indexing, canonical conflicts, or broken links. Any further causal diagnosis requires query-level Search Console performance data (SERP volatility, seasonal search volume shift, or ranking fluctuations).

### 8.7 Quality Gates & Test Suite
- **Unit Tests:** `npm test` -> 21 test files, 282 tests passing (100% pass).
- **TypeScript Typecheck:** `npx tsc --noEmit` -> 0 errors.
- **Linter:** `npm run lint` -> 0 errors / 0 warnings.
- **Build:** `npm run build` -> 469/469 static pages built cleanly.

## 9. Query-Led Content & Functionality Update (October 2026)

### 9.1 Priority 1 — Correct Maut Accuracy & Scope (`/rechner/autobahn-maut-rechner-vignette/`)
- **Evidence & Identified Issues:**
  - Live page previously displayed outdated Austrian vignette prices (1-day: 8,60 €, 10-day: 11,50 €).
  - Official ASFINAG 2026 car-vignette table lists 9,60 € (1-day) and 12,80 € (10-day).
  - Page promised a European route planner including France, whereas the interface only offered preset route choices.
- **Exact Changes (`src/data/calculators/extra/autoArbeit.ts`):**
  - Updated Austrian car presets to official ASFINAG 2026 rates:
    - 1-Tages-Vignette: 9,60 € (ASFINAG Tarif 2026, 00:00 bis 23:59 Uhr)
    - 10-Tages-Vignette: 12,80 € (ASFINAG Tarif 2026, 10 Kalendertage)
    - 10-Tages-Vignette + Brennermaut (A13) Hin- & Rückfahrt: 12,80 € + (2 × 12,00 €) = 36,80 €
    - 10-Tages-Vignette + Tauernautobahn (A10) Hin- & Rückfahrt: 12,80 € + (2 × 14,50 €) = 41,80 €
  - Switzerland: Swiss statutory fee of 40,00 CHF (BAZG) with transparent euro guidance (~42,00 €).
  - Italy: A22 Brenner - Rovereto/Affi (Gardasee Süd) roundtrip: ~33,60 € route toll (Klasse A PKW).
  - Separated secondary outputs into:
    - `vignettePart`: Reine Vignettengebühr
    - `routeTollPart`: Reine Strecken- / Sondermaut
    - `validity`: Gültigkeitsdauer
    - `operator`: Zuständiger Mautbetreiber (ASFINAG, BAZG, Autostrada del Brennero)
  - Aligned titles and copy: removed all misleading mentions of France or European routing engine. Scope is explicitly defined as preset choices for Austria, Switzerland, and the Brenner corridor to Italy.
  - Linked official sources and verified single source of truth in `timeSensitiveMeta` with lastVerified `2026-10-15`.
  - Added test suite: `src/__tests__/maut-rechner.test.ts` (7 tests passing).

### 9.2 Priority 2 — Upgraded Splitt Calculator (`/rechner/kies-splitt-rechner/`)
- **Evidence & Identified Issues:**
  - Only supported area × thickness inputs with no direct volume in m³ or weight in tonnes mode.
  - "Material & Rohdichte" label confused solid rock density with bulk density (Schüttdichte).
  - Fixed 10% allowance was blended into reported volume without separation.
  - Blanket 10–15% compaction claim contradicted single-size grit physics (Splitt 2/5 has no fines and compacts 0–5%, while graded crushed gravel 0/32 compacts 10–20%).
- **Exact Changes (`src/data/calculators/extra/bauenGeometrie.ts`):**
  - Added 3 clearly separated modes:
    1. `area_depth`: Fläche & Schütthöhe → Volumen (m³) & Gewicht (t)
    2. `volume_to_weight`: Bekanntes Volumen (m³) → Gewicht (t)
    3. `weight_to_volume`: Bekanntes Gewicht (t) → Volumen (m³)
  - Added product-specific bulk density choices:
    - Splitt 2/5 (1,50 t/m³)
    - Rollkies 16/32 (1,60 t/m³)
    - Schotter / Frostschutz 0/32 (1,80 t/m³)
    - Sand 0/2 (1,60 t/m³)
    - Rindenmulch (0,40 t/m³)
    - Custom density input (`customDensity` in t/m³)
  - In area mode: cleanly separated `baseVolume` (Reines Einbauvolumen), `allowanceVol` (Zuschlag), and `totalVolume` (Gesamtvolumen für Bestellung).
  - Preserved valid zero allowance (0% allowance gives 0,00 m³ extra).
  - Added test suite: `src/__tests__/kies-splitt-rechner.test.ts` (6 tests passing).

### 9.3 Priority 2 — New Ratgeber Article: Splitt 2/5 (`/ratgeber/splitt-2-5-gewicht-schuettdichte/`)
- **Publication Details (`src/data/ratgeber/articles.ts`):**
  - Title: `Splitt 2/5: Gewicht, Schüttdichte und m³ in Tonnen umrechnen`
  - Slug: `splitt-2-5-gewicht-schuettdichte`
  - Category: `bauen-renovieren` (Bauen & Renovieren)
  - Dates: `publishedAt: '2026-10-18'`, `updatedAt: '2026-10-18'`
  - Authorship: Author: `Redaktion RechenHafen` (Redaktion und Recherche), Reviewer: `Redaktion RechenHafen` (Interne Qualitätssicherung & Plausibilitätsprüfung)
  - Cover illustration: `/images/ratgeber/splitt-2-5-volumen-gewicht-berechnung.svg`
  - Topics covered:
    - Meaning of grain size 2/5 mm (DIN EN 13043 / DIN EN 13242)
    - Schüttdichte vs. Rohdichte (40–45% air voids in loose material)
    - Formulas: tonnes = m³ × Schüttdichte; m³ = tonnes ÷ Schüttdichte
    - Worked examples (2 m³ × 1,5 t/m³ = 3 t; 3 t ÷ 1,5 t/m³ = 2 m³; 30 m² × 0,05 m = 1,5 m³ = 2,25 t)
    - Why Big Bags are not universally 1 tonne (volume bags vs weight bags)
    - Compaction realities: why Splitt 2/5 needs no 15% allowance
  - Contextual bidirectional linking to `kies-splitt-rechner`.

### 9.4 Priority 3 — Upgraded Lebensmonate Calculator (`/rechner/alter-in-monaten/`)
- **Evidence & Scope:**
  - Preserved canonical URL `/rechner/alter-in-monaten/`.
  - Needed to distinguish completed months from the running month of life and handle date boundaries.
- **Exact Changes (`src/data/calculators/datumZeit.ts`):**
  - Primary result: `completedMonths` (Vollendete Lebensmonate, e.g. "2 Monate, 0 Tage").
  - Secondary results:
    - `runningMonth`: Laufender Lebensmonat (e.g. "3. Lebensmonat")
    - `restDays`: Verbleibende Resttage
    - `totalWeeks`: Alter in Wochen und Tagen
    - `totalDays`: Gesamte Lebenstage
  - Strict calendar anniversary logic without dividing by 30:
    - Example 15 Jan to 15 March: exactly 2 completed months, 0 days, 3. Lebensmonat.
    - Example 15 Jan to 14 March: 1 completed month, 27 days, 2. Lebensmonat.
  - Month-end convention for 29th, 30th, 31st: Geburt 31. Jan vollendet sich am 28. Feb (bzw. 29. Feb im Schaltjahr) nach BGB § 188 Abs. 3 analog.
  - Future dates rejected with clean validation error.
  - German date formatting in summary text (`15.01.2026`).
  - Removed irrelevant holiday-law boilerplate.
  - Added test suite: `src/__tests__/alter-in-monaten.test.ts` (7 tests passing).

### 9.5 Priority 3 — New Ratgeber Article: Lebensmonate (`/ratgeber/lebensmonate-berechnen/`)
- **Publication Details (`src/data/ratgeber/articles.ts`):**
  - Title: `Lebensmonate berechnen: Vollendete Monate und laufender Lebensmonat`
  - Slug: `lebensmonate-berechnen`
  - Category: `datum-zeit` (Datum & Zeit)
  - Dates: `publishedAt: '2026-10-18'`, `updatedAt: '2026-10-18'`
  - Authorship: Author: `Redaktion RechenHafen` (Redaktion und Recherche), Reviewer: `Redaktion RechenHafen` (Interne Qualitätssicherung & Plausibilitätsprüfung)
  - Cover illustration: `/images/ratgeber/lebensmonate-zeitstrahl-berechnung.svg`
  - Topics covered:
    - Distinction between completed months and current month of life
    - Worked examples: before, on, and after anniversary
    - Why 4 weeks (28 days) are not a calendar month (30,44 days)
    - Month-end rules under BGB § 188 Abs. 3
    - Legal relevance for Elterngeld (BEEG § 4) and pediatric U-checkups
  - Contextual bidirectional linking to `alter-in-monaten`.

### 9.6 Priority 4 — Improved Existing Erythrit Content (`/rechner/zucker-ersatz-rechner/`)
- **Exact Changes (`src/data/calculators/extra/einheitenKochen.ts`):**
  - Added dedicated section and table for reverse conversion:
    - 60 g Erythrit -> 42 g Zucker
    - 80 g Erythrit -> 56 g Zucker
    - 100 g Erythrit -> 70 g Zucker
    - 120 g Erythrit -> 84 g Zucker
    - 125 g Erythrit -> 87,5 g Zucker (gerundet ca. 88 g)
    - 150 g Erythrit -> 105 g Zucker
  - Added dedicated section on tablespoon searches explaining the volume/weight distinction:
    - Level tablespoon crystalline Erythrit: ~10–12 g
    - Heaped tablespoon crystalline Erythrit: ~15–18 g
    - Powdered Erythrit: ~8–10 g
    - Explains why no universal grams-per-tablespoon factor exists and advises using a kitchen scale.
  - Added test suite assertions in `src/__tests__/zucker-ersatz-rechner.test.ts` (9 tests passing).

### 9.7 Responsive SVG Illustrations
- Created `public/images/ratgeber/splitt-2-5-volumen-gewicht-berechnung.svg`: Clean responsive infographic showing Fläche × Höhe = Volumen → Haufwerksporen & Schüttdichte → Gewicht in Tonnen.
- Created `public/images/ratgeber/lebensmonate-zeitstrahl-berechnung.svg`: Clean calendar timeline illustrating Geburtsdatum → Monatstage → Vollendetes Alter vs. Laufender Lebensmonat.

### 9.8 Quality Gates & Test Suite
- **Unit Tests:** `npm test` -> 25 test files, 306 tests passing (100% pass).
- **TypeScript Typecheck:** `npx tsc --noEmit` -> 0 errors.
- **Linter:** `npm run lint` -> 0 errors / 0 warnings.
- **Build:** `npm run build` -> 471/471 static pages built cleanly.

---

## 10. Calculator Experience, Search-Intent Coverage & Return-Visit Features (October 2026)

### 10.1 Objective & Scope
- **Objective:**
  - Make visitors immediately understand what question the calculator answers, which inputs are needed, what the result means, which assumptions affect it, and what useful next steps they can take.
  - Implement full functionality for the Pasta Calculator (resolving live title vs. UI mismatch).
  - Make the Rice Calculator internally consistent across options, formulas, FAQs, and cooked yields.
  - Upgrade the shared calculator experience with honest initial demonstration state ("Beispielrechnung" vs. "Ihre Berechnung"), result hierarchy, and mobile accessibility.
  - Add lightweight, purely client-side return-visit features ("Rechner merken" bookmarks, recent history based on actual user interactions, zero tracking, "Nur in diesem Browser gespeichert").
  - Provide contextual next-step recommendations without URL parameter pollution.
  - Enhance privacy-conscious GA4 event tracking guarded by user consent with zero PII transmission.

### 10.2 Section A — Complete the Pasta Calculator (`/rechner/nudeln-rohmaerk-gewicht-rechner/`)
- **Evidence & Confirmed Mismatch:**
  - Search Console (10–16 Oct): 185 impressions, 1 click, avg. position 7.16.
  - Title previously promised raw-to-cooked conversion, but interface only accepted person count and meal type.
  - Meal option stated 100–125 g/person, while body copy cited 80–100 g without context.
  - Default result reported excessive precision (1,003 g cooked pasta).
  - 440 g pasta with 1 l/100 g rule yielded a displayed 5 liters without explaining pot capacity.
  - Internal raw key `mainDish` appeared in the input summary.
- **Implemented Changes (`src/data/calculators/extra/einheitenKochen.ts`):**
  - Preserved canonical URL `/rechner/nudeln-rohmaerk-gewicht-rechner/`.
  - Updated title: `Nudeln umrechnen: trocken, gekocht & Portionen`.
  - Updated description: `Trockene und gekochte Nudeln umrechnen oder Portionen planen. Mit nachvollziehbarem Rechenweg und anpassbarem Quellfaktor.`
  - Implemented 3 accessible calculation modes:
    1. `portion_plan`: Persons, meal hunger type (`mainDish` 110 g, `bigHunger` 150 g, `sideDish` 70 g, `kids` 55 g, or `customGramsPerPerson`).
    2. `dry_to_cooked`: Forward conversion from dry grams to cooked yield.
    3. `cooked_to_dry`: Reverse conversion from cooked grams to required dry pasta.
  - Conversion factor options:
    - Standard Hartweizen al dente: 2,3 (100 g dry $\leftrightarrow$ 230 g cooked).
    - Weichere Pasta / Suppennudeln: 2,5.
    - Frische Pasta / Eierteigwaren: 1,5 (explains 25–30% residual moisture).
    - Benutzerdefiniert (`customFactor`): strictly validated positive number, rejecting $\le 0$.
  - Water & Salt calculations:
    - Exact arithmetic: 440 g dry $\to$ 4,4 Liter water (10-100-1000 rule).
    - Recommended pot size: explicitly recommends $\ge 5$–6 liter pot to avoid boiling over.
    - Salt: 44 g (10 g / Liter).
  - Cleaned summary: No raw `mainDish` keys.
  - Added conversion table in content sections (50 g, 70 g, 100 g, 110 g, 125 g, 150 g, 250 g, 500 g).

### 10.3 Section B — Consistent Rice Calculator (`/rechner/wasser-reis-verhaeltnis-rechner/`)
- **Evidence & Inconsistencies Resolved:**
  - Search Console: 172 impressions, 1 click, avg. position 13.73.
  - Removed manual truncation ellipses in metadata (`metaTitle: 'Reis-Wasser-Rechner: Menge nach Reissorte berechnen'`).
  - Unified all varietal ratios across options, formulas, and content:
    - Basmati: 1 : 1,5 (150 ml water / 100 g rice), 12–15 min closed pot Quellmethode.
    - Jasmin: 1 : 1,3 (130 ml water / 100 g rice), 12–14 min closed pot Quellmethode.
    - Vollkorn: 1 : 2,0 (200 ml water / 100 g rice), 35–45 min closed pot Quellmethode.
    - Sushi: 1 : 1,2 (120 ml water / 100 g rice), 15 min garzeit + 10 min rest.
    - Risotto: 1 : 3,0 (300 ml hot broth / 100 g rice), 20–25 min in an open pot under constant stirring (explicitly distinguished from closed-pot Quellmethode).
  - Disambiguated output unit: `300 ml Wasser` / `600 ml heiße Gemüse- oder Fleischbrühe` (never ambiguous `300 ml (g)`).
  - Cooked yield aligned: 200 g dry Basmati + 300 ml water yields ca. 490 g cooked rice.
  - Salt treated as optional seasoning (`ca. 1/2 bis 1 gestr. TL, optional nach Geschmack`).
  - Added prominent qualification note: Package instructions take priority.

### 10.4 Section C — Shared Calculator Experience
- **Honest Initial State:**
  - Initial prefilled demonstration state labeled as `Beispielrechnung`.
  - Switches to `Ihre Berechnung` immediately upon first meaningful user interaction.
  - Reset button restores default values and returns badge to `Beispielrechnung` without firing false calculation-completion analytics.
- **Mobile & Accessibility:**
  - Added accessible `Zum Ergebnis ↓` anchor link for mobile viewports.
  - Ensured all numeric inputs use `inputMode="decimal"`.
  - Added live polite announcement and keyboard focus states.

### 10.5 Section D — Lightweight Return-Visit Features
- **Client-Side Storage (`src/lib/storage/favorites.ts`):**
  - "Rechner merken" button on calculator pages with active/inactive states.
  - "Gemerkte Rechner" interactive dropdown menu in `Header.tsx` showing count badge and saved calculators with individual remove buttons.
  - "Zuletzt verwendet" list tracking up to 6 recently used calculators based on active user interaction (not passive page views).
  - Clear history action ("Verlauf leeren").
  - Privacy guarantee: Only stores slugs; never persists user inputs, results, or PII. Fully functional offline and resilient if storage throws. Explicitly stated: "Nur in diesem Browser gespeichert."

### 10.6 Section E — Useful Contextual Next Steps
- **Contextual Next Steps Component (`src/components/calculator/ContextualNextSteps.tsx`):**
  - Pasta $\to$ `portionsrechner`, `kalorien-rezept-rechner`, `wasser-reis-verhaeltnis-rechner`.
  - Rice $\to$ `portionsrechner`, `gramm-in-ml-rechner`, `nudeln-rohmaerk-gewicht-rechner`.
  - Splitt $\to$ `pflastersteine-rechner`, `splitt-2-5-gewicht-schuettdichte` Ratgeber, `schotter-rechner`.
  - Alter in Monaten $\to$ `lebensmonate-berechnen` Ratgeber, `alter-in-tagen`, `altersrechner`.

### 10.7 Section F — Privacy-Conscious Analytics Pipeline
- **Enhanced Events in `src/lib/analytics/ga4.ts`:**
  - `calculator_start`: Fired once on first meaningful user interaction.
  - `calculator_result`: Fired when a valid result is generated after user interaction.
  - `calculator_validation_error`: Transmits only field identifier and error category.
  - `calculator_copy_result` / `result_copied`: Clipboard copy action without copying content.
  - `calculator_related_click` / `related_calculator_clicked`: From and to slugs only.
  - `calculator_favorite_add` / `calculator_favorite_remove`: Bookmark toggles.
  - Guarded strictly by `hasAnalyticsConsent()`. Zero user input values, results, DOB, or PII transmitted.

### 10.8 Quality Gates & Production Build
- **Unit Tests:** `npm test` $\to$ 28 test files, 329 tests passing (100% pass).
- **TypeScript:** `npx tsc --noEmit` $\to$ 0 errors.
- **ESLint:** `npm run lint` $\to$ 0 errors, 0 warnings.
- **Production Build:** `npm run build` $\to$ 471/471 static routes compiled successfully.
- **Live Browser QA:** Validated in local browser session (`qa_experience_check`), confirming layout, interactions, bookmark toggle, copy result, and mobile navigation.

## 11. Internal Calculator Search Relevance and Usability Overhaul
- **Root Causes of Prior Ranking & Usability Defects:**
  1. **Manual Static Index Disconnect:** `src/data/searchIndex.ts` was a legacy 7,088-line static snapshot of 405 calculators; 16 recently published calculators (including `zucker-ersatz-rechner`) were absent from the static index file.
  2. **Unweighted Generic Query Overlap:** Generic question words (`wie`, `viel`, `kann`, `ich`) had equal flat score weight (+15/+8) across tokens. Financial and loan tools with long title questions like *"wie viel miete kann ich mir leisten"* accumulated points for "wie" + "viel", outranking specialized calculators when users searched *"wie viel erythrit statt zucker"*.
  3. **Lack of German Normalization:** Umlauts (`ä/ae`, `ö/oe`, `ü/ue`, `ß/ss`) were not symmetrically normalized, creating disparities for searches like `heizölverbrauch` vs `heizoelverbrauch`.
  4. **Missing Typo Tolerance:** No fuzzy fallback existed for minor spelling variations like `erytrit`.
  5. **Raw Category Slug Exposure:** Search dropdown rendered `{res.category}` (`kochen-backen`, `datum-zeit`) instead of readable German category names (`Kochen & Backen`, `Datum & Zeit`).
  6. **Interactive Link Accessibility:** Search results rendered `<button>` tags instead of semantic `<Link href="...">` (`<a>`) tags, preventing native browser actions like right-click "Open in new tab" or middle-click.
  7. **Missing Result Descriptions:** Results omitted the calculator's `shortDescription`.
  8. **Missing Empty State Guidance:** When no matches occurred, the dropdown did not provide actionable German guidance or a direct link to the directory.
- **Exact Changes Implemented:**
  - `src/lib/search/searchEngine.ts`:
    - Built dynamic in-memory search index derived directly from the canonical `ALL_CALCULATORS` registry (421 calculators) and `CATEGORIES`.
    - Implemented `normalizeGermanText()` mapping `ä` $\to$ `ae`, `ö` $\to$ `oe`, `ü` $\to$ `ue`, `ß` $\to$ `ss`, and punctuation handling.
    - Implemented Damerau-Levenshtein distance algorithm for controlled typo matching on non-stopwords $\ge 5$ chars.
    - Implemented Term Specificity & Content Coverage: Discriminative content terms receive 60-150 pts while generic stopwords (`wie`, `viel`, `kann`, `ich`, etc.) receive only 2-3 pts. Calculators matching 0 content tokens are heavily penalized/filtered out.
    - Directional sensitivity: Token sequence order and origin prefix matching prioritize intended direction (`netto in brutto` $\to$ `netto-brutto-rechner`; `brutto in netto` $\to$ `brutto-netto-rechner`).
  - `src/components/common/SearchBar.tsx`:
    - Integrated `searchCalculators()` from `searchEngine.ts`.
    - Switched result rows from `<button>` to semantic `<Link href={`/rechner/${res.slug}/`}>`.
    - Displaying resolved German category name (`res.categoryName`) and `res.shortDescription`.
    - Multi-token safe highlighting (`<mark>`) without raw HTML injection.
    - Full combobox ARIA pattern (`role="combobox"`, `aria-autocomplete="list"`, `aria-activedescendant`, `aria-expanded`).
    - Standardized empty state: *"Kein passender Rechner gefunden. Versuchen Sie einen kürzeren Suchbegriff oder wählen Sie eine Kategorie."* with direct working link to `/rechner/`.
  - `src/components/calculator/AllCalculatorsDirectory.tsx`:
    - Integrated `searchCalculators()` into directory search filter for unified ranking across header, homepage hero, and directory.
  - `src/data/searchIndex.ts`:
    - Replaced static 7,088-line file with a dynamic lightweight export derived from `ALL_CALCULATORS`.
- **Before / After Ranking Verification:**
  | Query | Before Ranking | After Ranking | Top Result URL | Category Displayed |
  |---|---|---|---|---|
  | `Erythrit` | Missing from static index / unranked | #1 Zucker-Ersatz-Rechner | `/rechner/zucker-ersatz-rechner/` | Kochen & Backen |
  | `wie viel erythrit statt zucker` | Mietbudget- / Kreditrechner (#1) | #1 Zucker-Ersatz-Rechner (Miet/Kredit filtered out) | `/rechner/zucker-ersatz-rechner/` | Kochen & Backen |
  | `150 g zucker wieviel erythrit` | Unrelated or low rank | #1 Zucker-Ersatz-Rechner | `/rechner/zucker-ersatz-rechner/` | Kochen & Backen |
  | `erytrit` | 0 results (no typo tolerance) | #1 Zucker-Ersatz-Rechner (fuzzy match) | `/rechner/zucker-ersatz-rechner/` | Kochen & Backen |
  | `lebensmonate` | Altersrechner / mixed | #1 Alter-in-Monaten-Rechner | `/rechner/alter-in-monaten/` | Datum & Zeit |
  | `heizölverbrauch` | Oil calculator | #1 Ölheizung-Verbrauch-Rechner | `/rechner/oelheizung-verbrauch-rechner/` | Haushalt & Energie |
  | `heizoelverbrauch` | Missing or ranked lower | #1 Ölheizung-Verbrauch-Rechner (identical score to umlaut) | `/rechner/oelheizung-verbrauch-rechner/` | Haushalt & Energie |
  | `splitt 2/5 gewicht` | Unranked / naive substring miss | #1 Kies- & Splitt-Rechner | `/rechner/kies-splitt-rechner/` | Bauen & Renovieren |
  | `wie viel miete kann ich mir leisten` | Mietbudget-Rechner | #1 Mietbudget-Rechner | `/rechner/mietbudget-rechner/` | Wohnen & Immobilien |
  | `wie viel kredit kann ich mir leisten` | Maximaler-Kredit-Rechner | #1 Maximaler Kredit-Rechner | `/rechner/maximaler-kredit-rechner/` | Kredit & Schulden |
  | `netto in brutto` | Ambiguous | #1 Netto-Brutto-Rechner (Wunsch-Netto) | `/rechner/netto-brutto-rechner/` | Steuern & Gehalt |
  | `brutto in netto` | Ambiguous | #1 Brutto-Netto-Rechner (Gehaltsrechner) | `/rechner/brutto-netto-rechner/` | Steuern & Gehalt |
- **Quality Gates & Production Verification:**
  - `npm test`: 29 test files, 347 tests passing (100% pass), including 18 dedicated tests in `src/__tests__/search-relevance.test.ts`.
  - `npx tsc --noEmit`: 0 errors.
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: 471/471 static routes generated successfully in 4.9s.
  - Production Browser QA (`prod_search_qa` recording): Verified homepage hero search, keyboard arrow selection, Enter navigation, header typo search, empty state German text and link, and directory search.


## 12. Five Priority Calculators & Shared Invalid-Result Audit (October 2026)

### Progress Checklist & Issue Categorization

#### A. Shared Invalid-Result Display (CalculatorRunner & Copy Behavior)
- [x] **[Confirmed Live Defect]** Water calculator: entering 0 in both water-price fields triggers validation warning, but previous 657,00 € answer remains visible alongside inputs showing 0 €. Fixed: When active inputs are invalid or incomplete, the result display is cleanly replaced by an accessible validation alert with specific active error messages.
- [x] **[Confirmed Live Defect]** Splitt calculator: selecting custom density and clearing it displays a warning, but previous 2.25 t answer remains visible alongside blank density. Fixed: Previous result is immediately hidden, replaced with validation feedback.
- [x] **[Confirmed Source-Code Defect]** `CalculatorRunner.tsx`: `fieldErrors` displayed a notice while leaving the previous `result` active, and allowed copying stale/invalid answers. Fixed: Guarded `handleCopyResult` with `if (result.error || hasActiveErrors) return;`, replaced result container with validation alert state, and ensured valid->invalid->valid recovery.
- [x] **[Confirmed Source-Code Defect]** Inactive conditional fields: inputs from non-selected modes (e.g. `area` when in `volume_to_weight` mode) could erroneously trigger or retain validation errors. Fixed: Implemented `isFieldActive(def, currentInputs)` helper to ignore inactive inputs in error checks and summary tables.
- [x] **[Confirmed Source-Code Defect]** Engine fallback: calculator functions in `bauenGeometrie.ts` and `wohnenHaushalt.ts` fell back to defaults instead of returning explicit error objects. Fixed: Explicit validation for positive finite numbers, returning clear `{ error: '...' }` objects.

#### B. Household Water Calculator (`/rechner/wasserverbrauch-haushalt-rechner/`)
- [x] **[Confirmed Live Defect]** Entering 0 in price fields was rejected by field definition `min: 1.0`, blocking valid zero-tariff scenarios (e.g. private well or separate absorption). Fixed: Allowed legitimate zero variable prices and zero consumption (`min: 0`), while distinguishing blank from zero.
- [x] **[Confirmed Source-Code Defect]** `parseInt(inputs.persons, 10) || 3` silently replaced zero and invalid values with defaults, and truncated fractions without validation. Fixed: Explicit validation requiring positive integer $\ge 1$, rejecting non-finite and fractional persons with a clear error.
- [x] **[Confirmed Source-Code Defect]** Arbitrary tariff maximums (`max: 5.0` and `max: 6.0`) blocked valid high-cost municipal tariffs. Fixed: Adjusted realistic ranges (`max: 25.0 €/m³`).
- [x] **[Confirmed Source-Code Defect]** Primary label claimed "Jährliche Gesamtwasserkosten", but only calculated volumetric freshwater and wastewater charges, omitting fixed meter charges. Fixed: Label clarified as "Geschätzte jährliche Wasserkosten (Frisch- & Abwasser)" and added optional `fixedFeeYear` (default 0 €).
- [x] **[Improvement Requiring Research]** Destatis / BDEW statistics: Cited BDEW Wasserstatistik 2024 / Destatis 2022 (~125–128 liters/person/day in Germany) with date and source in help text and copy.
- [x] **[Improvement Requiring Research]** Added optional annual fixed fee (`fixedFeeYear`, default 0 €), transparently broken down. Clarified that rainwater runoff fees (Niederschlagswassergebühr) and water heating energy are excluded.
- [x] **[Improvement Requiring Research]** Used "rechnerischer Monatsdurchschnitt" for annual costs divided by 12.

#### C. Kies / Splitt Calculator (`/rechner/kies-splitt-rechner/`)
- [x] **[Confirmed Live Defect]** Blank custom density continued calculating with 1.50 t/m³. Fixed: Blank, zero, negative, or nonnumeric custom density now returns an explicit validation error, never falling back to a default.
- [x] **[Confirmed Source-Code Defect]** `density = !isNaN(cd) && cd > 0 ? cd : 1.50;` in `bauenGeometrie.ts` silently substituted default density. Fixed: Strict validation for finite number > 0.
- [x] **[Confirmed Source-Code Defect]** Premature intermediate rounding before final total calculation. Fixed: Kept full calculation precision, rounding cleanly for presentation without altering small-volume results.
- [x] **[Improvement Requiring Research]** Clarified loose bulk density (Schüttdichte) vs. compacted material (Festgestein / verdichtet). Disclosed that `crushed_0_32` is already compacted and compaction allowance must not be applied twice.
- [x] **[Improvement Requiring Research]** Big Bags: clarified 1,000 kg assumption and noted that bag sizes vary by supplier (kg-based vs. volume-based).

#### D. Schalungssteine Calculator (`/rechner/schalungssteine-rechner/`)
- [x] **[Confirmed Live Defect]** Opening taller than wall (e.g., 8 m wall of 1.5 m height with 1 m × 2 m opening) silently subtracted 2 m² from 12 m² to return 80 net stones. Fixed: Openings with height exceeding wall height are now explicitly rejected with an error.
- [x] **[Confirmed Source-Code Defect]** Missing height check (`openingHeight > wallHeight`) in geometry validation. Fixed: Added check and error message.
- [x] **[Confirmed Source-Code Defect]** Incomplete opening inputs (width without height or vice versa) not rejected. Fixed: Both width and height are required when specifying dimensions.
- [x] **[Confirmed Source-Code Defect]** Blank `wallLengthB` in `l_shape`, `u_shape`, and `rectangle_pool` silently defaulted to 4. Fixed: Active side lengths must be explicitly provided and > 0.
- [x] **[Improvement Requiring Research]** Documented dimension basis (nominal center-line/external lengths), equal-side U-shape assumption, corner overlaps, and structural safety disclaimer.

#### E. Pasta Calculator (`/rechner/nudeln-rohmaerk-gewicht-rechner/`)
- [x] **[Confirmed Live Defect]** Selecting fresh pasta (factor 1.5) still displayed "440 g Trockennudeln" for four people. Fixed: Uncooked fresh pasta is differentiated from dry pasta throughout labels, summaries, directAnswer, and copy output.
- [x] **[Confirmed Source-Code Defect]** Portion planning applied dry pasta weight (110 g) and hardcoded "g Trockennudeln" in labels regardless of selected factor. Fixed: Portion planning provides dedicated portion sizes for fresh pasta (~150 g raw per person for a main course) and labels outputs "frische Pasta (ungekocht)".
- [x] **[Improvement Requiring Research]** Consistent portion model: for fresh pasta (factor 1.5), to achieve typical cooked portion (~230–250 g), uncooked mass is ~150–160 g/person. Differentiated labels ("Frische Teigwaren" vs. "Trockennudeln").

#### F. Rice Calculator (`/rechner/wasser-reis-verhaeltnis-rechner/`)
- [x] **[Confirmed Live Defect]** At 1,000 g rice, salt guidance outputted `ca. 15 g (ca. 1/2 gestr. TL...)` where grams scaled but teaspoon text remained hardcoded. Fixed: Teaspoon equivalents now scale dynamically based on a disclosed assumption (1 level teaspoon table salt $\approx 5$ g).
- [x] **[Confirmed Source-Code Defect]** `Math.max(1, Math.round(riceG / 65))` forced tiny quantities (e.g. 20 g rice) to display as "1 Portion". Fixed: Quantities < 45 g display decimal portion fractions or clear basis references instead of claiming a full meal serving.
- [x] **[Improvement Requiring Research]** Verified water ratios for stovetop absorption method (Quellmethode im geschlossenen Topf) with g to ml ratios; distinguished from rice-cooker instructions; kept cooked yield as approximate.

#### G. Worked Examples & Content Rendering
- [x] **[Confirmed Live Defect]** Worked examples across calculators showed title and result, but omitted `inputValues` (inputs chips/list) and steps when multiple worked examples were defined. Fixed: Upgraded shared renderer in `src/app/rechner/[slug]/page.tsx` to display inputs chips, description, ordered calculation steps (`<ol>`), result badge, and assumptions/notes for both single and multiple worked examples.
- [x] **[Confirmed Source-Code Defect]** `src/app/rechner/[slug]/page.tsx` only rendered `description` and `steps`, completely ignoring `inputValues` / `inputs`. Fixed: Rendered structured input chips and preparation steps across all worked examples.

#### H. SEO, Metadata & Internal Links
- [x] **[Already Fixed]** Canonical URLs and slugs preserved without changes (`/rechner/wasserverbrauch-haushalt-rechner/`, `/rechner/kies-splitt-rechner/`, `/rechner/schalungssteine-rechner/`, `/rechner/nudeln-rohmaerk-gewicht-rechner/`, `/rechner/wasser-reis-verhaeltnis-rechner/`).
- [x] **[Already Fixed]** Titles, descriptions, and H1s match actual user tasks and include "kostenlos" naturally. Contextual guide links and backlinks verified.

---

## 13. Sourced CO₂ Calculator Cluster & Existing Calculator Improvements (October 2026)

### Scope Overview
1. **Shared Versioned Emissions Factor Registry** (`src/data/emissions/index.ts`):
   - Versioned, verified factors with explicit boundaries (`direct_combustion` Scope 1 vs. `energy_generation` Scope 2 vs. `lifecycle` Well-to-Wheel / CO₂e).
   - Full metadata: value, unit, geographic coverage (DE), reference year, source URL, source publication/table, status (`estimated` | `provisional` | `final`), verification date, and boundary caveats.
2. **New Calculators (in order)**:
   - 1. `/rechner/co2-strom-rechner/` (Electricity consumption in kWh, period, sourced UBA factor 344 g CO₂/kWh for 2025 published March 2026, scenario comparisons, original SVG).
   - 2. `/rechner/co2-pendeln-rechner/` (Commuting distance, return trip, actual commuting days, home-office reduction, sourced UBA 2024 Pkm factors [car 164 g/Pkm, train long-distance 44 g/Pkm, regional 79 g/Pkm, bus 108 g/Pkm], separate route lengths, original SVG).
   - 3. `/rechner/co2-preis-rechner/` (BEHG/EBeV fuel carbon pricing for gas, heating oil, petrol, diesel, LPG; statutory rates 2024–2026, VAT treatment, clear separation of carbon surcharge vs. total bill, no speculative market price claims for ETS-2).
3. **Existing Page Improvements**:
   - `/rechner/co2-auto-rechner/`: Audit 0.38 kg/kWh factor, update to latest UBA factor (344 g/kWh for generation vs. 400 g/kWh lifecycle), add trip mode (annual vs. single trip), clarify combustion vs. electricity generation.
   - `/rechner/co2-abgabe-vermieter-mieter-rechner/`: Audit against CO2KostAufG 10-Stufenmodell, clarify building vs. dwelling scope, invoice data support, partial-year periods, statutory exemption cases (§ 9).
   - `/rechner/heizkostenvergleich-rechner/`: Resolve promise mismatch (implement district heating / Fernwärme, optional maintenance), add emission comparison with compatible boundaries.
4. **Supporting Ratgeber Articles & Original SVG Visualizations**:
   - `/ratgeber/co2-pro-kwh-strom/`
   - `/ratgeber/co2-arbeitsweg-auto-bahn/`
   - Original SVGs:
     - `public/images/ratgeber/co2-strom-kwh-berechnung-formel.svg`
     - `public/images/ratgeber/co2-pendeln-verkehrsmittel-vergleich.svg`
     - `public/images/ratgeber/co2-preis-tonnen-euro-berechnung.svg`
5. **Regression Tests & Release**:
   - Unit tests covering arithmetic (e.g., 2,500 kWh × 344 g = 860 kg; 7,200 Pkm × 164 g = 1,180.8 kg; 7,200 Pkm × 44 g = 316.8 kg; 2,000 kg × 60 €/t = 120 €; 15,000 kWh Gas × 0.182 × 55 €/t = 150.15 € net / 178.68 € gross), edge cases, zero handling, input pauses, sitemap inclusion, and clean build.

### Implementation Status
- [x] Phase 1: Shared Versioned Emissions Factor Registry (`src/data/emissions/index.ts`)
  - Created strongly typed registry with complete metadata: value, unit, geographicCoverage ('Deutschland (DE)'), referenceYear, sourceUrl, sourcePublication, sourceSection, gasType ('CO2' | 'CO2e'), boundary ('direct_combustion' | 'energy_generation' | 'lifecycle'), status ('estimated' | 'provisional' | 'final' | 'statutory'), verificationDate, and boundary notes.
  - Sourced UBA Strommix 2025 estimate (344 g CO₂/kWh direct generation; published March 2026), lifecycle Strommix (410 g CO₂e/kWh), certified green electricity lifecycle (25 g CO₂e/kWh), UBA TREMOD 2024 passenger-km factors (Pkw: 164 g CO₂e/Pkm; Fernverkehr Bahn: 44 g CO₂e/Pkm; Nahverkehr Bahn: 79 g CO₂e/Pkm; Linienbus: 108 g CO₂e/Pkm; E-Bike: 4 g CO₂e/Pkm), and statutory BEHG/EBeV fuel factors (Erdgas: 0.182 kg/kWh; Heizöl: 2.66 kg/l; Benzin: 2.37 kg/l; Diesel: 2.65 kg/l; LPG: 1.65 kg/l).
  - Exact official source links:
    - Strom: `https://www.umweltbundesamt.de/themen/co2-emissionen-pro-kilowattstunde-strom-2025-nur`
    - Mobilität: `https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten` & `.../vtv_2024_pv_tab_pdf.pdf`
    - Brennstoffe: `https://www.gesetze-im-internet.de/ebev_2030/` & `https://www.gesetze-im-internet.de/behg/`
    - Vermieter/Mieter: `https://www.gesetze-im-internet.de/co2kostaufg/`
- [x] Phase 2: Improve Existing Calculators
  - `/rechner/co2-auto-rechner/`: Audited legacy 0.38 kg/kWh factor. Updated to official UBA 2025 values (344 g CO₂/kWh generation Scope 2 vs. 410 g CO₂e/kWh lifecycle Scope 3); added mode selection (annual vs. single trip); added clear distinction between direct combustion and well-to-wheel lifecycle.
  - `/rechner/co2-abgabe-vermieter-mieter-rechner/`: Audited against Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG 10-Stufenmodell); clarified building vs. dwelling scope; added invoice value input; added annualized partial-year calculation for under-year tenancy changes; implemented § 9 statutory exemptions (Denkmalschutz / legal hurdles halving landlord share to 50%; district heating mandate setting landlord share to 0%).
  - `/rechner/heizkostenvergleich-rechner/`: Implemented missing district heating (Fernwärme) functionality; added optional maintenance and chimney sweep toggle (`includeMaintenance`); added compatible lifecycle CO₂e emission comparisons based on useful heat delivered.
- [x] Phase 3: New Calculators (in exact order)
  - 1. `/rechner/co2-strom-rechner/` (haushalt category): Supports kWh, billing period (year, month, single), UBA 2025 factor (344 g CO₂/kWh), lifecycle option (410 g CO₂e/kWh), certified green electricity option (25 g CO₂e/kWh), custom factor input, comparison consumption, kg and tonnes output, step-by-step formula breakdown, and reference table (500–3,500 kWh).
  - 2. `/rechner/co2-pendeln-rechner/` (auto category): One-way distance doubled for return trip, actual commuting days, vehicle modes (fleet average 164 g/Pkm, personal car, train ICE 44 g/Pkm, regional train 79 g/Pkm, transit bus 108 g/Pkm, bike/foot 0 g), separate route lengths and commuting days for Scenario A vs. Scenario B (e.g. transit vs. road, homeoffice reduction), and strict adherence to passenger-km methodology (no double division by occupancy).
  - 3. `/rechner/co2-preis-rechner/` (haushalt category):
    - Modus A: Bekannte Emissionsmenge in kg oder Tonnen × frei gewählter Preis je Tonne (z. B. 2.000 kg × 60 €/t = 120,00 €) unter Erhalt der gewählten Preisbasis (kein automatischer MwSt-Aufschlag).
    - Modus B: Brennstoffmenge und EBeV-Standardfaktor (Gas, Heizöl, Benzin, Diesel, LPG) × gesetzlicher BEHG-Preis (2024: 45 €/t, 2025: 55 €/t, 2026: Korridor 55–65 €/t) mit MwSt-Behandlung (19 % brutto vs. netto) und spezifischem Aufschlag (ct/kWh, ct/l).
    - Eindeutige Kennzeichnung: Das Ergebnis ist nur der rechnerische CO₂-Preisbestandteil, NICHT die gesamte Heiz- oder Spritrechnung.
- [x] Phase 4: Supporting Ratgeber Articles & Original SVG Visualizations
  - Generated original SVG `public/images/ratgeber/co2-strom-kwh-berechnung-formel.svg` (kWh × factor → kg CO₂ flow, formula steps, green power comparison).
  - Generated original SVG `public/images/ratgeber/co2-pendeln-verkehrsmittel-vergleich.svg` (commuting comparison chart based on 20 km × 2 × 180 d = 7,200 Pkm, numerical data alternative, homeoffice levers).
  - Generated original SVG `public/images/ratgeber/co2-preis-tonnen-euro-berechnung.svg` (visualizing Modus A and Modus B calculation logic).
  - Published Ratgeber article `/ratgeber/co2-pro-kwh-strom/` with UBA 2025/2026 context, Scope 2 vs. lifecycle boundary clarification, green power lifecycle truth, EnWG § 42 electricity labeling guidance, worked examples, and official citations.
  - Published Ratgeber article `/ratgeber/co2-arbeitsweg-auto-bahn/` with Pkm methodology, carpooling, public transit vs. train comparison, homeoffice levers, worked examples, and UBA TREMOD 2024 citations.
- [x] Phase 5: Test Suites, Quality Verification, Production Build, Git Commit & Push
  - Built comprehensive test suite `src/__tests__/co2-cluster.test.ts` (23 tests) verifying arithmetic fixtures:
    - 2,500 kWh × 344 g/kWh ÷ 1,000 = 860 kg CO₂.
    - 20 km × 2 × 180 d = 7,200 km; 7,200 × 164 g = 1,180.8 kg CO₂e; 7,200 × 44 g = 316.8 kg CO₂e (864 kg CO₂e saved).
    - Modus A: 2,000 kg × 60 €/t = 120,00 €.
    - Modus B: Gas 15,000 kWh × 0.182 kg/kWh = 2,730 kg CO₂; 2.73 t × 55 €/t = 150.15 € net; 178.68 € gross with 19% VAT (1.19 ct/kWh surcharge).
    - Modus B: Heating oil 2,000 l × 2.66 kg/l = 5,320 kg CO₂; 5.32 t × 45 €/t = 239.40 € net; 284.89 € gross.
    - Zero inputs: 0 kWh / 0 km / 0 units return valid 0 result without fallback to default.
    - Stale inputs: blank / negative inputs pause calculations and return validation feedback.
    - Dynamic loader resolves all 6 engines (`loadCalculatorEngine`).
    - Sitemap includes all 6 calculators and 2 articles with truthful lastmod dates.
  - All 40 test suites passing (1,146 tests).
  - Typecheck (`tsc --noEmit`): 0 errors.
  - Linter (`npm run lint`): 0 warnings.
  - Production build (`next build`): 476/476 static pages prerendered successfully.

### Outstanding Questions & Methodological Limitations
1. **Scope 2 vs. Scope 3 Lifecycle**: In accordance with GHG protocol, generation factors (344 g CO₂/kWh) and lifecycle factors (410 g CO₂e/kWh) are presented as distinct scenarios with prominent labels so users never conflate Kraftwerksebene with Well-to-Wheel.
2. **Post-2026 Carbon Pricing (ETS-2)**: The EU Emissions Trading System (ETS-2) for buildings and transport will take effect from 2027 onwards with market-based auctioning. In accordance with guidelines, future auction prices are not presented as known facts; the calculator explicitly labels 2027+ values as variable market scenarios rather than statutory fixed rates.
3. **No Certification Claims**: RechenHafen calculators do not claim official carbon certification or calculate total personal footprints. Scope boundaries are disclosed near every result.

