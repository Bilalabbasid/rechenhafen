import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_GESUNDHEIT_FAMILIE } from '../extra/gesundheitFamilie';
import { FAMILIE_CALCULATORS } from '../familie';
import { DUESSELDORFER_TABELLE_2026, getDtEinkommensgruppe, getDtTabellenbetrag, DtAltersstufe } from '@/data/regulated/unterhalt/duesseldorferTabelle2026';
import { getTaxConfig } from '@/data/regulated/tax';
import { formatNumber, formatCurrency } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Helpers: every number below is computed with the calculators' own engines at module load.
// ---------------------------------------------------------------------------
const SOURCES = [...EXTRA_GESUNDHEIT_FAMILIE, ...FAMILIE_CALCULATORS];
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = SOURCES.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/familie: calculator ${slug} not found`);
  return calc.calculate(inputs) as CalculationResult;
}
function num(r: CalculationResult, id: string): number {
  if (r.primary.id === id) return Number(r.primary.value);
  return Number(r.secondary?.find((s) => s.id === id)?.value ?? NaN);
}
function txt(r: CalculationResult, id: string): string {
  if (r.primary.id === id) return String(r.primary.formattedValue);
  return String(r.secondary?.find((s) => s.id === id)?.formattedValue ?? '');
}
const eur = (v: number) => formatCurrency(v);
const eur0 = (v: number) => `${formatNumber(v, 0)} €`;
const cm = (v: number) => `${formatNumber(v, 1)} cm`;

const DT = DUESSELDORFER_TABELLE_2026;
const KINDERGELD = getTaxConfig(2026).kindergeldMonat;
/** Zahlbetrag nach Düsseldorfer Tabelle 2026 ohne Selbstbehalt-Prüfung (für Mehrkind-Beispiele). */
const dtZahl = (stufe: DtAltersstufe, prozent: number) => getDtTabellenbetrag(stufe, prozent) - (stufe === 4 ? KINDERGELD : KINDERGELD / 2);

// ---------------------------------------------------------------------------
// Kinderzuschlag
// ---------------------------------------------------------------------------
const kiz = (kids: number, gross: number, rent: number) => run('kinderzuschlag-kiz-rechner', { childrenCount: kids, parentsGrossIncome: gross, warmRentMonthly: rent });
const KIZ_RENT = 780;
const KIZ_TABLE = [2000, 2400, 2800, 3200, 3600]
  .map((g) => `| ${eur0(g)} | ${txt(kiz(1, g, KIZ_RENT), 'calculatedKiz')} | ${txt(kiz(2, g, KIZ_RENT), 'calculatedKiz')} | ${txt(kiz(3, g, KIZ_RENT), 'calculatedKiz')} |`)
  .join('\n');
/** Erstes Bruttoeinkommen (100-€-Schritte), ab dem der Rechner für 2 Kinder keinen KiZ mehr ausweist. */
const KIZ_ZERO_2 = (() => {
  for (let g = 2000; g <= 6000; g += 100) if (num(kiz(2, g, KIZ_RENT), 'calculatedKiz') === 0) return g;
  return NaN;
})();
const KIZ_MAX_CHILD = num(kiz(1, 2000, KIZ_RENT), 'maxKiz');
const KIZ_EX3 = kiz(3, 3400, 950);
const UVG_6_11 = num(run('unterhaltsvorschuss-rechner', { childAgeGroup: 'age6_11', partialPayment: 0 }), 'payout');

// ---------------------------------------------------------------------------
// Schulbedarfspaket
// ---------------------------------------------------------------------------
const sbp = (kids: number) => run('schulbedarfspaket-bu-t-rechner', { schoolKidsCount: kids });
const SBP_TABLE = [1, 2, 3, 4]
  .map((k) => `| ${k} | ${txt(sbp(k), 'totalAugust')} | ${txt(sbp(k), 'totalFeb')} | ${txt(sbp(k), 'totalYear')} |`)
  .join('\n');
const SBP_PER_CHILD = num(sbp(1), 'totalYear');
const SBP_TEILHABE = 15; // § 28 Abs. 7 SGB II: 15 € monatlich

// ---------------------------------------------------------------------------
// Kinderbetreuungskosten
// ---------------------------------------------------------------------------
const kbk = (costs: number, rate: number) => run('kinderbetreuungskosten-absetzen-rechner', { actualCareCostsYearly: costs, taxRatePct: rate });
const KBK_TABLE = [1200, 3600, 6000, 8400]
  .map((c) => `| ${eur0(c)} | ${txt(kbk(c, 30), 'deductibleAmount')} | ${txt(kbk(c, 30), 'taxSaving')} | ${txt(kbk(c, 42), 'taxSaving')} |`)
  .join('\n');
const KBK_MAX = num(kbk(1000, 30), 'maxAllowed');
const KBK_FULL_AT = KBK_MAX / (num(kbk(1000, 30), 'quotaAmount') / 1000);
const KBK_EX = kbk(9600, 35);

// ---------------------------------------------------------------------------
// Trennungsunterhalt
// ---------------------------------------------------------------------------
const tu = (n1: number, n2: number) => run('ehegattenunterhalt-trennungsunterhalt-rechner', { netIncomePartner1: n1, netIncomePartner2: n2 });
const TU_ROWS: Array<[number, number]> = [[3600, 0], [3600, 800], [3600, 1500], [3600, 2200], [2400, 0]];
const TU_TABLE = TU_ROWS
  .map(([a, b]) => {
    const r = tu(a, b);
    return `| ${eur0(a)} | ${eur0(b)} | ${txt(r, 'compare37')} | ${txt(r, 'maintenance')} | ${txt(r, 'net1After')} |`;
  })
  .join('\n');
const TU_CAPPED = tu(2400, 0);
// Kombiniertes Beispiel: Kindesunterhalt (Düsseldorfer-Tabelle-Rechner) wird vor dem Ehegattenunterhalt abgezogen
const TU_EX_NET = 3900;
const TU_EX_KU = run('duesseldorfer-tabelle-rechner', { netIncomeAdjusted: TU_EX_NET, childAgeCategory: 'group2', payerEmployed: 'yes' });
const TU_EX_KU_PAY = num(TU_EX_KU, 'zahlbetrag');
const TU_EX_BEREINIGT = TU_EX_NET - TU_EX_KU_PAY;
const TU_EX = tu(TU_EX_BEREINIGT, 1100);

// ---------------------------------------------------------------------------
// Kindes-Endgröße
// ---------------------------------------------------------------------------
const eg = (f: number, m: number, g: 'boy' | 'girl') => run('kindes-endgroesse-rechner', { fatherHeightCm: f, motherHeightCm: m, childGender: g });
const EG_PAIRS: Array<[number, number]> = [[172, 160], [178, 165], [183, 168], [190, 175]];
const EG_TABLE = EG_PAIRS
  .map(([f, m]) => `| ${f} cm / ${m} cm | ${txt(eg(f, m, 'boy'), 'targetHeight')} (${txt(eg(f, m, 'boy'), 'normalRange')}) | ${txt(eg(f, m, 'girl'), 'targetHeight')} (${txt(eg(f, m, 'girl'), 'normalRange')}) |`)
  .join('\n');
const EG_TALL_SON = num(eg(175, 172, 'boy'), 'targetHeight');
const EG_SAME_GIRL = num(eg(176, 176, 'girl'), 'targetHeight');

// ---------------------------------------------------------------------------
// Kita-Gebühren (Modellstaffel des Rechners)
// ---------------------------------------------------------------------------
const kita = (income: number, cat: 'krippe' | 'kindergarten', hours: number) => run('kita-gebuehren-rechner', { familyGrossIncome: income, childAgeCategory: cat, hoursPerDay: hours, lunchCateringMonthly: 0 });
const KITA_TABLE = [40000, 60000, 80000, 100000]
  .map((i) => `| ${eur0(i)} | ${txt(kita(i, 'krippe', 8), 'baseFee')} | ${txt(kita(i, 'kindergarten', 8), 'baseFee')} | ${txt(kita(i, 'kindergarten', 6), 'baseFee')} |`)
  .join('\n');
const KITA_EX_FEE = num(kita(60000, 'kindergarten', 8), 'baseFee');
const KITA_EX_TAX = kbk(KITA_EX_FEE * 12, 30);

// ---------------------------------------------------------------------------
// Geburtstermin
// ---------------------------------------------------------------------------
const gt = (lmp: string, cycle: number) => run('geburtstermin-rechner', { lastPeriodDate: lmp, cycleLength: cycle });
function shiftIso(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${String(t.getUTCDate()).padStart(2, '0')}.${String(t.getUTCMonth() + 1).padStart(2, '0')}.${t.getUTCFullYear()}`;
}
const GT_LMP = '2026-03-02';
const GT_TABLE = [26, 28, 30, 32, 35]
  .map((c) => {
    const iso = String(gt(GT_LMP, c).primary.value);
    return `| ${c} Tage | ${txt(gt(GT_LMP, c), 'dueDate')} | ${shiftIso(iso, -42)} | ${shiftIso(iso, -21)} bis ${shiftIso(iso, 13)} |`;
  })
  .join('\n');
