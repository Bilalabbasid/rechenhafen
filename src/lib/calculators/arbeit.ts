import { CalculationResult } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export function calculateHourlyWage(inputs: Record<string, any>): CalculationResult {
  const monthlySalary = parseFloat(inputs.monthlySalary) || 3500;
  const weeklyHours = parseFloat(inputs.weeklyHours) || 40;

  if (monthlySalary <= 0 || weeklyHours <= 0) {
    return {
      primary: { id: 'hourlyWage', label: 'Stundenlohn', value: 0, formattedValue: '0,00 €/Std.' },
      error: 'Monatsgehalt und Wochenarbeitszeit müssen positiv sein.',
    };
  }

  // Offizielle deutsche Standardformel nach EntgFG / ArbZG:
  // 3 Monate haben 13 Wochen -> Durchschnittliche Monatsstunden = (Wochenstunden * 13) / 3
  const avgMonthlyHours = (weeklyHours * 13) / 3;
  const hourlyWage = monthlySalary / avgMonthlyHours;
  const yearlySalary = monthlySalary * 12;

  return {
    primary: {
      id: 'hourlyWage',
      label: 'Brutto-Stundenlohn',
      value: hourlyWage,
      formattedValue: `${formatCurrency(hourlyWage)} / Std.`,
      highlight: true,
    },
    secondary: [
      { id: 'avgHours', label: 'Durchschnittliche Arbeitsstunden pro Monat', value: avgMonthlyHours, formattedValue: `${formatNumber(avgMonthlyHours, 2)} Std.` },
      { id: 'monthlySalary', label: 'Monatsgehalt (brutto)', value: monthlySalary, formattedValue: formatCurrency(monthlySalary) },
      { id: 'yearlySalary', label: 'Jahresgehalt (12 Monate)', value: yearlySalary, formattedValue: formatCurrency(yearlySalary) },
      { id: 'dailyWage', label: 'Tagessatz (bei 8-Std.-Tag)', value: hourlyWage * 8, formattedValue: formatCurrency(hourlyWage * 8) },
    ],
    summaryText: `Bei einem Monatsgehalt von ${formatCurrency(monthlySalary)} und einer ${weeklyHours}-Stunden-Woche beträgt Ihr Brutto-Stundenlohn nach der amtlichen 13-Wochen-Formel ${formatCurrency(hourlyWage)}.`,
  };
}

export function calculatePartTimeSalary(inputs: Record<string, any>): CalculationResult {
  const fullTimeSalary = parseFloat(inputs.fullTimeSalary) || 4000;
  const fullTimeHours = parseFloat(inputs.fullTimeHours) || 40;
  const partTimeHours = parseFloat(inputs.partTimeHours) || 28;

  if (fullTimeSalary <= 0 || fullTimeHours <= 0 || partTimeHours <= 0) {
    return {
      primary: { id: 'partTimeSalary', label: 'Teilzeitgehalt', value: 0, formattedValue: '0,00 €' },
      error: 'Bitte gültige Werte angeben.',
    };
  }

  const partTimeSalary = fullTimeSalary * (partTimeHours / fullTimeHours);
  const diffSalary = fullTimeSalary - partTimeSalary;
  const quotaPercent = (partTimeHours / fullTimeHours) * 100;

  return {
    primary: {
      id: 'partTimeSalary',
      label: 'Teilzeit-Gehalt (brutto)',
      value: partTimeSalary,
      formattedValue: formatCurrency(partTimeSalary),
      highlight: true,
    },
    secondary: [
      { id: 'quota', label: 'Teilzeit-Quote', value: quotaPercent, formattedValue: formatPercent(quotaPercent, 1) },
      { id: 'difference', label: 'Brutto-Differenz zu Vollzeit', value: diffSalary, formattedValue: formatCurrency(diffSalary) },
      { id: 'hourlyWage', label: 'Stundenlohn (bleibt identisch)', value: (fullTimeSalary * 3) / (fullTimeHours * 13), formattedValue: `${formatCurrency((fullTimeSalary * 3) / (fullTimeHours * 13))} / Std.` },
    ],
    summaryText: `Bei einer Reduzierung von ${fullTimeHours} auf ${partTimeHours} Wochenstunden (${formatPercent(quotaPercent, 1)} Teilzeit) beläuft sich das Bruttogehalt auf ${formatCurrency(partTimeSalary)} (Differenz: ${formatCurrency(diffSalary)}).`,
  };
}

