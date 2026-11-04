import { CalculationResult, CalculationBreakdownRow } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateCompoundInterest(inputs: Record<string, any>): CalculationResult {
  if (inputs.initialAmount === undefined || inputs.initialAmount === null || String(inputs.initialAmount).trim() === '') {
    if (inputs.monthlyContribution === undefined || inputs.monthlyContribution === null || String(inputs.monthlyContribution).trim() === '') {
      return {
        primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
        error: 'Bitte geben Sie ein Startkapital oder eine monatliche Sparrate an.',
      };
    }
  }

  const rawInitial = inputs.initialAmount !== undefined && inputs.initialAmount !== null && String(inputs.initialAmount).trim() !== ''
    ? parseFloat(inputs.initialAmount)
    : 0;
  if (isNaN(rawInitial) || rawInitial < 0) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Das Startkapital darf nicht negativ sein.',
    };
  }
  const initial = rawInitial;

  const rawMonthly = inputs.monthlyContribution !== undefined && inputs.monthlyContribution !== null && String(inputs.monthlyContribution).trim() !== ''
    ? parseFloat(inputs.monthlyContribution)
    : 0;
  if (isNaN(rawMonthly) || rawMonthly < 0) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Die monatliche Sparrate darf nicht negativ sein.',
    };
  }
  const initialMonthly = rawMonthly;

  if (initial === 0 && initialMonthly === 0) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie ein Startkapital oder eine monatliche Sparrate größer als 0 € ein.',
    };
  }

  if (inputs.annualRate === undefined || inputs.annualRate === null || String(inputs.annualRate).trim() === '') {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den jährlichen Zinssatz an (0 % für zinsfreies Sparen).',
    };
  }
  const rawRate = parseFloat(inputs.annualRate);
  if (isNaN(rawRate) || rawRate < 0) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Der Zinssatz darf nicht negativ sein.',
    };
  }
  const rateAnnual = rawRate / 100;

  if (inputs.years === undefined || inputs.years === null || String(inputs.years).trim() === '') {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die Anlagedauer in Jahren ein.',
    };
  }
  const rawYears = parseFloat(inputs.years);
  if (isNaN(rawYears) || rawYears < 1 || !Number.isInteger(rawYears)) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: 0, formattedValue: '-' },
      error: 'Die Laufzeit muss mindestens 1 volles Jahr betragen.',
    };
  }
  const years = rawYears;

  const compoundFreq = Math.max(1, parseInt(inputs.compoundFrequency || '12', 10)); // 1, 2, 4, 12
  const depositTiming = inputs.depositTiming || 'end'; // 'end' = nachschüssig, 'start' = vorschüssig
  const dynamicRatePercent = parseFloat(inputs.dynamicIncrease || '0') / 100; // jährliche Sparratendynamik
  const inflationRatePercent = parseFloat(inputs.inflationRate || '0') / 100; // optionale Inflationsbereinigung

  let balance = initial;
  let totalDeposits = initial;
  let currentMonthly = initialMonthly;
  const rows: CalculationBreakdownRow[] = [];

  const ratePerPeriod = rateAnnual / compoundFreq;
  const periodsPerYear = compoundFreq;

  for (let year = 1; year <= years; year++) {
    const startYearBalance = balance;
    let yearDeposits = 0;

    for (let p = 0; p < periodsPerYear; p++) {
      const monthsInPeriod = 12 / periodsPerYear;
      const periodContribution = currentMonthly * monthsInPeriod;

      if (depositTiming === 'start') {
        // Vorschüssig: Einzahlung zu Beginn der Periode, verzinst sich in der Periode mit
        balance += periodContribution;
        balance *= (1 + ratePerPeriod);
      } else {
        // Nachschüssig: Zinsen fallen auf bestehendes Guthaben an, Einzahlung am Periodenende
        balance *= (1 + ratePerPeriod);
        balance += periodContribution;
      }

      totalDeposits += periodContribution;
      yearDeposits += periodContribution;
    }

    const yearInterest = balance - startYearBalance - yearDeposits;

    rows.push({
      period: `Jahr ${year}`,
      values: {
        deposits: formatCurrency(totalDeposits),
        interestTotal: formatCurrency(balance - totalDeposits),
        balance: formatCurrency(balance),
      },
    });

    // Jährliche Dynamisierung der Sparrate
    if (dynamicRatePercent > 0) {
      currentMonthly *= (1 + dynamicRatePercent);
    }
  }

  const totalInterest = Math.max(0, balance - totalDeposits);
  const totalReturnPercent = totalDeposits > 0 ? (totalInterest / totalDeposits) * 100 : 0;

  const secondary: Array<{ id: string; label: string; value: any; formattedValue: string }> = [
    { id: 'totalDeposits', label: 'Eigene Einzahlungen', value: totalDeposits, formattedValue: formatCurrency(totalDeposits) },
    { id: 'totalInterest', label: 'Erwirtschaftete Zinsen', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
    { id: 'returnPercent', label: 'Gesamtrendite auf Einzahlungen', value: totalReturnPercent, formattedValue: formatPercent(totalReturnPercent, 1) },
  ];

  if (inflationRatePercent > 0) {
    const realPurchasingPower = balance / Math.pow(1 + inflationRatePercent, years);
    secondary.push({
      id: 'realPower',
      label: `Kaufkraft inflationsbereinigt (${formatPercent(inflationRatePercent * 100)} Inflation)`,
      value: realPurchasingPower,
      formattedValue: formatCurrency(realPurchasingPower),
    });
  }

  if (dynamicRatePercent > 0) {
    secondary.push({
      id: 'endMonthlyRate',
      label: `Monatliche Sparrate im letzten Jahr (${formatPercent(dynamicRatePercent * 100)} Dynamik)`,
      value: currentMonthly,
      formattedValue: formatCurrency(currentMonthly),
    });
  }

  const freqLabel = compoundFreq === 12 ? 'monatlicher' : compoundFreq === 4 ? 'vierteljährlicher' : compoundFreq === 2 ? 'halbjährlicher' : 'jährlicher';
  const timingLabel = depositTiming === 'start' ? 'vorschüssig (Monatsanfang)' : 'nachschüssig (Monatsende)';

  return {
    primary: {
      id: 'endAmount',
      label: 'Endkapital',
      value: balance,
      formattedValue: formatCurrency(balance),
      highlight: true,
    },
    secondary,
    breakdown: {
      columns: [
        { key: 'deposits', label: 'Eingezahltes Kapital' },
        { key: 'interestTotal', label: 'Zinsertrag kumuliert' },
        { key: 'balance', label: 'Guthaben am Jahresende' },
      ],
      rows: rows.slice(-15),
    },
    summaryText: `Nach ${years} Jahren wächst Ihr Startkapital von ${formatCurrency(initial)} mit ${timingLabel} Sparrate von anfangs ${formatCurrency(initialMonthly)} bei ${formatPercent(rateAnnual * 100)} Zinsen und ${freqLabel} Zinsgutschrift auf ein Endvermögen von ${formatCurrency(balance)} an. Davon sind ${formatCurrency(totalInterest)} reiner Zinsgewinn.`,
  };
}

