/**
 * RechenHafen – Quellenregister für Emissionsfaktoren und CO₂-Preise (Source of Truth)
 *
 * Jeder Wert in diesem Register ist auf eine amtliche Quelle zurückgeführt, die
 * am angegebenen `verificationDate` tatsächlich abgerufen und geprüft wurde.
 * Werte ohne belegbare amtliche Quelle gehören NICHT in dieses Register
 * (siehe `REMOVED_UNVERIFIED_FACTORS` am Dateiende).
 *
 * Amtliche Primärquellen:
 * - Umweltbundesamt (UBA): „CO2-Emissionen pro Kilowattstunde Strom 2025 nur leicht gesunken“ (23.03.2026)
 * - Umweltbundesamt (UBA): „Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im
 *   Personenverkehr in Deutschland 2024“ (TREMOD 6.71B, Stand 10/2025)
 * - EBeV 2030, Anlage 2 Teil 4: Standardwerte zur Berechnung von Brennstoffemissionen
 * - BEHG § 10: Veräußerung der Emissionszertifikate
 * - CO2KostAufG § 4 Abs. 1: Maßgeblicher Zertifikatepreis
 */

export type EmissionBoundary =
  | 'direct_combustion' // Direkte CO₂-Emissionen bei der Verbrennung (Standardwerte, ohne Vorkette)
  | 'energy_generation' // Direkte CO₂-Emissionen der Stromerzeugung (ohne Vorkette)
  | 'tremod_energy_provision' // UBA TREMOD: direkte Emissionen + Bereitstellung/Umwandlung der Energieträger; ohne Infrastruktur und Fahrzeugbereitstellung
  | 'price_statutory' // Gesetzlicher Preis, keine Emissionsgröße
  | 'modelling_assumption'; // Rechenannahme ohne amtlichen Tabellenwert

export type EmissionGasType = 'CO2' | 'CO2e';

export type EmissionFactorStatus = 'estimated' | 'provisional' | 'final' | 'statutory';

export interface EmissionFactor {
  key: string;
  name: string;
  value: number;
  unit: string;
  geographicCoverage: string;
  referenceYear: number;
  sourceUrl: string;
  sourcePublication: string;
  sourceSection: string;
  gasType: EmissionGasType;
  boundary: EmissionBoundary;
  /** Methodik / Bilanzgrenze in Klartext */
  methodology: string;
  status: EmissionFactorStatus;
  /** Datum (ISO), an dem RechenHafen die Quelle tatsächlich geprüft hat */
  verificationDate: string;
  notes: string;
  /** Nur bei abgeleiteten Werten: Eingangsparameter der Ableitung */
  derivation?: Record<string, number>;
}

/** Tag, an dem die unten genannten Quellen im Rahmen der Korrekturprüfung abgerufen wurden. */
const VERIFIED_ON = '2026-10-29';

const UBA_STROM_URL = 'https://www.umweltbundesamt.de/themen/co2-emissionen-pro-kilowattstunde-strom-2025-nur';
const UBA_TREMOD_URL = 'https://www.umweltbundesamt.de/system/files/medien/366/bilder/dateien/vtv_2024_pv_tab_pdf.pdf';
const UBA_TREMOD_PUBLICATION =
  'Umweltbundesamt: Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im Personenverkehr in Deutschland 2024 (Quelle: TREMOD 6.71B, 10/2025)';
const EBEV_URL = 'https://www.gesetze-im-internet.de/ebev_2030/anlage_2.html';
const EBEV_PUBLICATION = 'Emissionsberichterstattungsverordnung 2030 (EBeV 2030), Anlage 2 Teil 4 „Standardwerte zur Berechnung von Brennstoffemissionen“';
const BEHG_URL = 'https://www.gesetze-im-internet.de/behg/__10.html';
const CO2KOSTAUFG_URL = 'https://www.gesetze-im-internet.de/co2kostaufg/__4.html';

