# RechenHafen calculator audit – November 2026

**Status:** Carried out on 5 Nov 2026, at the owner's decision, all at once rather than in the batches of section 9. Two merges were flipped so the stronger URL survives. `cups-in-gramm-rechner` was kept, and two more merges were added: Mietbelastungsquote → Mietbudget and Beton-Mischungsverhältnis → Betonrechner. Exact record: [MERGES-2026-11.md](MERGES-2026-11.md).
**Data:** Google Search Console, Web search, 6 Oct – 2 Nov 2026 (28 days; the sitewide drop happened on 23 Oct, so most impressions come from the 17 days before it).
**Scope:** the 338 live calculators after the 5 Nov retirement of 70 zero-impression calculators.
**Full table:** [`calculator-audit-2026-11.csv`](calculator-audit-2026-11.csv) – one row per calculator with numbers, decision, target and reason.

---

## 1. Result in one table

| Decision | Calculators | What happens |
|---|---:|---|
| **Priority: improve first** | 16 | Already ranking (avg. position ≤ 25) with real impressions. Fastest traffic win. Improve by hand, 4–5 per week. |
| **Keep indexed** | 104 | Real demand (≥ 50 impressions) or hand-verified core. Improve after the priority pages. |
| **Merge** | 48 → into 30 pages | Same search intent as a stronger page. Content is folded into the target, URL 301-redirects. |
| **Retire** | 15 | No traction and little practical value. 301 to the category page. |
| **Keep, noindex** | 155 | Distinct purpose but no proven demand yet. Stays usable, stays out of Google until improved. |
| **Live after the plan** | **275** | Of which ~120 indexed. |

Before 5 Nov: 408 calculators, all indexed. After this plan: 275 live, about 120 in Google's index – each with a reason to be there.

---

## 2. What the data says

1. **Almost every page is thin.** The median calculator has ~180 words of explanation and 5 generic FAQs. Only 8 pages have more than 400 words. This, not the number of calculators alone, is the core quality problem.
2. **The site cannot win head terms yet.** Brutto-Netto, Abfindung, Maut, Spritkosten, Zoll in cm, ETF-Sparplan and similar sit at **average position 55–90**. Established sites own these queries. Do not spend the first months here.
3. **The site *does* rank for niche queries** – at positions 4–10: Schalungssteine, Alkohol verkochen, Dienstjubiläum, Lebenszeit in Stunden, Nudeln roh/gekocht, Erythrit, Ölheizung. This is where traffic comes back first.
4. **Several page-1 rankings get zero clicks.** Ölheizung-Verbrauch (1,847 impressions, position 8.9, **0 clicks**), Gaskosten (1,257, pos. 8.6, 0), Fahrzeit (362, pos. 8.0, 0), ggT (290, pos. 9.8, 0). The title/snippet does not match what people search, or the answer is not visible on the page. Fixing this is cheap and fast.
5. **Clear duplicate-intent groups exist** that the earlier audit kept as "differentiate": four savings calculators, five loan calculators, five appliance-electricity calculators, three triangle calculators, three Rentabilität ratios. Google sees these as competing pages with the same answer.

---

## 3. Priority pages – improve first (16)

| Calculator | Impr. | Clicks | Avg. pos. | Words | Main problem |
|---|---:|---:|---:|---:|---|
| `oelheizung-verbrauch-rechner` | 1,847 | 0 | 8.9 | 287 | Page 1, zero clicks → title/snippet + direct answer ("x Liter pro m²") |
| `zucker-ersatz-rechner` | 1,632 | 4 | 7.9 | 283 | Low CTR; add the Erythrit/Xylit/Stevia conversion table people search for |
| `nudeln-rohmaerk-gewicht-rechner` | 1,432 | 3 | 7.2 | 381 | Low CTR; quick-answer table (100 g roh = x g gekocht) per pasta type |
| `gaskostenrechner` | 1,257 | 0 | 8.6 | 1,298 | Page 1, zero clicks → snippet; content is long but the answer is buried |
| `schalungssteine-rechner` | 455 | 11 | 6.8 | 348 | Best CTR on the site – use as the template for others |
| `wasserverbrauch-haushalt-rechner` | 428 | 0 | 19.2 | 402 | Answer "Liter pro Person/Tag" above the fold |
| `fahrzeit-rechner` | 362 | 0 | 8.0 | 158 | Very thin; zero clicks |
| `kies-splitt-rechner` | 317 | 0 | 21.4 | 303 | Ranks for "splittrechner", "splitt gewicht" – target these words in title/H1 |
| `marmelade-geliermittel-rechner` | 302 | 1 | 6.0 | 173 | Thin; add Gelierzucker 1:1 / 2:1 / 3:1 table |
| `ggt-rechner` | 290 | 0 | 9.8 | 175 | Thin; show the Euclid steps (what pupils search for) |
| `zehnerpotenzen-rechner` | 272 | 1 | 8.5 | 175 | Thin; add prefixes table (Kilo, Mega, Milli …) |
| `alkohol-verkochungs-rechner` | 262 | 11 | 4.5 | 116 | Good CTR but only 116 words – expand with the cooking-time table |
| `promillerechner` | 257 | 0 | 10.9 | 177 | Ranks for math "Promille", but people mostly mean blood alcohol → clarify, link to Widmark |
| `dienstjubilaeum-rechner` | 181 | 11 | 5.1 | 182 | Good CTR; add jubilee table and the tax-free gift link |
| `hybrid-auto-kosten-rechner` | 163 | 6 | 10.6 | 170 | Thin; add comparison example Hybrid vs Benziner |
| `lebenszeit-in-stunden` | 162 | 7 | 4.8 | 187 | Good CTR; add fun milestones table |

