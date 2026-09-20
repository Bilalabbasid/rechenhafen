import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateInstallmentLoan,
  calculateAnnuity,
  calculateSpecialRepayment,
} from '@/lib/calculators/kredit';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const KREDIT_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'kreditrechner',
    slug: 'kreditrechner',
    name: 'Kreditrechner & Ratenkredit',
    shortName: 'Kreditrechner',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Kreditrechner – Monatsrate, Zinsen & Tilgungsplan berechnen',
    metaDescription: 'Berechnen Sie die Monatsrate, Gesamtzinskosten und den vollständigen Tilgungsplan für Ihren Ratenkredit. Unverbindlich & transparent.',
    h1: 'Kreditrechner – Ratenkredit & Monatsrate berechnen',
    shortDescription: 'Ermittelt die monatliche Kreditrate, Zinskosten und den jährlichen Tilgungsverlauf.',
    searchKeywords: ['kreditrechner', 'ratenkredit rechner', 'kreditrate berechnen', 'tilgungsplan kredit', 'kreditzinsen berechnen'],
    inputs: [
      { id: 'loanAmount', label: 'Nettokreditbetrag', type: 'number', defaultValue: 15000, min: 500, step: 500, unit: '€' },
      { id: 'annualInterest', label: 'Gebundener Sollzinssatz p.a.', type: 'number', defaultValue: 5.5, min: 0.1, max: 25, step: 0.1, unit: '%' },
      { id: 'termMonths', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 60, min: 6, max: 120, step: 6, unit: 'Monate' },
    ],
    calculate: calculateInstallmentLoan,
    formula: 'Monatsrate = Kreditbetrag × (q^n × (q - 1)) / (q^n - 1) mit q = 1 + (Zinssatz / 12)',
    formulaExplanation: 'Klassische Annuitätenformel für unterjährige Ratenzahlungen bei gleichbleibender monatlicher Annuität.',
    workedExample: {
      title: 'Beispiel: 15.000 € über 60 Monate bei 5,5 % Zinsen',
      description: 'Monatliche Rate: ca. 286,52 €. Gesamtzinsen: ca. 2.191 €.',
      inputs: { loanAmount: 15000, annualInterest: 5.5, termMonths: 60 },
      resultSummary: '286,52 € monatlich',
    },
    content: {
      intro: 'Mit unserem Kreditrechner ermitteln Sie in Sekundenschnelle die genaue Monatsbelastung für einen Anschaffungs-, Auto- oder Privatkredit.',
      details: 'Der integrierte Tilgungsplan zeigt Ihnen für jedes Jahr auf, wie viel Sie an reinen Zinsen zahlen und wie schnell die Restschuld abnimmt.',
      tips: [
        'Wählen Sie die Laufzeit so, dass die monatliche Rate bequem in Ihr Haushaltsbudget passt.',
        'Prüfen Sie bei Verträgen stets, ob kostenlose Sondertilgungen möglich sind.',
      ],
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Sollzins und effektivem Jahreszins?', answer: 'Der Sollzins ist der reine Zinssatz für das geliehene Geld. Der effektive Jahreszins enthält zusätzlich alle Nebenkosten und Gebühren.' },
      { question: 'Kann man einen Ratenkredit vorzeitig kündigen?', answer: 'Ja, nach § 500 Abs. 2 BGB kann ein Verbraucherkredit jederzeit ganz oder teilweise vorzeitig zurückgezahlt werden.' },
    ],
    relatedSlugs: ['ratenkreditrechner', 'tilgungsrechner', 'sondertilgungsrechner', 'restschuld-rechner', 'autokreditrechner'],
  },
  {
    id: 'ratenkreditrechner',
    slug: 'ratenkreditrechner',
    name: 'Ratenkreditrechner',
    shortName: 'Ratenkredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Ratenkreditrechner – Kreditrate & Gesamtkosten kalkulieren',
    metaDescription: 'Kreditrate für Konsumentenkredite berechnen. Transparente Kostenaufstellung und Tilgungsübersicht.',
    h1: 'Ratenkreditrechner für Anschaffungen & Konsum',
    shortDescription: 'Berechnet die Kreditrate und Zinskosten für Ratenkredite.',
    searchKeywords: ['ratenkreditrechner', 'konsumentenkredit rechner', 'ratenkredit monatsrate'],
    inputs: [
      { id: 'loanAmount', label: 'Kreditsumme', type: 'number', defaultValue: 10000, unit: '€' },
      { id: 'annualInterest', label: 'Effektiver Jahreszins', type: 'number', defaultValue: 4.9, unit: '%' },
      { id: 'termMonths', label: 'Laufzeit in Monaten', type: 'number', defaultValue: 48, unit: 'Monate' },
    ],
    calculate: calculateInstallmentLoan,
    formula: 'Annuitätendarlehen-Berechnung',
    formulaExplanation: 'Berechnung nach mathematischen Zinsusancen für unterjährige Annuitäten.',
    workedExample: {
      title: 'Beispiel: 10.000 € über 4 Jahre bei 4,9 %',
      description: 'Rate: 229,84 € monatlich.',
      inputs: { loanAmount: 10000, annualInterest: 4.9, termMonths: 48 },
      resultSummary: '229,84 € pro Monat',
    },
    content: {
      intro: 'Kalkulieren Sie Ratenkredite für Möbel, Elektronik oder sonstige Wünsche.',
      details: 'Sehen Sie sofort die Gesamtkosten der Finanzierung im Vergleich zum Barzahlungspreis.',
    },
    faqs: [
      { question: 'Wie wirkt sich eine längere Laufzeit auf die Zinskosten aus?', answer: 'Eine längere Laufzeit senkt zwar die monatliche Rate, erhöht aber die Gesamtzinskosten drastisch.' },
    ],
    relatedSlugs: ['kreditrechner', 'autokreditrechner', 'sondertilgungsrechner'],
  },
  {
    id: 'autokreditrechner',
    slug: 'autokreditrechner',
    name: 'Autokreditrechner (Fahrzeugfinanzierung)',
    shortName: 'Autokredit berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Autokreditrechner – Monatsrate für Neuwagen & Gebrauchtwagen',
    metaDescription: 'Berechnen Sie die Finanzierung für Ihr Auto: Kaufpreis, Anzahlung, Zinssatz und Laufzeit. Inklusive Gesamtzinsen.',
    h1: 'Autokreditrechner – Autofinanzierung planen',
    shortDescription: 'Berechnet die Monatsrate für Fahrzeugkäufe unter Berücksichtigung von Anzahlung oder Inzahlungnahme.',
    searchKeywords: ['autokreditrechner', 'autofinanzierung rechner', 'autokredit monatsrate', 'kfz kredit berechnen'],
    inputs: [
      { id: 'carPrice', label: 'Fahrzeugkaufpreis', type: 'number', defaultValue: 25000, unit: '€' },
      { id: 'downPayment', label: 'Anzahlung / Inzahlungnahme Altwagen', type: 'number', defaultValue: 5000, unit: '€' },
      { id: 'annualInterest', label: 'Effektiver Jahreszins', type: 'number', defaultValue: 5.2, unit: '%' },
      { id: 'termMonths', label: 'Finanzierungslaufzeit', type: 'number', defaultValue: 48, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.carPrice) || 25000;
      const down = parseFloat(inputs.downPayment) || 5000;
      const loan = Math.max(0, price - down);
      const res = calculateInstallmentLoan({ loanAmount: loan, annualInterest: inputs.annualInterest, termMonths: inputs.termMonths });
      return {
        ...res,
        primary: { id: 'carRate', label: 'Monatliche Autorate', value: res.primary.value, formattedValue: res.primary.formattedValue, highlight: true },
        secondary: [
          { id: 'loanNeeded', label: 'Nettodarlehen (nach Anzahlung)', value: loan, formattedValue: formatCurrency(loan) },
          ...(res.secondary || []),
        ],
        summaryText: `Für Ihr Fahrzeug (${formatCurrency(price)}) nach Abzug von ${formatCurrency(down)} Anzahlung beträgt die monatliche Rate ${res.primary.formattedValue}.`,
      };
    },
    formula: 'Nettodarlehen = Kaufpreis - Anzahlung',
    formulaExplanation: 'Ratenkreditberechnung auf den tatsächlich zu finanzierenden Differenzbetrag.',
    workedExample: {
      title: 'Beispiel: 25.000 € Auto mit 5.000 € Anzahlung über 48 Monate bei 5,2 %',
      description: 'Darlehen: 20.000 €. Monatsrate: ca. 462,34 €.',
      inputs: { carPrice: 25000, downPayment: 5000, annualInterest: 5.2, termMonths: 48 },
      resultSummary: '462,34 € monatlich',
    },
    content: {
      intro: 'Planen Sie den Kauf eines Neu- oder Gebrauchtwagens? Mit einer passenden Anzahlung halten Sie die Monatsrate niedrig.',
      details: 'Tipp: Vergleichen Sie unabhängige Autokredite mit Händlerangeboten, um als Barzahler Rabatte auszuhandeln.',
    },
    faqs: [
      { question: 'Was ist besser: Händlerfinanzierung oder freier Autokredit?', answer: 'Freie Kredite ermöglichen Barzahler-Rabatte beim Händler, die oft mehr sparen als eine Null-Prozent-Finanzierung mit festem Listenpreis.' },
    ],
    relatedSlugs: ['kreditrechner', 'ratenkreditrechner', 'tilgungsrechner'],
  },
  {
    id: 'tilgungsrechner',
    slug: 'tilgungsrechner',
    name: 'Tilgungsrechner mit Zinsbindung',
    shortName: 'Tilgungsrechner',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Tilgungsrechner – Baufinanzierung, Zinsbindung & Restschuld',
    metaDescription: 'Berechnen Sie Monatsrate und Restschuld für Ihr Immobiliendarlehen bei gegebener Zinsbindung und Anfangstilgung.',
    h1: 'Tilgungsrechner für Baufinanzierung & Immobilienkredite',
    shortDescription: 'Ermittelt die monatliche Darlehensrate und verbleibende Restschuld nach der Zinsbindung.',
    searchKeywords: ['tilgungsrechner', 'baufinanzierung rechner tilgung', 'tilgungsplan baugeld', 'anfängliche tilgung rechner'],
    inputs: [
      { id: 'loanAmount', label: 'Darlehenssumme', type: 'number', defaultValue: 300000, min: 10000, step: 10000, unit: '€' },
      { id: 'annualInterest', label: 'Sollzinssatz p.a.', type: 'number', defaultValue: 3.6, min: 0.1, step: 0.05, unit: '%' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung p.a.', type: 'number', defaultValue: 2.0, min: 1.0, max: 10.0, step: 0.25, unit: '%' },
      { id: 'fixedYears', label: 'Zinsbindungsfrist', type: 'number', defaultValue: 10, min: 5, max: 30, step: 5, unit: 'Jahre' },
    ],
    calculate: calculateAnnuity,
    formula: 'Monatsrate = Darlehensbetrag × (Sollzins + Anfangstilgung) / 12',
    formulaExplanation: 'Die monatliche Rate bleibt während der gesamten Zinsbindung konstant.',
    workedExample: {
      title: 'Beispiel: 300.000 € Darlehen bei 3,6 % Zins und 2 % Tilgung',
      description: 'Monatsrate: 1.400 €. Restschuld nach 10 Jahren: ca. 228.000 €.',
      inputs: { loanAmount: 300000, annualInterest: 3.6, initialRepayment: 2.0, fixedYears: 10 },
      resultSummary: '1.400,00 € monatlich',
    },
    content: {
      intro: 'Bei einer Baufinanzierung ist die Wahl der anfänglichen Tilgung entscheidend.',
      details: 'Unser Tilgungsrechner zeigt Ihnen exakt, wie viel Eigenheim Sie sich leisten können.',
    },
    faqs: [
      { question: 'Welche Anfangstilgung wird aktuell empfohlen?', answer: 'Verbraucherschützer empfehlen eine anfängliche Mindesttilgung von mindestens 2 % bis 3 %.' },
    ],
    relatedSlugs: ['kreditrechner', 'sondertilgungsrechner', 'restschuld-rechner'],
  },
  {
    id: 'sondertilgungsrechner',
    slug: 'sondertilgungsrechner',
    name: 'Sondertilgungsrechner',
    shortName: 'Sondertilgung berechnen',
    category: 'kredit-schulden',
    subcategory: 'Sondertilgung',
    metaTitle: 'Sondertilgungsrechner – Zinsersparnis & schnellere Schuldenfreiheit',
    metaDescription: 'Ermitteln Sie, wie viel Tausende Euro Zinsen und wie viele Jahre Kreditlaufzeit Sie durch jährliche Sondertilgungen einsparen.',
    h1: 'Sondertilgungsrechner – Zinsen sparen & Laufzeit verkürzen',
    shortDescription: 'Berechnet die Zinsersparnis und die Verkürzung der Kreditlaufzeit durch regelmäßige Sondertilgungen.',
    searchKeywords: ['sondertilgungsrechner', 'sondertilgung rechner', 'sondertilgung zinsersparnis', 'kredit schneller abzahlen'],
    inputs: [
      { id: 'loanAmount', label: 'Aktuelle Kreditsumme', type: 'number', defaultValue: 250000, unit: '€' },
      { id: 'annualInterest', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.8, unit: '%' },
      { id: 'monthlyPayment', label: 'Bestehende Monatsrate', type: 'number', defaultValue: 1200, unit: '€' },
      { id: 'yearlySpecialRepayment', label: 'Geplante jährliche Sondertilgung', type: 'number', defaultValue: 5000, unit: '€' },
    ],
    calculate: calculateSpecialRepayment,
    formula: 'Laufzeitsimulation mit reduzierter Restschuld',
    formulaExplanation: 'Jede Sondertilgung mindert unmittelbar die verbleibende Kreditsumme um 100 %.',
    workedExample: {
      title: 'Beispiel: 250.000 € Kredit mit 5.000 € jährlicher Sondertilgung',
      description: 'Spart oft mehrere zehntausend Euro Zinsen und verkürzt die Rückzahlung um viele Jahre.',
      inputs: { loanAmount: 250000, annualInterest: 3.8, monthlyPayment: 1200, yearlySpecialRepayment: 5000 },
      resultSummary: 'Riesige Zinsersparnis & schnellere Entschuldung',
    },
    content: {
      intro: 'Sondertilgungen sind der wirksamste Hebel, um bei Darlehen Zinskosten zu reduzieren.',
      details: 'Simulieren Sie, welchen Unterschied es macht, wenn Sie Weihnachtsgeld oder Boni tilgen.',
    },
    faqs: [
      { question: 'Wie viel Sondertilgung erlauben Banken üblicherweise?', answer: 'Die meisten deutschen Banken räumen standardmäßig ein kostenfreies Sondertilgungsrecht von 5 % pro Kalenderjahr ein.' },
    ],
    relatedSlugs: ['tilgungsrechner', 'kreditrechner', 'restschuld-rechner'],
  },
  {
    id: 'restschuld-rechner',
    slug: 'restschuld-rechner',
    name: 'Restschuld-Rechner',
    shortName: 'Restschuld berechnen',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Restschuld Rechner – Darlehensrest nach Zinsbindung ermitteln',
    metaDescription: 'Wie hoch ist die Restschuld am Ende der Zinsbindungsfrist? Berechnen Sie den Anschlussfinanzierungsbedarf online.',
    h1: 'Restschuld Rechner – Restdarlehen nach Zinsbindung',
    shortDescription: 'Berechnet die genaue Restschuld Ihres Kredits zum Stichtag der Zinsbindung.',
    searchKeywords: ['restschuld rechner', 'restdarlehen berechnen', 'restschuld nach 10 jahren', 'anschlussfinanzierung rechner'],
    inputs: [
      { id: 'loanAmount', label: 'Ursprünglicher Darlehensbetrag', type: 'number', defaultValue: 200000, unit: '€' },
      { id: 'annualInterest', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.5, unit: '%' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.0, unit: '%' },
      { id: 'fixedYears', label: 'Zinsbindung in Jahren', type: 'number', defaultValue: 10, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const res = calculateAnnuity(inputs);
      const restItem = res.secondary?.find((s) => s.id === 'remainingDebt');
      return {
        primary: { id: 'rest', label: `Restschuld nach ${inputs.fixedYears} Jahren`, value: restItem?.value || 0, formattedValue: String(restItem?.formattedValue || '0,00 €'), highlight: true },
        secondary: res.secondary,
        summaryText: `Nach ${inputs.fixedYears} Jahren verbleibt eine Restschuld von ${restItem?.formattedValue}.`,
      };
    },
    formula: 'Restschuld = Endkapital der Annuitätenkalkulation',
    formulaExplanation: 'Simulation des monatlichen Tilgungsverlaufs über die Jahre der Zinsbindung.',
    workedExample: {
      title: 'Beispiel: 200.000 € Darlehen nach 10 Jahren',
      description: 'Restschuld: ca. 151.700 €.',
      inputs: { loanAmount: 200000, annualInterest: 3.5, initialRepayment: 2.0, fixedYears: 10 },
      resultSummary: 'ca. 151.700 € Restschuld',
    },
    content: {
      intro: 'Die Restschuld ist der Betrag, für den Sie nach Ablauf der Sollzinsbindung eine Anschlussfinanzierung benötigen.',
      details: 'Kennen Sie Ihre zukünftige Restschuld, um frühzeitig Zinsrisiken abzusichern.',
    },
    faqs: [
      { question: 'Was passiert mit der Restschuld, wenn die Zinsen steigen?', answer: 'Wenn die Zinsen zur Anschlussfinanzierung höher liegen, steigt bei gleicher Restschuld die monatliche Rate.' },
    ],
    relatedSlugs: ['tilgungsrechner', 'kreditrechner', 'sondertilgungsrechner'],
  },
];