/** Grundlage der TREMOD-Zeilen: gemeinsame Methodik-Beschreibung laut UBA-Tabelle. */
const TREMOD_METHOD =
  'g CO₂e je Personenkilometer (CO₂, CH₄, N₂O nach AR5) inklusive Bereitstellung und Umwandlung der Energieträger; Elektroantriebe auf Basis des durchschnittlichen deutschen Strommixes. Emissionen aus Infrastruktur und Fahrzeugbereitstellung sind NICHT enthalten (laut UBA gesondert zu betrachten). Der Wert ist bereits auf eine Person bezogen.';

function tremod(
  key: string,
  name: string,
  value: number,
  section: string,
  notes: string,
): EmissionFactor {
  return {
    key,
    name,
    value,
    unit: 'g CO₂e/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: UBA_TREMOD_URL,
    sourcePublication: UBA_TREMOD_PUBLICATION,
    sourceSection: section,
    gasType: 'CO2e',
    boundary: 'tremod_energy_provision',
    methodology: TREMOD_METHOD,
    status: 'final',
    verificationDate: VERIFIED_ON,
    notes,
  };
}

/** Ableitung kg CO₂ je Liter aus EBeV-Dichte (t/1000 l) × Heizwert (GJ/t) × Emissionsfaktor (t CO₂/GJ). */
function ebevLiquid(
  key: string,
  name: string,
  densityTPer1000L: number,
  heatingValueGJPerT: number,
  emissionFactorTPerGJ: number,
  section: string,
): EmissionFactor {
  return {
    key,
    name,
    // t/1000 l × GJ/t × t CO₂/GJ = t CO₂/1000 l = kg CO₂/l
    value: densityTPer1000L * heatingValueGJPerT * emissionFactorTPerGJ,
    unit: 'kg CO₂/Liter',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: EBEV_URL,
    sourcePublication: EBEV_PUBLICATION,
    sourceSection: section,
    gasType: 'CO2',
    boundary: 'direct_combustion',
    methodology:
      'Aus EBeV-Standardwerten abgeleitet: Dichte × Heizwert × heizwertbezogener Emissionsfaktor. Direkte CO₂-Emission bei der Verbrennung, ohne Vorkette. Ableitung durch RechenHafen; die EBeV nennt den Litereswert nicht unmittelbar.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: `${densityTPer1000L} t/1000 l × ${heatingValueGJPerT} GJ/t × ${emissionFactorTPerGJ} t CO₂/GJ`,
    derivation: {
      densityTPer1000L,
      heatingValueGJPerT,
      emissionFactorTPerGJ,
    },
  };
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // ---------------------------------------------------------------------------
  // Strom
  // ---------------------------------------------------------------------------
  strom_mix_de_generation_2025: {
    key: 'strom_mix_de_generation_2025',
    name: 'Deutscher Strommix, Datenjahr 2025 (CO₂ bei der Erzeugung)',
    value: 344,
    unit: 'g CO₂/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: UBA_STROM_URL,
    sourcePublication:
      'Umweltbundesamt: „CO2-Emissionen pro Kilowattstunde Strom 2025 nur leicht gesunken“ (23.03.2026); Publikation „Entwicklung der spezifischen Treibhausgas-Emissionen des deutschen Strommix in den Jahren 1990 – 2025“',
    sourceSection: 'Pressetext: „Pro Kilowattstunde des in Deutschland verbrauchten Stroms wurden im Jahr 2025 bei der Erzeugung durchschnittlich 344 Gramm CO2 ausgestoßen.“',
    gasType: 'CO2',
    boundary: 'energy_generation',
    methodology:
      'Direkte CO₂-Emissionen der Stromerzeugung je kWh des in Deutschland verbrauchten Stroms. Keine Vorketten, keine Anlagenherstellung, keine weiteren Treibhausgase. Laut UBA werden Emissionen eines Stromimportüberschusses nicht der deutschen Stromerzeugung zugerechnet.',
    status: 'estimated',
    verificationDate: VERIFIED_ON,
    notes:
      'UBA-Schätzung für das Datenjahr 2025 (UBA: „2025 wurde geschätzt“); Vorjahre laut UBA: 2024 = 353 g, 2023 = 379 g. Kein vollständiger Haushalts-Fußabdruck und kein Lebenszyklusfaktor.',
  },

  // ---------------------------------------------------------------------------
  // Personenverkehr – UBA TREMOD 6.71B, Bezugsjahr 2024
  // ---------------------------------------------------------------------------
  verkehr_pkw_durchschnitt: tremod(
    'verkehr_pkw_durchschnitt',
    'Pkw (alle Antriebe, Durchschnitt)',
    164,
    'Tabelle, Zeile „Pkw“ (alle Antriebe)',
    'Bereits auf den durchschnittlichen Besetzungsgrad von 1,4 Personen je Pkw bezogen. Darf nicht noch einmal durch die Zahl der Mitfahrenden geteilt werden.',
  ),
  verkehr_pkw_benzin: tremod(
    'verkehr_pkw_benzin',
    'Benzin-Pkw (Durchschnitt)',
    165,
    'Tabelle, Zeile „davon Benzin-Pkw“',
    'Durchschnittswert aller Benzin-Pkw bei 1,4 Personen je Pkw (je Personenkilometer, nicht je Fahrzeugkilometer).',
  ),
  verkehr_pkw_diesel: tremod(
    'verkehr_pkw_diesel',
    'Diesel-Pkw (Durchschnitt)',
    175,
    'Tabelle, Zeile „davon Diesel-Pkw“',
    'Durchschnittswert aller Diesel-Pkw bei 1,4 Personen je Pkw (je Personenkilometer, nicht je Fahrzeugkilometer).',
  ),
  verkehr_pkw_elektro: tremod(
    'verkehr_pkw_elektro',
    'Elektro-Pkw (Durchschnitt)',
    70,
    'Tabelle, Zeile „davon Elektro-Pkw“',
    'Durchschnittswert aller Elektro-Pkw bei 1,4 Personen je Pkw; Strom nach durchschnittlichem deutschen Strommix. Enthält keine Fahrzeugherstellung.',
  ),
  verkehr_bahn_fernverkehr: tremod(
    'verkehr_bahn_fernverkehr',
    'Eisenbahn Fernverkehr',
    26,
    'Tabelle, Zeile „Eisenbahn, Fernverkehr“ (Auslastung 47 %)',
    'Basiert laut UBA auf dem durchschnittlichen deutschen Strommix. Unternehmensspezifische Ökostrom-Bilanzen (z. B. DB CO₂-Kompass) können abweichen.',
  ),
  verkehr_bus_fernverkehr: tremod(
    'verkehr_bus_fernverkehr',
    'Linienbus Fernverkehr',
    30,
    'Tabelle, Zeile „Linienbus, Fernverkehr“ (Auslastung 53 %)',
    'Durchschnittswert Fernlinienbusverkehr.',
  ),
  verkehr_bahn_nahverkehr: tremod(
    'verkehr_bahn_nahverkehr',
    'Eisenbahn Nahverkehr (Regionalbahn, S-Bahn)',
    44,
    'Tabelle, Zeile „Eisenbahn, Nahverkehr“ (Auslastung 30 %)',
    'Durchschnitt aus Elektrotraktion (35 g) und Dieseltraktion (77 g). 44 g/Pkm ist der Nahverkehrswert, nicht der Fernverkehrswert.',
  ),
  verkehr_bus_nahverkehr: tremod(
    'verkehr_bus_nahverkehr',
    'Linienbus Nahverkehr',
    90,
    'Tabelle, Zeile „Linienbus, Nahverkehr“ (Auslastung 16 %)',
    'Alle Antriebe (Diesel, Elektro, Hybride, Erdgas) im Durchschnitt.',
  ),
  verkehr_strassenbahn_ubahn: tremod(
    'verkehr_strassenbahn_ubahn',
    'Straßen-, Stadt- und U-Bahn',
    42,
    'Tabelle, Zeile „Straßen-, Stadt- und U-Bahn“ (Auslastung 19 %)',
    'Durchschnittswert für schienengebundenen Stadtverkehr.',
  ),
  verkehr_pedelec: tremod(
    'verkehr_pedelec',
    'Pedelec',
    3,
    'Tabelle, Zeile „Pedelec“ (1 Person je Pedelec)',
    'Strom für den Antrieb nach deutschem Strommix; ohne Herstellung.',
  ),
  verkehr_pkw_besetzungsgrad: {
    key: 'verkehr_pkw_besetzungsgrad',
    name: 'Durchschnittlicher Pkw-Besetzungsgrad',
    value: 1.4,
    unit: 'Personen/Pkw',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: UBA_TREMOD_URL,
    sourcePublication: UBA_TREMOD_PUBLICATION,
    sourceSection: 'Tabelle, Spalte „Auslastung“, Zeile „Pkw“',
    gasType: 'CO2e',
    boundary: 'tremod_energy_provision',
    methodology: 'Annahme innerhalb der TREMOD-Berechnung. Dient der Erklärung; wird in keiner Rechnung als Divisor verwendet.',
    status: 'final',
    verificationDate: VERIFIED_ON,
    notes: 'Der Pkm-Faktor 164 g enthält diese Annahme bereits. Nicht ein zweites Mal teilen.',
  },
  verkehr_fahrrad_fuss: {
    key: 'verkehr_fahrrad_fuss',
    name: 'Fahrrad / zu Fuß (Rechenannahme)',
    value: 0,
    unit: 'g CO₂e/Pkm',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: UBA_TREMOD_URL,
    sourcePublication: UBA_TREMOD_PUBLICATION,
    sourceSection: 'Kein Tabellenwert – in der UBA-Tabelle nicht aufgeführt',
    gasType: 'CO2e',
    boundary: 'modelling_assumption',
    methodology:
      'Rechenannahme: kein Energieträger, daher 0 g im Sinne der TREMOD-Grenze (Energiebereitstellung). Herstellung, Wartung und Ernährung sind nicht berücksichtigt.',
    status: 'estimated',
    verificationDate: VERIFIED_ON,
    notes: 'Kein amtlicher Wert. Nur als Null-Szenario im Pendelrechner verwendet.',
  },

  // ---------------------------------------------------------------------------
  // Brennstoffe – EBeV 2030 Anlage 2 Teil 4 (statutorische Standardwerte)
  // ---------------------------------------------------------------------------
  brennstoff_erdgas_ebev: {
    key: 'brennstoff_erdgas_ebev',
    name: 'Erdgas (EBeV-Standardwert, je kWh Brennwert)',
    // 3,2508 GJ/MWh × 0,0558 t CO₂/GJ = 0,18139464 t CO₂/MWh = 0,18139464 kg CO₂/kWh
    value: 3.2508 * 0.0558,
    unit: 'kg CO₂/kWh',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: EBEV_URL,
    sourcePublication: EBEV_PUBLICATION,
    sourceSection: 'Nr. 6 Erdgas: Umrechnungsfaktor 3,2508 GJ/MWh, Heizwert 1 GJ/GJ, Emissionsfaktor 0,0558 t CO₂/GJ',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    methodology:
      'Aus EBeV-Standardwerten abgeleitet: 3,2508 GJ/MWh × 0,0558 t CO₂/GJ = 0,18139464 t CO₂/MWh. Direkte CO₂-Emission bei der Verbrennung, ohne Vorkette und ohne Methanschlupf.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Anzeige gerundet 0,1814 kg CO₂/kWh; Berechnungen verwenden den ungerundeten Wert.',
    derivation: { gjPerMwh: 3.2508, emissionFactorTPerGJ: 0.0558 },
  },
  brennstoff_benzin_ebev: ebevLiquid(
    'brennstoff_benzin_ebev',
    'Benzin (EBeV-Standardwert)',
    0.755,
    43.5,
    0.0729,
    'Nr. 1 Benzin: Dichte 0,755 t/1000 l, Heizwert 43,5 GJ/t, Emissionsfaktor 0,0729 t CO₂/GJ',
  ),
  brennstoff_diesel_ebev: ebevLiquid(
    'brennstoff_diesel_ebev',
    'Diesel (EBeV-Standardwert, Gasöl als Kraftstoff)',
    0.845,
    42.8,
    0.074,
    'Nr. 3a Gasöl als Kraftstoff (Diesel): Dichte 0,845 t/1000 l, Heizwert 42,8 GJ/t, Emissionsfaktor 0,074 t CO₂/GJ',
  ),
  brennstoff_heizoel_el_ebev: ebevLiquid(
    'brennstoff_heizoel_el_ebev',
    'Heizöl EL (EBeV-Standardwert, Gasöl zu Heizzwecken)',
    0.845,
    42.8,
    0.074,
    'Nr. 3b Gasöl zu Heizzwecken (Heizöl EL): Dichte 0,845 t/1000 l, Heizwert 42,8 GJ/t, Emissionsfaktor 0,074 t CO₂/GJ',
  ),
  brennstoff_lpg_ebev_kg: {
    key: 'brennstoff_lpg_ebev_kg',
    name: 'Flüssiggas (EBeV-Standardwert, je kg)',
    // 46,0 GJ/t × 0,0655 t CO₂/GJ = 3,013 t CO₂/t = 3,013 kg CO₂/kg
    value: 46.0 * 0.0655,
    unit: 'kg CO₂/kg',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: EBEV_URL,
    sourcePublication: EBEV_PUBLICATION,
    sourceSection: 'Nr. 5 Flüssiggas (5a Kraftstoff / 5b Heizzwecke): Umrechnungsfaktor 1 t/t, Heizwert 46,0 GJ/t, Emissionsfaktor 0,0655 t CO₂/GJ',
    gasType: 'CO2',
    boundary: 'direct_combustion',
    methodology:
      'Aus EBeV-Standardwerten abgeleitet: 46,0 GJ/t × 0,0655 t CO₂/GJ = 3,013 t CO₂/t. Die EBeV enthält für Flüssiggas KEINE Liter-Dichte; deshalb gibt es bewusst keinen Litereswert.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Eingabe nur in Kilogramm. Ein Litereswert würde eine zusätzliche, hier nicht dokumentierte Dichteannahme erfordern.',
    derivation: { heatingValueGJPerT: 46.0, emissionFactorTPerGJ: 0.0655 },
  },

  // ---------------------------------------------------------------------------
  // CO₂-Preise – BEHG § 10 und CO2KostAufG § 4
  // ---------------------------------------------------------------------------
  co2_preis_behg_2024: {
    key: 'co2_preis_behg_2024',
    name: 'Festpreis 2024 (§ 10 Abs. 2 BEHG)',
    value: 45,
    unit: '€/t CO₂',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2024,
    sourceUrl: BEHG_URL,
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 2 Nr. 4: 1. Januar 2024 bis 31. Dezember 2024: 45 Euro',
    gasType: 'CO2',
    boundary: 'price_statutory',
    methodology: 'Gesetzlicher Festpreis je Emissionszertifikat (1 Zertifikat = 1 t CO₂). Kein Endkundenpreis; Umsatzsteuer ist nicht enthalten.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Preis für den Verkauf der Zertifikate durch die zuständige Behörde.',
  },
  co2_preis_behg_2025: {
    key: 'co2_preis_behg_2025',
    name: 'Festpreis 2025 (§ 10 Abs. 2 BEHG)',
    value: 55,
    unit: '€/t CO₂',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2025,
    sourceUrl: BEHG_URL,
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 2 Nr. 5: 1. Januar 2025 bis 31. Dezember 2025: 55 Euro',
    gasType: 'CO2',
    boundary: 'price_statutory',
    methodology: 'Gesetzlicher Festpreis je Emissionszertifikat (1 Zertifikat = 1 t CO₂). Kein Endkundenpreis; Umsatzsteuer ist nicht enthalten.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Preis für den Verkauf der Zertifikate durch die zuständige Behörde.',
  },
  co2_preis_behg_2026_min: {
    key: 'co2_preis_behg_2026_min',
    name: 'Untergrenze des Preiskorridors 2026 (§ 10 Abs. 2 BEHG)',
    value: 55,
    unit: '€/t CO₂',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: BEHG_URL,
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 4 (so zitiert in § 4 Abs. 1 Nr. 2 CO2KostAufG): „Für das Jahr 2026 wird ein Preiskorridor mit einem Mindestpreis von 55 Euro … und einem Höchstpreis von 65 Euro … festgelegt.“',
    gasType: 'CO2',
    boundary: 'price_statutory',
    methodology: 'Gesetzliche Korridorgrenze für die Versteigerung 2026. Kein Festpreis; der tatsächliche Versteigerungspreis liegt innerhalb des Korridors.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Gesetzliche Korridorgrenze, kein „offizieller Preis“.',
  },
  co2_preis_behg_2026_max: {
    key: 'co2_preis_behg_2026_max',
    name: 'Obergrenze des Preiskorridors 2026 (§ 10 Abs. 2 BEHG)',
    value: 65,
    unit: '€/t CO₂',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: BEHG_URL,
    sourcePublication: 'Brennstoffemissionshandelsgesetz (BEHG)',
    sourceSection: '§ 10 Abs. 2 Satz 4: Höchstpreis 65 Euro pro Emissionszertifikat im Jahr 2026',
    gasType: 'CO2',
    boundary: 'price_statutory',
    methodology: 'Gesetzliche Korridorgrenze für die Versteigerung 2026. Kein Festpreis.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Gesetzliche Korridorgrenze, kein „offizieller Preis“.',
  },
  co2_preis_co2kostaufg_2026: {
    key: 'co2_preis_co2kostaufg_2026',
    name: 'Maßgeblicher Zertifikatepreis 2026 nach CO2KostAufG (Mittelwert des Korridors)',
    value: (55 + 65) / 2,
    unit: '€/t CO₂',
    geographicCoverage: 'Deutschland (DE)',
    referenceYear: 2026,
    sourceUrl: CO2KOSTAUFG_URL,
    sourcePublication: 'Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG)',
    sourceSection: '§ 4 Abs. 1 Nr. 2: „im Jahr 2026: Dem Mittelwert des Preiskorridors nach § 10 Absatz 2 Satz 4 des Brennstoffemissionshandelsgesetzes“; Veröffentlichung durch das UBA nach § 4 Abs. 2',
    gasType: 'CO2',
    boundary: 'price_statutory',
    methodology: 'Rechnerischer Mittelwert (55 + 65) ÷ 2 = 60 €/t. Maßgeblich nur dort, wo das CO2KostAufG einen Modellpreis verlangt; bei Abrechnungen gelten die Rechnungsangaben.',
    status: 'statutory',
    verificationDate: VERIFIED_ON,
    notes: 'Das UBA veröffentlicht den maßgeblichen Preis nach § 4 Abs. 2 CO2KostAufG; diesen Wert hat RechenHafen hier nicht separat abgerufen. 60 €/t folgt rechnerisch aus § 4 Abs. 1 Nr. 2.',
  },
};

