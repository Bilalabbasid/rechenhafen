# SEO-Forschungsnotizen — RechenHafen.de
## Stand: September 2026

---

> **WICHTIGER HINWEIS:** Diese Notizen dokumentieren qualitative SERP-Signale und öffentlich zugängliche Quelleninformationen. Es wurden **keine** bezahlten SEO-Tools (Ahrefs, SEMrush, Google Keyword Planner) verwendet. Alle Volumen-/KD-/CPC-Angaben in `src/data/seo-map.json` sind mit **NOT VERIFIED** markiert. Vor Budgetentscheidungen oder Priorisierungen bitte mit echten Tool-Daten verifizieren.

---

## 1. Recherchequellen (Sep 2026)

| Quelle | Art | Verlässlichkeit |
|---|---|---|
| Ahrefs Blog (öffentlich) | Publizierter Artikel über deutsche Rechner-Websites | Mittel — zitiert ~1,5 Mio. monatliche Besuche für brutto-netto-rechner.info |
| Google-Suchergebnisse (direkt) | SERP-Beobachtung der ersten Seite | Hoch für aktuelle Ranking-Domänen |
| Google Trends | Relative Popularität (0–100, kein absolutes Volumen) | Hoch für relative Trends |
| SimilarWeb / SEMrush (publizierte Artikel) | Sekundärquellen, keine API | Niedrig — nur Näherungswerte |

---

## 2. SERP-Landschaft: Wichtigste Erkenntnisse

### 2.1 Brutto-Netto-Rechner (KRITISCH — Seite fehlt!)
- **Wer dominiert:** `brutto-netto-rechner.info`, `nettolohn.de`, `finanztip.de`, `bmf-steuerrechner.de`, `gehalt.de`, `lohnsteuer.de`
- **SERP-Typ:** Reine Rechner-Seiten (kein Artikel), teilweise mit Erklärtext
- **Schwierigkeit:** Sehr hoch (YMYL). Die führenden Seiten sind jahrelang etabliert.
- **Differenzierung möglich:** Aktuelle 2026-Steuerdaten, Kirchensteuer-Toggle, alle 6 Steuerklassen, Einzel-/Zusammenveranlagung
- **Empfehlung:** **MUSS** gebaut werden. Ohne diese Seite fehlt RechenHafen.de der wichtigste Einzelterm im deutschen Rechner-Markt.

### 2.2 Kreditrechner / Tilgungsrechner
- **Wer dominiert:** Banken (ING, Deutsche Bank, Sparkasse), Finanzierungsvermittler (Dr. Klein, Interhyp), Vergleichsportale (Check24, Verivox)
- **SERP-Typ:** Rechner + Ratgeberartikel + Produktangebot
- **Schwierigkeit:** Extrem hoch — Seiten mit Affiliate-Budget und hoher Domain-Autorität
- **Differenzierung:** Sondertilgung modellieren, Tilgungsplan als PDF/CSV, transparente Gesamtzinsberechnung ohne Werbung
- **Für Tilgungsrechner wichtig:** Das Schlüsselfeature ist **Sondertilgung** — dieses Feature unterscheidet hochrangige von niedrigrangigen Seiten

### 2.3 BMI-Rechner / Kalorienbedarf
- **Wer dominiert:** Gesetzliche Krankenkassen (AOK, Barmer), Gesundheitsportale (NetDoktor, Gesundheit.de)
- **Schwierigkeit:** Sehr hoch (YMYL). Krankenkassen haben enorme Domain-Autorität.
- **Differenzierung:** Altersangepasste Interpretation, Kinder-Modus, kombinierte Darstellung mit Idealgewicht

### 2.4 MwSt.-Rechner
- **Wer dominiert:** `smart-rechner.de`, Steuerberatungsportale, Lexware, Finanztip
- **Schwierigkeit:** Mittel-hoch — viele kleinere Anbieter, kein absoluter Monopolist
- **Differenzierung:** 19%/7%/individueller Satz, Netto↔Brutto beidseitig, schnelle Mobile-UX

