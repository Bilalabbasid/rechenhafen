# RechenHafen Refined Quality Gate Audit Report

**Audit-Datum:** 09.10.2026  
**Geprüfte Rechner:** 421  
**Status:** Evidenzbasierte Prüfung abgeschlossen. Keine automatischen Massenänderungen vorgenommen.

---

## 1. Zusammenfassung der Metriken

- **Betroffene eindeutige Rechner:** 393 von 421
- **Betroffene eindeutige Eingabefelder:** 1043
- **High-Confidence Mängel (Hohe Priorität):** 15
- **Informative Formulierungshinweise (Informational):** 1028
- **Kritische Systemmängel (Critical):** 0
- **Mittlere Auffälligkeiten (Medium):** 0
- **Gesamtzahl Befunde:** 1043

### Top-Betroffene Rechner-Kategorien
1. **statistik-wissenschaft**: 95 Befunde
2. **haushalt-energie**: 93 Befunde
3. **kredit-schulden**: 90 Befunde
4. **wohnen-immobilien**: 85 Befunde
5. **bauen-renovieren**: 85 Befunde

---

## 2. Schweregrad-Übersicht

| Schweregrad | Anzahl Befunde | Kriterien / Bedeutung |
| :--- | :--- | :--- |
| **Critical** | 0 | Defekte interne Links, Redirect-Kollisionen, Rechenabbrüche bei Null-Eingaben |
| **High** | 15 | Ungeklärte Positiv-Defaults bei realem 0-Szenario, fehlende Quellen/Disclaimer in Rechts-/Finanzrechnern |
| **Medium** | 0 | Fehlendes Stand-Jahr, unvollständige Meta-Beschreibungen |
| **Informational** | 1028 | Reine Formulierungsempfehlungen (z. B. Kennzeichnung als „Beispielwert“ / „Richtwert“) |
| **Gesamt** | **1043** | |

---

## 3. Kritische Befunde (Critical) — 0

_Keine kritischen Fehler vorhanden._

---

## 4. High-Confidence Befunde (High) — 15

