import { CalculatorDefinition } from '@/types/calculator';
import {
  calculateInstallmentLoan,
  calculateAnnuity,
  calculateSpecialRepayment,
  calculateRatenkredit,
  calculateTilgungsplan,
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
    relatedSlugs: ['zwischenfinanzierung-rechner', 'ratenkreditrechner', 'effektivzins-kredit-rechner', 'vorfaelligkeitsentschaedigung-rechner', 'gesamtzinsbelastung-rechner', 'modernisierungskredit-rechner', 'dispozins-rechner', 'maximaler-kredit-rechner'],
  },
  {
    id: 'ratenkreditrechner',
    slug: 'ratenkreditrechner',
    name: 'Ratenkreditrechner',
    shortName: 'Ratenkredit',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Ratenkreditrechner: Monatsrate, Laufzeit & Zinsen berechnen',
    metaDescription: 'Kostenloser Ratenkreditrechner: Monatsrate oder Laufzeit berechnen, mit Gesamtzinsen, Tilgungsplan, Schlussrate, Anzahlung und Sondertilgung.',
    h1: 'Ratenkreditrechner: Monatsrate, Laufzeit und Gesamtkosten berechnen',
    shortDescription: 'Berechnet die Monatsrate bei fester Laufzeit oder die Laufzeit bei fester Rate – mit Gesamtzinsen, Tilgungsplan und optional Anzahlung, Schlussrate und Sondertilgung.',
    searchKeywords: [
      'ratenkreditrechner',
      'kreditrechner',
      'ratenkredit rechner',
      'kreditrate berechnen',
      'kredit monatsrate berechnen',
      'kreditlaufzeit berechnen',
      'kreditlaufzeit rechner',
      'wie lange läuft mein kredit',
      'gesamtzinsen kredit berechnen',
      'wie viel zinsen zahle ich insgesamt',
      'ballonfinanzierung rechner',
      'kredit mit schlussrate berechnen',
      'autokredit rechner',
      'modernisierungskredit rechner',
      'konsumentenkredit rechner',
    ],
    inputs: [
      {
        id: 'mode',
        label: 'Was möchten Sie berechnen?',
        type: 'select',
        defaultValue: 'rate',
        options: [
          { value: 'rate', label: 'Monatsrate (bei fester Laufzeit)' },
          { value: 'laufzeit', label: 'Laufzeit (bei fester Monatsrate)' },
        ],
      },
      { id: 'loanAmount', label: 'Kreditbetrag', type: 'number', defaultValue: 10000, min: 100, step: 500, unit: '€', helpText: 'Bei einem Kauf mit Anzahlung tragen Sie den Kaufpreis ein und die Anzahlung unter „Weitere Optionen“.' },
      { id: 'annualInterest', label: 'Zinssatz p.a.', type: 'number', defaultValue: 4.9, min: 0, max: 30, step: 0.1, unit: '%', helpText: 'Beispielwert. Tragen Sie den Zinssatz aus Ihrem Kreditangebot ein.' },
      {
        id: 'rateType',
        label: 'Art des Zinssatzes',
        type: 'select',
        defaultValue: 'effective',
        options: [
          { value: 'effective', label: 'Effektiver Jahreszins (steht in jedem Angebot)' },
          { value: 'nominal', label: 'Gebundener Sollzins' },
        ],
      },
      { id: 'termMonths', label: 'Laufzeit', type: 'number', defaultValue: 48, min: 1, max: 600, step: 1, unit: 'Monate', helpText: '12 Monate = 1 Jahr, 60 Monate = 5 Jahre, 84 Monate = 7 Jahre.', dependsOn: { field: 'mode', value: 'rate' } },
      { id: 'monthlyPayment', label: 'Gewünschte Monatsrate', type: 'number', defaultValue: 250, min: 1, step: 10, unit: '€', helpText: 'Die Rate, die Sie sich jeden Monat leisten können.', dependsOn: { field: 'mode', value: 'laufzeit' } },
      { id: 'showExtras', label: 'Weitere Optionen: Anzahlung, Schlussrate, Sondertilgung', type: 'boolean', defaultValue: false },
      { id: 'downPayment', label: 'Anzahlung', type: 'number', defaultValue: 0, min: 0, step: 500, unit: '€', helpText: 'Wird vom Kreditbetrag abgezogen, z. B. Anzahlung oder Inzahlungnahme des Altwagens.', dependsOn: { field: 'showExtras', value: true } },
      { id: 'balloonPayment', label: 'Schlussrate (Ballonrate)', type: 'number', defaultValue: 0, min: 0, step: 500, unit: '€', helpText: 'Wird am Ende auf einmal fällig, z. B. bei einer Autofinanzierung mit Schlussrate. 0 € = der Kredit wird über die Raten voll getilgt.', dependsOn: { field: 'showExtras', value: true } },
      { id: 'sondertilgung', label: 'Sondertilgung pro Jahr', type: 'number', defaultValue: 0, min: 0, step: 500, unit: '€/Jahr', helpText: 'Wird jeweils nach 12 Monaten zusätzlich gezahlt und verkürzt die Laufzeit.', dependsOn: { field: 'showExtras', value: true } },
    ],
    calculate: calculateRatenkredit,
    formula: 'Rate = (K − S × (1 + i)^−n) × i ÷ (1 − (1 + i)^−n), ohne Schlussrate gilt S = 0',
    formulaExplanation: 'K ist der finanzierte Betrag (Kreditbetrag minus Anzahlung), S die Schlussrate, n die Laufzeit in Monaten und i der Monatszins. Beim effektiven Jahreszins gilt i = (1 + Jahreszins)^(1/12) − 1, beim Sollzins i = Sollzins ÷ 12. Bei 0 % Zins ist die Rate (K − S) ÷ n. Im Modus Laufzeit tilgt der Rechner Monat für Monat mit Ihrer Wunschrate, bis die Restschuld getilgt ist; die letzte Rate ist dann meist kleiner. Gesamtzinsen = Summe aller Zahlungen − finanzierter Betrag.',
    workedExample: {
      title: 'Beispiel: 10.000 € über 48 Monate bei 4,9 % effektivem Jahreszins',
      description: 'Monatszins: 1,049^(1/12) − 1 = 0,3994 %. Die Annuitätenformel ergibt eine Rate von 229,36 €. 48 Raten summieren sich auf 11.009,17 €, davon sind 1.009,17 € Zinsen (10,1 % des Kreditbetrags).',
      inputs: { mode: 'rate', loanAmount: 10000, annualInterest: 4.9, rateType: 'effective', termMonths: 48 },
      resultSummary: '229,36 € im Monat, 1.009,17 € Zinsen',
    },
    workedExamples: [
      {
        title: 'Monatsrate: 10.000 € über 48 Monate bei 4,9 % effektiv',
        description: 'Rate 229,36 €, Gesamtzinsen 1.009,17 €, alle Zahlungen 11.009,17 €. Über 84 statt 48 Monate sinkt die Rate auf 140,37 €, die Zinsen steigen aber auf 1.791,06 €.',
        inputs: { mode: 'rate', loanAmount: 10000, annualInterest: 4.9, rateType: 'effective', termMonths: 48 },
        resultSummary: '229,36 € im Monat',
      },
      {
        title: 'Laufzeit: 30.000 € bei 4,9 % Sollzins und 450 € Rate',
        description: 'Mit 450 € im Monat ist der Kredit nach 78 Raten getilgt, also nach 6 Jahren und 6 Monaten. Die letzte Rate beträgt nur noch 439,86 €. Die Zinsen summieren sich auf 5.089,86 €.',
        inputs: { mode: 'laufzeit', loanAmount: 30000, annualInterest: 4.9, rateType: 'nominal', monthlyPayment: 450 },
        resultSummary: '6 Jahre und 6 Monate (78 Raten)',
      },
      {
        title: 'Schlussrate: Auto für 28.000 € mit 5.000 € Anzahlung und 8.000 € Schlussrate',
        description: 'Finanziert werden 23.000 € über 48 Monate bei 5,5 % effektivem Jahreszins. Mit 8.000 € Schlussrate beträgt die Rate 383,71 € statt 533,50 € ohne Schlussrate. Dafür fallen 810,07 € mehr Zinsen an (3.417,87 € statt 2.607,80 €), und nach 48 Monaten sind 8.000 € auf einmal fällig.',
        inputs: { mode: 'rate', loanAmount: 28000, annualInterest: 5.5, rateType: 'effective', termMonths: 48, showExtras: true, downPayment: 5000, balloonPayment: 8000, sondertilgung: 0 },
        resultSummary: '383,71 € im Monat plus 8.000 € Schlussrate',
      },
      {
        title: 'Gesamtzinsen: 100.000 € über 10 Jahre bei 4 % Sollzins',
        description: 'Die Rate beträgt 1.012,45 €. Über 120 Monate zahlen Sie 121.494,17 € zurück, davon 21.494,17 € Zinsen. Das sind 21,5 % des Kreditbetrags.',
        inputs: { mode: 'rate', loanAmount: 100000, annualInterest: 4, rateType: 'nominal', termMonths: 120 },
        resultSummary: '1.012,45 € im Monat, 21.494,17 € Zinsen insgesamt',
      },
    ],
    content: {
      intro: 'Mit dem Ratenkreditrechner sehen Sie, was ein Kredit tatsächlich kostet. Sie berechnen entweder die Monatsrate bei fester Laufzeit oder die Laufzeit bei einer Rate, die in Ihr Budget passt. In beiden Fällen zeigt der Rechner die Gesamtzinsen, die Summe aller Zahlungen und einen Tilgungsplan nach Jahren. Für Autokauf, Möbel oder Modernisierung können Sie zusätzlich eine Anzahlung, eine Schlussrate oder jährliche Sondertilgungen eintragen.',
      sections: [
        {
          title: 'Monatsrate oder Laufzeit: die zwei Rechenwege',
          content: '**Monatsrate berechnen:** Sie geben Kreditbetrag, Zinssatz und Laufzeit in Monaten ein. Der Rechner ermittelt die gleichbleibende Rate nach der Annuitätenformel. 10.000 € zu 4,9 % effektivem Jahreszins über 48 Monate kosten 229,36 € im Monat; die Zinsen summieren sich auf 1.009,17 €.\n\n**Laufzeit berechnen:** Sie geben die Rate vor, die Sie sich leisten können. Der Rechner verrechnet jeden Monat Zinsen und Tilgung und zählt die Raten, bis die Restschuld getilgt ist. Die letzte Rate ist meist kleiner. Ist Ihre Rate nicht höher als die Zinsen des ersten Monats, sinkt die Schuld nie – dann erhalten Sie einen Hinweis statt eines Ergebnisses.\n\nIn beiden Modi sehen Sie die **Gesamtzinsen**, die **Gesamtkosten** (alle Raten plus Schlussrate) und den Zinsanteil im Verhältnis zum Kreditbetrag. Die Tabelle zeigt pro Jahr, wie viel Sie getilgt und an Zinsen gezahlt haben und welche Restschuld bleibt.',
        },
        {
          title: 'Effektiver Jahreszins oder Sollzins?',
          content: 'Kreditangebote nennen zwei Zinssätze. Der **gebundene Sollzins** ist der vertragliche Zins. Der **effektive Jahreszins** enthält zusätzlich die Wirkung der monatlichen Zinsverrechnung und die Kosten, die der Kreditgeber verlangt. Er ist deshalb der richtige Wert, um Angebote zu vergleichen.\n\nWählen Sie im Rechner aus, welchen Wert Sie eintragen. Beim effektiven Jahreszins rechnet der Rechner den Monatszins so um, dass zwölf Monate genau den Jahreszins ergeben. Beim Sollzins teilt er durch 12. Für 10.000 € über 48 Monate bei 4,9 % ergibt das 229,36 € (effektiv) oder 229,84 € (Sollzins). Der Rechner behandelt den eingegebenen Wert als reinen Zins. Verbindlich ist der Tilgungsplan Ihrer Bank. Zwei Angebote vergleichen Sie auch mit dem [Effektivzins-Rechner](/rechner/effektivzins-kredit-rechner/).',
        },
        {
          title: 'Anzahlung, Schlussrate und Sondertilgung',
          content: 'Unter „Weitere Optionen“ finden Sie drei Eingaben, die vor allem bei Autofinanzierungen vorkommen.\n\n**Anzahlung:** Sie wird vom Kreditbetrag abgezogen. Bei 28.000 € Kaufpreis und 5.000 € Anzahlung finanzieren Sie 23.000 €.\n\n**Schlussrate (Ballonfinanzierung):** Ein Teil des Kredits wird erst am Ende auf einmal fällig. Das senkt die Monatsrate, kostet aber mehr Zinsen, weil die Schlussrate über die ganze Laufzeit verzinst wird. Im Beispiel mit 8.000 € Schlussrate, 48 Monaten und 5,5 % effektiv sinkt die Rate von 533,50 € auf 383,71 €; die Zinsen steigen um 810,07 €. Planen Sie vorher, wie Sie die Schlussrate bezahlen: aus Ersparnissen, über den Verkauf des Autos oder mit einer Anschlussfinanzierung.\n\n**Sondertilgung:** Der Rechner zahlt den Betrag jeweils nach 12 Monaten zusätzlich und zeigt, wie viel früher Sie schuldenfrei sind. 15.000 € zu 5,5 % Sollzins über 60 Monate sind mit 1.000 € Sondertilgung pro Jahr nach 48 Monaten getilgt; Sie sparen 451,63 € Zinsen. Bei Verbraucherdarlehen dürfen Sie nach § 500 Abs. 2 BGB jederzeit ganz oder teilweise vorzeitig zurückzahlen. Die Bank kann dafür eine Vorfälligkeitsentschädigung verlangen, die § 502 BGB auf höchstens 1 % des vorzeitig gezahlten Betrags begrenzt (0,5 %, wenn die Restlaufzeit höchstens ein Jahr beträgt). Diese Entschädigung ist im Ergebnis nicht enthalten. Für Baudarlehen nutzen Sie den [Sondertilgungsrechner](/rechner/sondertilgungsrechner/).',
        },
        {
          title: 'Was Sie mit dem Ergebnis anfangen',
          content: 'Vergleichen Sie zuerst die **Gesamtzinsen** verschiedener Laufzeiten. Eine längere Laufzeit senkt die Rate, macht den Kredit aber teurer: 10.000 € zu 4,9 % effektiv kosten über 48 Monate 1.009,17 € Zinsen, über 84 Monate 1.791,06 €. Wählen Sie die kürzeste Laufzeit, deren Rate auch in einem Monat mit unerwarteten Ausgaben noch passt. Die Laufzeit sollte nicht länger sein, als Sie die finanzierte Sache nutzen.\n\nDer Modus **Laufzeit** hilft bei der Frage, ob sich eine höhere Rate lohnt: Rechnen Sie dieselbe Kreditsumme mit 50 € mehr Rate und vergleichen Sie Laufzeit und Zinsen. Wie viel Kredit Ihr Einkommen überhaupt trägt, zeigt der [Rechner für den maximalen Kredit](/rechner/maximaler-kredit-rechner/).\n\nFür eine **Modernisierung** (Heizung, Fenster, Dämmung) bieten Banken Modernisierungs- oder Wohnkredite an. Sie funktionieren wie ein Ratenkredit, oft mit Verwendungsnachweis. Prüfen Sie vorher, ob es für Ihr Vorhaben Förderkredite oder Zuschüsse der KfW oder des BAFA gibt. Für einen Hauskauf mit Zinsbindung und Restschuld ist der [Tilgungsrechner](/rechner/tilgungsrechner/) das passende Werkzeug.',
        },
      ],
    },
    faqs: [
      { question: 'Wie berechne ich die monatliche Rate für einen Kredit?', answer: 'Die Rate ergibt sich aus der Annuitätenformel: Kreditbetrag × Monatszins ÷ (1 − (1 + Monatszins)^−Laufzeit). Für 10.000 € über 48 Monate bei 4,9 % effektivem Jahreszins sind das 229,36 € im Monat. Der Rechner erledigt das für Sie und zeigt zusätzlich Gesamtzinsen und Tilgungsplan.' },
      { question: 'Wie lange muss ich meinen Kredit abbezahlen?', answer: 'Das hängt von Kreditbetrag, Zins und Monatsrate ab. Wählen Sie im Rechner „Laufzeit“ und tragen Sie Ihre Wunschrate ein. Beispiel: 30.000 € bei 4,9 % Sollzins und 450 € Rate sind nach 78 Raten getilgt, also nach 6 Jahren und 6 Monaten.' },
      { question: 'Wie viel Zinsen zahle ich insgesamt für einen Kredit?', answer: 'Gesamtzinsen = Summe aller Zahlungen minus Kreditbetrag. Bei 100.000 € über 10 Jahre zu 4 % Sollzins beträgt die Rate 1.012,45 €; zusammen zahlen Sie 121.494,17 € zurück, davon 21.494,17 € Zinsen. Der Rechner zeigt die Gesamtzinsen in jedem Modus.' },
      { question: 'Lohnt sich eine Finanzierung mit Schlussrate?', answer: 'Eine Schlussrate senkt die Monatsrate, erhöht aber die Gesamtzinsen, weil der Schlussbetrag bis zum Ende verzinst wird. Bei 23.000 € Kredit, 48 Monaten und 5,5 % effektiv kosten 8.000 € Schlussrate 810,07 € zusätzliche Zinsen. Sinnvoll ist das nur, wenn Sie die Schlussrate sicher bezahlen können, etwa aus Ersparnissen oder dem Verkauf des Autos.' },
      { question: 'Kann ich einen Ratenkredit vorzeitig zurückzahlen?', answer: 'Ja. Nach § 500 Abs. 2 BGB dürfen Sie ein Verbraucherdarlehen jederzeit ganz oder teilweise vorzeitig zurückzahlen. Die Bank darf eine Vorfälligkeitsentschädigung verlangen, höchstens 1 % des vorzeitig gezahlten Betrags oder 0,5 %, wenn die Restlaufzeit höchstens ein Jahr beträgt (§ 502 BGB). Wie viel Zinsen eine jährliche Sondertilgung spart, zeigt der Rechner unter „Weitere Optionen“.' },
      { question: 'Was ist der Unterschied zwischen effektivem Jahreszins und Sollzins?', answer: 'Der Sollzins ist der vertraglich vereinbarte Zins. Der effektive Jahreszins berücksichtigt zusätzlich die monatliche Zinsverrechnung und die Kosten des Kredits und ist deshalb etwas höher. Für den Vergleich von Angeboten ist der effektive Jahreszins maßgeblich.' },
    ],
    relatedSlugs: ['sondertilgungsrechner', 'effektivzins-kredit-rechner', 'maximaler-kredit-rechner', 'dispozins-rechner', 'tilgungsrechner', 'leasingfaktor-rechner', 'auto-gesamtkosten-rechner'],
    trustMeta: {
      methodology: 'Annuitätenrechnung mit monatlicher Zinsverrechnung; Laufzeit, Sondertilgung und Schlussrate per Monatssimulation.',
      assumptions: [
        'Fester Zinssatz über die gesamte Laufzeit',
        'Raten am Monatsende, Sondertilgung jeweils nach 12 Monaten',
        'Der eingegebene Zinssatz wird als reiner Zins behandelt; Gebühren und Versicherungen sind nicht enthalten',
      ],
      limitations: [
        'Die Bank rundet Raten und rechnet Zinsen taggenau; ihr Tilgungsplan kann um wenige Cent bis Euro abweichen.',
        'Eine Vorfälligkeitsentschädigung bei vorzeitiger Rückzahlung ist nicht eingerechnet.',
      ],
      lastReviewed: '2026-11-05',
    },
  },
  {
    id: 'autokreditrechner',
    slug: 'autokreditrechner',
    name: 'Autokreditrechner (Fahrzeugfinanzierung)',
    shortName: 'Autokredit berechnen',
    category: 'kredit-schulden',
    subcategory: 'Ratenkredit',
    metaTitle: 'Autokreditrechner: Kfz-Monatsrate & Autofinanzierung berechnen',
    metaDescription: 'Berechnen Sie die Monatsrate für Ihren klassischen Kfz-Ratenkredit mit Kaufpreis, Anzahlung, Laufzeit und Effektivzins. Voll tilgend ohne teure Schlussrate.',
    h1: 'Autokreditrechner – Monatliche Rate für Ihren Autokauf berechnen',
    shortDescription: 'Berechnet die monatliche Kreditrate für Ihren Autokauf unter Berücksichtigung von Anzahlung und Zinsen nach deutschem Standard.',
    searchKeywords: ['autokreditrechner', 'autofinanzierung rechner', 'autokredit monatsrate', 'kfz kredit berechnen', 'autokredit ohne schlussrate'],
    inputs: [
      { id: 'carPrice', label: 'Fahrzeugkaufpreis', type: 'number', defaultValue: 25000, min: 500, step: 500, unit: '€' },
      { id: 'downPayment', label: 'Anzahlung / Inzahlungnahme Altwagen', type: 'number', defaultValue: 5000, min: 0, step: 500, unit: '€', helpText: 'Anzahlung oder Eintauschwert des Altwagens (0 € bei reiner Vollfinanzierung).' },
      { id: 'annualInterest', label: 'Effektiver Jahreszins', type: 'number', defaultValue: 5.2, min: 0, max: 25, step: 0.1, unit: '%' },
      { id: 'termMonths', label: 'Finanzierungslaufzeit', type: 'number', defaultValue: 48, min: 1, max: 120, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      if (inputs.carPrice === undefined || inputs.carPrice === null || inputs.carPrice === '') {
        return {
          primary: { id: 'carRate', label: 'Monatliche Autorate', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie den Fahrzeugkaufpreis ein.',
        };
      }
      const price = parseFloat(inputs.carPrice);
      if (isNaN(price) || price <= 0) {
        return {
          primary: { id: 'carRate', label: 'Monatliche Autorate', value: 0, formattedValue: '-' },
          error: 'Bitte geben Sie einen gültigen Fahrzeugkaufpreis über 0 € ein.',
        };
      }

      const rawDown = inputs.downPayment !== undefined && inputs.downPayment !== null && inputs.downPayment !== ''
        ? parseFloat(inputs.downPayment)
        : 0;
      if (isNaN(rawDown) || rawDown < 0) {
        return {
          primary: { id: 'carRate', label: 'Monatliche Autorate', value: 0, formattedValue: '-' },
          error: 'Die Anzahlung darf nicht negativ sein.',
        };
      }

      if (rawDown > price) {
        return {
          primary: { id: 'carRate', label: 'Monatliche Autorate', value: 0, formattedValue: '-' },
          error: 'Die Anzahlung darf den Fahrzeugkaufpreis nicht übersteigen.',
        };
      }

      if (rawDown === price) {
        return {
          primary: { id: 'carRate', label: 'Monatliche Autorate', value: 0, formattedValue: '0,00 €', highlight: true },
          secondary: [
            { id: 'loanNeeded', label: 'Nettodarlehen (nach Anzahlung)', value: 0, formattedValue: '0,00 €' },
            { id: 'totalInterest', label: 'Gesamtzinskosten', value: 0, formattedValue: '0,00 €' },
            { id: 'totalPayment', label: 'Gesamtbetrag Rückzahlung', value: 0, formattedValue: '0,00 €' },
          ],
          summaryText: 'Keine Finanzierung erforderlich. Der Fahrzeugkaufpreis ist durch Ihre Anzahlung vollständig gedeckt.',
        };
      }

      const loan = price - rawDown;
      const res = calculateInstallmentLoan({
        loanAmount: loan,
        annualInterest: inputs.annualInterest,
        termMonths: inputs.termMonths,
        isEffectiveRate: true,
      });

      if (res.error) {
        return res;
      }

      return {
        ...res,
        primary: { id: 'carRate', label: 'Monatliche Autorate', value: res.primary.value, formattedValue: res.primary.formattedValue, highlight: true },
        secondary: [
          { id: 'loanNeeded', label: 'Nettodarlehen (nach Anzahlung)', value: loan, formattedValue: formatCurrency(loan) },
          ...(res.secondary || []),
        ],
        summaryText: `Für Ihr Fahrzeug (${formatCurrency(price)}) nach Abzug von ${formatCurrency(rawDown)} Anzahlung beträgt das Nettodarlehen ${formatCurrency(loan)}. Bei ${inputs.termMonths} Monaten Laufzeit und ${inputs.annualInterest}% effektivem Jahreszins beträgt die monatliche Rate ${res.primary.formattedValue} (Gesamtbetrag: ${res.secondary?.find(s => s.id === 'totalPayment')?.formattedValue ?? ''}). Hinweis: Dies ist eine vereinfachte Orientierungsrechnung auf Basis des Effektivzinssatzes ohne individuelle Bonitätszuschläge oder Bankgebühren.`,
      };
    },
    formula: 'Monatsrate = Nettodarlehen × r / (1 - (1 + r)^(-Laufzeit)) mit r = (1 + Effektiver Jahreszins)^(1/12) - 1',
    formulaExplanation: 'Ratenkreditberechnung auf den tatsächlich zu finanzierenden Differenzbetrag (Kaufpreis minus Anzahlung). Der monatliche Zinsfaktor r wird finanzmathematisch aus dem effektiven Jahreszins abgeleitet. Bei 0 % Zinsen entspricht die Rate exakt dem Nettodarlehen geteilt durch die Monate. Vereinfachtes Modell ohne individuelle Bearbeitungs- oder Nebengebühren.',
    workedExample: {
      title: 'Beispiel: 25.000 € Auto mit 5.000 € Anzahlung über 48 Monate bei 5,2 %',
      description: 'Fahrzeugkaufpreis 25.000 € abzüglich 5.000 € Anzahlung ergibt ein Nettodarlehen von 20.000 €. Bei einem effektiven Jahreszins von 5,2 % (Monatszins r ≈ 0,4236 %) und 48 Monaten Laufzeit beträgt die feste Monatsrate ca. 461,31 € (Gesamtzinsen: ca. 2.142,70 €; Gesamtrückzahlung: ca. 22.142,70 €).',
      inputs: { carPrice: 25000, downPayment: 5000, annualInterest: 5.2, termMonths: 48 },
      resultSummary: '461,31 € monatlich',
    },
    content: {
      intro: 'Ein zweckgebundener Autokredit (Fahrzeugfinanzierung als klassischer Ratenkredit) ermöglicht es Ihnen, einen Neu- oder Gebrauchtwagen planbar und in gleichbleibenden Monatsraten ohne unkalkulierbare Restschuld abzubezahlen.',
      details: 'Im Gegensatz zu einer Ballonfinanzierung ist dieser Autokredit volltilgend: Nach Ablauf der gewählten Vertragslaufzeit (z. B. 48 oder 60 Monate) gehört das Auto zu 100 Prozent Ihnen, ohne dass eine hohe Schlussrate fällig wird. Suchen Sie gezielt nach einer Finanzierung mit extra kleinen Monatsraten und hoher Schlussrate? Nutzen Sie unseren [Ballonfinanzierung-Rechner](/rechner/ballonfinanzierung-rechner/). Möchten Sie Leasing mit Kauf vergleichen, hilft Ihnen der [Leasingfaktor-Rechner](/rechner/leasingfaktor-rechner/). Für die gesamten Unterhaltskosten inklusive Sprit und Steuer nutzen Sie unseren [Auto-Gesamtkosten-Rechner](/rechner/auto-gesamtkosten-rechner/) und den [KFZ-Steuer-Rechner](/rechner/kfz-steuer-rechner/).',
    },
    faqs: [
      { question: 'Worin liegt der Unterschied zwischen klassischem Autokredit und Ballonfinanzierung?', answer: 'Beim klassischen Autokredit zahlen Sie über die gesamte Laufzeit gleichbleibende Raten, bis der Wagen komplett abbezahlt ist. Bei der Ballonfinanzierung sind die Monatsraten zwar niedriger, dafür müssen Sie am Ende eine vier- bis fünfstellige Schlussrate (den Ballon) auf einen Schlag begleichen oder teuer weiterfinanzieren.' },
      { question: 'Wie viel Barzahler-Rabatt kann man mit einer Kreditzusage aushandeln?', answer: 'Wenn Sie die Kreditzusage einer unabhängigen Bank bereits in der Tasche haben, treten Sie beim Autohändler als Barzahler auf. Dadurch lassen sich oft 5 bis 15 Prozent Preisnachlass oder kostenlose Extras wie Winterräder und Garantieverlängerungen aushandeln.' },
      { question: 'Kann ich einen Autokredit vorzeitig ablösen oder Sondertilgungen leisten?', answer: 'Ja. Nach § 500 Abs. 2 BGB haben Sie bei Verbraucherdarlehen jederzeit das gesetzliche Recht, den Kredit ganz oder teilweise vorzeitig zurückzuzahlen. Die Bank darf hierfür maximal eine gesetzlich gedeckelte Vorfälligkeitsentschädigung von 0,5 % bis 1 % der Restsumme verlangen.' },
      { question: 'Muss der Kfz-Brief (Zulassungsbescheinigung Teil II) bei der Bank hinterlegt werden?', answer: 'Viele Filialbanken und Herstellerbanken verlangen die Hinterlegung des Kfz-Briefs als Sicherheit. Unabhängige Direktbanken verzichten heute jedoch häufig darauf und begnügen sich mit der Vorlage einer Kopie des Kaufvertrags.' },
    ],
    relatedSlugs: ['ballonfinanzierung-rechner', 'kreditrechner', 'ratenkreditrechner', 'leasingfaktor-rechner', 'auto-gesamtkosten-rechner', 'auto-wertverlust-rechner'],
    trustMeta: {
      legalBasis: 'Bürgerliches Gesetzbuch (§ 491 ff. BGB – Verbraucherdarlehensrecht) & PAngV',
      sourceName: 'Deutsche Bundesbank / Verbraucherzentrale Bundesverband',
      sourceUrl: 'https://www.verbraucherzentrale.de/wissen/geld-versicherungen/kredite-schulden-insolvenz/autokauf-darauf-sollten-sie-bei-einem-autokredit-achten-13840',
      lastReviewed: '2026-01-15',
    },
  },
  {
    id: 'tilgungsrechner',
    slug: 'tilgungsrechner',
    name: 'Tilgungsrechner mit Zinsbindung',
    shortName: 'Tilgungsrechner',
    category: 'kredit-schulden',
    subcategory: 'Tilgung & Annuität',
    metaTitle: 'Tilgungsrechner: Tilgungsplan, Rate & Restschuld berechnen',
    metaDescription: 'Kostenloser Tilgungsrechner für die Baufinanzierung: Monatsrate, Restschuld nach der Zinsbindung, Tilgungsplan und Volltilger-Rate auf einen Blick.',
    h1: 'Tilgungsrechner: Rate, Restschuld und Tilgungsplan für Ihre Baufinanzierung',
    shortDescription: 'Berechnet Monatsrate, Tilgungsplan und Restschuld nach der Zinsbindung – mit fester Anfangstilgung oder als Volltilger, auf Wunsch direkt aus Kaufpreis, Nebenkosten und Eigenkapital.',
    searchKeywords: [
      'tilgungsrechner',
      'tilgungsplan erstellen',
      'tilgungsplan rechner',
      'baufinanzierung rechner',
      'baufinanzierungsrechner',
      'restschuld berechnen',
      'restschuld rechner',
      'restschuld nach 10 jahren',
      'volltilger rechner',
      'volltilgerdarlehen rechner',
      'kredit ohne eigenkapital rechner',
      '110 prozent finanzierung rechner',
      'anfängliche tilgung rechner',
      'annuitätendarlehen rechner',
    ],
    inputs: [
      {
        id: 'tilgungMode',
        label: 'Wie soll getilgt werden?',
        type: 'select',
        defaultValue: 'anfangstilgung',
        options: [
          { value: 'anfangstilgung', label: 'Mit fester anfänglicher Tilgung' },
          { value: 'volltilger', label: 'Vollständig bis Ende der Zinsbindung (Volltilger)' },
        ],
      },
      { id: 'useFinancing', label: 'Darlehensbetrag aus Kaufpreis und Eigenkapital berechnen', type: 'boolean', defaultValue: false },
      { id: 'loanAmount', label: 'Darlehensbetrag', type: 'number', defaultValue: 300000, min: 1000, step: 10000, unit: '€', dependsOn: { field: 'useFinancing', value: false } },
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie', type: 'number', defaultValue: 400000, min: 1000, step: 10000, unit: '€', dependsOn: { field: 'useFinancing', value: true } },
      { id: 'sideCostsPct', label: 'Kaufnebenkosten', type: 'number', defaultValue: 10, min: 0, max: 30, step: 0.5, unit: '%', helpText: 'Grunderwerbsteuer (je nach Bundesland 3,5 bis 6,5 %), Notar und Grundbuch sowie ggf. Makler. 10 % ist ein Beispielwert.', dependsOn: { field: 'useFinancing', value: true } },
      { id: 'equity', label: 'Eigenkapital', type: 'number', defaultValue: 80000, min: 0, step: 5000, unit: '€', helpText: '0 € für eine Finanzierung ohne Eigenkapital (Kaufpreis plus Nebenkosten werden finanziert).', dependsOn: { field: 'useFinancing', value: true } },
      { id: 'annualInterest', label: 'Sollzins p.a.', type: 'number', defaultValue: 3.6, min: 0, max: 20, step: 0.05, unit: '%', helpText: 'Beispielwert. Tragen Sie den gebundenen Sollzins aus Ihrem Angebot ein.' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung p.a.', type: 'number', defaultValue: 2.0, min: 0.1, max: 20.0, step: 0.25, unit: '%', dependsOn: { field: 'tilgungMode', value: 'anfangstilgung' } },
      { id: 'fixedYears', label: 'Zinsbindung', type: 'number', defaultValue: 10, min: 1, max: 40, step: 1, unit: 'Jahre', helpText: 'Beim Volltilger ist das zugleich die Zeit bis zur Schuldenfreiheit.' },
    ],
    calculate: calculateTilgungsplan,
    formula: 'Monatsrate = Darlehen × (Sollzins + anfängliche Tilgung) ÷ 12; Volltilger: Rate = K × i ÷ (1 − (1 + i)^−n)',
    formulaExplanation: 'Bei fester anfänglicher Tilgung bleibt die Rate während der Zinsbindung gleich. Jeden Monat fallen Zinsen auf die aktuelle Restschuld an (Monatszins i = Sollzins ÷ 12); der Rest der Rate tilgt. Die Restschuld nach der Zinsbindung ergibt sich aus dieser Monatsrechnung. Beim Volltilger wählt der Rechner die Rate so, dass die Restschuld nach n = Zinsbindung × 12 Monaten genau 0 € ist. Mit Kaufpreis-Option gilt: Darlehen = Kaufpreis + Kaufnebenkosten − Eigenkapital.',
    workedExample: {
      title: 'Beispiel: 300.000 € bei 3,6 % Sollzins, 2 % Tilgung und 10 Jahren Zinsbindung',
      description: 'Jahresrate: 300.000 € × 5,6 % = 16.800 €, also 1.400 € im Monat. In 10 Jahren tilgen Sie 72.092,86 € und zahlen 95.907,14 € Zinsen. Die Restschuld beträgt 227.907,14 €.',
      inputs: { tilgungMode: 'anfangstilgung', useFinancing: false, loanAmount: 300000, annualInterest: 3.6, initialRepayment: 2.0, fixedYears: 10 },
      resultSummary: '1.400,00 € im Monat, 227.907,14 € Restschuld',
    },
    workedExamples: [
      {
        title: 'Restschuld: 300.000 € mit 2 % Anfangstilgung, 10 Jahre Zinsbindung',
        description: 'Rate 1.400 €, Restschuld nach 10 Jahren 227.907,14 €. Bei gleichem Zins wären Sie nach 28 Jahren und 8 Monaten schuldenfrei. Mit 3 % Anfangstilgung steigt die Rate auf 1.650 €, die Restschuld sinkt auf 191.860,71 € und die Gesamtlaufzeit auf 22 Jahre.',
        inputs: { tilgungMode: 'anfangstilgung', useFinancing: false, loanAmount: 300000, annualInterest: 3.6, initialRepayment: 2.0, fixedYears: 10 },
        resultSummary: '1.400,00 € im Monat, 227.907,14 € Restschuld nach 10 Jahren',
      },
      {
        title: 'Volltilger: 200.000 € bei 3,5 % in 20 Jahren komplett tilgen',
        description: 'Die Rate beträgt 1.159,92 € im Monat. Das entspricht einer anfänglichen Tilgung von 3,46 %. Nach 20 Jahren ist die Restschuld 0 €; die Zinsen summieren sich auf 78.380,66 €.',
        inputs: { tilgungMode: 'volltilger', useFinancing: false, loanAmount: 200000, annualInterest: 3.5, fixedYears: 20 },
        resultSummary: '1.159,92 € im Monat, 0 € Restschuld',
      },
      {
        title: 'Kaufpreis: 400.000 € Immobilie, 10 % Nebenkosten, 80.000 € Eigenkapital',
        description: 'Darlehen: 400.000 € + 40.000 € − 80.000 € = 360.000 € (90 % des Kaufpreises). Bei 3,6 % Sollzins und 2 % Tilgung beträgt die Rate 1.680 €; nach 10 Jahren bleiben 273.488,57 € Restschuld.',
        inputs: { tilgungMode: 'anfangstilgung', useFinancing: true, purchasePrice: 400000, sideCostsPct: 10, equity: 80000, annualInterest: 3.6, initialRepayment: 2.0, fixedYears: 10 },
        resultSummary: '360.000 € Darlehen, 1.680,00 € im Monat',
      },
    ],
    content: {
      intro: 'Der Tilgungsrechner zeigt für ein Annuitätendarlehen, wie hoch die Monatsrate ist, wie viel Sie bis zum Ende der Zinsbindung tilgen und welche Restschuld dann bleibt. Sie können die anfängliche Tilgung vorgeben oder die Rate so berechnen lassen, dass das Darlehen am Ende der Zinsbindung vollständig getilgt ist (Volltilger). Kennen Sie den Darlehensbetrag noch nicht, ermittelt der Rechner ihn aus Kaufpreis, Kaufnebenkosten und Eigenkapital.',
      sections: [
        {
          title: 'So setzt sich die Rate zusammen',
          content: 'Bei einem Annuitätendarlehen ist die Jahresrate Darlehen × (Sollzins + anfängliche Tilgung). Bei 300.000 €, 3,6 % Sollzins und 2 % Tilgung sind das 16.800 € im Jahr oder 1.400 € im Monat. Die Rate bleibt während der Zinsbindung gleich.\n\nJeden Monat berechnet die Bank Zinsen auf die aktuelle Restschuld. Im ersten Monat sind das 300.000 € × 3,6 % ÷ 12 = 900 €; die übrigen 500 € tilgen. Weil die Restschuld sinkt, wird der Zinsanteil jeden Monat kleiner und der Tilgungsanteil größer. Der Tilgungsplan unter dem Ergebnis zeigt das Jahr für Jahr: Zinsen, Tilgung und Restschuld am Jahresende.',
        },
        {
          title: 'Restschuld und Anschlussfinanzierung',
          content: 'Die Restschuld am Ende der Zinsbindung müssen Sie neu finanzieren: bei Ihrer Bank (Prolongation), bei einer anderen Bank (Umschuldung) oder vorab mit einem Forward-Darlehen. Welcher Zins dann gilt, ist heute offen. Rechnen Sie deshalb mit einem höheren Zins nach: Bei 227.907,14 € Restschuld kostet 1 Prozentpunkt mehr Zins rund 190 € im Monat zusätzlich.\n\nDie Angabe „Gesamtlaufzeit bis schuldenfrei“ unterstellt, dass der Zins nach der Zinsbindung gleich bleibt. Sie ist eine Orientierung, keine Prognose. Nach § 489 Abs. 1 Nr. 2 BGB können Sie ein Festzinsdarlehen zehn Jahre nach dem vollständigen Empfang mit sechs Monaten Frist kündigen, auch wenn die Zinsbindung länger läuft. Den Aufschlag für eine frühe Zinssicherung berechnen Sie mit dem [Forward-Darlehen-Rechner](/rechner/forward-darlehen-rechner/).',
        },
        {
          title: 'Volltilger: schuldenfrei am Ende der Zinsbindung',
          content: 'Im Modus Volltilger berechnet der Rechner die Rate, mit der das Darlehen genau zum Ende der Zinsbindung getilgt ist. Für 200.000 € zu 3,5 % über 20 Jahre sind das 1.159,92 € im Monat, also 3,46 % anfängliche Tilgung. Es bleibt keine Restschuld und damit kein Zinsrisiko bei einer Anschlussfinanzierung. Der Preis ist eine höhere Monatsrate. Manche Banken bieten für Volltilgerdarlehen einen günstigeren Zins an; fragen Sie danach und tragen Sie den angebotenen Zins ein.',
        },
        {
          title: 'Darlehensbetrag aus Kaufpreis und Eigenkapital',
          content: 'Aktivieren Sie „Darlehensbetrag aus Kaufpreis und Eigenkapital berechnen“. Der Rechner rechnet dann: Darlehen = Kaufpreis + Kaufnebenkosten − Eigenkapital. Zu den Nebenkosten zählen die Grunderwerbsteuer (je nach Bundesland 3,5 bis 6,5 %), Notar- und Grundbuchkosten und gegebenenfalls die Maklerprovision. Die genauen Beträge ermitteln Sie mit dem [Notar- und Grundbuchkosten-Rechner](/rechner/notar-grundbuch-kosten-rechner/).\n\nBeispiel: 400.000 € Kaufpreis, 10 % Nebenkosten und 80.000 € Eigenkapital ergeben 360.000 € Darlehen, das sind 90 % des Kaufpreises. Ohne Eigenkapital wären es 440.000 € oder 110 % des Kaufpreises. Für solche Vollfinanzierungen verlangen Banken in der Regel einen Zinsaufschlag. Der Rechner weist darauf hin; tragen Sie den Zins aus Ihrem konkreten Angebot ein.',
        },
      ],
    },
    faqs: [
      { question: 'Wie hoch sollte die anfängliche Tilgung sein?', answer: 'Je höher die Tilgung, desto schneller sinkt die Schuld und desto weniger Zinsen zahlen Sie insgesamt. Bei 300.000 € und 3,6 % Sollzins dauert die Rückzahlung mit 2 % Tilgung 28 Jahre und 8 Monate, mit 3 % Tilgung 22 Jahre. Die Rate steigt dafür von 1.400 € auf 1.650 € im Monat.' },
      { question: 'Wie berechne ich die Restschuld nach 10 Jahren?', answer: 'Tragen Sie Darlehensbetrag, Sollzins, anfängliche Tilgung und 10 Jahre Zinsbindung ein. Der Rechner verrechnet jeden Monat Zinsen und Tilgung und zeigt die Restschuld am Ende. Für 200.000 € bei 3,5 % und 2 % Tilgung sind das 152.189,16 €.' },
      { question: 'Was ist ein Volltilgerdarlehen?', answer: 'Bei einem Volltilgerdarlehen ist die Rate so hoch, dass der Kredit am Ende der Zinsbindung vollständig getilgt ist. Sie tragen kein Zinsrisiko für eine Anschlussfinanzierung, zahlen aber eine höhere Rate. 200.000 € zu 3,5 % sind in 20 Jahren mit 1.159,92 € im Monat getilgt.' },
      { question: 'Kann ich eine Immobilie ohne Eigenkapital finanzieren?', answer: 'Manche Banken finanzieren Kaufpreis und Nebenkosten vollständig (110-%-Finanzierung), meist mit einem Zinsaufschlag und strengeren Anforderungen an Einkommen und Bonität. Im Rechner setzen Sie dafür das Eigenkapital auf 0 €. Bei 300.000 € Kaufpreis und 10 % Nebenkosten ergibt das 330.000 € Darlehen.' },
      { question: 'Kann ich mein Baudarlehen nach 10 Jahren kündigen?', answer: 'Ja. Nach § 489 Abs. 1 Nr. 2 BGB können Sie ein Darlehen mit festem Zins zehn Jahre nach dem vollständigen Empfang mit einer Frist von sechs Monaten kündigen, ohne Vorfälligkeitsentschädigung. Das gilt auch bei 15 oder 20 Jahren Zinsbindung.' },
      { question: 'Was passiert, wenn die Zinsen nach der Zinsbindung steigen?', answer: 'Dann wird die Anschlussfinanzierung der Restschuld teurer. Bei 227.907,14 € Restschuld fallen im ersten Monat bei 3,6 % Zins 683,72 € Zinsen an, bei 5 % sind es 949,61 €. Eine höhere Tilgung oder Sondertilgungen senken die Restschuld und damit dieses Risiko.' },
    ],
    relatedSlugs: ['sondertilgungsrechner', 'forward-darlehen-rechner', 'notar-grundbuch-kosten-rechner', 'vorfaelligkeitsentschaedigung-baufinanzierung-rechner', 'zwischenfinanzierung-rechner', 'maximaler-kredit-rechner', 'ratenkreditrechner'],
    trustMeta: {
      methodology: 'Annuitätendarlehen mit monatlicher Zinsverrechnung (Monatszins = Sollzins ÷ 12); Volltilger-Rate nach der Annuitätenformel.',
      assumptions: [
        'Fester Sollzins während der Zinsbindung',
        'Monatliche Raten, keine Sondertilgungen',
        'Gesamtlaufzeit und Gesamtzinsen nach der Zinsbindung unter der Annahme eines gleichbleibenden Zinses',
      ],
      limitations: [
        'Kein Zinsaufschlag für hohe Beleihung: Tragen Sie den Zins aus Ihrem Angebot ein.',
        'Bereitstellungszinsen, Gebühren und Teilauszahlungen beim Neubau sind nicht berücksichtigt.',
      ],
      lastReviewed: '2026-11-05',
    },
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
      { id: 'loanAmount', label: 'Aktuelle Kreditsumme', type: 'number', defaultValue: 250000, min: 1000, step: 10000, unit: '€' },
      { id: 'annualInterest', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.8, min: 0, max: 25, step: 0.1, unit: '%' },
      { id: 'monthlyPayment', label: 'Bestehende Monatsrate', type: 'number', defaultValue: 1200, min: 10, step: 50, unit: '€' },
      { id: 'yearlySpecialRepayment', label: 'Geplante jährliche Sondertilgung', type: 'number', defaultValue: 5000, min: 0, step: 500, unit: '€', helpText: 'Zusätzliche jährliche Einmalzahlung (0 € wenn keine Sondertilgung geleistet wird).' },
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
      { id: 'loanAmount', label: 'Ursprünglicher Darlehensbetrag', type: 'number', defaultValue: 200000, min: 1000, step: 10000, unit: '€' },
      { id: 'annualInterest', label: 'Zinssatz p.a.', type: 'number', defaultValue: 3.5, min: 0, max: 25, step: 0.1, unit: '%' },
      { id: 'initialRepayment', label: 'Anfängliche Tilgung', type: 'number', defaultValue: 2.0, min: 0.1, max: 20, step: 0.25, unit: '%' },
      { id: 'fixedYears', label: 'Zinsbindung in Jahren', type: 'number', defaultValue: 10, min: 1, max: 40, step: 1, unit: 'Jahre' },
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
    relatedSlugs: ['tilgungsrechner', 'kreditrechner', 'sondertilgungsrechner', 'restschuld-rechner', 'kreditlaufzeit-rechner'],
  },
];