### 2.5 Prozentrechner
- **Wer dominiert:** `smart-rechner.de`, `rechneronline.de`, `matheretter.de`
- **Schwierigkeit:** Mittel — kein starker institutioneller Spieler
- **Differenzierung:** Alle 3 Berechnungsrichtungen in einem Tool, klare Formelerklärung

---

## 3. Bestätigte Kannibalisierungsrisiken

Die folgenden Paare sind echte funktionale Duplikate und sollten konsolidiert oder klar differenziert werden:

| Slug 1 | Slug 2 | Problem | Empfehlung |
|---|---|---|---|
| `sparzielrechner` | `sparziel-rechner` | Sehr ähnlicher Slug, möglicherweise identische Funktion | Prüfen ob tatsächlich doppelt — ggf. 301-Redirect |
| `datumsdifferenz` | `tage-zwischen-zwei-daten` | Keyword-Überschneidung bei "tage zwischen zwei daten" | Inhalte differenzieren oder konsolidieren |
| `geburtstagsrechner` | `tage-bis-geburtstag` | Keyword "tage bis geburtstag" in beiden | Klare Intent-Differenzierung: Geburtstag-Info vs. Countdown |
| `inflationsrechner` | `kaufkraftverlust-rechner` | Fast identische Funktion | Klarere Differenzierung oder Canonical |
| `notgroschen-rechner` | `liquiditaetsreserve-rechner` | Sehr ähnliches Konzept | Differenzieren: Notgroschen = 3 Monatsgehälter-Faustregel, Liquiditätsreserve = individuelle Berechnung |
| `standardabweichung-rechner` | `varianz-standardabweichung-stichprobe-rechner` | Überlappende Keywords | Beide behalten? Dann klar differenzieren: Population vs. Stichprobe |
| `kreisrechner` | `kreis-umfang-rechner` | Umfang-Berechnung in beiden | Kreisrechner = all-in-one; Kreisumfang-Rechner = fokussiert |
| `kreditrechner` | `privatkredit-rechner` | "privatkredit rechner" in beiden | Kreditrechner = allgemein; Privatkredit = klarer abgrenzen |
| `tilgungsrechner` | `baufinanzierung-rechner` | "baufinanzierung rechner" in beiden | Tilgungsrechner = reine Tilgung; Baufinanzierung = vollständige Finanzierungsberechnung |

---

## 4. Fehlende Hochprioritäts-Rechner (SEO-Lücken)

### KRITISCH: Brutto-Netto-Rechner
- **Primäres Keyword:** "brutto netto rechner"
- **Warum KRITISCH:** Meistgesuchter deutscher Finanzrechner. Ohne diese Seite fehlt die wichtigste Einzelseite im deutschen Rechnermarkt komplett.
- **Anforderungen:** 2026 Steuertabellen, alle 6 Steuerklassen, Kirchensteuer, alle Sozialversicherungsarten, Sonderzahlungen
- **Datenquelle:** Regulierte Daten aus `src/data/regulated/2026/index.ts`

### KRITISCH: Lohnsteuerrechner
- **Primäres Keyword:** "lohnsteuerrechner"
- **Verwandter Intent:** Ähnlich wie Brutto-Netto, aber gezielt auf Lohnsteuer-Komponente

### HOCH: Einkommensteuerrechner
- **Primäres Keyword:** "einkommensteuer rechner"
- **Unterschied:** Selbstständige, Kapitalerträge — breiter als Lohnsteuer

### HOCH: Einfacher Zinsrechner
- **Primäres Keyword:** "zinsrechner"
- **Unterschied zu Zinseszinsrechner:** Lineare Zinsen (kein Zinseszins), typisch für Sparkonten und Kurzzeitkredite

### MITTEL: Rentenrechner
- **Primäres Keyword:** "rentenrechner"
- **Konkurrenz:** drv.de dominiert — aber RechenHafen.de könnte Komfort-Tool ohne Amtsbürokratie anbieten

### MITTEL: Pendlerpauschale-Rechner
- **Primäres Keyword:** "pendlerpauschale rechner"
- **Saisonalität:** Hoch zur Steuererklärungszeit (Feb–Mai)
- **2026-Daten:** 0,30 € (bis 20 km), 0,38 € (ab 21. km)

---

## 5. SEO-Strategie-Empfehlungen

