import { CategoryGuideMap } from './types';
import { LEGAL_VALUES_2025 } from '@/legal/de/2025';
import { LEGAL_VALUES_2026 } from '@/legal/de/2026';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';
import { DUESSELDORFER_TABELLE_2026 as DT } from '@/data/regulated/unterhalt/duesseldorferTabelle2026';
import { CO2_PRICE_2026_CORRIDOR as CO2_PRICE, EMISSION_FACTORS as EF } from '@/data/emissions';
import { formatCurrency, formatNumber } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Values (all from repo data, never typed by hand)
// ---------------------------------------------------------------------------

/** Whole-euro amounts: formatCurrency(n, 0) throws, so format the number and append the sign. */
const eur = (n: number) => `${formatNumber(n, 0)} €`;
const L26 = LEGAL_VALUES_2026;

// Familie
const KINDERGELD = L26.kindergeldMonat.value;
const MINDEST = DT.mindestbedarf;
/** § 2 UVG: Unterhaltsvorschuss = Mindestunterhalt − volles Kindergeld für ein erstes Kind */
const UVG = { 1: MINDEST[1] - KINDERGELD, 2: MINDEST[2] - KINDERGELD, 3: MINDEST[3] - KINDERGELD };

// Auto
const PENDLER_2026 = L26.pendlerpauschaleStandard.value;
const PENDLER_2025_NAH = LEGAL_VALUES_2025.pendlerpauschaleStandard.value;
const PENDLER_2025_FERN = LEGAL_VALUES_2025.pendlerpauschaleFernpendler.value;
const AN_PAUSCHBETRAG = L26.arbeitnehmerPauschbetrag.value;
const PENDEL_TAGE = 220;
const PENDEL_KM = 30;
const pendler2026 = PENDEL_KM * PENDLER_2026 * PENDEL_TAGE;
const pendler2025 = (20 * PENDLER_2025_NAH + (PENDEL_KM - 20) * PENDLER_2025_FERN) * PENDEL_TAGE;
const breakEvenKm = AN_PAUSCHBETRAG / (PENDLER_2026 * PENDEL_TAGE);
const CO2_BENZIN = EF.brennstoff_benzin_ebev.value; // kg CO₂/l
const CO2_DIESEL = EF.brennstoff_diesel_ebev.value; // kg CO₂/l
const STROMMIX = EF.strom_mix_de_generation_2025.value; // g CO₂/kWh
const PKW_PKM = EF.verkehr_pkw_durchschnitt.value; // g CO₂e/Pkm
const BAHN_NAH_PKM = EF.verkehr_bahn_nahverkehr.value; // g CO₂e/Pkm

// Haushalt
const CO2_GAS = EF.brennstoff_erdgas_ebev.value; // kg CO₂/kWh
const CO2_HEIZOEL = EF.brennstoff_heizoel_el_ebev.value; // kg CO₂/l
/** ct je Einheit bei gegebenem €/t-Preis: kg/Einheit × €/t ÷ 1.000 × 100 */
const ctPer = (kgPerUnit: number, eurPerT: number) => (kgPerUnit * eurPerT) / 10;
const GAS_BEISPIEL_KWH = 15000;
const gasBeispielKg = GAS_BEISPIEL_KWH * CO2_GAS;

// Bauen
const GEG_U_WAND = GERMAN_DATA_2026.geg_u_wert_aussenwand.value;

