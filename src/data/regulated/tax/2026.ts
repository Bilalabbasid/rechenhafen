import { TaxYearConfig } from './types';

/**
 * Offizielle steuerliche und sozialversicherungsrechtliche Rechengrößen für Deutschland 2026
 * Quellen:
 * - Gesetz zur steuerlichen Freistellung des Existenzminimums / Steuerfortentwicklungsgesetz (BGBl.)
 * - § 32a Einkommensteuergesetz (EStG) Veranlagungszeitraum 2026
 * - Sozialversicherungs-Rechengrößenverordnung 2026 (BMAS)
 * - Solidaritätszuschlaggesetz (§ 3, § 4 SolzG)
 * - BMG-Bekanntmachung des durchschnittlichen Zusatzbeitragssatzes 2026 (BAnz AT 10.11.2025 B7)
 * - Minijob-Zentrale: Abgaben und Umlagen für gewerbliche Minijobs 2026
 */
export const TAX_CONFIG_2026: TaxYearConfig = {
  year: 2026,
  effectiveFrom: '2026-01-01',
  source: 'Bundesfinanzministerium (BMF) / Bundesministerium für Arbeit und Soziales (BMAS)',
  sourceUrl: 'https://www.bundesfinanzministerium.de',
  lastVerified: '2026-10-25',

  // Einkommensteuertarif 2026 (§ 32a Abs. 1 EStG)
  grundfreibetrag: 12348,
  zone2Limit: 17799,
  zone3Limit: 69878,
  zone4Limit: 277825,
  zone5Limit: 277826,

  // § 32a Abs. 1 EStG 2026 Formel-Parameter:
  // Zone 2 (12.349 bis 17.799 €): (914,51 * y + 1.400) * y
  zone2Coeff: 914.51,
  zone2Base: 1400,
  // Zone 3 (17.800 bis 69.878 €): (173,10 * z + 2.397) * z + 1.034,87
  zone3Coeff: 173.10,
  zone3Base: 2397,
  zone3Offset: 1034.87,
  // Zone 4 (69.879 bis 277.825 €): 0,42 * zvE - 11.135,63
  zone4Rate: 0.42,
  zone4Offset: 11135.63,
  // Zone 5 (ab 277.826 €): 0,45 * zvE - 19.470,38
  zone5Rate: 0.45,
  zone5Offset: 19470.38,

  // Solidaritätszuschlag 2026 (geprüft am 2026-10-25)
  // Freigrenze nach § 3 Abs. 3 SolzG i. d. F. des Steuerfortentwicklungsgesetzes (BGBl. 2024 I Nr. 449):
  // 20.350 € Einzelveranlagung / 40.700 € Zusammenveranlagung (2025: 19.950 € / 39.900 €)
  solzFreigrenzeSingle: 20350,
  solzFreigrenzeMarried: 40700,
  solzRate: 0.055,
  solzMilderungRate: 0.119,

  // Freibeträge & Kindergeld 2026 (geprüft am 2026-10-25, Steuerfortentwicklungsgesetz, BGBl. 2024 I Nr. 449)
  // § 32 Abs. 6 EStG: 2 × 3.414 € Kinderfreibetrag + 2 × 1.464 € BEA-Freibetrag = 6.828 € + 2.928 € = 9.756 €
  kinderfreibetragGesamt: 9756,
  // § 66 Abs. 1 EStG: 259 € je Kind und Monat ab 01.01.2026 (2025: 255 €;
  // Bundesagentur für Arbeit / Familienkasse, Pressemitteilung 42/2025 vom 10.12.2025)
  kindergeldMonat: 259,

  // Sozialversicherung Beitragsbemessungsgrenzen 2026 (bundeseinheitlich)
  bbgRentenversicherungMonat: 8450.00,
  bbgRentenversicherungJahr: 101400.00,
  bbgKrankenversicherungMonat: 5812.50,
  bbgKrankenversicherungJahr: 69750.00,
  jaegKrankenversicherungMonat: 6450.00,
  jaegKrankenversicherungJahr: 77400.00,

  // Sozialversicherung Beitragssätze 2026
  beitragssatzRentenversicherung: 0.186, // 18,6 % (AN 9,3 %, AG 9,3 %)
  beitragssatzArbeitslosenversicherung: 0.026, // 2,6 % (AN 1,3 %, AG 1,3 %)
  beitragssatzKrankenversicherungAllgemein: 0.146, // 14,6 % (AN 7,3 %, AG 7,3 %)
  // Durchschnittlicher Zusatzbeitragssatz 2026: 2,9 % (AN 1,45 %, AG 1,45 %), geprüft am 2026-10-25
  // Bekanntmachung des BMG nach § 242a Abs. 2 SGB V vom 7. November 2025, BAnz AT 10.11.2025 B7 (2025: 2,5 %)
  zusatzbeitragKrankenversicherungDurchschnitt: 0.029,
  beitragssatzPflegeversicherung: 0.036, // 3,6 % (Standard)
  pflegeZuschlagKinderlos: 0.006, // 0,6 % (AN allein)
  pflegeAbschlagKind: 0.0025, // 0,25 % pro Kind ab 2. bis 5. Kind

  pflegeSachsenAnteilAN: 0.023, // 2,3 % in Sachsen
  pflegeSachsenAnteilAG: 0.013, // 1,3 % in Sachsen

  // Minijob & Midijob 2026 (geprüft am 2026-10-25)
  // Geringfügigkeitsgrenze nach § 8 Abs. 1a SGB IV = Mindestlohn × 130 ÷ 3, aufgerundet auf volle Euro:
  // 13,90 € (MiLoV5, BGBl. 2025 I Nr. 268) × 130 ÷ 3 = 602,33 € → 603 € (Minijob-Zentrale, DRV-Meldung vom 23.02.2026)
  minijobGrenze: 603.00,
  midijobObergrenze: 2000.00, // § 20 Abs. 2 SGB IV
  // Faktor F = 28 % ÷ Gesamtsozialversicherungsbeitragssatz 2026 von 42,3 % = 0,6619
  // (Bekanntmachung des BMAS vom 25.11.2025, BAnz AT 18.12.2025 B5)
  midijobFaktorF: 0.6619,

  // Arbeitgeber-Umlagen bei regulär Beschäftigten
  // U1/U2 sind kassenindividuell (Satzung der Krankenkasse), daher Schätzwerte
  umlageU1: 0.011, // ca. 1,1 %
  umlageU2: 0.0035, // ca. 0,35 % Mutterschutz
  // Insolvenzgeldumlage 2026: gesetzlicher Satz 0,15 % nach § 360 SGB III, keine abweichende Verordnung
  // nach § 361 SGB III für 2026 (2023/2024: 0,06 %), geprüft am 2026-10-25
  umlageU3Insolvenzgeld: 0.0015,
  berufsgenossenschaftDurchschnitt: 0.013, // 1,3 % (Schätzwert, je Berufsgenossenschaft und Gefahrtarif)

  // Gewerbliche Minijobs 2026 (Minijob-Zentrale, "Minijob-Beiträge 2026", 16.12.2025), geprüft am 2026-10-25
  // Arbeitgeber höchstens 31,17 % = 13 % KV + 15 % RV + 2 % Pauschsteuer + 0,8 % U1 + 0,22 % U2 + 0,15 % Insolvenzgeldumlage
  minijobPauschaleKv: 0.13, // § 249b SGB V (nur bei gesetzlich krankenversicherten Minijobbern)
  minijobPauschaleRv: 0.15, // § 172 Abs. 3 SGB VI
  minijobPauschsteuer: 0.02, // § 40a Abs. 2 EStG
  minijobRvEigenanteil: 0.036, // 18,6 % − 15 %, entfällt bei Befreiung nach § 6 Abs. 1b SGB VI
  minijobUmlageU1: 0.008, // 0,80 % ab 01.01.2026 (2025: 1,1 %)
  minijobUmlageU2: 0.0022, // 0,22 %
  minijobInsolvenzgeldumlage: 0.0015, // 0,15 % (§ 360 SGB III)
};