### 5.1 Aktualisierte Priorisierungs-Roadmap nach 3-Tier-Modell

#### Tier 1: Quick Wins (Sofortige organische Traktion / Schwache SERP-Konkurrenz)
1. **Kündigungsfrist-Rechner (§ 622 BGB)**: Juristische Seiten bieten nur Text ohne Rechner; interaktiver Fristenrechner bietet sofortigen Mehrwert.
2. **Balkonkraftwerk-Rechner (800 W Stecker-Solar)**: Neutraler Ertrags- und Amortisationsrechner ohne Händler-Upselling oder Vendor-Bias.
3. **Spardauer-Rechner**: Löst das inverse Problem („Wie lange muss ich sparen?“) mit logarithmischer Formel in Echtzeit.
4. **Urlaubsabgeltungs-Rechner (§ 11 BUrlG)**: Exakte Auszahlung verbleibender Urlaubstage bei Jobwechsel/Kündigung.
5. **Skonto-Jahreszins & Kreditvergleich**: B2B/Selbstständigen-Entscheidungslogik (Skonto ziehen vs. Kontokorrent nutzen).

#### Tier 2: Medium Opportunities (Topische Cluster-Autorität & Modernes UX)
6. **Teilzeit-Gehaltsrechner**: Stundenreduzierung (40 h → 32 h) mit Netto-Vergleich und Steuerprogressions-Puffer.
7. **Ballonfinanzierung-Rechner**: Kfz-Kredit mit Schlussrate – 100 % werbefrei und ohne Datenabfrage (Gegenentwurf zu Check24).
8. **Pendlerpauschale-Rechner (2026)**: Berücksichtigung von 0,30 € / 0,38 € ab km 21 und Homeoffice-Pauschale.
9. **Photovoltaik-Amortisationsrechner**: Unabhängiger Dachanlagen-Rechner mit Speicher und realistischer Einspeisevergütung.
10. **Kaufkraftverlust-Rechner**: Reale Restkaufkraft von Ersparnissen unter Berücksichtigung von Tagesgeldzins vs. Inflation.

#### Tier 3: Long-Term Competitive Head Terms (YMYL Säulen mit hoher Autoritätsbarriere)
11. **Zinseszinsrechner**: Interaktive Vermögenswachstum-Visualisierung für ETF- und Sparplan-Anleger.
12. **Tilgungsrechner / Baufinanzierung**: Hypothekendarlehen mit jährlicher Sondertilgung und vollständigem Tilgungsplan-Export.
13. **BMI-Rechner**: Alters- und geschlechtsbereinigter Body-Mass-Index mit WHtR-Ergänzung für Sportler.
14. **Brutto-Netto-Rechner (2026)**: Vollständige 2026-Steuer- und Sozialversicherungsberechnung als zentrales Traffic-Fundament.

### 5.2 Technische SEO-Prioritäten (bereits implementiert laut Vorarbeit)
- ✅ Statisches Rendering (Next.js SSG) — schnelle Core Web Vitals
- ✅ Strukturierte Daten (JSON-LD) — Calculator-Schema
- ✅ Lokalisierung (de-DE) — korrekte DIN-Formatierung
- ✅ Meta-Titles und Descriptions — alle Rechner

### 5.3 Content-Cluster-Strategie
**Empfehlung:** Rechner sollten nicht isoliert stehen. Jede Kategorie-Landingpage sollte als Content-Hub dienen mit:
1. Übersicht aller Rechner der Kategorie
2. Kurze Erklärungen der häufigsten Fachbegriffe
3. Verlinkung zwischen verwandten Rechnern

---

## 6. YMYL-Klassifikation

Google's "Your Money, Your Life" Richtlinien gelten für:
- Alle Finanz- und Steuerrechner (Finanzen, Kredit, Arbeit/Gehalt)
- Alle Gesundheitsrechner (BMI, Kalorienbedarf, Idealgewicht)
- Immobilienrechner

**Konsequenz:** Für YMYL-Seiten gilt: Fehler in Formeln oder veraltete Steuerdaten können das Ranking verschlechtern. Regelmäßige Aktualisierung (jährlich nach Steueränderungen) ist essentiell.