export function calculateSavingsTarget(inputs: Record<string, any>): CalculationResult {
  const rawTarget = inputs.targetAmount !== undefined && inputs.targetAmount !== null && String(inputs.targetAmount).trim() !== ''
    ? parseFloat(inputs.targetAmount)
    : 50000;
  const target = !isNaN(rawTarget) ? Math.max(0, rawTarget) : 50000;

  const rawInitial = inputs.initialAmount !== undefined && inputs.initialAmount !== null && String(inputs.initialAmount).trim() !== ''
    ? parseFloat(inputs.initialAmount)
    : 0;
  const initial = !isNaN(rawInitial) ? Math.max(0, rawInitial) : 0;

  const rawRate = inputs.annualRate !== undefined && inputs.annualRate !== null && String(inputs.annualRate).trim() !== ''
    ? parseFloat(inputs.annualRate)
    : 0;
  const rateAnnual = (!isNaN(rawRate) ? Math.max(0, rawRate) : 0) / 100;

  const years = parseInt(inputs.years || '10', 10);

  if (target <= initial) {
    return {
      primary: { id: 'monthly', label: 'Monatliche Sparrate', value: 0, formattedValue: '0,00 €', highlight: true },
      secondary: [
        { id: 'target', label: 'Sparziel', value: target, formattedValue: formatCurrency(target) },
        { id: 'totalOwn', label: 'Summe eigener Einzahlungen', value: initial, formattedValue: formatCurrency(initial) },
        { id: 'interestGain', label: 'Zinsanteil am Sparziel', value: 0, formattedValue: formatCurrency(0) },
      ],
      summaryText: target === 0
        ? 'Bei einem Sparziel von 0 € ist keine monatliche Sparrate erforderlich.'
        : 'Das vorhandene Startkapital deckt das gewünschte Sparziel bereits vollständig ab.',
    };
  }
  if (years <= 0) {
    return {
      primary: { id: 'monthly', label: 'Monatliche Sparrate', value: 0, formattedValue: '0,00 €' },
      error: 'Die Laufzeit muss größer als 0 Jahre sein.',
    };
  }

  const months = years * 12;
  const rMonthly = rateAnnual / 12;

  let monthlyRate = 0;
  if (rMonthly === 0) {
    monthlyRate = (target - initial) / months;
  } else {
    // FV = initial*(1+r)^m + PMT * [ ((1+r)^m - 1) / r ]
    const futureInitial = initial * Math.pow(1 + rMonthly, months);
    const neededFromMonthly = target - futureInitial;
    monthlyRate = (neededFromMonthly * rMonthly) / (Math.pow(1 + rMonthly, months) - 1);
  }

  monthlyRate = Math.max(0, monthlyRate);
  const totalOwnPayments = initial + monthlyRate * months;
  const interestGain = target - totalOwnPayments;

  return {
    primary: {
      id: 'monthlyRate',
      label: 'Benötigte monatliche Sparrate',
      value: monthlyRate,
      formattedValue: formatCurrency(monthlyRate),
      highlight: true,
    },
    secondary: [
      { id: 'target', label: 'Sparziel', value: target, formattedValue: formatCurrency(target) },
      { id: 'totalOwn', label: 'Summe eigener Einzahlungen', value: totalOwnPayments, formattedValue: formatCurrency(totalOwnPayments) },
      { id: 'interestGain', label: 'Zinsanteil am Sparziel', value: interestGain, formattedValue: formatCurrency(interestGain) },
    ],
    summaryText: `Um in ${years} Jahren ein Sparziel von ${formatCurrency(target)} zu erreichen, müssen Sie monatlich ${formatCurrency(monthlyRate)} bei einer angenommenen Rendite von ${formatPercent(rateAnnual * 100)} ansparen.`,
  };
}