### 1. [zinseszinsrechner](/rechner/zinseszinsrechner/) — Zinseszinsrechner
- **Feld:** `monthlyContribution`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'monthlyContribution' (Monatliche Sparrate) defaults to 150 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 2. [sondertilgungsrechner](/rechner/sondertilgungsrechner/) — Sondertilgungsrechner
- **Feld:** `yearlySpecialRepayment`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'yearlySpecialRepayment' (Geplante jährliche Sondertilgung) defaults to 5000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 3. [quadratmeterpreis-rechner](/rechner/quadratmeterpreis-rechner/) — Quadratmeterpreis-Rechner (Kaufpreis & Miete)
- **Feld:** `totalPrice`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'totalPrice' (Gesamtsumme (Kaufpreis oder Monatsmiete)) defaults to 360000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 4. [stromkostenrechner](/rechner/stromkostenrechner/) — Stromkostenrechner (Haushalt & kWh-Stromverbrauch)
- **Feld:** `basePricePerMonth`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'basePricePerMonth' (Monatlicher Grundpreis in €) defaults to 12 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 5. [solidaritaetszuschlag-rechner](/rechner/solidaritaetszuschlag-rechner/) — Solidaritätszuschlag-Rechner (SolZ Freigrenze & Milderung)
- **Feld:** `incomeTax`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'incomeTax' (Festgesetzte Einkommensteuer / Lohnsteuer) defaults to 15000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 6. [sozialabgaben-rechner](/rechner/sozialabgaben-rechner/) — Sozialabgaben-Rechner (RV, KV, PV & ALV Beiträge)
- **Feld:** `kvZusatzbeitrag`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'kvZusatzbeitrag' (GKV-Zusatzbeitrag) defaults to 2.5 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 7. [rabattrechner](/rechner/rabattrechner/) — Rabattrechner (Ersparnis & reduzierter Preis)
- **Feld:** `discountPercent`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'discountPercent' (Rabatt in Prozent) defaults to 20 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 8. [finanzielle-freiheit-rechner](/rechner/finanzielle-freiheit-rechner/) — Finanzielle Freiheit-Rechner (FIRE 4%-Regel)
- **Feld:** `currentAssets`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'currentAssets' (Bereits vorhandenes Vermögen) defaults to 60000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 9. [staffelmiete-rechner](/rechner/staffelmiete-rechner/) — Staffelmiete-Rechner (Staffelvereinbarungen nach § 557a BGB)
- **Feld:** `startRent`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'startRent' (Anfangs-Kaltmiete) defaults to 750 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 10. [spekulationssteuer-immobilien-rechner](/rechner/spekulationssteuer-immobilien-rechner/) — Spekulationssteuer-Rechner (Immobilienverkauf § 23 EStG)
- **Feld:** `claimedDepreciation`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'claimedDepreciation' (In Vorjahren steuerlich geltend gemachte AfA) defaults to 25000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 11. [spekulationssteuer-immobilien-rechner](/rechner/spekulationssteuer-immobilien-rechner/) — Spekulationssteuer-Rechner (Immobilienverkauf § 23 EStG)
- **Feld:** `taxRate`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'taxRate' (Persönlicher Grenzsteuersatz) defaults to 42 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 12. [auto-gesamtkosten-rechner](/rechner/auto-gesamtkosten-rechner/) — Auto Gesamtkosten-Rechner (Vollkosten & TCO pro km)
- **Feld:** `taxYearly`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'taxYearly' (KFZ-Steuer pro Jahr) defaults to 140 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 13. [fahrgemeinschaft-sprit-rechner](/rechner/fahrgemeinschaft-sprit-rechner/) — Fahrgemeinschafts-Rechner (Kostenaufteilung pro Mitfahrer)
- **Feld:** `wearSurchargePerKm`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'wearSurchargePerKm' (Verschleiß- & Abnutzungspauschale in Cent/km (üblich 5 - 10 ct/km)) defaults to 6 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 14. [bausteine-mauerwerk-rechner](/rechner/bausteine-mauerwerk-rechner/) — Mauerstein-Bedarfsrechner (Bedarf nach Wandfläche & Steinformat)
- **Feld:** `openingsArea`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'openingsArea' (Abzug für Fenster & Türen) defaults to 3 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.

### 15. [working-capital-rechner](/rechner/working-capital-rechner/) — Working-Capital-Rechner (Nettoumlaufvermögen & Working Capital Ratio)
- **Feld:** `currentAssets`
- **Kategorie:** Input Clarity / Unexplained Positive Default Where Zero Is Valid
- **Problem:** Input 'currentAssets' (Gesamtes Umlaufvermögen (Kasse, Forderungen, Vorräte)) defaults to 180000 where 0 is a valid user situation, but visible context does not indicate that this is an example/assumption or that 0 is permitted.


---

## 5. Mittlere Priorität (Medium) — 0

_Keine Befunde mittlerer Priorität._


---

## 6. Informelle Formulierungsempfehlungen (Informational) — 1028

_Hinweis: Diese Einträge stellen keine Defekte dar, sondern konsistente redaktionelle Vereinheitlichungsempfehlungen für zukünftige Content-Reviews._

