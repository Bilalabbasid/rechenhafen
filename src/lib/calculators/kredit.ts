import { CalculationResult, CalculationBreakdownRow } from '@/types/calculator';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';

export function calculateInstallmentLoan(inputs: Record<string, any>): CalculationResult {
  if (inputs.loanAmount === undefined || inputs.loanAmount === null || inputs.loanAmount === '') {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen Kreditbetrag ein.',
    };
  }
  const loanAmount = parseFloat(inputs.loanAmount);
  if (isNaN(loanAmount) || loanAmount <= 0) {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen positiven Kreditbetrag über 0 € an.',
    };
  }

  if (inputs.annualInterest === undefined || inputs.annualInterest === null || inputs.annualInterest === '') {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie den Zinssatz an.',
    };
  }
  const rawInterest = parseFloat(inputs.annualInterest);
  if (isNaN(rawInterest) || rawInterest < 0) {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie einen gültigen Zinssatz ab 0 % an.',
    };
  }
  const annualInterest = rawInterest / 100;

  const termVal = inputs.term !== undefined && inputs.term !== '' ? inputs.term : inputs.termMonths;
  if (termVal === undefined || termVal === null || termVal === '') {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie die gewünschte Kreditlaufzeit an.',
    };
  }
  const rawTerm = parseFloat(termVal);
  if (isNaN(rawTerm) || rawTerm <= 0 || !Number.isInteger(rawTerm)) {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Bitte geben Sie eine gültige Laufzeit in vollen Zeiteinheiten an.',
    };
  }
  const termUnit = inputs.termUnit || 'months'; // 'months' vs 'years'
  const termMonths = termUnit === 'years' ? rawTerm * 12 : rawTerm;

  const rawSpecial = inputs.sondertilgung !== undefined && inputs.sondertilgung !== '' ? parseFloat(inputs.sondertilgung) : 0;
  if (isNaN(rawSpecial) || rawSpecial < 0) {
    return {
      primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '-' },
      error: 'Die Sondertilgung darf nicht negativ sein.',
    };
  }
  const annualSpecialRepayment = Math.max(0, rawSpecial);

  let monthlyRateInterest = 0;
  let monthlyPayment = 0;

  if (annualInterest === 0) {
    monthlyRateInterest = 0;
    monthlyPayment = loanAmount / termMonths;
  } else if (inputs.isEffectiveRate || inputs.useEffectiveRate) {
    // Effektiver Jahreszins: r = (1 + annualEffectiveRate)^(1/12) - 1
    monthlyRateInterest = Math.pow(1 + annualInterest, 1 / 12) - 1;
    monthlyPayment = loanAmount * (monthlyRateInterest / (1 - Math.pow(1 + monthlyRateInterest, -termMonths)));
  } else {
    // Nominaler Sollzins p.a.
    monthlyRateInterest = annualInterest / 12;
    const q = 1 + monthlyRateInterest;
    const qPow = Math.pow(q, termMonths);
    monthlyPayment = loanAmount * ((qPow * (q - 1)) / (qPow - 1));
  }

  // Tilgungsplan (Jahresbasis) unter Berücksichtigung von Ratenrundung & Sondertilgungen
  const rows: CalculationBreakdownRow[] = [];
  let remainingDebt = loanAmount;
  let accumulatedInterest = 0;
  let accumulatedRepayment = 0;
  let actualMonths = 0;

  const totalYears = Math.ceil(termMonths / 12);
  let currentMonth = 1;

  for (let year = 1; year <= totalYears && remainingDebt > 0.005; year++) {
    let yearInterest = 0;
    let yearRepayment = 0;

    for (let m = 0; m < 12 && currentMonth <= termMonths && remainingDebt > 0.005; m++, currentMonth++) {
      actualMonths++;
      const interestForMonth = monthlyRateInterest === 0 ? 0 : remainingDebt * monthlyRateInterest;
      
      let repaymentForMonth: number;
      if (currentMonth === termMonths || annualSpecialRepayment === 0 && remainingDebt <= monthlyPayment) {
        // Letzter Monat: Tilgung gleicht Restschuld exakt aus
        repaymentForMonth = remainingDebt;
      } else {
        repaymentForMonth = Math.min(remainingDebt, monthlyPayment - interestForMonth);
      }

      yearInterest += interestForMonth;
      yearRepayment += repaymentForMonth;
      remainingDebt = Math.max(0, remainingDebt - repaymentForMonth);

      // Sondertilgung am Jahresende (Monat 12, 24, ...)
      if (m === 11 && annualSpecialRepayment > 0 && remainingDebt > 0.005) {
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
  const rawLoan = inputs.loanAmount !== undefined && inputs.loanAmount !== null && String(inputs.loanAmount).trim() !== ''
    ? parseFloat(inputs.loanAmount)
    : 200000;
  const loanAmount = !isNaN(rawLoan) ? rawLoan : 200000;

  const rawInterest = inputs.annualInterest !== undefined && inputs.annualInterest !== null && String(inputs.annualInterest).trim() !== ''
    ? parseFloat(inputs.annualInterest)
    : 3.5;
  const annualInterest = (!isNaN(rawInterest) ? Math.max(0, rawInterest) : 3.5) / 100;

  const rawRepayment = inputs.initialRepayment !== undefined && inputs.initialRepayment !== null && String(inputs.initialRepayment).trim() !== ''
    ? parseFloat(inputs.initialRepayment)
    : 2.0;
  const initialRepayment = (!isNaN(rawRepayment) ? Math.max(0, rawRepayment) : 2.0) / 100;

  const rawYears = inputs.fixedYears !== undefined && inputs.fixedYears !== null && String(inputs.fixedYears).trim() !== ''
    ? parseInt(inputs.fixedYears, 10)
    : 10;
  const fixedYears = !isNaN(rawYears) && rawYears > 0 ? rawYears : 10;

  if (loanAmount <= 0) {
    return {
      primary: { id: 'rate', label: 'Monatliche Annuität', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte eine Darlehenssumme größer als 0 € eingeben.',
    };
  }

  if (annualInterest + initialRepayment <= 0) {
    return {
      primary: { id: 'rate', label: 'Monatliche Annuität', value: 0, formattedValue: '0,00 €' },
      error: 'Zinssatz und anfängliche Tilgung können nicht beide 0 % sein.',
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
  const rawLoan = inputs.loanAmount !== undefined && inputs.loanAmount !== null && String(inputs.loanAmount).trim() !== ''
    ? parseFloat(inputs.loanAmount)
    : 200000;
  const loanAmount = !isNaN(rawLoan) ? rawLoan : 200000;

  const rawInterest = inputs.annualInterest !== undefined && inputs.annualInterest !== null && String(inputs.annualInterest).trim() !== ''
    ? parseFloat(inputs.annualInterest)
    : 3.8;
  const interestRate = (!isNaN(rawInterest) ? Math.max(0, rawInterest) : 3.8) / 100;

  const rawPayment = inputs.monthlyPayment !== undefined && inputs.monthlyPayment !== null && String(inputs.monthlyPayment).trim() !== ''
    ? parseFloat(inputs.monthlyPayment)
    : 1000;
  const monthlyPayment = !isNaN(rawPayment) ? rawPayment : 1000;

  const rawSpecial = inputs.yearlySpecialRepayment !== undefined && inputs.yearlySpecialRepayment !== null && String(inputs.yearlySpecialRepayment).trim() !== ''
    ? parseFloat(inputs.yearlySpecialRepayment)
    : 5000;
  const yearlySpecial = !isNaN(rawSpecial) ? Math.max(0, rawSpecial) : 5000;

  if (loanAmount <= 0) {
    return {
      primary: { id: 'saved', label: 'Zinsersparnis', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte eine Darlehenssumme größer als 0 € eingeben.',
    };
  }

  const monthlyInterestCost = loanAmount * (interestRate / 12);
  if (monthlyPayment <= monthlyInterestCost) {
    return {
      primary: { id: 'saved', label: 'Zinsersparnis', value: 0, formattedValue: '0,00 €' },
      error: 'Die monatliche Rate muss höher sein als die reinen Zinskosten, um das Darlehen zu tilgen.',
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
    const repMonth = Math.min(debtWith, monthlyPayment - intMonth);
    debtWith -= repMonth;

    // Einmal jährlich im 12. Monat Sondertilgung
    if (monthsWith % 12 === 0 && debtWith > 0 && yearlySpecial > 0) {
      const special = Math.min(debtWith, yearlySpecial);
      debtWith -= special;
    }
  }

  const interestSaved = Math.max(0, interestWithout - interestWith);
  const timeSavedMonths = Math.max(0, monthsWithout - monthsWith);
  const timeSavedYears = (timeSavedMonths / 12).toFixed(1);

  const summary = yearlySpecial > 0 && timeSavedMonths > 0
    ? `Durch die jährliche Sondertilgung von ${formatCurrency(yearlySpecial)} sparen Sie insgesamt ${formatCurrency(interestSaved)} Zinskosten und sind ${timeSavedYears} Jahre früher schuldenfrei.`
    : `Ohne jährliche Sondertilgung (0 €) beträgt die reguläre Laufzeit ca. ${(monthsWithout / 12).toFixed(1)} Jahre bei Gesamtzinskosten von ${formatCurrency(interestWithout)}.`;

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
    summaryText: summary,
  };
}

// ---------------------------------------------------------------------------
// Gemeinsame Helfer für Ratenkredit- und Tilgungsrechner
// ---------------------------------------------------------------------------

function isBlankInput(v: any): boolean {
  return v === undefined || v === null || String(v).trim() === '';
}

function toNum(v: any): number {
  if (typeof v === 'number') return v;
  return parseFloat(String(v).trim().replace(',', '.'));
}

function isOn(v: any): boolean {
  return v === true || v === 'true' || v === 1 || v === '1';
}

/** "6 Jahre und 7 Monate" – deutsche Laufzeitangabe aus Monaten. */
export function formatMonthsGerman(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const yText = `${y} ${y === 1 ? 'Jahr' : 'Jahre'}`;
  const mText = `${m} ${m === 1 ? 'Monat' : 'Monate'}`;
  if (y > 0 && m > 0) return `${yText} und ${mText}`;
  if (y > 0) return yText;
  return mText;
}

/** Konstante Monatsrate, die einen Kredit bis auf die Schlussrate B tilgt (B = 0: Volltilgung). */
function annuityPayment(loan: number, r: number, months: number, balloon = 0): number {
  if (r === 0) return (loan - balloon) / months;
  const v = Math.pow(1 + r, -months);
  return ((loan - balloon * v) * r) / (1 - v);
}

interface LoanSimulation {
  months: number;
  finished: boolean;
  totalInterest: number;
  totalRegularPayments: number;
  totalSpecial: number;
  lastPayment: number;
  rows: CalculationBreakdownRow[];
}

/**
 * Monatliche Tilgungssimulation mit konstanter Rate, optionaler jährlicher Sondertilgung
 * (jeweils nach Monat 12, 24, …) und optionaler Schlussrate. Die Schlussrate wird mit der
 * letzten Rate fällig und erscheint in der letzten Zeile des Tilgungsplans.
 */
function simulateLoan(
  loan: number,
  r: number,
  payment: number,
  balloon: number,
  special: number,
  maxMonths: number,
  scheduledMonths?: number,
): LoanSimulation {
  let rest = loan;
  let months = 0;
  let totalInterest = 0;
  let totalRegularPayments = 0;
  let totalSpecial = 0;
  let lastPayment = payment;
  let yearInterest = 0;
  let yearRepayment = 0;
  const rows: CalculationBreakdownRow[] = [];

  while (rest - balloon > 0.005 && months < maxMonths) {
    months++;
    const interest = rest * r;
    let principal = payment - interest;
    let paid = payment;
    const isScheduledEnd = scheduledMonths !== undefined && months === scheduledMonths;
    if (isScheduledEnd || rest - principal <= balloon + 0.005) {
      principal = rest - balloon;
      paid = principal + interest;
    }
    rest -= principal;
    totalInterest += interest;
    totalRegularPayments += paid;
    yearInterest += interest;
    yearRepayment += principal;
    lastPayment = paid;

    if (months % 12 === 0 && special > 0 && rest - balloon > 0.005) {
      const s = Math.min(special, rest - balloon);
      rest -= s;
      totalSpecial += s;
      yearRepayment += s;
    }

    const done = rest - balloon <= 0.005;
    if (months % 12 === 0 || done) {
      const year = Math.ceil(months / 12);
      const withBalloon = done && balloon > 0;
      rows.push({
        period: withBalloon ? `Jahr ${year} (inkl. Schlussrate)` : `Jahr ${year}`,
        values: {
          interestYear: formatCurrency(yearInterest),
          repaymentYear: formatCurrency(yearRepayment + (withBalloon ? balloon : 0)),
          remaining: formatCurrency(done ? 0 : rest),
        },
      });
      yearInterest = 0;
      yearRepayment = 0;
    }
  }

  return {
    months,
    finished: rest - balloon <= 0.005,
    totalInterest,
    totalRegularPayments,
    totalSpecial,
    lastPayment,
    rows,
  };
}

const MAX_LOAN_MONTHS = 600;

/**
 * Ratenkreditrechner mit zwei Modi:
 * - mode 'rate' (Standard): Monatsrate aus Kreditbetrag, Zins und Laufzeit
 * - mode 'laufzeit': Laufzeit aus Kreditbetrag, Zins und Wunschrate
 * Optional (showExtras = true): Anzahlung, Schlussrate (Ballon) und jährliche Sondertilgung.
 * rateType 'effective' (Standard) rechnet den effektiven Jahreszins exponentiell in einen
 * Monatszins um, rateType 'nominal' teilt den Sollzins durch 12.
 */
export function calculateRatenkredit(inputs: Record<string, any>): CalculationResult {
  const mode: 'rate' | 'laufzeit' = inputs.mode === 'laufzeit' ? 'laufzeit' : 'rate';
  const primaryId = mode === 'rate' ? 'monthlyRate' : 'term';
  const primaryLabel = mode === 'rate' ? 'Monatliche Rate' : 'Laufzeit bis zur Tilgung';
  const fail = (message: string): CalculationResult => ({
    primary: { id: primaryId, label: primaryLabel, value: 0, formattedValue: '–' },
    error: message,
  });

  if (isBlankInput(inputs.loanAmount)) return fail('Bitte geben Sie den Kreditbetrag ein.');
  const amount = toNum(inputs.loanAmount);
  if (!Number.isFinite(amount) || amount <= 0) return fail('Bitte geben Sie einen Kreditbetrag über 0 € ein.');

  const extras = isOn(inputs.showExtras);
  let downPayment = 0;
  let balloon = 0;
  let special = 0;
  if (extras) {
    downPayment = isBlankInput(inputs.downPayment) ? 0 : toNum(inputs.downPayment);
    if (!Number.isFinite(downPayment) || downPayment < 0) return fail('Die Anzahlung darf nicht negativ sein.');
    balloon = isBlankInput(inputs.balloonPayment) ? 0 : toNum(inputs.balloonPayment);
    if (!Number.isFinite(balloon) || balloon < 0) return fail('Die Schlussrate darf nicht negativ sein.');
    special = isBlankInput(inputs.sondertilgung) ? 0 : toNum(inputs.sondertilgung);
    if (!Number.isFinite(special) || special < 0) return fail('Die Sondertilgung darf nicht negativ sein.');
  }

  const loan = amount - downPayment;
  if (loan <= 0) return fail('Die Anzahlung deckt den gesamten Betrag. Es bleibt nichts zu finanzieren.');
  if (balloon >= loan) {
    return fail(`Die Schlussrate muss kleiner sein als der finanzierte Betrag von ${formatCurrency(loan)}.`);
  }

  if (isBlankInput(inputs.annualInterest)) return fail('Bitte geben Sie den Zinssatz ein (0 % für ein zinsloses Darlehen).');
  const interestPct = toNum(inputs.annualInterest);
  if (!Number.isFinite(interestPct) || interestPct < 0) return fail('Der Zinssatz darf nicht negativ sein.');
  if (interestPct > 100) return fail('Bitte prüfen Sie den Zinssatz. Werte über 100 % sind nicht plausibel.');

  const rateType: 'effective' | 'nominal' = inputs.rateType === 'nominal' ? 'nominal' : 'effective';
  const i = interestPct / 100;
  const r = i === 0 ? 0 : rateType === 'effective' ? Math.pow(1 + i, 1 / 12) - 1 : i / 12;
  const rateTypeLabel = rateType === 'effective' ? 'effektiver Jahreszins' : 'Sollzins';

  let payment: number;
  let scheduledMonths: number | undefined;

  if (mode === 'rate') {
    if (isBlankInput(inputs.termMonths)) return fail('Bitte geben Sie die Laufzeit in Monaten ein.');
    const n = toNum(inputs.termMonths);
    if (!Number.isFinite(n) || n < 1 || !Number.isInteger(n)) {
      return fail('Bitte geben Sie die Laufzeit in ganzen Monaten ein (mindestens 1 Monat).');
    }
    if (n > MAX_LOAN_MONTHS) return fail('Die Laufzeit darf höchstens 600 Monate (50 Jahre) betragen.');
    scheduledMonths = n;
    payment = annuityPayment(loan, r, n, balloon);
  } else {
    if (isBlankInput(inputs.monthlyPayment)) return fail('Bitte geben Sie Ihre gewünschte Monatsrate ein.');
    payment = toNum(inputs.monthlyPayment);
    if (!Number.isFinite(payment) || payment <= 0) return fail('Die Monatsrate muss größer als 0 € sein.');
    const firstInterest = loan * r;
    if (payment <= firstInterest + 1e-9) {
      return fail(
        `Die Rate muss höher sein als die Zinsen im ersten Monat (${formatCurrency(firstInterest)}). Sonst sinkt die Restschuld nicht.`,
      );
    }
  }

  const sim = simulateLoan(loan, r, payment, balloon, special, MAX_LOAN_MONTHS, scheduledMonths);
  if (!sim.finished) {
    return fail('Mit dieser Rate dauert die Tilgung länger als 50 Jahre. Bitte erhöhen Sie die Monatsrate.');
  }

  const totalPayment = sim.totalRegularPayments + sim.totalSpecial + balloon;
  const interestShare = (sim.totalInterest / loan) * 100;
  const secondary: Array<{ id: string; label: string; value: number; formattedValue: string }> = [];

  if (mode === 'laufzeit') {
    secondary.push({ id: 'monthlyRate', label: 'Monatliche Rate', value: payment, formattedValue: formatCurrency(payment) });
    secondary.push({ id: 'numberOfPayments', label: 'Anzahl Monatsraten', value: sim.months, formattedValue: `${sim.months} Raten` });
    if (Math.abs(sim.lastPayment - payment) > 0.01) {
      secondary.push({ id: 'lastPayment', label: 'Letzte (kleinere) Rate', value: sim.lastPayment, formattedValue: formatCurrency(sim.lastPayment) });
    }
  }

  secondary.push(
    { id: 'totalInterest', label: 'Gesamtzinsen', value: sim.totalInterest, formattedValue: formatCurrency(sim.totalInterest) },
    { id: 'totalPayment', label: 'Gesamtkosten (alle Zahlungen)', value: totalPayment, formattedValue: formatCurrency(totalPayment) },
    { id: 'interestShare', label: 'Zinsen im Verhältnis zum Kreditbetrag', value: interestShare, formattedValue: formatPercent(interestShare, 1) },
    { id: 'loanAmount', label: 'Finanzierter Betrag (Nettodarlehen)', value: loan, formattedValue: formatCurrency(loan) },
  );

  if (downPayment > 0) {
    secondary.push({ id: 'downPayment', label: 'Anzahlung', value: downPayment, formattedValue: formatCurrency(downPayment) });
  }

  if (balloon > 0) {
    secondary.push({ id: 'balloon', label: 'Schlussrate am Ende', value: balloon, formattedValue: formatCurrency(balloon) });
    if (mode === 'rate' && scheduledMonths !== undefined) {
      const paymentWithoutBalloon = annuityPayment(loan, r, scheduledMonths, 0);
      const simNoBalloon = simulateLoan(loan, r, paymentWithoutBalloon, 0, special, MAX_LOAN_MONTHS, scheduledMonths);
      const balloonExtraInterest = sim.totalInterest - simNoBalloon.totalInterest;
      secondary.push(
        { id: 'rateWithoutBalloon', label: 'Rate ohne Schlussrate (Vergleich)', value: paymentWithoutBalloon, formattedValue: formatCurrency(paymentWithoutBalloon) },
        { id: 'balloonExtraInterest', label: 'Mehrzinsen durch die Schlussrate', value: balloonExtraInterest, formattedValue: formatCurrency(balloonExtraInterest) },
      );
    }
  }

  if (mode === 'rate' && special > 0 && scheduledMonths !== undefined) {
    const simNoSpecial = simulateLoan(loan, r, payment, balloon, 0, MAX_LOAN_MONTHS, scheduledMonths);
    const monthsSaved = scheduledMonths - sim.months;
    const interestSaved = simNoSpecial.totalInterest - sim.totalInterest;
    secondary.push(
      { id: 'actualTerm', label: 'Tatsächliche Laufzeit mit Sondertilgung', value: sim.months, formattedValue: `${formatMonthsGerman(sim.months)} (${sim.months} Monate)` },
      { id: 'timeSaved', label: 'Früher schuldenfrei', value: monthsSaved, formattedValue: `${monthsSaved} ${monthsSaved === 1 ? 'Monat' : 'Monate'}` },
      { id: 'interestSaved', label: 'Zinsersparnis durch Sondertilgung', value: interestSaved, formattedValue: formatCurrency(interestSaved) },
    );
  }

  if (r > 0) {
    const equivalent = rateType === 'effective' ? r * 12 * 100 : (Math.pow(1 + r, 12) - 1) * 100;
    secondary.push({
      id: 'equivalentRate',
      label: rateType === 'effective' ? 'Entspricht einem Sollzins von' : 'Entspricht einem effektiven Jahreszins von',
      value: equivalent,
      formattedValue: `${formatPercent(equivalent, 2)} p.a.`,
    });
  }

  const loanText = downPayment > 0
    ? `${formatCurrency(loan)} (${formatCurrency(amount)} abzüglich ${formatCurrency(downPayment)} Anzahlung)`
    : formatCurrency(loan);
  const balloonText = balloon > 0 ? ` Am Ende ist zusätzlich eine Schlussrate von ${formatCurrency(balloon)} fällig.` : '';

  let primaryValue: number;
  let primaryFormatted: string;
  let summary: string;
  let directAnswer: string;
  if (mode === 'rate') {
    primaryValue = payment;
    primaryFormatted = formatCurrency(payment);
    summary = `Für ${loanText} zu ${formatPercent(interestPct)} (${rateTypeLabel}) über ${scheduledMonths} Monate zahlen Sie ${formatCurrency(payment)} im Monat.${balloonText} Die Zinsen summieren sich auf ${formatCurrency(sim.totalInterest)}, alle Zahlungen zusammen auf ${formatCurrency(totalPayment)}.`;
    if (special > 0 && scheduledMonths !== undefined && sim.months < scheduledMonths) {
      summary += ` Mit ${formatCurrency(special)} Sondertilgung pro Jahr ist der Kredit nach ${sim.months} statt ${scheduledMonths} Monaten getilgt.`;
    }
    directAnswer = `Monatsrate: ${formatCurrency(payment)}, Gesamtzinsen: ${formatCurrency(sim.totalInterest)}.`;
  } else {
    primaryValue = sim.months;
    primaryFormatted = `${formatMonthsGerman(sim.months)} (${sim.months} Monate)`;
    summary = `Mit ${formatCurrency(payment)} im Monat ist ${loanText} bei ${formatPercent(interestPct)} (${rateTypeLabel}) nach ${formatMonthsGerman(sim.months)} getilgt.${balloonText} Bis dahin zahlen Sie ${formatCurrency(sim.totalInterest)} Zinsen.`;
    directAnswer = `Laufzeit: ${formatMonthsGerman(sim.months)} (${sim.months} Raten), Gesamtzinsen: ${formatCurrency(sim.totalInterest)}.`;
  }

  const steps: string[] = [
    rateType === 'effective'
      ? `Monatszins aus dem effektiven Jahreszins: (1 + ${formatNumber(i, 4)})^(1/12) − 1 = ${formatNumber(r * 100, 4)} %`
      : `Monatszins aus dem Sollzins: ${formatPercent(interestPct)} ÷ 12 = ${formatNumber(r * 100, 4)} %`,
    `Finanzierter Betrag: ${formatCurrency(loan)}`,
  ];
  if (mode === 'rate') {
    steps.push(
      balloon > 0
        ? `Rate = (K − Schlussrate × (1 + i)^−n) × i ÷ (1 − (1 + i)^−n) mit n = ${scheduledMonths} = ${formatCurrency(payment)}`
        : `Rate = K × i ÷ (1 − (1 + i)^−n) mit n = ${scheduledMonths} = ${formatCurrency(payment)}`,
    );
  } else {
    steps.push(`Tilgung Monat für Monat, bis die Restschuld${balloon > 0 ? ' auf die Schlussrate' : ''} gesunken ist: ${sim.months} Raten`);
  }
  steps.push(`Gesamtzinsen = alle Zahlungen − finanzierter Betrag = ${formatCurrency(totalPayment)} − ${formatCurrency(loan)} = ${formatCurrency(sim.totalInterest)}`);

  return {
    primary: { id: primaryId, label: primaryLabel, value: primaryValue, formattedValue: primaryFormatted, highlight: true },
    secondary,
    breakdown: {
      columns: [
        { key: 'repaymentYear', label: 'Getilgt' },
        { key: 'interestYear', label: 'Zinsen' },
        { key: 'remaining', label: 'Restschuld am Jahresende' },
      ],
      rows: sim.rows,
    },
    summaryText: summary,
    directAnswer,
    calculationSteps: steps,
  };
}

/**
 * Tilgungsrechner für Annuitätendarlehen (Baufinanzierung).
 * - tilgungMode 'anfangstilgung' (Standard): Rate = Darlehen × (Sollzins + anfängliche Tilgung) ÷ 12
 * - tilgungMode 'volltilger': Rate so, dass das Darlehen am Ende der Zinsbindung vollständig getilgt ist
 * Optional (useFinancing = true): Darlehensbetrag = Kaufpreis + Kaufnebenkosten − Eigenkapital.
 */
export function calculateTilgungsplan(inputs: Record<string, any>): CalculationResult {
  const mode: 'anfangstilgung' | 'volltilger' = inputs.tilgungMode === 'volltilger' ? 'volltilger' : 'anfangstilgung';
  const fail = (message: string): CalculationResult => ({
    primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: 0, formattedValue: '–' },
    error: message,
  });

  const useFinancing = isOn(inputs.useFinancing);
  let loan: number;
  let price = 0;
  let sideCosts = 0;
  let equity = 0;

  if (useFinancing) {
    if (isBlankInput(inputs.purchasePrice)) return fail('Bitte geben Sie den Kaufpreis der Immobilie ein.');
    price = toNum(inputs.purchasePrice);
    if (!Number.isFinite(price) || price <= 0) return fail('Der Kaufpreis muss größer als 0 € sein.');
    if (isBlankInput(inputs.sideCostsPct)) return fail('Bitte geben Sie die Kaufnebenkosten in Prozent ein (0 %, wenn keine anfallen).');
    const sidePct = toNum(inputs.sideCostsPct);
    if (!Number.isFinite(sidePct) || sidePct < 0 || sidePct > 30) return fail('Die Kaufnebenkosten müssen zwischen 0 und 30 % liegen.');
    equity = isBlankInput(inputs.equity) ? 0 : toNum(inputs.equity);
    if (!Number.isFinite(equity) || equity < 0) return fail('Das Eigenkapital darf nicht negativ sein.');
    sideCosts = (price * sidePct) / 100;
    loan = price + sideCosts - equity;
    if (loan <= 0) return fail('Ihr Eigenkapital deckt Kaufpreis und Nebenkosten. Es ist kein Darlehen nötig.');
  } else {
    if (isBlankInput(inputs.loanAmount)) return fail('Bitte geben Sie den Darlehensbetrag ein.');
    loan = toNum(inputs.loanAmount);
    if (!Number.isFinite(loan) || loan <= 0) return fail('Bitte geben Sie einen Darlehensbetrag über 0 € ein.');
  }

  if (isBlankInput(inputs.annualInterest)) return fail('Bitte geben Sie den Sollzins ein (0 % für ein zinsloses Darlehen).');
  const interestPct = toNum(inputs.annualInterest);
  if (!Number.isFinite(interestPct) || interestPct < 0) return fail('Der Sollzins darf nicht negativ sein.');
  if (interestPct > 100) return fail('Bitte prüfen Sie den Sollzins. Werte über 100 % sind nicht plausibel.');

  if (isBlankInput(inputs.fixedYears)) return fail('Bitte geben Sie die Zinsbindung in Jahren ein.');
  const years = toNum(inputs.fixedYears);
  if (!Number.isFinite(years) || !Number.isInteger(years) || years < 1 || years > 50) {
    return fail('Die Zinsbindung muss zwischen 1 und 50 ganzen Jahren liegen.');
  }

  const i = interestPct / 100;
  const r = i / 12;
  const n = years * 12;

  let payment: number;
  let initialRepaymentPct: number;
  if (mode === 'volltilger') {
    payment = annuityPayment(loan, r, n, 0);
    initialRepaymentPct = ((payment * 12) / loan) * 100 - interestPct;
  } else {
    if (isBlankInput(inputs.initialRepayment)) return fail('Bitte geben Sie die anfängliche Tilgung in Prozent ein.');
    initialRepaymentPct = toNum(inputs.initialRepayment);
    if (!Number.isFinite(initialRepaymentPct) || initialRepaymentPct <= 0) return fail('Die anfängliche Tilgung muss größer als 0 % sein.');
    if (initialRepaymentPct > 100) return fail('Die anfängliche Tilgung darf höchstens 100 % betragen.');
    payment = (loan * (i + initialRepaymentPct / 100)) / 12;
  }

  // Monatliche Simulation: Zinsbindung für den Tilgungsplan, danach weiter mit gleichem Zins
  // bis zur vollständigen Tilgung (nur zur Orientierung für die Gesamtlaufzeit).
  const MAX_MONTHS = 1200;
  let rest = loan;
  let month = 0;
  let interestFixed = 0;
  let repaidFixed = 0;
  let restAtFixedEnd = 0;
  let totalInterestAll = 0;
  let yearInterest = 0;
  let yearRepayment = 0;
  const rows: CalculationBreakdownRow[] = [];

  while (rest > 0.005 && month < MAX_MONTHS) {
    month++;
    const interest = rest * r;
    let principal = payment - interest;
    if (principal >= rest || (mode === 'volltilger' && month === n)) principal = rest;
    rest -= principal;
    totalInterestAll += interest;
    if (month <= n) {
      interestFixed += interest;
      repaidFixed += principal;
      yearInterest += interest;
      yearRepayment += principal;
      if (month % 12 === 0 || rest <= 0.005) {
        rows.push({
          period: `Jahr ${Math.ceil(month / 12)}`,
          values: {
            interestYear: formatCurrency(yearInterest),
            repaymentYear: formatCurrency(yearRepayment),
            remaining: formatCurrency(rest <= 0.005 ? 0 : rest),
          },
        });
        yearInterest = 0;
        yearRepayment = 0;
      }
      if (month === n) restAtFixedEnd = rest <= 0.005 ? 0 : rest;
    }
  }
  const payoffMonths = rest <= 0.005 ? month : null;
  if (payoffMonths !== null && payoffMonths < n) restAtFixedEnd = 0;

  const secondary: Array<{ id: string; label: string; value: number; formattedValue: string }> = [
    { id: 'remainingDebt', label: `Restschuld nach ${years} Jahren Zinsbindung`, value: restAtFixedEnd, formattedValue: formatCurrency(restAtFixedEnd) },
    { id: 'repaid', label: `Getilgt in ${years} Jahren`, value: repaidFixed, formattedValue: formatCurrency(repaidFixed) },
    { id: 'interest', label: `Zinsen in ${years} Jahren`, value: interestFixed, formattedValue: formatCurrency(interestFixed) },
    {
      id: 'initialRepaymentPct',
      label: mode === 'volltilger' ? 'Nötige anfängliche Tilgung' : 'Anfängliche Tilgung',
      value: initialRepaymentPct,
      formattedValue: `${formatPercent(initialRepaymentPct, 2)} p.a.`,
    },
    {
      id: 'totalTerm',
      label: 'Gesamtlaufzeit bis schuldenfrei (bei gleichem Zins)',
      value: payoffMonths ?? MAX_MONTHS,
      formattedValue: payoffMonths !== null ? formatMonthsGerman(payoffMonths) : 'über 100 Jahre',
    },
  ];
  if (payoffMonths !== null) {
    secondary.push({
      id: 'totalInterestAll',
      label: 'Zinsen bis schuldenfrei (bei gleichem Zins)',
      value: totalInterestAll,
      formattedValue: formatCurrency(totalInterestAll),
    });
  }

  const warnings: string[] = [];
  secondary.push({ id: 'loanAmount', label: 'Darlehensbetrag', value: loan, formattedValue: formatCurrency(loan) });
  if (useFinancing) {
    const loanToPrice = (loan / price) * 100;
    secondary.push(
      { id: 'sideCosts', label: 'Kaufnebenkosten', value: sideCosts, formattedValue: formatCurrency(sideCosts) },
      { id: 'totalCost', label: 'Kaufpreis plus Nebenkosten', value: price + sideCosts, formattedValue: formatCurrency(price + sideCosts) },
      { id: 'loanToPrice', label: 'Darlehen im Verhältnis zum Kaufpreis', value: loanToPrice, formattedValue: formatPercent(loanToPrice, 1) },
    );
    if (loan > price + 0.005) {
      warnings.push(
        `Sie finanzieren ${formatPercent(loanToPrice, 1)} des Kaufpreises, also auch Nebenkosten. Dafür verlangen Banken in der Regel einen Zinsaufschlag. Rechnen Sie mit dem Sollzins aus Ihrem konkreten Angebot.`,
      );
    }
  }
  if (payoffMonths === null || payoffMonths > 40 * 12) {
    warnings.push('Bei dieser Tilgung dauert die Rückzahlung über 40 Jahre. Eine höhere anfängliche Tilgung senkt Laufzeit und Zinskosten deutlich.');
  }

  const loanText = useFinancing
    ? `${formatCurrency(loan)} (Kaufpreis ${formatCurrency(price)} + ${formatCurrency(sideCosts)} Nebenkosten − ${formatCurrency(equity)} Eigenkapital)`
    : formatCurrency(loan);
  const summary = mode === 'volltilger'
    ? `Damit ${loanText} bei ${formatPercent(interestPct)} Sollzins nach ${years} Jahren vollständig getilgt ist, brauchen Sie ${formatCurrency(payment)} im Monat. Das entspricht einer anfänglichen Tilgung von ${formatPercent(initialRepaymentPct, 2)}. Die Zinsen betragen insgesamt ${formatCurrency(interestFixed)}.`
    : `Bei ${loanText}, ${formatPercent(interestPct)} Sollzins und ${formatPercent(initialRepaymentPct, 2)} anfänglicher Tilgung zahlen Sie ${formatCurrency(payment)} im Monat. Nach ${years} Jahren Zinsbindung bleibt eine Restschuld von ${formatCurrency(restAtFixedEnd)}${payoffMonths !== null ? `; bei gleichem Zins wären Sie nach ${formatMonthsGerman(payoffMonths)} schuldenfrei` : ''}.`;

  const steps: string[] = mode === 'volltilger'
    ? [
        `Monatszins: ${formatPercent(interestPct)} ÷ 12 = ${formatNumber(r * 100, 4)} %`,
        `Rate = K × i ÷ (1 − (1 + i)^−n) mit n = ${n} Monaten = ${formatCurrency(payment)}`,
        `Anfängliche Tilgung = Rate × 12 ÷ K − Sollzins = ${formatPercent(initialRepaymentPct, 2)}`,
      ]
    : [
        `Jahresrate = ${formatCurrency(loan)} × (${formatPercent(interestPct)} + ${formatPercent(initialRepaymentPct, 2)}) = ${formatCurrency(payment * 12)}`,
        `Monatsrate = Jahresrate ÷ 12 = ${formatCurrency(payment)}`,
        `Restschuld nach ${n} Monaten (monatliche Zinsverrechnung): ${formatCurrency(restAtFixedEnd)}`,
      ];

  return {
    primary: { id: 'monthlyRate', label: 'Monatliche Rate', value: payment, formattedValue: formatCurrency(payment), highlight: true },
    secondary,
    breakdown: {
      columns: [
        { key: 'interestYear', label: 'Zinsen' },
        { key: 'repaymentYear', label: 'Tilgung' },
        { key: 'remaining', label: 'Restschuld am Jahresende' },
      ],
      rows,
    },
    summaryText: summary,
    directAnswer: `Monatsrate: ${formatCurrency(payment)}, Restschuld nach ${years} Jahren: ${formatCurrency(restAtFixedEnd)}.`,
    calculationSteps: steps,
    ...(warnings.length > 0 ? { warning: warnings.join(' ') } : {}),
  };
}
