import { CalculatorDefinition, DisclaimerType, LegalBasisLink } from '@/types/calculator';

export interface CalculatorLegalMetadata {
  disclaimerType: DisclaimerType;
  rechtsstand?: string;
  legalBasis: LegalBasisLink[];
  assumptions: string[];
}

// Spezifische Zuweisungen für Rechner nach Slug
const SLUG_METADATA_OVERRIDES: Record<string, Partial<CalculatorLegalMetadata>> = {
  // --- STEUERN ---
  'einkommensteuer-rechner': {
    disclaimerType: 'steuer',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 32a EStG (Einkommensteuertarif)', url: 'https://www.gesetze-im-internet.de/estg/__32a.html' },
      { label: '§ 3 SolzG (Solidaritätszuschlaggesetz)', url: 'https://www.gesetze-im-internet.de/solzg_1995/__3.html' },
    ],
    assumptions: [
      'Berechnung nach dem Grundtarif für Alleinstehende bzw. Splittingverfahren für Verheiratete',
      'Grundfreibetrag 2026 von 12.348 € je steuerpflichtiger Person berücksichtigt',
      'Pauschale Werbungskosten und Sonderausgaben nach gesetzlichen Standardpauschalen',
      'Individuelle außergewöhnliche Belastungen oder Verlustvorträge bleiben unberücksichtigt',
    ],
  },
  'lohnsteuer-rechner': {
    disclaimerType: 'steuer',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 38a, § 39b EStG (Einbehaltung der Lohnsteuer)', url: 'https://www.gesetze-im-internet.de/estg/__39b.html' },
      { label: 'BMF Programmablaufplan für den Lohnsteuerabzug 2026', url: 'https://www.bmf-steuerrechner.de' },
    ],
    assumptions: [
      'Berechnung auf Grundlage des amtlichen BMF-Programmablaufplans 2026',
      'Einstufung in die vom Nutzer gewählte Steuerklasse (I bis VI)',
      'Gesetzliche Sozialversicherungspauschale nach Standardansätzen der Vorsorgepauschale',
      'Ohne Berücksichtigung individueller Freibeträge auf der elektronischen Lohnsteuerkarte (ELStAM)',
    ],
  },
  'brutto-netto-rechner': {
    disclaimerType: 'gehalt-sozialversicherung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 38a, § 39b EStG (Lohnsteuer)', url: 'https://www.gesetze-im-internet.de/estg/__39b.html' },
      { label: 'Sozialversicherungs-Rechengrößenverordnung 2026', url: 'https://www.gesetze-im-internet.de/sgb_4/__18.html' },
      { label: '§ 241, § 242a SGB V (Gesetzliche Krankenversicherung)', url: 'https://www.gesetze-im-internet.de/sgb_5/__241.html' },
    ],
    assumptions: [
      'Gesetzliche Krankenversicherung mit durchschnittlichem Zusatzbeitragssatz von 2,9 %',
      'Rentenversicherungspflicht (18,6 %) und Arbeitslosenversicherungspflicht (2,6 %)',
      'Pflegeversicherungsbeitrag 3,6 % (ggf. Zuschlag für Kinderlose ab 23 Jahren oder Kinderabschlag)',
      'Ohne Berücksichtigung von Sachbezügen, Firmenwagen oder individuellen ELStAM-Freibeträgen',
    ],
  },
  'minijob-rechner': {
    disclaimerType: 'gehalt-sozialversicherung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 8 Abs. 1a SGB IV (Geringfügigkeitsgrenze 603 €)', url: 'https://www.gesetze-im-internet.de/sgb_4/__8.html' },
      { label: '§ 40a Abs. 2 EStG (Pauschale Lohnsteuer 2 %)', url: 'https://www.gesetze-im-internet.de/estg/__40a.html' },
      { label: 'Minijob-Zentrale: Abgaben und Umlagen 2026', url: 'https://www.minijob-zentrale.de/DE/fuer-gewerbetreibende/abgaben-und-steuern/abgaben-und-steuern_node.html' },
    ],
    assumptions: [
      'Geringfügige Beschäftigung im gewerblichen Bereich bis maximal 603 € monatlich',
      'Arbeitgeber trägt die gesetzlichen Pauschalbeiträge (15 % RV, 13 % KV) und Pauschsteuer (2 %)',
      'Optionale Befreiung von der Rentenversicherungspflicht für den Arbeitnehmer wählbar',
      'Gesetzlicher Mindestlohn von 13,90 € pro Stunde ab 01.01.2026 zugrunde gelegt',
    ],
  },
  'midijob-rechner': {
    disclaimerType: 'gehalt-sozialversicherung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 20 Abs. 2 SGB IV (Übergangsbereich)', url: 'https://www.gesetze-im-internet.de/sgb_4/__20.html' },
      { label: 'BMAS Bekanntmachung Faktor F 2026 (0,6619)', url: 'https://www.bmas.de' },
    ],
    assumptions: [
      'Monatliches Bruttoentgelt im gesetzlichen Übergangsbereich zwischen 603,01 € und 2.000,00 €',
      'Berechnung der reduzierten Arbeitnehmer-Beitragsbelastung mittels amtlichem Faktor F (0,6619)',
      'Volle Rentenansprüche trotz reduzierter Beitragszahlung gemäß § 70 Abs. 1a SGB VI',
      'Gesetzliche Kranken- und Pflegeversicherung mit Standardbeitragssätzen 2026',
    ],
  },
  'mindestlohn-rechner': {
    disclaimerType: 'gehalt-sozialversicherung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 1 Mindestlohngesetz (MiLoG)', url: 'https://www.gesetze-im-internet.de/milog/__1.html' },
      { label: 'Fünfte Mindestlohnanpassungsverordnung (MiLoV5)', url: 'https://www.gesetze-im-internet.de/milov5/BJNR10C0A0025.html' },
    ],
    assumptions: [
      'Gesetzlicher Mindestlohn von 13,90 € je Zeitstunde (gültig ab 01.01.2026 in ganz Deutschland)',
      'Vergütung aller tatsächlich geleisteten Arbeitsstunden ohne unzulässige Anrechnungen',
      'Durchschnittlich 4,345 Wochen bzw. 173,33 Arbeitsstunden pro Monat bei einer 40-Stunden-Woche',
    ],
  },
  'buergergeld-rechner': {
    disclaimerType: 'sozialleistung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 20 SGB II (Regelbedarf zur Sicherung des Lebensunterhalts)', url: 'https://www.gesetze-im-internet.de/sgb_2/__20.html' },
      { label: '§ 22 SGB II (Bedarfe für Unterkunft und Heizung)', url: 'https://www.gesetze-im-internet.de/sgb_2/__22.html' },
      { label: '§ 11b SGB II (Absetzbeträge bei Erwerbseinkommen)', url: 'https://www.gesetze-im-internet.de/sgb_2/__11b.html' },
    ],
    assumptions: [
      'Regelbedarfsstufen 2026 (z. B. 563 € für Alleinstehende / Regelbedarfsstufe 1)',
      'Angemessene Kosten der Unterkunft und Heizung (KdU) nach kommunalen Richtwerten',
      'Gesetzliche Freibeträge auf Erwerbseinkommen nach § 11b SGB II',
      'Vermögen liegt innerhalb der Karenzzeit bzw. der gesetzlichen Schonvermögensgrenzen',
    ],
  },
  'unterhalt-rechner': {
    disclaimerType: 'sozialleistung',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 1612a BGB (Mindestunterhalt minderjähriger Kinder)', url: 'https://www.gesetze-im-internet.de/bgb/__1612a.html' },
      { label: 'Düsseldorfer Tabelle 2026 (OLG Düsseldorf)', url: 'https://www.olg-duesseldorf.nrw.de' },
      { label: '§ 1603 BGB (Leistungsfähigkeit und Selbstbehalt)', url: 'https://www.gesetze-im-internet.de/bgb/__1603.html' },
    ],
    assumptions: [
      'Einstufung nach der bundesweit angewendeten Düsseldorfer Tabelle (Stand: 2026)',
      'Bedarfsermittlung auf Grundlage des bereinigten Nettoeinkommens des Barunterhaltspflichtigen',
      'Hälftige Anrechnung des gesetzlichen Kindergeldes (259 €) bei minderjährigen Kindern',
      'Wahrung des notwendigen Selbstbehalts für Erwerbstätige bzw. Nichterwerbstätige',
    ],
  },
  'elterngeld-rechner': {
    disclaimerType: 'sozialleistung',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Bundeselterngeld- und Elternzeitgesetz (BEEG)', url: 'https://www.gesetze-im-internet.de/beeg/' },
      { label: '§ 2 BEEG (Höhe des Elterngeldes)', url: 'https://www.gesetze-im-internet.de/beeg/__2.html' },
    ],
    assumptions: [
      'Ersatzrate von 65 % bis 67 % des maßgeblichen durchschnittlichen Nettoeinkommens vor der Geburt',
      'Gesetzlicher Basiselterngeld-Rahmen zwischen 300 € Mindestbetrag und 1.800 € Höchstbetrag monatlich',
      'Ohne Berücksichtigung von Geschwisterbonus oder Mehrlingszuschlag, sofern nicht angegeben',
    ],
  },
  'wohngeld-rechner': {
    disclaimerType: 'sozialleistung',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Wohngeldgesetz (WoGG)', url: 'https://www.gesetze-im-internet.de/wogg/' },
      { label: '§ 19 WoGG (Höhe des Wohngeldes)', url: 'https://www.gesetze-im-internet.de/wogg/__19.html' },
    ],
    assumptions: [
      'Wohnungsinhaber ist dem Grunde nach wohngeldberechtigt (kein Bezug von Bürgergeld mit KdU)',
      'Zuschussfähige Miete bzw. Belastung innerhalb der regionalen Mietenstufen-Höchstbeträge',
      'Berücksichtigung der gesetzlichen Heizkosten- und Klimakomponenten',
    ],
  },
  'kuendigungsfrist-rechner': {
    disclaimerType: 'recht',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 622 BGB (Kündigungsfristen bei Arbeitsverhältnissen)', url: 'https://www.gesetze-im-internet.de/bgb/__622.html' },
      { label: '§ 573c BGB (Fristen der ordentlichen Kündigung bei Mietverhältnissen)', url: 'https://www.gesetze-im-internet.de/bgb/__573c.html' },
    ],
    assumptions: [
      'Berechnung der gesetzlichen Grundfristen nach Bürgerlichem Gesetzbuch (BGB)',
      'Keine abweichenden einzelvertraglichen, tarifvertraglichen oder betrieblichen Kündigungsfristen',
      'Ordnungsgemäßer Zugang des Kündigungsschreibens gemäß § 130 BGB',
    ],
  },
  'bussgeld-rechner': {
    disclaimerType: 'verkehr-bussgeld',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Bußgeldkatalog-Verordnung (BKatV)', url: 'https://www.gesetze-im-internet.de/bkatv_2013/' },
      { label: 'Straßenverkehrs-Ordnung (StVO)', url: 'https://www.gesetze-im-internet.de/stvo_2013/' },
    ],
    assumptions: [
      'Bundesweit einheitlicher Regelsatz der BKatV für Pkw ohne Anhänger bei fahrlässiger Begehung',
      'Erstverstoß ohne Voreintragungen im Fahreignungsregister (FAER) in Flensburg',
      'Toleranzabzug der Messgeräte wurde bei den eingegebenen Werten bereits berücksichtigt',
    ],
  },
  'promillerechner': {
    disclaimerType: 'alkohol-verkehr',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 24a StVG (0,5-Promille-Grenze im Straßenverkehr)', url: 'https://www.gesetze-im-internet.de/stvg/__24a.html' },
      { label: '§ 316 StGB (Trunkenheit im Verkehr)', url: 'https://www.gesetze-im-internet.de/stgb/__316.html' },
    ],
    assumptions: [
      'Näherungsweise Berechnung der Blutalkoholkonzentration (BAK) nach der Widmark-Formel',
      'Durchschnittlicher Reduktionsfaktor (r = 0,68 für Männer, r = 0,55 für Frauen)',
      'Linearer Abbau von durchschnittlich 0,10 bis 0,15 Promille pro Stunde nach vollständiger Resorption',
      'Keine Berücksichtigung von individueller Alkoholtoleranz, Medikamenteneinnahme oder Mageninhalt',
    ],
  },
  'notarkosten-rechner': {
    disclaimerType: 'immobilien',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Gerichts- und Notarkostengesetz (GNotKG)', url: 'https://www.gesetze-im-internet.de/gnotkg/' },
      { label: 'Kostenverzeichnis Anlage 1 zum GNotKG', url: 'https://www.gesetze-im-internet.de/gnotkg/anlage_1.html' },
    ],
    assumptions: [
      'Gebührensätze nach Tabelle B des Gerichts- und Notarkostengesetzes (GNotKG)',
      'Standard-Beurkundung eines Immobilienkaufvertrags (2,0 Gebührensatz nach KV 21100)',
      'Grundbuchvollzug und Löschungsbewilligungen nach Standard-Fallgestaltungen',
      'Zuzüglich gesetzlicher Auslagen (Post/Telekommunikation) und 19 % Mehrwertsteuer',
    ],
  },
  'grunderwerbsteuer-rechner': {
    disclaimerType: 'immobilien',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Grunderwerbsteuergesetz (GrEStG)', url: 'https://www.gesetze-im-internet.de/grestg_1983/' },
      { label: '§ 11 GrEStG (Steuersatz je nach Bundesland)', url: 'https://www.gesetze-im-internet.de/grestg_1983/__11.html' },
    ],
    assumptions: [
      'Anwendung des aktuellen Grunderwerbsteuersatzes des jeweiligen Bundeslandes (3,5 % bis 6,5 %)',
      'Bemessungsgrundlage ist der beurkundete Kaufpreis der Immobilie inklusive fest verbundener Teile',
      'Bewegliches Inventar (z. B. Einbauküche) bleibt steuerfrei, sofern separat im Kaufvertrag ausgewiesen',
    ],
  },
  'kapitalertragsteuer-rechner': {
    disclaimerType: 'steuer',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 43, § 43a EStG (Kapitalertragsteuer / Abgeltungsteuer)', url: 'https://www.gesetze-im-internet.de/estg/__43a.html' },
      { label: '§ 20 Abs. 9 EStG (Sparer-Pauschbetrag)', url: 'https://www.gesetze-im-internet.de/estg/__20.html' },
    ],
    assumptions: [
      'Pauschalierte Abgeltungsteuer von 25 % zuzüglich 5,5 % Solidaritätszuschlag (effektiv 26,375 %)',
      'Sparer-Pauschbetrag 2026 von 1.000 € (Alleinstehende) bzw. 2.000 € (Verheiratete) abzugsfähig',
      'Kirchensteuer wird nur bei entsprechender Religionszugehörigkeit hinzugerechnet',
    ],
  },
  'zinseszins-rechner': {
    disclaimerType: 'finanzen',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 20 EStG (Besteuerung von Erträgen)', url: 'https://www.gesetze-im-internet.de/estg/__20.html' },
    ],
    assumptions: [
      'Gleichbleibender nominaler Zinssatz über den gesamten gewählten Anlagezeitraum',
      'Vollständige Reinvestition aller erwirtschafteten Zinsen zum selben Zinssatz',
      'Keine Berücksichtigung von unvorhergesehenen Transaktionsgebühren oder Depotkosten',
    ],
  },
  'kredit-rechner': {
    disclaimerType: 'finanzen',
    rechtsstand: '2026',
    legalBasis: [
      { label: '§ 491 ff. BGB (Verbraucherdarlehensvertrag)', url: 'https://www.gesetze-im-internet.de/bgb/__491.html' },
      { label: '§ 6 Preisangabenverordnung (PAngV - Effektiver Jahreszins)', url: 'https://www.gesetze-im-internet.de/pangv_2022/__6.html' },
    ],
    assumptions: [
      'Fester Sollzinssatz und konstante Monatsrate über die vereinbarte Zinsbindungsdauer',
      'Pünktliche Ratenzahlung zum Monatsersten ohne Zahlungsverzug oder Stundungen',
      'Reguläre Verrechnung von Zins und Tilgung nach monatlicher Annuitätenmethode',
    ],
  },
  'mietrendite-brutto-netto-rechner': {
    disclaimerType: 'immobilien',
    rechtsstand: '2026',
    legalBasis: [
      { label: 'Betriebskostenverordnung (BetrKV)', url: 'https://www.gesetze-im-internet.de/betrkv/' },
    ],
    assumptions: [
      'Gegenüberstellung von Brutto- und Nettomietrendite einer Anlageimmobilie',
      'Laufende Bewirtschaftungs- und Instandhaltungskosten nach Erfahrungswerten',
      'Keine Berücksichtigung von unvorhergesehenem Mietausfallwagnis',
    ],
  },
  'motorrad-unterhaltskosten-rechner': {
    disclaimerType: 'allgemein',
    legalBasis: [],
    assumptions: [
      'Schätzung der jährlichen laufenden Betriebskosten für Motorräder',
      'Durchschnittliche Aufwendungen für Kfz-Haftpflicht, Kraftstoff, Inspektion und Verschleiß',
      'Individuelle Fahrleistung und Schadenfreiheitsrabatt (SF-Klasse) beeinflussen das reale Ergebnis maßgeblich',
    ],
  },
};

