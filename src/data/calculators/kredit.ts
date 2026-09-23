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
    metaTitle: 'Kreditrechner – Ratenkredit, Monatsrate & Zinskosten',
    metaDescription: 'Berechnen Sie die Monatsrate, Gesamtzinskosten und Tilgungsverlauf für Ihren Ratenkredit transparent und werbefrei online.',
    h1: 'Kreditrechner – Monatliche Rate & Zinskosten berechnen',
    shortDescription: 'Ermittelt Monatsrate, Zinsaufwand und Tilgungsplan für Raten- und Konsumentenkredite mit festem Zinssatz.',
    searchKeywords: ['kreditrechner', 'ratenkredit rechner', 'kreditrate berechnen', 'tilgungsplan kredit', 'kreditzinsen berechnen'],
    inputs: [
      { id: 'loanAmount', label: 'Nettokreditbetrag', type: 'number', defaultValue: 15000, min: 500, step: 500, unit: '€' },
      { id: 'annualInterest', label: 'Gebundener Sollzinssatz p.a.', type: 'number', defaultValue: 5.5, min: 0.1, max: 25, step: 0.1, unit: '%' },
      { id: 'term', label: 'Laufzeit', type: 'number', defaultValue: 60, min: 1, max: 360, step: 1 },
      {
        id: 'termUnit',
        label: 'Zeiteinheit der Laufzeit',
        type: 'select',
        defaultValue: 'months',
        options: [
          { value: 'months', label: 'Monate' },
          { value: 'years', label: 'Jahre' },
        ],
      },
      { id: 'sondertilgung', label: 'Jährliche Sondertilgung (optional)', type: 'number', defaultValue: 0, min: 0, step: 500, unit: '€/Jahr', helpText: 'Zusätzliche jährliche Tilgung verkürzt die Laufzeit und spart Zinsen' },
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
      intro: 'Die Monatsrate eines klassischen Kredits setzt sich aus Tilgung und Zinsen zusammen. Da mit jeder Tilgung die Restschuld sinkt, sinkt auch der Zinsanteil, während der Tilgungsanteil steigt.',
      details: 'Nach der Preisangabenverordnung (PAngV) ist stets der Effektivzinssatz für den Kostenvergleich heranzuziehen. Längere Laufzeiten senken die monatliche Rate, erhöhen jedoch die über die Gesamtlaufzeit gezahlten Zinsen deutlich.',
    },
    faqs: [
      { question: 'Was ist das Annuitätenprinzip?', answer: 'Bei einem Annuitätendarlehen bleibt die monatliche Gesamtüberweisung (Rate) über die gesamte Zinsbindungsfrist hinweg konstant, während sich die Anteile von Zins und Tilgung Monat für Monat verschieben.' },
      { question: 'Kann ein Konsumentenkredit jederzeit vorzeitig getilgt werden?', answer: 'Ja, nach § 500 Abs. 2 BGB haben Verbraucher das Recht, Verbraucherdarlehen jederzeit ganz oder teilweise vorzeitig zurückzuzahlen.' },
    ],
    relatedSlugs: ['zwischenfinanzierung-rechner', 'privatkredit-rechner', 'effektivzins-kredit-rechner', 'vorfaelligkeitsentschaedigung-rechner', 'gesamtzinsbelastung-rechner', 'modernisierungskredit-rechner'],
  },
  {
    id: 'ratenkreditrechner',
    slug: 'ratenkreditrechner',
    name: 'Ratenkreditrechner',
    shortName: 'Ratenkredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Ratenkreditrechner – Kreditrate & Gesamtkosten kalkulieren',
    metaDescription: 'Kreditrate für Konsumentenkredite berechnen. Transparente Kostenaufstellung und Tilgungsübersicht. Mit praxisnaher Formelerklärung und schnellem Ergebnis.',
    h1: 'Ratenkreditrechner für Anschaffungen & Konsum',
    shortDescription: 'Berechnet die Kreditrate und Zinskosten für Ratenkredite mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
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
      intro: 'Der Ratenkredit ist die gebräuchlichste Finanzierungsform für Anschaffungen wie Möbel, Elektronik oder unvorhergesehene Reparaturen mit fester monatlicher Belastung.',
      details: 'Typische Nettodarlehensbeträge liegen zwischen 1.000 € und 50.000 € bei Laufzeiten von 12 bis 84 Monaten. Vorsicht ist bei freiwilligen Restschuldversicherungen (RSV) geboten, da diese die Gesamtkosten spürbar in die Höhe treiben.',
    },
    faqs: [
      { question: 'Ist eine Restschuldversicherung (RSV) gesetzlich vorgeschrieben?', answer: 'Nein, der Abschluss einer Restkreditversicherung ist vollkommen freiwillig und darf von der Bank nicht zur Bedingung für eine Kreditvergabe gemacht werden.' },
      { question: 'Wie beeinflusst die Schufa den Kreditzins?', answer: 'Bei bonitätsabhängigen Zinsen erhalten Kreditnehmer mit hohem Schufa-Score (wenig Ausfallrisiko) den günstigsten Zinssatz, während schwächere Bonität zu höheren Zinssätzen führt.' },
    ],
    relatedSlugs: ['kreditrechner', 'autokreditrechner', 'sondertilgungsrechner', 'kreditvergleich-rechner'],
  },
  {
    id: 'autokreditrechner',
    slug: 'autokreditrechner',
    name: 'Autokreditrechner (Fahrzeugfinanzierung)',
    shortName: 'Autokredit berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Autokreditrechner – Monatsrate für Kfz-Kredit berechnen',
    metaDescription: 'Berechnen Sie die Monatsrate für Ihren Autokredit mit Kaufpreis, Anzahlung und Laufzeit. Inklusive Gesamtzinsen und Tilgungsverlauf.',
    h1: 'Autokreditrechner – Kfz-Ratenkredit berechnen',
    shortDescription: 'Berechnet die monatliche Kreditrate für Ihren Autokauf unter Berücksichtigung von Anzahlung und Zinsen nach deutschem Standard.',
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
      intro: 'Ein zweckgebundener Standard-Autokredit bietet im Vergleich zum freien Ratenkredit oft Zinsvorteile, da das finanzierte Fahrzeug der Bank als Kreditsicherheit dient.',
      details: 'Der Kredit finanziert den Kaufpreis abzüglich einer optionalen Anzahlung gleichmäßig über 24 bis 84 Monate ab. Am Ende der Vertragslaufzeit ist das Fahrzeug vollständig schuldenfrei in Ihrem Besitz.',
    },
    faqs: [
      { question: 'Was ist der Vorteil eines unabhängigen Autokredits gegenüber der Händlerfinanzierung?', answer: 'Mit einer Kreditzusage einer unabhängigen Bank treten Sie beim Händler als Barzahler auf und können oft 5 bis 15 Prozent Barzahler-Rabatt auf den Fahrzeugpreis aushandeln.' },
      { question: 'Muss die Zulassungsbescheinigung Teil II (Kfz-Brief) bei der Bank hinterlegt werden?', answer: 'Viele klassische Autobanken verlangen die Hinterlegung des Kfz-Briefs; moderne Direktbanken verzichten zunehmend darauf und verlangen lediglich die Kopie des Kaufvertrags.' },
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
    metaTitle: 'Tilgungsrechner – Tilgungsplan für Baufinanzierung erstellen',
    metaDescription: 'Erstellen Sie Ihren Tilgungsplan mit Anfangstilgung, Sollzinsbindung und Restschuld für Ihre Baufinanzierung oder Hypothek.',
    h1: 'Tilgungsrechner – Darlehenstilgung mit Zinsbindung planen',
    shortDescription: 'Erstellt einen vollständigen Tilgungsplan für Annuitätendarlehen mit Anfangstilgung, Zinsbindungsdauer und Restschuld.',
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
      intro: 'Die anfängliche Tilgung (üblich sind 1,5 bis 3 Prozent) bestimmt bei der Baufinanzierung maßgeblich die Gesamtlaufzeit und die verbleibende Restschuld nach Ende der Sollzinsbindung.',
      details: 'Monatliche Rate = Darlehensbetrag · (Sollzins + Anfangstilgung) / 1200. Bei niedrigem Zinsniveau dauert die Entschuldung bei geringer Tilgung unverhältnismäßig lange, weshalb Tilgungsraten von mindestens 2–3 % ratsam sind.',
    },
    faqs: [
      { question: 'Warum sollte die Tilgungsrate bei niedrigen Zinsen höher gewählt werden?', answer: 'Weil die Zinsersparnis pro Monat geringer ist und der Tilgungsanteil dadurch langsamer wächst. Bei 1 % Zins und 1 % Tilgung würde die Rückzahlung über 60 Jahre dauern.' },
      { question: 'Gibt es ein gesetzliches Sonderkündigungsrecht nach 10 Jahren?', answer: 'Ja, nach § 489 Abs. 1 Nr. 2 BGB kann jedes Festzinsdarlehen nach Ablauf von 10 Jahren nach vollständiger Auszahlung mit einer Frist von 6 Monaten ohne Vorfälligkeitsentschädigung gekündigt werden.' },
    ],
    relatedSlugs: ['vorfaelligkeitsentschaedigung-baufinanzierung-rechner', 'gesamtzinsbelastung-rechner', 'volltilger-darlehen-rechner', 'kreditrechner', 'sondertilgungsrechner', 'restschuld-rechner'],
  },
  {
    id: 'sondertilgungsrechner',
    slug: 'sondertilgungsrechner',
    name: 'Sondertilgungsrechner',
    shortName: 'Sondertilgung berechnen',
    category: 'kredit-schulden',
    subcategory: 'Sondertilgung',
    metaTitle: 'Sondertilgungsrechner – Zinsersparnis',
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
      intro: 'Sondertilgungen sind zusätzliche, außerplanmäßige Rückzahlungen, die direkt von der verbleibenden Restschuld abgezogen werden und die Zinslast massiv reduzieren.',
      details: 'Bereits eine einmalige Sondertilgung von 5.000 € zu Beginn eines Darlehens kann über eine 15-jährige Laufzeit Zinskosten im vierstelligen Bereich einsparen und die Entschuldung um viele Monate beschleunigen.',
    },
    faqs: [
      { question: 'Wie viel Prozent Sondertilgung sind bei Baufinanzierungen üblich?', answer: 'Die meisten Kreditinstitute gewähren heute 5 Prozent der ursprünglichen Kreditsumme pro Kalenderjahr als kostenfreie Sondertilgungsoption.' },
      { question: 'Verringert eine Sondertilgung die Monatsrate oder die Laufzeit?', answer: 'Bei klassischen Annuitätendarlehen bleibt die vertragliche Monatsrate konstant, wodurch sich die Restschuld am Ende der Zinsbindung drastisch reduziert und die Gesamtlaufzeit verkürzt.' },
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
    metaTitle: 'Restschuld Rechner – Restschuld nach Zinsbindung berechnen',
    metaDescription: 'Berechnen Sie die verbleibende Restschuld Ihres Kredits am Ende der Zinsbindungsfrist mit Tilgungsplan und Zinseszins.',
    h1: 'Restschuld Rechner – Verbleibende Darlehensschuld ermitteln',
    shortDescription: 'Ermittelt die verbleibende Darlehensrestschuld zum Ende der Zinsbindung für eine fundierte Anschlussfinanzierung.',
    searchKeywords: ['restschuld rechner baufinanzierung', 'restschuld rechner', 'restdarlehen berechnen', 'restschuld nach 10 jahren', 'anschlussfinanzierung rechner'],
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
      intro: 'Dieser Rechner prognostiziert die verbleibende Restschuld eines Kredits nach Ablauf einer festgelegten Zinsbindungsfrist (z. B. nach 10 oder 15 Jahren).',
      details: 'Die Restschuld ist der Betrag, für den zum Fristende eine Anschlussfinanzierung (Prolongation, Umschuldung oder Forward-Darlehen) abgeschlossen werden muss.',
    },
    faqs: [
      { question: 'Was geschieht mit der Restschuld am Ende der Zinsbindung?', answer: 'Die finanzierende Bank unterbreitet ein Angebot zur Verlängerung (Prolongation); alternativ kann der Betrag auf eine günstigere Fremdbank umgeschuldet oder bar getilgt werden.' },
      { question: 'Welches Risiko birgt eine hohe Restschuld?', answer: 'Das Zinsänderungsrisiko: Liegen die Marktzinsen am Ende der Zinsbindung höher als bei Abschluss, steigt die künftige Monatsbelastung für die Anschlussfinanzierung spürbar.' },
    ],
    relatedSlugs: ['tilgungsrechner', 'kreditrechner', 'sondertilgungsrechner', 'kredit-restschuld-stichtag-rechner'],
  },
];