const GT_ET28 = String(gt(GT_LMP, 28).primary.value);
const GT_LMP_DE = shiftIso(GT_LMP, 0);

// ---------------------------------------------------------------------------
// Kinderkrankengeld
// ---------------------------------------------------------------------------
const kk = (net: number, days: number, status: 'couple' | 'single') => run('kinderkrankentage-kinderkrankengeld-rechner', { monthlyNetIncome: net, sickDaysClaimed: days, parentStatus: status });
const KK_TABLE = [1800, 2400, 3200, 4000, 5000]
  .map((n) => `| ${eur0(n)} | ${txt(kk(n, 1, 'couple'), 'dailyRate')} | ${txt(kk(n, 5, 'couple'), 'totalPayout')} | ${txt(kk(n, 15, 'couple'), 'totalPayout')} |`)
  .join('\n');
const KK_CAP = num(kk(2000, 1, 'couple'), 'dailyCap');
const KK_CAP_FROM_NET = (KK_CAP / 0.9) * 30;
const KK_SINGLE_MAX = num(kk(2000, 1, 'single'), 'maxDays');
const KK_COUPLE_MAX = num(kk(2000, 1, 'couple'), 'maxDays');

// ---------------------------------------------------------------------------
// Unterhaltsvorschuss
// ---------------------------------------------------------------------------
const uv = (group: string, paid: number) => run('unterhaltsvorschuss-rechner', { childAgeGroup: group, partialPayment: paid });
const UV_GROUPS: Array<[string, string]> = [['age0_5', '0–5 Jahre'], ['age6_11', '6–11 Jahre'], ['age12_17', '12–17 Jahre']];
const UV_TABLE = UV_GROUPS
  .map(([g, label]) => `| ${label} | ${txt(uv(g, 0), 'payout')} | ${txt(uv(g, 100), 'payout')} | ${txt(uv(g, 200), 'payout')} | ${txt(uv(g, 0), 'yearlyPayout')} |`)
  .join('\n');
const UV_12_PAY = num(uv('age12_17', 0), 'payout');
const UV_WAISE_EX = uv('age6_11', 120);
const UV_6_YEAR = num(uv('age6_11', 0), 'yearlyPayout');

// ---------------------------------------------------------------------------
// Ausbildungsunterhalt + Bedarfskontrollbetrag
// ---------------------------------------------------------------------------
const AU_BASE_ADULT = num(run('duesseldorfer-tabelle-rechner', { netIncomeAdjusted: 2700, childAgeCategory: 'group4', payerEmployed: 'yes' }), 'zahlbetragTabelle');
const AU_BASE_MINOR = num(run('duesseldorfer-tabelle-rechner', { netIncomeAdjusted: 2700, childAgeCategory: 'group3', payerEmployed: 'yes' }), 'zahlbetragTabelle');
const au = (salary: number, base: number, sit: string) => run('ausbildungsunterhalt-bedarfskontrollbetrag-rechner', { netApprenticeSalary: salary, baseChildSupport: base, childSituation: sit });
const AU_TABLE = [500, 700, 900, 1100]
  .map((s) => `| ${eur0(s)} | ${txt(au(s, AU_BASE_MINOR, 'minor_at_home'), 'reducedSupport')} | ${txt(au(s, AU_BASE_ADULT, 'adult_at_home'), 'reducedSupport')} |`)
  .join('\n');
// Bedarfskontrollbetrag (DT 2026 Anm. A.III): Herabstufung bei zwei Kindern (8 und 13 Jahre), Netto 2.700 €
const BKB_NET = 2700;
const BKB_STEPS = (() => {
  const rows: string[] = [];
  let final = DT.einkommensgruppen[0];
  for (let i = DT.einkommensgruppen.indexOf(getDtEinkommensgruppe(BKB_NET)); i >= 0; i--) {
    const g = DT.einkommensgruppen[i];
    const pay = dtZahl(2, g.prozent) + dtZahl(3, g.prozent);
    const rest = BKB_NET - pay;
    const ok = rest >= g.bedarfskontrollbetrag;
    rows.push(`| ${g.gruppe} (${g.prozent} %) | ${eur(pay)} | ${eur(rest)} | ${eur0(g.bedarfskontrollbetrag)} | ${ok ? 'eingehalten' : 'unterschritten'} |`);
    if (ok) { final = g; break; }
  }
  return { table: rows.join('\n'), final };
})();