export function calculateInflation(inputs: Record<string, any>): CalculationResult {
  const rawAmount = inputs.amount !== undefined && inputs.amount !== null && String(inputs.amount).trim() !== ''
    ? parseFloat(inputs.amount)
    : 10000;
  const amount = !isNaN(rawAmount) ? Math.max(0, rawAmount) : 10000;

  const rawInflation = inputs.inflationRate !== undefined && inputs.inflationRate !== null && String(inputs.inflationRate).trim() !== ''
    ? parseFloat(inputs.inflationRate)
    : 2.5;
  const inflationRate = (!isNaN(rawInflation) ? rawInflation : 2.5) / 100;

  const years = parseInt(inputs.years || '10', 10);

  if (years <= 0) {
    return {
      primary: { id: 'futurePurchasingPower', label: 'Kaufkraft', value: amount, formattedValue: formatCurrency(amount) },
      error: 'Die Laufzeit muss größer als null sein.',
    };
  }

  // Zukünftige Kaufkraft des heutigen Geldes
  const futurePurchasingPower = amount / Math.pow(1 + inflationRate, years);
  const lossInEuros = amount - futurePurchasingPower;
  const lossPercent = amount > 0 ? (lossInEuros / amount) * 100 : 0;

  // Umgekehrt: Wie viel Geld bräuchte man in der Zukunft für dieselbe Kaufkraft?
  const futureNominalEquivalent = amount * Math.pow(1 + inflationRate, years);

  return {
    primary: {
      id: 'futurePurchasingPower',
      label: `Reale Kaufkraft in ${years} Jahren`,
      value: futurePurchasingPower,
      formattedValue: formatCurrency(futurePurchasingPower),
      highlight: true,
    },
    secondary: [
      { id: 'loss', label: 'Realer Kaufkraftverlust', value: lossInEuros, formattedValue: formatCurrency(lossInEuros) },
      { id: 'lossPercent', label: 'Verlust in Prozent', value: lossPercent, formattedValue: formatPercent(lossPercent, 1) },
      { id: 'futureNominal', label: `Zukünftig benötigter Betrag für gleichen Warenkorb`, value: futureNominalEquivalent, formattedValue: formatCurrency(futureNominalEquivalent) },
    ],
    summaryText: `Bei einer durchschnittlichen Inflationsrate von ${formatPercent(inflationRate * 100)} haben ${formatCurrency(amount)} in ${years} Jahren nur noch eine reale Kaufkraft von ${formatCurrency(futurePurchasingPower)} (ein Kaufkraftverlust von ${formatPercent(lossPercent, 1)}).`,
  };
}

