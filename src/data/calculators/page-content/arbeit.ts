import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import { EXTRA_AUTO_ARBEIT } from '../extra/autoArbeit';
import { calculateBruttoNetto } from '@/lib/calculators/steuernGehalt';
import { calculateHourlyWage, calculateSalaryIncrease } from '@/lib/calculators/arbeit';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import { MINIJOB_PERIODS, WEEKS_PER_MONTH } from '@/data/regulated/minijob';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

// ---------------------------------------------------------------------------
// Helpers: every number below is computed with the calculator's own engine at module load.
// ---------------------------------------------------------------------------
function run(slug: string, inputs: Record<string, any>): CalculationResult {
  const calc = EXTRA_AUTO_ARBEIT.find((c) => c.slug === slug);
  if (!calc || !calc.calculate) throw new Error(`page-content/arbeit: calculator ${slug} not found`);
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

// Netto aus dem Brutto-Netto-Rechner: Steuerklasse 1, keine Kinder, gesetzlich versichert, 2026
const BN_BASE = { taxYear: '2026', taxClass: '1', children: '0', age: 30, federalState: 'other', churchTax: 'no', healthInsuranceType: 'statutory', kvZusatzbeitrag: 2.9 };
function netMonthly(gross: number): number {
  return Number(calculateBruttoNetto({ ...BN_BASE, grossSalary: gross, period: 'month' }).primary.value);
}

const BBG_KV_YEAR = LEGAL_VALUES_2026.bbgKrankenversicherungJahr.value;
const BBG_RV_MONTH = LEGAL_VALUES_2026.bbgRentenversicherungMonat.value;
const BBG_RV_YEAR = LEGAL_VALUES_2026.bbgRentenversicherungJahr.value;
const MINDESTLOHN_2026 = MINIJOB_PERIODS.find((p) => p.year === 2026)!.mindestlohn;
const MINDESTLOHN_2027 = MINIJOB_PERIODS.find((p) => p.year === 2027)!.mindestlohn;
const MINIJOB_GRENZE_2026 = MINIJOB_PERIODS.find((p) => p.year === 2026)!.grenze;

// ---------------------------------------------------------------------------
// Jahresgehalt in Monatsgehalt
// ---------------------------------------------------------------------------
const JG_COUNTS = ['12', '13', '13.5', '14'];
const jgMonthly = (yearly: number, count: string) => num(run('jahresgehalt-in-monatsgehalt-rechner', { yearlyGross: yearly, salaryCount: count }), 'monthlyBase');
const JG_TABLE = [40000, 50000, 60000]
  .map((y) => `| ${eur0(y)} | ${JG_COUNTS.map((c) => eur(jgMonthly(y, c))).join(' | ')} |`)
  .join('\n');
const JG_50_12 = jgMonthly(50000, '12');
const JG_50_13 = jgMonthly(50000, '13');
const JG_50_EXTRA = num(run('jahresgehalt-in-monatsgehalt-rechner', { yearlyGross: 50000, salaryCount: '13' }), 'extraPayTotal');
const JG_OFFER_A = { monthly: 4000, count: 12 };
const JG_OFFER_B = { monthly: 3750, count: 13 };

// ---------------------------------------------------------------------------
// Krankengeld (Netto per Brutto-Netto-Rechner, Steuerklasse 1)
// ---------------------------------------------------------------------------
const KG_ROWS = [2500, 3500, 4500].map((gross) => {
  const net = netMonthly(gross);
  const r = run('krankengeld-rechner', { monthlyGross: gross, monthlyNet: net, hasChildren: 'no' });
  return { gross, net, r, netRuleBinds: (net / 30) * 0.9 < (gross / 30) * 0.7 };
});
const KG_TABLE = KG_ROWS.map(
  (k) => `| ${eur0(k.gross)} | ${eur(k.net)} | ${txt(k.r, 'grossDaily')} | ${txt(k.r, 'monthlyNetKrankengeld')} | ${txt(k.r, 'monthlyIncomeDrop')} |`,
).join('\n');
const KG_ALL_NET_RULE = KG_ROWS.every((k) => k.netRuleBinds);
const KG_3500 = KG_ROWS[1];

// ---------------------------------------------------------------------------
// Überstunden-Auszahlung
// ---------------------------------------------------------------------------
const UE_GROSS = 3400;
const UE_HOURS_WEEK = 40;
const ue = (ot: number, bonus: number) => run('ueberstunden-auszahlung-rechner', { monthlyGross: UE_GROSS, weeklyHours: UE_HOURS_WEEK, overtimeHours: ot, bonusPct: bonus });
const UE_TABLE = [10, 20, 30]
  .map((ot) => `| ${ot} Stunden | ${txt(ue(ot, 0), 'grossPayout')} | ${txt(ue(ot, 25), 'grossPayout')} | ${txt(ue(ot, 25), 'estimatedNetPayout')} |`)
  .join('\n');
const UE_BASE_HOURLY = num(ue(1, 0), 'hourlyBase');
const UE_WRONG_HOURLY = UE_GROSS / (UE_HOURS_WEEK * 4);

// ---------------------------------------------------------------------------
// Mutterschaftsgeld
// ---------------------------------------------------------------------------
const MU_ROWS = [1600, 2000, 2400, 2800, 3200].map((net) => {
  const r = run('mutterschaftsgeld-rechner', { avgNetIncome: net });
  return { net, r };
});
const MU_TABLE = MU_ROWS.map(
  (m) => `| ${eur0(m.net)} | ${txt(m.r, 'dailyHealthFund')} | ${txt(m.r, 'dailyEmployerShare')} | ${txt(m.r, 'totalOver98Days')} | ${eur(num(m.r, 'totalDaily') * 126)} |`,
).join('\n');

// ---------------------------------------------------------------------------
// Vermögenswirksame Leistungen
// ---------------------------------------------------------------------------
const vl = (rate: number) => run('vermoegenswirksame-leistungen-rechner', { employerVlMonthly: 26.59, ownContributionMonthly: 13.41, investmentYears: 7, interestRatePct: rate, eligibleForStateSubsidy: 'yes' });
const VL_TABLE = [0, 2, 4, 6]
  .map((rate) => {
    const r = vl(rate);
    return `| ${formatPercent(rate, 1)} | ${txt(r, 'totalEndCapital')} | ${txt(r, 'totalEmployerContribution')} | ${txt(r, 'totalStateBonus')} | ${txt(r, 'profit')} |`;
  })
  .join('\n');
// Förderhöchstbeträge § 13 Abs. 2 VermBG (geprüft auf gesetze-im-internet.de, 2026-11-15)
const VL_FONDS_MAX = 400;
const VL_FONDS_RATE = 0.2;
const VL_BAU_MAX = 470;
const VL_BAU_RATE = 0.09;

// ---------------------------------------------------------------------------
// Elternzeit-Teilzeit
// ---------------------------------------------------------------------------
const EZ_TABLE = [15, 20, 24, 28, 32]
  .map((h) => {
    const r = run('elternzeit-teilzeit-rechner', { fulltimeGross: 3800, fulltimeHours: 40, parttimeHours: h });
    return `| ${h} Std. | ${txt(r, 'ratio')} | ${txt(r, 'ptGross')} | ${txt(r, 'ptNet')} |`;
  })
  .join('\n');

// ---------------------------------------------------------------------------
// Betriebliche Altersvorsorge
// ---------------------------------------------------------------------------
const BAV_TABLE = [50, 100, 150, 200, 250]
  .map((c) => {
    const r = run('betriebliche-altersvorsorge-rechner', { monthlyGross: 3800, employeeConversion: c, employerMandatoryPct: 15 });
    return `| ${eur(c)} | ${txt(r, 'agZuschuss')} | ${txt(r, 'totalMonthlyContribution')} | ${txt(r, 'effectiveNetCost')} |`;
  })
  .join('\n');
const BAV_TAXFREE_YEAR = BBG_RV_YEAR * 0.08;
const BAV_SVFREE_YEAR = BBG_RV_YEAR * 0.04;

// ---------------------------------------------------------------------------
// Urlaubsabgeltung
// ---------------------------------------------------------------------------
const ua = (gross: number, days: number, perWeek = 5) => run('urlaubsabgeltung-rechner', { monthlyGross: gross, remainingDays: days, workDaysPerWeek: perWeek });
const UA_TABLE = [2500, 3500, 4500]
  .map((g) => `| ${eur0(g)} | ${txt(ua(g, 1), 'dailyVacationPay')} | ${txt(ua(g, 5), 'totalGrossCompensation')} | ${txt(ua(g, 10), 'totalGrossCompensation')} | ${txt(ua(g, 15), 'totalGrossCompensation')} |`)
  .join('\n');
const UA_4DAY = txt(ua(3500, 1, 4), 'dailyVacationPay');
const UA_PRORATA = (30 * 3) / 12; // 3 volle Monate von 30 Urlaubstagen

// ---------------------------------------------------------------------------
// Sachbezug / Dienstjubiläum
// ---------------------------------------------------------------------------
const sb = (monthly: number, special: number) => run('dienstjubilaeum-steuerfrei-rechner', { monthlyVoucherValue: monthly, specialOccasionValue: special });
const SB_TABLE = [40, 50, 50.01, 55]
  .map((m) => `| ${eur(m)} | ${txt(sb(m, 0), 'monthlySaving')} | ${num(sb(m, 0), 'monthlySaving') > 0 ? eur(m * 12) : eur(0)} |`)
  .join('\n');
const SB_GIFT_OK = txt(sb(0, 60), 'specialGiftStatus');
const SB_GIFT_OVER = txt(sb(0, 65), 'specialGiftStatus');

// ---------------------------------------------------------------------------
// Kurzarbeitergeld
// ---------------------------------------------------------------------------
const kug = (gross: number, pct: number, kids: boolean) => run('kurzarbeitergeld-rechner', { regularGross: gross, workReductionPct: pct, hasChildren: kids ? 'with_child' : 'no_child' });
const KUG_TABLE = [2500, 3500, 4500]
  .map((g) => `| ${eur0(g)} | ${txt(kug(g, 50, false), 'totalIncome')} | ${txt(kug(g, 50, true), 'totalIncome')} | ${txt(kug(g, 100, false), 'totalIncome')} | ${txt(kug(g, 100, true), 'totalIncome')} |`)
  .join('\n');
const KUG_3500_NULL = kug(3500, 100, false);
const KUG_3500_NULL_KID = kug(3500, 100, true);

// ---------------------------------------------------------------------------
// Arbeitslosengeld 1
// ---------------------------------------------------------------------------
const alg = (gross: number, taxClass: string, kids: boolean) => run('arbeitslosengeld-1-rechner', { avgGrossMonthly: gross, taxClass, hasChildren: kids ? 'yes' : 'no', ageYears: 35 });
const ALG_TABLE = [2500, 3500, 4500]
  .map((g) => `| ${eur0(g)} | ${txt(alg(g, '1', false), 'monthlyAlg')} | ${txt(alg(g, '1', true), 'monthlyAlg')} | ${txt(alg(g, '3', false), 'monthlyAlg')} |`)
  .join('\n');

// ---------------------------------------------------------------------------
// Gehaltserhöhung
// ---------------------------------------------------------------------------
const GE_PCTS = [3, 5, 8];
const GE_TABLE = [3000, 3800, 4500]
  .map((g) => {
    const baseNet = netMonthly(g);
    const cells = GE_PCTS.map((p) => {
      const r = calculateSalaryIncrease({ currentSalary: g, increasePercent: p, monthsPerYear: 12 });
      const plus = num(r, 'monthlyPlus');
      return `+${eur(plus)} / +${eur(netMonthly(g + plus) - baseNet)}`;
    });
    return `| ${eur0(g)} | ${cells.join(' | ')} |`;
  })
  .join('\n');
const GE_200_NET = netMonthly(3800 + 200) - netMonthly(3800);
const GE_REAL = ((1.05 / 1.02) - 1) * 100;

// ---------------------------------------------------------------------------
// Stundenlohn / Mindestlohn
// ---------------------------------------------------------------------------
const SL_HOURS = [20, 30, 35, 38.5, 40];
const SL_MIN_TABLE = SL_HOURS.map((h) => `| ${formatNumber(h, 1)} Std. | ${eur(MINDESTLOHN_2026 * h * WEEKS_PER_MONTH)} | ${eur(MINDESTLOHN_2027 * h * WEEKS_PER_MONTH)} |`).join('\n');
const SL_FULL_2026 = MINDESTLOHN_2026 * 40 * WEEKS_PER_MONTH;
const SL_FULL_2027 = MINDESTLOHN_2027 * 40 * WEEKS_PER_MONTH;
// Gegenprobe mit dem Rechner: dieser Monatslohn ergibt wieder exakt den Mindestlohn
const SL_CHECK = num(calculateHourlyWage({ monthlySalary: SL_FULL_2026, weeklyHours: 40 }), 'hourlyWage');
const SL_GROSS_TABLE = [2500, 3000, 3500, 4000, 5000]
  .map((g) => `| ${eur0(g)} | ${calculateHourlyWage({ monthlySalary: g, weeklyHours: 38.5 }).primary.formattedValue} | ${calculateHourlyWage({ monthlySalary: g, weeklyHours: 40 }).primary.formattedValue} |`)
  .join('\n');
const SL_45 = num(calculateHourlyWage({ monthlySalary: 2500, weeklyHours: 45 }), 'hourlyWage');
const SL_40 = num(calculateHourlyWage({ monthlySalary: 2500, weeklyHours: 40 }), 'hourlyWage');

// ---------------------------------------------------------------------------
// Nacht-/Sonntagszuschläge: Schicht Samstag 20 Uhr bis Sonntag 6 Uhr, 18,50 € Grundlohn
// ---------------------------------------------------------------------------
const NZ_WAGE = 18.5;
const nz = (type: string, hours: number, wage = NZ_WAGE) => num(run('nachtzuschlag-sonntagszuschlag-rechner', { hourlyWage: wage, surchargeType: type, workedHours: hours }), 'totalBonusTaxFree');
const NZ_PARTS = [
  { label: 'Sa 20–24 Uhr', hours: 4, rate: 'Nacht 25 %', value: nz('night_standard', 4) },
  { label: 'So 0–4 Uhr', hours: 4, rate: 'Nacht 40 %', value: nz('night_core', 4) },
  { label: 'So 0–4 Uhr', hours: 4, rate: 'Sonntag 50 %', value: nz('sunday', 4) },
  { label: 'So 4–6 Uhr', hours: 2, rate: 'Nacht 25 %', value: nz('night_standard', 2) },
  { label: 'So 4–6 Uhr', hours: 2, rate: 'Sonntag 50 %', value: nz('sunday', 2) },
];
const NZ_TOTAL = NZ_PARTS.reduce((s, p) => s + p.value, 0);
const NZ_TABLE = NZ_PARTS.map((p) => `| ${p.label} | ${p.hours} | ${p.rate} | ${eur(p.value)} |`).join('\n');
const NZ_30_RESULT = run('nachtzuschlag-sonntagszuschlag-rechner', { hourlyWage: 30, surchargeType: 'night_standard', workedHours: 1 });
const NZ_30 = num(NZ_30_RESULT, 'totalBonusTaxFree');
const NZ_30_SVFREE = num(NZ_30_RESULT, 'svFreeBonus');
const NZ_30_SVLIABLE = num(NZ_30_RESULT, 'svLiableBonus');

// ---------------------------------------------------------------------------
// Ehrenamt / Übungsleiter (Freibeträge aus dem Rechner selbst)
// ---------------------------------------------------------------------------
const ea = (type: string, payout: number) => run('dienstaufwandsentschaedigung-rechner', { activityType: type, yearlyPayout: payout });
const EA_TRAINER_MAX = num(ea('trainer', 0), 'maxAllowance');
const EA_VOLUNTEER_MAX = num(ea('volunteer', 0), 'maxAllowance');
const EA_TRAINER_MONTH = num(ea('trainer', EA_TRAINER_MAX), 'monthlyTaxFree');
const EA_TABLE = [1200, EA_TRAINER_MAX, EA_TRAINER_MAX + 600]
  .map((p) => `| ${eur(p)} | ${txt(ea('trainer', p), 'taxFreePart')} | ${txt(ea('trainer', p), 'taxablePart')} | ${txt(ea('volunteer', p), 'taxFreePart')} | ${txt(ea('volunteer', p), 'taxablePart')} |`)
  .join('\n');

export const ARBEIT_PAGE_CONTENT: PageContentMap = {
  'jahresgehalt-in-monatsgehalt-rechner': {
    sections: [
      {
        title: 'Umrechnungstabelle: 40.000, 50.000 und 60.000 € Jahresbrutto',
        content:
          `Monatliches Grundgehalt brutto, je nachdem auf wie viele Zahlungen das Jahresgehalt verteilt wird:\n\n| Jahresbrutto | 12 Gehälter | 13 Gehälter | 13,5 Gehälter | 14 Gehälter |\n| --- | --- | --- | --- | --- |\n${JG_TABLE}\n\n` +
          `So lesen Sie die Tabelle: Bei 50.000 € und 13 Gehältern steht auf der normalen Monatsabrechnung ${eur(JG_50_13)}. Die restlichen ${eur(JG_50_EXTRA)} kommen als Sonderzahlung, je nach Vertrag meist mit der November- oder Dezemberabrechnung.`,
      },
      {
        title: 'Zwei Gehaltsangebote richtig vergleichen',
        content:
          `Vergleichen Sie Angebote immer über das Jahresbrutto, nie über das Monatsgehalt. Beispiel: Angebot A zahlt ${eur0(JG_OFFER_A.monthly)} × ${JG_OFFER_A.count} = ${eur0(JG_OFFER_A.monthly * JG_OFFER_A.count)}, Angebot B ${eur0(JG_OFFER_B.monthly)} × ${JG_OFFER_B.count} = ${eur0(JG_OFFER_B.monthly * JG_OFFER_B.count)}. Das niedrigere Monatsgehalt ist hier das bessere Angebot.\n\n` +
          '- **Fest zugesagt oder freiwillig?** Steht im Vertrag, dass das Gehalt in 13 Raten gezahlt wird, haben Sie einen Anspruch. Ein „freiwilliges Weihnachtsgeld“ kann wegfallen.\n' +
          '- **Erstes Jahr:** Wer im Lauf des Jahres anfängt, bekommt Sonderzahlungen oft nur anteilig.\n' +
          '- **Stichtag und Rückzahlung:** Manche Verträge zahlen das 13. Gehalt nur, wenn Sie am Stichtag noch beschäftigt sind.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel ist ein Jahresgehalt von 50.000 € brutto im Monat?',
        answer: `Bei 12 Gehältern sind es ${eur(JG_50_12)} brutto pro Monat, bei 13 Gehältern ${eur(JG_50_13)} plus einmal ${eur(JG_50_13)} Sonderzahlung. Netto bleiben von ${eur(JG_50_12)} in Steuerklasse 1 ohne Kinder 2026 rund ${eur(netMonthly(JG_50_12))} (gesetzlich krankenversichert, 2,9 % Zusatzbeitrag).`,
      },
      {
        question: 'Wird das 13. Gehalt höher besteuert als ein normales Monatsgehalt?',
        answer: `Im Auszahlungsmonat sieht der Abzug höher aus, weil das 13. Gehalt als sonstiger Bezug mit der Jahreslohnsteuer berechnet wird. Über das Jahr zahlen Sie aber dieselbe Einkommensteuer, als wäre das Geld gleichmäßig verteilt worden. Liegt Ihr Jahresgehalt über der Beitragsbemessungsgrenze der Krankenversicherung (2026: ${eur0(BBG_KV_YEAR)}), bleibt das 13. Gehalt ganz oder teilweise frei von Kranken- und Pflegebeiträgen.`,
      },
    ],
  },

  'krankengeld-rechner': {
    sections: [
      {
        title: 'Krankengeld bei 2.500, 3.500 und 4.500 € brutto',
        content:
          `Netto vor der Erkrankung berechnet für Steuerklasse 1, keine Kinder, 2026. Das Krankengeld zahlt die Kasse ab der 7. Krankheitswoche, vorher zahlt der Arbeitgeber das volle Gehalt weiter.\n\n| Brutto | Netto vorher | Brutto-Krankengeld pro Tag | Netto-Krankengeld pro Monat | Lücke pro Monat |\n| --- | --- | --- | --- | --- |\n${KG_TABLE}\n\n` +
          (KG_ALL_NET_RULE
            ? 'In allen drei Fällen begrenzt die 90-%-Netto-Regel das Krankengeld, nicht die 70 % vom Brutto. Wer in Steuerklasse 3 ein höheres Netto hat, kommt deshalb näher an die 70-%-Grenze heran. '
            : '') +
          'Ein voller Kalendermonat wird mit 30 Tagen bezahlt, ein Monat mit 31 Tagen bringt also keinen Tag mehr.',
      },
      {
        title: 'Damit das Krankengeld ohne Lücke weiterläuft',
        content:
          '- **Folgebescheinigung rechtzeitig holen:** Die weitere Arbeitsunfähigkeit muss spätestens am nächsten Werktag nach dem zuletzt bescheinigten Ende festgestellt werden; Samstage zählen dabei nicht als Werktag (§ 46 SGB V). Wer erst Tage später zum Arzt geht, riskiert, dass der Anspruch endet.\n' +
          '- **Entgeltbescheinigung:** Ihr Arbeitgeber meldet der Kasse das Gehalt vor der Erkrankung elektronisch. Erst danach kann die Kasse die Höhe festsetzen.\n' +
          '- **Bescheid prüfen:** Vergleichen Sie das bescheinigte Brutto und Netto mit Ihren letzten Abrechnungen. Stimmen die Beträge nicht, wenden Sie sich an Arbeitgeber und Kasse.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel Krankengeld bekomme ich bei 3.500 € brutto?',
        answer: `In Steuerklasse 1 ohne Kinder (Netto ${eur(KG_3500.net)}) beträgt das Brutto-Krankengeld ${txt(KG_3500.r, 'grossDaily')} pro Tag. Nach Abzug der Beiträge zu Renten-, Arbeitslosen- und Pflegeversicherung bleiben ${txt(KG_3500.r, 'monthlyNetKrankengeld')} im Monat, ${txt(KG_3500.r, 'monthlyIncomeDrop')} weniger als Ihr Nettogehalt.`,
      },
      {
        question: 'Zählen Weihnachts- und Urlaubsgeld beim Krankengeld mit?',
        answer: 'Ja, anteilig: Einmalzahlungen aus den letzten zwölf Monaten vor der Arbeitsunfähigkeit erhöhen das Regelentgelt um ein 360stel des Betrags (§ 47 Abs. 2 SGB V). Das hebt das Krankengeld etwas an, mehr als Ihr bisheriges Nettoarbeitsentgelt gibt es aber nicht. Dieser Rechner lässt Einmalzahlungen außen vor.',
      },
      {
        question: 'Darf ich während des Krankengeldbezugs ins Ausland reisen?',
        answer: 'Nur mit Zustimmung Ihrer Krankenkasse. Ohne Zustimmung ruht der Anspruch für die Zeit des Auslandsaufenthalts (§ 16 Abs. 4 SGB V). Fragen Sie vor der Reise schriftlich an und legen Sie am besten eine Bestätigung Ihres Arztes bei, dass die Reise die Genesung nicht gefährdet.',
      },
    ],
  },

  'ueberstunden-auszahlung-rechner': {
    sections: [
      {
        title: `Was 10, 20 oder 30 Überstunden bei ${formatNumber(UE_GROSS, 0)} € Gehalt bringen`,
        content:
          `Monatsgehalt ${eur0(UE_GROSS)} brutto, ${UE_HOURS_WEEK}-Stunden-Woche, Grundstundenlohn ${eur(UE_BASE_HOURLY)}:\n\n| Überstunden | Brutto ohne Zuschlag | Brutto mit 25 % | Netto (Schätzung, 25 %) |\n| --- | --- | --- | --- |\n${UE_TABLE}\n\n` +
          `**Häufiger Rechenfehler:** Wer das Gehalt durch 4 Wochen teilt, kommt auf ${eur(UE_WRONG_HOURLY)} pro Stunde statt ${eur(UE_BASE_HOURLY)}. Ein Monat hat im Schnitt 13/3 ≈ 4,33 Wochen, deshalb rechnet auch die Lohnabrechnung mit dem kleineren Wert. Die Nettoschätzung ist grob: Überstundenvergütung kommt auf Ihr laufendes Gehalt obendrauf und wird mit Ihrem persönlichen Grenzsteuersatz belastet.`,
      },
    ],
    faqs: [
      {
        question: 'Gibt es einen gesetzlichen Anspruch auf einen Überstundenzuschlag?',
        answer: `Nein. Einen Zuschlag für Mehrarbeit gibt es nur, wenn Tarifvertrag, Betriebsvereinbarung oder Arbeitsvertrag ihn vorsehen. Gesetzlich gesichert ist nur, dass jede gearbeitete Stunde mindestens mit dem Mindestlohn bezahlt sein muss (2026: ${eur(MINDESTLOHN_2026)}). Für Nachtarbeitnehmer verlangt § 6 Abs. 5 ArbZG einen angemessenen Ausgleich durch Zuschlag oder freie Tage.`,
      },
      {
        question: 'Wann verfallen nicht bezahlte Überstunden?',
        answer: 'Der Anspruch verjährt nach drei Jahren, gerechnet ab Ende des Jahres, in dem die Überstunden angefallen sind. Viele Arbeitsverträge enthalten aber Ausschlussfristen von meist drei Monaten, innerhalb derer Sie die Vergütung schriftlich fordern müssen. Der Teil, der dem Mindestlohn entspricht, kann durch solche Klauseln nicht verfallen.',
      },
      {
        question: 'Muss ich beweisen, dass ich Überstunden gemacht habe?',
        answer: 'Ja. Im Streitfall müssen Sie darlegen, an welchen Tagen Sie wie lange gearbeitet haben und dass der Arbeitgeber die Überstunden angeordnet, gebilligt oder geduldet hat (BAG, Urteil vom 4. Mai 2022, 5 AZR 359/21). Notieren Sie Beginn, Ende und Pausen deshalb selbst und bewahren Sie E-Mails mit Arbeitsaufträgen auf.',
      },
    ],
  },

  'mutterschaftsgeld-rechner': {
    sections: [
      {
        title: 'Mutterschaftsgeld nach Nettogehalt: Tabelle für 14 und 18 Wochen',
        content:
          `Die Kasse zahlt höchstens 13 € pro Kalendertag, den Rest bis zum bisherigen Netto zahlt der Arbeitgeber. 18 Wochen gelten bei Früh- und Mehrlingsgeburten, wenn das Kind am errechneten Termin kommt (6 Wochen vorher, 12 Wochen danach).\n\n| Netto pro Monat | Krankenkasse pro Tag | Arbeitgeber pro Tag | Summe 14 Wochen | Summe 18 Wochen |\n| --- | --- | --- | --- | --- |\n${MU_TABLE}`,
      },
      {
        title: 'Wenn das Kind früher oder später kommt',
        content:
          '- **Später als errechnet:** Die Schutzfrist vor der Geburt verlängert sich um die zusätzlichen Tage, die 8 Wochen danach bleiben voll erhalten. Sie bekommen für diese Tage ebenfalls Mutterschaftsgeld.\n' +
          '- **Früher als errechnet:** Die Tage, die vor der Geburt gefehlt haben, werden an die Schutzfrist nach der Geburt angehängt (§ 3 Abs. 2 MuSchG). Insgesamt gehen Ihnen keine Tage verloren.\n' +
          '- **Privat oder familienversichert:** Statt der 13 € pro Tag zahlt das Bundesamt für Soziale Sicherung einmalig höchstens 210 €. Den Arbeitgeberzuschuss (Netto pro Tag minus 13 €) zahlt der Arbeitgeber trotzdem.',
      },
    ],
    faqs: [
      {
        question: 'Muss ich Mutterschaftsgeld versteuern?',
        answer: 'Mutterschaftsgeld und Arbeitgeberzuschuss sind steuerfrei (§ 3 Nr. 1 Buchst. d EStG), erhöhen aber über den Progressionsvorbehalt den Steuersatz auf Ihr übriges Einkommen. Liegen die Leistungen über 410 € im Jahr, müssen Sie eine Steuererklärung abgeben; häufig folgt eine Nachzahlung.',
      },
      {
        question: 'Wird das Mutterschaftsgeld auf das Elterngeld angerechnet?',
        answer: 'Ja. Für die Lebensmonate des Kindes, in denen Sie nach der Geburt noch Mutterschaftsgeld und Arbeitgeberzuschuss bekommen, wird das Elterngeld gekürzt (§ 3 BEEG). Diese Monate zählen als Elterngeldmonate der Mutter. Beim anderen Elternteil wird nichts angerechnet.',
      },
      {
        question: 'Wann kann ich Mutterschaftsgeld beantragen?',
        answer: 'Sobald Sie das ärztliche Zeugnis über den voraussichtlichen Entbindungstermin haben. Es darf frühestens eine Woche vor Beginn der Schutzfrist ausgestellt sein, also etwa 7 Wochen vor dem Termin. Reichen Sie es bei Ihrer Krankenkasse ein und geben Sie eine Kopie an den Arbeitgeber, damit er den Zuschuss berechnen kann.',
      },
    ],
  },

  'vermoegenswirksame-leistungen-rechner': {
    sections: [
      {
        title: 'Was aus 40 € VL im Monat wird: vier Rendite-Szenarien',
        content:
          `Arbeitgeber 26,59 €, Eigenanteil 13,41 €, 6 Jahre Einzahlung plus 1 Jahr Wartezeit, Anspruch auf Sparzulage:\n\n| Rendite pro Jahr | Endkapital | davon Arbeitgeber | Sparzulage | Erträge |\n| --- | --- | --- | --- | --- |\n${VL_TABLE}\n\n` +
          'Auch ohne jeden Ertrag bleibt der Vertrag lohnend, solange der Arbeitgeber zahlt: Sein Anteil ist Geld, das es ohne VL-Vertrag gar nicht gäbe.',
      },
      {
        title: 'Fondssparplan oder Bausparvertrag: die Förderung im Vergleich',
        content:
          `| Anlageform | Sparzulage | gefördert bis | Zulage höchstens |\n| --- | --- | --- | --- |\n| Aktienfonds, ETF, Beteiligungen | ${formatPercent(VL_FONDS_RATE * 100, 0)} | ${eur0(VL_FONDS_MAX)} im Jahr | ${eur(VL_FONDS_MAX * VL_FONDS_RATE)} im Jahr |\n| Bausparen, Wohnungsbau | ${formatPercent(VL_BAU_RATE * 100, 0)} | ${eur0(VL_BAU_MAX)} im Jahr | ${eur(VL_BAU_MAX * VL_BAU_RATE)} im Jahr |\n\n` +
          `Für beide gilt dieselbe Einkommensgrenze: 40.000 € zu versteuerndes Einkommen, bei Zusammenveranlagung 80.000 € (§ 13 VermBG). Mit zwei Verträgen können Sie beide Zulagen nebeneinander nutzen, zusammen bis zu ${eur(VL_FONDS_MAX * VL_FONDS_RATE + VL_BAU_MAX * VL_BAU_RATE)} im Jahr. Dieser Rechner rechnet mit der Fondsförderung.`,
      },
    ],
    faqs: [
      {
        question: 'Wann wird die Arbeitnehmersparzulage ausgezahlt?',
        answer: 'Sie beantragen die Zulage jedes Jahr mit der Steuererklärung (Anlage VL); Ihr Anbieter meldet die Einzahlungen elektronisch ans Finanzamt. Ausgezahlt wird die gesammelte Zulage erst nach Ablauf der siebenjährigen Sperrfrist. Den Antrag können Sie bis zum Ende des vierten Jahres nach dem Sparjahr nachholen.',
      },
      {
        question: 'Muss ich auf vermögenswirksame Leistungen Steuern zahlen?',
        answer: 'Ja. Der Arbeitgeberzuschuss ist normaler Arbeitslohn, auf den Lohnsteuer und Sozialbeiträge anfallen. Von 26,59 € VL kommt also netto weniger bei Ihnen an, der volle Betrag fließt aber in den Vertrag. Ihr Netto sinkt um den Eigenanteil plus die Abgaben auf den Zuschuss, nicht um die ganze Rate von 40 €.',
      },
    ],
  },

  'elternzeit-teilzeit-rechner': {
    sections: [
      {
        title: 'Teilzeitgehalt in Elternzeit: 15 bis 32 Stunden im Vergleich',
        content:
          `Bisher 3.800 € brutto bei 40 Wochenstunden:\n\n| Wochenstunden | Anteil an Vollzeit | Brutto | Netto (grobe Schätzung) |\n| --- | --- | --- | --- |\n${EZ_TABLE}\n\n` +
          'Einen Rechtsanspruch auf Teilzeit haben Sie für 15 bis 32 Wochenstunden im Monatsdurchschnitt. Weniger als 15 Stunden sind möglich, aber nur mit Zustimmung des Arbeitgebers.',
      },
      {
        title: 'Teilzeit in Elternzeit beantragen: Voraussetzungen und Fristen',
        content:
          'Nach § 15 Abs. 7 BEEG können Sie die Teilzeit verlangen, wenn\n\n' +
          '- der Arbeitgeber in der Regel mehr als 15 Beschäftigte hat (Auszubildende zählen nicht),\n' +
          '- Ihr Arbeitsverhältnis ohne Unterbrechung länger als sechs Monate besteht,\n' +
          '- die Arbeitszeit für mindestens zwei Monate auf 15 bis 32 Wochenstunden sinken soll,\n' +
          '- keine dringenden betrieblichen Gründe entgegenstehen.\n\n' +
          '**Fristen:** Den Antrag stellen Sie in Textform 7 Wochen vor Beginn der Teilzeit, wenn das Kind jünger als drei Jahre ist, sonst 13 Wochen vorher. Der Arbeitgeber muss innerhalb von 4 Wochen (bei Elternzeit ab dem 3. Geburtstag: 8 Wochen) begründet ablehnen. Schweigt er, gilt die Teilzeit wie beantragt als vereinbart.',
      },
    ],
    faqs: [
      {
        question: 'Darf ich in der Elternzeit bei einem anderen Arbeitgeber arbeiten?',
        answer: 'Ja, bis zu 32 Wochenstunden, aber nur mit Zustimmung Ihres bisherigen Arbeitgebers. Er kann sie nur aus dringenden betrieblichen Gründen verweigern und muss das innerhalb von vier Wochen in Textform tun (§ 15 Abs. 4 BEEG). Das gilt auch für eine selbstständige Tätigkeit.',
      },
      {
        question: 'Wie verändert das Teilzeitgehalt mein Elterngeld?',
        answer: 'Wer während des Elterngeldbezugs in Teilzeit arbeitet, bekommt Elterngeld nur auf den Unterschied zwischen dem Netto vor der Geburt und dem Teilzeit-Netto (§ 2 Abs. 3 BEEG). Dieser Rechner zeigt nur Ihr Teilzeitgehalt; die Elterngeldhöhe ermittelt die Elterngeldstelle aus Ihren Nettobeträgen.',
      },
    ],
  },

  'betriebliche-altersvorsorge-rechner': {
    sections: [
      {
        title: 'Entgeltumwandlung von 50 bis 250 €: Beitrag und Nettoaufwand',
        content:
          `Bei 3.800 € brutto und dem gesetzlichen Zuschuss von 15 %:\n\n| Eigene Umwandlung | Arbeitgeberzuschuss | Beitrag in den Vertrag | Netto-Aufwand (Schätzung) |\n| --- | --- | --- | --- |\n${BAV_TABLE}\n\n` +
          `Der Nettoaufwand ist eine Faustregel. Liegt Ihr Gehalt über der Beitragsbemessungsgrenze der Rentenversicherung (2026: ${eur(BBG_RV_MONTH)} im Monat), sparen Sie keine Renten- und Arbeitslosenbeiträge mehr; die Umwandlung kostet Sie dann netto mehr. Weil auch der Arbeitgeber keine Beiträge spart, muss er den 15-%-Zuschuss insoweit nicht zahlen.`,
      },
      {
        title: 'Förder-Höchstbeträge 2026',
        content:
          `Beide Grenzen hängen an der Beitragsbemessungsgrenze der Rentenversicherung von ${eur0(BBG_RV_YEAR)} im Jahr:\n\n` +
          `- **Steuerfrei (8 %, § 3 Nr. 63 EStG):** ${eur0(BAV_TAXFREE_YEAR)} im Jahr, also ${eur0(BAV_TAXFREE_YEAR / 12)} im Monat.\n` +
          `- **Sozialabgabenfrei (4 %):** ${eur0(BAV_SVFREE_YEAR)} im Jahr, also ${eur0(BAV_SVFREE_YEAR / 12)} im Monat.\n\n` +
          'Zuschüsse des Arbeitgebers zählen in diese Grenzen mit hinein. Wer mehr als den sozialabgabenfreien Betrag umwandelt, spart auf den Rest nur noch Steuern.',
      },
    ],
    faqs: [
      {
        question: 'Was passiert mit meiner Betriebsrente bei einem Jobwechsel?',
        answer: `Anwartschaften aus Entgeltumwandlung gehören Ihnen sofort und bleiben erhalten (§ 1b Abs. 5 BetrAVG). Sie können den Vertrag beim alten Arbeitgeber beitragsfrei stehen lassen, privat weiterführen oder innerhalb eines Jahres nach dem Wechsel die Übertragung zum neuen Arbeitgeber verlangen, wenn das Guthaben die Beitragsbemessungsgrenze von ${eur0(BBG_RV_YEAR)} nicht übersteigt (§ 4 Abs. 3 BetrAVG).`,
      },
      {
        question: 'Wird meine gesetzliche Rente durch die Entgeltumwandlung kleiner?',
        answer: 'Ja, etwas. Auf den sozialabgabenfreien Teil zahlen Sie keine Rentenbeiträge, dadurch sammeln Sie weniger Entgeltpunkte. Bei 150 € Umwandlung im Monat sind das 1.800 € weniger beitragspflichtiges Entgelt im Jahr. Die Betriebsrente gleicht das in der Regel aus, vor allem wenn der Arbeitgeber mehr als 15 % dazugibt.',
      },
    ],
  },

  'urlaubsabgeltung-rechner': {
    sections: [
      {
        title: 'Wert eines Urlaubstags: Tabelle für 2.500 bis 4.500 €',
        content:
          `Brutto-Abgeltung bei einer 5-Tage-Woche:\n\n| Monatsbrutto | 1 Tag | 5 Tage | 10 Tage | 15 Tage |\n| --- | --- | --- | --- | --- |\n${UA_TABLE}\n\n` +
          `Bei einer 4-Tage-Woche ist jeder Urlaubstag mehr wert, weil sich der Verdienst auf weniger Arbeitstage verteilt: Bei 3.500 € sind es ${UA_4DAY} pro Tag. Dafür haben Sie entsprechend weniger Urlaubstage.`,
      },
      {
        title: 'Resturlaub beim Ausscheiden richtig zählen',
        content:
          '1. **Jahresanspruch kürzen, wenn nötig:** Scheiden Sie in der ersten Jahreshälfte aus, steht Ihnen für jeden vollen Beschäftigungsmonat ein Zwölftel zu (§ 5 BUrlG). In der zweiten Jahreshälfte behalten Sie nach mehr als sechs Monaten Betriebszugehörigkeit mindestens den vollen gesetzlichen Urlaub; ob Mehrurlaub gezwölftelt wird, regelt Ihr Vertrag.\n' +
          `2. **Runden:** Ergeben sich Bruchteile von mindestens einem halben Tag, wird aufgerundet. Beispiel: Austritt zum 31. März bei 30 Tagen Urlaub ergibt ${formatNumber(UA_PRORATA, 1)} Tage, also ${Math.round(UA_PRORATA)} Tage.\n` +
          '3. **Genommene Tage abziehen:** Was danach übrig bleibt, tragen Sie oben als Resturlaub ein.',
      },
    ],
    faqs: [
      {
        question: 'Bekomme ich Urlaubsabgeltung auch, wenn ich selbst kündige?',
        answer: 'Ja. Der Anspruch hängt nicht davon ab, wer kündigt oder warum das Arbeitsverhältnis endet. Auch nach einer fristlosen Kündigung oder einem Aufhebungsvertrag muss nicht genommener Urlaub ausgezahlt werden.',
      },
      {
        question: 'Wirkt sich die Urlaubsabgeltung auf das Arbeitslosengeld aus?',
        answer: 'Ja, das Arbeitslosengeld ruht für die Tage, für die Sie Urlaubsabgeltung erhalten haben (§ 157 Abs. 2 SGB III). Bei 10 abgegoltenen Urlaubstagen in einer 5-Tage-Woche beginnt die Zahlung also rund zwei Wochen später. Verloren geht dadurch nichts: Die Bezugsdauer verschiebt sich nur nach hinten.',
      },
      {
        question: 'Was passiert mit Urlaub, den ich wegen langer Krankheit nicht nehmen konnte?',
        answer: 'Der gesetzliche Mindesturlaub verfällt bei durchgehender Krankheit erst 15 Monate nach Ende des Urlaubsjahres. Endet das Arbeitsverhältnis vorher, wird er abgegolten. Außerdem verfällt Urlaub grundsätzlich nur, wenn der Arbeitgeber Sie rechtzeitig auf den drohenden Verfall hingewiesen hat.',
      },
    ],
  },

  'dienstjubilaeum-steuerfrei-rechner': {
    sections: [
      {
        title: 'Freigrenze statt Freibetrag: was ein Cent ausmacht',
        content:
          `Monatlicher Gutschein ohne Anlassgeschenk, geprüft mit diesem Rechner:\n\n| Gutscheinwert pro Monat | steuerfrei pro Monat | steuerfrei im Jahr |\n| --- | --- | --- |\n${SB_TABLE}\n\n` +
          `Beim Geschenk zum persönlichen Anlass gilt dasselbe Prinzip: Ein Präsent für 60 € bleibt steuerfrei (Rechnerergebnis: ${SB_GIFT_OK}), bei 65 € zeigt der Rechner „${SB_GIFT_OVER}“, und zwar für den ganzen Betrag, nicht nur für die 5 € darüber.`,
      },
      {
        title: 'Dienstjubiläum: wie Feier, Geschenk und Prämie behandelt werden',
        content:
          '- **Empfang oder Feier zum runden Jubiläum:** Übliche Sachleistungen wie Essen und Getränke bleiben bis 110 € je teilnehmender Person einschließlich Umsatzsteuer steuerfrei (R 19.3 LStR); ein dabei überreichtes Geschenk ist in die 110 € einzurechnen.\n' +
          '- **Sachgeschenk an den Jubilar:** bis 60 € als Aufmerksamkeit, unabhängig vom monatlichen Gutschein.\n' +
          '- **Jubiläumsprämie in Geld:** voll lohnsteuer- und beitragspflichtig. Eine ermäßigte Besteuerung nach der Fünftelregelung berücksichtigt der Arbeitgeber seit 2025 nicht mehr beim Lohnsteuerabzug; sie kann nur noch über die Einkommensteuererklärung geprüft werden.',
      },
    ],
    faqs: [
      {
        question: 'Kann ich einen nicht genutzten 50-Euro-Gutschein in den nächsten Monat übertragen?',
        answer: 'Nein. Die 50 € gelten für jeden Kalendermonat einzeln. Gibt der Arbeitgeber im Dezember 100 € für zwei Monate, ist der ganze Betrag steuerpflichtig, weil die Grenze im Zuflussmonat überschritten ist. Ein Jahresgutschein über 600 € auf einmal ist aus demselben Grund nicht steuerfrei.',
      },
      {
        question: 'Welche Gutscheine fallen unter die 50-Euro-Grenze?',
        answer: 'Nur Gutscheine und Guthabenkarten, die ausschließlich zum Bezug von Waren oder Dienstleistungen berechtigen, etwa bei einem bestimmten Händler, in einer regionalen Einkaufsgemeinschaft oder für einen eng begrenzten Warenkreis wie Kraftstoff (§ 8 Abs. 1 EStG). Zusätzlich muss der Gutschein zum ohnehin geschuldeten Lohn gewährt werden, nicht als Ersatz für Gehalt.',
      },
    ],
  },

  'kurzarbeitergeld-rechner': {
    sections: [
      {
        title: 'Netto bei Kurzarbeit: 50 % Ausfall und Kurzarbeit Null',
        content:
          `Gesamtes Nettoeinkommen aus Restlohn und Kurzarbeitergeld pro Monat:\n\n| Brutto regulär | 50 % Ausfall, 60 % | 50 % Ausfall, 67 % | Kurzarbeit Null, 60 % | Kurzarbeit Null, 67 % |\n| --- | --- | --- | --- | --- |\n${KUG_TABLE}\n\n` +
          '**So lesen Sie das Ergebnis:** Der Rechner setzt das Netto vereinfacht mit 62 % des Bruttos an. Die Agentur für Arbeit rechnet mit pauschalierten Nettoentgelten nach Steuerklasse; in Steuerklasse 3 liegt das Kurzarbeitergeld deshalb höher, in Steuerklasse 5 niedriger. Den genauen Betrag sehen Sie auf Ihrer Lohnabrechnung, denn das Kurzarbeitergeld zahlt der Arbeitgeber mit dem Gehalt aus.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel bekomme ich bei Kurzarbeit Null mit 3.500 € brutto?',
        answer: `Ohne Kinder bleiben nach dieser Schätzung ${txt(KUG_3500_NULL, 'totalIncome')} im Monat, das ist ${txt(KUG_3500_NULL, 'incomeDrop')} weniger als regulär. Mit mindestens einem Kind gilt der Satz von 67 %, dann sind es ${txt(KUG_3500_NULL_KID, 'totalIncome')}.`,
      },
      {
        question: 'Wann darf ein Betrieb Kurzarbeit anmelden?',
        answer: 'Der Arbeitsausfall muss vorübergehend und unvermeidbar sein, und im Kalendermonat muss mindestens ein Drittel der Beschäftigten jeweils mehr als 10 % ihres Bruttoentgelts verlieren (§ 96 SGB III). Vorher sind Arbeitszeitguthaben abzubauen. Einseitig anordnen darf der Arbeitgeber Kurzarbeit nicht; nötig ist ein Tarifvertrag, eine Betriebsvereinbarung oder Ihre Zustimmung.',
      },
      {
        question: 'Darf ich während der Kurzarbeit einen Nebenjob annehmen?',
        answer: 'Ja, aber das Einkommen aus einem Nebenjob, den Sie erst während der Kurzarbeit beginnen, wird auf das Kurzarbeitergeld angerechnet (§ 106 Abs. 3 SGB III). Ein Nebenjob, den Sie schon vor Beginn der Kurzarbeit hatten, bleibt anrechnungsfrei. Melden Sie neue Nebenjobs Ihrem Arbeitgeber, damit die Abrechnung stimmt.',
      },
    ],
  },

  'arbeitslosengeld-1-rechner': {
    sections: [
      {
        title: 'ALG I bei 2.500, 3.500 und 4.500 € brutto',
        content:
          `Monatliches Arbeitslosengeld nach dieser Schätzung:\n\n| Brutto der letzten 12 Monate | Steuerklasse 1, ohne Kind (60 %) | Steuerklasse 1, mit Kind (67 %) | Steuerklasse 3, ohne Kind (60 %) |\n| --- | --- | --- | --- |\n${ALG_TABLE}\n\n` +
          `Berücksichtigt wird höchstens Brutto bis zur Beitragsbemessungsgrenze der Arbeitslosenversicherung (2026: ${eur(BBG_RV_MONTH)} im Monat). Ein Wechsel der Steuerklasse kurz vor der Arbeitslosigkeit zählt nur, wenn die neue Kombination zum Verhältnis der Arbeitslöhne beider Ehepartner passt (§ 153 Abs. 3 SGB III).`,
      },
      {
        title: 'Wie lange Sie ALG I bekommen',
        content:
          'Die Bezugsdauer hängt von den versicherungspflichtigen Monaten in den letzten fünf Jahren und vom Alter ab (§ 147 SGB III):\n\n| Versicherungspflicht mindestens | Alter mindestens | Bezugsdauer |\n| --- | --- | --- |\n| 12 Monate | – | 6 Monate |\n| 16 Monate | – | 8 Monate |\n| 20 Monate | – | 10 Monate |\n| 24 Monate | – | 12 Monate |\n| 30 Monate | 50 Jahre | 15 Monate |\n| 36 Monate | 55 Jahre | 18 Monate |\n| 48 Monate | 58 Jahre | 24 Monate |\n\nDer Rechner zeigt die Höchstdauer für Ihr Alter; wer kürzer versichert war, bekommt entsprechend weniger Monate.',
      },
    ],
    faqs: [
      {
        question: 'Wann muss ich mich arbeitsuchend melden?',
        answer: 'Spätestens drei Monate vor dem Ende des Arbeitsverhältnisses. Erfahren Sie später davon, etwa durch eine Kündigung mit kurzer Frist, haben Sie drei Tage Zeit (§ 38 SGB III). Wer zu spät kommt, bekommt eine Sperrzeit von einer Woche. Die Meldung geht online, telefonisch oder persönlich.',
      },
      {
        question: 'Wie viel darf ich zum Arbeitslosengeld dazuverdienen?',
        answer: 'Sie dürfen weniger als 15 Stunden pro Woche arbeiten. Vom Nebenverdienst bleiben 165 € im Monat anrechnungsfrei (§ 155 SGB III); was darüber liegt, wird nach Abzug von Steuern, Sozialbeiträgen und Werbungskosten vom Arbeitslosengeld abgezogen. Melden Sie jede Nebentätigkeit vorher der Agentur.',
      },
      {
        question: 'Verkürzt eine Sperrzeit die Bezugsdauer?',
        answer: 'Ja. Eine zwölfwöchige Sperrzeit wegen Eigenkündigung oder Aufhebungsvertrag verschiebt nicht nur den Beginn, sie kürzt die Anspruchsdauer auch um mindestens ein Viertel (§ 148 SGB III). Aus 12 Monaten werden so 9 Monate.',
      },
    ],
  },

  'gehaltserhoehung-rechner': {
    sections: [
      {
        title: 'Was von 3, 5 und 8 % netto ankommt',
        content:
          `Monatliches Plus brutto / netto, Steuerklasse 1, keine Kinder, 2026 (Netto mit dem Brutto-Netto-Rechner ermittelt):\n\n| Gehalt heute | +3 % | +5 % | +8 % |\n| --- | --- | --- | --- |\n${GE_TABLE}\n\n` +
          'Je höher das Gehalt, desto kleiner der Netto-Anteil: Jeder zusätzliche Euro wird mit Ihrem Grenzsteuersatz besteuert, und bis zu den Beitragsbemessungsgrenzen fallen auch volle Sozialbeiträge an.',
      },
      {
        title: 'Reale Gehaltserhöhung: Inflation herausrechnen',
        content:
          `Ob Sie sich mit der Erhöhung mehr leisten können, zeigt die reale Steigerung: (1 + Erhöhung) ÷ (1 + Inflationsrate) − 1. Beispiel: 5 % mehr Gehalt bei 2 % Inflation ergeben real ${formatPercent(GE_REAL, 2)}, nicht 3 %. Liegt die Erhöhung unter der Inflationsrate, sinkt Ihre Kaufkraft trotz höherem Brutto. Als Inflationsrate nehmen Sie den Wert für den Zeitraum seit Ihrer letzten Erhöhung, nicht nur den des letzten Monats.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel netto bleibt von 200 € Gehaltserhöhung?',
        answer: `Bei 3.800 € brutto in Steuerklasse 1 ohne Kinder bringen 200 € mehr rund ${eur(GE_200_NET)} netto im Monat (2026). Das sind etwa ${formatPercent((GE_200_NET / 200) * 100, 0)} des Bruttozuwachses. In Steuerklasse 3 bleibt mehr, in Steuerklasse 5 deutlich weniger.`,
      },
      {
        question: 'Habe ich einen Anspruch auf eine Gehaltserhöhung?',
        answer: `Einen allgemeinen gesetzlichen Anspruch gibt es nicht. Ausnahmen: Tarifverträge mit festen Erhöhungen oder Stufenaufstiegen, der Gleichbehandlungsgrundsatz, wenn der Arbeitgeber Erhöhungen nach einer allgemeinen Regel verteilt und Sie ohne sachlichen Grund ausnimmt, und der Mindestlohn, der am 1. Januar 2027 von ${eur(MINDESTLOHN_2026)} auf ${eur(MINDESTLOHN_2027)} steigt.`,
      },
    ],
  },

  stundenlohnrechner: {
    sections: [
      {
        title: 'Mindestlohn 2026 und 2027 als Monatslohn',
        content:
          `Monatsbrutto, das der Mindestlohn von ${eur(MINDESTLOHN_2026)} (2026) und ${eur(MINDESTLOHN_2027)} (ab 1. Januar 2027) bei gleichbleibenden Wochenstunden ergibt:\n\n| Wochenstunden | Monatslohn 2026 | Monatslohn 2027 |\n| --- | --- | --- |\n${SL_MIN_TABLE}\n\n` +
          `Gegenprobe mit dem Rechner: ${eur(SL_FULL_2026)} bei 40 Stunden ergeben genau ${eur(SL_CHECK)} pro Stunde. Liegt Ihr Monatslohn bei Ihrer Stundenzahl darunter, wird der Mindestlohn unterschritten.`,
      },
      {
        title: 'Monatsgehalt in Stundenlohn: 38,5 oder 40 Stunden',
        content:
          `Viele Tarifverträge rechnen mit 38,5 statt 40 Wochenstunden. Bei gleichem Gehalt ist der Stundenlohn dann höher:\n\n| Monatsbrutto | 38,5 Std./Woche | 40 Std./Woche |\n| --- | --- | --- |\n${SL_GROSS_TABLE}\n\nWer wissen möchte, was davon netto übrig bleibt, wählt im Brutto-Netto-Rechner den Abrechnungszeitraum Stundenlohn.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel ist der Mindestlohn im Monat bei Vollzeit?',
        answer: `Bei 40 Wochenstunden sind es 2026 ${eur(SL_FULL_2026)} brutto im Monat (${eur(MINDESTLOHN_2026)} × 40 × 13 ÷ 3). Ab 2027 steigt der Mindestlohn auf ${eur(MINDESTLOHN_2027)}, dann sind es ${eur(SL_FULL_2027)}. Bei 38,5 Stunden liegt der Monatslohn entsprechend niedriger.`,
      },
      {
        question: 'Wie erkenne ich, ob ich wegen unbezahlter Überstunden unter dem Mindestlohn liege?',
        answer: `Rechnen Sie mit den Stunden, die Sie tatsächlich arbeiten, nicht mit den vertraglichen. Beispiel: 2.500 € brutto bei 40 Stunden ergeben ${eur(SL_40)} pro Stunde. Arbeiten Sie regelmäßig 45 Stunden ohne Ausgleich, sinkt der Wert auf ${eur(SL_45)} und liegt ${SL_45 < MINDESTLOHN_2026 ? 'unter' : 'über'} dem Mindestlohn von ${eur(MINDESTLOHN_2026)}. Die fehlende Differenz können Sie nachfordern.`,
      },
      {
        question: 'Für wen gilt der Mindestlohn nicht?',
        answer: 'Ausgenommen sind nach § 22 MiLoG Jugendliche unter 18 ohne abgeschlossene Berufsausbildung, Auszubildende (für sie gilt die Mindestausbildungsvergütung), Pflichtpraktika und freiwillige Orientierungspraktika bis drei Monate, Ehrenamtliche sowie Langzeitarbeitslose in den ersten sechs Monaten einer neuen Beschäftigung.',
      },
    ],
  },

  'nachtzuschlag-sonntagszuschlag-rechner': {
    sections: [
      {
        title: 'Durchgerechnet: Nachtschicht von Samstag 20 Uhr bis Sonntag 6 Uhr',
        content:
          `Grundlohn ${eur(NZ_WAGE)} pro Stunde, 10 Stunden Arbeit. Nach § 3b EStG ist Nachtarbeit die Zeit von 20 bis 6 Uhr; Sonntagsarbeit beginnt um 0 Uhr. Weil die Schicht vor Mitternacht beginnt, steigt der Nachtzuschlag zwischen 0 und 4 Uhr auf 40 %. Sonntags- und Nachtzuschlag werden addiert:\n\n| Zeitraum | Stunden | Zuschlag | steuerfrei |\n| --- | --- | --- | --- |\n${NZ_TABLE}\n| **Summe** | 10 Std. Arbeit | | **${eur(NZ_TOTAL)}** |\n\n` +
          `Dazu kommt der normale Grundlohn von ${eur(NZ_WAGE * 10)}, der wie üblich versteuert wird. Den Rechner oben nutzen Sie für jede Zeile einzeln und zählen die Ergebnisse zusammen.`,
      },
    ],
    faqs: [
      {
        question: 'Welche Feiertage bringen 150 % statt 125 %?',
        answer: 'Steuerfrei bis 150 % sind Zuschläge für Arbeit am 24. Dezember ab 14 Uhr, am 25. und 26. Dezember sowie am 1. Mai. Für den 31. Dezember ab 14 Uhr und alle übrigen gesetzlichen Feiertage, auch Neujahr, gelten 125 %. Maßgeblich sind die Feiertage am Ort der Arbeitsstätte. Fällt ein Feiertag auf einen Sonntag, gilt nur der Feiertagssatz.',
      },
      {
        question: 'Was gilt bei einem Grundlohn über 25 € pro Stunde?',
        answer: `Steuerfrei bleibt der Zuschlag bis zu einem Grundlohn von 50 €, beitragsfrei in der Sozialversicherung aber nur bis 25 €. Beispiel Nachtarbeit mit 30 € Grundlohn: ${eur(NZ_30)} pro Stunde sind steuerfrei, sozialversicherungsfrei nur ${eur(NZ_30_SVFREE)}. Auf die Differenz von ${eur(NZ_30_SVLIABLE)} fallen Sozialbeiträge an; der Rechner weist diesen Teil getrennt aus.`,
      },
      {
        question: 'Sind Zuschläge auch im Urlaub oder bei Krankheit steuerfrei?',
        answer: 'Nein. Steuerfrei sind nur Zuschläge für tatsächlich geleistete Arbeit. Zahlt der Arbeitgeber die üblichen Zuschläge im Urlaub oder während der Lohnfortzahlung bei Krankheit weiter, sind sie voll steuer- und beitragspflichtig.',
      },
    ],
  },

  'dienstaufwandsentschaedigung-rechner': {
    sections: [
      {
        title: 'Aufwandsentschädigung über dem Freibetrag: drei Beispiele',
        content:
          `Jahresvergütung und was davon steuerfrei bleibt:\n\n| Vergütung im Jahr | Übungsleiter steuerfrei | Übungsleiter Überhang | Ehrenamt steuerfrei | Ehrenamt Überhang |\n| --- | --- | --- | --- | --- |\n${EA_TABLE}\n\n` +
          `**Kombination mit einem Minijob:** Steuerfreie Einnahmen nach § 3 Nr. 26 und 26a EStG gelten nicht als Arbeitsentgelt (§ 14 Abs. 1 SGB IV). Ein Trainer kann deshalb monatlich ${eur(EA_TRAINER_MONTH)} aus der Übungsleiterpauschale und zusätzlich bis zu ${eur0(MINIJOB_GRENZE_2026)} als Minijob erhalten, zusammen ${eur(EA_TRAINER_MONTH + MINIJOB_GRENZE_2026)}, ohne dass für ihn Steuern oder eigene Sozialbeiträge anfallen (bei Befreiung von der Rentenversicherungspflicht im Minijob).`,
      },
      {
        title: 'Wer die Pauschalen nutzen darf',
        content:
          '- **Nebenberuflich:** Die Tätigkeit darf nicht mehr als ein Drittel der Arbeitszeit einer vergleichbaren Vollzeitstelle ausmachen. Auch Rentner, Studierende oder Hausfrauen und -männer ohne Hauptberuf können nebenberuflich tätig sein.\n' +
          '- **Richtiger Auftraggeber:** ein gemeinnütziger Verein, eine Kirche oder eine öffentliche Einrichtung wie Gemeinde oder Volkshochschule. Für ein gewerbliches Fitnessstudio gilt die Pauschale nicht.\n' +
          '- **Übungsleiter oder Ehrenamt?** Die Übungsleiterpauschale setzt eine pädagogische, betreuende, pflegende oder künstlerische Tätigkeit voraus. Kassenwart, Platzwart oder Schriftführer fallen unter die Ehrenamtspauschale.\n' +
          '- **Vorstand:** Vorstandsmitglieder arbeiten nach § 27 Abs. 3 BGB unentgeltlich, wenn die Satzung keine Vergütung erlaubt. Ohne Satzungsregel darf der Verein auch die Ehrenamtspauschale nicht zahlen.',
      },
    ],
    faqs: [
      {
        question: 'Gilt der Freibetrag pro Verein oder pro Person?',
        answer: `Pro Person und Kalenderjahr. Wer in zwei Vereinen als Trainer tätig ist, hat insgesamt nur einmal ${eur0(EA_TRAINER_MAX)} steuerfrei, für Ehrenämter insgesamt ${eur0(EA_VOLUNTEER_MAX)}. Vereine lassen sich deshalb meist schriftlich bestätigen, dass der Freibetrag nicht schon anderswo genutzt wird. Teilen Sie den Betrag im Zweifel selbst auf die Vereine auf.`,
      },
      {
        question: 'Muss der Verein die Pauschale gleichmäßig über das Jahr verteilen?',
        answer: `Nein. Der Verein kann den Freibetrag monatlich anteilig ansetzen, etwa ${eur(EA_TRAINER_MONTH)} für eine Übungsleitertätigkeit, oder zuerst voll ausschöpfen und erst danach den Überhang abrechnen. Endet die Tätigkeit im Laufe des Jahres, steht trotzdem der volle Jahresbetrag zur Verfügung.`,
      },
    ],
  },
};