/**
 * Ermittelt die Disclaimer- und Rechtsmetadaten für jeden Rechner deterministisch
 */
export function resolveCalculatorLegalMetadata(calc: Partial<CalculatorDefinition>): CalculatorLegalMetadata {
  const slug = calc.slug || '';
  const category = calc.category || '';
  const slugLower = slug.toLowerCase();
  const nameLower = (calc.name || '').toLowerCase();

  // 1. Spezifischer Override vorhanden?
  const override = SLUG_METADATA_OVERRIDES[slug];
  if (override && override.disclaimerType && override.assumptions) {
    return {
      disclaimerType: override.disclaimerType,
      rechtsstand: override.rechtsstand,
      legalBasis: override.legalBasis || [],
      assumptions: override.assumptions,
    };
  }

  // 2. Zeitrechner und Kalenderrechner in datum-zeit (rein mathematisch / kalendarisch)
  if (category === 'datum-zeit') {
    if (slugLower.includes('mutterschutz')) {
      return {
        disclaimerType: 'schwangerschaft',
        rechtsstand: '2026',
        legalBasis: [
          { label: '§ 3 Mutterschutzgesetz (MuSchG)', url: 'https://www.gesetze-im-internet.de/muschg_2018/__3.html' },
        ],
        assumptions: [
          'Schutzfrist beginnt 6 Wochen vor dem errechneten Entbindungstermin',
          'Reguläre Schutzfrist endet 8 Wochen nach der Entbindung (12 Wochen bei Früh- oder Mehrlingsgeburten)',
        ],
      };
    }
    if (slugLower.includes('kuendigung')) {
      return {
        disclaimerType: 'recht',
        rechtsstand: '2026',
        legalBasis: [
          { label: '§ 622 BGB (Kündigungsfristen Arbeitsverhältnis)', url: 'https://www.gesetze-im-internet.de/bgb/__622.html' },
        ],
        assumptions: [
          'Gesetzliche Mindestfristen nach § 622 BGB',
          'Ohne Berücksichtigung tariflicher oder abweichender Arbeitsvertragsklauseln',
        ],
      };
    }

    return {
      disclaimerType: 'allgemein',
      legalBasis: [],
      assumptions: [
        'Kalendarische Berechnung nach dem gregorianischen Kalendersystem',
        'Zeitzonenbasis ist die mitteleuropäische Zeit (MEZ/MESZ)',
      ],
    };
  }

  // 3. Bußgeld & Verkehrsverstöße
  if (
    slugLower.includes('bussgeld') ||
    slugLower.includes('geschwindigkeitsueberschreitung') ||
    slugLower.includes('blitzer') ||
    slugLower.includes('rote-ampel') ||
    slugLower.includes('abstand-rechner') ||
    (category === 'auto' && (slugLower.includes('punkte') || slugLower.includes('fahrverbot')))
  ) {
    return {
      disclaimerType: 'verkehr-bussgeld',
      rechtsstand: '2026',
      legalBasis: [
        { label: 'Bußgeldkatalog-Verordnung (BKatV)', url: 'https://www.gesetze-im-internet.de/bkatv_2013/' },
        { label: 'Straßenverkehrs-Ordnung (StVO)', url: 'https://www.gesetze-im-internet.de/stvo_2013/' },
      ],
      assumptions: [
        'Regelsätze des bundeseinheitlichen Bußgeldkatalogs für Pkw und Erstverstoß',
        'Toleranzabzug der amtlichen Geschwindigkeitsmessung ist bei den Werten berücksichtigt',
        'Keine Berücksichtigung von Gefährdungstatbeständen oder Sachbeschädigung',
      ],
    };
  }

  // 4. Alkohol & Promille
  if (slugLower.includes('promille') || slugLower.includes('alkohol')) {
    return {
      disclaimerType: 'alkohol-verkehr',
      rechtsstand: '2026',
      legalBasis: [
        { label: '§ 24a StVG (Promillegrenzen im Verkehr)', url: 'https://www.gesetze-im-internet.de/stvg/__24a.html' },
      ],
      assumptions: [
        'Rechnerische Näherung nach der Widmark-Formel mit Durchschnittswerten',
        'Standard-Abbaurate von circa 0,10 bis 0,15 Promille pro Stunde',
        'Keine Gewährleistung für individuelle Fahrtauglichkeit oder Reaktionsfähigkeit',
      ],
    };
  }

  // 5. Schwangerschaft & Geburt
  if (
    category === 'familie' &&
    (slugLower.includes('schwangerschaft') || slugLower.includes('geburt') || slugLower.includes('eisprung') || slugLower.includes('ssw'))
  ) {
    return {
      disclaimerType: 'schwangerschaft',
      legalBasis: [
        { label: 'Mutterschutzgesetz (MuSchG)', url: 'https://www.gesetze-im-internet.de/muschg_2018/' },
      ],
      assumptions: [
        'Regelmäßiger 28-tägiger weiblicher Menstruationszyklus',
        'Berechnung der Schwangerschaftsdauer (280 Tage) nach der erweiterten Naegele-Regel',
        'Standard-Mutterschutzfristen (6 Wochen vor der Geburt, 8 Wochen danach)',
      ],
    };
  }

  // 6. Sozialleistungen (Bürgergeld, Unterhalt, Elterngeld, Kindergeld, Wohngeld, BAföG, Pflegegrad)
  if (
    category === 'familie' ||
    slugLower.includes('buergergeld') ||
    slugLower.includes('unterhalt') ||
    slugLower.includes('elterngeld') ||
    slugLower.includes('kindergeld') ||
    slugLower.includes('kinderzuschlag') ||
    slugLower.includes('wohngeld') ||
    slugLower.includes('bafoeg') ||
    slugLower.includes('pflegegrad') ||
    slugLower.includes('pflegegeld')
  ) {
    if (slugLower.includes('unterhalt') || slugLower.includes('duesseldorfer')) {
      return {
        disclaimerType: 'sozialleistung',
        rechtsstand: '2026',
        legalBasis: [
          { label: 'Düsseldorfer Tabelle 2026', url: 'https://www.olg-duesseldorf.nrw.de' },
          { label: '§ 1612a BGB', url: 'https://www.gesetze-im-internet.de/bgb/__1612a.html' },
        ],
        assumptions: [
          'Einstufung nach der aktuellen Düsseldorfer Tabelle 2026',
          'Bereinigtes Nettoeinkommen des Unterhaltspflichtigen nach Abzug berufsbedingter Aufwendungen',
          'Hälftige Kindergeldanrechnung bei Minderjährigen',
        ],
      };
    }

    return {
      disclaimerType: 'sozialleistung',
      rechtsstand: '2026',
      legalBasis: [
        { label: 'Sozialgesetzbuch (SGB)', url: 'https://www.gesetze-im-internet.de/' },
        { label: 'Regelbedarfe und gesetzliche Richtwerte 2026', url: 'https://www.bmas.de' },
      ],
      assumptions: [
        'Anwendung der bundesweit gültigen Regelsätze und Bemessungsgrundlagen 2026',
        'Angemessene Wohn- und Lebensverhältnisse nach gesetzlichen Standardwerten',
        'Rechtsansprüche und Leistungsbewilligungen stehen unter Vorbehalt behördlicher Prüfung',
      ],
    };
  }

  // 7. Steuern & Gehalt
  if (
    category === 'steuern-gehalt' ||
    category === 'arbeit-gehalt' ||
    slugLower.includes('gehalt') ||
    slugLower.includes('steuer') ||
    slugLower.includes('brutto-netto') ||
    slugLower.includes('lohn') ||
    slugLower.includes('minijob') ||
    slugLower.includes('midijob') ||
    slugLower.includes('kurzarbeitergeld') ||
    slugLower.includes('abfindung') ||
    slugLower.includes('dienstwagen')
  ) {
    if (
      slugLower.includes('gehalt') ||
      slugLower.includes('brutto-netto') ||
      slugLower.includes('lohn') ||
      slugLower.includes('minijob') ||
      slugLower.includes('midijob') ||
      slugLower.includes('kurzarbeitergeld') ||
      slugLower.includes('arbeitslosengeld') ||
      slugLower.includes('krankengeld') ||
      slugLower.includes('stundenlohn') ||
      slugLower.includes('teilzeit')
    ) {
      return {
        disclaimerType: 'gehalt-sozialversicherung',
        rechtsstand: '2026',
        legalBasis: [
          { label: '§ 38a, § 39b EStG (Lohnsteuerabzug)', url: 'https://www.gesetze-im-internet.de/estg/__39b.html' },
          { label: 'Sozialversicherungs-Rechengrößenverordnung 2026', url: 'https://www.gesetze-im-internet.de/sgb_4/__18.html' },
          { label: '§ 241, § 242a SGB V (Gesetzliche Krankenversicherung)', url: 'https://www.gesetze-im-internet.de/sgb_5/__241.html' },
        ],
        assumptions: [
          'Gesetzliche Kranken- und Pflegeversicherung mit regulären Beitragssätzen 2026',
          'Arbeitslosen- und Rentenversicherungspflicht nach Standardregelungen',
          'Einstufung in die gewählte Steuerklasse ohne individuelle Freibeträge auf der Lohnsteuerkarte',
        ],
      };
    }

    return {
      disclaimerType: 'steuer',
      rechtsstand: '2026',
      legalBasis: [
        { label: 'Einkommensteuergesetz (EStG)', url: 'https://www.gesetze-im-internet.de/estg/' },
        { label: '§ 32a EStG (Tarifvorschriften)', url: 'https://www.gesetze-im-internet.de/estg/__32a.html' },
      ],
      assumptions: [
        'Berechnungsgrundlage auf Basis der steuerlichen Rahmendaten 2026',
        'Reguläre Standardpauschalen (Werbungskosten- und Sonderausgaben-Pauschbetrag)',
        'Ohne Berücksichtigung individueller Härtefälle oder Sonderausgaben über Pauschalen hinaus',
      ],
    };
  }

  // 8. Recht (Kündigung, Fristen, Verjährung, Pflichtteil)
  if (
    slugLower.includes('kuendigung') ||
    slugLower.includes('verjaehrung') ||
    slugLower.includes('pflichtteil') ||
    slugLower.includes('erbe') ||
    slugLower.includes('anwalt')
  ) {
    return {
      disclaimerType: 'recht',
      rechtsstand: '2026',
      legalBasis: [
        { label: 'Bürgerliches Gesetzbuch (BGB)', url: 'https://www.gesetze-im-internet.de/bgb/' },
      ],
      assumptions: [
        'Berechnung der gesetzlichen Fristen und Regelsätze nach dem BGB',
        'Keine abweichenden tarifvertraglichen oder individualvertraglichen Klauseln',
        'Reguläre Kalender- und Werktagsfristen ohne Sondervereinbarungen',
      ],
    };
  }

  // 9. Immobilien & Wohnen
  if (
    category === 'wohnen' ||
    slugLower.includes('notar') ||
    slugLower.includes('grundbuch') ||
    slugLower.includes('makler') ||
    slugLower.includes('grunderwerbsteuer') ||
    slugLower.includes('kaufnebenkosten') ||
    slugLower.includes('miete') ||
    slugLower.includes('mietspiegel') ||
    slugLower.includes('nebenkosten')
  ) {
    return {
      disclaimerType: 'immobilien',
      rechtsstand: '2026',
      legalBasis: [
        { label: 'Gerichts- und Notarkostengesetz (GNotKG)', url: 'https://www.gesetze-im-internet.de/gnotkg/' },
        { label: 'Betriebskostenverordnung (BetrKV)', url: 'https://www.gesetze-im-internet.de/betrkv/' },
      ],
      assumptions: [
        'Standardmäßige Kosten- und Gebührensätze nach amtlichen Tabellen',
        'Reguläre Umlagemaßstäbe nach Wohnfläche bzw. gesetzlichen Bestimmungen',
        'Ohne gesonderte komplexe Notarverträge oder individuelle bauliche Sondervereinbarungen',
      ],
    };
  }

  // 10. Finanzen, Kredit & Schulden
  if (
    category === 'finanzen' ||
    category === 'kredit-schulden' ||
    category === 'business' ||
    slugLower.includes('zins') ||
    slugLower.includes('kredit') ||
    slugLower.includes('darlehen') ||
    slugLower.includes('tilgung') ||
    slugLower.includes('annuitaet') ||
    slugLower.includes('etf') ||
    slugLower.includes('sparplan') ||
    slugLower.includes('inflation') ||
    slugLower.includes('rendite') ||
    slugLower.includes('rente')
  ) {
    return {
      disclaimerType: 'finanzen',
      rechtsstand: '2026',
      legalBasis: [
        { label: '§ 491 BGB (Verbraucherdarlehen)', url: 'https://www.gesetze-im-internet.de/bgb/__491.html' },
        { label: 'Preisangabenverordnung (PAngV)', url: 'https://www.gesetze-im-internet.de/pangv_2022/' },
      ],
      assumptions: [
        'Konstanter nominaler Zinssatz über die gesamte vereinbarte Laufzeit',
        'Fristgerechte Zins- und Tilgungszahlung ohne Ausfälle oder Verzugszinsen',
        'Reinvestition von Zinserträgen zum gleichen Zinssatz (bei Zinseszinsberechnungen)',
      ],
    };
  }

  // 11. Gesundheit & Sport
  if (
    category === 'gesundheit-sport' ||
    slugLower.includes('bmi') ||
    slugLower.includes('kalorien') ||
    slugLower.includes('grundumsatz') ||
    slugLower.includes('puls') ||
    slugLower.includes('koerperfett')
  ) {
    return {
      disclaimerType: 'gesundheit',
      legalBasis: [],
      assumptions: [
        'Berechnung für gesunde erwachsene Personen nach standardisierten physiologischen Formeln',
        'Statistische Durchschnittswerte für Körperzusammensetzung und Stoffwechselrate',
        'Ergebnisse dienen der Orientierung und berücksichtigen keine chronischen Erkrankungen',
      ],
    };
  }

  // 12. Bauen & Handwerk
  if (
    category === 'bauen-handwerk' ||
    slugLower.includes('beton') ||
    slugLower.includes('estrich') ||
    slugLower.includes('fliesen') ||
    slugLower.includes('pflaster') ||
    slugLower.includes('schalungssteine') ||
    slugLower.includes('trockenbau') ||
    slugLower.includes('dachneigung') ||
    slugLower.includes('treppe')
  ) {
    return {
      disclaimerType: 'bauen',
      legalBasis: [],
      assumptions: [
        'Theoretische Materialbedarfsberechnung auf Basis der eingegebenen geometrischen Maße',
        'Marktüblicher Verschnitt und Verarbeitungsverluste müssen gesondert einkalkuliert werden',
        'Statische und baurechtliche Anforderungen vor Ort sind durch Fachpersonal zu prüfen',
      ],
    };
  }

  // Standard: Allgemein
  return {
    disclaimerType: 'allgemein',
    legalBasis: [],
    assumptions: [
      'Mathematisch exakte Standardformeln und anerkannte Einheitenumrechnungen',
      'Berechnung erfolgt deterministisch unmittelbar auf Basis Ihrer Eingabewerte',
    ],
  };
}
