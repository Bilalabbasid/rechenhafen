# RechenHafen.de Evidence-Based Quality Fixes Plan

## 1. Raw Markdown Visible to Visitors (Section A)
- **Issue:** Calculator long-form prose and content sections contain literal raw Markdown syntax (such as `**bold**`, backticks, bullet `- `, numbered steps `1. `) due to limited parser handling in `renderFormattedText` in `src/app/rechner/[slug]/page.tsx` and `src/components/calculator/FaqAccordion.tsx`.
- **Affected URLs / Components:**
  - `/rechner/gaskostenrechner/`
  - `/rechner/dienstfahrrad-jobrad-rechner/`
  - `src/app/rechner/[slug]/page.tsx`
  - `src/components/calculator/FaqAccordion.tsx`
  - `src/components/calculator/FormulaBox.tsx`
  - Shared content rendering components
- **Exact Fix:**
  - Create a robust, safe formatting renderer component (`FormattedContent` / `renderFormattedContent` & `renderInlineMarkdown`) that converts markdown formatting without unsafe HTML injection:
    - Bold `**text**` → `<strong>`
    - Bullets `- `, `• ` → `<ul><li>`
    - Numbered steps `1. `, `2. ` → `<ol><li>`
    - Inline code / formula backticks `` `code` `` → `<code className="...">`
    - Links `[label](href)` → `<Link href="...">`
    - Markdown tables `| ... |` → `<table>`
    - Preserve paragraphs without lumping text into monolithic blocks
  - Add automated test / audit verifying no raw Markdown tokens (`**`, unparsed backticks, unparsed list bullets) leak to visible DOM in calculator pages.
- **Tests to Run:** Unit tests for markdown rendering, plus automated audit test across all calculator contents.
- **Result:** [Pending]

## 2. Correct JobRad / Dienstrad Legal Explanation (Section B)
- **Issue:** Explanatory text describes the 0.25% taxable benefit sequence incorrectly (rounding gross retail price to 100 € first and then quartering). Official BMF guidance specifies: quarter the UVP first, round that quarter DOWN to full 100 €, then take 1% per month.
- **Affected URLs / Components:**
  - `/rechner/dienstfahrrad-jobrad-rechner/`
  - `src/data/calculators/extra/autoArbeit.ts`
  - Explanations, formula description, FAQ, tooltips, examples, methodology metadata.
- **Exact Fix:**
  - Update all explanations to describe the exact sequence: (1) Gross UVP, (2) divide by 4, (3) round down to full 100 €, (4) 1% per month.
  - Clarify that fast e-bikes/S-Pedelecs (>25 km/h) are treated differently under motor vehicle rules (0.5% rule) and individual leasing/employment contracts differ.
  - State independence from JobRad GmbH clearly.
  - Link official BMF guidance: `https://amtliche-handbuecher.bundesfinanzministerium.de/lsth/2025/B-Anhaenge/Anhang-24/IV/IV-4/inhalt.html`.
  - Add unit tests verifying €3,500 → €8 taxable monthly benefit, rounding after quartering, zero employer subsidy, positive subsidy, missing/zero insurance.
- **Tests to Run:** Vitest tests in `src/__tests__/dienstfahrrad-jobrad.test.ts`.
- **Result:** [Pending]

## 3. Gas Cost Results & Copy Consistency (Section C)
- **Issue:** Inconsistent terminology on `/rechner/gaskostenrechner/` claiming "monatlicher Abschlag" instead of "rechnerischer Monatsdurchschnitt" / "Orientierungswert pro Monat". Need to ensure 0 € work price and 0 € base charge return 0 € without restoring defaults.
- **Affected URLs / Components:**
  - `/rechner/gaskostenrechner/`
  - `src/data/calculators/haushalt.ts`
  - `src/lib/calculators/haushalt.ts`
- **Exact Fix:**
  - Replace "monatlicher Abschlag" across intro, sections, worked examples with "rechnerischer Monatsdurchschnitt" or "Orientierungswert pro Monat".
  - Result card note: "Der Wert ist Jahreskosten ÷ 12. Ihr tatsächlicher Versorgerabschlag kann abweichen."
  - Examples updated to "ca. 93,33 € pro Monat (rechnerischer Durchschnitt)".
  - Verify 0 € work price and 0 € base charge calculate correctly to 0 € and are not treated as empty.
  - Add unit tests for 1,000 kWh × 0 € + 0 € = 0 €/year, 14,000 kWh × 0.105 € + 12 × 12 € = 1,614 €/year, and m³ formula `kWh = m³ × Brennwert × Zustandszahl`.
- **Tests to Run:** Vitest tests in `src/__tests__/gaskostenrechner.test.ts`.
- **Result:** [Pending]

## 4. Upgrade Schalungssteine Rechner (Section D)
- **Issue:** Calculator needs practical construction planning capabilities for search intent: wall types, openings, block breakdown, concrete volume, separate waste reserve, and prominent safety disclaimer.
- **Affected URLs / Components:**
  - `/rechner/schalungssteine-rechner/`
  - `src/data/calculators/extra/bauenGeometrie.ts`
- **Exact Fix:**
  - Add wall types: straight wall, L-shaped wall, U-shaped wall, closed rectangle/pool wall.
  - Add optional opening dimensions: width and height in m.
  - Clearly separate results: standard blocks, corner/end blocks, layers/courses (Anzahl Steinlagen), concrete fill volume (m³), and waste reserve.
  - Distinguish manufacturer dimensions from defaults.
  - Add prominent disclaimer: "Der Rechner ermittelt Materialmengen. Er ersetzt keine Statik, Bewehrungsplanung oder Herstellervorgaben."
  - Add calculation tests for straight wall, L-shape, opening, and zero waste.
- **Tests to Run:** Vitest tests in `src/__tests__/schalungssteine.test.ts`.
- **Result:** [Pending]

## 5. Global Quality Gate & Audit Report (Section E)
- **Issue:** Need reusable audit script covering 400+ calculators for raw markdown, 0-fallback inputs, missing "Beispielwert" labels, missing Stand/sources for financial/legal calculators, metadata mismatches, broken links, canonical/sitemap issues, duplicate calculators.
- **Affected URLs / Components:**
  - Audit script `scripts/audit-calculators.ts`
  - `AUDIT_REPORT.md`
- **Exact Fix:**
  - Implement comprehensive audit script reporting issues categorized as Critical, High, Medium, Informational.
  - Generate machine-readable JSON and human-readable `AUDIT_REPORT.md`.
- **Tests to Run:** Run audit script via tsx.
- **Result:** [Pending]

## 6. Verification & Production Build
- Run lint, typecheck, vitest tests, next build.
- Perform browser verification on 4 priority pages:
  - `/rechner/gaskostenrechner/`
  - `/rechner/dienstfahrrad-jobrad-rechner/`
  - `/rechner/schalungssteine-rechner/`
  - `/rechner/kapitalertragsteuer-rechner/`
- Commit and push to repository.