export function calculateReturn(inputs: Record<string, any>): CalculationResult {
  const rawInitial = inputs.initialInvestment !== undefined && inputs.initialInvestment !== null && String(inputs.initialInvestment).trim() !== ''
    ? parseFloat(inputs.initialInvestment)
    : 10000;
  const initial = !isNaN(rawInitial) ? rawInitial : 10000;

  const rawFinal = inputs.finalValue !== undefined && inputs.finalValue !== null && String(inputs.finalValue).trim() !== ''
    ? parseFloat(inputs.finalValue)
    : 16000;
  const finalVal = !isNaN(rawFinal) ? rawFinal : 16000;

  const rawYears = inputs.years !== undefined && inputs.years !== null && String(inputs.years).trim() !== ''
    ? parseFloat(inputs.years)
    : 5;
  const years = !isNaN(rawYears) ? rawYears : 5;

  if (initial <= 0) {
    return {
      primary: { id: 'cagr', label: 'Jährliche Durchschnittsrendite (CAGR)', value: 0, formattedValue: '0 %' },
      error: 'Die Anfangsinvestition muss positiv sein.',
    };
  }

  if (years <= 0) {
    return {
      primary: { id: 'cagr', label: 'Jährliche Durchschnittsrendite (CAGR)', value: 0, formattedValue: '0 %' },
      error: 'Die Haltedauer muss größer als null sein.',
    };
  }

  const profit = finalVal - initial;
  const totalReturnPercent = (profit / initial) * 100;

  let cagr = 0;
  if (years > 0 && finalVal > 0) {
    cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
  } else if (finalVal === 0) {
    cagr = -100;
  }

  return {
    primary: {
      id: 'cagr',
      label: 'Jährliche Durchschnittsrendite (CAGR)',
      value: cagr,
      formattedValue: formatPercent(cagr, 2),
      highlight: true,
    },
    secondary: [
      { id: 'totalReturn', label: 'Gesamtrendite absolut', value: totalReturnPercent, formattedValue: formatPercent(totalReturnPercent, 2) },
      { id: 'profit', label: 'Reiner Gewinn / Verlust', value: profit, formattedValue: formatCurrency(profit) },
      { id: 'factor', label: 'Wachstumsfaktor', value: finalVal / initial, formattedValue: `${formatNumber(finalVal / initial, 3)} ×` },
    ],
    summaryText: `Aus ${formatCurrency(initial)} wurden nach ${years} Jahren ${formatCurrency(finalVal)}. Das entspricht einer jährlichen Rendite von ${formatPercent(cagr, 2)} und einem Gesamtertrag von ${formatCurrency(profit)}.`,
  };
}

