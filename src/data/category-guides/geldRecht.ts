import { CategoryGuideMap } from './types';
import { LEGAL_VALUES_2026 } from '@/legal/de/2026';
import { GERMAN_DATA_2026 } from '@/data/regulated/2026';
import { TAX_CONFIG_2026 } from '@/data/regulated/tax';
import { MINIJOB_PERIODS, WEEKS_PER_MONTH } from '@/data/regulated/minijob';
import { CO2_PRICE_2026_CORRIDOR } from '@/data/emissions';
import { computeEStSingle, computeMarginalTaxRate } from '@/lib/calculators/steuernGehalt';
import { PFAENDUNGSFREIGRENZEN, pfaendungsFreibetrag } from '@/lib/calculators/steuerRecht';
import { formatCurrency, formatNumber } from '@/lib/formatters';

// Every legal amount below comes from repo data, so the hub pages stay in sync with the calculators.
const L = LEGAL_VALUES_2026;
const R = GERMAN_DATA_2026;
const T = TAX_CONFIG_2026;

/** Whole euros ("12.348 €"); formatCurrency(n, 0) would throw. */
const eur0 = (n: number) => `${formatNumber(n, 0)} €`;
/** Cents ("5.812,50 €"). */
const eur2 = (n: number) => formatCurrency(n);
/** A fraction as percent ("0.26375" -> "26,38 %"). */
const pct = (fraction: number, digits = 2) => `${formatNumber(fraction * 100, digits)} %`;
/** Percent with fixed decimals ("28,00 %"). */
const pctFixed = (fraction: number, digits = 2) => `${formatNumber(fraction * 100, digits, digits)} %`;

// --- Steuern & Gehalt -------------------------------------------------------
const EST_EXAMPLE_ZVE = 50000;
const estExample = computeEStSingle(EST_EXAMPLE_ZVE, T);
const marginalExample = computeMarginalTaxRate(EST_EXAMPLE_ZVE, T); // already in percent
const svEmployeeShare =
  (T.beitragssatzRentenversicherung +
    T.beitragssatzArbeitslosenversicherung +
    T.beitragssatzKrankenversicherungAllgemein +
    T.zusatzbeitragKrankenversicherungDurchschnitt +
    T.beitragssatzPflegeversicherung) /
  2;

// --- Arbeit & Gehalt --------------------------------------------------------
const HOURLY_EXAMPLE_SALARY = 3200;
const HOURLY_EXAMPLE_HOURS = 40;
const hourlyCorrect = HOURLY_EXAMPLE_SALARY / (HOURLY_EXAMPLE_HOURS * WEEKS_PER_MONTH);
const hourlyNaive = HOURLY_EXAMPLE_SALARY / (HOURLY_EXAMPLE_HOURS * 4);
const mindestlohn2027 = MINIJOB_PERIODS.find((p) => p.year === 2027)?.mindestlohn;
// § 47 Abs. 6 SGB V: Regelentgelt höchstens kalendertägliche BBG der Krankenversicherung
const hoechstKrankengeldTag = (T.bbgKrankenversicherungMonat / 30) * (R.krankengeld_brutto_satz.value / 100);

// --- Finanzen ----------------------------------------------------------------
const kapStSoli = L.kapitalertragsteuerSatz.value * (1 + L.solzRate.value);
/** § 32d Abs. 1 Satz 4 EStG: KapESt = e / (4 + k); dazu Soli und Kirchensteuer auf die KapESt. */
const kapStWithChurch = (k: number) => (1 / (4 + k)) * (1 + L.solzRate.value + k);
const doublingYears = (rate: number) => Math.log(2) / Math.log(1 + rate);
const futureValueMonthly = (monthly: number, annualRate: number, years: number) => {
  const i = annualRate / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + i, n) - 1) / i);
};
const fv5 = futureValueMonthly(200, 0.05, 25);
const fv7 = futureValueMonthly(200, 0.07, 25);
const NOMINAL_INTEREST = 0.04;
const INFLATION_EXAMPLE = 0.025;
const interestAfterTax = NOMINAL_INTEREST * (1 - kapStSoli);
const realAfterTax = (1 + interestAfterTax) / (1 + INFLATION_EXAMPLE) - 1;

// --- Kredit & Schulden ------------------------------------------------------
const pf = PFAENDUNGSFREIGRENZEN['2026'];
const SOLLZINS_EXAMPLE = 0.0479;
const effektivFromSoll = Math.pow(1 + SOLLZINS_EXAMPLE / 12, 12) - 1;
const annuityExample = (300000 * (0.036 + 0.02)) / 12;
// § 899 Abs. 1 ZPO: Sockelbetrag = Freibetrag nach § 850c, aufgerundet auf volle 10 €
const pKontoSockel = Math.ceil(pf.grundbetrag / 10) * 10;

// --- Business ----------------------------------------------------------------
const mwst = L.mwstNormalsatz.value;
const mwstErm = L.mwstErmaessigt.value;
const EK_EXAMPLE = 60;
const vkFromMarkup = EK_EXAMPLE * 1.4;
const marginFromMarkup = (vkFromMarkup - EK_EXAMPLE) / vkFromMarkup;
const vkForMargin = EK_EXAMPLE / (1 - 0.4);
const markupForMargin = 0.4 / (1 - 0.4);
const breakEvenUnits = Math.ceil(20000 / (50 - 20));
const skontoZins = (0.02 / (1 - 0.02)) * (360 / (30 - 10));