---

## 7. Datenverifizierungsanleitung

Um die NOT VERIFIED-Metriken in `seo-map.json` mit echten Daten zu befüllen:

1. **Google Keyword Planner** (kostenlos mit Google Ads-Konto):
   - Standort: Deutschland
   - Sprache: Deutsch
   - Zeitraum: Letzte 12 Monate

2. **Ahrefs Keywords Explorer** (kostenpflichtig):
   - Database: de (Deutschland)
   - Metriken: Volume, KD, CPC, Parent Topic

3. **SEMrush Keyword Magic Tool** (kostenpflichtig):
   - Database: de_DE
   - Metriken: Volume, KD, CPC, SERP Features

**Datei-Update:** Nach Verifikation die Felder in `scripts/generate-seo-map.ts` im `MANUAL_SIGNALS`-Objekt aktualisieren und das Skript neu ausführen:
```bash
npx tsx scripts/generate-seo-map.ts
```

---

## 8. Ethische Off-Page-SEO-Strategie & Verifizierter Prospecting-Framework

### 8.1 Grundsätze
- Keine PBNs, automatisierte Tools, Foren-Spam, Linkkauf oder manipulierte Einträge.
- Backlinks werden durch **nützliche Datenressourcen (Linkable Assets)**, didaktische Visualisierungen und journalistische Studien verdient.

### 8.2 Verifizierte Prospecting-Matrix (DACH)

| Domain | Relevante Seite / Rubrik | Organisationstyp | Relevantes Asset | Outreach-Grund | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **bildungsserver.de** | `/mathematik/` (Unterrichtsmaterialien) | Staatliches Bildungsportal | Stromkosten-Matrix / Mathe-Tools | Didaktische, werbefreie Online-Rechner für Schulen | Prospect / Uncontacted |
| **vcd.org** | Mobilitätsberatung & Service | Verkehrsclub Deutschland e. V. | Pendler-Kosten-Report 2026 | Unabhängiger Vergleich Pkw vs. ÖPNV vs. Deutschlandticket | Prospect / Uncontacted |
| **verbraucherzentrale.de** | Energie & Stecker-Solar Ratgeber | Verbraucherzentrale Bundesverband | Balkonkraftwerk Amortisationsstudie | Neutrale Amortisationsrechnung ohne Verkaufsdruck | Prospect / Uncontacted |
| **tum.de** | Fachschafts-Wikis & Service-Seiten | Technische Universität München | BGB-Kündigungsfristen / Urlaubsabgeltung | Hilfestellung für Werkstudenten & SHKs | Prospect / Uncontacted |
| **uni-heidelberg.de** | Studierendenwerk / Sozialberatung | Universität Heidelberg | Arbeitsrecht & Nebenjob-Rechner | Fristen und Urlaubsabgeltung bei studentischen Hilfskräften | Prospect / Uncontacted |
| **gruendung.de** | `/finanzen/` Gründer-Ressourcen | Fachportal für Existenzgründer | Skonto-Jahreszins & Stundensatz-Rechner | B2B-Liquiditäts- und Skonto-Entscheidungshilfe | Prospect / Uncontacted |
| **lehrer-online.de** | Mathematik & Wirtschaft | Bildungsportal für digitale Medien | Kaufkraft- & Zinseszins-Visualisierung | Veranschaulichung von Zinseszins und Realzins im Unterricht | Prospect / Uncontacted |
| **mieterbund.de** | Ratgeber Energie & Nebenkosten | Deutscher Mieterbund (DMB) | Stecker-Solar & Haushaltsstrom | Orientierung für Mieter bei Balkonkraftwerken & Stromkosten | Prospect / Uncontacted |
| **dgb-jugend.de** | Portal `Dr. Azubi` | DGB Jugend | Kündigungsfristen & Urlaubsabgeltung | Arbeitsrechtliche Unterstützung junger Beschäftigter | Prospect / Uncontacted |
| **webrechner.de** | Umrechner- & Tool-Verzeichnis | Kuriertes Tool-Verzeichnis | Plattform-Katalog | Gepflegtes Qualitätsverzeichnis für deutsche Web-Tools | Prospect / Uncontacted |

