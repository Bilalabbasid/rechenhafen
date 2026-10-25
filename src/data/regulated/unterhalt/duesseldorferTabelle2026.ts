/**
 * Düsseldorfer Tabelle 2026 (Stand 01.01.2026) und Mindestunterhalt 2026.
 *
 * Quellen (geprüft am 2026-10-25):
 *  - OLG Düsseldorf, Düsseldorfer Tabelle, Stand 01.01.2026 (DT_2026.pdf), Tabelle A und Anmerkungen A.II–A.VII,
 *    Anhang „Tabelle Zahlbeträge“ (Kindergeld 2026: 259 €).
 *  - Unterhaltsrechtliche Leitlinien der Familiensenate in NRW, Stand 01.01.2026 (Nr. 10.2.3, 12.2, 13.1, 13.2, 14).
 *  - § 1 Mindestunterhaltsverordnung i. d. F. der Siebten Verordnung zur Änderung der Mindestunterhaltsverordnung
 *    vom 15.11.2024 (BGBl. 2024 I Nr. 359): ab 01.01.2026 486 € / 558 € / 653 €.
 *
 * Das Kindergeld ist bewusst nicht hier hinterlegt: Es kommt aus der Steuer-Konfiguration
 * (getTaxConfig(2026).kindergeldMonat, § 66 Abs. 1 EStG).
 */

export type DtAltersstufe = 1 | 2 | 3 | 4;

export interface DtEinkommensgruppe {
  gruppe: number;
  /** Obergrenze des bereinigten Nettoeinkommens des Barunterhaltspflichtigen in € (inklusive) */
  bis: number;
  /** Prozentsatz bezogen auf den Mindestbedarf (= 1. Einkommensgruppe) */
  prozent: number;
  /** Bedarfskontrollbetrag (Anm. A.III); in Gruppe 1 entspricht er dem notwendigen Selbstbehalt 1.200 € / 1.450 € */
  bedarfskontrollbetrag: number;
}

export const DUESSELDORFER_TABELLE_2026 = {
  stand: '2026-01-01',
  source: 'OLG Düsseldorf, Düsseldorfer Tabelle (Stand 01.01.2026) mit Leitlinien NRW 2026; Mindestunterhaltsverordnung i. d. F. vom 15.11.2024 (BGBl. 2024 I Nr. 359)',
  sourceUrl: 'https://www.olg-duesseldorf.nrw.de/infos/Duesseldorfer_Tabelle/Tabelle-2026/index.php',
  lastVerified: '2026-10-25',

  /**
   * Mindestbedarf je Altersstufe (= Richtsätze der 1. Einkommensgruppe, Anm. A.II).
   * Altersstufen 1–3: § 1 MUV ab 01.01.2026 (0–5 Jahre 486 €, 6–11 Jahre 558 €, 12–17 Jahre 653 €).
   * Altersstufe 4 (ab 18, im Haushalt eines Elternteils): 125 % der 2. Altersstufe, aufgerundet (558 × 1,25 = 697,50 → 698 €).
   */
  mindestbedarf: { 1: 486, 2: 558, 3: 653, 4: 698 } as Record<DtAltersstufe, number>,

  /** Tabelle A: 15 Einkommensgruppen (bis 2.100 € … 9.701–11.200 €), unverändert gegenüber 2025 */
  einkommensgruppen: [
    { gruppe: 1, bis: 2100, prozent: 100, bedarfskontrollbetrag: 1450 },
    { gruppe: 2, bis: 2500, prozent: 105, bedarfskontrollbetrag: 1750 },
    { gruppe: 3, bis: 2900, prozent: 110, bedarfskontrollbetrag: 1850 },
    { gruppe: 4, bis: 3300, prozent: 115, bedarfskontrollbetrag: 1950 },
    { gruppe: 5, bis: 3700, prozent: 120, bedarfskontrollbetrag: 2050 },
    { gruppe: 6, bis: 4100, prozent: 128, bedarfskontrollbetrag: 2150 },
    { gruppe: 7, bis: 4500, prozent: 136, bedarfskontrollbetrag: 2250 },
    { gruppe: 8, bis: 4900, prozent: 144, bedarfskontrollbetrag: 2350 },
    { gruppe: 9, bis: 5300, prozent: 152, bedarfskontrollbetrag: 2450 },
    { gruppe: 10, bis: 5700, prozent: 160, bedarfskontrollbetrag: 2550 },
    { gruppe: 11, bis: 6400, prozent: 168, bedarfskontrollbetrag: 2850 },
    { gruppe: 12, bis: 7200, prozent: 176, bedarfskontrollbetrag: 3250 },
    { gruppe: 13, bis: 8200, prozent: 184, bedarfskontrollbetrag: 3750 },
    { gruppe: 14, bis: 9700, prozent: 192, bedarfskontrollbetrag: 4350 },
    { gruppe: 15, bis: 11200, prozent: 200, bedarfskontrollbetrag: 5050 },
  ] as DtEinkommensgruppe[],

  /** Anm. A.IV / Leitlinien NRW 13.1 Abs. 2: Bedarf eines Studierenden bzw. Kindes mit eigenem Haushalt, inkl. bis 440 € Warmmiete */
  bedarfEigenerHaushalt: 990,
  warmmieteEigenerHaushalt: 440,

  /** Anm. A.VII: notwendiger Selbstbehalt gegenüber minderjährigen und privilegierten volljährigen Kindern (inkl. bis 520 € Warmmiete) */
  selbstbehaltNotwendigErwerbstaetig: 1450,
  selbstbehaltNotwendigNichtErwerbstaetig: 1200,
  /** Anm. A.VII Abs. 2: angemessener Selbstbehalt gegenüber nicht privilegierten volljährigen Kindern (inkl. bis 650 € Warmmiete) */
  selbstbehaltAngemessen: 1750,

  /** Leitlinien NRW 10.2.3: pauschaler Ausbildungsaufwand eines Azubis im Haushalt der Eltern / eines Elternteils */
  ausbildungsaufwandPauschale: 100,
} as const;

/** Einkommensgruppe nach bereinigtem Nettoeinkommen; oberhalb von 11.200 € bleibt es bei Gruppe 15 (darüber: Einzelfall). */
export function getDtEinkommensgruppe(bereinigtesNetto: number): DtEinkommensgruppe {
  const gruppen = DUESSELDORFER_TABELLE_2026.einkommensgruppen;
  return gruppen.find((g) => bereinigtesNetto <= g.bis) ?? gruppen[gruppen.length - 1];
}

/**
 * Tabellenbetrag (Bedarf) = Mindestbedarf × Prozentsatz, aufgerundet auf volle Euro
 * (Anm. A.II i. V. m. § 1612a Abs. 2 Satz 2 BGB). Ganzzahlige Rechnung, damit z. B. 653 × 200 % nicht durch
 * Gleitkomma-Reste auf 1.307 € aufgerundet wird.
 */
export function getDtTabellenbetrag(altersstufe: DtAltersstufe, prozent: number): number {
  return Math.ceil((DUESSELDORFER_TABELLE_2026.mindestbedarf[altersstufe] * prozent) / 100);
}