export const ALLTAG_GESUNDHEIT_GUIDES: CategoryGuideMap = {
  // -------------------------------------------------------------------------
  'familie-schwangerschaft': {
    questions: [
      {
        question: 'Wann ist mein Geburtstermin, wenn meine letzte Periode am 3. März begann?',
        slug: 'geburtstermin-rechner',
        hint: 'errechneter Termin und heutige SSW, angepasst an Ihre Zykluslänge',
      },
      {
        question: 'Wann sind bei einem 32-Tage-Zyklus meine fruchtbaren Tage?',
        slug: 'zykluslaenge-eisprung-rechner',
        hint: 'voraussichtlicher Eisprung und fruchtbares Fenster – keine Methode zur Verhütung',
      },
      {
        question: 'Wie viel Kindesunterhalt muss ich bei 2.800 € bereinigtem Netto zahlen?',
        slug: 'duesseldorfer-tabelle-rechner',
        hint: 'Einkommensgruppe, Tabellenbetrag und Zahlbetrag nach Abzug des Kindergeldanteils',
      },
      {
        question: 'Wie viel Unterhaltsvorschuss gibt es, wenn der andere Elternteil nicht zahlt?',
        slug: 'unterhaltsvorschuss-rechner',
        hint: 'Monatsbetrag nach Alter des Kindes, gekürzt um tatsächlich gezahlten Unterhalt',
      },
      {
        question: 'Bekommen wir mit zwei Kindern und 2.800 € brutto Kinderzuschlag?',
        slug: 'kinderzuschlag-kiz-rechner',
        hint: 'grobe Schätzung des Anspruchs; verbindlich entscheidet die Familienkasse',
      },
      {
        question: 'Wie viel Geld bekomme ich, wenn ich wegen meines kranken Kindes zu Hause bleibe?',
        slug: 'kinderkrankentage-kinderkrankengeld-rechner',
        hint: 'Kinderkrankengeld für Ihre Fehltage und das Tageskontingent je Elternteil',
      },
      {
        question: 'Wie viel Mutterschaftsgeld bekomme ich bei 2.400 € netto?',
        slug: 'mutterschaftsgeld-rechner',
        hint: 'Anteil der Krankenkasse plus Arbeitgeberzuschuss bis zu Ihrem bisherigen Netto',
      },
      {
        question: 'Wie viel Unterhalt steht meiner studierenden Tochter mit eigener Wohnung zu?',
        slug: 'unterhalt-volljaehrige-kinder-rechner',
        hint: 'offener Bedarf nach Abzug von Kindergeld, BAföG oder Nebenjob',
      },
      {
        question: 'Wie viel Steuern spare ich mit 3.600 € Kita-Gebühren im Jahr?',
        slug: 'kinderbetreuungskosten-absetzen-rechner',
        hint: 'absetzbarer Anteil der Betreuungskosten und Ersparnis bei Ihrem Grenzsteuersatz',
      },
    ],
    keyFacts: {
      title: 'Familienleistungen und Unterhalt: Beträge 2026',
      intro: 'Diese Werte verwenden die Rechner dieser Kategorie. Maßgeblich für Ihren Fall sind Bescheid, Urteil oder Jugendamt.',
      rows: [
        { label: 'Kindergeld', value: `${eur(KINDERGELD)} je Kind und Monat`, note: 'für jedes Kind gleich hoch' },
        {
          label: 'Mindestunterhalt (0–5 / 6–11 / 12–17 Jahre)',
          value: `${eur(MINDEST[1])} / ${eur(MINDEST[2])} / ${eur(MINDEST[3])}`,
          note: '1. Einkommensgruppe der Düsseldorfer Tabelle, vor Kindergeldabzug',
        },
        {
          label: 'Unterhaltsvorschuss (0–5 / 6–11 / 12–17 Jahre)',
          value: `${eur(UVG[1])} / ${eur(UVG[2])} / ${eur(UVG[3])}`,
          note: 'Mindestunterhalt minus volles Kindergeld',
        },
        {
          label: 'Selbstbehalt gegenüber minderjährigen Kindern',
          value: `${eur(DT.selbstbehaltNotwendigErwerbstaetig)} / ${eur(DT.selbstbehaltNotwendigNichtErwerbstaetig)}`,
          note: 'erwerbstätig / nicht erwerbstätig',
        },
        {
          label: 'Bedarf eines Kindes mit eigenem Haushalt',
          value: `${eur(DT.bedarfEigenerHaushalt)} im Monat`,
          note: `darin bis ${eur(DT.warmmieteEigenerHaushalt)} Warmmiete; Kindergeld wird abgezogen`,
        },
        {
          label: 'Schulbedarfspaket (Bildung und Teilhabe)',
          value: `${eur(GERMAN_DATA_2026.schulbedarfspaket_gesamt.value)} je Schuljahr`,
          note: 'nur bei Bürgergeld, Kinderzuschlag, Wohngeld u. Ä.',
        },
      ],
      source: '§ 66 und § 32 Abs. 6 EStG, § 2 UVG, Mindestunterhaltsverordnung, Düsseldorfer Tabelle 2026 (OLG Düsseldorf), § 28 SGB II; Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Düsseldorfer Tabelle, Unterhaltsvorschuss oder Kinderzuschlag – welcher Rechner passt?',
        answer:
          `Die Düsseldorfer Tabelle beantwortet, was der Elternteil zahlen muss, bei dem das Kind nicht lebt. Der Unterhaltsvorschuss springt ein, wenn dieser Elternteil gar nicht oder weniger zahlt: Für ein Kind von 6 bis 11 Jahren sind das 2026 ${eur(MINDEST[2])} Mindestunterhalt minus ${eur(KINDERGELD)} Kindergeld, also ${eur(UVG[2])} im Monat. ` +
          'Der Kinderzuschlag hat mit Trennung nichts zu tun: Er richtet sich an erwerbstätige Eltern, deren Einkommen für sich selbst reicht, aber nicht für die ganze Familie. Alleinerziehende prüfen deshalb oft beide.',
      },
      {
        question: 'Wie zuverlässig sind Geburtstermin- und Zyklusrechner?',
        answer:
          'Beide arbeiten mit Standardannahmen: einer Schwangerschaftsdauer von 280 Tagen ab der letzten Periode und, sofern Sie nichts anderes eintragen, einer Lutealphase von 14 Tagen. Schwankt Ihr Zyklus stark, verschieben sich Termin und Eisprung entsprechend. ' +
          'In der Schwangerschaft prüft die Frauenärztin oder der Frauenarzt den Termin beim frühen Ultraschall und korrigiert ihn bei Bedarf; für die Mutterschutzfristen zählt der von Arztpraxis oder Hebamme bescheinigte Termin. Der Zyklusrechner hilft bei Kinderwunsch, zur Verhütung ist er ungeeignet.',
      },
      {
        question: 'Was können die Unterhalts- und Leistungsrechner nicht abbilden?',
        answer:
          'Die Unterhaltsrechner setzen ein bereits bereinigtes Nettoeinkommen voraus; Abzüge wie berufsbedingte Aufwendungen oder Kreditraten müssen Sie vorher selbst klären. Mangelfälle, das Wechselmodell und Höher- oder Herabstufungen rechnen sie nicht. ' +
          'Beim Kinderzuschlag fehlen Vermögen, Wohngeld und genaue Freibeträge, bei den Kita-Gebühren die Satzung Ihrer Kommune. Für Bescheide und Titel sind Familienkasse, Jugendamt oder eine Fachanwältin zuständig.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'gesundheit-fitness': {
    questions: [
      {
        question: 'Ist ein BMI von 27 bei 1,80 m Körpergröße zu hoch?',
        slug: 'bmi-rechner',
        hint: 'WHO-Gewichtsklasse und Gewichtsspanne für Normalgewicht bei Ihrer Größe',
      },
      {
        question: 'Wie viele Kalorien sollte ich am Tag essen, um langsam abzunehmen?',
        slug: 'kalorienbedarf-rechner',
        hint: 'Grundumsatz, Tagesbedarf mit PAL-Wert und ein Ziel mit moderatem Defizit',
      },
      {
        question: 'Wie viel Gramm Eiweiß brauche ich bei 80 kg und Krafttraining?',
        slug: 'proteinbedarf-sportler-rechner',
        hint: 'Gramm pro Tag als Spanne, abgestimmt auf Sportart und Ziel',
      },
      {
        question: 'Ist ein Blutdruck von 135 zu 85 noch normal?',
        slug: 'blutdruck-klassifikation-rechner',
        hint: 'Einstufung nach ESH-Leitlinie; wiederholt erhöhte Werte ärztlich abklären',
      },
      {
        question: 'In welchem Pulsbereich trainiere ich Grundlagenausdauer?',
        slug: 'puls-trainingszonen-rechner',
        hint: 'fünf Zonen aus geschätztem oder selbst gemessenem Maximalpuls',
      },
      {
        question: 'Ist ein Bauchumfang von 94 cm bei 1,78 m bedenklich?',
        slug: 'waist-to-hip-ratio-rechner',
        hint: 'Taille-Hüft- und Taille-zu-Größe-Verhältnis mit Einordnung',
      },
      {
        question: 'Wie lange dauert es, bis drei Bier abgebaut sind?',
        slug: 'alkohol-abbau-rechner',
        hint: 'grobe Stundenzahl nach Durchschnittswerten, kein Freibrief zum Fahren',
      },
      {
        question: 'Kann ich um 16 Uhr noch Kaffee trinken, wenn ich um 23 Uhr schlafe?',
        slug: 'koffein-halbwertszeit-rechner',
        hint: 'Restmenge Koffein zur Schlafenszeit nach Getränk und Tassenzahl',
      },
      {
        question: 'Wie viele Kilometer sind 10.000 Schritte?',
        slug: 'schritt-distanz-kalorien-rechner',
        hint: 'Strecke aus Ihrer Körpergröße geschätzt, dazu der ungefähre Energieverbrauch',
      },
    ],
    keyFacts: {
      title: 'Grenzwerte und Formeln, mit denen die Rechner einordnen',
      intro: 'Die Grenzwerte gelten für Erwachsene. Für Kinder, Schwangere und bei Vorerkrankungen gelten andere Maßstäbe.',
      rows: [
        { label: 'BMI Normalgewicht', value: '18,5 bis unter 25', note: 'WHO-Einteilung, Einheit kg/m²' },
        { label: 'BMI Adipositas', value: 'ab 30', note: 'WHO; Grad II ab 35, Grad III ab 40' },
        { label: 'Blutdruck optimal', value: 'unter 120 / 80 mmHg', note: 'ESH-Leitlinie, Messung in der Praxis' },
        { label: 'Bluthochdruck (Grad 1)', value: 'ab 140 / 90 mmHg', note: 'einer der beiden Werte genügt' },
        { label: 'Eiweißzufuhr ohne Sport', value: '0,8 g je kg Körpergewicht', note: 'DGE-Referenzwert; ab 65 Jahren 1,0 g/kg' },
        { label: 'Grundumsatz (Mifflin-St Jeor)', value: '10 × kg + 6,25 × cm − 5 × Alter', note: '+5 bei Männern, −161 bei Frauen' },
        { label: 'Maximalpuls (Tanaka)', value: '208 − 0,7 × Alter', note: 'Schätzwert; Messung im Belastungstest ist genauer' },
      ],
      source: 'WHO (BMI-Klassen), European Society of Hypertension 2023 (Blutdruck), Deutsche Gesellschaft für Ernährung (Protein), Mifflin et al. 1990, Tanaka et al. 2001; Werte im Rechner hinterlegt',
    },
    faqs: [
      {
        question: 'BMI, Taillenumfang oder Kalorienbedarf – womit sollte ich anfangen?',
        answer:
          'Der BMI ist eine schnelle erste Einordnung, unterscheidet aber nicht zwischen Muskeln und Fett. Ein Beispiel: 90 kg bei 1,80 m ergeben einen BMI von 27,8 und damit Übergewicht. Liegt der Taillenumfang derselben Person bei 85 cm, beträgt das Verhältnis zur Körpergröße nur 0,47 – ein Hinweis auf wenig Bauchfett, etwa bei sportlichen Menschen. ' +
          'Wer abnehmen oder zunehmen möchte, plant danach mit dem Kalorienbedarf-Rechner und verteilt das Ziel mit dem Makronährstoff-Rechner auf Eiweiß, Kohlenhydrate und Fett.',
      },
      {
        question: 'Wie genau sind die Kalorienangaben für Sport und Alltag?',
        answer:
          'Grundumsatz-Formeln und MET-Werte beschreiben Durchschnittsmenschen. Für 45 Minuten moderates Brustschwimmen bei 72 kg ergibt sich rechnerisch 6 × 72 × 0,75 = 324 kcal; Technik, Tempo und Trainingszustand verschieben diesen Wert spürbar. ' +
          'Nutzen Sie das Ergebnis als Startwert und prüfen Sie über zwei bis drei Wochen, wie sich Ihr Gewicht tatsächlich entwickelt.',
      },
      {
        question: 'Wofür sind die Gesundheitsrechner nicht gedacht?',
        answer:
          'Sie stellen keine Diagnose und ersetzen keinen Arztbesuch. Ein einzelner Blutdruckwert sagt wenig; erst mehrere Messungen an verschiedenen Tagen ergeben ein Bild. Der BMI für Erwachsene passt nicht für Kinder und Jugendliche, dort gelten Perzentilkurven. ' +
          'In der Schwangerschaft, bei Nierenerkrankungen, Essstörungen oder Diabetes sollten Ernährungsziele mit Ärztin, Arzt oder Ernährungsfachkraft abgestimmt werden. Der Alkoholabbau-Rechner taugt nicht zur Entscheidung, ob Sie wieder fahren dürfen.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'auto-verkehr': {
    questions: [
      {
        question: 'Was kostet die Fahrt von Hamburg nach München mit dem Auto?',
        slug: 'spritkostenrechner',
        hint: 'Liter, Spritkosten und Anteil pro Person, auf Wunsch mit Maut und Parken',
      },
      {
        question: 'Wie viel Pendlerpauschale kann ich bei 30 km Arbeitsweg absetzen?',
        slug: 'pendlerpauschale-rechner',
        hint: 'Jahresbetrag für die Steuererklärung, Homeoffice-Tage bereits abgezogen',
      },
      {
        question: 'Was kostet ein Elektroauto auf 100 km mit Haushaltsstrom?',
        slug: 'elektroauto-ladekosten-rechner',
        hint: 'Kosten je 100 km und je Akkuladung aus Verbrauch und Strompreis',
      },
      {
        question: 'Wie viel verbraucht mein Auto wirklich auf 100 km?',
        slug: 'kraftstoffverbrauch-rechner',
        hint: 'realer Verbrauch aus getankten Litern und gefahrenen Kilometern',
      },
      {
        question: 'Wie hoch ist die Kfz-Steuer für einen Benziner mit 135 g CO₂/km?',
        slug: 'kfz-steuer-rechner',
        hint: 'Jahressteuer aus Hubraum und CO₂-Wert laut Fahrzeugschein',
      },
      {
        question: 'Ist beim Firmenwagen das Fahrtenbuch günstiger als die 1-%-Regel?',
        slug: 'dienstwagen-1-prozent-rechner',
        hint: 'geldwerter Vorteil beider Methoden im direkten Vergleich',
      },
      {
        question: 'Was kostet mein Auto wirklich pro Kilometer?',
        slug: 'auto-gesamtkosten-rechner',
        hint: 'Vollkosten mit Wertverlust, Versicherung, Steuer und Werkstatt',
      },
      {
        question: 'Ist eine Leasingrate von 320 € für ein Auto mit 42.000 € Listenpreis gut?',
        slug: 'leasingfaktor-rechner',
        hint: 'Leasingfaktor, auch mit Sonderzahlung und Überführung eingerechnet',
      },
      {
        question: 'Wie viel CO₂ spare ich, wenn ich mit der Bahn statt mit dem Auto pendle?',
        slug: 'co2-pendeln-rechner',
        hint: 'Jahresemissionen zweier Verkehrsmittel nach UBA-Durchschnittswerten',
      },
      {
        question: 'Wie lang ist der Anhalteweg bei 50 km/h?',
        slug: 'bremsweg-rechner',
        hint: 'Reaktions-, Brems- und Anhalteweg nach den Fahrschul-Faustformeln',
      },
    ],
    keyFacts: {
      title: 'Werte rund ums Auto 2026',
      rows: [
        {
          label: 'Entfernungspauschale',
          value: `${formatCurrency(PENDLER_2026)} je km`,
          note: 'ab dem ersten Kilometer der einfachen Strecke',
        },
        {
          label: 'Arbeitnehmer-Pauschbetrag',
          value: eur(AN_PAUSCHBETRAG),
          note: `Pendlerpauschale bringt erst darüber etwas; bei ${PENDEL_TAGE} Arbeitstagen ab rund ${formatNumber(breakEvenKm, 1)} km`,
        },
        {
          label: 'CO₂-Preis (nationaler Emissionshandel)',
          value: `${eur(CO2_PRICE.min)} bis ${eur(CO2_PRICE.max)} je Tonne`,
          note: 'Preiskorridor 2026, kein Festpreis',
        },
        { label: 'CO₂ je Liter Benzin', value: `${formatNumber(CO2_BENZIN, 2)} kg`, note: 'direkte Verbrennung, ohne Herstellung des Kraftstoffs' },
        { label: 'CO₂ je Liter Diesel', value: `${formatNumber(CO2_DIESEL, 2)} kg`, note: 'mehr als Benzin, weil Diesel dichter ist' },
        { label: 'Strommix für E-Autos', value: `${formatNumber(STROMMIX, 0)} g CO₂ je kWh`, note: 'Datenjahr 2025, Emissionen der Erzeugung' },
        {
          label: 'Pkw vs. Nahverkehrszug',
          value: `${formatNumber(PKW_PKM, 0)} / ${formatNumber(BAHN_NAH_PKM, 0)} g CO₂e je Pkm`,
          note: 'Durchschnitt je Personenkilometer inkl. Energiebereitstellung',
        },
      ],
      source: '§ 9 und § 9a EStG, § 10 BEHG, EBeV 2030 Anlage 2, Umweltbundesamt (Strommix 2025, TREMOD 2024); Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Spritkosten-, Gesamtkosten- oder Fahrgemeinschaftsrechner – was ist der Unterschied?',
        answer:
          'Der Spritkostenrechner erfasst nur den Kraftstoff, auf Wunsch ergänzt um Maut, Parken und eine Verschleißpauschale: 50 km bei 6,8 l/100 km und 1,78 € je Liter kosten 6,05 €. ' +
          'Der Gesamtkostenrechner rechnet dagegen alles ein, was ein Auto über das Jahr kostet, vor allem den Wertverlust, der oft größer ist als die Tankrechnung. Der Fahrgemeinschaftsrechner teilt die laufenden Fahrtkosten mit Abnutzungszuschlag gerecht auf alle Insassen auf.',
      },
      {
        question: 'Was ändert sich 2026 bei der Pendlerpauschale?',
        answer:
          `Seit 2026 gelten ${formatCurrency(PENDLER_2026)} je Entfernungskilometer ab dem ersten Kilometer. Bis 2025 waren es für die ersten 20 km nur ${formatCurrency(PENDLER_2025_NAH)}. ` +
          `Bei ${PENDEL_KM} km einfacher Strecke und ${PENDEL_TAGE} Arbeitstagen steigt der absetzbare Betrag damit von ${eur(Math.round(pendler2025))} auf ${eur(Math.round(pendler2026))}. ` +
          'Die Pauschale ist keine Erstattung, sondern mindert das zu versteuernde Einkommen; was Sie tatsächlich zurückbekommen, hängt von Ihrem Steuersatz ab.',
      },
      {
        question: 'Darf ich mich auf Promille- oder Bremswegrechner verlassen?',
        answer:
          'Nein, beide liefern nur Modellwerte. Die Widmark-Formel schätzt den Blutalkohol aus Durchschnittswerten; Mageninhalt, Medikamente und Tagesform können das echte Ergebnis deutlich verschieben. Ob Sie fahrtüchtig sind, lässt sich so nicht feststellen – nach Alkohol bleibt das Auto stehen. ' +
          'Die Bremsweg-Faustformeln stammen aus dem Fahrschulunterricht; nasse Fahrbahn, abgefahrene Reifen oder Beladung verlängern den Anhalteweg.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'haushalt-energie': {
    questions: [
      {
        question: 'Was kostet ein Kühlschrank mit 220 kWh Jahresverbrauch an Strom?',
        slug: 'stromkosten-geraete-rechner',
        hint: 'Kosten pro Tag, Monat und Jahr, auch Altgerät gegen Neugerät',
      },
      {
        question: 'Welcher Abschlag passt bei 2.500 kWh Stromverbrauch im Jahr?',
        slug: 'stromkostenrechner',
        hint: 'Jahreskosten aus Arbeits- und Grundpreis, auf zwölf Monate verteilt',
      },
      {
        question: 'Wie rechne ich 1.200 m³ Gas in Kilowattstunden um?',
        slug: 'gasverbrauch-kwh-m3-rechner',
        hint: 'kWh mit Brennwert und Zustandszahl Ihrer Rechnung, dazu die Kosten',
      },
      {
        question: 'Was kostet Gas im Jahr bei 14.000 kWh Verbrauch?',
        slug: 'gaskostenrechner',
        hint: 'Jahreskosten und Monatsdurchschnitt inklusive Grundpreis',
      },
      {
        question: 'Wie viel Strom braucht eine Wärmepumpe im Einfamilienhaus?',
        slug: 'waermepumpe-stromkosten-rechner',
        hint: 'Strombedarf und Heizkosten aus Wärmebedarf und Jahresarbeitszahl',
      },
      {
        question: 'Heize ich mit Gas, Öl, Pellets oder Wärmepumpe am günstigsten?',
        slug: 'heizkostenvergleich-rechner',
        hint: 'Jahreskosten und CO₂ der Heizarten bei gleichem Wärmebedarf',
      },
      {
        question: 'Lohnt sich ein Balkonkraftwerk mit 800 Watt?',
        slug: 'balkonkraftwerk-ertrag-rechner',
        hint: 'Jahresertrag, Ersparnis und Zeit bis zur Amortisation',
      },
      {
        question: 'Wie viel von den CO₂-Kosten muss mein Vermieter übernehmen?',
        slug: 'co2-abgabe-vermieter-mieter-rechner',
        hint: 'Stufe nach CO₂-Ausstoß je m² und Anteile von Mieter und Vermieter',
      },
      {
        question: 'Wie viel CO₂ verursachen 3.000 kWh Strom im Jahr?',
        slug: 'co2-strom-rechner',
        hint: 'Kilogramm CO₂ mit dem UBA-Faktor oder einem Wert Ihres Tarifs',
      },
    ],
    keyFacts: {
      title: 'CO₂-Faktoren und CO₂-Preis für Strom und Heizung',
      intro: 'Mit diesen Werten rechnen die Energie- und CO₂-Rechner. Ihre Abrechnung kann andere, versorgerspezifische Werte enthalten.',
      rows: [
        { label: 'Strom (Mix Deutschland)', value: `${formatNumber(STROMMIX, 0)} g CO₂ je kWh`, note: 'UBA-Schätzung für 2025, nur Erzeugung' },
        { label: 'Erdgas', value: `${formatNumber(CO2_GAS, 3)} kg CO₂ je kWh`, note: 'Standardwert für die Verbrennung' },
        { label: 'Heizöl EL', value: `${formatNumber(CO2_HEIZOEL, 2)} kg CO₂ je Liter`, note: 'Standardwert für die Verbrennung' },
        { label: 'CO₂-Preis 2026', value: `${eur(CO2_PRICE.min)} bis ${eur(CO2_PRICE.max)} je Tonne`, note: 'gesetzlicher Preiskorridor' },
        { label: 'Modellpreis für die Kostenaufteilung', value: `${eur(CO2_PRICE.midpoint)} je Tonne`, note: 'Mittelwert des Korridors (CO2KostAufG)' },
        {
          label: 'CO₂-Preis je kWh Gas',
          value: `${formatNumber(ctPer(CO2_GAS, CO2_PRICE.min), 2, 2)} bis ${formatNumber(ctPer(CO2_GAS, CO2_PRICE.max), 2, 2)} ct`,
          note: 'netto, ohne Umsatzsteuer',
        },
        {
          label: 'CO₂-Preis je Liter Heizöl',
          value: `${formatNumber(ctPer(CO2_HEIZOEL, CO2_PRICE.min), 1, 1)} bis ${formatNumber(ctPer(CO2_HEIZOEL, CO2_PRICE.max), 1, 1)} ct`,
          note: 'netto, ohne Umsatzsteuer',
        },
        { label: 'Gas: m³ in kWh', value: 'm³ × Brennwert × Zustandszahl', note: 'beide Faktoren stehen auf der Gasrechnung' },
      ],
      source: 'Umweltbundesamt (Strommix 2025), EBeV 2030 Anlage 2 Teil 4, § 10 BEHG, § 4 CO2KostAufG; Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Warum weicht das Ergebnis von meiner Jahresabrechnung ab?',
        answer:
          'Die Rechner multiplizieren Verbrauch und Preis für einen glatten Zeitraum. Echte Abrechnungen laufen selten von Januar bis Dezember, enthalten oft eine Preisänderung mitten im Jahr und teilen den Verbrauch dann zeitanteilig auf. ' +
          'Beim Heizen kommt das Wetter hinzu: Ein kalter Winter erhöht den Verbrauch, ohne dass sich an Ihrem Verhalten etwas geändert hat. Vergleichen Sie deshalb am besten Verbrauch in kWh oder m³ über mehrere Jahre, nicht nur den Eurobetrag.',
      },
      {
        question: 'Welche CO₂-Werte und welchen CO₂-Preis verwenden die Rechner?',
        answer:
          `Für Strom gilt der Wert des Umweltbundesamts für 2025, für Gas und Heizöl der gesetzliche Standardwert aus dem Emissionshandel. Der CO₂-Preis liegt 2026 in einem Korridor von ${eur(CO2_PRICE.min)} bis ${eur(CO2_PRICE.max)} je Tonne. ` +
          `Ein Beispiel: ${formatNumber(GAS_BEISPIEL_KWH, 0)} kWh Gas verursachen rund ${formatNumber(gasBeispielKg, 0)} kg CO₂; das entspricht einem CO₂-Preisanteil von ${formatCurrency((gasBeispielKg / 1000) * CO2_PRICE.min)} bis ${formatCurrency((gasBeispielKg / 1000) * CO2_PRICE.max)} netto im Jahr. ` +
          'Was Ihr Versorger tatsächlich weitergibt, steht auf der Rechnung.',
      },
      {
        question: 'Was können die Energierechner nicht?',
        answer:
          'Sie kennen weder aktuelle Tarife noch Ihren Versorger; Preise tragen Sie selbst ein. Förderprogramme, Finanzierung und Zuschüsse für Heizungstausch oder Photovoltaik rechnen sie nicht ein. ' +
          'Heizöl- und Pelletrechner arbeiten mit Modellannahmen pro Quadratmeter oder Wirkungsgrad und ersetzen weder Energieausweis noch Energieberatung. Für eine Heizungsentscheidung lohnt sich eine Heizlastberechnung durch einen Fachbetrieb.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  'bauen-renovieren': {
    questions: [
      {
        question: 'Wie viel Wandfarbe brauche ich für ein Zimmer mit 20 m² Grundfläche?',
        slug: 'farbmengen-rechner',
        hint: 'Liter und Eimer für Wände und Decke, abhängig von der Zahl der Anstriche',
      },
      {
        question: 'Wie viele Pakete Laminat brauche ich für 23 m²?',
        slug: 'bodenbelag-rechner',
        hint: 'Fläche mit Verschnitt und aufgerundete Paketzahl nach Paketinhalt',
      },
      {
        question: 'Wie viel Fliesenkleber brauche ich für 25 m² mit 8er Zahnung?',
        slug: 'fliesenkleber-rechner',
        hint: 'Kilogramm und Säcke Kleber sowie Fugenmörtel für Ihre Fläche',
      },
      {
        question: 'Wie viele Säcke Fertigbeton brauche ich für eine Platte von 3 × 2 m?',
        slug: 'betonrechner',
        hint: 'Volumen mit Reserve, umgerechnet in Säcke oder Zement und Kies',
      },
      {
        question: 'Wie viel Beton brauche ich für die Punktfundamente eines Carports?',
        slug: 'fundament-rechner',
        hint: 'Betonvolumen für Punkt-, Streifen- oder Plattenfundament',
      },
      {
        question: 'Wie viele Pflastersteine und wie viel Splitt brauche ich für 40 m² Einfahrt?',
        slug: 'pflastersteine-rechner',
        hint: 'Steinanzahl je Format und Menge für das Splittbett',
      },
      {
        question: 'Reichen 16 cm Dämmung an der Außenwand für die GEG-Anforderung?',
        slug: 'daemmung-u-wert-rechner',
        hint: 'U-Wert der gewählten Dämmung im Vergleich zum Höchstwert',
      },
      {
        question: 'Wie hoch werden die Stufen bei 2,80 m Geschosshöhe?',
        slug: 'treppen-stufen-rechner',
        hint: 'Steigungen, Stufenhöhe und Auftritt nach der Schrittmaßregel',
      },
      {
        question: 'Wie viele Gipskartonplatten brauche ich für eine 5 m lange Trennwand?',
        slug: 'trockenbau-gipskarton-rechner',
        hint: 'Platten, CW- und UW-Profile sowie Schrauben für Ihre Wand',
      },
    ],
    keyFacts: {
      title: 'Faustwerte für die Materialplanung',
      intro: 'Typische Richtwerte, mit denen die Rechner vorbelegt sind. Angaben auf Sack, Eimer oder Datenblatt gehen immer vor.',
      rows: [
        { label: 'Gefälle', value: '1 % = 1 cm je Meter', note: 'exakte Umrechnung' },
        { label: 'Wandfarbe', value: 'ca. 7 m² je Liter und Anstrich', note: 'typischer Wert; saugende Untergründe brauchen mehr' },
        { label: 'Fliesenkleber (6 / 8 / 10 mm Zahnung)', value: 'ca. 2,4 / 3,2 / 4,0 kg je m²', note: 'typischer Verbrauch' },
        { label: 'Mauerziegel 2DF / NF', value: 'ca. 32 / 48 Stück je m²', note: 'Wandfläche ohne Öffnungen' },
        { label: 'Splitt 2/5, lose', value: 'ca. 1,5 t je m³', note: 'Schüttdichte schwankt je Lieferant' },
        { label: 'Schrittmaßregel Treppe', value: '2 × Steigung + Auftritt ≈ 63 cm', note: 'bequemer Bereich 59–65 cm' },
        {
          label: 'U-Wert Außenwand bei Sanierung',
          value: `höchstens ${formatNumber(GEG_U_WAND, 2)} W/(m²·K)`,
          note: 'Höchstwert nach GEG Anlage 7',
        },
      ],
      source: 'Herstellerübliche Richtwerte (Material), GEG Anlage 7 (U-Wert); Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Wie viel Reserve sollte ich beim Material einplanen?',
        answer:
          'Das hängt vom Material und vom Raum ab. Bei Laminat in einem rechteckigen Zimmer reichen meist 5 bis 10 %, bei vielen Ecken, Nischen oder Diagonalverlegung mehr. Beim Beton gleicht die Reserve unebene Baugruben aus; der Rechner bietet dafür 5 oder 10 % an. ' +
          'Kaufen Sie Fliesen, Laminat und Farbe möglichst aus einer Charge und heben Sie ein Paket oder einen Rest auf: Spätere Reparaturen fallen sonst durch abweichende Farbtöne auf.',
      },
      {
        question: 'Betonrechner, Fundament-Rechner oder Schalungsstein-Rechner – welcher passt?',
        answer:
          'Der Betonrechner ist für einfache Körper wie Platten, Sockel oder einen Gartenweg gedacht und übersetzt das Volumen in Säcke oder in Zement und Kies. Der Fundament-Rechner kennt die typischen Formen Streifen-, Punkt- und Plattenfundament mit frostfreier Tiefe. ' +
          'Der Schalungsstein-Rechner zählt die Steine einer Mauer und den Füllbeton nach Herstellerangabe; das Fundament darunter rechnen Sie getrennt mit dem Fundament-Rechner.',
      },
      {
        question: 'Ersetzen Baugrund- und Holzbalken-Rechner eine Statik?',
        answer:
          'Nein. Beide zeigen nur, in welcher Größenordnung Bodenpressung und Durchbiegung liegen, mit vereinfachten Annahmen zu Boden, Holz und Lasten. Ob ein Fundament trägt, ein Deckenbalken reicht oder eine Wand entfernt werden darf, entscheidet eine Statikerin oder ein Tragwerksplaner, beim Boden gegebenenfalls mit Baugrundgutachten. ' +
          'Ob ein Vorhaben genehmigungspflichtig ist, regelt die Bauordnung Ihres Bundeslands; fragen Sie im Zweifel beim Bauamt nach.',
      },
    ],
  },
};