**One thing you can do in GSC today:** for each of these 16 pages, open *Performance → Pages → click the page → Queries* and export the queries. That gives the exact wording people use for each page – the most valuable input for rewriting titles, H1s and FAQs. (My query-to-page matching in the CSV is an approximation from the site-wide query list.)

---

## 4. Merge plan (48 pages into 30)

The **target** keeps its URL and gains the source's useful parts (inputs, examples, FAQs). The **source** 301-redirects to the target. Impressions in brackets.

| Target (keeps URL) | Merged into it | Why |
|---|---|---|
| `sparrechner` (33) | `spardauer-rechner`, `sparzielrechner`, `sparrate-rechner` (46) | Same formula, different unknown → one page with "Was möchten Sie berechnen?" |
| `tage-bis-geburtstag` (27) | `geburtstagsrechner` (3) | Same intent |
| `tage-zwischen-zwei-daten` (125) | `wochen-zwischen-daten`, `monate-zwischen-daten`, `countdown-rechner` (49) | Same date difference, different output unit |
| `datum-plus-tage` (17) | `datum-minus-tage` (6) | Same tool, two directions |
| `arbeitstage-rechner` (4) | `werktage-rechner` (0) | Mo–Fr vs Mo–Sa is an option. Update the Werktage Ratgeber article CTA |
| `quadratwurzel-rechner` (100) | `n-te-wurzel-rechner` (4) | Add an n-te-Wurzel option |
| `prozentrechner` (32) | `grundwert-rechner` (2) | Prozentrechner must solve all three unknowns |
| `prozentualer-unterschied-rechner` (25) | `prozentuale-veraenderung` (6) | Users confuse the two; show both side by side |
| `dezimal-in-bruch-rechner` (33) | `bruch-in-dezimal-rechner` (6) | One converter, both directions |
| `binaer-hex-dezimal-umrechner` (84) | `hexadezimal-rechner` (10) | Same conversion |
| `kreisrechner` (124) | `kreis-umfang-rechner` (17) | Circumference is one output |
| `dreieckrechner` (38) | `dreieck-flaeche-rechner`, `dreiecks-hoehen-rechner` (48) | One complete triangle calculator |
| `ratenkreditrechner` (132) | `kreditrechner`, `kreditlaufzeit-rechner`, `gesamtzinsbelastung-rechner`, `modernisierungskredit-rechner`, `ballonfinanzierung-rechner` (46) | Same annuity-loan math |
| `tilgungsrechner` (82) | `baufinanzierung-rechner`, `volltilger-darlehen-rechner`, `kreditrechner-ohne-eigenkapital`, `restschuld-rechner` (44) | Same mortgage annuity; options instead of pages |
| `vorfaelligkeitsentschaedigung-baufinanzierung-rechner` (28) | `vorfaelligkeitsentschaedigung-rechner` (1) | One page with a Ratenkredit/Baufinanzierung switch |
| `brutto-netto-rechner` (401) | `sozialabgaben-rechner` (10) | Sozialabgaben are part of every Brutto-Netto result |
| `einkommensteuerrechner` (25) | `solidaritaetszuschlag-rechner` (3) | Soli is an output of the income-tax calculation |
| `stromkosten-geraete-rechner` (59) | `fernseher-…`, `kuehlschrank-…`, `klimaanlage-stromkosten-rechner`, `standby-kosten-rechner` (67) | Identical formula → device presets |
| `laengen-umrechner` (5) | `meilen-km-umrechner` (0) | Miles are a length unit |
| `kraftstoffverbrauch-rechner` (69) | `kraftstoffverbrauch-umrechner` (8) | Add MPG ↔ l/100 km |
| `dienstwagen-1-prozent-rechner` (76) | `fahrtenbuch-vs-1-prozent-rechner` (2) | Comparison belongs on the Dienstwagen page |
| `spritkostenrechner` (330) | `fahrtkostenrechner` (196) | Same intent. **Largest merge – re-check both pages' GSC queries right before doing it** |
| `umsatzrentabilitaet-rechner` (31) | `eigenkapitalrentabilitaet-rechner`, `gesamtkapitalrentabilitaet-rechner` (13) | One "Rentabilität berechnen" page |
| `puls-trainingszonen-rechner` (41) | `maximalpuls-hfmax-rechner` (41) | HFmax is step 1 of training zones |
| `kalorienbedarf-rechner` (1) | `grundumsatz-bmr-rechner`, `leistungsumsatz-pal-rechner` (59) | The two steps of the same calculation |
| `waist-to-hip-ratio-rechner` (57) | `waist-to-height-ratio-rechner` (24) | One Taillenumfang page |
| `bmi-rechner` (49) | `idealgewicht-creff-rechner` (9) | Idealgewicht next to BMI |
| `essloeffel-teeloeffel-gramm-rechner` (76) | `gramm-in-ml-rechner`, `cups-in-gramm-rechner` (3) | One kitchen-measure converter |
| `zykluslaenge-eisprung-rechner` (172) | `fruchtbare-tage-rechner` (8) | Fertile window is an output |
| `erstausstattung-baby-rechner` (19) | `windelbudget-rechner` (15) | Nappies are one budget line |