// ---------------------------------------------------------------------------
// Unterhalt volljährige Kinder
// ---------------------------------------------------------------------------
const uvk = (arr: string, parents: number, own: number) => run('unterhalt-volljaehrige-kinder-rechner', { livingArrangement: arr, parentsCombinedNet: parents, childOwnIncome: own });
const UVK_REST = num(uvk('own_household', 0, 0), 'finalParentsShare');
const UVK_FATHER = 3200;
const UVK_MOTHER = 2100;
const UVK_F_HAFT = Math.max(0, UVK_FATHER - DT.selbstbehaltAngemessen);
const UVK_M_HAFT = Math.max(0, UVK_MOTHER - DT.selbstbehaltAngemessen);
const UVK_F_SHARE = (UVK_REST * UVK_F_HAFT) / (UVK_F_HAFT + UVK_M_HAFT);
const UVK_M_SHARE = UVK_REST - UVK_F_SHARE;
const UVK_TABLE = [2500, 4000, 5500, 7500]
  .map((p) => {
    const r = uvk('with_parents', p, 0);
    return `| ${eur0(p)} | ${txt(r, 'baseNeed')} | ${txt(r, 'finalParentsShare')} | ${txt(uvk('with_parents', p, 300), 'finalParentsShare')} |`;
  })
  .join('\n');

// ---------------------------------------------------------------------------
// Düsseldorfer Tabelle
// ---------------------------------------------------------------------------
const dt = (net: number, group: string) => run('duesseldorfer-tabelle-rechner', { netIncomeAdjusted: net, childAgeCategory: group, payerEmployed: 'yes' });
const DT_TABLE = [2000, 2700, 3500, 4500, 6000]
  .map((n) => `| ${eur0(n)} | ${['group1', 'group2', 'group3', 'group4'].map((g) => txt(dt(n, g), 'zahlbetrag')).join(' | ')} |`)
  .join('\n');
const DT_2000_ADULT = dt(2000, 'group4');
// Mangelfall nach Anm. C: 2.000 € Netto, zwei Kinder (4 und 9 Jahre), notwendiger Selbstbehalt
const MF_NET = 2000;
const MF_MASSE = MF_NET - DT.selbstbehaltNotwendigErwerbstaetig;
const MF_K1 = dtZahl(1, 100);
const MF_K2 = dtZahl(2, 100);
const MF_SUM = MF_K1 + MF_K2;
const MF_P1 = (MF_K1 * MF_MASSE) / MF_SUM;
const MF_P2 = (MF_K2 * MF_MASSE) / MF_SUM;

