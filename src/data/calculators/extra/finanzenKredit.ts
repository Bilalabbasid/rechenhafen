import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_FINANZEN_KREDIT: CalculatorDefinition[] = [
  // ==================== FINANZEN (18) ====================
  {
    id: 'tagesgeld-rechner',
    slug: 'tagesgeld-rechner',
    name: 'Tagesgeld-Rechner (Zinsen & Zinsertrag)',
    shortName: 'Tagesgeld berechnen',
    category: 'finanzen',
    subcategory: 'Zinsen & Zinseszins',
    metaTitle: 'Tagesgeld Rechner – Zinsen & Zinsertrag online berechnen',
    metaDescription: 'Berechnen Sie Ihren Zinsertrag auf Tagesgeldkonten: Monatliche, vierteljährliche oder jährliche Zinsgutschrift mit Zinseszinseffekt.',
    h1: 'Tagesgeld Rechner (Zinsertrag & Zinsintervall)',
    shortDescription: 'Ermittelt die Zinserträge für Tagesgeldanlagen unter Berücksichtigung des Zinsgutschrift-Intervalls mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['tagesgeld rechner', 'tagesgeld zinsen berechnen', 'zinsertrag tagesgeld monatlich', 'zinseszins tagesgeld'],
    inputs: [
      { id: 'deposit', label: 'Anlagebetrag', type: 'number', defaultValue: 10000, min: 100, step: 500, unit: '€' },
      { id: 'rate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.5, min: 0.1, step: 0.1, unit: '%' },
      { id: 'months', label: 'Anlagedauer in Monaten', type: 'number', defaultValue: 12, min: 1, step: 1, unit: 'Monate' },
      {
        id: 'payout',
        label: 'Zinsgutschrift',
        type: 'select',
        defaultValue: 'quarterly',
        options: [
          { value: 'monthly', label: 'Monatlich (Zinseszinseffekt)' },
          { value: 'quarterly', label: 'Vierteljährlich (Standard)' },
          { value: 'annually', label: 'Jährlich' },
        ],
      },
    ],
    calculate: (inputs) => {
      const deposit = parseFloat(inputs.deposit) || 10000;
      const rate = parseFloat(inputs.rate) || 3.5;
      const months = parseInt(inputs.months, 10) || 12;
      const payout = inputs.payout || 'quarterly';
      let periodsPerYear = 4;
      if (payout === 'monthly') periodsPerYear = 12;
      if (payout === 'annually') periodsPerYear = 1;
      const totalPeriods = (months / 12) * periodsPerYear;
      const ratePerPeriod = (rate / 100) / periodsPerYear;
      const finalVal = deposit * Math.pow(1 + ratePerPeriod, totalPeriods);
      const interest = finalVal - deposit;
      return {
        primary: { id: 'interest', label: 'Gesamter Zinsertrag', value: interest, formattedValue: formatCurrency(interest), highlight: true },
        secondary: [
          { id: 'final', label: 'Endguthaben', value: finalVal, formattedValue: formatCurrency(finalVal) },
          { id: 'monthly', label: 'Zinsen pro Monat', value: interest / months, formattedValue: formatCurrency(interest / months) },
        ],
        summaryText: `Bei ${formatCurrency(deposit)} zu ${formatPercent(rate)} p.a. über ${months} Monate beträgt Ihr Zinsertrag ${formatCurrency(interest)}.`,
      };
    },
    formula: 'Zinsertrag = Anlagebetrag × (Zinssatz / 100) × (Tage / 360)',
    formulaExplanation: 'Deutsche Zinsmethode (30/360). Bei unterjähriger Zinsgutschrift greift der Zinseszins.',
    workedExample: {
      title: 'Beispiel: 10.000 € zu 3,5 % p.a. für 12 Monate (quartalsweise)',
      description: 'Zinsertrag ca. 354,62 € inklusive Zinseszins.',
      inputs: { deposit: 10000, rate: 3.5, months: 12, payout: 'quarterly' },
      resultSummary: 'ca. 354,62 € Zinsertrag',
    },
    content: {
      intro: 'Tagesgeld bietet tägliche Verfügbarkeit bei voller Einlagensicherung bis 100.000 € je Kunde und Bank nach EU-Recht.',
      details: 'Zinsertrag = Anlagebetrag · (Zinssatz / 100) · (Tage / 360) nach deutscher Zinsmethode. Bei vierteljährlicher oder monatlicher Zinsgutschrift entsteht ein spürbarer Zinseszinseffekt.',
    },
    faqs: [
      { question: 'Wie sicher ist Tagesgeld bei Banken in der EU?', answer: 'Über die gesetzliche Einlagensicherung (EdB in Deutschland) sind Einlagen bis 100.000 € pro Person und Kreditinstitut gesetzlich garantiert abgesichert.' },
      { question: 'Was ist der Unterschied zwischen Aktionszins und Bestandskundenzins?', answer: 'Banken locken Neukunden oft mit zeitlich befristeten Zinsgarantien (z. B. für 3 bis 6 Monate); danach fällt der Zins auf das variable Niveau für Bestandskunden zurück.' },
    ],
    relatedSlugs: ['liquiditaetsreserve-rechner', 'zinseszinsrechner', 'festgeld-rechner', 'etf-sparplan-rechner'],
  },
  {
    id: 'festgeld-rechner',
    slug: 'festgeld-rechner',
    name: 'Festgeld-Rechner (Feste Laufzeit & Zinsgarantie)',
    shortName: 'Festgeld berechnen',
    category: 'finanzen',
    subcategory: 'Zinsen & Zinseszins',
    metaTitle: 'Festgeld Rechner – Zinsertrag & Endkapital mit Zinsgarantie',
    metaDescription: 'Berechnen Sie den festen Zinsertrag auf Festgeldkonten für 1 bis 10 Jahre. Feste Zinsen ohne Schwankungsrisiko planen.',
    h1: 'Festgeld Rechner mit Zinsgarantie',
    shortDescription: 'Kalkuliert die garantierten Zinserträge und das Endkapital bei fest vereinbarter Laufzeit.',
    searchKeywords: ['festgeld rechner', 'festgeld zinsen berechnen', 'festgeldanlage endkapital', 'zinsgarantie rechner'],
    inputs: [
      { id: 'principal', label: 'Anlagebetrag', type: 'number', defaultValue: 15000, min: 500, step: 500, unit: '€' },
      { id: 'interestRate', label: 'Festzinssatz p.a.', type: 'number', defaultValue: 3.2, min: 0.1, step: 0.1, unit: '%' },
      { id: 'years', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 3, min: 1, max: 10, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 15000;
      const r = parseFloat(inputs.interestRate) || 3.2;
      const y = parseInt(inputs.years, 10) || 3;
      const endVal = p * Math.pow(1 + r / 100, y);
      const totalInterest = endVal - p;
      return {
        primary: { id: 'interest', label: 'Garantierter Zinsgewinn', value: totalInterest, formattedValue: formatCurrency(totalInterest), highlight: true },
        secondary: [
          { id: 'endVal', label: 'Auszahlungsbetrag nach Laufzeit', value: endVal, formattedValue: formatCurrency(endVal) },
          { id: 'perYear', label: 'Zins pro Jahr', value: totalInterest / y, formattedValue: formatCurrency(totalInterest / y) },
        ],
        summaryText: `Nach ${y} Jahren Festgeldanlage erhalten Sie insgesamt ${formatCurrency(endVal)} zurück (inklusive ${formatCurrency(totalInterest)} Zinsen).`,
      };
    },
    formula: 'Endkapital = K₀ × (1 + p/100)^n',
    formulaExplanation: 'Klassische Zinseszinsformel bei jährlicher Zinsgutschrift.',
    workedExample: {
      title: 'Beispiel: 15.000 € zu 3,2 % über 3 Jahre',
      description: 'Endkapital: 16.486,81 €. Reiner Zinsgewinn: 1.486,81 €.',
      inputs: { principal: 15000, interestRate: 3.2, years: 3 },
      resultSummary: '1.486,81 € Zinsgewinn',
    },
    content: {
      intro: 'Festgeld garantiert einen festen Zinssatz über eine fest vereinbarte Laufzeit (z. B. 6, 12, 24 oder 36 Monate) ohne Zinsänderungsrisiko.',
      details: 'Da das Kapital während der Laufzeit unkündbar gebunden ist, belohnen Banken Festgeld typischerweise mit planbaren Zinsen, die unabhängig von EZB-Zinssenkungen konstant bleiben.',
    },
    faqs: [
      { question: 'Kann man ein Festgeldkonto vor Ablauf der Laufzeit vorzeitig kündigen?', answer: 'Grundsätzlich nein. Nur in extremen Härtefällen (§ 314 BGB) stimmen Banken einer vorzeitigen Auflösung zu, meist unter vollständigem Verlust aller aufgelaufenen Zinsen.' },
      { question: 'Was ist die Festgeld-Treppen-Strategie?', answer: 'Man teilt das Sparvermögen auf mehrere Festgelder mit gestaffelten Laufzeiten (1, 2, 3 Jahre) auf; so wird jedes Jahr ein Teilbetrag fällig und liquide wiederanlegbar.' },
    ],
    relatedSlugs: ['tagesgeld-rechner', 'zinseszinsrechner', 'spardauer-rechner'],
  },
  {
    id: 'spardauer-rechner',
    slug: 'spardauer-rechner',
    name: 'Spardauer-Rechner (Dauer bis zum Sparziel)',
    shortName: 'Spardauer berechnen',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Spardauer Rechner – Dauer bis zum Sparziel berechnen',
    metaDescription: 'Berechnen Sie, wie viele Jahre und Monate Sie mit einer festen monatlichen Sparrate und Zinseszins sparen müssen, um Ihr Sparziel zu erreichen.',
    h1: 'Spardauer Rechner – Dauer bis zum Sparziel exakt ermitteln',
    shortDescription: 'Berechnet die exakte Spardauer in Jahren und Monaten, um mit einer regelmäßigen monatlichen Sparrate Ihr Sparziel zu erreichen.',
    searchKeywords: ['spardauer rechner', 'spardauer berechnen', 'wie lange muss ich sparen', 'dauer bis sparziel', 'sparzeit berechnen'],
    inputs: [
      { id: 'targetAmount', label: 'Gewünschtes Sparziel', type: 'number', defaultValue: 25000, min: 1000, step: 1000, unit: '€' },
      { id: 'monthlyContribution', label: 'Monatliche Sparrate', type: 'number', defaultValue: 350, min: 25, step: 25, unit: '€' },
      { id: 'initialCapital', label: 'Bereits vorhandenes Startkapital', type: 'number', defaultValue: 2000, min: 0, step: 500, unit: '€' },
      { id: 'expectedReturn', label: 'Erwartete Rendite / Zins p.a.', type: 'number', defaultValue: 4.0, min: 0, max: 15, step: 0.5, unit: '%' },
    ],
    calculate: (inputs) => {
      const target = parseFloat(inputs.targetAmount) || 25000;
      const monthly = parseFloat(inputs.monthlyContribution) || 350;
      const start = parseFloat(inputs.initialCapital) || 0;
      const ret = parseFloat(inputs.expectedReturn) || 0;

      if (start >= target) {
        return {
          primary: { id: 'duration', label: 'Benötigte Spardauer', value: 0, formattedValue: '0 Monate (Ziel bereits erreicht)', highlight: true },
          secondary: [
            { id: 'totalDeposits', label: 'Eigene Einzahlungen', value: start, formattedValue: formatCurrency(start) },
            { id: 'interest', label: 'Erwirtschaftete Zinsen', value: 0, formattedValue: formatCurrency(0) },
          ],
          summaryText: `Ihr Startkapital von ${formatCurrency(start)} deckt das gewünschte Sparziel von ${formatCurrency(target)} bereits vollständig ab.`,
        };
      }

      if (monthly <= 0) {
        return {
          primary: { id: 'duration', label: 'Benötigte Spardauer', value: 0, formattedValue: 'Nicht erreichbar', highlight: true },
          error: 'Die monatliche Sparrate muss größer als 0 € sein.',
        };
      }

      const r = (ret / 100) / 12;
      let totalMonths = 0;

      if (r > 0) {
        const num = target * r + monthly;
        const den = start * r + monthly;
        totalMonths = Math.ceil(Math.log(num / den) / Math.log(1 + r));
      } else {
        totalMonths = Math.ceil((target - start) / monthly);
      }

      const years = Math.floor(totalMonths / 12);
      const remainingMonths = totalMonths % 12;

      let durationText = '';
      if (years > 0 && remainingMonths > 0) {
        durationText = `${years} ${years === 1 ? 'Jahr' : 'Jahre'} und ${remainingMonths} ${remainingMonths === 1 ? 'Monat' : 'Monate'}`;
      } else if (years > 0) {
        durationText = `${years} ${years === 1 ? 'Jahr' : 'Jahre'}`;
      } else {
        durationText = `${remainingMonths} ${remainingMonths === 1 ? 'Monat' : 'Monate'}`;
      }

      const totalDeposited = start + (monthly * totalMonths);
      const totalInterest = Math.max(0, target - totalDeposited);

      return {
        primary: { id: 'duration', label: 'Benötigte Spardauer', value: totalMonths, formattedValue: `${durationText} (${totalMonths} Monate)`, highlight: true },
        secondary: [
          { id: 'totalDeposits', label: 'Eigene Einzahlungen insgesamt', value: totalDeposited, formattedValue: formatCurrency(totalDeposited) },
          { id: 'interest', label: 'Erwirtschaftete Zinsen/Rendite', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
          { id: 'totalMonths', label: 'Gesamtlaufzeit in Monaten', value: totalMonths, formattedValue: `${totalMonths} Monatsraten` },
        ],
        summaryText: `Bei einer Sparrate von ${formatCurrency(monthly)} und ${formatPercent(ret)} Zinsen erreichen Sie Ihr Sparziel von ${formatCurrency(target)} in ${durationText}.`,
      };
    },
    formula: 'm = ln((Ziel · r + Rate) / (Start · r + Rate)) / ln(1 + r)',
    formulaExplanation: 'Ermittelt die exakte Laufzeit n in Monaten, die erforderlich ist, um ein Kapitalziel bei monatlicher Einzahlung und Zinseszinseffekt zu erreichen.',
    workedExample: {
      title: 'Beispiel: 25.000 € Sparziel mit 350 € Monatsrate bei 4 % Rendite',
      description: 'Benötigte Spardauer: ca. 4 Jahre und 11 Monate (59 Monate) bei 2.000 € Startkapital.',
      inputs: { targetAmount: 25000, monthlyContribution: 350, initialCapital: 2000, expectedReturn: 4.0 },
      resultSummary: 'ca. 4 Jahre und 11 Monate (59 Monate)',
    },
    content: {
      intro: 'Der Spardauer-Rechner ermittelt, wie viele Monate und Jahre Sie regelmäßig Geld anlegen müssen, um ein definiertes Vermögensziel inklusive Zinseszins zu erreichen.',
      details: 'Im Gegensatz zum Sparzielrechner (der die erforderliche Rate bei fixer Laufzeit berechnet) bestimmt dieser Rechner die Zeitdauer bei gegebener Monatsrate – ideal zur realistischen Lebens- und Anschaffungsplanung.',
    },
    faqs: [
      { question: 'Wie verkürzt eine Zinserhöhung die Spardauer?', answer: 'Durch den Zinseszinseffekt wächst der Ertragsanteil exponentiell; bereits 1 bis 2 Prozentpunkte mehr Jahresrendite können die Spardauer um mehrere Jahre verkürzen.' },
      { question: 'Was passiert bei einer Einmalzahlung zu Beginn?', answer: 'Ein höheres Startkapital arbeitet von Tag 1 an mit vollem Zinseszins und reduziert die verbleibende Spardauer überproportional stark.' },
    ],
    relatedSlugs: ['sparzielrechner', 'sparrechner', 'zinseszinsrechner', 'etf-sparplan-rechner'],
  },
  {
    id: 'kaufkraftverlust-rechner',
    slug: 'kaufkraftverlust-rechner',
    name: 'Kaufkraftverlust-Rechner (Inflation über Zeit)',
    shortName: 'Kaufkraftverlust',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Kaufkraftverlust Rechner – Realwert von Ersparnissen',
    metaDescription: 'Ermitteln Sie den realen Wertverlust von Sparvermögen, Tagesgeld und Festgeld unter Berücksichtigung von Zins und Inflationsrate.',
    h1: 'Kaufkraftverlust Rechner – Reale Rendite nach Inflation',
    shortDescription: 'Berechnet den inflationsbereinigten Realwert Ihrer Ersparnisse und Festgelder nach Abzug der jährlichen Teuerungsrate.',
    searchKeywords: ['kaufkraftverlust ersparnisse', 'kaufkraftverlust rechner', 'was ist mein geld in zukunft wert', 'inflation vermoegensverlust berechnen', 'kaufkraft nach jahren'],
    inputs: [
      { id: 'amount', label: 'Heutiger Geldbetrag', type: 'number', defaultValue: 50000, min: 1000, step: 1000, unit: '€' },
      { id: 'interestRate', label: 'Jährlicher Anlagezins (Tagesgeld/Festgeld)', type: 'number', defaultValue: 1.5, min: 0, step: 0.1, unit: '%' },
      { id: 'inflationRate', label: 'Angenommene jährliche Inflation', type: 'number', defaultValue: 2.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Zeithorizont in Jahren', type: 'number', defaultValue: 15, min: 1, max: 50, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.amount) || 50000;
      const rate = parseFloat(inputs.interestRate) || 0;
      const inf = parseFloat(inputs.inflationRate) || 2.5;
      const y = parseInt(inputs.years, 10) || 15;
      const nominalEnd = a * Math.pow(1 + rate / 100, y);
      const futurePurchasingPower = nominalEnd / Math.pow(1 + inf / 100, y);
      const realLoss = a - futurePurchasingPower;
      const lossPercent = (realLoss / a) * 100;
      return {
        primary: { id: 'realVal', label: 'Reale Restkaufkraft nach Inflation', value: futurePurchasingPower, formattedValue: formatCurrency(futurePurchasingPower), highlight: true },
        secondary: [
          { id: 'nominalEnd', label: 'Nominaler Kontostand (inkl. Zinsen)', value: nominalEnd, formattedValue: formatCurrency(nominalEnd) },
          { id: 'loss', label: 'Realer Kaufkraftverlust zum Startwert', value: realLoss, formattedValue: formatCurrency(realLoss) },
          { id: 'lossPct', label: 'Reale Entwertung in Prozent', value: lossPercent, formattedValue: formatPercent(lossPercent, 1) },
        ],
        summaryText: `Trotz ${formatPercent(rate)} Zinsertrag sinkt die reale Kaufkraft von ${formatCurrency(a)} bei ${formatPercent(inf)} Inflation in ${y} Jahren auf ${formatCurrency(futurePurchasingPower)}.`,
      };
    },
    formula: 'Kaufkraft = Betrag × (1 + Zins/100)^n / (1 + Inflation/100)^n',
    formulaExplanation: 'Um den realen Gegenwert von verzinsten Ersparnissen zu ermitteln, wird das nominale Endguthaben mit der Inflationsrate abgezinst.',
    workedExample: {
      title: 'Beispiel: 50.000 € bei 1,5 % Zins und 2,5 % Inflation über 15 Jahre',
      description: 'Nominaler Endwert: 62.511 €. Reale Restkaufkraft: ca. 43.161 € (Realer Verlust: ca. 6.839 € bzw. -13,7 %).',
      inputs: { amount: 50000, interestRate: 1.5, inflationRate: 2.5, years: 15 },
      resultSummary: 'ca. 43.161 € Restkaufkraft (-13,7 % real)',
    },
    content: {
      intro: 'Der Kaufkraftverlust-Rechner ermittelt, wie viel Kaufkraft Ersparnisse auf Sparbüchern, Tagesgeldern oder Festgeldern trotz erhaltener Zinsen durch die Inflation einbüßen.',
      details: 'Liegt die Verzinsung unter der Inflationsrate (Negativer Realzins), steigt der Kontostand zwar nominal an, der tatsächliche Warenwert sinkt jedoch Jahr für Jahr kontinuierlich.',
    },
    faqs: [
      { question: 'Warum verliert Bargeld auf dem Girokonto kontinuierlich an Wert?', answer: 'Weil ein unverzinstes Girokonto keine Erträge abwirft, während steigende Konsumentenpreise dafür sorgen, dass man für denselben Euro-Betrag jedes Jahr weniger Güter kaufen kann.' },
      { question: 'Wie gleicht man den Kaufkraftverlust bei der Altersvorsorge aus?', answer: 'Indem man die künftig benötigte Rentensumme um die erwartete Teuerungsrate erhöht oder gezielt in ertragsstarke Anlageklassen investiert.' },
    ],
    relatedSlugs: ['inflationsrechner', 'realzins-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'realzins-rechner',
    slug: 'realzins-rechner',
    name: 'Realzins-Rechner (Nominalzins minus Inflation)',
    shortName: 'Realzins berechnen',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Realzins Rechner – Reale Rendite nach Inflation',
    metaDescription: 'Ermitteln Sie Ihren tatsächlichen Realzins nach Fisher-Formel: Nominaler Zinsertrag abzüglich Inflationsrate. Exakt in Prozent.',
    h1: 'Realzins Rechner (Reale Vermögensentwicklung)',
    shortDescription: 'Berechnet die reale Verzinsung Ihres Kapitals nach Bereinigung um die Preissteigerungsrate.',
    searchKeywords: ['realzins rechner', 'nominalzins minus inflation', 'fisher formel rechner', 'reale rendite geldanlage'],
    inputs: [
      { id: 'nominalRate', label: 'Nominaler Anlagezins (Zinssatz)', type: 'number', defaultValue: 3.5, min: 0, step: 0.1, unit: '%' },
      { id: 'inflationRate', label: 'Aktuelle Inflationsrate', type: 'number', defaultValue: 2.2, min: 0, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const nom = parseFloat(inputs.nominalRate) || 3.5;
      const inf = parseFloat(inputs.inflationRate) || 2.2;
      const realRate = (((1 + nom / 100) / (1 + inf / 100)) - 1) * 100;
      const approx = nom - inf;
      return {
        primary: { id: 'real', label: 'Exakter Realzins (Fisher-Formel)', value: realRate, formattedValue: `${realRate >= 0 ? '+' : ''}${formatPercent(realRate, 2)}`, highlight: true },
        secondary: [
          { id: 'approx', label: 'Faustformel (Nominal - Inflation)', value: approx, formattedValue: `${approx >= 0 ? '+' : ''}${formatPercent(approx, 2)}` },
          { id: 'eval', label: 'Bewertung', value: realRate > 0 ? 1 : 0, formattedValue: realRate > 0 ? 'Positiver Realzuwachs' : 'Reale Entwertung' },
        ],
        summaryText: `Bei ${formatPercent(nom)} Zins und ${formatPercent(inf)} Inflation beträgt Ihr Realzins ${formatPercent(realRate, 2)} p.a.`,
      };
    },
    formula: 'Exakter Realzins = ((1 + Nominalzins/100) / (1 + Inflationsrate/100) - 1) × 100',
    formulaExplanation: 'Exakte Fisher-Gleichung. Faustformel: Realzins ≈ Nominalzins - Inflationsrate.',
    workedExample: {
      title: 'Beispiel: 3,5 % Nominalzins bei 2,2 % Inflation',
      description: 'Exakter Realzins: +1,27 % p.a.',
      inputs: { nominalRate: 3.5, inflationRate: 2.2 },
      resultSummary: '+1,27 % Realzins p.a.',
    },
    content: {
      intro: 'Der Realzins drückt den tatsächlichen Vermögenszuwachs nach Bereinigung um die Inflationsrate aus (Fisher-Gleichung).',
      details: 'Exakte Formel: (1 + Nominalzins) / (1 + Inflation) - 1. Näherungsweise gilt: Realzins ≈ Nominalzins - Inflationsrate. Liegt der Sparzins bei 3 % und die Inflation bei 4 %, ist der Realzins mit ca. -1 % negativ.',
    },
    faqs: [
      { question: 'Was bedeutet finanzielle Repression?', answer: 'Ein Zustand, in dem die Zinsen für sichere Sparanlagen bewusst dauerhaft unterhalb der Inflationsrate gehalten werden, sodass Sparer real schleichend entwertet werden.' },
      { question: 'Kann der Realzins auch positiv sein?', answer: 'Ja, sobald der Zinsertrag oder die Rendite einer Geldanlage die laufende Teuerungsrate übersteigt, wächst das reale Vermögen (Kaufkraftzuwachs).' },
    ],
    relatedSlugs: ['inflationsrechner', 'kaufkraftverlust-rechner', 'renditerechner'],
  },
  {
    id: 'dividendenrendite-rechner',
    slug: 'dividendenrendite-rechner',
    name: 'Dividendenrendite-Rechner',
    shortName: 'Dividendenrendite',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Dividendenrendite Rechner – Ausschüttungsrendite von Aktien...',
    metaDescription: 'Berechnen Sie die Dividendenrendite in Prozent aus Dividende je Aktie und aktuellem Aktienkurs oder Kaufkurs (Persönliche Dividendenrendite).',
    h1: 'Dividendenrendite Rechner (Aktien & ETFs)',
    shortDescription: 'Ermittelt das Verhältnis der jährlichen Dividendenzahlung zum aktuellen Börsenkurs oder Einstiegskurs.',
    searchKeywords: ['dividendenrendite rechner', 'aktien ausschüttung berechnen', 'dividende in prozent', 'personal dividend yield'],
    inputs: [
      { id: 'sharePrice', label: 'Aktienkurs / Anteilspreis', type: 'number', defaultValue: 120, min: 1, step: 1, unit: '€' },
      { id: 'dividend', label: 'Jährliche Dividende pro Aktie', type: 'number', defaultValue: 4.8, min: 0, step: 0.1, unit: '€' },
      { id: 'sharesCount', label: 'Anzahl gehaltener Aktien', type: 'number', defaultValue: 50, min: 1, step: 1, unit: 'Stück' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.sharePrice) || 120;
      const div = parseFloat(inputs.dividend) || 4.8;
      const count = parseInt(inputs.sharesCount, 10) || 50;
      if (price <= 0) return { primary: { id: 'yield', label: 'Dividendenrendite', value: 0, formattedValue: '0 %' }, error: 'Aktienkurs muss positiv sein.' };
      const yieldPct = (div / price) * 100;
      const annualPayout = div * count;
      return {
        primary: { id: 'yield', label: 'Dividendenrendite', value: yieldPct, formattedValue: formatPercent(yieldPct, 2), highlight: true },
        secondary: [
          { id: 'annual', label: 'Jährliche Gesamtausschüttung', value: annualPayout, formattedValue: formatCurrency(annualPayout) },
          { id: 'monthly', label: 'Monatlicher Durchschnitt', value: annualPayout / 12, formattedValue: formatCurrency(annualPayout / 12) },
        ],
        summaryText: `Bei einer Dividende von ${formatCurrency(div)} beträgt die Dividendenrendite ${formatPercent(yieldPct, 2)} (${formatCurrency(annualPayout)} / Jahr).`,
      };
    },
    formula: 'Dividendenrendite (%) = (Dividende pro Aktie / Aktienkurs) × 100',
    formulaExplanation: 'Setzt die ausgeschüttete Dividende ins Verhältnis zum Kurswert.',
    workedExample: {
      title: 'Beispiel: 4,80 € Dividende bei 120 € Kurs (50 Aktien)',
      description: 'Dividendenrendite: 4,00 %. Jährliche Gesamtausschüttung: 240 € brutto.',
      inputs: { sharePrice: 120, dividend: 4.8, sharesCount: 50 },
      resultSummary: '4,00 % Rendite (240 € / Jahr)',
    },
    content: {
      intro: 'Die Dividendenrendite misst die laufende Ausschüttung einer Aktie bezogen auf ihren aktuellen Börsenkurs.',
      details: 'Dividendenrendite = (Dividende je Aktie / Aktienkurs) · 100. Eine Aktie mit 3 € Dividende bei 60 € Kurs hat eine Dividendenrendite von 5,0 %. Reinvestierte Dividenden tragen historisch maßgeblich zum Gesamterfolg von Aktienportfolios bei.',
    },
    faqs: [
      { question: 'Wann wird die Dividende in Deutschland ausgezahlt?', answer: 'Bei deutschen Aktiengesellschaften (AG) wird die Dividende einmal jährlich am dritten Werktag nach der ordentlichen Hauptversammlung (§ 58 Abs. 4 AktG) gutgeschrieben.' },
      { question: 'Ist eine extrem hohe Dividendenrendite immer ein gutes Zeichen?', answer: 'Nicht zwingend: Eine ungewöhnlich hohe Dividendenrendite (> 8 %) entsteht oft durch einen drastischen Kurseinbruch der Aktie wegen operativer Krisen, was Vorbote einer Dividendenkürzung sein kann.' },
    ],
    relatedSlugs: ['renditerechner', 'etf-sparplan-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'ewige-rente-rechner',
    slug: 'ewige-rente-rechner',
    name: 'Ewige Rente-Rechner (Finanzielle Unabhängigkeit)',
    shortName: 'Ewige Rente',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Ewige Rente Rechner – Wie viel Kapital für monatliche Zinse...',
    metaDescription: 'Berechnen Sie das erforderliche Vermögen für eine ewige Rente ohne Kapitalverzehr. Von Zinsen und Dividenden leben.',
    h1: 'Ewige Rente Rechner (Kapitalerhalt)',
    shortDescription: 'Ermittelt das notwendige Vermögen, um einen festen Monatsbetrag rein aus Zinserträgen ohne Kapitalverzehr zu entnehmen.',
    searchKeywords: ['ewige rente rechner', 'von zinsen leben rechner', 'kapitalbedarf ewige rente', 'finanzielle freiheit kapital'],
    inputs: [
      { id: 'monthlyIncome', label: 'Gewünschte monatliche Netto-Rente', type: 'number', defaultValue: 2500, min: 500, step: 100, unit: '€' },
      { id: 'netReturn', label: 'Erwartete Nettorendite p.a. (nach Steuern)', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const monthly = parseFloat(inputs.monthlyIncome) || 2500;
      const rate = parseFloat(inputs.netReturn) || 3.5;
      if (rate <= 0) return { primary: { id: 'capital', label: 'Kapitalbedarf', value: 0, formattedValue: '0 €' }, error: 'Rendite muss positiv sein.' };
      const annualNeed = monthly * 12;
      const capitalNeeded = annualNeed / (rate / 100);
      return {
        primary: { id: 'capital', label: 'Erforderliches Anlagekapital', value: capitalNeeded, formattedValue: formatCurrency(capitalNeeded), highlight: true },
        secondary: [
          { id: 'annual', label: 'Jährliche Entnahmesumme', value: annualNeed, formattedValue: formatCurrency(annualNeed) },
          { id: 'daily', label: 'Verfügbares Budget pro Tag', value: annualNeed / 365, formattedValue: formatCurrency(annualNeed / 365) },
        ],
        summaryText: `Für eine ewige Rente von ${formatCurrency(monthly)} im Monat bei ${formatPercent(rate)} Nettorendite benötigen Sie ${formatCurrency(capitalNeeded)}.`,
      };
    },
    formula: 'Benötigtes Kapital = Jahresrente / (Nettorendite / 100)',
    formulaExplanation: 'Das Startkapital bleibt vollständig erhalten, da nur die erwirtschafteten Zinsen entnommen werden.',
    workedExample: {
      title: 'Beispiel: 2.500 € monatlich bei 3,5 % Netto-Ausschüttung',
      description: '30.000 € Jahresbedarf / 0,035 = 857.143 € Kapitalbedarf.',
      inputs: { monthlyIncome: 2500, netReturn: 3.5 },
      resultSummary: 'ca. 857.143 € Kapitalbedarf',
    },
    content: {
      intro: 'Die ewige Rente bezeichnet eine Auszahlungsform, bei der das Grundkapital unberührt bleibt und die Auszahlungen ausschließlich aus den Zinsen oder Dividenden bestritten werden.',
      details: 'Formel: Notwendiges Kapital = Jährliche Wunschrente / (Zinssatz / 100). Um beispielsweise bei 4 % Ertrag jährlich 24.000 € (2.000 € monatlich) ewig zu entnehmen, wird ein Kapitalstock von 600.000 € benötigt.',
    },
    faqs: [
      { question: 'Berücksichtigt die klassische ewige Rente die Inflation?', answer: 'Die Basisformel ignoriert die Inflation. Um den realen Auszahlungsbetrag kaufkraftbereinigt konstant zu halten, muss die Entnahmerate um die Inflationsrate gekürzt werden (Netto-Kapitalerhalt).' },
      { question: 'Welche Ertragsquellen eignen sich für eine ewige Rente?', answer: 'Breit gestreute Dividenden-ETFs, Mietüberschüsse aus schuldenfreien Immobilien sowie Anleihekupons.' },
    ],
    relatedSlugs: ['finanzielle-freiheit-rechner', 'etf-sparplan-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'finanzielle-freiheit-rechner',
    slug: 'finanzielle-freiheit-rechner',
    name: 'Finanzielle Freiheit-Rechner (FIRE 4%-Regel)',
    shortName: 'FIRE 4%-Regel',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Finanzielle Freiheit Rechner – FIRE-Zahl & 4%-Regel',
    metaDescription: 'Berechnen Sie Ihre persönliche FIRE-Zahl für finanzielle Freiheit: Das 25-fache Ihrer Jahresausgaben nach der wissenschaftlichen Trinity-Studie.',
    h1: 'Finanzielle Freiheit Rechner (FIRE-Bewegung)',
    shortDescription: 'Kalkuliert die erforderliche Vermögensgröße für den vorzeitigen Ruhestand basierend auf jährlichen Lebenshaltungskosten.',
    searchKeywords: ['finanzielle freiheit rechner', 'fire rechner 4 prozent regel', 'trinity study rechner', 'fruehrente vermoegen berechnen'],
    inputs: [
      { id: 'monthlyExpenses', label: 'Monatliche Lebenshaltungskosten', type: 'number', defaultValue: 2200, min: 500, step: 50, unit: '€' },
      { id: 'withdrawalRate', label: 'Sichere Entnahmerate (SWR)', type: 'number', defaultValue: 3.5, min: 2.5, max: 5.0, step: 0.1, unit: '%' },
      { id: 'currentAssets', label: 'Bereits vorhandenes Vermögen', type: 'number', defaultValue: 60000, min: 0, step: 5000, unit: '€' },
    ],
    calculate: (inputs) => {
      const expenses = parseFloat(inputs.monthlyExpenses) || 2200;
      const swr = parseFloat(inputs.withdrawalRate) || 3.5;
      const current = parseFloat(inputs.currentAssets) || 0;
      const annualExp = expenses * 12;
      const fireNumber = annualExp / (swr / 100);
      const gap = Math.max(0, fireNumber - current);
      const progress = (current / fireNumber) * 100;
      return {
        primary: { id: 'fire', label: 'Ihre persönliche FIRE-Zahl', value: fireNumber, formattedValue: formatCurrency(fireNumber), highlight: true },
        secondary: [
          { id: 'gap', label: 'Noch aufzubauendes Vermögen', value: gap, formattedValue: formatCurrency(gap) },
          { id: 'progress', label: 'Erreichter Fortschritt', value: progress, formattedValue: formatPercent(progress, 1) },
          { id: 'multiple', label: 'Faktor Ihrer Jahresausgaben', value: 100 / swr, formattedValue: `${formatNumber(100 / swr, 1)} × Jahresausgaben` },
        ],
        summaryText: `Bei Ausgaben von ${formatCurrency(expenses)} im Monat benötigen Sie ${formatCurrency(fireNumber)} für die finanzielle Freiheit.`,
      };
    },
    formula: 'FIRE-Vermögen = Jahresausgaben / (Entnahmerate / 100)',
    formulaExplanation: 'Nach der Trinity-Studie hielt ein Aktien-/Anleihen-Portfolio bei 3,5 % bis 4,0 % Entnahme über 30 Jahre stand.',
    workedExample: {
      title: 'Beispiel: 2.200 € Monatsausgaben bei 3,5 % Entnahme',
      description: 'Jahresausgaben: 26.400 €. FIRE-Zahl: ca. 754.286 €.',
      inputs: { monthlyExpenses: 2200, withdrawalRate: 3.5, currentAssets: 60000 },
      resultSummary: 'ca. 754.286 € Zielvermögen',
    },
    content: {
      intro: 'Dieser FIRE-Rechner (Financial Independence, Retire Early) kalkuliert das Zielvermögen, ab dem Erträge aus dem Kapitalstock die gesamten Lebenshaltungskosten decken.',
      details: 'Basierend auf der Trinity-Studie gilt eine sichere Entnahmerate (Safe Withdrawal Rate, SWR) von 3,5 bis 4,0 Prozent p.a. Das FIRE-Vermögen entspricht dem 25- bis 28-Fachen der jährlichen Gesamtausgaben.',
    },
    faqs: [
      { question: 'Was besagt die bekannte 4-Prozent-Regel?', answer: 'Wer im ersten Ruhestandsjahr 4 % seines Aktien/Anleihen-Portfolios entnimmt und den Betrag in den Folgejahren inflationsbereinigt anpasst, hatte in den letzten 100 Jahren eine 95-prozentige Wahrscheinlichkeit, dass das Geld 30 Jahre lang reichte.' },
      { question: 'Was ist Lean-FIRE vs. Fat-FIRE?', answer: 'Lean-FIRE zielt auf finanzielle Freiheit bei sehr sparsamem Lebensstil ab; Fat-FIRE kalkuliert mit großzügigen Budgets von 4.000 € oder mehr pro Monat im Ruhestand.' },
    ],
    relatedSlugs: ['ewige-rente-rechner', 'etf-sparplan-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'freistellungsauftrag-rechner',
    slug: 'freistellungsauftrag-rechner',
    name: 'Freistellungsauftrag-Rechner (Sparerpauschbetrag 1.000 € / 2.000 €)',
    shortName: 'Sparerpauschbetrag',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Freistellungsauftrag Rechner – 1.000 € / 2.000 € Sparerpaus...',
    metaDescription: 'Berechnen Sie die Steuerersparnis durch den gesetzlichen Sparerpauschbetrag (1.000 € für Singles, 2.000 € für Verheiratete) auf Kapitalerträge.',
    h1: 'Freistellungsauftrag & Sparerpauschbetrag Rechner',
    shortDescription: 'Kalkuliert die Steuerersparnis durch den Sparerpauschbetrag (§ 20 Abs. 9 EStG) bei Zinsen, Dividenden und ETF-Gewinnen.',
    searchKeywords: ['freistellungsauftrag rechner', 'sparerpauschbetrag 1000 euro', 'abgeltungsteuer freibetrag rechner', 'steuern sparen zinsen'],
    inputs: [
      { id: 'annualGains', label: 'Erwartete jährliche Kapitalerträge (Zinsen, Dividenden)', type: 'number', defaultValue: 1500, min: 0, step: 50, unit: '€' },
      {
        id: 'status',
        label: 'Veranlagungsstatus',
        type: 'select',
        defaultValue: 'single',
        options: [
          { value: 'single', label: 'Single / Alleinstehend (1.000 € Freibetrag)' },
          { value: 'married', label: 'Zusammenveranlagte Ehepaare (2.000 € Freibetrag)' },
        ],
      },
      { id: 'churchTax', label: 'Kirchensteuerpflichtig?', type: 'boolean', defaultValue: false },
    ],
    calculate: (inputs) => {
      const gains = parseFloat(inputs.annualGains) || 1500;
      const isMarried = inputs.status === 'married';
      const hasChurch = Boolean(inputs.churchTax);
      const allowance = isMarried ? 2000 : 1000;
      const taxRate = hasChurch ? 0.2799 : 0.26375;
      const exemptGains = Math.min(gains, allowance);
      const taxableGains = Math.max(0, gains - allowance);
      const savedTax = exemptGains * taxRate;
      const taxesDue = taxableGains * taxRate;
      return {
        primary: { id: 'saved', label: 'Erzielte Steuerersparnis', value: savedTax, formattedValue: formatCurrency(savedTax), highlight: true },
        secondary: [
          { id: 'exempt', label: 'Steuerfreier Betrag', value: exemptGains, formattedValue: formatCurrency(exemptGains) },
          { id: 'taxable', label: 'Steuerpflichtige Erträge', value: taxableGains, formattedValue: formatCurrency(taxableGains) },
          { id: 'due', label: 'Abzuführende Abgeltungsteuer', value: taxesDue, formattedValue: formatCurrency(taxesDue) },
        ],
        summaryText: `Durch Ihren Freistellungsauftrag von ${formatCurrency(allowance)} sparen Sie exakt ${formatCurrency(savedTax)} an Steuern.`,
      };
    },
    formula: 'Steuerersparnis = Min(Kapitalertrag, Freibetrag) × 26,375 %',
    formulaExplanation: 'Der Sparerpauschbetrag beträgt 1.000 € für Singles und 2.000 € für Verheiratete (§ 20 Abs. 9 EStG).',
    workedExample: {
      title: 'Beispiel: 1.500 € Ertrag als Single (1.000 € Freibetrag)',
      description: 'Steuerfreie Erträge: 1.000 €. Steuerersparnis: 263,75 €. Zu versteuern: 500 €.',
      inputs: { annualGains: 1500, status: 'single', churchTax: false },
      resultSummary: '263,75 € Steuerersparnis',
    },
    content: {
      intro: 'Mit dem Freistellungsauftrag schöpfen Sparer und Anleger den gesetzlichen Sparer-Pauschbetrag aus, um Kapitalerträge ohne Steuerabzug zu erhalten.',
      details: 'Nach § 20 Abs. 9 EStG beträgt der Sparer-Pauschbetrag 1.000 € für Alleinstehende und 2.000 € für zusammenveranlagte Ehegatten. Ersparnis: Bis zu 263,75 € (Single) bzw. 527,50 € (Verheiratete) pro Jahr.',
    },
    faqs: [
      { question: 'Kann man den Freistellungsauftrag auf mehrere Banken aufteilen?', answer: 'Ja, Sie können Ihren Freibetrag beliebig auf verschiedene Banken und Broker verteilen, solange die Gesamtsumme 1.000 € bzw. 2.000 € nicht übersteigt.' },
      { question: 'Was passiert, wenn man keinen Freistellungsauftrag erteilt hat?', answer: 'Die Bank führt 25 % Abgeltungsteuer plus Solidaritätszuschlag automatisch an das Finanzamt ab. Sie können sich das Geld über die Anlage KAP der Einkommensteuererklärung zurückholen.' },
    ],
    relatedSlugs: ['kapitalertragsteuer-rechner', 'etf-sparplan-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'kapitalertragsteuer-rechner',
    slug: 'kapitalertragsteuer-rechner',
    name: 'Kapitalertragsteuer-Rechner (Abgeltungsteuer + Soli)',
    shortName: 'Abgeltungsteuer',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Kapitalertragsteuer Rechner – Abgeltungsteuer, Soli',
    metaDescription: 'Berechnen Sie die exakte Steuerlast auf Kapitalerträge: 25 % Abgeltungsteuer, 5,5 % Soli und optionale Kirchensteuer in Bayern & NRW.',
    h1: 'Kapitalertragsteuer & Abgeltungsteuer Rechner',
    shortDescription: 'Ermittelt die gesetzliche Steuerbelastung auf Zinsen, Dividenden und Aktiengewinne nach § 32d EStG.',
    searchKeywords: ['kapitalertragsteuer rechner', 'abgeltungsteuer berechnen formel', 'steuern aktiengewinne rechner', 'solidaritaetszuschlag zinsen'],
    inputs: [
      { id: 'profit', label: 'Zu versteuernder Kapitalertrag', type: 'number', defaultValue: 3000, min: 10, step: 100, unit: '€' },
      {
        id: 'churchState',
        label: 'Kirchensteuer',
        type: 'select',
        defaultValue: 'none',
        options: [
          { value: 'none', label: 'Keine Kirchensteuer (26,375 % Gesamtsteuer)' },
          { value: '8', label: 'Bayern & Baden-Württemberg (8 % = 27,82 %)' },
          { value: '9', label: 'Übrige Bundesländer (9 % = 27,99 %)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.profit) || 3000;
      const church = inputs.churchState || 'none';
      let totalRate = 0.26375;
      if (church === '8') totalRate = 0.2782;
      else if (church === '9') totalRate = 0.2799;
      const totalTax = p * totalRate;
      const netGain = p - totalTax;
      return {
        primary: { id: 'tax', label: 'Gesamte Steuerbelastung', value: totalTax, formattedValue: formatCurrency(totalTax), highlight: true },
        secondary: [
          { id: 'net', label: 'Netto-Auszahlung auf Konto', value: netGain, formattedValue: formatCurrency(netGain) },
          { id: 'rate', label: 'Effektiver Steuersatz', value: totalRate * 100, formattedValue: formatPercent(totalRate * 100, 2) },
        ],
        summaryText: `Auf einen Ertrag von ${formatCurrency(p)} zahlen Sie ${formatCurrency(totalTax)} Steuern (${formatPercent(totalRate * 100, 2)}).`,
      };
    },
    formula: 'Steuer = Ertrag × (25 % + 5,5 % Soli auf KapESt + Kirchensteuer)',
    formulaExplanation: 'In Deutschland gilt eine pauschale Abgeltungsteuer von 25 % zzgl. 5,5 % Solidaritätszuschlag.',
    workedExample: {
      title: 'Beispiel: 3.000 € steuerpflichtiger Ertrag ohne Kirchensteuer',
      description: 'Abgeltungsteuer + Soli = 791,25 € (26,375 %). Netto-Ertrag: 2.208,75 €.',
      inputs: { profit: 3000, churchState: 'none' },
      resultSummary: '791,25 € Steuer (26,38 %)',
    },
    content: {
      intro: 'Die Abgeltungsteuer auf Kapitalerträge (Zinsen, Dividenden, realisierte Kursgewinne) beträgt in Deutschland pauschal 25 Prozent zuzüglich Solidaritätszuschlag und Kirchensteuer.',
      details: 'Der reguläre Steuersatz beträgt 26,375 % (25 % Abgeltungsteuer + 5,5 % Soli darauf). Bei Kirchensteuerpflicht sinkt die Abgeltungsteuerformel leicht auf 24,45 % (bei 9 % KiSt in Bayern/Baden-Württemberg: 24,51 %).',
    },
    faqs: [
      { question: 'Wann lohnt sich die Günstigerprüfung in der Steuererklärung?', answer: 'Wenn Ihr persönlicher Grenzsteuersatz unter 25 % liegt (zu versteuerndes Einkommen unter ca. 20.000 €), werden Kapitalerträge mit Ihrem niedrigeren individuellen Tarif besteuert.' },
      { question: 'Werden Verluste aus Aktienverkäufen mit Zinserträgen verrechnet?', answer: 'Nein, nach deutschem Steuerrecht (§ 20 Abs. 6 EStG) dürfen Aktienverluste nur mit Gewinnen aus anderen Aktienverkäufen verrechnet werden (separater Verlustverrechnungstopf).' },
    ],
    relatedSlugs: ['kirchensteuer-rechner', 'freistellungsauftrag-rechner', 'etf-sparplan-rechner', 'renditerechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 32d, § 43a EStG, § 4 SolzG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    }
  },
  {
    id: 'depotgebuehren-rechner',
    slug: 'depotgebuehren-rechner',
    name: 'Depotgebühren-Rechner (Kostenwirkung auf Endvermögen)',
    shortName: 'Depotgebühren-Rechner',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Depotgebühren Rechner – Kostenvergleich für Wertpapierdepots',
    metaDescription: 'Wie stark schmälern Depotführungsgebühren, Orderkosten und ETF-Gesamtkostenquoten (TER) Ihr Vermögen über 10, 20 oder 30 Jahre?',
    h1: 'Depotgebühren & Kostenwirkungs-Rechner',
    shortDescription: 'Veranschaulicht den Zinseszinseffekt von Depotkosten und Produktgebühren (TER) auf das Sparziel.',
    searchKeywords: ['depotgebuehren rechner', 'depotkosten vergleichen', 'ter auswirkung rechner', 'etf kosten rechner langfristig'],
    inputs: [
      { id: 'portfolioVal', label: 'Anlagevermögen', type: 'number', defaultValue: 40000, min: 1000, step: 2500, unit: '€' },
      { id: 'ter', label: 'Laufende Fondskosten (TER) p.a.', type: 'number', defaultValue: 0.22, min: 0, step: 0.05, unit: '%' },
      { id: 'custodyFee', label: 'Depotführungsgebühr der Bank p.a.', type: 'number', defaultValue: 0, min: 0, step: 10, unit: '€' },
      { id: 'years', label: 'Anlagezeitraum in Jahren', type: 'number', defaultValue: 20, min: 1, max: 40, step: 1, unit: 'Jahre' },
      { id: 'grossReturn', label: 'Bruttorendite des Marktes p.a.', type: 'number', defaultValue: 7.0, min: 1, step: 0.5, unit: '%' },
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.portfolioVal) || 40000;
      const ter = parseFloat(inputs.ter) || 0.22;
      const custody = parseFloat(inputs.custodyFee) || 0;
      const y = parseInt(inputs.years, 10) || 20;
      const gross = parseFloat(inputs.grossReturn) || 7.0;
      const grossVal = p * Math.pow(1 + gross / 100, y);
      const netRate = Math.max(0, gross - ter);
      let netVal = p;
      for (let i = 0; i < y; i++) netVal = netVal * (1 + netRate / 100) - custody;
      const lost = Math.max(0, grossVal - netVal);
      return {
        primary: { id: 'lost', label: 'Gesamter Kostenverlust über die Laufzeit', value: lost, formattedValue: formatCurrency(lost), highlight: true },
        secondary: [
          { id: 'withCosts', label: 'Endvermögen mit Kosten', value: netVal, formattedValue: formatCurrency(netVal) },
          { id: 'withoutCosts', label: 'Endvermögen ohne Kosten', value: grossVal, formattedValue: formatCurrency(grossVal) },
        ],
        summaryText: `Durch laufende Kosten von ${formatPercent(ter)} TER entgehen Ihnen in ${y} Jahren ca. ${formatCurrency(lost)} an Vermögenswachstum.`,
      };
    },
    formula: 'Kostenverlust = Endwert_ohne_Kosten - Endwert_mit_Kosten',
    formulaExplanation: 'Gebühren mindern nicht nur den laufenden Ertrag, sondern entziehen dem Depot auch künftige Zinseszinsen.',
    workedExample: {
      title: 'Beispiel: 40.000 € über 20 Jahre bei 7 % Rendite und 0,22 % TER',
      description: 'Endvermögen ohne Kosten: ca. 154.787 €. Mit Kosten: ca. 148.513 €. Kostenwirkung: ca. 6.274 €.',
      inputs: { portfolioVal: 40000, ter: 0.22, custodyFee: 0, years: 20, grossReturn: 7.0 },
      resultSummary: 'ca. 6.274 € Kostenverlust',
    },
    content: {
      intro: 'Dieser Kostenrechner quantifiziert, wie stark prozentuale Depotgebühren, Orderkosten und Fonds-TER das Endvermögen über die Jahre schmälern.',
      details: 'Laufende Gebühren mindern nicht nur den unmittelbaren Barwert, sondern entziehen dem Depot kontinuierlich künftiges Zinseszins-Potenzial. 1 % Mehrkosten pro Jahr kann über 30 Jahre rund 25 % des Endkapitals vernichten.',
    },
    faqs: [
      { question: 'Warum sind Neobroker oft so viel günstiger als Filialbanken?', answer: 'Moderne Neobroker verzichten auf Filialnetze, wickeln Orders rein digital ab und erhalten Rückvergütungen (Payment for Order Flow) von Handelsplätzen.' },
      { question: 'Wie wirken sich Ausgabeaufschläge bei aktiv gemanagten Fonds aus?', answer: 'Ein Ausgabeaufschlag von 5 % bedeutet, dass von 10.000 € Einzahlung nur 9.524 € investiert werden; der Fonds muss zunächst rund 5,3 % Rendite erwirtschaften, nur um die Anfangskosten auszugleichen.' },
    ],
    relatedSlugs: ['etf-sparplan-rechner', 'renditerechner', 'zinseszinsrechner'],
  },
  {
    id: 'sparrate-rechner',
    slug: 'sparrate-rechner',
    name: 'Sparrate-Rechner (Sparquote vom Nettoeinkommen)',
    shortName: 'Sparquote berechnen',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Sparrate Rechner – Persönliche Sparquote vom Nettoeinkommen',
    metaDescription: 'Ermitteln Sie Ihre persönliche Sparquote in Prozent nach der 50-30-20-Regel. Wie viel Prozent Ihres Einkommens Sie sparen sollten.',
    h1: 'Sparrate & Sparquoten Rechner',
    shortDescription: 'Berechnet den prozentualen Sparanteil Ihres Nettoeinkommens und vergleicht ihn mit der 50/30/20-Budgetregel.',
    searchKeywords: ['sparrate rechner', 'sparquote berechnen netto', '50 30 20 regel rechner', 'wie viel sparen im monat'],
    inputs: [
      { id: 'netIncome', label: 'Monatliches Haushaltsnettoeinkommen', type: 'number', defaultValue: 3200, min: 200, step: 50, unit: '€' },
      { id: 'monthlySavings', label: 'Monatlich gesparter Betrag (ETF, Tagesgeld, Tilgung)', type: 'number', defaultValue: 640, min: 0, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const inc = parseFloat(inputs.netIncome) || 3200;
      const sav = parseFloat(inputs.monthlySavings) || 640;
      if (inc <= 0) return { primary: { id: 'quote', label: 'Sparquote', value: 0, formattedValue: '0 %' }, error: 'Nettoeinkommen muss positiv sein.' };
      const quote = (sav / inc) * 100;
      let rating = 'Solide (15 - 25 %)';
      if (quote < 10) rating = 'Ausbaufähig (unter 10 %)';
      else if (quote >= 30) rating = 'Hervorragend (über 30 %)';
      return {
        primary: { id: 'quote', label: 'Ihre monatliche Sparquote', value: quote, formattedValue: formatPercent(quote, 1), highlight: true },
        secondary: [
          { id: 'rating', label: 'Einstufung (nach 50-30-20-Regel)', value: quote, formattedValue: rating },
          { id: 'annual', label: 'Ersparnis pro Jahr', value: sav * 12, formattedValue: formatCurrency(sav * 12) },
        ],
        summaryText: `Mit ${formatCurrency(sav)} bei ${formatCurrency(inc)} Netto erreichen Sie eine Sparquote von ${formatPercent(quote, 1)}.`,
      };
    },
    formula: 'Sparquote (%) = (Monatliche Ersparnis / Nettoeinkommen) × 100',
    formulaExplanation: 'Klassische Budgetregel: 50 % Fixkosten, 30 % Freizeit, 20 % Sparen.',
    workedExample: {
      title: 'Beispiel: 640 € Sparen bei 3.200 € Nettoeinkommen',
      description: '(640 / 3.200) × 100 = 20,00 % (optimal nach der 50/30/20-Regel).',
      inputs: { netIncome: 3200, monthlySavings: 640 },
      resultSummary: '20,00 % Sparquote (Optimal)',
    },
    content: {
      intro: 'Die Sparquote beziffert den prozentualen Anteil des Nettoeinkommens, der monatlich für Vermögensaufbau, Tilgung oder Altersvorsorge zurückgelegt wird.',
      details: 'Sparquote = (Monatliche Ersparnis / Nettoeinkommen) · 100. Während der Bundesdurchschnitt in Deutschland bei rund 10–11 % liegt, streben FIRE-Anhänger Quoten von 30 bis 60 % an.',
    },
    faqs: [
      { question: 'Zählt die Tilgung eines Immobilienkredits zur Sparrate?', answer: 'Ja, der reine Tilgungsanteil der monatlichen Kreditrate baut Nettovermögen auf und zählt zur Ersparnis; der Zinsanteil hingegen ist Aufwand (Wohnkosten).' },
      { question: 'Wie viel Prozent seines Gehalts sollte man mindestens sparen?', answer: 'Finanzexperten empfehlen als Faustregel die 50/30/20-Regel: 50 % für Fixkosten, 30 % für Freizeit und Konsum, mindestens 20 % für Sparen und Vermögensaufbau.' },
    ],
    relatedSlugs: ['sparrechner', 'sparzielrechner', 'zinseszinsrechner', 'etf-sparplan-rechner', 'notgroschen-rechner'],
  },
  {
    id: 'liquiditaetsreserve-rechner',
    slug: 'liquiditaetsreserve-rechner',
    name: 'Liquiditätsreserve-Rechner (Eiserne Notreserve)',
    shortName: 'Liquiditätsreserve',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Liquiditätsreserve Rechner für Selbstständige & Haushalte',
    metaDescription: 'Berechnen Sie die notwendige Liquiditätsreserve für Selbstständige und Unternehmer zur Absicherung von Steuern und Fixkosten.',
    h1: 'Liquiditätsreserve Rechner – Puffer für Steuern & Fixkosten',
    shortDescription: 'Kalkuliert die erforderliche Liquiditätsreserve für Freiberufler und Gewerbetreibende zur Absicherung von Steuerrücklagen.',
    searchKeywords: ['liquiditaetsreserve rechner', 'notgroschen rechner', 'wie viel notgroschen tagesgeld', 'liquiditaetsreserve berechnen', 'finanzielle sicherheit polster'],
    inputs: [
      { id: 'monthlyExpenses', label: 'Monatliche feste Lebenshaltungskosten', type: 'number', defaultValue: 1800, min: 200, step: 50, unit: '€' },
      {
        id: 'jobType',
        label: 'Berufliche Situation',
        type: 'select',
        defaultValue: 'employee',
        options: [
          { value: 'civil', label: 'Beamter / Unkündbar (2 - 3 Monatsausgaben)' },
          { value: 'employee', label: 'Angestellter im festen Arbeitsverhältnis (3 Monatsausgaben)' },
          { value: 'family', label: 'Familie mit Kindern / Hauseigentümer (4 - 5 Monatsausgaben)' },
          { value: 'freelance', label: 'Selbstständig / Freiberufler (6 Monatsausgaben)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const exp = parseFloat(inputs.monthlyExpenses) || 1800;
      const type = inputs.jobType || 'employee';
      let mult = 3;
      if (type === 'civil') mult = 2.5;
      if (type === 'family') mult = 4.5;
      if (type === 'freelance') mult = 6;
      const target = exp * mult;
      return {
        primary: { id: 'target', label: 'Empfohlener Notgroschen', value: target, formattedValue: formatCurrency(target), highlight: true },
        secondary: [
          { id: 'mult', label: 'Empfohlene Monatsausgaben', value: mult, formattedValue: `${formatNumber(mult, 1)} Monate` },
          { id: 'min', label: 'Absolutes Minimum (2 Monate)', value: exp * 2, formattedValue: formatCurrency(exp * 2) },
        ],
        summaryText: `Bei Fixkosten von ${formatCurrency(exp)} sollten Sie ca. ${formatCurrency(target)} auf dem Tagesgeldkonto als Notgroschen halten.`,
      };
    },
    formula: 'Notgroschen = Monatliche Fixkosten × Multiplikator (3 bis 6)',
    formulaExplanation: 'Verbraucherzentralen empfehlen 3 bis 6 Nettomonatsausgaben als Puffer.',
    workedExample: {
      title: 'Beispiel: Angestellter mit 1.800 € Fixkosten',
      description: '1.800 € × 3 Monate = 5.400 € empfohlener Notgroschen.',
      inputs: { monthlyExpenses: 1800, jobType: 'employee' },
      resultSummary: 'ca. 5.400 € Notgroschen',
    },
    content: {
      intro: 'Die Liquiditätsreserve ermittelt den optimalen Puffer auf Giro- und Tagesgeldkonten zur Abdeckung fixer Zahlungsverpflichtungen und kurzfristiger Risiken.',
      details: 'Zur Berechnung werden alle regelmäßigen Fixkosten (Miete, Versicherungen, Kredite, Abos) erfasst. Eine gesunde Reserve verhindert teure Rücklastschriften und Verzugszinsen.',
    },
    faqs: [
      { question: 'Wie viel Geld sollte maximal auf dem Girokonto verbleiben?', answer: 'Empfohlen wird ein Puffer von 1 bis 1,5 Monatsgehältern auf dem Girokonto; alle darüber hinausgehenden Beträge gehören aufs verzinste Tagesgeld oder in Anlageprodukte.' },
      { question: 'Warum schadet eine zu große Liquiditätsreserve dem Vermögensaufbau?', answer: 'Überschüssige Barbestände unterliegen der Cash-Drag: Das Geld verliert real durch Inflation an Kaufkraft, statt an den Ertragschancen der Kapitalmärkte teilzuhaben.' },
    ],
    relatedSlugs: ['tagesgeld-rechner', 'sparrate-rechner', 'spardauer-rechner'],
  },
  {
    id: 'verdopplungszeit-rechner',
    slug: 'verdopplungszeit-rechner',
    name: 'Verdopplungszeit-Rechner (Exakte 72er-Regel)',
    shortName: 'Verdopplungszeit',
    category: 'finanzen',
    subcategory: 'Zinsen & Zinseszins',
    metaTitle: 'Verdopplungszeit Rechner – Wann verdoppelt sich mein Kapital?',
    metaDescription: 'Berechnen Sie die exakte Zeit in Jahren bis zur Verdopplung Ihres Geldes durch Zinseszins. Exakter Logarithmus & 72er-Regel im Vergleich.',
    h1: 'Verdopplungszeit Rechner (Zinseszins-Verdopplung)',
    shortDescription: 'Kalkuliert die exakte Dauer in Jahren und Monaten, bis sich ein Kapitalbetrag bei festem Zinssatz verdoppelt.',
    searchKeywords: ['verdopplungszeit rechner', 'wann verdoppelt sich mein geld', '72er regel exakt', 'kapital verdoppeln jahre'],
    inputs: [
      { id: 'interestRate', label: 'Jährliche Rendite / Zinssatz', type: 'number', defaultValue: 7.0, min: 0.1, step: 0.1, unit: '%' },
      { id: 'initialAmount', label: 'Optionaler Anfangsbetrag', type: 'number', defaultValue: 10000, step: 500, unit: '€' },
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.interestRate) || 7.0;
      const amount = parseFloat(inputs.initialAmount) || 10000;
      if (r <= 0) return { primary: { id: 'years', label: 'Verdopplungszeit', value: 0, formattedValue: 'Nie' }, error: 'Rendite muss positiv sein.' };
      const exactYears = Math.log(2) / Math.log(1 + r / 100);
      const y = Math.floor(exactYears);
      const m = Math.round((exactYears - y) * 12);
      return {
        primary: { id: 'years', label: 'Exakte Verdopplungszeit', value: exactYears, formattedValue: `${y} Jahre und ${m} Monate`, highlight: true },
        secondary: [
          { id: 'exactDec', label: 'In Dezimaljahren', value: exactYears, formattedValue: `${formatNumber(exactYears, 2)} Jahre` },
          { id: 'doubled', label: 'Verdoppelter Endbetrag', value: amount * 2, formattedValue: formatCurrency(amount * 2) },
        ],
        summaryText: `Bei einer Rendite von ${formatPercent(r)} p.a. verdoppelt sich Ihr Erspartes in exakt ${y} Jahren und ${m} Monaten.`,
      };
    },
    formula: 'Laufzeit (Jahre) = ln(2) / ln(1 + p/100)',
    formulaExplanation: 'Löst die Zinseszinsgleichung 2 × K₀ = K₀ × (1 + p)^n nach n auf.',
    workedExample: {
      title: 'Beispiel: 7 % jährliche Rendite',
      description: 'Exakt 10,24 Jahre (ca. 10 Jahre und 3 Monate).',
      inputs: { interestRate: 7.0, initialAmount: 10000 },
      resultSummary: 'ca. 10,2 Jahre (Verdopplung auf 20.000 €)',
    },
    content: {
      intro: 'Die Verdopplungszeit beziffert die exakte Dauer in Jahren, bis sich eine Kapitalanlage bei konstanter jährlicher Rendite verdoppelt.',
      details: 'Exakte Formel: t = ln(2) / ln(1 + p/100). Bei 7 % Jahresrendite verdoppelt sich das Kapital nach ca. 10,24 Jahren. Bei 3 % Zinsen dauert es hingegen rund 23,45 Jahre.',
    },
    faqs: [
      { question: 'Wie präzise ist die 72er-Faustformel?', answer: 'Sehr präzise im Bereich von 4 % bis 10 % Rendite: Bei 8 % ergibt 72 / 8 = 9,0 Jahre (exakter Wert: 9,01 Jahre).' },
      { question: 'Wie lange dauert eine Vervierfachung des Kapitals?', answer: 'Genau zwei Verdopplungszyklen: Bei 7 % Rendite vervierfacht sich das Startkapital nach rund 20,5 Jahren.' },
    ],
    relatedSlugs: ['zinseszinsrechner', 'etf-sparplan-rechner', 'sparrechner'],
  },
  {
    id: 'thesaurierend-vs-ausschuettend-rechner',
    slug: 'thesaurierend-vs-ausschuettend-rechner',
    name: 'Thesaurierend vs. Ausschüttend-Rechner (ETF-Vergleich)',
    shortName: 'Thesaurierend vs. Ausschüttend',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Thesaurierend vs. Ausschüttend Rechner – ETF-Ausschüttungsa...',
    metaDescription: 'Vergleichen Sie thesaurierende und ausschüttende ETFs: Vorabpauschale, Zinseszins bei automatischer Reinvestition und Steuern.',
    h1: 'Thesaurierend vs. Ausschüttend Rechner',
    shortDescription: 'Vergleicht die langfristige Vermögensentwicklung von thesaurierenden und ausschüttenden Fonds mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['thesaurierend vs ausschuettend rechner', 'etf ausschuettungsart vergleich', 'vorabpauschale thesaurierer', 'etf reinvestieren rechner'],
    inputs: [
      { id: 'monthlyRate', label: 'Monatliche Sparrate', type: 'number', defaultValue: 300, min: 25, step: 25, unit: '€' },
      { id: 'years', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 25, min: 5, max: 45, step: 1, unit: 'Jahre' },
      { id: 'growthRate', label: 'Erwartete Kurssteigerung p.a.', type: 'number', defaultValue: 5.0, min: 1, step: 0.5, unit: '%' },
      { id: 'dividendRate', label: 'Ausschüttungsrendite (Dividende) p.a.', type: 'number', defaultValue: 2.0, min: 0, step: 0.2, unit: '%' },
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.monthlyRate) || 300;
      const y = parseInt(inputs.years, 10) || 25;
      const growth = parseFloat(inputs.growthRate) || 5.0;
      const div = parseFloat(inputs.dividendRate) || 2.0;
      const totalRate = (growth + div) / 100 / 12;
      const months = y * 12;
      const fvThes = rate * ((Math.pow(1 + totalRate, months) - 1) / totalRate);
      const own = rate * months;
      return {
        primary: { id: 'thes', label: 'Endvermögen Thesaurierer (Acc)', value: fvThes, formattedValue: formatCurrency(fvThes), highlight: true },
        secondary: [
          { id: 'own', label: 'Eigene Einzahlungen', value: own, formattedValue: formatCurrency(own) },
          { id: 'profit', label: 'Reiner Wertzuwachs', value: fvThes - own, formattedValue: formatCurrency(fvThes - own) },
        ],
        summaryText: `Nach ${y} Jahren wächst der ETF-Sparplan auf ca. ${formatCurrency(fvThes)} an.`,
      };
    },
    formula: 'Gesamtrendite = Kursgewinn + Dividende (automatische Reinvestition)',
    formulaExplanation: 'Thesaurierende ETFs legen Erträge direkt innerhalb des Fondsvermögens an.',
    workedExample: {
      title: 'Beispiel: 300 € monatlich über 25 Jahre (5 % Kurs + 2 % Dividende)',
      description: 'Endvermögen ca. 243.000 €.',
      inputs: { monthlyRate: 300, years: 25, growthRate: 5.0, dividendRate: 2.0 },
      resultSummary: 'ca. 243.000 € Endvermögen',
    },
    content: {
      intro: 'Dieser Rechner vergleicht die Steuer- und Vermögensentwicklung von wiederanlegenden (thesaurierenden) und auszahlenden (ausschüttenden) Investmentfonds.',
      details: 'Seit der Investmentsteuerreform 2018 unterliegen thesaurierende Fonds der jährlichen Vorabpauschale nach dem Basiszins der Bundesbank. Ausschütter nutzen den Sparer-Pauschbetrag durch direkte Dividendenzahlungen oft einfacher aus.',
    },
    faqs: [
      { question: 'Was ist die Vorabpauschale bei thesaurierenden ETFs?', answer: 'Eine fiktive Mindestertragsbesteuerung zu Jahresbeginn: Sie errechnet sich aus Basisertrag (70 % des Basiszinses × Portfoliowert) abzüglich tatsächlicher Ausschüttungen, gedeckelt auf den tatsächlichen Wertzuwachs.' },
      { question: 'Wann lohnt sich ein ausschüttender ETF mehr als ein Thesaurierer?', answer: 'Solange der Sparer-Pauschbetrag (1.000 € / 2.000 €) noch nicht anderweitig voll ausgeschöpft ist, lassen sich Dividenden bis zu dieser Grenze steuerfrei vereinnahmen und sofort wiederanlegen.' },
    ],
    relatedSlugs: ['etf-sparplan-rechner', 'freistellungsauftrag-rechner', 'zinseszinsrechner'],
  },
  {
    id: 'rentenluecke-rechner',
    slug: 'rentenluecke-rechner',
    name: 'Rentenlücke-Rechner (Vorsorgebedarf im Alter)',
    shortName: 'Rentenlücke berechnen',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Rentenlücke Rechner – Versorgungslücke zur gesetzlichen Ren...',
    metaDescription: 'Ermitteln Sie Ihre monatliche Rentenlücke im Alter: Wunsch-Nettoeinkommen abzüglich gesetzlicher Rente. Schließen Sie Ihre Vorsorgelücke.',
    h1: 'Rentenlücke Rechner (Versorgungslücke)',
    shortDescription: 'Berechnet die monatliche Differenz zwischen Ihrem gewünschten Netto-Ruhestandseinkommen und der gesetzlichen Rente.',
    searchKeywords: ['rentenluecke rechner', 'versorgungsluecke rente berechnen', 'gesetzliche rente differenz', 'privat vorsorgen rente'],
    inputs: [
      { id: 'desiredNet', label: 'Gewünschtes monatliches Nettoeinkommen im Ruhestand', type: 'number', defaultValue: 2400, min: 500, step: 50, unit: '€' },
      { id: 'expectedPension', label: 'Erwartete gesetzliche Bruttorente', type: 'number', defaultValue: 1600, min: 0, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const target = parseFloat(inputs.desiredNet) || 2400;
      const pensionGross = parseFloat(inputs.expectedPension) || 1600;
      const netPensionEst = pensionGross * 0.82;
      const gap = Math.max(0, target - netPensionEst);
      return {
        primary: { id: 'gap', label: 'Monatliche Rentenlücke (Netto)', value: gap, formattedValue: formatCurrency(gap), highlight: true },
        secondary: [
          { id: 'gapAnnual', label: 'Jährliche Versorgungslücke', value: gap * 12, formattedValue: formatCurrency(gap * 12) },
          { id: 'netPension', label: 'Geschätzte gesetzliche Nettorente', value: netPensionEst, formattedValue: formatCurrency(netPensionEst) },
        ],
        summaryText: `Ihre monatliche Rentenlücke beträgt ca. ${formatCurrency(gap)} (${formatCurrency(gap * 12)} im Jahr).`,
      };
    },
    formula: 'Rentenlücke = Wunschrente - Gesetzliche Nettorente (ca. 82 % der Bruttorente)',
    formulaExplanation: 'Von der gesetzlichen Bruttorente gehen Beiträge für Kranken- und Pflegeversicherung sowie Steuern ab.',
    workedExample: {
      title: 'Beispiel: 2.400 € Wunschrente bei 1.600 € Bruttorente',
      description: 'Monatliche Rentenlücke ca. 1.088 €.',
      inputs: { desiredNet: 2400, expectedPension: 1600 },
      resultSummary: 'ca. 1.088 € monatliche Lücke',
    },
    content: {
      intro: 'Die Rentenlücke ist die Differenz zwischen Ihrem gewünschten Nettoeinkommen im Ruhestand und der voraussichtlichen gesetzlichen Nettorente.',
      details: 'Die gesetzliche Rente liegt für Standardrentner (Eckrentner mit 45 Beitragsjahren) vor Steuern bei rund 48 Prozent des Durchschnittsentgelts. Nach Abzug von Kranken- und Pflegeversicherungsbeiträgen (ca. 11–12 %) und Einkommensteuer verbleibt eine erhebliche Deckungslücke.',
    },
    faqs: [
      { question: 'Wie viel Prozent des letzten Nettoeinkommens benötigt man im Ruhestand?', answer: 'Finanzplaner kalkulieren in der Regel mit 75 bis 85 Prozent des letzten Nettoeinkommens, da Berufsaufwendungen (Pendeln, Arbeitskleidung) entfallen, aber Gesundheits- und Freizeitkosten steigen können.' },
      { question: 'Wird die gesetzliche Rente in voller Höhe versteuert?', answer: 'Für Neurentner steigt der Besteuerungsanteil der Rente jährlich schrittweise an; ab dem Jahrgang 2058 (bzw. nach geplanten Reformen 2040) wird die Rente zu 100 % der Einkommensteuer unterliegen.' },
    ],
    relatedSlugs: ['renteneintritt-rechner', 'spardauer-rechner', 'etf-sparplan-rechner', 'betriebliche-altersvorsorge-rechner'],
  },
  {
    id: 'gold-rendite-rechner',
    slug: 'gold-rendite-rechner',
    name: 'Gold Rendite-Rechner (Unzen & Gramm in Euro)',
    shortName: 'Goldrendite berechnen',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Gold Rendite Rechner – Wertentwicklung',
    metaDescription: 'Ermitteln Sie die Rendite und Wertentwicklung Ihrer Goldanlage nach Feinunzen (oz) oder Gramm in Euro. Steuerfrei nach 1 Jahr Haltedauer.',
    h1: 'Gold Rendite Rechner (Feinunze & Gramm)',
    shortDescription: 'Berechnet den Gewinn, die Gesamtrendite und die steuerfreie Haltefrist von physischem Gold.',
    searchKeywords: ['gold rendite rechner', 'feinunze gold berechnen', 'goldpreis wertentwicklung', 'gold steuerfrei nach 1 jahr'],
    inputs: [
      { id: 'weightGram', label: 'Goldgewicht in Gramm (1 Feinunze = 31,1035 g)', type: 'number', defaultValue: 31.1035, min: 0.1, step: 1, unit: 'g' },
      { id: 'buyPrice', label: 'Kaufpreis je Gramm damals', type: 'number', defaultValue: 55, min: 1, step: 1, unit: '€' },
      { id: 'currentPrice', label: 'Aktueller Goldpreis je Gramm', type: 'number', defaultValue: 75, min: 1, step: 1, unit: '€' },
    ],
    calculate: (inputs) => {
      const g = parseFloat(inputs.weightGram) || 31.1035;
      const buy = parseFloat(inputs.buyPrice) || 55;
      const curr = parseFloat(inputs.currentPrice) || 75;
      const totalBuy = g * buy;
      const totalCurr = g * curr;
      const profit = totalCurr - totalBuy;
      const returnPct = totalBuy > 0 ? (profit / totalBuy) * 100 : 0;
      return {
        primary: { id: 'profit', label: 'Erzielter Wertzuwachs (Gewinn)', value: profit, formattedValue: `${profit >= 0 ? '+' : ''}${formatCurrency(profit)}`, highlight: true },
        secondary: [
          { id: 'ret', label: 'Gesamtrendite', value: returnPct, formattedValue: `${returnPct >= 0 ? '+' : ''}${formatPercent(returnPct, 2)}` },
          { id: 'currVal', label: 'Aktueller Gesamtwert', value: totalCurr, formattedValue: formatCurrency(totalCurr) },
        ],
        summaryText: `Bei ${formatNumber(g, 2)} g Gold beträgt Ihr Gewinn ${formatCurrency(profit)} (${formatPercent(returnPct, 2)} Rendite).`,
      };
    },
    formula: 'Gewinn = Gewicht × (Verkaufspreis - Kaufpreis)',
    formulaExplanation: 'Physisches Gold ist in Deutschland nach 1 Jahr Haltedauer steuerfrei (§ 23 EStG).',
    workedExample: {
      title: 'Beispiel: 1 Unze (31,1 g) Gold gekauft zu 55 €/g, heute 75 €/g',
      description: 'Gewinn: +622,07 € (+36,36 %).',
      inputs: { weightGram: 31.1035, buyPrice: 55, currentPrice: 75 },
      resultSummary: '+622,07 € Gewinn (+36,4 %)',
    },
    content: {
      intro: 'Gold dient seit Jahrtausenden als Wertspeicher und Absicherung gegen Währungskrisen, wirft jedoch selbst weder Zinsen noch Dividenden ab.',
      details: 'Gewinne aus physischem Gold (Münzen, Barren) sind in Deutschland nach § 23 Abs. 1 Nr. 2 EStG nach einer Haltedauer von mehr als einem Jahr vollkommen steuerfrei (keine Abgeltungsteuer).',
    },
    faqs: [
      { question: 'Gilt die Steuerfreiheit nach 1 Jahr auch für Gold-ETCs wie Xetra-Gold oder Euwax Gold?', answer: 'Ja, nach ständiger BFH-Rechtsprechung sind physisch hinterlegte Gold-Inhaberschuldverschreibungen mit Lieferanspruch nach 1 Jahr Haltedauer steuerfrei veräußerbar.' },
      { question: 'Wie hoch sind die typischen Ankauf-Verkauf-Spannen (Spread) bei Goldmünzen?', answer: 'Bei gängigen 1-Unzen-Anlagemünzen (Krügerrand, Maple Leaf) liegt der Spread oft bei 2 bis 4 %; bei kleinen Stückelungen (1 Gramm) kann er über 15 % betragen.' },
    ],
    relatedSlugs: ['inflationsrechner', 'renditerechner', 'kaufkraftverlust-rechner'],
  },

  // ==================== KREDIT (19) ====================
  {
    id: 'baufinanzierung-rechner',
    slug: 'baufinanzierung-rechner',
    name: 'Baufinanzierungsrechner (Monatsrate & Zinsbindung)',
    shortName: 'Baufinanzierung',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Baufinanzierungsrechner – Immobilienkredit & Nebenkosten',
    metaDescription: 'Berechnen Sie Ihre Immobilienfinanzierung inklusive Kaufpreis, Nebenkosten, Eigenkapitalquote und monatlicher Annuitätenrate.',
    h1: 'Baufinanzierungsrechner – Gesamte Immobilienfinanzierung',
    shortDescription: 'Kalkuliert die ganzheitliche Baufinanzierung inklusive Kaufnebenkosten, Eigenkapitaleinsatz und monatlicher Finanzierungsrate.',
    searchKeywords: ['baufinanzierung rechner', 'immobiliendarlehen monatsrate', 'baugeld zinsbindung rechner', 'tilgungsplan hauskauf'],
    inputs: [
      { id: 'loanAmount', label: 'Darlehensbetrag (Kreditsumme)', type: 'number', defaultValue: 300000, min: 10000, step: 5000, unit: '€' },
      { id: 'interestRate', label: 'Sollzinssatz p.a.', type: 'number', defaultValue: 3.6, min: 0.5, step: 0.1, unit: '%' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.0, min: 1.0, max: 10, step: 0.25, unit: '%' },
      { id: 'fixedYears', label: 'Sollzinsbindung in Jahren', type: 'number', defaultValue: 15, min: 5, max: 30, step: 5, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 300000;
      const z = parseFloat(inputs.interestRate) || 3.6;
      const t = parseFloat(inputs.initialRepayment) || 2.0;
      const years = parseInt(inputs.fixedYears, 10) || 15;
      const annualAnnuity = loan * ((z + t) / 100);
      const monthlyRate = annualAnnuity / 12;
      let balance = loan;
      let totalInterestPaid = 0;
      const monthlyZ = (z / 100) / 12;
      for (let m = 0; m < years * 12; m++) {
        const intPortion = balance * monthlyZ;
        const repPortion = monthlyRate - intPortion;
        totalInterestPaid += intPortion;
        balance -= repPortion;
        if (balance <= 0) { balance = 0; break; }
      }
      return {
        primary: { id: 'rate', label: 'Monatliche Kreditrate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'rest', label: `Restschuld nach ${years} Jahren`, value: balance, formattedValue: formatCurrency(balance) },
          { id: 'interest', label: 'Gezahlte Zinsen während Zinsbindung', value: totalInterestPaid, formattedValue: formatCurrency(totalInterestPaid) },
        ],
        summaryText: `Bei ${formatCurrency(loan)} Kreditsumme zahlen Sie monatlich ${formatCurrency(monthlyRate)}. Nach ${years} Jahren verbleiben ${formatCurrency(balance)} Restschuld.`,
      };
    },
    formula: 'Monatsrate = Darlehensbetrag × (Sollzins + Tilgung) / 1200',
    formulaExplanation: 'Beim Annuitätendarlehen bleibt die Monatsrate während der Zinsbindung konstant.',
    workedExample: {
      title: 'Beispiel: 300.000 € zu 3,6 % Zins und 2,0 % Tilgung (15 Jahre)',
      description: 'Monatsrate: 1.400,00 €. Restschuld nach 15 Jahren: ca. 182.250 €.',
      inputs: { loanAmount: 300000, interestRate: 3.6, initialRepayment: 2.0, fixedYears: 15 },
      resultSummary: '1.400,00 € Monatsrate | ca. 182.250 € Restschuld',
    },
    content: {
      intro: 'Der Baufinanzierungsrechner ermittelt die monatliche Darlehensrate, Zinskosten und den Zins- und Tilgungsverlauf für Immobilienkauf oder Hausbau.',
      details: 'Neben dem Kaufpreis müssen Kaufnebenkosten (Grunderwerbsteuer je nach Bundesland 3,5–6,5 %, Notar- und Grundbuchkosten ca. 1,5–2 %, Maklerprovision bis 3,57 %) durch Eigenkapital abgedeckt werden.',
    },
    faqs: [
      { question: 'Wie viel Eigenkapital sollte man in eine Baufinanzierung einbringen?', answer: 'Banken empfehlen, mindestens die Kaufnebenkosten (ca. 10 bis 15 Prozent des Kaufpreises) sowie idealerweise weitere 10 bis 20 Prozent als Eigenkapital mitzubringen.' },
      { question: 'Welche Zinsbindung ist bei Baufinanzierungen ratsam?', answer: 'In Niedrigzinsphasen empfiehlt sich eine lange Zinsbindung von 15 bis 20 Jahren zur Planungssicherheit; bei hohen Zinsen bieten 10-jährige Laufzeiten mehr Flexibilität.' },
    ],
    relatedSlugs: ['zwischenfinanzierung-rechner', 'kreditrechner-ohne-eigenkapital', 'forward-darlehen-rechner', 'modernisierungskredit-rechner', 'volltilger-darlehen-rechner', 'tilgungsrechner'],
  },
  {
    id: 'ballonfinanzierung-rechner',
    slug: 'ballonfinanzierung-rechner',
    name: 'Ballonfinanzierung Rechner (Kfz-Kredit mit Schlussrate)',
    shortName: 'Ballonfinanzierung',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Ballonfinanzierung Rechner – Autokredit mit Schlussrate',
    metaDescription: 'Berechnen Sie Ihre Kfz-Ballonfinanzierung: Niedrige Monatsraten während der Laufzeit und transparente Schlussrate im Zinsvergleich.',
    h1: 'Ballonfinanzierung Rechner – Kfz-Kredit mit Schlussrate',
    shortDescription: 'Ermittelt Ratenhöhe und Gesamtkosten für eine Kfz-Ballonfinanzierung mit vereinbarter Schlussrate im Vergleich zum Ratenkredit.',
    searchKeywords: ['ballonfinanzierung rechner', 'autokredit mit schlussrate', 'kfz finanzierung monatsrate', 'ballonfinanzierung rechner schlussrate', 'schlussratenfinanzierung auto'],
    inputs: [
      { id: 'carPrice', label: 'Fahrzeugpreis', type: 'number', defaultValue: 28000, min: 1000, step: 500, unit: '€' },
      { id: 'downPayment', label: 'Anzahlung / Inzahlungnahme', type: 'number', defaultValue: 5000, min: 0, step: 500, unit: '€' },
      { id: 'interestRate', label: 'Effektiver Jahreszins', type: 'number', defaultValue: 5.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'months', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 48, min: 12, max: 96, step: 6, unit: 'Monate' },
      { id: 'balloonPayment', label: 'Schlussrate (0 € bei klassischem Kredit)', type: 'number', defaultValue: 8000, min: 0, step: 500, unit: '€' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.carPrice) || 28000;
      const down = parseFloat(inputs.downPayment) || 5000;
      const rate = parseFloat(inputs.interestRate) || 5.5;
      const m = parseInt(inputs.months, 10) || 48;
      const balloon = parseFloat(inputs.balloonPayment) || 0;
      const loan = Math.max(0, price - down);
      const r = (rate / 100) / 12;
      let monthlyRate = 0;
      if (r > 0) {
        const pvBalloon = balloon / Math.pow(1 + r, m);
        const amortLoan = loan - pvBalloon;
        monthlyRate = amortLoan * (r / (1 - Math.pow(1 + r, -m)));
      } else {
        monthlyRate = (loan - balloon) / m;
      }
      return {
        primary: { id: 'rate', label: 'Monatliche Autokreditrate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'balloon', label: 'Verbleibende Schlussrate', value: balloon, formattedValue: formatCurrency(balloon) },
          { id: 'totalCost', label: 'Gesamtinvestition (inkl. Zinsen)', value: down + (monthlyRate * m) + balloon, formattedValue: formatCurrency(down + (monthlyRate * m) + balloon) },
        ],
        summaryText: `Für das Fahrzeug zahlen Sie nach ${formatCurrency(down)} Anzahlung monatlich ${formatCurrency(monthlyRate)}.`,
      };
    },
    formula: 'Monatsrate = Annuitätenformel unter Abzug der abgezinsten Schlussrate',
    formulaExplanation: 'Bei einer Ballonfinanzierung zahlen Sie während der Laufzeit kleinere Raten und am Ende die Schlussrate.',
    workedExample: {
      title: 'Beispiel: 28.000 € Auto, 5.000 € Anzahlung, 8.000 € Schlussrate (48 Monate)',
      description: 'Monatsrate: ca. 367 € statt ca. 534 € (ohne Schlussrate).',
      inputs: { carPrice: 28000, downPayment: 5000, interestRate: 5.5, months: 48, balloonPayment: 8000 },
      resultSummary: 'ca. 367 € / Monat (Schlussrate: 8.000 €)',
    },
    content: {
      intro: 'Die Ballonfinanzierung (Schlussratenfinanzierung) kombiniert niedrige monatliche Raten während der Vertragslaufzeit mit einer vorab vereinbarten, hohen Schlussrate.',
      details: 'Da die hohe Schlussrate während der gesamten Laufzeit mitverzinst werden muss, liegen die kumulierten Gesamtzinskosten einer Ballonfinanzierung spürbar über denen eines Standardkredits.',
    },
    faqs: [
      { question: 'Was passiert, wenn der Fahrzeugwert am Ende unter der Schlussrate liegt?', answer: 'Reicht der Verkaufserlös des Autos nicht zur Begleichung der Schlussrate aus, muss die Differenz aus eigenen Mitteln beglichen oder per Ratenkredit weiterfinanziert werden.' },
      { question: 'Für wen ist ein Autokredit mit Schlussrate sinnvoll?', answer: 'Für Personen, die während der Laufzeit geringe monatliche Belastungen wünschen und sicher wissen, dass zum Laufzeitende eine größere Summe (z. B. aus Fälligkeit einer Anlage) bereitsteht.' },
    ],
    relatedSlugs: ['autokreditrechner', 'kreditrechner', 'leasingfaktor-rechner', 'auto-gesamtkosten-rechner'],
  },
  {
    id: 'umschuldung-rechner',
    slug: 'umschuldung-rechner',
    name: 'Umschuldungsrechner (Kredite bündeln & Zinsen sparen)',
    shortName: 'Umschuldung berechnen',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Umschuldungsrechner – Zinsersparnis bei Kreditablösung bere...',
    metaDescription: 'Lohnt sich das Umschulden? Berechnen Sie Ihre Zinsersparnis beim Ablösen teurer Alt- und Ratenkredite durch ein günstiges Neudarlehen.',
    h1: 'Umschuldungsrechner (Kreditablösung)',
    shortDescription: 'Vergleicht Ihren bestehenden Kredit mit einem günstigeren Neukredit und weist die Netto-Zinsersparnis aus.',
    searchKeywords: ['umschuldung rechner', 'kredit umschulden zinsersparnis', 'teuren kredit abloesen', 'umschuldungsvergleich online'],
    inputs: [
      { id: 'currentDebt', label: 'Aktuelle Restschuld des Altkredits', type: 'number', defaultValue: 18000, min: 500, step: 500, unit: '€' },
      { id: 'oldRate', label: 'Bisheriger Zinssatz (Altkredit)', type: 'number', defaultValue: 7.9, min: 1, step: 0.1, unit: '%' },
      { id: 'newRate', label: 'Neuer Zinssatz (Umschuldungskredit)', type: 'number', defaultValue: 4.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'remainingMonths', label: 'Verbleibende Restlaufzeit in Monaten', type: 'number', defaultValue: 48, min: 6, max: 120, step: 6, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const debt = parseFloat(inputs.currentDebt) || 18000;
      const oldR = parseFloat(inputs.oldRate) || 7.9;
      const newR = parseFloat(inputs.newRate) || 4.5;
      const m = parseInt(inputs.remainingMonths, 10) || 48;
      const rOld = (oldR / 100) / 12;
      const rNew = (newR / 100) / 12;
      const oldRate = debt * (rOld / (1 - Math.pow(1 + rOld, -m)));
      const newRate = debt * (rNew / (1 - Math.pow(1 + rNew, -m)));
      const penalty = m > 12 ? debt * 0.01 : debt * 0.005;
      const netSavings = ((oldRate * m) - debt) - ((newRate * m) - debt) - penalty;
      return {
        primary: { id: 'savings', label: 'Ihre Netto-Zinsersparnis', value: netSavings, formattedValue: formatCurrency(Math.max(0, netSavings)), highlight: true },
        secondary: [
          { id: 'relief', label: 'Monatliche Entlastung', value: oldRate - newRate, formattedValue: formatCurrency(oldRate - newRate) },
          { id: 'newRate', label: 'Neue günstigere Rate', value: newRate, formattedValue: formatCurrency(newRate) },
        ],
        summaryText: `Durch die Umschuldung sparen Sie ca. ${formatCurrency(Math.max(0, netSavings))} an Zinsen. Ihre Monatsrate sinkt um ${formatCurrency(oldRate - newRate)}.`,
      };
    },
    formula: 'Ersparnis = Zinsen_Alt - Zinsen_Neu - Vorfälligkeit',
    formulaExplanation: 'Nach § 502 BGB darf die Bank maximal 1,0 % als Vorfälligkeitsentschädigung berechnen.',
    workedExample: {
      title: 'Beispiel: 18.000 € von 7,9 % auf 4,5 % umschulden',
      description: 'Netto-Zinsersparnis ca. 1.160 € über 48 Monate.',
      inputs: { currentDebt: 18000, oldRate: 7.9, newRate: 4.5, remainingMonths: 48 },
      resultSummary: 'ca. 1.160 € Netto-Ersparnis',
    },
    content: {
      intro: 'Eine Umschuldung löst bestehende, teure Kredite oder den Dispositionskredit durch ein neues Darlehen mit spürbar günstigeren Konditionen ab.',
      details: 'Der Rechner vergleicht die verbleibenden Restzinsen des Altkredits mit den Zinskosten des Neukredits abzüglich eventuell anfallender Vorfälligkeitsentschädigungen (§ 502 BGB).',
    },
    faqs: [
      { question: 'Wann lohnt sich eine Kreditumschuldung besonders?', answer: 'Besonders bei älteren Ratenkrediten mit hohen Zinssätzen, bei der Zusammenfassung mehrerer kleiner Kredite zu einer übersichtlichen Rate oder bei dauerhafter Nutzung des teuren Girokontodispos.' },
      { question: 'Fallen bei der Ablösung von Ratenkrediten Kosten an?', answer: 'Die Bank darf nach § 502 BGB maximal 1 Prozent der vorzeitig zurückgezahlten Restsumme (bei Restlaufzeit unter einem Jahr maximal 0,5 Prozent) als Vorfälligkeitsentschädigung verlangen.' },
    ],
    relatedSlugs: ['vorfaelligkeitsentschaedigung-rechner', 'kreditrechner', 'dispozins-rechner', 'restschuld-rechner'],
  },
  {
    id: 'dispozins-rechner',
    slug: 'dispozins-rechner',
    name: 'Dispozins-Rechner (Kosten der Kontoüberziehung)',
    shortName: 'Dispozins berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Dispozins Rechner – Zinskosten für Dispokredit',
    metaDescription: 'Berechnen Sie die Zinskosten für Ihre Kontoüberziehung (Dispositionskredit): Taggenaue Abrechnung nach deutscher Zinsmethode.',
    h1: 'Dispozins Rechner (Kontoüberziehung)',
    shortDescription: 'Ermittelt die Zinskosten für geduldete und vereinbarte Kontoüberziehungen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['dispozins rechner', 'dispokredit zinsen berechnen', 'konto ueberziehung kosten', 'dispozinsen pro tag'],
    inputs: [
      { id: 'overdraftAmount', label: 'In Anspruch genommener Dispo-Betrag', type: 'number', defaultValue: 1500, min: 50, step: 50, unit: '€' },
      { id: 'dispoRate', label: 'Dispozinssatz der Bank p.a.', type: 'number', defaultValue: 11.5, min: 4, max: 20, step: 0.25, unit: '%' },
      { id: 'days', label: 'Überziehungsdauer in Tagen', type: 'number', defaultValue: 45, min: 1, max: 365, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const amount = parseFloat(inputs.overdraftAmount) || 1500;
      const rate = parseFloat(inputs.dispoRate) || 11.5;
      const days = parseInt(inputs.days, 10) || 45;
      const interest = (amount * rate * days) / 36000;
      return {
        primary: { id: 'interest', label: 'Anfallende Dispozinsen', value: interest, formattedValue: formatCurrency(interest), highlight: true },
        secondary: [
          { id: 'perDay', label: 'Zinskosten pro Tag', value: interest / days, formattedValue: formatCurrency(interest / days) },
          { id: 'perYear', label: 'Zinskosten bei 1 Jahr Überziehung', value: (amount * rate) / 100, formattedValue: formatCurrency((amount * rate) / 100) },
        ],
        summaryText: `Für ${formatCurrency(amount)} über ${days} Tage bei ${formatPercent(rate)} Dispozins zahlen Sie ${formatCurrency(interest)} Zinsen.`,
      };
    },
    formula: 'Dispozinsen = (Überziehungsbetrag × Zinssatz × Tage) / (100 × 360)',
    formulaExplanation: 'Deutsche Zinsmethode (30/360). Banken berechnen Dispozinsen taggenau.',
    workedExample: {
      title: 'Beispiel: 1.500 € Dispo bei 11,5 % Zinsen für 45 Tage',
      description: 'Zinskosten: 21,56 €.',
      inputs: { overdraftAmount: 1500, dispoRate: 11.5, days: 45 },
      resultSummary: '21,56 € Dispozinsen',
    },
    content: {
      intro: 'Der Dispositionskredit (Dispo) auf dem Girokonto ist flexibel, gehört mit durchschnittlich 10 bis 14 Prozent Effektivzins jedoch zu den teuersten Kreditformen in Deutschland.',
      details: 'Dispozinsen werden taggenau auf den beanspruchten Überziehungsbetrag berechnet: Zinsen = Überziehungsbetrag · (Dispozinssatz / 100) · (Tage / 360).',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Dispo- und Überziehungszins?', answer: 'Der Dispozinssatz gilt innerhalb des vereinbarten Rahmens (z. B. bis 3 Monatsgehälter). Wird dieser Rahmen noch weiter überzogen (geduldete Überziehung), verlangen Banken oft zusätzliche Strafzinsen.' },
      { question: 'Ab wann sollte ein Dispositionskredit umgeschuldet werden?', answer: 'Sobald das Konto länger als zwei bis drei Monate im Minus verharrt, ist ein günstiger Ratenkredit rechnerisch fast immer die wirtschaftlichere Wahl.' },
    ],
    relatedSlugs: ['umschuldung-rechner', 'kreditrechner', 'kaufkraftverlust-rechner'],
  },
  {
    id: 'maximaler-kredit-rechner',
    slug: 'maximaler-kredit-rechner',
    name: 'Maximaler Kredit-Rechner (Wie viel Kredit kann ich mir leisten?)',
    shortName: 'Maximaler Kredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Maximaler Kredit Rechner – Wie viel Kredit bekomme ich mit...',
    metaDescription: 'Ermitteln Sie Ihren maximalen Darlehensbetrag: Wie viel Kredit Sie sich anhand Ihrer monatlichen Wunschrate und Laufzeit leisten können.',
    h1: 'Maximaler Kredit Rechner (Kreditrahmen prüfen)',
    shortDescription: 'Berechnet die maximal finanzierbare Kreditsumme aus Ihrem monatlichen Budget mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['maximaler kredit rechner', 'wie viel kredit bekomme ich', 'leistbare kredithoehe berechnen', 'kreditrahmen gehalt rechner'],
    inputs: [
      { id: 'monthlyBudget', label: 'Monatlich leistbare Kreditrate', type: 'number', defaultValue: 500, min: 50, step: 25, unit: '€' },
      { id: 'interestRate', label: 'Angenommener Zinssatz p.a.', type: 'number', defaultValue: 4.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'termYears', label: 'Gewünschte Laufzeit in Jahren', type: 'number', defaultValue: 5, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.monthlyBudget) || 500;
      const z = parseFloat(inputs.interestRate) || 4.5;
      const years = parseInt(inputs.termYears, 10) || 5;
      const r = (z / 100) / 12;
      const m = years * 12;
      const maxLoan = r > 0 ? rate * ((1 - Math.pow(1 + r, -m)) / r) : rate * m;
      return {
        primary: { id: 'loan', label: 'Maximaler Kreditbetrag', value: maxLoan, formattedValue: formatCurrency(maxLoan), highlight: true },
        secondary: [
          { id: 'total', label: 'Gesamte Rückzahlung', value: rate * m, formattedValue: formatCurrency(rate * m) },
          { id: 'interest', label: 'Darin enthaltene Zinskosten', value: (rate * m) - maxLoan, formattedValue: formatCurrency((rate * m) - maxLoan) },
        ],
        summaryText: `Mit ${formatCurrency(rate)} Monatsrate können Sie sich bei ${formatPercent(z)} Zinsen ca. ${formatCurrency(maxLoan)} Kredit leisten.`,
      };
    },
    formula: 'Kreditsumme = Monatsrate × ((1 - (1 + r)^-n) / r)',
    formulaExplanation: 'Barwertformel einer monatlichen Rente.',
    workedExample: {
      title: 'Beispiel: 500 € Monatsrate bei 4,5 % über 5 Jahre',
      description: 'Maximaler Kreditbetrag: ca. 26.860 €.',
      inputs: { monthlyBudget: 500, interestRate: 4.5, termYears: 5 },
      resultSummary: 'ca. 26.860 € Darlehenssumme',
    },
    content: {
      intro: 'Dieser Budgetrechner ermittelt anhand Ihrer monatlichen Haushaltsrechnung (Nettoeinkommen abzüglich Lebenshaltungskosten und Pauschalen), welchen Kreditbetrag Sie maximal stemmen können.',
      details: 'Banken setzen bei der Haushaltsrechnung Pauschalen für Lebenshaltung (ca. 800–1.200 € für die erste Person, ca. 300–400 € je weitere Person) an. Die tragbare Rate sollte höchstens 35–40 % des Haushaltsnettoeinkommens betragen.',
    },
    faqs: [
      { question: 'Welche Ausgaben fließen in die Haushaltsrechnung der Bank ein?', answer: 'Kranken- und Sachversicherungen, PKW-Kostenpauschalen, Unterhaltsverpflichtungen, bestehende Kredite sowie pauschale Lebenshaltungskosten.' },
      { question: 'Werden Mieteinnahmen oder Boni voll als Einkommen anerkannt?', answer: 'Mieteinnahmen werden meist mit einem Sicherheitsabschlag von 15 bis 25 Prozent angesetzt; unregelmäßige Boni und Überstundenvergütungen werden oft nur teilweise gewertet.' },
    ],
    relatedSlugs: ['kreditrechner', 'baufinanzierung-rechner', 'tilgungsrechner'],
  },
  {
    id: 'zinsbindung-rechner',
    slug: 'zinsbindung-rechner',
    name: 'Zinsbindungs-Vergleichsrechner (5 vs. 10 vs. 15 Jahre)',
    shortName: 'Zinsbindung vergleichen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Zinsbindung Rechner – Zinsänderungsrisiko',
    metaDescription: 'Vergleichen Sie Zinsbindungen (10, 15 oder 20 Jahre): Welche Restschuld verbleibt und wie viel Zinssicherheit kostet der Aufpreis?',
    h1: 'Zinsbindungs-Vergleichsrechner',
    shortDescription: 'Vergleicht unterschiedliche Zinsbindungsfristen und quantifiziert das Zinsänderungsrisiko der Restschuld mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['zinsbindung rechner', 'sollzinsbindung 10 oder 15 jahre', 'zinsrisiko restschuld berechnen', 'anschlussfinanzierung zinsen'],
    inputs: [
      { id: 'loan', label: 'Darlehenssumme', type: 'number', defaultValue: 250000, min: 10000, step: 5000, unit: '€' },
      { id: 'rate10', label: 'Zinssatz bei 10 Jahren Zinsbindung', type: 'number', defaultValue: 3.4, min: 0.5, step: 0.1, unit: '%' },
      { id: 'rate15', label: 'Zinssatz bei 15 Jahren Zinsbindung', type: 'number', defaultValue: 3.7, min: 0.5, step: 0.1, unit: '%' },
      { id: 'initialRepay', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.5, min: 1, step: 0.5, unit: '%' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loan) || 250000;
      const z10 = parseFloat(inputs.rate10) || 3.4;
      const z15 = parseFloat(inputs.rate15) || 3.7;
      const t = parseFloat(inputs.initialRepay) || 2.5;
      const monthly10 = loan * ((z10 + t) / 1200);
      const monthly15 = loan * ((z15 + t) / 1200);
      let b10 = loan;
      for (let m = 0; m < 120; m++) b10 -= (monthly10 - b10 * ((z10 / 100) / 12));
      let b15 = loan;
      for (let m = 0; m < 180; m++) b15 -= (monthly15 - b15 * ((z15 / 100) / 12));
      return {
        primary: { id: 'diff', label: 'Aufpreis für 15 Jahre Bindung', value: monthly15 - monthly10, formattedValue: `+${formatCurrency(monthly15 - monthly10)} / Monat`, highlight: true },
        secondary: [
          { id: 'rate10', label: 'Rate (10 Jahre fest)', value: monthly10, formattedValue: formatCurrency(monthly10) },
          { id: 'rest10', label: 'Restschuld nach 10 Jahren', value: b10, formattedValue: formatCurrency(b10) },
          { id: 'rate15', label: 'Rate (15 Jahre fest)', value: monthly15, formattedValue: formatCurrency(monthly15) },
          { id: 'rest15', label: 'Restschuld nach 15 Jahren', value: b15, formattedValue: formatCurrency(b15) },
        ],
        summaryText: `Für ${formatCurrency(monthly15 - monthly10)} Aufpreis pro Monat sichern Sie sich 5 Jahre mehr Zinsschutz.`,
      };
    },
    formula: 'Restschuld_10Jahre vs. Restschuld_15Jahre',
    formulaExplanation: 'Längere Zinsbindungen bieten Planungssicherheit gegen einen Zinsaufschlag.',
    workedExample: {
      title: 'Beispiel: 250.000 € Darlehen (10 Jahre zu 3,4 % vs. 15 Jahre zu 3,7 %)',
      description: 'Restschuld nach 10 Jahren: ca. 171.000 €. Nach 15 Jahren: ca. 126.000 €.',
      inputs: { loan: 250000, rate10: 3.4, rate15: 3.7, initialRepay: 2.5 },
      resultSummary: 'Vergleich 10 vs. 15 Jahre Zinsbindung',
    },
    content: {
      intro: 'Dieser Zinsbindungsvergleich stellt die Vor- und Nachteile von 5-, 10-, 15- oder 20-jährigen Zinsbindungen gegenüber.',
      details: 'Längere Zinsbindungen verlangen von der Bank einen Zinsaufschlag (Liquiditäts- und Risikoprämie), bieten dem Kreditnehmer dafür aber absolute Zinssicherheit vor steigenden Marktzinsen.',
    },
    faqs: [
      { question: 'Wann sollte man eine 10-jährige und wann eine 20-jährige Zinsbindung wählen?', answer: 'Bei historisch niedrigen Zinsen und knappem Budget ist eine lange Zinsbindung (15–20 Jahre) sicherer. Bei hohen Zinsen lohnt sich eine 10-jährige Frist, um später günstig umschulden zu können.' },
      { question: 'Gilt das Kündigungsrecht nach § 489 BGB auch bei 20-jähriger Bindung?', answer: 'Ja, Darlehensnehmer können auch einen 20-Jahres-Kredit nach 10 Jahren mit einer 6-monatigen Frist kostenfrei kündigen – die Bank hingegen bleibt die vollen 20 Jahre an den Zinssatz gebunden.' },
    ],
    relatedSlugs: ['forward-darlehen-rechner', 'baufinanzierung-rechner', 'tilgungsrechner', 'restschuld-rechner'],
  },
  {
    id: 'volltilger-darlehen-rechner',
    slug: 'volltilger-darlehen-rechner',
    name: 'Volltilger-Rechner (Kredit komplett tilgen ohne Restschuld)',
    shortName: 'Volltilgerdarlehen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Volltilger Rechner – Rate für 100 % Tilgung innerhalb Zinsb...',
    metaDescription: 'Berechnen Sie die Rate für ein Volltilgerdarlehen: Schuldenfrei nach 15, 20 oder 25 Jahren ohne jedes Restschuld- und Zinsänderungsrisiko.',
    h1: 'Volltilgerdarlehen Rechner (Schuldenfrei nach Frist)',
    shortDescription: 'Ermittelt die exakte monatliche Rate und den notwendigen Tilgungssatz für die vollständige Darlehenstilgung.',
    searchKeywords: ['volltilger rechner', 'volltilgerdarlehen monatsrate', 'kredit ohne restschuld tilgen', 'schuldenfrei nach 20 jahren'],
    inputs: [
      { id: 'loanAmount', label: 'Darlehensbetrag', type: 'number', defaultValue: 200000, min: 10000, step: 5000, unit: '€' },
      { id: 'interestRate', label: 'Fester Sollzins p.a.', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Wunschlaufzeit bis Schuldenfreiheit', type: 'number', defaultValue: 20, min: 5, max: 35, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 200000;
      const z = parseFloat(inputs.interestRate) || 3.5;
      const years = parseInt(inputs.years, 10) || 20;
      const r = (z / 100) / 12;
      const m = years * 12;
      const monthlyRate = loan * (r / (1 - Math.pow(1 + r, -m)));
      const initialTilgung = ((monthlyRate * 12) / loan) * 100 - z;
      return {
        primary: { id: 'rate', label: 'Monatliche Volltilger-Rate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'tilgung', label: 'Erforderliche anfängliche Tilgung', value: initialTilgung, formattedValue: formatPercent(initialTilgung, 2) },
          { id: 'interest', label: 'Gesamte Zinskosten bis Schuldenfreiheit', value: (monthlyRate * m) - loan, formattedValue: formatCurrency((monthlyRate * m) - loan) },
        ],
        summaryText: `Mit einer Monatsrate von ${formatCurrency(monthlyRate)} (Tilgung ${formatPercent(initialTilgung, 2)}) ist der Kredit in ${years} Jahren komplett getilgt.`,
      };
    },
    formula: 'Monatsrate = Kreditsumme × (r / (1 - (1 + r)^-n))',
    formulaExplanation: 'Berechnet die Annuität für eine Restschuld von exakt 0 Euro am Laufzeitende.',
    workedExample: {
      title: 'Beispiel: 200.000 € zu 3,5 % voll tilgen in 20 Jahren',
      description: 'Monatsrate: 1.159,92 € (anfängliche Tilgung: 3,46 %). Restschuld: 0 €.',
      inputs: { loanAmount: 200000, interestRate: 3.5, years: 20 },
      resultSummary: '1.159,92 € / Monat (0 € Restschuld)',
    },
    content: {
      intro: 'Ein Volltilgerdarlehen ist so konzipiert, dass die Kreditsumme bis zum Ende der vertraglich vereinbarten Zinsbindung auf exakt null Euro getilgt wird.',
      details: 'Da keine Restschuld verbleibt, entfällt jedes Zinsänderungsrisiko für eine Anschlussfinanzierung. Dafür verlangt das Volltilgerdarlehen eine überdurchschnittlich hohe monatliche Tilgungsleistung.',
    },
    faqs: [
      { question: 'Welche Vorteile bieten Banken für Volltilgerdarlehen?', answer: 'Weil für die Bank das Ausfallrisiko am Laufzeitende entfällt, gewähren viele Kreditinstitute Zinsrabatte von 0,1 bis 0,3 Prozentpunkten auf den regulären Sollzins.' },
      { question: 'Gibt es Nachteile bei einem Volltilgerdarlehen?', answer: 'Die monatliche Belastung ist starr und hoch; vorzeitige Sondertilgungen sind vertraglich oft eingeschränkt oder ausgeschlossen.' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'tilgungsrechner', 'restschuld-rechner'],
  },
  {
    id: 'modernisierungskredit-rechner',
    slug: 'modernisierungskredit-rechner',
    name: 'Modernisierungskredit-Rechner (Sanierung & Renovierung)',
    shortName: 'Modernisierungskredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Modernisierungskredit Rechner – Sanierung, Wärmepumpe',
    metaDescription: 'Berechnen Sie die Rate für Ihren Modernisierungskredit ohne Grundbucheintrag (Wohnkredit) für Heizung, Dämmung, Dach und Fenster.',
    h1: 'Modernisierungskredit Rechner (Wohnkredit)',
    shortDescription: 'Kalkuliert Modernisierungsdarlehen für Immobilienbesitzer (meist bis 50.000 € ohne Grundschuldeintrag).',
    searchKeywords: ['modernisierungskredit rechner', 'wohnkredit sanierung zinsen', 'kredit waermepumpe berechnen', 'renovierungskredit ohne grundschuld'],
    inputs: [
      { id: 'amount', label: 'Modernisierungsbudget', type: 'number', defaultValue: 35000, min: 5000, step: 2500, unit: '€' },
      { id: 'interestRate', label: 'Sollzins p.a.', type: 'number', defaultValue: 4.8, min: 1, step: 0.1, unit: '%' },
      { id: 'termYears', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 8, min: 2, max: 15, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.amount) || 35000;
      const z = parseFloat(inputs.interestRate) || 4.8;
      const y = parseInt(inputs.termYears, 10) || 8;
      const r = (z / 100) / 12;
      const m = y * 12;
      const rate = loan * (r / (1 - Math.pow(1 + r, -m)));
      return {
        primary: { id: 'rate', label: 'Monatliche Rate', value: rate, formattedValue: formatCurrency(rate), highlight: true },
        secondary: [
          { id: 'interest', label: 'Gesamte Zinskosten', value: (rate * m) - loan, formattedValue: formatCurrency((rate * m) - loan) },
          { id: 'notarySaved', label: 'Ersparnis Notar/Grundbuch', value: 650, formattedValue: 'ca. 650 € (keine Grundschuld)' },
        ],
        summaryText: `Für ${formatCurrency(loan)} Modernisierung zahlen Sie monatlich ${formatCurrency(rate)} über ${y} Jahre.`,
      };
    },
    formula: 'Monatsrate = Kreditsumme × (r / (1 - (1 + r)^-n))',
    formulaExplanation: 'Wohnkredite werden als Ratenkredit ohne Notarkosten für die Grundschuld vergeben.',
    workedExample: {
      title: 'Beispiel: 35.000 € über 8 Jahre zu 4,8 %',
      description: 'Monatsrate: ca. 439,72 €. Gesamtzinsen: ca. 7.213 €.',
      inputs: { amount: 35000, interestRate: 4.8, termYears: 8 },
      resultSummary: 'ca. 439,72 € / Monat',
    },
    content: {
      intro: 'Modernisierungs- und Sanierungskredite finanzieren energetische Maßnahmen (Wärmepumpe, Fenster, Dämmung, PV-Anlage) oder Renovierungen an Bestandsimmobilien.',
      details: 'Kredite bis 50.000 € werden von vielen Banken als sogenannte Blankodarlehen ohne teure Grundbucheintragung vergeben. Zudem können staatliche Förderungen der KfW oder des BAFA kombiniert werden.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Modernisierungskredit und freiem Ratenkredit?', answer: 'Durch den wohnwirtschaftlichen Verwendungsnachweis bieten Modernisierungskredite deutlich günstigere Zinssätze als herkömmliche Ratenkredite zur freien Verfügung.' },
      { question: 'Welche KfW-Programme unterstützen energetische Sanierungen?', answer: 'Insbesondere das Programm KfW 261 (Wohngebäude-Kredit) mit zinsgünstigen Krediten und hohen Tilgungszuschüssen für Effizienzhäuser.' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'kreditrechner', 'tilgungsrechner'],
  },
  {
    id: 'kreditvergleich-rechner',
    slug: 'kreditvergleich-rechner',
    name: 'Kreditvergleich-Rechner (Zwei Angebote direkt vergleichen)',
    shortName: 'Kreditvergleich',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Kreditvergleich Rechner – Zwei Darlehensangebote objektiv v...',
    metaDescription: 'Vergleichen Sie zwei Kreditangebote nach Monatsrate, Gesamtzinskosten und Restschuld. Transparenter Rechner für Raten- & Baudarlehen.',
    h1: 'Kreditvergleich Rechner (Angebot A vs. Angebot B)',
    shortDescription: 'Gegenüberstellung zweier Kreditangebote zur Ermittlung des finanziell günstigsten Darlehens mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['kreditvergleich rechner', 'zwei kredite vergleichen online', 'kreditangebote zinsen vergleich', 'baufinanzierung angebote gegenueberstellen'],
    inputs: [
      { id: 'loanAmount', label: 'Kreditsumme', type: 'number', defaultValue: 50000, min: 1000, step: 1000, unit: '€' },
      { id: 'rateA', label: 'Effektiver Jahreszins Angebot A', type: 'number', defaultValue: 5.9, min: 0.5, step: 0.1, unit: '%' },
      { id: 'rateB', label: 'Effektiver Jahreszins Angebot B', type: 'number', defaultValue: 4.8, min: 0.5, step: 0.1, unit: '%' },
      { id: 'months', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 60, min: 12, max: 120, step: 6, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 50000;
      const rA = parseFloat(inputs.rateA) || 5.9;
      const rB = parseFloat(inputs.rateB) || 4.8;
      const m = parseInt(inputs.months, 10) || 60;
      const monthlyA = loan * (((rA / 100) / 12) / (1 - Math.pow(1 + (rA / 100) / 12, -m)));
      const monthlyB = loan * (((rB / 100) / 12) / (1 - Math.pow(1 + (rB / 100) / 12, -m)));
      const diff = Math.abs((monthlyA * m) - (monthlyB * m));
      return {
        primary: { id: 'diff', label: 'Ersparnis mit Angebot B', value: diff, formattedValue: formatCurrency(diff), highlight: true },
        secondary: [
          { id: 'rateA', label: 'Monatsrate Angebot A', value: monthlyA, formattedValue: formatCurrency(monthlyA) },
          { id: 'rateB', label: 'Monatsrate Angebot B', value: monthlyB, formattedValue: formatCurrency(monthlyB) },
        ],
        summaryText: `Angebot B spart Ihnen insgesamt ${formatCurrency(diff)} Zinsen (Monatsrate: ${formatCurrency(monthlyB)} statt ${formatCurrency(monthlyA)}).`,
      };
    },
    formula: 'Ersparnis = Gesamtzinsen_Angebot_A - Gesamtzinsen_Angebot_B',
    formulaExplanation: 'Vergleicht die Gesamtrückzahlungssummen beider Darlehen.',
    workedExample: {
      title: 'Beispiel: 50.000 € über 60 Monate (5,9 % vs. 4,8 %)',
      description: 'Ersparnis mit Angebot B: 1.522 €.',
      inputs: { loanAmount: 50000, rateA: 5.9, rateB: 4.8, months: 60 },
      resultSummary: '1.522,00 € Ersparnis mit Angebot B',
    },
    content: {
      intro: 'Dieser Vergleichsrechner analysiert zwei konkurrierende Kreditangebote auf Zinsunterschiede, monatliche Ratenhöhe und die über die Laufzeit anfallenden Gesamtkosten.',
      details: 'Bereits ein minimaler Unterschied von 0,25 Prozentpunkten beim effektiven Jahreszins summiert sich bei einer Baufinanzierung über 300.000 € auf viele tausend Euro Mehrkosten.',
    },
    faqs: [
      { question: 'Warum ist der Effektivzins wichtiger als der gebundene Sollzins?', answer: 'Der Sollzins beziffert nur die Netto-Verzinsung; erst der Effektivzins nach PAngV enthält Verrechnungsfristen und Nebenkosten und ermöglicht so einen echten Marktvergleich.' },
      { question: 'Sollte man zwei Kredite mit unterschiedlicher Laufzeit vergleichen?', answer: 'Vergleichen Sie vorrangig Angebote mit identischer Laufzeit und Zinsbindung, um eine verzerrungsfreie Entscheidungsgrundlage zu erhalten.' },
    ],
    relatedSlugs: ['effektivzins-kredit-rechner', 'kreditrechner', 'umschuldung-rechner', 'maximaler-kredit-rechner', 'ratenkreditrechner'],
  },
  {
    id: 'gesamtzinsbelastung-rechner',
    slug: 'gesamtzinsbelastung-rechner',
    name: 'Gesamtzinsbelastung-Rechner (Zinskosten über Kreditlaufzeit)',
    shortName: 'Gesamtzinsbelastung',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Gesamtzinsbelastung Rechner – Wie viel Zinsen zahle ich ins...',
    metaDescription: 'Berechnen Sie die gesamte Zinslast Ihres Kredits in Euro und im Verhältnis zur Kreditsumme. Zinskosten transparent aufgeschlüsselt.',
    h1: 'Gesamtzinsbelastung Rechner (Gesamtzinsen)',
    shortDescription: 'Zeigt die absolute Summe aller Zinszahlungen über die gesamte Laufzeit des Darlehens.',
    searchKeywords: ['gesamtzinsbelastung rechner', 'wie viel zinsen zahle ich insgesamt', 'kreditzinsen gesamtsumme', 'zinslast kredit berechnen'],
    inputs: [
      { id: 'loan', label: 'Kreditsumme', type: 'number', defaultValue: 100000, min: 1000, step: 2500, unit: '€' },
      { id: 'rate', label: 'Sollzins p.a.', type: 'number', defaultValue: 4.0, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 10, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loan) || 100000;
      const z = parseFloat(inputs.rate) || 4.0;
      const y = parseInt(inputs.years, 10) || 10;
      const r = (z / 100) / 12;
      const m = y * 12;
      const monthly = loan * (r / (1 - Math.pow(1 + r, -m)));
      const totalPaid = monthly * m;
      const totalInterest = totalPaid - loan;
      return {
        primary: { id: 'interest', label: 'Gesamte Zinskosten', value: totalInterest, formattedValue: formatCurrency(totalInterest), highlight: true },
        secondary: [
          { id: 'ratio', label: 'Zinsanteil an Kreditsumme', value: (totalInterest / loan) * 100, formattedValue: formatPercent((totalInterest / loan) * 100, 1) },
          { id: 'monthly', label: 'Monatsrate', value: monthly, formattedValue: formatCurrency(monthly) },
        ],
        summaryText: `Für ${formatCurrency(loan)} zahlen Sie in ${y} Jahren insgesamt ${formatCurrency(totalInterest)} Zinsen (${formatPercent((totalInterest / loan) * 100, 1)} der Kreditsumme).`,
      };
    },
    formula: 'Gesamtzinsen = (Monatsrate × Monate) - Kreditsumme',
    formulaExplanation: 'Die Summe aller Zinszahlungen über die Laufzeit.',
    workedExample: {
      title: 'Beispiel: 100.000 € Darlehen zu 4,0 % über 10 Jahre',
      description: 'Monatsrate: 1.012,45 €. Gesamtzinsen: 21.494 €.',
      inputs: { loan: 100000, rate: 4.0, years: 10 },
      resultSummary: '21.494,00 € Gesamtzinsen',
    },
    content: {
      intro: 'Dieser Rechner summiert alle über die gesamte Kreditlaufzeit anfallenden Zinszahlungen und stellt sie dem geliehenen Nettodarlehensbetrag gegenüber.',
      details: 'Zinsbelastung = (Monatsrate · Monate) - Kreditsumme. Bei langen Laufzeiten oder geringer Tilgung kann die kumulierte Zinslast die ursprüngliche Kreditsumme erreichen oder sogar übersteigen.',
    },
    faqs: [
      { question: 'Wie kann man die Gesamtzinsbelastung am wirksamsten senken?', answer: 'Durch eine Erhöhung der anfänglichen Tilgung, die Vereinbarung von kostenfreien Sondertilgungsrechten und die Wahl einer möglichst kurzen realistischen Gesamtlaufzeit.' },
      { question: 'Zählt die Zinsbelastung bei vermieteten Immobilien als Werbungskosten?', answer: 'Ja, Kreditzinsen für fremdvermietete Immobilien können in voller Höhe steuerlich als Werbungskosten bei den Einkünften aus Vermietung und Verpachtung geltend gemacht werden.' },
    ],
    relatedSlugs: ['kreditrechner', 'tilgungsrechner', 'sondertilgungsrechner'],
  },
  {
    id: 'vorfaelligkeitsentschaedigung-rechner',
    slug: 'vorfaelligkeitsentschaedigung-rechner',
    name: 'Vorfälligkeitsentschädigung-Rechner (Kredit vorzeitig kündigen)',
    shortName: 'Vorfälligkeitsentschädigung',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Vorfälligkeitsentschädigung Ratenkredit (§ 502 BGB)',
    metaDescription: 'Berechnen Sie die gesetzliche Vorfälligkeitsentschädigung für Ratenkredite nach § 502 BGB mit maximal 1 % bzw. 0,5 % Deckelung.',
    h1: 'Vorfälligkeitsentschädigung Ratenkredit – Kosten berechnen',
    shortDescription: 'Berechnet die gesetzliche Obergrenze der Vorfälligkeitsentschädigung bei vorzeitiger Rückzahlung eines Ratenkredits (§ 502 BGB).',
    searchKeywords: ['vorfaelligkeitsentschaedigung ratenkredit', 'vorfaelligkeitsentschaedigung rechner', 'kredit vorzeitig kuendigen kosten', '502 bgb vorfaelligkeit', 'ausloesegebuehr kredit'],
    inputs: [
      { id: 'remainingDebt', label: 'Verbleibende Restschuld', type: 'number', defaultValue: 12000, min: 100, step: 500, unit: '€' },
      { id: 'remainingMonths', label: 'Restlaufzeit in Monaten', type: 'number', defaultValue: 24, min: 1, max: 120, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const debt = parseFloat(inputs.remainingDebt) || 12000;
      const m = parseInt(inputs.remainingMonths, 10) || 24;
      const maxCapPct = m > 12 ? 1.0 : 0.5;
      const maxFee = debt * (maxCapPct / 100);
      return {
        primary: { id: 'fee', label: 'Maximale Vorfälligkeitsentschädigung', value: maxFee, formattedValue: formatCurrency(maxFee), highlight: true },
        secondary: [
          { id: 'rate', label: 'Höchstsatz (§ 502 BGB)', value: maxCapPct, formattedValue: formatPercent(maxCapPct, 1) },
          { id: 'totalPay', label: 'Gesamter Ablösebetrag', value: debt + maxFee, formattedValue: formatCurrency(debt + maxFee) },
        ],
        summaryText: `Nach § 502 BGB darf die Bank höchstens ${formatCurrency(maxFee)} (${formatPercent(maxCapPct, 1)}) Entschädigung fordern.`,
      };
    },
    formula: 'Maximal 1,0 % (bei Restlaufzeit > 12 Monate) bzw. 0,5 % der Restschuld',
    formulaExplanation: 'Nach § 502 Abs. 1 BGB ist die Entschädigung bei Verbraucherkrediten streng gedeckelt.',
    workedExample: {
      title: 'Beispiel: 12.000 € Restschuld bei 24 Monaten Restlaufzeit',
      description: '1,0 % von 12.000 € = 120 € maximale Vorfälligkeit.',
      inputs: { remainingDebt: 12000, remainingMonths: 24 },
      resultSummary: 'Maximal 120,00 € Entschädigung',
    },
    content: {
      intro: 'Kündigen Verbraucher einen Ratenkredit vorzeitig oder leisten eine Gesamttilgung, darf die Bank nach § 502 BGB einen pauschalierten Zinsschaden verlangen.',
      details: 'Beträgt die Restlaufzeit mehr als 12 Monate, ist die Entschädigung gesetzlich auf höchstens 1,0 Prozent des vorzeitig getilgten Betrags gedeckelt; bei Restlaufzeiten von 12 Monaten oder weniger auf 0,5 Prozent.',
    },
    faqs: [
      { question: 'Gilt die 1-Prozent-Grenze auch bei vorzeitiger Kündigung von Baufinanzierungen?', answer: 'Nein, für Immobiliendarlehen gilt § 502 BGB nicht in dieser Pauschalform; dort darf die Bank den tatsächlichen Zinsschaden nach der BGH-Aktiv-Passiv-Methode abrechnen.' },
      { question: 'Muss die Bank vertragliche Sondertilgungsrechte berücksichtigen?', answer: 'Ja, nach ständiger BGH-Rechtsprechung müssen vereinbarte, noch nicht genutzte Sondertilgungen schadensmindernd in die Entschädigungsberechnung einfließen.' },
    ],
    relatedSlugs: ['umschuldung-rechner', 'kreditrechner', 'restschuld-rechner'],
  },
  {
    id: 'schuldentilgungsdauer-rechner',
    slug: 'schuldentilgungsdauer-rechner',
    name: 'Schuldentilgungsdauer-Rechner (Wann bin ich schuldenfrei?)',
    shortName: 'Schuldentilgungsdauer',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Schuldentilgungsdauer Rechner – Wann bin ich endlich schuld...',
    metaDescription: 'Berechnen Sie, wie viele Monate Sie bei einer festen monatlichen Rate benötigen, um Ihre bestehenden Schulden vollständig zu tilgen.',
    h1: 'Schuldentilgungsdauer Rechner (Schuldenfreiheit planen)',
    shortDescription: 'Kalkuliert die exakte Monatsanzahl bis zur vollständigen Entschuldung bei fester Monatsrate.',
    searchKeywords: ['schuldentilgungsdauer rechner', 'wann bin ich schuldenfrei rechner', 'schulden tilgen zeit berechnen', 'schuldenabbau monatsrate'],
    inputs: [
      { id: 'currentDebt', label: 'Aktuelle Gesamtschulden', type: 'number', defaultValue: 8000, min: 100, step: 250, unit: '€' },
      { id: 'monthlyPayment', label: 'Mögliche monatliche Tilgungsrate', type: 'number', defaultValue: 300, min: 20, step: 20, unit: '€' },
      { id: 'interestRate', label: 'Durchschnittlicher Zinssatz p.a.', type: 'number', defaultValue: 6.5, min: 0, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const debt = parseFloat(inputs.currentDebt) || 8000;
      const pay = parseFloat(inputs.monthlyPayment) || 300;
      const z = parseFloat(inputs.interestRate) || 6.5;
      const r = (z / 100) / 12;
      if (r > 0 && pay <= debt * r) return { primary: { id: 'time', label: 'Dauer', value: 0, formattedValue: 'Nie schuldenfrei' }, error: 'Monatsrate deckt nicht einmal die Zinsen.' };
      const m = r > 0 ? Math.ceil(-Math.log(1 - (debt * r) / pay) / Math.log(1 + r)) : Math.ceil(debt / pay);
      const y = Math.floor(m / 12);
      const remM = m % 12;
      return {
        primary: { id: 'time', label: 'Zeit bis zur Schuldenfreiheit', value: m / 12, formattedValue: `${y} Jahre und ${remM} Monate`, highlight: true },
        secondary: [
          { id: 'months', label: 'Anzahl Monatsraten', value: m, formattedValue: `${m} Raten` },
          { id: 'interest', label: 'Zinsen bis Schuldenfreiheit', value: (pay * m) - debt, formattedValue: formatCurrency((pay * m) - debt) },
        ],
        summaryText: `Bei ${formatCurrency(pay)} Monatsrate sind Ihre Schulden in ${y} Jahren und ${remM} Monaten getilgt.`,
      };
    },
    formula: 'Monate = -ln(1 - (Schulden × r / Rate)) / ln(1 + r)',
    formulaExplanation: 'Laufzeitbestimmung unter Berücksichtigung laufender Zinsen.',
    workedExample: {
      title: 'Beispiel: 8.000 € Schulden bei 300 € Rate zu 6,5 %',
      description: 'Dauer: ca. 30 Monate (2,5 Jahre). Gesamtzinsen: ca. 687 €.',
      inputs: { currentDebt: 8000, monthlyPayment: 300, interestRate: 6.5 },
      resultSummary: 'ca. 30 Monate (2,5 Jahre)',
    },
    content: {
      intro: 'Dieser Entschuldungsrechner ermittelt die verbleibende Zeitdauer in Jahren und Monaten, bis bestehende Verbindlichkeiten bei einer festgelegten Monatsrate vollständig getilgt sind.',
      details: 'Formel: Laufzeit n = -ln(1 - (Kreditsumme · Monatszins) / Rate) / ln(1 + Monatszins). Reicht die gewählte Monatsrate nicht einmal zur Deckung der Zinsen aus, tritt eine theoretisch unendliche Verschuldung ein.',
    },
    faqs: [
      { question: 'Was ist die Mindestrate zur Vermeidung einer Zinsfalle?', answer: 'Die Monatsrate muss zwingend höher sein als die monatlich auflaufenden Zinsen (Kreditsumme × Jahreszins / 12), da der Schuldenstand andernfalls Monat für Monat anwächst.' },
      { question: 'Welche Methode empfiehlt sich bei mehreren Krediten (Schneeball vs. Lawine)?', answer: 'Die Lawinen-Methode tilgt zuerst den Kredit mit dem höchsten Zinssatz (finanziell optimal); die Schneeball-Methode tilgt zuerst den kleinsten Betrag (schnelle psychologische Erfolge).' },
    ],
    relatedSlugs: ['kreditlaufzeit-rechner', 'dispozins-rechner', 'umschuldung-rechner'],
  },
  {
    id: 'forward-darlehen-rechner',
    slug: 'forward-darlehen-rechner',
    name: 'Forward-Darlehen-Rechner (Zinsen für die Zukunft sichern)',
    shortName: 'Forward-Darlehen',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Forward-Darlehen Rechner – Zinsaufschlag für Anschlussfinan...',
    metaDescription: 'Berechnen Sie den Zinsaufschlag bei Forward-Darlehen bis zu 36 oder 60 Monate vor Ablauf der Zinsbindung. Schutz vor steigenden Zinsen.',
    h1: 'Forward-Darlehen Rechner (Zinssicherung im Voraus)',
    shortDescription: 'Kalkuliert den monatlichen Zinsaufschlag (Forward-Aufschlag) für die vorzeitige Zinssicherung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['forward darlehen rechner', 'forward aufschlag berechnen', 'anschlussfinanzierung zukunft sichern', 'forward zinsrechner'],
    inputs: [
      { id: 'loanAmount', label: 'Erwartete Restschuld zur Anschlussfinanzierung', type: 'number', defaultValue: 180000, min: 10000, step: 5000, unit: '€' },
      { id: 'currentRate', label: 'Aktueller Marktzins p.a.', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'forwardMonths', label: 'Vorlaufzeit in Monaten (bis Zinsbindungsende)', type: 'number', defaultValue: 24, min: 1, max: 60, step: 6, unit: 'Monate' },
      { id: 'monthlyMarkup', label: 'Forward-Aufschlag pro Monat Vorlauf', type: 'number', defaultValue: 0.02, min: 0.01, max: 0.05, step: 0.005, unit: '%' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 180000;
      const base = parseFloat(inputs.currentRate) || 3.5;
      const m = parseInt(inputs.forwardMonths, 10) || 24;
      const markup = parseFloat(inputs.monthlyMarkup) || 0.02;
      const totalMarkup = m * markup;
      const forwardRate = base + totalMarkup;
      return {
        primary: { id: 'rate', label: 'Gesicherter Forward-Zinssatz', value: forwardRate, formattedValue: formatPercent(forwardRate, 2), highlight: true },
        secondary: [
          { id: 'markup', label: 'Gesamter Aufschlag für Vorlaufzeit', value: totalMarkup, formattedValue: `+${formatPercent(totalMarkup, 2)}` },
          { id: 'monthlyRate', label: 'Voraussichtliche Rate (bei 2 % Tilgung)', value: loan * ((forwardRate + 2.0) / 1200), formattedValue: formatCurrency(loan * ((forwardRate + 2.0) / 1200)) },
        ],
        summaryText: `Für ${m} Monate Vorlaufzeit sichern Sie sich einen festen Zinssatz von ${formatPercent(forwardRate, 2)} (Aufschlag: +${formatPercent(totalMarkup, 2)}).`,
      };
    },
    formula: 'Forward-Zins = Marktzins + (Forward-Aufschlag × Vorlaufmonate)',
    formulaExplanation: 'Banken berechnen pro Monat bis zum Darlehensantritt einen Zinsaufschlag.',
    workedExample: {
      title: 'Beispiel: 180.000 € Darlehen, 24 Monate Vorlauf, 3,5 % Basiszins + 0,02 % / Monat',
      description: 'Zuschlag: 0,48 %. Gesicherter Forward-Zins: 3,98 % p.a.',
      inputs: { loanAmount: 180000, currentRate: 3.5, forwardMonths: 24, monthlyMarkup: 0.02 },
      resultSummary: '3,98 % gesicherter Zinssatz',
    },
    content: {
      intro: 'Ein Forward-Darlehen sichert das aktuelle Zinsniveau für eine künftige Anschlussfinanzierung bis zu 36 bis 60 Monate im Voraus ab.',
      details: 'Für jeden Monat Vorlaufzeit (Forward-Periode) verlangen Banken einen Forward-Aufschlag auf den aktuellen Marktzins (typischerweise 0,01 bis 0,03 Prozentpunkte pro Monat Vorlauf).',
    },
    faqs: [
      { question: 'Wann lohnt sich der Abschluss eines Forward-Darlehens?', answer: 'Wenn Sie mit spürbar steigenden Zinsen bis zum Ende Ihrer aktuellen Zinsbindung rechnen und das Risiko höherer Monatsraten verbindlich ausschließen möchten.' },
      { question: 'Ist ein Forward-Darlehen bindend?', answer: 'Ja, ein Forward-Darlehen ist ein verbindlicher Darlehensvertrag. Sinken die Zinsen unerwartet weiter, muss der Vertrag dennoch zu den vereinbarten Konditionen abgenommen werden (Nichtabnahmeentschädigung).' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'zinsbindung-rechner', 'tilgungsrechner'],
  },
  {
    id: 'kreditlaufzeit-rechner',
    slug: 'kreditlaufzeit-rechner',
    name: 'Kreditlaufzeit-Rechner (Exakte Laufzeit aus Wunschrate)',
    shortName: 'Kreditlaufzeit',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Kreditlaufzeit Rechner – Wie lange läuft der Kredit bei fes...',
    metaDescription: 'Ermitteln Sie die genaue Kreditlaufzeit in Monaten und Jahren aus Kreditsumme, Zinssatz und monatlicher Rate.',
    h1: 'Kreditlaufzeit Rechner (Dauer bis zur Tilgung)',
    shortDescription: 'Berechnet die genaue Laufzeit eines Kredits anhand der gewählten Monatsrate.',
    searchKeywords: ['kreditlaufzeit rechner', 'wie lange laeuft mein kredit', 'darlehenslaufzeit berechnen monate', 'laufzeit aus kreditrate formel'],
    inputs: [
      { id: 'loan', label: 'Kreditsumme', type: 'number', defaultValue: 30000, min: 500, step: 500, unit: '€' },
      { id: 'interestRate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 4.9, min: 0.1, step: 0.1, unit: '%' },
      { id: 'monthlyRate', label: 'Monatliche Wunschrate', type: 'number', defaultValue: 450, min: 25, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loan) || 30000;
      const z = parseFloat(inputs.interestRate) || 4.9;
      const rate = parseFloat(inputs.monthlyRate) || 450;
      const r = (z / 100) / 12;
      if (r > 0 && rate <= loan * r) return { primary: { id: 'time', label: 'Laufzeit', value: 0, formattedValue: 'Unendlich' }, error: 'Rate muss Zinsen übersteigen.' };
      const m = Math.ceil(-Math.log(1 - (loan * r) / rate) / Math.log(1 + r));
      const y = Math.floor(m / 12);
      const remM = m % 12;
      return {
        primary: { id: 'time', label: 'Kreditlaufzeit', value: m / 12, formattedValue: `${y} Jahre und ${remM} Monate`, highlight: true },
        secondary: [
          { id: 'months', label: 'Anzahl Monatsraten', value: m, formattedValue: `${m} Raten` },
          { id: 'interest', label: 'Gesamtzinskosten', value: (rate * m) - loan, formattedValue: formatCurrency((rate * m) - loan) },
        ],
        summaryText: `Bei ${formatCurrency(rate)} Monatsrate ist Ihr Kredit von ${formatCurrency(loan)} in ${y} Jahren und ${remM} Monaten getilgt.`,
      };
    },
    formula: 'Monate = -ln(1 - (K × r / Rate)) / ln(1 + r)',
    formulaExplanation: 'Laufzeitbestimmung nach der Annuitätenformel.',
    workedExample: {
      title: 'Beispiel: 30.000 € zu 4,9 % bei 450 € Monatsrate',
      description: 'Laufzeit: ca. 6 Jahre und 6 Monate.',
      inputs: { loan: 30000, interestRate: 4.9, monthlyRate: 450 },
      resultSummary: 'ca. 6 Jahre und 6 Monate',
    },
    content: {
      intro: 'Der Kreditlaufzeitrechner kalkuliert die genaue Monats- und Jahresanzahl zur vollständigen Tilgung eines Kredits bei vorgegebener Wunschrate.',
      details: 'Durch die Variation der Monatsrate lässt sich der exakte Zeitpunkt der vollständigen Entschuldung interaktiv planen.',
    },
    faqs: [
      { question: 'Wie wirkt sich eine Erhöhung der Monatsrate um 50 € aus?', answer: 'Bei einem 20.000-€-Kredit zu 6 % Zinsen verkürzt eine Erhöhung der Rate von 300 € auf 350 € die Gesamtlaufzeit um mehr als 14 Monate und spart hunderte Euro Zinsen.' },
      { question: 'Welche Laufzeit ist für Konsumentenkredite wirtschaftlich sinnvoll?', answer: 'Die Laufzeit sollte die Lebensdauer des finanzierten Konsumguts keinesfalls überschreiten (z. B. Smartphone maximal 24 Monate, Auto maximal 60 Monate).' },
    ],
    relatedSlugs: ['privatkredit-rechner', 'kreditrechner', 'schuldentilgungsdauer-rechner', 'tilgungsrechner'],
  },
  {
    id: 'kredit-restschuld-stichtag-rechner',
    slug: 'kredit-restschuld-stichtag-rechner',
    name: 'Kredit-Restschuld Stichtagsrechner (Restsumme)',
    shortName: 'Restschuld zum Stichtag',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Restschuld zum Stichtag Rechner – Exakte Kreditschuld ermitteln',
    metaDescription: 'Ermitteln Sie die exakte Darlehensrestschuld zu einem beliebigen Wunsch-Stichtag für Kündigung, Ablösung oder Sondertilgung.',
    h1: 'Restschuld zum Stichtag Rechner – Kreditsaldo taggenau berechnen',
    shortDescription: 'Berechnet den exakten Kreditsaldo zu einem individuellen Kalenderstichtag für Umschuldung oder vorzeitige Darlehensablösung.',
    searchKeywords: ['restschuld stichtag rechner', 'restschuld rechner', 'kredit restschuld berechnen', 'darlehen restschuld stichtag', 'tilgungsplan restbetrag'],
    inputs: [
      { id: 'loanAmount', label: 'Ursprüngliche Kreditsumme', type: 'number', defaultValue: 150000, min: 1000, step: 2500, unit: '€' },
      { id: 'interestRate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.8, min: 0.1, step: 0.1, unit: '%' },
      { id: 'monthlyPayment', label: 'Monatliche Kreditrate', type: 'number', defaultValue: 800, min: 50, step: 25, unit: '€' },
      { id: 'elapsedYears', label: 'Laufzeit bis zum Stichtag in Jahren', type: 'number', defaultValue: 10, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 150000;
      const z = parseFloat(inputs.interestRate) || 3.8;
      const pay = parseFloat(inputs.monthlyPayment) || 800;
      const y = parseInt(inputs.elapsedYears, 10) || 10;
      const r = (z / 100) / 12;
      let balance = loan;
      for (let i = 0; i < y * 12; i++) {
        balance -= (pay - balance * r);
        if (balance <= 0) { balance = 0; break; }
      }
      return {
        primary: { id: 'rest', label: `Restschuld nach ${y} Jahren`, value: balance, formattedValue: formatCurrency(balance), highlight: true },
        secondary: [
          { id: 'repaid', label: 'Bisher getilgter Betrag', value: loan - balance, formattedValue: formatCurrency(loan - balance) },
          { id: 'repaidPct', label: 'Getilgter Anteil', value: ((loan - balance) / loan) * 100, formattedValue: formatPercent(((loan - balance) / loan) * 100, 1) },
        ],
        summaryText: `Nach ${y} Jahren verbleibt eine Restschuld von ${formatCurrency(balance)} (${formatPercent(((loan - balance) / loan) * 100, 1)} getilgt).`,
      };
    },
    formula: 'Restschuld nach Tilgungsplan',
    formulaExplanation: 'Berechnet den Schuldenstand nach Abzug aller Tilgungsanteile.',
    workedExample: {
      title: 'Beispiel: 150.000 € zu 3,8 %, 800 € Rate nach 10 Jahren',
      description: 'Restschuld nach 10 Jahren: ca. 98.450 €.',
      inputs: { loanAmount: 150000, interestRate: 3.8, monthlyPayment: 800, elapsedYears: 10 },
      resultSummary: 'ca. 98.450 € Restschuld',
    },
    content: {
      intro: 'Dieser Stichtagsrechner beziffert die exakte verbleibende Kreditschuld zu einem ganz bestimmten Kalenderdatum in der Zukunft.',
      details: 'Wichtig für Steuererklärungen, Vermögensaufstellungen, Scheidungsvereinbarungen oder Verhandlungen über vorzeitige Sondertilgungen.',
    },
    faqs: [
      { question: 'Wie berechnet man den Zins- und Tilgungsanteil zu einem bestimmten Monat?', answer: 'Der Monatszins errechnet sich aus der Restschuld des Vormonats mal Monatszinssatz; die Differenz zur vereinbarten festen Monatsrate ist die Tilgung dieses Monats.' },
      { question: 'Woher erhält man den offiziellen Restschuldsaldo für das Finanzamt?', answer: 'Banken versenden zu Jahresbeginn eine gesetzlich vorgeschriebene Jahresbescheinigung mit dem Restschuldsaldo zum 31. Dezember des Vorjahres.' },
    ],
    relatedSlugs: ['vorfaelligkeitsentschaedigung-baufinanzierung-rechner', 'kreditrechner', 'baufinanzierung-rechner', 'tilgungsrechner', 'restschuld-rechner'],
  },
  {
    id: 'kreditrechner-ohne-eigenkapital',
    slug: 'kreditrechner-ohne-eigenkapital',
    name: 'Kreditrechner ohne Eigenkapital (100 % & 110 % Baufinanzierung)',
    shortName: 'Vollfinanzierung',
    category: 'kredit-schulden',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Kreditrechner ohne Eigenkapital – 100 %',
    metaDescription: 'Berechnen Sie die Rate für eine Baufinanzierung ohne Eigenkapital (100 % Kaufpreis oder 110 % inkl. Kaufnebenkosten) mit Zinsaufschlag.',
    h1: 'Kreditrechner ohne Eigenkapital (Vollfinanzierung)',
    shortDescription: 'Ermittelt Ratenhöhe und Zinsaufschlag für Vollfinanzierungen von Immobilien mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['kredit ohne eigenkapital rechner', '110 prozent finanzierung rechner', 'vollfinanzierung hauskauf zinsen', 'immobilienkredit ohne erspartes'],
    inputs: [
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie', type: 'number', defaultValue: 300000, min: 20000, step: 5000, unit: '€' },
      { id: 'incidentalFeesPct', label: 'Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler)', type: 'number', defaultValue: 10.0, min: 5, step: 0.5, unit: '%' },
      { id: 'baseRate', label: 'Basis-Sollzins (bei 80 % Beleihung)', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'riskMarkup', label: 'Risikoaufschlag für Vollfinanzierung', type: 'number', defaultValue: 0.6, min: 0.2, max: 1.5, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 300000;
      const feesPct = parseFloat(inputs.incidentalFeesPct) || 10.0;
      const base = parseFloat(inputs.baseRate) || 3.5;
      const markup = parseFloat(inputs.riskMarkup) || 0.6;
      const totalCost = price * (1 + feesPct / 100);
      const rate = base + markup;
      const monthlyRate = totalCost * ((rate + 2.0) / 1200);
      return {
        primary: { id: 'rate', label: 'Monatliche Kreditrate (110 % Finanzierung)', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'totalLoan', label: 'Gesamte Darlehenssumme inkl. Nebenkosten', value: totalCost, formattedValue: formatCurrency(totalCost) },
          { id: 'effRate', label: 'Sollzinssatz mit Risikoaufschlag', value: rate, formattedValue: formatPercent(rate, 2) },
        ],
        summaryText: `Für eine Vollfinanzierung über ${formatCurrency(totalCost)} zu ${formatPercent(rate)} zahlen Sie monatlich ca. ${formatCurrency(monthlyRate)} (inkl. 2 % Tilgung).`,
      };
    },
    formula: 'Darlehen = Kaufpreis × (1 + Nebenkosten/100) | Zinssatz = Basiszins + Risikoaufschlag',
    formulaExplanation: 'Banken berechnen für Vollfinanzierungen (über 100 % des Kaufpreises) einen Zinsaufschlag von 0,4 % bis 1,0 % p.a.',
    workedExample: {
      title: 'Beispiel: 300.000 € Haus, 10 % Nebenkosten (330.000 € Darlehen zu 4,1 %)',
      description: 'Monatsrate ca. 1.677,50 € bei 2 % Tilgung.',
      inputs: { purchasePrice: 300000, incidentalFeesPct: 10.0, baseRate: 3.5, riskMarkup: 0.6 },
      resultSummary: 'ca. 1.677,50 € Monatsrate',
    },
    content: {
      intro: 'Eine 100%- oder 110%-Baufinanzierung (Vollfinanzierung) finanziert den vollen Kaufpreis oder zusätzlich auch alle Kaufnebenkosten ohne Eigenkapitaleinsatz.',
      details: 'Wegen des erhöhten Ausfallrisikos für die Bank (Kreditsumme übersteigt den Beleihungswert der Immobilie) verlangen Kreditinstitute deutliche Zinsaufschläge von oft 0,5 bis 1,5 Prozentpunkten.',
    },
    faqs: [
      { question: 'Welche Voraussetzungen müssen für eine 110%-Finanzierung erfüllt sein?', answer: 'Ein überdurchschnittlich hohes, unbefristetes Einkommen, ein einwandfreier Schufa-Score sowie eine Immobilie in sehr guter Lage mit stabiler Werterwartung.' },
      { question: 'Was ist das größte Risiko einer Vollfinanzierung?', answer: 'Die Gefahr einer Überschuldung bei vorzeitigem Verkauf: Sinkt der Immobilienwert leicht, reicht der Verkaufserlös nicht aus, um das Darlehen vollständig abzulösen.' },
    ],
    relatedSlugs: ['kaufnebenkosten-rechner', 'baufinanzierung-rechner', 'kreditrechner'],
  },
  {
    id: 'effektivzins-kredit-rechner',
    slug: 'effektivzins-kredit-rechner',
    name: 'Effektivzins-Rechner Kredit (nach Preisangabenverordnung PAngV)',
    shortName: 'Effektivzins Kredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Effektivzins Rechner Kredit – Effektiven Jahreszins nach PA...',
    metaDescription: 'Ermitteln Sie den echten effektiven Jahreszins aus Sollzins, Auszahlungskurs (Disagio) und Gebühren nach der Preisangabenverordnung.',
    h1: 'Effektivzins Rechner für Kredite (PAngV)',
    shortDescription: 'Berechnet den Effektivzins unter Berücksichtigung von Nebenkosten und Verrechnungsintervallen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ['effektivzins kredit rechner', 'effektiver jahreszins berechnen formel', 'pangv kredit zinsen', 'disagio effektivzins rechner'],
    inputs: [
      { id: 'loanAmount', label: 'Nennbetrag des Kredits', type: 'number', defaultValue: 20000, min: 1000, step: 1000, unit: '€' },
      { id: 'nominalRate', label: 'Sollzinssatz (gebunden) p.a.', type: 'number', defaultValue: 5.0, min: 0.5, step: 0.1, unit: '%' },
      { id: 'disagioPct', label: 'Abschlag / Disagio bei Auszahlung', type: 'number', defaultValue: 0, min: 0, max: 10, step: 0.5, unit: '%' },
      { id: 'months', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 48, min: 6, max: 120, step: 6, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loanAmount) || 20000;
      const nom = parseFloat(inputs.nominalRate) || 5.0;
      const disagio = parseFloat(inputs.disagioPct) || 0;
      const m = parseInt(inputs.months, 10) || 48;
      const netPayout = loan * (1 - disagio / 100);
      const monthlyRate = loan * (((nom / 100) / 12) / (1 - Math.pow(1 + (nom / 100) / 12, -m)));
      const approxEff = nom + (disagio / (m / 12));
      return {
        primary: { id: 'eff', label: 'Effektiver Jahreszins (ca.)', value: approxEff, formattedValue: formatPercent(approxEff, 2), highlight: true },
        secondary: [
          { id: 'rate', label: 'Monatliche Rate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate) },
          { id: 'payout', label: 'Tatsächliche Netto-Auszahlung', value: netPayout, formattedValue: formatCurrency(netPayout) },
        ],
        summaryText: `Bei einem Sollzins von ${formatPercent(nom)} und ${formatPercent(disagio)} Disagio beträgt der effektive Jahreszins ca. ${formatPercent(approxEff, 2)}.`,
      };
    },
    formula: 'Effektivzins nach PAngV',
    formulaExplanation: 'Berücksichtigt Auszahlungskurs, Zinsverrechnung und Nebenkosten.',
    workedExample: {
      title: 'Beispiel: 20.000 € zu 5,0 % über 48 Monate ohne Disagio',
      description: 'Effektivzins: ca. 5,12 % p.a.',
      inputs: { loanAmount: 20000, nominalRate: 5.0, disagioPct: 0, months: 48 },
      resultSummary: 'ca. 5,12 % Effektivzins',
    },
    content: {
      intro: 'Der effektive Jahreszins nach der Preisangabenverordnung (PAngV) fasst Sollzins, Auszahlungskurs, Zinsverrechnungstermine und Bearbeitungskosten in einer einheitlichen Vergleichskennzahl zusammen.',
      details: 'Nach europäischem Recht ermittelt die mathematische Annäherungsformel den internen Zinsfuß (Internal Rate of Return), der die Zahlungsströme exakt auf den Nettodarlehensbetrag abzinst.',
    },
    faqs: [
      { question: 'Dürfen Banken Bearbeitungsgebühren in den Kredit einrechnen?', answer: 'Nein, nach ständiger Rechtsprechung des Bundesgerichtshofs (BGH, Az. XI ZR 170/13) sind gesonderte laufzeitunabhängige Bearbeitungsentgelte bei Verbraucherkrediten unzulässig.' },
      { question: 'Warum weicht der Effektivzins vom Sollzins ab?', answer: 'Weil Zinsen meist monatlich nachschüssig verrechnet werden (unterjährige Zinsverrechnung) und eventuelle Nebenkosten oder Disagios eingerechnet werden.' },
    ],
    relatedSlugs: ['kreditrechner', 'kreditvergleich-rechner', 'umschuldung-rechner'],
  },
  {
    id: 'privatkredit-rechner',
    slug: 'privatkredit-rechner',
    name: 'Privatkredit-Rechner (Kredit von privat an privat)',
    shortName: 'Privatkredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Privatkredit Rechner – Konsumentenkredit zur freien Verwendung',
    metaDescription: 'Ermitteln Sie Monatsrate und Kreditkosten für einen Privatkredit zur freien Verwendung für Möbel, Renovierung oder Anschaffungen.',
    h1: 'Privatkredit Rechner – Konsumentenkredit online planen',
    shortDescription: 'Kalkuliert die monatliche Kreditbelastung für freie Privatdarlehen ohne Zweckbindung mit flexiblen Laufzeiten.',
    searchKeywords: ['privatkredit rechner', 'darlehen familie zinsen rechner', 'privatdarlehen schenkungssteuer zinsen', 'kredit unter freunden vertrag'],
    inputs: [
      { id: 'loan', label: 'Geliehener Betrag', type: 'number', defaultValue: 10000, min: 100, step: 500, unit: '€' },
      { id: 'rate', label: 'Vereinbarter Zinssatz (z. B. 0 % oder marktüblich)', type: 'number', defaultValue: 2.0, min: 0, step: 0.5, unit: '%' },
      { id: 'months', label: 'Rückzahlungsdauer in Monaten', type: 'number', defaultValue: 36, min: 1, max: 120, step: 6, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loan) || 10000;
      const z = parseFloat(inputs.rate) || 2.0;
      const m = parseInt(inputs.months, 10) || 36;
      let monthly = loan / m;
      let totalInterest = 0;
      if (z > 0) {
        const r = (z / 100) / 12;
        monthly = loan * (r / (1 - Math.pow(1 + r, -m)));
        totalInterest = (monthly * m) - loan;
      }
      return {
        primary: { id: 'rate', label: 'Monatliche Rückzahlungsrate', value: monthly, formattedValue: formatCurrency(monthly), highlight: true },
        secondary: [
          { id: 'interest', label: 'Gesamter Zinsbetrag', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
          { id: 'total', label: 'Gesamtrückzahlung', value: loan + totalInterest, formattedValue: formatCurrency(loan + totalInterest) },
        ],
        summaryText: `Bei einem Privatdarlehen über ${formatCurrency(loan)} zahlen Sie monatlich ${formatCurrency(monthly)} an den Darlehensgeber zurück.`,
      };
    },
    formula: 'Monatsrate = Kreditsumme / Monate (bei 0 %) bzw. Annuitätenformel',
    formulaExplanation: 'Ein schriftlicher Darlehensvertrag schützt beide Seiten vor Missverständnissen.',
    workedExample: {
      title: 'Beispiel: 10.000 € zu 2 % Zinsen über 36 Monate',
      description: 'Monatliche Rückzahlung: 286,43 €. Gesamtzinsen: ca. 311 €.',
      inputs: { loan: 10000, rate: 2.0, months: 36 },
      resultSummary: '286,43 € monatlich',
    },
    content: {
      intro: 'Ein privater Darlehensvertrag zwischen Verwandten, Freunden oder Geschäftspartnern schafft rechtliche Klarheit bei Zinsen, Rückzahlung und Fälligkeiten.',
      details: 'Aus steuerlicher Sicht (§ 7 Abs. 1 Nr. 1 ErbStG) kann ein zinsloses oder extrem niedrig verzinstes Darlehen vom Finanzamt als steuerpflichtige Schenkung gewertet werden, wenn es den marktüblichen Zinssatz unterschreitet.',
    },
    faqs: [
      { question: 'Welcher Mindestzinssatz schützt bei Privatkrediten vor Schenkungsteuer?', answer: 'Die Finanzverwaltung verlangt nach § 15 BewG in der Regel eine Verzinsung von mindestens 5,5 Prozent p.a., wenn kein anderer marktüblicher Zins nachgewiesen wird.' },
      { question: 'Sollte ein Darlehen unter Verwandten schriftlich fixiert werden?', answer: 'Unbedingt: Ein schriftlicher Darlehensvertrag mit exakter Kreditsumme, Zinssatz, Tilgungsplan und Kündigungsmodalitäten verhindert familiäre Streitigkeiten und dient als Nachweis gegenüber dem Finanzamt.' },
    ],
    relatedSlugs: ['kreditrechner', 'kreditlaufzeit-rechner', 'schuldentilgungsdauer-rechner'],
  },
  {
    id: 'zwischenfinanzierung-rechner',
    slug: 'zwischenfinanzierung-rechner',
    name: 'Zwischenfinanzierung-Rechner (Kurzfristiges Darlehen)',
    shortName: 'Zwischenfinanzierung',
    category: 'kredit-schulden',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Zwischenfinanzierung Rechner – Kosten für kurzfristige Darl...',
    metaDescription: 'Berechnen Sie die Zinskosten für eine Zwischenfinanzierung beim Immobilienkauf: Vorzeitiger Kauf vor Verkauf der alten Immobilie.',
    h1: 'Zwischenfinanzierung Rechner (Immobilienüberbrückung)',
    shortDescription: 'Ermittelt die Zinskosten für endfällige Überbrückungskredite bis zum Zufluss von Eigenkapital.',
    searchKeywords: ['zwischenfinanzierung rechner', 'ueberbrueckungskredit immobilie kosten', 'endfaelliges darlehen zinsen berechnen', 'altes haus verkaufen neues kaufen kredit'],
    inputs: [
      { id: 'loan', label: 'Zwischenfinanzierungs-Betrag', type: 'number', defaultValue: 120000, min: 5000, step: 5000, unit: '€' },
      { id: 'rate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 5.2, min: 1, step: 0.1, unit: '%' },
      { id: 'months', label: 'Überbrückungsdauer in Monaten', type: 'number', defaultValue: 12, min: 1, max: 36, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const loan = parseFloat(inputs.loan) || 120000;
      const z = parseFloat(inputs.rate) || 5.2;
      const m = parseInt(inputs.months, 10) || 12;
      const monthlyInterest = (loan * (z / 100)) / 12;
      const totalInterest = monthlyInterest * m;
      return {
        primary: { id: 'totalInterest', label: 'Gesamte Zinskosten für die Überbrückung', value: totalInterest, formattedValue: formatCurrency(totalInterest), highlight: true },
        secondary: [
          { id: 'monthly', label: 'Reine monatliche Zinsrate (keine Tilgung)', value: monthlyInterest, formattedValue: formatCurrency(monthlyInterest) },
          { id: 'bullet', label: 'Endfällige Gesamttilgung am Ende', value: loan, formattedValue: formatCurrency(loan) },
        ],
        summaryText: `Für eine Zwischenfinanzierung über ${formatCurrency(loan)} zahlen Sie monatlich ${formatCurrency(monthlyInterest)} Zinsen (insgesamt ${formatCurrency(totalInterest)} über ${m} Monate).`,
      };
    },
    formula: 'Monatszins = (Kreditsumme × Zinssatz) / 12 | Tilgung erfolgt zu 100 % endfällig',
    formulaExplanation: 'Während der Laufzeit werden nur Zinsen gezahlt. Die Tilgung erfolgt auf einen Schlag aus dem Erlös der alten Immobilie.',
    workedExample: {
      title: 'Beispiel: 120.000 € zu 5,2 % über 12 Monate',
      description: 'Monatliche Zinsrate: 520,00 €. Gesamtzinsen für 1 Jahr: 6.240,00 €.',
      inputs: { loan: 120000, rate: 5.2, months: 12 },
      resultSummary: '520,00 € / Monat (6.240 € Gesamtzins)',
    },
    content: {
      intro: 'Eine Zwischenfinanzierung überbrückt kurzfristige Liquiditätsengpässe beim Immobilienkauf, bis sichere Mittel (z. B. aus dem Verkauf der bisherigen Immobilie oder Zuteilung eines Bausparvertrags) bereitstehen.',
      details: 'Es handelt sich um ein endfälliges Darlehen: Während der Laufzeit (meist 6 bis 24 Monate) werden ausschließlich Zinsen gezahlt; die Tilgung erfolgt auf einen Schlag bei Fälligkeit der erwarteten Mittel.',
    },
    faqs: [
      { question: 'Wie hoch sind die Zinsen bei einer Zwischenfinanzierung?', answer: 'Da Banken Zwischenkredite flexibel und kurzfristig bereitstellen, liegen die Zinssätze meist 1 bis 2 Prozentpunkte über den Konditionen langfristiger Festzinsdarlehen.' },
      { question: 'Kann eine Zwischenfinanzierung vorzeitig ohne Vorfälligkeitsentschädigung abgelöst werden?', answer: 'Ja, Zwischenfinanzierungen werden üblicherweise mit variabler Verzinsung oder flexibler Rückzahlungsoption vereinbart, sodass sie bei Geldeingang sofort getilgt werden können.' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'kreditrechner', 'kaufnebenkosten-rechner'],
  },
];