export function calculateEmergencyFund(inputs: Record<string, any>): CalculationResult {
  const rent = inputs.rent !== undefined && inputs.rent !== null && String(inputs.rent).trim() !== ''
    ? Math.max(0, parseFloat(inputs.rent) || 0)
    : 800;
  const living = inputs.livingExpenses !== undefined && inputs.livingExpenses !== null && String(inputs.livingExpenses).trim() !== ''
    ? Math.max(0, parseFloat(inputs.livingExpenses) || 0)
    : 400;
  const insurance = inputs.insurance !== undefined && inputs.insurance !== null && String(inputs.insurance).trim() !== ''
    ? Math.max(0, parseFloat(inputs.insurance) || 0)
    : 150;
  const other = inputs.other !== undefined && inputs.other !== null && String(inputs.other).trim() !== ''
    ? Math.max(0, parseFloat(inputs.other) || 0)
    : 150;
  const monthsBuffer = parseInt(inputs.bufferMonths || '3', 10);

  const monthlyTotal = rent + living + insurance + other;
  const targetFund = monthlyTotal * monthsBuffer;

  return {
    primary: {
      id: 'targetFund',
      label: `Empfohlener Notgroschen (${monthsBuffer} Monate)`,
      value: targetFund,
      formattedValue: formatCurrency(targetFund),
      highlight: true,
    },
    secondary: [
      { id: 'monthlyExpenses', label: 'Monatliche Fix- & Lebenshaltungskosten', value: monthlyTotal, formattedValue: formatCurrency(monthlyTotal) },
      { id: 'buffer3', label: 'Minimalpuffer (3 Monate)', value: monthlyTotal * 3, formattedValue: formatCurrency(monthlyTotal * 3) },
      { id: 'buffer6', label: 'Komfortpuffer (6 Monate für Familien / Selbstständige)', value: monthlyTotal * 6, formattedValue: formatCurrency(monthlyTotal * 6) },
    ],
    summaryText: `Bei monatlichen Gesamtkosten von ${formatCurrency(monthlyTotal)} sollte Ihr Notgroschen auf einem sofort verfügbaren Tagesgeldkonto mindestens ${formatCurrency(targetFund)} betragen.`,
  };
}

// ---------------------------------------------------------------------------
// Sparrechner mit drei Modi (Endkapital, benötigte Sparrate, Spardauer) und Sparquote
// ---------------------------------------------------------------------------

function isBlankValue(v: any): boolean {
  return v === undefined || v === null || String(v).trim() === '';
}

function parseNum(v: any): number {
  if (typeof v === 'number') return v;
  return parseFloat(String(v).trim().replace(',', '.'));
}

function formatMonthsDe(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const yText = `${y} ${y === 1 ? 'Jahr' : 'Jahre'}`;
  const mText = `${m} ${m === 1 ? 'Monat' : 'Monate'}`;
  if (y > 0 && m > 0) return `${yText} und ${mText}`;
  if (y > 0) return yText;
  return mText;
}

type SavingsItem = { id: string; label: string; value: number; formattedValue: string };

/** Sparquote = monatliche Sparrate ÷ Nettoeinkommen. Nettoeinkommen leer oder 0 = keine Auswertung. */
function savingsQuoteItems(monthly: number, rawNetIncome: any): { items: SavingsItem[]; warning?: string; error?: string } {
  if (isBlankValue(rawNetIncome)) return { items: [] };
  const net = parseNum(rawNetIncome);
  if (!Number.isFinite(net) || net < 0) return { items: [], error: 'Das Nettoeinkommen darf nicht negativ sein.' };
  if (net === 0) return { items: [] };
  const quote = (monthly / net) * 100;
  const rating = quote >= 20
    ? 'mindestens 20 % – entspricht der 50-30-20-Faustregel'
    : quote >= 10
      ? 'zwischen 10 und 20 %'
      : 'unter 10 %';
  const items: SavingsItem[] = [
    { id: 'savingsQuote', label: 'Sparquote vom Nettoeinkommen', value: quote, formattedValue: formatPercent(quote, 1) },
    { id: 'savingsQuoteRating', label: 'Einordnung', value: quote, formattedValue: rating },
    { id: 'annualSavings', label: 'Sparbetrag pro Jahr', value: monthly * 12, formattedValue: formatCurrency(monthly * 12) },
  ];
  const warning = monthly > net
    ? 'Die Sparrate ist höher als Ihr Nettoeinkommen. Prüfen Sie die Eingaben.'
    : undefined;
  return { items, warning };
}

