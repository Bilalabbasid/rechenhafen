# Task: Fix the sitewide SEO, quality and trust problems on rechenhafen.de

You are working in the codebase of **rechenhafen.de**, a German-language calculator site with ~424 calculators (`/rechner/<slug>/`), 17 category hubs, and a `/ratgeber/` section. First detect the framework, routing, and where calculator content lives (config/JSON/MDX/components). Then work through the phases below in order.

## Context: why we're doing this

- Google Search Console shows that impressions collapsed on **every page on the same date**. That points to a **sitewide** signal: a site-level quality or helpfulness reassessment, or a manual action. It is not a page-level bug.
- Crawlability is fine: pages are indexable, server-rendered, canonicalised, and robots.txt allows crawling.
- The problems are **trust signals, templated/mass-produced content, internal contradictions, duplicate-intent pages, and fake/stale metadata**. Google scores these at site level, so the weak pages drag down the strong ones.

## Hard constraints

1. **Keep all calculators.** Only merge pages that answer the *same search intent* (see Phase 2). Everything else stays and gets improved.
2. **Never fabricate.** No invented people, credentials, addresses, reviews, "geprüft von" claims, or dates. Where real data is needed, insert a clearly marked placeholder like `[FILL: ...]` and list it in the final report.
3. **Never fake freshness.** Don't bump dates without a real content change.
4. Don't change URL slugs of pages that are kept. Merged pages get **301** redirects, never 404s.
5. Keep the calculation logic correct. If you touch a formula, add or adjust a unit test with a worked example.
6. All user-facing text stays in **German** (du/Sie: keep the current "Sie").

---

## Phase 0: Inventory (do this first, output a CSV)

Write a script that builds `seo-audit/inventory.csv` with one row per indexable URL. Columns:

- url, slug, category (as defined in data), category shown in breadcrumb, category shown in "Passende Rechner" cards
- title, title length, meta description, description length (flag any cut mid-word or mid-parenthesis)
- H1, H2 list
- visible word count, excluding nav/footer
- count of boilerplate phrases (see Phase 3)
- source URL(s) cited, and whether each is a deep link or just a homepage
- the "geprüft am" date shown on the page
- lastmod in sitemap
- og:image present (y/n)
- JSON-LD types present
- number of internal links in, and out to other calculators

Also produce `seo-audit/boilerplate.csv`. It should list every sentence or phrase of 6+ words that appears on more than 5 calculator pages, with its count.

---

## Phase 1: Legal and trust

### 1.1 Impressum (`/impressum/`)

The current Impressum uses a placeholder address ("Musterstraße 42, 20457 Hamburg") and no real person. A fake Impressum is worse than none.

- Replace it with **real** operator details, using placeholders for me to fill:
  - `[FILL: legal entity or full name]`
  - `[FILL: street + number, postcode, city, country]` (must be a deliverable address, not a P.O. box)
  - `[FILL: contact email]`
  - `[FILL: company register + number, if a company]`
  - `[FILL: VAT ID, if any]`
- §18 Abs. 2 MStV "Verantwortlich für redaktionelle Inhalte": `[FILL: natural person's name]` + address. Must be a real person, not "Redaktion".
- Keep the liability, links and copyright sections, shortened and in plain German.
- Make the Impressum reachable from every page via the footer (already there; keep it).

### 1.2 Über uns (`/ueber-uns/`)

Rewrite it as a real "who runs this and how" page:

- Who operates the site (`[FILL: founder name + 2–3 sentences of real background]`) and why the site exists.
- How calculators are built: formulas taken from primary sources (laws, BMF, DRV, Destatis, DIN norms), unit-tested worked examples, and an annual update cycle for tax/social-insurance values.
- How to report an error (email), plus a public **Korrekturen/Änderungsprotokoll** section or page listing real fixes with dates.
- Add `Organization` JSON-LD (name, url, logo, email, `sameAs: [FILL: real profiles if any]`).

### 1.3 Responsibility on YMYL pages (no fake experts)