export const GELD_RECHT_GUIDES: CategoryGuideMap = {
  'steuern-gehalt': {
    questions: [
      { question: 'Wie viel netto bleibt von 3.500 € brutto?', slug: 'brutto-netto-rechner', hint: 'Lohnsteuer, Soli, Kirchensteuer und jeder Sozialbeitrag für Ihre Steuerklasse einzeln aufgeführt.' },
      { question: 'Welches Brutto muss ich verhandeln, damit 2.800 € netto ankommen?', slug: 'netto-brutto-rechner', hint: 'rechnet vom Wunsch-Netto rückwärts auf Monats- und Jahresbrutto.' },
      { question: 'Wie viel Einkommensteuer zahle ich bei 50.000 € zu versteuerndem Einkommen?', slug: 'einkommensteuerrechner', hint: 'Tarifsteuer im Grund- oder Splittingtarif mit Durchschnitts- und Grenzsteuersatz.' },
      { question: 'Wie viel Steuer sparen wir als Ehepaar mit der Zusammenveranlagung?', slug: 'ehegattensplitting-rechner', hint: 'Splittingtarif gegen zwei Einzelveranlagungen, Vorteil pro Jahr und Monat.' },
      { question: 'Wie viele Stunden darf ich im Minijob zum Mindestlohn arbeiten?', slug: 'minijob-stunden-rechner', hint: 'Höchststunden pro Monat, Woche und Jahr bei Ihrem Stundenlohn.' },
      { question: 'Was bleibt netto von 1.300 € im Midijob?', slug: 'midijob-rechner', hint: 'reduzierte Arbeitnehmerbeiträge im Übergangsbereich und Abgaben des Arbeitgebers.' },
      { question: 'Wie viel Steuer kostet eine Abfindung von 40.000 €?', slug: 'abfindungsrechner', hint: 'Steuer mit und ohne Fünftelregelung und die Ersparnis über die Steuererklärung.' },
      { question: 'Was kostet ein Mitarbeiter mit 4.000 € brutto den Betrieb im Monat?', slug: 'arbeitgeberkosten-rechner', hint: 'Brutto plus Arbeitgeberbeiträge, Umlagen U1 bis U3 und Berufsgenossenschaft (Durchschnittssätze).' },
      { question: 'Wie viel bleibt von 1.800 € gesetzlicher Rente nach Abzügen?', slug: 'renten-brutto-netto-rechner', hint: 'Kranken- und Pflegebeitrag der Rentner und Einkommensteuer je nach Jahr des Rentenbeginns.' },
    ],
    keyFacts: {
      title: 'Wichtige Rechengrößen 2026',
      intro: 'Diese Werte nutzen die Rechner dieses Bereichs, wenn Sie das Jahr 2026 wählen.',
      rows: [
        { label: 'Grundfreibetrag', value: `${eur0(L.grundfreibetrag.value)} / Jahr`, note: 'bis zu diesem zu versteuernden Einkommen keine Einkommensteuer (Grundtarif)' },
        { label: 'Spitzensteuersatz 42 %', value: `ab ${eur0(L.zone3Limit.value + 1)}`, note: `zu versteuerndes Einkommen; 45 % ab ${eur0(L.zone5Limit.value)}` },
        { label: 'Soli-Freigrenze', value: eur0(L.solzFreigrenzeSingle.value), note: `Einkommensteuer im Jahr; ${eur0(L.solzFreigrenzeMarried.value)} bei Zusammenveranlagung` },
        { label: 'Arbeitnehmer-Pauschbetrag', value: `${eur0(L.arbeitnehmerPauschbetrag.value)} / Jahr`, note: 'Werbungskosten, die ohne Nachweis abgezogen werden' },
        { label: 'Beitragsbemessungsgrenze KV/PV', value: `${eur2(L.bbgKrankenversicherungMonat.value)} / Monat`, note: 'darüber steigen Kranken- und Pflegebeiträge nicht weiter' },
        { label: 'Beitragsbemessungsgrenze RV/AV', value: `${eur2(L.bbgRentenversicherungMonat.value)} / Monat`, note: 'Renten- und Arbeitslosenversicherung, bundesweit einheitlich' },
        { label: 'Minijob-Grenze', value: `${eur0(L.minijobGrenze.value)} / Monat`, note: `Übergangsbereich (Midijob) bis ${eur0(L.midijobObergrenze.value)}` },
      ],
      source: '§ 32a EStG, § 3 SolzG, § 9a EStG, Sozialversicherungs-Rechengrößenverordnung 2026, § 8 und § 20 SGB IV; Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Was ist der Unterschied zwischen Lohnsteuer und Einkommensteuer?',
        answer: `Die Lohnsteuer ist eine Vorauszahlung: Der Arbeitgeber behält sie jeden Monat nach Ihrer Steuerklasse ein, und der Brutto-Netto-Rechner bildet genau diesen Abzug nach. Die Einkommensteuer ist die Jahressteuer auf Ihr gesamtes zu versteuerndes Einkommen, also nach Abzug von Werbungskosten, Sonderausgaben und Freibeträgen; sie berechnet der Einkommensteuerrechner. Die Differenz zwischen beiden ergibt Erstattung oder Nachzahlung. Der Arbeitnehmer-Pauschbetrag von ${eur0(L.arbeitnehmerPauschbetrag.value)} steckt schon in der Lohnsteuer – höhere Werbungskosten wirken sich erst über die Steuererklärung aus.`,
      },
      {
        question: 'Grenzsteuersatz oder Durchschnittssteuersatz: Welcher zählt bei einer Gehaltserhöhung?',
        answer: `Für zusätzliches Einkommen zählt der Grenzsteuersatz. Bei ${eur0(EST_EXAMPLE_ZVE)} zu versteuerndem Einkommen beträgt die Einkommensteuer 2026 im Grundtarif ${eur0(estExample)}, im Durchschnitt also ${pct(estExample / EST_EXAMPLE_ZVE, 1)}. Jeder weitere Euro wird aber mit rund ${formatNumber(marginalExample, 1)} % belastet. Bei Arbeitnehmern kommen bis zur Beitragsbemessungsgrenze noch etwa ${pct(svEmployeeShare)} Sozialabgaben hinzu (Arbeitnehmeranteil mit durchschnittlichem Zusatzbeitrag, ohne Kinderlosenzuschlag). Weil ein Teil der Sozialbeiträge steuerlich abziehbar ist, liegt die tatsächliche Belastung etwas unter der Summe beider Sätze – rechnen Sie altes und neues Gehalt im Brutto-Netto-Rechner, um den genauen Unterschied zu sehen.`,
      },
      {
        question: 'Warum weicht meine Gehaltsabrechnung vom Rechner ab?',
        answer: `Häufige Ursachen sind ein anderer Zusatzbeitrag Ihrer Krankenkasse (voreingestellt ist der Durchschnitt von ${pct(L.zusatzbeitragKrankenversicherungDurchschnitt.value, 1)}), der Pflege-Zuschlag von ${pct(L.pflegeZuschlagKinderlos.value, 1)} für Kinderlose ab 23, ein eingetragener Lohnsteuer-Freibetrag, das Faktorverfahren bei Ehepaaren, geldwerte Vorteile wie ein Dienstwagen sowie Einmalzahlungen im selben Monat. Freibeträge und Faktorverfahren bildet der Brutto-Netto-Rechner nicht ab; Boni prüfen Sie getrennt mit dem Bonus-Netto-Rechner.`,
      },
    ],
  },

  'arbeit-gehalt': {
    questions: [
      { question: 'Wie hoch ist mein Stundenlohn bei 3.200 € brutto und 40 Wochenstunden?', slug: 'stundenlohnrechner', hint: 'Bruttostundenlohn und Tagessatz mit durchschnittlich 4,33 Wochen je Monat.' },
      { question: 'Was verdiene ich, wenn ich von 40 auf 30 Stunden reduziere?', slug: 'teilzeit-gehaltsrechner', hint: 'neues Brutto und Differenz zur Vollzeit bei unverändertem Stundenlohn.' },
      { question: 'Wie viel Kurzarbeitergeld bekomme ich bei 50 % Arbeitsausfall?', slug: 'kurzarbeitergeld-rechner', hint: 'Leistung der Arbeitsagentur plus Netto für die noch geleisteten Stunden.' },
      { question: 'Wie viel Krankengeld zahlt die Kasse nach sechs Wochen Krankheit?', slug: 'krankengeld-rechner', hint: 'Krankengeld pro Tag und Monat und die Lücke zu Ihrem bisherigen Netto.' },
      { question: 'Wie viel Arbeitslosengeld steht mir zu und wie lange?', slug: 'arbeitslosengeld-1-rechner', hint: 'monatliches ALG I nach Steuerklasse und Kindern, dazu die Bezugsdauer nach Alter.' },
      { question: 'Was ist mein Resturlaub bei Kündigung in Euro wert?', slug: 'urlaubsabgeltung-rechner', hint: 'Wert je Urlaubstag aus dem Verdienst der letzten 13 Wochen.' },
      { question: 'Wie viel bringen 12 bezahlte Überstunden mit 25 % Zuschlag?', slug: 'ueberstunden-auszahlung-rechner', hint: 'Bruttovergütung mit Zuschlag und eine pauschale Netto-Schätzung.' },
      { question: 'Wie viel Grundsicherungsgeld (bis Juni 2026 Bürgergeld) steht einem Haushalt zu?', slug: 'buergergeld-anspruch-rechner', hint: 'Bedarf aus Regelsätzen, Miete, Heizung und Mehrbedarfen minus anrechenbarem Einkommen.' },
    ],
    keyFacts: {
      title: 'Gesetzliche Werte für Beschäftigte 2026',
      rows: [
        { label: 'Mindestlohn', value: `${eur2(L.mindestlohnStunde.value)} / Std.`, note: mindestlohn2027 ? `ab 1. Januar 2027: ${eur2(mindestlohn2027)}` : undefined },
        { label: 'Kurzarbeitergeld', value: `${R.kurzarbeitergeld_satz_ohne_kind.value} % / ${R.kurzarbeitergeld_satz_mit_kind.value} %`, note: 'der Netto-Entgeltdifferenz; höherer Satz mit mindestens einem Kind' },
        { label: 'Arbeitslosengeld I', value: `${R.arbeitslosengeld1_satz_ohne_kind.value} % / ${R.arbeitslosengeld1_satz_mit_kind.value} %`, note: 'des pauschalierten Netto-Entgelts; höherer Satz mit Kind' },
        { label: 'Krankengeld', value: `${R.krankengeld_brutto_satz.value} % brutto`, note: `höchstens ${R.krankengeld_netto_max_satz.value} % des Nettos und ${eur2(hoechstKrankengeldTag)} brutto pro Kalendertag` },
        { label: 'Mutterschaftsgeld der Krankenkasse', value: `${eur0(R.mutterschaftsgeld_gkv_tagessatz.value)} / Tag`, note: 'den Rest bis zum bisherigen Netto zahlt der Arbeitgeber als Zuschuss' },
        { label: 'Sachbezugsfreigrenze', value: `${eur0(R.sachbezug_freigrenze_monat.value)} / Monat`, note: 'z. B. Gutscheine; schon 1 € darüber macht den ganzen Betrag steuerpflichtig' },
        { label: 'Übungsleiter- / Ehrenamtspauschale', value: `${eur0(R.uebungsleiterpauschale_jahr.value)} / ${eur0(R.ehrenamtspauschale_jahr.value)}`, note: 'steuerfrei pro Jahr für nebenberufliche gemeinnützige Tätigkeit' },
        { label: 'Regelbedarf Grundsicherungsgeld', value: `${eur0(L.buergergeldRegelsatzAlleinstehend.value)} / Monat`, note: 'Stufe 1 für Alleinstehende; bis 30. Juni 2026 hieß die Leistung Bürgergeld' },
      ],
      source: 'MiLoV5, § 105 und § 149 SGB III, § 47 SGB V, § 19 MuSchG, § 8 Abs. 2 und § 3 Nr. 26/26a EStG, § 20 SGB II; Werte im Rechner hinterlegt, Stand 2026',
    },
    faqs: [
      {
        question: 'Warum rechnen Stundenlohnrechner mit 4,33 statt 4 Wochen pro Monat?',
        answer: `Ein Jahr hat 52 Wochen, also 13 Wochen pro Quartal oder im Schnitt ${formatNumber(WEEKS_PER_MONTH, 2)} Wochen je Monat. Wer mit 4 Wochen rechnet, unterschätzt die Arbeitszeit um gut 8 % und kommt auf einen zu hohen Stundenlohn: ${eur0(HOURLY_EXAMPLE_SALARY)} bei ${HOURLY_EXAMPLE_HOURS} Wochenstunden ergeben ${eur2(hourlyCorrect)} pro Stunde, nicht ${eur2(hourlyNaive)}. Das ist wichtig, wenn Sie prüfen, ob Ihr Gehalt den Mindestlohn von ${eur2(L.mindestlohnStunde.value)} einhält.`,
      },
      {
        question: 'Kurzarbeitergeld, Krankengeld oder Arbeitslosengeld: Was gilt wann – und sind sie steuerfrei?',
        answer: `Kurzarbeitergeld zahlt die Arbeitsagentur, solange das Arbeitsverhältnis besteht und nur die Stunden gekürzt sind. Krankengeld zahlt die Krankenkasse nach sechs Wochen Lohnfortzahlung, Arbeitslosengeld I die Arbeitsagentur nach dem Ende der Beschäftigung. Alle drei sind steuerfrei, unterliegen aber dem Progressionsvorbehalt (§ 32b EStG): Sie erhöhen den Steuersatz auf Ihr übriges Einkommen. Wer im selben Jahr auch Gehalt bezogen hat, muss deshalb eine Steuererklärung abgeben und mit einer Nachzahlung rechnen.`,
      },
      {
        question: 'Wie genau sind die Netto-Angaben bei Überstunden und Urlaubsabgeltung?',
        answer: 'Diese beiden Rechner ziehen pauschal knapp die Hälfte des Bruttos ab, weil sie Steuerklasse und Sozialversicherung nicht abfragen. Das Netto ist also nur ein grober Richtwert. Steuerlich sind solche Zahlungen meist sonstige Bezüge. Genauer wird es mit dem Bonus-Netto-Rechner: Dort geben Sie Jahresgehalt, Steuerklasse und die Zahlung ein und erhalten die Abzüge nach der Jahreslohnsteuer-Methode.',
      },
    ],
  },

  finanzen: {
    questions: [
      { question: 'Was werden aus 10.000 € bei 3 % Zinsen in 15 Jahren?', slug: 'zinseszinsrechner', hint: 'Endkapital, eingezahlter Betrag und Zinsen je nach Gutschrift-Intervall.' },
      { question: 'Wie lange muss ich sparen, bis 10.000 € zusammen sind?', slug: 'sparrechner', hint: 'löst wahlweise nach Spardauer, nötiger Sparrate oder Endkapital auf.' },
      { question: 'Was bringt ein ETF-Sparplan mit 150 € im Monat über 25 Jahre?', slug: 'etf-sparplan-rechner', hint: 'Endvermögen bei Ihrer Renditeannahme nach Abzug der Fondskosten (TER), vor Steuern.' },
      { question: 'Wie viel kosten 0,5 % Gebühren pro Jahr über 30 Jahre?', slug: 'depotgebuehren-rechner', hint: 'Endvermögen mit und ohne Kosten und den Betrag, den die Gebühren aufzehren.' },
      { question: 'Wie viel sind 10.000 € in 20 Jahren bei 2 % Inflation noch wert?', slug: 'inflationsrechner', hint: 'heutige Kaufkraft des Betrags und was derselbe Warenkorb dann kostet.' },
      { question: 'Wie viel Steuer fällt auf 3.000 € Dividenden an?', slug: 'kapitalertragsteuer-rechner', hint: 'Abgeltungsteuer, Soli und Kirchensteuer nach Abzug des Sparer-Pauschbetrags.' },
      { question: 'Wie viel Zinsen bringt Tagesgeld bei monatlicher Gutschrift?', slug: 'tagesgeld-rechner', hint: 'Zinsertrag und Endguthaben je nach Zinsgutschrift und Anlagedauer.' },
      { question: 'Wie groß ist meine Rentenlücke?', slug: 'rentenluecke-rechner', hint: 'Differenz zwischen Wunsch-Netto im Ruhestand und geschätzter gesetzlicher Nettorente.' },
      { question: 'Wie viel Vermögen brauche ich, um von Entnahmen zu leben?', slug: 'finanzielle-freiheit-rechner', hint: 'Zielvermögen aus Ihren Ausgaben und der gewählten Entnahmerate.' },
    ],
    keyFacts: {
      title: 'Steuern auf Kapitalerträge 2026 und Verdopplungszeiten',
      rows: [
        { label: 'Sparer-Pauschbetrag', value: `${eur0(L.sparerPauschbetragSingle.value)} / ${eur0(L.sparerPauschbetragMarried.value)}`, note: 'pro Jahr für Alleinstehende / zusammen veranlagte Paare' },
        { label: 'Abgeltungsteuer', value: pct(L.kapitalertragsteuerSatz.value, 0), note: 'auf Zinsen, Dividenden und Kursgewinne über dem Pauschbetrag' },
        { label: 'mit Solidaritätszuschlag', value: pct(kapStSoli, 3), note: 'Soli fällt auf Kapitalerträge ohne Freigrenze an' },
        { label: 'mit Kirchensteuer 8 % / 9 %', value: `${pctFixed(kapStWithChurch(0.08))} / ${pctFixed(kapStWithChurch(0.09))}`, note: 'Gesamtbelastung; 8 % in Bayern und Baden-Württemberg' },
        { label: 'Verdopplung bei 3 % p. a.', value: `${formatNumber(doublingYears(0.03), 1)} Jahre`, note: 'mit Zinseszins, vor Steuern und Inflation' },
        { label: 'Verdopplung bei 5 % p. a.', value: `${formatNumber(doublingYears(0.05), 1)} Jahre`, note: 'Faustregel: 72 ÷ Zinssatz' },
        { label: 'Verdopplung bei 7 % p. a.', value: `${formatNumber(doublingYears(0.07), 1)} Jahre`, note: 'exakt: ln 2 ÷ ln(1 + Zinssatz)' },
      ],
      source: '§ 20 Abs. 9, § 32d und § 43a EStG, § 4 SolzG; Werte im Rechner hinterlegt, Stand 2026. Verdopplungszeiten nach der Zinseszinsformel berechnet.',
    },
    faqs: [
      {
        question: 'Zinseszins-, Spar- oder ETF-Sparplan-Rechner: Welcher passt zu meiner Frage?',
        answer: 'Der Zinseszinsrechner eignet sich für ein festes Zinsprodukt mit Startkapital und optional steigender Rate, wobei Sie das Gutschrift-Intervall wählen. Der Sparrechner beantwortet zusätzlich die umgekehrten Fragen „Welche Rate brauche ich?“ und „Wie lange dauert es?“. Der ETF-Sparplan-Rechner zieht die laufenden Fondskosten von der angenommenen Rendite ab. Alle drei rechnen vor Steuern; die Vorabpauschale und die Teilfreistellung von Fonds berücksichtigen sie nicht.',
      },
      {
        question: 'Wie stark hängt das Ergebnis von der angenommenen Rendite ab?',
        answer: `Sehr stark. 200 € im Monat über 25 Jahre ergeben bei 5 % jährlich rund ${eur0(Math.round(fv5 / 100) * 100)}, bei 7 % rund ${eur0(Math.round(fv7 / 100) * 100)} (Zinseszinsformel mit monatlicher Verzinsung) – bei gleichen Einzahlungen von ${eur0(200 * 12 * 25)}. Aktienmärkte liefern keine konstante Rendite; rechnen Sie deshalb mehrere Szenarien durch, etwa vorsichtig, mittel und optimistisch, statt sich auf eine Zahl zu verlassen.`,
      },
      {
        question: 'Was bleibt real von Zinsen nach Steuern und Inflation?',
        answer: `Oft wenig. Liegen Ihre Erträge schon über dem Sparer-Pauschbetrag, bleiben von 4 % Zinsen nach Abgeltungsteuer und Soli ${pct(interestAfterTax)}. Bei 2,5 % Inflation entspricht das einem realen Zuwachs von nur ${pct(realAfterTax)} pro Jahr. Rechnen Sie Ihr Ergebnis aus dem Tagesgeld- oder Festgeld-Rechner deshalb zusätzlich mit dem Inflationsrechner gegen.`,
      },
    ],
  },

  'kredit-schulden': {
    questions: [
      { question: 'Wie hoch ist die Monatsrate für 15.000 € Kredit über 5 Jahre?', slug: 'ratenkreditrechner', hint: 'Rate, Gesamtzinsen und Tilgungsplan; umgekehrt auch die Laufzeit zur Wunschrate.' },
      { question: 'Wie viel Restschuld bleibt nach 10 Jahren Zinsbindung?', slug: 'tilgungsrechner', hint: 'Restschuld, gezahlte Zinsen und Zeit bis schuldenfrei bei gleichem Zins.' },
      { question: 'Wie viel spare ich mit 5.000 € Sondertilgung pro Jahr?', slug: 'sondertilgungsrechner', hint: 'Zinsersparnis und wie viele Jahre früher der Kredit abbezahlt ist.' },
      { question: 'Wie viel Kredit kann ich mir mit meinem Einkommen leisten?', slug: 'maximaler-kredit-rechner', hint: 'Kreditsumme, die Ihr Überschuss nach Fixkosten und Puffer trägt.' },
      { question: 'Wie hoch ist der Effektivzins, wenn die Bank ein Disagio einbehält?', slug: 'effektivzins-kredit-rechner', hint: 'Effektivzins aus Sollzins, Abschlag und Laufzeit, dazu die Kreditkosten.' },
      { question: 'Was kostet es, das Girokonto drei Monate zu überziehen?', slug: 'dispozins-rechner', hint: 'Dispozinsen für Betrag und Tage, hochgerechnet auch auf ein Jahr.' },
      { question: 'Wie viel darf vom Lohn gepfändet werden?', slug: 'pfaendungsrechner', hint: 'pfändbarer Betrag nach Unterhaltspflichten mit den Freigrenzen ab 1. Juli 2026.' },
      { question: 'Welchen Zins zahle ich mit einem Forward-Darlehen für die Anschlussfinanzierung?', slug: 'forward-darlehen-rechner', hint: 'heutiger Zins plus Aufschlag für die Vorlaufzeit und die künftige Rate.' },
      { question: 'Was kostet die vorzeitige Ablösung meiner Baufinanzierung?', slug: 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner', hint: 'geschätzte Vorfälligkeitsentschädigung und Ablösebetrag.' },
    ],
    keyFacts: {
      title: 'Pfändungsfreigrenzen für Arbeitseinkommen ab 1. Juli 2026',
      intro: 'Bis zu diesen monatlichen Nettobeträgen ist Arbeitseinkommen unpfändbar. Die Grenzen gelten bis 30. Juni 2027 und werden dann neu bekannt gemacht.',
      rows: [
        { label: 'Ohne Unterhaltspflicht', value: eur2(pfaendungsFreibetrag('2026', 0)) },
        { label: '1 unterhaltsberechtigte Person', value: eur2(pfaendungsFreibetrag('2026', 1)) },
        { label: '2 unterhaltsberechtigte Personen', value: eur2(pfaendungsFreibetrag('2026', 2)) },
        { label: '3 unterhaltsberechtigte Personen', value: eur2(pfaendungsFreibetrag('2026', 3)) },
        { label: '4 unterhaltsberechtigte Personen', value: eur2(pfaendungsFreibetrag('2026', 4)) },
        { label: '5 und mehr', value: eur2(pfaendungsFreibetrag('2026', 5)) },
        { label: 'Voll pfändbar', value: `über ${eur2(pf.vollPfaendbarAb)}`, note: 'der Teil des Nettos oberhalb dieses Betrags' },
      ],
      source: '§ 850c ZPO i. V. m. Pfändungsfreigrenzenbekanntmachung 2026; Werte im Pfändungsrechner hinterlegt',
    },
    faqs: [
      {
        question: 'Sollzins oder Effektivzins: Welcher Wert zählt beim Kreditvergleich?',
        answer: `Vergleichen Sie Angebote über den effektiven Jahreszins bei gleichem Betrag und gleicher Laufzeit. Er enthält die Wirkung der monatlichen Zahlweise und Kosten wie ein Disagio. Schon ohne Gebühren entspricht ein Sollzins von ${pct(SOLLZINS_EXAMPLE)} bei monatlichen Raten einem Effektivzins von ${pctFixed(effektivFromSoll)}. Der Sollzins bestimmt dagegen, wie viel Zinsen jede Rate tatsächlich enthält – er steht deshalb im Tilgungsplan.`,
      },
      {
        question: 'Ratenkredit- oder Tilgungsrechner: Was ist der Unterschied?',
        answer: `Der Ratenkreditrechner geht davon aus, dass der Kredit in der Laufzeit vollständig zurückgezahlt wird – typisch für Auto- oder Konsumkredite. Der Tilgungsrechner ist für Baufinanzierungen gedacht: Sie wählen Sollzins und Anfangstilgung, und er zeigt die Restschuld am Ende der Zinsbindung. Beispiel: ${eur0(300000)} mit 3,6 % Sollzins und 2 % Anfangstilgung kosten ${eur0(annuityExample)} im Monat. Wissen Sie Ihr Budget noch nicht, beginnen Sie mit dem Rechner für den maximalen Kredit.`,
      },
      {
        question: 'Gilt der Pfändungsschutz auch für mein Girokonto?',
        answer: `Nur, wenn es als Pfändungsschutzkonto (P-Konto) geführt wird. Dort bleibt pro Monat ein Sockelbetrag geschützt, der aus dem Grundfreibetrag nach § 850c ZPO auf volle 10 € aufgerundet wird (§ 899 ZPO): ab 1. Juli 2026 also ${eur0(pKontoSockel)}. Höhere Beträge, etwa wegen Unterhaltspflichten, müssen Sie der Bank nachweisen. Der Pfändungsrechner zeigt dagegen, was der Arbeitgeber bei einer Lohnpfändung abführen muss.`,
      },
    ],
  },

  'wohnen-immobilien': {
    questions: [
      { question: 'Wie viel Miete kann ich mir bei 3.000 € netto leisten?', slug: 'mietbudget-rechner', hint: 'Mietbudget zur gewählten Quote und was danach zum Leben bleibt.' },
      { question: 'Ist die Mieterhöhung meines Vermieters zulässig?', slug: 'mieterhoehung-rechner', hint: 'prüft Vergleichsmiete, Kappungsgrenze und ab wann die neue Miete fällig wäre.' },
      { question: 'Um wie viel darf ich die Miete bei einem Mangel mindern?', slug: 'mietminderung-rechner', hint: 'Minderung in Euro, anteilig nach den Tagen, an denen der Mangel bestand.' },
      { question: 'Wie stark steigt meine Indexmiete mit dem neuen Verbraucherpreisindex?', slug: 'indexmiete-rechner', hint: 'neue Kaltmiete aus altem und neuem Indexstand.' },
      { question: 'Wie viel CO₂-Kosten der Heizung muss mein Vermieter übernehmen?', slug: 'co2-abgabe-vermieter-mieter-rechner', hint: 'Aufteilung nach dem Stufenmodell anhand des CO₂-Ausstoßes je Quadratmeter.' },
      { question: 'Was kosten Notar und Grundbuch beim Kauf einer Wohnung für 350.000 €?', slug: 'notar-grundbuch-kosten-rechner', hint: 'Gebühren für Beurkundung, Eigentumsumschreibung und Grundschuld.' },
      { question: 'Welche Rendite bringt eine vermietete Eigentumswohnung?', slug: 'mietrendite-brutto-netto-rechner', hint: 'Brutto- und Nettomietrendite sowie Kaufpreisfaktor.' },
      { question: 'Muss ich beim Verkauf meiner Wohnung Spekulationssteuer zahlen?', slug: 'spekulationssteuer-immobilien-rechner', hint: 'steuerpflichtiger Gewinn bei Verkauf vor Ablauf von zehn Jahren, nach AfA.' },
      { question: 'Wie hoch wird meine Grundsteuer nach der Reform?', slug: 'grundsteuer-reform-rechner', hint: 'Jahres- und Quartalsbetrag aus Grundsteuerwert, Messzahl und Hebesatz.' },
    ],
    keyFacts: {
      title: 'Grenzen und Formeln rund ums Wohnen',
      rows: [
        { label: 'Kappungsgrenze', value: `${R.kappungsgrenze_standard.value} % in 3 Jahren`, note: `${R.kappungsgrenze_abgesenkt.value} %, wo eine Landesverordnung den Wohnungsmarkt als angespannt einstuft` },
        { label: 'CO₂-Preis 2026', value: `${formatNumber(CO2_PRICE_2026_CORRIDOR.min, 0)}–${formatNumber(CO2_PRICE_2026_CORRIDOR.max, 0)} € / t`, note: 'Preiskorridor im nationalen Emissionshandel; steckt im Gas- und Heizölpreis' },
        { label: 'Warmmiete', value: 'Kaltmiete + Nebenkosten', note: 'kalte Betriebskosten und Heizkosten zusammen' },
        { label: 'Bruttomietrendite', value: 'Jahreskaltmiete ÷ Kaufpreis', note: '× 100; ohne Kaufnebenkosten und laufende Kosten' },
        { label: 'Nettomietrendite', value: 'Reinertrag ÷ Gesamtinvestition', note: 'Jahreskaltmiete minus nicht umlegbare Kosten, geteilt durch Kaufpreis plus Nebenkosten' },
        { label: 'Kaufpreisfaktor', value: 'Kaufpreis ÷ Jahreskaltmiete', note: 'wie viele Jahresmieten der Kaufpreis entspricht' },
      ],
      source: '§ 558 Abs. 3 BGB, § 10 Abs. 2 BEHG; Formeln wie in den Rechnern verwendet',
    },
    faqs: [
      {
        question: 'Kaltmiete, Warmmiete, Bruttomiete: Mit welcher Miete rechnet welcher Rechner?',
        answer: 'Das hängt von der Rechtsfrage ab. Mieterhöhung, Kappungsgrenze, Index- und Staffelmiete beziehen sich auf die Nettokaltmiete. Eine Mietminderung wird dagegen von der Bruttowarmmiete einschließlich Nebenkosten berechnet. Für die Frage, ob Sie sich eine Wohnung leisten können, zählt die Warmmiete, weil Sie Heizung und Betriebskosten ebenfalls jeden Monat zahlen. Mietrendite und Kaufpreisfaktor rechnen mit der Jahreskaltmiete.',
      },
      {
        question: 'Welche Grenze gilt für meine Mieterhöhung?',
        answer: `Es gibt verschiedene Wege mit eigenen Regeln. Bei der Anpassung an die ortsübliche Vergleichsmiete (§ 558 BGB) darf die Miete in drei Jahren um höchstens ${R.kappungsgrenze_standard.value} % steigen, in vielen Städten um ${R.kappungsgrenze_abgesenkt.value} %. Eine Umlage nach Modernisierung (§ 559 BGB) hat eigene Obergrenzen, die der Modernisierungsumlage-Rechner prüft. Haben Sie eine Staffel- oder Indexmiete vereinbart, ist eine Erhöhung auf die Vergleichsmiete während dieser Zeit ausgeschlossen.`,
      },
      {
        question: 'Gilt der Grundsteuer-Rechner in jedem Bundesland?',
        answer: 'Er rechnet nach dem Bundesmodell: Grundsteuerwert × Steuermesszahl × Hebesatz. Baden-Württemberg, Bayern, Hamburg, Hessen und Niedersachsen verwenden eigene Landesmodelle. Dort entnehmen Sie Ihrem Messbescheid den Grundsteuermessbetrag und multiplizieren ihn mit dem Hebesatz Ihrer Gemeinde – das ergibt die Jahressteuer.',
      },
    ],
  },

  business: {
    questions: [
      { question: 'Welchen Verkaufspreis brauche ich für 40 % Marge?', slug: 'marge-rechner', hint: 'Preis aus Wunschmarge oder Aufschlag, mit Kalkulationsfaktor und Bruttopreis.' },
      { question: 'Wie rechne ich 119 € brutto in netto um?', slug: 'mwst-rechner', hint: 'Netto, Brutto und enthaltene Umsatzsteuer für 19 % oder 7 %.' },
      { question: 'Ab wie vielen verkauften Stück mache ich Gewinn?', slug: 'deckungsbeitrag-rechner', hint: 'Stückdeckungsbeitrag, Betriebsergebnis und Break-Even-Menge.' },
      { question: 'Lohnt es sich, Skonto zu ziehen, wenn ich dafür den Dispo nutze?', slug: 'skonto-jahreszins-rechner', hint: 'Jahreszins des Skontos im Vergleich zu Ihrem Kontokorrentzins.' },
      { question: 'Welchen Stundensatz brauche ich als Freiberufler?', slug: 'stundensatz-kalkulation-freiberufler-rechner', hint: 'Stunden- und Tagessatz aus Zieleinkommen, Kosten und fakturierbarer Zeit.' },
      { question: 'Wie hoch ist die Gewerbesteuer bei 60.000 € Gewerbeertrag?', slug: 'gewerbesteuer-rechner', hint: 'Steuer nach Freibetrag und Hebesatz, dazu die Anrechnung auf die Einkommensteuer.' },
      { question: 'Wie viel kann ich für eine neue Maschine pro Jahr abschreiben?', slug: 'abschreibung-linear-degressiv-rechner', hint: 'lineare und degressive Abschreibung mit Restbuchwerten.' },
      { question: 'Kann mein Unternehmen seine kurzfristigen Schulden bezahlen?', slug: 'liquiditaetsgrad-rechner', hint: 'Liquidität 1., 2. und 3. Grades aus Bilanzposten.' },
      { question: 'Wie viele Kunden verliere ich im Jahr bei 3 % monatlicher Kündigungsquote?', slug: 'churn-rate-rechner', hint: 'Jahres-Churn, mittlere Kundenlebensdauer und verlorener Monatsumsatz.' },
    ],
    keyFacts: {
      title: 'Steuersätze und Kalkulationsformeln',
      rows: [
        { label: 'Umsatzsteuer', value: `${pct(mwst, 0)} / ${pct(mwstErm, 0)}`, note: 'Regelsatz / ermäßigter Satz' },
        { label: 'Netto aus Brutto', value: `Brutto ÷ ${formatNumber(1 + mwst, 2)}`, note: `bei ${pct(mwstErm, 0)}: Brutto ÷ ${formatNumber(1 + mwstErm, 2)}` },
        { label: 'Enthaltene Umsatzsteuer', value: `${pct(mwst / (1 + mwst))} vom Brutto`, note: `bei ${pct(mwstErm, 0)}: ${pct(mwstErm / (1 + mwstErm))} vom Brutto` },
        { label: 'Marge (Handelsspanne)', value: '(VK − EK) ÷ VK', note: 'bezogen auf den Netto-Verkaufspreis' },
        { label: 'Aufschlag', value: '(VK − EK) ÷ EK', note: `40 % Marge entsprechen ${pct(markupForMargin)} Aufschlag` },
        { label: 'Break-Even-Menge', value: 'Fixkosten ÷ Stück-DB', note: 'Stückdeckungsbeitrag = Preis − variable Stückkosten' },
        { label: 'Skonto-Jahreszins', value: 's ÷ (1 − s) × 360 ÷ t', note: 't = Zahlungsziel minus Skontofrist in Tagen' },
        { label: 'Gewerbesteuer-Freibetrag', value: eur0(R.gewerbesteuer_freibetrag_personen.value), note: `für Einzelunternehmen und Personengesellschaften; Messzahl ${formatNumber(R.gewerbesteuer_steuermesszahl.value, 1)} %` },
      ],
      source: '§ 12 UStG, § 11 GewStG; Werte im Rechner hinterlegt, Stand 2026. Formeln wie in den Rechnern verwendet.',
    },
    faqs: [
      {
        question: 'Marge oder Aufschlag: Warum führt die Verwechslung zu zu niedrigen Preisen?',
        answer: `Der Aufschlag bezieht sich auf den Einkaufspreis, die Marge auf den Verkaufspreis. Wer auf einen Einkaufspreis von ${eur0(EK_EXAMPLE)} 40 % aufschlägt, verkauft für ${eur0(vkFromMarkup)} und erzielt nur ${pct(marginFromMarkup)} Marge. Für echte 40 % Marge muss der Preis bei ${eur0(vkForMargin)} liegen, das ist ein Aufschlag von ${pct(markupForMargin)}. Klären Sie deshalb immer, auf welche Basis sich eine Prozentangabe bezieht.`,
      },
      {
        question: 'Was sagt die Break-Even-Menge aus – und was nicht?',
        answer: `Sie zeigt, ab welcher Stückzahl die Deckungsbeiträge die Fixkosten decken. Bei 50 € Preis, 20 € variablen Kosten je Stück und 20.000 € Fixkosten sind das ${formatNumber(breakEvenUnits, 0)} Stück. Die Rechnung setzt voraus, dass Preis und Stückkosten bei jeder Menge gleich bleiben. Rabatte, Mengenstaffeln im Einkauf und sprungfixe Kosten wie eine zusätzliche Stelle verschieben die Schwelle; Steuern auf den Gewinn sind nicht enthalten.`,
      },
      {
        question: 'Lohnt sich Skonto auch, wenn ich dafür einen Kredit brauche?',
        answer: `Fast immer. 2 % Skonto bei Zahlung in 10 statt 30 Tagen entsprechen einem Jahreszins von ${pct(skontoZins, 1)}. Selbst ein teurer Kontokorrentkredit kostet deutlich weniger. Der Skonto-Rechner zeigt den Vorteil nach Abzug der Zinsen für die 20 Tage Vorfinanzierung.`,
      },
    ],
  },
};
