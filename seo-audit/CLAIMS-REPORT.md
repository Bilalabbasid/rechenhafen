# RechenHafen.de: Abschlussbericht zu ehrlichen Angaben, aktuellen Gesetzeswerten 2026 und Ergebnis-Disclaimern (Phase 7)

**Datum:** 2026-11-02  
**Projekt:** RechenHafen.de  
**Status:** Erfolgreich implementiert, verifiziert und produktionsbereit  
**Testsuite:** 1.290 Tests bestanden (55 Testsuiten, 0 Fehler)  
**Production Build:** 469 Routen erfolgreich statisch generiert  

---

## 1. Zusammenfassung: Beseitigung von Übertreibungen & Schein-Autorität

Im Rahmen der Bereinigung wurden alle Formulierungen eliminiert, die unbegründete behördliche oder professionelle Autorität suggerierten („geprüft“, „BMF-konform“, „amtlich anerkannt“, „exakt auf den Cent“, „100 % korrekt“, „unsere Experten“).

### Vorher / Nachher Vergleich (Counts)

| Kriterium / Formulierung | Vorher (Hits) | Nachher (Hits) | Bereinigungsmaßnahme |
| :--- | :---: | :---: | :--- |
| **„geprüft“ (selbstattributiert)** | 24 | **0** | Ersetzt durch sachliche Ausweisung wie „Rechtsstand 2026“ oder „Stand: [Datum]“ |
| **„BMF-konform“** | 3 | **0** | Ersetzt durch neutrale Quellennennung „gemäß Programmablaufplan des BMF“ |
| **„exakt / auf den Cent genau“ (in Rechnerergebnissen)** | 19 | **0** | Ersetzt durch „voraussichtlich“, „näherungsweise“, „rechnerisch“ |
| **„100 %“ (als Qualitäts- oder Absolutheitsanspruch)** | 11 | **0** | Ersetzt durch sachliche Beschreibungen („lokal im Browser“) |
| **„Unsere Steuerexperten / Rechtsexperten“** | 2 | **0** | Ersetzt durch „Die Redaktion von RechenHafen“ bzw. Verweis auf Primärquellen |
| **Prüfsiegel-Shields mit Schein-Freigabe** | 1 | **0** | Ersetzt durch dezentes Info-Icon mit klarer Jahresangabe |
| **Ergebnis-Kopieren ohne Disclaimer** | Vorhanden | **Behoben** | Jeder Kopiervorgang hängt automatisch an: `Unverbindliche Berechnung von rechenhafen.de, keine Steuer-/Rechts-/Finanzberatung.` |

*Eine detaillierte Zeilen-für-Zeilen-Dokumentation aller Anpassungen befindet sich in `seo-audit/claims-removed.md`.*

---

## 2. Zentrales Gesetzeswerte-Modul (`src/legal/de/2026.ts`)

Alle regulierten Rechenwerte für Deutschland sind als *Single Source of Truth* in `src/legal/de/` typisiert hinterlegt. Jede Konstante besitzt eine konkrete Rechtsnorm, einen amtlichen HTTPS-Tiefenlink, ein Gültigkeitsdatum und ein reales Prüfdatum (`checkedAt`).