export const FAMILIE_PAGE_CONTENT: PageContentMap = {
  'kinderzuschlag-kiz-rechner': {
    sections: [
      {
        title: 'KiZ-Tabelle: So schmilzt der Zuschlag mit steigendem Einkommen',
        content: `Ergebnisse dieses Rechners bei ${eur0(KIZ_RENT)} Warmmiete, gerechnet mit dem Höchstbetrag von ${eur(KIZ_MAX_CHILD)} je Kind:\n\n| Elternbrutto pro Monat | 1 Kind | 2 Kinder | 3 Kinder |\n|---|---|---|---|\n${KIZ_TABLE}\n\nJeder Euro über dem (hier vereinfacht angesetzten) Elternbedarf kostet 45 Cent Kinderzuschlag, nicht den vollen Euro. Mehr arbeiten lohnt sich deshalb weiter. Mit zwei Kindern und dieser Miete weist der Rechner ab etwa ${eur0(KIZ_ZERO_2)} Brutto keinen Zuschlag mehr aus. Eine höhere Warmmiete verschiebt diese Grenze nach oben, weil sie den Bedarf der Familie erhöht.`,
      },
      {
        title: 'Was der Rechner vereinfacht und was die Familienkasse genau prüft',
        content: `- **Mindesteinkommen:** Paare brauchen mindestens 900 €, Alleinerziehende 600 € Bruttoeinkommen im Monat (§ 6a Abs. 1 BKGG). Der Rechner prüft pauschal 900 €; liegen Sie als Alleinerziehende zwischen 600 € und 900 €, stellen Sie den Antrag trotzdem.\n- **Netto statt Brutto:** Die Familienkasse rechnet mit dem bereinigten Einkommen und dem genauen Wohn- und Regelbedarf der Eltern. Der Rechner nähert das mit Brutto und 1.600 € plus Warmmiete an.\n- **Einkommen des Kindes:** Unterhalt, Unterhaltsvorschuss oder Waisenrente mindern den Kinderzuschlag zu 45 %.\n- **Zeitraum:** Bewilligt wird für sechs Monate, Grundlage ist das Durchschnittseinkommen der letzten sechs Monate vor dem Antrag.\n- **Verbindliche Prüfung:** Der KiZ-Lotse der Familienkasse auf arbeitsagentur.de rechnet mit Ihren Netto-Angaben.`,
      },
    ],
    faqs: [
      {
        question: 'Wird Unterhaltsvorschuss auf den Kinderzuschlag angerechnet?',
        answer: `Ja, zu 45 %. Bekommt ein 8-jähriges Kind den vollen Unterhaltsvorschuss von ${eur(UVG_6_11)}, sinkt sein Kinderzuschlag um ${eur(UVG_6_11 * 0.45)}. Beantragen Sie Unterhaltsvorschuss und Kindergeld vor dem Kinderzuschlag, weil die Familienkasse diese Leistungen als vorrangig behandelt.`,
      },
      {
        question: 'Wie lange wird der Kinderzuschlag bewilligt?',
        answer: 'Jeweils für sechs Monate (§ 6a Abs. 7 BKGG). Einkommensänderungen innerhalb dieser Zeit ändern den Betrag in der Regel nicht, ausgenommen ein Kind zieht aus oder kommt hinzu. Danach stellen Sie einen neuen Antrag mit den Nachweisen der letzten sechs Monate.',
      },
    ],
    workedExamples: [
      {
        title: 'Drei Kinder, 3.400 € Brutto, 950 € Warmmiete',
        description: `Der Höchstbetrag liegt bei 3 × ${eur(KIZ_MAX_CHILD)} = ${txt(KIZ_EX3, 'maxKiz')}. Nach der 45-%-Anrechnung des Einkommens oberhalb des vereinfachten Elternbedarfs bleiben ${txt(KIZ_EX3, 'calculatedKiz')} im Monat, also ${txt(KIZ_EX3, 'perChild')} je Kind.`,
        inputs: { childrenCount: 3, parentsGrossIncome: 3400, warmRentMonthly: 950 },
        resultSummary: `${txt(KIZ_EX3, 'calculatedKiz')} Kinderzuschlag pro Monat`,
      },
    ],
  },

  'schulbedarfspaket-bu-t-rechner': {
    sections: [
      {
        title: 'Auszahlungen nach Zahl der Schulkinder',
        content: `| Schulkinder | 1. Schulhalbjahr (August) | 2. Schulhalbjahr (Februar) | Schuljahr gesamt |\n|---|---|---|---|\n${SBP_TABLE}\n\nDie Beträge gelten auch 2026 unverändert. Anspruch haben Schülerinnen und Schüler unter 25 Jahren, die eine allgemein- oder berufsbildende Schule besuchen und keine Ausbildungsvergütung erhalten (§ 28 Abs. 1 SGB II). Wer Bürgergeld bezieht, erhält das Geld vom Jobcenter; bei Kinderzuschlag oder Wohngeld ist meist eine kommunale BuT-Stelle zuständig, bei der Sie den Antrag gesondert stellen.`,
      },
      {
        title: 'Was das Bildungspaket außer dem Schulbedarf übernimmt',
        content: `- **Ausflüge und Klassenfahrten:** die tatsächlichen Kosten, auch für Kita-Ausflüge (§ 28 Abs. 2 SGB II).\n- **Schülerbeförderung:** Fahrkarten zur nächstgelegenen Schule des gewählten Bildungsgangs, soweit niemand sonst zahlt.\n- **Lernförderung:** Nachhilfe, wenn sie nötig ist, um die Lernziele zu erreichen; eine drohende Nichtversetzung ist dafür keine Voraussetzung.\n- **Mittagessen:** das gemeinschaftliche Mittagessen in Schule, Kita oder Kindertagespflege.\n- **Teilhabe:** ${eur(SBP_TEILHABE)} im Monat für Sportverein, Musikschule oder Freizeiten bei Kindern unter 18 Jahren.\n\nDiese Leistungen kommen zum Schulbedarf von ${eur(SBP_PER_CHILD)} hinzu und werden je nach Ort als Geld, Gutschein oder Direktzahlung an den Anbieter erbracht.`,
      },
    ],
    faqs: [
      {
        question: 'Bekommen auch Kita-Kinder Geld aus dem Bildungs- und Teilhabepaket?',
        answer: `Ja, aber kein Schulbedarfspaket. Für Kinder in Kita oder Tagespflege übernimmt das Paket das gemeinsame Mittagessen und Ausflüge; für Vereinsbeitrag, Musik- oder Turnkurs gibt es zusätzlich ${eur(SBP_TEILHABE)} im Monat.`,
      },
      {
        question: 'Wer zahlt Nachhilfe über das Bildungspaket?',
        answer: 'Die Lernförderung wird übernommen, wenn – in der Regel mit einer Bestätigung der Schule – feststeht, dass zusätzliche Förderung nötig ist, um die Lernziele zu erreichen. Sie muss nicht erst eine Versetzungsgefährdung abwarten. Zuständig ist dieselbe Stelle, die auch den Schulbedarf zahlt.',
      },
    ],
  },

  'kinderbetreuungskosten-absetzen-rechner': {
    sections: [
      {
        title: 'Steuerersparnis nach Höhe der Betreuungskosten',
        content: `Werte dieses Rechners pro Kind und Jahr (Kosten ohne Verpflegung):\n\n| Betreuungskosten | Abziehbar (80 %, max. ${eur0(KBK_MAX)}) | Ersparnis bei 30 % | Ersparnis bei 42 % |\n|---|---|---|---|\n${KBK_TABLE}\n\nDer Höchstbetrag ist bei ${eur0(KBK_FULL_AT)} Kosten erreicht; jeder Euro darüber bringt steuerlich nichts mehr. Die Ersparnis hängt am Grenzsteuersatz: Wer wenig verdient, spart weniger, wer gar keine Einkommensteuer zahlt, spart nichts. Solidaritätszuschlag und Kirchensteuer sind nicht eingerechnet.`,
      },
      {
        title: 'Typische Fehler in der Steuererklärung',
        content: `- **Gesamtbescheid übernommen:** Steht im Kita-Bescheid ein Gesamtbetrag, rechnen Sie das Essensgeld heraus; nur der Betreuungsanteil zählt.\n- **Bar bezahlt:** Babysitter oder Tagesmutter bar zu bezahlen kostet den Abzug, denn das Gesetz verlangt eine Rechnung und eine Zahlung auf das Konto des Leistungserbringers.\n- **14. Geburtstag übersehen:** Abziehbar sind nur Kosten bis zu dem Zeitpunkt, an dem das Kind 14 Jahre alt wird; für die Monate danach endet der Abzug, außer bei einer vor dem 25. Lebensjahr eingetretenen Behinderung.\n- **Arbeitgeberzuschuss doppelt angesetzt:** Zahlt der Arbeitgeber steuerfrei für Kita oder Kindergarten eines noch nicht schulpflichtigen Kindes (§ 3 Nr. 33 EStG), dürfen Sie nur den Teil absetzen, den Sie selbst getragen haben.\n- **Musikschule und Sportverein eingetragen:** Unterricht und Freizeitaktivitäten sind ausdrücklich ausgeschlossen, auch wenn das Kind dort betreut wird.`,
      },
    ],
    faqs: [
      {
        question: 'Gilt der Abzug von 80 % schon für die Steuererklärung 2025?',
        answer: `Ja. Die Erhöhung von zwei Dritteln auf 80 % und von 4.000 € auf ${eur0(KBK_MAX)} je Kind gilt ab dem Veranlagungszeitraum 2025, also bereits für die Erklärung 2025 und ebenso für 2026. Für 2024 und früher bleibt es bei den alten Werten.`,
      },
      {
        question: 'Lohnt sich eine Tagesmutter mit 800 € im Monat steuerlich voll?',
        answer: `Nur bis zum Höchstbetrag. Bei 9.600 € Jahreskosten wären 80 % zwar 7.680 €, abziehbar sind aber höchstens ${txt(KBK_EX, 'deductibleAmount')}. Bei 35 % Grenzsteuersatz bringt das ${txt(KBK_EX, 'taxSaving')} im Jahr.`,
      },
    ],
  },

  'ehegattenunterhalt-trennungsunterhalt-rechner': {
    sections: [
      {
        title: 'Trennungsunterhalt bei verschiedenen Einkommen',
        content: `Werte dieses Rechners mit der 45-%-Quote, daneben die ältere 3/7-Quote zum Vergleich:\n\n| Netto Partner 1 | Netto Partner 2 | 3/7-Quote | Unterhalt (45 %) | Partner 1 behält |\n|---|---|---|---|---|\n${TU_TABLE}\n\nIn der letzten Zeile greift der Selbstbehalt: 45 % von 2.400 € wären ${eur(2400 * 0.45)}, gezahlt werden müssen aber nur ${txt(TU_CAPPED, 'maintenance')}, weil dem Zahlenden ${eur0(1600)} bleiben müssen. Der Unterschied zwischen 3/7 und 45 % beträgt bei 2.000 € Einkommensdifferenz rund ${eur(2000 * 0.45 - (2000 * 3) / 7)} im Monat.`,
      },
      {
        title: 'Welche Zahlen Sie eintragen sollten',
        content: `Eingetragen wird nicht das Netto vom Lohnzettel, sondern das unterhaltsrechtlich bereinigte Einkommen:\n\n- **Kindesunterhalt zuerst:** Der Zahlbetrag für gemeinsame Kinder geht vor (§ 1609 BGB) und wird vorher abgezogen.\n- **Berufsbedingte Kosten und ehebedingte Schulden** mindern das Einkommen, ebenso angemessene Altersvorsorge.\n- **Sonstige Einkünfte** wie Mieteinnahmen werden nach der Düsseldorfer Tabelle nicht mit 45 %, sondern hälftig geteilt; dafür ist dieser Rechner nicht gebaut.\n- **Rentner als Zahlende:** Gegen einen nicht erwerbstätigen Pflichtigen gilt die Halbteilung (50 %), sein Selbstbehalt beträgt 1.475 €.\n- **Untergrenze für den Berechtigten:** Als Existenzminimum setzt die Tabelle 1.450 € (erwerbstätig) bzw. 1.200 € an.`,
      },
    ],
    faqs: [
      {
        question: 'Warum rechnet der Rechner mit 45 % statt mit 3/7?',
        answer: 'Weil die Düsseldorfer Tabelle 2026 in Anmerkung B.I für Erwerbseinkommen 45 % der Differenz ansetzt. Die 3/7-Quote (rund 42,86 %) taucht noch in älteren Berechnungen und Artikeln auf; sie ergibt etwas weniger Unterhalt und wird hier nur zum Vergleich angezeigt.',
      },
      {
        question: 'Ab wann muss Trennungsunterhalt rückwirkend gezahlt werden?',
        answer: 'Für die Vergangenheit erst ab dem Monat, in dem der Berechtigte den anderen zur Auskunft über sein Einkommen oder zur Zahlung aufgefordert hat (§ 1613 BGB, der über § 1361 Abs. 4 und § 1360a Abs. 3 BGB gilt). Wer zu lange wartet, verliert die Monate davor, daher sollte die Aufforderung schriftlich und früh erfolgen.',
      },
    ],
    workedExamples: [
      {
        title: 'Mit Kindesunterhalt: 3.900 € Netto, ein Kind (8 Jahre), Partnerin verdient 1.100 €',
        description: `Zuerst der Kindesunterhalt nach Düsseldorfer Tabelle 2026: ${txt(TU_EX_KU, 'zahlbetrag')} Zahlbetrag. Das bereinigte Einkommen sinkt damit auf ${eur(TU_EX_BEREINIGT)}. Von der Differenz zu 1.100 € (${txt(TU_EX, 'diff')}) stehen der Partnerin 45 % zu.`,
        inputs: { netIncomePartner1: TU_EX_BEREINIGT, netIncomePartner2: 1100 },
        resultSummary: `${txt(TU_EX, 'maintenance')} Trennungsunterhalt zusätzlich zum Kindesunterhalt`,
      },
    ],
  },

  'kindes-endgroesse-rechner': {
    sections: [
      {
        title: 'Zielgröße für typische Elternpaare',
        content: `Ergebnisse dieses Rechners (Zielgröße und Zielgrößenbereich ± 8,5 cm):\n\n| Vater / Mutter | Sohn | Tochter |\n|---|---|---|\n${EG_TABLE}\n\nDer Bereich ist bewusst breit: Geschwister mit denselben Eltern werden oft unterschiedlich groß. Die Formel sagt deshalb nicht, wie groß ein bestimmtes Kind wird, sondern in welchem Korridor seine Erwachsenengröße erwartungsgemäß liegt.`,
      },
      {
        title: 'So nutzen Sie das Ergebnis richtig',
        content: `- **Gemessene statt geschätzte Elterngrößen:** Selbstangaben aus dem Gedächtnis sind oft ungenau; messen Sie barfuß an der Wand.\n- **Nur leibliche Eltern:** Bei Adoptiv- oder Pflegekindern ergibt die Formel keinen Sinn.\n- **Mit der Wachstumskurve vergleichen:** Bei den U-Untersuchungen trägt die Kinderarztpraxis Größe und Alter in Perzentilkurven ein. Aussagekräftiger als eine einzelne Messung ist, ob das Kind seinem Perzentilenkanal folgt.\n- **Wann nachfragen:** Liegt ein Kind deutlich unter dem Bereich, den die Elterngrößen erwarten lassen, oder knickt seine Kurve über längere Zeit nach unten ab, sprechen Sie die Kinderärztin oder den Kinderarzt darauf an.`,
      },
    ],
    faqs: [
      {
        question: 'Kann ein Kind größer werden als beide Eltern?',
        answer: `Ja. Schon die Zielgröße selbst kann darüber liegen: Bei einem Vater mit 175 cm und einer Mutter mit 172 cm ergibt die Formel für einen Sohn ${cm(EG_TALL_SON)}. Innerhalb des Bereichs von ± 8,5 cm sind auch deutlich größere Kinder normal.`,
      },
      {
        question: 'Warum werden bei Jungen 6,5 cm addiert und bei Mädchen abgezogen?',
        answer: `Die Formel geht davon aus, dass erwachsene Männer im Mittel etwa 13 cm größer sind als Frauen. Sie rechnet die Größe des andersgeschlechtlichen Elternteils um diese Differenz um und nimmt den Mittelwert; daraus werden die ± 6,5 cm. Sind beide Eltern 176 cm groß, ergibt sich für eine Tochter ${cm(EG_SAME_GIRL)}.`,
      },
    ],
  },

  'kita-gebuehren-rechner': {
    sections: [
      {
        title: 'Beitragsfreiheit der Bundesländer im Überblick',
        content: `Stand nach der Übersicht des Deutschen Bildungsservers (August 2026). Die Beitragsfreiheit betrifft den Betreuungsbeitrag; Essensgeld und Zusatzangebote können trotzdem anfallen.\n\n| Land | Beitragsfrei |\n|---|---|\n| Berlin | Kita und Tagespflege für alle Kinder |\n| Mecklenburg-Vorpommern | Kindertagesförderung bis 10 Stunden täglich |\n| Rheinland-Pfalz | ab 2 Jahren |\n| Brandenburg | ab 3 Jahren (seit Kita-Jahr 2024/25) |\n| Bremen, Niedersachsen | ab 3 Jahren bis zur Einschulung |\n| Hessen | ab 3 Jahren, 6 Stunden täglich |\n| Hamburg | ab Geburt 5 Stunden täglich |\n| Nordrhein-Westfalen | die letzten zwei Kita-Jahre vor der Schule |\n| Thüringen | die letzten 24 Monate vor der Schule |\n| Saarland | stufenweise Senkung, ganz frei ab 2027 geplant |\n\nIn den übrigen Ländern legen Kommunen und Träger die Beiträge fest. Unabhängig vom Land wird der Beitrag auf Antrag erlassen, wenn die Familie Bürgergeld, Kinderzuschlag oder Wohngeld bezieht (§ 90 Abs. 4 SGB VIII).`,
      },
      {
        title: 'Modellrechnung: Betreuungsbeitrag nach Einkommen',
        content: `Wo Beiträge erhoben werden, ergibt die Staffel dieses Rechners ohne Essensgeld:\n\n| Familienbrutto im Jahr | Krippe, 8 Std. | Kindergarten, 8 Std. | Kindergarten, 6 Std. |\n|---|---|---|---|\n${KITA_TABLE}\n\nVergleichen Sie das Ergebnis mit der Beitragstabelle Ihrer Stadt; viele Kommunen veröffentlichen sie in der Kita-Satzung. Einen Teil holen Sie sich über die Steuer zurück: Zahlen Sie im Kindergarten ${eur(KITA_EX_FEE)} im Monat, sind davon ${txt(KITA_EX_TAX, 'deductibleAmount')} im Jahr als Sonderausgaben abziehbar, bei 30 % Grenzsteuersatz eine Ersparnis von ${txt(KITA_EX_TAX, 'taxSaving')}.`,
      },
    ],
    faqs: [
      {
        question: 'Muss ich in einer beitragsfreien Kita gar nichts zahlen?',
        answer: 'Den Betreuungsbeitrag nicht, Kosten für Verpflegung meist schon. Je nach Land und Träger kommen Zuzahlungen für Extras dazu; Berlin erlaubt nach Angaben des Bildungsservers Zuzahlungen von bis zu 100 € für Zusatzleistungen wie Sport oder Fremdsprachen. Die Modellstaffel dieses Rechners bildet die Beitragsfreiheit nicht ab; für Sie zählt dann im Wesentlichen das Essensgeld.',
      },
      {
        question: 'Werden Kita-Gebühren bei Kinderzuschlag oder Wohngeld erlassen?',
        answer: 'Ja. Nach § 90 Abs. 4 SGB VIII wird kein Kostenbeitrag erhoben, wenn die Eltern Bürgergeld, Kinderzuschlag oder Wohngeld erhalten. Die Befreiung gilt nicht automatisch: Legen Sie den Bescheid beim Jugendamt oder Kita-Träger vor.',
      },
    ],
  },

  'geburtstermin-rechner': {
    sections: [
      {
        title: 'Termin, Mutterschutzbeginn und Geburtszeitraum nach Zykluslänge',
        content: `Beispiel mit dem ersten Tag der letzten Periode am ${GT_LMP_DE}, berechnet mit diesem Rechner:\n\n| Zykluslänge | Errechneter Termin | Beginn Mutterschutz (6 Wochen vorher) | Termingerecht (37+0 bis 41+6) |\n|---|---|---|---|\n${GT_TABLE}\n\nJeder Tag Zykluslänge über 28 verschiebt den Termin um einen Tag nach hinten, jeder Tag darunter nach vorn. Die letzte Spalte zeigt, zwischen welchen Tagen eine Geburt als termingerecht gilt; der errechnete Tag selbst ist nur die Mitte dieses Fensters. Bei einem 28-Tage-Zyklus ist der Termin der ${shiftIso(GT_ET28, 0)}.`,
      },
      {
        title: 'Wann der errechnete Termin angepasst wird',
        content: `Die Naegele-Regel ist eine Konvention, kein Messwert. Sie setzt voraus, dass der Eisprung etwa 14 Tage vor der nächsten Periode lag. In der Frühschwangerschaft misst die Frauenärztin oder der Frauenarzt den Embryo per Ultraschall; weicht das Ergebnis deutlich ab, wird der Termin im Mutterpass korrigiert. Ab dann zählt dieser Termin, auch für den Mutterschutz: Die Schutzfrist vor der Geburt richtet sich nach dem voraussichtlichen Entbindungstag laut ärztlichem Zeugnis (§ 3 Abs. 1 MuSchG). Bei künstlicher Befruchtung lässt sich der Termin genauer aus dem Transfertag ableiten als aus der Periode.`,
      },
    ],
    faqs: [
      {
        question: 'Verkürzt sich der Mutterschutz, wenn das Baby vor dem Termin kommt?',
        answer: 'Nein. Kommt das Kind früher, verlängert sich die Schutzfrist nach der Geburt um die Tage, die vor der Entbindung nicht genommen werden konnten (§ 3 Abs. 2 MuSchG). Insgesamt bleibt es also bei mindestens 14 Wochen.',
      },
      {
        question: 'Taugt die Naegele-Regel bei sehr unregelmäßigem Zyklus?',
        answer: 'Nur eingeschränkt. Schwankt der Zyklus stark, ist unklar, wann der Eisprung war, und auch die Korrektur um die Zykluslänge hilft wenig. Tragen Sie dann die durchschnittliche Länge ein und verlassen Sie sich auf den per Ultraschall bestimmten Termin.',
      },
    ],
  },

  'kinderkrankentage-kinderkrankengeld-rechner': {
    sections: [
      {
        title: 'Kinderkrankengeld 2026 nach Nettogehalt',
        content: `Werte dieses Rechners (vor Abzug der Sozialversicherungsbeiträge):\n\n| Nettogehalt | pro Tag | 5 Tage | 15 Tage |\n|---|---|---|---|\n${KK_TABLE}\n\nPro Kalendertag zahlt die Krankenkasse höchstens 70 % der Beitragsbemessungsgrenze, 2026 sind das ${eur(KK_CAP)}. Diese Grenze erreicht, wer mehr als rund ${eur0(KK_CAP_FROM_NET)} netto im Monat verdient. Vom Kinderkrankengeld gehen noch Ihre Anteile zur Renten-, Arbeitslosen- und Pflegeversicherung ab; Lohnsteuer fällt nicht an, das Geld unterliegt aber dem Progressionsvorbehalt.`,
      },
      {
        title: 'So kommen Sie an Freistellung und Geld',
        content: `1. **Arbeitgeber sofort informieren**, dass Sie wegen des kranken Kindes nicht kommen; die Freistellung ist unbezahlt, solange kein Anspruch auf Lohnfortzahlung besteht.\n2. **Ärztliche Bescheinigung** beim Kinderarzt holen, schon für den ersten Tag.\n3. **Bescheinigung an die Krankenkasse** schicken; der Arbeitgeber meldet dort Ihr Entgelt.\n4. **Tage zählen:** 2026 gibt es ${KK_COUPLE_MAX} Arbeitstage je Kind und Elternteil, für Alleinerziehende ${KK_SINGLE_MAX}, höchstens 35 bzw. 70 Tage im Jahr.\n\nVoraussetzung ist, dass Sie und das Kind gesetzlich versichert sind und das Kind unter 12 Jahre alt ist (bei Behinderung ohne Altersgrenze). Zahlt der Arbeitgeber das Gehalt für diese Tage weiter, etwa nach § 616 BGB oder Tarifvertrag, ruht das Kinderkrankengeld.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viele Kinderkrankentage gibt es 2027?',
        answer: 'Die erhöhten Zahlen von 15 bzw. 30 Tagen stehen in § 45 Abs. 2a SGB V nur für 2026. Ohne neue Regelung gelten ab 2027 wieder 10 Arbeitstage je Kind und Elternteil, 20 für Alleinerziehende, höchstens 25 bzw. 50 Tage im Jahr.',
      },
      {
        question: 'Wann zahlt die Krankenkasse 100 statt 90 Prozent?',
        answer: 'Wenn Sie in den zwölf Monaten vor der Freistellung beitragspflichtige Einmalzahlungen wie Weihnachts- oder Urlaubsgeld erhalten haben, beträgt das Kinderkrankengeld 100 % des ausgefallenen Nettoentgelts, gedeckelt auf denselben Tageshöchstbetrag. Der Rechner nimmt vorsichtig 90 % an.',
      },
    ],
  },

  'unterhaltsvorschuss-rechner': {
    sections: [
      {
        title: 'Unterhaltsvorschuss 2026 mit und ohne Teilzahlung',
        content: `Werte dieses Rechners, wenn der andere Elternteil einen Teil des Unterhalts zahlt:\n\n| Alter des Kindes | keine Zahlung | 100 € gezahlt | 200 € gezahlt | Jahr ohne Zahlung |\n|---|---|---|---|---|\n${UV_TABLE}\n\nJeder gezahlte Euro mindert den Vorschuss um einen Euro. Eine Halbwaisenrente wird ebenso angerechnet: Bekommt ein 8-jähriges Kind 120 € Waisenrente, bleiben ${txt(UV_WAISE_EX, 'payout')}. Das Einkommen des alleinerziehenden Elternteils spielt dagegen keine Rolle, außer bei 12- bis 17-Jährigen im Bürgergeld-Bezug.`,
      },
      {
        title: 'Wann der Anspruch entfällt und worauf Sie achten müssen',
        content: `- **Neue Ehe:** Heiratet der betreuende Elternteil oder geht eine eingetragene Partnerschaft ein und lebt mit dem neuen Partner zusammen, endet der Anspruch. Ein unverheiratetes Zusammenleben schadet nicht.\n- **Mitwirkung:** Wer keine Auskunft über den anderen Elternteil gibt oder bei der Feststellung der Vaterschaft nicht mitwirkt, bekommt keinen Vorschuss.\n- **Rückwirkend nur ein Monat:** Ein Antrag im Mai deckt höchstens noch den April ab, und nur, wenn Sie sich im April schon um Unterhalt bemüht haben.\n- **Einkommen des Kindes:** Nach dem Ende der allgemeinbildenden Schule wird eigenes Einkommen zur Hälfte angerechnet, etwa eine Ausbildungsvergütung nach Pauschalabzügen.\n- **Änderungen melden:** Umzug, Heirat oder Unterhaltszahlungen müssen Sie dem Jugendamt sofort mitteilen, sonst drohen Rückforderungen.`,
      },
    ],
    faqs: [
      {
        question: 'Wie wirkt sich Unterhaltsvorschuss auf Bürgergeld und Kinderzuschlag aus?',
        answer: `Beim Bürgergeld wird er voll als Einkommen des Kindes angerechnet, beim Kinderzuschlag zu 45 %. Für ein Kind von 12 bis 17 Jahren mit ${eur(UV_12_PAY)} Vorschuss sinkt der Kinderzuschlag also um ${eur(UV_12_PAY * 0.45)}.`,
      },
      {
        question: 'Wird Unterhaltsvorschuss zeitlich begrenzt gezahlt?',
        answer: `Nein, eine Höchstdauer gibt es nicht mehr. Gezahlt wird bis zum 18. Geburtstag, solange die Voraussetzungen vorliegen. Für ein Kind von 6 bis 11 Jahren sind das ohne Teilzahlung ${eur(UV_6_YEAR)} im Jahr.`,
      },
    ],
  },

  'ausbildungsunterhalt-bedarfskontrollbetrag-rechner': {
    sections: [
      {
        title: 'Restunterhalt bei verschiedenen Ausbildungsvergütungen',
        content: `Beispiel: Der barunterhaltspflichtige Elternteil hat 2.700 € bereinigtes Netto (Einkommensgruppe 3). Laut Düsseldorfer Tabelle 2026 zahlt er für ein 16-jähriges Kind ${eur(AU_BASE_MINOR)}, für ein volljähriges Kind, das noch beim anderen Elternteil wohnt, ${eur(AU_BASE_ADULT)}, solange nur er unterhaltsrelevantes Einkommen hat. Mit eigener Vergütung bleibt nach diesem Rechner:\n\n| Netto-Vergütung | minderjährig (hälftige Anrechnung) | volljährig (volle Anrechnung) |\n|---|---|---|\n${AU_TABLE}\n\nBeim minderjährigen Azubi wirkt sich die Vergütung nur halb aus, weil die andere Hälfte den betreuenden Elternteil entlastet. Ab dem 18. Geburtstag kippt das: Die Vergütung zählt voll, und schon mittlere Vergütungen decken den Bedarf.`,
      },
      {
        title: 'Der Bedarfskontrollbetrag: Herabstufung bei mehreren Kindern',
        content: `Neben jeder Einkommensgruppe nennt die Düsseldorfer Tabelle einen Bedarfskontrollbetrag (Anm. A.III). Er ist nicht der Selbstbehalt, sondern soll das Einkommen ausgewogen verteilen: Bleibt dem Zahlenden nach Abzug aller Kindesunterhalte weniger als dieser Betrag, wird so lange eine Gruppe tiefer gerechnet, bis er eingehalten ist.\n\nBeispiel mit ${eur0(BKB_NET)} Netto und zwei Kindern (8 und 13 Jahre):\n\n| Gruppe | Zahlbeträge zusammen | Bleibt dem Zahlenden | Bedarfskontrollbetrag | Ergebnis |\n|---|---|---|---|---|\n${BKB_STEPS.table}\n\nGezahlt wird hier nach Gruppe ${BKB_STEPS.final.gruppe}. Dieser Rechner arbeitet mit einem einzelnen Zahlbetrag; prüfen Sie bei mehreren Kindern den Wert, den Sie in das Feld „Bisheriger Unterhalts-Zahlbetrag“ eintragen, auf diese Weise.`,
      },
    ],
    faqs: [
      {
        question: 'Wer zahlt Unterhalt für einen volljährigen Azubi, Vater oder Mutter?',
        answer: 'Ab 18 haften beide Eltern anteilig nach ihrem Einkommen (§ 1606 Abs. 3 BGB), auch der Elternteil, bei dem das Kind wohnt. Von jedem Einkommen werden vorab 1.750 € angemessener Selbstbehalt abgezogen; der Rest bestimmt die Quote, mit der jeder den verbleibenden Bedarf trägt.',
      },
      {
        question: 'Wird das Kindergeld beim Azubi zusätzlich angerechnet?',
        answer: `Bei volljährigen Kindern mindert das volle Kindergeld von ${eur0(KINDERGELD)} den Bedarf, bei minderjährigen die Hälfte. Im Feld für den bisherigen Zahlbetrag ist dieser Abzug bereits enthalten; ziehen Sie das Kindergeld deshalb nicht ein zweites Mal ab.`,
      },
    ],
  },

  'unterhalt-volljaehrige-kinder-rechner': {
    sections: [
      {
        title: 'Haftungsquote: Wer von den Eltern wie viel zahlt',
        content: `Der Rechner zeigt den gemeinsamen Restbedarf. Auf die Eltern verteilt wird er so (Beispiel Studentin mit eigener Wohnung, kein eigenes Einkommen, Restbedarf ${eur(UVK_REST)}):\n\n1. Vater ${eur0(UVK_FATHER)} bereinigt, abzüglich ${eur0(DT.selbstbehaltAngemessen)} Sockelbetrag = ${eur0(UVK_F_HAFT)}.\n2. Mutter ${eur0(UVK_MOTHER)} bereinigt, abzüglich ${eur0(DT.selbstbehaltAngemessen)} = ${eur0(UVK_M_HAFT)}.\n3. Quote Vater: ${formatNumber((UVK_F_HAFT / (UVK_F_HAFT + UVK_M_HAFT)) * 100, 1)} %, Mutter: ${formatNumber((UVK_M_HAFT / (UVK_F_HAFT + UVK_M_HAFT)) * 100, 1)} %.\n4. Vater zahlt ${eur(UVK_F_SHARE)}, Mutter ${eur(UVK_M_SHARE)} im Monat.\n\nVerdient ein Elternteil nicht mehr als 1.750 €, fällt sein Anteil weg und der andere trägt den Bedarf allein, soweit sein eigener Selbstbehalt gewahrt bleibt.`,
      },
      {
        title: 'Bedarf bei Wohnen im Elternhaus nach Einkommen beider Eltern',
        content: `Wohnt das volljährige Kind noch bei einem Elternteil, richtet sich der Bedarf nach dem zusammengerechneten Einkommen beider Eltern (4. Altersstufe):\n\n| Einkommen beider Eltern | Bedarf | Rest nach Kindergeld | Rest bei 300 € eigenem Einkommen |\n|---|---|---|---|\n${UVK_TABLE}\n\nDer Betrag in der dritten Spalte ist der Gesamtbetrag beider Eltern; aufgeteilt wird er wieder nach der Haftungsquote. Der Elternteil, bei dem das Kind wohnt, leistet seinen Anteil oft in Form von Wohnung und Verpflegung.`,
      },
    ],
    faqs: [
      {
        question: 'Kann ein volljähriges Kind das Kindergeld direkt bekommen?',
        answer: 'Ja, wenn der kindergeldberechtigte Elternteil keinen Unterhalt leistet, kann die Familienkasse das Kindergeld auf Antrag an das Kind auszahlen (Abzweigung nach § 74 EStG). Zahlt der Elternteil Unterhalt, bleibt es bei ihm, wird aber auf den Bedarf des Kindes voll angerechnet.',
      },
      {
        question: 'Muss ein Student mit eigener Wohnung seine Krankenversicherung vom Unterhalt zahlen?',
        answer: 'Nein, die 990 € enthalten keine Beiträge zur Kranken- und Pflegeversicherung und keine Studiengebühren (Düsseldorfer Tabelle, Anm. A.V). Ist das Kind nicht mehr familienversichert, kommen diese Kosten zum Bedarf hinzu.',
      },
    ],
  },

  'duesseldorfer-tabelle-rechner': {
    sections: [
      {
        title: 'Zahlbeträge 2026 bei ausgewählten Einkommen',
        content: `Monatlicher Zahlbetrag nach diesem Rechner (erwerbstätiger Zahlender, ein Kind, Kindergeld bereits abgezogen, Selbstbehalt geprüft):\n\n| Bereinigtes Netto | 0–5 Jahre | 6–11 Jahre | 12–17 Jahre | ab 18 (bei einem Elternteil) |\n|---|---|---|---|---|\n${DT_TABLE}\n\nIn der ersten Zeile greift beim volljährigen Kind der angemessene Selbstbehalt von ${eur0(DT.selbstbehaltAngemessen)}: Statt ${txt(DT_2000_ADULT, 'zahlbetragTabelle')} sind nur ${txt(DT_2000_ADULT, 'zahlbetrag')} zu zahlen. Bei volljährigen Kindern haften außerdem beide Eltern anteilig, der Wert ist also eine Obergrenze für einen Elternteil.`,
      },
      {
        title: 'Mehrere Kinder und Mangelfall',
        content: `Die Tabelle ist auf zwei Unterhaltsberechtigte zugeschnitten. Reicht das Einkommen nicht für alle, wird nach Anmerkung C gerechnet: Was über dem Selbstbehalt liegt, wird im Verhältnis der Zahlbeträge verteilt.\n\nBeispiel: ${eur0(MF_NET)} Netto, Kinder mit 4 und 9 Jahren.\n\n- Verteilungsmasse: ${eur0(MF_NET)} − ${eur0(DT.selbstbehaltNotwendigErwerbstaetig)} = ${eur(MF_MASSE)}\n- Einsatzbeträge: ${eur(MF_K1)} + ${eur(MF_K2)} = ${eur(MF_SUM)}\n- Kind 4 Jahre: ${eur(MF_P1)}, Kind 9 Jahre: ${eur(MF_P2)}\n\nDie Kinder erhalten zusammen also nur ${eur(MF_MASSE)} statt ${eur(MF_SUM)}. Liegt ein so ermittelter Betrag unter dem Unterhaltsvorschuss der Altersstufe, kann der betreuende Elternteil die Differenz beim Jugendamt beantragen.`,
      },
    ],
    faqs: [
      {
        question: 'Was hat sich an der Düsseldorfer Tabelle 2026 gegenüber 2025 geändert?',
        answer: `Gestiegen sind der Mindestunterhalt (486 €, 558 € und 653 € in den drei Altersstufen) und das Kindergeld auf ${eur0(KINDERGELD)}. Die Einkommensgruppen und die Selbstbehalte von 1.450 €, 1.200 € und 1.750 € sind gleich geblieben. Zahlbeträge ändern sich deshalb meist nur um wenige Euro, weil der höhere Tabellenbetrag teilweise durch den größeren Kindergeldanteil ausgeglichen wird.`,
      },
      {
        question: 'Wird bei nur einem Kind höher eingestuft?',
        answer: 'Das ist möglich, aber keine Automatik. Die Tabelle geht von zwei Unterhaltsberechtigten aus; bei nur einem Kind kann das Gericht eine oder mehrere Gruppen höher gehen, bei drei und mehr Berechtigten tiefer (Anm. A.I). Dieser Rechner stuft nicht automatisch um.',
      },
    ],
  },
};
