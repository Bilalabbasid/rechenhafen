import { CalculationResult, CalculationBreakdownRow } from '@/types/calculator';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateInstallmentLoan(inputs: Record<string, any>): CalculationResult {
  const loanAmount = parseFloat(inputs.loanAmount) || 10000;
  const annualInterest = (parseFloat(inputs.annualInterest) || 4.5) / 100;
  const rawTerm = parseInt(inputs.term || inputs.termMonths || '48', 10);
  const termUnit = inputs.termUnit || 'months'; // 'months' vs 'years'
  const termMonths = termUnit === 'years' ? rawTerm * 12 : rawTerm;
  const annualSpecialRepayment = Math.max(0, parseFloat(inputs.sondertilgung || '0'));

  if (loanAmount <= 0 || termMonths <= 0) {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte geben Sie einen positiven Kreditbetrag und eine gültige Laufzeit an.',
    };
  }

  const monthlyRateInterest = annualInterest / 12;
  let monthlyPayment = 0;

  if (monthlyRateInterest === 0) {
    monthlyPayment = loanAmount / termMonths;
  } else {
    // Annuitätenformel: R = K * (q^n * (q - 1)) / (q^n - 1)
    const q = 1 + monthlyRateInterest;
    const qPow = Math.pow(q, termMonths);
    monthlyPayment = loanAmount * ((qPow * (q - 1)) / (qPow - 1));
  }

  // Tilgungsplan (Jahresbasis) unter Berücksichtigung von Sondertilgungen
  const rows: CalculationBreakdownRow[] = [];
  let remainingDebt = loanAmount;
  let accumulatedInterest = 0;
  let accumulatedRepayment = 0;
  let actualMonths = 0;

  const totalYears = Math.ceil(termMonths / 12);
  let currentMonth = 1;

  for (let year = 1; year <= totalYears && remainingDebt > 0.01; year++) {
    let yearInterest = 0;
    let yearRepayment = 0;

    for (let m = 0; m < 12 && currentMonth <= termMonths && remainingDebt > 0.01; m++, currentMonth++) {
      actualMonths++;
      const interestForMonth = remainingDebt * monthlyRateInterest;
      const repaymentForMonth = Math.min(remainingDebt, monthlyPayment - interestForMonth);

      yearInterest += interestForMonth;
      yearRepayment += repaymentForMonth;
      remainingDebt = Math.max(0, remainingDebt - repaymentForMonth);

      // Sondertilgung am Jahresende (Monat 12, 24, ...)
      if (m === 11 && annualSpecialRepayment > 0 && remainingDebt > 0.01) {
        const actualSpecial = Math.min(remainingDebt, annualSpecialRepayment);
        yearRepayment += actualSpecial;
        remainingDebt = Math.max(0, remainingDebt - actualSpecial);
      }
    }

    accumulatedInterest += yearInterest;
    accumulatedRepayment += yearRepayment;

    rows.push({
      period: `Jahr ${year}`,
      values: {
        interestYear: formatCurrency(yearInterest),
        repaymentYear: formatCurrency(yearRepayment),
        remaining: formatCurrency(remainingDebt),
      },
    });
  }

  const totalPayment = accumulatedRepayment + accumulatedInterest;
  const secondary: Array<{ id: string; label: string; value: any; formattedValue: string }> = [
    { id: 'totalInterest', label: 'Gesamtzinskosten', value: accumulatedInterest, formattedValue: formatCurrency(accumulatedInterest) },
    { id: 'totalPayment', label: 'Gesamtbetrag Rückzahlung', value: totalPayment, formattedValue: formatCurrency(totalPayment) },
    { id: 'loanAmount', label: 'Nettodarlehensbetrag', value: loanAmount, formattedValue: formatCurrency(loanAmount) },
    { id: 'actualTerm', label: 'Tatsächliche Laufzeit', value: actualMonths, formattedValue: `${actualMonths} Monate (${(actualMonths / 12).toFixed(1)} Jahre)` },
  ];

  if (annualSpecialRepayment > 0) {
    const monthsSaved = termMonths - actualMonths;
    if (monthsSaved > 0) {
      secondary.unshift({
        id: 'timeSaved',
        label: 'Ersparte Laufzeit durch Sondertilgung',
        value: monthsSaved,
        formattedValue: `${monthsSaved} Monate schneller schuldenfrei`,
      });
    }
  }

  let summary = `Für einen Nettokredit von ${formatCurrency(loanAmount)} mit ${formatPercent(annualInterest * 100)} Zinsen zahlen Sie bei regulär ${termMonths} Monaten Laufzeit eine monatliche Rate von ${formatCurrency(monthlyPayment)}. Die Gesamtzinsen belaufen sich auf ${formatCurrency(accumulatedInterest)}.`;
  if (annualSpecialRepayment > 0 && actualMonths < termMonths) {
    summary += ` Durch die jährliche Sondertilgung von ${formatCurrency(annualSpecialRepayment)} sind Sie bereits nach ${actualMonths} Monaten (${termMonths - actualMonths} Monate früher) schuldenfrei.`;
  }

  return {
    primary: {
      id: 'monthlyRate',
      label: 'Monatliche Kreditrate',
      value: monthlyPayment,
      formattedValue: formatCurrency(monthlyPayment),
      highlight: true,
    },
    secondary,
    breakdown: {
      columns: [
        { key: 'repaymentYear', label: 'Getilgter Betrag' },
        { key: 'interestYear', label: 'Gezahlte Zinsen' },
        { key: 'remaining', label: 'Restschuld am Jahresende' },
      ],
      rows,
    },
    summaryText: summary,
  };
}

