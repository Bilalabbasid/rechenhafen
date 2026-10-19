# RechenHafen Calculator Quality & Improvement Master Plan (400-Calculator Program)

**Datum:** 19. Oktober 2026  
**Gesamtbestand im Repository:** 421 Rechner (eindeutige, aktive Rechner-Seiten)  
**Erste Prioritäts-Rechner (Batch 0 / Baseline Regression):** 10 Rechner (bereits auditiert & implementiert)  
**In Batches organisierte Rechner:** 400 Rechner (8 Batches à 50 Rechner)  
**Backlog:** 11 Rechner (höhere Statistik & wissenschaftliche Spezialtests)  
**Manifest-Datei:** `calculator-improvement-manifest.json` (maschinenlesbarer Status für sitzungsübergreifenden Fortschritt)

---

## 1. Master-Inventar und Bestandsvalidierung

Das Inventar wurde direkt aus der kanonischen Rechner-Registry (`ALL_CALCULATORS` in `src/data/calculators/index.ts`) und dem statischen Page-Router (`src/app/rechner/[slug]/page.tsx`) extrahiert.

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
  1. **Evidenzbasierte Audit-Befunde:** Konkrete Korrekturbedarfe aus `audit-report.json` / `AUDIT_REPORT.md` (z. B. 15 High-Confidence-Befunde bei Zinseszins, Tilgung, Quadratmeterpreis, Stromkosten, Solidaritätszuschlag, Sozialabgaben, Spekulationssteuer, Mietstaffeln, Mauersteinen etc.).
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

$$\text{queued} \longrightarrow \text{audited} \longrightarrow \begin{cases} \text{fix required} \\ \text{no fix required} \end{cases} \longrightarrow \text{implemented} \longrightarrow \text{locally verified} \longrightarrow \begin{cases} \text{deployed verified} \\ \text{deployment unverified} \end{cases}$$

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

Diese 10 Rechner wurden im Vorfeld auditiert und überarbeitet. Sie sind aus der neuen 400er-Warteschlange ausgeschlossen, dienen aber als **ständige Regressions-Baseline** bei Änderungen an geteilten Komponenten (`CalculatorRunner.tsx`, `FormattedContent.tsx`, `FormulaBox.tsx`, `MethodologyBox.tsx` etc.).

| Nr. | Slug | Name | Kategorie | Status | Regressions-Testdatei |
|:---:|:---|:---|:---|:---:|:---|
| 0.1 | `wasserverbrauch-haushalt-rechner` | Wasserverbrauch-Rechner für Haushalte | haushalt-energie | implemented / locally verified | `src/__tests__/wasserverbrauch-haushalt-rechner.test.ts` |
| 0.2 | `kies-splitt-rechner` | Kies- & Splitt-Rechner | bauen-renovieren | implemented / locally verified | `src/__tests__/kies-splitt-rechner.test.ts` |
| 0.3 | `schalungssteine-rechner` | Schalungssteine Rechner | bauen-renovieren | implemented / locally verified | `src/__tests__/schalungssteine.test.ts` |
| 0.4 | `nudeln-rohmaerk-gewicht-rechner` | Nudeln umrechnen: trocken & gekocht | kochen-backen | implemented / locally verified | `src/__tests__/nudeln-rechner.test.ts` |
| 0.5 | `wasser-reis-verhaeltnis-rechner` | Reiskoch-Rechner | kochen-backen | implemented / locally verified | `src/__tests__/reis-rechner.test.ts` |
| 0.6 | `hybrid-auto-kosten-rechner` | Plug-in-Hybrid-Rechner | auto-verkehr | audited / baseline | `src/__tests__/priority-calculators-review.test.ts` |
| 0.7 | `co2-auto-rechner` | CO2-Rechner für Autofahrten | auto-verkehr | audited / baseline | `src/__tests__/priority-calculators-review.test.ts` |
| 0.8 | `eiweiss-eigelb-ersatz-rechner` | Ei-Ersatz-Rechner | kochen-backen | audited / baseline | `src/__tests__/priority-calculators-review.test.ts` |
| 0.9 | `waschmaschine-kosten-rechner` | Waschmaschinen Kosten-Rechner | haushalt-energie | audited / baseline | `src/__tests__/priority-calculators-review.test.ts` |
| 0.10 | `spuelmaschine-kosten-rechner` | Spülmaschinen Kosten-Rechner | haushalt-energie | audited / baseline | `src/__tests__/priority-calculators-review.test.ts` |

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