**Rule for doing a merge:** first move the useful inputs/outputs into the target and check the math with tests, *then* add the redirect. A merge that only redirects without moving the function loses users.

---

## 5. Retire (15)

All are noindexed already and earned ≤ 5 impressions. Each 301-redirects to its category page.

| Calculator | Reason |
|---|---|
| `bayes-theorem-rechner`, `effektstaerke-cohens-d-rechner`, `chi-quadrat-unabhaengigkeitstest-rechner`, `stichprobengroesse-rechner`, `p-wert-hypothesentest-rechner` | University statistics, no traction, far better tools exist |
| `torus-volumen-rechner`, `vektor-skalarprodukt-rechner` | Exotic / homework niche, 1 impression each |
| `elektrische-ladung-kapazitaet-rechner`, `beleuchtungsstaerke-lux-lumen-rechner` | Physics niche, 1 impression each |
| `frittieroel-temperatur-rauchpunkt-rechner`, `taschengeld-empfehlung-rechner` | A lookup table, not a calculation |
| `lead-conversion-rate-rechner`, `ebit-ebitda-rechner` | Trivial ratio / better as an article |
| `kindersitz-groesse-i-size-rechner` | Manufacturer size tables win this query |
| `betreuungsgeld-familiengeld-rechner` | **Probably outdated** – Betreuungsgeld was abolished in 2015 and Bavaria restructured Familiengeld. Verify the current legal state before deleting; if outdated, it is a liability, not just low value |

**Redirects from the 5 Nov retirement that must be re-pointed** (their target would be removed):

| Old URL | Points to now | Re-point to |
|---|---|---|
| `konfidenzintervall-rechner` | `stichprobengroesse-rechner` | `/statistik-wissenschaft/` |
| `t-test-rechner` | `p-wert-hypothesentest-rechner` | `/statistik-wissenschaft/` |
| `umschuldung-rechner` | `vorfaelligkeitsentschaedigung-rechner` | `vorfaelligkeitsentschaedigung-baufinanzierung-rechner` |

---

## 6. Noindexed pages worth promoting later

These are noindexed but GSC shows real queries for their topic, and some already rank on page 1 for the few impressions they get. Improve them first among the 155:

| Calculator | Page impr. | Matching query impr. | Avg. pos. |
|---|---:|---:|---:|
| `kinderkrankentage-kinderkrankengeld-rechner` | 12 | 115 | 9.2 |
| `stundenlohnrechner` | 33 | 110 | 74.7 |
| `gehaltserhoehung-rechner` | 4 | 51 | 9.8 |
| `arbeitstage-rechner` (after Werktage merge) | 4 | 50 + 63 | 37.5 |
| `dichte-umrechner` | 11 | 34 | 8.4 |

Re-index a page only after it meets the standard in section 8 – then add its slug to `src/data/seo/indexable-calculators.ts`.

---

## 7. Head terms: the long game