/** Monatliche Simulation (monatliche Zinsgutschrift r/12) mit Jahreszeilen für die Tabelle. */
function simulateSavings(initial: number, monthly: number, r: number, months: number, timing: 'start' | 'end') {
  let balance = initial;
  let deposits = initial;
  const rows: CalculationBreakdownRow[] = [];
  for (let m = 1; m <= months; m++) {
    if (timing === 'start') {
      balance = (balance + monthly) * (1 + r);
    } else {
      balance = balance * (1 + r) + monthly;
    }
    deposits += monthly;
    if (m % 12 === 0 || m === months) {
      rows.push({
        period: m % 12 === 0 ? `Jahr ${m / 12}` : `Monat ${m}`,
        values: {
          deposits: formatCurrency(deposits),
          interestTotal: formatCurrency(balance - deposits),
          balance: formatCurrency(balance),
        },
      });
    }
  }
  return { balance, deposits, rows };
}

const SAVINGS_COLUMNS = [
  { key: 'deposits', label: 'Eingezahlt' },
  { key: 'interestTotal', label: 'Zinsen kumuliert' },
  { key: 'balance', label: 'Guthaben' },
];

/**
 * Sparrechner:
 * - mode 'endkapital' (Standard): Endkapital aus Startkapital, Sparrate, Zins und Dauer
 * - mode 'sparrate': benötigte monatliche Sparrate für ein Sparziel
 * - mode 'dauer': Spardauer bis zum Sparziel bei fester Sparrate
 * Zinsen werden monatlich gutgeschrieben (Monatszins = Jahreszins ÷ 12).
 * Optional netIncome > 0: Sparquote der (eingegebenen oder berechneten) Sparrate.
 */
