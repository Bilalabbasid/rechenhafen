import { PageContentMap } from './types';
import { CalculationResult } from '@/types/calculator';
import {
  calculateBruttoNetto,
  calculateNettoBrutto,
  calculateGrenzsteuersatz,
  calculateArbeitgeberkosten,
  calculateMinijob,
  calculateMidijob,
  calculateBonusNetto,
  computeUebergangsbereich,
} from '@/lib/calculators/steuernGehalt';
import { calculateSpecialRepayment } from '@/lib/calculators/kredit';
import { calculatePfaendung, PFAENDUNGSFREIGRENZEN } from '@/lib/calculators/steuerRecht';
import { calculateInflation, calculateReturn } from '@/lib/calculators/finanzen';
import { getTaxConfig } from '@/data/regulated/tax';
import { LEGAL_VALUES_2026 } from '@/legal/de';
import { EXTRA_FINANZEN_KREDIT } from '../extra/finanzenKredit';
import { FINANZEN_CALCULATORS } from '../finanzen';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';

// Alle Zahlen auf diesen Seiten werden beim Laden mit denselben Funktionen berechnet wie die Rechner selbst.
const CFG = getTaxConfig('2026');
const eur = (v: number) => formatCurrency(v);
const eur0 = (v: number) => `${formatNumber(Math.round(v), 0)} €`;
const pct = (v: number, digits = 2) => formatPercent(v, digits);
const num = (v: number, digits = 0) => formatNumber(v, digits);
const sec = (r: CalculationResult, id: string): number => Number(r.secondary?.find((x) => x.id === id)?.value ?? 0);
const prim = (r: CalculationResult): number => Number(r.primary.value);
const row = (cells: Array<string | number>) => `| ${cells.join(' | ')} |`;
const table = (head: string[], rows: Array<Array<string | number>>) =>
  [row(head), row(head.map(() => '---')), ...rows.map(row)].join('\n');

const inline = (slug: string) => {
  const calc = [...EXTRA_FINANZEN_KREDIT, ...FINANZEN_CALCULATORS].find((c) => c.slug === slug);
  if (!calc) throw new Error(`page-content/geld: Rechner ${slug} fehlt`);
  return (inputs: Record<string, any>) => calc.calculate(inputs) as CalculationResult;
};

// Gemeinsame Annahmen für Gehaltswerte: Steuerklasse I, kinderlos ab 23, gesetzlich versichert, Ø-Zusatzbeitrag, keine Kirchensteuer.
const BN_BASE = {
  taxYear: '2026',
  taxClass: '1',
  children: '0',
  age: 30,
  federalState: 'other',
  churchTax: 'no',
  healthInsuranceType: 'statutory',
  kvZusatzbeitrag: CFG.zusatzbeitragKrankenversicherungDurchschnitt * 100,
};
const bnMonth = (gross: number, extra: Record<string, any> = {}) => calculateBruttoNetto({ ...BN_BASE, ...extra, grossSalary: gross, period: 'month' });

// ---------- Midijob ----------
const SV_FULL_RATE = CFG.beitragssatzRentenversicherung + CFG.beitragssatzArbeitslosenversicherung
  + CFG.beitragssatzKrankenversicherungAllgemein + CFG.zusatzbeitragKrankenversicherungDurchschnitt
  + CFG.beitragssatzPflegeversicherung;
const MIDI_ROWS = [700, 1000, 1300, 1600, 1900].map((g) => {
  const ub = computeUebergangsbereich(g, CFG);
  const full = g * (SV_FULL_RATE / 2);
  return { g, ub, full };
});
const MIDI_1000 = MIDI_ROWS.find((r) => r.g === 1000)!;
const MINI_603_NET = prim(calculateMinijob({ earnings: CFG.minijobGrenze, rvOptOut: 'yes', taxYear: '2026' }));
const MIDI_700_NET = prim(calculateMidijob({ earnings: 700, taxYear: '2026', children: '0' }));

// ---------- Bonus ----------
const BONUS_SALARIES = [35000, 50000, 75000];
const BONUS_AMOUNTS = [1000, 2500, 5000];
const bonusNet = (salary: number, bonus: number) => prim(calculateBonusNetto({ regularGrossYear: salary, bonus, taxClass: '1', churchTax: 'no', taxYear: '2026' }));
const BONUS_5000_50K = bonusNet(50000, 5000);
const BONUS_5000_75K = bonusNet(75000, 5000);
const BAV_TAXFREE = CFG.bbgRentenversicherungJahr * 0.08;
const BAV_SVFREE = CFG.bbgRentenversicherungJahr * 0.04;

// ---------- Netto-Brutto ----------
const nb = (net: number, taxClass: string) => prim(calculateNettoBrutto({ desiredNet: net, period: 'month', taxClass, taxYear: '2026' }));
const NB_ROWS = [2000, 2500, 3000, 3500, 4000].map((n) => ({ n, i: nb(n, '1'), iii: nb(n, '3') }));
const NB = (n: number) => NB_ROWS.find((r) => r.n === n)!;

// ---------- Grenzsteuersatz ----------
const gs = (zve: number, tariffType: string) => calculateGrenzsteuersatz({ taxableIncome: zve, taxYear: '2026', tariffType });
const GS_ROWS = [20000, 30000, 50000, 70000, 100000, 300000].map((z) => ({ z, g: gs(z, 'single'), s: gs(z, 'splitting') }));
const WK_SAVING_50K = sec(gs(49000, 'single'), 'taxOn1000');

// ---------- Arbeitgeberkosten ----------
const AG_ROWS = [2500, 3500, 5000, 6000, 8000].map((g) => ({ g, r: calculateArbeitgeberkosten({ monthlyGross: g, taxYear: '2026' }) }));
const AG_50K = calculateArbeitgeberkosten({ monthlyGross: 50000 / 12, taxYear: '2026' });
const AG_MINI = calculateMinijob({ earnings: CFG.minijobGrenze, rvOptOut: 'yes', taxYear: '2026' });
const AG_MIDI_SIMPLE = prim(calculateArbeitgeberkosten({ monthlyGross: 1200, taxYear: '2026' }));
const AG_MIDI_REAL = sec(bnMonth(1200), 'employerTotal');

// ---------- Effektivzins ----------
const effCalc = inline('effektivzins-kredit-rechner');
const effFromNominal = (nominal: number) => prim(effCalc({ loanAmount: 10000, nominalRate: nominal, disagioPct: 0, months: 12 }));
const EFF_TERMS = [24, 48, 72, 84].map((m) => {
  const r = effCalc({ loanAmount: 10000, nominalRate: 6, disagioPct: 0, months: m });
  const rate = sec(r, 'rate');
  return { m, rate, total: rate * m };
});

// ---------- Forward-Darlehen ----------
const fwdCalc = inline('forward-darlehen-rechner');
const fwd = (m: number) => fwdCalc({ loanAmount: 200000, currentRate: 3.5, forwardMonths: m, monthlyMarkup: 0.02 });
const FWD_BASE_RATE = sec(fwd(0), 'monthlyRate');
const FWD_ROWS = [12, 24, 36, 48, 60].map((m) => {
  const r = fwd(m);
  return { m, zins: prim(r), markup: sec(r, 'markup'), rate: sec(r, 'monthlyRate') };
});
const FWD_36 = FWD_ROWS.find((r) => r.m === 36)!;

// ---------- Dispo ----------
const dispoCalc = inline('dispozins-rechner');
const dispo = (amount: number, days: number, rate = 12) => prim(dispoCalc({ overdraftAmount: amount, dispoRate: rate, days }));