These have demand but rank at position 50–90 against strong competitors. Keep them indexed and correct, but do not expect traffic from them in the next months. They benefit indirectly when the site's overall quality signal recovers.

`zoll-in-cm-rechner` (633 impr., pos. 70) · `abfindungsrechner` (476, 89) · `brutto-netto-rechner` (401, 71) · `lkw-maut-deutschland-rechner` (348, 60) · `spritkostenrechner` (330, 56) · `leistung-umrechner` (306, 52) · `autobahn-maut-rechner-vignette` (192, 56) · `gasverbrauch-kwh-m3-rechner` (189, 69) · `zykluslaenge-eisprung-rechner` (172, 71) · `gewicht-masse-umrechner` (169, 54) · `minijob-rechner` (155, 69) · `promillerechner-widmark` (141, 65) · `ratenkreditrechner` (132, 65) · `kinderzuschlag-kiz-rechner` (129, 80) · `kreisrechner` (124, 68) · `schritt-distanz-kalorien-rechner` (121, 51) · `hefe-umrechner` (120, 55) · `betonrechner` (114, 61) · `drehzahl-umfangsgeschwindigkeit-rechner` (113, 56) · `stromkostenrechner` (110, 67) · `etf-sparplan-rechner` (108, 87)

Exception: if a head-term page has a winnable long-tail variant (e.g. "lkw maut pro km", "abfindung fünftelregelung beispiel"), target that variant in an H2 and FAQ – not the head term in the title.

---

## 8. What "improved" means for one page

A page counts as improved only when all of this is true – checked by a person, not generated in bulk:

1. **Direct answer first.** The first screen answers the main query in one sentence and one number (e.g. "Ein Einfamilienhaus mit 150 m² verbraucht etwa 1.800–2.700 Liter Heizöl pro Jahr.").
2. **Title and H1 use the searcher's words** from the page's own GSC queries – not a keyword list. Title ≤ 60 characters, mentions "kostenlos" only where it fits naturally.
3. **Inputs a real user has**, with sensible defaults and plain-language help text. No input that nobody knows the value of without explanation.
4. **The result is explained**: what the number means, what it does not include, and what to do next.
5. **At least two worked examples with real numbers** that differ meaningfully (e.g. Altbau vs Neubau).
6. **One element competitors lack** – a lookup table, a comparison, a chart, a checklist.
7. **Formula and sources**: formula shown, legal values with source and "Stand" date.
8. **FAQs from real queries** (GSC / Google "Ähnliche Fragen"), 3–6 of them, each answered in 2–4 sentences. No generic filler FAQs.
9. **Math tested**: edge cases (0, negative, very large, empty) covered by a unit test.
10. **Native German, written for people.** Read aloud once. Remove phrases like "präzise Formelberechnung und verlässliche Ergebnisse für Ihre Planung".

---

## 9. Rollout schedule (respects the freeze)

The freeze runs until about **3 December 2026** (four weeks after the 5 Nov fixes). Change the site in small, separate batches and check GSC between them.

| When | What | Risk |
|---|---|---|
| Now – 3 Dec | Nothing on the site. Export per-page queries for the 16 priority pages. Verify the Betreuungsgeld/Familiengeld legal state. | – |
| Week of 3 Dec | Retire the 15 + re-point the 3 redirects. Improve priority pages 1–4 (Ölheizung, Gaskosten, Zucker-Ersatz, Nudeln). | Low |
| Week of 10 Dec | Date/time and math merges (small pages). Priority pages 5–8. | Low |
| Week of 17 Dec | Savings and loan merges. Priority pages 9–12. | Medium |
| January | Electricity, health and kitchen merges; Fahrtkosten → Spritkosten last. Priority pages 13–16, then the "Keep indexed" pages by impressions. | Medium |
| From February | Promote improved noindexed pages (section 6) one by one. | Low |

Never more than ~10 page rewrites per week. The 19–21 Oct mass rewrite of ~400 pages is the pattern to avoid.

---

## 10. Limits of this audit

- **No keyword-volume tool was available.** Demand is judged from your own GSC impressions and queries. A page with zero impressions may still have demand that the site simply never ranked for; that is why noindexed pages are kept, not deleted.
- **11 of the 28 days fall after the drop**, so all impressions are lower than the site's real potential. Relative order between pages is still meaningful.
- **Query-to-page matching** in the CSV column `top_queries` is approximate (word matching on the site-wide query list) and contains some mismatches. Use GSC's per-page query view for decisions on single pages.
- Backlinks were not checked (no tool access). None of the merge/retire candidates is likely to have meaningful backlinks on a 6-week-old domain, but check GSC → *Links → Top linked pages* before each batch.
