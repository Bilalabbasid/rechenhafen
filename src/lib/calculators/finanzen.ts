import { CalculationResult, CalculationBreakdownRow } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateCompoundInterest(inputs: Record<string, any>): CalculationResult {
  const initial = parseFloat(inputs.initialAmount) || 0;
  const initialMonthly = parseFloat(inputs.monthlyContribution) || 0;
  const rateAnnual = (parseFloat(inputs.annualRate) || 0) / 100;
  const years = parseInt(inputs.years || '10', 10);
  const compoundFreq = Math.max(1, parseInt(inputs.compoundFrequency || '12', 10)); // 1, 2, 4, 12
  const depositTiming = inputs.depositTiming || 'end'; // 'end' = nachschüssig, 'start' = vorschüssig
  const dynamicRatePercent = parseFloat(inputs.dynamicIncrease || '0') / 100; // jährliche Sparratendynamik
  const inflationRatePercent = parseFloat(inputs.inflationRate || '0') / 100; // optionale Inflationsbereinigung

  if (years <= 0) {
    return {
      primary: { id: 'endAmount', label: 'Endkapital', value: initial, formattedValue: formatCurrency(initial) },
      error: 'Die Laufzeit muss mindestens 1 Jahr betragen.',
    };
  }

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
  const target = parseFloat(inputs.targetAmount) || 50000;
  const initial = parseFloat(inputs.initialAmount) || 0;
  const rateAnnual = (parseFloat(inputs.annualRate) || 0) / 100;
  const years = parseInt(inputs.years || '10', 10);

  if (target <= initial) {
    return {
      primary: { id: 'monthly', label: 'Monatliche Sparrate', value: 0, formattedValue: '0,00 €' },
      summaryText: 'Das Startkapital deckt das Sparziel bereits ab.',
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
  const amount = parseFloat(inputs.amount) || 10000;
  const inflationRate = (parseFloat(inputs.inflationRate) || 2.5) / 100;
  const years = parseInt(inputs.years || '10', 10);

  if (years <= 0 || amount <= 0) {
    return {
      primary: { id: 'futurePurchasingPower', label: 'Kaufkraft', value: amount, formattedValue: formatCurrency(amount) },
      error: 'Betrag und Laufzeit müssen größer als null sein.',
    };
  }

  // Zukünftige Kaufkraft des heutigen Geldes
  const futurePurchasingPower = amount / Math.pow(1 + inflationRate, years);
  const lossInEuros = amount - futurePurchasingPower;
  const lossPercent = (lossInEuros / amount) * 100;

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
  const initial = parseFloat(inputs.initialInvestment) || 10000;
  const finalVal = parseFloat(inputs.finalValue) || 16000;
  const years = parseFloat(inputs.years) || 5;

  if (initial <= 0) {
    return {
      primary: { id: 'totalReturn', label: 'Rendite', value: 0, formattedValue: '0 %' },
      error: 'Die Anfangsinvestition muss positiv sein.',
    };
  }

  const profit = finalVal - initial;
  const totalReturnPercent = (profit / initial) * 100;
  
  let cagr = 0;
  if (years > 0 && finalVal > 0) {
    cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
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
  const rent = parseFloat(inputs.rent) || 800;
  const living = parseFloat(inputs.livingExpenses) || 400;
  const insurance = parseFloat(inputs.insurance) || 150;
  const other = parseFloat(inputs.other) || 150;
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