- **[arbeitszeitrechner](/rechner/arbeitszeitrechner/)** (`pauseMinutes`): Input 'pauseMinutes' (Pausendauer in Minuten, default: 30) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[arbeitszeitrechner](/rechner/arbeitszeitrechner/)** (`targetHours`): Input 'targetHours' (Tägliche Sollarbeitszeit, default: 8) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[arbeitstage-rechner](/rechner/arbeitstage-rechner/)** (`hoursPerDay`): Input 'hoursPerDay' (Arbeitsstunden pro Tag, default: 8) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[datum-plus-tage](/rechner/datum-plus-tage/)** (`days`): Input 'days' (Hinzuzufügende Tage, default: 14) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[datum-minus-tage](/rechner/datum-minus-tage/)** (`days`): Input 'days' (Abzuziehende Tage, default: 30) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[schaltjahr-rechner](/rechner/schaltjahr-rechner/)** (`year`): Input 'year' (Kalenderjahr, default: 2026) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[zeitdifferenz-rechner](/rechner/zeitdifferenz-rechner/)** (`pauseMinutes`): Input 'pauseMinutes' (Pause in Minuten, default: 30) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[stundenrechner](/rechner/stundenrechner/)** (`pauseMinutes`): Input 'pauseMinutes' (Pause, default: 45) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[prozentrechner](/rechner/prozentrechner/)** (`percent`): Input 'percent' (Prozentsatz bzw. Wert (X), default: 19) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[prozentrechner](/rechner/prozentrechner/)** (`base`): Input 'base' (Grundwert / Bezugsgröße (Y), default: 250) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[prozentuale-veraenderung](/rechner/prozentuale-veraenderung/)** (`oldValue`): Input 'oldValue' (Ursprünglicher Wert (Alt), default: 120) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[prozentuale-veraenderung](/rechner/prozentuale-veraenderung/)** (`newValue`): Input 'newValue' (Neuer Wert (Neu), default: 150) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[grundwert-rechner](/rechner/grundwert-rechner/)** (`part`): Input 'part' (Gegebener Prozentwert (W), default: 45) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[grundwert-rechner](/rechner/grundwert-rechner/)** (`percent`): Input 'percent' (Dazugehöriger Prozentsatz (p), default: 15) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[dreisatzrechner](/rechner/dreisatzrechner/)** (`a1`): Input 'a1' (Ausgangsgröße A (z.B. 4 Arbeiter / 5 Äpfel), default: 4) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[dreisatzrechner](/rechner/dreisatzrechner/)** (`b1`): Input 'b1' (Zugehörige Größe B (z.B. 12 Stunden / 10 Euro), default: 12) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[dreisatzrechner](/rechner/dreisatzrechner/)** (`a2`): Input 'a2' (Neue Größe A (z.B. 6 Arbeiter / 8 Äpfel), default: 6) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[verhaeltnis-rechner](/rechner/verhaeltnis-rechner/)** (`a`): Input 'a' (Wert A, default: 16) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[verhaeltnis-rechner](/rechner/verhaeltnis-rechner/)** (`b`): Input 'b' (Wert B, default: 9) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[verhaeltnis-rechner](/rechner/verhaeltnis-rechner/)** (`c`): Input 'c' (Wert C, default: 1920) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[bruchrechner](/rechner/bruchrechner/)** (`num1`): Input 'num1' (Zähler Bruch 1, default: 3) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[bruchrechner](/rechner/bruchrechner/)** (`den1`): Input 'den1' (Nenner Bruch 1, default: 4) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[bruchrechner](/rechner/bruchrechner/)** (`num2`): Input 'num2' (Zähler Bruch 2, default: 2) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[bruchrechner](/rechner/bruchrechner/)** (`den2`): Input 'den2' (Nenner Bruch 2, default: 5) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[dreieckrechner](/rechner/dreieckrechner/)** (`baseG`): Input 'baseG' (Grundseite (g) in cm, default: 10) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[dreieckrechner](/rechner/dreieckrechner/)** (`heightH`): Input 'heightH' (Höhe (h) in cm, default: 6) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[pythagoras-rechner](/rechner/pythagoras-rechner/)** (`sideA`): Input 'sideA' (Seite a, default: 3) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[pythagoras-rechner](/rechner/pythagoras-rechner/)** (`sideB`): Input 'sideB' (Seite b, default: 4) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[pythagoras-rechner](/rechner/pythagoras-rechner/)** (`sideC`): Input 'sideC' (Seite c (Hypotenuse), default: 5) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.
- **[ggt-rechner](/rechner/ggt-rechner/)** (`num1`): Input 'num1' (Erste Zahl (A), default: 24) could benefit from explicit 'Beispielwert' or 'Richtwert' wording.

_... und 998 weitere informative Hinweise (vollständig in `audit-report.json`)._
