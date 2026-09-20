import { CalculationResult, CalculationBreakdownRow } from '@/types/calculator';
import { formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateInstallmentLoan(inputs: Record<string, any>): CalculationResult {
  const loanAmount = parseFloat(inputs.loanAmount) || 10000;
  const annualInterest = (parseFloat(inputs.annualInterest) || 4.5) / 100;
  const termMonths = parseInt(inputs.termMonths || '48', 10);

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

  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  // Tilgungsplan (Jahresbasis)
  const rows: CalculationBreakdownRow[] = [];
  let remainingDebt = loanAmount;
  let accumulatedInterest = 0;
  let accumulatedRepayment = 0;

  const totalYears = Math.ceil(termMonths / 12);
  let currentMonth = 1;

  for (let year = 1; year <= totalYears; year++) {
    let yearInterest = 0;
    let yearRepayment = 0;

    for (let m = 0; m < 12 && currentMonth <= termMonths; m++, currentMonth++) {
      const interestForMonth = remainingDebt * monthlyRateInterest;
      const repaymentForMonth = Math.min(remainingDebt, monthlyPayment - interestForMonth);

      yearInterest += interestForMonth;
      yearRepayment += repaymentForMonth;
      remainingDebt = Math.max(0, remainingDebt - repaymentForMonth);
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

  return {
    primary: {
      id: 'monthlyRate',
      label: 'Monatliche Kreditrate',
      value: monthlyPayment,
      formattedValue: formatCurrency(monthlyPayment),
      highlight: true,
    },
    secondary: [
      { id: 'totalInterest', label: 'Gesamtzinskosten', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
      { id: 'totalPayment', label: 'Gesamtbetrag Rückzahlung', value: totalPayment, formattedValue: formatCurrency(totalPayment) },
      { id: 'loanAmount', label: 'Nettodarlehensbetrag', value: loanAmount, formattedValue: formatCurrency(loanAmount) },
    ],
    breakdown: {
      columns: [
        { key: 'repaymentYear', label: 'Getilgter Betrag' },
        { key: 'interestYear', label: 'Gezahlte Zinsen' },
        { key: 'remaining', label: 'Restschuld am Jahresende' },
      ],
      rows,
    },
    summaryText: `Für einen Nettokredit von ${formatCurrency(loanAmount)} mit ${formatPercent(annualInterest * 100)} Zinsen zahlen Sie bei ${termMonths} Monaten Laufzeit eine feste Rate von ${formatCurrency(monthlyPayment)} pro Monat. Die Gesamtzinsen belaufen sich auf ${formatCurrency(totalInterest)}.`,
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