// ---------- Sondertilgung ----------
const SONDER_ROWS = [0, 2500, 5000, 10000, 12500].map((sp) => {
  const r = calculateSpecialRepayment({ loanAmount: 250000, annualInterest: 3.8, monthlyPayment: 1200, yearlySpecialRepayment: sp });
  return { sp, saved: prim(r), months: sec(r, 'newDuration'), timeSaved: sec(r, 'timeSaved') };
});
const SONDER_BASE_MONTHS = sec(calculateSpecialRepayment({ loanAmount: 250000, annualInterest: 3.8, monthlyPayment: 1200, yearlySpecialRepayment: 0 }), 'oldDuration');
const CAPITAL_TAX = LEGAL_VALUES_2026.kapitalertragsteuerSatz.value * (1 + CFG.solzRate);
const SONDER_BREAKEVEN = 3.8 / (1 - CAPITAL_TAX);

// ---------- Zwischenfinanzierung ----------
const zwCalc = inline('zwischenfinanzierung-rechner');
const zwMonthly = (loan: number, rate: number) => sec(zwCalc({ loan, rate, months: 12 }), 'monthly');
const ZW_NEW_PRICE = 450000;
const ZW_NEW_COSTS = 40000;
const ZW_EQUITY = 60000;
const ZW_LONG_LOAN = 250000;
const ZW_GAP = ZW_NEW_PRICE + ZW_NEW_COSTS - ZW_EQUITY - ZW_LONG_LOAN;
const ZW_OLD_PRICE = 320000;
const ZW_OLD_DEBT = 90000;
const ZW_OLD_NET = ZW_OLD_PRICE - ZW_OLD_DEBT;
const ZW_GAP_6 = prim(zwCalc({ loan: ZW_GAP, rate: 5, months: 6 }));
const ZW_GAP_12 = prim(zwCalc({ loan: ZW_GAP, rate: 5, months: 12 }));

// ---------- Inflation ----------
const infl = (rate: number, years: number) => calculateInflation({ amount: 1000, inflationRate: rate, years });
const INFL_ROWS = [10, 20, 30].map((y) => ({ y, i2: infl(2, y), i3: infl(3, y), i5: infl(5, y) }));
const REAL_RAISE = (1.03 / 1.02 - 1) * 100;

// ---------- Tagesgeld ----------
const tgCalc = inline('tagesgeld-rechner');
const tg = (deposit: number, rate: number, months: number, payout: string) => prim(tgCalc({ deposit, rate, months, payout }));
const TG_ROWS = [
  { label: 'monatlich', key: 'monthly' },
  { label: 'vierteljährlich', key: 'quarterly' },
  { label: 'jährlich', key: 'annually' },
].map((p) => ({ ...p, y1: tg(10000, 3, 12, p.key), y5: tg(10000, 3, 60, p.key) }));
const TG_EXTRA_RATE_5Y = tg(10000, 3.1, 60, 'annually') - tg(10000, 3, 60, 'annually');
const TG_INTERVAL_GAP_5Y = TG_ROWS[0].y5 - TG_ROWS[2].y5;
const PAUSCH_SINGLE = LEGAL_VALUES_2026.sparerPauschbetragSingle.value;
const PAUSCH_MARRIED = LEGAL_VALUES_2026.sparerPauschbetragMarried.value;
// Anlagebetrag, dessen Jahreszinsen genau den Pauschbetrag ausschöpfen (Zinsertrag pro 1 € aus dem Rechner)
const tgTaxFreeDeposit = (rate: number, allowance: number) => allowance / tg(1, rate, 12, 'annually');
const TG_6M = tg(20000, 2.5, 6, 'monthly');

// ---------- Festgeld ----------
const fgCalc = inline('festgeld-rechner');
const fgInterest = (years: number) => prim(fgCalc({ principal: 10000, interestRate: 3, years }));
const FG_YEAR = fgInterest(1);
const FG_ROWS = [1, 2, 3, 5].map((y) => ({ y, compound: fgInterest(y), payout: FG_YEAR * y }));
const FG_5 = FG_ROWS.find((r) => r.y === 5)!;
const FG_TAX_5 = Math.max(0, FG_5.compound - PAUSCH_SINGLE) * CAPITAL_TAX;

// ---------- ETF ----------
const etfCalc = inline('etf-sparplan-rechner');
const etf = (monthly: number, years: number, ter: number) =>
  etfCalc({ monthlyContribution: monthly, initialAmount: 0, annualRate: 6, terPercent: ter, years });
const ETF_ROWS = [10, 20, 30, 40].map((y) => {
  const low = etf(100, y, 0.2);
  const high = etf(100, y, 1.5);
  return { y, paid: sec(low, 'totalDeposits'), low: prim(low), high: prim(high) };
});
const ETF_EARLY = prim(etf(100, 40, 0.2));
const ETF_LATE = prim(etf(200, 20, 0.2));

// ---------- Rendite ----------
const DOUBLE_ROWS = [5, 10, 15, 20].map((y) => ({ y, cagr: prim(calculateReturn({ initialInvestment: 10000, finalValue: 20000, years: y })) }));
const LOSS_ROWS = [10, 20, 30, 50].map((loss) => ({
  loss,
  need: sec(calculateReturn({ initialInvestment: 100 - loss, finalValue: 100, years: 1 }), 'totalReturn'),
}));
const HALF_YEAR_CAGR = prim(calculateReturn({ initialInvestment: 10000, finalValue: 11000, years: 0.5 }));

// ---------- Sparrechner ----------
const sparCalc = inline('sparrechner');
// Die Seite hat bereits vier eigene Abschnitte (redaktionelle Obergrenze), deshalb nur eine FAQ.
const sparRate = (target: number, years: number) =>
  prim(sparCalc({ mode: 'sparrate', targetAmount: target, initialAmount: 0, annualRate: 3, years, depositTiming: 'end', netIncome: 0 }));
const SPAR_TARGET_TEXT = [10000, 25000, 100000]
  .map((t) => `${eur0(t)} in 10 Jahren ${eur(sparRate(t, 10))}, in 20 Jahren ${eur(sparRate(t, 20))}`)
  .join('; ');

// ---------- Kapitalertragsteuer ----------
const kapCalc = inline('kapitalertragsteuer-rechner');
const kap = (gain: number, status: string, church = 'none') => kapCalc({ capitalIncome: gain, maritalStatus: status, usedAllowance: 0, churchState: church });
const KAP_ROWS = [1500, 3000, 5000, 10000, 25000].map((g) => {
  const s = kap(g, 'single');
  const m = kap(g, 'married');
  return [eur0(g), eur(prim(s)), eur(sec(s, 'net')), eur(prim(m)), eur(sec(m, 'net'))];
});
const KAP_ETF_GAIN = 4000;
const KAP_ETF_TAXABLE = KAP_ETF_GAIN * 0.7; // Aktienfonds: 30 % Teilfreistellung (§ 20 Abs. 1 InvStG)
const KAP_ETF_WITH = prim(kap(KAP_ETF_TAXABLE, 'single'));
const KAP_ETF_WITHOUT = prim(kap(KAP_ETF_GAIN, 'single'));

// ---------- Maximaler Kredit ----------
const maxKreditCalc = inline('maximaler-kredit-rechner');
const maxKredit = (rate: number, years: number, interestRate = 4.5) =>
  prim(maxKreditCalc({ netIncome: rate, fixedExpenses: 0, existingLoans: 0, safetyBuffer: 0, interestRate, termYears: years, equity: 0 }));
const MAX_RATES = [300, 500, 800, 1200];
const MAX_YEARS = [3, 5, 8, 10];
const MAX_ROWS = MAX_RATES.map((r) => [eur0(r), ...MAX_YEARS.map((y) => eur0(maxKredit(r, y)))]);
const MAX_1000_45 = maxKredit(1000, 5, 4.5);
const MAX_1000_55 = maxKredit(1000, 5, 5.5);
const MAX_1000_45_8 = maxKredit(1000, 8, 4.5);
const MAX_1000_55_8 = maxKredit(1000, 8, 5.5);

