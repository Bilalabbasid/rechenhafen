/**
 * Typdefinitionen für das deutsche Steuer- und Sozialversicherungsrecht
 */

export interface TaxTariffZone {
  min: number;
  max: number;
  type: 'zero' | 'linear' | 'proportional';
  baseRate?: number;
  marginalRateMin?: number;
  marginalRateMax?: number;
  constantA?: number;
  constantB?: number;
  subtraction?: number;
}

export interface TaxYearConfig {
  year: number;
  effectiveFrom: string;
  source: string;
  sourceUrl: string;
  lastVerified: string;

  // Einkommensteuertarif (§ 32a EStG)
  grundfreibetrag: number;
  zone2Limit: number;
  zone3Limit: number;
  zone4Limit: number;
  zone5Limit: number; // Reichensteuer ab 277.826 €

  // Formel-Koeffizienten (§ 32a Abs. 1 EStG)
  zone2Coeff: number; // z.B. 932.30 in 2025, 914.51 in 2026
  zone2Base: number;  // 1400
  zone3Coeff: number; // z.B. 176.64 in 2025, 173.10 in 2026
  zone3Base: number;  // 2397
  zone3Offset: number; // z.B. 1015.13 in 2025, 1034.87 in 2026
  zone4Rate: number;  // 0.42
  zone4Offset: number; // z.B. 10911.92 in 2025, 11135.63 in 2026
  zone5Rate: number;  // 0.45
  zone5Offset: number; // z.B. 19246.67 in 2025, 19470.38 in 2026

  // Solidaritätszuschlag (§ 3, § 4 SolzG)
  solzFreigrenzeSingle: number;
  solzFreigrenzeMarried: number;
  solzRate: number; // 0.055 (5,5 %)
  solzMilderungRate: number; // 0.119 (11,9 %)

  // Kinderfreibetrag
  kinderfreibetragGesamt: number; // Kinderfreibetrag + BEA
  kindergeldMonat: number;

  // Sozialversicherung: Beitragsbemessungsgrenzen (monatlich / jährlich)
  bbgRentenversicherungMonat: number;
  bbgRentenversicherungJahr: number;
  bbgKrankenversicherungMonat: number;
  bbgKrankenversicherungJahr: number;
  jaegKrankenversicherungMonat: number;
  jaegKrankenversicherungJahr: number;

  // Sozialversicherung: Beitragssätze (gesamt)
  beitragssatzRentenversicherung: number; // 18.6 %
  beitragssatzArbeitslosenversicherung: number; // 2.6 %
  beitragssatzKrankenversicherungAllgemein: number; // 14.6 %
  zusatzbeitragKrankenversicherungDurchschnitt: number; // § 242a SGB V, vom BMG bekanntgemacht (2025: 2,5 %, 2026: 2,9 %)
  beitragssatzPflegeversicherung: number; // 3.6 %
  pflegeZuschlagKinderlos: number; // 0.6 % (ab 23 Jahre)
  pflegeAbschlagKind: number; // 0.25 % (ab 2. bis 5. Kind unter 25 Jahren)

  // Sachsen Sonderregelung Pflegeversicherung
  pflegeSachsenAnteilAN: number; // 2.3 %
  pflegeSachsenAnteilAG: number; // 1.3 %

  // Geringfügigkeit & Übergangsbereich
  minijobGrenze: number; // 556 € (2025) / 603 € (2026), § 8 Abs. 1a SGB IV
  midijobObergrenze: number; // 2000 €
  midijobFaktorF: number; // Gesetzlicher Faktor F nach § 20 Abs. 2 SGB IV

  // Arbeitgeber-Umlagen (Richtwerte)
  umlageU1: number; // Lohnfortzahlung Krankheit (z.B. ~1.0%)
  umlageU2: number; // Mutterschutz (z.B. ~0.3%)
  umlageU3Insolvenzgeld: number; // Insolvenzgeldumlage (§ 360 SGB III: 0,15 %; 2023/2024 per Verordnung 0,06 %)
  berufsgenossenschaftDurchschnitt: number; // Unfallversicherung (~1.3%)

  // Gewerbliche Minijobs: Pauschalabgaben und Umlagen bei der Minijob-Zentrale (Knappschaft-Bahn-See)
  minijobPauschaleKv: number; // 13 % (§ 249b SGB V)
  minijobPauschaleRv: number; // 15 % (§ 172 Abs. 3 SGB VI)
  minijobPauschsteuer: number; // 2 % (§ 40a Abs. 2 EStG)
  minijobRvEigenanteil: number; // 3,6 % = 18,6 % RV-Beitragssatz − 15 % AG-Pauschale
  minijobUmlageU1: number; // Umlagesatz U1 der Minijob-Zentrale
  minijobUmlageU2: number; // Umlagesatz U2 der Minijob-Zentrale
  minijobInsolvenzgeldumlage: number; // § 360 SGB III
}
