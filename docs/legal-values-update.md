# Jährlicher Aktualisierungsleitfaden für gesetzliche Rechenwerte auf RechenHafen.de

Dieser Leitfaden dokumentiert den verbindlichen Prozess zur Prüfung und Aktualisierung aller rechtlich und steuerlich regulierten Rechengrößen auf RechenHafen.de.

---

## 1. Grundsatz: Single Source of Truth

Alle gesetzlichen und behördlich festgelegten Rechenwerte werden zentral im Verzeichnis `src/legal/de/` gepflegt:
- `src/legal/de/types.ts`: Typdefinitionen (`LegalConstant<T>`, `GermanLegalValues`)
- `src/legal/de/2026.ts`: Werte für das laufende Jahr 2026
- `src/legal/de/2025.ts`: Werte für das Vorjahr 2025
- `src/legal/de/index.ts`: Standard-Export und `getLegalValues(year)`

**Regel:** Kein Rechner darf gesetzliche Werte hardcodieren. Rechner importieren aus `@/legal/de` oder greifen auf `getLegalValues(year)` zurück.

---

## 2. Termine für Aktualisierungszyklen

### A. Turnus zum 1. Januar (Hauptzyklus)
Zum 1. Januar eines jeden Kalenderjahres treten regelmäßig neue Steuergesetze und Sozialversicherungsverordnungen in Kraft. Die Prüfung erfolgt im **November/Dezember** des Vorjahres, sobald die Bundesratszustimmung und Verkündung im Bundesgesetzblatt (BGBl.) vorliegt.

Zu prüfende Werte:
1. **Einkommensteuertarif (§ 32a EStG):**
   - Grundfreibetrag
   - Eckwerte der Zonen 1 bis 5
   - Formel-Koeffizienten (Zone 2 und Zone 3) und Abzugskonstanten
   - Solidaritätszuschlag-Freigrenze (§ 3 SolzG)
   - Kinderfreibetrag und BEA-Freibetrag (§ 32 Abs. 6 EStG)
   - Kindergeld (§ 66 EStG / BKKG)
2. **Sozialversicherung (Sozialversicherungs-Rechengrößenverordnung):**
   - Beitragsbemessungsgrenze Renten-/Arbeitslosenversicherung (bundeseinheitlich)
   - Beitragsbemessungsgrenze Kranken-/Pflegeversicherung
   - Jahresarbeitsentgeltgrenze / Versicherungspflichtgrenze (JAEG, § 6 Abs. 6 SGB V)
   - Durchschnittlicher GKV-Zusatzbeitragssatz (§ 242a Abs. 2 SGB V, Bekanntmachung BMG im Bundesanzeiger Anfang November)
   - PV-Beitragssatz, Kinderlosen-Zuschlag und Abschläge nach Kinderzahl (§ 55 SGB XI)
3. **Arbeit & Geringfügigkeit:**
   - Gesetzlicher Mindestlohn pro Zeitstunde (§ 1 MiLoG, Mindestlohnanpassungsverordnung)
   - Geringfügigkeitsgrenze (Minijob-Grenze nach § 8 Abs. 1a SGB IV: `Mindestlohn × 130 ÷ 3`, aufgerundet)
   - Faktor F für den Übergangsbereich (Bekanntmachung BMAS nach § 20 Abs. 2 SGB IV)
   - Umlagesätze der Minijob-Zentrale (U1, U2, Insolvenzgeldumlage)
4. **Bürgergeld & Pauschalen:**
   - Bürgergeld-Regelbedarfe (Regelbedarfsstufen 1 bis 6, BMAS-Verordnung)
   - Entfernungspauschale (§ 9 Abs. 1 Satz 3 Nr. 4 EStG)
   - Arbeitnehmer-Pauschbetrag (§ 9a EStG)
   - Sparer-Pauschbetrag (§ 20 Abs. 9 EStG)
   - CO2-Festpreis für Brennstoffe (§ 10 BEHG)

