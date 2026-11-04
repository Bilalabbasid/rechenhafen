# Dokumentation entfernter Übertreibungen und Schein-Autoritätsansprüche (Phase 4)

Gemäß den Richtlinien für ehrliche Angaben und Vertrauenswürdigkeit wurden alle Behauptungen über Schein-Zertifizierungen, falsche Verlässlichkeit („geprüft“, „BMF-konform“, „exakt auf den Cent“, „100 % korrekt“) sitewide bereinigt und durch neutrale, transparente Beschreibungen ersetzt.

| Datei | Zeile | Vorher (Übertreibung / Schein-Autorität) | Nachher (Ehrliche Formulierung) | Begründung |
| :--- | :--- | :--- | :--- | :--- |
| `src/app/rechner/[slug]/page.tsx` | 248 | `<ShieldCheck /> Stand: {year} (geprüft)` | `<Info /> Rechtsstand {year}` | Keine Schein-Prüfsiegel suggerieren; neutrale Ausweisung des Rechtsstands |
| `src/app/rechner/[slug]/page.tsx` | 284 | `Geprüfter Stand: {lastModified}` | `Stand: {lastModified}` | Vermeidung von Schein-Prüfungsbegriffen |
| `src/components/calculator/CalculatorRunner.tsx` | 1456 | `Quelle: ... (geprüft am ...)` | `Quelle: ... (Stand: ...)` | Ehrliche Nennung des Verifizierungsdatums |
| `src/components/calculator/CalculatorRunner.tsx` | 742 | `Berechnet auf RechenHafen.de` | `Unverbindliche Berechnung von rechenhafen.de, keine Steuer-/Rechts-/Finanzberatung.` | Transparenter Hinweis bei Export & Kopieren |
| `src/components/common/Footer.tsx` | 24 | `verlässliche deutsche Online-Plattform mit Hunderten präzisen Rechnern` | `kostenlose Online-Rechner ... zur rechnerischen Orientierung` | Keine Beratungs- oder Präzisionsgarantien |
| `src/components/common/Footer.tsx` | 27 | `100 % Lokale Berechnung` | `Lokale Berechnung im Browser` | Übertreibung "100 %" entfernt |
| `src/components/common/Footer.tsx` | 73 | `Berechnungen erfolgen nach anerkannten Normen und Gesetzen.` | `Alle Berechnungen sind unverbindliche Orientierungswerte und ersetzen keine Steuer-, Rechts-, Finanz- oder medizinische Beratung.` | Verbindlicher Sitewide-Disclaimer im Footer |
| `src/app/page.tsx` | 211 | `BMF-konforme Berechnungen nach deutschem Steuer- und Sozialversicherungsrecht (2025/2026).` | `Berechnungen gemäß Programmablaufplan des BMF und Sozialversicherungsrecht (2025/2026).` | Kein Ministeriums-Prüfsiegel vortäuschen |
| `src/app/page.tsx` | 426 | `100 % Lokale Berechnung` | `Lokale Berechnung im Browser` | Nüchterne, sachliche Formulierung |
| `src/app/page.tsx` | 446 | `Rechtskonforme Berechnungsgrundlagen` | `Aktuelle Gesetzeswerte 2026` | Ehrliche Beschreibung als Gesetzeswerte statt Rechtskonformitäts-Behauptung |
| `src/app/ueber-uns/page.tsx` | 76 | `verlässlich, datenschutzfreundlich und quellengestützt.` | `datenschutzfreundlich, quellengestützt und nachvollziehbar.` | Nüchterne Positionierung |
| `src/app/ueber-uns/page.tsx` | 92 | `einen verlässlichen Anker zu bieten:` | `eine verlässliche Orientierung zu bieten:` | Klarstellung des Orientierungscharakters |
| `src/app/ueber-uns/page.tsx` | 99 | `Wie unsere Rechner entstehen und geprüft werden` | `Wie unsere Rechner entstehen und gepflegt werden` | Neutrale Pflege- statt Scheinprüfungsbeschreibung |
| `src/app/ueber-uns/page.tsx` | 102 | `Verlässlichkeit ist der Kern unserer Arbeit. Jeder Rechner ... durchläuft ein striktes ... Prüfverfahren:` | `Sorgfalt und Transparenz sind der Kern unserer Arbeit. Jeder Rechner ... durchläuft ein mehrstufiges Entwicklungs- und Testverfahren:` | Sachliche Testmethodik |
| `src/app/ueber-uns/page.tsx` | 127 | `auf exakte Übereinstimmung mit behördlichen Vergleichswerten kontrolliert.` | `anhand behördlicher Vergleichsfälle und Berechnungsmuster getestet.` | Keine Schein-Garantie |
| `src/app/impressum/page.tsx` | 64 | `implementiert und fortlaufend geprüft.` | `implementiert und regelmäßig aktualisiert.` | Nüchterne Aktualisierungsangabe |
| `src/data/calculators/steuernGehalt.ts` | 63 | `Ermittelt Ihr exaktes Nettogehalt` | `Berechnet Ihr voraussichtliches Nettogehalt` | Nettogehalt ist vorläufig/orientierend |
| `src/data/calculators/steuernGehalt.ts` | 243 | `Berechnet durch exakte mathematische Inversion` | `Berechnet durch mathematische Näherung` | Mathematische Ehrlichkeit |
| `src/data/calculators/steuernGehalt.ts` | 297 | `das exakte Bruttogehalt auf den Cent genau.` | `das voraussichtlich benötigte Bruttogehalt rechnerisch.` | Centgenauigkeit kann vor Bescheid nicht garantiert werden |
| `src/data/calculators/steuernGehalt.ts` | 330 | `Tarif § 32a EStG exakt` | `Tarif nach § 32a EStG` | Entfernung von "exakt" |
| `src/data/calculators/steuernGehalt.ts` | 423 | `Zeigt exakt, in welcher Progressionszone` | `Zeigt anschaulich, in welcher Progressionszone` | Nüchterne Visualisierung |
| `src/data/calculators/steuernGehalt.ts` | 497 | `Exakte Berechnung mit amtlicher Freigrenze` | `Berechnung mit amtlicher Freigrenze` | Entfernung von "exakt" |
| `src/data/calculators/steuernGehalt.ts` | 569 | `Kirchenlohnsteuer exakt berechnen` | `Kirchenlohnsteuer berechnen` | Entfernung von "exakt" |
| `src/data/calculators/arbeit.ts` | 111 | `Für das exakte Nettogehalt...` | `Für das tatsächliche Nettogehalt...` | Neutralität |
| `src/data/calculators/auto.ts` | 68 | `...auf den Cent genau.` | `...auf Basis Ihrer Angaben.` | Verbrauch und Preise sind Schätzwerte |
| `src/components/calculator/CategoryFocusCalculators.tsx` | 80 | `Verlässliche Kubikmeter- und Tonnageberechnung` | `Praktische Kubikmeter- und Tonnageberechnung` | Nüchterne Formulierung |
| `src/data/categories.ts` | 117 | `Präzise deutsche Steuer- und Gehaltsrechner` | `Kostenlose deutsche Steuer- und Gehaltsrechner` | Keine Übertreibung |
| `src/data/categories.ts` | 118 | `exakt ein... Ermitteln Sie centgenau... absolute Klarheit` | `nach den gesetzlichen Werten ein... voraussichtliches... klaren Überblick` | Ehrliche Einordnung von Steuermodellwerten |
| `src/data/categories.ts` | 196 | `verlässliche Einkaufs- und Mengenangaben` | `praktische Einkaufs- und Mengenangaben` | Neutrale Alltagssprache |