export function calculateSalaryIncrease(inputs: Record<string, any>): CalculationResult {
  const currentSalary = parseFloat(inputs.currentSalary) || 3500;
  const increasePercent = parseFloat(inputs.increasePercent) || 5.0;
  const monthsPerYear = parseInt(inputs.monthsPerYear || '12', 10);

  if (currentSalary <= 0) {
    return {
      primary: { id: 'newSalary', label: 'Neues Gehalt', value: 0, formattedValue: '0,00 €' },
      error: 'Aktuelles Gehalt muss positiv sein.',
    };
  }

  const monthlyPlus = currentSalary * (increasePercent / 100);
  const newMonthlySalary = currentSalary + monthlyPlus;
  const yearlyPlus = monthlyPlus * monthsPerYear;
  const newYearlySalary = newMonthlySalary * monthsPerYear;

  return {
    primary: {
      id: 'newMonthly',
      label: 'Neues Monatsgehalt (brutto)',
      value: newMonthlySalary,
      formattedValue: formatCurrency(newMonthlySalary),
      highlight: true,
    },
    secondary: [
      { id: 'monthlyPlus', label: 'Monatliches Plus (brutto)', value: monthlyPlus, formattedValue: `+${formatCurrency(monthlyPlus)}` },
      { id: 'yearlyPlus', label: `Jährliches Plus (${monthsPerYear} Gehälter)`, value: yearlyPlus, formattedValue: `+${formatCurrency(yearlyPlus)}` },
      { id: 'newYearly', label: 'Neues Jahresgehalt', value: newYearlySalary, formattedValue: formatCurrency(newYearlySalary) },
    ],
    summaryText: `Eine Gehaltserhöhung um ${formatPercent(increasePercent, 1)} steigert Ihr Monatsgehalt von ${formatCurrency(currentSalary)} auf ${formatCurrency(newMonthlySalary)} (+${formatCurrency(monthlyPlus)}/Monat, +${formatCurrency(yearlyPlus)}/Jahr).`,
  };
}

export function calculateVacationDays(inputs: Record<string, any>): CalculationResult {
  const standardDays = parseFloat(inputs.standardDays) || 30; // Urlaubstage bei Vollzeit
  const workdaysPerWeek = parseFloat(inputs.workdaysPerWeek) || 3; // Tatsächliche Arbeitstage pro Woche
  const standardWeekDays = parseFloat(inputs.standardWeekDays) || 5; // Übliche Woche

  if (standardDays <= 0 || workdaysPerWeek <= 0) {
    return {
      primary: { id: 'vacationDays', label: 'Urlaubsanspruch', value: 0, formattedValue: '0 Tage' },
      error: 'Bitte positive Werte angeben.',
    };
  }

  // Gesetzliche Formel nach § 3 Bundesurlaubsgesetz (BUrlG):
  // Urlaubstage = (Vereinbarte Urlaubstage / Vollzeit-Arbeitstage) * tatsächliche Arbeitstage
  const entitlement = (standardDays / standardWeekDays) * workdaysPerWeek;

  return {
    primary: {
      id: 'entitlement',
      label: 'Individueller Urlaubsanspruch',
      value: entitlement,
      formattedValue: `${formatNumber(entitlement, 1)} Urlaubstage`,
      highlight: true,
    },
    secondary: [
      { id: 'weeks', label: 'Wochen freie Zeit', value: entitlement / workdaysPerWeek, formattedValue: `${formatNumber(entitlement / workdaysPerWeek, 1)} Wochen Urlaub` },
      { id: 'legalMin', label: 'Gesetzlicher Mindesturlaub (§ 3 BUrlG)', value: (20 / 5) * workdaysPerWeek, formattedValue: `${(20 / 5) * workdaysPerWeek} Tage (bei 4 Wochen)` },
    ],
    summaryText: `Bei ${workdaysPerWeek} Arbeitstagen pro Woche und einem betrieblichen Vollzeitanspruch von ${standardDays} Tagen (bei 5-Tage-Woche) haben Sie Anspruch auf ${formatNumber(entitlement, 1)} Urlaubstage. Dies entspricht genau ${formatNumber(entitlement / workdaysPerWeek, 1)} vollen Wochen Erholungsurlaub.`,
  };
}
