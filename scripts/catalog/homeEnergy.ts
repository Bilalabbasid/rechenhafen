import { CalcItemSpec } from '../generator-base';

export const HOME_ENERGY_SPECS: CalcItemSpec[] = [
  // ==================== WOHNEN & IMMOBILIEN (20 items) ====================
  {
    id: 'mieterhoehung-rechner',
    name: 'Mieterhöhung Rechner (Kappungsgrenze 15 % & 20 %)',
    shortName: 'Mieterhöhung berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Mieterhöhung Rechner – Kappungsgrenze 15 % oder 20 % nach § 558 BGB',
    metaDescription: 'Berechnen Sie die maximal zulässige Mieterhöhung nach deutschem Mietrecht (§ 558 BGB) mit Kappungsgrenze 15 % oder 20 % innerhalb von 3 Jahren.',
    h1: 'Mieterhöhung Rechner (Kappungsgrenze § 558 BGB)',
    shortDescription: 'Ermittelt die gesetzlich maximal zulässige Mieterhöhung bis zur ortsüblichen Vergleichsmiete.',
    searchKeywords: ['mieterhoehung rechner', 'kappungsgrenze 15 prozent berechnen', '558 bgb mieterhoehung rechner', 'maximale mieterhoehung formel'],
    inputs: [
      { id: 'currentRent', label: 'Aktuelle monatliche Kaltmiete', type: 'number', defaultValue: 850, min: 100, step: 25, unit: '€' },
      { id: 'rentThreeYearsAgo', label: 'Kaltmiete vor 3 Jahren', type: 'number', defaultValue: 800, min: 100, step: 25, unit: '€' },
      { id: 'localComparativeRent', label: 'Ortsübliche Vergleichsmiete (Mietspiegel)', type: 'number', defaultValue: 980, min: 100, step: 25, unit: '€' },
      {
        id: 'capLimit',
        label: 'Geltende Kappungsgrenze',
        type: 'select',
        defaultValue: '15',
        options: [
          { value: '15', label: '15 % (Angespannte Wohnungsmärkte z. B. Berlin, München, Hamburg)' },
          { value: '20', label: '20 % (Gesetzlicher Bundesstandard)' },
        ],
      },
    ],
    formula: 'Max_Miete = Min(Ortsübliche Vergleichsmiete, Kaltmiete_vor_3_Jahren × (1 + Kappungsgrenze/100))',
    formulaExplanation: 'Nach § 558 Abs. 3 BGB darf die Miete innerhalb von drei Jahren um nicht mehr als 20 % (in Gebieten mit Wohnraummangel 15 %) steigen und die ortsübliche Vergleichsmiete nicht überschreiten.',
    workedExample: {
      title: 'Beispiel: Miete vor 3 Jahren 800 €, heute 850 €, Vergleichsmiete 980 € (15 % Kappungsgrenze)',
      description: 'Maximaler Anstieg um 15 % auf 800 € = maximal 920 € Kaltmiete. Maximale Erhöhung: 70 €.',
      inputs: { currentRent: 850, rentThreeYearsAgo: 800, localComparativeRent: 980, capLimit: '15' },
      resultSummary: 'Maximal 920,00 € Kaltmiete (+70,00 €)',
    },
    intro: 'Haben Sie ein Mieterhöhungsschreiben erhalten oder planen als Vermieter eine Anpassung? Das deutsche Mietrecht schützt Mieter durch strikte Kappungsgrenzen.',
    details: 'Zusätzlich muss die Miete seit mindestens 15 Monaten unverändert sein, bevor eine neue Erhöhung wirksam werden kann (§ 558 Abs. 1 BGB).',
    faqs: [
      { question: 'Gilt die Kappungsgrenze auch nach Modernisierungen?', answer: 'Nein! Für Modernisierungsmieterhöhungen nach § 559 BGB (max. 8 % der Kosten umlegbar) gilt eine eigene Kappungsgrenze von maximal 2 € bzw. 3 € pro Quadratmeter innerhalb von 6 Jahren.' },
    ],
    relatedSlugs: ['mietbudget-rechner', 'mietbelastungsquote-rechner', 'modernisierungsumlage-rechner'],
    calcBody: `
      const curr = parseFloat(inputs.currentRent) || 850;
      const ago3 = parseFloat(inputs.rentThreeYearsAgo) || 800;
      const comp = parseFloat(inputs.localComparativeRent) || 980;
      const capPct = parseFloat(inputs.capLimit) || 15;
      const capAmount = ago3 * (1 + capPct / 100);
      const maxAllowedRent = Math.min(comp, capAmount);
      const increase = Math.max(0, maxAllowedRent - curr);
      const increasePct = curr > 0 ? (increase / curr) * 100 : 0;
      return {
        primary: { id: 'maxRent', label: 'Maximal zulässige neue Kaltmiete', value: maxAllowedRent, formattedValue: formatCurrency(maxAllowedRent), highlight: true },
        secondary: [
          { id: 'increase', label: 'Maximaler Erhöhungsbetrag', value: increase, formattedValue: formatCurrency(increase) },
          { id: 'pct', label: 'Erhöhung in Prozent bezogen auf heute', value: increasePct, formattedValue: formatPercent(increasePct, 1) },
          { id: 'cap', label: \`Kappungsgrenze (\${capPct} % bezogen auf Miete vor 3 Jahren)\`, value: capAmount, formattedValue: formatCurrency(capAmount) },
        ],
        summaryText: \`Die Miete darf maximal um \${formatCurrency(increase)} (\${formatPercent(increasePct, 1)}) auf höchstens \${formatCurrency(maxAllowedRent)} angehoben werden (Kappungsgrenze \${capPct} %).\`
      };
    `,
  },
  {
    id: 'mietkaution-rechner',
    name: 'Mietkaution Rechner (Maximal 3 Nettokaltmieten & Raten)',
    shortName: 'Mietkaution berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Mietkaution Rechner – Gesetzliche Höchstgrenze & 3 Raten (§ 551 BGB)',
    metaDescription: 'Berechnen Sie die gesetzliche Maximalhöhe der Mietkaution (max. 3 Nettokaltmieten nach § 551 BGB) und die gesetzliche Aufteilung in 3 Monatsraten.',
    h1: 'Mietkaution Rechner nach § 551 BGB',
    shortDescription: 'Ermittelt die gesetzliche Höchstgrenze der Mietkaution und die Ratenzahlung zu Mietbeginn.',
    searchKeywords: ['mietkaution rechner', 'kaution 3 monatskaltmieten', '551 bgb kaution rechner', 'mietkaution in raten zahlen'],
    inputs: [
      { id: 'coldRent', label: 'Monatliche Nettokaltmiete (ohne Nebenkosten)', type: 'number', defaultValue: 750, min: 50, step: 25, unit: '€' },
    ],
    formula: 'Maximale Kaution = 3 × Nettokaltmiete | Rate = Kaution / 3',
    formulaExplanation: 'Nach § 551 Abs. 1 BGB darf die Sicherheitsleistung höchstens das Dreifache der auf einen Monat entfallenden Miete ohne Nebenkostenvorauszahlung betragen.',
    workedExample: {
      title: 'Beispiel: 750 € Kaltmiete',
      description: 'Maximale Kaution: 2.250,00 €. Gesetzlicher Anspruch: 3 gleiche Raten à 750,00 €.',
      inputs: { coldRent: 750 },
      resultSummary: '2.250,00 € (3 Raten à 750,00 €)',
    },
    intro: 'Vermieter verlangen zu Mietbeginn eine Kaution als Mietsicherheit. Das Gesetz schützt Mieter vor überhöhten Forderungen und sichert das Recht auf Ratenzahlung.',
    details: 'Nach § 551 Abs. 2 BGB ist der Mieter gesetzlich berechtigt, die Kaution in drei gleichen monatlichen Teilzahlungen zu leisten. Die erste Rate wird zu Beginn des Mietverhältnisses fällig.',
    faqs: [
      { question: 'Dürfen Nebenkosten in die Kautionsberechnung einfließen?', answer: 'Nein! Nach deutschem Recht darf ausschließlich die reine Nettokaltmiete als Bemessungsgrundlage herangezogen werden. Nebenkosten- und Heizkostenvorauszahlungen bleiben unberücksichtigt.' },
    ],
    relatedSlugs: ['mietbudget-rechner', 'mietbelastungsquote-rechner', 'warmmiete-in-kaltmiete-rechner'],
    calcBody: `
      const rent = parseFloat(inputs.coldRent) || 750;
      const maxDeposit = rent * 3;
      const rate = rent;
      return {
        primary: { id: 'maxDeposit', label: 'Gesetzlich maximale Mietkaution', value: maxDeposit, formattedValue: formatCurrency(maxDeposit), highlight: true },
        secondary: [
          { id: 'rate1', label: '1. Rate (zu Mietbeginn fällig)', value: rate, formattedValue: formatCurrency(rate) },
          { id: 'rate2', label: '2. Rate (im Folgemonat fällig)', value: rate, formattedValue: formatCurrency(rate) },
          { id: 'rate3', label: '3. Rate (im dritten Monat fällig)', value: rate, formattedValue: formatCurrency(rate) },
        ],
        summaryText: \`Bei einer Kaltmiete von \${formatCurrency(rent)} darf die Mietkaution maximal \${formatCurrency(maxDeposit)} betragen. Sie haben das gesetzliche Recht, diese in 3 Monatsraten à \${formatCurrency(rate)} zu zahlen.\`
      };
    `,
  },
  {
    id: 'kauf-vs-miete-rechner',
    name: 'Kaufen oder Mieten Rechner (Vermögensvergleich über 30 Jahre)',
    shortName: 'Kaufen oder Mieten',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Kaufen oder Mieten Rechner – Was lohnt sich langfristig mehr?',
    metaDescription: 'Vergleichen Sie Immobilienkauf und Mieten mit ETF-Sparplan über 20 bis 30 Jahre. Reale Vermögensentwicklung objektiv kalkulieren.',
    h1: 'Kaufen oder Mieten Rechner (Immobilie vs. Aktien-ETF)',
    shortDescription: 'Gegenüberstellung des Vermögensaufbaus: Eigenheim tilgen vs. Mieten und Eigenkapital am Kapitalmarkt anlegen.',
    searchKeywords: ['kaufen oder mieten rechner', 'immobilie kaufen oder mieten vergleich', 'kaufen vs mieten etf', 'lohnt sich hauskauf rechner'],
    inputs: [
      { id: 'purchasePrice', label: 'Kaufpreis der Wunschimmobilie', type: 'number', defaultValue: 380000, min: 50000, step: 10000, unit: '€' },
      { id: 'equity', label: 'Vorhandenes Eigenkapital', type: 'number', defaultValue: 60000, min: 0, step: 5000, unit: '€' },
      { id: 'currentColdRent', label: 'Vergleichbare monatliche Kaltmiete', type: 'number', defaultValue: 1100, min: 200, step: 50, unit: '€' },
      { id: 'mortgageRate', label: 'Darlehenszins p.a.', type: 'number', defaultValue: 3.6, min: 1, step: 0.1, unit: '%' },
      { id: 'etfReturn', label: 'Erwartete Rendite ETF-Sparplan p.a.', type: 'number', defaultValue: 6.0, min: 1, step: 0.5, unit: '%' },
    ],
    formula: 'Vermögensvergleich nach 30 Jahren (Immobilienwert nach Wertsteigerung vs. ETF-Depotwert aus Miet-Ersparnis)',
    formulaExplanation: 'Berücksichtigt Instandhaltungskosten der Immobilie (ca. 1,5 % p.a.) und kontinuierliche Mietpreissteigerungen.',
    workedExample: {
      title: 'Beispiel: 380.000 € Haus vs. 1.100 € Kaltmiete bei 60.000 € Eigenkapital',
      description: 'Der Rechner simuliert beide Lebensmodelle über 30 Jahre unter realen Bedingungen.',
      inputs: { purchasePrice: 380000, equity: 60000, currentColdRent: 1100, mortgageRate: 3.6, etfReturn: 6.0 },
      resultSummary: 'Objektiver Vermögensvergleich',
    },
    intro: 'Kaufen oder mieten? Die Frage ist nicht nur eine Lifestyle-Entscheidung, sondern die größte Weichenstellung für Ihr künftiges Nettovermögen.',
    details: 'Mieter können wohlhabender sein als Eigentümer, wenn sie das gesparte Eigenkapital und monatliche Kostendifferenzen diszipliniert in rentable Welt-ETFs investieren.',
    faqs: [
      { question: 'Welche versteckten Kosten vergessen Käufer oft?', answer: 'Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler ca. 10-12 %), Instandhaltungsrücklagen (mindestens 1,50 € pro m² und Monat) sowie Grundsteuer und Gebäudeversicherung.' },
    ],
    relatedSlugs: ['kaufnebenkosten-rechner', 'baufinanzierung-rechner', 'etf-sparplan-rechner'],
    calcBody: `
      const price = parseFloat(inputs.purchasePrice) || 380000;
      const eq = parseFloat(inputs.equity) || 60000;
      const rent = parseFloat(inputs.currentColdRent) || 1100;
      const z = parseFloat(inputs.mortgageRate) || 3.6;
      const rEtf = parseFloat(inputs.etfReturn) || 6.0;
      const loan = Math.max(0, price * 1.10 - eq);
      const monthlyMortgage = loan * ((z + 2.0) / 1200);
      const homeValue30y = price * Math.pow(1.02, 30);
      let etfVal = eq;
      const monthlyEtfRate = (rEtf / 100) / 12;
      for (let m = 0; m < 360; m++) {
        const simRent = rent * Math.pow(1.02, Math.floor(m / 12));
        const diff = Math.max(0, monthlyMortgage - simRent);
        etfVal = (etfVal + diff) * (1 + monthlyEtfRate);
      }
      return {
        primary: { id: 'summary', label: 'Immobilienwert nach 30 Jahren (bei 2 % Wertzuwachs)', value: homeValue30y, formattedValue: formatCurrency(homeValue30y), highlight: true },
        secondary: [
          { id: 'etf', label: 'Depotwert Mieter nach 30 Jahren (bei 6 % ETF-Rendite)', value: etfVal, formattedValue: formatCurrency(etfVal) },
          { id: 'rate', label: 'Monatliche Kreditrate Käufer (Zins + 2 % Tilgung)', value: monthlyMortgage, formattedValue: formatCurrency(monthlyMortgage) },
          { id: 'rent', label: 'Heutige Kaltmiete', value: rent, formattedValue: formatCurrency(rent) },
        ],
        summaryText: \`Nach 30 Jahren hat das abgezahlte Eigenheim einen geschätzten Wert von \${formatCurrency(homeValue30y)}. Ein disziplinierter Mieter mit ETF-Sparplan erreicht ca. \${formatCurrency(etfVal)} Depotvermögen.\`
      };
    `,
  },
  {
    id: 'eigenkapitalquote-rechner',
    name: 'Eigenkapitalquote Rechner (Hauskauf & Finanzierung)',
    shortName: 'Eigenkapitalquote',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Eigenkapitalquote Rechner – Eigenkapitalanteil beim Immobilienkauf',
    metaDescription: 'Ermitteln Sie Ihre Eigenkapitalquote beim Hauskauf in Prozent: Verhältnis von Eigenmitteln zum Kaufpreis und Gesamtkosten inkl. Kaufnebenkosten.',
    h1: 'Eigenkapitalquote Rechner für den Immobilienkauf',
    shortDescription: 'Berechnet den prozentualen Eigenkapitalanteil und prüft die Konditionen-Einstufung bei Banken.',
    searchKeywords: ['eigenkapitalquote rechner', 'wie viel eigenkapital hauskauf', 'beleihungsauslauf berechnen', 'eigenkapitalanteil immobilie formel'],
    inputs: [
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie', type: 'number', defaultValue: 350000, min: 20000, step: 5000, unit: '€' },
      { id: 'incidentalFeesPct', label: 'Kaufnebenkosten (Grunderwerbsteuer, Notar, Makler)', type: 'number', defaultValue: 10.5, min: 3, step: 0.5, unit: '%' },
      { id: 'equityAmount', label: 'Verfügbares Eigenkapital', type: 'number', defaultValue: 70000, min: 0, step: 2500, unit: '€' },
    ],
    formula: 'Eigenkapitalquote (%) = (Eigenkapital / Gesamtkosten) × 100',
    formulaExplanation: 'Banken unterscheiden zwischen der Quote an den Gesamtkosten und dem Beleihungsauslauf bezogen auf den reinen Kaufpreis/Beleihungswert.',
    workedExample: {
      title: 'Beispiel: 350.000 € Kaufpreis, 10,5 % Nebenkosten (36.750 €), 70.000 € Eigenkapital',
      description: 'Gesamtkosten: 386.750 €. Eigenkapitalquote an Gesamtkosten: 18,10 % (reines Beleihungskapital: 9,5 %).',
      inputs: { purchasePrice: 350000, incidentalFeesPct: 10.5, equityAmount: 70000 },
      resultSummary: '18,10 % Eigenkapitalquote (Solide)',
    },
    intro: 'Wie viel Eigenkapital brauche ich für den Hauskauf? Die Eigenkapitalquote entscheidet maßgeblich über die Kreditzusage und den Zinssatz der Bank.',
    details: 'Banken erwarten in der Regel, dass mindestens die Kaufnebenkosten (ca. 10-12 %) vollständig aus eigenen Ersparnissen bezahlt werden können.',
    faqs: [
      { question: 'Was ist ein idealer Beleihungsauslauf?', answer: 'Der beste Zins wird bei einem Beleihungsauslauf von höchstens 60 % gewährt. Solide Finanzierungen liegen meist bei 80 % Beleihungsauslauf (entspricht ca. 20 % Eigenkapital plus Nebenkosten).' },
    ],
    relatedSlugs: ['kaufnebenkosten-rechner', 'baufinanzierung-rechner', 'tilgungsrechner'],
    calcBody: `
      const price = parseFloat(inputs.purchasePrice) || 350000;
      const feesPct = parseFloat(inputs.incidentalFeesPct) || 10.5;
      const eq = parseFloat(inputs.equityAmount) || 70000;
      const fees = price * (feesPct / 100);
      const totalCost = price + fees;
      const quoteTotal = totalCost > 0 ? (eq / totalCost) * 100 : 0;
      const eqForPrice = Math.max(0, eq - fees);
      const quotePrice = (eqForPrice / price) * 100;
      const loanNeeded = Math.max(0, totalCost - eq);
      let rating = 'Solide (deckt Nebenkosten + Anteil Kaufpreis)';
      if (eq < fees) rating = 'Kritisch (deckt nicht einmal die Kaufnebenkosten)';
      else if (quotePrice >= 20) rating = 'Sehr gut (Top-Zinskonditionen ab 20 % Kaufpreis)';
      return {
        primary: { id: 'quote', label: 'Eigenkapitalquote an Gesamtkosten', value: quoteTotal, formattedValue: formatPercent(quoteTotal, 1), highlight: true },
        secondary: [
          { id: 'rating', label: 'Einstufung durch Kreditinstitute', value: quoteTotal, formattedValue: rating },
          { id: 'loan', label: 'Erforderlicher Darlehensbetrag', value: loanNeeded, formattedValue: formatCurrency(loanNeeded) },
          { id: 'fees', label: 'Anfallende Kaufnebenkosten', value: fees, formattedValue: formatCurrency(fees) },
          { id: 'purePrice', label: 'Netto-Eigenkapital für Kaufpreis', value: eqForPrice, formattedValue: formatCurrency(eqForPrice) },
        ],
        summaryText: \`Bei Gesamtkosten von \${formatCurrency(totalCost)} beträgt Ihre Eigenkapitalquote \${formatPercent(quoteTotal, 1)}. Nach Begleichung der Kaufnebenkosten (\${formatCurrency(fees)}) verbleiben \${formatCurrency(eqForPrice)} für den eigentlichen Kaufpreis.\`
      };
    `,
  },
  {
    id: 'kaufpreisfaktor-rechner',
    name: 'Kaufpreisfaktor Rechner (Immobilien-Vervielfältiger)',
    shortName: 'Kaufpreisfaktor',
    category: 'wohnen-immobilien',
    subcategory: 'Rendite & Bewertung',
    metaTitle: 'Kaufpreisfaktor Rechner – Vervielfältiger für Immobilien berechnen',
    metaDescription: 'Ermitteln Sie den Kaufpreisfaktor (Vervielfältiger) und die Bruttomietrendite aus Kaufpreis und Jahreskaltmiete. Objektiver Marktvergleich.',
    h1: 'Kaufpreisfaktor Rechner (Vervielfältiger)',
    shortDescription: 'Berechnet den Kaufpreisfaktor (nach wie vielen Jahren Jahresmiete der Kaufpreis refinanziert ist).',
    searchKeywords: ['kaufpreisfaktor rechner', 'immobilien vervielfaeltiger berechnen', 'faktor jahreskaltmiete', 'bruttomietrendite kaufpreisfaktor'],
    inputs: [
      { id: 'purchasePrice', label: 'Kaufpreis der Immobilie', type: 'number', defaultValue: 270000, min: 10000, step: 5000, unit: '€' },
      { id: 'monthlyColdRent', label: 'Erzielbare monatliche Kaltmiete', type: 'number', defaultValue: 900, min: 50, step: 25, unit: '€' },
    ],
    formula: 'Kaufpreisfaktor = Kaufpreis / Jahreskaltmiete | Bruttorendite (%) = 100 / Faktor',
    formulaExplanation: 'Ein Kaufpreisfaktor von 25 bedeutet: Der Kaufpreis entspricht exakt 25 Jahreskaltmieten (entspricht 4,0 % Bruttorendite).',
    workedExample: {
      title: 'Beispiel: 270.000 € Kaufpreis bei 900 € Kaltmiete / Monat',
      description: 'Jahreskaltmiete: 10.800 €. Kaufpreisfaktor: 25,0 (Bruttomietrendite: 4,00 %).',
      inputs: { purchasePrice: 270000, monthlyColdRent: 900 },
      resultSummary: 'Faktor 25,0 (4,00 % Bruttorendite)',
    },
    intro: 'Der Kaufpreisfaktor ist die gebräuchlichste Faustformel auf dem Immobilienmarkt, um den Preis einer Wohnung oder eines Mehrfamilienhauses schnell einzuschätzen.',
    details: 'In ländlichen Regionen liegen Faktoren oft bei 15 bis 20, während in deutschen A-Städten (München, Frankfurt) Faktoren von 30 bis 35 üblich sind.',
    faqs: [
      { question: 'Was gilt als guter Kaufpreisfaktor für Kapitalanleger?', answer: 'Faktoren unter 20 (Rendite über 5 %) gelten als sehr attraktiv. Faktoren über 28 machen einen positiven Cashflow bei aktuellen Kreditzinsen schwer erreichbar.' },
    ],
    relatedSlugs: ['immobilienrendite-rechner', 'quadratmeterpreis-rechner', 'kaufnebenkosten-rechner'],
    calcBody: `
      const price = parseFloat(inputs.purchasePrice) || 270000;
      const rent = parseFloat(inputs.monthlyColdRent) || 900;
      const annualRent = rent * 12;
      if (annualRent <= 0) {
        return { primary: { id: 'factor', label: 'Faktor', value: 0, formattedValue: '0' }, error: 'Jahresmiete muss größer als 0 sein.' };
      }
      const factor = price / annualRent;
      const yieldPct = (annualRent / price) * 100;
      let rating = 'Solide Marktlage (Faktor 20 - 25)';
      if (factor < 20) rating = 'Sehr rentabel (hohe Mietrendite > 5 %)';
      else if (factor > 28) rating = 'Teuer / Hochpreisig (geringe Rendite < 3,5 %)';
      return {
        primary: { id: 'factor', label: 'Kaufpreisfaktor (Vervielfältiger)', value: factor, formattedValue: \`\${formatNumber(factor, 1)} × Jahresmiete\`, highlight: true },
        secondary: [
          { id: 'yield', label: 'Daraus resultierende Bruttomietrendite', value: yieldPct, formattedValue: formatPercent(yieldPct, 2) },
          { id: 'rating', label: 'Bewertung', value: factor, formattedValue: rating },
          { id: 'annualRent', label: 'Jahreskaltmiete', value: annualRent, formattedValue: formatCurrency(annualRent) },
        ],
        summaryText: \`Bei einem Kaufpreis von \${formatCurrency(price)} und \${formatCurrency(annualRent)} Jahreskaltmiete beträgt der Kaufpreisfaktor \${formatNumber(factor, 1)} (Bruttomietrendite: \${formatPercent(yieldPct, 2)}).\`
      };
    `,
  },
  {
    id: 'staffelmiete-rechner',
    name: 'Staffelmiete Rechner (Mietentwicklung im Voraus berechnen)',
    shortName: 'Staffelmiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Staffelmiete Rechner – Zukünftige Mieterhöhungen nach Staffeln',
    metaDescription: 'Berechnen Sie die künftige Kaltmiete bei vereinbarter Staffelmiete (§ 557a BGB). Mietentwicklung und Gesamtkosten über 3 bis 10 Jahre.',
    h1: 'Staffelmiete Rechner (§ 557a BGB)',
    shortDescription: 'Kalkuliert den fest vereinbarten Mietanstieg über mehrere Mietstaffeln.',
    searchKeywords: ['staffelmiete rechner', 'staffelmietvertrag miete berechnen', '557a bgb staffelmiete', 'mietentwicklung staffel online'],
    inputs: [
      { id: 'initialRent', label: 'Anfängliche Kaltmiete', type: 'number', defaultValue: 900, min: 100, step: 25, unit: '€' },
      { id: 'stepIncrease', label: 'Fester Erhöhungsbetrag pro Staffel', type: 'number', defaultValue: 35, min: 5, step: 5, unit: '€' },
      { id: 'intervalYears', label: 'Abstand zwischen den Staffeln in Jahren', type: 'number', defaultValue: 1, min: 1, max: 5, step: 1, unit: 'Jahre' },
      { id: 'totalYears', label: 'Betrachtungszeitraum in Jahren', type: 'number', defaultValue: 5, min: 1, max: 15, step: 1, unit: 'Jahre' },
    ],
    formula: 'Miete(Jahr) = Anfangsmiete + (Staffelerhöhung × Anzahl_abgelaufener_Intervalle)',
    formulaExplanation: 'Nach § 557a BGB muss die Mieterhöhung bei Staffelmietverträgen als fester Geldbetrag beziffert werden (nicht prozentual) und die Miete muss mindestens 1 Jahr unverändert bleiben.',
    workedExample: {
      title: 'Beispiel: 900 € Startmiete, alle 12 Monate +35 € über 5 Jahre',
      description: 'Endmiete im 5. Jahr: 1.040,00 € Kaltmiete (+15,56 %). Gesamte Kaltmiete gezahlt: 58.200 €.',
      inputs: { initialRent: 900, stepIncrease: 35, intervalYears: 1, totalYears: 5 },
      resultSummary: '1.040,00 € Endmiete nach 5 Jahren',
    },
    intro: 'Bei einer Staffelmiete steht von Anfang an fest, wann die Miete um welchen Betrag steigt. Weitere Mieterhöhungen (z. B. auf die Vergleichsmiete) sind währenddessen ausgeschlossen.',
    details: 'Vorteil für Mieter und Vermieter: Absolute Planungssicherheit und Ausschluss von Streitigkeiten über den Mietspiegel.',
    faqs: [
      { question: 'Gilt die Mietpreisbremse auch bei Staffelmietverträgen?', answer: 'Ja! Bei Beginn des Mietverhältnisses und bei jeder einzelnen Staffel darf die vereinbarte Miete die ortsübliche Vergleichsmiete zuzüglich 10 % nicht überschreiten (§ 556d BGB).' },
    ],
    relatedSlugs: ['mieterhoehung-rechner', 'indexmiete-rechner', 'mietbudget-rechner'],
    calcBody: `
      const init = parseFloat(inputs.initialRent) || 900;
      const step = parseFloat(inputs.stepIncrease) || 35;
      const interval = parseInt(inputs.intervalYears, 10) || 1;
      const totalY = parseInt(inputs.totalYears, 10) || 5;
      const totalSteps = Math.floor((totalY - 1) / interval);
      const finalRent = init + (step * totalSteps);
      let totalPaid = 0;
      for (let y = 0; y < totalY; y++) {
        const stepsPassed = Math.floor(y / interval);
        const yearlyRent = (init + step * stepsPassed) * 12;
        totalPaid += yearlyRent;
      }
      return {
        primary: { id: 'final', label: \`Kaltmiete im \${totalY}. Jahr\`, value: finalRent, formattedValue: formatCurrency(finalRent), highlight: true },
        secondary: [
          { id: 'totalIncrease', label: 'Gesamter Anstieg monatlich', value: finalRent - init, formattedValue: \`+\${formatCurrency(finalRent - init)}\` },
          { id: 'totalPaid', label: \`Gesamte Mietzahlungen über \${totalY} Jahre\`, value: totalPaid, formattedValue: formatCurrency(totalPaid) },
          { id: 'pct', label: 'Prozentualer Gesamtanstieg', value: ((finalRent - init) / init) * 100, formattedValue: formatPercent(((finalRent - init) / init) * 100, 1) },
        ],
        summaryText: \`Nach \${totalY} Jahren steigt Ihre Kaltmiete von \${formatCurrency(init)} schrittweise auf \${formatCurrency(finalRent)} (+ \${formatPercent(((finalRent - init) / init) * 100, 1)}).\`
      };
    `,
  },
  {
    id: 'indexmiete-rechner',
    name: 'Indexmiete Rechner (Anpassung an Verbraucherpreisindex VPI)',
    shortName: 'Indexmiete berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Indexmiete Rechner – Mieterhöhung nach Verbraucherpreisindex (§ 557b BGB)',
    metaDescription: 'Berechnen Sie die Mieterhöhung bei Indexmietverträgen nach amtlichem VPI des Statistischen Bundesamtes (Destatis). Gesetzliche Formel online.',
    h1: 'Indexmiete Rechner (§ 557b BGB nach VPI)',
    shortDescription: 'Ermittelt die prozentuale und absolute Mietanpassung basierend auf der Entwicklung des Verbraucherpreisindex.',
    searchKeywords: ['indexmiete rechner', 'verbraucherpreisindex miete berechnen', 'destatis vpi mieterhoehung', '557b bgb formel indexmiete'],
    inputs: [
      { id: 'currentRent', label: 'Bisherige Nettokaltmiete', type: 'number', defaultValue: 950, min: 100, step: 25, unit: '€' },
      { id: 'oldIndex', label: 'Alter Preisindex (bei Vertragsbeginn / letzter Erhöhung)', type: 'number', defaultValue: 110.5, min: 50, step: 0.1 },
      { id: 'newIndex', label: 'Neuer Verbraucherpreisindex (aktueller VPI Destatis)', type: 'number', defaultValue: 118.2, min: 50, step: 0.1 },
    ],
    formula: 'Neue Miete = Alte Miete × (Neuer Index / Alter Index) | Steigerung (%) = ((Neuer Index / Alter Index) - 1) × 100',
    formulaExplanation: 'Amtliche Formel nach § 557b BGB. Die Miete muss mindestens ein Jahr unverändert geblieben sein.',
    workedExample: {
      title: 'Beispiel: 950 € Kaltmiete, VPI stieg von 110,5 auf 118,2 Punkte',
      description: 'Indexanstieg: +6,97 %. Neue Kaltmiete: 1.016,20 € (+66,20 € / Monat).',
      inputs: { currentRent: 950, oldIndex: 110.5, newIndex: 118.2 },
      resultSummary: '1.016,20 € neue Miete (+6,97 %)',
    },
    intro: 'Bei einem Indexmietvertrag ist die Miethöhe an die allgemeine Teuerungsrate (Lebenshaltungskostenindex aller privaten Haushalte in Deutschland) gekoppelt.',
    details: 'Steigt der Verbraucherpreisindex, kann der Vermieter die Miete durch schriftliche Erklärung entsprechend anpassen. Sinkt der Index, hat der Mieter Anspruch auf Senkung.',
    faqs: [
      { question: 'Gilt die Mietpreisbremse für spätere Indexerhöhungen?', answer: 'Nein! Nur bei Abschluss des Mietvertrages greift die Mietpreisbremse. Nachfolgende Indexanpassungen dürfen auch über die ortsübliche Vergleichsmiete steigen.' },
    ],
    relatedSlugs: ['mieterhoehung-rechner', 'staffelmiete-rechner', 'inflationsrechner'],
    calcBody: `
      const rent = parseFloat(inputs.currentRent) || 950;
      const oldI = parseFloat(inputs.oldIndex) || 110.5;
      const newI = parseFloat(inputs.newIndex) || 118.2;
      if (oldI <= 0) {
        return { primary: { id: 'rent', label: 'Neue Miete', value: 0, formattedValue: '0 €' }, error: 'Alter Index muss größer als 0 sein.' };
      }
      const ratio = newI / oldI;
      const newRent = rent * ratio;
      const diff = newRent - rent;
      const pct = (ratio - 1) * 100;
      return {
        primary: { id: 'newRent', label: 'Neue zulässige Kaltmiete', value: newRent, formattedValue: formatCurrency(newRent), highlight: true },
        secondary: [
          { id: 'diff', label: 'Monatliche Mieterhöhung', value: diff, formattedValue: \`+\${formatCurrency(diff)}\` },
          { id: 'pct', label: 'Indexsteigerung in Prozent', value: pct, formattedValue: formatPercent(pct, 2) },
          { id: 'annualDiff', label: 'Zusätzliche Kosten pro Jahr', value: diff * 12, formattedValue: formatCurrency(diff * 12) },
        ],
        summaryText: \`Durch den VPI-Anstieg von \${formatNumber(oldI, 1)} auf \${formatNumber(newI, 1)} Punkte (\${formatPercent(pct, 2)}) steigt die Miete um \${formatCurrency(diff)} auf \${formatCurrency(newRent)} monatlich.\`
      };
    `,
  },
  {
    id: 'wohnflaeche-balkon-rechner',
    name: 'Wohnflächenrechner Balkon & Schrägen (nach WoFlV)',
    shortName: 'Wohnfläche berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Wohnflächenrechner Balkon, Terrasse & Schrägen – Nach WoFlV',
    metaDescription: 'Berechnen Sie die anrechenbare Wohnfläche nach deutscher Wohnflächenverordnung (WoFlV): Balkone (25-50 %), Dachschrägen unter 1m und 2m.',
    h1: 'Wohnflächenrechner nach Wohnflächenverordnung (WoFlV)',
    shortDescription: 'Ermittelt die rechtssichere Wohnfläche unter Berücksichtigung von Dachschrägen, Balkonen und Terrassen.',
    searchKeywords: ['wohnflaeche balkon rechner', 'woflv rechner dachschraege', 'balkon wohnflaeche 25 prozent', 'wohnflaeche richtig berechnen'],
    inputs: [
      { id: 'fullArea', label: 'Volle Raumfläche (Raumhöhe über 2 Meter)', type: 'number', defaultValue: 65.0, min: 5, step: 1, unit: 'm²' },
      { id: 'slopeHalfArea', label: 'Fläche unter Dachschräge (1 bis 2 Meter Höhe - zählt zu 50 %)', type: 'number', defaultValue: 12.0, min: 0, step: 0.5, unit: 'm²' },
      { id: 'balconyArea', label: 'Balkon- / Terrassen-Grundfläche', type: 'number', defaultValue: 8.0, min: 0, step: 0.5, unit: 'm²' },
      {
        id: 'balconyFactor',
        label: 'Anrechnung Balkon',
        type: 'select',
        defaultValue: '25',
        options: [
          { value: '25', label: '25 % (Gesetzlicher Regelfall nach WoFlV)' },
          { value: '50', label: '50 % (Besonders hohe Qualität / Sonnenlage)' },
        ],
      },
    ],
    formula: 'Wohnfläche = Volle_Fläche + (Schräge_1-2m × 0,5) + (Balkon × Anrechnungssatz)',
    formulaExplanation: 'Räume unter 1 m Höhe zählen zu 0 %. Zwischen 1 und 2 m zu 50 %. Balkone und Terrassen werden im Regelfall mit einem Viertel (25 %) angesetzt.',
    workedExample: {
      title: 'Beispiel: 65 m² volle Höhe, 12 m² Schräge (1-2m), 8 m² Balkon (25 %)',
      description: '65 + (12 × 0,5) + (8 × 0,25) = 65 + 6 + 2 = 73,00 m² anrechenbare Wohnfläche.',
      inputs: { fullArea: 65.0, slopeHalfArea: 12.0, balconyArea: 8.0, balconyFactor: '25' },
      resultSummary: '73,00 m² Wohnfläche',
    },
    intro: 'Falsche Wohnflächenangaben im Mietvertrag oder Kauf-Exposé sind einer der häufigsten Streitpunkte im Immobilienrecht. Bis zu 10 % Abweichung berechtigen zur Mietminderung!',
    details: 'In Deutschland gilt verbindlich die Wohnflächenverordnung (WoFlV). Nicht angerechnet werden Keller, Dachböden, Treppen ab 3 Stufen und Garagen.',
    faqs: [
      { question: 'Ab welcher Abweichung darf die Miete gemindert werden?', answer: 'Nach ständiger Rechtsprechung des BGH darf der Mieter die Miete mindern und zu viel gezahlte Miete zurückverlangen, wenn die tatsächliche Wohnfläche um mehr als 10 % kleiner ist als im Mietvertrag angegeben.' },
    ],
    relatedSlugs: ['quadratmeterpreis-rechner', 'mietbelastungsquote-rechner', 'mietkaution-rechner'],
    calcBody: `
      const full = parseFloat(inputs.fullArea) || 65;
      const slope = parseFloat(inputs.slopeHalfArea) || 12;
      const balc = parseFloat(inputs.balconyArea) || 8;
      const bFactor = parseFloat(inputs.balconyFactor) || 25;
      const slopeCounted = slope * 0.5;
      const balcCounted = balc * (bFactor / 100);
      const totalArea = full + slopeCounted + balcCounted;
      return {
        primary: { id: 'area', label: 'Rechtssichere Wohnfläche nach WoFlV', value: totalArea, formattedValue: \`\${formatNumber(totalArea, 2)} m²\`, highlight: true },
        secondary: [
          { id: 'full', label: 'Volle Wohnfläche (100 %)', value: full, formattedValue: \`\${formatNumber(full, 2)} m²\` },
          { id: 'slope', label: 'Schrägenanteil (50 % angerechnet)', value: slopeCounted, formattedValue: \`\${formatNumber(slopeCounted, 2)} m²\` },
          { id: 'balc', label: \`Balkonanteil (\${bFactor} % angerechnet)\`, value: balcCounted, formattedValue: \`\${formatNumber(balcCounted, 2)} m²\` },
        ],
        summaryText: \`Die anrechenbare Wohnfläche beträgt \${formatNumber(totalArea, 2)} m². Dachschrägen steuern \${formatNumber(slopeCounted, 2)} m² und der Balkon \${formatNumber(balcCounted, 2)} m² bei.\`
      };
    `,
  },
  {
    id: 'modernisierungsumlage-rechner',
    name: 'Modernisierungsumlage Rechner (§ 559 BGB)',
    shortName: 'Modernisierungsumlage',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Modernisierungsumlage Rechner – Mieterhöhung nach Sanierung (§ 559 BGB)',
    metaDescription: 'Berechnen Sie die zulässige Mieterhöhung nach energetischer Modernisierung (max. 8 % der Kosten nach § 559 BGB) und Kappungsgrenzen.',
    h1: 'Modernisierungsumlage Rechner nach § 559 BGB',
    shortDescription: 'Kalkuliert die Umlage von Modernisierungskosten auf die Jahreskaltmiete.',
    searchKeywords: ['modernisierungsumlage rechner', '559 bgb modernisierung mieterhoehung', '8 prozent modernisierung umlegen', 'energetische sanierung mieterhoehung'],
    inputs: [
      { id: 'renovationCost', label: 'Reine Modernisierungskosten der Wohnung (ohne Instandhaltung)', type: 'number', defaultValue: 15000, min: 1000, step: 1000, unit: '€' },
      { id: 'subsidies', label: 'Abzuziehende staatliche Fördergelder (z. B. BAFA, KfW-Zuschuss)', type: 'number', defaultValue: 3000, min: 0, step: 500, unit: '€' },
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 75, min: 20, step: 5, unit: 'm²' },
    ],
    formula: 'Monatliche Erhöhung = (Modernisierungskosten - Zuschüsse) × 8 % / 12 (max. 3 €/m² Kappungsgrenze)',
    formulaExplanation: 'Nach § 559 Abs. 1 BGB darf der Vermieter jährlich bis zu 8 % der aufgewendeten Kosten auf die Jahreskaltmiete umlegen. Drittmittel und Instandhaltungsanteile müssen abgezogen werden.',
    workedExample: {
      title: 'Beispiel: 15.000 € Fenstererneuerung abzüglich 3.000 € KfW-Förderung für 75 m² Wohnung',
      description: 'Umlagefähige Kosten: 12.000 €. 8 % p.a. = 960 € im Jahr = 80,00 € / Monat (1,07 €/m²).',
      inputs: { renovationCost: 15000, subsidies: 3000, livingArea: 75 },
      resultSummary: '80,00 € Mieterhöhung / Monat',
    },
    intro: 'Wer als Vermieter energetisch saniert (Dämmung, neue Fenster, moderne Heizung), darf die Kosten anteilig dauerhaft auf die Miete umlegen.',
    details: 'Gesetzliche Obergrenze nach § 559 BGB: Die Miete darf sich innerhalb von 6 Jahren um nicht mehr als 3,00 € pro m² (bzw. 2,00 € bei Ausgangsmiete unter 7 €/m²) erhöhen.',
    faqs: [
      { question: 'Müssen Instandhaltungskosten abgezogen werden?', answer: 'Ja, zwingend! Waren alte Fenster bereits morsch oder reparaturbedürftig, muss der Vermieter den fiktiven Instandhaltungsaufwand vorab von den Gesamtkosten abziehen.' },
    ],
    relatedSlugs: ['mieterhoehung-rechner', 'modernisierungskredit-rechner', 'wohnflaeche-balkon-rechner'],
    calcBody: `
      const cost = parseFloat(inputs.renovationCost) || 15000;
      const sub = parseFloat(inputs.subsidies) || 3000;
      const area = parseFloat(inputs.livingArea) || 75;
      const netCost = Math.max(0, cost - sub);
      const annualIncrease = netCost * 0.08;
      const monthlyIncrease = annualIncrease / 12;
      const perSqm = area > 0 ? monthlyIncrease / area : 0;
      const isCapped = perSqm > 3.0;
      const finalMonthly = isCapped ? 3.0 * area : monthlyIncrease;
      return {
        primary: { id: 'increase', label: 'Zulässige monatliche Mieterhöhung', value: finalMonthly, formattedValue: formatCurrency(finalMonthly), highlight: true },
        secondary: [
          { id: 'perSqm', label: 'Erhöhung pro Quadratmeter', value: isCapped ? 3.0 : perSqm, formattedValue: \`\${formatCurrency(isCapped ? 3.0 : perSqm)} / m²\` },
          { id: 'annual', label: 'Zusätzliche Miete pro Jahr', value: finalMonthly * 12, formattedValue: formatCurrency(finalMonthly * 12) },
          { id: 'capped', label: 'Kappungsgrenze (3,00 €/m²) erreicht?', value: isCapped ? 1 : 0, formattedValue: isCapped ? 'Ja (gedeckelt auf 3 €/m²)' : 'Nein (im Rahmen)' },
        ],
        summaryText: \`Nach Abzug von \${formatCurrency(sub)} Förderung dürfen \${formatCurrency(netCost)} umgelegt werden. Die Miete steigt monatlich um \${formatCurrency(finalMonthly)} (\${formatCurrency(isCapped ? 3.0 : perSqm)} / m²).\`
      };
    `,
  },
  {
    id: 'instandhaltungsruecklage-rechner',
    name: 'Instandhaltungsrücklage Rechner (Peterssche Formel)',
    shortName: 'Instandhaltungsrücklage',
    category: 'wohnen-immobilien',
    subcategory: 'Immobilienkauf & Finanzierung',
    metaTitle: 'Instandhaltungsrücklage Rechner – Peterssche Formel & § 28 II. BV',
    metaDescription: 'Berechnen Sie die empfohlene Instandhaltungsrücklage für Eigentumswohnungen und Häuser nach Petersscher Formel und § 28 II. Berechnungsverordnung.',
    h1: 'Instandhaltungsrücklage Rechner (Haus & WEG)',
    shortDescription: 'Ermittelt die empfohlene monatliche und jährliche Rücklage für Instandhaltungs- und Reparaturkosten.',
    searchKeywords: ['instandhaltungsruecklage rechner', 'peterssche formel rechner', 'instandhaltungskosten immobilie pro m2', 'hausgeld ruecklage berechnen'],
    inputs: [
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 85, min: 20, step: 5, unit: 'm²' },
      { id: 'constructionCostSqm', label: 'Herstellungskosten / Neubauwert pro m²', type: 'number', defaultValue: 2500, min: 1000, step: 100, unit: '€' },
      {
        id: 'ageCategory',
        label: 'Alter des Gebäudes (nach § 28 II. BV)',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'new', label: 'Neubau (bis 22 Jahre): ca. 9 - 10 € / m² / Jahr' },
          { value: 'medium', label: 'Mittelalt (22 bis 32 Jahre): ca. 11 - 12 € / m² / Jahr' },
          { value: 'old', label: 'Altbau (über 32 Jahre): ca. 14 - 16 € / m² / Jahr' },
        ],
      },
    ],
    formula: 'Peterssche Formel: Rücklage_pro_m²_Jahr = (Herstellungskosten × 1,5 × 0,7) / 80',
    formulaExplanation: 'Klassische Immobilienformel: Innerhalb von 80 Jahren fällt das 1,5-Fache der Baukosten für Instandhaltung an. Davon entfallen ca. 70 % auf das Gemeinschaftseigentum.',
    workedExample: {
      title: 'Beispiel: 85 m² Wohnung bei 2.500 € Herstellungskosten',
      description: 'Nach Petersscher Formel: ca. 32,81 €/m² im Jahr = ca. 2.789 € pro Jahr (ca. 232 € monatlich).',
      inputs: { livingArea: 85, constructionCostSqm: 2500, ageCategory: 'medium' },
      resultSummary: 'ca. 232 € Rücklage / Monat',
    },
    intro: 'Dach undicht, Aufzug defekt oder Fassadensanierung: Wer eine Immobilie besitzt, muss kontinuierlich Geld für Instandhaltungen zurücklegen, um Sonderumlagen zu vermeiden.',
    details: 'In einer Wohnungseigentümergemeinschaft (WEG) ist die Bildung einer angemessenen Erhaltungsrücklage seit der WEG-Reform gesetzlich vorgeschrieben (§ 19 Abs. 2 Nr. 2 WEG).',
    faqs: [
      { question: 'Was passiert mit der Instandhaltungsrücklage beim Verkauf?', answer: 'Die Instandhaltungsrücklage verbleibt fest bei der Wohnung und geht automatisch auf den neuen Käufer über. Sie wird nicht separat ausgezahlt.' },
    ],
    relatedSlugs: ['hausgeld-rechner', 'kaufnebenkosten-rechner', 'immobilienrendite-rechner'],
    calcBody: `
      const area = parseFloat(inputs.livingArea) || 85;
      const costSqm = parseFloat(inputs.constructionCostSqm) || 2500;
      const age = inputs.ageCategory || 'medium';
      const petersPerSqmYear = (costSqm * 1.5 * 0.7) / 80;
      const petersAnnual = petersPerSqmYear * area;
      let bvRate = 11.5;
      if (age === 'new') bvRate = 9.5;
      if (age === 'old') bvRate = 14.5;
      const bvAnnual = bvRate * area;
      return {
        primary: { id: 'petersMonthly', label: 'Empfohlene Monatsrücklage (Peterssche Formel)', value: petersAnnual / 12, formattedValue: formatCurrency(petersAnnual / 12), highlight: true },
        secondary: [
          { id: 'petersAnnual', label: 'Jahresrücklage (Peterssche Formel)', value: petersAnnual, formattedValue: formatCurrency(petersAnnual) },
          { id: 'bvMonthly', label: 'Monatsrücklage nach Gesetz (§ 28 II. BV)', value: bvAnnual / 12, formattedValue: formatCurrency(bvAnnual / 12) },
          { id: 'bvPerSqm', label: 'Kostensatz nach II. BV pro m²', value: bvRate, formattedValue: \`\${formatCurrency(bvRate)} / m² / Jahr\` },
        ],
        summaryText: \`Für eine \${area} m² Wohnung sollten Sie nach Petersscher Formel ca. \${formatCurrency(petersAnnual / 12)} pro Monat (\${formatCurrency(petersAnnual)} p.a.) als Instandhaltungsrücklage ansparen.\`
      };
    `,
  },
  {
    id: 'hausgeld-rechner',
    name: 'Hausgeld Rechner (Umlegbare & nicht umlegbare Kosten WEG)',
    shortName: 'Hausgeld berechnen',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Hausgeld Rechner – Umlegbare & nicht umlegbare Kosten für Eigentümer',
    metaDescription: 'Berechnen und trennen Sie Ihr monatliches Hausgeld: Auf den Mieter umlegbare Betriebskosten vs. Eigentümer-Kosten (Verwaltung & Rücklage).',
    h1: 'Hausgeld Rechner für Wohnungseigentümer (WEG)',
    shortDescription: 'Teilt das monatliche Hausgeld in umlagefähige Betriebskosten und Vermieterkosten auf.',
    searchKeywords: ['hausgeld rechner', 'hausgeld aufteilen vermieter mieter', 'umlegbare nebenkosten hausgeld', 'hausgeld pro quadratmeter'],
    inputs: [
      { id: 'totalHausgeld', label: 'Monatliches Gesamt-Hausgeld', type: 'number', defaultValue: 380, min: 50, step: 10, unit: '€' },
      { id: 'reservePortion', label: 'Darin enthaltene Instandhaltungsrücklage', type: 'number', defaultValue: 90, min: 0, step: 5, unit: '€' },
      { id: 'managementFee', label: 'Verwaltergebühr (WEG-Verwaltung)', type: 'number', defaultValue: 30, min: 0, step: 5, unit: '€' },
      { id: 'livingArea', label: 'Wohnfläche in m²', type: 'number', defaultValue: 75, min: 20, step: 5, unit: 'm²' },
    ],
    formula: 'Umlagefähig = Gesamt-Hausgeld - Rücklage - Verwaltergebühr',
    formulaExplanation: 'Nach der Betriebskostenverordnung (BetrKV) dürfen Rücklagenbildung und Verwaltungskosten keinesfalls auf den Mieter abgewälzt werden.',
    workedExample: {
      title: 'Beispiel: 380 € Hausgeld, 90 € Rücklage, 30 € Verwaltung für 75 m²',
      description: 'Auf den Mieter umlegbar: 260,00 € (3,47 €/m²). Nicht umlegbar (Eigentümerlast): 120,00 €.',
      inputs: { totalHausgeld: 380, reservePortion: 90, managementFee: 30, livingArea: 75 },
      resultSummary: '260,00 € umlegbar | 120,00 € Eigentümer',
    },
    intro: 'Eigentümer einer Eigentumswohnung zahlen monatlich Hausgeld an die WEG-Verwaltung. Vermieten Sie die Wohnung, dürfen Sie einen Großteil über die Nebenkostenabrechnung weiterreichen.',
    details: 'Zu den typischen umlegbaren Kosten gehören Heizung, Warmwasser, Müllabfuhr, Hausmeister, Gartenpflege und Gebäudeversicherung.',
    faqs: [
      { question: 'Wie hoch ist das Hausgeld in Deutschland im Durchschnitt?', answer: 'Im Bundesschnitt liegt das Hausgeld zwischen 3,00 € und 4,50 € pro Quadratmeter Wohnfläche im Monat, abhängig vom Alter und der Ausstattung (z. B. Aufzug).' },
    ],
    relatedSlugs: ['instandhaltungsruecklage-rechner', 'immobilienrendite-rechner', 'mietbelastungsquote-rechner'],
    calcBody: `
      const total = parseFloat(inputs.totalHausgeld) || 380;
      const res = parseFloat(inputs.reservePortion) || 90;
      const mgmt = parseFloat(inputs.managementFee) || 30;
      const area = parseFloat(inputs.livingArea) || 75;
      const nonRecoverable = res + mgmt;
      const recoverable = Math.max(0, total - nonRecoverable);
      const perSqm = area > 0 ? total / area : 0;
      return {
        primary: { id: 'rec', label: 'Auf Mieter umlegbare Betriebskosten', value: recoverable, formattedValue: formatCurrency(recoverable), highlight: true },
        secondary: [
          { id: 'nonRec', label: 'Nicht umlegbar (Kosten für Eigentümer)', value: nonRecoverable, formattedValue: formatCurrency(nonRecoverable) },
          { id: 'perSqm', label: 'Gesamt-Hausgeld pro Quadratmeter', value: perSqm, formattedValue: \`\${formatCurrency(perSqm)} / m²\` },
        ],
        summaryText: \`Von \${formatCurrency(total)} Hausgeld können Sie \${formatCurrency(recoverable)} als Nebenkosten auf Ihren Mieter umlegen. \${formatCurrency(nonRecoverable)} verbleiben als nicht umlegbare Vermieterkosten.\`
      };
    `,
  },
  {
    id: 'warmmiete-in-kaltmiete-rechner',
    name: 'Warmmiete in Kaltmiete Rechner (Betriebskosten abziehen)',
    shortName: 'Warm- in Kaltmiete',
    category: 'wohnen-immobilien',
    subcategory: 'Mieten & Nebenkosten',
    metaTitle: 'Warmmiete in Kaltmiete Rechner – Kaltmiete aus Warmmiete ermitteln',
    metaDescription: 'Rechnen Sie die Warmmiete in Nettokaltmiete um: Ziehen Sie Heizkosten und Betriebskostenvorauszahlungen präzise ab.',
    h1: 'Warmmiete in Kaltmiete Rechner',
    shortDescription: 'Ermittelt die reine Nettokaltmiete durch Abzug der kalten und warmen Nebenkosten.',
    searchKeywords: ['warmmiete in kaltmiete rechner', 'kaltmiete berechnen aus warmmiete', 'nebenkosten warmmiete abziehen', 'nettokaltmiete ermitteln'],
    inputs: [
      { id: 'warmRent', label: 'Gesamte Warmmiete', type: 'number', defaultValue: 1150, min: 100, step: 25, unit: '€' },
      { id: 'operatingCosts', label: 'Kalte Betriebskosten (Müll, Wasser, Hausmeister)', type: 'number', defaultValue: 150, min: 0, step: 10, unit: '€' },
      { id: 'heatingCosts', label: 'Heizung & Warmwasservorauszahlung', type: 'number', defaultValue: 120, min: 0, step: 10, unit: '€' },
    ],
    formula: 'Nettokaltmiete = Warmmiete - Kalte Betriebskosten - Heizkosten',
    formulaExplanation: 'Die Kaltmiete ist das reine Nutzungsentgelt für die Überlassung der Wohnräume ohne verbrauchs- und betriebsabhängige Zuschläge.',
    workedExample: {
      title: 'Beispiel: 1.150 € Warmmiete bei 150 € kalten NK und 120 € Heizung',
      description: '1.150 € - 150 € - 120 € = 880,00 € reine Nettokaltmiete (Nebenkostenanteil: 23,48 %).',
      inputs: { warmRent: 1150, operatingCosts: 150, heatingCosts: 120 },
      resultSummary: '880,00 € Kaltmiete',
    },
    intro: 'Für den Mietspiegel, die Mietkaution oder Bankfinanzierungen zählt immer die Kaltmiete. Mit diesem Rechner schlüsseln Sie die Mietbestandteile auf.',
    details: 'In vielen Immobilienanzeigen wird die „Bruttokaltmiete“ genannt. Diese beinhaltet zwar kalte Betriebskosten, schließt Heizkosten jedoch noch aus.',
    faqs: [
      { question: 'Welche Kosten darf der Vermieter niemals in die Nebenkosten aufnehmen?', answer: 'Verwaltungskosten, Bankgebühren, Instandhaltungs- und Reparaturkosten dürfen dem Mieter keinesfalls in Rechnung gestellt werden.' },
    ],
    relatedSlugs: ['mietkaution-rechner', 'mietbudget-rechner', 'mietbelastungsquote-rechner'],
    calcBody: `
      const warm = parseFloat(inputs.warmRent) || 1150;
      const op = parseFloat(inputs.operatingCosts) || 150;
      const heat = parseFloat(inputs.heatingCosts) || 120;
      const cold = Math.max(0, warm - op - heat);
      const totalNK = op + heat;
      const nkShare = warm > 0 ? (totalNK / warm) * 100 : 0;
      return {
        primary: { id: 'cold', label: 'Reine Nettokaltmiete', value: cold, formattedValue: formatCurrency(cold), highlight: true },
        secondary: [
          { id: 'totalNK', label: 'Gesamte Nebenkosten (Betrieb + Heizung)', value: totalNK, formattedValue: formatCurrency(totalNK) },
          { id: 'share', label: 'Nebenkostenanteil an der Warmmiete', value: nkShare, formattedValue: formatPercent(nkShare, 1) },
        ],
        summaryText: \`Bei einer Warmmiete von \${formatCurrency(warm)} verbleibt nach Abzug von \${formatCurrency(totalNK)} Nebenkosten eine Nettokaltmiete von \${formatCurrency(cold)}.\`
      };
    `,
  },
];