export function calculateSparplan(inputs: Record<string, any>): CalculationResult {
  const mode: 'endkapital' | 'sparrate' | 'dauer' =
    inputs.mode === 'sparrate' || inputs.mode === 'dauer' ? inputs.mode : 'endkapital';
  const timing: 'start' | 'end' = inputs.depositTiming === 'start' ? 'start' : 'end';

  if (mode === 'endkapital') {
    const base = calculateCompoundInterest({
      initialAmount: inputs.initialAmount,
      monthlyContribution: inputs.monthlyContribution,
      annualRate: inputs.annualRate,
      years: inputs.years,
      depositTiming: timing,
      dynamicIncrease: inputs.dynamicIncrease,
      inflationRate: inputs.inflationRate,
      compoundFrequency: '12',
    });
    if (base.error) return base;
    const monthly = isBlankValue(inputs.monthlyContribution) ? 0 : parseNum(inputs.monthlyContribution);
    const quote = savingsQuoteItems(monthly, inputs.netIncome);
    if (quote.error) return { primary: { ...base.primary, value: 0, formattedValue: '–', highlight: false }, error: quote.error };
    return {
      ...base,
      secondary: [...(base.secondary || []), ...quote.items],
      directAnswer: `Endkapital: ${base.primary.formattedValue}.`,
      ...(quote.warning ? { warning: quote.warning } : {}),
    };
  }

  const primaryId = mode === 'sparrate' ? 'monthlyRate' : 'duration';
  const primaryLabel = mode === 'sparrate' ? 'Benötigte monatliche Sparrate' : 'Benötigte Spardauer';
  const fail = (message: string): CalculationResult => ({
    primary: { id: primaryId, label: primaryLabel, value: 0, formattedValue: '–' },
    error: message,
  });

  if (isBlankValue(inputs.targetAmount)) return fail('Bitte geben Sie Ihr Sparziel ein.');
  const target = parseNum(inputs.targetAmount);
  if (!Number.isFinite(target) || target <= 0) return fail('Das Sparziel muss größer als 0 € sein.');

  const initial = isBlankValue(inputs.initialAmount) ? 0 : parseNum(inputs.initialAmount);
  if (!Number.isFinite(initial) || initial < 0) return fail('Das Startkapital darf nicht negativ sein.');

  if (isBlankValue(inputs.annualRate)) return fail('Bitte geben Sie den Zinssatz ein (0 % für Sparen ohne Zinsen).');
  const ratePct = parseNum(inputs.annualRate);
  if (!Number.isFinite(ratePct) || ratePct < 0) return fail('Der Zinssatz darf nicht negativ sein.');
  if (ratePct > 100) return fail('Bitte prüfen Sie den Zinssatz. Werte über 100 % sind nicht plausibel.');
  const r = ratePct / 100 / 12;
  const timingText = timing === 'start' ? 'zum Monatsanfang' : 'zum Monatsende';

  if (mode === 'sparrate') {
    if (isBlankValue(inputs.years)) return fail('Bitte geben Sie an, in wie vielen Jahren Sie das Ziel erreichen möchten.');
    const years = parseNum(inputs.years);
    if (!Number.isFinite(years) || !Number.isInteger(years) || years < 1 || years > 100) {
      return fail('Die Spardauer muss zwischen 1 und 100 ganzen Jahren liegen.');
    }
    const n = years * 12;
    const growth = Math.pow(1 + r, n);
    const startValue = initial * growth;
    const factor = r === 0 ? n : ((growth - 1) / r) * (timing === 'start' ? 1 + r : 1);
    const monthly = startValue >= target ? 0 : (target - startValue) / factor;
    const sim = simulateSavings(initial, monthly, r, n, timing);
    const deposits = initial + monthly * n;
    const interestGain = sim.balance - deposits;

    const quote = savingsQuoteItems(monthly, inputs.netIncome);
    if (quote.error) return fail(quote.error);

    const secondary: SavingsItem[] = [
      { id: 'target', label: 'Sparziel', value: target, formattedValue: formatCurrency(target) },
      { id: 'totalDeposits', label: 'Eigene Einzahlungen', value: deposits, formattedValue: formatCurrency(deposits) },
      { id: 'interestGain', label: 'Zinsen bis zum Ziel', value: interestGain, formattedValue: formatCurrency(interestGain) },
      { id: 'endBalance', label: `Guthaben nach ${years} ${years === 1 ? 'Jahr' : 'Jahren'}`, value: sim.balance, formattedValue: formatCurrency(sim.balance) },
    ];
    if (initial > 0) {
      secondary.push({ id: 'startCapitalGrowth', label: 'Davon aus dem Startkapital', value: startValue, formattedValue: formatCurrency(startValue) });
    }
    secondary.push(...quote.items);

    const summary = monthly === 0
      ? `Ihr Startkapital von ${formatCurrency(initial)} wächst bei ${formatPercent(ratePct)} Zinsen in ${years} Jahren auf ${formatCurrency(startValue)}. Das Sparziel von ${formatCurrency(target)} erreichen Sie ohne weitere Sparrate.`
      : `Um in ${years} Jahren ${formatCurrency(target)} zu erreichen, sparen Sie ${formatCurrency(monthly)} im Monat (${timingText}, ${formatPercent(ratePct)} Zinsen p.a.). Sie zahlen ${formatCurrency(deposits)} selbst ein, ${formatCurrency(interestGain)} kommen aus Zinsen.`;

    return {
      primary: { id: 'monthlyRate', label: primaryLabel, value: monthly, formattedValue: formatCurrency(monthly), highlight: true },
      secondary,
      breakdown: { columns: SAVINGS_COLUMNS, rows: sim.rows },
      summaryText: summary,
      directAnswer: `Benötigte Sparrate: ${formatCurrency(monthly)} pro Monat.`,
      calculationSteps: [
        `Monatszins: ${formatPercent(ratePct)} ÷ 12 = ${formatNumber(r * 100, 4)} %`,
        `Startkapital nach ${n} Monaten: ${formatCurrency(initial)} × (1 + i)^${n} = ${formatCurrency(startValue)}`,
        r === 0
          ? `Sparrate = (Ziel − Startkapital) ÷ ${n} Monate = ${formatCurrency(monthly)}`
          : `Sparrate = (Ziel − Startkapital-Endwert) × i ÷ ((1 + i)^${n} − 1)${timing === 'start' ? ' ÷ (1 + i)' : ''} = ${formatCurrency(monthly)}`,
      ],
      ...(quote.warning ? { warning: quote.warning } : {}),
    };
  }

  // mode === 'dauer'
  const monthly = isBlankValue(inputs.monthlyContribution) ? 0 : parseNum(inputs.monthlyContribution);
  if (!Number.isFinite(monthly) || monthly < 0) return fail('Die monatliche Sparrate darf nicht negativ sein.');

  const quote = savingsQuoteItems(monthly, inputs.netIncome);
  if (quote.error) return fail(quote.error);

  if (initial >= target) {
    return {
      primary: { id: 'duration', label: primaryLabel, value: 0, formattedValue: '0 Monate (Ziel bereits erreicht)', highlight: true },
      secondary: [
        { id: 'target', label: 'Sparziel', value: target, formattedValue: formatCurrency(target) },
        { id: 'totalDeposits', label: 'Eigene Einzahlungen', value: initial, formattedValue: formatCurrency(initial) },
        ...quote.items,
      ],
      summaryText: `Ihr Startkapital von ${formatCurrency(initial)} deckt das Sparziel von ${formatCurrency(target)} bereits.`,
      directAnswer: 'Das Sparziel ist mit dem Startkapital bereits erreicht.',
    };
  }
  if (monthly === 0 && (r === 0 || initial === 0)) {
    return fail('Ohne Sparrate wächst das Guthaben nicht bis zum Ziel. Bitte geben Sie eine monatliche Sparrate ein.');
  }

  const MAX_MONTHS = 1200;
  let balance = initial;
  let months = 0;
  while (balance < target - 1e-9 && months < MAX_MONTHS) {
    months++;
    balance = timing === 'start' ? (balance + monthly) * (1 + r) : balance * (1 + r) + monthly;
  }
  if (balance < target - 1e-9) {
    return fail('Mit dieser Sparrate dauert es länger als 100 Jahre. Erhöhen Sie die Sparrate oder das Startkapital.');
  }

  const sim = simulateSavings(initial, monthly, r, months, timing);
  const deposits = initial + monthly * months;
  const interest = sim.balance - deposits;

  const secondary: SavingsItem[] = [
    { id: 'months', label: 'Anzahl Monate', value: months, formattedValue: `${months} Monate` },
    { id: 'endBalance', label: `Guthaben nach ${months} Monaten`, value: sim.balance, formattedValue: formatCurrency(sim.balance) },
    { id: 'totalDeposits', label: 'Eigene Einzahlungen', value: deposits, formattedValue: formatCurrency(deposits) },
    { id: 'interest', label: 'Zinsen bis zum Ziel', value: interest, formattedValue: formatCurrency(interest) },
    ...quote.items,
  ];

  return {
    primary: { id: 'duration', label: primaryLabel, value: months, formattedValue: `${formatMonthsDe(months)} (${months} Monate)`, highlight: true },
    secondary,
    breakdown: { columns: SAVINGS_COLUMNS, rows: sim.rows },
    summaryText: `Mit ${formatCurrency(monthly)} im Monat (${timingText}) und ${formatPercent(ratePct)} Zinsen erreichen Sie ${formatCurrency(target)} nach ${formatMonthsDe(months)}. Dann liegen ${formatCurrency(sim.balance)} auf dem Konto, davon ${formatCurrency(interest)} Zinsen.`,
    directAnswer: `Spardauer: ${formatMonthsDe(months)} (${months} Monate).`,
    calculationSteps: [
      `Monatszins: ${formatPercent(ratePct)} ÷ 12 = ${formatNumber(r * 100, 4)} %`,
      `Guthaben Monat für Monat: Guthaben × (1 + i) + Sparrate, bis das Ziel von ${formatCurrency(target)} erreicht ist`,
      `Erreicht nach ${months} Monaten mit ${formatCurrency(sim.balance)}`,
    ],
    ...(quote.warning ? { warning: quote.warning } : {}),
  };
}
