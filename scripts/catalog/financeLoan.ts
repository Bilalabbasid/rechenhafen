import { CalcItemSpec } from '../generator-base';

export const FINANCE_LOAN_SPECS: CalcItemSpec[] = [
  // ==================== FINANZEN & SPAREN (18 items) ====================
  {
    id: 'tagesgeld-rechner',
    name: 'Tagesgeld Rechner (Zinsen & Zinsertrag)',
    shortName: 'Tagesgeld berechnen',
    category: 'finanzen',
    subcategory: 'Zinsen & Zinseszins',
    metaTitle: 'Tagesgeld Rechner – Zinsen & Zinsertrag online berechnen',
    metaDescription: 'Berechnen Sie Ihren Zinsertrag auf Tagesgeldkonten: Monatliche, vierteljährliche oder jährliche Zinsgutschrift mit Zinseszinseffekt.',
    h1: 'Tagesgeld Rechner (Zinsertrag & Zinsintervall)',
    shortDescription: 'Ermittelt die Zinserträge für Tagesgeldanlagen unter Berücksichtigung des Zinsgutschrift-Intervalls.',
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
    formula: 'Zinsertrag = Anlagebetrag × (Zinssatz / 100) × (Tage / 360)',
    formulaExplanation: 'Deutsche Zinsmethode (30/360). Bei unterjähriger Zinsgutschrift (monatlich/quartalsweise) greift der Zinseszins.',
    workedExample: {
      title: 'Beispiel: 10.000 € zu 3,5 % p.a. für 12 Monate (quartalsweise)',
      description: 'Zinsertrag ca. 354,62 € inklusive Zinseszins.',
      inputs: { deposit: 10000, rate: 3.5, months: 12, payout: 'quarterly' },
      resultSummary: 'ca. 354,62 € Zinsertrag',
    },
    intro: 'Tagesgeld ist die beliebteste Form der flexiblen Geldanlage in Deutschland. Ihr Erspartes bleibt täglich verfügbar und erwirtschaftet planbare Zinsen.',
    details: 'Achten Sie auf das Zinsintervall: Banken mit monatlicher oder quartalsweiser Ausschüttung bieten durch den Zinseszinseffekt eine leicht höhere effektive Rendite.',
    faqs: [
      { question: 'Wie sicher ist Tagesgeld in Deutschland?', answer: 'Durch die gesetzliche Einlagensicherung (EdB) sind Einlagen bis 100.000 Euro pro Kunde und Bank gesetzlich zu 100 % abgesichert.' },
    ],
    relatedSlugs: ['zinseszinsrechner', 'festgeld-rechner', 'sparplanrechner'],
    calcBody: `
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
          { id: 'monthly', label: 'Durchschnittliche Zinsen pro Monat', value: interest / months, formattedValue: formatCurrency(interest / months) },
        ],
        summaryText: \`Bei einer Anlage von \${formatCurrency(deposit)} zu \${formatPercent(rate)} p.a. über \${months} Monate beträgt Ihr Zinsertrag \${formatCurrency(interest)}. Das Endguthaben beläuft sich auf \${formatCurrency(finalVal)}.\`
      };
    `,
  },
  {
    id: 'festgeld-rechner',
    name: 'Festgeld Rechner (Feste Laufzeit & Zinsgarantie)',
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
    formula: 'Endkapital = K₀ × (1 + p/100)^n',
    formulaExplanation: 'Klassische Zinseszinsformel bei jährlicher Thesaurierung des Festzinses.',
    workedExample: {
      title: 'Beispiel: 15.000 € zu 3,2 % über 3 Jahre',
      description: 'Endkapital: 16.486,81 €. Reiner Zinsgewinn: 1.486,81 €.',
      inputs: { principal: 15000, interestRate: 3.2, years: 3 },
      resultSummary: '1.486,81 € Zinsgewinn',
    },
    intro: 'Wer sein Erspartes für einen festgelegten Zeitraum entbehren kann, profitiert beim Festgeld von garantierten Zinsen über die gesamte Laufzeit.',
    details: 'Festgeld unterliegt keinen Kursschwankungen und ist bis 100.000 € über die gesetzliche Einlagensicherung geschützt.',
    faqs: [
      { question: 'Kann man vorzeitig an das Festgeld?', answer: 'In der Regel ist Festgeld während der Laufzeit nicht kündbar. Bei vorzeitiger Auflösung aus Kulanz entfallen meist sämtliche aufgelaufenen Zinsen.' },
    ],
    relatedSlugs: ['tagesgeld-rechner', 'zinseszinsrechner', 'sparziel-rechner'],
    calcBody: `
      const p = parseFloat(inputs.principal) || 15000;
      const r = parseFloat(inputs.interestRate) || 3.2;
      const y = parseInt(inputs.years, 10) || 3;
      const endVal = p * Math.pow(1 + r / 100, y);
      const totalInterest = endVal - p;
      return {
        primary: { id: 'interest', label: 'Garantierter Zinsgewinn', value: totalInterest, formattedValue: formatCurrency(totalInterest), highlight: true },
        secondary: [
          { id: 'endVal', label: 'Auszahlungsbetrag nach Laufzeit', value: endVal, formattedValue: formatCurrency(endVal) },
          { id: 'perYear', label: 'Durchschnittlicher Zins pro Jahr', value: totalInterest / y, formattedValue: formatCurrency(totalInterest / y) },
        ],
        summaryText: \`Nach \${y} Jahren Festgeldanlage erhalten Sie insgesamt \${formatCurrency(endVal)} zurück (inklusive \${formatCurrency(totalInterest)} Zinsen bei \${formatPercent(r)} p.a.).\`
      };
    `,
  },
  {
    id: 'sparziel-rechner',
    name: 'Sparziel Rechner (Wie viel muss ich monatlich sparen?)',
    shortName: 'Sparziel berechnen',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Sparziel Rechner – Benötigte monatliche Sparrate online ermitteln',
    metaDescription: 'Ermitteln Sie die erforderliche Monatsrate, um Ihr Sparziel (z. B. 20.000 € für Autokauf oder Eigenkapital) in X Jahren zu erreichen.',
    h1: 'Sparziel Rechner (Monatliche Sparrate)',
    shortDescription: 'Berechnet die notwendige monatliche Einzahlung, um ein Wunschvermögen termingerecht aufzubauen.',
    searchKeywords: ['sparziel rechner', 'wie viel muss ich monatlich sparen', 'sparrate fuer sparziel', 'vermoegen ansparen formel'],
    inputs: [
      { id: 'targetAmount', label: 'Gewünschtes Sparziel', type: 'number', defaultValue: 25000, min: 1000, step: 1000, unit: '€' },
      { id: 'initialCapital', label: 'Bereits vorhandenes Startkapital', type: 'number', defaultValue: 2000, min: 0, step: 500, unit: '€' },
      { id: 'years', label: 'Anlagehorizont in Jahren', type: 'number', defaultValue: 5, min: 1, max: 40, step: 1, unit: 'Jahre' },
      { id: 'expectedReturn', label: 'Erwartete Rendite p.a.', type: 'number', defaultValue: 4.0, min: 0, max: 15, step: 0.5, unit: '%' },
    ],
    formula: 'Sparrate = (Ziel - Start × (1+r)^n) / Rentenendwertfaktor',
    formulaExplanation: 'Ermittelt die monatliche Annuität zur Erreichung des Zielkapitals unter Berücksichtigung des Zinseszinses.',
    workedExample: {
      title: 'Beispiel: 25.000 € Ziel in 5 Jahren mit 2.000 € Start und 4 % Rendite',
      description: 'Erforderliche Sparrate: ca. 344 € pro Monat.',
      inputs: { targetAmount: 25000, initialCapital: 2000, years: 5, expectedReturn: 4.0 },
      resultSummary: 'ca. 344 € / Monat',
    },
    intro: 'Ob Notgroschen, Traumreise, Hochzeit oder Eigenkapital für die Immobilie: Mit dem Sparziel-Rechner planen Sie Ihr Vorhaben realistisch durch.',
    details: 'Durch die Wiederanlage von Zinsen und Dividenden (Zinseszins) fällt die monatliche Sparrate spürbar geringer aus als beim reinen Zurücklegen auf das Girokonto.',
    faqs: [
      { question: 'Welche Rendite sollte man realistisch ansetzen?', answer: 'Für kurzfristige Ziele (1-3 Jahre) auf Tagesgeld 2 % bis 3,5 %. Für langfristige Ziele ab 10 Jahren über breit gestreute Welt-ETFs historisch ca. 5 % bis 7 % nach Inflation.' },
    ],
    relatedSlugs: ['sparplanrechner', 'zinseszinsrechner', 'etf-sparplan-rechner'],
    calcBody: `
      const target = parseFloat(inputs.targetAmount) || 25000;
      const start = parseFloat(inputs.initialCapital) || 0;
      const years = parseInt(inputs.years, 10) || 5;
      const ret = parseFloat(inputs.expectedReturn) || 4.0;
      const months = years * 12;
      const r = (ret / 100) / 12;
      const futureStart = start * Math.pow(1 + r, months);
      const remainingTarget = Math.max(0, target - futureStart);
      let monthlyRate = 0;
      if (r > 0) {
        monthlyRate = remainingTarget * (r / (Math.pow(1 + r, months) - 1));
      } else {
        monthlyRate = remainingTarget / months;
      }
      const totalDeposited = start + (monthlyRate * months);
      const totalInterest = target - totalDeposited;
      return {
        primary: { id: 'rate', label: 'Erforderliche monatliche Sparrate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'own', label: 'Eigene Einzahlungen insgesamt', value: totalDeposited, formattedValue: formatCurrency(totalDeposited) },
          { id: 'gains', label: 'Davon erwirtschaftete Zinsen/Rendite', value: totalInterest, formattedValue: formatCurrency(Math.max(0, totalInterest)) },
        ],
        summaryText: \`Um in \${years} Jahren Ihr Ziel von \${formatCurrency(target)} zu erreichen, müssen Sie monatlich \${formatCurrency(monthlyRate)} sparen. Zinsen und Erträge steuern ca. \${formatCurrency(Math.max(0, totalInterest))} bei.\`
      };
    `,
  },
  {
    id: 'kaufkraftverlust-rechner',
    name: 'Kaufkraftverlust Rechner (Inflation über Zeit)',
    shortName: 'Kaufkraftverlust',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Kaufkraftverlust Rechner – Was ist mein Geld in 10, 20 Jahren noch wert?',
    metaDescription: 'Berechnen Sie den realen Kaufkraftverlust Ihres Vermögens durch Inflation über 5 bis 30 Jahre. Wie viel 10.000 € künftig real wert sind.',
    h1: 'Kaufkraftverlust Rechner (Reale Inflation)',
    shortDescription: 'Veranschaulicht die schleichende Entwertung von Ersparnissen bei gegebener Inflationsrate.',
    searchKeywords: ['kaufkraftverlust rechner', 'was ist mein geld in zukunft wert', 'inflation vermoegensverlust berechnen', 'kaufkraft nach jahren'],
    inputs: [
      { id: 'amount', label: 'Heutiger Geldbetrag', type: 'number', defaultValue: 50000, min: 1000, step: 1000, unit: '€' },
      { id: 'inflationRate', label: 'Angenommene jährliche Inflation', type: 'number', defaultValue: 2.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Zeithorizont in Jahren', type: 'number', defaultValue: 15, min: 1, max: 50, step: 1, unit: 'Jahre' },
    ],
    formula: 'Reale Kaufkraft = Betrag / (1 + Inflationsrate/100)^n',
    formulaExplanation: 'Um den realen Gegenwert künftiger Geldbeträge zu ermitteln, wird der Nominalwert mit der Teuerungsrate abgezinst.',
    workedExample: {
      title: 'Beispiel: 50.000 € bei 2,5 % Inflation über 15 Jahre',
      description: 'Reale Restkaufkraft: ca. 34.523 €. Kaufkraftverlust: 30,95 %.',
      inputs: { amount: 50000, inflationRate: 2.5, years: 15 },
      resultSummary: 'ca. 34.523 € Restkaufkraft (-31 %)',
    },
    intro: 'Inflation ist die schleichende Steuer auf Ersparnisse: Wer Geld unverzinst auf dem Girokonto liegen lässt, verliert über die Jahre massiv an Kaufkraft.',
    details: 'Unser Rechner zeigt, welche Waren und Dienstleistungen Sie sich in Zukunft mit Ihrem heutigen Geld noch leisten können.',
    faqs: [
      { question: 'Was ist das Inflationsziel der EZB?', answer: 'Die Europäische Zentralbank strebt eine mittelfristige Teuerungsrate von 2,0 % pro Jahr an.' },
    ],
    relatedSlugs: ['inflationsrechner', 'realzins-rechner', 'zinseszinsrechner'],
    calcBody: `
      const a = parseFloat(inputs.amount) || 50000;
      const inf = parseFloat(inputs.inflationRate) || 2.5;
      const y = parseInt(inputs.years, 10) || 15;
      const futurePurchasingPower = a / Math.pow(1 + inf / 100, y);
      const loss = a - futurePurchasingPower;
      const lossPercent = (loss / a) * 100;
      return {
        primary: { id: 'realVal', label: 'Reale Restkaufkraft', value: futurePurchasingPower, formattedValue: formatCurrency(futurePurchasingPower), highlight: true },
        secondary: [
          { id: 'loss', label: 'Absoluter Kaufkraftverlust', value: loss, formattedValue: formatCurrency(loss) },
          { id: 'lossPct', label: 'Entwertung in Prozent', value: lossPercent, formattedValue: formatPercent(lossPercent, 1) },
        ],
        summaryText: \`Durch eine Inflation von \${formatPercent(inf)} p.a. sinkt die reale Kaufkraft von \${formatCurrency(a)} in \${y} Jahren auf nur noch \${formatCurrency(futurePurchasingPower)}. Das entspricht einem Kaufkraftverlust von \${formatPercent(lossPercent, 1)}.\`
      };
    `,
  },
  {
    id: 'realzins-rechner',
    name: 'Realzins Rechner (Nominalzins minus Inflation)',
    shortName: 'Realzins berechnen',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Realzins Rechner – Reale Rendite nach Inflation online berechnen',
    metaDescription: 'Ermitteln Sie Ihren tatsächlichen Realzins nach Fisher-Formel: Nominaler Zinsertrag abzüglich Inflationsrate. Exakt in Prozent.',
    h1: 'Realzins Rechner (Reale Vermögensentwicklung)',
    shortDescription: 'Berechnet die reale Verzinsung Ihres Kapitals nach Bereinigung um die Preissteigerungsrate.',
    searchKeywords: ['realzins rechner', 'nominalzins minus inflation', 'fisher formel rechner', 'reale rendite geldanlage'],
    inputs: [
      { id: 'nominalRate', label: 'Nominaler Anlagezins (Zinssatz)', type: 'number', defaultValue: 3.5, min: 0, step: 0.1, unit: '%' },
      { id: 'inflationRate', label: 'Aktuelle Inflationsrate', type: 'number', defaultValue: 2.2, min: 0, step: 0.1, unit: '%' },
    ],
    formula: 'Exakter Realzins = ((1 + Nominalzins/100) / (1 + Inflationsrate/100) - 1) × 100',
    formulaExplanation: 'Exakte Fisher-Gleichung. Als Faustformel gilt näherungsweise: Realzins ≈ Nominalzins - Inflationsrate.',
    workedExample: {
      title: 'Beispiel: 3,5 % Nominalzins bei 2,2 % Inflation',
      description: 'Exakter Realzins: +1,27 % p.a.',
      inputs: { nominalRate: 3.5, inflationRate: 2.2 },
      resultSummary: '+1,27 % Realzins p.a.',
    },
    intro: 'Erst der Realzins zeigt, ob Ihr Vermögen tatsächlich wächst oder trotz Zinsen schrumpft. Ein negativer Realzins bedeutet reale Entwertung.',
    details: 'Liegt die Inflationsrate über dem Sparzins, erleidet der Sparer trotz Zinsgutschrift einen realen Vermögensverlust.',
    faqs: [
      { question: 'Was ist ein negativer Realzins?', answer: 'Erhalten Sie beispielsweise 1 % Zinsen bei einer Inflation von 3 %, liegt Ihr Realzins bei ca. -2 %. Sie können sich am Jahresende trotz Zinsen weniger leisten als zu Beginn.' },
    ],
    relatedSlugs: ['inflationsrechner', 'kaufkraftverlust-rechner', 'renditerechner'],
    calcBody: `
      const nom = parseFloat(inputs.nominalRate) || 3.5;
      const inf = parseFloat(inputs.inflationRate) || 2.2;
      const realRate = (((1 + nom / 100) / (1 + inf / 100)) - 1) * 100;
      const approx = nom - inf;
      return {
        primary: { id: 'real', label: 'Exakter Realzins (Fisher-Formel)', value: realRate, formattedValue: \`\${realRate >= 0 ? '+' : ''}\${formatPercent(realRate, 2)}\`, highlight: true },
        secondary: [
          { id: 'approx', label: 'Einfache Faustformel (Nominal - Inflation)', value: approx, formattedValue: \`\${approx >= 0 ? '+' : ''}\${formatPercent(approx, 2)}\` },
          { id: 'eval', label: 'Bewertung der Geldanlage', value: realRate > 0 ? 1 : 0, formattedValue: realRate > 0 ? 'Positiver realer Vermögenszuwachs' : 'Reale Entwertung (Kaufkraftverlust)' },
        ],
        summaryText: \`Bei einem Nominalzins von \${formatPercent(nom)} und einer Inflation von \${formatPercent(inf)} beträgt Ihr tatsächlicher Realzins \${realRate >= 0 ? '+' : ''}\${formatPercent(realRate, 2)} pro Jahr.\`
      };
    `,
  },
  {
    id: 'dividendenrendite-rechner',
    name: 'Dividendenrendite Rechner',
    shortName: 'Dividendenrendite',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Dividendenrendite Rechner – Ausschüttungsrendite von Aktien berechnen',
    metaDescription: 'Berechnen Sie die Dividendenrendite in Prozent aus Dividende je Aktie und aktuellem Aktienkurs oder Kaufkurs (Persönliche Dividendenrendite).',
    h1: 'Dividendenrendite Rechner (Aktien & ETFs)',
    shortDescription: 'Ermittelt das Verhältnis der jährlichen Dividendenzahlung zum aktuellen Börsenkurs oder Einstiegskurs.',
    searchKeywords: ['dividendenrendite rechner', 'aktien ausschüttung berechnen', 'dividende in prozent', 'personal dividend yield'],
    inputs: [
      { id: 'sharePrice', label: 'Aktienkurs / Anteilspreis', type: 'number', defaultValue: 120, min: 1, step: 1, unit: '€' },
      { id: 'dividend', label: 'Jährliche Dividende pro Aktie', type: 'number', defaultValue: 4.8, min: 0, step: 0.1, unit: '€' },
      { id: 'sharesCount', label: 'Anzahl gehaltener Aktien', type: 'number', defaultValue: 50, min: 1, step: 1, unit: 'Stück' },
    ],
    formula: 'Dividendenrendite (%) = (Dividende pro Aktie / Aktienkurs) × 100',
    formulaExplanation: 'Setzt den ausgeschütteten Gewinnanteil ins Verhältnis zum eingesetzten Kapital pro Aktie.',
    workedExample: {
      title: 'Beispiel: 4,80 € Dividende bei 120 € Kurs (50 Aktien)',
      description: 'Dividendenrendite: 4,00 %. Jährliche Gesamtausschüttung: 240 € brutto.',
      inputs: { sharePrice: 120, dividend: 4.8, sharesCount: 50 },
      resultSummary: '4,00 % Rendite (240 € / Jahr)',
    },
    intro: 'Die Dividendenrendite ist eine der beliebtesten Kennzahlen für einkommensorientierte Anleger und Dividendenjäger.',
    details: 'Liegt der historische Kaufkurs unter dem aktuellen Kurs, spricht man von der „Personal Dividend Yield on Cost“ (Dividendenrendite auf den Einstandspreis).',
    faqs: [
      { question: 'Wann wird die Dividende in Deutschland ausgezahlt?', answer: 'Bei deutschen Aktiengesellschaften (AG) wird die Dividende in der Regel einmal jährlich am dritten Bankarbeitstag nach der ordentlichen Hauptversammlung ausgeschüttet.' },
    ],
    relatedSlugs: ['renditerechner', 'sparplanrechner', 'etf-sparplan-rechner'],
    calcBody: `
      const price = parseFloat(inputs.sharePrice) || 120;
      const div = parseFloat(inputs.dividend) || 4.8;
      const count = parseInt(inputs.sharesCount, 10) || 50;
      if (price <= 0) {
        return { primary: { id: 'yield', label: 'Dividendenrendite', value: 0, formattedValue: '0 %' }, error: 'Aktienkurs muss positiv sein.' };
      }
      const yieldPct = (div / price) * 100;
      const annualPayout = div * count;
      const totalPortfolio = price * count;
      return {
        primary: { id: 'yield', label: 'Dividendenrendite', value: yieldPct, formattedValue: formatPercent(yieldPct, 2), highlight: true },
        secondary: [
          { id: 'annual', label: 'Jährliche Ausschüttung gesamt', value: annualPayout, formattedValue: formatCurrency(annualPayout) },
          { id: 'monthly', label: 'Monatlicher Durchschnittsertrag', value: annualPayout / 12, formattedValue: formatCurrency(annualPayout / 12) },
          { id: 'total', label: 'Gesamtwert der Position', value: totalPortfolio, formattedValue: formatCurrency(totalPortfolio) },
        ],
        summaryText: \`Bei einer Dividende von \${formatCurrency(div)} und einem Kurs von \${formatCurrency(price)} beträgt die Dividendenrendite \${formatPercent(yieldPct, 2)}. Bei \${count} Aktien erhalten Sie jährlich \${formatCurrency(annualPayout)} brutto.\`
      };
    `,
  },
  {
    id: 'ewige-rente-rechner',
    name: 'Ewige Rente Rechner (Finanzielle Unabhängigkeit)',
    shortName: 'Ewige Rente',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Ewige Rente Rechner – Wie viel Kapital für monatliche Zinserträge?',
    metaDescription: 'Berechnen Sie das erforderliche Vermögen für eine ewige Rente ohne Kapitalverzehr. Von Zinsen und Dividenden leben.',
    h1: 'Ewige Rente Rechner (Kapitalerhalt)',
    shortDescription: 'Ermittelt das notwendige Vermögen, um einen festen Monatsbetrag rein aus Zinserträgen ohne Kapitalverzehr zu entnehmen.',
    searchKeywords: ['ewige rente rechner', 'von zinsen leben rechner', 'kapitalbedarf ewige rente', 'finanzielle freiheit kapital'],
    inputs: [
      { id: 'monthlyIncome', label: 'Gewünschte monatliche Netto-Rente', type: 'number', defaultValue: 2500, min: 500, step: 100, unit: '€' },
      { id: 'netReturn', label: 'Erwartete Nettorendite p.a. (nach Steuern)', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
    ],
    formula: 'Benötigtes Kapital = Jahresrente / (Nettorendite / 100)',
    formulaExplanation: 'Da das Vermögen ewig erhalten bleibt, muss der jährliche Zinsertrag exakt den 12 Monatsauszahlungen entsprechen.',
    workedExample: {
      title: 'Beispiel: 2.500 € monatlich bei 3,5 % Netto-Ausschüttung',
      description: '30.000 € Jahresbedarf / 0,035 = 857.143 € Kapitalbedarf.',
      inputs: { monthlyIncome: 2500, netReturn: 3.5 },
      resultSummary: 'ca. 857.143 € Kapitalbedarf',
    },
    intro: 'Von den Zinsen leben, ohne das eigentliche Ersparte jemals anzutasten: Das mathematische Modell der ewigen Rente macht diesen Traum transparent.',
    details: 'Berücksichtigen Sie bei der Planung stets die Inflation. Um die Kaufkraft der Rente zu sichern, sollte ein Teil der Rendite zur Reinvestition verbleiben.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen ewiger Rente und Auszahlplan?', answer: 'Bei der ewigen Rente bleibt das Startkapital unberührt und wird vererbt. Beim Auszahlplan wird das Kapital über eine feste Anzahl an Jahren schrittweise vollständig aufgezehrt.' },
    ],
    relatedSlugs: ['auszahlplan-rechner', 'finanzielle-freiheit-rechner', 'sparplanrechner'],
    calcBody: `
      const monthly = parseFloat(inputs.monthlyIncome) || 2500;
      const rate = parseFloat(inputs.netReturn) || 3.5;
      if (rate <= 0) {
        return { primary: { id: 'capital', label: 'Kapitalbedarf', value: 0, formattedValue: '0 €' }, error: 'Rendite muss größer als 0 sein.' };
      }
      const annualNeed = monthly * 12;
      const capitalNeeded = annualNeed / (rate / 100);
      return {
        primary: { id: 'capital', label: 'Erforderliches Anlagekapital', value: capitalNeeded, formattedValue: formatCurrency(capitalNeeded), highlight: true },
        secondary: [
          { id: 'annual', label: 'Jährliche Entnahmesumme', value: annualNeed, formattedValue: formatCurrency(annualNeed) },
          { id: 'daily', label: 'Verfügbares Budget pro Tag', value: annualNeed / 365, formattedValue: formatCurrency(annualNeed / 365) },
        ],
        summaryText: \`Für eine ewige Rente von \${formatCurrency(monthly)} pro Monat (30.000 € im Jahr) bei \${formatPercent(rate)} Nettorendite benötigen Sie ein Kapital von \${formatCurrency(capitalNeeded)}.\`
      };
    `,
  },
  {
    id: 'finanzielle-freiheit-rechner',
    name: 'Finanzielle Freiheit Rechner (FIRE 4%-Regel)',
    shortName: 'FIRE 4%-Regel',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Finanzielle Freiheit Rechner – FIRE-Zahl & 4%-Regel online berechnen',
    metaDescription: 'Berechnen Sie Ihre persönliche FIRE-Zahl für finanzielle Freiheit: Das 25-fache Ihrer Jahresausgaben nach der wissenschaftlichen Trinity-Studie.',
    h1: 'Finanzielle Freiheit Rechner (FIRE-Bewegung)',
    shortDescription: 'Kalkuliert die erforderliche Vermögensgröße für den vorzeitigen Ruhestand basierend auf jährlichen Lebenshaltungskosten.',
    searchKeywords: ['finanzielle freiheit rechner', 'fire rechner 4 prozent regel', 'trinity study rechner', 'fruehrente vermoegen berechnen'],
    inputs: [
      { id: 'monthlyExpenses', label: 'Monatliche Lebenshaltungskosten', type: 'number', defaultValue: 2200, min: 500, step: 50, unit: '€' },
      { id: 'withdrawalRate', label: 'Sichere Entnahmerate (SWR)', type: 'number', defaultValue: 3.5, min: 2.5, max: 5.0, step: 0.1, unit: '%' },
      { id: 'currentAssets', label: 'Bereits vorhandenes Vermögen', type: 'number', defaultValue: 60000, min: 0, step: 5000, unit: '€' },
    ],
    formula: 'FIRE-Vermögen = Jahresausgaben / (Entnahmerate / 100) = Jahresausgaben × 25 (bei 4 %)',
    formulaExplanation: 'Nach der Trinity-Studie hielt ein Aktien-/Anleihen-Portfolio bei einer Entnahmerate von 3,5 % bis 4,0 % über 30 Jahre mit über 95 % Wahrscheinlichkeit stand.',
    workedExample: {
      title: 'Beispiel: 2.200 € Monatsausgaben bei 3,5 % sicherer Entnahme',
      description: 'Jahresausgaben: 26.400 €. FIRE-Zahl: ca. 754.286 €.',
      inputs: { monthlyExpenses: 2200, withdrawalRate: 3.5, currentAssets: 60000 },
      resultSummary: 'ca. 754.286 € Zielvermögen',
    },
    intro: 'FIRE steht für „Financial Independence, Retire Early“. Das Ziel ist es, durch kluge Geldanlage so viel Vermögen aufzubauen, dass Arbeit zur freiwilligen Option wird.',
    details: 'Konservative Planer wählen heute oft 3,25 % bis 3,5 % Entnahmerate, um auch 40- bis 50-jährige Ruhestandsphasen krisensicher zu überstehen.',
    faqs: [
      { question: 'Was besagt die 4%-Regel?', answer: 'Sie besagt, dass man im ersten Ruhestandsjahr 4 % des Portfolios entnehmen und diesen Betrag in den Folgejahren an die Inflation anpassen kann, ohne dass das Portfolio vorzeitig erschöpft ist.' },
    ],
    relatedSlugs: ['ewige-rente-rechner', 'auszahlplan-rechner', 'etf-sparplan-rechner'],
    calcBody: `
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
          { id: 'progress', label: 'Bereits erreichter Fortschritt', value: progress, formattedValue: formatPercent(progress, 1) },
          { id: 'multiple', label: 'Faktor Ihrer Jahresausgaben', value: 100 / swr, formattedValue: \`\${formatNumber(100 / swr, 1)} × Jahresausgaben\` },
        ],
        summaryText: \`Bei Monatsausgaben von \${formatCurrency(expenses)} (\${formatCurrency(annualExp)} pro Jahr) und \${formatPercent(swr)} Entnahmerate benötigen Sie ein Vermögen von \${formatCurrency(fireNumber)} für die finanzielle Unabhängigkeit.\`
      };
    `,
  },
  {
    id: 'freistellungsauftrag-rechner',
    name: 'Freistellungsauftrag & Sparerpauschbetrag Rechner',
    shortName: 'Sparerpauschbetrag',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Freistellungsauftrag Rechner – 1.000 € / 2.000 € Sparerpauschbetrag',
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
    formula: 'Steuerersparnis = Min(Kapitalertrag, Freibetrag) × (25 % Abgeltungsteuer + 5,5 % Soli)',
    formulaExplanation: 'Der Sparerpauschbetrag beträgt seit 2023 1.000 € für Singles und 2.000 € für Ehegatten. Er verhindert den sofortigen Steuerabzug von 26,375 % (bzw. bis zu 27,99 % mit Kirchensteuer).',
    workedExample: {
      title: 'Beispiel: 1.500 € Ertrag als Single (1.000 € Freibetrag)',
      description: 'Steuerfreie Erträge: 1.000 €. Steuerersparnis: 263,75 €. Zu versteuern: 500 €.',
      inputs: { annualGains: 1500, status: 'single', churchTax: false },
      resultSummary: '263,75 € Steuerersparnis',
    },
    intro: 'Mit einem Freistellungsauftrag bei Ihrer Bank stellen Sie sicher, dass Zinsen, Dividenden und realisierte Kursgewinne bis zum Sparerpauschbetrag ohne Steuerabzug auf Ihrem Konto landen.',
    details: 'Wird kein Freistellungsauftrag eingereicht, führt die Bank automatisch 25 % Abgeltungsteuer zuzüglich Solidaritätszuschlag an das Finanzamt ab.',
    faqs: [
      { question: 'Kann man den Freistellungsauftrag auf mehrere Banken verteilen?', answer: 'Ja! Sie können den Gesamtbetrag (1.000 € bzw. 2.000 €) beliebig auf mehrere Depots und Tagesgeldkonten aufteilen, dürfen die Gesamtsumme jedoch in Summe nicht überschreiten.' },
    ],
    relatedSlugs: ['kapitalertragsteuer-rechner', 'etf-sparplan-rechner', 'zinseszinsrechner'],
    calcBody: `
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
          { id: 'exempt', label: 'Vollständig steuerfreier Betrag', value: exemptGains, formattedValue: formatCurrency(exemptGains) },
          { id: 'taxable', label: 'Steuerpflichtige Rest-Erträge', value: taxableGains, formattedValue: formatCurrency(taxableGains) },
          { id: 'due', label: 'Abzuführende Abgeltungsteuer', value: taxesDue, formattedValue: formatCurrency(taxesDue) },
        ],
        summaryText: \`Durch Ihren Freistellungsauftrag von \${formatCurrency(allowance)} sparen Sie bei \${formatCurrency(gains)} Erträgen exakt \${formatCurrency(savedTax)} an Steuern.\`
      };
    `,
  },
  {
    id: 'kapitalertragsteuer-rechner',
    name: 'Kapitalertragsteuer Rechner (Abgeltungsteuer + Soli)',
    shortName: 'Abgeltungsteuer',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Kapitalertragsteuer Rechner – Abgeltungsteuer, Soli & Kirchensteuer',
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
    formula: 'Steuer = Ertrag × (25 % + 5,5 % Soli auf KapESt + Kirchensteuer)',
    formulaExplanation: 'Die Kirchensteuer mindert als Sonderausgabe die eigentliche Abgeltungsteuer, weshalb eine modifizierte Formel greift.',
    workedExample: {
      title: 'Beispiel: 3.000 € steuerpflichtiger Ertrag ohne Kirchensteuer',
      description: 'Abgeltungsteuer: 750 €. Solidaritätszuschlag: 41,25 €. Gesamt: 791,25 € (26,375 %).',
      inputs: { profit: 3000, churchState: 'none' },
      resultSummary: '791,25 € Steuer (26,38 %)',
    },
    intro: 'In Deutschland unterliegen Gewinne aus Wertpapieren, Dividenden und Zinsen der Abgeltungsteuer. Sie wird als Quellensteuer meist direkt von der Depotbank einbehalten.',
    details: 'Liegt Ihr persönlicher Einkommensteuersatz unter 25 %, können Sie im Rahmen der Einkommensteuererklärung über die Günstigerprüfung (§ 32d Abs. 6 EStG) zu viel gezahlte Steuern zurückholen.',
    faqs: [
      { question: 'Gilt der Solidaritätszuschlag bei Kapitalerträgen weiterhin?', answer: 'Ja. Während der Soli für die allermeisten Arbeitseinkommen abgeschafft wurde, fällt er auf Kapitalerträge weiterhin uneingeschränkt in Höhe von 5,5 % auf die Abgeltungsteuer an.' },
    ],
    relatedSlugs: ['freistellungsauftrag-rechner', 'etf-sparplan-rechner', 'renditerechner'],
    calcBody: `
      const p = parseFloat(inputs.profit) || 3000;
      const church = inputs.churchState || 'none';
      let totalRate = 0.26375;
      let kapRate = 0.25;
      let soliRate = 0.01375;
      let kistRate = 0;
      if (church === '8') {
        totalRate = 0.2782;
        kapRate = 0.25 / (1 + 0.08 * 0.25);
        soliRate = kapRate * 0.055;
        kistRate = kapRate * 0.08;
      } else if (church === '9') {
        totalRate = 0.2799;
        kapRate = 0.25 / (1 + 0.09 * 0.25);
        soliRate = kapRate * 0.055;
        kistRate = kapRate * 0.09;
      }
      const totalTax = p * totalRate;
      const netGain = p - totalTax;
      return {
        primary: { id: 'tax', label: 'Gesamte Steuerbelastung', value: totalTax, formattedValue: formatCurrency(totalTax), highlight: true },
        secondary: [
          { id: 'net', label: 'Reiner Netto-Ertrag auf Ihrem Konto', value: netGain, formattedValue: formatCurrency(netGain) },
          { id: 'rate', label: 'Effektiver Steuersatz', value: totalRate * 100, formattedValue: formatPercent(totalRate * 100, 2) },
          { id: 'kap', label: 'Davon 25 % Abgeltungsteuer', value: p * kapRate, formattedValue: formatCurrency(p * kapRate) },
          { id: 'soli', label: 'Davon 5,5 % Solidaritätszuschlag', value: p * soliRate, formattedValue: formatCurrency(p * soliRate) },
        ],
        summaryText: \`Auf einen Kapitalertrag von \${formatCurrency(p)} zahlen Sie insgesamt \${formatCurrency(totalTax)} Steuern (\${formatPercent(totalRate * 100, 2)}). Es verbleiben \${formatCurrency(netGain)} netto.\`
      };
    `,
  },
  {
    id: 'depotgebuehren-rechner',
    name: 'Depotgebühren Rechner (Kostenwirkung auf Endvermögen)',
    shortName: 'Depotgebühren Rechner',
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
    formula: 'Kostenverlust = Endwert_ohne_Kosten - Endwert_mit_Kosten',
    formulaExplanation: 'Gebühren mindern nicht nur den laufenden Ertrag, sondern entziehen dem Depot auch die künftigen Zinseszinsen der Folgejahre.',
    workedExample: {
      title: 'Beispiel: 40.000 € über 20 Jahre bei 7 % Marktrendite und 0,22 % Kosten',
      description: 'Endvermögen ohne Kosten: ca. 154.787 €. Mit Kosten: ca. 148.513 €. Kostenwirkung: ca. 6.274 €.',
      inputs: { portfolioVal: 40000, ter: 0.22, custodyFee: 0, years: 20, grossReturn: 7.0 },
      resultSummary: 'ca. 6.274 € Kostenverlust',
    },
    intro: 'Vermeintlich kleine Nachkommastellen bei den Gebühren (z. B. 0,2 % vs. 1,5 % bei aktiv gemanagten Fonds) kosten Anleger über Jahrzehnte zehntausende Euro.',
    details: 'Nutzen Sie moderne Neobroker oder Direktbanken mit kostenloser Depotführung und günstigen ETFs, um die Renditediebe zu minimieren.',
    faqs: [
      { question: 'Was ist die TER?', answer: 'Die Total Expense Ratio (Gesamtkostenquote) beziffert alle laufenden Kosten eines Fonds oder ETFs (Verwaltung, Wirtschaftsprüfung, Marketing) in Prozent pro Jahr.' },
    ],
    relatedSlugs: ['etf-sparplan-rechner', 'renditerechner', 'zinseszinsrechner'],
    calcBody: `
      const p = parseFloat(inputs.portfolioVal) || 40000;
      const ter = parseFloat(inputs.ter) || 0.22;
      const custody = parseFloat(inputs.custodyFee) || 0;
      const y = parseInt(inputs.years, 10) || 20;
      const gross = parseFloat(inputs.grossReturn) || 7.0;
      const grossVal = p * Math.pow(1 + gross / 100, y);
      const netRate = Math.max(0, gross - ter);
      let netVal = p;
      for (let i = 0; i < y; i++) {
        netVal = netVal * (1 + netRate / 100) - custody;
      }
      const lost = Math.max(0, grossVal - netVal);
      return {
        primary: { id: 'lost', label: 'Gesamter Kostenverlust über die Laufzeit', value: lost, formattedValue: formatCurrency(lost), highlight: true },
        secondary: [
          { id: 'withCosts', label: 'Reales Endvermögen mit Kosten', value: netVal, formattedValue: formatCurrency(netVal) },
          { id: 'withoutCosts', label: 'Mögliches Endvermögen ohne Kosten', value: grossVal, formattedValue: formatCurrency(grossVal) },
        ],
        summaryText: \`Durch laufende Kosten von \${formatPercent(ter)} TER entgehen Ihnen in \${y} Jahren ca. \${formatCurrency(lost)} an Vermögenswachstum.\`
      };
    `,
  },
  {
    id: 'sparrate-rechner',
    name: 'Sparrate Rechner (Sparquote vom Nettoeinkommen)',
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
    formula: 'Sparquote (%) = (Monatliche Ersparnis / Nettoeinkommen) × 100',
    formulaExplanation: 'Klassische Budgetregel 50/30/20: 50 % für Fixkosten, 30 % für Freizeit und 20 % für Sparen und Vermögensaufbau.',
    workedExample: {
      title: 'Beispiel: 640 € Sparen bei 3.200 € Nettoeinkommen',
      description: '(640 / 3.200) × 100 = 20,00 % (genau im Ziel der 50/30/20-Regel).',
      inputs: { netIncome: 3200, monthlySavings: 640 },
      resultSummary: '20,00 % Sparquote (Optimal)',
    },
    intro: 'Die Sparquote ist der wichtigste Hebel für finanziellen Wohlstand. Sie bestimmt maßgeblich, wie schnell Sie finanzielle Sicherheit und Unabhängigkeit erreichen.',
    details: 'Finanzexperten empfehlen als gesunden Richtwert eine Mindestsparquote von 15 % bis 20 % des verfügbaren Nettoeinkommens.',
    faqs: [
      { question: 'Zählt die Kredittilgung zur Sparquote dazu?', answer: 'Ja! Der Tilgungsanteil einer Immobilienfinanzierung baut echtes Reinvermögen auf und zählt daher vollwertig zur persönlichen Sparquote (nicht jedoch der Zinsanteil).' },
    ],
    relatedSlugs: ['sparziel-rechner', 'sparplanrechner', 'notgroschen-rechner'],
    calcBody: `
      const inc = parseFloat(inputs.netIncome) || 3200;
      const sav = parseFloat(inputs.monthlySavings) || 640;
      if (inc <= 0) {
        return { primary: { id: 'quote', label: 'Sparquote', value: 0, formattedValue: '0 %' }, error: 'Nettoeinkommen muss positiv sein.' };
      }
      const quote = (sav / inc) * 100;
      let rating = 'Solide (15 - 25 %)';
      if (quote < 10) rating = 'Ausbaufähig (unter 10 %)';
      else if (quote >= 30) rating = 'Hervorragend (über 30 %)';
      return {
        primary: { id: 'quote', label: 'Ihre monatliche Sparquote', value: quote, formattedValue: formatPercent(quote, 1), highlight: true },
        secondary: [
          { id: 'rating', label: 'Einstufung (nach 50-30-20-Regel)', value: quote, formattedValue: rating },
          { id: 'annual', label: 'Ersparnis pro Jahr', value: sav * 12, formattedValue: formatCurrency(sav * 12) },
          { id: 'tenYears', label: 'Vermögen nach 10 Jahren (ohne Zins)', value: sav * 120, formattedValue: formatCurrency(sav * 120) },
        ],
        summaryText: \`Mit einer Sparrate von \${formatCurrency(sav)} bei \${formatCurrency(inc)} Netto erreichen Sie eine Sparquote von \${formatPercent(quote, 1)}. Bewertung: \${rating}.\`
      };
    `,
  },
  {
    id: 'notgroschen-rechner',
    name: 'Notgroschen Rechner (Liquiditätsreserve)',
    shortName: 'Notgroschen berechnen',
    category: 'finanzen',
    subcategory: 'Sparen & Vermögensaufbau',
    metaTitle: 'Notgroschen Rechner – Wie viel eiserne Reserve auf dem Tagesgeld?',
    metaDescription: 'Ermitteln Sie die optimale Höhe Ihres Notgroschens nach Berufsstatus (Angestellter, Selbstständiger, Familie) und monatlichen Fixkosten.',
    h1: 'Notgroschen Rechner (Finanzielle Absicherung)',
    shortDescription: 'Berechnet die empfohlene Sicherheitsreserve (3 bis 6 Monatsausgaben) für unvorhergesehene Notfälle.',
    searchKeywords: ['notgroschen rechner', 'wie viel notgroschen tagesgeld', 'liquiditaetsreserve berechnen', 'finanzielle sicherheit polster'],
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
    formula: 'Notgroschen = Monatliche Fixkosten × Multiplikator (3 bis 6)',
    formulaExplanation: 'Verbraucherzentralen empfehlen Angestellten 3 Nettomonatsausgaben, Selbstständigen mindestens 6 Monate als Puffer auf dem Tagesgeldkonto.',
    workedExample: {
      title: 'Beispiel: Angestellter mit 1.800 € Fixkosten',
      description: '1.800 € × 3 Monate = 5.400 € empfohlener Notgroschen.',
      inputs: { monthlyExpenses: 1800, jobType: 'employee' },
      resultSummary: 'ca. 5.400 € Notgroschen',
    },
    intro: 'Die Waschmaschine streikt, das Auto braucht eine teure Reparatur oder die Nebenkostenabrechnung fällt höher aus als gedacht: Ein Notgroschen schützt vor teuren Dispokrediten.',
    details: 'Parken Sie Ihren Notgroschen immer auf einem gut verzinsten, täglich verfügbaren Tagesgeldkonto – getrennt vom Girokonto, aber jederzeit abrufbar.',
    faqs: [
      { question: 'Sollte man den Notgroschen in ETFs anlegen?', answer: 'Nein! Wertpapiere können genau dann im Minus stehen, wenn Sie das Geld dringend benötigen. Der Notgroschen dient der Sicherheit und gehört auf ein risikofreies Tagesgeldkonto.' },
    ],
    relatedSlugs: ['tagesgeld-rechner', 'sparrate-rechner', 'sparziel-rechner'],
    calcBody: `
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
          { id: 'mult', label: 'Empfohlene Monatsausgaben', value: mult, formattedValue: \`\${formatNumber(mult, 1)} Monate\` },
          { id: 'min', label: 'Absolutes Minimum (2 Monate)', value: exp * 2, formattedValue: formatCurrency(exp * 2) },
          { id: 'max', label: 'Komfortables Polster (6 Monate)', value: exp * 6, formattedValue: formatCurrency(exp * 6) },
        ],
        summaryText: \`Bei monatlichen Fixkosten von \${formatCurrency(exp)} sollten Sie als \${type === 'freelance' ? 'Selbstständiger' : 'Angestellter'} eine liquide Reserve von ca. \${formatCurrency(target)} auf dem Tagesgeldkonto halten.\`
      };
    `,
  },
  {
    id: 'verdopplungszeit-rechner',
    name: 'Verdopplungszeit Rechner (Exakte 72er-Regel)',
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
    formula: 'Laufzeit (Jahre) = ln(2) / ln(1 + p/100)  (Faustformel: 72 / p)',
    formulaExplanation: 'Löst die Zinseszinsgleichung 2 × K₀ = K₀ × (1 + p)^n nach n auf.',
    workedExample: {
      title: 'Beispiel: 7 % jährliche Rendite',
      description: 'Exakt 10,24 Jahre (ca. 10 Jahre und 3 Monate). Faustformel 72 / 7 = 10,29 Jahre.',
      inputs: { interestRate: 7.0, initialAmount: 10000 },
      resultSummary: 'ca. 10,2 Jahre (Verdopplung auf 20.000 €)',
    },
    intro: 'Wie lange dauert es, bis aus 10.000 Euro 20.000 Euro werden? Mit diesem Rechner erfahren Sie die exakte mathematische Antwort.',
    details: 'Die bekannte 72er-Faustregel liefert für Zinssätze zwischen 4 % und 10 % eine hervorragende Näherung.',
    faqs: [
      { question: 'Wie funktioniert die 72er-Regel im Kopf?', answer: 'Teilen Sie einfach die Zahl 72 durch den Zinssatz: Bei 6 % Rendite verdoppelt sich das Kapital in 72 / 6 = 12 Jahren. Bei 8 % in 72 / 8 = 9 Jahren.' },
    ],
    relatedSlugs: ['72er-regel-rechner', 'zinseszinsrechner', 'sparplanrechner'],
    calcBody: `
      const r = parseFloat(inputs.interestRate) || 7.0;
      const amount = parseFloat(inputs.initialAmount) || 10000;
      if (r <= 0) {
        return { primary: { id: 'years', label: 'Verdopplungszeit', value: 0, formattedValue: 'Nie' }, error: 'Rendite muss positiv sein.' };
      }
      const exactYears = Math.log(2) / Math.log(1 + r / 100);
      const rule72 = 72 / r;
      const y = Math.floor(exactYears);
      const m = Math.round((exactYears - y) * 12);
      return {
        primary: { id: 'years', label: 'Exakte Verdopplungszeit', value: exactYears, formattedValue: \`\${y} Jahre und \${m} Monate\`, highlight: true },
        secondary: [
          { id: 'exactDec', label: 'In Dezimaljahren', value: exactYears, formattedValue: \`\${formatNumber(exactYears, 2)} Jahre\` },
          { id: 'rule', label: 'Nach 72er-Faustformel', value: rule72, formattedValue: \`\${formatNumber(rule72, 2)} Jahre\` },
          { id: 'doubled', label: 'Verdoppelter Endbetrag', value: amount * 2, formattedValue: formatCurrency(amount * 2) },
        ],
        summaryText: \`Bei einer kontinuierlichen Rendite von \${formatPercent(r)} p.a. verdoppelt sich Ihr Erspartes in exakt \${y} Jahren und \${m} Monaten.\`
      };
    `,
  },
  {
    id: 'thesaurierend-vs-ausschuettend-rechner',
    name: 'Thesaurierend vs. Ausschüttend Rechner (ETF-Vergleich)',
    shortName: 'Thesaurierend vs. Ausschüttend',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Thesaurierend vs. Ausschüttend Rechner – ETF-Ausschüttungsart vergleichen',
    metaDescription: 'Vergleichen Sie thesaurierende und ausschüttende ETFs: Vorabpauschale, Zinseszins bei automatischer Reinvestition und Steuern.',
    h1: 'Thesaurierend vs. Ausschüttend Rechner',
    shortDescription: 'Vergleicht die langfristige Vermögensentwicklung von thesaurierenden (wiederanlegenden) und ausschüttenden Fonds.',
    searchKeywords: ['thesaurierend vs ausschuettend rechner', 'etf ausschuettungsart vergleich', 'vorabpauschale thesaurierer', 'etf reinvestieren rechner'],
    inputs: [
      { id: 'monthlyRate', label: 'Monatliche Sparrate', type: 'number', defaultValue: 300, min: 25, step: 25, unit: '€' },
      { id: 'years', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 25, min: 5, max: 45, step: 1, unit: 'Jahre' },
      { id: 'growthRate', label: 'Erwartete Kurssteigerung p.a.', type: 'number', defaultValue: 5.0, min: 1, step: 0.5, unit: '%' },
      { id: 'dividendRate', label: 'Ausschüttungsrendite (Dividende) p.a.', type: 'number', defaultValue: 2.0, min: 0, step: 0.2, unit: '%' },
    ],
    formula: 'Gesamtrendite = Kursgewinn + Dividende (Thesaurierer reinvestiert automatisch steuerbegünstigt)',
    formulaExplanation: 'Thesaurierende ETFs legen Erträge direkt innerhalb des Fondsvermögens an, unterliegen jedoch der jährlichen Vorabpauschale.',
    workedExample: {
      title: 'Beispiel: 300 € monatlich über 25 Jahre (5 % Kurs + 2 % Dividende)',
      description: 'Thesaurierer nutzt optimalen Zinseszins. Endvermögen ca. 243.000 €.',
      inputs: { monthlyRate: 300, years: 25, growthRate: 5.0, dividendRate: 2.0 },
      resultSummary: 'ca. 243.000 € Endvermögen',
    },
    intro: 'Soll ich einen thesaurierenden (Acc) oder ausschüttenden (Dist) ETF wählen? Beide Varianten haben Vor- und Nachteile bei Steuern und Psychologie.',
    details: 'Während Ausschütter für regelmäßige Cashflows sorgen, glänzen Thesaurierer durch vollautomatische Reinvestition ohne manuelle Transaktionsgebühren.',
    faqs: [
      { question: 'Was ist die Vorabpauschale?', answer: 'Eine jährliche Mindestbesteuerung auf thesaurierende Fonds, die verhindert, dass Anleger die Versteuerung unbegrenzt in die Zukunft verschieben. Sie richtet sich nach dem Basiszins der Bundesbank.' },
    ],
    relatedSlugs: ['etf-sparplan-rechner', 'sparplanrechner', 'freistellungsauftrag-rechner'],
    calcBody: `
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
          { id: 'annualDiv', label: 'Potenzielle Jahresdividende im letzten Jahr', value: fvThes * (div / 100), formattedValue: formatCurrency(fvThes * (div / 100)) },
        ],
        summaryText: \`Nach \${y} Jahren mit monatlich \${formatCurrency(rate)} Sparrate wächst ein thesaurierender Welt-ETF auf ca. \${formatCurrency(fvThes)} an.\`
      };
    `,
  },
  {
    id: 'rentenluecke-rechner',
    name: 'Rentenlücke Rechner (Vorsorgebedarf im Alter)',
    shortName: 'Rentenlücke berechnen',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Rentenlücke Rechner – Versorgungslücke zur gesetzlichen Rente berechnen',
    metaDescription: 'Ermitteln Sie Ihre monatliche Rentenlücke im Alter: Wunsch-Nettoeinkommen abzüglich gesetzlicher Rente. Schließen Sie Ihre Vorsorgelücke.',
    h1: 'Rentenlücke Rechner (Versorgungslücke)',
    shortDescription: 'Berechnet die monatliche Differenz zwischen Ihrem gewünschten Netto-Ruhestandseinkommen und der gesetzlichen Rente.',
    searchKeywords: ['rentenluecke rechner', 'versorgungsluecke rente berechnen', 'gesetzliche rente differenz', 'privat vorsorgen rente'],
    inputs: [
      { id: 'desiredNet', label: 'Gewünschtes monatliches Nettoeinkommen im Ruhestand', type: 'number', defaultValue: 2400, min: 500, step: 50, unit: '€' },
      { id: 'expectedPension', label: 'Erwartete gesetzliche Bruttorente (aus Renteninformation)', type: 'number', defaultValue: 1600, min: 0, step: 50, unit: '€' },
    ],
    formula: 'Rentenlücke = Wunschrente - Gesetzliche Nettorente (ca. 82 % der Bruttorente nach KV/PV/Steuern)',
    formulaExplanation: 'Von der gesetzlichen Bruttorente gehen ca. 11 % für Kranken- und Pflegeversicherung ab. Der Rest unterliegt der nachgelagerten Besteuerung.',
    workedExample: {
      title: 'Beispiel: 2.400 € Wunschrente bei 1.600 € gesetzlicher Bruttorente',
      description: 'Geschätzte gesetzliche Nettorente: ca. 1.312 €. Monatliche Rentenlücke: ca. 1.088 €.',
      inputs: { desiredNet: 2400, expectedPension: 1600 },
      resultSummary: 'ca. 1.088 € monatliche Lücke',
    },
    intro: 'Das gesetzliche Rentenniveau liegt in Deutschland bei ca. 48 % des Durchschnittseinkommens. Wer seinen Lebensstandard im Alter halten möchte, muss die entstehende Rentenlücke kennen.',
    details: 'Schließen lässt sich die Lücke über betriebliche Altersvorsorge (bAV), private Rentenversicherungen oder breit diversifizierte ETF-Sparpläne.',
    faqs: [
      { question: 'Muss man auf die gesetzliche Rente Steuern und Krankenversicherung zahlen?', answer: 'Ja! Rentner zahlen Beiträge zur Kranken- (7,3 % zzgl. Zusatzbeitrag) und Pflegeversicherung (ca. 4 %). Zudem wird die Rente nach dem Alterseinkünftegesetz schrittweise voll steuerpflichtig.' },
    ],
    relatedSlugs: ['renteneintritt-rechner', 'sparziel-rechner', 'etf-sparplan-rechner'],
    calcBody: `
      const target = parseFloat(inputs.desiredNet) || 2400;
      const pensionGross = parseFloat(inputs.expectedPension) || 1600;
      const netPensionEst = pensionGross * 0.82;
      const gap = Math.max(0, target - netPensionEst);
      const gapAnnual = gap * 12;
      return {
        primary: { id: 'gap', label: 'Monatliche Rentenlücke (Netto)', value: gap, formattedValue: formatCurrency(gap), highlight: true },
        secondary: [
          { id: 'gapAnnual', label: 'Jährliche Versorgungslücke', value: gapAnnual, formattedValue: formatCurrency(gapAnnual) },
          { id: 'netPension', label: 'Geschätzte gesetzliche Nettorente', value: netPensionEst, formattedValue: formatCurrency(netPensionEst) },
          { id: 'target', label: 'Gewünschtes Renteneinkommen', value: target, formattedValue: formatCurrency(target) },
        ],
        summaryText: \`Bei einer Wunschrente von \${formatCurrency(target)} und einer geschätzten gesetzlichen Nettorente von \${formatCurrency(netPensionEst)} beträgt Ihre monatliche Rentenlücke \${formatCurrency(gap)} (\${formatCurrency(gapAnnual)} im Jahr).\`
      };
    `,
  },
  {
    id: 'gold-rendite-rechner',
    name: 'Gold Rendite Rechner (Unzen & Gramm in Euro)',
    shortName: 'Goldrendite berechnen',
    category: 'finanzen',
    subcategory: 'Inflation & Rendite',
    metaTitle: 'Gold Rendite Rechner – Wertentwicklung & Feinunzen in Euro berechnen',
    metaDescription: 'Ermitteln Sie die Rendite und Wertentwicklung Ihrer Goldanlage nach Feinunzen (oz) oder Gramm in Euro. Steuerfrei nach 1 Jahr Haltedauer.',
    h1: 'Gold Rendite Rechner (Feinunze & Gramm)',
    shortDescription: 'Berechnet den Gewinn, die Gesamtrendite und die steuerfreie Haltefrist von physischem Gold.',
    searchKeywords: ['gold rendite rechner', 'feinunze gold berechnen', 'goldpreis wertentwicklung', 'gold steuerfrei nach 1 jahr'],
    inputs: [
      { id: 'weightGram', label: 'Goldgewicht in Gramm (1 Feinunze = 31,1035 g)', type: 'number', defaultValue: 31.1035, min: 0.1, step: 1, unit: 'g' },
      { id: 'buyPrice', label: 'Kaufpreis je Gramm damals', type: 'number', defaultValue: 55, min: 1, step: 1, unit: '€' },
      { id: 'currentPrice', label: 'Aktueller Goldpreis je Gramm', type: 'number', defaultValue: 75, min: 1, step: 1, unit: '€' },
    ],
    formula: 'Gewinn = Gewicht × (Verkaufspreis - Kaufpreis) | Rendite (%) = ((VK - EK) / EK) × 100',
    formulaExplanation: 'Physisches Gold (Barren, Münzen wie Krügerrand) ist in Deutschland nach § 23 Abs. 1 Satz 1 Nr. 2 EStG nach einer Haltedauer von mindestens 1 Jahr vollkommen steuerfrei.',
    workedExample: {
      title: 'Beispiel: 1 Unze (31,1 g) Gold gekauft zu 55 €/g, heute 75 €/g',
      description: 'Kaufsumme: 1.710,69 €. Aktueller Wert: 2.332,76 €. Gewinn: +622,07 € (+36,36 %).',
      inputs: { weightGram: 31.1035, buyPrice: 55, currentPrice: 75 },
      resultSummary: '+622,07 € Gewinn (+36,4 %)',
    },
    intro: 'Gold gilt seit Jahrtausenden als solider Wertspeicher und Krisenschutz. Ein großer Vorteil in Deutschland: Kursgewinne sind nach 12 Monaten Haltedauer komplett steuerfrei.',
    details: '1 Feinunze (oz tr) wiegt exakt 31,1034768 Gramm Feingold mit einer Reinheit von 999,9/1000.',
    faqs: [
      { question: 'Fällt beim Goldkauf Mehrwertsteuer an?', answer: 'Nein! Nach § 25c UStG ist der Kauf von Anlagegold (Münzen und Barren) in Deutschland von der Mehrwertsteuer befreit.' },
    ],
    relatedSlugs: ['inflationsrechner', 'renditerechner', 'kaufkraftverlust-rechner'],
    calcBody: `
      const g = parseFloat(inputs.weightGram) || 31.1035;
      const buy = parseFloat(inputs.buyPrice) || 55;
      const curr = parseFloat(inputs.currentPrice) || 75;
      const totalBuy = g * buy;
      const totalCurr = g * curr;
      const profit = totalCurr - totalBuy;
      const returnPct = totalBuy > 0 ? (profit / totalBuy) * 100 : 0;
      const ounces = g / 31.1034768;
      return {
        primary: { id: 'profit', label: 'Erzielter Wertzuwachs (Gewinn)', value: profit, formattedValue: \`\${profit >= 0 ? '+' : ''}\${formatCurrency(profit)}\`, highlight: true },
        secondary: [
          { id: 'ret', label: 'Gesamtrendite', value: returnPct, formattedValue: \`\${returnPct >= 0 ? '+' : ''}\${formatPercent(returnPct, 2)}\` },
          { id: 'currVal', label: 'Aktueller Gesamtwert', value: totalCurr, formattedValue: formatCurrency(totalCurr) },
          { id: 'oz', label: 'Gewicht in Feinunzen', value: ounces, formattedValue: \`\${formatNumber(ounces, 2)} oz\` },
        ],
        summaryText: \`Bei \${formatNumber(g, 2)} g Gold beträgt Ihr Gewinn \${profit >= 0 ? '+' : ''}\${formatCurrency(profit)} (\${formatPercent(returnPct, 2)} Rendite). Nach 1 Jahr Haltedauer ist dieser Gewinn 100 % steuerfrei.\`
      };
    `,
  },
  {
    id: 'auszahlplan-rechner',
    name: 'Auszahlplan Rechner (Kapitalverzehr über Jahre)',
    shortName: 'Auszahlplan berechnen',
    category: 'finanzen',
    subcategory: 'Ruhestand & Entnahme',
    metaTitle: 'Auszahlplan Rechner – Wie lange reicht mein Erspartes im Ruhestand?',
    metaDescription: 'Berechnen Sie, wie lange Ihr Vermögen bei monatlicher Entnahme reicht oder welche monatliche Rente über 15, 20 oder 25 Jahre möglich ist.',
    h1: 'Auszahlplan Rechner (mit Zinsen & Kapitalverzehr)',
    shortDescription: 'Kalkuliert die monatliche Auszahlungshöhe oder Verzehrdauer eines Vermögens unter Berücksichtigung von Zinserträgen.',
    searchKeywords: ['auszahlplan rechner', 'wie lange reicht mein vermoegen', 'rente mit kapitalverzehr', 'entnahmeplan zinsen rechner'],
    inputs: [
      { id: 'capital', label: 'Vorhandenes Ausgangskapital', type: 'number', defaultValue: 100000, min: 5000, step: 5000, unit: '€' },
      { id: 'monthlyPayout', label: 'Monatliche Wunsch-Auszahlung', type: 'number', defaultValue: 600, min: 50, step: 25, unit: '€' },
      { id: 'interestRate', label: 'Verzinsung des Restkapitals p.a.', type: 'number', defaultValue: 3.0, min: 0, step: 0.1, unit: '%' },
    ],
    formula: 'Monate = -ln(1 - (K × r / Rente)) / ln(1 + r)',
    formulaExplanation: 'Berechnet die mathematische Reichweite des Kapitals bei gleichzeitiger Verzinsung des jeweiligen Restguthabens.',
    workedExample: {
      title: 'Beispiel: 100.000 € mit 600 € monatlicher Entnahme zu 3 % Zinsen',
      description: 'Reichweite: ca. 18 Jahre und 9 Monate (insgesamt ca. 135.000 € Auszahlungen).',
      inputs: { capital: 100000, monthlyPayout: 600, interestRate: 3.0 },
      resultSummary: 'ca. 18 Jahre und 9 Monate Reichweite',
    },
    intro: 'Sie möchten im Ruhestand oder während eines Sabbaticals von Ihrem Ersparten zehren? Der Auszahlplan ermittelt auf den Monat genau, wie lange Ihr Geld reicht.',
    details: 'Da das Restguthaben weiter verzinst wird, können Sie deutlich mehr Geld entnehmen, als ursprünglich eingezahlt wurde.',
    faqs: [
      { question: 'Was passiert, wenn die Zinsen die Auszahlung decken?', answer: 'Wenn die monatlichen Zinserträge höher sind als die Entnahme, schrumpft das Kapital nicht – es handelt sich dann um eine „Ewige Rente“.' },
    ],
    relatedSlugs: ['ewige-rente-rechner', 'finanzielle-freiheit-rechner', 'sparplanrechner'],
    calcBody: `
      const cap = parseFloat(inputs.capital) || 100000;
      const payout = parseFloat(inputs.monthlyPayout) || 600;
      const rate = parseFloat(inputs.interestRate) || 3.0;
      const r = (rate / 100) / 12;
      if (r > 0 && payout <= cap * r) {
        return {
          primary: { id: 'time', label: 'Laufzeit des Kapitals', value: 999, formattedValue: 'Unbegrenzt (Ewige Rente)', highlight: true },
          secondary: [
            { id: 'monthlyInterest', label: 'Monatlicher Zinszuwachs', value: cap * r, formattedValue: formatCurrency(cap * r) },
            { id: 'type', label: 'Hinweis', value: 1, formattedValue: 'Auszahlung ist kleiner als der laufende Zinsertrag' },
          ],
          summaryText: \`Bei \${formatCurrency(cap)} Kapital zu \${formatPercent(rate)} entstehen monatlich \${formatCurrency(cap * r)} Zinsen. Bei \${formatCurrency(payout)} Entnahme verbraucht sich das Kapital nie!\`
        };
      }
      let months = 0;
      if (r > 0) {
        months = Math.ceil(-Math.log(1 - (cap * r) / payout) / Math.log(1 + r));
      } else {
        months = Math.ceil(cap / payout);
      }
      const y = Math.floor(months / 12);
      const m = months % 12;
      const totalPaid = payout * months;
      return {
        primary: { id: 'time', label: 'Reichweite des Kapitals', value: months / 12, formattedValue: \`\${y} Jahre und \${m} Monate\`, highlight: true },
        secondary: [
          { id: 'totalPaid', label: 'Gesamtsumme aller Auszahlungen', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
          { id: 'interestBonus', label: 'Davon erwirtschaftete Zinsen', value: totalPaid - cap, formattedValue: formatCurrency(totalPaid - cap) },
        ],
        summaryText: \`Mit \${formatCurrency(cap)} Ausgangskapital können Sie bei \${formatPercent(rate)} Verzinsung \${y} Jahre und \${m} Monate lang jeden Monat \${formatCurrency(payout)} entnehmen (Gesamtauszahlung: \${formatCurrency(totalPaid)}).\`
      };
    `,
  },

  // ==================== KREDIT & SCHULDEN (19 items) ====================
  {
    id: 'baufinanzierung-rechner',
    name: 'Baufinanzierungsrechner (Monatsrate & Zinsbindung)',
    shortName: 'Baufinanzierung',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Baufinanzierung Rechner – Monatsrate, Zinsbindung & Tilgungsplan',
    metaDescription: 'Berechnen Sie Ihre Baufinanzierung für Hauskauf oder Neubau: Monatliche Rate, Restschuld nach 10, 15 oder 20 Jahren Zinsbindung und Gesamtzinsen.',
    h1: 'Baufinanzierungsrechner (Immobiliendarlehen)',
    shortDescription: 'Ermittelt die monatliche Kreditrate und die Restschuld zum Ende der Zinsbindungsfrist.',
    searchKeywords: ['baufinanzierung rechner', 'immobiliendarlehen monatsrate', 'baugeld zinsbindung rechner', 'tilgungsplan hauskauf'],
    inputs: [
      { id: 'loanAmount', label: 'Darlehensbetrag (Kreditsumme)', type: 'number', defaultValue: 300000, min: 10000, step: 5000, unit: '€' },
      { id: 'interestRate', label: 'Sollzinssatz p.a.', type: 'number', defaultValue: 3.6, min: 0.5, step: 0.1, unit: '%' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.0, min: 1.0, max: 10, step: 0.25, unit: '%' },
      { id: 'fixedYears', label: 'Sollzinsbindung in Jahren', type: 'number', defaultValue: 15, min: 5, max: 30, step: 5, unit: 'Jahre' },
    ],
    formula: 'Monatsrate = Darlehensbetrag × (Sollzins + Tilgung) / 1200',
    formulaExplanation: 'Beim Annuitätendarlehen bleibt die Monatsrate während der gesamten Zinsbindungsfrist konstant. Durch die fortschreitende Tilgung sinkt der Zinsanteil, während der Tilgungsanteil steigt.',
    workedExample: {
      title: 'Beispiel: 300.000 € Darlehen zu 3,6 % Zins und 2,0 % Tilgung (15 Jahre fest)',
      description: 'Monatsrate: 1.400,00 €. Restschuld nach 15 Jahren: ca. 182.250 €.',
      inputs: { loanAmount: 300000, interestRate: 3.6, initialRepayment: 2.0, fixedYears: 15 },
      resultSummary: '1.400,00 € Monatsrate | ca. 182.250 € Restschuld',
    },
    intro: 'Die Baufinanzierung ist für die meisten Menschen die größte finanzielle Entscheidung ihres Lebens. Eine solide Zins- und Tilgungsplanung schützt vor bösen Überraschungen.',
    details: 'Banken verlangen heute meist eine anfängliche Tilgung von mindestens 2,0 %, um die Darlehenslaufzeit auf etwa 30 bis 35 Jahre zu begrenzen.',
    faqs: [
      { question: 'Wie lang sollte die Zinsbindung gewählt werden?', answer: 'Bei historisch moderaten Zinsen empfehlen Finanzberater Zinsbindungen von mindestens 10 bis 15 Jahren, um Planungssicherheit für die Familie zu gewährleisten.' },
    ],
    relatedSlugs: ['tilgungsrechner', 'kaufnebenkosten-rechner', 'restschuld-rechner'],
    calcBody: `
      const loan = parseFloat(inputs.loanAmount) || 300000;
      const z = parseFloat(inputs.interestRate) || 3.6;
      const t = parseFloat(inputs.initialRepayment) || 2.0;
      const years = parseInt(inputs.fixedYears, 10) || 15;
      const annualAnnuity = loan * ((z + t) / 100);
      const monthlyRate = annualAnnuity / 12;
      let balance = loan;
      let totalInterestPaid = 0;
      const monthlyRateCalc = monthlyRate;
      const monthlyZ = (z / 100) / 12;
      for (let m = 0; m < years * 12; m++) {
        const intPortion = balance * monthlyZ;
        const repPortion = monthlyRateCalc - intPortion;
        totalInterestPaid += intPortion;
        balance -= repPortion;
        if (balance <= 0) { balance = 0; break; }
      }
      return {
        primary: { id: 'rate', label: 'Monatliche Kreditrate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'rest', label: \`Restschuld nach \${years} Jahren\`, value: balance, formattedValue: formatCurrency(balance) },
          { id: 'interest', label: 'Gezahlte Zinsen während Zinsbindung', value: totalInterestPaid, formattedValue: formatCurrency(totalInterestPaid) },
          { id: 'repaid', label: 'Getilgter Betrag', value: loan - balance, formattedValue: formatCurrency(loan - balance) },
        ],
        summaryText: \`Bei \${formatCurrency(loan)} Kreditsumme zahlen Sie monatlich \${formatCurrency(monthlyRate)}. Nach \${years} Jahren Zinsbindung verbleibt eine Restschuld von \${formatCurrency(balance)}.\`
      };
    `,
  },
  {
    id: 'autokredit-rechner',
    name: 'Autokredit Rechner (Klassisch vs. Ballonfinanzierung)',
    shortName: 'Autokredit berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Autokredit Rechner – Monatsrate & Ballonfinanzierung fürs Auto',
    metaDescription: 'Berechnen Sie die Rate für Ihren Autokredit: Klassischer Ratenkredit oder Ballonfinanzierung mit Schlussrate im transparenten Zinsvergleich.',
    h1: 'Autokredit Rechner (Kfz-Finanzierung)',
    shortDescription: 'Ermittelt Ratenhöhe und Gesamtkosten für Neu- und Gebrauchtwagen-Kredite.',
    searchKeywords: ['autokredit rechner', 'kfz finanzierung monatsrate', 'ballonfinanzierung rechner schlussrate', 'autokauf kredit zinsen'],
    inputs: [
      { id: 'carPrice', label: 'Fahrzeugpreis', type: 'number', defaultValue: 28000, min: 1000, step: 500, unit: '€' },
      { id: 'downPayment', label: 'Anzahlung / Inzahlungnahme', type: 'number', defaultValue: 5000, min: 0, step: 500, unit: '€' },
      { id: 'interestRate', label: 'Effektiver Jahreszins', type: 'number', defaultValue: 5.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'months', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 48, min: 12, max: 96, step: 6, unit: 'Monate' },
      { id: 'balloonPayment', label: 'Schlussrate (0 € bei klassischem Ratenkredit)', type: 'number', defaultValue: 8000, min: 0, step: 500, unit: '€' },
    ],
    formula: 'Monatsrate = Annuitätenformel unter Abzug der abgezinsten Schlussrate',
    formulaExplanation: 'Bei einer Ballonfinanzierung zahlen Sie während der Laufzeit kleinere Raten, müssen am Ende aber die hohe Schlussrate auf einmal begleichen.',
    workedExample: {
      title: 'Beispiel: 28.000 € Auto, 5.000 € Anzahlung, 8.000 € Schlussrate nach 48 Monaten bei 5,5 %',
      description: 'Monatsrate: ca. 367 € statt ca. 534 € (ohne Schlussrate). Gesamtzinsen: ca. 2.616 €.',
      inputs: { carPrice: 28000, downPayment: 5000, interestRate: 5.5, months: 48, balloonPayment: 8000 },
      resultSummary: 'ca. 367 € / Monat (Schlussrate: 8.000 €)',
    },
    intro: 'Ob Barzahler-Rabatt mit freiem Bankkredit oder Finanzierung direkt über das Autohaus: Kalkulieren Sie die tatsächliche Monatsbelastung und Zinskosten.',
    details: 'Vorsicht bei der Schlussrate: Liegt der Fahrzeugwert nach Ablauf unter der Schlussrate, droht eine Nachzahlung, falls das Auto zurückgegeben wird.',
    faqs: [
      { question: 'Lohnt sich ein Ratenkredit als Barzahler beim Händler?', answer: 'Oft ja! Wer bar bezahlt, kann beim Händler oft 5 % bis 15 % Barzahler-Rabatt aushandeln. Dieser Preisnachlass übersteigt oft die Kreditkosten einer unabhängigen Bank.' },
    ],
    relatedSlugs: ['kreditrechner', 'leasingfaktor-rechner', 'auto-gesamtkosten-rechner'],
    calcBody: `
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
      const totalPaid = down + (monthlyRate * m) + balloon;
      const totalInterest = totalPaid - price;
      return {
        primary: { id: 'rate', label: 'Monatliche Autokreditrate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'balloon', label: 'Verbleibende Schlussrate', value: balloon, formattedValue: formatCurrency(balloon) },
          { id: 'interest', label: 'Gesamte Zinskosten', value: totalInterest, formattedValue: formatCurrency(Math.max(0, totalInterest)) },
          { id: 'totalCost', label: 'Gesamtinvestition (inkl. Zinsen)', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
        ],
        summaryText: \`Für das Fahrzeug zahlen Sie nach \${formatCurrency(down)} Anzahlung monatlich \${formatCurrency(monthlyRate)}. Die Gesamtzinskosten betragen \${formatCurrency(Math.max(0, totalInterest))}.\`
      };
    `,
  },
  {
    id: 'umschuldung-rechner',
    name: 'Umschuldungsrechner (Kredite bündeln & Zinsen sparen)',
    shortName: 'Umschuldung berechnen',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Umschuldungsrechner – Zinsersparnis bei Kreditablösung berechnen',
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
    formula: 'Ersparnis = Zinskosten_Altkredit - Zinskosten_Neukredit - Vorfälligkeitsentschädigung (max 1 %)',
    formulaExplanation: 'Nach § 502 BGB darf die Bank bei vorzeitiger Kündigung von Verbraucherdarlehen maximal 1,0 % (bei Restlaufzeit über 1 Jahr) bzw. 0,5 % der Restschuld als Vorfälligkeit verlangen.',
    workedExample: {
      title: 'Beispiel: 18.000 € Restschuld von 7,9 % auf 4,5 % über 48 Monate umschulden',
      description: 'Zinsersparnis brutto: ca. 1.340 €. Vorfälligkeit (1 %): 180 €. Netto-Ersparnis: ca. 1.160 €.',
      inputs: { currentDebt: 18000, oldRate: 7.9, newRate: 4.5, remainingMonths: 48 },
      resultSummary: 'ca. 1.160 € Netto-Ersparnis',
    },
    intro: 'Wer ältere Kredite oder teure Disposchulden zu aktuellen Top-Zinsen umschuldet, senkt seine monatliche Rate und spart über die Restlaufzeit bares Geld.',
    details: 'Zudem erhöht das Zusammenfassen mehrerer kleiner Kredite zu einem einzigen Kredit die Übersichtlichkeit und verbessert oft den Schufa-Score.',
    faqs: [
      { question: 'Darf ich einen Ratenkredit jederzeit kündigen?', answer: 'Ja! Gesetzliche Verbraucherkredite können nach § 500 Abs. 2 BGB jederzeit ganz oder teilweise vorzeitig getilgt werden. Die Entschädigung der Bank ist gesetzlich auf maximal 1 % der Restschuld gedeckelt.' },
    ],
    relatedSlugs: ['kreditrechner', 'dispozins-rechner', 'restschuld-rechner'],
    calcBody: `
      const debt = parseFloat(inputs.currentDebt) || 18000;
      const oldR = parseFloat(inputs.oldRate) || 7.9;
      const newR = parseFloat(inputs.newRate) || 4.5;
      const m = parseInt(inputs.remainingMonths, 10) || 48;
      const rOld = (oldR / 100) / 12;
      const rNew = (newR / 100) / 12;
      const oldRate = debt * (rOld / (1 - Math.pow(1 + rOld, -m)));
      const newRate = debt * (rNew / (1 - Math.pow(1 + rNew, -m)));
      const oldInterest = (oldRate * m) - debt;
      const newInterest = (newRate * m) - debt;
      const penalty = m > 12 ? debt * 0.01 : debt * 0.005;
      const netSavings = oldInterest - newInterest - penalty;
      return {
        primary: { id: 'savings', label: 'Ihre Netto-Zinsersparnis', value: netSavings, formattedValue: formatCurrency(Math.max(0, netSavings)), highlight: true },
        secondary: [
          { id: 'monthlyRelief', label: 'Monatliche Entlastung', value: oldRate - newRate, formattedValue: formatCurrency(oldRate - newRate) },
          { id: 'oldRate', label: 'Bisherige Monatsrate', value: oldRate, formattedValue: formatCurrency(oldRate) },
          { id: 'newRate', label: 'Neue günstigere Rate', value: newRate, formattedValue: formatCurrency(newRate) },
          { id: 'penalty', label: 'Geschätzte Kündigungsgebühr (Vorfälligkeit max. 1 %)', value: penalty, formattedValue: formatCurrency(penalty) },
        ],
        summaryText: \`Durch die Umschuldung von \${formatPercent(oldR)} auf \${formatPercent(newR)} sparen Sie insgesamt ca. \${formatCurrency(Math.max(0, netSavings))} an Zinsen. Ihre Monatsrate sinkt um \${formatCurrency(oldRate - newRate)}.\`
      };
    `,
  },
  {
    id: 'dispozins-rechner',
    name: 'Dispozins Rechner (Kosten der Kontoüberziehung)',
    shortName: 'Dispozins berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Dispozins Rechner – Zinskosten für Dispokredit online berechnen',
    metaDescription: 'Berechnen Sie die Zinskosten für Ihre Kontoüberziehung (Dispositionskredit): Taggenaue Abrechnung nach deutscher Zinsmethode.',
    h1: 'Dispozins Rechner (Kontoüberziehung)',
    shortDescription: 'Ermittelt die Zinskosten für geduldete und vereinbarte Kontoüberziehungen.',
    searchKeywords: ['dispozins rechner', 'dispokredit zinsen berechnen', 'konto ueberziehung kosten', 'dispozinsen pro tag'],
    inputs: [
      { id: 'overdraftAmount', label: 'In Anspruch genommener Dispo-Betrag', type: 'number', defaultValue: 1500, min: 50, step: 50, unit: '€' },
      { id: 'dispoRate', label: 'Dispozinssatz der Bank p.a.', type: 'number', defaultValue: 11.5, min: 4, max: 20, step: 0.25, unit: '%' },
      { id: 'days', label: 'Überziehungsdauer in Tagen', type: 'number', defaultValue: 45, min: 1, max: 365, step: 1, unit: 'Tage' },
    ],
    formula: 'Dispozinsen = (Überziehungsbetrag × Zinssatz × Tage) / (100 × 360)',
    formulaExplanation: 'Deutsche kaufmännische Zinsmethode (30/360). Banken berechnen Dispozinsen taggenau und buchen sie meist quartalsweise ab.',
    workedExample: {
      title: 'Beispiel: 1.500 € Dispo bei 11,5 % Zinsen für 45 Tage',
      description: '(1.500 × 11,5 × 45) / 36.000 = 21,56 € Zinsen.',
      inputs: { overdraftAmount: 1500, dispoRate: 11.5, days: 45 },
      resultSummary: '21,56 € Dispozinsen',
    },
    intro: 'Der Dispokredit ist bequem, aber die mit Abstand teuerste Kreditform in Deutschland. Viele Banken verlangen zwischen 10 % und 14 % Zinsen.',
    details: 'Wer dauerhaft im Dispo festhängt, zahlt Jahr für Jahr hohe Zinsen. Bereits ab Beträgen von 1.000 € lohnt sich die Umschuldung in einen günstigen Ratenkredit.',
    faqs: [
      { question: 'Was ist der Unterschied zwischen Dispo und geduldeter Überziehung?', answer: 'Der Dispo ist ein vorab vereinbarter Rahmen. Überziehen Sie das Konto über diesen Rahmen hinaus, berechnen Banken für die „geduldete Überziehung“ oft noch höhere Strafzinsen.' },
    ],
    relatedSlugs: ['umschuldung-rechner', 'kreditrechner', 'kaufkraftverlust-rechner'],
    calcBody: `
      const amount = parseFloat(inputs.overdraftAmount) || 1500;
      const rate = parseFloat(inputs.dispoRate) || 11.5;
      const days = parseInt(inputs.days, 10) || 45;
      const interest = (amount * rate * days) / 36000;
      const perYear = (amount * rate) / 100;
      return {
        primary: { id: 'interest', label: 'Anfallende Dispozinsen', value: interest, formattedValue: formatCurrency(interest), highlight: true },
        secondary: [
          { id: 'perDay', label: 'Zinskosten pro Tag', value: interest / days, formattedValue: formatCurrency(interest / days) },
          { id: 'perYear', label: 'Zinskosten bei 1 ganzem Jahr Überziehung', value: perYear, formattedValue: formatCurrency(perYear) },
        ],
        summaryText: \`Für eine Überziehung von \${formatCurrency(amount)} über \${days} Tage bei \${formatPercent(rate)} Dispozins zahlen Sie \${formatCurrency(interest)} Zinsen.\`
      };
    `,
  },
  {
    id: 'maximaler-kredit-rechner',
    name: 'Maximaler Kredit Rechner (Wie viel Kredit kann ich mir leisten?)',
    shortName: 'Maximaler Kredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Maximaler Kredit Rechner – Wie viel Kredit bekomme ich mit meinem Gehalt?',
    metaDescription: 'Ermitteln Sie Ihren maximalen Darlehensbetrag: Wie viel Kredit Sie sich anhand Ihrer monatlichen Wunschrate und Laufzeit leisten können.',
    h1: 'Maximaler Kredit Rechner (Kreditrahmen prüfen)',
    shortDescription: 'Berechnet die maximal finanzierbare Kreditsumme aus Ihrem monatlichen Budget.',
    searchKeywords: ['maximaler kredit rechner', 'wie viel kredit bekomme ich', 'leistbare kredithoehe berechnen', 'kreditrahmen gehalt rechner'],
    inputs: [
      { id: 'monthlyBudget', label: 'Monatlich leistbare Kreditrate', type: 'number', defaultValue: 500, min: 50, step: 25, unit: '€' },
      { id: 'interestRate', label: 'Angenommener Zinssatz p.a.', type: 'number', defaultValue: 4.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'termYears', label: 'Gewünschte Laufzeit in Jahren', type: 'number', defaultValue: 5, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    formula: 'Kreditsumme = Monatsrate × ((1 - (1 + r)^-n) / r)',
    formulaExplanation: 'Barwertformel einer monatlichen Rente: Ermittelt das maximale Darlehensvolumen, das mit der gegebenen Monatsrate bedient werden kann.',
    workedExample: {
      title: 'Beispiel: 500 € Monatsrate bei 4,5 % Zinsen über 5 Jahre',
      description: 'Maximaler Kreditbetrag: ca. 26.860 €. Gesamtrückzahlung: 30.000 €.',
      inputs: { monthlyBudget: 500, interestRate: 4.5, termYears: 5 },
      resultSummary: 'ca. 26.860 € Darlehenssumme',
    },
    intro: 'Bevor Sie nach einer Immobilie oder einem Auto suchen, sollten Sie klären: Wie viel Kredit ist bei meiner finanziellen Situation realistisch möglich?',
    details: 'Banken prüfen in der Haushaltsrechnung, ob nach Abzug aller Lebenshaltungskosten eine ausreichende Pauschale (ca. 800 bis 1.000 € für den Hauptverdiener) verbleibt.',
    faqs: [
      { question: 'Welcher Anteil des Einkommens darf für Kreditraten aufgewendet werden?', answer: 'Als Faustregel gilt: Alle Kredit- und Ratenverpflichtungen zusammen sollten maximal 35 % bis höchstens 40 % des monatlichen Haushaltsnettoeinkommens ausmachen.' },
    ],
    relatedSlugs: ['kreditrechner', 'baufinanzierung-rechner', 'tilgungsrechner'],
    calcBody: `
      const rate = parseFloat(inputs.monthlyBudget) || 500;
      const z = parseFloat(inputs.interestRate) || 4.5;
      const years = parseInt(inputs.termYears, 10) || 5;
      const r = (z / 100) / 12;
      const m = years * 12;
      let maxLoan = 0;
      if (r > 0) {
        maxLoan = rate * ((1 - Math.pow(1 + r, -m)) / r);
      } else {
        maxLoan = rate * m;
      }
      const totalRepay = rate * m;
      const totalInterest = totalRepay - maxLoan;
      return {
        primary: { id: 'loan', label: 'Maximaler Kreditbetrag', value: maxLoan, formattedValue: formatCurrency(maxLoan), highlight: true },
        secondary: [
          { id: 'totalRepay', label: 'Gesamte Rückzahlungssumme', value: totalRepay, formattedValue: formatCurrency(totalRepay) },
          { id: 'interest', label: 'Darin enthaltene Zinskosten', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
        ],
        summaryText: \`Mit einer monatlichen Rate von \${formatCurrency(rate)} können Sie sich bei \${formatPercent(z)} Zinsen über \${years} Jahre einen Kredit von maximal ca. \${formatCurrency(maxLoan)} leisten.\`
      };
    `,
  },
  {
    id: 'zinsbindung-rechner',
    name: 'Zinsbindungs-Vergleichsrechner (5 vs. 10 vs. 15 Jahre)',
    shortName: 'Zinsbindung vergleichen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Zinsbindung Rechner – Zinsänderungsrisiko & Restschuld vergleichen',
    metaDescription: 'Vergleichen Sie Zinsbindungen (10, 15 oder 20 Jahre): Welche Restschuld verbleibt und wie viel Zinssicherheit kostet der Aufpreis?',
    h1: 'Zinsbindungs-Vergleichsrechner',
    shortDescription: 'Vergleicht unterschiedliche Zinsbindungsfristen und quantifiziert das Zinsänderungsrisiko der Restschuld.',
    searchKeywords: ['zinsbindung rechner', 'sollzinsbindung 10 oder 15 jahre', 'zinsrisiko restschuld berechnen', 'anschlussfinanzierung zinsen'],
    inputs: [
      { id: 'loan', label: 'Darlehenssumme', type: 'number', defaultValue: 250000, min: 10000, step: 5000, unit: '€' },
      { id: 'rate10', label: 'Zinssatz bei 10 Jahren Zinsbindung', type: 'number', defaultValue: 3.4, min: 0.5, step: 0.1, unit: '%' },
      { id: 'rate15', label: 'Zinssatz bei 15 Jahren Zinsbindung', type: 'number', defaultValue: 3.7, min: 0.5, step: 0.1, unit: '%' },
      { id: 'initialRepay', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.5, min: 1, step: 0.5, unit: '%' },
    ],
    formula: 'Restschuld_10Jahre vs. Restschuld_15Jahre',
    formulaExplanation: 'Längere Zinsbindungen kosten einen Zinsaufschlag (meist 0,2 % bis 0,4 % p.a.), bieten dafür aber 5 bis 10 Jahre längeren Schutz vor steigenden Marktzinsen.',
    workedExample: {
      title: 'Beispiel: 250.000 € Darlehen (10 Jahre zu 3,4 % vs. 15 Jahre zu 3,7 %)',
      description: 'Restschuld nach 10 Jahren: ca. 171.000 €. Nach 15 Jahren: ca. 126.000 €.',
      inputs: { loan: 250000, rate10: 3.4, rate15: 3.7, initialRepay: 2.5 },
      resultSummary: 'Vergleich 10 vs. 15 Jahre Zinsbindung',
    },
    intro: 'Soll man die Zinsen lieber 10 oder 15 Jahre festschreiben? Der Rechner vergleicht Monatsrate, getilgte Summe und das verbleibende Anschlusszins-Risiko.',
    details: 'Nach § 489 Abs. 1 Nr. 2 BGB haben Darlehensnehmer in Deutschland bei Festzinsdarlehen ein gesetzliches Sonderkündigungsrecht nach 10 Jahren – unabhängig von der vereinbarten Zinsbindung.',
    faqs: [
      { question: 'Gilt das Sonderkündigungsrecht nach 10 Jahren auch bei 15 oder 20 Jahren Zinsbindung?', answer: 'Ja! Nach 10 Jahren ab Vollauszahlung können Sie jedes Immobiliendarlehen mit einer Kündigungsfrist von 6 Monaten ganz oder teilweise ohne jede Vorfälligkeitsentschädigung kündigen.' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'tilgungsrechner', 'restschuld-rechner'],
    calcBody: `
      const loan = parseFloat(inputs.loan) || 250000;
      const z10 = parseFloat(inputs.rate10) || 3.4;
      const z15 = parseFloat(inputs.rate15) || 3.7;
      const t = parseFloat(inputs.initialRepay) || 2.5;
      const monthly10 = loan * ((z10 + t) / 1200);
      const monthly15 = loan * ((z15 + t) / 1200);
      // Calc balance after 10 years
      let b10 = loan;
      for (let m = 0; m < 120; m++) {
        const intP = b10 * ((z10 / 100) / 12);
        b10 -= (monthly10 - intP);
      }
      // Calc balance after 15 years
      let b15 = loan;
      for (let m = 0; m < 180; m++) {
        const intP = b15 * ((z15 / 100) / 12);
        b15 -= (monthly15 - intP);
      }
      return {
        primary: { id: 'diff', label: 'Aufpreis für 15 Jahre Bindung', value: monthly15 - monthly10, formattedValue: \`+\${formatCurrency(monthly15 - monthly10)} / Monat\`, highlight: true },
        secondary: [
          { id: 'rate10', label: 'Monatsrate (10 Jahre fest)', value: monthly10, formattedValue: formatCurrency(monthly10) },
          { id: 'rest10', label: 'Restschuld nach 10 Jahren', value: b10, formattedValue: formatCurrency(b10) },
          { id: 'rate15', label: 'Monatsrate (15 Jahre fest)', value: monthly15, formattedValue: formatCurrency(monthly15) },
          { id: 'rest15', label: 'Restschuld nach 15 Jahren', value: b15, formattedValue: formatCurrency(b15) },
        ],
        summaryText: \`Bei 10 Jahren Bindung beträgt die Monatsrate \${formatCurrency(monthly10)} (Restschuld: \${formatCurrency(b10)}). Für nur \${formatCurrency(monthly15 - monthly10)} Aufpreis pro Monat sichern Sie sich 5 Jahre mehr Zinsschutz.\`
      };
    `,
  },
  {
    id: 'volltilger-darlehen-rechner',
    name: 'Volltilger Rechner (Kredit komplett tilgen ohne Restschuld)',
    shortName: 'Volltilgerdarlehen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Volltilger Rechner – Rate für 100 % Tilgung innerhalb Zinsbindung',
    metaDescription: 'Berechnen Sie die Rate für ein Volltilgerdarlehen: Schuldenfrei nach 15, 20 oder 25 Jahren ohne jedes Restschuld- und Zinsänderungsrisiko.',
    h1: 'Volltilgerdarlehen Rechner (Schuldenfrei nach Frist)',
    shortDescription: 'Ermittelt die exakte monatliche Rate und den notwendigen Tilgungssatz für die vollständige Darlehenstilgung.',
    searchKeywords: ['volltilger rechner', 'volltilgerdarlehen monatsrate', 'kredit ohne restschuld tilgen', 'schuldenfrei nach 20 jahren'],
    inputs: [
      { id: 'loanAmount', label: 'Darlehensbetrag', type: 'number', defaultValue: 200000, min: 10000, step: 5000, unit: '€' },
      { id: 'interestRate', label: 'Fester Sollzins p.a.', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Wunschlaufzeit bis Schuldenfreiheit', type: 'number', defaultValue: 20, min: 5, max: 35, step: 1, unit: 'Jahre' },
    ],
    formula: 'Monatsrate = Kreditsumme × (r / (1 - (1 + r)^-n))',
    formulaExplanation: 'Berechnet die Annuität für eine Restschuld von exakt 0,00 Euro am Ende der gewählten Laufzeit.',
    workedExample: {
      title: 'Beispiel: 200.000 € zu 3,5 % voll tilgen in 20 Jahren',
      description: 'Monatsrate: 1.159,92 € (anfängliche Tilgung: 3,46 %). Gesamtzinsen: 78.381 €.',
      inputs: { loanAmount: 200000, interestRate: 3.5, years: 20 },
      resultSummary: '1.159,92 € / Monat (0 € Restschuld)',
    },
    intro: 'Ein Volltilgerdarlehen ist die sicherste Form der Baufinanzierung: Sie wissen vom ersten Tag an auf den Euro genau, wann das Eigenheim abbezahlt ist.',
    details: 'Banken belohnen das fehlende Ausfallrisiko am Laufzeitende häufig mit Zinsrabatten von 0,1 % bis 0,2 % gegenüber Standarddarlehen.',
    faqs: [
      { question: 'Was ist der Vorteil gegenüber einem klassischen Annuitätendarlehen?', answer: 'Kein Zinsänderungsrisiko! Bei Standarddarlehen verbleibt nach 10 oder 15 Jahren eine hohe Restschuld, die zu unkalkulierbaren künftigen Zinsen neu verhandelt werden muss.' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'tilgungsrechner', 'restschuld-rechner'],
    calcBody: `
      const loan = parseFloat(inputs.loanAmount) || 200000;
      const z = parseFloat(inputs.interestRate) || 3.5;
      const years = parseInt(inputs.years, 10) || 20;
      const r = (z / 100) / 12;
      const m = years * 12;
      const monthlyRate = loan * (r / (1 - Math.pow(1 + r, -m)));
      const initialTilgung = ((monthlyRate * 12) / loan) * 100 - z;
      const totalPaid = monthlyRate * m;
      const totalInterest = totalPaid - loan;
      return {
        primary: { id: 'rate', label: 'Monatliche Volltilger-Rate', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'tilgung', label: 'Erforderlicher anfänglicher Tilgungssatz', value: initialTilgung, formattedValue: formatPercent(initialTilgung, 2) },
          { id: 'interest', label: 'Gesamte Zinskosten bis zur Schuldenfreiheit', value: totalInterest, formattedValue: formatCurrency(totalInterest) },
          { id: 'total', label: 'Gesamtrückzahlung', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
        ],
        summaryText: \`Mit einer monatlichen Rate von \${formatCurrency(monthlyRate)} (anfängliche Tilgung \${formatPercent(initialTilgung, 2)}) ist Ihr Darlehen von \${formatCurrency(loan)} in exakt \${years} Jahren vollständig getilgt.\`
      };
    `,
  },
  {
    id: 'modernisierungskredit-rechner',
    name: 'Modernisierungskredit Rechner (Sanierung & Renovierung)',
    shortName: 'Modernisierungskredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Modernisierungskredit Rechner – Sanierung, Wärmepumpe & Photovoltaik',
    metaDescription: 'Berechnen Sie die Rate für Ihren Modernisierungskredit ohne Grundbucheintrag (Wohnkredit) für Heizung, Dämmung, Dach und Fenster.',
    h1: 'Modernisierungskredit Rechner (Wohnkredit)',
    shortDescription: 'Kalkuliert Modernisierungsdarlehen für Immobilienbesitzer (meist bis 50.000 € ohne Grundschuldeintrag).',
    searchKeywords: ['modernisierungskredit rechner', 'wohnkredit sanierung zinsen', 'kredit waermepumpe berechnen', 'renovierungskredit ohne grundschuld'],
    inputs: [
      { id: 'amount', label: 'Modernisierungsbudget', type: 'number', defaultValue: 35000, min: 5000, step: 2500, unit: '€' },
      { id: 'interestRate', label: 'Sollzins p.a.', type: 'number', defaultValue: 4.8, min: 1, step: 0.1, unit: '%' },
      { id: 'termYears', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 8, min: 2, max: 15, step: 1, unit: 'Jahre' },
    ],
    formula: 'Monatsrate = Kreditsumme × (r / (1 - (1 + r)^-n))',
    formulaExplanation: 'Wohnkredite zur Modernisierung werden als Ratenkredit ohne teure Notar- und Grundbuchgebühren vergeben.',
    workedExample: {
      title: 'Beispiel: 35.000 € für neue Wärmepumpe über 8 Jahre zu 4,8 %',
      description: 'Monatsrate: ca. 439,72 €. Gesamtzinsen: ca. 7.213 €.',
      inputs: { amount: 35000, interestRate: 4.8, termYears: 8 },
      resultSummary: 'ca. 439,72 € / Monat',
    },
    intro: 'Wärmepumpentausch, neue Dreifachverglasung oder Dachdämmung: Ein Modernisierungskredit bietet Eigentümern zinsgünstige Konditionen ohne Grundschuldbestellung.',
    details: 'Dadurch sparen Sie mehrere hundert Euro an Notar- und Grundbuchamtskosten, die bei einer klassischen Grundschulderhöhung anfallen würden.',
    faqs: [
      { question: 'Gibt es staatliche Zuschüsse der KfW oder BAFA?', answer: 'Ja! Für energetische Sanierungen (z. B. Heizungstausch) gewährt die KfW Tilgungszuschüsse von bis zu 70 % der förderfähigen Kosten (KfW-Programm 458).' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'kreditrechner', 'waermepumpe-stromkosten-rechner'],
    calcBody: `
      const loan = parseFloat(inputs.amount) || 35000;
      const z = parseFloat(inputs.interestRate) || 4.8;
      const y = parseInt(inputs.termYears, 10) || 8;
      const r = (z / 100) / 12;
      const m = y * 12;
      const rate = loan * (r / (1 - Math.pow(1 + r, -m)));
      const totalPaid = rate * m;
      return {
        primary: { id: 'rate', label: 'Monatliche Rate', value: rate, formattedValue: formatCurrency(rate), highlight: true },
        secondary: [
          { id: 'interest', label: 'Gesamte Zinskosten', value: totalPaid - loan, formattedValue: formatCurrency(totalPaid - loan) },
          { id: 'total', label: 'Gesamter Rückzahlungsbetrag', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
          { id: 'notarySaved', label: 'Geschätzte Ersparnis Notar/Grundbuch', value: 650, formattedValue: 'ca. 650 € (ohne Grundschuld)' },
        ],
        summaryText: \`Für ein Modernisierungsbudget von \${formatCurrency(loan)} zahlen Sie bei \${formatPercent(z)} Zinsen monatlich \${formatCurrency(rate)} über \${y} Jahre.\`
      };
    `,
  },
  {
    id: 'kreditvergleich-rechner',
    name: 'Kreditvergleich Rechner (Zwei Angebote direkt vergleichen)',
    shortName: 'Kreditvergleich',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Kreditvergleich Rechner – Zwei Darlehensangebote objektiv vergleichen',
    metaDescription: 'Vergleichen Sie zwei Kreditangebote nach Monatsrate, Gesamtzinskosten und Restschuld. Transparenter Rechner für Raten- & Baudarlehen.',
    h1: 'Kreditvergleich Rechner (Angebot A vs. Angebot B)',
    shortDescription: 'Gegenüberstellung zweier Kreditangebote zur Ermittlung des finanziell günstigsten Darlehens.',
    searchKeywords: ['kreditvergleich rechner', 'zwei kredite vergleichen online', 'kreditangebote zinsen vergleich', 'baufinanzierung angebote gegenueberstellen'],
    inputs: [
      { id: 'loanAmount', label: 'Kreditsumme', type: 'number', defaultValue: 50000, min: 1000, step: 1000, unit: '€' },
      { id: 'rateA', label: 'Effektiver Jahreszins Angebot A', type: 'number', defaultValue: 5.9, min: 0.5, step: 0.1, unit: '%' },
      { id: 'rateB', label: 'Effektiver Jahreszins Angebot B', type: 'number', defaultValue: 4.8, min: 0.5, step: 0.1, unit: '%' },
      { id: 'months', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 60, min: 12, max: 120, step: 6, unit: 'Monate' },
    ],
    formula: 'Ersparnis = Gesamtzinsen_Angebot_A - Gesamtzinsen_Angebot_B',
    formulaExplanation: 'Vergleicht die Gesamtrückzahlungssummen beider Darlehen bei identischer Laufzeit.',
    workedExample: {
      title: 'Beispiel: 50.000 € über 60 Monate (5,9 % vs. 4,8 %)',
      description: 'Angebot A: 964,28 €/Monat (Zinsen: 7.857 €). Angebot B: 938,91 €/Monat (Zinsen: 6.335 €). Ersparnis: 1.522 €.',
      inputs: { loanAmount: 50000, rateA: 5.9, rateB: 4.8, months: 60 },
      resultSummary: '1.522,00 € Ersparnis mit Angebot B',
    },
    intro: 'Schon ein Unterschied von wenigen Zehntel-Prozentpunkten beim Zinssatz summiert sich über die Kreditlaufzeit zu vierstelligen Beträgen.',
    details: 'Achten Sie beim Vergleich immer auf den effektiven Jahreszins (§ 6 PAngV), da nur dieser alle anfallenden Kosten und Zahlungsmodalitäten berücksichtigt.',
    faqs: [
      { question: 'Worin liegt der Unterschied zwischen Sollzins und Effektivzins?', answer: 'Der Sollzins (früher Nominalzins) ist der reine Zinssatz für das geliehene Geld. Der Effektivzins enthält zusätzlich alle Nebenkosten, Verrechnungszeitpunkte und Bearbeitungsfaktoren.' },
    ],
    relatedSlugs: ['kreditrechner', 'umschuldung-rechner', 'maximaler-kredit-rechner'],
    calcBody: `
      const loan = parseFloat(inputs.loanAmount) || 50000;
      const rA = parseFloat(inputs.rateA) || 5.9;
      const rB = parseFloat(inputs.rateB) || 4.8;
      const m = parseInt(inputs.months, 10) || 60;
      const rAm = (rA / 100) / 12;
      const rBm = (rB / 100) / 12;
      const monthlyA = loan * (rAm / (1 - Math.pow(1 + rAm, -m)));
      const monthlyB = loan * (rBm / (1 - Math.pow(1 + rBm, -m)));
      const totalA = monthlyA * m;
      const totalB = monthlyB * m;
      const diff = Math.abs(totalA - totalB);
      const cheaper = totalA < totalB ? 'A' : 'B';
      return {
        primary: { id: 'diff', label: \`Ersparnis mit Angebot \${cheaper}\`, value: diff, formattedValue: formatCurrency(diff), highlight: true },
        secondary: [
          { id: 'rateA', label: 'Monatsrate Angebot A', value: monthlyA, formattedValue: formatCurrency(monthlyA) },
          { id: 'rateB', label: 'Monatsrate Angebot B', value: monthlyB, formattedValue: formatCurrency(monthlyB) },
          { id: 'interestA', label: 'Gesamtzinsen Angebot A', value: totalA - loan, formattedValue: formatCurrency(totalA - loan) },
          { id: 'interestB', label: 'Gesamtzinsen Angebot B', value: totalB - loan, formattedValue: formatCurrency(totalB - loan) },
        ],
        summaryText: \`Angebot B spart Ihnen gegenüber Angebot A insgesamt \${formatCurrency(diff)} an Zinskosten (Monatsrate: \${formatCurrency(monthlyB)} statt \${formatCurrency(monthlyA)}).\`
      };
    `,
  },
  {
    id: 'gesamtzinsbelastung-rechner',
    name: 'Gesamtzinsbelastung Rechner (Zinskosten über Kreditlaufzeit)',
    shortName: 'Gesamtzinsbelastung',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Gesamtzinsbelastung Rechner – Wie viel Zinsen zahle ich insgesamt?',
    metaDescription: 'Berechnen Sie die gesamte Zinslast Ihres Kredits in Euro und im Verhältnis zur Kreditsumme. Zinskosten transparent aufgeschlüsselt.',
    h1: 'Gesamtzinsbelastung Rechner (Gesamtzinsen)',
    shortDescription: 'Zeigt die absolute Summe aller Zinszahlungen über die gesamte Laufzeit des Darlehens.',
    searchKeywords: ['gesamtzinsbelastung rechner', 'wie viel zinsen zahle ich insgesamt', 'kreditzinsen gesamtsumme', 'zinslast kredit berechnen'],
    inputs: [
      { id: 'loan', label: 'Kreditsumme', type: 'number', defaultValue: 100000, min: 1000, step: 2500, unit: '€' },
      { id: 'rate', label: 'Sollzins p.a.', type: 'number', defaultValue: 4.0, min: 0.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Laufzeit in Jahren', type: 'number', defaultValue: 10, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    formula: 'Gesamtzinsen = (Monatsrate × Monate) - Kreditsumme',
    formulaExplanation: 'Die Summe aller monatlich gezahlten Zinsanteile über die vereinbarte Laufzeit.',
    workedExample: {
      title: 'Beispiel: 100.000 € Darlehen zu 4,0 % über 10 Jahre',
      description: 'Monatsrate: 1.012,45 €. Gesamtrückzahlung: 121.494 €. Gesamtzinsen: 21.494 € (21,5 % der Kreditsumme).',
      inputs: { loan: 100000, rate: 4.0, years: 10 },
      resultSummary: '21.494,00 € Gesamtzinsen',
    },
    intro: 'Wer einen Kredit aufnimmt, schaut meist nur auf die monatliche Rate. Entscheidend für die Gesamtkosten ist jedoch die Summe aller über die Jahre gezahlten Zinsen.',
    details: 'Eine Erhöhung der anfänglichen Tilgung oder Sondertilgungen verkürzen die Laufzeit und senken die Gesamtzinsbelastung drastisch.',
    faqs: [
      { question: 'Wie kann ich die Gesamtzinsen am effektivsten senken?', answer: 'Durch eine möglichst hohe anfängliche Tilgungsrate (z. B. 3 % statt 1 %) und die regelmäßige Nutzung von jährlichen Sondertilgungsrechten.' },
    ],
    relatedSlugs: ['kreditrechner', 'tilgungsrechner', 'sondertilgungsrechner'],
    calcBody: `
      const loan = parseFloat(inputs.loan) || 100000;
      const z = parseFloat(inputs.rate) || 4.0;
      const y = parseInt(inputs.years, 10) || 10;
      const r = (z / 100) / 12;
      const m = y * 12;
      const monthly = loan * (r / (1 - Math.pow(1 + r, -m)));
      const totalPaid = monthly * m;
      const totalInterest = totalPaid - loan;
      const ratio = (totalInterest / loan) * 100;
      return {
        primary: { id: 'interest', label: 'Gesamte Zinskosten', value: totalInterest, formattedValue: formatCurrency(totalInterest), highlight: true },
        secondary: [
          { id: 'ratio', label: 'Zinsanteil an der Kreditsumme', value: ratio, formattedValue: formatPercent(ratio, 1) },
          { id: 'monthly', label: 'Monatliche Kreditrate', value: monthly, formattedValue: formatCurrency(monthly) },
          { id: 'total', label: 'Gesamtrückzahlung', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
        ],
        summaryText: \`Für einen Kredit von \${formatCurrency(loan)} über \${y} Jahre zahlen Sie insgesamt \${formatCurrency(totalInterest)} an Zinsen (\${formatPercent(ratio, 1)} der Kreditsumme).\`
      };
    `,
  },
  {
    id: 'vorfaelligkeitsentschaedigung-rechner',
    name: 'Vorfälligkeitsentschädigung Rechner (Kredit vorzeitig kündigen)',
    shortName: 'Vorfälligkeitsentschädigung',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Vorfälligkeitsentschädigung Rechner – Entschädigung bei Kündigung berechnen',
    metaDescription: 'Berechnen Sie die gesetzliche Vorfälligkeitsentschädigung nach § 502 BGB bei vorzeitiger Kündigung von Raten- und Verbraucherkrediten.',
    h1: 'Vorfälligkeitsentschädigung Rechner (§ 502 BGB)',
    shortDescription: 'Ermittelt die gesetzlich gedeckelte Entschädigung der Bank bei vorzeitiger Ablösung von Ratenkrediten.',
    searchKeywords: ['vorfaelligkeitsentschaedigung rechner', 'kredit vorzeitig kuendigen kosten', '502 bgb vorfaelligkeit', 'ausloesegebuehr kredit'],
    inputs: [
      { id: 'remainingDebt', label: 'Verbleibende Restschuld', type: 'number', defaultValue: 12000, min: 100, step: 500, unit: '€' },
      { id: 'remainingMonths', label: 'Restlaufzeit in Monaten', type: 'number', defaultValue: 24, min: 1, max: 120, step: 1, unit: 'Monate' },
    ],
    formula: 'Maximal 1,0 % der Restschuld (bei Restlaufzeit > 12 Monate) bzw. 0,5 % (bei Restlaufzeit ≤ 12 Monate)',
    formulaExplanation: 'Nach § 502 Abs. 1 BGB ist die Vorfälligkeitsentschädigung für Verbraucherdarlehen gesetzlich streng auf 1,0 % bzw. 0,5 % des vorzeitig zurückgezahlten Betrags begrenzt.',
    workedExample: {
      title: 'Beispiel: 12.000 € Restschuld bei 24 Monaten Restlaufzeit',
      description: 'Laufzeit über 12 Monate: 1,0 % von 12.000 € = 120 € maximale Vorfälligkeitsentschädigung.',
      inputs: { remainingDebt: 12000, remainingMonths: 24 },
      resultSummary: 'Maximal 120,00 € Entschädigung',
    },
    intro: 'Wer einen Ratenkredit vorzeitig aus Erspartem ablöst, muss der Bank den Zinsverlust erstatten. Für Verbraucher gilt jedoch eine verbraucherfreundliche Obergrenze.',
    details: 'Viele Banken verzichten bei modernen Onlinekrediten in ihren AGBs sogar komplett auf die Vorfälligkeitsentschädigung.',
    faqs: [
      { question: 'Gilt die 1%-Grenze auch für Immobilienkredite?', answer: 'Nein! Für grundschuldbesicherte Immobiliendarlehen gilt die strenge 1%-Deckelung nicht. Dort berechnet die Bank den Zinsschaden nach der Aktiv-Passiv-Methode der Rechtsprechung des BGH.' },
    ],
    relatedSlugs: ['umschuldung-rechner', 'kreditrechner', 'restschuld-rechner'],
    calcBody: `
      const debt = parseFloat(inputs.remainingDebt) || 12000;
      const m = parseInt(inputs.remainingMonths, 10) || 24;
      const maxCapPct = m > 12 ? 1.0 : 0.5;
      const maxFee = debt * (maxCapPct / 100);
      return {
        primary: { id: 'fee', label: 'Maximale Vorfälligkeitsentschädigung', value: maxFee, formattedValue: formatCurrency(maxFee), highlight: true },
        secondary: [
          { id: 'rate', label: 'Gesetzlicher Höchstsatz (§ 502 BGB)', value: maxCapPct, formattedValue: formatPercent(maxCapPct, 1) },
          { id: 'totalPay', label: 'Gesamter Ablösebetrag', value: debt + maxFee, formattedValue: formatCurrency(debt + maxFee) },
        ],
        summaryText: \`Bei einer Restschuld von \${formatCurrency(debt)} und \${m} Monaten Restlaufzeit darf die Bank nach § 502 BGB höchstens \${formatCurrency(maxFee)} (\${formatPercent(maxCapPct, 1)}) als Entschädigung verlangen.\`
      };
    `,
  },
  {
    id: 'schuldentilgungsdauer-rechner',
    name: 'Schuldentilgungsdauer Rechner (Wann bin ich schuldenfrei?)',
    shortName: 'Schuldentilgungsdauer',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Schuldentilgungsdauer Rechner – Wann bin ich endlich schuldenfrei?',
    metaDescription: 'Berechnen Sie, wie viele Monate Sie bei einer festen monatlichen Rate benötigen, um Ihre bestehenden Schulden vollständig zu tilgen.',
    h1: 'Schuldentilgungsdauer Rechner (Schuldenfreiheit planen)',
    shortDescription: 'Kalkuliert die exakte Monatsanzahl bis zur vollständigen Entschuldung bei fester Monatsrate.',
    searchKeywords: ['schuldentilgungsdauer rechner', 'wann bin ich schuldenfrei rechner', 'schulden tilgen zeit berechnen', 'schuldenabbau monatsrate'],
    inputs: [
      { id: 'currentDebt', label: 'Aktuelle Gesamtschulden', type: 'number', defaultValue: 8000, min: 100, step: 250, unit: '€' },
      { id: 'monthlyPayment', label: 'Mögliche monatliche Tilgungsrate', type: 'number', defaultValue: 300, min: 20, step: 20, unit: '€' },
      { id: 'interestRate', label: 'Durchschnittlicher Zinssatz p.a.', type: 'number', defaultValue: 6.5, min: 0, step: 0.1, unit: '%' },
    ],
    formula: 'Monate = -ln(1 - (Schulden × r / Rate)) / ln(1 + r)',
    formulaExplanation: 'Mathematische Ermittlung der Amortisationsdauer unter Berücksichtigung laufender Zinsen.',
    workedExample: {
      title: 'Beispiel: 8.000 € Schulden bei 300 € Monatsrate und 6,5 % Zinsen',
      description: 'Dauer: ca. 30 Monate (2,5 Jahre). Gesamtzinsen: ca. 687 €.',
      inputs: { currentDebt: 8000, monthlyPayment: 300, interestRate: 6.5 },
      resultSummary: 'ca. 30 Monate (2,5 Jahre)',
    },
    intro: 'Schuldenabbau erfordert Ausdauer und einen klaren Plan. Unser Rechner zeigt Ihnen das genaue Zieldatum, an dem Sie wieder finanziell frei sind.',
    details: 'Wichtig: Die Monatsrate muss höher sein als die monatlich anfallenden Zinsen, da die Schulden sonst trotz Zahlung kontinuierlich anwachsen.',
    faqs: [
      { question: 'Was ist die Schneeball-Methode zum Schuldenabbau?', answer: 'Man sortiert alle Schulden nach der Höhe und tilgt den kleinsten Kredit mit maximalem Budget zuerst. Das schnelle Tilgungserlebnis sorgt für enorme Motivation.' },
    ],
    relatedSlugs: ['kreditlaufzeit-rechner', 'dispozins-rechner', 'umschuldung-rechner'],
    calcBody: `
      const debt = parseFloat(inputs.currentDebt) || 8000;
      const pay = parseFloat(inputs.monthlyPayment) || 300;
      const z = parseFloat(inputs.interestRate) || 6.5;
      const r = (z / 100) / 12;
      if (r > 0 && pay <= debt * r) {
        return {
          primary: { id: 'time', label: 'Tilgungsdauer', value: 999, formattedValue: 'Nie schuldenfrei', highlight: true },
          error: \`Die Monatsrate reicht nicht aus, um die Zinsen von \${formatCurrency(debt * r)} pro Monat zu decken. Die Schulden steigen!\`
        };
      }
      let m = 0;
      if (r > 0) {
        m = Math.ceil(-Math.log(1 - (debt * r) / pay) / Math.log(1 + r));
      } else {
        m = Math.ceil(debt / pay);
      }
      const y = Math.floor(m / 12);
      const remM = m % 12;
      const totalPaid = pay * m;
      return {
        primary: { id: 'time', label: 'Zeit bis zur Schuldenfreiheit', value: m / 12, formattedValue: \`\${y} Jahre und \${remM} Monate\`, highlight: true },
        secondary: [
          { id: 'months', label: 'Anzahl Monatsraten', value: m, formattedValue: \`\${m} Monate\` },
          { id: 'interest', label: 'Gezahlte Zinsen bis zum Ziel', value: totalPaid - debt, formattedValue: formatCurrency(totalPaid - debt) },
          { id: 'total', label: 'Gesamte Zahlungen', value: totalPaid, formattedValue: formatCurrency(totalPaid) },
        ],
        summaryText: \`Bei \${formatCurrency(pay)} Monatsrate sind Ihre Schulden von \${formatCurrency(debt)} in \${y} Jahren und \${remM} Monaten vollständig abbezahlt.\`
      };
    `,
  },
  {
    id: 'forward-darlehen-rechner',
    name: 'Forward-Darlehen Rechner (Zinsen für die Zukunft sichern)',
    shortName: 'Forward-Darlehen',
    category: 'kredit-schulden',
    subcategory: 'Umschuldung',
    metaTitle: 'Forward-Darlehen Rechner – Zinsaufschlag für Anschlussfinanzierung',
    metaDescription: 'Berechnen Sie den Zinsaufschlag bei Forward-Darlehen bis zu 36 oder 60 Monate vor Ablauf der Zinsbindung. Schutz vor steigenden Zinsen.',
    h1: 'Forward-Darlehen Rechner (Zinssicherung im Voraus)',
    shortDescription: 'Kalkuliert den monatlichen Zinsaufschlag (Forward-Aufschlag) für die vorzeitige Zinssicherung.',
    searchKeywords: ['forward darlehen rechner', 'forward aufschlag berechnen', 'anschlussfinanzierung zukunft sichern', 'forward zinsrechner'],
    inputs: [
      { id: 'loanAmount', label: 'Erwartete Restschuld zur Anschlussfinanzierung', type: 'number', defaultValue: 180000, min: 10000, step: 5000, unit: '€' },
      { id: 'currentRate', label: 'Aktueller Marktzins p.a.', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1, unit: '%' },
      { id: 'forwardMonths', label: 'Vorlaufzeit in Monaten (bis Zinsbindungsende)', type: 'number', defaultValue: 24, min: 1, max: 60, step: 6, unit: 'Monate' },
      { id: 'monthlyMarkup', label: 'Forward-Aufschlag der Bank pro Monat Vorlauf', type: 'number', defaultValue: 0.02, min: 0.01, max: 0.05, step: 0.005, unit: '%' },
    ],
    formula: 'Forward-Zins = Marktzins + (Forward-Aufschlag × Vorlaufmonate)',
    formulaExplanation: 'Banken berechnen pro Monat bis zum Darlehensantritt einen kleinen Zinsaufschlag (meist 0,015 % bis 0,03 % pro Monat).',
    workedExample: {
      title: 'Beispiel: 180.000 € Darlehen, 24 Monate Vorlauf, 3,5 % Basiszins + 0,02 % / Monat',
      description: 'Zuschlag: 0,48 %. Gesicherter Forward-Zins: 3,98 % p.a.',
      inputs: { loanAmount: 180000, currentRate: 3.5, forwardMonths: 24, monthlyMarkup: 0.02 },
      resultSummary: '3,98 % gesicherter Zinssatz',
    },
    intro: 'Ihre Zinsbindung läuft erst in 1 bis 3 Jahren aus, aber Sie befürchten stark steigende Zinsen? Ein Forward-Darlehen sichert das heutige Zinsniveau im Voraus.',
    details: 'Ein Forward-Darlehen lohnt sich besonders, wenn Sie mit einem Zinsanstieg rechnen, der über dem berechneten Forward-Aufschlag liegt.',
    faqs: [
      { question: 'Muss man ein Forward-Darlehen zwingend abnehmen?', answer: 'Ja! Ein Forward-Darlehen ist ein bindender Vertrag. Sinken die Zinsen bis zum Antrittstermin unerwartet, müssen Sie das Darlehen dennoch zum vereinbarten Zinssatz abnehmen (Nichtabnahmeentschädigung).' },
    ],
    relatedSlugs: ['baufinanzierung-rechner', 'zinsbindung-rechner', 'tilgungsrechner'],
    calcBody: `
      const loan = parseFloat(inputs.loanAmount) || 180000;
      const base = parseFloat(inputs.currentRate) || 3.5;
      const m = parseInt(inputs.forwardMonths, 10) || 24;
      const markup = parseFloat(inputs.monthlyMarkup) || 0.02;
      const totalMarkup = m * markup;
      const forwardRate = base + totalMarkup;
      const monthlyRate = loan * ((forwardRate + 2.0) / 1200);
      return {
        primary: { id: 'rate', label: 'Gesicherter Forward-Zinssatz', value: forwardRate, formattedValue: formatPercent(forwardRate, 2), highlight: true },
        secondary: [
          { id: 'markup', label: 'Gesamter Zinsaufschlag für die Vorlaufzeit', value: totalMarkup, formattedValue: \`+\${formatPercent(totalMarkup, 2)}\` },
          { id: 'monthlyRate', label: 'Voraussichtliche Rate (bei 2 % Tilgung)', value: monthlyRate, formattedValue: formatCurrency(monthlyRate) },
        ],
        summaryText: \`Für eine Vorlaufzeit von \${m} Monaten zahlen Sie einen Aufschlag von \${formatPercent(totalMarkup, 2)}. Ihr garantierter Zinssatz liegt bei \${formatPercent(forwardRate, 2)}.\`
      };
    `,
  },
  {
    id: 'kreditlaufzeit-rechner',
    name: 'Kreditlaufzeit Rechner (Exakte Laufzeit aus Wunschrate)',
    shortName: 'Kreditlaufzeit',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Kreditlaufzeit Rechner – Wie lange läuft der Kredit bei fester Rate?',
    metaDescription: 'Ermitteln Sie die genaue Kreditlaufzeit in Monaten und Jahren aus Kreditsumme, Zinssatz und monatlicher Rate.',
    h1: 'Kreditlaufzeit Rechner (Dauer bis zur Tilgung)',
    shortDescription: 'Berechnet die genaue Laufzeit eines Kredits anhand der gewählten Monatsrate.',
    searchKeywords: ['kreditlaufzeit rechner', 'wie lange laeuft mein kredit', 'darlehenslaufzeit berechnen monate', 'laufzeit aus kreditrate formel'],
    inputs: [
      { id: 'loan', label: 'Kreditsumme', type: 'number', defaultValue: 30000, min: 500, step: 500, unit: '€' },
      { id: 'interestRate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 4.9, min: 0.1, step: 0.1, unit: '%' },
      { id: 'monthlyRate', label: 'Monatliche Wunschrate', type: 'number', defaultValue: 450, min: 25, step: 25, unit: '€' },
    ],
    formula: 'Monate = -ln(1 - (K × r / Rate)) / ln(1 + r)',
    formulaExplanation: 'Mathematische Laufzeitbestimmung nach der Annuitätenformel.',
    workedExample: {
      title: 'Beispiel: 30.000 € zu 4,9 % bei 450 € Monatsrate',
      description: 'Laufzeit: ca. 78 Monate (6 Jahre und 6 Monate). Gesamtzinsen: ca. 4.960 €.',
      inputs: { loan: 30000, interestRate: 4.9, monthlyRate: 450 },
      resultSummary: 'ca. 6 Jahre und 6 Monate',
    },
    intro: 'Sie möchten wissen, wie lange Sie einen Kredit abbezahlen müssen, wenn Sie monatlich einen bestimmten Betrag tilgen können? Der Laufzeitrechner liefert das genaue Datum.',
    details: 'Schon eine kleine Erhöhung der Monatsrate um 50 € verkürzt die Gesamtlaufzeit bei größeren Krediten oft um mehrere Jahre.',
    faqs: [
      { question: 'Warum darf die Monatsrate nicht beliebig klein sein?', answer: 'Ist die Rate kleiner als oder gleich dem monatlichen Zinsbetrag, wird der Kredit niemals getilgt und die Laufzeit ist rechnerisch unendlich.' },
    ],
    relatedSlugs: ['kreditrechner', 'schuldentilgungsdauer-rechner', 'tilgungsrechner'],
    calcBody: `
      const loan = parseFloat(inputs.loan) || 30000;
      const z = parseFloat(inputs.interestRate) || 4.9;
      const rate = parseFloat(inputs.monthlyRate) || 450;
      const r = (z / 100) / 12;
      if (r > 0 && rate <= loan * r) {
        return { primary: { id: 'time', label: 'Laufzeit', value: 0, formattedValue: 'Unendlich' }, error: 'Monatsrate muss höher als die monatlichen Zinsen sein.' };
      }
      const m = Math.ceil(-Math.log(1 - (loan * r) / rate) / Math.log(1 + r));
      const y = Math.floor(m / 12);
      const remM = m % 12;
      const total = rate * m;
      return {
        primary: { id: 'time', label: 'Kreditlaufzeit', value: m / 12, formattedValue: \`\${y} Jahre und \${remM} Monate\`, highlight: true },
        secondary: [
          { id: 'months', label: 'Gesamte Anzahl Raten', value: m, formattedValue: \`\${m} Monatsraten\` },
          { id: 'interest', label: 'Gesamtzinskosten', value: total - loan, formattedValue: formatCurrency(total - loan) },
          { id: 'total', label: 'Gesamtrückzahlung', value: total, formattedValue: formatCurrency(total) },
        ],
        summaryText: \`Bei einer Monatsrate von \${formatCurrency(rate)} ist Ihr Kredit von \${formatCurrency(loan)} in \${y} Jahren und \${remM} Monaten vollständig getilgt.\`
      };
    `,
  },
  {
    id: 'restschuld-rechner',
    name: 'Restschuld Rechner (Kreditrestbetrag nach X Jahren)',
    shortName: 'Restschuld berechnen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Restschuld Rechner – Verbleibender Kreditbetrag nach X Jahren',
    metaDescription: 'Berechnen Sie die verbleibende Restschuld Ihres Kredits oder Annuitätendarlehens zu einem beliebigen Stichtag online.',
    h1: 'Restschuld Rechner (Darlehens-Restsumme)',
    shortDescription: 'Ermittelt die exakte Restschuld nach Ablauf einer bestimmten Monats- oder Jahresanzahl.',
    searchKeywords: ['restschuld rechner', 'kredit restschuld berechnen', 'darlehen restschuld stichtag', 'tilgungsplan restbetrag'],
    inputs: [
      { id: 'loanAmount', label: 'Ursprüngliche Kreditsumme', type: 'number', defaultValue: 150000, min: 1000, step: 2500, unit: '€' },
      { id: 'interestRate', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.8, min: 0.1, step: 0.1, unit: '%' },
      { id: 'monthlyPayment', label: 'Monatliche Kreditrate', type: 'number', defaultValue: 800, min: 50, step: 25, unit: '€' },
      { id: 'elapsedYears', label: 'Laufzeit bis zum Stichtag in Jahren', type: 'number', defaultValue: 10, min: 1, max: 35, step: 1, unit: 'Jahre' },
    ],
    formula: 'Restschuld = K₀ × (1+r)^m - Rente × (((1+r)^m - 1) / r)',
    formulaExplanation: 'Zukunftswert des Anfangskapitals abzüglich des Endwerts der bisher erbrachten Monatsraten.',
    workedExample: {
      title: 'Beispiel: 150.000 € Darlehen zu 3,8 %, 800 € Rate nach 10 Jahren',
      description: 'Restschuld nach 10 Jahren: ca. 98.450 €. Bisher getilgt: ca. 51.550 €.',
      inputs: { loanAmount: 150000, interestRate: 3.8, monthlyPayment: 800, elapsedYears: 10 },
      resultSummary: 'ca. 98.450 € Restschuld',
    },
    intro: 'Wie viel ist von Ihrem Darlehen nach einigen Jahren noch übrig? Mit dem Restschuld-Rechner ermitteln Sie den genauen Schuldenstand für Ihre Anschlussfinanzierung.',
    details: 'Der Rechner zeigt Ihnen auch, wie viel Prozent des ursprünglichen Darlehens Sie bereits abbezahlt haben.',
    faqs: [
      { question: 'Warum sinkt die Restschuld zu Beginn nur so langsam?', answer: 'Weil die Monatsrate zu Beginn überwiegend aus Zinsen besteht. Erst wenn die Restschuld sinkt, nimmt der Tilgungsanteil der Rate von Monat zu Monat zu.' },
    ],
    relatedSlugs: ['kreditrechner', 'baufinanzierung-rechner', 'tilgungsrechner'],
    calcBody: `
      const loan = parseFloat(inputs.loanAmount) || 150000;
      const z = parseFloat(inputs.interestRate) || 3.8;
      const pay = parseFloat(inputs.monthlyPayment) || 800;
      const y = parseInt(inputs.elapsedYears, 10) || 10;
      const r = (z / 100) / 12;
      const m = y * 12;
      let balance = loan;
      for (let i = 0; i < m; i++) {
        const intPortion = balance * r;
        const repPortion = pay - intPortion;
        balance -= repPortion;
        if (balance <= 0) { balance = 0; break; }
      }
      const repaid = loan - balance;
      const repaidPct = (repaid / loan) * 100;
      return {
        primary: { id: 'rest', label: \`Restschuld nach \${y} Jahren\`, value: balance, formattedValue: formatCurrency(balance), highlight: true },
        secondary: [
          { id: 'repaid', label: 'Bisher getilgter Betrag', value: repaid, formattedValue: formatCurrency(repaid) },
          { id: 'repaidPct', label: 'Bisher getilgter Anteil', value: repaidPct, formattedValue: formatPercent(repaidPct, 1) },
        ],
        summaryText: \`Nach \${y} Jahren beträgt die verbleibende Restschuld Ihres Darlehens noch \${formatCurrency(balance)} (\${formatPercent(repaidPct, 1)} erfolgreich getilgt).\`
      };
    `,
  },
];