Applies to these categories: Steuern & Gehalt, Finanzen, Kredit, Wohnen/Immobilien, Gesundheit & Fitness, Familie & Schwangerschaft, and any legal topic (Unterhalt, Bürgergeld, Kündigung, Mutterschutz, Elterngeld).

- Replace "RechenHafen Redaktion" with `[FILL: real editor/founder name]` linking to `/ueber-uns/`.
- Wording should be "Erstellt und gepflegt von …", **not** "geprüft von Steuerberater …" unless a real professional actually reviewed it.
- Add a short, page-specific disclaimer box on these pages. For example: "Orientierungswert, ersetzt keine Steuerberatung", or "ersetzt keine ärztliche Beratung", or "ersetzt keine Rechtsberatung".

### 1.4 Sources

- Every calculator must cite its **primary source as a deep link** to the exact law paragraph, table or PDF. Examples:
  - gesetze-im-internet.de/estg/__32a.html
  - the BMF Programmablaufplan PDF
  - DRV/BMG pages with the actual rate
- Homepage links like `https://www.bundesfinanzministerium.de` are not acceptable.
- Pages with no real source (e.g. cooking or tea calculators) cite the reference they actually use (e.g. BfR for hygiene claims). Otherwise remove the claim.

### 1.5 "Geprüft am" dates

- Show a per-calculator `reviewedAt` that is only updated when someone actually re-checks values.
- Remove sitewide trust badges that claim things not done per page. Examples:
  - "Geprüft nach § 32a EStG, SGB IV/XI, BUrlG" on the homepage
  - "verlässliche BMF-Standards" on non-tax pages

---

## Phase 2: Duplicate and overlapping intent

For each group below, open both or all pages and decide:

- **Same intent** (a user searching for one would be fully served by the other): merge into the stronger slug (better content / more internal links), 301 the others, and update every internal link to the target.
- **Different intent**: keep all, but make title, H1, intro, examples and FAQ clearly different, and cross-link them with a sentence explaining the difference.

Write every decision with a one-line reason to `seo-audit/duplicates-decisions.md`.

Candidate groups:

- `pythagoras-rechner` / `satz-des-pythagoras-rechner`
- `kreisrechner` / `kreis-umfang-rechner`
- `dreieckrechner` / `dreieck-flaeche-rechner` / `dreiecks-hoehen-rechner`
- `led-ersparnis-rechner` / `led-sparrechner`
- `vorfaelligkeitsentschaedigung-rechner` / `vorfaelligkeitsentschaedigung-baufinanzierung-rechner`
- `minijob-rechner` / `midijob-rechner` / `minijob-midijob-rechner`
- `stundensatz-kalkulation-freiberufler-rechner` / `brutto-stundensatz-freiberufler-rechner`
- `hexadezimal-rechner` / `binaer-hex-dezimal-umrechner`
- `standardabweichung-rechner` / `varianz-standardabweichung-stichprobe-rechner`
- `durchschnittsrechner` / `mittelwert-median-modus-rechner`
- `kreditrechner` / `ratenkreditrechner` / `privatkredit-rechner`
- `abfindungsrechner` / `abfindung-fuenftelregelung-rechner`
- `arbeitgeberkosten-rechner` / `arbeitgeberanteil-sozialversicherung-rechner` / `sozialabgaben-rechner`
- `fruchtbare-tage-rechner` / `zykluslaenge-eisprung-rechner`
- `stromkostenrechner` / `stromkosten-geraete-rechner`
- `elektroauto-ladekosten-rechner` / `e-auto-ladekosten-zuhause-rechner`
- `dienstwagen-1-prozent-rechner` / `firmenwagen-geldwerter-vorteil-rechner`
- `inflationsrechner` / `kaufkraftverlust-rechner`
- `notgroschen-rechner` / `liquiditaetsreserve-rechner`
- `bodenbelag-rechner` / `parkett-laminat-rechner`
- `mwst-rechner` / `umsatzsteuerrechner`
- `renditerechner` / `roi-rechner`
- `kreditlaufzeit-rechner` / `schuldentilgungsdauer-rechner`
- `restschuld-rechner` / `kredit-restschuld-stichtag-rechner`
- `sparrechner` / `sparrate-rechner` / `sparzielrechner` / `spardauer-rechner`
- `tage-zwischen-zwei-daten` / `datumsdifferenz` / `kalendertage-rechner`
- `wochen-zwischen-daten` / `wochenrechner`
- `quadratwurzel-rechner` / `kubikwurzel-rechner` / `n-te-wurzel-rechner`
- `kraftstoffverbrauch-rechner` / `kraftstoffverbrauch-umrechner`
- `promillerechner` / `promillerechner-widmark`: check whether the first is ‰ maths or blood alcohol. If it's blood alcohol, they are duplicates.
- `skontorechner` / `skonto-jahreszins-rechner`: probably different intent; differentiate.
- `dienstjubilaeum-rechner` / `dienstjubilaeum-steuerfrei-rechner`: probably different intent; differentiate.
- `prozentuale-veraenderung` / `prozentualer-unterschied-rechner`: different maths; differentiate clearly.
- `alter-in-tagen` / `alter-in-wochen` / `alter-in-monaten` / `altersrechner`: keep only if each has distinct examples and content. Otherwise merge into `altersrechner` with anchors.