// ---------- Pfändung ----------
const PF = PFAENDUNGSFREIGRENZEN['2026'];
const pfaend = (net: number, dependents: number) => prim(calculatePfaendung({ netIncome: net, dependents, period: '2026' }));
const PF_NETS = [1600, 1800, 2000, 2200, 2500, 3000, 3500, 4000, 5000];
const PF_DEPS = [0, 1, 2, 3];
const PF_ROWS = PF_NETS.map((n) => [eur0(n), ...PF_DEPS.map((d) => eur(pfaend(n, d)))]);
// § 850a Nr. 4 ZPO: Weihnachtsvergütung unpfändbar bis zur Hälfte des auf volle 10 € aufgerundeten monatlichen Freibetrags
const PF_XMAS_FREE = (Math.ceil(PF.grundbetrag / 10) * 10) / 2;
const PF_OVERTIME_EXAMPLE = 400;
// tilgungsrechner und ratenkreditrechner: kein Overlay, beide Seiten sind bei der redaktionellen Obergrenze
// (4 Abschnitte, 6 FAQs, geprüft in merge-kredit-sparen.test.ts).

export const GELD_PAGE_CONTENT: PageContentMap = {
  'midijob-rechner': {
    sections: [
      {
        title: 'Beitragsersparnis im Midijob 2026 in Zahlen',
        content: [
          `Die Tabelle zeigt, auf welchen Betrag Sie im Übergangsbereich Ihren Arbeitnehmeranteil zahlen und was Sie gegenüber dem vollen Anteil von ${pct((SV_FULL_RATE / 2) * 100)} sparen. Gerechnet ist mit gesetzlicher Krankenversicherung, durchschnittlichem Zusatzbeitrag und ohne Kinderlosenzuschlag zur Pflegeversicherung.`,
          table(
            ['Brutto/Monat', 'Beitragspflichtige Einnahme (AN)', 'Ihr SV-Anteil', 'Voller Anteil', 'Ersparnis'],
            MIDI_ROWS.map(({ g, ub, full }) => [eur(g), eur(ub.beArbeitnehmer), eur(ub.anBeitrag), eur(full), eur(full - ub.anBeitrag)]),
          ),
          `Die Entlastung schrumpft gleichmäßig, je näher Sie an 2.000 € kommen, und ist dort null. Einen Teil bezahlt der Arbeitgeber: Bei 1.000 € Brutto trägt er ${eur(MIDI_1000.ub.agBeitrag)} statt ${eur(MIDI_1000.full)} wie bei einer regulären Beschäftigung. Lohnsteuer wird dagegen ganz normal vom vollen Brutto berechnet, der Übergangsbereich gilt nur für die Sozialversicherung.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: `Lohnt es sich, vom ${eur0(CFG.minijobGrenze)}-Minijob auf 700 € aufzustocken?`,
        answer: `Im Minijob mit Befreiung von der Rentenversicherung bekommen Sie ${eur(MINI_603_NET)} ausgezahlt. Bei 700 € im Übergangsbereich bleiben in Steuerklasse I (kinderlos, ab 23 Jahren) ${eur(MIDI_700_NET)} netto. Von ${eur(700 - CFG.minijobGrenze)} mehr Brutto kommen also ${eur(MIDI_700_NET - MINI_603_NET)} bei Ihnen an. Dafür sind Sie selbst kranken-, pflege- und arbeitslosenversichert und sammeln Rentenansprüche auf das volle Entgelt.`,
      },
      {
        question: 'Ich habe zwei Jobs mit je 800 €. Gilt dann der Übergangsbereich?',
        answer: 'Ja. Nach § 20 Abs. 2 SGB IV zählt bei mehreren Beschäftigungen das insgesamt erzielte Arbeitsentgelt. Zusammen 1.600 € liegen im Übergangsbereich, die ermäßigten Beiträge werden aus der Summe berechnet und auf beide Arbeitgeber aufgeteilt. Kommen Sie zusammen über 2.000 €, entfällt die Ermäßigung für beide Jobs.',
      },
      {
        question: 'Gilt der Übergangsbereich auch für Auszubildende?',
        answer: 'Nein. Für Personen, die zu ihrer Berufsausbildung beschäftigt sind, gilt die ermäßigte Beitragsberechnung nach § 20 Abs. 2a SGB IV nicht. Azubis zahlen ihren Anteil auf die volle Ausbildungsvergütung. Liegt diese bei höchstens 325 € im Monat, trägt der Ausbildungsbetrieb den Beitrag allein (§ 20 Abs. 3 SGB IV).',
      },
    ],
  },

  'bonus-netto-rechner': {
    sections: [
      {
        title: 'So viel bleibt vom Bonus: Tabelle 2026',
        content: [
          'Berechnet als Unterschied zwischen dem Jahresnetto mit und ohne Einmalzahlung, nach denselben Regeln wie im Brutto-Netto-Rechner: Lohnsteuer, Solidaritätszuschlag und alle vier Sozialversicherungen. Annahmen: Steuerklasse I, kinderlos, gesetzlich versichert mit durchschnittlichem Zusatzbeitrag, keine Kirchensteuer.',
          table(
            ['Bonus brutto', ...BONUS_SALARIES.map((s) => `Netto bei ${eur0(s)} Jahresgehalt`)],
            BONUS_AMOUNTS.map((b) => [eur(b), ...BONUS_SALARIES.map((s) => eur(bonusNet(s, b)))]),
          ),
          `Bei ${eur0(75000)} Jahresgehalt bleibt von 5.000 € Bonus ${eur(BONUS_5000_75K)}, bei ${eur0(50000)} sind es ${eur(BONUS_5000_50K)}. Der höhere Steuersatz wird teilweise dadurch ausgeglichen, dass das reguläre Gehalt schon über der Beitragsbemessungsgrenze der Kranken- und Pflegeversicherung (${eur0(CFG.bbgKrankenversicherungJahr)} im Jahr 2026) liegt. Auf den Bonus fallen dann nur noch Renten- und Arbeitslosenbeiträge an.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Lohnt es sich, den Bonus erst im Januar auszahlen zu lassen?',
        answer: 'Nur wenn Ihr Einkommen im nächsten Jahr deutlich niedriger ist, etwa wegen Elternzeit, eines Sabbaticals oder des Rentenbeginns. Ein sonstiger Bezug gehört steuerlich in das Kalenderjahr, in dem er zufließt (§ 38a Abs. 1 EStG), und wird mit dem Jahresarbeitslohn dieses Jahres versteuert. Bei gleichbleibendem Gehalt ist der Abzug in beiden Jahren praktisch gleich hoch.',
      },
      {
        question: 'Kann ich den Bonus steuerfrei in eine Betriebsrente umwandeln?',
        answer: `Ja, über eine Entgeltumwandlung, auf die Sie nach § 1a BetrAVG einen Anspruch haben. Beiträge an Direktversicherung, Pensionskasse oder Pensionsfonds sind 2026 bis 8 % der Beitragsbemessungsgrenze der Rentenversicherung steuerfrei, das sind ${eur0(BAV_TAXFREE)} im Jahr (§ 3 Nr. 63 EStG). Sozialversicherungsfrei bleiben davon 4 %, also ${eur0(BAV_SVFREE)}. Die Vereinbarung muss vor der Auszahlung stehen, und die späteren Rentenzahlungen sind steuerpflichtig.`,
      },
    ],
  },

  'netto-brutto-rechner': {
    sections: [
      {
        title: 'Wunschnetto und nötiges Brutto 2026',
        content: [
          'Die Werte stammen aus diesem Rechner mit seinen Standardannahmen: kinderlos, keine Kirchensteuer, gesetzlich versichert mit durchschnittlichem Zusatzbeitrag.',
          table(
            ['Wunschnetto/Monat', 'Brutto Steuerklasse I', 'Brutto Steuerklasse III', 'Brutto je Netto-Euro (I)'],
            NB_ROWS.map(({ n, i, iii }) => [eur(n), eur(i), eur(iii), num(i / n, 2)]),
          ),
          `Jeder weitere Netto-Euro wird teurer: Von 2.000 auf 2.500 € netto brauchen Sie in Steuerklasse I ${eur(NB(2500).i - NB(2000).i)} mehr Brutto, von 3.500 auf 4.000 € netto schon ${eur(NB(4000).i - NB(3500).i)}.`,
        ].join('\n\n'),
      },
      {
        title: 'Mit dem Ergebnis in die Gehaltsverhandlung',
        content: [
          '- **Ziel festlegen:** Leiten Sie das Wunschnetto aus Ihren festen Ausgaben und Ihrer Sparrate ab, nicht aus dem aktuellen Gehalt plus Pauschalaufschlag.',
          '- **Annahmen prüfen:** Zahlen Sie Kirchensteuer, haben Sie Kinder oder eine Kasse mit höherem Zusatzbeitrag, prüfen Sie das ermittelte Brutto im [Brutto-Netto-Rechner](/rechner/brutto-netto-rechner/) nach.',
          '- **Jahresbrutto nennen:** Arbeitgeber denken in Jahresgehältern. Bei 13 Gehältern teilen Sie das Jahresbrutto durch 13, um das Monatsgehalt im Vertrag zu kontrollieren.',
          '- **Steuerklasse III nicht als Maßstab nehmen:** Bei der Kombination III/V ist eine Steuererklärung Pflicht, und Nachzahlungen sind möglich. Verhandeln Sie lieber auf Basis von Steuerklasse I oder IV.',
        ].join('\n'),
      },
    ],
    faqs: [
      {
        question: 'Wie viel Brutto brauche ich für 3.000 € netto?',
        answer: `2026 sind es in Steuerklasse I rund ${eur(NB(3000).i)} brutto im Monat, in Steuerklasse III rund ${eur(NB(3000).iii)} (kinderlos, ohne Kirchensteuer, gesetzlich versichert). Aufs Jahr gerechnet entspricht das in Steuerklasse I etwa ${eur0(NB(3000).i * 12)}.`,
      },
      {
        question: 'Warum trifft das berechnete Brutto mein Wunschnetto nicht auf den Cent?',
        answer: 'Der Rechner nähert sich dem Brutto schrittweise an und hört auf, sobald das Netto weniger als 2 Cent vom Ziel abweicht. Zusätzlich rundet die echte Lohnabrechnung jeden Abzug einzeln auf Cent. Abweichungen von wenigen Cent sind deshalb normal und für eine Verhandlung ohne Bedeutung.',
      },
    ],
  },

  'grenzsteuersatz-rechner': {
    sections: [
      {
        title: 'Grenz- und Durchschnittssteuersatz 2026 nach Einkommen',
        content: [
          'Einkommensteuer nach § 32a EStG ohne Solidaritätszuschlag und Kirchensteuer. Beim Splittingtarif ist das gemeinsame zu versteuernde Einkommen beider Ehepartner gemeint.',
          table(
            ['zvE', 'Grenzsatz Grundtarif', 'Ø-Satz Grundtarif', 'Grenzsatz Splitting', 'Ø-Satz Splitting'],
            GS_ROWS.map(({ z, g, s }) => [eur0(z), pct(prim(g)), pct(sec(g, 'avgRate')), pct(prim(s)), pct(sec(s, 'avgRate'))]),
          ),
          `**Praktischer Nutzen:** Abzüge wirken mit dem Grenzsteuersatz. Wer bei ${eur0(50000)} zvE im Grundtarif 1.000 € zusätzliche Werbungskosten nachweist, zahlt ${eur(WK_SAVING_50K)} weniger Einkommensteuer. Mit dem Durchschnittssteuersatz würden Sie die Ersparnis deutlich unterschätzen.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Warum ist der Grenzsteuersatz beim Splittingtarif so viel niedriger?',
        answer: `Beim Splitting wird das gemeinsame Einkommen halbiert, besteuert und die Steuer verdoppelt. Verdient ein Partner allein ${eur0(70000)}, liegt der Grenzsteuersatz zusammenveranlagt bei ${pct(prim(GS_ROWS[3].s))} statt ${pct(prim(GS_ROWS[3].g))} im Grundtarif. Verdienen beide gleich viel, bringt das Splitting dagegen keinen Vorteil, weil jede Hälfte ohnehin so besteuert würde.`,
      },
      {
        question: 'Ab welchem Einkommen gilt der Spitzensteuersatz?',
        answer: `Der Grenzsteuersatz von 42 % gilt 2026 für jeden Euro zvE über ${eur0(LEGAL_VALUES_2026.zone3Limit.value)} (Grundtarif), bei Zusammenveranlagung über dem Doppelten. 45 % fallen erst über ${eur0(LEGAL_VALUES_2026.zone4Limit.value)} an. Der Durchschnittssatz bleibt weit darunter: Bei ${eur0(70000)} zvE beträgt er ${pct(sec(GS_ROWS[3].g, 'avgRate'))}.`,
      },
    ],
  },

  'arbeitgeberkosten-rechner': {
    sections: [
      {
        title: 'Lohnnebenkosten-Aufschlag nach Gehaltshöhe 2026',
        content: [
          table(
            ['Brutto/Monat', 'AG-Sozialversicherung', 'Umlagen und BG', 'Gesamtkosten', 'Aufschlag'],
            AG_ROWS.map(({ g, r }) => [eur(g), eur(sec(r, 'svTotal')), eur(sec(r, 'umlagen')), eur(prim(r)), pct(sec(r, 'costFactor'))]),
          ),
          `Bis ${eur(CFG.bbgKrankenversicherungMonat)} Monatsbrutto bleibt der prozentuale Aufschlag gleich. Darüber zahlt der Arbeitgeber keine weiteren Kranken- und Pflegebeiträge, ab ${eur(CFG.bbgRentenversicherungMonat)} auch keine Renten- und Arbeitslosenbeiträge und keine höheren Umlagen U1, U2 und Insolvenzgeld mehr. Deshalb sinkt der Aufschlag bei hohen Gehältern. Für die Kalkulation eines Stundensatzes oder Angebots sollten Sie zusätzlich Urlaub, Feiertage, Krankheitstage, Arbeitsplatz und Weiterbildung einplanen, die hier nicht enthalten sind.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Mitarbeiter mit 50.000 € Jahresgehalt?',
        answer: `Nach diesem Rechner rund ${eur(sec(AG_50K, 'annualCosts'))} im Jahr, also ${eur(prim(AG_50K))} im Monat. Darin stecken ${eur(sec(AG_50K, 'svTotal') * 12)} Arbeitgeberanteile zur Sozialversicherung und ${eur(sec(AG_50K, 'umlagen') * 12)} Umlagen und Unfallversicherung. Die tatsächlichen Sätze für U1, U2 und die Berufsgenossenschaft hängen von Krankenkasse und Branche ab.`,
      },
      {
        question: 'Gilt der Rechner auch für Minijobs und Midijobs?',
        answer: `Nein, dafür gelten eigene Regeln. Für einen Minijob mit ${eur0(CFG.minijobGrenze)} zahlt der Arbeitgeber pauschal ${eur(sec(AG_MINI, 'agLumpSum'))} Abgaben, insgesamt ${eur(sec(AG_MINI, 'agTotalCosts'))}. Im Übergangsbereich bis 2.000 € trägt er mehr als die Hälfte der Beiträge: Bei 1.200 € Brutto kostet die Stelle rund ${eur(AG_MIDI_REAL)} und damit mehr als die ${eur(AG_MIDI_SIMPLE)}, die sich mit den regulären Sätzen ergäben. Den genauen Wert zeigt der [Brutto-Netto-Rechner](/rechner/brutto-netto-rechner/) mit Arbeitgeberanteil.`,
      },
    ],
  },

  'effektivzins-kredit-rechner': {
    sections: [
      {
        title: 'Sollzins in Effektivzins umrechnen',
        content: [
          'Bei monatlichen Raten werden die Zinsen zwölfmal im Jahr verrechnet. Der effektive Jahreszins nach § 16 PAngV rechnet das auf ein Jahr hoch und liegt deshalb auch ohne Gebühren über dem Sollzins: Effektivzins = (1 + Sollzins ÷ 12)^12 − 1.',
          table(
            ['Sollzins p. a.', 'Effektivzins ohne Gebühren'],
            [3, 5, 7, 9, 12].map((s) => [pct(s), pct(effFromNominal(s))]),
          ),
          'Ist der Abstand im Angebot deutlich größer, stecken weitere Kosten darin, die der Kreditgeber einrechnen muss, zum Beispiel Vermittlungskosten (§ 16 Abs. 3 PAngV).',
        ].join('\n\n'),
      },
      {
        title: 'Gleicher Zins, andere Laufzeit',
        content: [
          'Beispiel: 10.000 € zu 6 % Sollzins (Beispielzins, kein Marktzins). Eine längere Laufzeit senkt die Rate, erhöht aber die Zinsen insgesamt.',
          table(
            ['Laufzeit', 'Monatsrate', 'Summe aller Raten', 'Zinsen gesamt'],
            EFF_TERMS.map(({ m, rate, total }) => [`${m} Monate`, eur(rate), eur(total), eur(total - 10000)]),
          ),
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Was bedeutet der Effektivzins in der Kreditwerbung?',
        answer: 'Wirbt eine Bank mit einem Zinssatz, muss sie ein Beispiel angeben. Den Effektivzins für dieses Beispiel muss sie so wählen, dass sie erwartet, mindestens zwei Drittel der Verträge zu diesem oder einem niedrigeren Zins abzuschließen (§ 17 Abs. 4 PAngV). Bis zu einem Drittel der Kunden kann also mehr zahlen. Verbindlich ist erst der Zins in Ihrem persönlichen Angebot.',
      },
      {
        question: 'Welche Kosten sind im Effektivzins nicht enthalten?',
        answer: 'Nach § 16 Abs. 4 PAngV fehlen unter anderem Versicherungen und Zusatzleistungen, die keine Bedingung für den Kredit sind, etwa eine freiwillige Restschuldversicherung, außerdem Notarkosten und Kosten, die erst bei Zahlungsverzug entstehen. Vergleichen Sie deshalb neben dem Effektivzins auch den Gesamtbetrag aller Zahlungen im Angebot.',
      },
    ],
  },

  'forward-darlehen-rechner': {
    sections: [
      {
        title: 'Forward-Zins und Rate nach Vorlaufzeit',
        content: [
          `Beispiel: ${eur0(200000)} Restschuld, 3,5 % Beispielzins für eine sofortige Anschlussfinanzierung, 0,02 Prozentpunkte Aufschlag je Vorlaufmonat und 2 % anfängliche Tilgung. Ohne Vorlauf läge die Rate bei ${eur(FWD_BASE_RATE)}.`,
          table(
            ['Vorlauf', 'Forward-Zins', 'Aufschlag', 'Monatsrate', 'Mehrkosten im 1. Jahr'],
            FWD_ROWS.map(({ m, zins, markup, rate }) => [`${m} Monate`, pct(zins), `+${num(markup, 2)} Pp.`, eur(rate), eur((rate - FWD_BASE_RATE) * 12)]),
          ),
          `Der Aufschlag wirkt wie eine Versicherungsprämie gegen steigende Zinsen. Er rechnet sich nur, wenn der Zins für Ihre Anschlussfinanzierung bei Ablauf der Zinsbindung höher liegt als der gesicherte Forward-Zins. Bei ${FWD_36.m} Monaten Vorlauf müsste der Zins im Beispiel bis dahin um mehr als ${num(FWD_36.markup, 2)} Prozentpunkte steigen.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Kann ich das Forward-Darlehen bei einer anderen Bank abschließen?',
        answer: 'Ja. Die neue Bank löst am Ende Ihrer Zinsbindung das alte Darlehen ab. Dafür wird die bestehende Grundschuld an sie abgetreten oder neu eingetragen, was Notar- und Grundbuchkosten verursacht. Rechnen Sie diese Kosten in den Zinsvergleich mit dem Angebot Ihrer bisherigen Bank ein.',
      },
      {
        question: 'Gibt es bei langer Zinsbindung eine Alternative zum Forward-Darlehen?',
        answer: 'Haben Sie eine Zinsbindung von mehr als zehn Jahren vereinbart, können Sie das Darlehen zehn Jahre nach vollständiger Auszahlung mit sechs Monaten Frist kündigen (§ 489 Abs. 1 Nr. 2 BGB), ohne Vorfälligkeitsentschädigung. Ein Forward-Darlehen kann dann auf diesen früheren Zeitpunkt abgestimmt werden, statt auf das Ende der Zinsbindung.',
      },
    ],
  },

  'dispozins-rechner': {
    sections: [
      {
        title: 'Was der Dispo kostet: Beispiele bei 12 % Dispozins',
        content: [
          '12 % ist ein Beispielzins. Setzen Sie im Rechner den Satz Ihrer Bank ein.',
          table(
            ['Im Minus', '30 Tage', '90 Tage', '180 Tage'],
            [500, 1000, 2000, 3000].map((a) => [eur0(a), eur(dispo(a, 30)), eur(dispo(a, 90)), eur(dispo(a, 180))]),
          ),
          `Ein kurzer Ausrutscher zum Monatsende kostet wenig. Teuer wird der Dauer-Dispo: ${eur0(3000)} über ein halbes Jahr kosten ${eur(dispo(3000, 180))}. Wer regelmäßig im Minus ist, sollte den Betrag mit einem Ratenkredit ablösen und den Dispo-Rahmen danach senken lassen, damit er nicht erneut ausgeschöpft wird.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Muss mich die Bank beraten, wenn ich lange im Dispo bin?',
        answer: 'Ja. Nutzen Sie den Dispo sechs Monate ununterbrochen und im Durchschnitt zu mehr als 75 % des Rahmens, muss die Bank Ihnen nach § 504a BGB eine Beratung über günstigere Alternativen anbieten, in Textform und auf dem üblichen Kommunikationsweg. Das Angebot können Sie annehmen oder ablehnen.',
      },
      {
        question: 'Was kostet es, wenn das Konto ein ganzes Jahr mit 2.000 € im Minus ist?',
        answer: `Bei 12 % Dispozins rechnet der Rechner mit ${eur(dispo(2000, 365))} für 365 Tage. Bei 9 % wären es ${eur(dispo(2000, 365, 9))}, bei 15 % ${eur(dispo(2000, 365, 15))}. Schon ein paar Prozentpunkte Unterschied machen bei Dauernutzung spürbar etwas aus.`,
      },
    ],
  },

  'sondertilgungsrechner': {
    sections: [
      {
        title: 'Wirkung unterschiedlich hoher Sondertilgungen',
        content: [
          `Beispiel: ${eur0(250000)} Darlehen, 3,8 % Beispielzins, ${eur0(1200)} Monatsrate. Ohne Sondertilgung dauert die Rückzahlung ${num(SONDER_BASE_MONTHS)} Monate. Die Sondertilgung wird hier einmal im Jahr gezahlt.`,
          table(
            ['Sondertilgung pro Jahr', 'Laufzeit', 'Früher schuldenfrei', 'Zinsersparnis'],
            SONDER_ROWS.map(({ sp, saved, months, timeSaved }) => [eur0(sp), `${num(months)} Monate`, `${num(timeSaved)} Monate`, eur(saved)]),
          ),
          `${eur0(12500)} entsprechen 5 % der Darlehenssumme, ein Beispiel für ein vertraglich vereinbartes Sondertilgungsrecht. Prüfen Sie im Vertrag, ob sich das Recht auf die ursprüngliche Summe bezieht und ob nicht genutzte Beträge verfallen.`,
        ].join('\n\n'),
      },
      {
        title: 'Sondertilgung oder Geld anlegen?',
        content: `Jeder sondergetilgte Euro spart sicher den Darlehenszins, und diese Ersparnis ist steuerfrei. Eine Geldanlage müsste nach Abgeltungsteuer und Solidaritätszuschlag (${pct(CAPITAL_TAX * 100, 3)}) mehr abwerfen, sobald Ihr Sparer-Pauschbetrag ausgeschöpft ist: Bei 3,8 % Darlehenszins sind das ${pct(SONDER_BREAKEVEN)} vor Steuern. Tilgen Sie trotzdem nur, was Sie nicht als Notgroschen brauchen. Getilgtes Geld bekommen Sie von der Bank nicht ohne Weiteres zurück.`,
      },
    ],
    faqs: [
      {
        question: 'Darf ich einen Ratenkredit jederzeit sondertilgen?',
        answer: 'Ja. Verbraucher dürfen einen Ratenkredit nach § 500 Abs. 2 BGB jederzeit ganz oder teilweise vorzeitig zurückzahlen. Bei festem Sollzins darf die Bank eine Vorfälligkeitsentschädigung verlangen, höchstens 1 % des vorzeitig gezahlten Betrags, bei weniger als einem Jahr Restlaufzeit höchstens 0,5 % und nie mehr als die Zinsen, die bis zum vereinbarten Ende angefallen wären (§ 502 Abs. 3 BGB).',
      },
      {
        question: 'Und bei einer Baufinanzierung ohne vereinbartes Sondertilgungsrecht?',
        answer: 'Während der Zinsbindung ist eine vorzeitige Rückzahlung nur bei berechtigtem Interesse möglich, etwa beim Verkauf der Immobilie (§ 500 Abs. 2 Satz 2 BGB), und dann meist mit Vorfälligkeitsentschädigung. Zehn Jahre nach vollständiger Auszahlung können Sie mit sechs Monaten Frist kündigen (§ 489 Abs. 1 Nr. 2 BGB). Am Ende der Zinsbindung können Sie ohnehin einen beliebigen Teil tilgen.',
      },
    ],
  },

  'zwischenfinanzierung-rechner': {
    sections: [
      {
        title: 'Wie hoch muss die Zwischenfinanzierung sein?',
        content: [
          'Rechnen Sie die Lücke in drei Schritten aus. Beispielzahlen:\n',
          `1. **Bedarf für die neue Immobilie:** ${eur0(ZW_NEW_PRICE)} Kaufpreis plus ${eur0(ZW_NEW_COSTS)} Nebenkosten.`,
          `2. **Abzüglich gesicherter Mittel:** ${eur0(ZW_EQUITY)} Eigenkapital und ${eur0(ZW_LONG_LOAN)} langfristiges Darlehen. Es bleibt eine Lücke von ${eur0(ZW_GAP)}.`,
          `3. **Gegenprobe mit dem Verkauf:** Erwarteter Erlös der alten Immobilie ${eur0(ZW_OLD_PRICE)} minus ${eur0(ZW_OLD_DEBT)} Restschuld ergibt ${eur0(ZW_OLD_NET)}. Das deckt die Lücke mit ${eur0(ZW_OLD_NET - ZW_GAP)} Puffer.`,
          `\nBei 5 % Beispielzins kostet die Lücke ${eur(zwMonthly(ZW_GAP, 5))} Zinsen im Monat. Bedenken Sie die Doppelbelastung: Gleichzeitig laufen die Rate für das neue Darlehen und, falls vorhanden, die Rate für die Restschuld der alten Immobilie weiter.`,
        ].join('\n'),
      },
      {
        title: 'Zinsen pro Monat nach Betrag und Zinssatz',
        content: [
          'Jeder Monat, den der Verkauf länger dauert, kostet diesen Betrag zusätzlich (Beispielzinssätze):',
          table(
            ['Betrag', '4 %', '5 %', '6 %'],
            [100000, 200000, 300000].map((l) => [eur0(l), eur(zwMonthly(l, 4)), eur(zwMonthly(l, 5)), eur(zwMonthly(l, 6))]),
          ),
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Welche Sicherheiten verlangt die Bank für eine Zwischenfinanzierung?',
        answer: 'In der Regel eine Grundschuld auf der alten oder der neuen Immobilie und einen Nachweis, dass der erwartete Verkaufserlös realistisch ist, etwa ein Wertgutachten oder bereits einen notariellen Kaufvertrag. Je unsicherer der Verkauf, desto vorsichtiger setzt die Bank den Wert der alten Immobilie an.',
      },
      {
        question: 'Wann ist das Geld aus dem Verkauf tatsächlich da?',
        answer: `Nicht am Tag des Notartermins. Der Käufer zahlt erst, wenn der Notar die Fälligkeit des Kaufpreises mitteilt, also nachdem unter anderem die Vormerkung im Grundbuch eingetragen ist. Das dauert erfahrungsgemäß einige Wochen. Planen Sie die Laufzeit mit Reserve: Für die Lücke aus dem Beispiel kosten 12 statt 6 Monate bei 5 % ${eur(ZW_GAP_12 - ZW_GAP_6)} mehr Zinsen.`,
      },
    ],
  },

  inflationsrechner: {
    sections: [
      {
        title: 'Kaufkraft von 1.000 € bei 2, 3 und 5 % Inflation',
        content: [
          'Kaufkraft: was 1.000 € von heute dann noch kaufen. Bedarf: wie viel Geld Sie dann für denselben Einkauf brauchen.',
          table(
            ['Jahre', 'Kaufkraft 2 %', 'Kaufkraft 3 %', 'Kaufkraft 5 %', 'Bedarf 2 %', 'Bedarf 3 %', 'Bedarf 5 %'],
            INFL_ROWS.map(({ y, i2, i3, i5 }) => [
              y,
              eur(prim(i2)),
              eur(prim(i3)),
              eur(prim(i5)),
              eur(sec(i2, 'futureNominal')),
              eur(sec(i3, 'futureNominal')),
              eur(sec(i5, 'futureNominal')),
            ]),
          ),
          'Für die Altersvorsorge heißt das: Eine heute geplante Monatsrente muss in 30 Jahren deutlich höher sein, um denselben Lebensstandard zu sichern. Rechnen Sie Ihr Ziel deshalb immer in Euro von morgen um.',
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Mit welcher Inflationsrate sollte ich langfristig rechnen?',
        answer: `Die Europäische Zentralbank strebt mittelfristig eine Inflation von 2 % an. Ob das gelingt, ist offen, deshalb lohnt ein zweites Szenario mit 3 %: Nach 30 Jahren sind 1.000 € dann nur noch ${eur(prim(INFL_ROWS[2].i3))} wert statt ${eur(prim(INFL_ROWS[2].i2))} bei 2 %.`,
      },
      {
        question: 'Wie prüfe ich, ob mein Gehalt oder Zins die Inflation schlägt?',
        answer: `Teilen Sie (1 + Steigerung) durch (1 + Inflation) und ziehen Sie 1 ab. Eine Gehaltserhöhung von 3 % bei 2 % Inflation ergibt real ${pct(REAL_RAISE)} mehr Kaufkraft, etwas weniger als die einfache Differenz von 1 Prozentpunkt. Für Zinsen nach Steuern hilft der [Realzins-Rechner](/rechner/realzins-rechner/).`,
      },
    ],
  },

  'tagesgeld-rechner': {
    sections: [
      {
        title: 'Monatliche oder jährliche Zinsgutschrift: der Unterschied in Euro',
        content: [
          '10.000 € zu 3 % Beispielzins, konstant über die ganze Zeit:',
          table(
            ['Zinsgutschrift', 'Zinsen nach 1 Jahr', 'Zinsen nach 5 Jahren'],
            TG_ROWS.map(({ label, y1, y5 }) => [label, eur(y1), eur(y5)]),
          ),
          `Nach fünf Jahren bringt die monatliche Gutschrift nur ${eur(TG_INTERVAL_GAP_5Y)} mehr als die jährliche. Schon 0,1 Prozentpunkte mehr Zins bringen dagegen ${eur(TG_EXTRA_RATE_5Y)}. Achten Sie beim Vergleich also zuerst auf den Zinssatz und wie lange er garantiert ist, erst dann auf das Gutschriftintervall.`,
        ].join('\n\n'),
      },
      {
        title: 'Bis zu welchem Guthaben bleiben die Zinsen steuerfrei?',
        content: [
          `Zinsen bleiben bis zum Sparer-Pauschbetrag von ${eur0(PAUSCH_SINGLE)} im Jahr steuerfrei (Zusammenveranlagte: ${eur0(PAUSCH_MARRIED)}), wenn Sie der Bank einen Freistellungsauftrag erteilt haben. Der Betrag gilt für alle Kapitalerträge zusammen, also auch für Dividenden und Fondserträge.`,
          table(
            ['Zinssatz (Beispiel)', `Guthaben für ${eur0(PAUSCH_SINGLE)} Zinsen im Jahr`, `Guthaben für ${eur0(PAUSCH_MARRIED)} Zinsen im Jahr`],
            [2, 3, 4].map((r) => [pct(r), eur0(tgTaxFreeDeposit(r, PAUSCH_SINGLE)), eur0(tgTaxFreeDeposit(r, PAUSCH_MARRIED))]),
          ),
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Wie viel Zinsen bringen 20.000 € Tagesgeld in 6 Monaten?',
        answer: `Bei 2,5 % Beispielzins und monatlicher Gutschrift rund ${eur(TG_6M)}. Weil der Tagesgeldzins variabel ist, kann die Bank ihn während dieser Zeit senken oder erhöhen. Das Ergebnis gilt also nur, wenn der Zins gleich bleibt.`,
      },
      {
        question: 'Muss ich Tagesgeldzinsen in der Steuererklärung angeben?',
        answer: 'Bei einer Bank mit Sitz in Deutschland meist nicht: Sie behält Abgeltungsteuer und Solidaritätszuschlag auf Zinsen oberhalb Ihres Freistellungsauftrags ein, damit ist die Steuer abgegolten. Ausländische Banken ohne deutsche Niederlassung führen keine deutsche Steuer ab. Diese Zinsen müssen Sie selbst in der Anlage KAP erklären.',
      },
    ],
  },

  'festgeld-rechner': {
    sections: [
      {
        title: 'Zinseszins gibt es nur, wenn die Zinsen im Festgeld bleiben',
        content: [
          'Der Rechner geht davon aus, dass die Zinsen jedes Jahr mitverzinst werden. Manche Angebote zahlen die Zinsen aber jährlich auf ein Verrechnungskonto aus. 10.000 € zu 3 % Beispielzins:',
          table(
            ['Laufzeit', 'Zinsen mit Zinseszins', 'Zinsen bei jährlicher Auszahlung'],
            FG_ROWS.map(({ y, compound, payout }) => [`${y} ${y === 1 ? 'Jahr' : 'Jahre'}`, eur(compound), eur(payout)]),
          ),
        ].join('\n\n'),
      },
      {
        title: 'Steuern: Auszahlung am Laufzeitende kann teurer sein',
        content: `Werden alle Zinsen erst am Ende gutgeschrieben, versteuern Sie sie in diesem einen Jahr. Im Beispiel kommen nach fünf Jahren ${eur(FG_5.compound)} auf einmal. Über dem Sparer-Pauschbetrag von ${eur0(PAUSCH_SINGLE)} kostet das ${eur(FG_TAX_5)} Abgeltungsteuer und Soli (ohne Kirchensteuer). Bei jährlicher Gutschrift von ${eur(FG_YEAR)} bliebe alles steuerfrei, wenn Sie keine anderen Kapitalerträge haben.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Zinsen bringen 10.000 € Festgeld über 2 Jahre?',
        answer: `Bei 3 % Beispielzins ${eur(FG_ROWS[1].compound)}, wenn die Zinsen im ersten Jahr mitverzinst werden, sonst ${eur(FG_ROWS[1].payout)}. Vor Steuern und nur bei einem über die Laufzeit fest vereinbarten Zinssatz.`,
      },
      {
        question: 'Festgeld oder Tagesgeld, wenn beide gleich viel Zins bieten?',
        answer: 'Dann spricht viel für Tagesgeld, weil Sie jederzeit an Ihr Geld kommen. Festgeld lohnt sich vor allem, wenn sein Zinssatz höher ist oder wenn Sie erwarten, dass die Tagesgeldzinsen während der Laufzeit fallen: Der Festzins bleibt dann bis zum Ende gleich.',
      },
    ],
  },

  'etf-sparplan-rechner': {
    sections: [
      {
        title: 'Was 1,3 Prozentpunkte laufende Kosten ausmachen',
        content: [
          '100 € im Monat, 6 % Beispielrendite vor Kosten. Verglichen wird ein günstiger ETF (0,2 % laufende Kosten) mit einem Fonds, der 1,5 % im Jahr kostet. Steuern sind nicht berücksichtigt.',
          table(
            ['Jahre', 'Eingezahlt', 'Endwert bei 0,2 %', 'Endwert bei 1,5 %', 'Differenz'],
            ETF_ROWS.map(({ y, paid, low, high }) => [y, eur0(paid), eur(low), eur(high), eur(low - high)]),
          ),
          'Die Kosten werden jedes Jahr vom ganzen Depotwert abgezogen, nicht nur von den Einzahlungen. Deshalb wächst die Lücke mit der Zeit immer schneller.',
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Was ist die Vorabpauschale bei thesaurierenden ETFs?',
        answer: 'Thesaurierende Fonds schütten nichts aus. Damit trotzdem jährlich Steuer anfällt, wird nach § 18 InvStG eine Vorabpauschale berechnet. Sie richtet sich nach einem jährlich vom Bundesfinanzministerium bekanntgegebenen Basiszins und ist auf den tatsächlichen Wertzuwachs des Jahres begrenzt. Sie gilt am ersten Werktag des Folgejahres als zugeflossen, die Bank zieht die Steuer dann vom Verrechnungskonto ein. Der Sparer-Pauschbetrag und bei Aktien-ETFs die Teilfreistellung von 30 % werden berücksichtigt.',
      },
      {
        question: 'Lieber früh mit wenig oder später mit mehr sparen?',
        answer: `Früh anfangen wirkt stärker. 100 € im Monat über 40 Jahre ergeben bei 6 % Beispielrendite und 0,2 % Kosten ${eur(ETF_EARLY)}. 200 € im Monat über 20 Jahre kommen nur auf ${eur(ETF_LATE)}, obwohl in beiden Fällen ${eur0(48000)} eingezahlt werden.`,
      },
    ],
  },

  renditerechner: {
    sections: [
      {
        title: 'Welche Jahresrendite steckt in einer Verdopplung?',
        content: [
          'Aus 10.000 € werden 20.000 €. Je nach Dauer entspricht das ganz unterschiedlichen Jahresrenditen:',
          table(['Dauer', 'Jährliche Rendite (CAGR)'], DOUBLE_ROWS.map(({ y, cagr }) => [`${y} Jahre`, pct(cagr)])),
          '**Verluste aufholen:** Nach einem Minus braucht es prozentual mehr, um wieder beim Startwert zu sein.',
          table(['Verlust', 'Nötiger Gewinn bis zum Ausgangswert'], LOSS_ROWS.map(({ loss, need }) => [`−${loss} %`, `+${num(need, 2)} %`])),
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Kann ich den Renditerechner für einen Sparplan nutzen?',
        answer: 'Nur eingeschränkt. Die CAGR unterstellt, dass das ganze Kapital von Anfang an angelegt war. Beim Sparplan liegt jede Rate unterschiedlich lange im Depot, die Rendite fällt mit dieser Formel zu niedrig aus. Nutzen Sie stattdessen den [ETF-Sparplan-Rechner](/rechner/etf-sparplan-rechner/) und passen Sie die Rendite an, bis der Endwert Ihrem Depotstand entspricht.',
      },
      {
        question: 'Warum zeigt der Rechner bei kurzer Haltedauer so hohe Jahresrenditen?',
        answer: `Weil er auf ein volles Jahr hochrechnet. Steigt eine Anlage in einem halben Jahr um 10 %, ergibt das ${pct(HALF_YEAR_CAGR)} pro Jahr, als würde sich der Zuwachs wiederholen. Bei Haltedauern unter einem Jahr ist die Gesamtrendite deshalb die aussagekräftigere Zahl.`,
      },
    ],
  },

  sparrechner: {
    faqs: [
      {
        question: 'Wie viel muss ich im Monat für 10.000 €, 25.000 € oder 100.000 € sparen?',
        answer: `Ohne Startkapital, bei 3 % Zins und Einzahlung zum Monatsende: ${SPAR_TARGET_TEXT}. Doppelte Spardauer halbiert die Rate nicht nur, sie drückt sie noch etwas tiefer, weil die Zinsen länger mitarbeiten. Vorhandenes Erspartes tragen Sie im Modus „Sparrate“ als Startkapital ein.`,
      },
    ],
  },

  'kapitalertragsteuer-rechner': {
    sections: [
      {
        title: 'Steuer und Netto-Ertrag bei typischen Beträgen',
        content: [
          'Ohne Kirchensteuer, voller Sparer-Pauschbetrag noch verfügbar:',
          table(['Kapitalertrag', 'Steuer (Single)', 'Netto (Single)', 'Steuer (Ehepaar)', 'Netto (Ehepaar)'], KAP_ROWS),
          `Bis ${eur0(LEGAL_VALUES_2026.sparerPauschbetragSingle.value)} (Ehepaare ${eur0(LEGAL_VALUES_2026.sparerPauschbetragMarried.value)}) fällt nichts an, jeder Euro darüber kostet 26,375 Cent. Der Unterschied zwischen Single und Ehepaar beträgt deshalb höchstens ${eur(prim(kap(25000, 'single')) - prim(kap(25000, 'married')))} im Jahr, egal wie hoch die Erträge sind.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Wie rechne ich die Teilfreistellung eines Aktien-ETFs ein?',
        answer: `Ziehen Sie vor der Eingabe 30 % vom Fondsertrag ab. Bei ${eur0(KAP_ETF_GAIN)} Gewinn aus einem Aktien-ETF tragen Sie ${eur0(KAP_ETF_TAXABLE)} ein. Als Single ohne Kirchensteuer ergibt das ${eur(KAP_ETF_WITH)} Steuer statt ${eur(KAP_ETF_WITHOUT)} ohne Teilfreistellung. Bei Mischfonds sind es 15 %, bei Zinsen, Tagesgeld und Einzelaktien gibt es keine Teilfreistellung.`,
      },
    ],
  },

  'maximaler-kredit-rechner': {
    sections: [
      {
        title: 'Kreditrahmen je Monatsrate und Laufzeit',
        content: [
          'Wie viel Kredit eine feste Monatsrate bei 4,5 % Sollzins trägt (gerundet):',
          table(['Monatsrate', ...MAX_YEARS.map((y) => `${y} Jahre`)], MAX_ROWS),
          'Die Laufzeit hebt den Rahmen stark an, aber nicht im gleichen Verhältnis: Bei längerer Laufzeit fließt ein größerer Teil jeder Rate in Zinsen. Ratenkredite laufen meist nur wenige Jahre; die langen Laufzeiten betreffen vor allem Baufinanzierungen, für die Banken zusätzlich Eigenkapital und den Wert der Immobilie prüfen.',
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Wie stark senkt ein höherer Zins den Kreditrahmen?',
        answer: `Bei 1.000 € Monatsrate und 5 Jahren Laufzeit trägt die Rate bei 4,5 % rund ${eur0(MAX_1000_45)} Kredit, bei 5,5 % noch ${eur0(MAX_1000_55)}. Ein Prozentpunkt mehr kostet hier also rund ${eur0(MAX_1000_45 - MAX_1000_55)} Kreditrahmen. Bei 8 Jahren Laufzeit ist der Abstand größer: ${eur0(MAX_1000_45_8)} gegenüber ${eur0(MAX_1000_55_8)}.`,
      },
    ],
  },

  pfaendungsrechner: {
    sections: [
      {
        title: 'Pfändbare Beträge ab 1. Juli 2026 im Überblick',
        content: [
          'Pfändbarer Betrag pro Monat nach § 850c ZPO, abhängig vom Nettolohn und der Zahl der Personen, denen Sie Unterhalt leisten:',
          table(['Nettolohn', ...PF_DEPS.map((d) => (d === 0 ? 'keine Unterhaltspflicht' : d === 1 ? '1 Person' : `${d} Personen`))], PF_ROWS),
          `Ablesen: Der Nettolohn wird auf volle 10 € abgerundet, die amtliche Tabelle arbeitet in denselben Stufen. Mit jeder unterhaltsberechtigten Person steigt nicht nur der Freibetrag, auch der pfändbare Anteil am Mehrbetrag sinkt. Was über ${eur(PF.vollPfaendbarAb)} liegt, geht vollständig an den Gläubiger. Für Werte zwischen den Zeilen nutzen Sie den Rechner oben.`,
        ].join('\n\n'),
      },
    ],
    faqs: [
      {
        question: 'Sind Weihnachtsgeld und Überstundenvergütung pfändbar?',
        answer: `Nur teilweise. Nach § 850a ZPO ist die Vergütung für Mehrarbeitsstunden zur Hälfte unpfändbar: Von ${eur0(PF_OVERTIME_EXAMPLE)} Überstundenvergütung zählen nur ${eur0(PF_OVERTIME_EXAMPLE / 2)} zum pfändbaren Einkommen. Weihnachtsgeld bleibt bis zur Hälfte des auf volle 10 € aufgerundeten Grundfreibetrags frei, ab 1. Juli 2026 also bis ${eur(PF_XMAS_FREE)}. Diese unpfändbaren Teile gehören nicht in das Nettoeinkommen, das Sie oben eintragen.`,
      },
    ],
  },

};