export function getFactor(key: string): EmissionFactor | undefined {
  return EMISSION_FACTORS[key];
}

/** Aliasse für Dokumentation und Tests. */
export const CO2_PRICE_2026_CORRIDOR = {
  min: EMISSION_FACTORS.co2_preis_behg_2026_min.value,
  midpoint: EMISSION_FACTORS.co2_preis_co2kostaufg_2026.value,
  max: EMISSION_FACTORS.co2_preis_behg_2026_max.value,
} as const;

/**
 * Früher im Register enthaltene Werte, die entfernt wurden, weil für sie keine
 * amtliche Quelle mit passender Bilanzgrenze belegt werden konnte (oder weil sie
 * falsch zugeordnet waren). Sie dürfen nicht als Standardwerte zurückkehren,
 * solange keine exakte amtliche Quelle geprüft wurde.
 */
export const REMOVED_UNVERIFIED_FACTORS: { key: string; oldValue: string; reason: string }[] = [
  { key: 'strom_mix_de_lifecycle_2025', oldValue: '410 g CO₂e/kWh', reason: 'Keine passende amtliche Quelle mit Jahr, Einheit und Lebenszyklus-Grenze belegt.' },
  { key: 'strom_oekostrom_lifecycle', oldValue: '25 g CO₂e/kWh', reason: 'Einzelwert für „Ökostrom“ aus einer Spanne von PV-/Wind-Lebenszykluswerten ohne belastbare Methodik.' },
  { key: 'verkehr_bahn_fernverkehr (alt)', oldValue: '44 g/Pkm', reason: 'Falsch zugeordnet: 44 g/Pkm ist der UBA-Wert für Eisenbahn-Nahverkehr; Fernverkehr = 26 g/Pkm.' },
  { key: 'verkehr_bahn_nahverkehr (alt)', oldValue: '79 g/Pkm', reason: 'Nicht in der UBA-Tabelle; korrekt 44 g/Pkm.' },
  { key: 'verkehr_linienbus (alt)', oldValue: '108 g/Pkm', reason: 'Nicht in der UBA-Tabelle; Nahverkehr 90, Fernverkehr 30 g/Pkm.' },
  { key: 'Straßenbahn/U-Bahn (alt)', oldValue: '79 g/Pkm', reason: 'Nicht in der UBA-Tabelle; korrekt 42 g/Pkm.' },
  { key: 'verkehr_ebike (alt)', oldValue: '4 g/Pkm', reason: 'UBA-Tabelle: Pedelec = 3 g/Pkm.' },
  { key: 'brennstoff_benzin_direkt (alt)', oldValue: '2,37 kg/l', reason: 'EBeV-abgeleitet 2,39421825 kg/l.' },
  { key: 'brennstoff_diesel_direkt / heizöl (alt)', oldValue: '2,65 bzw. 2,66 kg/l', reason: 'EBeV-abgeleitet 2,676284 kg/l.' },
  { key: 'brennstoff_erdgas_direkt (alt)', oldValue: '0,182 kg/kWh', reason: 'EBeV-abgeleitet 0,18139464 kg/kWh.' },
  { key: 'brennstoff_lpg_direkt (alt)', oldValue: '1,65 kg/l', reason: 'EBeV enthält keine Liter-Dichte für Flüssiggas; nur kg-Wert 3,013 kg/kg belegt.' },
  { key: 'brennstoff_benzin_lifecycle', oldValue: '2,82 kg CO₂e/l', reason: 'Keine amtliche Quelle belegt.' },
  { key: 'brennstoff_diesel_lifecycle', oldValue: '3,24 kg CO₂e/l', reason: 'Keine amtliche Quelle belegt.' },
  { key: 'brennstoff_erdgas_lifecycle', oldValue: '0,240 kg CO₂e/kWh', reason: 'Keine amtliche Quelle belegt.' },
  { key: 'brennstoff_heizoel_lifecycle', oldValue: '3,10 kg CO₂e/l', reason: 'Keine amtliche Quelle belegt.' },
  { key: 'brennstoff_holzpellets_lifecycle', oldValue: '0,027 kg CO₂e/kWh', reason: 'Keine amtliche Quelle belegt.' },
  { key: 'brennstoff_fernwaerme_mix', oldValue: '0,160 kg CO₂e/kWh', reason: 'Quelle (AGFW/GEG) nicht geprüft; Fernwärme variiert je Netz stark – kein einzelner Referenzwert belegt.' },
];