Also scan the full list for any other near-identical slugs or titles and add them.

After merging, the "424 Rechner" counter must reflect the real count. Generate it from data; never hardcode it.

---

## Phase 3: Content quality (the biggest lever)

### 3.1 Remove template boilerplate

Using `boilerplate.csv`, rewrite or remove phrases repeated across pages. Known offenders:

- "mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung" (appears in meta descriptions and cards)
- "Berechnungsmethodik, Annahmen & Verlässlichkeit" and "Rundung nach DIN 1333" blocks on pages where they're irrelevant
- The "Mathematische Formel & Rechenweg" heading on non-maths pages, e.g. tea or cooking. Rename it per page ("So wird gerechnet") or drop it.
- The "Zweck:" line that duplicates the intro sentence verbatim (the same sentence currently appears 2–3 times per page)

Target: no sentence of 6+ words on more than 5 calculator pages, except legal/footer text.

### 3.2 Fix internal contradictions (critical)

For every calculator, compare these against each other: dropdown labels, default values, formula, result text, example(s), body text, and FAQ. All numbers must agree.

Known example on `tee-ziehzeit-temperatur-rechner`:

| Item | Dropdown | Body text |
|---|---|---|
| Herbal tea | 6–8 min | 8–10 min |
| Green tea | 70–80 °C | 60–75 °C |
| Black tea | 90–95 °C | 95–100 °C |

The FAQ also says caffeine dissolves "vollkommen" in 2 minutes; that is unsupported, so remove it or cite a source.

- Write a script that extracts every number+unit from each page's data and flags conflicting ranges for the same entity.
- Fix all flagged items and list them in `seo-audit/contradictions-fixed.md`.

### 3.3 Make each page genuinely useful and unique

Each calculator page should have:

- An H1 matching the main query (e.g. "Brutto-Netto-Rechner 2026") and a 1–2 sentence answer-first intro.
- At least **2 worked examples with realistic German numbers** that match the calculator's actual output (generate them by running the calculator function; don't type them by hand).
- A short "Wann brauchen Sie das?" or common-mistakes section specific to the topic.
- 3–5 FAQs drawn from real search questions for that topic, not generic ones.
- Thin pages (under ~250 words of unique text after de-templating) get expanded to at least 400 unique words, focused on the long-tail questions.
  - Priority: pages that previously had impressions.
- Category labels must be consistent everywhere. Currently "Stundenlohn" shows as "Steuern & Gehalt" in related cards but "Arbeit & Gehalt" on the homepage, and "Zeit Umrechner" appears under "Kochen & Backen". Related-card labels must use each calculator's real category.

### 3.4 Ratgeber

- Each Ratgeber article links to 2–4 matching calculators.
- Each calculator links back to its matching Ratgeber article if one exists.
- Add a real author (Phase 1.3) and a real publish/update date.

---

## Phase 4: Technical SEO

