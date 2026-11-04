/**
 * Typdefinitionen für das deutsche Recht und zentrale Rechtswerte auf RechenHafen.de
 *
 * Alle gesetzlichen Konstanten müssen mit konkreter Rechtsgrundlage, amtlicher Quelle,
 * Gültigkeitsdatum und Prüfdatum versehen sein.
 */

export interface LegalConstant<T = number> {
  /** Der numerische oder textuelle Wert der Konstante */
  value: T;
  /** Einheit (z. B. 'EUR/Jahr', '%', '€/Monat', '€/km') */
  unit: string;
  /** Konkrete gesetzliche Vorschrift (z. B. '§ 32a Abs. 1 EStG') */
  law: string;
  /** Tiefer Link zur amtlichen Quelle (z. B. auf gesetze-im-internet.de) */
  sourceUrl: string;
  /** Gültig ab (ISO-Datum 'YYYY-MM-DD') */
  validFrom: string;
  /** Ob der Wert gegen die amtliche Quelle verifiziert wurde */
  verified: boolean;
  /** Datum der tatsächlichen Prüfung ('YYYY-MM-DD') */
  checkedAt: string;
  /** Optionale Kurzbeschreibung oder amtlicher Name */
  description?: string;
}

export interface LegalBasisLink {
  label: string;
  url: string;
}

export type DisclaimerType =
  | 'steuer'
  | 'gehalt-sozialversicherung'
  | 'recht'
  | 'sozialleistung'
  | 'finanzen'
  | 'immobilien'
  | 'gesundheit'
  | 'schwangerschaft'
  | 'alkohol-verkehr'
  | 'verkehr-bussgeld'
  | 'bauen'
  | 'allgemein';

export interface GermanLegalValues {
  year: number;

  // Einkommensteuertarif (§ 32a EStG)
  grundfreibetrag: LegalConstant<number>;
  zone2Limit: LegalConstant<number>;
  zone3Limit: LegalConstant<number>;
  zone4Limit: LegalConstant<number>;
  zone5Limit: LegalConstant<number>;

  // § 32a Abs. 1 EStG Formel-Parameter
  zone2Coeff: LegalConstant<number>;
  zone2Base: LegalConstant<number>;
  zone3Coeff: LegalConstant<number>;
  zone3Base: LegalConstant<number>;
  zone3Offset: LegalConstant<number>;
  zone4Rate: LegalConstant<number>;
  zone4Offset: LegalConstant<number>;
  zone5Rate: LegalConstant<number>;
  zone5Offset: LegalConstant<number>;

  // Solidaritätszuschlag (§ 3, § 4 SolzG)
  solzFreigrenzeSingle: LegalConstant<number>;
  solzFreigrenzeMarried: LegalConstant<number>;
  solzRate: LegalConstant<number>;
  solzMilderungRate: LegalConstant<number>;

  // Freibeträge & Kindergeld
  kinderfreibetragGesamt: LegalConstant<number>;
  kindergeldMonat: LegalConstant<number>;

  // Mindestlohn & Geringfügigkeit
  mindestlohnStunde: LegalConstant<number>;
  minijobGrenze: LegalConstant<number>;
  midijobObergrenze: LegalConstant<number>;
  midijobFaktorF: LegalConstant<number>;

  // Sozialversicherung: Beitragsbemessungsgrenzen
  bbgRentenversicherungMonat: LegalConstant<number>;
  bbgRentenversicherungJahr: LegalConstant<number>;
  bbgKrankenversicherungMonat: LegalConstant<number>;
  bbgKrankenversicherungJahr: LegalConstant<number>;
  jaegKrankenversicherungMonat: LegalConstant<number>;
  jaegKrankenversicherungJahr: LegalConstant<number>;

  // Sozialversicherung: Beitragssätze
  beitragssatzRentenversicherung: LegalConstant<number>;
  beitragssatzArbeitslosenversicherung: LegalConstant<number>;
  beitragssatzKrankenversicherungAllgemein: LegalConstant<number>;
  zusatzbeitragKrankenversicherungDurchschnitt: LegalConstant<number>;
  beitragssatzPflegeversicherung: LegalConstant<number>;
  pflegeZuschlagKinderlos: LegalConstant<number>;
  pflegeAbschlagKind: LegalConstant<number>;
  pflegeSachsenAnteilAN: LegalConstant<number>;
  pflegeSachsenAnteilAG: LegalConstant<number>;

  // Bürgergeld, Pauschbeträge, MwSt, CO2, Pfändungsgrenze
  buergergeldRegelsatzAlleinstehend: LegalConstant<number>;
  pendlerpauschaleStandard: LegalConstant<number>;
  pendlerpauschaleFernpendler: LegalConstant<number>;
  sparerPauschbetragSingle: LegalConstant<number>;
  sparerPauschbetragMarried: LegalConstant<number>;
  arbeitnehmerPauschbetrag: LegalConstant<number>;
  kapitalertragsteuerSatz: LegalConstant<number>;
  mwstNormalsatz: LegalConstant<number>;
  mwstErmaessigt: LegalConstant<number>;
  pfaendungsfreigrenzeGrundbetrag: LegalConstant<number>;
  co2PreisBrennstoffe: LegalConstant<number>;

  // Arbeitgeber-Umlagen & Minijob-Pauschalen
  umlageU1: LegalConstant<number>;
  umlageU2: LegalConstant<number>;
  umlageU3Insolvenzgeld: LegalConstant<number>;
  berufsgenossenschaftDurchschnitt: LegalConstant<number>;
  minijobPauschaleKv: LegalConstant<number>;
  minijobPauschaleRv: LegalConstant<number>;
  minijobPauschsteuer: LegalConstant<number>;
  minijobRvEigenanteil: LegalConstant<number>;
  minijobUmlageU1: LegalConstant<number>;
  minijobUmlageU2: LegalConstant<number>;
  minijobInsolvenzgeldumlage: LegalConstant<number>;
}