### B. Turnus zum 1. Juli (Halbjahreszyklus)
Zum 1. Juli ändern sich üblicherweise:
1. **Pfändungsfreigrenzen (§ 850c ZPO):**
   - Pfändungsfreigrenzenbekanntmachung des Bundesministeriums der Justiz im Bundesgesetzblatt
2. **Rentenanpassung (Rentenwert):**
   - Verordnung zur Bestimmung der Rentenwerte zum 1. Juli
3. **Düsseldorfer Tabelle:**
   - Die Leitlinien des OLG Düsseldorf werden in der Regel zum 1. Januar aktualisiert, gelegentlich auch zum 1. Juli bei unterjährigen Unterhaltsrechtsreformen.

---

## 3. Offizielle Quellen und Fundstellen

| Rechengröße | Gesetz / Verordnung | Amtliche Quelle |
| :--- | :--- | :--- |
| Einkommensteuer, SolZ, Freibeträge | EStG, SolzG | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32a.html), Bundesfinanzministerium (BMF) |
| Lohnsteuer-Programmablaufpläne | § 39b EStG | [bmf-steuerrechner.de](https://www.bmf-steuerrechner.de) |
| Rechengrößen der Sozialversicherung | Sozialversicherungs-Rechengrößenverordnung | [bmas.de](https://www.bmas.de), BGBl. |
| Durchschnittlicher GKV-Zusatzbeitrag | § 242a Abs. 2 SGB V | Bundesanzeiger (BAnz), Bundesgesundheitsministerium (BMG) |
| Mindestlohn | Mindestlohngesetz (MiLoG), MiLoV | [gesetze-im-internet.de/milog](https://www.gesetze-im-internet.de/milog/), BMAS |
| Minijob-Grenze & Umlagen | § 8 SGB IV, Satzung | [minijob-zentrale.de](https://www.minijob-zentrale.de) |
| Bürgergeld-Regelsätze | § 20 SGB II | [gesetze-im-internet.de/sgb_2](https://www.gesetze-im-internet.de/sgb_2/__20.html), BMAS |
| Pfändungsfreigrenzen | § 850c ZPO | [gesetze-im-internet.de/zpo](https://www.gesetze-im-internet.de/zpo/__850c.html), BMJ |
| Düsseldorfer Tabelle | Leitlinien Unterhaltsrecht | [olg-duesseldorf.nrw.de](https://www.olg-duesseldorf.nrw.de) |

---

## 4. Schritt-für-Schritt-Aktualisierungsprozess

1. **Neue Jahresdatei anlegen:**
   - Bei Jahreswechsel: Neue Datei `src/legal/de/<NEUES_JAHR>.ts` erstellen (z. B. `2027.ts`), basierend auf `GermanLegalValues`.
   - `src/legal/de/index.ts` aktualisieren: Neues Jahr in `SUPPORTED_LEGAL_YEARS` aufnehmen und als Standard (`LEGAL_VALUES`) setzen.
2. **Jede Konstante mit Quelle belegen:**
   - `law`: Genaue Norm angeben (z. B. `§ 32a Abs. 1 EStG`).
   - `sourceUrl`: Direkter HTTPS-Tiefenlink zur Primärquelle.
   - `validFrom`: Gültigkeitsdatum (z. B. `2027-01-01`).
   - `verified`: Auf `true` setzen, sobald die amtliche Quelle verifiziert wurde.
   - `checkedAt`: Echtes Datum der Prüfung eintragen (z. B. `2027-01-02`).
3. **Automatisierte Schutztests ausführen:**
   ```bash
   npx vitest run src/__tests__/legal-values-guard.test.ts
   npx vitest run src/__tests__/steuern-gehalt.test.ts
   npx vitest run src/__tests__/minijob-midijob-2026.test.ts
   ```
4. **Gesamte Testsuite & Build prüfen:**
   ```bash
   npx vitest run
   npm run build
   ```
5. **Änderungsprotokoll und Rechtsstand:**
   - `rechtsstand` in den betroffenen Rechnern aktualisieren.
   - Änderung im öffentlichen Änderungsprotokoll unter `/methodik/` vermerken.
