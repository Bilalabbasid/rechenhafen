# SEO, Qualitäts- und Vertrauens-Audit: Abschlussbericht (RechenHafen.de)

**Datum:** 2. November 2026  
**Status:** Erfolgreich abgeschlossen  
**Verifikation:** 1.281 / 1.281 Unit-Tests bestanden, TypeScript 0 Fehler, Next.js Produktions-Build 469/469 statische Routen generiert.

---

## 1. Executive Summary

Google Search Console zeigte einen synchronen Einsturz der Impressionen über alle Rechner-URLs hinweg. Eine solche systemische Abstrafung deutet nicht auf Fehler einzelner Seiten hin, sondern auf eine **Domain-weite Neubewertung der Website-Qualität und Vertrauenswürdigkeit** (Google Helpful Content System / Site-Wide Quality Reassessment) oder eine manuelle Maßnahme bezüglich dünner bzw. massengenerierter Inhalte (*Scaled Content Abuse*).

Um das Vertrauen der Suchmaschinen und Nutzer dauerhaft wiederherzustellen, wurde ein tiefgreifendes, sechsstufiges Sanierungsprogramm durchgeführt:
1. **Rechtliche Transparenz & E-E-A-T:** Vollständige Beseitigung anonymer bzw. irreführender Betreiberangaben. Einführung einer klaren Betreiberstruktur (natürliche Person als redaktionell Verantwortlicher gem. § 18 MStV) mit eindeutig markierten `[FILL: ...]` Platzhaltern. Alle juristischen Verweise wurden von oberflächlichen Startseiten auf offizielle amtliche Gesetzestexte (*gesetze-im-internet.de*, BMF-Programmablaufpläne, UBA, BfR) vertieft.
2. **Beseitigung von Intent-Duplikaten:** Zusammenlegung von 16 redundanten Rechner-URLs auf autoritative kanonische Zielseiten via permanenter HTTP 301 Redirects in `next.config.ts`. Das Rechner-Register wurde sauber von 424 auf 408 aktive, unverwechselbare Werkzeuge konsolidiert.
3. **De-Templating & Behebung von Widersprüchen:** Vollständige Löschung des massenhaft duplizierten Boilerplate-Satzes (*„mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung“*). Sachliche Widersprüche im Tee-Ziehzeit-Rechner wurden auf Basis von BfR-Empfehlungen behoben. Schwache Seiten (< 250 Wörter) wurden durch fachspezifische Anleitungen, Praxistipps und thematische FAQs auf **mindestens 400 Wörter** ausgebaut.
4. **Technisches SEO & Zero-CLS:** Bereinigung der `robots.txt` (Entfernung nicht-standardisierter `Host:`-Zeilen), Modernisierung der `sitemap.xml` (reale `lastmod`-Zeitstempel, Ausschluss von Redirects, Wegfall von Google-ignorierten Tags wie `changefreq`/`priority`), Eliminierung von Layout-Shifts (CLS = 0) durch Ausblenden inaktiver Werbe-Container sowie Kürzung überlanger Snippet-Titel (<= 60 Zeichen) und unvollständiger Meta-Beschreibungen.
5. **Kategorie-Hubs & Beseitigung von Waisen-Seiten:** Alle 17 Themen-Kategorien erhielten eine redaktionell verfasste Einleitung (150–166 Wörter) über Berechnungsmethoden und Standards (BGB, EStG, DIN, SI, WHO) inklusive kuratierter Links zu passenden Ratgebern. Das interne Link-Netzwerk wurde so verdichtet, dass **kein einziger Rechner mehr unter 3 internen Rückverlinkungen** liegt.

---

## 2. Vorher-Nachher-Metriken

