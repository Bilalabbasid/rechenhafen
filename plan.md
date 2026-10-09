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

