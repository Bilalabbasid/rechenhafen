# Audit & Behebung von Widersprüchen (Phase 3)

Dieses Dokument erfasst alle geprüften und bereinigten inhaltlichen Widersprüche zwischen UI-Optionen, Berechnungslogik, Fließtexten, Formelerklärungen und FAQs.

---

## 1. `tee-ziehzeit-temperatur-rechner`

### Vorgefundene Widersprüche (Vorher)
1. **Dropdown-Optionen vs. Fließtext**:
   - Die Dropdown-Option für Kräutertee empfahl *6–8 Min.* bei *100 °C*.
   - Der Begleittext im Abschnitt `details` nannte jedoch *8–10 Min.* für Kräuter- und Früchtetees.
   - Die Dropdown-Option für Grünen Tee nannte *70–80 °C*, während `details` *60 °C bis 75 °C* erwähnte.
   - Schwarzer Tee wurde im Dropdown mit *90–95 °C* angegeben, im Text jedoch mit *95–100 °C*.
2. **Koffein-Aussage in FAQ**:
   - Die FAQ behauptete fälschlicherweise: *"Koffein löst sich in den ersten 2 Minuten vollkommen"*. Dies ist chemisch und pharmakologisch unpräzise (Koffeinextraktion folgt einer kontinuierlichen Diffusionskinetik; zwar gehen ca. 70–80 % in den ersten Minuten in Lösung, aber keineswegs 100 %). Zudem fehlte die Erläuterung zur Bindung an hochmolekulare Tannine/Gerbstoffe.
3. **Hygiene-Empfehlung bei Kräuter- & Früchtetee**:
   - Das Erfordernis sprudelnd kochenden Wassers wurde erwähnt, aber ohne die maßgebliche Bundesbehörde und deren hygienische Begründung präzise zu verankern.
4. **Metadaten-Abschneidung**:
   - `metaDescription` brach mitten im Satz ohne schließende Klammer ab: `... Schwarzen Tee (95 °C, 3 Min.`

### Durchgeführte Korrekturen (Nachher)
- **Harmonisierung der Temperatur- & Zeitstufen**:
  - Grüner Tee (Sencha/Bancha): **70–80 °C**, **2 Minuten** Ziehzeit (schützt vor vorzeitiger Zerstörung hitzeempfindlicher Catechine und verhindert Adstringenz).
  - Matcha: **60–65 °C**, schaumig schlagen mit dem Bambusbesen (Chasen).
  - Weißer Tee: **75–80 °C**, **3–4 Minuten**.
  - Oolong Tee: **80–90 °C**, **ca. 3 Minuten**.
  - Schwarzer Tee (Darjeeling, Ceylon, Assam): **90–95 °C**, **3–4 Minuten**.
  - Kräutertee (Kamille, Pfefferminze etc.): **100 °C sprudelnd kochend**, **6–8 Minuten**.
  - Früchtetee: **100 °C sprudelnd kochend**, **8–10 Minuten**.
- **Wissenschaftlich fundierte FAQ**:
  - Detaillierte Darlegung der Tannin-Koffein-Interaktion statt der pauschalen "2-Minuten-Vollkommenheits-Behauptung".
  - Verweis auf die Empfehlungen des **Bundesinstituts für Risikobewertung (BfR)** zur Keim- und Sporeninaktivierung bei pflanzlichen Rohwaren aus Freilandanbau.
- **Metadaten**:
  - Vollständige, nicht-abgeschnittene Meta-Description (152 Zeichen) mit Punkt am Satzende.
  - Aussagekräftiger Meta-Title mit 59 Zeichen.

---

## 2. Sitewide De-Templating von `shortDescription`
- Alle 179 Vorkommen der automatisierten Floskel `"mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung"` sowie Varianten wurden vollständig entfernt.
- Jede `shortDescription` beschreibt nun präzise den echten Einsatzzweck des jeweiligen Rechners ohne werbliche Redundanz.

---

## 3. Dynamische Sektions-Überschriften in Formel- und Methodik-Boxen
- Nicht-mathematische Rechner (Kochen, Lifestyle, Datum/Uhrzeit) erhielten statt des statischen *"Mathematische Formel & Rechenweg"* kontextbezogene H2-Überschriften wie:
  - *Zubereitung, Dosierung & Richtwerte* (Kochen & Backen)
  - *Biometrische Formel & Rechenmethode* (Gesundheit & Fitness)
  - *Kalendarischer Rechenweg & Zeitlogik* (Datum & Uhrzeit)
  - *Gesetzliche Berechnungsgrundlage & Rechenweg* (Steuern, Arbeit & Recht)
- Der DIN 1333-Rundungshinweis wird nur noch auf Rechnern mit echten quantitativen Rundungsstandards (Finanzen, Steuern, Bauen, Mathematik) dargestellt.
