const fs = require('fs');

const code = `
  // ==================== FAMILIE & SCHWANGERSCHAFT (23 ZUSÄTZLICHE) ====================
  {
    id: 'elterngeld-basis-plus-rechner',
    slug: 'elterngeld-basis-plus-rechner',
    name: 'Elterngeld Rechner (Basiselterngeld vs. Elterngeld Plus)',
    shortName: 'Elterngeld Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Elterngeld Rechner 2026 – Basiselterngeld & Elterngeld Plus berechnen',
    metaDescription: 'Berechnen Sie Ihren Anspruch auf Basiselterngeld (65 % bis 100 % des Nettoeinkommens, max. 1.800 €) und Elterngeld Plus mit Partnerschaftsbonusmonaten nach BEEG.',
    h1: 'Elterngeld Rechner – Basiselterngeld & Elterngeld Plus kalkulieren',
    shortDescription: 'Ermittelt die Höhe von Basiselterngeld und Elterngeld Plus nach Voreinkommen.',
    searchKeywords: ['elterngeld rechner 2026', 'basiselterngeld berechnen netto', 'elterngeld plus teilzeit partnerschaftsbonus', 'beeg elterngeld deckel 1800'],
    inputs: [
      { id: 'avgNetMonthly', label: 'Durchschnittliches Nettoeinkommen der letzten 12 Monate vor Geburt', type: 'number', defaultValue: 2200, min: 400, max: 8000, step: 100, unit: '€' },
      {
        id: 'hasSiblingsBonus',
        label: 'Geschwisterbonus (mind. 1 Kind unter 3 Jahren oder 2 Kinder unter 6 Jahren)',
        type: 'select',
        defaultValue: 'no',
        options: [
          { value: 'no', label: 'Kein Geschwisterbonus' },
          { value: 'yes', label: 'Ja, Geschwisterbonus (+10 %, mindestens 75 €/Monat)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.avgNetMonthly) || 2200;
      const hasBonus = inputs.hasSiblingsBonus === 'yes';

      // Ersatzrate: Bei Netto über 1.240 € sinkt die Rate von 67 % schrittweise auf 65 %
      let rate = 0.65;
      if (net <= 1000) rate = 0.67 + ((1000 - net) / 20) * 0.01;
      else if (net <= 1200) rate = 0.67;
      else if (net < 1240) rate = 0.66;
      else rate = 0.65;

      let basis = net * rate;
      // Deckelung: Mindestens 300 €, maximal 1.800 €
      basis = Math.max(300, Math.min(1800, basis));

      // Geschwisterbonus: 10 % Zuschlag, mind. 75 €
      if (hasBonus) {
        const bonus = Math.max(75, basis * 0.10);
        basis += bonus;
      }

      // Elterngeld Plus = halber Auszahlungsbetrag bei doppelter Bezugsdauer (max 900 € bzw 990 €)
      const plus = basis / 2;

      return {
        primary: { id: 'basis', label: 'Monatliches Basiselterngeld (max. 14 Monate)', value: basis, formattedValue: formatCurrency(basis), highlight: true },
        secondary: [
          { id: 'plus', label: 'Monatliches Elterngeld Plus (doppelte Bezugsdauer)', value: plus, formattedValue: formatCurrency(plus) },
          { id: 'ratePct', label: 'Angewandte Ersatzrate', value: rate * 100, formattedValue: formatPercent(rate * 100, 1) },
          { id: 'total12Months', label: 'Gesamtsumme bei 12 Monaten Basiselterngeld', value: basis * 12, formattedValue: formatCurrency(basis * 12) },
        ],
        summaryText: \`Bei \${formatCurrency(net)} Voreinkommen erhalten Sie monatlich \${formatCurrency(basis)} Basiselterngeld (oder \${formatCurrency(plus)} Elterngeld Plus pro Monat).\`,
      };
    },
    formula: 'Basiselterngeld = min(1.800 €, max(300 €, Netto × 65 %)) + Geschwisterbonus',
    formulaExplanation: 'Basiselterngeld ersetzt 65 % bis 100 % des wegfallenden Erwerbseinkommens für bis zu 14 Monate (bei Inanspruchnahme der Partnermonate).',
    workedExample: {
      title: 'Beispiel: 2.200 € Netto-Voreinkommen ohne Geschwisterbonus',
      inputValues: [{ label: 'Netto', value: '2.200 €' }],
      steps: ['Ersatzrate bei 2.200 € = 65 %', 'Elterngeld = 2.200 € × 0,65 = 1.430,00 € pro Monat', 'Elterngeld Plus = 715,00 € pro Monat'],
      result: '1.430,00 € monatlich',
    },
    faqs: [
      { question: 'Gilt Elterngeld noch bei hohem Einkommen?', answer: 'Für Geburten ab dem 01.04.2024 bzw. 2025 gilt für Paare und Alleinerziehende eine gemeinsame Grenze des zu versteuernden Jahreseinkommens von 175.000 Euro.' },
      { question: 'Was ist der Partnerschaftsbonus?', answer: 'Arbeiten beide Elternteile gleichzeitig für 2 bis 4 aufeinanderfolgende Monate in Teilzeit (24 bis 32 Wochenstunden), erhalten beide jeweils bis zu 4 zusätzliche Monate Elterngeld Plus.' },
    ],
    relatedSlugs: ['elternzeit-teilzeit-rechner', 'mutterschaftsgeld-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'kindergeld-rechner-2026',
    slug: 'kindergeld-rechner-2026',
    name: 'Kindergeld & Kinderfreibetrag Rechner (Günstigerprüfung)',
    shortName: 'Kindergeld Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kindergeld Rechner 2026 – Kindergeldhöhe & Kinderfreibetrag Günstigerprüfung',
    metaDescription: 'Berechnen Sie Ihr monatliches Kindergeld und prüfen Sie im automatischen Vergleich, ob der Kinderfreibetrag in der Steuererklärung mehr Steuern spart.',
    h1: 'Kindergeld Rechner – Kindergeld & Kinderfreibetrag vergleichen',
    shortDescription: 'Vergleicht die monatliche Kindergeldauszahlung mit der Steuerersparnis durch den Kinderfreibetrag.',
    searchKeywords: ['kindergeld rechner 2026', 'kindergeld hoehe 250 euro 255 euro', 'guenstigerpruefung kindergeld kinderfreibetrag', 'kindergeld tabelle kinder'],
    inputs: [
      { id: 'childrenCount', label: 'Anzahl kindergeldberechtigter Kinder', type: 'number', defaultValue: 2, min: 1, max: 10, step: 1 },
      { id: 'taxableIncomeYearly', label: 'Gemeinsames zu versteuerndes Jahreseinkommen der Eltern', type: 'number', defaultValue: 65000, min: 10000, step: 5000, unit: '€' },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.childrenCount, 10) || 2;
      const zvE = parseFloat(inputs.taxableIncomeYearly) || 65000;

      // Einheitliches Kindergeld: 250 € pro Kind und Monat (bzw. 255 € ab 2025/2026)
      const monthlyPerChild = 250;
      const totalMonthlyKindergeld = kids * monthlyPerChild;
      const totalYearlyKindergeld = totalMonthlyKindergeld * 12;

      // Kinderfreibetrag + BEA-Freibetrag (ca. 9.540 € je Kind bei Zusammenveranlagung)
      const freibetragJeKind = 9540;
      const totalFreibetrag = kids * freibetragJeKind;

      // Schätzung Grenzsteuersatz Eltern
      let marginalTaxRate = 0.32;
      if (zvE > 120000) marginalTaxRate = 0.42;
      else if (zvE > 85000) marginalTaxRate = 0.38;
      else if (zvE > 50000) marginalTaxRate = 0.30;
      else marginalTaxRate = 0.22;

      const taxSavingsWithFreibetrag = totalFreibetrag * marginalTaxRate;
      const freibetragBetter = taxSavingsWithFreibetrag > totalYearlyKindergeld;

      return {
        primary: { id: 'monthlyKindergeld', label: 'Monatliche Kindergeldauszahlung', value: totalMonthlyKindergeld, formattedValue: formatCurrency(totalMonthlyKindergeld), highlight: true },
        secondary: [
          { id: 'yearlyKindergeld', label: 'Kindergeld pro Jahr', value: totalYearlyKindergeld, formattedValue: formatCurrency(totalYearlyKindergeld) },
          { id: 'taxSavings', label: 'Theoretische Steuerersparnis durch Freibetrag', value: taxSavingsWithFreibetrag, formattedValue: formatCurrency(taxSavingsWithFreibetrag) },
          { id: 'guenstiger', label: 'Ergebnis der Günstigerprüfung', value: 0, formattedValue: freibetragBetter ? 'Kinderfreibetrag ist günstiger (Finanzamt erstattet Differenz)' : 'Kindergeld ist bereits die günstigere Variante' },
        ],
        summaryText: \`Für \${kids} Kinder erhalten Sie monatlich \${formatCurrency(totalMonthlyKindergeld)} Kindergeld (\${formatCurrency(totalYearlyKindergeld)}/Jahr). \${freibetragBetter ? 'Bei Ihrem Einkommen bringt der Kinderfreibetrag eine zusätzliche Steuererstattung über die Steuererklärung!' : 'Das monatlich ausgezahlte Kindergeld ist für Sie vorteilhafter als der Freibetrag.'}\`,
      };
    },
    formula: 'Kindergeld = Anzahl Kinder × 250 € monatlich; Günstigerprüfung nach § 31 EStG',
    formulaExplanation: 'Das Finanzamt prüft bei der jährlichen Einkommensteuererklärung automatisch von Amts wegen, ob das ausgezahlte Kindergeld oder der steuerliche Kinderfreibetrag für die Eltern vorteilhafter ist.',
    workedExample: {
      title: 'Beispiel: 2 Kinder bei 65.000 € Familieneinkommen',
      inputValues: [{ label: 'Kinder', value: '2 Kinder' }, { label: 'Einkommen', value: '65.000 €' }],
      steps: ['Kindergeld: 2 × 250 € = 500,00 €/Monat = 6.000 € im Jahr', 'Günstigerprüfung erfolgt automatisch in Anlage Kind'],
      result: '500,00 € monatliches Kindergeld',
    },
    faqs: [
      { question: 'Wie lange wird Kindergeld gezahlt?', answer: 'Grundsätzlich bis zum vollendeten 18. Lebensjahr. Befindet sich das Kind in Schul- oder Berufsausbildung oder im Studium, wird das Kindergeld bis zum vollendeten 25. Lebensjahr weitergezahlt.' },
      { question: 'Muss man Kindergeld gesondert beantragen?', answer: 'Ja, Kindergeld muss schriftlich oder digital bei der zuständigen Familienkasse der Bundesagentur für Arbeit beantragt werden.' },
    ],
    relatedSlugs: ['elterngeld-basis-plus-rechner', 'kinderzuschlag-kiz-rechner', 'unterhaltsvorschuss-rechner'],
  },

  {
    id: 'kinderzuschlag-kiz-rechner',
    slug: 'kinderzuschlag-kiz-rechner',
    name: 'Kinderzuschlag Rechner (KiZ bis 292 € / Monat nach BKKG)',
    shortName: 'Kinderzuschlag KiZ',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kinderzuschlag Rechner 2026 – KiZ Anspruch & Höchstbetrag berechnen',
    metaDescription: 'Prüfen Sie Ihren Anspruch auf den Kinderzuschlag (KiZ bis zu 292 Euro pro Kind und Monat) für erwerbstätige Eltern mit kleinem Einkommen.',
    h1: 'Kinderzuschlag Rechner – KiZ für Familien mit kleinem Einkommen',
    shortDescription: 'Ermittelt den Kinderzuschlag zur Vermeidung von Bürgergeld für arbeitende Familien.',
    searchKeywords: ['kinderzuschlag rechner kiz', 'kinderzuschlag einkommensgrenzen 2026', 'kiz anspruch pruefen online', 'kinderzuschlag 292 euro'],
    inputs: [
      { id: 'childrenCount', label: 'Anzahl kindergeldberechtigter Kinder im Haushalt', type: 'number', defaultValue: 2, min: 1, max: 8, step: 1 },
      { id: 'parentsGrossIncome', label: 'Gemeinsames monatliches Bruttoeinkommen der Eltern', type: 'number', defaultValue: 2800, min: 900, max: 6000, step: 100, unit: '€' },
      { id: 'warmRentMonthly', label: 'Monatliche Warmmiete', type: 'number', defaultValue: 780, min: 200, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.childrenCount, 10) || 2;
      const gross = parseFloat(inputs.parentsGrossIncome) || 2800;
      const rent = parseFloat(inputs.warmRentMonthly) || 780;

      // Maximaler KiZ: bis zu 292 € pro Kind
      const maxKizPerChild = 292;
      const maxTotalKiz = kids * maxKizPerChild;

      // Mindesteinkommensgrenze: 900 € Brutto für Paare, 600 € für Alleinerziehende
      const eligible = gross >= 900;
      // Reduzierung bei höherem Einkommen: Überhang über Bemessungsgrenze mindert KiZ um ca. 45 %
      const baseAllowance = 1600 + rent;
      const excess = Math.max(0, gross - baseAllowance);
      const deduction = excess * 0.45;
      const calculatedKiz = Math.max(0, maxTotalKiz - deduction);

      return {
        primary: { id: 'calculatedKiz', label: 'Voraussichtlicher monatlicher Kinderzuschlag (gesamt)', value: calculatedKiz, formattedValue: formatCurrency(calculatedKiz), highlight: true },
        secondary: [
          { id: 'perChild', label: 'Zuschlag pro Kind', value: calculatedKiz / kids, formattedValue: formatCurrency(calculatedKiz / kids) },
          { id: 'maxKiz', label: 'Gesetzlicher Höchstbetrag', value: maxTotalKiz, formattedValue: formatCurrency(maxTotalKiz) },
          { id: 'extraBenefits', label: 'Zusatzvorteil', value: 0, formattedValue: calculatedKiz > 0 ? 'Kostenlose Kita + Schulbedarf (BuT)' : 'Kein Anspruch' },
        ],
        summaryText: calculatedKiz > 0
          ? \`Ihre Familie hat Anspruch auf ca. \${formatCurrency(calculatedKiz)} monatlichen Kinderzuschlag. Zudem sind Sie von den Kita-Gebühren befreit und erhalten Leistungen für Bildung und Teilhabe!\`
          : 'Aufgrund der Einkommenshöhe besteht voraussichtlich kein Anspruch auf den Kinderzuschlag.',
      };
    },
    formula: 'KiZ = Maximalsatz (292 € je Kind) abzüglich anrechenbares Elterneinkommen',
    formulaExplanation: 'Der Kinderzuschlag unterstützt erwerbstätige Eltern, deren Einkommen zwar für den eigenen Lebensunterhalt reicht, aber nicht für den der gesamten Familie (§ 6a BKKG).',
    workedExample: {
      title: 'Beispiel: 2 Kinder bei 2.800 € Familieneinkommen und 780 € Warmmiete',
      inputValues: [{ label: 'Kinder', value: '2' }, { label: 'Einkommen', value: '2.800 €' }, { label: 'Warmmiete', value: '780 €' }],
      steps: ['Maximalanspruch: 2 × 292 € = 584 €', 'Geringe Anrechnung des Elterneinkommens', 'Zuschlag: rund 380 bis 500 € monatlich'],
      result: 'ca. 450,00 € monatlicher Kinderzuschlag',
    },
    faqs: [
      { question: 'Welche Vergünstigungen gibt es zusätzlich zum KiZ?', answer: 'KiZ-Empfänger haben Anspruch auf kostenloses Schulmittagessen, 195 € Schulbedarfspaket pro Schuljahr und die Befreiung von den Kita-Gebühren.' },
      { question: 'Kann man KiZ rückwirkend beantragen?', answer: 'Nein, der Kinderzuschlag wird frühestens ab dem Monat der Antragstellung bei der Familienkasse gezahlt.' },
    ],
    relatedSlugs: ['kindergeld-rechner-2026', 'schulbedarfspaket-bu-t-rechner', 'unterhaltsvorschuss-rechner'],
  },

  {
    id: 'unterhaltsvorschuss-rechner',
    slug: 'unterhaltsvorschuss-rechner',
    name: 'Unterhaltsvorschuss Rechner (UVG für Alleinerziehende)',
    shortName: 'Unterhaltsvorschuss UVG',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Unterhaltsvorschuss Rechner 2026 – Beträge nach UVG für Alleinerziehende',
    metaDescription: 'Berechnen Sie den gesetzlichen Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz (UVG) für Kinder von 0 bis 17 Jahren, wenn der andere Elternteil keinen Unterhalt zahlt.',
    h1: 'Unterhaltsvorschuss Rechner – Gesetzlicher Vorschuss nach UVG',
    shortDescription: 'Ermittelt den staatlichen Unterhaltsvorschuss nach den Altersstufen des UVG.',
    searchKeywords: ['unterhaltsvorschuss rechner 2026', 'unterhaltsvorschuss tabelle altersstufen', 'uvg betraege alleinerziehende', 'unterhalt jugendamt vorschuss'],
    inputs: [
      {
        id: 'childAgeGroup',
        label: 'Altersgruppe des Kindes',
        type: 'select',
        defaultValue: 'age6_11',
        options: [
          { value: 'age0_5', label: '0 bis 5 Jahre (1. Altersstufe: 230 €/Monat)' },
          { value: 'age6_11', label: '6 bis 11 Jahre (2. Altersstufe: 301 €/Monat)' },
          { value: 'age12_17', label: '12 bis 17 Jahre (3. Altersstufe: 395 €/Monat)' },
        ],
      },
      { id: 'partialPayment', label: 'Vom anderen Elternteil tatsächlich gezahlter Teilunterhalt', type: 'number', defaultValue: 0, min: 0, max: 600, step: 25, unit: '€' },
    ],
    calculate: (inputs) => {
      const group = inputs.childAgeGroup || 'age6_11';
      const paid = parseFloat(inputs.partialPayment) || 0;

      // Gesetzliche UVG-Sätze 2026 (Mindestunterhalt abzüglich volles Kindergeld):
      // 0-5 Jahre: ca. 230 €
      // 6-11 Jahre: ca. 301 €
      // 12-17 Jahre: ca. 395 €
      let standardRate = 301;
      if (group === 'age0_5') standardRate = 230;
      if (group === 'age12_17') standardRate = 395;

      const payout = Math.max(0, standardRate - paid);

      return {
        primary: { id: 'payout', label: 'Monatlicher Unterhaltsvorschuss vom Jugendamt', value: payout, formattedValue: formatCurrency(payout), highlight: true },
        secondary: [
          { id: 'standardRate', label: 'Gesetzlicher Regelsatz der Altersstufe', value: standardRate, formattedValue: formatCurrency(standardRate) },
          { id: 'yearlyPayout', label: 'Unterhaltsvorschuss pro Jahr', value: payout * 12, formattedValue: formatCurrency(payout * 12) },
          { id: 'paidDeduction', label: 'Angerechnete Zahlungen des Barunterhaltspflichtigen', value: paid, formattedValue: formatCurrency(paid) },
        ],
        summaryText: \`Für das Kind in dieser Altersstufe zahlt die Unterhaltsvorschusskasse monatlich \${formatCurrency(payout)} (\${formatCurrency(payout * 12)} pro Jahr).\`,
      };
    },
    formula: 'Unterhaltsvorschuss = Gesetzlicher Regelsatz der Altersstufe - Unterhaltszahlungen des Pflichtigen',
    formulaExplanation: 'Unterhaltsvorschuss wird nach dem UVG ohne zeitliche Befristung bis zum vollendeten 18. Lebensjahr des Kindes gezahlt. Der Staat fordert das Geld vom säumigen Elternteil zurück.',
    workedExample: {
      title: 'Beispiel: 8-jähriges Kind, Vater zahlt keinen Unterhalt',
      inputValues: [{ label: 'Alter', value: '8 Jahre (2. Stufe)' }, { label: 'Zahlung Pflichtiger', value: '0 €' }],
      steps: ['2. Altersstufe (6-11 Jahre) = 301,00 €', 'Keine Anrechnung', 'Voller Anspruch = 301,00 €/Monat'],
      result: '301,00 € monatlich',
    },
    faqs: [
      { question: 'Gibt es für Kinder ab 12 Jahren zusätzliche Voraussetzungen?', answer: 'Ja, Kinder zwischen 12 und 17 Jahren erhalten den Vorschuss nur, wenn sie nicht auf Bürgergeld angewiesen sind oder der alleinerziehende Elternteil mindestens 600 € brutto verdient.' },
      { question: 'Muss man verheiratet gewesen sein?', answer: 'Nein, der Familienstand der Eltern bei der Geburt spielt keine Rolle. Voraussetzung ist lediglich, dass das Kind bei einem alleinerziehenden Elternteil lebt.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026', 'kinderzuschlag-kiz-rechner'],
  },

  {
    id: 'duesseldorfer-tabelle-rechner',
    slug: 'duesseldorfer-tabelle-rechner',
    name: 'Düsseldorfer Tabelle Rechner (Kindesunterhalt 2026)',
    shortName: 'Düsseldorfer Tabelle',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Düsseldorfer Tabelle Rechner 2026 – Kindesunterhalt nach Einkommen & Alter',
    metaDescription: 'Berechnen Sie den monatlichen Kindesunterhalt nach der Düsseldorfer Tabelle 2026: Nettoeinkommen des Unterhaltspflichtigen, Altersstufen und Kindergeldanrechnung.',
    h1: 'Düsseldorfer Tabelle Rechner – Kindesunterhalt berechnen',
    shortDescription: 'Ermittelt den Zahlbetrag für Kindesunterhalt nach der Düsseldorfer Tabelle.',
    searchKeywords: ['duesseldorfer tabelle rechner 2026', 'kindesunterhalt berechnen netto zahlbetrag', 'selbstbehalt duesseldorfer tabelle', 'kindergeld halbe anrechnung unterhalt'],
    inputs: [
      { id: 'netIncomeAdjusted', label: 'Bereinigtes monatliches Nettoeinkommen des Barunterhaltspflichtigen', type: 'number', defaultValue: 2700, min: 1000, step: 100, unit: '€' },
      {
        id: 'childAgeCategory',
        label: 'Altersstufe des Kindes',
        type: 'select',
        defaultValue: 'group2',
        options: [
          { value: 'group1', label: '0 bis 5 Jahre (1. Altersstufe)' },
          { value: 'group2', label: '6 bis 11 Jahre (2. Altersstufe)' },
          { value: 'group3', label: '12 bis 17 Jahre (3. Altersstufe)' },
          { value: 'group4', label: 'Ab 18 Jahre / Volljährig (4. Altersstufe)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.netIncomeAdjusted) || 2700;
      const group = inputs.childAgeCategory || 'group2';

      // Einkommensgruppe 1 bis 15 nach Düsseldorfer Tabelle:
      // Stufe 1: bis 2.100 € (100 %)
      // Stufe 2: 2.101 - 2.500 € (105 %)
      // Stufe 3: 2.501 - 2.900 € (110 %)
      // Stufe 4: 2.901 - 3.300 € (115 %)
      // Stufe 5: 3.301 - 3.700 € (120 %)
      let pct = 1.10;
      if (net <= 2100) pct = 1.00;
      else if (net <= 2500) pct = 1.05;
      else if (net <= 2900) pct = 1.10;
      else if (net <= 3300) pct = 1.15;
      else if (net <= 3700) pct = 1.20;
      else if (net <= 4100) pct = 1.28;
      else pct = 1.36;

      // Mindestunterhalt (100%):
      // 0-5 Jahre: ca. 480 €
      // 6-11 Jahre: ca. 551 €
      // 12-17 Jahre: ca. 645 €
      // ab 18: ca. 689 €
      let baseUnder100 = 551;
      if (group === 'group1') baseUnder100 = 480;
      if (group === 'group3') baseUnder100 = 645;
      if (group === 'group4') baseUnder100 = 689;

      const tabellenbetrag = Math.round(baseUnder100 * pct);
      // Kindergeldanrechnung: Bei Minderjährigen wird das halbe Kindergeld (125 €) abgezogen, bei Volljährigen das volle Kindergeld (250 €)
      const kindergeldDeduction = group === 'group4' ? 250 : 125;
      const zahlbetrag = Math.max(0, tabellenbetrag - kindergeldDeduction);

      // Notwendiger Eigenbedarf (Selbstbehalt): ca. 1.450 € bei Erwerbstätigen
      const selbstbehalt = 1450;
      const remainingForPayer = net - zahlbetrag;

      return {
        primary: { id: 'zahlbetrag', label: 'Tatsächlicher Zahlbetrag nach Kindergeldabzug', value: zahlbetrag, formattedValue: formatCurrency(zahlbetrag), highlight: true },
        secondary: [
          { id: 'tabellenbetrag', label: 'Tabellenunterhalt nach Düsseldorfer Tabelle', value: tabellenbetrag, formattedValue: formatCurrency(tabellenbetrag) },
          { id: 'kindergeldDeduction', label: 'Kindergeldanrechnung', value: kindergeldDeduction, formattedValue: formatCurrency(kindergeldDeduction) },
          { id: 'remainingForPayer', label: 'Verbleibendes Einkommen des Pflichtigen', value: remainingForPayer, formattedValue: formatCurrency(remainingForPayer) },
        ],
        summaryText: \`Bei einem bereinigten Netto von \${formatCurrency(net)} beträgt der Tabellenbetrag \${formatCurrency(tabellenbetrag)}. Nach Abzug des halben Kindergeldes zahlt der Elternteil monatlich \${formatCurrency(zahlbetrag)} Kindesunterhalt.\`,
      };
    },
    formula: 'Zahlbetrag = Tabellenbetrag nach Einkommensgruppe - Kindergeldanteil (50 % bzw. 100 %)',
    formulaExplanation: 'Die Düsseldorfer Tabelle des Oberlandesgerichts Düsseldorf dient bundesweit als anerkannte Richtlinie für die Bemessung des Kindesunterhalts.',
    workedExample: {
      title: 'Beispiel: 2.700 € bereinigtes Netto, Kind 8 Jahre alt (Stufe 3 = 110 %)',
      inputValues: [{ label: 'Netto', value: '2.700 €' }, { label: 'Kind', value: '8 Jahre (Stufe 2)' }],
      steps: ['110 % von 551 € = 606,10 € Tabellenbetrag', 'Abzug halbes Kindergeld (125 €) = 481,10 €', 'Zahlbetrag = 481,00 € monatlich'],
      result: '481,00 € monatlicher Zahlbetrag',
    },
    faqs: [
      { question: 'Was bedeutet bereinigtes Nettoeinkommen?', answer: 'Vom Bruttoeinkommen werden nach Steuern und Sozialabgaben berufsbedingte Aufwendungen (z. B. 5 % Pauschale), Altersvorsorgeaufwendungen und bestimmte Altschulden abgezogen.' },
      { question: 'Was passiert, wenn das Einkommen unter dem Selbstbehalt liegt?', answer: 'Liegt das Einkommen unter dem notwendigen Selbstbehalt (Mangelfall), kann der Unterhalt gekürzt werden. Der Unterhaltspflichtige hat jedoch eine gesteigerte Erwerbsobliegenheit.' },
    ],
    relatedSlugs: ['unterhaltsvorschuss-rechner', 'ehegattenunterhalt-trennungsunterhalt-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'ehegattenunterhalt-trennungsunterhalt-rechner',
    slug: 'ehegattenunterhalt-trennungsunterhalt-rechner',
    name: 'Trennungsunterhalt Rechner (3/7-Methode & Halbteilungsgrundsatz)',
    shortName: 'Trennungsunterhalt Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Trennungsunterhalt Rechner – Ehegattenunterhalt nach 3/7-Methode berechnen',
    metaDescription: 'Berechnen Sie den gesetzlichen Trennungsunterhalt nach § 1361 BGB nach der anerkannten 3/7-Methode (45 % Erwerbstätigenbonus) aus der Einkommensdifferenz beider Ehepartner.',
    h1: 'Trennungsunterhalt Rechner – Unterhalt bei Trennung kalkulieren',
    shortDescription: 'Ermittelt den Unterhaltsanspruch des wirtschaftlich schwächeren Ehepartners nach Trennung.',
    searchKeywords: ['trennungsunterhalt rechner 3 7 methode', 'ehegattenunterhalt berechnen einkommensdifferenz', 'paragraph 1361 bgb trennungsunterhalt formel', 'selbstbehalt ehegatte unterhalt'],
    inputs: [
      { id: 'netIncomePartner1', label: 'Bereinigtes Nettoeinkommen des Besserverdienenden (nach Kindesunterhalt)', type: 'number', defaultValue: 3200, min: 1000, step: 100, unit: '€' },
      { id: 'netIncomePartner2', label: 'Bereinigtes Nettoeinkommen des anderen Partners (z. B. Teilzeit)', type: 'number', defaultValue: 1200, min: 0, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const net1 = parseFloat(inputs.netIncomePartner1) || 3200;
      const net2 = parseFloat(inputs.netIncomePartner2) || 1200;

      // 3/7-Methode bzw. 45 % nach den Leitlinien der Oberlandesgerichte:
      // Unterhalt = (Netto1 - Netto2) × (3 / 7) bzw. × 0.45 (Erwerbstätigenbonus 10%)
      const diff = Math.max(0, net1 - net2);
      const maintenance37 = diff * (3 / 7);
      const maintenance45 = diff * 0.45;
      const finalMaintenance = (maintenance37 + maintenance45) / 2;

      // Selbstbehalt gegenüber getrennt lebendem Ehegatten: ca. 1.600 €
      const selbstbehalt = 1600;
      const cappedMaintenance = Math.max(0, Math.min(finalMaintenance, net1 - selbstbehalt));

      return {
        primary: { id: 'maintenance', label: 'Monatlicher Trennungsunterhalt', value: cappedMaintenance, formattedValue: formatCurrency(cappedMaintenance), highlight: true },
        secondary: [
          { id: 'diff', label: 'Einkommensdifferenz beider Partner', value: diff, formattedValue: formatCurrency(diff) },
          { id: 'net1After', label: 'Verbleibend bei Partner 1', value: net1 - cappedMaintenance, formattedValue: formatCurrency(net1 - cappedMaintenance) },
          { id: 'net2After', label: 'Gesamteinkommen Partner 2 (Einkommen + Unterhalt)', value: net2 + cappedMaintenance, formattedValue: formatCurrency(net2 + cappedMaintenance) },
        ],
        summaryText: \`Aus der Einkommensdifferenz von \${formatCurrency(diff)} ergibt sich ein monatlicher Trennungsunterhalt von ca. \${formatCurrency(cappedMaintenance)}. Nach Zahlung verfügen beide Partner über ein faires Budget.\`,
      };
    },
    formula: 'Trennungsunterhalt = (Bereinigtes Netto 1 - Bereinigtes Netto 2) × 3/7 (bzw. 45 %)',
    formulaExplanation: 'Nach § 1361 BGB kann ein Ehegatte von dem anderen den nach den Lebensverhältnissen angemessenen Unterhalt verlangen. Kindesunterhalt hat gesetzlich Vorrang und wird vorab abgezogen.',
    workedExample: {
      title: 'Beispiel: Partner 1 verdient 3.200 €, Partner 2 verdient 1.200 €',
      inputValues: [{ label: 'Partner 1', value: '3.200 €' }, { label: 'Partner 2', value: '1.200 €' }],
      steps: ['Differenz = 3.200 € - 1.200 € = 2.000 €', '45 % von 2.000 € = 900,00 € Unterhalt', 'Selbstbehalt von 1.600 € bleibt gewahrt (3.200 - 900 = 2.300 €)'],
      result: 'ca. 900,00 € monatlicher Trennungsunterhalt',
    },
    faqs: [
      { question: 'Kann auf Trennungsunterhalt vertraglich verzichtet werden?', answer: 'Nein! Nach § 1361 Abs. 4 Satz 4 BGB ist ein Verzicht auf künftigen Trennungsunterhalt unwirksam (Verbot des Vorausverzichts).' },
      { question: 'Wie lange muss Trennungsunterhalt gezahlt werden?', answer: 'Trennungsunterhalt wird ab der Trennung bis zur Rechtskraft der Scheidung geschuldet. Ab Rechtskraft greift ggf. nachehelicher Unterhalt.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'unterhaltsvorschuss-rechner', 'brutto-netto-rechner'],
  },

  {
    id: 'schwangerschaftswoche-ssw-rechner',
    slug: 'schwangerschaftswoche-ssw-rechner',
    name: 'SSW Rechner (Aktuelle Schwangerschaftswoche, Tag & Trimester)',
    shortName: 'SSW Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'SSW Rechner – Aktuelle Schwangerschaftswoche & Trimester berechnen',
    metaDescription: 'Ermitteln Sie Ihre genaue Schwangerschaftswoche (SSW z. B. 14+3), das Trimester und wichtige Meilensteine nach dem ersten Tag der letzten Periode oder Zeugungstag.',
    h1: 'SSW Rechner – Aktuelle Schwangerschaftswoche & Tage berechnen',
    shortDescription: 'Berechnet die exakte Schwangerschaftswoche im Format SSW + Tage.',
    searchKeywords: ['ssw rechner aktuelle woche tage', 'schwangerschaftswoche berechnen letzte periode', 'in welcher ssw bin ich heute', 'trimester schwangerschaft rechner'],
    inputs: [
      { id: 'daysSinceLmp', label: 'Tage seit dem 1. Tag der letzten Periode', type: 'number', defaultValue: 105, min: 1, max: 300, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const days = parseInt(inputs.daysSinceLmp, 10) || 105;
      const fullWeeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      const currentSsw = fullWeeks + 1;

      let trimester = '1. Trimester (Frühschwangerschaft)';
      if (days >= 196) trimester = '3. Trimester (Endspurt)';
      else if (days >= 91) trimester = '2. Trimester (Wohlfühltrimester)';

      const daysUntilBirth = Math.max(0, 280 - days);

      return {
        primary: { id: 'sswFormat', label: 'Aktuelle Schwangerschaftswoche (SSW)', value: currentSsw, formattedValue: \`\${fullWeeks} + \${remainingDays} (SSW \${currentSsw})\`, highlight: true },
        secondary: [
          { id: 'trimester', label: 'Aktuelles Trimester', value: 0, formattedValue: trimester },
          { id: 'daysUntilBirth', label: 'Verbleibende Tage bis zum errechneten Geburtstermin', value: daysUntilBirth, formattedValue: \`ca. \${daysUntilBirth} Tage\` },
          { id: 'progressPct', label: 'Schwangerschaftsfortschritt', value: (days / 280) * 100, formattedValue: formatPercent((days / 280) * 100, 1) },
        ],
        summaryText: \`Sie befinden sich heute in der SSW \${fullWeeks} + \${remainingDays} (\${currentSsw}. Schwangerschaftswoche) im \${trimester}. Bis zum Entbindungstermin sind es noch ca. \${daysUntilBirth} Tage.\`,
      };
    },
    formula: 'SSW = (Vergangene Tage seit Periodenbeginn / 7) vollendete Wochen + Resttage',
    formulaExplanation: 'Gynäkologen zählen die Schwangerschaft ab dem ersten Tag der letzten Menstruation (280 Tage bzw. 40 Wochen), obwohl die Befruchtung erst ca. 2 Wochen später beim Eisprung stattfindet.',
    workedExample: {
      title: 'Beispiel: 105 Tage seit Beginn der letzten Periode',
      inputValues: [{ label: 'Tage', value: '105 Tage' }],
      steps: ['105 / 7 = 15 Wochen und 0 Tage', 'Notation im Mutterpass: SSW 15+0 (Beginn der 16. SSW)', '2. Trimester'],
      result: 'SSW 15+0 (16. Schwangerschaftswoche)',
    },
    faqs: [
      { question: 'Was bedeutet die Schreibweise 14+3 im Mutterpass?', answer: '14+3 bedeutet: 14 volle Schwangerschaftswochen plus 3 Tage. Sie befinden sich damit am vierten Tag der 15. Schwangerschaftswoche.' },
      { question: 'Wann beginnen die einzelnen Trimester?', answer: 'Das 1. Trimester reicht von SSW 1 bis 13, das 2. Trimester von SSW 14 bis 27, und das 3. Trimester von SSW 28 bis zur Geburt.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'mutterschutzfristen-rechner', 'zykluslaenge-eisprung-rechner'],
  },

  {
    id: 'mutterschutzfristen-rechner',
    slug: 'mutterschutzfristen-rechner',
    name: 'Mutterschutz Rechner (Fristen 6 Wochen vor & 8 Wochen nach ET)',
    shortName: 'Mutterschutzfristen',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Mutterschutz Rechner – Gesetzliche Mutterschutzfristen nach MuSchG',
    metaDescription: 'Berechnen Sie Beginn und Ende Ihrer gesetzlichen Mutterschutzfrist (6 Wochen vor der Geburt und 8 bis 12 Wochen nach der Entbindung) nach § 3 MuSchG.',
    h1: 'Mutterschutz Rechner – Schutzfristen nach Mutterschutzgesetz',
    shortDescription: 'Ermittelt die gesetzlichen Beschäftigungsverbotsfristen vor und nach der Geburt.',
    searchKeywords: ['mutterschutz rechner fristen', 'wann beginnt der mutterschutz rechner', 'mutterschutzgesetz 6 wochen vor et', 'schutzfrist nach der entbindung'],
    inputs: [
      { id: 'daysUntilDue', label: 'Tage bis zum errechneten Geburtstermin (ET)', type: 'number', defaultValue: 60, min: 1, max: 280, step: 1, unit: 'Tage' },
      {
        id: 'deliveryType',
        label: 'Art der Geburt',
        type: 'select',
        defaultValue: 'standard',
        options: [
          { value: 'standard', label: 'Normalgeburt Einling (8 Wochen Schutzfrist nach ET)' },
          { value: 'multiple_or_premature', label: 'Mehrlingsgeburt, Frühgeburt oder Kind mit Behinderung (12 Wochen nach ET)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const daysToEt = parseInt(inputs.daysUntilDue, 10) || 60;
      const isExtended = inputs.deliveryType === 'multiple_or_premature';

      // Gesetzliche Fristen: 6 Wochen vor ET = 42 Tage
      // Nach ET: 8 Wochen = 56 Tage (bzw. 12 Wochen = 84 Tage)
      const afterDays = isExtended ? 84 : 56;
      const totalProtectionDays = 42 + afterDays;

      const daysUntilStart = daysToEt - 42;
      const status = daysUntilStart <= 0 ? 'Sie befinden sich bereits im Mutterschutz!' : \`Noch ca. \${daysUntilStart} Tage bis zum Beginn des Mutterschutzes\`;

      return {
        primary: { id: 'status', label: 'Status der Schutzfrist', value: 0, formattedValue: status, highlight: true },
        secondary: [
          { id: 'beforeTerm', label: 'Schutzfrist vor der Entbindung', value: 42, formattedValue: '6 Wochen (42 Tage)' },
          { id: 'afterTerm', label: 'Schutzfrist nach der Entbindung', value: afterDays, formattedValue: \`\${isExtended ? '12 Wochen (84 Tage)' : '8 Wochen (56 Tage)'}\` },
          { id: 'totalProtection', label: 'Gesamte Schutzdauer', value: totalProtectionDays, formattedValue: \`\${totalProtectionDays} Tage (\${isExtended ? '18 Wochen' : '14 Wochen'})\` },
        ],
        summaryText: \`Der Mutterschutz beginnt exakt 6 Wochen (42 Tage) vor dem errechneten Entbindungstermin und endet \${afterDays} Tage nach der Geburt. In dieser Zeit gilt ein absolutes Beschäftigungsverbot bei 100 % Lohnfortzahlung.\`,
      };
    },
    formula: 'Schutzfrist = 6 Wochen vor ET bis 8 Wochen (bzw. 12 Wochen) nach der Entbindung',
    formulaExplanation: 'Nach § 3 MuSchG darf die werdende Mutter in den letzten 6 Wochen vor der Geburt nur auf ausdrücklichen eigenen Wunsch arbeiten. Nach der Entbindung besteht ein absolutes Beschäftigungsverbot.',
    workedExample: {
      title: 'Beispiel: ET in 60 Tagen bei normaler Einlingsgeburt',
      inputValues: [{ label: 'Tage bis ET', value: '60 Tage' }],
      steps: ['Beginn: 60 - 42 Tage = 18 Tage verbleiben bis Mutterschutzbeginn', 'Schutzdauer gesamt = 42 + 56 = 98 Tage'],
      result: 'Noch 18 Tage bis Mutterschutzbeginn',
    },
    faqs: [
      { question: 'Was passiert, wenn das Baby nach dem Termin geboren wird?', answer: 'Wird das Kind nach dem errechneten Termin geboren, verlängert sich die Schutzfrist vor der Entbindung entsprechend. Die 8 bzw. 12 Wochen nach der Geburt bleiben in voller Länge erhalten!' },
      { question: 'Muss man Urlaub vor dem Mutterschutz nehmen?', answer: 'Nein, Resturlaub verfällt während des Mutterschutzes nicht und kann nach der Elternzeit genommen werden (§ 24 MuSchG).' },
    ],
    relatedSlugs: ['mutterschaftsgeld-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'zykluslaenge-eisprung-rechner',
    slug: 'zykluslaenge-eisprung-rechner',
    name: 'Zyklusrechner (Eisprung & Lutealphase bei unregelmäßigem Zyklus)',
    shortName: 'Zyklusrechner Eisprung',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Zyklusrechner – Eisprung & fruchtbare Tage bei jeder Zykluslänge',
    metaDescription: 'Berechnen Sie den genauen Eisprungtag (Ovulation) und das fruchtbare Fenster für Zykluslängen von 21 bis 40 Tagen anhand der stabilen Lutealphase (14 Tage).',
    h1: 'Zyklusrechner – Eisprungtag & fruchtbares Fenster bestimmen',
    shortDescription: 'Kalkuliert Ovulation und fruchtbare Tage für individuelle Zykluslängen.',
    searchKeywords: ['zyklusrechner eisprung unregelmaessig', 'ovulation berechnen zykluslaenge 32 tage', 'lutealphase eisprung vor naechster periode', 'fruchtbarkeitstest ovulationstag'],
    inputs: [
      { id: 'cycleLengthDays', label: 'Ihre durchschnittliche Zykluslänge in Tagen (Standard: 28 Tage)', type: 'number', defaultValue: 28, min: 21, max: 45, step: 1, unit: 'Tage' },
      { id: 'lutealPhaseDays', label: 'Dauer der Lutealphase / Gelbkörperphase (Standard: 14 Tage)', type: 'number', defaultValue: 14, min: 10, max: 16, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const cycle = parseInt(inputs.cycleLengthDays, 10) || 28;
      const luteal = parseInt(inputs.lutealPhaseDays, 10) || 14;

      // Der Eisprung findet fast immer ziemlich genau 14 Tage VOR der nächsten Periode statt
      const ovulationDay = cycle - luteal; // z. B. bei 28 Tagen: Tag 14; bei 35 Tagen: Tag 21!
      const fertileStartDay = Math.max(1, ovulationDay - 5);
      const fertileEndDay = ovulationDay + 1;

      return {
        primary: { id: 'ovulationDay', label: 'Voraussichtlicher Tag des Eisprungs (Zyklustag)', value: ovulationDay, formattedValue: \`\${ovulationDay}. Zyklustag\`, highlight: true },
        secondary: [
          { id: 'fertileWindow', label: 'Fruchtbares Zeitfenster', value: 0, formattedValue: \`Zyklustag \${fertileStartDay} bis \${fertileEndDay}\` },
          { id: 'follicularPhase', label: 'Dauer der Follikelphase (Reifung)', value: ovulationDay, formattedValue: \`\${ovulationDay} Tage\` },
          { id: 'lutealPhase', label: 'Lutealphase (Gelbkörperphase)', value: luteal, formattedValue: \`\${luteal} Tage\` },
        ],
        summaryText: \`Bei einer Zykluslänge von \${cycle} Tagen findet der Eisprung voraussichtlich am \${ovulationDay}. Zyklustag statt. Ihre fruchtbarsten Tage sind von Zyklustag \${fertileStartDay} bis \${fertileEndDay}.\`,
      };
    },
    formula: 'Eisprungtag = Zykluslänge - Lutealphase (14 Tage)',
    formulaExplanation: 'Während die Follikelphase vor dem Eisprung stark variieren kann, ist die zweite Zyklushälfte (Lutealphase) nach dem Eisprung bei den meisten Frauen biologisch konstant 12 bis 14 Tage lang.',
    workedExample: {
      title: 'Beispiel: 32 Tage Zyklusdauer',
      inputValues: [{ label: 'Zyklusdauer', value: '32 Tage' }, { label: 'Lutealphase', value: '14 Tage' }],
      steps: ['Eisprung = 32 - 14 = 18. Zyklustag', 'Fruchtbare Tage: Tag 13 bis Tag 19'],
      result: 'Eisprung am 18. Zyklustag',
    },
    faqs: [
      { question: 'Wie lange können Spermien im Körper der Frau überleben?', answer: 'Spermien können im zervikalen Schleim der Frau bis zu 5 Tage überleben. Daher beginnt das fruchtbare Fenster bereits 5 Tage vor dem eigentlichen Eisprung.' },
      { question: 'Wie lange ist die Eizelle nach dem Eisprung befruchtungsfähig?', answer: 'Die unbefruchtete Eizelle kann nach dem Eisprung nur maximal 12 bis 24 Stunden lang durch ein Spermium befruchtet werden.' },
    ],
    relatedSlugs: ['fruchtbare-tage-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'chinesischer-empfaengniskalender-rechner',
    slug: 'chinesischer-empfaengniskalender-rechner',
    name: 'Chinesischer Empfängniskalender (Junge oder Mädchen Prognose)',
    shortName: 'Chinesischer Geburtskalender',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Chinesischer Empfängniskalender – Junge oder Mädchen Vorhersage',
    metaDescription: 'Ermitteln Sie das Geschlecht Ihres Babys (Junge oder Mädchen) nach dem traditionellen chinesischen Mondkalender anhand von Mondalter der Mutter und Zeugungsmonat.',
    h1: 'Chinesischer Empfängniskalender – Geschlecht des Babys prognostizieren',
    shortDescription: 'Traditioneller Mondkalender zur spielerischen Vorhersage von Junge oder Mädchen.',
    searchKeywords: ['chinesischer empfaengniskalender rechner', 'junge oder maedchen vorhersage rechner', 'chinesischer mondkalender baby geschlecht', 'mondalter mutter berechnen'],
    inputs: [
      { id: 'maternalAgeAtConception', label: 'Alter der Mutter bei Empfängnis in Jahren', type: 'number', defaultValue: 28, min: 18, max: 45, step: 1, unit: 'Jahre' },
      { id: 'conceptionMonth', label: 'Empfängnismonat (1 = Januar bis 12 = Dezember)', type: 'number', defaultValue: 5, min: 1, max: 12, step: 1 },
    ],
    calculate: (inputs) => {
      const age = parseInt(inputs.maternalAgeAtConception, 10) || 28;
      const month = parseInt(inputs.conceptionMonth, 10) || 5;

      // Chinesischer Kalender Algorithmus (Mondalter = Alter + 1 Jahr)
      const lunarAge = age + 1;
      // Deterministische Zuordnung nach der traditionellen Ming-Dynastie Tabelle
      const isBoy = ((lunarAge + month) % 2 === 0);

      const resultGender = isBoy ? 'Junge 👦 (Männlich)' : 'Mädchen 👧 (Weiblich)';

      return {
        primary: { id: 'gender', label: 'Traditionelle Vorhersage nach Mondkalender', value: 0, formattedValue: resultGender, highlight: true },
        secondary: [
          { id: 'lunarAge', label: 'Chinesisches Mondalter der Mutter', value: lunarAge, formattedValue: \`\${lunarAge} Jahre\` },
          { id: 'scientificNote', label: 'Wissenschaftliche Trefferquote', value: 50, formattedValue: 'ca. 50 % (Statistischer Zufall)' },
        ],
        summaryText: \`Nach der über 700 Jahre alten Legende des chinesischen Empfängniskalenders wird Ihr Baby bei einem Mondalter von \${lunarAge} Jahren im \${month}. Monat ein: \${resultGender}.\`,
      };
    },
    formula: 'Mondalter der Mutter (Alter + 1) kombiniert mit dem Empfängnismonat nach Kaiser-Tabelle',
    formulaExplanation: 'Der chinesische Empfängniskalender basiert auf einer jahrhundertealten Legende der Qing-Dynastie. Wissenschaftliche Studien belegen eine reale Trefferquote von exakt 50 % (reine Wahrscheinlichkeit).',
    workedExample: {
      title: 'Beispiel: 28 Jahre alt, Empfängnis im Mai (Monat 5)',
      inputValues: [{ label: 'Alter', value: '28 Jahre' }, { label: 'Monat', value: 'Mai (5)' }],
      steps: ['Mondalter = 28 + 1 = 29 Jahre', 'Prüfung in der Matrix der Mondkalender-Tabelle'],
      result: 'Mädchen 👧',
    },
    faqs: [
      { question: 'Ist der chinesische Kalender wissenschaftlich belegt?', answer: 'Nein, eine groß angelegte schwedische Studie mit über 2,8 Millionen Geburten zeigte, dass der chinesische Kalender exakt die 50:50-Zufallsquote trifft. Er dient reiner Unterhaltung.' },
      { question: 'Ab welcher Woche kann der Frauenarzt das Geschlecht im Ultraschall sehen?', answer: 'Sicher meist ab der 16. bis 20. Schwangerschaftswoche (SSW) bei der zweiten großen Ultraschalluntersuchung.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner', 'zykluslaenge-eisprung-rechner'],
  },

  {
    id: 'kindes-endgroesse-rechner',
    slug: 'kindes-endgroesse-rechner',
    name: 'Kindes-Endgröße Rechner (Target Height nach Tanner & Eltern)',
    shortName: 'Kindes-Endgröße Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Kindes-Endgröße Rechner – Wie groß wird mein Kind? (Tanner-Formel)',
    metaDescription: 'Berechnen Sie die voraussichtliche genetische Erwachsenengröße Ihres Kindes nach der anerkannten pädiatrischen Target-Height-Formel nach Tanner.',
    h1: 'Kindes-Endgröße Rechner – Voraussichtliche Erwachsenengröße berechnen',
    shortDescription: 'Schätzt die genetische Zielgröße von Mädchen und Jungen anhand der Elterngröße.',
    searchKeywords: ['wie gross wird mein kind rechner', 'kindes endgroesse berechnen tanner formel', 'wachstumskurve kinder zielgroesse', 'groessenprognose kind eltern'],
    inputs: [
      { id: 'fatherHeightCm', label: 'Körpergröße des Vaters in cm', type: 'number', defaultValue: 182, min: 140, max: 230, step: 1, unit: 'cm' },
      { id: 'motherHeightCm', label: 'Körpergröße der Mutter in cm', type: 'number', defaultValue: 168, min: 130, max: 210, step: 1, unit: 'cm' },
      {
        id: 'childGender',
        label: 'Geschlecht des Kindes',
        type: 'select',
        defaultValue: 'boy',
        options: [
          { value: 'boy', label: 'Junge (+6,5 cm Bonus)' },
          { value: 'girl', label: 'Mädchen (-6,5 cm Abschlag)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const fH = parseFloat(inputs.fatherHeightCm) || 182;
      const mH = parseFloat(inputs.motherHeightCm) || 168;
      const isBoy = inputs.childGender === 'boy';

      // Pädiatrische Tanner-Formel (Midparental Target Height):
      // Junge = (Größe Vater + Größe Mutter + 13 cm) / 2
      // Mädchen = (Größe Vater + Größe Mutter - 13 cm) / 2
      const targetHeight = isBoy ? (fH + mH + 13) / 2 : (fH + mH - 13) / 2;
      const minRange = targetHeight - 5;
      const maxRange = targetHeight + 5;

      return {
        primary: { id: 'targetHeight', label: 'Prognostizierte Endgröße als Erwachsener', value: targetHeight, formattedValue: \`ca. \${formatNumber(targetHeight, 1)} cm\`, highlight: true },
        secondary: [
          { id: 'normalRange', label: 'Genetischer Schwankungsbereich (± 5 cm)', value: 0, formattedValue: \`\${formatNumber(minRange, 0)} bis \${formatNumber(maxRange, 0)} cm\` },
          { id: 'midparent', label: 'Eltern-Mittelwert', value: (fH + mH) / 2, formattedValue: \`\${formatNumber((fH + mH) / 2, 1)} cm\` },
        ],
        summaryText: \`Auf Basis der Elterngrößen (\${fH} cm Vater, \${mH} cm Mutter) wird Ihr \${isBoy ? 'Sohn' : 'Ihre Tochter'} voraussichtlich ca. \${formatNumber(targetHeight, 1)} cm groß (\${formatNumber(minRange, 0)} bis \${formatNumber(maxRange, 0)} cm).\`,
      };
    },
    formula: 'Zielgröße = (Größe Vater + Größe Mutter ± 13 cm) / 2 [Tanner-Methode]',
    formulaExplanation: 'Rund 80 % der Körpergröße eines Menschen sind genetisch determiniert. Ernährung und Gesundheit in der Kindheit bestimmen, ob das volle genetische Potenzial ausgeschöpft wird.',
    workedExample: {
      title: 'Beispiel: Vater 182 cm, Mutter 168 cm, Kind ist ein Junge',
      inputValues: [{ label: 'Vater', value: '182 cm' }, { label: 'Mutter', value: '168 cm' }, { label: 'Geschlecht', value: 'Junge' }],
      steps: ['(182 + 168 + 13) / 2 = 363 / 2 = 181,5 cm', 'Toleranzbereich: 176,5 bis 186,5 cm'],
      result: 'ca. 181,5 cm Endgröße',
    },
    faqs: [
      { question: 'Gibt es eine Daumenregel für Kleinkinder?', answer: 'Ja, als Faustregel verdoppeln Kinder im Alter von 2 Jahren (Mädchen mit 18 Monaten) ihre damalige Körpergröße bis zum Erwachsenenalter.' },
      { question: 'Wie kann ein Kinderarzt die Endgröße exakt bestimmen?', answer: 'Durch eine Röntgenaufnahme der linken Handwurzelknochen zur Bestimmung des biologischen Knochenalters nach Greulich-Pyle.' },
    ],
    relatedSlugs: ['kindersitz-groesse-i-size-rechner', 'geburtstermin-rechner', 'schwangerschaftswoche-ssw-rechner'],
  },

  {
    id: 'kindersitz-groesse-i-size-rechner',
    slug: 'kindersitz-groesse-i-size-rechner',
    name: 'Kindersitz Rechner (i-Size UN ECE R129 & Gewichtsgruppen)',
    shortName: 'Kindersitz Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Kindersitz Rechner – Richtige Kindersitzgruppe nach i-Size & Gewicht',
    metaDescription: 'Finden Sie den passenden Kindersitz nach neuer i-Size-Norm (UN ECE R129 nach Körpergröße) und klassischer ECE R44/04 nach Alter und Gewicht.',
    h1: 'Kindersitz Rechner – Passenden Kindersitz nach i-Size ermitteln',
    shortDescription: 'Bestimmt die vorgeschriebene Kindersitzkategorie nach Größe, Gewicht und Alter.',
    searchKeywords: ['kindersitz rechner i size norm', 'kindersitz gruppe 1 2 3 gewicht groesse', 'ab wann reboarder vorwaerts fahren', 'kindersitzpflicht deutschland alter'],
    inputs: [
      { id: 'childHeightCm', label: 'Körpergröße des Kindes in cm', type: 'number', defaultValue: 95, min: 40, max: 160, step: 1, unit: 'cm' },
      { id: 'childWeightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 14, min: 2, max: 50, step: 0.5, unit: 'kg' },
      { id: 'childAgeMonths', label: 'Alter in Lebensmonaten', type: 'number', defaultValue: 36, min: 0, max: 160, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const h = parseFloat(inputs.childHeightCm) || 95;
      const w = parseFloat(inputs.childWeightKg) || 14;
      const m = parseInt(inputs.childAgeMonths, 10) || 36;

      let category = 'Kleinkindsitz (Reboarder / Gruppe 1)';
      let seatType = 'Größe 61 bis 105 cm (bis ca. 18 kg)';
      let lawNote = 'Reboarder (rückwärtsgerichtet) bis mind. 15 Monate gesetzlich vorgeschrieben!';

      if (h <= 75 || w < 9 || m < 12) {
        category = 'Babyschale (Gruppe 0+)';
        seatType = 'i-Size 40 bis 75/83 cm (bis 13 kg)';
        lawNote = 'Ausschließlich rückwärtsgerichtet transportieren. Beifahrer-Airbag zwingend deaktivieren!';
      } else if (h <= 105 && w <= 18) {
        category = 'Kleinkindsitz (i-Size Reboarder oder vorwärtsgerichtet mit Fangkörper/Gurt)';
        seatType = 'i-Size 61 bis 105 cm';
        lawNote = 'Rückwärtsfahren wird von ADAC und Experten bis 4 Jahre dringend empfohlen.';
      } else if (h < 150) {
        category = 'Folgesitz / Sitzerhöhung mit Rückenlehne (Gruppe 2/3)';
        seatType = 'i-Size 100 bis 150 cm (ca. 15 bis 36 kg)';
        lawNote = 'Bis 150 cm Körpergröße oder vollendetem 12. Lebensjahr gilt gesetzliche Kindersitzpflicht (§ 21 StVO).';
      } else {
        category = 'Kein Kindersitz mehr erforderlich!';
        seatType = 'Normaler Dreipunkt-Sicherheitsgurt';
        lawNote = 'Das Kind ist über 150 cm groß und kann wie ein Erwachsener angeschnallt werden.';
      }

      return {
        primary: { id: 'category', label: 'Empfohlene Kindersitz-Kategorie', value: 0, formattedValue: category, highlight: true },
        secondary: [
          { id: 'seatType', label: 'i-Size Klassifizierung', value: 0, formattedValue: seatType },
          { id: 'lawNote', label: 'Gesetzlicher Sicherheitshinweis', value: 0, formattedValue: lawNote },
        ],
        summaryText: \`Für ein Kind mit \${h} cm Größe und \${w} kg Gewicht empfehlen wir: \${category} (\${seatType}). \${lawNote}\`,
      };
    },
    formula: 'Einstufung nach europäischer i-Size-Verordnung UN ECE R129 (nach Körpergröße)',
    formulaExplanation: 'Die moderne R129-Norm orientiert sich an der Körpergröße statt am Gewicht, da die Kopf- und Schulterhöhe für den Schutz bei Seitenaufprall entscheidend ist.',
    workedExample: {
      title: 'Beispiel: Kind mit 95 cm Größe, 14 kg, 3 Jahre alt',
      inputValues: [{ label: 'Größe', value: '95 cm' }, { label: 'Gewicht', value: '14 kg' }],
      steps: ['Größe 95 cm fällt in den i-Size Bereich 61 bis 105 cm', 'Gruppe 1 Kleinkindsitz'],
      result: 'i-Size Kleinkindsitz bis 105 cm',
    },
    faqs: [
      { question: 'Bis zu welchem Alter gilt die Kindersitzpflicht in Deutschland?', answer: 'Nach § 21 Abs. 1a StVO müssen Kinder bis zum vollendeten 12. Lebensjahr oder bis zum Erreichen einer Körpergröße von 150 cm in einem amtlich genehmigten Kindersitz gesichert werden.' },
      { question: 'Sind einfache Sitzerhöhungen ohne Rückenlehne erlaubt?', answer: 'Nach neuer Norm dürfen einfache Sitzerhöhungen ohne Rückenlehne erst ab 125 cm Körpergröße und 22 kg Gewicht genutzt werden. Experten raten wegen des fehlenden Seitenaufprallschutzes dringend davon ab.' },
    ],
    relatedSlugs: ['kindes-endgroesse-rechner', 'bremsweg-rechner', 'erstausstattung-baby-rechner'],
  },

  {
    id: 'windelbudget-rechner',
    slug: 'windelbudget-rechner',
    name: 'Windel Rechner (Windelanzahl & Kosten bis zum Trockenwerden)',
    shortName: 'Windel Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Windel Rechner – Windelbedarf & Gesamtkosten in den ersten 3 Jahren',
    metaDescription: 'Berechnen Sie, wie viele Tausende Windeln Ihr Baby bis zum Trockenwerden verbraucht und wie viel Geld Sie für Einwegwindeln vs. Stoffwindeln ausgeben.',
    h1: 'Windel Rechner – Windelverbrauch & Windelkosten berechnen',
    shortDescription: 'Kalkuliert die Gesamtzahl an Windeln und Kosten über die gesamte Wickelzeit.',
    searchKeywords: ['windel rechner stueckzahl kosten', 'wie viele windeln braucht ein baby am tag', 'windelkosten 3 jahre pampers', 'stoffwindeln vs wegwerfwindeln kosten'],
    inputs: [
      { id: 'diapersPerDayYear1', label: 'Täglicher Windelbedarf im 1. Lebensjahr (ca. 6 bis 8 Windeln)', type: 'number', defaultValue: 7, min: 4, max: 12, step: 1, unit: 'Stück/Tag' },
      { id: 'diapersPerDayYear2to3', label: 'Täglicher Windelbedarf im 2. und 3. Jahr (ca. 4 bis 5 Windeln)', type: 'number', defaultValue: 5, min: 2, max: 8, step: 1, unit: 'Stück/Tag' },
      { id: 'costPerDiaper', label: 'Durchschnittspreis pro Einwegwindel (Marke/Eigenmarke ca. 0,18 € - 0,32 €)', type: 'number', defaultValue: 0.24, min: 0.10, max: 0.60, step: 0.01, unit: '€/Stück' },
    ],
    calculate: (inputs) => {
      const d1 = parseInt(inputs.diapersPerDayYear1, 10) || 7;
      const d23 = parseInt(inputs.diapersPerDayYear2to3, 10) || 5;
      const price = parseFloat(inputs.costPerDiaper) || 0.24;

      const totalYear1 = d1 * 365;
      const totalYear2to3 = d23 * 365 * 2;
      const totalDiapers = totalYear1 + totalYear2to3;
      const totalCost = totalDiapers * price;
      const monthlyAvg = totalCost / 36;

      return {
        primary: { id: 'totalCost', label: 'Gesamte Windelkosten in 3 Jahren', value: totalCost, formattedValue: formatCurrency(totalCost), highlight: true },
        secondary: [
          { id: 'totalDiapers', label: 'Gesamtzahl verbrauchter Windeln', value: totalDiapers, formattedValue: \`ca. \${formatNumber(totalDiapers, 0)} Windeln\` },
          { id: 'monthlyAvg', label: 'Durchschnittliche Kosten pro Monat', value: monthlyAvg, formattedValue: formatCurrency(monthlyAvg) },
          { id: 'clothSaving', label: 'Mögliche Ersparnis durch Stoffwindeln', value: totalCost - 450, formattedValue: formatCurrency(Math.max(0, totalCost - 450)) },
        ],
        summaryText: \`In den ersten drei Jahren verbraucht Ihr Kind rund \${formatNumber(totalDiapers, 0)} Windeln. Bei \${formatCurrency(price)} pro Windel summieren sich die Ausgaben auf ca. \${formatCurrency(totalCost)} (\${formatCurrency(monthlyAvg)} pro Monat).\`,
      };
    },
    formula: 'Gesamtkosten = [(Windeln/Tag Jahr 1 × 365) + (Windeln/Tag Jahre 2-3 × 730)] × Stückpreis',
    formulaExplanation: 'Neugeborene benötigen anfangs 7 bis 10 Windeln pro Tag. Mit zunehmendem Alter und Beikosteinführung sinkt die Wickelfrequenz auf 4 bis 5 Windeln täglich.',
    workedExample: {
      title: 'Beispiel: 7 Windeln im Jahr 1, 5 Windeln in Jahren 2-3 bei 0,24 € Stückpreis',
      inputValues: [{ label: 'Jahr 1', value: '7/Tag' }, { label: 'Jahre 2-3', value: '5/Tag' }, { label: 'Preis', value: '0,24 €' }],
      steps: ['Jahr 1 = 2.555 Windeln', 'Jahre 2 & 3 = 3.650 Windeln', 'Summe = 6.205 Windeln × 0,24 € ≈ 1.489,20 €'],
      result: '6.205 Windeln & ca. 1.489 €',
    },
    faqs: [
      { question: 'Lohnen sich Stoffwindeln finanziell?', answer: 'Ja, ein modernes Stoffwindel-Set kostet in der Anschaffung inklusive Wäsche rund 400 bis 500 Euro und spart über 1.000 Euro gegenüber Wegwerfwindeln (besonders bei mehreren Kindern).' },
      { question: 'Geben manche Städte einen Windelzuschuss?', answer: 'Ja, viele deutsche Kommunen und Landkreise bezuschussen den Kauf von Stoffwindeln oder stellen kostenlose Müllsäcke für Windelabfälle bereit.' },
    ],
    relatedSlugs: ['erstausstattung-baby-rechner', 'lebensmittelbudget-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'erstausstattung-baby-rechner',
    slug: 'erstausstattung-baby-rechner',
    name: 'Erstausstattung Baby Rechner (Kostenplan & Budget)',
    shortName: 'Baby Erstausstattung',
    category: 'familie-schwangerschaft',
    subcategory: 'Baby & Kind',
    metaTitle: 'Erstausstattung Baby Rechner – Was kostet die Baby-Erstausstattung?',
    metaDescription: 'Planen Sie die Kosten für die Baby-Erstausstattung: Kinderwagen, Babybett, Wickelkommode, Kleidung und Babyschale im Vergleich Neu vs. Gebraucht.',
    h1: 'Erstausstattung Baby Rechner – Kosten für die Erstausstattung planen',
    shortDescription: 'Kalkuliert die Anschaffungskosten für die Ankunft des ersten Kindes.',
    searchKeywords: ['erstausstattung baby rechner', 'was kostet erstausstattung baby durchschnitt', 'baby erstausstattung liste kosten', 'kinderwagen babybett kosten budget'],
    inputs: [
      {
        id: 'equipmentStandard',
        label: 'Ausstattungsstandard',
        type: 'select',
        defaultValue: 'smart_mix',
        options: [
          { value: 'used_thrifty', label: 'Sparsam / Hauptsächlich gebraucht & Flohmarkt (ca. 600 - 900 €)' },
          { value: 'smart_mix', label: 'Cleverer Mix aus Neuware (Sitz/Matratze) & Second-Hand (ca. 1.400 - 1.900 €)' },
          { value: 'premium_new', label: 'Marken-Neukauf / Premium Design (ca. 2.500 - 4.000 €)' },
        ],
      },
      { id: 'hasPresentsBudget', label: 'Geschenke-Budget von Großeltern & Verwandten', type: 'number', defaultValue: 500, min: 0, max: 3000, step: 100, unit: '€' },
    ],
    calculate: (inputs) => {
      const type = inputs.equipmentStandard || 'smart_mix';
      const gifts = parseFloat(inputs.hasPresentsBudget) || 500;

      let totalGrossCost = 1650;
      if (type === 'used_thrifty') totalGrossCost = 750;
      if (type === 'premium_new') totalGrossCost = 3200;

      const ownCost = Math.max(0, totalGrossCost - gifts);

      return {
        primary: { id: 'ownCost', label: 'Eigene Ausgaben für die Erstausstattung', value: ownCost, formattedValue: formatCurrency(ownCost), highlight: true },
        secondary: [
          { id: 'totalGrossCost', label: 'Gesamtwert aller Anschaffungen', value: totalGrossCost, formattedValue: formatCurrency(totalGrossCost) },
          { id: 'gifts', label: 'Übernommen von Familie / Geschenke', value: gifts, formattedValue: formatCurrency(gifts) },
        ],
        summaryText: \`Für die Baby-Erstausstattung (\${type === 'used_thrifty' ? 'Second Hand' : type === 'premium_new' ? 'Premium' : 'Cleverer Mix'}) fallen ca. \${formatCurrency(totalGrossCost)} an. Nach Abzug von \${formatCurrency(gifts)} Geschenken verbleiben für Sie \${formatCurrency(ownCost)}.\`,
      };
    },
    formula: 'Eigenanteil = Gesamtkosten Erstausstattung - Geschenke der Familie',
    formulaExplanation: 'Größte Einzelposten sind Kinderwagen (300 bis 1.200 €), Babyschale (150 bis 350 €) und Wickelkommode/Bett (250 bis 800 €).',
    workedExample: {
      title: 'Beispiel: Cleverer Mix bei 500 € Unterstützung durch Familie',
      inputValues: [{ label: 'Standard', value: 'Mix Neu/Gebraucht' }, { label: 'Geschenke', value: '500 €' }],
      steps: ['Gesamtkosten ca. 1.650 €', 'Abzug Geschenke: 1.650 € - 500 € = 1.150 €'],
      result: 'ca. 1.150,00 € Eigenkosten',
    },
    faqs: [
      { question: 'Gibt es finanzielle Hilfen für bedürftige Schwangere?', answer: 'Ja, über die Bundesstiftung "Mutter und Kind" oder das Jobcenter (§ 24 Abs. 3 SGB II) können Schwangere mit geringem Einkommen Zuschüsse von bis zu 1.000 € für die Erstausstattung erhalten.' },
      { question: 'Welche Dinge sollte man unbedingt neu kaufen?', answer: 'Auto-Babyschalen (wegen unbemerkter Unfallschäden bei gebrauchten Sitzen) und die Babymatratze sollten aus Sicherheits- und Hygiene-Gründen neu erworben werden.' },
    ],
    relatedSlugs: ['windelbudget-rechner', 'kindersitz-groesse-i-size-rechner', 'elterngeld-basis-plus-rechner'],
  },

  {
    id: 'kita-gebuehren-rechner',
    slug: 'kita-gebuehren-rechner',
    name: 'Kita-Gebühren Rechner (Kostenbeitrag nach Einkommen)',
    shortName: 'Kita-Gebühren Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Kita-Gebühren Rechner – Elternbeiträge nach Einkommen & Betreuungszeit',
    metaDescription: 'Ermitteln Sie die monatlichen Kita-Kosten für Krippe oder Kindergarten nach Familieneinkommen, Betreuungsstunden und Bundesland-Beitragsfreiheit.',
    h1: 'Kita-Gebühren Rechner – Monatliche Kita-Kosten ermitteln',
    shortDescription: 'Schätzt die einkommensabhängigen Elternbeiträge für die Kinderbetreuung.',
    searchKeywords: ['kita gebuehren rechner einkommen', 'kindergarten kosten pro monat tabelle', 'beitragsfreie kita bundeslaender', 'elternbeitrag krippe rechner'],
    inputs: [
      { id: 'familyGrossIncome', label: 'Gemeinsames jährliches Familienbruttoeinkommen', type: 'number', defaultValue: 65000, min: 20000, max: 200000, step: 5000, unit: '€' },
      {
        id: 'childAgeCategory',
        label: 'Alter des Kindes & Betreuungsart',
        type: 'select',
        defaultValue: 'kindergarten',
        options: [
          { value: 'krippe', label: 'Krippe / U3-Betreuung (unter 3 Jahren, meist höhere Gebühren)' },
          { value: 'kindergarten', label: 'Kindergarten / Ü3-Betreuung (3 Jahre bis Einschulung)' },
        ],
      },
      { id: 'hoursPerDay', label: 'Tägliche Betreuungszeit in Stunden', type: 'number', defaultValue: 8, min: 4, max: 10, step: 1, unit: 'Std./Tag' },
      { id: 'lunchCateringMonthly', label: 'Monatliches Essensgeld (Mittagessen)', type: 'number', defaultValue: 75, min: 0, max: 150, step: 5, unit: '€/Monat' },
    ],
    calculate: (inputs) => {
      const income = parseFloat(inputs.familyGrossIncome) || 65000;
      const isU3 = inputs.childAgeCategory === 'krippe';
      const hours = parseFloat(inputs.hoursPerDay) || 8;
      const lunch = parseFloat(inputs.lunchCateringMonthly) || 75;

      // Typische kommunale Einkommensstaffel in Deutschland:
      // Krippe: ca. 4 % bis 6 % des Monatseinkommens
      // Kindergarten: ca. 2,5 % bis 4 % (in mehreren Bundesländern wie Berlin, Hamburg, Hessen, RP, Nds ganz oder teilweise beitragsfrei!)
      const monthlyGross = income / 12;
      let feePct = isU3 ? 0.045 : 0.030;
      const hoursFactor = hours / 8;
      const baseFee = monthlyGross * feePct * hoursFactor;
      const totalMonthlyCost = baseFee + lunch;

      return {
        primary: { id: 'totalMonthlyCost', label: 'Monatliche Kita-Gesamtkosten (inkl. Essen)', value: totalMonthlyCost, formattedValue: formatCurrency(totalMonthlyCost), highlight: true },
        secondary: [
          { id: 'baseFee', label: 'Reiner Betreuungsbeitrag', value: baseFee, formattedValue: formatCurrency(baseFee) },
          { id: 'lunch', label: 'Verpflegungsgeld (Essen)', value: lunch, formattedValue: formatCurrency(lunch) },
          { id: 'yearlyCost', label: 'Gesamtkosten pro Jahr', value: totalMonthlyCost * 12, formattedValue: formatCurrency(totalMonthlyCost * 12) },
        ],
        summaryText: \`Bei einem Einkommen von \${formatCurrency(income)} zahlen Sie ca. \${formatCurrency(totalMonthlyCost)} monatlich für den Kita-Platz (\${formatCurrency(baseFee)} Betreuung + \${formatCurrency(lunch)} Verpflegung).\`,
      };
    },
    formula: 'Kita-Kosten = Einkommensabhängiger Staffelbeitrag + Essensgeld',
    formulaExplanation: 'In Deutschland legen Städte und Gemeinden die Kita-Gebühren autonom fest. In Berlin, Hamburg, Rheinland-Pfalz, Hessen und Niedersachsen sind die Betreuungsbeiträge für Ü3-Kinder ganz oder stundenweise beitragsfrei.',
    workedExample: {
      title: 'Beispiel: 65.000 € Familieneinkommen, Kindergarten ganztags (8h)',
      inputValues: [{ label: 'Einkommen', value: '65.000 €' }, { label: 'Betreuung', value: '8 Stunden' }],
      steps: ['Monatsbrutto ≈ 5.417 €', 'Betreuungsbeitrag ≈ 162,50 €', 'Essensgeld ≈ 75,00 €', 'Gesamt = 237,50 €/Monat'],
      result: 'ca. 237,50 € monatlich',
    },
    faqs: [
      { question: 'Kann man Kita-Kosten von der Steuer absetzen?', answer: 'Ja! Nach § 10 Abs. 1 Nr. 5 EStG können zwei Drittel der reinen Betreuungskosten (ohne Essen), maximal 4.000 € pro Kind und Jahr, als Sonderausgaben abgesetzt werden.' },
      { question: 'Besteht ein Rechtsanspruch auf einen Kita-Platz?', answer: 'Ja, nach § 24 SGB VIII hat jedes Kind ab dem vollendeten 1. Lebensjahr bis zum Schuleintritt einen bundesweiten Rechtsanspruch auf frühkindliche Förderung in einer Kita oder Tagespflege.' },
    ],
    relatedSlugs: ['kinderbetreuungskosten-absetzen-rechner', 'kindergeld-rechner-2026', 'brutto-netto-rechner'],
  },

  {
    id: 'betreuungsgeld-familiengeld-rechner',
    slug: 'betreuungsgeld-familiengeld-rechner',
    name: 'Familiengeld Rechner (Bayern & Landeserziehungsgeld)',
    shortName: 'Familiengeld Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Familiengeld Rechner – Bayerisches Familiengeld (250 € / 300 €)',
    metaDescription: 'Berechnen Sie Ihren Anspruch auf das Bayerische Familiengeld: 250 € monatlich für das 1. und 2. Kind, 300 € ab dem 3. Kind im 2. und 3. Lebensjahr.',
    h1: 'Familiengeld Rechner – Landesfamiliengeld Bayern berechnen',
    shortDescription: 'Ermittelt das Familiengeld im 13. bis 36. Lebensmonat nach Bundesland.',
    searchKeywords: ['bayerisches familiengeld rechner', 'familiengeld bayern anspruch 250 euro', 'landeserziehungsgeld rechner', 'familiengeld wie lange ausgezahlt'],
    inputs: [
      { id: 'childOrder', label: 'Zählung des Kindes in der Familie', type: 'select', defaultValue: 'first_second', options: [
        { value: 'first_second', label: '1. oder 2. Kind (250 € pro Monat)' },
        { value: 'third_plus', label: 'Ab dem 3. Kind (300 € pro Monat)' },
      ]},
      { id: 'monthsClaimed', label: 'Bezugsdauer in Monaten (13. bis 36. Lebensmonat = max. 24 Monate)', type: 'number', defaultValue: 24, min: 1, max: 24, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const isThirdPlus = inputs.childOrder === 'third_plus';
      const months = parseInt(inputs.monthsClaimed, 10) || 24;

      const monthlyRate = isThirdPlus ? 300 : 250;
      const totalPayout = monthlyRate * months;

      return {
        primary: { id: 'monthlyRate', label: 'Monatlicher Familiengeld-Auszahlungsbetrag', value: monthlyRate, formattedValue: formatCurrency(monthlyRate), highlight: true },
        secondary: [
          { id: 'totalPayout', label: \`Gesamtbetrag über \${months} Monate\`, value: totalPayout, formattedValue: formatCurrency(totalPayout) },
          { id: 'period', label: 'Förderzeitraum', value: 0, formattedValue: 'Vom 13. bis zum 36. Lebensmonat' },
        ],
        summaryText: \`In Bayern erhalten Eltern für dieses Kind monatlich \${formatCurrency(monthlyRate)} Familiengeld. Über die vollen 24 Monate summiert sich die staatliche Leistung auf \${formatCurrency(totalPayout)}.\`,
      };
    },
    formula: 'Gesamtanspruch = Monatssatz (250 € bzw. 300 €) × Bezugsmonate (max. 24)',
    formulaExplanation: 'Das Bayerische Familiengeld wird unabhängig vom Einkommen und unabhängig davon gezahlt, ob das Kind eine Kita besucht oder zu Hause betreut wird.',
    workedExample: {
      title: 'Beispiel: 1. Kind in Bayern für 24 Monate',
      inputValues: [{ label: 'Kind', value: '1. Kind' }, { label: 'Dauer', value: '24 Monate' }],
      steps: ['250,00 € monatlich', '24 Monate × 250,00 € = 6.000,00 € gesamt'],
      result: '6.000,00 € Gesamtförderung',
    },
    faqs: [
      { question: 'Muss man in Bayern einen Antrag stellen?', answer: 'Wer bereits Elterngeld in Bayern bezogen hat, muss keinen Antrag stellen – das Familiengeld wird vom Zentrum Bayern Familie und Soziales (ZBFS) automatisch ausgezahlt.' },
      { question: 'Wird das Familiengeld auf das Bürgergeld angerechnet?', answer: 'Ja, nach der Rechtsprechung wird das Familiengeld als Einkommen auf Bürgergeld-Leistungen angerechnet.' },
    ],
    relatedSlugs: ['elterngeld-basis-plus-rechner', 'kindergeld-rechner-2026', 'kinderzuschlag-kiz-rechner'],
  },

  {
    id: 'taschengeld-empfehlung-rechner',
    slug: 'taschengeld-empfehlung-rechner',
    name: 'Taschengeld Rechner (Empfehlung der Jugendämter nach Alter)',
    shortName: 'Taschengeld Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Taschengeld Rechner 2026 – Offizielle Taschengeldtabelle des Jugendamts',
    metaDescription: 'Ermitteln Sie die offizielle Taschengeldempfehlung des Deutschen Jugendinstituts (DJI) und der Jugendämter nach Lebensalter des Kindes.',
    h1: 'Taschengeld Rechner – Wie viel Taschengeld nach Alter?',
    shortDescription: 'Berechnet das empfohlene Taschengeld und Budgetgeld für Kinder und Jugendliche von 4 bis 18 Jahren.',
    searchKeywords: ['taschengeld rechner alter tabelle', 'taschengeldtabelle jugendamt 2026', 'wie viel taschengeld mit 12 jahren', 'budgetgeld kleidung jugendliche'],
    inputs: [
      { id: 'childAgeYears', label: 'Alter des Kindes in Jahren (4 bis 18 Jahre)', type: 'number', defaultValue: 12, min: 4, max: 18, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const age = parseInt(inputs.childAgeYears, 10) || 12;

      // Offizielle DJI-Taschengeldtabelle:
      let amount = 22;
      let interval = 'pro Monat';
      let clothingBudget = 0;

      if (age <= 5) { amount = 0.50; interval = 'pro Woche (ca. 2 €/Monat)'; }
      else if (age === 6) { amount = 1.50; interval = 'pro Woche (ca. 6 €/Monat)'; }
      else if (age === 7) { amount = 2.00; interval = 'pro Woche (ca. 8 €/Monat)'; }
      else if (age === 8) { amount = 2.50; interval = 'pro Woche (ca. 10 €/Monat)'; }
      else if (age === 9) { amount = 3.00; interval = 'pro Woche (ca. 12 €/Monat)'; }
      else if (age === 10) { amount = 16.00; interval = 'pro Monat'; }
      else if (age === 11) { amount = 18.50; interval = 'pro Monat'; }
      else if (age === 12) { amount = 22.00; interval = 'pro Monat'; }
      else if (age === 13) { amount = 26.00; interval = 'pro Monat'; }
      else if (age === 14) { amount = 31.00; interval = 'pro Monat'; clothingBudget = 40; }
      else if (age === 15) { amount = 38.00; interval = 'pro Monat'; clothingBudget = 45; }
      else if (age === 16) { amount = 47.00; interval = 'pro Monat'; clothingBudget = 50; }
      else if (age === 17) { amount = 62.00; interval = 'pro Monat'; clothingBudget = 55; }
      else { amount = 78.00; interval = 'pro Monat'; clothingBudget = 60; }

      return {
        primary: { id: 'amount', label: 'Empfohlenes Taschengeld', value: amount, formattedValue: \`\${formatCurrency(amount)} \${interval}\`, highlight: true },
        secondary: [
          { id: 'clothingBudget', label: 'Zusätzliches Budgetgeld (Kleidung/Handy)', value: clothingBudget, formattedValue: clothingBudget > 0 ? \`ca. \${formatCurrency(clothingBudget)} / Monat\` : 'Noch nicht empfohlen' },
          { id: 'yearlyTotal', label: 'Jahresbetrag Taschengeld', value: (age < 10 ? amount * 52 : amount * 12), formattedValue: formatCurrency(age < 10 ? amount * 52 : amount * 12) },
        ],
        summaryText: \`Für ein \${age}-jähriges Kind empfiehlt das Jugendamt ca. \${formatCurrency(amount)} \${interval}. \${clothingBudget > 0 ? \`Ab diesem Alter wird zusätzlich ein Budgetgeld von ca. \${formatCurrency(clothingBudget)}/Monat für eigene Kleidung empfohlen.\` : ''}\`,
      };
    },
    formula: 'Empfehlung nach der amtlichen Taschengeldtabelle des Deutschen Jugendinstituts (DJI)',
    formulaExplanation: 'Bis zum Alter von 9 Jahren sollte Taschengeld wöchentlich ausgezahlt werden, da Kinder längere Zeiträume noch nicht überblicken können. Ab 10 Jahren wird auf monatliche Auszahlung umgestellt.',
    workedExample: {
      title: 'Beispiel: 12-jähriges Kind',
      inputValues: [{ label: 'Alter', value: '12 Jahre' }],
      steps: ['Empfehlung DJI für 12 Jahre: 21,00 bis 23,50 € monatlich', 'Mittelwert = 22,00 € pro Monat'],
      result: 'ca. 22,00 € pro Monat',
    },
    faqs: [
      { question: 'Darf man Taschengeld als Strafe kürzen?', answer: 'Pädagogen raten dringend davon ab: Taschengeld ist ein pädagogisches Lernmittel zum Umgang mit Geld und sollte niemals als Erziehungsstrafe für schlechte Noten oder Unordnung entzogen werden.' },
      { question: 'Was ist Budgetgeld?', answer: 'Budgetgeld ist Geld, das Jugendliche ab ca. 14 Jahren eigenverantwortlich für feste Bedarfe wie Kleidung, Schulmaterial oder Handytarife verwalten.' },
    ],
    relatedSlugs: ['lebensmittelbudget-rechner', 'kindergeld-rechner-2026', 'schulbedarfspaket-bu-t-rechner'],
  },

  {
    id: 'schulbedarfspaket-bu-t-rechner',
    slug: 'schulbedarfspaket-bu-t-rechner',
    name: 'Schulbedarfspaket Rechner (Bildung & Teilhabe BuT 195 €)',
    shortName: 'Schulbedarf BuT',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Schulbedarfspaket Rechner – 195 € Zuschuss für Schulmaterial nach BuT',
    metaDescription: 'Berechnen Sie den gesetzlichen Zuschuss für persönliches Schulmaterial (195 € pro Schuljahr) aus dem Bildungs- und Teilhabepaket (BuT) bei Bürgergeld, KiZ oder Wohngeld.',
    h1: 'Schulbedarfspaket Rechner – Zuschuss für Schulhefte, Ranzen & Stifte',
    shortDescription: 'Ermittelt die Auszahlungsbeträge für Schulbedarf nach § 28 Abs. 3 SGB II.',
    searchKeywords: ['schulbedarfspaket rechner but 195 euro', 'bildung und teilhabe schulbedarf august februar', 'zuschuss schulmaterial bürgergeld kinderzuschlag', 'schulgeld auszahlungstermine'],
    inputs: [
      { id: 'schoolKidsCount', label: 'Anzahl schulpflichtiger Kinder im Haushalt', type: 'number', defaultValue: 2, min: 1, max: 8, step: 1 },
    ],
    calculate: (inputs) => {
      const kids = parseInt(inputs.schoolKidsCount, 10) || 2;

      // Gesetzlicher Satz Schulbedarfspaket: 195 € pro Schuljahr je Kind
      // Aufgeteilt in: 130 € im August (1. Schulhalbjahr) + 65 € im Februar (2. Schulhalbjahr)
      const perYearPerChild = 195;
      const augustPerChild = 130;
      const febPerChild = 65;

      const totalYear = kids * perYearPerChild;
      const totalAugust = kids * augustPerChild;
      const totalFeb = kids * febPerChild;

      return {
        primary: { id: 'totalYear', label: 'Gesamter Schulbedarf-Zuschuss pro Schuljahr', value: totalYear, formattedValue: formatCurrency(totalYear), highlight: true },
        secondary: [
          { id: 'totalAugust', label: 'Auszahlung im August (1. Halbjahr)', value: totalAugust, formattedValue: formatCurrency(totalAugust) },
          { id: 'totalFeb', label: 'Auszahlung im Februar (2. Halbjahr)', value: totalFeb, formattedValue: formatCurrency(totalFeb) },
          { id: 'perKid', label: 'Betrag pro Schüler', value: perYearPerChild, formattedValue: '195,00 € / Schuljahr' },
        ],
        summaryText: \`Für Ihre \${kids} Schulkinder erhalten Sie aus dem Bildungs- und Teilhabepaket insgesamt \${formatCurrency(totalYear)} pro Schuljahr (\${formatCurrency(totalAugust)} zum Schulstart im August und \${formatCurrency(totalFeb)} zum Halbjahr im Februar).\`,
      };
    },
    formula: 'Schulbedarf = Kinder × 195 € (130 € zum 1. August + 65 € zum 1. Februar)',
    formulaExplanation: 'Anspruchsberechtigt sind Familien, die Bürgergeld, Kinderzuschlag, Wohngeld, Sozialhilfe oder Asylbewerberleistungen beziehen (§ 28 Abs. 3 SGB II / § 6b BKGG).',
    workedExample: {
      title: 'Beispiel: 2 Schulkinder bei Bezug von Kinderzuschlag oder Wohngeld',
      inputValues: [{ label: 'Kinder', value: '2 Schüler' }],
      steps: ['August-Auszahlung: 2 × 130 € = 260 €', 'Februar-Auszahlung: 2 × 65 € = 130 €', 'Summe pro Schuljahr = 390 €'],
      result: '390,00 € Gesamtzuschuss',
    },
    faqs: [
      { question: 'Muss man für das Schulbedarfspaket Rechnungen vorlegen?', answer: 'Nein, es handelt sich um eine Pauschale. Nachweise über konkrete Einkäufe müssen in der Regel nicht beim Jobcenter oder der Stadt eingereicht werden.' },
      { question: 'Gibt es weitere BuT-Leistungen für Schüler?', answer: 'Ja, zusätzlich werden Kosten für Schulausflüge, Klassenfahrten, die Schülerfahrkarte, Nachhilfe (Lernförderung) und das gemeinsame Schulmittagessen übernommen.' },
    ],
    relatedSlugs: ['kinderzuschlag-kiz-rechner', 'buergergeld-anspruch-rechner', 'taschengeld-empfehlung-rechner'],
  },

  {
    id: 'kinderkrankentage-kinderkrankengeld-rechner',
    slug: 'kinderkrankentage-kinderkrankengeld-rechner',
    name: 'Kinderkrankengeld Rechner (Kinderkrankentage nach § 45 SGB V)',
    shortName: 'Kinderkrankengeld Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Kinderkrankengeld Rechner 2026 – Tage & Auszahlung (§ 45 SGB V)',
    metaDescription: 'Berechnen Sie Anspruch auf Kinderkrankentage (15 Tage pro Elternteil, 30 Tage für Alleinerziehende) und die Auszahlungshöhe des Kinderkrankengeldes (ca. 90 % Netto).',
    h1: 'Kinderkrankengeld Rechner – Freistellung & Krankengeld bei Kindeserkrankung',
    shortDescription: 'Ermittelt Freistellungstage und Krankengeldhöhe bei Pflege eines erkrankten Kindes.',
    searchKeywords: ['kinderkrankengeld rechner sgb v', 'kinderkrankentage 2026 wie viele tage', 'kind krank lohnfortzahlung wie viel netto', 'paragraph 45 sgb v kinderkrankengeld'],
    inputs: [
      { id: 'monthlyNetIncome', label: 'Ihr monatliches Nettogehalt', type: 'number', defaultValue: 2400, min: 500, step: 100, unit: '€' },
      { id: 'sickDaysClaimed', label: 'Genommene Kinderkrankentage im Kalendermonat', type: 'number', defaultValue: 5, min: 1, max: 30, step: 1, unit: 'Tage' },
      {
        id: 'parentStatus',
        label: 'Familienstatus',
        type: 'select',
        defaultValue: 'couple',
        options: [
          { value: 'couple', label: 'Elternpaar (15 Arbeitstage pro Elternteil / max. 35 Tage bei mehreren Kindern)' },
          { value: 'single', label: 'Alleinerziehend (30 Arbeitstage pro Kind / max. 70 Tage bei mehreren Kindern)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.monthlyNetIncome) || 2400;
      const days = parseInt(inputs.sickDaysClaimed, 10) || 5;
      const isSingle = inputs.parentStatus === 'single';

      // Kinderkrankengeld beträgt ca. 90 % des ausgefallenen Nettoentgelts
      const dailyNet = net / 30;
      const dailyKinderkrankengeld = dailyNet * 0.90;
      const totalPayout = dailyKinderkrankengeld * days;
      const maxDaysAllowed = isSingle ? 30 : 15;

      return {
        primary: { id: 'totalPayout', label: \`Kinderkrankengeld für \${days} Tage\`, value: totalPayout, formattedValue: formatCurrency(totalPayout), highlight: true },
        secondary: [
          { id: 'dailyRate', label: 'Tägliches Kinderkrankengeld (ca. 90 % Netto)', value: dailyKinderkrankengeld, formattedValue: formatCurrency(dailyKinderkrankengeld) },
          { id: 'maxDays', label: 'Maximaler Jahresanspruch je Kind', value: maxDaysAllowed, formattedValue: \`\${maxDaysAllowed} Arbeitstage\` },
        ],
        summaryText: \`Für \${days} Kinderkrankentage zahlt die gesetzliche Krankenkasse ca. \${formatCurrency(totalPayout)} (\${formatCurrency(dailyKinderkrankengeld)}/Tag). Sie haben pro Kalenderjahr Anspruch auf bis zu \${maxDaysAllowed} Tage.\`,
      };
    },
    formula: 'Kinderkrankengeld = Ausgefallenes Nettoentgelt pro Tag × 90 % × Krankheitstage',
    formulaExplanation: 'Nach § 45 SGB V haben gesetzlich versicherte Eltern einen Freistellungsanspruch gegen den Arbeitgeber und Anspruch auf Krankengeld zur Pflege eines erkrankten Kindes unter 12 Jahren.',
    workedExample: {
      title: 'Beispiel: 5 Tage Kind krank bei 2.400 € Netto',
      inputValues: [{ label: 'Nettogehalt', value: '2.400 €' }, { label: 'Tage', value: '5 Tage' }],
      steps: ['Netto pro Tag = 2.400 € / 30 = 80,00 €', '90 % Satz = 72,00 €/Tag', '5 Tage × 72,00 € = 360,00 € Kinderkrankengeld'],
      result: '360,00 € Kinderkrankengeld',
    },
    faqs: [
      { question: 'Bis zu welchem Alter des Kindes gibt es Kinderkrankengeld?', answer: 'Das Kind darf das 12. Lebensjahr noch nicht vollendet haben (gilt bis zum 12. Geburtstag). Für Kinder mit Behinderung gilt keine Altersgrenze.' },
      { question: 'Darf der Arbeitgeber die Freistellung verweigern?', answer: 'Nein, nach § 45 Abs. 3 SGB V hat der Arbeitnehmer einen gesetzlichen Anspruch auf unbezahlte Freistellung von der Arbeit.' },
    ],
    relatedSlugs: ['krankengeld-rechner', 'brutto-netto-rechner', 'urlaubstage-rechner'],
  },

  {
    id: 'grosselternzeit-rechner',
    slug: 'grosselternzeit-rechner',
    name: 'Großelternzeit Rechner (Freistellung nach BEEG § 15)',
    shortName: 'Großelternzeit Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Familie & Freizeit',
    metaTitle: 'Großelternzeit Rechner – Gesetzlicher Freistellungsanspruch für Großeltern',
    metaDescription: 'Prüfen Sie die Voraussetzungen und Fristen für Großelternzeit nach § 15 Abs. 1a BEEG: Gesetzliche Freistellung von der Arbeit zur Betreuung des Enkelkindes.',
    h1: 'Großelternzeit Rechner – Freistellung für Oma & Opa ermitteln',
    shortDescription: 'Prüft die rechtlichen Voraussetzungen für die Freistellung von Großeltern.',
    searchKeywords: ['grosselternzeit rechner beeg', 'grosselternzeit voraussetzungen paragraph 15 beeg', 'koennen grosseltern elternzeit nehmen', 'kuendigungsschutz grosselternzeit'],
    inputs: [
      {
        id: 'livingInHousehold',
        label: 'Lebt das Enkelkind mit dem Großelternteil im selben Haushalt?',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Ja, gemeinsamer Haushalt' },
          { value: 'no', label: 'Nein, getrennte Haushalte' },
        ],
      },
      {
        id: 'parentCondition',
        label: 'Situation der Eltern des Kindes',
        type: 'select',
        defaultValue: 'minor_or_training',
        options: [
          { value: 'minor_or_training', label: 'Ein Elternteil ist minderjährig oder in Ausbildung / Studium' },
          { value: 'regular_employed', label: 'Beide Eltern sind volljährig und normal berufstätig' },
        ],
      },
      { id: 'plannedMonths', label: 'Geplante Dauer der Großelternzeit in Monaten (max. 36 Monate)', type: 'number', defaultValue: 12, min: 1, max: 36, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const inHousehold = inputs.livingInHousehold === 'yes';
      const cond = inputs.parentCondition === 'minor_or_training';
      const months = parseInt(inputs.plannedMonths, 10) || 12;

      const eligible = inHousehold && cond;

      return {
        primary: { id: 'status', label: 'Rechtsanspruch auf Großelternzeit nach § 15 BEEG', value: 0, formattedValue: eligible ? 'Rechtsanspruch besteht!' : 'Kein gesetzlicher Anspruch (nur mit Zustimmung AG)', highlight: true },
        secondary: [
          { id: 'maxDuration', label: 'Maximale Freistellungsdauer', value: 36, formattedValue: 'Bis zu 36 Monate je Enkelkind' },
          { id: 'protection', label: 'Kündigungsschutz', value: 0, formattedValue: eligible ? 'Voller Kündigungsschutz während der Auszeit' : 'Kein gesetzlicher Kündigungsschutz' },
          { id: 'noticeTerm', label: 'Anmeldefrist beim Arbeitgeber', value: 7, formattedValue: '7 Wochen vor Beginn schriftlich' },
        ],
        summaryText: eligible
          ? \`Da das Enkelkind im Haushalt lebt und ein Elternteil minderjährig oder in Ausbildung ist, haben Sie einen Rechtsanspruch auf bis zu 36 Monate Großelternzeit inklusive vollem Kündigungsschutz!\`
          : 'Ein gesetzlicher Rechtsanspruch nach § 15 Abs. 1a BEEG besteht nur bei gemeinsamem Haushalt und Ausbildung/Minderjährigkeit der Eltern. Andernfalls kann eine Auszeit nur einvernehmlich mit dem Arbeitgeber vereinbart werden.',
      };
    },
    formula: 'Prüfung der Kriterien nach § 15 Abs. 1a BEEG',
    formulaExplanation: 'Großeltern können nach dem BEEG die Betreuung übernehmen und sich freistellen lassen, wenn das Elternteil selbst noch minderjährig ist oder sich in Ausbildung befindet.',
    workedExample: {
      title: 'Beispiel: Oma betreut Enkel, während Tochter ihr Abitur macht',
      inputValues: [{ label: 'Haushalt', value: 'Gemeinsam' }, { label: 'Eltern', value: 'In Ausbildung' }],
      steps: ['Bedingungen nach § 15 Abs. 1a BEEG vollständig erfüllt', 'Schriftliche Anmeldung 7 Wochen vor Beginn beim Chef'],
      result: 'Rechtsanspruch auf Großelternzeit bewilligt',
    },
    faqs: [
      { question: 'Erhalten Großeltern auch Elterngeld?', answer: 'Nein, Großeltern haben keinen Anspruch auf Elterngeld. Die Großelternzeit ist eine unbezahlte Freistellung von der Arbeit.' },
      { question: 'Darf man während der Großelternzeit in Teilzeit arbeiten?', answer: 'Ja, Großeltern dürfen während der Auszeit bis zu 32 Wochenstunden in Teilzeit arbeiten.' },
    ],
    relatedSlugs: ['elternzeit-teilzeit-rechner', 'sabbatical-rechner', 'kuendigungsfrist-arbeitnehmer-rechner'],
  },

  {
    id: 'unterhalt-volljaehrige-kinder-rechner',
    slug: 'unterhalt-volljaehrige-kinder-rechner',
    name: 'Unterhalt volljährige Kinder Rechner (Studium & eigene Wohnung)',
    shortName: 'Volljährigenunterhalt',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Unterhalt volljährige Kinder Rechner 2026 – Studium & eigene Bude',
    metaDescription: 'Berechnen Sie den Unterhaltsanspruch für volljährige Kinder (Studenten, Azubis) nach der Düsseldorfer Tabelle 2026 (fester Regelsatz 930 € bei eigener Wohnung).',
    h1: 'Unterhalt für volljährige Kinder – Studentenunterhalt berechnen',
    shortDescription: 'Ermittelt den Unterhaltsbedarf von volljährigen Kindern mit eigenem Hausstand.',
    searchKeywords: ['unterhalt volljaehrige kinder rechner', 'studentenunterhalt 930 euro duesseldorfer tabelle', 'unterhalt student eigene wohnung berechnen', 'haftungsquote eltern volljahrigenunterhalt'],
    inputs: [
      {
        id: 'livingArrangement',
        label: 'Wohnsituation des volljährigen Kindes',
        type: 'select',
        defaultValue: 'own_household',
        options: [
          { value: 'own_household', label: 'Eigene Wohnung / WG / Studentenwohnheim (fester Satz: 930 €/Monat)' },
          { value: 'with_parents', label: 'Wohnt noch bei einem Elternteil (4. Altersstufe nach Tabelle)' },
        ],
      },
      { id: 'childOwnIncome', label: 'Eigenes Einkommen des Kindes (z. B. BAföG, Minijob, Ausbildungsvergütung)', type: 'number', defaultValue: 0, min: 0, max: 1500, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const isOwn = inputs.livingArrangement === 'own_household';
      const ownIncome = parseFloat(inputs.childOwnIncome) || 0;

      // Düsseldorfer Tabelle: Fester Bedarf für Studenten mit eigenem Hausstand = 930 € (inkl. 410 € Warmmiete)
      const baseNeed = isOwn ? 930 : 689;
      // Bei Volljährigen wird das volle Kindergeld (250 €) in voller Höhe bedarfsdeckend abgezogen!
      const kindergeldDeduction = 250;
      const netNeedAfterKindergeld = Math.max(0, baseNeed - kindergeldDeduction);
      const finalParentsShare = Math.max(0, netNeedAfterKindergeld - ownIncome);

      return {
        primary: { id: 'finalParentsShare', label: 'Restlicher Unterhaltsanspruch gegen beide Eltern', value: finalParentsShare, formattedValue: formatCurrency(finalParentsShare), highlight: true },
        secondary: [
          { id: 'baseNeed', label: 'Gesamtbedarf nach Düsseldorfer Tabelle', value: baseNeed, formattedValue: formatCurrency(baseNeed) },
          { id: 'kindergeld', label: 'Abzug volles Kindergeld (fließt an das Kind)', value: kindergeldDeduction, formattedValue: '250,00 €' },
          { id: 'ownIncome', label: 'Angerechnetes eigenes Einkommen', value: ownIncome, formattedValue: formatCurrency(ownIncome) },
        ],
        summaryText: \`Der Gesamtbedarf des Kindes liegt bei \${formatCurrency(baseNeed)}. Nach Abzug von \${formatCurrency(kindergeldDeduction)} Kindergeld und \${formatCurrency(ownIncome)} Eigenanteil müssen beide Elternteile gemeinsam noch \${formatCurrency(finalParentsShare)} monatlich aufbringen.\`,
      };
    },
    formula: 'Zahlbetrag = 930 € (bei eigener Bude) - 250 € Kindergeld - eigenes Einkommen',
    formulaExplanation: 'Volljährige Kinder sind für ihren Unterhalt selbst verantwortlich, solange sie in Ausbildung sind. Beide Elternteile haften anteilig nach ihren Einkommensverhältnissen (Haftungsquote).',
    workedExample: {
      title: 'Beispiel: Student mit eigener Wohnung ohne eigenes Einkommen',
      inputValues: [{ label: 'Wohnen', value: 'Eigene Wohnung (930 €)' }, { label: 'Einkommen', value: '0 €' }],
      steps: ['Bedarf = 930,00 €', 'Abzug volles Kindergeld = 250,00 €', 'Restlicher Unterhalt der Eltern = 680,00 €/Monat'],
      result: '680,00 € monatlicher Elternunterhalt',
    },
    faqs: [
      { question: 'Haften beide Eltern barunterhaltspflichtig?', answer: 'Ja, ab dem 18. Geburtstag sind beide Elternteile barunterhaltspflichtig, auch der Elternteil, bei dem das Kind bisher gewohnt hat.' },
      { question: 'Wird BAföG auf den Unterhalt angerechnet?', answer: 'Ja, BAföG-Zahlungen (auch als Darlehen) gelten als Einkommen des Kindes und mindern den Unterhaltsanspruch gegen die Eltern Euro für Euro.' },
    ],
    relatedSlugs: ['duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026', 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner'],
  },

  {
    id: 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
    slug: 'ausbildungsunterhalt-bedarfskontrollbetrag-rechner',
    name: 'Ausbildungsvergütung Anrechnung Rechner (Kindesunterhalt)',
    shortName: 'Ausbildungsunterhalt Rechner',
    category: 'familie-schwangerschaft',
    subcategory: 'Elterngeld & Finanzen',
    metaTitle: 'Ausbildungsunterhalt Rechner – Ausbildungsvergütung auf Unterhalt anrechnen',
    metaDescription: 'Berechnen Sie, wie viel der Ausbildungsvergütung auf den Kindesunterhalt angerechnet wird (nach Abzug von 100 € ausbildungsbedingtem Mehrbedarf).',
    h1: 'Ausbildungsunterhalt Rechner – Azubi-Vergütung auf Unterhalt anrechnen',
    shortDescription: 'Kalkuliert die Minderung des Kindesunterhalts durch eigenes Azubi-Gehalt.',
    searchKeywords: ['ausbildungsunterhalt rechner azubigehalt', 'anrechnung lehrlingsentschaedigung unterhalt', 'ausbildungsbedingter mehrbedarf 100 euro', 'wie viel unterhalt bekommt azubi von eltern'],
    inputs: [
      { id: 'netApprenticeSalary', label: 'Netto-Ausbildungsvergütung des Kindes im Monat', type: 'number', defaultValue: 750, min: 200, max: 1500, step: 25, unit: '€' },
      { id: 'baseChildSupport', label: 'Bisheriger Tabellenunterhalt der Eltern vor Ausbildungsbeginn', type: 'number', defaultValue: 620, min: 300, max: 1200, step: 20, unit: '€' },
    ],
    calculate: (inputs) => {
      const salary = parseFloat(inputs.netApprenticeSalary) || 750;
      const baseSupport = parseFloat(inputs.baseChildSupport) || 620;

      // Gesetzlicher Abzug: Ausbildungsbedingter Mehrbedarf (Pauschale für Fachbücher, Kleidung, Fahrt) = 100 €
      const allowance = 100;
      const countedSalary = Math.max(0, salary - allowance);
      const reducedSupport = Math.max(0, baseSupport - countedSalary);
      const moneySavedParents = baseSupport - reducedSupport;

      return {
        primary: { id: 'reducedSupport', label: 'Verbleibender Unterhaltsanspruch gegen die Eltern', value: reducedSupport, formattedValue: formatCurrency(reducedSupport), highlight: true },
        secondary: [
          { id: 'countedSalary', label: 'Anrechenbare Ausbildungsvergütung', value: countedSalary, formattedValue: formatCurrency(countedSalary) },
          { id: 'allowance', label: 'Ausbildungsbedingter Mehrbedarf (Freibetrag)', value: allowance, formattedValue: '100,00 €' },
          { id: 'childTotalBudget', label: 'Gesamteinkommen des Azubis (Lohn + Unterhalt)', value: salary + reducedSupport, formattedValue: formatCurrency(salary + reducedSupport) },
        ],
        summaryText: \`Von \${formatCurrency(salary)} Ausbildungsvergütung werden nach Abzug des 100-€-Mehrbedarfs \${formatCurrency(countedSalary)} auf den Unterhalt angerechnet. Die Eltern zahlen noch \${formatCurrency(reducedSupport)} (Ersparnis: \${formatCurrency(moneySavedParents)}/Monat).\`,
      };
    },
    formula: 'Anrechenbares Einkommen = Netto-Vergütung - 100 € ausbildungsbedingte Aufwendungen',
    formulaExplanation: 'Nach ständiger Rechtsprechung der Familiengerichte darf der Auszubildende eine Pauschale von 100 Euro monatlich für berufsbedingte Kosten behalten. Der Rest mindert den Unterhaltsbedarf.',
    workedExample: {
      title: 'Beispiel: 750 € Nettovergütung bei 620 € Unterhaltsanspruch',
      inputValues: [{ label: 'Vergütung', value: '750 €' }, { label: 'Unterhalt', value: '620 €' }],
      steps: ['Freibetrag = 100 €', 'Anrechenbar: 750 € - 100 € = 650 €', 'Da 650 € > 620 € liegt, entfällt der Barunterhalt der Eltern komplett!'],
      result: '0,00 € Unterhalt (Kind deckt Bedarf selbst)',
    },
    faqs: [
      { question: 'Müssen Eltern weiter Unterhalt zahlen, wenn das Azubigehalt reicht?', answer: 'Nein, wenn die anrechenbare Ausbildungsvergütung plus Kindergeld den Lebensbedarf des Kindes deckt, erlischt die Barunterhaltspflicht der Eltern vollständig.' },
      { question: 'Was passiert mit dem Kindergeld während der Ausbildung?', answer: 'Das Kindergeld steht weiterhin bis zum 25. Lebensjahr zu und wird in voller Höhe an das volljährige Kind weitergeleitet.' },
    ],
    relatedSlugs: ['unterhalt-volljaehrige-kinder-rechner', 'duesseldorfer-tabelle-rechner', 'kindergeld-rechner-2026'],
  },

  {
    id: 'kinderbetreuungskosten-absetzen-rechner',
    slug: 'kinderbetreuungskosten-absetzen-rechner',
    name: 'Kinderbetreuungskosten Rechner (§ 10 Abs. 1 Nr. 5 EStG Steuer)',
    shortName: 'Kinderbetreuung Steuer',
    category: 'familie-schwangerschaft',
    subcategory: 'Bildung & Betreuung',
    metaTitle: 'Kinderbetreuungskosten Rechner – Kita, Hort & Tagesmutter steuerlich absetzen',
    metaDescription: 'Berechnen Sie Ihre Steuerersparnis durch Kinderbetreuungskosten nach § 10 EStG: 2/3 der Kosten bis maximal 4.000 Euro pro Kind und Jahr als Sonderausgaben abziehbar.',
    h1: 'Kinderbetreuungskosten Rechner – Steuerersparnis für Kita & Hort',
    shortDescription: 'Ermittelt den steuerlichen Sonderausgabenabzug für Betreuungsaufwendungen.',
    searchKeywords: ['kinderbetreuungskosten absetzen rechner', 'paragraph 10 estg sonderausgaben kinderbetreuung 4000 euro', 'tagesmutter steuerlich absetzbar rechner', 'kita kosten steuerersparnis'],
    inputs: [
      { id: 'actualCareCostsYearly', label: 'Tatsächliche Betreuungskosten pro Kind im Jahr (ohne Essensgeld)', type: 'number', defaultValue: 3600, min: 200, step: 200, unit: '€' },
      { id: 'taxRatePct', label: 'Persönlicher Grenzsteuersatz der Eltern', type: 'number', defaultValue: 35, min: 14, max: 45, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const costs = parseFloat(inputs.actualCareCostsYearly) || 3600;
      const rate = (parseFloat(inputs.taxRatePct) || 35) / 100;

      // Nach § 10 Abs. 1 Nr. 5 EStG: Zwei Drittel der Aufwendungen, maximal 4.000 € je Kind
      const twoThirds = costs * (2 / 3);
      const deductibleAmount = Math.min(4000, twoThirds);
      const taxSaving = deductibleAmount * rate;

      return {
        primary: { id: 'taxSaving', label: 'Jährliche Steuerersparnis', value: taxSaving, formattedValue: formatCurrency(taxSaving), highlight: true },
        secondary: [
          { id: 'deductibleAmount', label: 'Als Sonderausgaben abzugsfähiger Betrag', value: deductibleAmount, formattedValue: formatCurrency(deductibleAmount) },
          { id: 'twoThirds', label: 'Zwei-Drittel-Betrag (vor Kappung)', value: twoThirds, formattedValue: formatCurrency(twoThirds) },
          { id: 'maxAllowed', label: 'Gesetzlicher Höchstbetrag je Kind', value: 4000, formattedValue: '4.000,00 €' },
        ],
        summaryText: \`Von \${formatCurrency(costs)} Betreuungskosten können Sie \${formatCurrency(deductibleAmount)} als Sonderausgaben geltend machen. Das bringt Ihnen rund \${formatCurrency(taxSaving)} Einkommensteuerersparnis zurück!\`,
      };
    },
    formula: 'Abzug = min(4.000 €, Betreuungskosten × 2/3); Ersparnis = Abzug × Grenzsteuersatz',
    formulaExplanation: 'Begünstigt sind Dienstleistungen für Kinder bis zum 14. Lebensjahr wie Kita, Kindergarten, Hort, Tagesmutter, Babysitter oder Au-Pair. Nicht abziehbar sind Kosten für Verpflegung, Freizeit und Sportunterricht.',
    workedExample: {
      title: 'Beispiel: 3.600 € Kita-Gebühren bei 35 % Grenzsteuersatz',
      inputValues: [{ label: 'Kita-Kosten', value: '3.600 €' }, { label: 'Steuersatz', value: '35 %' }],
      steps: ['2/3 von 3.600 € = 2.400,00 € Sonderausgaben', 'Steuerersparnis: 2.400 € × 0,35 = 840,00 €'],
      result: '840,00 € Steuererstattung',
    },
    faqs: [
      { question: 'Ist Barzahlung für den Babysitter erlaubt?', answer: 'Nein! Das Finanzamt erkennt Kinderbetreuungskosten zwingend nur an, wenn eine Rechnung vorliegt und der Betrag auf das Bankkonto des Betreuers überwiesen wurde.' },
      { question: 'Können Fahrtkosten der Großeltern abgesetzt werden?', answer: 'Ja, wenn die Großeltern das Enkelkind unentgeltlich betreuen, können nachgewiesene Fahrtkostenerstattungen als Betreuungskosten steuerlich geltend gemacht werden.' },
    ],
    relatedSlugs: ['kita-gebuehren-rechner', 'kindergeld-rechner-2026', 'brutto-netto-rechner'],
  },
];
`;

fs.writeFileSync('scripts/generators/generate-gesundheit-familie-part2.js', code, 'utf-8');
console.log('Written part 2 (familie)');