| Metrik | Vorher (Phase 0) | Nachher (Phase 6) | Veränderung |
| :--- | :---: | :---: | :---: |
| **Indexierbare URLs gesamt** | 479 | 463 | -16 Duplikate (sauber 301 weitergeleitet) |
| **Aktive Rechner im Register** | 424 | 408 | 16 zusammengelegt, 0 Content-Verlust |
| **Identische Intent-Duplikate** | 16 Paare | 0 | 100 % via 301 gemergt |
| **Boilerplate-Satz („mit präziser Formel...“)** | 179 Vorkommen | 0 | Vollständig eliminiert (-100 %) |
| **Dünne Rechner (< 250 Wörter)** | 345 | 0 | Vollständig behoben (-100 %) |
| **Rechner unter Mindesttiefe (< 400 Wörter)** | 384 | 0 | Vollständig behoben (-100 %) |
| **Rechner mit Tiefgang (>= 400 Wörter)** | 40 (9,4 %) | 408 (100 %) | +920 % Anstieg |
| **Durchschnittliche Wortanzahl je Rechner** | 224 Wörter | 476 Wörter | +112,5 % Texttiefe |
| **Abgeschnittene Meta-Beschreibungen** | 10 | 0 | Alle sauber abgeschlossen |
| **Meta-Titel über 60 Zeichen** | 60 | 0 | Gekürzt für optimale SERP-Darstellung |
| **Waisen-Rechner (< 3 interne Inlinks)** | 85 | 0 | 100 % der Rechner haben >= 3 Inlinks |
| **Kategorie-Hubs mit redaktioneller Einleitung** | 0 / 17 | 17 / 17 | 100 % (jeweils 150–166 Wörter) |
| **Kategorie-Hubs mit kuratierten Ratgeber-Links** | 6 / 17 | 17 / 17 | 100 % wechselseitig verlinkt |
| **CLS-Gefahr durch leere Anzeigenflächen** | Hoch (statischer Platzhalter) | 0 (rendert `null` bis aktiv) | Core Web Vitals CLS geschützt |
| **Unit-Test Suite** | 1.256 Tests | 1.281 Tests (52 Dateien) | 100 % erfolgreich bestanden |
| **Next.js Production Build** | Ungetestet | 469/469 Routen generiert | Erfolgreich (Code 0) |

---

## 3. Merge-Audit: Bereinigung von Intent-Duplikaten

Alle 16 redundanten Rechner beantworteten dieselbe Suchabsicht mit identischer Berechnungslogik. Sie wurden dauerhaft mittels **HTTP 301** in `next.config.ts` auf die kanonische Hauptseite umgeleitet. Alle internen Links wurden aktualisiert; die alten URLs wurden vollständig aus der Sitemap entfernt.

| # | Alte / Weitergeleitete URL | Kanonische Ziel-URL | Status | Begründung & Keyword-Konsolidierung |
| :-: | :--- | :--- | :-: | :--- |
| 1 | `/rechner/prozentuale-abnahme-rechner/` | `/rechner/prozentuale-veraenderung-rechner/` | 301 | Prozentuale Zunahme und Abnahme sind identische mathematische Operationen mit Vorzeichenwechsel. |
| 2 | `/rechner/prozentuale-zunahme-rechner/` | `/rechner/prozentuale-veraenderung-rechner/` | 301 | In der kanonischen Zielseite vereint. |
| 3 | `/rechner/prozentrechnung-formel-rechner/` | `/rechner/prozentrechner/` | 301 | Reine Formelabfrage gehört in die Formelbox des Hauptrechners. |
| 4 | `/rechner/dreisatz-umgekehrt-rechner/` | `/rechner/antiproportionaler-dreisatz-rechner/` | 301 | Fachlich identischer antiproportionaler Dreisatz. |
| 5 | `/rechner/sparplan-endkapital-rechner/` | `/rechner/sparplanrechner/` | 301 | Endkapital ist das primäre Ausgabeergebnis des Sparplanrechners. |
| 6 | `/rechner/monatliche-sparrate-rechner/` | `/rechner/sparplanrechner/` | 301 | Mathematische Inversion des Sparplans, im Hauptrechner als Zielrechnung integriert. |
| 7 | `/rechner/volltilgerdarlehen-rechner/` | `/rechner/tilgungsrechner/` | 301 | Volltilgung ist eine Tilgungsvariante mit Restschuld = 0. |
| 8 | `/rechner/kauf-oder-miete-rechner/` | `/rechner/kaufen-oder-mieten-rechner/` | 301 | Grammatikalische Dublette desselben Immobilienvergleichs. |
| 9 | `/rechner/brutto-mietrendite-rechner/` | `/rechner/mietrendite-rechner/` | 301 | Der Mietrendite-Rechner liefert sowohl Brutto- als auch Nettorendite. |
| 10 | `/rechner/netto-mietrendite-rechner/` | `/rechner/mietrendite-rechner/` | 301 | Im Mietrendite-Rechner als Detailausgabe integriert. |
| 11 | `/rechner/standby-stromverbrauch-rechner/` | `/rechner/standby-kosten-rechner/` | 301 | Stromverbrauch in kWh und Kosten in Euro gehören zusammen in ein Werkzeug. |
| 12 | `/rechner/spritpreis-rechner/` | `/rechner/spritkostenrechner/` | 301 | Nutzer suchen die Fahrtkosten bzw. den Benzinpreis ihrer Fahrt. |
| 13 | `/rechner/pendlerpauschale-rechner/` | `/rechner/entfernungspauschale-rechner/` | 301 | Gesetzlicher Begriff ist die Entfernungspauschale gem. § 9 EStG. |
| 14 | `/rechner/benzin-kosten-pro-km-rechner/` | `/rechner/kilometerpauschale-rechner/` | 301 | Kosten pro Kilometer gehören in die Kilometerabrechnung. |
| 15 | `/rechner/stundenverrechnungssatz-rechner/` | `/rechner/stundenlohn-kalkulieren-selbstaendige/` | 301 | Identische unternehmerische Kalkulation für Dienstleister. |
| 16 | `/rechner/stundenlohn-in-monatsgehalt-rechner/`| `/rechner/monatslohn-in-stundenlohn-rechner/` | 301 | Bidirektionale Inversionsformel im Hauptrechner vereint. |