## 6.1 Batch 1: Steuern, Gehalt & Arbeitsrecht (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 1.1 | [`brutto-netto-rechner`](https://rechenhafen.de/rechner/brutto-netto-rechner/) | Brutto-Netto-Rechner (Gehaltsrechner Deutschland) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 3 Info |
| 1.2 | [`netto-brutto-rechner`](https://rechenhafen.de/rechner/netto-brutto-rechner/) | Netto-Brutto-Rechner (Wunsch-Netto in Brutto umrechnen) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.3 | [`einkommensteuerrechner`](https://rechenhafen.de/rechner/einkommensteuerrechner/) | Einkommensteuerrechner (§ 32a EStG Deutschland) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.4 | [`grenzsteuersatz-rechner`](https://rechenhafen.de/rechner/grenzsteuersatz-rechner/) | Grenzsteuersatz & Durchschnittssteuersatz Rechner | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.5 | [`solidaritaetszuschlag-rechner`](https://rechenhafen.de/rechner/solidaritaetszuschlag-rechner/) | Solidaritätszuschlag-Rechner (SolZ Freigrenze & Milderung) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | ⚠️ High |
| 1.6 | [`kirchensteuer-rechner`](https://rechenhafen.de/rechner/kirchensteuer-rechner/) | Kirchensteuer-Rechner (Bundesland & Steuerabzug) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 2 Info |
| 1.7 | [`sozialabgaben-rechner`](https://rechenhafen.de/rechner/sozialabgaben-rechner/) | Sozialabgaben-Rechner (RV, KV, PV & ALV Beiträge) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | ⚠️ High |
| 1.8 | [`arbeitgeberkosten-rechner`](https://rechenhafen.de/rechner/arbeitgeberkosten-rechner/) | Arbeitgeberkosten-Rechner (Lohnnebenkosten & AG-Brutto) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.9 | [`minijob-rechner`](https://rechenhafen.de/rechner/minijob-rechner/) | Minijob-Rechner (538 € & 556 € Grenze) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.10 | [`midijob-rechner`](https://rechenhafen.de/rechner/midijob-rechner/) | Midijob-Rechner (Übergangsbereich bis 2.000 €) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.11 | [`bonus-netto-rechner`](https://rechenhafen.de/rechner/bonus-netto-rechner/) | Bonus-Netto-Rechner (Weihnachtsgeld & Einmalbezug) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 2 Info |
| 1.12 | [`abfindungsrechner`](https://rechenhafen.de/rechner/abfindungsrechner/) | Abfindungsrechner (Fünftelregelung nach § 34 EStG) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 2 Info |
| 1.13 | [`renten-brutto-netto-rechner`](https://rechenhafen.de/rechner/renten-brutto-netto-rechner/) | Renten-Brutto-Netto-Rechner (Netto-Rente nach Abzügen) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.14 | [`umsatzsteuerrechner`](https://rechenhafen.de/rechner/umsatzsteuerrechner/) | Umsatzsteuerrechner (Vorsteuer & Umsatzsteuer nach § 12 UStG) | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 1 Info |
| 1.15 | [`gewerbesteuer-rechner`](https://rechenhafen.de/rechner/gewerbesteuer-rechner/) | Gewerbesteuerrechner: Gewerbesteuer mit Hebesatz berechnen | steuern-gehalt | `src/data/calculators/steuernGehalt.ts` | `src/lib/calculators/steuernGehalt.ts` | 2 Info |
| 1.16 | [`stundenlohnrechner`](https://rechenhafen.de/rechner/stundenlohnrechner/) | Stundenlohnrechner (Monatsgehalt in Stundenlohn) | arbeit-gehalt | `src/data/calculators/arbeit.ts` | `src/lib/calculators/arbeit.ts` | 2 Info |
| 1.17 | [`teilzeit-gehaltsrechner`](https://rechenhafen.de/rechner/teilzeit-gehaltsrechner/) | Teilzeitrechner (Gehalt bei Stundenreduzierung) | arbeit-gehalt | `src/data/calculators/arbeit.ts` | `src/lib/calculators/arbeit.ts` | 3 Info |
| 1.18 | [`gehaltserhoehung-rechner`](https://rechenhafen.de/rechner/gehaltserhoehung-rechner/) | Gehaltserhöhungs-Rechner | arbeit-gehalt | `src/data/calculators/arbeit.ts` | `src/lib/calculators/arbeit.ts` | 3 Info |
| 1.19 | [`urlaubstage-rechner`](https://rechenhafen.de/rechner/urlaubstage-rechner/) | Urlaubstage-Rechner (Urlaubsanspruch bei Teilzeit) | arbeit-gehalt | `src/data/calculators/arbeit.ts` | `src/lib/calculators/arbeit.ts` | 3 Info |
| 1.20 | [`kurzarbeitergeld-rechner`](https://rechenhafen.de/rechner/kurzarbeitergeld-rechner/) | Kurzarbeitergeld-Rechner (KUG 60 % / 67 % nach § 105 SGB III) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.21 | [`abfindung-fuenftelregelung-rechner`](https://rechenhafen.de/rechner/abfindung-fuenftelregelung-rechner/) | Abfindungsrechner mit Fünftelregelung (§ 34 EStG) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.22 | [`minijob-midijob-rechner`](https://rechenhafen.de/rechner/minijob-midijob-rechner/) | Minijob- & Midijob-Rechner (Übergangsbereich bis 2.000 €) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 1.23 | [`arbeitgeberanteil-sozialversicherung-rechner`](https://rechenhafen.de/rechner/arbeitgeberanteil-sozialversicherung-rechner/) | Arbeitgeber-Gesamtkosten-Rechner (Lohnnebenkosten) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.24 | [`kuendigungsfrist-arbeitnehmer-rechner`](https://rechenhafen.de/rechner/kuendigungsfrist-arbeitnehmer-rechner/) | Kündigungsfrist-Rechner (§ 622 BGB Arbeitsrecht) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 1.25 | [`ueberstunden-auszahlung-rechner`](https://rechenhafen.de/rechner/ueberstunden-auszahlung-rechner/) | Überstunden-Auszahlungs-Rechner (Brutto / Netto & Zuschläge) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 4 Info |
| 1.26 | [`firmenwagen-geldwerter-vorteil-rechner`](https://rechenhafen.de/rechner/firmenwagen-geldwerter-vorteil-rechner/) | Firmenwagen-Rechner (Geldwerter Vorteil) (Lohnabrechnung) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.27 | [`krankengeld-rechner`](https://rechenhafen.de/rechner/krankengeld-rechner/) | Krankengeld-Rechner (70 % Brutto / 90 % Netto nach § 47 SGB V) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.28 | [`mutterschaftsgeld-rechner`](https://rechenhafen.de/rechner/mutterschaftsgeld-rechner/) | Mutterschaftsgeld-Rechner (Krankenkasse & Arbeitgeberzuschuss) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 1.29 | [`elternzeit-teilzeit-rechner`](https://rechenhafen.de/rechner/elternzeit-teilzeit-rechner/) | Elternzeit-Teilzeit-Rechner (Teilzeit in Elternzeit & Verdienst) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.30 | [`sabbatical-rechner`](https://rechenhafen.de/rechner/sabbatical-rechner/) | Sabbatical-Rechner (Gehaltsverzicht & Ansparmodell) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.31 | [`nachtzuschlag-sonntagszuschlag-rechner`](https://rechenhafen.de/rechner/nachtzuschlag-sonntagszuschlag-rechner/) | Zuschläge-Rechner (Steuerfreie Nacht-, Sonntags- & Feiertagsarbeit) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.32 | [`vermoegenswirksame-leistungen-rechner`](https://rechenhafen.de/rechner/vermoegenswirksame-leistungen-rechner/) | VL-Rechner (Vermögenswirksame Leistungen & Arbeitnehmersparzulage) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 4 Info |
| 1.33 | [`betriebliche-altersvorsorge-rechner`](https://rechenhafen.de/rechner/betriebliche-altersvorsorge-rechner/) | Betriebliche-Altersvorsorge-Rechner (bAV) (bAV & 15 % AG-Zuschuss) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.34 | [`jahresgehalt-in-monatsgehalt-rechner`](https://rechenhafen.de/rechner/jahresgehalt-in-monatsgehalt-rechner/) | Jahresgehalt-in-Monatsgehalt-Rechner (12, 13 oder 14 Gehälter) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 1.35 | [`brutto-stundensatz-freiberufler-rechner`](https://rechenhafen.de/rechner/brutto-stundensatz-freiberufler-rechner/) | Stundensatz-Rechner für Freiberufler & Selbstständige | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 5 Info |
| 1.36 | [`urlaubsabgeltung-rechner`](https://rechenhafen.de/rechner/urlaubsabgeltung-rechner/) | Urlaubsabgeltungs-Rechner (§ 11 BUrlG bei Kündigung) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 1.37 | [`arbeitslosengeld-1-rechner`](https://rechenhafen.de/rechner/arbeitslosengeld-1-rechner/) | Arbeitslosengeld-1-Rechner (ALG I) (ALG I Anspruch nach SGB III) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.38 | [`buergergeld-anspruch-rechner`](https://rechenhafen.de/rechner/buergergeld-anspruch-rechner/) | Bürgergeld-Rechner (Regelsatz, Mehrbedarfe & Miete SGB II) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.39 | [`dienstjubilaeum-steuerfrei-rechner`](https://rechenhafen.de/rechner/dienstjubilaeum-steuerfrei-rechner/) | Sachbezug- & Jubiläumsgeschenk-Rechner (50 € & 60 € Freigrenzen) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 1.40 | [`dienstaufwandsentschaedigung-rechner`](https://rechenhafen.de/rechner/dienstaufwandsentschaedigung-rechner/) | Ehrenamts- & Übungsleiterpauschalen-Rechner (§ 3 EStG) | arbeit-gehalt | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 1.41 | [`stundensatz-kalkulation-freiberufler-rechner`](https://rechenhafen.de/rechner/stundensatz-kalkulation-freiberufler-rechner/) | Stundensatz-Rechner für Freiberufler & Selbstständige | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 1.42 | [`abschreibung-linear-degressiv-rechner`](https://rechenhafen.de/rechner/abschreibung-linear-degressiv-rechner/) | AfA-Rechner: Lineare & degressive Abschreibung | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 1.43 | [`mwst-rechner`](https://rechenhafen.de/rechner/mwst-rechner/) | Mehrwertsteuer-Rechner (Netto / Brutto 19 % & 7 %) | business | `src/data/calculators/business.ts` | `src/lib/calculators/business.ts` | 1 Info |
| 1.44 | [`marge-rechner`](https://rechenhafen.de/rechner/marge-rechner/) | Marge- & Handelsspannen-Rechner | business | `src/data/calculators/business.ts` | `src/lib/calculators/business.ts` | 2 Info |
| 1.45 | [`skontorechner`](https://rechenhafen.de/rechner/skontorechner/) | Skontorechner (Skontoabzug & effektiver Jahreszins) | business | `src/data/calculators/business.ts` | `src/lib/calculators/business.ts` | 4 Info |
| 1.46 | [`skonto-jahreszins-rechner`](https://rechenhafen.de/rechner/skonto-jahreszins-rechner/) | Skonto-Jahreszins-Rechner: Effektiver Zins & Skonto-Vergleich | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 5 Info |
| 1.47 | [`rabattrechner`](https://rechenhafen.de/rechner/rabattrechner/) | Rabattrechner (Ersparnis & reduzierter Preis) | business | `src/data/calculators/business.ts` | `src/lib/calculators/business.ts` | ⚠️ High |
| 1.48 | [`wareneinsatzquote-rechner`](https://rechenhafen.de/rechner/wareneinsatzquote-rechner/) | Wareneinsatzquote-Rechner (Wareneinsatz in %) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 1.49 | [`lagerumschlagshaeufigkeit-rechner`](https://rechenhafen.de/rechner/lagerumschlagshaeufigkeit-rechner/) | Lagerumschlag-Rechner: Umschlagshäufigkeit & Lagerdauer | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 1.50 | [`umsatzrentabilitaet-rechner`](https://rechenhafen.de/rechner/umsatzrentabilitaet-rechner/) | Umsatzrentabilitäts-Rechner (Umsatzrendite & Return on Sales ROS) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |

### Batch 1 Umsetzungs- und Verifikationsbericht (50 / 50 Rechner abgeschlossen)

- **Status:** **50 / 50 vollständig auditiert, implementiert und lokal verifiziert (100 %)**
- **Audit- und Implementierungs-Gruppen:**
  1. **Gruppe 1 (Steuern & Gehalt Core – 15 Rechner in `steuernGehalt.ts`):** Validiert gegen § 32a EStG, BMF-Lohnsteuer-Tarif 2025/2026, BBGs und § 20 SGB IV (Midijob). Behoben: Fallbacks bei 0 € Einkommen/Abfindung/Bonus und MwSt 0 €.
  2. **Gruppe 2 (Arbeit & Gehalt Core – 4 Rechner in `arbeit.ts`):** Gesetzliche Schutzgrenzen gegen Division durch 0 bei 0 Wochenstunden, 0 Arbeitstagen und 0 % Gehaltserhöhungen (Gehaltsstopp) sauber behandelt.
  3. **Gruppe 3 (Handel & Rabatte – 4 Rechner in `business.ts` & `moreCalculators.ts`):** 0 % Skonto und 0 % Rabattierung ohne Default-Überschreibung verifiziert.
  4. **Gruppe 4 (Arbeitsrecht & Lohnersatzleistungen – 21 Rechner in `extra/autoArbeit.ts`):** Alle 21 Rechner (Kündigungsfrist § 622 BGB mit 0 Dienstjahren = 4 Wochen Grundkündigungsfrist; Überstundenauszahlung mit 0 % Zuschlag; Sabbatical; Bürgergeld SGB II; Kurzarbeitergeld § 105 SGB III) auf Nullwerte und Grenzfälle verifiziert.
  5. **Gruppe 5 (Betriebswirtschaft & Kostenrechnung – 6 Rechner in `extra/businessStatistik.ts`):** AfA (BMF-Tabellen), Skonto-Jahreszins (0 % Skonto & 0 % Dispozins), Freelancer-Stundensatz (0 € Betriebsausgaben erhalten), Wareneinsatzquote, Lagerumschlag und Umsatzrentabilität gegen Division durch 0 geschützt.
- **Qualitätssicherung & Testergebnisse:**
  - **Vitest QA-Suite (`src/__tests__/batch-1-calculators.test.ts`):** 170 von 170 Tests bestanden (Registrierung, Metadaten, Standardberechnung, Nullwert-Handling, Division-by-Zero-Schutz, workedExample).
  - **Gesamtes Test-Set:** 31 Test-Dateien, 545 von 545 Tests bestanden.
  - **TypeScript:** `npx tsc --noEmit` mit 0 Fehlern bestanden.
  - **ESLint:** `npm run lint` mit 0 Fehlern und 0 Warnungen bestanden.
  - **Next.js Production Build:** `npm run build` erfolgreich abgeschlossen (alle 471 statischen Routen fehlerfrei generiert).

---

## 6.2 Batch 2: Finanzen, Geldanlage, Kredite & Schulden (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 2.1 | [`zinseszinsrechner`](https://rechenhafen.de/rechner/zinseszinsrechner/) | Zinseszinsrechner | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | ⚠️ High |
| 2.2 | [`etf-sparplan-rechner`](https://rechenhafen.de/rechner/etf-sparplan-rechner/) | ETF-Sparplan-Rechner (Vermögensaufbau & Kosten) | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 5 Info |
| 2.3 | [`sparrechner`](https://rechenhafen.de/rechner/sparrechner/) | Sparrechner | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 4 Info |
| 2.4 | [`sparzielrechner`](https://rechenhafen.de/rechner/sparzielrechner/) | Sparzielrechner (Benötigte Sparrate) | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 4 Info |
| 2.5 | [`inflationsrechner`](https://rechenhafen.de/rechner/inflationsrechner/) | Inflationsrechner & Kaufkraftverlust | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 3 Info |
| 2.6 | [`renditerechner`](https://rechenhafen.de/rechner/renditerechner/) | Renditerechner & CAGR (Jährliche Rendite) | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 3 Info |
| 2.7 | [`notgroschen-rechner`](https://rechenhafen.de/rechner/notgroschen-rechner/) | Notgroschen-Rechner (Finanzpolster) | finanzen | `src/data/calculators/finanzen.ts` | `src/lib/calculators/finanzen.ts` | 4 Info |
| 2.8 | [`tagesgeld-rechner`](https://rechenhafen.de/rechner/tagesgeld-rechner/) | Tagesgeld-Rechner (Zinsen & Zinsertrag) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.9 | [`festgeld-rechner`](https://rechenhafen.de/rechner/festgeld-rechner/) | Festgeld-Rechner (Feste Laufzeit & Zinsgarantie) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.10 | [`spardauer-rechner`](https://rechenhafen.de/rechner/spardauer-rechner/) | Spardauer-Rechner (Dauer bis zum Sparziel) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.11 | [`kaufkraftverlust-rechner`](https://rechenhafen.de/rechner/kaufkraftverlust-rechner/) | Kaufkraftverlust-Rechner (Inflation über Zeit) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.12 | [`realzins-rechner`](https://rechenhafen.de/rechner/realzins-rechner/) | Realzins-Rechner (Nominalzins minus Inflation) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.13 | [`dividendenrendite-rechner`](https://rechenhafen.de/rechner/dividendenrendite-rechner/) | Dividendenrendite-Rechner | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.14 | [`ewige-rente-rechner`](https://rechenhafen.de/rechner/ewige-rente-rechner/) | Ewige Rente-Rechner (Finanzielle Unabhängigkeit) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.15 | [`finanzielle-freiheit-rechner`](https://rechenhafen.de/rechner/finanzielle-freiheit-rechner/) | Finanzielle Freiheit-Rechner (FIRE 4%-Regel) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | ⚠️ High |
| 2.16 | [`freistellungsauftrag-rechner`](https://rechenhafen.de/rechner/freistellungsauftrag-rechner/) | Freistellungsauftrag-Rechner (Sparerpauschbetrag 1.000 € / 2.000 €) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 1 Info |
| 2.17 | [`kapitalertragsteuer-rechner`](https://rechenhafen.de/rechner/kapitalertragsteuer-rechner/) | Kapitalertragsteuer-Rechner (Abgeltungsteuer, Soli & Sparer-Pauschbetrag) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 1 Info |
| 2.18 | [`depotgebuehren-rechner`](https://rechenhafen.de/rechner/depotgebuehren-rechner/) | Depotgebühren-Rechner (Kostenwirkung auf Endvermögen) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.19 | [`sparrate-rechner`](https://rechenhafen.de/rechner/sparrate-rechner/) | Sparrate-Rechner (Sparquote vom Nettoeinkommen) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.20 | [`liquiditaetsreserve-rechner`](https://rechenhafen.de/rechner/liquiditaetsreserve-rechner/) | Liquiditätsreserve-Rechner (Eiserne Notreserve) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 1 Info |
| 2.21 | [`verdopplungszeit-rechner`](https://rechenhafen.de/rechner/verdopplungszeit-rechner/) | Verdopplungszeit-Rechner (Exakte 72er-Regel) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.22 | [`thesaurierend-vs-ausschuettend-rechner`](https://rechenhafen.de/rechner/thesaurierend-vs-ausschuettend-rechner/) | Thesaurierend vs. Ausschüttend-Rechner (ETF-Vergleich) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.23 | [`rentenluecke-rechner`](https://rechenhafen.de/rechner/rentenluecke-rechner/) | Rentenlücke-Rechner (Vorsorgebedarf im Alter) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.24 | [`gold-rendite-rechner`](https://rechenhafen.de/rechner/gold-rendite-rechner/) | Gold Rendite-Rechner (Unzen & Gramm in Euro) | finanzen | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.25 | [`kreditrechner`](https://rechenhafen.de/rechner/kreditrechner/) | Kreditrechner & Ratenkredit | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | 3 Info |
| 2.26 | [`ratenkreditrechner`](https://rechenhafen.de/rechner/ratenkreditrechner/) | Ratenkreditrechner | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | 3 Info |
| 2.27 | [`autokreditrechner`](https://rechenhafen.de/rechner/autokreditrechner/) | Autokreditrechner (Fahrzeugfinanzierung) | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | 4 Info |
| 2.28 | [`tilgungsrechner`](https://rechenhafen.de/rechner/tilgungsrechner/) | Tilgungsrechner mit Zinsbindung | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | 4 Info |
| 2.29 | [`sondertilgungsrechner`](https://rechenhafen.de/rechner/sondertilgungsrechner/) | Sondertilgungsrechner | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | ⚠️ High |
| 2.30 | [`restschuld-rechner`](https://rechenhafen.de/rechner/restschuld-rechner/) | Restschuld-Rechner | kredit-schulden | `src/data/calculators/kredit.ts` | `src/lib/calculators/kredit.ts` | 4 Info |
| 2.31 | [`ballonfinanzierung-rechner`](https://rechenhafen.de/rechner/ballonfinanzierung-rechner/) | Ballonfinanzierung Rechner (Kfz-Kredit mit Schlussrate) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 5 Info |
| 2.32 | [`umschuldung-rechner`](https://rechenhafen.de/rechner/umschuldung-rechner/) | Umschuldungsrechner (Kredite bündeln & Zinsen sparen) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.33 | [`dispozins-rechner`](https://rechenhafen.de/rechner/dispozins-rechner/) | Dispozins-Rechner (Kosten der Kontoüberziehung) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.34 | [`maximaler-kredit-rechner`](https://rechenhafen.de/rechner/maximaler-kredit-rechner/) | Maximaler Kredit-Rechner (Wie viel Kredit kann ich mir leisten?) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 6 Info |
| 2.35 | [`modernisierungskredit-rechner`](https://rechenhafen.de/rechner/modernisierungskredit-rechner/) | Modernisierungskredit-Rechner (Sanierung & Renovierung) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.36 | [`kreditvergleich-rechner`](https://rechenhafen.de/rechner/kreditvergleich-rechner/) | Kreditvergleich-Rechner (Zwei Angebote direkt vergleichen) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.37 | [`gesamtzinsbelastung-rechner`](https://rechenhafen.de/rechner/gesamtzinsbelastung-rechner/) | Gesamtzinsbelastung-Rechner (Zinskosten über Kreditlaufzeit) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.38 | [`vorfaelligkeitsentschaedigung-rechner`](https://rechenhafen.de/rechner/vorfaelligkeitsentschaedigung-rechner/) | Vorfälligkeitsentschädigung-Rechner (Kredit vorzeitig kündigen) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 2 Info |
| 2.39 | [`schuldentilgungsdauer-rechner`](https://rechenhafen.de/rechner/schuldentilgungsdauer-rechner/) | Schuldentilgungsdauer-Rechner (Wann bin ich schuldenfrei?) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.40 | [`forward-darlehen-rechner`](https://rechenhafen.de/rechner/forward-darlehen-rechner/) | Forward-Darlehen-Rechner (Zinsen für die Zukunft sichern) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.41 | [`kreditlaufzeit-rechner`](https://rechenhafen.de/rechner/kreditlaufzeit-rechner/) | Kreditlaufzeit-Rechner (Exakte Laufzeit aus Wunschrate) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.42 | [`kredit-restschuld-stichtag-rechner`](https://rechenhafen.de/rechner/kredit-restschuld-stichtag-rechner/) | Kredit-Restschuld Stichtagsrechner (Restsumme) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 2.43 | [`effektivzins-kredit-rechner`](https://rechenhafen.de/rechner/effektivzins-kredit-rechner/) | Effektivzins-Rechner Kredit (nach Preisangabenverordnung PAngV) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.44 | [`privatkredit-rechner`](https://rechenhafen.de/rechner/privatkredit-rechner/) | Privatkredit-Rechner (Kredit von privat an privat) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 2.45 | [`working-capital-rechner`](https://rechenhafen.de/rechner/working-capital-rechner/) | Working-Capital-Rechner (Nettoumlaufvermögen & Working Capital Ratio) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | ⚠️ High |
| 2.46 | [`liquiditaetsgrad-rechner`](https://rechenhafen.de/rechner/liquiditaetsgrad-rechner/) | Liquiditätsgrad-Rechner (Liquidität 1., 2. & 3. Grades) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 2.47 | [`cashflow-rechner`](https://rechenhafen.de/rechner/cashflow-rechner/) | Cashflow-Rechner (Operativer Cashflow nach Praktiker-Formel) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 2.48 | [`ebit-ebitda-rechner`](https://rechenhafen.de/rechner/ebit-ebitda-rechner/) | EBIT- & EBITDA-Rechner (Operatives Ergebnis & Marge berechnen) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 5 Info |
| 2.49 | [`eigenkapitalrentabilitaet-rechner`](https://rechenhafen.de/rechner/eigenkapitalrentabilitaet-rechner/) | Eigenkapitalrentabilitäts-Rechner (Return on Equity ROE & Leverage) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 2.50 | [`gesamtkapitalrentabilitaet-rechner`](https://rechenhafen.de/rechner/gesamtkapitalrentabilitaet-rechner/) | Gesamtkapitalrentabilitäts-Rechner (Return on Assets ROA & ROI) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 3 Info |

### Batch 2 Umsetzungs- und Verifikationsbericht (50 / 50 Rechner abgeschlossen)

- **Status:** **50 / 50 vollständig auditiert, implementiert und lokal verifiziert (100 %)**
- **Audit- und Implementierungs-Gruppen:**
  1. **Gruppe 1 (Core Finanzen – 7 Rechner in `finanzen.ts`):** Validiert: `zinseszinsrechner`, `etf-sparplan-rechner`, `sparrechner`, `sparzielrechner`, `inflationsrechner`, `renditerechner`, `notgroschen-rechner`. 0 € Startkapital, 0 € Sparrate, 0 % Dynamik und 0 % Zinsen werden sauber ohne Falsch-Fallback verarbeitet. HelpText ergänzt.
  2. **Gruppe 2 (Core Kredit – 6 Rechner in `kredit.ts`):** Validiert: `kreditrechner`, `ratenkreditrechner`, `autokreditrechner`, `tilgungsrechner`, `sondertilgungsrechner`, `restschuld-rechner`. High-Confidence-Befund #2 behoben (`sondertilgungsrechner`: `yearlySpecialRepayment = 0` wird nicht mehr auf 5.000 € überschrieben; spart 0 € Zinsen statt falscher Ersparnis). 0 € Anzahlung beim Autokredit (`downPayment = 0`) und 0 % Zins bei Raten- und Tilgungsrechnern abgesichert.
  3. **Gruppe 3 (Betriebswirtschaft & Bilanzanalyse – 6 Rechner in `extra/businessStatistik.ts`):** Validiert: `cashflow-rechner`, `ebit-ebitda-rechner`, `eigenkapitalrentabilitaet-rechner`, `gesamtkapitalrentabilitaet-rechner`, `liquiditaetsgrad-rechner`, `working-capital-rechner`. High-Confidence-Befund #4 behoben (`working-capital-rechner`: `currentAssets = 0` wird sauber erhalten; Division-by-Zero-Schutz bei `currentLiabilities <= 0`). Division-by-Zero-Schutz bei Eigen- und Gesamtkapitalrentabilität sowie Liquiditätsgraden implementiert.
  4. **Gruppe 4 (Finanzen & Kredite Spezial – 31 Rechner in `extra/finanzenKredit.ts`):** Alle 31 Rechner auditiert und gehärtet: `ballonfinanzierung-rechner`, `depotgebuehren-rechner`, `dispozins-rechner`, `dividendenrendite-rechner`, `effektivzins-kredit-rechner`, `ewige-rente-rechner`, `festgeld-rechner`, `finanzielle-freiheit-rechner` (High-Confidence-Befund #3: `currentAssets = 0` erhalten), `forward-darlehen-rechner`, `freistellungsauftrag-rechner`, `gesamtzinsbelastung-rechner`, `gold-rendite-rechner`, `kapitalertragsteuer-rechner`, `kaufkraftverlust-rechner`, `kredit-restschuld-stichtag-rechner`, `kreditlaufzeit-rechner`, `kreditvergleich-rechner`, `liquiditaetsreserve-rechner`, `maximaler-kredit-rechner`, `modernisierungskredit-rechner`, `privatkredit-rechner`, `realzins-rechner`, `rentenluecke-rechner`, `schuldentilgungsdauer-rechner`, `spardauer-rechner`, `sparrate-rechner`, `tagesgeld-rechner`, `thesaurierend-vs-ausschuettend-rechner`, `umschuldung-rechner`, `verdopplungszeit-rechner`, `vorfaelligkeitsentschaedigung-rechner`. Explizite Leerwert- und Nullwert-Validierung, Laufzeitprüfungen und Division-by-Zero-Guards.
- **Qualitätssicherung & Testergebnisse:**
  - **Vitest QA-Suite (`src/__tests__/batch-2-calculators.test.ts`):** 118 von 118 Tests bestanden (Registrierung, Metadaten, Standardberechnung aller 50 Rechner, Nullwert-Handling, High-Confidence-Verifikation, Division-by-Zero-Schutz).
  - **Gesamtes Test-Set:** 32 Test-Dateien, 663 von 663 Tests bestanden (keine Regressionen bei Batch 1 oder Bestandsrechnern).
  - **TypeScript:** `npx tsc --noEmit` mit 0 Fehlern bestanden.
  - **ESLint:** `npm run lint` mit 0 Fehlern und 0 Warnungen bestanden.
  - **Next.js Production Build:** `npm run build` erfolgreich abgeschlossen (alle 471 statischen Routen fehlerfrei generiert).

---

## 6.3 Batch 3: Wohnen, Immobilien, Miete & Baufinanzierung (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 3.1 | [`mietbelastungsquote-rechner`](https://rechenhafen.de/rechner/mietbelastungsquote-rechner/) | Mietbelastungsquoten-Rechner | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | 2 Info |
| 3.2 | [`kaufnebenkosten-rechner`](https://rechenhafen.de/rechner/kaufnebenkosten-rechner/) | Kaufnebenkosten-Rechner (Immobilienkauf) | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | 3 Info |
| 3.3 | [`immobilienrendite-rechner`](https://rechenhafen.de/rechner/immobilienrendite-rechner/) | Immobilienrendite-Rechner (Brutto- & Nettomietrendite) | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | 4 Info |
| 3.4 | [`quadratmeterpreis-rechner`](https://rechenhafen.de/rechner/quadratmeterpreis-rechner/) | Quadratmeterpreis-Rechner (Kaufpreis & Miete) | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | ⚠️ High |
| 3.5 | [`mietbudget-rechner`](https://rechenhafen.de/rechner/mietbudget-rechner/) | Mietbudget-Rechner (Wie viel Miete kann ich mir leisten?) | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | 1 Info |
| 3.6 | [`mieterhoehung-rechner`](https://rechenhafen.de/rechner/mieterhoehung-rechner/) | Mieterhöhungsrechner: Mieterhöhung & Kappungsgrenze prüfen | wohnen-immobilien | `src/data/calculators/wohnen.ts` | `src/lib/calculators/wohnen.ts` | 5 Info |
| 3.7 | [`mietminderung-rechner`](https://rechenhafen.de/rechner/mietminderung-rechner/) | Mietminderung-Rechner (nach Mietminderungstabelle) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.8 | [`staffelmiete-rechner`](https://rechenhafen.de/rechner/staffelmiete-rechner/) | Staffelmiete-Rechner (Staffelvereinbarungen nach § 557a BGB) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | ⚠️ High |
| 3.9 | [`indexmiete-rechner`](https://rechenhafen.de/rechner/indexmiete-rechner/) | Indexmiete-Rechner (nach Verbraucherpreisindex VPI) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.10 | [`wohnflaeche-din-rechner`](https://rechenhafen.de/rechner/wohnflaeche-din-rechner/) | Wohnflächenrechner nach WoFlV (Wohnflächenverordnung) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.11 | [`grundsteuer-reform-rechner`](https://rechenhafen.de/rechner/grundsteuer-reform-rechner/) | Grundsteuer-Rechner (Bundesmodell & Hebesatz) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.12 | [`spekulationssteuer-immobilien-rechner`](https://rechenhafen.de/rechner/spekulationssteuer-immobilien-rechner/) | Spekulationssteuer-Rechner (Immobilienverkauf § 23 EStG) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | ⚠️ High |
| 3.13 | [`maklerprovision-rechner`](https://rechenhafen.de/rechner/maklerprovision-rechner/) | Maklerprovision-Rechner (50:50 Teilung nach § 656c BGB) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 3.14 | [`grunderwerbsteuer-rechner`](https://rechenhafen.de/rechner/grunderwerbsteuer-rechner/) | Grunderwerbsteuer-Rechner (nach 16 Bundesländern) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 1 Info |
| 3.15 | [`notar-grundbuch-kosten-rechner`](https://rechenhafen.de/rechner/notar-grundbuch-kosten-rechner/) | Notar- und Grundbuchkosten-Rechner (nach GNotKG) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 3.16 | [`instandhaltungsruecklage-rechner`](https://rechenhafen.de/rechner/instandhaltungsruecklage-rechner/) | Instandhaltungsrücklage-Rechner (nach Petersscher Formel) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.17 | [`modernisierungsumlage-rechner`](https://rechenhafen.de/rechner/modernisierungsumlage-rechner/) | Modernisierungsumlage-Rechner (max. 8 % nach § 559 BGB) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.18 | [`mietkaution-zinsen-rechner`](https://rechenhafen.de/rechner/mietkaution-zinsen-rechner/) | Mietkaution & Zinseszins-Rechner (§ 551 BGB) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.19 | [`hausgeld-rechner`](https://rechenhafen.de/rechner/hausgeld-rechner/) | Hausgeld-Rechner für Eigentumswohnungen | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.20 | [`abschreibung-immobilien-rechner`](https://rechenhafen.de/rechner/abschreibung-immobilien-rechner/) | AfA-Rechner Immobilien (Gebäudeabschreibung nach § 7 EStG) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.21 | [`mietrendite-brutto-netto-rechner`](https://rechenhafen.de/rechner/mietrendite-brutto-netto-rechner/) | Brutto- und Nettomietrendite-Rechner | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.22 | [`vorfaelligkeitsentschaedigung-baufinanzierung-rechner`](https://rechenhafen.de/rechner/vorfaelligkeitsentschaedigung-baufinanzierung-rechner/) | Vorfälligkeitsentschädigung Baufinanzierung-Rechner (Aktiv-Passiv-Methode) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.23 | [`abstandszahlung-rechner`](https://rechenhafen.de/rechner/abstandszahlung-rechner/) | Abstandszahlung & Zeitwert-Rechner (Küche & Möbel) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.24 | [`warmmiete-rechner`](https://rechenhafen.de/rechner/warmmiete-rechner/) | Warmmiete-Rechner (Warmmiete berechnen) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 7 Info |
| 3.25 | [`untermiete-rechner`](https://rechenhafen.de/rechner/untermiete-rechner/) | Untermiete-Rechner (Mietanteil & Untermietzuschlag) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.26 | [`erbbaurecht-erbbauzins-rechner`](https://rechenhafen.de/rechner/erbbaurecht-erbbauzins-rechner/) | Erbbauzins-Rechner (Erbbaurecht / Pachtzins) | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.27 | [`kaufpreis-faktor-rechner`](https://rechenhafen.de/rechner/kaufpreis-faktor-rechner/) | Kaufpreisfaktor & Vervielfältiger-Rechner | wohnen-immobilien | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 3.28 | [`baufinanzierung-rechner`](https://rechenhafen.de/rechner/baufinanzierung-rechner/) | Baufinanzierungsrechner (Monatsrate & Zinsbindung) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 3.29 | [`volltilger-darlehen-rechner`](https://rechenhafen.de/rechner/volltilger-darlehen-rechner/) | Volltilger-Rechner (Kredit komplett tilgen ohne Restschuld) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 3.30 | [`kreditrechner-ohne-eigenkapital`](https://rechenhafen.de/rechner/kreditrechner-ohne-eigenkapital/) | Kreditrechner ohne Eigenkapital (100 % & 110 % Baufinanzierung) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 3.31 | [`zwischenfinanzierung-rechner`](https://rechenhafen.de/rechner/zwischenfinanzierung-rechner/) | Zwischenfinanzierung-Rechner (Kurzfristiges Darlehen) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 3 Info |
| 3.32 | [`zinsbindung-rechner`](https://rechenhafen.de/rechner/zinsbindung-rechner/) | Zinsbindungs-Vergleichsrechner (5 vs. 10 vs. 15 Jahre) | kredit-schulden | `src/data/calculators/extra/finanzenKredit.ts` | `src/data/calculators/extra/finanzenKredit.ts` | 4 Info |
| 3.33 | [`waermepumpe-stromkosten-rechner`](https://rechenhafen.de/rechner/waermepumpe-stromkosten-rechner/) | Wärmepumpen-Rechner (Stromverbrauch & JAZ Jahresarbeitszahl) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.34 | [`photovoltaik-amortisation-rechner`](https://rechenhafen.de/rechner/photovoltaik-amortisation-rechner/) | Photovoltaik-Rechner (Dachanlage mit Speicher & Einspeisung) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 6 Info |
| 3.35 | [`balkonkraftwerk-ertrag-rechner`](https://rechenhafen.de/rechner/balkonkraftwerk-ertrag-rechner/) | Balkonkraftwerk-Rechner (800 Watt Stecker-Solar) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.36 | [`heizkostenvergleich-rechner`](https://rechenhafen.de/rechner/heizkostenvergleich-rechner/) | Heizkostenvergleich-Rechner (Wärmepumpe, Gas, Öl, Pellets) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 6 Info |
| 3.37 | [`co2-abgabe-vermieter-mieter-rechner`](https://rechenhafen.de/rechner/co2-abgabe-vermieter-mieter-rechner/) | CO2-Kostenaufteilung-Rechner (CO2KostAufG Stufenmodell) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 3.38 | [`warmwasserkosten-rechner`](https://rechenhafen.de/rechner/warmwasserkosten-rechner/) | Warmwasserkosten-Rechner (Durchlauferhitzer vs. Zentralheizung) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 3.39 | [`pelletheizung-verbrauch-rechner`](https://rechenhafen.de/rechner/pelletheizung-verbrauch-rechner/) | Pelletheizung-Rechner (Pelletverbrauch & Tonnenbedarf) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 3.40 | [`energieeffizienzklasse-rechner`](https://rechenhafen.de/rechner/energieeffizienzklasse-rechner/) | Energieeffizienzklasse-Rechner (Gebäude A+ bis H nach GEG) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 1 Info |
| 3.41 | [`daemmung-u-wert-rechner`](https://rechenhafen.de/rechner/daemmung-u-wert-rechner/) | Dämmung-U-Wert-Rechner (Wärmedurchgang & Dämmstoffdicke) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 3.42 | [`regenwasser-zisterne-rechner`](https://rechenhafen.de/rechner/regenwasser-zisterne-rechner/) | Regenwasser-Zisternen-Rechner (Tankgröße nach DIN 1989) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 3.43 | [`brennholz-raummeter-rechner`](https://rechenhafen.de/rechner/brennholz-raummeter-rechner/) | Brennholz- & Raummeter-Rechner (Festmeter, Raummeter, Schüttraummeter & Heizwert) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 3.44 | [`drainage-gefaelle-rechner`](https://rechenhafen.de/rechner/drainage-gefaelle-rechner/) | Drainage- & Gefälle-Rechner (Prozent, cm/m & Höhenunterschied) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 3.45 | [`baugrund-tragfaehigkeit-rechner`](https://rechenhafen.de/rechner/baugrund-tragfaehigkeit-rechner/) | Baugrund- & Bodenpressungs-Rechner (Fundamentbelastung nach DIN 1054) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 3.46 | [`break-even-rechner`](https://rechenhafen.de/rechner/break-even-rechner/) | Break-Even-Rechner (Gewinnschwelle berechnen) | business | `src/data/calculators/business.ts` | `src/lib/calculators/business.ts` | 3 Info |
| 3.47 | [`deckungsbeitrag-rechner`](https://rechenhafen.de/rechner/deckungsbeitrag-rechner/) | Deckungsbeitrag-Rechner (DB I, Stückdeckungsbeitrag & DB-Quote) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 3.48 | [`roi-rechner`](https://rechenhafen.de/rechner/roi-rechner/) | ROI-Rechner (Return on Investment & Amortisationsdauer) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 3 Info |
| 3.49 | [`roas-rechner`](https://rechenhafen.de/rechner/roas-rechner/) | ROAS-Rechner (Return on Ad Spend & Break-Even-ROAS) | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 3 Info |
| 3.50 | [`kundengewinnungskosten-cac-rechner`](https://rechenhafen.de/rechner/kundengewinnungskosten-cac-rechner/) | CAC-Rechner: Kundengewinnungskosten berechnen | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |

---

## 6.4 Batch 4: Bauen, Renovieren, Handwerk & Geometrie (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 4.1 | [`farbmengen-rechner`](https://rechenhafen.de/rechner/farbmengen-rechner/) | Farbmengen-Rechner (Wandfarbe berechnen) | bauen-renovieren | `src/data/calculators/bauen.ts` | `src/lib/calculators/bauen.ts` | 6 Info |
| 4.2 | [`bodenbelag-rechner`](https://rechenhafen.de/rechner/bodenbelag-rechner/) | Bodenbelag- & Laminatrechner (mit Verschnitt) | bauen-renovieren | `src/data/calculators/bauen.ts` | `src/lib/calculators/bauen.ts` | 4 Info |
| 4.3 | [`betonrechner`](https://rechenhafen.de/rechner/betonrechner/) | Betonrechner (Volumen in m³ & Fertigbetonsäcke) | bauen-renovieren | `src/data/calculators/bauen.ts` | `src/lib/calculators/bauen.ts` | 4 Info |
| 4.4 | [`estrich-rechner`](https://rechenhafen.de/rechner/estrich-rechner/) | Estrich-Bedarfsrechner (Zementestrich & Fließestrich Bedarf) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.5 | [`dachflaeche-rechner`](https://rechenhafen.de/rechner/dachflaeche-rechner/) | Dachflächen-Rechner (Satteldach, Pultdach & Dachneigung) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 4 Info |
| 4.6 | [`bausteine-mauerwerk-rechner`](https://rechenhafen.de/rechner/bausteine-mauerwerk-rechner/) | Mauerstein-Bedarfsrechner (Bedarf nach Wandfläche & Steinformat) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | ⚠️ High |
| 4.7 | [`fliesenkleber-rechner`](https://rechenhafen.de/rechner/fliesenkleber-rechner/) | Fliesenkleber- & Fugenmörtel-Rechner (kg & Säcke nach m²) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.8 | [`aushub-erdarbeiten-rechner`](https://rechenhafen.de/rechner/aushub-erdarbeiten-rechner/) | Aushub- & Erdarbeiten-Rechner (Baugrube m³, Tonnen & LKW-Fahrten) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.9 | [`pflastersteine-rechner`](https://rechenhafen.de/rechner/pflastersteine-rechner/) | Pflasterstein-Rechner (Bedarf nach Fläche, Fugen & Bettungssplitt) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.10 | [`trockenbau-gipskarton-rechner`](https://rechenhafen.de/rechner/trockenbau-gipskarton-rechner/) | Trockenbau-Gipskarton-Rechner (Platten, Profile & Schrauben) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.11 | [`fundament-rechner`](https://rechenhafen.de/rechner/fundament-rechner/) | Fundament-Beton-Rechner (Streifen-, Punkt- & Plattenfundament Beton) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 4 Info |
| 4.12 | [`fassadenfarbe-rechner`](https://rechenhafen.de/rechner/fassadenfarbe-rechner/) | Fassadenfarben-Rechner (Farbbedarf in Litern nach m² & Untergrund) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.13 | [`parkett-laminat-rechner`](https://rechenhafen.de/rechner/parkett-laminat-rechner/) | Parkett- & Laminat-Rechner (Paketanzahl & Verschnitt nach Raummaß) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 4 Info |
| 4.14 | [`tapetenrollen-rechner`](https://rechenhafen.de/rechner/tapetenrollen-rechner/) | Tapeten-Bedarfsrechner (Euro-Rollen Bedarf nach Raumumfang & Rapport) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.15 | [`putz-rechner`](https://rechenhafen.de/rechner/putz-rechner/) | Putz- & Mörtel-Rechner (Innen- & Außenputz kg, Säcke & Ergiebigkeit) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.16 | [`zaun-pfosten-rechner`](https://rechenhafen.de/rechner/zaun-pfosten-rechner/) | Zaun- & Pfosten-Rechner (Doppelstabmatten & Pfostenanzahl) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.17 | [`treppen-stufen-rechner`](https://rechenhafen.de/rechner/treppen-stufen-rechner/) | Treppenstufen-Rechner (DIN 18065) (Schrittmaßregel 2s + a = 63 cm nach DIN 18065) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.18 | [`holz-balken-durchbiegung-rechner`](https://rechenhafen.de/rechner/holz-balken-durchbiegung-rechner/) | Holzbalken-Durchbiegungs-Rechner (Dimensionierung nach Eurocode 5) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 5 Info |
| 4.19 | [`beton-mischungsverhaeltnis-rechner`](https://rechenhafen.de/rechner/beton-mischungsverhaeltnis-rechner/) | Beton-Mischungsverhältnis-Rechner (Zement, Sand, Kies & Wasser) | bauen-renovieren | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.20 | [`kreisrechner`](https://rechenhafen.de/rechner/kreisrechner/) | Kreisrechner (Fläche, Umfang, Durchmesser & Radius) | geometrie | `src/data/calculators/geometrie.ts` | `src/lib/calculators/geometrie.ts` | 1 Info |
| 4.21 | [`zylinderrechner`](https://rechenhafen.de/rechner/zylinderrechner/) | Zylinder-Rechner (Volumen, Oberfläche & Mantelfläche) | geometrie | `src/data/calculators/geometrie.ts` | `src/lib/calculators/geometrie.ts` | 2 Info |
| 4.22 | [`rechteckrechner`](https://rechenhafen.de/rechner/rechteckrechner/) | Rechteck-Rechner (Fläche, Umfang & Diagonale) | geometrie | `src/data/calculators/geometrie.ts` | `src/lib/calculators/geometrie.ts` | 2 Info |
| 4.23 | [`dreieck-flaeche-rechner`](https://rechenhafen.de/rechner/dreieck-flaeche-rechner/) | Dreieck-Rechner (Fläche, Umfang & Heron-Formel) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.24 | [`kreis-umfang-rechner`](https://rechenhafen.de/rechner/kreis-umfang-rechner/) | Kreisumfang-Rechner (Umfang, Radius, Durchmesser & Fläche) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.25 | [`kegel-volumen-rechner`](https://rechenhafen.de/rechner/kegel-volumen-rechner/) | Kegel-Rechner (Volumen, Mantelfläche & Oberfläche) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.26 | [`hohlzylinder-rohr-rechner`](https://rechenhafen.de/rechner/hohlzylinder-rohr-rechner/) | Hohlzylinder- & Rohr-Rechner (Volumen, Wandstärke & Materialgewicht) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.27 | [`pyramide-volumen-rechner`](https://rechenhafen.de/rechner/pyramide-volumen-rechner/) | Pyramide-Rechner (Volumen, Mantelfläche & Kantenlänge) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.28 | [`trapez-flaeche-rechner`](https://rechenhafen.de/rechner/trapez-flaeche-rechner/) | Trapez-Rechner (Flächeninhalt, Mittellinie & Umfang) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 5 Info |
| 4.29 | [`parallelogramm-rechner`](https://rechenhafen.de/rechner/parallelogramm-rechner/) | Parallelogramm-Rechner (Fläche, Umfang & Höhen) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.30 | [`rhombus-raute-rechner`](https://rechenhafen.de/rechner/rhombus-raute-rechner/) | Raute-Rechner (Rhombus-Fläche nach Diagonalen e & f) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.31 | [`kugel-oberflaeche-rechner`](https://rechenhafen.de/rechner/kugel-oberflaeche-rechner/) | Kugel-Rechner (Volumen V = 4/3πr³ & Oberfläche O = 4πr²) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.32 | [`quader-volumen-rechner`](https://rechenhafen.de/rechner/quader-volumen-rechner/) | Quader-Rechner (Volumen, Oberfläche & Raumdiagonale) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.33 | [`prisma-volumen-rechner`](https://rechenhafen.de/rechner/prisma-volumen-rechner/) | Prisma-Rechner (Volumen, Mantelfläche & Dreiecksprisma) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.34 | [`sechseck-polygon-rechner`](https://rechenhafen.de/rechner/sechseck-polygon-rechner/) | Sechseck-Rechner (Regelmäßiges Hexagon, Fläche & Inkreis) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.35 | [`ellipse-flaeche-rechner`](https://rechenhafen.de/rechner/ellipse-flaeche-rechner/) | Ellipse-Rechner (Fläche A = π · a · b & Ramanujan-Umfang) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.36 | [`kreissegment-rechner`](https://rechenhafen.de/rechner/kreissegment-rechner/) | Kreissektor- & Kreissegment-Rechner (Bogenlänge, Sehne & Fläche) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.37 | [`bogenmass-grad-rechner`](https://rechenhafen.de/rechner/bogenmass-grad-rechner/) | Winkelumrechner (Grad, Bogenmaß Radiant & Neugrad Gon) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.38 | [`satz-des-pythagoras-rechner`](https://rechenhafen.de/rechner/satz-des-pythagoras-rechner/) | Satz-des-Pythagoras-Rechner (a² + b² = c² & Kathetensatz) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.39 | [`sinussatz-kosinussatz-rechner`](https://rechenhafen.de/rechner/sinussatz-kosinussatz-rechner/) | Sinussatz- & Kosinussatz-Rechner (Allgemeines Dreieck lösen) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.40 | [`vektor-skalarprodukt-rechner`](https://rechenhafen.de/rechner/vektor-skalarprodukt-rechner/) | Vektor-Skalarprodukt-Rechner (3D-Vektoren & Schnittwinkel) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 4 Info |
| 4.41 | [`torus-volumen-rechner`](https://rechenhafen.de/rechner/torus-volumen-rechner/) | Torus-Rechner (Volumen & Oberfläche eines Kreisrings) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 2 Info |
| 4.42 | [`stumpf-kegel-rechner`](https://rechenhafen.de/rechner/stumpf-kegel-rechner/) | Kegelstumpf-Rechner (Volumen, Mantelfläche & Eimerinhalt) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.43 | [`dreiecks-hoehen-rechner`](https://rechenhafen.de/rechner/dreiecks-hoehen-rechner/) | Dreiecks-Höhen-Rechner (Höhen h_a, h_b, h_c & Inkreisradius) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 3 Info |
| 4.44 | [`goldener-schnitt-rechner`](https://rechenhafen.de/rechner/goldener-schnitt-rechner/) | Goldener-Schnitt-Rechner (Major a, Minor b & Phi = 1,618) | geometrie | `src/data/calculators/extra/bauenGeometrie.ts` | `src/data/calculators/extra/bauenGeometrie.ts` | 1 Info |
| 4.45 | [`flaeche-umrechner`](https://rechenhafen.de/rechner/flaeche-umrechner/) | Flächen Umrechner (m², km², Hektar ha, Ar & Acres) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 4.46 | [`volumen-umrechner`](https://rechenhafen.de/rechner/volumen-umrechner/) | Volumen Umrechner (Liter, ml, m³, Gallonen & Fluid Ounces) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 4.47 | [`laengen-umrechner`](https://rechenhafen.de/rechner/laengen-umrechner/) | Längenumrechner (Meter, Zoll, Fuß, Meilen) | einheiten | `src/data/calculators/einheiten.ts` | `src/lib/calculators/einheiten.ts` | 1 Info |
| 4.48 | [`zoll-in-cm-rechner`](https://rechenhafen.de/rechner/zoll-in-cm-rechner/) | Zoll-in-cm-Rechner (Inch & Diagonale für TV & Smartphones) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 4.49 | [`papierformat-din-rechner`](https://rechenhafen.de/rechner/papierformat-din-rechner/) | Papierformat-DIN-Rechner (DIN A0 bis A8 Maße & Blattgewicht in Gramm) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 4.50 | [`dichte-umrechner`](https://rechenhafen.de/rechner/dichte-umrechner/) | Dichte Umrechner (g/cm³, kg/m³, kg/l & lb/cu ft) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |

---

## 6.5 Batch 5: Energie, Haushalt, Mobilität & Kfz-Kosten (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 5.1 | [`stromkostenrechner`](https://rechenhafen.de/rechner/stromkostenrechner/) | Stromkostenrechner (Haushalt & kWh-Stromverbrauch) | haushalt-energie | `src/data/calculators/haushalt.ts` | `src/lib/calculators/haushalt.ts` | ⚠️ High |
| 5.2 | [`standby-kosten-rechner`](https://rechenhafen.de/rechner/standby-kosten-rechner/) | Standby-Kosten-Rechner | haushalt-energie | `src/data/calculators/haushalt.ts` | `src/lib/calculators/haushalt.ts` | 3 Info |
| 5.3 | [`gaskostenrechner`](https://rechenhafen.de/rechner/gaskostenrechner/) | Gaskostenrechner (Gasverbrauch & Kosten berechnen) | haushalt-energie | `src/data/calculators/haushalt.ts` | `src/lib/calculators/haushalt.ts` | 4 Info |
| 5.4 | [`led-ersparnis-rechner`](https://rechenhafen.de/rechner/led-ersparnis-rechner/) | LED-Ersparnis-Rechner | haushalt-energie | `src/data/calculators/haushalt.ts` | `src/lib/calculators/haushalt.ts` | 5 Info |
| 5.5 | [`stromkosten-geraete-rechner`](https://rechenhafen.de/rechner/stromkosten-geraete-rechner/) | Stromkosten-Rechner für Elektrogeräte (Watt in Euro) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 5.6 | [`gasverbrauch-kwh-m3-rechner`](https://rechenhafen.de/rechner/gasverbrauch-kwh-m3-rechner/) | Gasverbrauch Rechner (m³ in kWh & Gaskosten) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 6 Info |
| 5.7 | [`kuehlschrank-stromkosten-rechner`](https://rechenhafen.de/rechner/kuehlschrank-stromkosten-rechner/) | Kühlschrank Stromkosten-Rechner (Energieeffizienzklassen) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 5.8 | [`trockner-kosten-rechner`](https://rechenhafen.de/rechner/trockner-kosten-rechner/) | Wäschetrockner-Rechner (Wärmepumpe vs. Kondenstrockner) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 5.9 | [`fernseher-stromkosten-rechner`](https://rechenhafen.de/rechner/fernseher-stromkosten-rechner/) | Fernseher Stromkosten-Rechner (OLED vs. LED & Standby) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 5.10 | [`led-sparrechner`](https://rechenhafen.de/rechner/led-sparrechner/) | LED Spartool (Glühbirne vs. LED Watt & Ersparnis) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 5 Info |
| 5.11 | [`oelheizung-verbrauch-rechner`](https://rechenhafen.de/rechner/oelheizung-verbrauch-rechner/) | Heizölverbrauch schätzen: Wohnfläche und Dämmzustand | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 5.12 | [`klimaanlage-stromkosten-rechner`](https://rechenhafen.de/rechner/klimaanlage-stromkosten-rechner/) | Klimaanlage Stromkosten-Rechner (Split-Klima & Mobile Geräte) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 3 Info |
| 5.13 | [`e-auto-ladekosten-zuhause-rechner`](https://rechenhafen.de/rechner/e-auto-ladekosten-zuhause-rechner/) | E-Auto Ladekosten-Rechner (Wallbox vs. Öffentliche Ladesäule) | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 4 Info |
| 5.14 | [`lebensmittelbudget-rechner`](https://rechenhafen.de/rechner/lebensmittelbudget-rechner/) | Lebensmittelbudget & Haushaltsgeld-Rechner | haushalt-energie | `src/data/calculators/extra/wohnenHaushalt.ts` | `src/data/calculators/extra/wohnenHaushalt.ts` | 2 Info |
| 5.15 | [`spritkostenrechner`](https://rechenhafen.de/rechner/spritkostenrechner/) | Spritkostenrechner | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 5 Info |
| 5.16 | [`kraftstoffverbrauch-rechner`](https://rechenhafen.de/rechner/kraftstoffverbrauch-rechner/) | Kraftstoffverbrauchs-Rechner (Liter pro 100 km) | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 2 Info |
| 5.17 | [`pendlerpauschale-rechner`](https://rechenhafen.de/rechner/pendlerpauschale-rechner/) | Pendlerpauschale-Rechner (Entfernungspauschale) | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 2 Info |
| 5.18 | [`fahrtkostenrechner`](https://rechenhafen.de/rechner/fahrtkostenrechner/) | Fahrtkostenrechner | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 4 Info |
| 5.19 | [`elektroauto-ladekosten-rechner`](https://rechenhafen.de/rechner/elektroauto-ladekosten-rechner/) | Elektroauto-Ladekosten-Rechner | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 4 Info |
| 5.20 | [`fahrzeit-rechner`](https://rechenhafen.de/rechner/fahrzeit-rechner/) | Fahrzeit-Rechner (Reisedauer & Ankunftszeit) | auto-verkehr | `src/data/calculators/auto.ts` | `src/lib/calculators/auto.ts` | 3 Info |
| 5.21 | [`kfz-steuer-rechner`](https://rechenhafen.de/rechner/kfz-steuer-rechner/) | KFZ-Steuer-Rechner (nach Hubraum & CO2-Ausstoß) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 4 Info |
| 5.22 | [`dienstwagen-1-prozent-rechner`](https://rechenhafen.de/rechner/dienstwagen-1-prozent-rechner/) | Dienstwagen-Rechner (1-Prozent-Regelung & Fahrten Wohnung-Arbeit) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 5.23 | [`fahrtenbuch-vs-1-prozent-rechner`](https://rechenhafen.de/rechner/fahrtenbuch-vs-1-prozent-rechner/) | Fahrtenbuch vs. 1-Prozent-Regelung-Rechner | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 5 Info |
| 5.24 | [`leasingfaktor-rechner`](https://rechenhafen.de/rechner/leasingfaktor-rechner/) | Leasingfaktor-Rechner (Auto-Leasing bewerten) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 4 Info |
| 5.25 | [`auto-gesamtkosten-rechner`](https://rechenhafen.de/rechner/auto-gesamtkosten-rechner/) | Auto Gesamtkosten-Rechner (Vollkosten & TCO pro km) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | ⚠️ High |
| 5.26 | [`auto-wertverlust-rechner`](https://rechenhafen.de/rechner/auto-wertverlust-rechner/) | Auto Wertverlust-Rechner (nach Schwacke & Alter) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 2 Info |
| 5.27 | [`bremsweg-rechner`](https://rechenhafen.de/rechner/bremsweg-rechner/) | Bremsweg-Rechner (Reaktionsweg & Anhalteweg Formel) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 5.28 | [`bussgeld-rechner-geschwindigkeit`](https://rechenhafen.de/rechner/bussgeld-rechner-geschwindigkeit/) | Bußgeldrechner Geschwindigkeit (Katalog 2026) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 5.29 | [`promillerechner-widmark`](https://rechenhafen.de/rechner/promillerechner-widmark/) | Promillerechner (Widmark-Formel & Alkoholabbau) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 4 Info |
| 5.30 | [`anhaenger-stuetzlast-rechner`](https://rechenhafen.de/rechner/anhaenger-stuetzlast-rechner/) | Anhänger Stützlast & Anhängelast-Rechner (StVZO) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 3 Info |
| 5.31 | [`reifen-abrollumfang-rechner`](https://rechenhafen.de/rechner/reifen-abrollumfang-rechner/) | Reifenrechner (Abrollumfang, Tachoabweichung & Höherlegung) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 6 Info |
| 5.32 | [`thg-quote-rechner`](https://rechenhafen.de/rechner/thg-quote-rechner/) | THG-Quote-Rechner für Elektroautos (Prämienvergleich) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 5.33 | [`dienstfahrrad-jobrad-rechner`](https://rechenhafen.de/rechner/dienstfahrrad-jobrad-rechner/) | JobRad Rechner (Dienstfahrrad-Leasing & Gehaltsumwandlung) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 0 |
| 5.34 | [`fahrgemeinschaft-sprit-rechner`](https://rechenhafen.de/rechner/fahrgemeinschaft-sprit-rechner/) | Fahrgemeinschafts-Rechner (Kostenaufteilung pro Mitfahrer) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | ⚠️ High |
| 5.35 | [`autobahn-maut-rechner-vignette`](https://rechenhafen.de/rechner/autobahn-maut-rechner-vignette/) | Mautrechner Österreich, Schweiz & Brenner (Vignetten & Streckenmaut) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 0 |
| 5.36 | [`motorrad-unterhaltskosten-rechner`](https://rechenhafen.de/rechner/motorrad-unterhaltskosten-rechner/) | Motorrad-Unterhaltskosten-Rechner (Saison vs. Ganzjahr) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 6 Info |
| 5.37 | [`lkw-maut-deutschland-rechner`](https://rechenhafen.de/rechner/lkw-maut-deutschland-rechner/) | LKW-Maut-Rechner Deutschland (Bundesfernstraßenmaut) | auto-verkehr | `src/data/calculators/extra/autoArbeit.ts` | `src/data/calculators/extra/autoArbeit.ts` | 1 Info |
| 5.38 | [`energie-arbeit-umrechner`](https://rechenhafen.de/rechner/energie-arbeit-umrechner/) | Energie & Arbeit Umrechner (Joule, kWh, kcal & BTU) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.39 | [`leistung-umrechner`](https://rechenhafen.de/rechner/leistung-umrechner/) | Leistung Umrechner (kW, PS Pferdestärke, Watt & HP) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.40 | [`elektrische-ladung-kapazitaet-rechner`](https://rechenhafen.de/rechner/elektrische-ladung-kapazitaet-rechner/) | Akku-Kapazitäts- & Ladungs-Rechner (mAh, Ah in Wh & Coulomb) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.41 | [`drehmoment-umrechner`](https://rechenhafen.de/rechner/drehmoment-umrechner/) | Drehmoment Umrechner (Nm in ft-lb, in-lb & kpm) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.42 | [`kraft-umrechner`](https://rechenhafen.de/rechner/kraft-umrechner/) | Kraft Umrechner (Newton N, Kilonewton kN, Kilopond kp & lbf) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.43 | [`kraftstoffverbrauch-umrechner`](https://rechenhafen.de/rechner/kraftstoffverbrauch-umrechner/) | Spritverbrauch Umrechner (l/100km in MPG US & UK) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.44 | [`geschwindigkeit-umrechner`](https://rechenhafen.de/rechner/geschwindigkeit-umrechner/) | Geschwindigkeit Umrechner (km/h, m/s, mph & Knoten) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.45 | [`druck-umrechner`](https://rechenhafen.de/rechner/druck-umrechner/) | Druck Umrechner (bar, PSI, Pascal, hPa, mbar & Torr) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.46 | [`drehzahl-umfangsgeschwindigkeit-rechner`](https://rechenhafen.de/rechner/drehzahl-umfangsgeschwindigkeit-rechner/) | Drehzahl- & Schnittgeschwindigkeits-Rechner (U/min, RPM in m/s & m/min) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 5.47 | [`beleuchtungsstaerke-lux-lumen-rechner`](https://rechenhafen.de/rechner/beleuchtungsstaerke-lux-lumen-rechner/) | Lux- & Lumen-Rechner (Beleuchtungsstärke für Wohn- & Arbeitsräume) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 5.48 | [`ohmsches-gesetz-rechner`](https://rechenhafen.de/rechner/ohmsches-gesetz-rechner/) | Ohmsches-Gesetz-Rechner (U = R · I) | statistik-wissenschaft | `src/data/calculators/statistik.ts` | `src/lib/calculators/statistik.ts` | 3 Info |
| 5.49 | [`dezibel-schalldruck-umrechner`](https://rechenhafen.de/rechner/dezibel-schalldruck-umrechner/) | Dezibel- & Schalldruck-Rechner (dB, Lautstärke & Pascal Pa) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 5.50 | [`temperatur-umrechner`](https://rechenhafen.de/rechner/temperatur-umrechner/) | Temperatur-Umrechner (Celsius, Fahrenheit & Kelvin) | einheiten | `src/data/calculators/einheiten.ts` | `src/lib/calculators/einheiten.ts` | 1 Info |

---

## 6.6 Batch 6: Gesundheit, Ernährung, Familie & Schwangerschaft (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 6.1 | [`bmi-rechner`](https://rechenhafen.de/rechner/bmi-rechner/) | BMI-Rechner (Body-Mass-Index) | gesundheit-fitness | `src/data/calculators/gesundheit.ts` | `src/lib/calculators/gesundheit.ts` | 2 Info |
| 6.2 | [`kalorienbedarf-rechner`](https://rechenhafen.de/rechner/kalorienbedarf-rechner/) | Kalorienbedarf-Rechner (Grundumsatz & TDEE) | gesundheit-fitness | `src/data/calculators/gesundheit.ts` | `src/lib/calculators/gesundheit.ts` | 3 Info |
| 6.3 | [`wasserbedarf-rechner`](https://rechenhafen.de/rechner/wasserbedarf-rechner/) | Wasserbedarf-Rechner (Tägliche Trinkmenge) | gesundheit-fitness | `src/data/calculators/gesundheit.ts` | `src/lib/calculators/gesundheit.ts` | 2 Info |
| 6.4 | [`laufpace-rechner`](https://rechenhafen.de/rechner/laufpace-rechner/) | Laufpace-Rechner (Minuten pro Kilometer & Tempo) | gesundheit-fitness | `src/data/calculators/gesundheit.ts` | `src/lib/calculators/gesundheit.ts` | 3 Info |
| 6.5 | [`grundumsatz-bmr-rechner`](https://rechenhafen.de/rechner/grundumsatz-bmr-rechner/) | Grundumsatz-Rechner (BMR) (BMR nach Mifflin-St. Jeor & Harris-Benedict) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.6 | [`leistungsumsatz-pal-rechner`](https://rechenhafen.de/rechner/leistungsumsatz-pal-rechner/) | Leistungsumsatz- & PAL-Faktor-Rechner (Gesamtenergiebedarf) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.7 | [`makronaehrstoff-verteilung-rechner`](https://rechenhafen.de/rechner/makronaehrstoff-verteilung-rechner/) | Makronährstoff-Rechner (Gramm Eiweiß, Kohlenhydrate & Fette) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.8 | [`idealgewicht-creff-rechner`](https://rechenhafen.de/rechner/idealgewicht-creff-rechner/) | Idealgewicht-Rechner (nach Creff-Formel & Broca-Index) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.9 | [`koerperfettanteil-navy-rechner`](https://rechenhafen.de/rechner/koerperfettanteil-navy-rechner/) | Körperfettanteil-Rechner (KFA) (US Navy KFA-Methode) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 5 Info |
| 6.10 | [`waist-to-hip-ratio-rechner`](https://rechenhafen.de/rechner/waist-to-hip-ratio-rechner/) | WHR-Rechner (Taille-Hüft-Verhältnis) (Taille-Hüft-Verhältnis & Bauchfett-Risiko) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.11 | [`waist-to-height-ratio-rechner`](https://rechenhafen.de/rechner/waist-to-height-ratio-rechner/) | WHtR-Rechner (Taille zu Körpergröße) (Taille zu Körpergröße & Bauchumfang) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.12 | [`maximalpuls-hfmax-rechner`](https://rechenhafen.de/rechner/maximalpuls-hfmax-rechner/) | Maximalpuls-Rechner (HFmax) (HFmax & Herzfrequenzzonen nach Karvonen) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.13 | [`vo2max-cooper-test-rechner`](https://rechenhafen.de/rechner/vo2max-cooper-test-rechner/) | VO2max-Rechner (Cooper-Test) (Cooper-Test 12-Minuten-Lauf) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.14 | [`one-rep-max-rechner`](https://rechenhafen.de/rechner/one-rep-max-rechner/) | 1RM-Rechner (One-Rep-Maximalgewicht) (One-Rep-Maximalgewicht nach Epley & Brzycki) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.15 | [`schritt-distanz-kalorien-rechner`](https://rechenhafen.de/rechner/schritt-distanz-kalorien-rechner/) | Schritte-Rechner (Schritte in km & Kalorien) (Schrittlänge, Kilometer & Kalorien) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.16 | [`schlafbedarfs-rechner`](https://rechenhafen.de/rechner/schlafbedarfs-rechner/) | Schlafzyklen- & Schlafbedarfs-Rechner (90-Minuten-Zyklen) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.17 | [`nikotin-rauchstopp-ersparnis-rechner`](https://rechenhafen.de/rechner/nikotin-rauchstopp-ersparnis-rechner/) | Rauchstopp-Rechner (Ersparnis & Gesundheit) (Geldersparnis & Gewonnene Lebenszeit) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.18 | [`koffein-halbwertszeit-rechner`](https://rechenhafen.de/rechner/koffein-halbwertszeit-rechner/) | Koffein-Rechner (Halbwertszeit & Wirkung) (Halbwertszeit, Kaffee & Schlafenszeit) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.19 | [`alkohol-abbau-rechner`](https://rechenhafen.de/rechner/alkohol-abbau-rechner/) | Alkoholabbau-Rechner | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.20 | [`intervallfasten-16-8-rechner`](https://rechenhafen.de/rechner/intervallfasten-16-8-rechner/) | Intervallfasten-Rechner (16:8-Methode) (16:8 Fastenfenster & Essenszeiten) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.21 | [`proteinbedarf-sportler-rechner`](https://rechenhafen.de/rechner/proteinbedarf-sportler-rechner/) | Proteinbedarf-Rechner (Eiweißmenge) (Eiweißmenge nach Sportart & Ziel) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.22 | [`blutdruck-klassifikation-rechner`](https://rechenhafen.de/rechner/blutdruck-klassifikation-rechner/) | Blutdruck-Rechner (WHO-Klassifikation) (Einstufung nach WHO & Hochdruckliga) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.23 | [`puls-trainingszonen-rechner`](https://rechenhafen.de/rechner/puls-trainingszonen-rechner/) | Puls-Trainingszonen-Rechner (Fettverbrennung & Cardio) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.24 | [`schwimmen-kalorienverbrauch-rechner`](https://rechenhafen.de/rechner/schwimmen-kalorienverbrauch-rechner/) | Schwimm-Kalorienrechner (nach Schwimmstil & Bahnen) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.25 | [`radfahren-kalorien-watt-rechner`](https://rechenhafen.de/rechner/radfahren-kalorien-watt-rechner/) | Radfahr-Kalorien- & Watt-Rechner (Fahrrad & Ergometer) | gesundheit-fitness | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.26 | [`geburtstermin-rechner`](https://rechenhafen.de/rechner/geburtstermin-rechner/) | Geburtstermin-Rechner (Naegele-Regel) | familie-schwangerschaft | `src/data/calculators/familie.ts` | `src/lib/calculators/familie.ts` | 1 Info |
| 6.27 | [`fruchtbare-tage-rechner`](https://rechenhafen.de/rechner/fruchtbare-tage-rechner/) | Fruchtbare-Tage-Rechner (Eisprung & Zyklus) | familie-schwangerschaft | `src/data/calculators/familie.ts` | `src/lib/calculators/familie.ts` | 1 Info |
| 6.28 | [`elterngeld-basis-plus-rechner`](https://rechenhafen.de/rechner/elterngeld-basis-plus-rechner/) | Elterngeld-Rechner (Basiselterngeld & Elterngeld Plus) (Basiselterngeld vs. Elterngeld Plus) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.29 | [`kindergeld-rechner-2026`](https://rechenhafen.de/rechner/kindergeld-rechner-2026/) | Kindergeld- & Kinderfreibetrag-Rechner (Günstigerprüfung) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.30 | [`kinderzuschlag-kiz-rechner`](https://rechenhafen.de/rechner/kinderzuschlag-kiz-rechner/) | Kinderzuschlag-Rechner (KiZ) (KiZ bis 292 € / Monat nach BKKG) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.31 | [`unterhaltsvorschuss-rechner`](https://rechenhafen.de/rechner/unterhaltsvorschuss-rechner/) | Unterhaltsvorschuss-Rechner (UVG) (UVG für Alleinerziehende) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 0 |
| 6.32 | [`duesseldorfer-tabelle-rechner`](https://rechenhafen.de/rechner/duesseldorfer-tabelle-rechner/) | Düsseldorfer-Tabelle-Rechner (Kindesunterhalt) (Kindesunterhalt 2026) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.33 | [`ehegattenunterhalt-trennungsunterhalt-rechner`](https://rechenhafen.de/rechner/ehegattenunterhalt-trennungsunterhalt-rechner/) | Trennungsunterhalt-Rechner (3/7-Methode & Halbteilungsgrundsatz) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.34 | [`schwangerschaftswoche-ssw-rechner`](https://rechenhafen.de/rechner/schwangerschaftswoche-ssw-rechner/) | SSW-Rechner (Schwangerschaftswoche & Trimester) (Aktuelle Schwangerschaftswoche, Tag & Trimester) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.35 | [`mutterschutzfristen-rechner`](https://rechenhafen.de/rechner/mutterschutzfristen-rechner/) | Mutterschutzfristen-Rechner (Fristen 6 Wochen vor & 8 Wochen nach ET) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.36 | [`zykluslaenge-eisprung-rechner`](https://rechenhafen.de/rechner/zykluslaenge-eisprung-rechner/) | Zyklusrechner (Eisprung & Lutealphase bei unregelmäßigem Zyklus) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.37 | [`chinesischer-empfaengniskalender-rechner`](https://rechenhafen.de/rechner/chinesischer-empfaengniskalender-rechner/) | Chinesischer Empfängniskalender (Junge oder Mädchen Prognose) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.38 | [`kindes-endgroesse-rechner`](https://rechenhafen.de/rechner/kindes-endgroesse-rechner/) | Kindes-Endgrößen-Rechner (Target Height nach Tanner & Eltern) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.39 | [`kindersitz-groesse-i-size-rechner`](https://rechenhafen.de/rechner/kindersitz-groesse-i-size-rechner/) | Kindersitz-Rechner (i-Size & Normgruppen) (i-Size UN ECE R129 & Gewichtsgruppen) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.40 | [`windelbudget-rechner`](https://rechenhafen.de/rechner/windelbudget-rechner/) | Windel-Budget-Rechner (Windelanzahl & Kosten bis zum Trockenwerden) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.41 | [`erstausstattung-baby-rechner`](https://rechenhafen.de/rechner/erstausstattung-baby-rechner/) | Baby-Erstausstattungs-Rechner (Kostenplan & Budget) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.42 | [`kita-gebuehren-rechner`](https://rechenhafen.de/rechner/kita-gebuehren-rechner/) | Kita-Gebühren-Rechner (Kostenbeitrag nach Einkommen) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 3 Info |
| 6.43 | [`betreuungsgeld-familiengeld-rechner`](https://rechenhafen.de/rechner/betreuungsgeld-familiengeld-rechner/) | Familiengeld-Rechner (Bayern & Landeserziehungsgeld) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.44 | [`taschengeld-empfehlung-rechner`](https://rechenhafen.de/rechner/taschengeld-empfehlung-rechner/) | Taschengeld-Rechner (Jugendamts-Empfehlung) (Empfehlung der Jugendämter nach Alter) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.45 | [`schulbedarfspaket-bu-t-rechner`](https://rechenhafen.de/rechner/schulbedarfspaket-bu-t-rechner/) | Schulbedarfspaket-Rechner (BuT) (Bildung & Teilhabe BuT 195 €) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.46 | [`kinderkrankentage-kinderkrankengeld-rechner`](https://rechenhafen.de/rechner/kinderkrankentage-kinderkrankengeld-rechner/) | Kinderkrankengeld-Rechner (Kinderkrankentage nach § 45 SGB V) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.47 | [`grosselternzeit-rechner`](https://rechenhafen.de/rechner/grosselternzeit-rechner/) | Großelternzeit-Rechner (Freistellung nach BEEG § 15) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 1 Info |
| 6.48 | [`unterhalt-volljaehrige-kinder-rechner`](https://rechenhafen.de/rechner/unterhalt-volljaehrige-kinder-rechner/) | Unterhalt-für-volljährige-Kinder-Rechner (Studium & eigene Wohnung) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 0 |
| 6.49 | [`ausbildungsunterhalt-bedarfskontrollbetrag-rechner`](https://rechenhafen.de/rechner/ausbildungsunterhalt-bedarfskontrollbetrag-rechner/) | Ausbildungsvergütung-Anrechnungs-Rechner (Kindesunterhalt) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |
| 6.50 | [`kinderbetreuungskosten-absetzen-rechner`](https://rechenhafen.de/rechner/kinderbetreuungskosten-absetzen-rechner/) | Kinderbetreuungskosten-Rechner (§ 10 Abs. 1 Nr. 5 EStG Steuer) | familie-schwangerschaft | `src/data/calculators/extra/gesundheitFamilie.ts` | `src/data/calculators/extra/gesundheitFamilie.ts` | 2 Info |

---

## 6.7 Batch 7: Kochen, Backen, Maßeinheiten & Angewandte Statistik (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 7.1 | [`portionsrechner`](https://rechenhafen.de/rechner/portionsrechner/) | Portionsrechner für Rezepte | kochen-backen | `src/data/calculators/kochen.ts` | `src/lib/calculators/kochen.ts` | 3 Info |
| 7.2 | [`backform-umrechner`](https://rechenhafen.de/rechner/backform-umrechner/) | Backform Umrechner (Springform rund & eckig) | kochen-backen | `src/data/calculators/kochen.ts` | `src/lib/calculators/kochen.ts` | 2 Info |
| 7.3 | [`gramm-in-ml-rechner`](https://rechenhafen.de/rechner/gramm-in-ml-rechner/) | Gramm-in-Milliliter-Rechner (mit Zutatendichte) | kochen-backen | `src/data/calculators/kochen.ts` | `src/lib/calculators/kochen.ts` | 1 Info |
| 7.4 | [`hefe-umrechner`](https://rechenhafen.de/rechner/hefe-umrechner/) | Hefe-Rechner (Frische Hefe in Trockenhefe & Vorteig umrechnen) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.5 | [`essloeffel-teeloeffel-gramm-rechner`](https://rechenhafen.de/rechner/essloeffel-teeloeffel-gramm-rechner/) | Esslöffel- & Teelöffel-in-Gramm-Rechner (EL, TL in g) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.6 | [`cups-in-gramm-rechner`](https://rechenhafen.de/rechner/cups-in-gramm-rechner/) | US-Cups-in-Gramm-Rechner (Amerikanische Cup-Maße in Gramm) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.7 | [`zucker-ersatz-rechner`](https://rechenhafen.de/rechner/zucker-ersatz-rechner/) | Zucker in Erythrit umrechnen (Rechner & Tabelle) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.8 | [`backzeit-temperatur-umluft-oberhitze-rechner`](https://rechenhafen.de/rechner/backzeit-temperatur-umluft-oberhitze-rechner/) | Backofen Umrechner (Umluft in Ober-/Unterhitze & Gasstufe) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.9 | [`fleisch-kerntemperatur-garzeit-rechner`](https://rechenhafen.de/rechner/fleisch-kerntemperatur-garzeit-rechner/) | Fleisch-Kerntemperatur- & Garzeit-Rechner (Rind, Schwein & Geflügel) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.10 | [`pizza-teig-rechner`](https://rechenhafen.de/rechner/pizza-teig-rechner/) | Pizzateig-Rechner (Hydratation 60–70 %, Mehl, Wasser & Hefe) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 4 Info |
| 7.11 | [`brot-backen-baeckermass-rechner`](https://rechenhafen.de/rechner/brot-backen-baeckermass-rechner/) | Bäckerprozente-Rechner (Bäckermaß für Brot & Teigausbeute TA) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 4 Info |
| 7.12 | [`alkohol-verkochungs-rechner`](https://rechenhafen.de/rechner/alkohol-verkochungs-rechner/) | Alkohol beim Kochen & Backen Rechner (Verdampfung in Saucen) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 3 Info |
| 7.13 | [`sauerteig-anstellgut-rechner`](https://rechenhafen.de/rechner/sauerteig-anstellgut-rechner/) | Sauerteig-Rechner (Anstellgut füttern & Sauerteigführung 1:1:1) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.14 | [`marmelade-geliermittel-rechner`](https://rechenhafen.de/rechner/marmelade-geliermittel-rechner/) | Marmeladen- & Gelierzucker-Rechner (1:1, 2:1 & 3:1 Gelierzucker) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.15 | [`kaffee-wasser-verhaeltnis-rechner`](https://rechenhafen.de/rechner/kaffee-wasser-verhaeltnis-rechner/) | Kaffee-Rechner (Kaffeemehl nach Tassenanzahl & Brühverhältnis) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.16 | [`cocktail-alkoholgehalt-rechner`](https://rechenhafen.de/rechner/cocktail-alkoholgehalt-rechner/) | Cocktail-Alkoholgehalt-Rechner (Vol.-% & Gramm reiner Alkohol) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 5 Info |
| 7.17 | [`salz-lake-poekel-rechner`](https://rechenhafen.de/rechner/salz-lake-poekel-rechner/) | Salzlake- & Pökel-Rechner (Lakegehalt in % & Nasspökeln) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.18 | [`frittieroel-temperatur-rauchpunkt-rechner`](https://rechenhafen.de/rechner/frittieroel-temperatur-rauchpunkt-rechner/) | Frittieröl- & Rauchpunkt-Rechner (Öl-Hitzebeständigkeit & Braten) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.19 | [`fondue-raclette-mengen-rechner`](https://rechenhafen.de/rechner/fondue-raclette-mengen-rechner/) | Raclette- & Fondue-Mengen-Rechner (Käse, Fleisch & Beilagen p.P.) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.20 | [`kuehlschrank-haltbarkeit-rechner`](https://rechenhafen.de/rechner/kuehlschrank-haltbarkeit-rechner/) | Kühlschrank-Haltbarkeits-Rechner (Lagerdauer geöffneter Lebensmittel) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 0 |
| 7.21 | [`tee-ziehzeit-temperatur-rechner`](https://rechenhafen.de/rechner/tee-ziehzeit-temperatur-rechner/) | Tee-Ziehzeit- & Temperatur-Rechner (Grüner, Schwarzer & Kräutertee) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.22 | [`kalorien-rezept-rechner`](https://rechenhafen.de/rechner/kalorien-rezept-rechner/) | Rezept-Kalorien-Rechner (Gesamtkalorien & Makros pro Portion) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 4 Info |
| 7.23 | [`schokolade-temperieren-rechner`](https://rechenhafen.de/rechner/schokolade-temperieren-rechner/) | Schokolade-Temperieren-Rechner (Impfmethode & Kuvertüre-Temperaturen) | kochen-backen | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.24 | [`gewicht-masse-umrechner`](https://rechenhafen.de/rechner/gewicht-masse-umrechner/) | Gewicht Umrechner (kg, g, Pfund lbs, Unzen oz & Tonnen) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.25 | [`zeit-umrechner`](https://rechenhafen.de/rechner/zeit-umrechner/) | Zeit Umrechner (Sekunden, Minuten, Stunden, Tage & Wochen) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.26 | [`schuhe-kleidergroessen-umrechner`](https://rechenhafen.de/rechner/schuhe-kleidergroessen-umrechner/) | Schuhgrößen Umrechner (EU, US, UK & Fußlänge in cm) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.27 | [`ringgroesse-umrechner`](https://rechenhafen.de/rechner/ringgroesse-umrechner/) | Ringgröße Umrechner (EU-Umfang in mm, US, UK & Durchmesser) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.28 | [`viskositaet-umrechner`](https://rechenhafen.de/rechner/viskositaet-umrechner/) | Viskosität Umrechner (Dynamische mPa·s / cP & Kinematische cSt) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.29 | [`radioaktivitaet-strahlendosis-rechner`](https://rechenhafen.de/rechner/radioaktivitaet-strahlendosis-rechner/) | Radioaktivitäts- & Strahlendosis-Rechner (Bq, Ci, Sievert & Gray) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.30 | [`daten-speicher-umrechner`](https://rechenhafen.de/rechner/daten-speicher-umrechner/) | Datenspeicher Umrechner (Byte, KB, MB, GB, TB & Kibibyte) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.31 | [`datenrate-bandbreite-umrechner`](https://rechenhafen.de/rechner/datenrate-bandbreite-umrechner/) | Datenrate- & Downloadzeit-Rechner (Mbit/s in MB/s & Download-Dauer) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 2 Info |
| 7.32 | [`roemische-zahlen-umrechner`](https://rechenhafen.de/rechner/roemische-zahlen-umrechner/) | Römische Zahlen Umrechner (Dezimal in Römisch & Römisch in Dezimal) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.33 | [`binaer-hex-dezimal-umrechner`](https://rechenhafen.de/rechner/binaer-hex-dezimal-umrechner/) | Binär & Hexadezimal Umrechner (Dezimal, Dual & Hex-Code) | einheiten | `src/data/calculators/extra/einheitenKochen.ts` | `src/data/calculators/extra/einheitenKochen.ts` | 1 Info |
| 7.34 | [`customer-lifetime-value-clv-rechner`](https://rechenhafen.de/rechner/customer-lifetime-value-clv-rechner/) | CLV-Rechner: Kundenwert berechnen | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 7.35 | [`churn-rate-rechner`](https://rechenhafen.de/rechner/churn-rate-rechner/) | Churn-Rate-Rechner: Kundenabwanderungsquote berechnen | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 3 Info |
| 7.36 | [`lead-conversion-rate-rechner`](https://rechenhafen.de/rechner/lead-conversion-rate-rechner/) | Conversion-Rate-Rechner: Leads & Verkäufe berechnen | business | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 3 Info |
| 7.37 | [`notendurchschnitt-rechner`](https://rechenhafen.de/rechner/notendurchschnitt-rechner/) | Notendurchschnitt-Rechner (Schulnoten & Uni) | statistik-wissenschaft | `src/data/calculators/statistik.ts` | `src/lib/calculators/statistik.ts` | 0 |
| 7.38 | [`standardabweichung-rechner`](https://rechenhafen.de/rechner/standardabweichung-rechner/) | Standardabweichung- & Varianz-Rechner | statistik-wissenschaft | `src/data/calculators/statistik.ts` | `src/lib/calculators/statistik.ts` | 0 |
| 7.39 | [`mittelwert-median-modus-rechner`](https://rechenhafen.de/rechner/mittelwert-median-modus-rechner/) | Mittelwert-, Median- & Modus-Rechner | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 5 Info |
| 7.40 | [`durchschnittsrechner`](https://rechenhafen.de/rechner/durchschnittsrechner/) | Durchschnittsrechner (Arithmetisches Mittel & Median) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 0 |
| 7.41 | [`varianz-standardabweichung-stichprobe-rechner`](https://rechenhafen.de/rechner/varianz-standardabweichung-stichprobe-rechner/) | Varianz- & Standardabweichungs-Rechner | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 5 Info |
| 7.42 | [`quartile-box-plot-rechner`](https://rechenhafen.de/rechner/quartile-box-plot-rechner/) | Quartile- & Box-Plot-Rechner (IQR) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 7 Info |
| 7.43 | [`perzentil-rechner`](https://rechenhafen.de/rechner/perzentil-rechner/) | Perzentil-Rechner (Rang & Quantil) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 7 Info |
| 7.44 | [`korrelationskoeffizient-rechner`](https://rechenhafen.de/rechner/korrelationskoeffizient-rechner/) | Korrelationskoeffizient-Rechner (Pearson r) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 10 Info |
| 7.45 | [`lineare-regression-rechner`](https://rechenhafen.de/rechner/lineare-regression-rechner/) | Lineare-Regression-Rechner (y = mx + b & R²) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 8 Info |
| 7.46 | [`kovarianz-rechner`](https://rechenhafen.de/rechner/kovarianz-rechner/) | Kovarianz-Rechner (Cov(X, Y)) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 8 Info |
| 7.47 | [`variationskoeffizient-rechner`](https://rechenhafen.de/rechner/variationskoeffizient-rechner/) | Variationskoeffizient-Rechner (CV in %) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 7.48 | [`geometrisches-mittel-rechner`](https://rechenhafen.de/rechner/geometrisches-mittel-rechner/) | Geometrisches-Mittel-Rechner (Wachstumsraten) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 4 Info |
| 7.49 | [`harmonisches-mittel-rechner`](https://rechenhafen.de/rechner/harmonisches-mittel-rechner/) | Harmonisches-Mittel-Rechner (Geschwindigkeiten & Kurse) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |
| 7.50 | [`kombinatorik-n-ueber-k-rechner`](https://rechenhafen.de/rechner/kombinatorik-n-ueber-k-rechner/) | Kombinatorik-Rechner (n über k & Permutationen) | statistik-wissenschaft | `src/data/calculators/extra/businessStatistik.ts` | `src/data/calculators/extra/businessStatistik.ts` | 2 Info |

---

## 6.8 Batch 8: Datum, Zeit, Kalender & Angewandte Arithmetik (50 Rechner)

| Nr. | Slug | Rechnername | Kategorie | Config-Datei | Berechnungs-Datei | Audit-Befunde |
|:---:|:---|:---|:---|:---|:---|:---:|
| 8.1 | [`altersrechner`](https://rechenhafen.de/rechner/altersrechner/) | Altersrechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.2 | [`alter-in-tagen`](https://rechenhafen.de/rechner/alter-in-tagen/) | Alter-in-Tagen-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.3 | [`lebenszeit-in-stunden`](https://rechenhafen.de/rechner/lebenszeit-in-stunden/) | Lebenszeit-in-Stunden-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.4 | [`alter-in-wochen`](https://rechenhafen.de/rechner/alter-in-wochen/) | Alter-in-Wochen-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.5 | [`alter-in-monaten`](https://rechenhafen.de/rechner/alter-in-monaten/) | Alter-in-Monaten-Rechner (Vollendete & laufende Monate) | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.6 | [`altersunterschied`](https://rechenhafen.de/rechner/altersunterschied/) | Altersunterschieds-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.7 | [`geburtstagsrechner`](https://rechenhafen.de/rechner/geburtstagsrechner/) | Geburtstagsrechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.8 | [`tage-bis-geburtstag`](https://rechenhafen.de/rechner/tage-bis-geburtstag/) | Tage-bis-zum-Geburtstag-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.9 | [`datumsdifferenz`](https://rechenhafen.de/rechner/datumsdifferenz/) | Datumsdifferenz-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.10 | [`wochen-zwischen-daten`](https://rechenhafen.de/rechner/wochen-zwischen-daten/) | Wochen-zwischen-zwei-Daten-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.11 | [`monate-zwischen-daten`](https://rechenhafen.de/rechner/monate-zwischen-daten/) | Monate-zwischen-zwei-Daten-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.12 | [`kalendertage-rechner`](https://rechenhafen.de/rechner/kalendertage-rechner/) | Kalendertage-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.13 | [`arbeitszeitrechner`](https://rechenhafen.de/rechner/arbeitszeitrechner/) | Arbeitszeitrechner (Stempeluhr & Pausen) | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 2 Info |
| 8.14 | [`tage-zwischen-zwei-daten`](https://rechenhafen.de/rechner/tage-zwischen-zwei-daten/) | Tagerechner: Tage zwischen zwei Daten berechnen | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.15 | [`tage-bis-weihnachten`](https://rechenhafen.de/rechner/tage-bis-weihnachten/) | Tage bis Weihnachten: Countdown bis Heiligabend | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.16 | [`arbeitstage-rechner`](https://rechenhafen.de/rechner/arbeitstage-rechner/) | Arbeitstage-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.17 | [`werktage-rechner`](https://rechenhafen.de/rechner/werktage-rechner/) | Werktage-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.18 | [`datum-plus-tage`](https://rechenhafen.de/rechner/datum-plus-tage/) | Datum-plus-Tage-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.19 | [`datum-minus-tage`](https://rechenhafen.de/rechner/datum-minus-tage/) | Datum-minus-Tage-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.20 | [`schaltjahr-rechner`](https://rechenhafen.de/rechner/schaltjahr-rechner/) | Schaltjahr-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.21 | [`wochenrechner`](https://rechenhafen.de/rechner/wochenrechner/) | Wochenrechner & Kalenderwoche (KW) | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.22 | [`zeitdifferenz-rechner`](https://rechenhafen.de/rechner/zeitdifferenz-rechner/) | Zeitdifferenz-Rechner (Stunden & Minuten) | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.23 | [`stundenrechner`](https://rechenhafen.de/rechner/stundenrechner/) | Stundenrechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 1 Info |
| 8.24 | [`countdown-rechner`](https://rechenhafen.de/rechner/countdown-rechner/) | Countdown-Rechner | datum-zeit | `src/data/calculators/datumZeit.ts` | `src/lib/calculators/datumZeit.ts` | 0 |
| 8.25 | [`renteneintritt-rechner`](https://rechenhafen.de/rechner/renteneintritt-rechner/) | Renteneintritt-Rechner (Regelaltersgrenze 67) | datum-zeit | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.26 | [`dienstjubilaeum-rechner`](https://rechenhafen.de/rechner/dienstjubilaeum-rechner/) | Dienstjubiläum-Rechner (Betriebszugehörigkeit) | datum-zeit | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 0 |
| 8.27 | [`prozentrechner`](https://rechenhafen.de/rechner/prozentrechner/) | Prozentrechner | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.28 | [`prozentuale-veraenderung`](https://rechenhafen.de/rechner/prozentuale-veraenderung/) | Prozentuale-Veränderung-Rechner | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.29 | [`grundwert-rechner`](https://rechenhafen.de/rechner/grundwert-rechner/) | Grundwert-Rechner | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.30 | [`dreisatzrechner`](https://rechenhafen.de/rechner/dreisatzrechner/) | Dreisatzrechner (Proportional & Antiproportional) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 3 Info |
| 8.31 | [`verhaeltnis-rechner`](https://rechenhafen.de/rechner/verhaeltnis-rechner/) | Verhältnis-Rechner (Proportionen A:B = C:D) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 3 Info |
| 8.32 | [`bruchrechner`](https://rechenhafen.de/rechner/bruchrechner/) | Bruchrechner (Brüche addieren, subtrahieren & kürzen) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 4 Info |
| 8.33 | [`dreieckrechner`](https://rechenhafen.de/rechner/dreieckrechner/) | Dreieck-Rechner (Flächeninhalt & Umfang) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.34 | [`pythagoras-rechner`](https://rechenhafen.de/rechner/pythagoras-rechner/) | Satz-des-Pythagoras-Rechner (a² + b² = c²) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 3 Info |
| 8.35 | [`ggt-rechner`](https://rechenhafen.de/rechner/ggt-rechner/) | ggT-Rechner (Größter gemeinsamer Teiler) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.36 | [`kgv-rechner`](https://rechenhafen.de/rechner/kgv-rechner/) | kgV-Rechner (Kleinstes gemeinsames Vielfaches) | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.37 | [`quadratwurzel-rechner`](https://rechenhafen.de/rechner/quadratwurzel-rechner/) | Quadratwurzel & Wurzel-Rechner | mathematik | `src/data/calculators/mathematik.ts` | `src/lib/calculators/mathematik.ts` | 2 Info |
| 8.38 | [`prozentualer-unterschied-rechner`](https://rechenhafen.de/rechner/prozentualer-unterschied-rechner/) | Prozentualer Unterschied-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.39 | [`prozent-von-prozent-rechner`](https://rechenhafen.de/rechner/prozent-von-prozent-rechner/) | Prozent von Prozent-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 3 Info |
| 8.40 | [`promillerechner`](https://rechenhafen.de/rechner/promillerechner/) | Promillerechner (‰ in % und Betrag) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.41 | [`antiproportionaler-dreisatz-rechner`](https://rechenhafen.de/rechner/antiproportionaler-dreisatz-rechner/) | Antiproportionaler Dreisatz-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 3 Info |
| 8.42 | [`bruch-in-dezimal-rechner`](https://rechenhafen.de/rechner/bruch-in-dezimal-rechner/) | Bruch in Dezimalzahl-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.43 | [`dezimal-in-bruch-rechner`](https://rechenhafen.de/rechner/dezimal-in-bruch-rechner/) | Dezimalzahl in Bruch-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 1 Info |
| 8.44 | [`kubikwurzel-rechner`](https://rechenhafen.de/rechner/kubikwurzel-rechner/) | Kubikwurzel-Rechner (3. Wurzel) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 1 Info |
| 8.45 | [`n-te-wurzel-rechner`](https://rechenhafen.de/rechner/n-te-wurzel-rechner/) | n-te Wurzel-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.46 | [`zehnerpotenzen-rechner`](https://rechenhafen.de/rechner/zehnerpotenzen-rechner/) | Zehnerpotenzen-Rechner (Wissenschaftliche Notation) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 1 Info |
| 8.47 | [`modulo-rechner`](https://rechenhafen.de/rechner/modulo-rechner/) | Modulo-Rechner (Rest bei ganzzahliger Division) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 2 Info |
| 8.48 | [`quersumme-rechner`](https://rechenhafen.de/rechner/quersumme-rechner/) | Quersumme-Rechner (Iterierte Ziffernsumme) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 0 |
| 8.49 | [`hexadezimal-rechner`](https://rechenhafen.de/rechner/hexadezimal-rechner/) | Hexadezimal-Rechner (Hex in Dezimal & Binär) | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 0 |
| 8.50 | [`teiler-vielfache-rechner`](https://rechenhafen.de/rechner/teiler-vielfache-rechner/) | Teiler & Vielfache-Rechner | mathematik | `src/data/calculators/extra/datumMath.ts` | `src/data/calculators/extra/datumMath.ts` | 1 Info |

---

## 7. Backlog: Höhere Statistik & Wissenschaftliche Spezialtests (11 Rechner)

Diese 11 Rechner decken spezialisierte akademische und inferenzstatistische Fragestellungen ab und verbleiben nach Abschluss der 400 Rechner im Backlog:

| Nr. | Slug | Rechnername | Kategorie | Fachliche Begründung |
|:---:|:---|:---|:---|:---||
| B.1 | [`bayes-theorem-rechner`](https://rechenhafen.de/rechner/bayes-theorem-rechner/) | Bayes-Theorem-Rechner (Bedingte Wahrscheinlichkeit) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.2 | [`binomialverteilung-rechner`](https://rechenhafen.de/rechner/binomialverteilung-rechner/) | Binomialverteilungs-Rechner (Bernoulli-Kette) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.3 | [`chi-quadrat-unabhaengigkeitstest-rechner`](https://rechenhafen.de/rechner/chi-quadrat-unabhaengigkeitstest-rechner/) | Chi-Quadrat-Rechner (2x2-Kontingenztafel) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.4 | [`effektstaerke-cohens-d-rechner`](https://rechenhafen.de/rechner/effektstaerke-cohens-d-rechner/) | Effektstärke-Rechner (Cohen's d) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.5 | [`konfidenzintervall-rechner`](https://rechenhafen.de/rechner/konfidenzintervall-rechner/) | Konfidenzintervall-Rechner (Vertrauensbereich) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.6 | [`p-wert-hypothesentest-rechner`](https://rechenhafen.de/rechner/p-wert-hypothesentest-rechner/) | p-Wert-Rechner (Hypothesentest & Z-Test) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.7 | [`poisson-verteilung-rechner`](https://rechenhafen.de/rechner/poisson-verteilung-rechner/) | Poisson-Verteilungs-Rechner (Ereignisrate λ) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.8 | [`stichprobengroesse-rechner`](https://rechenhafen.de/rechner/stichprobengroesse-rechner/) | Stichprobengrößen-Rechner (Umfragen & Studien) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.9 | [`t-test-rechner`](https://rechenhafen.de/rechner/t-test-rechner/) | t-Test-Rechner (Einstichproben-t-Test) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.10 | [`wahrscheinlichkeit-wuerfel-muenze-rechner`](https://rechenhafen.de/rechner/wahrscheinlichkeit-wuerfel-muenze-rechner/) | Würfel & Münze Wahrscheinlichkeitsrechner | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |
| B.11 | [`z-score-normalverteilung-rechner`](https://rechenhafen.de/rechner/z-score-normalverteilung-rechner/) | Z-Score-Rechner (Standardnormalverteilung) | statistik-wissenschaft | Spezialisierter Inferenzstatistik- / Verteilungstest |

---

## 8. Ausführungs- und Qualitätsrichtlinien für jeden Batch (Abschnitte A–I)

Die Arbeit an jedem einzelnen Batch folgt zwingend den etablierten Projektstandards:

### A. Prüfen vor dem Ändern (Verification Before Changing)
- Vor Codeänderungen werden Implementierung, Nutzeroberfläche und interaktives Verhalten im Quelltext und im Browser geprüft.
- Für jeden Befund: Seite, betroffenes Feld, Reproduktionsschritte, Ist-Verhalten, Soll-Verhalten, Evidenzquelle, Schweregrad.
- Echte Fehler klar von redaktionellen Vereinheitlichungen unterscheiden; keine funktionsfähigen Berechnungen grundlos umschreiben.

### B. Korrektheit der Berechnung (Calculation Correctness)
- **Normalfälle & Nullwerte:** Gültige 0-Werte dürfen niemals durch `|| defaultValue` stillschweigend mit Beispielen überschrieben werden.
- **Ungültige Eingaben:** Leere, fehlerhafte, negative oder extreme Eingaben müssen saubere Validierungsfehler liefern.
- **Zahlenformat:** Unterstützung von deutschen Dezimalkommas (`,`) und Punkten.
- **Rundung & Fließkomma:** Keine vorzeitigen Zwischenrundungen; IEEE-754-Präzisionsfehler vermeiden.
- **Referenzregeln:** Sollwerte müssen aus unabhängigen Berechnungen oder Gesetzesformeln stammen, nicht aus der bestehenden Implementierung.

### C. Quellenabhängige Rechner (Source-Dependent Calculators)
- Für Steuer-, Rechts-, Vorsorge-, Finanz-, Bau- und Gesundheitsrechner: Offizielle Primärquellen (BMF, Destatis, BGB, DIN, DVGW, WHO).
- Exakte Quell-URL, Rechtsstand (z. B. 2026), Parameter und Einschränkungen in Hilfetexten oder Methodikbox transparent angeben.

### D. Eingabe- und Ausgabe-Erlebnis (Input & Result Experience)
- Primäres Ergebnis mit Einheit und Kontext immer sofort verständlich.
- Bei ungültiger Eingabe darf kein altes Ergebnis stehenbleiben (Realisierung über den zentralen Validierungszustand in `CalculatorRunner.tsx`).
- Barrierefreiheit: Korrekte Labels, ARIA-Alerts, Keyboard-Fokus, funktionierender Kopier-Schutz bei Fehlern.

### E. Inhalt und Suchintention (Content & Search Intent)
- Titel, H1, Meta-Beschreibung, Einleitung, Formelbox, durchgerechnete Beispiele und FAQs müssen exakt zur Funktionsweise passen.
- Keine Keyword-Wiederholungen oder automatischer KI-Fülltext.

### F. Technische SEO & Discoverability
- Kanonische URLs (`https://rechenhafen.de/rechner/[slug]/`), saubere Breadcrumbs, Sitemap-Eintrag, interne Verlinkung.
- Etablierte Slugs niemals ändern.

### G. Geteilte Komponenten & Performance
- Änderungen an Shared Components (`CalculatorRunner`, `FormattedContent`, `page.tsx`) werden sofort durch Regressionstests aller bisherigen Batches abgesichert.
- Bestehende Tests und Audit-Skripte dürfen nicht gelöscht werden.

### H. Implementierung & Verifizierung
- Volle Testabdeckung (`npm test`), TypeScript-Typcheck (`npx tsc --noEmit`), ESLint (`npm run lint`), vollständiger Produktions-Build (`npm run build`).
- Interaktive Prüfung im Browser.

### I. Auslieferung & Dokumentation
- Aktualisierung des Manifests (`calculator-improvement-manifest.json`) und Erstellung des Batch-Abschlussberichts.
- Clean Commit und Push auf `main`.
