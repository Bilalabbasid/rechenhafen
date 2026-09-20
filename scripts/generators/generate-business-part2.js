const fs = require('fs');
const path = require('path');

const calcs = [
  {
    id: 'kundengewinnungskosten-cac-rechner',
    slug: 'kundengewinnungskosten-cac-rechner',
    name: 'CAC Rechner (Customer Acquisition Cost & Kundengewinnungskosten)',
    shortName: 'CAC Rechner',
    category: 'business',
    subcategory: 'Marketing & Vertrieb',
    metaTitle: 'CAC Rechner – Customer Acquisition Cost (Kundengewinnungskosten berechnen)',
    metaDescription: 'Berechnen Sie die Customer Acquisition Costs (CAC in €) aus Marketing- und Vertriebsaufwand geteilt durch die Anzahl gewonnener Neukunden.',
    h1: 'CAC Rechner – Kundengewinnungskosten im Vertrieb berechnen',
    shortDescription: 'Ermittelt die durchschnittlichen Kosten für die Gewinnung eines Neukunden.',
    searchKeywords: ['cac rechner customer acquisition cost formel', 'kundengewinnungskosten berechnen marketing vertrieb', 'cac payback period monate', 'kosten pro neukunde ecommerce saas'],
    inputs: [
      { id: 'marketingCosts', label: 'Marketingausgaben im Zeitraum (Ads, Agentur)', type: 'number', defaultValue: 15000, min: 0, max: 100000000, step: 250, unit: '€' },
      { id: 'salesCosts', label: 'Vertriebsausgaben (Vertriebsgehälter, Provisionen, CRM)', type: 'number', defaultValue: 10000, min: 0, max: 100000000, step: 250, unit: '€' },
      { id: 'newCustomers', label: 'Im Zeitraum gewonnene Neukunden', type: 'number', defaultValue: 250, min: 1, max: 1000000, step: 1, unit: 'Kunden' },
      { id: 'avgMonthlyRevenue', label: 'Durchschnittlicher Umsatz pro Kunde & Monat', type: 'number', defaultValue: 50, min: 1, max: 100000, step: 5, unit: '€/Monat' },
    ],
    calculateCode: `const mkt = Number(inputs.marketingCosts) || 0;
const sales = Number(inputs.salesCosts) || 0;
const customers = Number(inputs.newCustomers) || 1;
const monthlyRev = Number(inputs.avgMonthlyRevenue) || 50;

const totalAcquisitionCosts = mkt + sales;
const cac = totalAcquisitionCosts / customers;

// CAC Payback Period (Monate, bis der Kunde seine Akquisekosten eingespielt hat):
const paybackMonths = monthlyRev > 0 ? cac / monthlyRev : 0;

return {
  primary: { id: 'cac', label: 'Kundengewinnungskosten (CAC)', value: cac, formattedValue: formatCurrency(cac) + ' je Neukunde', highlight: true },
  secondary: [
    { id: 'payback', label: 'CAC Payback Period', value: paybackMonths, formattedValue: formatNumber(paybackMonths, 1) + ' Monate' },
    { id: 'totalCost', label: 'Gesamtaufwand Marketing & Sales', value: totalAcquisitionCosts, formattedValue: formatCurrency(totalAcquisitionCosts) },
    { id: 'customersCount', label: 'Gewonnene Neukunden', value: customers, formattedValue: customers + ' Neukunden' },
  ],
  summaryText: 'Die Gewinnung eines neuen Kunden kostet Sie durchschnittlich ' + formatCurrency(cac) + '. Bei monatlich ' + formatCurrency(monthlyRev) + ' Kundenumsatz amortisieren sich die Akquisekosten nach ca. ' + formatNumber(paybackMonths, 1) + ' Monaten.',
};`,
    formula: 'CAC = (Marketingkosten + Vertriebskosten) / Anzahl gewonnener Neukunden; Payback (Monate) = CAC / Monatsumsatz',
    formulaExplanation: 'Die Customer Acquisition Cost (CAC) ist die zentrale Kennzahl im modernen Digital-Marketing und Vertrieb. Nur wenn der Wert eines Kunden (CLV) die CAC um ein Vielfaches übersteigt, ist das Geschäftsmodell skalierbar.',
    workedExample: {
      title: 'Beispiel: 25.000 € Marketing & Sales bringen 250 Neukunden (50 €/Monat Umsatz)',
      inputValues: [{ label: 'Gesamtkosten', value: '25.000 €' }, { label: 'Neukunden', value: '250' }],
      steps: ['CAC = 25.000 € / 250 = 100 € pro Kunde', 'Payback = 100 € / 50 €/Monat = 2,0 Monate'],
      result: '100 € CAC (2 Monate Payback)',
    },
    faqs: [
      { question: 'Welches Verhältnis von CLV zu CAC gilt als gesund?', answer: 'Im SaaS- und Digitalbereich gilt ein CLV:CAC-Verhältnis von mindestens 3:1 als goldener Standard (der Kunde bringt dreimal so viel Bruttoertrag ein, wie seine Gewinnung gekostet hat).' },
      { question: 'Welche Kosten gehören alles in die CAC-Berechnung?', answer: 'Alle Kosten: Werbeausgaben (Google/Meta), Gehälter von Marketing- und Vertriebsmitarbeitern, Softwarekosten für CRM- und E-Mail-Tools sowie externe Agenturhonorare.' },
    ],
    relatedSlugs: ['customer-lifetime-value-clv-rechner', 'roas-rechner', 'lead-conversion-rate-rechner'],
  },

  {
    id: 'customer-lifetime-value-clv-rechner',
    slug: 'customer-lifetime-value-clv-rechner',
    name: 'CLV Rechner (Customer Lifetime Value & Kundenwert berechnen)',
    shortName: 'CLV Rechner',
    category: 'business',
    subcategory: 'Marketing & Vertrieb',
    metaTitle: 'CLV Rechner – Customer Lifetime Value & Kundenwertformel berechnen',
    metaDescription: 'Berechnen Sie den Customer Lifetime Value (CLV in €) nach durchschnittlichem Bestellwert, Kauffrequenz, Kundenlebensdauer und Bruttomarge.',
    h1: 'CLV Rechner – Customer Lifetime Value & Kundenwert ermitteln',
    shortDescription: 'Berechnet den Kundenwert (CLV) über die gesamte Kundenbeziehung.',
    searchKeywords: ['clv rechner customer lifetime value formel', 'kundenwert berechnen marketing ecommerce saas', 'clv cac ratio verhaeltnis 3 zu 1', 'lebenszeitwert eines kunden berechnen'],
    inputs: [
      { id: 'avgOrderValue', label: 'Durchschnittlicher Bestellwert / Warenkorb', type: 'number', defaultValue: 80, min: 1, max: 100000, step: 5, unit: '€' },
      { id: 'purchaseFrequencyPerYear', label: 'Käufe pro Kunde und Jahr', type: 'number', defaultValue: 4, min: 0.1, max: 365, step: 0.5, unit: 'Käufe/Jahr' },
      { id: 'customerLifespanYears', label: 'Durchschnittliche Kundentreue / Lebensdauer', type: 'number', defaultValue: 3, min: 0.5, max: 50, step: 0.5, unit: 'Jahre' },
      { id: 'grossMarginPct', label: 'Bruttomarge / Deckungsbeitrag', type: 'number', defaultValue: 50, min: 1, max: 100, step: 1, unit: '%' },
    ],
    calculateCode: `const aov = Number(inputs.avgOrderValue) || 0;
const freq = Number(inputs.purchaseFrequencyPerYear) || 1;
const lifespan = Number(inputs.customerLifespanYears) || 1;
const margin = (Number(inputs.grossMarginPct) || 50) / 100;

// Kundenumsatz pro Jahr = AOV * Frequenz
const annualRevenuePerCustomer = aov * freq;
// Gesamt-Umsatz über Lebensdauer (Historical CLV Umsatz):
const lifetimeRevenue = annualRevenuePerCustomer * lifespan;
// Deckungsbeitrag-basierter Reingewinn-CLV:
const clvProfit = lifetimeRevenue * margin;

return {
  primary: { id: 'clvProfit', label: 'Customer Lifetime Value (Deckungsbeitrag)', value: clvProfit, formattedValue: formatCurrency(clvProfit), highlight: true },
  secondary: [
    { id: 'lifetimeRev', label: 'Lebenszeit-Umsatz je Kunde', value: lifetimeRevenue, formattedValue: formatCurrency(lifetimeRevenue) },
    { id: 'annualRev', label: 'Jährlicher Kundenumsatz', value: annualRevenuePerCustomer, formattedValue: formatCurrency(annualRevenuePerCustomer) + ' / Jahr' },
    { id: 'maxCac', label: 'Maximal empfohlene CAC (1/3 CLV)', value: clvProfit / 3, formattedValue: formatCurrency(clvProfit / 3) },
  ],
  summaryText: 'Ein Kunde generiert über ' + lifespan + ' Jahre Lebensdauer durchschnittlich ' + formatCurrency(lifetimeRevenue) + ' Gesamtumsatz, was einem Customer Lifetime Value von ' + formatCurrency(clvProfit) + ' Netto-Deckungsbeitrag entspricht.',
};`,
    formula: 'CLV = Bestellwert × Kauffrequenz pro Jahr × Lebensdauer (Jahre) × Bruttomarge (%)',
    formulaExplanation: 'Der Customer Lifetime Value beziffert den gesamten finanziellen Deckungsbeitrag, den ein durchschnittlicher Kunde während seiner gesamten Geschäftsbeziehung zum Unternehmen beiträgt.',
    workedExample: {
      title: 'Beispiel: 80 € Warenkorb, 4 Käufe pro Jahr über 3 Jahre bei 50 % Marge',
      inputValues: [{ label: 'Warenkorb', value: '80 €' }, { label: 'Käufe/Jahr', value: '4' }, { label: 'Dauer', value: '3 Jahre' }, { label: 'Marge', value: '50 %' }],
      steps: ['Jahresumsatz = 80 € × 4 = 320 €', 'Gesamtumsatz = 320 € × 3 = 960 €', 'CLV = 960 € × 0,50 = 480 €'],
      result: '480 € Customer Lifetime Value',
    },
    faqs: [
      { question: 'Warum ist der CLV wichtiger als der Erstbestellwert?', answer: 'Im modernen E-Commerce deckt die Erstbestellung durch hohe Werbekosten oft nicht einmal die Akquisekosten (CAC). Profitabel wird das Unternehmen erst durch Wiederkäufe über die gesamte Lebensdauer.' },
      { question: 'Wie kann man den CLV aktiv steigern?', answer: 'Durch gezieltes E-Mail-Marketing zur Steigerung der Kauffrequenz, Cross-Selling zur Erhöhung des Warenkorbs und exzellenten Kundenservice zur Senkung der Abwanderungsquote (Churn).' },
    ],
    relatedSlugs: ['kundengewinnungskosten-cac-rechner', 'churn-rate-rechner', 'roas-rechner'],
  },

  {
    id: 'churn-rate-rechner',
    slug: 'churn-rate-rechner',
    name: 'Churn Rate Rechner (Kundenabwanderungsquote & MRR Churn berechnen)',
    shortName: 'Churn Rate Rechner',
    category: 'business',
    subcategory: 'Marketing & Vertrieb',
    metaTitle: 'Churn Rate Rechner – Kundenabwanderungsquote (%) & MRR Churn',
    metaDescription: 'Berechnen Sie die monatliche und jährliche Churn Rate (Kundenabwanderung in %) sowie den Revenue Churn für SaaS-, Abo- und Dienstleistungsunternehmen.',
    h1: 'Churn Rate Rechner – Abwanderungsquote & Kundenverlust ermitteln',
    shortDescription: 'Berechnet Kunden- und Umsatzabwanderung im Abonnementgeschäft.',
    searchKeywords: ['churn rate rechner kundenabwanderungsquote formel', 'mrr churn berechnen saas abonnement', 'kundenabwanderung prozent pro monat jahr', 'durchschnittliche kundenlebensdauer 1 durch churn'],
    inputs: [
      { id: 'startCustomers', label: 'Kunden zu Beginn des Monats', type: 'number', defaultValue: 1000, min: 10, max: 10000000, step: 10, unit: 'Kunden' },
      { id: 'lostCustomers', label: 'Gekündigte Kunden im Monat', type: 'number', defaultValue: 30, min: 0, max: 1000000, step: 1, unit: 'Kündigungen' },
      { id: 'avgMrrPerCustomer', label: 'Monatlicher Umsatz je Kunde (MRR)', type: 'number', defaultValue: 49, min: 1, max: 100000, step: 5, unit: '€/Monat' },
    ],
    calculateCode: `const startCust = Number(inputs.startCustomers) || 1;
const lostCust = Number(inputs.lostCustomers) || 0;
const mrr = Number(inputs.avgMrrPerCustomer) || 0;

// Monatliche Churn Rate: (Verlorene Kunden / Startkunden) * 100
const monthlyChurnPct = (lostCust / startCust) * 100;

// Jährliche Churn Rate (Zinseszins-Bereinigt: 1 - (1 - churn)^12):
const annualChurnPct = (1 - Math.pow(1 - (monthlyChurnPct / 100), 12)) * 100;

// Durchschnittliche Kundenlebensdauer in Monaten: 1 / Churn Rate
const avgLifespanMonths = monthlyChurnPct > 0 ? 100 / monthlyChurnPct : 120;
const lostMrrAmount = lostCust * mrr;

return {
  primary: { id: 'monthlyChurn', label: 'Monatliche Churn Rate', value: monthlyChurnPct, formattedValue: formatPercent(monthlyChurnPct), highlight: true },
  secondary: [
    { id: 'annualChurn', label: 'Hochgerechnete Jahres-Churn-Rate', value: annualChurnPct, formattedValue: formatPercent(annualChurnPct) + ' p.a.' },
    { id: 'avgLifespan', label: 'Mittlere Kundenlebensdauer', value: avgLifespanMonths, formattedValue: formatNumber(avgLifespanMonths, 1) + ' Monate (' + formatNumber(avgLifespanMonths / 12, 1) + ' Jahre)' },
    { id: 'lostMrr', label: 'Verlorener monatlicher Umsatz (MRR)', value: lostMrrAmount, formattedValue: formatCurrency(lostMrrAmount) + ' / Monat' },
  ],
  summaryText: 'Bei ' + lostCust + ' Kündigungen von ' + startCust + ' Kunden liegt die monatliche Churn Rate bei ' + formatPercent(monthlyChurnPct) + ' (entspricht ca. ' + formatPercent(annualChurnPct) + ' p.a.). Ein Kunde bleibt durchschnittlich ' + formatNumber(avgLifespanMonths, 1) + ' Monate erhalten.',
};`,
    formula: 'Monatliche Churn Rate (%) = (Verlorene Kunden / Kunden zu Monatsbeginn) × 100; Lebensdauer = 1 / Churn Rate',
    formulaExplanation: 'Eine monatliche Churn Rate von 3 % klingt gering, summiert sich über ein volles Jahr jedoch auf über 30 % Kundenverlust, die ständig durch teure Neukunden ersetzt werden müssen.',
    workedExample: {
      title: 'Beispiel: 30 Kündigungen bei 1.000 Abonnenten (MRR 49 €)',
      inputValues: [{ label: 'Startkunden', value: '1.000' }, { label: 'Kündigungen', value: '30' }],
      steps: ['Monats-Churn = (30 / 1.000) × 100 = 3,0 %', 'Jahres-Churn = (1 - 0,97¹²) × 100 ≈ 30,6 %', 'Kundenlebensdauer = 1 / 0,03 = 33,3 Monate (ca. 2,8 Jahre)'],
      result: '3,0 % Monats-Churn (33 Monate Lebensdauer)',
    },
    faqs: [
      { question: 'Was ist Net Revenue Churn?', answer: 'Der Net Revenue Churn berücksichtigt neben Abwanderungen auch Upgrades und Expansionen bestehender Kunden. Ist der Net Churn negativ, wächst der Umsatz des Unternehmens selbst dann, wenn kein einziger Neukunde gewonnen wird!' },
      { question: 'Welche Churn Rate gilt im B2B- und B2C-Bereich als gut?', answer: 'Im B2B-Enterprise-Bereich gilt eine Jahres-Churn-Rate unter 5 % bis 8 % als exzellent. Im B2C-Abo-Bereich (z. B. Streaming, Fitnessstudio) sind monatliche Quoten von 3 % bis 5 % üblich.' },
    ],
    relatedSlugs: ['customer-lifetime-value-clv-rechner', 'kundengewinnungskosten-cac-rechner', 'lead-conversion-rate-rechner'],
  },

  {
    id: 'lead-conversion-rate-rechner',
    slug: 'lead-conversion-rate-rechner',
    name: 'Conversion Rate Rechner (Website-Besucher, Leads & Kaufabschlüsse)',
    shortName: 'Conversion Rate Rechner',
    category: 'business',
    subcategory: 'Marketing & Vertrieb',
    metaTitle: 'Conversion Rate Rechner – Konversionsrate (%) für E-Commerce & Leads',
    metaDescription: 'Berechnen Sie die Conversion Rate in Prozent für Webshops und Landingpages: Besucher zu Leads, Warenkörbe zu Käufen und Lead-to-Customer Rate.',
    h1: 'Conversion Rate Rechner – Konversionsrate für Shop & Leads ermitteln',
    shortDescription: 'Berechnet die Conversion Rate aus Besucherzahlen und Abschlüssen.',
    searchKeywords: ['conversion rate rechner formel prozent shop', 'konversionsrate berechnen besucher kunden', 'lead to customer conversion rate rechner', 'durchschnittliche ecommerce conversion rate 2 bis 3 prozent'],
    inputs: [
      { id: 'totalVisitors', label: 'Gesamtzahl Besucher / Kontakte (Traffic)', type: 'number', defaultValue: 10000, min: 1, max: 100000000, step: 250, unit: 'Besucher' },
      { id: 'conversionsCount', label: 'Anzahl erfolgreicher Aktionen (Bestellungen / Leads)', type: 'number', defaultValue: 250, min: 0, max: 10000000, step: 5, unit: 'Conversions' },
      { id: 'avgCartValue', label: 'Durchschnittlicher Umsatz pro Abschluss (optional)', type: 'number', defaultValue: 65, min: 0, max: 100000, step: 5, unit: '€' },
    ],
    calculateCode: `const visitors = Number(inputs.totalVisitors) || 1;
const convs = Number(inputs.conversionsCount) || 0;
const aov = Number(inputs.avgCartValue) || 0;

// Conversion Rate = (Conversions / Besucher) * 100
const cr = (convs / visitors) * 100;
const totalRevenue = convs * aov;
// Umsatz pro Besucher (Revenue per Visitor / RPV):
const rpv = visitors > 0 ? totalRevenue / visitors : 0;

let benchmark = 'Solide E-Commerce-Rate';
if (cr < 1.0) benchmark = 'Unterdurchschnittlich (Optimierungsbedarf bei Ladezeit, Checkout oder Trust)';
else if (cr <= 3.0) benchmark = 'Guter Durchschnitt im deutschsprachigen Online-Handel (2-3 %)';
else if (cr <= 6.0) benchmark = 'Überdurchschnittlich stark konvertierende Seite';
else benchmark = 'Hervorragende Conversion Rate (meist Nischenprodukte oder Bestandskunden)';

return {
  primary: { id: 'cr', label: 'Conversion Rate (CR)', value: cr, formattedValue: formatPercent(cr), highlight: true },
  secondary: [
    { id: 'rpv', label: 'Wert pro Besucher (Revenue per Visitor)', value: rpv, formattedValue: formatCurrency(rpv) + ' / Besucher' },
    { id: 'revenue', label: 'Erzeugter Gesamtumsatz', value: totalRevenue, formattedValue: formatCurrency(totalRevenue) },
    { id: 'benchmarkCheck', label: 'Einschätzung', value: 0, formattedValue: benchmark },
  ],
  summaryText: 'Aus ' + formatNumber(visitors, 0) + ' Besuchern entstehen ' + formatNumber(convs, 0) + ' Abschlüsse, was einer Conversion Rate von genau ' + formatPercent(cr) + ' entspricht (' + benchmark + ').',
};`,
    formula: 'Conversion Rate (%) = (Anzahl Conversions / Anzahl Besucher) × 100; Revenue per Visitor (RPV) = Umsatz / Besucher',
    formulaExplanation: 'Die Conversion Rate misst die Effizienz, mit der eine Website Besucher zu einer gewünschten Handlung (Kauf, Newsletter-Anmeldung, Kontaktanfrage) führt.',
    workedExample: {
      title: 'Beispiel: 10.000 Shop-Besucher führen zu 250 Bestellungen (Warenkorb 65 €)',
      inputValues: [{ label: 'Besucher', value: '10.000' }, { label: 'Bestellungen', value: '250' }],
      steps: ['CR = (250 / 10.000) × 100 = 2,50 %', 'Umsatz = 250 × 65 € = 16.250 €', 'RPV = 16.250 € / 10.000 = 1,63 € pro Klick'],
      result: '2,50 % Conversion Rate (1,63 € RPV)',
    },
    faqs: [
      { question: 'Wie hoch ist die durchschnittliche Conversion Rate im E-Commerce?', answer: 'Im deutschen Online-Handel liegt der Branchendurchschnitt typischerweise zwischen 1,8 % und 2,8 %. Auf Mobilgeräten ist die CR meist etwa 30 % niedriger als auf dem Desktop.' },
      { question: 'Wie kann man die Conversion Rate am schnellsten steigern?', answer: 'Durch Verkürzen der Ladezeiten, Anbieten beliebter Zahlungsarten (PayPal, Klarna, Apple Pay), Vertrauenselemente (Käuferschutz-Siegel, echte Kundenbewertungen) und One-Page-Checkouts.' },
    ],
    relatedSlugs: ['roas-rechner', 'kundengewinnungskosten-cac-rechner', 'churn-rate-rechner'],
  },

  {
    id: 'abschreibung-linear-degressiv-rechner',
    slug: 'abschreibung-linear-degressiv-rechner',
    name: 'AfA Rechner (Lineare & Degressive Abschreibung nach AfA-Tabelle)',
    shortName: 'AfA Rechner',
    category: 'business',
    subcategory: 'Steuern & Buchhaltung',
    metaTitle: 'AfA Rechner – Lineare & Degressive Abschreibung (Wachstumschancengesetz 2024)',
    metaDescription: 'Berechnen Sie die jährliche steuerliche Abschreibung (AfA) linear nach offizieller BMF-Nutzungsdauer oder degressiv (bis zu 20 % nach Wachstumschancengesetz) inklusive Restbuchwert.',
    h1: 'AfA Rechner – Lineare & Degressive Abschreibung ermitteln',
    shortDescription: 'Berechnet jährliche Abschreibungsbeträge und Restbuchwerte.',
    searchKeywords: ['afa rechner lineare degressive abschreibung formel', 'abschreibungstabelle bmf nutzungsdauer jahre', 'degressive afa 2024 wachstumschancengesetz 20 prozent', 'restbuchwert abschreibungsplan berechnen'],
    inputs: [
      { id: 'assetCost', label: 'Anschaffungskosten netto (ohne Vorsteuer)', type: 'number', defaultValue: 12000, min: 1, max: 100000000, step: 250, unit: '€' },
      { id: 'usefulLifeYears', label: 'Betriebsgewöhnliche Nutzungsdauer (AfA-Tabelle)', type: 'number', defaultValue: 5, min: 1, max: 50, step: 1, unit: 'Jahre' },
      {
        id: 'afaMethod',
        label: 'Abschreibungsmethode',
        type: 'select',
        defaultValue: 'linear',
        options: [
          { value: 'linear', label: 'Lineare Abschreibung (gleichbleibende Jahresbeträge)' },
          { value: 'degressive20', label: 'Degressive AfA (max. 20 % p.a. – Wachstumschancengesetz)' },
        ],
      },
    ],
    calculateCode: `const cost = Number(inputs.assetCost) || 0;
const years = Number(inputs.usefulLifeYears) || 5;
const method = inputs.afaMethod;

// Lineare AfA:
const linearRatePct = 100 / years;
const linearAnnualAmount = cost / years;

let firstYearAmount = linearAnnualAmount;
let secondYearAmount = linearAnnualAmount;
let usedRatePct = linearRatePct;

if (method === 'degressive20') {
  // Nach § 7 Abs. 2 EStG: bis zum 2-fachen des linearen Satzes, max. 20%
  usedRatePct = Math.min(20, linearRatePct * 2);
  firstYearAmount = cost * (usedRatePct / 100);
  const bookValueAfterYear1 = cost - firstYearAmount;
  secondYearAmount = bookValueAfterYear1 * (usedRatePct / 100);
}

const taxSavingsYear1 = firstYearAmount * 0.30; // ca. 30% Ertragsteuerersparnis

return {
  primary: { id: 'year1Afa', label: 'Abschreibung im 1. vollen Jahr', value: firstYearAmount, formattedValue: formatCurrency(firstYearAmount), highlight: true },
  secondary: [
    { id: 'rate', label: 'Angewendeter AfA-Satz', value: usedRatePct, formattedValue: formatPercent(usedRatePct) + ' p.a.' },
    { id: 'year2Afa', label: 'Abschreibung im 2. Jahr', value: secondYearAmount, formattedValue: formatCurrency(secondYearAmount) },
    { id: 'taxSave', label: 'Geschätzte Steuerersparnis Jahr 1 (bei 30 % Steuern)', value: taxSavingsYear1, formattedValue: 'ca. ' + formatCurrency(taxSavingsYear1) },
    { id: 'linearComp', label: 'Vergleich: Lineare Standard-AfA', value: linearAnnualAmount, formattedValue: formatCurrency(linearAnnualAmount) + ' / Jahr' },
  ],
  summaryText: 'Bei ' + formatCurrency(cost) + ' Anschaffungskosten und ' + years + ' Jahren Nutzungsdauer beträgt die AfA im ersten Jahr ' + formatCurrency(firstYearAmount) + ' (AfA-Satz ' + formatPercent(usedRatePct) + '). Das mindert Ihren steuerlichen Gewinn sofort!',
};`,
    formula: 'Linear: AfA = Anschaffungskosten / Nutzungsdauer; Degressiv: AfA_t = Buchwert_(t-1) × AfA-Satz',
    formulaExplanation: 'Wirtschaftsgüter des Anlagevermögens dürfen nicht sofort komplett als Betriebsausgabe abgesetzt werden, sondern müssen über ihre steuerliche Nutzungsdauer verteilt abgeschrieben werden.',
    workedExample: {
      title: 'Beispiel: Firmenwagen für 40.000 € netto über 6 Jahre Nutzungsdauer',
      inputValues: [{ label: 'Kosten', value: '40.000 €' }, { label: 'Dauer', value: '6 Jahre' }, { label: 'Methode', value: 'Linear' }],
      steps: ['AfA-Satz = 100 / 6 = 16,67 % p.a.', 'Jährliche AfA = 40.000 € / 6 = 6.666,67 € Betriebsausgabe'],
      result: '6.666,67 € jährliche Abschreibung',
    },
    faqs: [
      { question: 'Was gilt für geringwertige Wirtschaftsgüter (GWG)?', answer: 'Selbstständig nutzbare Gegenstände bis 800 Euro netto (GWG-Grenze § 6 Abs. 2 EStG) können im Jahr der Anschaffung sofort zu 100 % voll als Betriebsausgabe abgesetzt werden.' },
      { question: 'Darf man von der degressiven zur linearen AfA wechseln?', answer: 'Ja! Sobald der lineare Betrag (Restbuchwert geteilt durch Restnutzungsdauer) höher ist als der degressive Betrag, wechselt man steueroptimal zur linearen Methode.' },
    ],
    relatedSlugs: ['ebit-ebitda-rechner', 'cashflow-rechner', 'mwst-rechner'],
  },

  {
    id: 'skonto-jahreszins-rechner',
    slug: 'skonto-jahreszins-rechner',
    name: 'Skonto Jahreszins Rechner (Effektiver Jahreszins & Skonto vs. Kredit)',
    shortName: 'Skonto Jahreszins',
    category: 'business',
    subcategory: 'Kostenrechnung & Controlling',
    metaTitle: 'Skonto Jahreszins Rechner – Effektiven Skontozins p.a. berechnen',
    metaDescription: 'Berechnen Sie den effektiven Jahreszinssatz bei Skontonutzung (z. B. 2 % oder 3 % Skonto bei Zahlung binnen 10 Tagen statt 30 Tagen Nettoziel) im Vergleich zum Kontokorrentkredit.',
    h1: 'Skonto Jahreszins Rechner – Lohnt sich Skonto auch auf Pump?',
    shortDescription: 'Berechnet den enormen effektiven Jahreszins von Skontoangeboten.',
    searchKeywords: ['skonto effektiver jahreszins rechner formel', 'skonto ausnutzen dispo kredit zinsvergleich', 'skontosatz tage zahlungsziel kaufmaennisch', 'skonto vorteil berechnen bwl'],
    inputs: [
      { id: 'invoiceGross', label: 'Rechnungsbetrag brutto', type: 'number', defaultValue: 5000, min: 10, max: 10000000, step: 100, unit: '€' },
      { id: 'skontoPercent', label: 'Skontosatz', type: 'number', defaultValue: 3.0, min: 0.5, max: 10.0, step: 0.5, unit: '%' },
      { id: 'skontoDays', label: 'Skontofrist', type: 'number', defaultValue: 10, min: 1, max: 60, step: 1, unit: 'Tage' },
      { id: 'netDays', label: 'Reguläres Zahlungsziel (netto Kasse)', type: 'number', defaultValue: 30, min: 2, max: 180, step: 5, unit: 'Tage' },
      { id: 'creditInterestPct', label: 'Eigener Kontokorrent- / Dispozins p.a.', type: 'number', defaultValue: 9.5, min: 0, max: 30, step: 0.5, unit: '%' },
    ],
    calculateCode: `const inv = Number(inputs.invoiceGross) || 0;
const skPct = Number(inputs.skontoPercent) || 3.0;
const skDays = Number(inputs.skontoDays) || 10;
const netDays = Number(inputs.netDays) || 30;
const creditZins = Number(inputs.creditInterestPct) || 9.5;

const creditDays = Math.max(1, netDays - skDays);
// Kaufmännische Formel für effektiven Jahreszins:
// Zins p.a. = (Skontosatz / (100 - Skontosatz)) * (360 / Kreditzeitraum) * 100
// bzw. klassische Näherung: (Skontosatz * 360) / Kreditzeitraum
const effZinsApprox = (skPct * 360) / creditDays;
const effZinsExact = (skPct / (100 - skPct)) * (360 / creditDays) * 100;

const skontoSavingsEuro = inv * (skPct / 100);
const amountToPay = inv - skontoSavingsEuro;

// Zinskosten für Zwischenfinanzierung per Kontokorrentkredit:
const creditCostEuro = amountToPay * (creditZins / 100) * (creditDays / 360);
const netAdvantageEuro = skontoSavingsEuro - creditCostEuro;

return {
  primary: { id: 'effZins', label: 'Effektiver Jahreszins des Skontos', value: effZinsExact, formattedValue: formatPercent(effZinsExact) + ' p.a.', highlight: true },
  secondary: [
    { id: 'savingsEuro', label: 'Skonto-Ersparnis (Barabzug)', value: skontoSavingsEuro, formattedValue: formatCurrency(skontoSavingsEuro) },
    { id: 'netBenefit', label: 'Nettovorteil nach Bankzinsen', value: netAdvantageEuro, formattedValue: formatCurrency(netAdvantageEuro) },
    { id: 'creditDaysDisplay', label: 'Finanzierungszeitraum', value: creditDays, formattedValue: creditDays + ' Tage' },
  ],
  summaryText: 'Durch Skonto sparen Sie ' + formatCurrency(skontoSavingsEuro) + '. Das entspricht einem effektiven Jahreszins von ' + formatPercent(effZinsExact) + ' p.a.! Selbst bei Finanzierung über Kontokorrent (' + creditZins + ' % Zins) sparen Sie immer noch ' + formatCurrency(netAdvantageEuro) + ' unterm Strich.',
};`,
    formula: 'Effektiver Jahreszins (%) = (Skontosatz / (100 - Skontosatz)) × (360 / (Zahlungsziel - Skontofrist)) × 100',
    formulaExplanation: 'Wer Skonto nicht zieht, nimmt beim Lieferanten einen extrem teuren Kredit in Anspruch – meist zu einem Zinssatz von 30 % bis 60 % p.a.!',
    workedExample: {
      title: 'Beispiel: 3 % Skonto bei Zahlung in 10 Tagen statt 30 Tagen Nettoziel',
      inputValues: [{ label: 'Skonto', value: '3 %' }, { label: 'Skontofrist', value: '10 Tage' }, { label: 'Nettoziel', value: '30 Tage' }],
      steps: ['Kreditzeit = 30 - 10 = 20 Tage', 'Zins = (3 / 97) × (360 / 20) × 100 = 0,03093 × 18 × 100 ≈ 55,67 % p.a.'],
      result: '55,7 % effektiver Jahreszins',
    },
    faqs: [
      { question: 'Lohnt es sich, für Skonto das Bankkonto zu überziehen?', answer: 'Ja, fast immer! Selbst bei teuren 10-12 % Dispozins spart man bares Geld, weil Skonto einem Jahreszins von über 40 % bis 60 % entspricht. Skonto immer mitnehmen!' },
      { question: 'Darf man Skonto auch vom Bruttobetrag abziehen?', answer: 'Ja, Skonto wird kaufmännisch vom Bruttorechnungsbetrag abgezogen. Die im Vorsteuerabzug geltend gemachte Mehrwertsteuer muss in der Buchhaltung entsprechend um den Skontosatz korrigiert werden.' },
    ],
    relatedSlugs: ['skontorechner', 'liquiditaetsgrad-rechner', 'rabattrechner'],
  },

  {
    id: 'wareneinsatzquote-rechner',
    slug: 'wareneinsatzquote-rechner',
    name: 'Wareneinsatzquote Rechner (Food Cost & Wareneinsatz in %)',
    shortName: 'Wareneinsatzquote',
    category: 'business',
    subcategory: 'Kostenrechnung & Controlling',
    metaTitle: 'Wareneinsatzquote Rechner – Food Cost & Wareneinsatz (%) in Gastronomie & Handel',
    metaDescription: 'Berechnen Sie die Wareneinsatzquote / Food Cost in % aus Wareneinsatz und Netto-Umsatz für Restaurants, Bäckereien, Cafés und Einzelhandel.',
    h1: 'Wareneinsatzquote Rechner – Food Cost & Wareneinsatz in % ermitteln',
    shortDescription: 'Berechnet die Wareneinsatzquote und Food Cost für Gastronomie und Handel.',
    searchKeywords: ['wareneinsatzquote rechner formel gastronomie food cost', 'wieviel prozent wareneinsatz restaurant baeckerei', 'wareneinsatzquote berechnen netto umsatz', 'wareneinsatz kalkulieren speisekarte'],
    inputs: [
      { id: 'revenueNet', label: 'Netto-Umsatzerlöse', type: 'number', defaultValue: 50000, min: 100, max: 100000000, step: 1000, unit: '€' },
      { id: 'costOfGoods', label: 'Wareneinsatz (Einkauf Lebensmittel / Handelsware)', type: 'number', defaultValue: 14000, min: 0, max: 100000000, step: 500, unit: '€' },
      {
        id: 'sectorType',
        label: 'Branche / Richtwert',
        type: 'select',
        defaultValue: 'gastroFood',
        options: [
          { value: 'gastroFood', label: 'Speisegastronomie / Restaurant (Richtwert 25 % bis 30 %)' },
          { value: 'gastroDrinks', label: 'Getränke / Bar (Richtwert 15 % bis 20 %)' },
          { value: 'bakery', label: 'Bäckerei / Konditorei (Richtwert 20 % bis 25 %)' },
          { value: 'retail', label: 'Einzelhandel (Richtwert 60 % bis 75 %)' },
        ],
      },
    ],
    calculateCode: `const rev = Number(inputs.revenueNet) || 1;
const cogs = Number(inputs.costOfGoods) || 0;

// Wareneinsatzquote = (Wareneinsatz / Nettoumsatz) * 100
const cogsRatio = (cogs / rev) * 100;
// Rohertrag = Umsatz - Wareneinsatz
const grossProfit = rev - cogs;
const grossProfitMargin = (grossProfit / rev) * 100;

let benchmarkMax = 30;
if (inputs.sectorType === 'gastroDrinks') benchmarkMax = 20;
else if (inputs.sectorType === 'bakery') benchmarkMax = 25;
else if (inputs.sectorType === 'retail') benchmarkMax = 70;

const isOptimal = cogsRatio <= benchmarkMax;

return {
  primary: { id: 'ratio', label: 'Wareneinsatzquote (Food Cost)', value: cogsRatio, formattedValue: formatPercent(cogsRatio), highlight: true },
  secondary: [
    { id: 'grossProfit', label: 'Rohertrag (Deckung für Personal & Gewinn)', value: grossProfit, formattedValue: formatCurrency(grossProfit) + ' (' + formatPercent(grossProfitMargin) + ')' },
    { id: 'benchmark', label: 'Branchen-Richtwert', value: benchmarkMax, formattedValue: 'max. ' + benchmarkMax + ' % (' + (isOptimal ? 'im grünen Bereich' : 'zu hoch!') + ')' },
  ],
  summaryText: 'Die Wareneinsatzquote liegt bei ' + formatPercent(cogsRatio) + '. Von jedem Euro Nettoumsatz verbleiben dem Betrieb ' + formatCurrency(grossProfit / rev) + ' Rohertrag zur Deckung von Personal, Miete und Gewinn.',
};`,
    formula: 'Wareneinsatzquote (%) = (Wareneinsatz / Nettoumsatz) × 100; Rohertrag = Nettoumsatz - Wareneinsatz',
    formulaExplanation: 'In der Gastronomie ist die Food-Cost-Quote neben den Personalkosten die wichtigste Steuerungsgröße. Eine Quote über 30 % deutet meist auf zu hohe Einkäufe, Portionierungsfehler oder Schwund hin.',
    workedExample: {
      title: 'Beispiel: Restaurant mit 50.000 € Nettoumsatz und 14.000 € Wareneinsatz',
      inputValues: [{ label: 'Umsatz', value: '50.000 €' }, { label: 'Wareneinsatz', value: '14.000 €' }],
      steps: ['Quote = (14.000 / 50.000) × 100 = 28,0 %', 'Rohertrag = 50.000 € - 14.000 € = 36.000 € (72 %)'],
      result: '28,0 % Food Cost (perfekt im Zielkorridor)',
    },
    faqs: [
      { question: 'Wie berechnet man den Wareneinsatz am Monatsende exakt?', answer: 'Formel: Anfangsbestand des Lagers + Einkäufe im Monat - Endbestand laut Inventur = tatsächlicher Wareneinsatz.' },
      { question: 'Warum haben Getränke eine viel niedrigere Wareneinsatzquote als Speisen?', answer: 'Getränke (Kaffee, Softdrinks, Bier) haben Wareneinsatzquoten von nur 10 % bis 18 %, da sie kaum Vorbereitungszeit benötigen und extrem hohe Aufschlagfaktoren erlauben.' },
    ],
    relatedSlugs: ['marge-rechner', 'deckungsbeitrag-rechner', 'lagerumschlagshaeufigkeit-rechner'],
  },

  {
    id: 'lagerumschlagshaeufigkeit-rechner',
    slug: 'lagerumschlagshaeufigkeit-rechner',
    name: 'Lagerumschlag Rechner (Umschlagshäufigkeit & Lagerdauer in Tagen)',
    shortName: 'Lagerumschlag Rechner',
    category: 'business',
    subcategory: 'Kostenrechnung & Controlling',
    metaTitle: 'Lagerumschlag Rechner – Umschlagshäufigkeit & Lagerdauer (Tage) berechnen',
    metaDescription: 'Berechnen Sie die Lagerumschlagshäufigkeit (Wareneinsatz / Ø Lagerbestand) und die durchschnittliche Lagerdauer in Tagen zur Optimierung des gebundenen Kapitals.',
    h1: 'Lagerumschlag Rechner – Umschlagshäufigkeit & Verweildauer berechnen',
    shortDescription: 'Ermittelt wie oft sich das Lager pro Jahr dreht und die Lagerdauer.',
    searchKeywords: ['lagerumschlagshaeufigkeit rechner formel wareneinsatz lagerbestand', 'durchschnittliche lagerdauer tage 360 durch umschlag', 'lagerbestand optimieren bwl kennzahl', 'kapitalbindung lager reduzieren'],
    inputs: [
      { id: 'costOfGoodsSold', label: 'Jährlicher Wareneinsatz (Wareneinkauf zu Einstandspreisen)', type: 'number', defaultValue: 600000, min: 1000, max: 1000000000, step: 5000, unit: '€/Jahr' },
      { id: 'avgInventoryValue', label: 'Durchschnittlicher Lagerbestand (Ø Inventurwert)', type: 'number', defaultValue: 100000, min: 100, max: 100000000, step: 1000, unit: '€' },
    ],
    calculateCode: `const cogs = Number(inputs.costOfGoodsSold) || 0;
const inv = Number(inputs.avgInventoryValue) || 1;

// Lagerumschlagshäufigkeit = Wareneinsatz / durchschnittlicher Lagerbestand
const turnover = cogs / inv;
// Durchschnittliche Lagerdauer in Tagen = 360 / Umschlagshäufigkeit
const durationDays = turnover > 0 ? 360 / turnover : 360;

return {
  primary: { id: 'turnover', label: 'Lagerumschlagshäufigkeit', value: turnover, formattedValue: formatNumber(turnover, 2) + ' Umschläge / Jahr', highlight: true },
  secondary: [
    { id: 'duration', label: 'Durchschnittliche Lagerdauer', value: durationDays, formattedValue: 'ca. ' + Math.round(durationDays) + ' Tage im Lager' },
    { id: 'capitalBound', label: 'Gebundenes Kapital im Lager', value: inv, formattedValue: formatCurrency(inv) },
  ],
  summaryText: 'Das Lager dreht sich genau ' + formatNumber(turnover, 2) + '-mal pro Jahr. Ein Produkt verweilt im Durchschnitt rund ' + Math.round(durationDays) + ' Tage im Lager.',
};`,
    formula: 'Umschlagshäufigkeit = Wareneinsatz / Ø Lagerbestand; Lagerdauer (Tage) = 360 / Umschlagshäufigkeit',
    formulaExplanation: 'Je höher die Umschlagshäufigkeit, desto schneller werden Waren verkauft, desto weniger Kapital ist zinslos im Lager gebunden und desto geringer ist das Risiko von Verderb oder Veralterung.',
    workedExample: {
      title: 'Beispiel: 600.000 € Jahres-Wareneinsatz bei 100.000 € mittlerem Lagerbestand',
      inputValues: [{ label: 'Wareneinsatz', value: '600.000 €' }, { label: 'Lager', value: '100.000 €' }],
      steps: ['Umschlagshäufigkeit = 600.000 / 100.000 = 6,0-mal', 'Lagerdauer = 360 / 6 = 60 Tage'],
      result: '6 Umschläge / Jahr (60 Tage Lagerdauer)',
    },
    faqs: [
      { question: 'Wie berechnet man den durchschnittlichen Lagerbestand?', answer: 'Einfache Formel: (Anfangsbestand + Endbestand) / 2. Für genauere Werte bei saisonalen Schwankungen: (Anfangsbestand + 12 Monatsendbestände) / 13.' },
      { question: 'Welche Nachteile hat eine zu hohe Lagerumschlagshäufigkeit?', answer: 'Ein zu straff geführtes Lager kann bei Lieferkettenproblemen zu Lieferunfähigkeit ("Out of Stock") und entgangenen Umsätzen führen. Ein Sicherheitsbestand bleibt unverzichtbar.' },
    ],
    relatedSlugs: ['wareneinsatzquote-rechner', 'working-capital-rechner', 'liquiditaetsgrad-rechner'],
  },

  {
    id: 'stundensatz-kalkulation-freiberufler-rechner',
    slug: 'stundensatz-kalkulation-freiberufler-rechner',
    name: 'Stundensatz Rechner für Freiberufler & Selbstständige (Kalkulation)',
    shortName: 'Stundensatz Rechner',
    category: 'business',
    subcategory: 'Kostenrechnung & Controlling',
    metaTitle: 'Stundensatz Rechner – Honorar für Freiberufler & Selbstständige kalkulieren',
    metaDescription: 'Berechnen Sie Ihren Mindest-Stundensatz netto nach Wunsch-Nettoeinkommen, Betriebsausgaben, Krankenversicherung, Steuern, Urlaub, Krankheit und bezahlbaren Stunden.',
    h1: 'Stundensatz Rechner – Honorar für Selbstständige & Freelancer',
    shortDescription: 'Kalkuliert den benötigten Stundensatz nach Lebenshaltungskosten und Auslastung.',
    searchKeywords: ['stundensatz kalkulation freiberufler rechner', 'freelancer stundensatz berechnen formel urlaub krankheit', 'wieviel stundensatz als selbststaendiger verlangen', 'honorar berechnen netto zielgehalt'],
    inputs: [
      { id: 'desiredNetAnnual', label: 'Gewünschtes Nettoeinkommen pro Jahr', type: 'number', defaultValue: 45000, min: 10000, max: 500000, step: 2500, unit: '€ Netto' },
      { id: 'businessExpensesAnnual', label: 'Betriebsausgaben pro Jahr (Software, Büro, Steuerberater)', type: 'number', defaultValue: 12000, min: 0, max: 500000, step: 1000, unit: '€' },
      { id: 'vacationAndSickDays', label: 'Nicht fakturierbare Tage (Urlaub, Feiertage, Krankheit)', type: 'number', defaultValue: 45, min: 20, max: 100, step: 5, unit: 'Tage' },
      { id: 'billableRatioPct', label: 'Fakturierbare Arbeitszeit (Auslastung – Rest ist Akquise/Admin)', type: 'number', defaultValue: 60, min: 20, max: 95, step: 5, unit: '%' },
    ],
    calculateCode: `const net = Number(inputs.desiredNetAnnual) || 45000;
const expenses = Number(inputs.businessExpensesAnnual) || 12000;
const offDays = Number(inputs.vacationAndSickDays) || 45;
const billableRatio = (Number(inputs.billableRatioPct) || 60) / 100;

// Faustregel für Steuern + private/gesetzliche Krankenversicherung + Altersvorsorge:
// Bruttobedarf vor Steuern ≈ Netto * 1.65
const grossIncomeNeeded = net * 1.65;
const totalRevenueNeeded = grossIncomeNeeded + expenses;

// Arbeitstage pro Jahr: 52 Wochen * 5 Tage = 260 Arbeitstage
const workingDays = Math.max(100, 260 - offDays);
const totalWorkHours = workingDays * 8; // 8h-Tag
const billableHours = totalWorkHours * billableRatio;

const hourlyRateNet = billableHours > 0 ? totalRevenueNeeded / billableHours : 0;
const dailyRateNet = hourlyRateNet * 8;

return {
  primary: { id: 'hourlyRate', label: 'Empfohlener Netto-Stundensatz', value: hourlyRateNet, formattedValue: formatCurrency(hourlyRateNet) + ' / Stunde', highlight: true },
  secondary: [
    { id: 'dailyRate', label: 'Entsprechender Tagessatz (8h)', value: dailyRateNet, formattedValue: formatCurrency(dailyRateNet) + ' / Tag' },
    { id: 'billableHoursDisplay', label: 'Fakturierbare Stunden pro Jahr', value: billableHours, formattedValue: Math.round(billableHours) + ' Stunden' },
    { id: 'totalRev', label: 'Benötigter Jahres-Nettoumsatz', value: totalRevenueNeeded, formattedValue: formatCurrency(totalRevenueNeeded) },
  ],
  summaryText: 'Um ' + formatCurrency(net) + ' Nettoeinkommen zu erzielen, müssen Sie bei ' + Math.round(billableHours) + ' fakturierbaren Jahresstunden mindestens ' + formatCurrency(hourlyRateNet) + ' netto pro Stunde (' + formatCurrency(dailyRateNet) + '/Tag) abrechnen.',
};`,
    formula: 'Stundensatz = (Bruttoeinkommen + Vorsorge + Betriebskosten) / (Arbeitstage × 8h × Fakturierbarkeitsquote)',
    formulaExplanation: 'Freelancer können selten mehr als 50 % bis 65 % ihrer Arbeitszeit direkt abrechnen. Der Rest entfällt auf Buchhaltung, Akquise, Kundenberatung und Fortbildung.',
    workedExample: {
      title: 'Beispiel: 45.000 € Wunsch-Netto bei 12.000 € Kosten und 60 % Auslastung',
      inputValues: [{ label: 'Netto', value: '45.000 €' }, { label: 'Kosten', value: '12.000 €' }, { label: 'Auslastung', value: '60 %' }],
      steps: ['Umsatzbedarf = (45.000 € × 1,65) + 12.000 € = 86.250 €', 'Arbeitstage = 260 - 45 = 215 Tage', 'Fakturierbare Stunden = 215 × 8 × 0,60 = 1.032 Stunden', 'Stundensatz = 86.250 € / 1.032 h ≈ 83,58 € / Stunde'],
      result: '84,00 € / Stunde (Tagessatz ca. 670 €)',
    },
    faqs: [
      { question: 'Warum reicht ein Stundensatz von 40 oder 50 Euro meist nicht aus?', answer: 'Weil ein Selbstständiger alle Sozialabgaben (ca. 19 % Kranken-/Pflegeversicherung, Altersvorsorge), Urlaubstage, Krankheitsausfälle und unbezahlte Akquisezeiten allein aus seinem Stundensatz finanzieren muss. Unter 70-80 € droht im Alter Altersarmut.' },
      { question: 'Sollte man nach Festpreis oder Stundensatz abrechnen?', answer: 'Für erfahrene Dienstleister ist die wertbasierte Pauschalabrechnung (Value-Based Pricing) oft lukrativer: Je schneller und effizienter gearbeitet wird, desto höher steigt der effektive Stundenlohn.' },
    ],
    relatedSlugs: ['brutto-netto-rechner', 'deckungsbeitrag-rechner', 'umsatzrentabilitaet-rechner'],
  },
];

console.log('Building business part 2 with', calcs.length, 'calculators');
fs.writeFileSync(path.join(__dirname, 'calcs-business-part2.json'), JSON.stringify(calcs, null, 2), 'utf8');
console.log('Saved calcs-business-part2.json');