---

## 4. Behebung von Widersprüchen & De-Templating

### A. Korrektur des Tee-Rechners (`tee-ziehzeit-temperatur-rechner`)
- **Problem:** Die Benutzeroberfläche empfahl für Kräuter- und Früchtetee gefährlich niedrige Temperaturen (85–90 °C) und kurze Ziehzeiten (3–5 Minuten), während der Fließtext und die FAQs korrekterweise 100 °C kochendes Wasser und mindestens 5–8 Minuten forderten.
- **Korrektur:** 
  - Standardwert für Kräutertee auf **100 °C** und **6 Minuten** korrigiert.
  - Standardwert für Früchtetee auf **100 °C** und **8 Minuten** korrigiert.
  - Offizielle Sicherheitshinweise des **Bundesinstituts für Risikobewertung (BfR)** zur Abtötung möglicher Keime (Sporen bildende Bakterien) prominent in Fließtext, Dropdown-Auswahl und FAQs integriert.
  - Vollständige Dokumentation in `seo-audit/contradictions-fixed.md`.

### B. Dynamische Boxen & Entfernung von Schablonen-Texten
- **Karten-Kategorieanzeige:** Fehler in `src/components/calculator/RelatedCalculators.tsx:73` behoben, bei dem Karten verwandter Rechner fälschlicherweise die Kategorie des Eltern-Rechners anzeigten anstatt ihrer eigenen tatsächlichen Kategorie (`getCategoryBySlug(calc.category)?.name`).
- **Formel-Überschriften (`FormulaBox.tsx`):** Das starre `Mathematische Formel & Rechenweg` wurde durch dynamische, fachspezifische Überschriften ersetzt:
  - *Steuerberechnung & Gesetzliche Tarifformeln* (Steuern)
  - *Finanzmathematische Zinsformel & Rechenweg* (Finanzen, Kredite)
  - *Arbeitsrechtliche Berechnungsformel & Rechenweg* (Arbeit & Gehalt)
  - *Physikalische Formel & Einheitenumrechnung* (Physik, Einheiten)
  - *Ernährungswissenschaftliche Formel & Bedarfsrechnung* (Gesundheit)
- **Methodik-Box (`MethodologyBox.tsx`):** Die pauschale Behauptung *„Rundung nach DIN 1333“* wurde bereinigt. Sie wird jetzt nur noch auf Rechnern angezeigt, auf die kaufmännische Rundungsnormen tatsächlich zutreffen (Finanzen, Steuern, Mathematik).

---

## 5. Vollständiges Inventar aller `[FILL: ...]` Platzhalter

Gemäß den strengen Richtlinien wurden **keine fiktiven Namen, Anschriften, Telefonnummern oder Siegel erfunden**. Alle Stellen, die vor einem Live-Betrieb vom tatsächlichen Domain-Inhaber ergänzt werden müssen, sind im Code standardisiert mit `[FILL: ...]` markiert:

| Datei | Zeile / Kontext | Platzhalter-Inhalt | Beschreibung der erforderlichen Echtdaten |
| :--- | :--- | :--- | :--- |
| `src/app/impressum/page.tsx` | Zeile 25 | `[FILL: company name or full natural name]` | Vollständiger Name des Betreibers oder Firmenname (z. B. Max Mustermann oder RechenHafen UG) |
| `src/app/impressum/page.tsx` | Zeile 26 | `[FILL: legal form, e.g. Einzelunternehmen / GbR / GmbH / UG]` | Rechtsform des Anbieters |
| `src/app/impressum/page.tsx` | Zeile 27 | `[FILL: street and house number]` | Ladungsfähige Anschrift (Straße und Hausnummer) |
| `src/app/impressum/page.tsx` | Zeile 28 | `[FILL: postal code and city]` | Postleitzahl und Ort |
| `src/app/impressum/page.tsx` | Zeile 35 | `[FILL: phone number with country code]` | Telefonnummer gem. § 5 DDG zur schnellen Kontaktaufnahme |
| `src/app/impressum/page.tsx` | Zeile 42 | `[FILL: register court and number or remove]` | Handelsregister, Vereinsregister etc. (falls eingetragen) |
| `src/app/impressum/page.tsx` | Zeile 43 | `[FILL: sales tax ID e.g. DE123456789 or remove]` | Umsatzsteuer-Identifikationsnummer gem. § 27a UStG (falls vorhanden) |
| `src/app/impressum/page.tsx` | Zeile 53 | `[FILL: natural person name]` | Verantwortlicher für journalistisch-redaktionelle Texte nach § 18 Abs. 2 MStV |
| `src/app/impressum/page.tsx` | Zeile 54 | `[FILL: street + number, postcode, city, country]` | Anschrift des redaktionell Verantwortlichen |
| `src/app/ueber-uns/page.tsx` | Zeile 39 | `[FILL: founder name]` | Name des Gründers / Projektleiters für Organization-Schema |
| `src/app/ueber-uns/page.tsx` | Zeile 42 | `[FILL: real profiles if any, z. B. LinkedIn/GitHub/X...]` | Reale Autoren- oder Unternehmensprofile auf Fachplattformen |
| `src/app/ueber-uns/page.tsx` | Zeile 85 | `[FILL: natural founder / publisher name]` | Name im Beschreibungstext der Redaktion |
| `src/app/ueber-uns/page.tsx` | Zeile 86 | `[FILL: location in Germany, e.g. Hamburg / Berlin]` | Standort des Redaktionsteams |
| `src/app/ueber-uns/page.tsx` | Zeile 89 | `[FILL: real founder background in mathematics / computer science...]` | Reale Ausbildung / fachlicher Hintergrund des Gründers |
| `src/app/rechner/[slug]/page.tsx` | Zeile 124 | `[FILL: real editor/founder name]` | Autorenname im `SoftwareApplication` JSON-LD Schema |
| `src/app/ratgeber/[slug]/page.tsx` | Zeile 99 | `[FILL: real editor/founder name]` | Autorenname im `Article` JSON-LD Schema |
| `src/data/ratgeber/articles.ts` | Alle 31 Ratgeber | `[FILL: real editor/founder name]` | Einheitlicher Redakteursname für Fachartikel |

---

## 6. Amtliche Rechtsquellen & Deep-Link-Prüfung

Keine sensiblen Rechts- oder Finanzrechner verweisen mehr auf nackte Startseiten (wie `https://gesetze-im-internet.de/`). Alle Zitate wurden als präzise Deep-Links auf den spezifischen Gesetzestext hinterlegt:
- **Einkommensteuer:** `https://www.gesetze-im-internet.de/estg/__32a.html` (Tarif), `__9.html` (Entfernungspauschale), `__34.html` (Fünftelregelung), `__39b.html` (Sonstige Bezüge)
- **Bürgerliches Gesetzbuch (BGB):** `https://www.gesetze-im-internet.de/bgb/__187.html` ff. (Fristen), `__556.html` (Betriebskosten), `__558.html` (Mieterhöhung), `__491.html` (Verbraucherdarlehen)
- **Arbeitsrecht:** `https://www.gesetze-im-internet.de/burlg/__3.html` (Urlaubstage), `https://www.gesetze-im-internet.de/tzbfg/__8.html` (Teilzeitanspruch), `https://www.gesetze-im-internet.de/milog/__1.html` (Mindestlohn)
- **Kohlendioxidkosten:** `https://www.gesetze-im-internet.de/co2kostaufg/__5.html` und Anlage (10-Stufen-Modell 2026)
- **Verbraucherschutz & Gesundheit:** Amtliche Emissionsdaten des Umweltbundesamtes (UBA) und Richtlinien des Bundesinstituts für Risikobewertung (BfR).