export function calculateAnnuity(inputs: Record<string, any>): CalculationResult {
  const loanAmount = parseFloat(inputs.loanAmount) || 200000;
  const annualInterest = (parseFloat(inputs.annualInterest) || 3.5) / 100;
  const initialRepayment = (parseFloat(inputs.initialRepayment) || 2.0) / 100;
  const fixedYears = parseInt(inputs.fixedYears || '10', 10);

  if (loanAmount <= 0) {
    return {
      primary: { id: 'rate', label: 'Monatliche Annuität', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte Darlehenssumme eingeben.',
    };
  }

  // Jährliche Annuität = K * (Zins + Tilgung)
  const annualRate = loanAmount * (annualInterest + initialRepayment);
  const monthlyRate = annualRate / 12;

  // Restschuld nach fixedYears
  let remaining = loanAmount;
  const monthlyInterestRate = annualInterest / 12;

  for (let m = 0; m < fixedYears * 12; m++) {
    const interestPart = remaining * monthlyInterestRate;
    const repaymentPart = monthlyRate - interestPart;
    remaining = Math.max(0, remaining - repaymentPart);
  }

  const paidTotalInFixedPeriod = monthlyRate * fixedYears * 12;
  const repaidInFixedPeriod = loanAmount - remaining;
  const interestInFixedPeriod = paidTotalInFixedPeriod - repaidInFixedPeriod;

  return {
    primary: {
      id: 'monthlyRate',
      label: 'Monatliche Darlehensrate',
      value: monthlyRate,
      formattedValue: formatCurrency(monthlyRate),
      highlight: true,
    },
    secondary: [
      { id: 'remainingDebt', label: `Restschuld nach ${fixedYears} Jahren Zinsbindung`, value: remaining, formattedValue: formatCurrency(remaining) },
      { id: 'repaid', label: `Getilgt in ${fixedYears} Jahren`, value: repaidInFixedPeriod, formattedValue: formatCurrency(repaidInFixedPeriod) },
      { id: 'interest', label: `Zinskosten in ${fixedYears} Jahren`, value: interestInFixedPeriod, formattedValue: formatCurrency(interestInFixedPeriod) },
    ],
    summaryText: `Bei ${formatCurrency(loanAmount)} Darlehen, ${formatPercent(annualInterest * 100)} Zins und ${formatPercent(initialRepayment * 100)} Anfangstilgung beträgt die monatliche Rate ${formatCurrency(monthlyRate)}. Nach der ${fixedYears}-jährigen Zinsbindung verbleibt eine Restschuld von ${formatCurrency(remaining)}.`,
  };
}

export function calculateSpecialRepayment(inputs: Record<string, any>): CalculationResult {
  const loanAmount = parseFloat(inputs.loanAmount) || 200000;
  const interestRate = (parseFloat(inputs.annualInterest) || 3.5) / 100;
  const monthlyPayment = parseFloat(inputs.monthlyPayment) || 1000;
  const yearlySpecial = parseFloat(inputs.yearlySpecialRepayment) || 5000;

  if (loanAmount <= 0 || monthlyPayment <= (loanAmount * (interestRate / 12))) {
    return {
      primary: { id: 'saved', label: 'Zinsersparnis', value: 0, formattedValue: '0,00 €' },
      error: 'Die monatliche Rate muss höher sein als die reinen Zinskosten, um zu tilgen.',
    };
  }

  // Simulation OHNE Sondertilgung
  let debtWithout = loanAmount;
  let monthsWithout = 0;
  let interestWithout = 0;
  const rMonthly = interestRate / 12;

  while (debtWithout > 0 && monthsWithout < 600) {
    monthsWithout++;
    const intMonth = debtWithout * rMonthly;
    interestWithout += intMonth;
    const repMonth = Math.min(debtWithout, monthlyPayment - intMonth);
    debtWithout -= repMonth;
  }

  // Simulation MIT Sondertilgung
  let debtWith = loanAmount;
  let monthsWith = 0;
  let interestWith = 0;

  while (debtWith > 0 && monthsWith < 600) {
    monthsWith++;
    const intMonth = debtWith * rMonthly;
    interestWith += intMonth;
    let repMonth = Math.min(debtWith, monthlyPayment - intMonth);
    debtWith -= repMonth;

    // Einmal jährlich im 12. Monat Sondertilgung
    if (monthsWith % 12 === 0 && debtWith > 0) {
      const special = Math.min(debtWith, yearlySpecial);
      debtWith -= special;
    }
  }

  const interestSaved = Math.max(0, interestWithout - interestWith);
  const timeSavedMonths = Math.max(0, monthsWithout - monthsWith);
  const timeSavedYears = (timeSavedMonths / 12).toFixed(1);

  return {
    primary: {
      id: 'saved',
      label: 'Gesamte Zinsersparnis',
      value: interestSaved,
      formattedValue: formatCurrency(interestSaved),
      highlight: true,
    },
    secondary: [
      { id: 'timeSaved', label: 'Laufzeitverkürzung', value: timeSavedMonths, formattedValue: `${timeSavedYears} Jahre früher schuldenfrei (${timeSavedMonths} Monate)` },
      { id: 'newDuration', label: 'Neue Gesamtlaufzeit', value: monthsWith, formattedValue: `${(monthsWith / 12).toFixed(1)} Jahre` },
      { id: 'oldDuration', label: 'Ursprüngliche Laufzeit', value: monthsWithout, formattedValue: `${(monthsWithout / 12).toFixed(1)} Jahre` },
    ],
    summaryText: `Durch die jährliche Sondertilgung von ${formatCurrency(yearlySpecial)} sparen Sie insgesamt ${formatCurrency(interestSaved)} Zinskosten und sind ${timeSavedYears} Jahre früher schuldenfrei.`,
  };
}