1. **Sitemap**
   - Generate `lastmod` per URL from the real last content change: git commit date of the page's data file, or `reviewedAt`/`updatedAt`. Not build time, not one hardcoded date.
   - Regenerate it on every build.
   - Remove `changefreq` and `priority`; Google ignores them.
   - If over ~500 URLs, split into a sitemap index (calculators, categories, ratgeber, static).
   - Exclude 301'd URLs.
2. **robots.txt**: remove the `Host:` line (Yandex-only). Keep `Disallow: /api/` and the sitemap line.
3. **Meta**
   - Delete the sitewide identical `<meta name="keywords">`.
   - Generate meta descriptions of 140–155 chars that end on a full sentence and never cut mid-parenthesis. Example of the current bug: "…Schwarzen Tee (95 °C, 3 Min."
   - Titles must be unique, ≤ 60 chars, with "| RechenHafen" as the suffix.
4. **Open Graph**: add `og:image` to every calculator page; a per-category default image is fine. Use `og:type` = `website` for calculators and `article` for Ratgeber.
5. **Structured data** (validate all of it with the Rich Results Test logic or schema.org validator):
   - Sitewide: `Organization` and `WebSite`.
   - Every page: `BreadcrumbList`.
   - Calculators: `WebApplication` (`applicationCategory`: "FinanceApplication" / "UtilitiesApplication", `offers.price` 0, `inLanguage` "de").
   - Ratgeber: `Article` with `author` (Person, real name) and `datePublished`/`dateModified`.
   - `FAQPage` only where the FAQ is visible on the page.
6. **Empty ad slots**: hide the "Anzeige / RechenHafen Werbefläche" placeholders until AdSense is live. When ads go live, reserve fixed slot heights to avoid layout shift (CLS).
7. **Redirects**: implement the Phase 2 301s at server/framework level. Update the sitemap and all internal links so nothing internal points at a redirect.
8. **Canonicals**: self-referencing on every page, absolute https, trailing-slash consistent. Verify that query-param variants (e.g. shared calculator states) canonicalise to the clean URL.
9. **Performance**: run Lighthouse (mobile) on the homepage, one calculator per category, and one Ratgeber.
   - Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
   - Fix render-blocking scripts and oversized JS bundles. Each calculator page should only ship its own calculator's JS.
10. **Accessibility basics**: every input has a `<label>`, the result region uses `aria-live="polite"`, and colour contrast meets AA.

---

## Phase 5: Internal linking

- Category hubs get a real 150–300 word intro, a list of all calculators in the category, and links to the 2–3 best Ratgeber articles.
- "Passende Rechner" chooses by **topic relevance** (shared tags/intent), not just same category, and never shows wrong categories.
- Homepage: keep "Häufig gesucht", but drive it from real data (a config list I can edit), not hardcoded.
- No orphan pages: every calculator gets at least 3 internal links from other pages (check with the inventory script).

---

## Phase 6: Verify and report

Re-run the Phase 0 inventory, then write `seo-audit/REPORT.md`. It must contain:

1. Before/after: number of URLs, merged pages + redirect map, pages under 250 unique words, boilerplate phrase counts, contradictions fixed.
2. Every `[FILL: …]` placeholder I need to complete, with file paths.
3. Schema validation results and Lighthouse scores.
4. Anything you were unsure about (formulas, legal values) that a human should check, especially 2026 tax and social-insurance values.

Build the site and run all tests before finishing. Commit in logical steps, one commit per phase.

---

## After deploy (manual steps for me, include them at the end of REPORT.md)

1. GSC → **Security & Manual Actions → Manual actions**. If there's an action (e.g. "scaled content abuse"), fix it, then submit a reconsideration request describing exactly what changed.
2. GSC → Sitemaps: resubmit `sitemap.xml`.
3. GSC → URL Inspection: request indexing for the ~20 most important calculators and every category hub.
4. GSC → Pages: watch "Crawled – currently not indexed" and "Discovered – currently not indexed" weekly.
5. Expect recovery to take weeks; sitewide quality reassessments usually show up around Google's next core update. Don't mass-change URLs again in the meantime.