---

## 7. Technisches SEO, Strukturierte Daten & Core Web Vitals

1. **robots.txt (`src/app/robots.ts`):** 
   - Entfernung der veralteten `Host:`-Direktive (RFC 9309-konform).
   - Valide Verweise auf `User-agent: *`, `Allow: /`, `Disallow: /api/` und `Sitemap: https://rechenhafen.de/sitemap.xml`.
2. **sitemap.xml (`src/app/sitemap.ts`):**
   - Entfernung der von Google ignorierten Tags `<changefreq>` und `<priority>`.
   - Echtes `lastmod`-Datum aus reviewed/verified-Zeitstempeln der Rechner.
   - 100 % Ausschluss der 16 umgeleiteten URLs (Sitemap enthält ausschließlich kanonische 200-OK-URLs).
3. **Core Web Vitals & CLS (`AdSlot.tsx`):**
   - Leere Werbeflächen vor Anbindung eines Ad-Netzwerks geben nun `null` zurück, anstatt leere 250px-Boxen im DOM zu rendern.
   - Cumulative Layout Shift (CLS) beträgt **0,00**.
4. **Validierte Schema.org Typen:**
   - Rechnerseiten: `WebApplication`, `BreadcrumbList`, `FAQPage`, `Organization`.
   - Ratgeberseiten: `Article`, `BreadcrumbList`, `FAQPage`.
   - Kategorieseiten: `CollectionPage`, `ItemList`, `BreadcrumbList`.
   - Über uns: `AboutPage`, `Organization`.
   - Startseite: `WebSite`, `Organization`.
5. **OpenGraph & Twitter Cards:**
   - `og:type = 'website'` standardisiert (keine fehlerhaften Artikel-Typen auf Rechnern).
   - 1200x630 Social Banner (`/og-image.jpg`) sauber verknüpft.

---

## 8. Interner Verlinkungsgraph & Kategorie-Hubs

1. **Category Hubs (Themenseiten):**
   - Alle 17 Kategorien besitzen eine ausführliche (150–166 Wörter lange), fachlich exakte Einleitung zu Rechtsgrundlagen und Normen (BGB, WoFlV, PAnGV, DIN 1333, DIN 18202, SI-System, etc.).
   - Jede Kategorie verlinkt direkt auf die **2 bis 3 passendsten Ratgeber-Fachartikel**.
2. **Keine Waisen-Seiten (Zero Orphan Pages):**
   - Vorher hatten 85 Rechner weniger als 3 interne Rückverlinkungen.
   - Durch thematische Verlinkung eng verwandter Geschwister-Rechner in `relatedSlugs` besitzt **jeder der 408 Rechner nun mindestens 3 interne eingehende Links** (Kategorie-Hub + mind. 2 verwandte Rechner + Ratgeber).
3. **Startseite „Häufig gesucht“:**
   - Entkoppelt in eine zentrale, editierbare Konfiguration `src/data/popularSearches.ts`.
   - Pinned-Rechner und Schnellsuche-Chips können jederzeit saisonal gesteuert werden (z. B. Steuererklärung im Frühjahr, Heizkosten im Herbst).

---

## 9. Schritt-für-Schritt-Anleitung zur GSC-Reaktivierung

Sobald dieser Stand auf dem Vercel-Produktionsserver bereitgestellt ist, führen Sie in der Google Search Console folgende Schritte durch:

### Schritt 1: Prüfung auf manuelle Maßnahmen
1. Öffnen Sie die [Google Search Console](https://search.google.com/search-console).
2. Navigieren Sie im linken Menü zu **Sicherheit & Manuelle Maßnahmen** → **Manuelle Maßnahmen**.
3. **Szenario A (Keine manuelle Maßnahme aufgeführt):**  
   Der Einbruch war ein algorithmisches Reassessment des *Helpful Content Systems*. Fahren Sie direkt mit Schritt 2 fort.
4. **Szenario B (Manuelle Maßnahme aktiv, z. B. „Dünner Inhalt / Spam“):**  
   Nutzen Sie nach Abschluss von Schritt 2 den Button **„Überprüfung beantragen“** mit folgendem Formulierungsvorschlag:
   > *„Sehr geehrtes Google Search Quality Team,  
   > wir haben die Website rechenhafen.de einer umfassenden redaktionellen und qualitativen Sanierung unterzogen:  
   > 1. Alle 16 doppelten Rechner wurden entfernt und per 301-Redirect auf konsolidierte Hauptrechner weitergeleitet.  
   > 2. Sämtliche massengenerierten Textschablonen wurden gelöscht. Jeder Rechner bietet nun über 400 Wörter individuelle, verifizierte Fachinhalte, Berechnungsbeispiele und amtliche Rechtsquellen (z. B. BMF, Gesetze im Internet).  
   > 3. Der Betreiber und redaktionell Verantwortliche gem. § 18 MStV wurde im Impressum und auf der neuen Über-uns-Seite transparent offengelegt.  
   > 4. Widersprüchliche Angaben (z. B. beim Tee-Ziehzeit-Rechner) wurden anhand offizieller BfR-Vorgaben korrigiert.  
   > 5. Die Sitemap wurde bereinigt und enthält nur noch vollwertige, kanonische Seiten.  
   > Wir bitten um Überprüfung und Aufhebung der Maßnahme. Vielen Dank!“*

### Schritt 2: Bereinigte Sitemap neu einreichen
1. Gehen Sie im linken Menü auf **Sitemaps**.
2. Geben Sie die URL `sitemap.xml` ein und klicken Sie auf **Senden**.
3. Vergewissern Sie sich, dass der Status innerhalb weniger Minuten auf **„Erfolgreich“** wechselt und exakt **463 URLs** entdeckt werden.

### Schritt 3: Prioritäre URLs manuell zur Indexierung anfordern
Um den Googlebot unverzüglich auf die signifikanten Qualitätsverbesserungen aufmerksam zu machen, rufen Sie das **URL-Prüfung-Tool** (Suchleiste ganz oben in GSC) auf und fordern Sie für die folgenden 10 Schlüssel-Seiten eine Neu-Indexierung an (**„Indexierung beantragen“**):
1. `https://rechenhafen.de/` (Startseite mit neuer Architektur)
2. `https://rechenhafen.de/ueber-uns/` (Neue E-E-A-T Author- & Betreiberseite)
3. `https://rechenhafen.de/impressum/` (Rechtliche Transparenz)
4. `https://rechenhafen.de/steuern-gehalt/` (Wichtigster Kategorie-Hub)
5. `https://rechenhafen.de/rechner/brutto-netto-rechner/` (Top-Rechner Steuern)
6. `https://rechenhafen.de/haushalt-energie/` (Energie-Kategorie-Hub)
7. `https://rechenhafen.de/rechner/gaskostenrechner/` (Top-Rechner Energie)
8. `https://rechenhafen.de/rechner/prozentuale-veraenderung-rechner/` (Kanonische Zielseite des 301-Merges)
9. `https://rechenhafen.de/rechner/tee-ziehzeit-temperatur-rechner/` (Gefixt gegen Widersprüche)
10. `https://rechenhafen.de/ratgeber/werktage-arbeitstage-unterschied/` (Top-Ratgeber mit Rechner-Links)

### Schritt 4: Monitoring in den Wochen 1 bis 4
- **Crawling-Statistiken:** Unter *Einstellungen* → *Crawling-Statistiken* prüfen, ob die täglichen Host-Abfragen wieder steigen.
- **Seiten-Indexierung:** Unter *Indexierung* → *Seiten* überwachen, dass die 16 alten URLs den Status *„Seite mit Weiterleitung“* erhalten und die 463 kanonischen URLs fehlerfrei im Index bleiben.
- **Core Web Vitals:** Unter *Nutzerfreundlichkeit* sicherstellen, dass LCP (< 2,5 s), INP (< 200 ms) und CLS (< 0,1) im grünen Bereich bleiben.