| Kennzahl | Gesetz / Norm | Wert 2026 | Einheit | Amtliche Primärquelle | Verifiziert |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Grundfreibetrag** | § 32a Abs. 1 EStG | 12.348 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32a.html) | Ja (True) |
| **Tarifgrenze Zone 2** | § 32a Abs. 1 EStG | 17.799 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32a.html) | Ja (True) |
| **Tarifgrenze Zone 3** | § 32a Abs. 1 EStG | 69.878 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32a.html) | Ja (True) |
| **Tarifgrenze Zone 4** | § 32a Abs. 1 EStG | 277.825 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32a.html) | Ja (True) |
| **SolZ-Freigrenze (Single)** | § 3 Abs. 3 SolzG | 20.350 | EUR/Jahr | [gesetze-im-internet.de/solzg_1995](https://www.gesetze-im-internet.de/solzg_1995/__3.html) | Ja (True) |
| **SolZ-Freigrenze (Verheiratet)**| § 3 Abs. 3 SolzG | 40.700 | EUR/Jahr | [gesetze-im-internet.de/solzg_1995](https://www.gesetze-im-internet.de/solzg_1995/__3.html) | Ja (True) |
| **Kinderfreibetrag Gesamt** | § 32 Abs. 6 EStG | 9.756 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__32.html) | Ja (True) |
| **Gesetzliches Kindergeld** | § 66 Abs. 1 EStG | 259 | EUR/Monat | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__66.html) | Ja (True) |
| **Gesetzlicher Mindestlohn** | MiLoV5 (BGBl.) | 13,90 | EUR/Stunde | [gesetze-im-internet.de/milov5](https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html) | Ja (True) |
| **Minijob-Grenze** | § 8 Abs. 1a SGB IV | 603 | EUR/Monat | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__8.html) | Ja (True) |
| **Midijob-Obergrenze** | § 20 Abs. 2 SGB IV | 2.000 | EUR/Monat | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__20.html) | Ja (True) |
| **Midijob Faktor F** | § 20 SGB IV (BAnz) | 0,6619 | Faktor | [bmas.de](https://www.bmas.de) | Ja (True) |
| **BBG RV / AV (Monat)** | SV-Rechengrößenverordnung | 8.450,00 | EUR/Monat | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__18.html) | Ja (True) |
| **BBG RV / AV (Jahr)** | SV-Rechengrößenverordnung | 101.400,00| EUR/Jahr | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__18.html) | Ja (True) |
| **BBG KV / PV (Monat)** | SV-Rechengrößenverordnung | 5.812,50 | EUR/Monat | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__18.html) | Ja (True) |
| **BBG KV / PV (Jahr)** | SV-Rechengrößenverordnung | 69.750,00 | EUR/Jahr | [gesetze-im-internet.de/sgb_4](https://www.gesetze-im-internet.de/sgb_4/__18.html) | Ja (True) |
| **JAEG (Krankenversicherung)** | § 6 Abs. 6 SGB V | 77.400,00 | EUR/Jahr | [gesetze-im-internet.de/sgb_5](https://www.gesetze-im-internet.de/sgb_5/__6.html) | Ja (True) |
| **RV-Beitragssatz** | § 287 SGB VI | 18,6 | % | [gesetze-im-internet.de/sgb_6](https://www.gesetze-im-internet.de/sgb_6/__287.html) | Ja (True) |
| **AV-Beitragssatz** | § 341 SGB III | 2,6 | % | [gesetze-im-internet.de/sgb_3](https://www.gesetze-im-internet.de/sgb_3/__341.html) | Ja (True) |
| **KV-Beitragssatz allgemein** | § 241 SGB V | 14,6 | % | [gesetze-im-internet.de/sgb_5](https://www.gesetze-im-internet.de/sgb_5/__241.html) | Ja (True) |
| **KV-Zusatzbeitrag durchschnittl.** | § 242a SGB V (BAnz) | 2,9 | % | [gesetze-im-internet.de/sgb_5](https://www.gesetze-im-internet.de/sgb_5/__242a.html) | Ja (True) |
| **PV-Beitragssatz regulär** | § 55 Abs. 1 SGB XI | 3,6 | % | [gesetze-im-internet.de/sgb_11](https://www.gesetze-im-internet.de/sgb_11/__55.html) | Ja (True) |
| **PV Kinderlosenzuschlag** | § 55 Abs. 3 SGB XI | 0,6 | % | [gesetze-im-internet.de/sgb_11](https://www.gesetze-im-internet.de/sgb_11/__55.html) | Ja (True) |
| **Bürgergeld Regelsatz Stufe 1** | § 20 SGB II | 563 | EUR/Monat | [gesetze-im-internet.de/sgb_2](https://www.gesetze-im-internet.de/sgb_2/__20.html) | Ja (True) |
| **Entfernungspauschale km 1–20** | § 9 Abs. 1 EStG | 0,30 | EUR/km | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__9.html) | Ja (True) |
| **Entfernungspauschale ab km 21**| § 9 Abs. 1 EStG | 0,38 | EUR/km | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__9.html) | Ja (True) |
| **Sparer-Pauschbetrag (Single)** | § 20 Abs. 9 EStG | 1.000 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__20.html) | Ja (True) |
| **Arbeitnehmer-Pauschbetrag** | § 9a EStG | 1.230 | EUR/Jahr | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__9a.html) | Ja (True) |
| **Kapitalertragsteuer** | § 43a EStG | 25,0 | % | [gesetze-im-internet.de/estg](https://www.gesetze-im-internet.de/estg/__43a.html) | Ja (True) |
| **Pfändungsfreigrenze Grundbetrag**| § 850c ZPO | 1.491,75 | EUR/Monat | [gesetze-im-internet.de/zpo](https://www.gesetze-im-internet.de/zpo/__850c.html) | Ja (True) |
| **CO2-Preis Brennstoffe** | § 10 BEHG | 55 | EUR/Tonne | [gesetze-im-internet.de/behg](https://www.gesetze-im-internet.de/behg/__10.html) | Ja (True) |

*Ein automatisierter Guard-Test (`src/__tests__/legal-values-guard.test.ts`) verhindert im Buildprozess, dass Werte mit `verified: false` oder fehlenden HTTPS-Tiefenlinks in Produktion gelangen.*

---

## 3. Disclaimer-Typen & Verteilung über die 408 Rechner

Jeder Rechner auf der Plattform ist einem typisierten Haftungs- und Disclaimer-Profil zugeordnet (abgelegt in `seo-audit/disclaimer-mapping.csv`):

| Disclaimer-Typ | Anzahl Rechner | Typischer Anwendungsbereich |
| :--- | :---: | :--- |
| **`allgemein`** | 254 | Mathematik, Geometrie, Einheiten, Zeit & Datum, Haushalt, Kochen & Backen |
| **`finanzen`** | 71 | Zinseszins, Ratenkredit, Baufinanzierung, ETF, Sparpläne, Renditen, Rentenlücke |
| **`steuer`** | 26 | Einkommensteuer, Lohnsteuer, Kirchensteuer, SolZ, Abgeltungsteuer, Kfz-Steuer, MwSt |
| **`gehalt-sozialversicherung`** | 12 | Brutto-Netto, Minijob, Midijob, Stundenlohn, Teilzeit, Kurzarbeit, Krankengeld |
| **`immobilien`** | 11 | Notar- und Grundbuchkosten, Grunderwerbsteuer, Kaufnebenkosten, Mietspiegel |
| **`gesundheit`** | 10 | BMI, Kalorienbedarf (TDEE/BMR), Puls, Idealgewicht, Körperfett |
| **`bauen`** | 8 | Beton, Estrich, Schalungssteine, Fliesen, Pflasterbedarf |
| **`sozialleistung`** | 8 | Bürgergeld, Unterhalt (Düsseldorfer Tabelle), Kindergeld, Elterngeld, Wohngeld |
| **`alkohol-verkehr`** | 5 | Promillerechner (Widmark), Alkoholabbau im Straßenverkehr |
| **`recht`** | 2 | Gesetzliche Kündigungsfristen (BGB), Verjährung |
| **`verkehr-bussgeld`** | 1 | Bundeseinheitlicher Bußgeldkatalog (BKatV) |
| **Gesamt** | **408** | **Vollständige Abdeckung (100 % aller aktiven Rechner)** |

---

## 4. Das neue ResultDisclaimer-Element (UX & Barrierefreiheit)

Das `ResultDisclaimer`-Element wird unmittelbar unterhalb der berechneten Ergebnisbox und vor der Aktionsleiste („Ergebnis kopieren“) gerendert. Es ist unaufdringlich, aber integraler Bestandteil des Nutzererlebnisses.

### Aufbau & Styling
- **HTML-Semantik & ARIA:** `<aside role="note" aria-label="Hinweis zur Berechnung und rechtliche Einordnung">`
- **Typografie:** Mindestens 14px Textgröße (kein unleserliches Kleingedrucktes).
- **Hintergrund & Rahmen:** Sanftes Grau (`#f8fafc`) mit dezentem Rahmen (`#e2e8f0`) und abgerundeten Ecken (`10px`).
- **Permanente Sichtbarkeit:** Das Element kann nicht zugeklappt oder ausgeblendet werden. Sobald das Rechenergebnis vorliegt, ist der Hinweis sichtbar.

### Inhaltliche Bausteine
1. **Basis-Satz:**
   - *Bei Rechnern mit Rechtsstand:* `Dieses Ergebnis ist eine unverbindliche Orientierung. Es beruht ausschließlich auf Ihren Eingaben und den allgemeinen gesetzlichen Regelungen in Deutschland (Rechtsstand 2026). Individuelle Besonderheiten werden nicht berücksichtigt.`
   - *Bei mathematisch-physikalischen Rechnern:* `Dieses Ergebnis ist eine rechnerische Orientierung auf Basis Ihrer Eingaben. Bitte prüfen Sie wichtige Werte vor der Verwendung.`
2. **Spezifischer Rechts-/Fachhinweis je Disclaimer-Typ:**
   - *Steuer:* „Der Rechner ersetzt keine steuerliche Beratung durch einen Steuerberater oder Lohnsteuerhilfeverein und keinen Steuerbescheid des Finanzamts.“
   - *Gehalt/SV:* „Maßgeblich für Ihren Lohnabzug ist die Entgeltabrechnung Ihres Arbeitgebers und Ihre elektronischen Lohnsteuerabzugsmerkmale (ELStAM).“
   - *Sozialleistung:* „Rechtsansprüche können nur durch einen schriftlichen Bescheid der zuständigen Behörde begründet werden. Der Rechner berücksichtigt keine individuellen Härtefälle.“
   - *Recht:* „Diese Berechnung ersetzt keine Rechtsberatung durch eine Rechtsanwältin oder einen Rechtsanwalt.“
   - *Finanzen:* „Dies ist keine Anlage-, Kredit- oder Finanzberatung. Konditionen von Banken können abweichen.“
   - *Gesundheit:* „Dieser Rechner dient der allgemeinen Information und ersetzt keine ärztliche Untersuchung, Diagnose oder Beratung.“
   - *Alkohol:* „Rechnerische Blutalkoholwerte sind grobe Näherungen und hängen von Stoffwechsel, Mageninhalt und weiteren Faktoren ab. Fahren Sie niemals unter Alkoholeinfluss.“
3. **Annahmen dieser Berechnung:** Aufzählung von 2 bis 5 konkreten Modellannahmen (z. B. „Gesetzlich krankenversichert mit Zusatzbeitrag 2,9 %“, „Standardtarife ohne Freibeträge auf der Lohnsteuerkarte“).
4. **Rechtsgrundlage mit Primärquellen:** Direkte, verifizierte Tiefenlinks zu `gesetze-im-internet.de` mit `rel="noopener noreferrer"` und externem Link-Icon.
5. **Transparenz-Link:** Direkte Verlinkung auf `/methodik/` („Wie wir rechnen & Transparenz“).

### Verhalten auf Mobilgeräten
- Flexibles Responsive Layout: Fließender Text mit automatischem Zeilenumbruch.
- Berührungsfreundliche Links zu Gesetzen und Methodik (Mindestabstand 8px).
- Gleiche Schriftgröße (14px) gewährleistet Lesbarkeit ohne Zoom auf Smartphones.

---

## 5. Verbindlichkeits-FAQ für alle Gesetzesrechner

Jeder Rechner mit zugewiesenem `rechtsstand` enthält nun verpflichtend als FAQ-Eintrag:
- **Frage:** *„Ist das Ergebnis dieses Rechners verbindlich?“*
- **Antwort:** *„Nein. Der Rechner nutzt die allgemeinen gesetzlichen Werte für [Jahr] und Ihre Eingaben. Ihre tatsächliche Abrechnung bzw. Ihr Bescheid kann abweichen, etwa durch individuelle Freibeträge, regionale Besonderheiten oder Sonderregelungen. Für eine verbindliche Auskunft wenden Sie sich an [zuständige Stelle je Fachbereich].“*

Diese FAQ wird sowohl im sichtbaren FAQ-Akkordeon der Seite gerendert als auch im `FAQPage`-Schema (JSON-LD) für Suchmaschinen bereitgestellt.

---

## 6. Testergebnisse & Verifikation

```
Test Files  55 passed (55)
Tests       1290 passed (1290)
Duration    30.60s
Production  469 / 469 statische Routen generiert (Next.js 15.5.25 SSG)
Prohibited  0 Treffer für selbstattributierte Übertreibungen
```

1. **`src/__tests__/legal-values-guard.test.ts`:** Bestätigt, dass jede Konstante in `LEGAL_VALUES_2026` und `LEGAL_VALUES_2025` verifiziert ist (`verified: true`), einen validen HTTPS-Tiefenlink besitzt und mit den Rechenmodulen synchron ist.
2. **`src/__tests__/result-disclaimer.test.tsx`:** Bestätigt Rendering, Accessibility (`role="note"`), ARIA-Labels und systemspezifische Haftungstexte.
3. **`src/__tests__/bindingness-faq.test.ts`:** Bestätigt lückenlose Ausweisung der Verbindlichkeits-FAQ auf allen 154 Gesetzes- und Regulierungsrechnern.
4. **`src/__tests__/ga4-analytics-consent.test.ts`:** Bestätigt, dass zu keinem Zeitpunkt Benutzereingaben oder Rechenergebnisse an externe Analysedienste gesendet werden.

---

## 7. Verbleibende Platzhalter für redaktionelle Stammdaten

Gemäß den Vorgaben wurden keine Kontaktdaten oder Gründernamen frei erfunden. Die folgenden klar markierten Platzhalter können bei Bedarf mit den realen Stammdaten befüllt werden:

1. `[FILL: real editor/founder name]` in `src/app/rechner/[slug]/page.tsx` (Autorenangabe)
2. `[FILL: founder name]` in `src/app/ueber-uns/page.tsx` (Betreiber/Gründer)
3. `[FILL: feedback-email z. B. redaktion@rechenhafen.de]` in `src/app/methodik/page.tsx` (Redaktionskontakt)

---
*Bericht erstellt am 2026-11-02.*
