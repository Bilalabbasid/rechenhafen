import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_BUSINESS_STATISTIK: CalculatorDefinition[] = [
  {
    id: "deckungsbeitrag-rechner",
    slug: "deckungsbeitrag-rechner",
    name: "Deckungsbeitrag-Rechner (DB I, Stückdeckungsbeitrag & DB-Quote)",
    shortName: "Deckungsbeitrag-Rechner",
    category: "business",
    subcategory: "Kostenrechnung & Controlling",
    metaTitle: 'Deckungsbeitrag Rechner – Stück-DB, DB I',
    metaDescription: 'Berechnen Sie den Deckungsbeitrag pro Stück (db = Preis - variable Kosten), den Gesamt-Deckungsbeitrag (DB I), die DB-Quote in % und das Betriebsergebnis.',
    h1: 'Deckungsbeitrag Rechner – DB I, Stück-DB & DB-Quote kalkulieren',
    shortDescription: 'Ermittelt Stückdeckungsbeitrag, Gesamtdeckungsbeitrag und Betriebsergebnis mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["deckungsbeitrag rechner dbi stueckdeckungsbeitrag","deckungsbeitragsquote berechnen formel","umsatz variable kosten fixkosten betriebsergebnis","deckungsbeitrag 1 berechnen bwl"],
    inputs: [
          {
                "id": "pricePerUnit",
                "label": "Verkaufspreis netto pro Stück",
                "type": "number",
                "defaultValue": 50,
                "min": 0.01,
                "max": 1000000,
                "step": 1,
                "unit": "€"
          },
          {
                "id": "variableCostPerUnit",
                "label": "Variable Stückkosten (Material, Fertigung)",
                "type": "number",
                "defaultValue": 20,
                "min": 0,
                "max": 1000000,
                "step": 1,
                "unit": "€"
          },
          {
                "id": "unitsSold",
                "label": "Absatzmenge (Verkaufte Stückzahl)",
                "type": "number",
                "defaultValue": 1000,
                "min": 1,
                "max": 10000000,
                "step": 10,
                "unit": "Stück"
          },
          {
                "id": "fixedCostsTotal",
                "label": "Gesamte fixe Kosten (Miete, Gehälter etc.)",
                "type": "number",
                "defaultValue": 20000,
                "min": 0,
                "max": 100000000,
                "step": 500,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const p = Number(inputs.pricePerUnit) || 0;
      const kv = Number(inputs.variableCostPerUnit) || 0;
      const qty = Number(inputs.unitsSold) || 0;
      const kf = Number(inputs.fixedCostsTotal) || 0;
      
      // Stückdeckungsbeitrag db = p - k_v
      const unitDb = p - kv;
      // Gesamtumsatz = p * qty
      const totalRevenue = p * qty;
      // Gesamtdeckungsbeitrag DB = db * qty
      const totalDb = unitDb * qty;
      // Deckungsbeitragsquote in % = (db / p) * 100
      const dbRatio = p > 0 ? (unitDb / p) * 100 : 0;
      // Betriebsergebnis (Gewinn/Verlust) = DB - Kf
      const profit = totalDb - kf;
      // Break-Even Menge = Kf / db
      const bepUnits = unitDb > 0 ? Math.ceil(kf / unitDb) : 0;
      
      return {
        primary: { id: 'totalDb', label: 'Gesamtdeckungsbeitrag (DB I)', value: totalDb, formattedValue: formatCurrency(totalDb), highlight: true },
        secondary: [
          { id: 'unitDb', label: 'Stückdeckungsbeitrag (db)', value: unitDb, formattedValue: formatCurrency(unitDb) + ' / Stück' },
          { id: 'dbRatio', label: 'Deckungsbeitragsquote', value: dbRatio, formattedValue: formatPercent(dbRatio) },
          { id: 'operatingResult', label: 'Betriebsergebnis (Gewinn nach Fixkosten)', value: profit, formattedValue: formatCurrency(profit) },
          { id: 'bepUnits', label: 'Gewinnschwelle (Break-Even-Menge)', value: bepUnits, formattedValue: bepUnits + ' Stück' },
        ],
        summaryText: 'Bei ' + qty + ' Stück erzielen Sie einen Gesamt-Deckungsbeitrag von ' + formatCurrency(totalDb) + ' (DB-Quote ' + formatPercent(dbRatio) + '). Nach Abzug der Fixkosten von ' + formatCurrency(kf) + ' verbleibt ein Betriebsgewinn von ' + formatCurrency(profit) + '.',
      };
    },
    formula: "db = Preis - variable Kosten; DB_ges = db × Absatzmenge; DB-Quote = (db / Preis) × 100; Gewinn = DB_ges - Fixkosten",
    formulaExplanation: "Der Deckungsbeitrag gibt an, wie viel ein verkauftes Produkt zur Deckung der fixen Unternehmensgesamtkosten (Miete, Gehälter, Zinsen) beiträgt.",
    workedExample: {
          "title": "Beispiel: Produktverkauf 50 € mit 20 € variablen Kosten bei 1.000 Stück (Fixkosten 20.000 €)",
          "inputValues": [
                {
                      "label": "Preis",
                      "value": "50 €"
                },
                {
                      "label": "Var. Kosten",
                      "value": "20 €"
                },
                {
                      "label": "Menge",
                      "value": "1.000"
                },
                {
                      "label": "Fixkosten",
                      "value": "20.000 €"
                }
          ],
          "steps": [
                "db = 50 - 20 = 30 € pro Stück",
                "DB_ges = 1.000 × 30 € = 30.000 €",
                "Gewinn = 30.000 € - 20.000 € = 10.000 €",
                "Break-Even = 20.000 / 30 = 667 Stück"
          ],
          "result": "DB = 30.000 €, Gewinn = 10.000 €"
    },
    content: {
      intro: 'Der Deckungsbeitrag (DB) ist der Geldbetrag, der nach Abzug der variablen Kosten vom Umsatzerlös zur Deckung der fixen Unternehmenskosten verbleibt.',
      details: 'Deckungsbeitrag I = Umsatzerlöse - variable Kosten. Deckungsbeitrag in % (Deckungsbeitragsquote) = (DB / Umsatz) · 100. Produkte mit negativem Deckungsbeitrag verursachen bei jedem Verkauf Verluste und müssen eliminiert werden.',
    },
    faqs: [
      { question: 'Was ist die mehrstufige Deckungsbeitragsrechnung?', answer: 'Sie spaltet die Fixkosten hierarchisch auf: Zuerst Erzeugnisfixkosten, dann Produktgruppenfixkosten, Bereichsfixkosten und schließlich Unternehmensfixkosten, um echte Verlustbringer aufzudecken.' },
      { question: 'Was bedeutet die absolute Preisuntergrenze?', answer: 'Die kurzfristige Preisuntergrenze entspricht genau den variablen Stückkosten (DB = 0); zu diesem Preis darf ein Zusatzauftrag bei freien Kapazitäten kurzfristig angenommen werden.' },
    ],
    relatedSlugs: ['stundensatz-kalkulation-freiberufler-rechner', 'break-even-rechner', 'marge-rechner', 'roi-rechner'],
  },
  {
    id: "roas-rechner",
    slug: "roas-rechner",
    name: "ROAS-Rechner (Return on Ad Spend & Break-Even-ROAS)",
    shortName: "ROAS-Rechner",
    category: "business",
    subcategory: "Marketing & Vertrieb",
    metaTitle: 'ROAS Rechner – Return on Ad Spend – RechenHafen',
    metaDescription: 'Berechnen Sie den ROAS in % und als Faktor (z. B. 4x = 400 %) für Google Ads, Meta Ads und TikTok sowie den erforderlichen Break-Even-ROAS nach.',
    h1: 'ROAS Rechner – Return on Ad Spend für Online-Marketing berechnen',
    shortDescription: 'Ermittelt Werberentabilität (ROAS) und Mindest-ROAS für Profitabilität mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["roas rechner return on ad spend formel","break even roas berechnen marge ecommerce","google ads roas faktor prozent","werberendite berechnen umsatz ad spend"],
    inputs: [
          {
                "id": "adRevenue",
                "label": "Durch Werbung erzielter Umsatz",
                "type": "number",
                "defaultValue": 10000,
                "min": 1,
                "max": 100000000,
                "step": 100,
                "unit": "€"
          },
          {
                "id": "adSpend",
                "label": "Werbeausgaben (Ad Spend)",
                "type": "number",
                "defaultValue": 2500,
                "min": 1,
                "max": 10000000,
                "step": 50,
                "unit": "€"
          },
          {
                "id": "productMarginPct",
                "label": "Produktmarge / Handelsspanne vor Werbekosten",
                "type": "number",
                "defaultValue": 50,
                "min": 1,
                "max": 100,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const rev = Number(inputs.adRevenue) || 0;
      const spend = Number(inputs.adSpend) || 1;
      const marginPct = Number(inputs.productMarginPct) || 50;
      
      // ROAS als Faktor: Umsatz / Werbeausgaben
      const roasFactor = rev / spend;
      const roasPercent = roasFactor * 100;
      
      // Break-Even ROAS: 1 / (Marge in %)
      // Beispiel: 50% Marge -> Break Even ROAS = 1 / 0.5 = 2.0 (200%)
      const breakEvenRoas = 1 / (marginPct / 100);
      const isProfitable = roasFactor >= breakEvenRoas;
      
      // Netto-Werbegewinn = (Umsatz * Marge%) - AdSpend
      const grossProfitFromSales = rev * (marginPct / 100);
      const netProfitFromAds = grossProfitFromSales - spend;
      
      return {
        primary: { id: 'roasFactor', label: 'ROAS-Faktor', value: roasFactor, formattedValue: formatNumber(roasFactor, 2) + 'x (' + Math.round(roasPercent) + ' %)', highlight: true },
        secondary: [
          { id: 'netProfit', label: 'Netto-Gewinn aus Kampagnen', value: netProfitFromAds, formattedValue: formatCurrency(netProfitFromAds) },
          { id: 'beRoas', label: 'Benötigter Break-Even-ROAS', value: breakEvenRoas, formattedValue: formatNumber(breakEvenRoas, 2) + 'x (' + Math.round(breakEvenRoas * 100) + ' %)' },
          { id: 'profitability', label: 'Kampagnen-Status', value: isProfitable ? 1 : 0, formattedValue: isProfitable ? 'Profitabel (über Break-Even)' : 'Verlustbringend (unter Break-Even)' },
        ],
        summaryText: 'Ihr ROAS beträgt ' + formatNumber(roasFactor, 2) + 'x (' + Math.round(roasPercent) + ' %). Jeder investierte Euro Werbung generiert ' + formatCurrency(roasFactor) + ' Umsatz. Nach Abzug aller Produkt- und Werbekosten verbleibt ein Gewinn von ' + formatCurrency(netProfitFromAds) + '.',
      };
    },
    formula: "ROAS = Umsatz / Werbeausgaben; Break-Even-ROAS = 1 / (Produktmarge in %); Nettogewinn = (Umsatz × Marge) - Ad Spend",
    formulaExplanation: "Ein ROAS von 4x bedeutet, dass jeder investierte Werbe-Euro 4 Euro Umsatz generiert. Ob die Kampagne profitabel ist, hängt von der Produktmarge ab.",
    workedExample: {
          "title": "Beispiel: 10.000 € Umsatz bei 2.500 € Ad Spend (Marge 50 %)",
          "inputValues": [
                {
                      "label": "Umsatz",
                      "value": "10.000 €"
                },
                {
                      "label": "Ad Spend",
                      "value": "2.500 €"
                },
                {
                      "label": "Marge",
                      "value": "50 %"
                }
          ],
          "steps": [
                "ROAS = 10.000 / 2.500 = 4,0x (400 %)",
                "Break-Even-ROAS = 1 / 0,50 = 2,0x",
                "Bruttogewinn = 10.000 × 0,50 = 5.000 €",
                "Nettogewinn = 5.000 € - 2.500 € = 2.500 €"
          ],
          "result": "ROAS 4,0x (2.500 € Nettogewinn)"
    },
    content: {
      intro: 'Der Return on Advertising Spend (ROAS) misst die Rentabilität bezahlter Werbekampagnen (Google Ads, Meta Ads) im E-Commerce und Online-Marketing.',
      details: 'ROAS = (Durch Werbung generierter Bruttoumsatz / Werbekosten) · 100. Ein ROAS von 400 % bedeutet, dass jeder investierte Werbeeuro 4,00 Euro Umsatz generiert.',
    },
    faqs: [
      { question: 'Was ist der Break-Even-ROAS?', answer: 'Der Mindest-ROAS, ab dem die Kampagne nach Abzug der Wareneinsatzkosten profitabel ist: Break-Even-ROAS = 1 / Bruttomarge (bei 25 % Marge liegt der Break-Even-ROAS bei 400 %).' },
      { question: 'Was unterscheidet ROAS von ROI?', answer: 'Der ROAS betrachtet isoliert den generierten Umsatz im Verhältnis zum reinen Ad-Spend; der ROI bezieht alle Kosten (Wareneinsatz, Personal, Software) ein und misst den tatsächlichen Nettogewinn.' },
    ],
    relatedSlugs: ['roi-rechner', 'marge-rechner', 'deckungsbeitrag-rechner'],
  },
  {
    id: "roi-rechner",
    slug: "roi-rechner",
    name: "ROI-Rechner (Return on Investment & Amortisationsdauer)",
    shortName: "ROI-Rechner",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'ROI Rechner – Return on Investment – RechenHafen',
    metaDescription: 'Berechnen Sie den Return on Investment (ROI in %) und die Amortisationsdauer in Monaten nach Investitionskosten und erzieltem Netto-Gewinnzuwachs.',
    h1: 'ROI Rechner – Return on Investment & Kapitalrendite ermitteln',
    shortDescription: 'Berechnet Kapitalrendite (ROI) und Amortisationsdauer von Investitionen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["roi rechner return on investment formel","kapitalrendite investition berechnen","amortisationszeit monate rechner","roi prozent berechnen gewinn kosten"],
    inputs: [
          {
                "id": "investmentCost",
                "label": "Einmalige Investitionskosten",
                "type": "number",
                "defaultValue": 50000,
                "min": 100,
                "max": 100000000,
                "step": 500,
                "unit": "€"
          },
          {
                "id": "annualNetGain",
                "label": "Jährlicher Netto-Gewinnzuwachs / Ersparnis",
                "type": "number",
                "defaultValue": 15000,
                "min": 1,
                "max": 10000000,
                "step": 250,
                "unit": "€/Jahr"
          },
          {
                "id": "holdingYears",
                "label": "Betrachtungszeitraum der Investition",
                "type": "number",
                "defaultValue": 5,
                "min": 1,
                "max": 30,
                "step": 1,
                "unit": "Jahre"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const inv = Number(inputs.investmentCost) || 1;
      const annualGain = Number(inputs.annualNetGain) || 0;
      const years = Number(inputs.holdingYears) || 5;
      
      const totalGainOverPeriod = annualGain * years;
      const netProfitTotal = totalGainOverPeriod - inv;
      
      // Gesamter ROI über den Betrachtungszeitraum: (Netto-Gewinn / Investition) * 100
      const totalRoiPct = (netProfitTotal / inv) * 100;
      // Annualisierter ROI:
      const annualRoiPct = (annualGain / inv) * 100;
      
      // Amortisationszeit in Jahren und Monaten:
      const paybackYears = annualGain > 0 ? inv / annualGain : 0;
      const paybackMonths = Math.round(paybackYears * 12);
      const pbY = Math.floor(paybackMonths / 12);
      const pbM = paybackMonths % 12;
      
      return {
        primary: { id: 'roi', label: 'Gesamter ROI über ' + years + ' Jahre', value: totalRoiPct, formattedValue: formatPercent(totalRoiPct), highlight: true },
        secondary: [
          { id: 'paybackTime', label: 'Amortisationszeit (Break-Even)', value: paybackYears, formattedValue: pbY + ' Jahre, ' + pbM + ' Monate' },
          { id: 'netProfit', label: 'Nettogewinn nach Investition', value: netProfitTotal, formattedValue: formatCurrency(netProfitTotal) },
          { id: 'annualRoi', label: 'Jährliche Rendite (p.a.)', value: annualRoiPct, formattedValue: formatPercent(annualRoiPct) + ' p.a.' },
        ],
        summaryText: 'Bei ' + formatCurrency(inv) + ' Investition und ' + formatCurrency(annualGain) + ' jährlichem Ertrag amortisiert sich das Projekt in ca. ' + pbY + ' Jahren und ' + pbM + ' Monaten. Der Gesamt-ROI nach ' + years + ' Jahren beträgt ' + formatPercent(totalRoiPct) + ' (' + formatCurrency(netProfitTotal) + ' Reingewinn).',
      };
    },
    formula: "ROI = ((Gesamtertrag - Investitionskosten) / Investitionskosten) × 100; Amortisation = Investition / Jahresertrag",
    formulaExplanation: "Der Return on Investment setzt den durch eine Maßnahme erwirtschafteten Reingewinn ins Verhältnis zum eingesetzten Kapital. Er dient als zentrale Entscheidungsgrundlage für unternehmerische Investitionen.",
    workedExample: {
          "title": "Beispiel: 50.000 € Investition in Maschinen bringt 15.000 € Ersparnis p.a. über 5 Jahre",
          "inputValues": [
                {
                      "label": "Investition",
                      "value": "50.000 €"
                },
                {
                      "label": "Ertrag p.a.",
                      "value": "15.000 €"
                },
                {
                      "label": "Dauer",
                      "value": "5 Jahre"
                }
          ],
          "steps": [
                "Gesamtertrag = 5 × 15.000 € = 75.000 €",
                "Nettogewinn = 75.000 € - 50.000 € = 25.000 €",
                "ROI = (25.000 / 50.000) × 100 = 50,0 %",
                "Amortisation = 50.000 / 15.000 = 3,33 Jahre (3 Jahre, 4 Monate)"
          ],
          "result": "50,0 % ROI (Amortisation nach 3,3 Jahren)"
    },
    content: {
      intro: 'Der Return on Investment (ROI nach dem DuPont-Kennzahlensystem) misst die Gesamtkapitalrentabilität einer Investition oder unternehmerischen Maßnahme.',
      details: 'ROI = (Nettogewinn der Investition / Gesamte Investitionskosten) · 100 = Umsatzrentabilität · Kapitalumschlag. Ein positiver ROI signalisiert echten Kapitalzuwachs.',
    },
    faqs: [
      { question: 'Welcher ROI gilt in der Industrie als benchmarkfähig?', answer: 'In der produzierenden Industrie wird häufig ein ROI von mindestens 12 bis 15 Prozent angestrebt, um Kapitalkosten (WACC) zu übertreffen und Risiken abzudecken.' },
      { question: 'Welche Schwachstelle hat die statische ROI-Betrachtung?', answer: 'Sie ignoriert den zeitlichen Anfall der Zahlungsströme (Zeitwert des Geldes); für mehrjährige Großprojekte ist die dynamische Kapitalwertmethode (NPV) vorzuziehen.' },
    ],
    relatedSlugs: ['roas-rechner', 'deckungsbeitrag-rechner', 'ebit-ebitda-rechner'],
  },
  {
    id: "ebit-ebitda-rechner",
    slug: "ebit-ebitda-rechner",
    name: "EBIT- & EBITDA-Rechner (Operatives Ergebnis & Marge berechnen)",
    shortName: "EBIT & EBITDA",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'EBIT & EBITDA Rechner – Operatives Ergebnis',
    metaDescription: 'Berechnen Sie EBIT (operatives Ergebnis vor Zinsen und Steuern), EBITDA (vor Abschreibungen) und die EBITDA-Marge in % aus Umsatzerlösen und Kosten.',
    h1: 'EBIT & EBITDA Rechner – Operatives Unternehmensergebnis ermitteln',
    shortDescription: 'Berechnet EBIT, EBITDA und operative Margen nach GuV mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["ebit rechner ebitda marge formel","earnings before interest taxes bwl rechner","operativer gewinn vor zinsen steuern abschreibungen","ebitda berechnen guv umsatz"],
    inputs: [
          {
                "id": "revenue",
                "label": "Umsatzerlöse",
                "type": "number",
                "defaultValue": 500000,
                "min": 1000,
                "max": 1000000000,
                "step": 5000,
                "unit": "€"
          },
          {
                "id": "materialExpense",
                "label": "Materialaufwand / Wareneinsatz",
                "type": "number",
                "defaultValue": 180000,
                "min": 0,
                "max": 1000000000,
                "step": 2500,
                "unit": "€"
          },
          {
                "id": "personnelExpense",
                "label": "Personalaufwand (Gehälter, Sozialabgaben)",
                "type": "number",
                "defaultValue": 170000,
                "min": 0,
                "max": 1000000000,
                "step": 2500,
                "unit": "€"
          },
          {
                "id": "otherOperatingExpenses",
                "label": "Sonstige betriebliche Aufwendungen (Miete, Marketing)",
                "type": "number",
                "defaultValue": 50000,
                "min": 0,
                "max": 1000000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "depreciation",
                "label": "Abschreibungen auf Sachanlagen & immaterielle Werte (AfA)",
                "type": "number",
                "defaultValue": 25000,
                "min": 0,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const rev = Number(inputs.revenue) || 0;
      const mat = Number(inputs.materialExpense) || 0;
      const pers = Number(inputs.personnelExpense) || 0;
      const other = Number(inputs.otherOperatingExpenses) || 0;
      const afa = Number(inputs.depreciation) || 0;
      
      // EBITDA = Umsatz - Material - Personal - sonstige Kosten (ohne AfA)
      const ebitda = rev - mat - pers - other;
      // EBIT = EBITDA - Abschreibungen
      const ebit = ebitda - afa;
      
      const ebitdaMargin = rev > 0 ? (ebitda / rev) * 100 : 0;
      const ebitMargin = rev > 0 ? (ebit / rev) * 100 : 0;
      
      return {
        primary: { id: 'ebitda', label: 'EBITDA (vor Abschreibungen)', value: ebitda, formattedValue: formatCurrency(ebitda), highlight: true },
        secondary: [
          { id: 'ebit', label: 'EBIT (Operatives Betriebsergebnis)', value: ebit, formattedValue: formatCurrency(ebit), highlight: true },
          { id: 'ebitdaMargin', label: 'EBITDA-Marge', value: ebitdaMargin, formattedValue: formatPercent(ebitdaMargin) },
          { id: 'ebitMargin', label: 'EBIT-Marge', value: ebitMargin, formattedValue: formatPercent(ebitMargin) },
          { id: 'deprShare', label: 'Abschreibungen (AfA)', value: afa, formattedValue: formatCurrency(afa) },
        ],
        summaryText: 'Bei ' + formatCurrency(rev) + ' Umsatz erzielt das Unternehmen ein EBITDA von ' + formatCurrency(ebitda) + ' (EBITDA-Marge ' + formatPercent(ebitdaMargin) + ') und ein EBIT von ' + formatCurrency(ebit) + ' (EBIT-Marge ' + formatPercent(ebitMargin) + ').',
      };
    },
    formula: "EBITDA = Umsatz - betriebliche Aufwendungen (ohne AfA); EBIT = EBITDA - Abschreibungen; Marge = (Kennzahl / Umsatz) × 100",
    formulaExplanation: "EBITDA neutralisiert Unterschiede in Steuergesetzen, Finanzierungsstrukturen und Abschreibungsmethoden und ermöglicht den objektiven internationalen Vergleich der operativen Ertragskraft.",
    workedExample: {
          "title": "Beispiel: Mittelständler mit 500.000 € Umsatz und 25.000 € AfA",
          "inputValues": [
                {
                      "label": "Umsatz",
                      "value": "500.000 €"
                },
                {
                      "label": "Betriebskosten",
                      "value": "400.000 €"
                },
                {
                      "label": "AfA",
                      "value": "25.000 €"
                }
          ],
          "steps": [
                "EBITDA = 500.000 € - 400.000 € = 100.000 €",
                "EBIT = 100.000 € - 25.000 € = 75.000 €",
                "EBITDA-Marge = 100.000 / 500.000 = 20,0 %"
          ],
          "result": "EBITDA: 100.000 €, EBIT: 75.000 €"
    },
    content: {
      intro: 'EBIT (operatives Betriebsergebnis) und EBITDA (Ergebnis vor Zinsen, Steuern und Abschreibungen) messen die reine Ertragskraft des operativen Kerngeschäfts.',
      details: 'EBIT = Jahresüberschuss + Ertragsteuern + Finanzergebnis. EBITDA = EBIT + Abschreibungen auf Sachanlagen (Depreciation) + Abschreibungen auf immaterielle Vermögensgegenstände (Amortization).',
    },
    faqs: [
      { question: 'Warum schätzen internationale Investoren das EBITDA so sehr?', answer: 'Weil es die operative Ertragskraft unabhängig von nationalen Steuersystemen, Finanzierungsstrukturen (Fremdkapitalanteil) und willkürlichen Abschreibungsmethoden vergleichbar macht.' },
      { question: 'Was ist das Problem beim EBITDA?', answer: 'Es ignoriert reale Reinvestitionskosten: Maschinen und Software veralten und müssen zwingend ersetzt werden (Warren Buffett bezeichnet EBITDA daher oft als geschönte Größe).' },
    ],
    relatedSlugs: ['abschreibung-linear-degressiv-rechner', 'cashflow-rechner', 'roi-rechner', 'umsatzrentabilitaet-rechner'],
  },
  {
    id: "cashflow-rechner",
    slug: "cashflow-rechner",
    name: "Cashflow-Rechner (Operativer Cashflow nach Praktiker-Formel)",
    shortName: "Cashflow-Rechner",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Cashflow Rechner – Operativen Cashflow berechnen',
    metaDescription: 'Berechnen Sie den operativen Cashflow nach der Praktiker-Formel: Jahresüberschuss + Abschreibungen (AfA) + Veränderung der langfristigen Rückstellungen.',
    h1: 'Cashflow Rechner – Operative Finanzkraft & Liquiditätszufluss',
    shortDescription: 'Ermittelt den operativen Cashflow und die Cashflow-Umsatzrate mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["cashflow rechner praktiker formel bwl","operativer cashflow berechnen jahresueberschuss abschreibungen","cashflow marge quote umsatz","innenfinanzierungskraft unternehmen"],
    inputs: [
          {
                "id": "netIncome",
                "label": "Jahresüberschuss / Reingewinn nach Steuern",
                "type": "number",
                "defaultValue": 60000,
                "min": -100000000,
                "max": 100000000,
                "step": 2500,
                "unit": "€"
          },
          {
                "id": "depreciation",
                "label": "Abschreibungen auf Anlagevermögen (AfA)",
                "type": "number",
                "defaultValue": 35000,
                "min": 0,
                "max": 10000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "changeProvisions",
                "label": "Zuführung zu langfristigen Rückstellungen (z. B. Pensionen)",
                "type": "number",
                "defaultValue": 10000,
                "min": -10000000,
                "max": 10000000,
                "step": 500,
                "unit": "€"
          },
          {
                "id": "revenue",
                "label": "Gesamtumsatz (für Cashflow-Marge)",
                "type": "number",
                "defaultValue": 500000,
                "min": 1000,
                "max": 1000000000,
                "step": 5000,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const netInc = Number(inputs.netIncome) || 0;
      const afa = Number(inputs.depreciation) || 0;
      const prov = Number(inputs.changeProvisions) || 0;
      const rev = Number(inputs.revenue) || 1;
      
      // Praktiker-Cashflow: Jahresüberschuss + Abschreibungen + Zuführung Rückstellungen
      const cashflow = netInc + afa + prov;
      // Cashflow-Marge = (Cashflow / Umsatz) * 100
      const cashflowMargin = (cashflow / rev) * 100;
      
      return {
        primary: { id: 'cashflow', label: 'Operativer Cashflow (Praktiker-Methode)', value: cashflow, formattedValue: formatCurrency(cashflow), highlight: true },
        secondary: [
          { id: 'margin', label: 'Cashflow-Marge (Umsatzrate)', value: cashflowMargin, formattedValue: formatPercent(cashflowMargin) },
          { id: 'netIncomeDisplay', label: 'Jahresüberschuss', value: netInc, formattedValue: formatCurrency(netInc) },
          { id: 'nonCashExpenses', label: 'Nicht-zahlungswirksame Aufwendungen', value: afa + prov, formattedValue: formatCurrency(afa + prov) },
        ],
        summaryText: 'Der operative Cashflow beträgt ' + formatCurrency(cashflow) + '. Das entspricht einer Cashflow-Umsatzrate von ' + formatPercent(cashflowMargin) + '. Dieser Betrag steht dem Unternehmen für Tilgung, Investitionen und Ausschüttungen liquide zur Verfügung.',
      };
    },
    formula: "Cashflow = Jahresüberschuss + Abschreibungen + Veränderung Rückstellungen; Cashflow-Marge = (Cashflow / Umsatz) × 100",
    formulaExplanation: "Gewinn ist nicht gleich Geld! Abschreibungen mindern zwar den steuerlichen Gewinn, führen aber zu keinem Abfluss von Bankguthaben. Der Cashflow korrigiert dies und zeigt die echte finanzielle Selbstfinanzierungskraft.",
    workedExample: {
          "title": "Beispiel: 60.000 € Gewinn, 35.000 € AfA, 10.000 € Rückstellungen bei 500.000 € Umsatz",
          "inputValues": [
                {
                      "label": "Gewinn",
                      "value": "60.000 €"
                },
                {
                      "label": "AfA",
                      "value": "35.000 €"
                },
                {
                      "label": "Rückstellungen",
                      "value": "10.000 €"
                }
          ],
          "steps": [
                "Cashflow = 60.000 € + 35.000 € + 10.000 € = 105.000 €",
                "Cashflow-Marge = (105.000 / 500.000) × 100 = 21,0 %"
          ],
          "result": "105.000 € operativer Cashflow (21 % Marge)"
    },
    content: {
      intro: 'Der operative Cashflow (Mittelzufluss aus laufender Geschäftstätigkeit) beziffert die tatsächliche Innenfinanzierungskraft und Liquiditätsgenerierung eines Unternehmens.',
      details: 'Praktikerkennzahl (indirekte Methode): Jahresüberschuss + Abschreibungen + Zuführung zu Rückstellungen = Cashflow. Der Cashflow kann durch buchhalterische Gestaltungstricks kaum manipuliert werden ("Profit is an opinion, cash is a fact").',
    },
    faqs: [
      { question: 'Was ist der Free Cashflow (FCF)?', answer: 'Der freie Cashflow ist der operative Cashflow abzüglich der notwendigen Investitionen in Sachanlagen (CapEx); dieses Geld steht frei für Dividendenzahlungen oder Schuldentilgung bereit.' },
      { question: 'Kann ein hochprofitables Unternehmen mit positivem Gewinn insolvent werden?', answer: 'Ja, wenn die Gewinne nur auf dem Papier in offenen Kundenforderungen (Forderungen aus L.u.L.) gebunden sind, aber kein reales Geld auf dem Bankkonto zur Begleichung fälliger Gehälter vorhanden ist.' },
    ],
    relatedSlugs: ['abschreibung-linear-degressiv-rechner', 'ebit-ebitda-rechner', 'liquiditaetsgrad-rechner', 'working-capital-rechner'],
  },
  {
    id: "liquiditaetsgrad-rechner",
    slug: "liquiditaetsgrad-rechner",
    name: "Liquiditätsgrad-Rechner (Liquidität 1., 2. & 3. Grades)",
    shortName: "Liquiditätsgrade",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Liquiditätsgrad Rechner – Barliquidität, Quick Ratio',
    metaDescription: 'Berechnen Sie die Liquidität 1. Grades (Cash Ratio, Ziel 20-30 %), 2. Grades (Quick Ratio, Ziel 100 %) und 3.',
    h1: 'Liquiditätsgrade Rechner – Zahlungsfähigkeit 1., 2. & 3. Grades prüfen',
    shortDescription: 'Berechnet Cash Ratio, Quick Ratio und Current Ratio nach Bilanz.',
    searchKeywords: ["liquiditaetsgrade rechner 1 2 3 grad formel","barliquiditaet cash ratio quick ratio current ratio","zahlungsfaehigkeit unternehmen bilanzpruefung","liquiditaet 2 grades 100 prozent zielwert"],
    inputs: [
          {
                "id": "cashAndBanks",
                "label": "Flüssige Mittel (Kasse, Bankguthaben)",
                "type": "number",
                "defaultValue": 30000,
                "min": 0,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "shortTermReceivables",
                "label": "Kurzfristige Forderungen (LuL)",
                "type": "number",
                "defaultValue": 70000,
                "min": 0,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "inventories",
                "label": "Vorräte / Warenlager",
                "type": "number",
                "defaultValue": 60000,
                "min": 0,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "shortTermLiabilities",
                "label": "Kurzfristige Verbindlichkeiten (Lieferanten, Dispo)",
                "type": "number",
                "defaultValue": 80000,
                "min": 1,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cash = Number(inputs.cashAndBanks) || 0;
      const rec = Number(inputs.shortTermReceivables) || 0;
      const inv = Number(inputs.inventories) || 0;
      const liab = Number(inputs.shortTermLiabilities) || 1;
      
      // Liquidität 1. Grades (Cash Ratio): Barvermögen / Verbindlichkeiten * 100 (Ziel: 20-30%)
      const l1 = (cash / liab) * 100;
      // Liquidität 2. Grades (Quick Ratio): (Bar + Forderungen) / Verbindlichkeiten * 100 (Ziel: 100-120%)
      const l2 = ((cash + rec) / liab) * 100;
      // Liquidität 3. Grades (Current Ratio): Umlaufvermögen / Verbindlichkeiten * 100 (Ziel: 150-200%)
      const l3 = ((cash + rec + inv) / liab) * 100;
      
      return {
        primary: { id: 'l2', label: 'Liquidität 2. Grades (Quick Ratio)', value: l2, formattedValue: formatPercent(l2), highlight: true },
        secondary: [
          { id: 'l1', label: 'Liquidität 1. Grades (Cash Ratio, Ziel 20-30 %)', value: l1, formattedValue: formatPercent(l1) },
          { id: 'l3', label: 'Liquidität 3. Grades (Current Ratio, Ziel 150-200 %)', value: l3, formattedValue: formatPercent(l3) },
          { id: 'checkL2', label: 'Bewertung Zahlungsfähigkeit (2. Grad)', value: l2 >= 100 ? 1 : 0, formattedValue: l2 >= 100 ? 'Sehr gut (Forderungen + Bar decken alle kurzfristigen Schulden)' : 'Warnung: Unter 100 % (Zahlungsengpässe drohen)' },
        ],
        summaryText: 'Die Liquidität 1. Grades liegt bei ' + formatPercent(l1) + ', 2. Grades bei ' + formatPercent(l2) + ' und 3. Grades bei ' + formatPercent(l3) + '. Das Unternehmen ist ' + (l2 >= 100 ? 'solide finanziert und zahlungsfähig.' : 'gefährdet, fällige Verbindlichkeiten pünktlich zu begleichen.'),
      };
    },
    formula: "L1 (Cash Ratio) = Flüssige Mittel / Verb.; L2 (Quick Ratio) = (Flüssig + Ford.) / Verb.; L3 (Current Ratio) = Umlaufvermögen / Verb.",
    formulaExplanation: "Die Liquiditätsgrade zeigen, ob ein Unternehmen in der Lage ist, seine fälligen kurzfristigen Zahlungsverpflichtungen aus unterschiedlich schnell verflüssigbaren Vermögenswerten zu begleichen.",
    workedExample: {
          "title": "Beispiel: 30.000 € Kasse, 70.000 € Forderungen, 60.000 € Lager, 80.000 € Schulden",
          "inputValues": [
                {
                      "label": "Bar",
                      "value": "30.000 €"
                },
                {
                      "label": "Forderungen",
                      "value": "70.000 €"
                },
                {
                      "label": "Schulden",
                      "value": "80.000 €"
                }
          ],
          "steps": [
                "L1 = (30.000 / 80.000) × 100 = 37,5 %",
                "L2 = (100.000 / 80.000) × 100 = 125,0 % (Idealwert > 100 % erfüllt)",
                "L3 = (160.000 / 80.000) × 100 = 200,0 %"
          ],
          "result": "L1: 37,5 %, L2: 125 %, L3: 200 %"
    },
    content: {
      intro: 'Die Liquiditätsgrade (1., 2. und 3. Grades) analysieren die Fähigkeit eines Unternehmens, seinen kurzfristigen Zahlungsverpflichtungen jederzeit pünktlich nachzukommen.',
      details: 'Barliquidität (1. Grad, Cash Ratio) = Flüssige Mittel / kurzfristige Verbindlichkeiten (Ziel: 20–30 %). Einzugsbedingte Liquidität (2. Grad, Quick Ratio) = (Flüssige Mittel + Forderungen) / Verbindlichkeiten (Ziel: 100–120 %).',
    },
    faqs: [
      { question: 'Was misst die Current Ratio (Liquidität 3. Grades)?', answer: 'Current Ratio = Gesamtes Umlaufvermögen (inkl. Vorräte) / kurzfristige Verbindlichkeiten; sie sollte mindestens 150 bis 200 Prozent betragen.' },
      { question: 'Warum zählt man das Warenlager beim Quick Ratio (2. Grad) nicht mit?', answer: 'Weil Vorräte und Rohstoffe nicht sofort zu Geld gemacht werden können und bei Notverkäufen erhebliche Wertabschläge drohen.' },
    ],
    relatedSlugs: ['skonto-jahreszins-rechner', 'working-capital-rechner', 'cashflow-rechner', 'skontorechner'],
  },
  {
    id: "working-capital-rechner",
    slug: "working-capital-rechner",
    name: "Working-Capital-Rechner (Nettoumlaufvermögen & Working Capital Ratio)",
    shortName: "Working Capital",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Working Capital Rechner – Nettoumlaufvermögen',
    metaDescription: 'Berechnen Sie das Working Capital (Umlaufvermögen abzüglich kurzfristiger Verbindlichkeiten) und die Working Capital Ratio zur Beurteilung der.',
    h1: 'Working Capital Rechner – Nettoumlaufvermögen & Liquiditätspuffer',
    shortDescription: 'Ermittelt Working Capital und die Working Capital Ratio aus der Bilanz.',
    searchKeywords: ["working capital rechner nettoumlaufvermoegen formel","working capital ratio umlaufvermoegen verbindlichkeiten","working capital management optimieren","finanzielle stabilitaet bilanzkennzahl"],
    inputs: [
          {
                "id": "currentAssets",
                "label": "Gesamtes Umlaufvermögen (Kasse, Forderungen, Vorräte)",
                "type": "number",
                "defaultValue": 180000,
                "min": 0,
                "max": 1000000000,
                "step": 2500,
                "unit": "€"
          },
          {
                "id": "currentLiabilities",
                "label": "Kurzfristige Verbindlichkeiten (< 1 Jahr Laufzeit)",
                "type": "number",
                "defaultValue": 110000,
                "min": 1,
                "max": 1000000000,
                "step": 2500,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const assets = Number(inputs.currentAssets) || 0;
      const liab = Number(inputs.currentLiabilities) || 1;
      
      // Working Capital = Umlaufvermögen - kurzfristige Verbindlichkeiten
      const wc = assets - liab;
      // Working Capital Ratio = Umlaufvermögen / Verbindlichkeiten
      const wcRatio = (assets / liab) * 100;
      const isPositive = wc > 0;
      
      return {
        primary: { id: 'wc', label: 'Working Capital (Nettoumlaufvermögen)', value: wc, formattedValue: formatCurrency(wc), highlight: true },
        secondary: [
          { id: 'ratio', label: 'Working Capital Ratio', value: wcRatio, formattedValue: formatPercent(wcRatio) + ' (Faktor ' + formatNumber(assets / liab, 2) + 'x)' },
          { id: 'status', label: 'Finanzielle Solidität', value: isPositive ? 1 : 0, formattedValue: isPositive ? 'Positiv (stabiler Liquiditätspuffer vorhanden)' : 'Negativ (Liquiditätsrisiko / Umschuldungsbedarf)' },
        ],
        summaryText: 'Das Unternehmen verfügt über ein Working Capital von ' + formatCurrency(wc) + ' (Working Capital Ratio ' + formatPercent(wcRatio) + '). ' + (isPositive ? 'Der laufende Geschäftsbetrieb ist durch einen soliden Puffer abgesichert.' : 'Achtung: Kurzfristige Verbindlichkeiten übersteigen das Umlaufvermögen.'),
      };
    },
    formula: "Working Capital = Umlaufvermögen - kurzfristige Verbindlichkeiten; Ratio = (Umlaufvermögen / kurzfristige Verbindlichkeiten) × 100",
    formulaExplanation: "Ein positives Working Capital bedeutet, dass ein Teil des Umlaufvermögens langfristig finanziert ist. Das schützt das Unternehmen vor Zahlungsunfähigkeit, falls Zahlungen von Kunden stocken.",
    workedExample: {
          "title": "Beispiel: 180.000 € Umlaufvermögen und 110.000 € kurzfristige Verbindlichkeiten",
          "inputValues": [
                {
                      "label": "Umlaufvermögen",
                      "value": "180.000 €"
                },
                {
                      "label": "Verbindlichkeiten",
                      "value": "110.000 €"
                }
          ],
          "steps": [
                "Working Capital = 180.000 € - 110.000 € = +70.000 €",
                "Ratio = (180.000 / 110.000) × 100 = 163,6 %"
          ],
          "result": "+70.000 € Working Capital (Ratio 164 %)"
    },
    content: {
      intro: 'Das Net Working Capital (Nettoumlaufvermögen) ist das zinslos gebundene Betriebskapital, das die laufende Produktion und Lieferfähigkeit finanziert.',
      details: 'Formel: Working Capital = Umlaufvermögen - kurzfristige unverzinsliche Verbindlichkeiten. Ein positives Working Capital signalisiert, dass das Umlaufvermögen die kurzfristigen Schulden übersteigt und Liquiditätssicherheit besteht.',
    },
    faqs: [
      { question: 'Kann ein negatives Working Capital auch vorteilhaft sein?', answer: 'Ja, bei Geschäftsmodellen wie Discountern oder E-Commerce (z. B. Amazon): Kunden zahlen sofort bar oder per Kreditkarte, während Lieferanten erst nach 60 bis 90 Tagen bezahlt werden (Lieferantenkredit finanziert das Wachstum).' },
      { question: 'Wie optimiert man das Working Capital (Working Capital Management)?', answer: 'Durch stringentes Mahnwesen (kürzere Zahlungsziele für Kunden), Just-in-Time-Lagerhaltung (geringere Vorräte) und Verhandlung längerer Zahlungsziele bei Lieferanten.' },
    ],
    relatedSlugs: ['liquiditaetsgrad-rechner', 'cashflow-rechner', 'lagerumschlagshaeufigkeit-rechner'],
  },
  {
    id: "umsatzrentabilitaet-rechner",
    slug: "umsatzrentabilitaet-rechner",
    name: "Umsatzrentabilitäts-Rechner (Umsatzrendite & Return on Sales ROS)",
    shortName: "Umsatzrendite-Rechner",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Umsatzrentabilität Rechner – Umsatzrendite',
    metaDescription: 'Berechnen Sie die Umsatzrendite / Umsatzrentabilität (ROS in %): Wie viel Cent Reingewinn verbleiben dem Unternehmen von jedem Euro Umsatz?',
    h1: 'Umsatzrentabilität Rechner – Umsatzrendite (ROS) ermitteln',
    shortDescription: 'Berechnet die Umsatzrendite in Prozent aus Gewinn und Gesamtumsatz mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["umsatzrentabilitaet rechner formel gewinn umsatz","umsatzrendite return on sales ros prozent","wieviel cent gewinn pro euro umsatz","bruttoumsatzrendite nettoumsatzrendite berechnen"],
    inputs: [
          {
                "id": "revenue",
                "label": "Gesamtumsatz (Nettoumsatzerlöse)",
                "type": "number",
                "defaultValue": 1000000,
                "min": 100,
                "max": 1000000000,
                "step": 10000,
                "unit": "€"
          },
          {
                "id": "profit",
                "label": "Gewinn (Jahresüberschuss vor oder nach Steuern)",
                "type": "number",
                "defaultValue": 80000,
                "min": -100000000,
                "max": 100000000,
                "step": 2500,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const rev = Number(inputs.revenue) || 1;
      const prof = Number(inputs.profit) || 0;
      
      // Umsatzrendite ROS = (Gewinn / Umsatz) * 100
      const ros = (prof / rev) * 100;
      const centPerEuro = (prof / rev) * 100; // in Cent
      
      let rating = 'Solide Rentabilität';
      if (ros < 2.0) rating = 'Geringe Marge (stark krisenanfällig bei Preissteigerungen)';
      else if (ros < 5.0) rating = 'Durchschnittlicher Mittelstandsbereich';
      else if (ros < 10.0) rating = 'Gute Ertragskraft';
      else rating = 'Hervorragende Preismacht und Rentabilität';
      
      return {
        primary: { id: 'ros', label: 'Umsatzrendite (ROS)', value: ros, formattedValue: formatPercent(ros), highlight: true },
        secondary: [
          { id: 'centPerEuro', label: 'Gewinn pro 1 Euro Umsatz', value: centPerEuro, formattedValue: formatNumber(centPerEuro, 1) + ' Cent / Euro' },
          { id: 'rating', label: 'Brancheneinschätzung', value: 0, formattedValue: rating },
        ],
        summaryText: 'Von jedem Euro Umsatz verbleiben dem Unternehmen genau ' + formatNumber(centPerEuro, 1) + ' Cent Gewinn. Die Umsatzrendite beträgt ' + formatPercent(ros) + ' (' + rating + ').',
      };
    },
    formula: "Umsatzrentabilität (%) = (Gewinn / Umsatz) × 100",
    formulaExplanation: "Die Umsatzrendite zeigt die markt- und kostenseitige Effizienz eines Unternehmens: Sie beziffert, welcher Prozentsatz des Umsatzes als Gewinn im Unternehmen verbleibt.",
    workedExample: {
          "title": "Beispiel: 1.000.000 € Umsatz und 80.000 € Jahresgewinn",
          "inputValues": [
                {
                      "label": "Umsatz",
                      "value": "1.000.000 €"
                },
                {
                      "label": "Gewinn",
                      "value": "80.000 €"
                }
          ],
          "steps": [
                "Umsatzrendite = (80.000 / 1.000.000) × 100 = 8,0 %",
                "Entspricht 8 Cent Gewinn je 1 € Umsatz"
          ],
          "result": "8,0 % Umsatzrendite"
    },
    content: {
      intro: 'Die Umsatzrentabilität (Umsatzrendite / Return on Sales, ROS) beziffert den Gewinnanteil, den ein Unternehmen mit jedem umgesetzten Euro erwirtschaftet.',
      details: 'ROS = (Jahresüberschuss / Umsatzerlöse) · 100. Eine Umsatzrendite von 8 % bedeutet, dass nach Begleichung aller Material-, Personal-, Verwaltungs- und Steuerkosten von 100 € Umsatz genau 8 € Reingewinn verbleiben.',
    },
    faqs: [
      { question: 'Welche Branchen haben traditionell niedrige, welche hohe Umsatzrenditen?', answer: 'Der Lebensmitteleinzelhandel operiert oft mit extrem niedrigen Margen von 1,5 bis 3 Prozent (hohe Umschlagshäufigkeit); Software- und Pharmaunternehmen erzielen oft 20 bis 35 Prozent Umsatzrendite.' },
      { question: 'Was ist die operative Umsatzrendite (EBIT-Marge)?', answer: 'EBIT / Umsatz · 100; sie misst die reine operative Leistung vor Zinsaufwendungen und Steuern.' },
    ],
    relatedSlugs: ['marge-rechner', 'ebit-ebitda-rechner', 'eigenkapitalrentabilitaet-rechner', 'gesamtkapitalrentabilitaet-rechner'],
  },
  {
    id: "eigenkapitalrentabilitaet-rechner",
    slug: "eigenkapitalrentabilitaet-rechner",
    name: "Eigenkapitalrentabilitäts-Rechner (Return on Equity ROE & Leverage)",
    shortName: "ROE-Rechner",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Eigenkapitalrentabilität Rechner – Return on Equity',
    metaDescription: 'Berechnen Sie die Eigenkapitalrendite (ROE in % = Gewinn / Eigenkapital) und analysieren Sie den positiven oder negativen Leverage-Effekt von Fremdkapital.',
    h1: 'Eigenkapitalrentabilität Rechner – Return on Equity (ROE) berechnen',
    shortDescription: 'Berechnet die Eigenkapitalrendite (ROE) und den Leverage-Effekt mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["eigenkapitalrentabilitaet rechner roe formel","return on equity berechnen eigenkapital gewinn","leverage effekt fremdkapitalzinsen hebel","eigenkapitalverzinsung bwl aktie"],
    inputs: [
          {
                "id": "equity",
                "label": "Bilanziertes Eigenkapital",
                "type": "number",
                "defaultValue": 250000,
                "min": 1000,
                "max": 1000000000,
                "step": 5000,
                "unit": "€"
          },
          {
                "id": "netProfit",
                "label": "Jahresüberschuss (Reingewinn nach Steuern)",
                "type": "number",
                "defaultValue": 40000,
                "min": -100000000,
                "max": 100000000,
                "step": 2500,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const eq = Number(inputs.equity) || 1;
      const profit = Number(inputs.netProfit) || 0;
      
      // ROE = (Gewinn / Eigenkapital) * 100
      const roe = (profit / eq) * 100;
      
      let rating = 'Solide Verzinsung';
      if (roe < 0) rating = 'Kapitalvernichtung (Verlustjahr)';
      else if (roe < 6.0) rating = 'Unterdurchschnittlich (Risikoprämie gegenüber Festgeld zu gering)';
      else if (roe < 12.0) rating = 'Gute unternehmerische Verzinsung';
      else rating = 'Hervorragende Rendite auf das eingesetzte Eigenkapital';
      
      return {
        primary: { id: 'roe', label: 'Eigenkapitalrentabilität (ROE)', value: roe, formattedValue: formatPercent(roe), highlight: true },
        secondary: [
          { id: 'profitDisplay', label: 'Erzielter Jahresgewinn', value: profit, formattedValue: formatCurrency(profit) },
          { id: 'equityDisplay', label: 'Eingesetztes Eigenkapital', value: eq, formattedValue: formatCurrency(eq) },
          { id: 'rating', label: 'Bewertung für Eigentümer / Aktionäre', value: 0, formattedValue: rating },
        ],
        summaryText: 'Das eingesetzte Eigenkapital von ' + formatCurrency(eq) + ' verzinst sich mit ' + formatPercent(roe) + ' pro Jahr (' + rating + ').',
      };
    },
    formula: "Eigenkapitalrentabilität (%) = (Jahresüberschuss / Eigenkapital) × 100",
    formulaExplanation: "Die Eigenkapitalrendite zeigt den Eigentümern, wie profitabel ihr tatsächlich eingebrachtes Kapital im abgelaufenen Geschäftsjahr gearbeitet hat.",
    workedExample: {
          "title": "Beispiel: 250.000 € Eigenkapital erzielen 40.000 € Jahresgewinn",
          "inputValues": [
                {
                      "label": "Eigenkapital",
                      "value": "250.000 €"
                },
                {
                      "label": "Gewinn",
                      "value": "40.000 €"
                }
          ],
          "steps": [
                "ROE = (40.000 / 250.000) × 100 = 16,0 %"
          ],
          "result": "16,0 % Eigenkapitalrendite"
    },
    content: {
      intro: 'Die Eigenkapitalrentabilität (Return on Equity, ROE) misst die Verzinsung des von den Unternehmensinhabern bzw. Aktionären eingesetzten Eigenkapitals.',
      details: 'ROE = (Jahresüberschuss / Eigenkapital) · 100. Liegt der ROE dauerhaft unter dem Zinssatz für sichere Bundesanleihen, lohnt sich das unternehmerische Risiko für die Anteilseigner betriebswirtschaftlich nicht.',
    },
    faqs: [
      { question: 'Wie kann ein Unternehmen seine Eigenkapitalrendite künstlich aufblähen?', answer: 'Über den Leverage-Effekt: Durch Aufnahme von billigem Fremdkapital wird die Eigenkapitalbasis verkleinert; dies steigert den ROE, erhöht aber gleichzeitig das Insolvenzrisiko massiv.' },
      { question: 'Welcher ROE gilt für gesunde Mittelständler als solide?', answer: 'Werte zwischen 10 und 18 Prozent gelten im deutschen Mittelstand als solide und krisenfest.' },
    ],
    relatedSlugs: ['gesamtkapitalrentabilitaet-rechner', 'umsatzrentabilitaet-rechner', 'roi-rechner'],
  },
  {
    id: "gesamtkapitalrentabilitaet-rechner",
    slug: "gesamtkapitalrentabilitaet-rechner",
    name: "Gesamtkapitalrentabilitäts-Rechner (Return on Assets ROA & ROI)",
    shortName: "ROA-Rechner",
    category: "business",
    subcategory: "Finanzanalyse & Rentabilität",
    metaTitle: 'Gesamtkapitalrentabilität Rechner – Return on Assets berechnen',
    metaDescription: 'Berechnen Sie die Gesamtkapitalrendite (ROA in % = (Gewinn + Fremdkapitalzinsen) / Gesamtkapital) zur unabhängigen Bewertung der Leistungsfähigkeit des.',
    h1: 'Gesamtkapitalrentabilität Rechner – Kapitalverzinsung (ROA) ermitteln',
    shortDescription: 'Berechnet die Gesamtkapitalrendite unabhängig von der Finanzierung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["gesamtkapitalrentabilitaet rechner roa formel","return on assets berechnen bwl fremdkapitalzinsen","gesamtkapitalverzinsung bilanz aktiva","rentabilitaet des gesamtkapitals"],
    inputs: [
          {
                "id": "totalCapital",
                "label": "Gesamtkapital / Bilanzsumme (Passiva)",
                "type": "number",
                "defaultValue": 1000000,
                "min": 1000,
                "max": 1000000000,
                "step": 10000,
                "unit": "€"
          },
          {
                "id": "netProfit",
                "label": "Jahresüberschuss (Reingewinn)",
                "type": "number",
                "defaultValue": 60000,
                "min": -100000000,
                "max": 100000000,
                "step": 2500,
                "unit": "€"
          },
          {
                "id": "interestExpense",
                "label": "Fremdkapitalzinsen / Zinsaufwand an Banken",
                "type": "number",
                "defaultValue": 20000,
                "min": 0,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cap = Number(inputs.totalCapital) || 1;
      const profit = Number(inputs.netProfit) || 0;
      const interest = Number(inputs.interestExpense) || 0;
      
      // Gesamtkapitalrendite = ((Gewinn + Zinsaufwand) / Gesamtkapital) * 100
      const totalEarnings = profit + interest;
      const roa = (totalEarnings / cap) * 100;
      
      return {
        primary: { id: 'roa', label: 'Gesamtkapitalrentabilität (ROA)', value: roa, formattedValue: formatPercent(roa), highlight: true },
        secondary: [
          { id: 'totalEarn', label: 'Gesamtverzinsungs-Ertrag (Gewinn + Zinsen)', value: totalEarnings, formattedValue: formatCurrency(totalEarnings) },
          { id: 'interestShare', label: 'Davon Zinsaufwand an Banken', value: interest, formattedValue: formatCurrency(interest) },
          { id: 'capDisplay', label: 'Eingesetztes Gesamtkapital', value: cap, formattedValue: formatCurrency(cap) },
        ],
        summaryText: 'Das gesamte im Unternehmen gebundene Kapital erwirtschaftet eine Verzinsung von ' + formatPercent(roa) + ' (' + formatCurrency(totalEarnings) + ' Gesamtertrag auf ' + formatCurrency(cap) + ' Bilanzsumme).',
      };
    },
    formula: "Gesamtkapitalrentabilität (%) = ((Jahresüberschuss + Fremdkapitalzinsen) / Gesamtkapital) × 100",
    formulaExplanation: "Die Fremdkapitalzinsen werden zum Gewinn hinzugerechnet, weil sie der Ertrag sind, den das Fremdkapital für die Kreditgeber erwirtschaftet hat.",
    workedExample: {
          "title": "Beispiel: 1 Mio. € Gesamtkapital, 60.000 € Gewinn, 20.000 € Zinsen",
          "inputValues": [
                {
                      "label": "Gesamtkapital",
                      "value": "1.000.000 €"
                },
                {
                      "label": "Gewinn",
                      "value": "60.000 €"
                },
                {
                      "label": "Zinsen",
                      "value": "20.000 €"
                }
          ],
          "steps": [
                "Gesamtertrag = 60.000 € + 20.000 € = 80.000 €",
                "ROA = (80.000 / 1.000.000) × 100 = 8,0 %"
          ],
          "result": "8,0 % Gesamtkapitalrentabilität"
    },
    content: {
      intro: 'Die Gesamtkapitalrentabilität (Return on Assets, ROA) misst die Effizienz, mit der das gesamte im Unternehmen arbeitende Kapital (Eigen- und Fremdkapital) eingesetzt wird.',
      details: 'ROA = [(Jahresüberschuss + Fremdkapitalzinsen) / Gesamtkapital (Bilanzsumme)] · 100. Die Fremdkapitalzinsen werden hinzuaddiert, da sie die Ertragsleistung des Fremdkapitals darstellen.',
    },
    faqs: [
      { question: 'Warum werden die Fremdkapitalzinsen zum Gewinn hinzuaddiert?', answer: 'Weil die Gesamtkapitalrentabilität messen soll, wie produktiv das gesamte Vermögen gewirtschaftet hat, unabhängig davon, ob es von Banken oder Aktionären finanziert wurde.' },
      { question: 'Welche Bedingung muss für einen positiven Hebeleffekt (Leverage) gelten?', answer: 'Die Gesamtkapitalrentabilität muss zwingend höher sein als der Fremdkapitalzinssatz; liegt sie darunter, vernichtet jede Kreditaufnahme Eigenkapital (negativer Leverage).' },
    ],
    relatedSlugs: ['eigenkapitalrentabilitaet-rechner', 'umsatzrentabilitaet-rechner', 'ebit-ebitda-rechner'],
  },
  {
    id: "kundengewinnungskosten-cac-rechner",
    slug: "kundengewinnungskosten-cac-rechner",
    name: "CAC-Rechner: Kundengewinnungskosten berechnen",
    shortName: "CAC-Rechner",
    category: "business",
    subcategory: "Marketing & Vertrieb",
    metaTitle: 'CAC Rechner – Customer Acquisition Cost',
    metaDescription: 'Berechnen Sie die Customer Acquisition Costs (CAC in €) aus Marketing- und Vertriebsaufwand geteilt durch die Anzahl gewonnener Neukunden.',
    h1: 'CAC Rechner – Kundengewinnungskosten im Vertrieb berechnen',
    shortDescription: 'Ermittelt die durchschnittlichen Kosten für die Gewinnung eines Neukunden mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["cac rechner customer acquisition cost formel","kundengewinnungskosten berechnen marketing vertrieb","cac payback period monate","kosten pro neukunde ecommerce saas"],
    inputs: [
          {
                "id": "marketingCosts",
                "label": "Marketingausgaben im Zeitraum (Ads, Agentur)",
                "type": "number",
                "defaultValue": 15000,
                "min": 0,
                "max": 100000000,
                "step": 250,
                "unit": "€"
          },
          {
                "id": "salesCosts",
                "label": "Vertriebsausgaben (Vertriebsgehälter, Provisionen, CRM)",
                "type": "number",
                "defaultValue": 10000,
                "min": 0,
                "max": 100000000,
                "step": 250,
                "unit": "€"
          },
          {
                "id": "newCustomers",
                "label": "Im Zeitraum gewonnene Neukunden",
                "type": "number",
                "defaultValue": 250,
                "min": 1,
                "max": 1000000,
                "step": 1,
                "unit": "Kunden"
          },
          {
                "id": "avgMonthlyRevenue",
                "label": "Durchschnittlicher Umsatz pro Kunde & Monat",
                "type": "number",
                "defaultValue": 50,
                "min": 1,
                "max": 100000,
                "step": 5,
                "unit": "€/Monat"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const mkt = Number(inputs.marketingCosts) || 0;
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
      };
    },
    formula: "CAC = (Marketingkosten + Vertriebskosten) / Anzahl gewonnener Neukunden; Payback (Monate) = CAC / Monatsumsatz",
    formulaExplanation: "Die Customer Acquisition Cost (CAC) ist die zentrale Kennzahl im modernen Digital-Marketing und Vertrieb. Nur wenn der Wert eines Kunden (CLV) die CAC um ein Vielfaches übersteigt, ist das Geschäftsmodell skalierbar.",
    workedExample: {
          "title": "Beispiel: 25.000 € Marketing & Sales bringen 250 Neukunden (50 €/Monat Umsatz)",
          "inputValues": [
                {
                      "label": "Gesamtkosten",
                      "value": "25.000 €"
                },
                {
                      "label": "Neukunden",
                      "value": "250"
                }
          ],
          "steps": [
                "CAC = 25.000 € / 250 = 100 € pro Kunde",
                "Payback = 100 € / 50 €/Monat = 2,0 Monate"
          ],
          "result": "100 € CAC (2 Monate Payback)"
    },
    content: {
      intro: 'Die Customer Acquisition Cost (CAC) beziffern die durchschnittlichen Gesamtvertriebs- und Marketingkosten zur Gewinnung eines einzigen neuen zahlenden Kunden.',
      details: 'CAC = (Gesamte Marketing- und Vertriebsausgaben inklusive Gehälter) / Anzahl der Neukunden. Wichtig: Die Kosten müssen alle Werbebudgets, Gehälter der Sales-Mitarbeiter und CRM-Softwarelizenzen einschließen.',
    },
    faqs: [
      { question: 'In welchem Verhältnis sollten CAC und Customer Lifetime Value (CLV) stehen?', answer: 'Die goldene Faustregel im SaaS- und Digitalbusiness lautet: CLV zu CAC sollte mindestens 3:1 betragen; liegt das Verhältnis unter 1:1, verbrennt das Unternehmen mit jedem Neukunden Geld.' },
      { question: 'Was ist die CAC Payback Period?', answer: 'Die Zeitspanne in Monaten, die ein Kunde benötigt, um über seine Bruttomargenbeiträge die für ihn aufgewendeten Akquisitionskosten vollständig zu refinanzieren (ideal: < 12 Monate).' },
    ],
    relatedSlugs: ['customer-lifetime-value-clv-rechner', 'roas-rechner', 'lead-conversion-rate-rechner'],
  },
  {
    id: "customer-lifetime-value-clv-rechner",
    slug: "customer-lifetime-value-clv-rechner",
    name: "CLV-Rechner: Kundenwert berechnen",
    shortName: "CLV-Rechner",
    category: "business",
    subcategory: "Marketing & Vertrieb",
    metaTitle: 'CLV Rechner – Customer Lifetime Value',
    metaDescription: 'Berechnen Sie den Customer Lifetime Value (CLV in €) nach durchschnittlichem Bestellwert, Kauffrequenz, Kundenlebensdauer und Bruttomarge.',
    h1: 'CLV Rechner – Customer Lifetime Value & Kundenwert ermitteln',
    shortDescription: 'Berechnet den Kundenwert (CLV) über die gesamte Kundenbeziehung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["clv rechner customer lifetime value formel","kundenwert berechnen marketing ecommerce saas","clv cac ratio verhaeltnis 3 zu 1","lebenszeitwert eines kunden berechnen"],
    inputs: [
          {
                "id": "avgOrderValue",
                "label": "Durchschnittlicher Bestellwert / Warenkorb",
                "type": "number",
                "defaultValue": 80,
                "min": 1,
                "max": 100000,
                "step": 5,
                "unit": "€"
          },
          {
                "id": "purchaseFrequencyPerYear",
                "label": "Käufe pro Kunde und Jahr",
                "type": "number",
                "defaultValue": 4,
                "min": 0.1,
                "max": 365,
                "step": 0.5,
                "unit": "Käufe/Jahr"
          },
          {
                "id": "customerLifespanYears",
                "label": "Durchschnittliche Kundentreue / Lebensdauer",
                "type": "number",
                "defaultValue": 3,
                "min": 0.5,
                "max": 50,
                "step": 0.5,
                "unit": "Jahre"
          },
          {
                "id": "grossMarginPct",
                "label": "Bruttomarge / Deckungsbeitrag",
                "type": "number",
                "defaultValue": 50,
                "min": 1,
                "max": 100,
                "step": 1,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const aov = Number(inputs.avgOrderValue) || 0;
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
      };
    },
    formula: "CLV = Bestellwert × Kauffrequenz pro Jahr × Lebensdauer (Jahre) × Bruttomarge (%)",
    formulaExplanation: "Der Customer Lifetime Value beziffert den gesamten finanziellen Deckungsbeitrag, den ein durchschnittlicher Kunde während seiner gesamten Geschäftsbeziehung zum Unternehmen beiträgt.",
    workedExample: {
          "title": "Beispiel: 80 € Warenkorb, 4 Käufe pro Jahr über 3 Jahre bei 50 % Marge",
          "inputValues": [
                {
                      "label": "Warenkorb",
                      "value": "80 €"
                },
                {
                      "label": "Käufe/Jahr",
                      "value": "4"
                },
                {
                      "label": "Dauer",
                      "value": "3 Jahre"
                },
                {
                      "label": "Marge",
                      "value": "50 %"
                }
          ],
          "steps": [
                "Jahresumsatz = 80 € × 4 = 320 €",
                "Gesamtumsatz = 320 € × 3 = 960 €",
                "CLV = 960 € × 0,50 = 480 €"
          ],
          "result": "480 € Customer Lifetime Value"
    },
    content: {
      intro: 'Der Customer Lifetime Value (CLV) prognostiziert den kumulierten Deckungsbeitrag, den ein Kunde über die gesamte Dauer seiner Kundenbeziehung für das Unternehmen generiert.',
      details: 'CLV = Durchschnittlicher Bestellwert · Kauffrequenz pro Jahr · Kundenlebensdauer in Jahren · Bruttomarge in %. Bei Abomodellen: (Monatlicher Deckungsbeitrag pro Kunde) / Churn-Rate.',
    },
    faqs: [
      { question: 'Warum ist Kundenbindung fast immer günstiger als Neukundengewinnung?', answer: 'Bestehende Kunden haben bereits Vertrauen gefasst, verursachen keine erneuten Akquisekosten, kaufen oft häufiger und reagieren weniger preissensibel auf Upgrades.' },
      { question: 'Wie beeinflusst die Kündigungsquote (Churn) den CLV?', answer: 'Eine Halbierung der Churn-Rate verdoppelt die durchschnittliche Kundenlebensdauer und verdoppelt damit direkt den gesamten Customer Lifetime Value.' },
    ],
    relatedSlugs: ['kundengewinnungskosten-cac-rechner', 'churn-rate-rechner', 'roas-rechner'],
  },
  {
    id: "churn-rate-rechner",
    slug: "churn-rate-rechner",
    name: "Churn-Rate-Rechner: Kundenabwanderungsquote berechnen",
    shortName: "Churn-Rate-Rechner",
    category: "business",
    subcategory: "Marketing & Vertrieb",
    metaTitle: 'Churn Rate Rechner – Kundenabwanderungsquote (%) & MRR Churn',
    metaDescription: 'Berechnen Sie die monatliche und jährliche Churn Rate (Kundenabwanderung in %) sowie den Revenue Churn für SaaS-, Abo- und Dienstleistungsunternehmen.',
    h1: 'Churn Rate Rechner – Abwanderungsquote & Kundenverlust ermitteln',
    shortDescription: 'Berechnet Kunden- und Umsatzabwanderung im Abonnementgeschäft mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["churn rate rechner kundenabwanderungsquote formel","mrr churn berechnen saas abonnement","kundenabwanderung prozent pro monat jahr","durchschnittliche kundenlebensdauer 1 durch churn"],
    inputs: [
          {
                "id": "startCustomers",
                "label": "Kunden zu Beginn des Monats",
                "type": "number",
                "defaultValue": 1000,
                "min": 10,
                "max": 10000000,
                "step": 10,
                "unit": "Kunden"
          },
          {
                "id": "lostCustomers",
                "label": "Gekündigte Kunden im Monat",
                "type": "number",
                "defaultValue": 30,
                "min": 0,
                "max": 1000000,
                "step": 1,
                "unit": "Kündigungen"
          },
          {
                "id": "avgMrrPerCustomer",
                "label": "Monatlicher Umsatz je Kunde (MRR)",
                "type": "number",
                "defaultValue": 49,
                "min": 1,
                "max": 100000,
                "step": 5,
                "unit": "€/Monat"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const startCust = Number(inputs.startCustomers) || 1;
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
      };
    },
    formula: "Monatliche Churn Rate (%) = (Verlorene Kunden / Kunden zu Monatsbeginn) × 100; Lebensdauer = 1 / Churn Rate",
    formulaExplanation: "Eine monatliche Churn Rate von 3 % klingt gering, summiert sich über ein volles Jahr jedoch auf über 30 % Kundenverlust, die ständig durch teure Neukunden ersetzt werden müssen.",
    workedExample: {
          "title": "Beispiel: 30 Kündigungen bei 1.000 Abonnenten (MRR 49 €)",
          "inputValues": [
                {
                      "label": "Startkunden",
                      "value": "1.000"
                },
                {
                      "label": "Kündigungen",
                      "value": "30"
                }
          ],
          "steps": [
                "Monats-Churn = (30 / 1.000) × 100 = 3,0 %",
                "Jahres-Churn = (1 - 0,97¹²) × 100 ≈ 30,6 %",
                "Kundenlebensdauer = 1 / 0,03 = 33,3 Monate (ca. 2,8 Jahre)"
          ],
          "result": "3,0 % Monats-Churn (33 Monate Lebensdauer)"
    },
    content: {
      intro: 'Die Churn-Rate (Kundenabwanderungsquote) beziffert den prozentualen Verlust von Abonnenten oder Kunden innerhalb eines festgelegten Abrechnungszeitraums.',
      details: 'Churn-Rate = (Verlorene Kunden während der Periode / Kundenbestand zu Periodenbeginn) · 100. Eine monatliche Churn-Rate von 5 % bedeutet, dass über das Jahr gerechnet fast die Hälfte des Kundenstamms ersetzt werden muss.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Customer Churn und Revenue Churn?', answer: 'Customer Churn misst die Anzahl der abgesprungenen Kunden; Revenue Churn misst den verlorenen monatlich wiederkehrenden Umsatz (MRR); durch Upgrades bestehender Kunden kann Net Revenue Churn sogar negativ sein (starkes Wachstum!).' },
      { question: 'Was ist eine gesunde Churn-Rate im B2B-SaaS-Bereich?', answer: 'Im Enterprise-B2B-Sektor gilt eine jährliche Churn-Rate von unter 5 bis 7 Prozent als hervorragend; im B2C-Geschäft liegen Monats-Churn-Raten oft bei 3 bis 7 Prozent.' },
    ],
    relatedSlugs: ['customer-lifetime-value-clv-rechner', 'kundengewinnungskosten-cac-rechner', 'lead-conversion-rate-rechner'],
  },
  {
    id: "lead-conversion-rate-rechner",
    slug: "lead-conversion-rate-rechner",
    name: "Conversion-Rate-Rechner: Leads & Verkäufe berechnen",
    shortName: "Conversion-Rate-Rechner",
    category: "business",
    subcategory: "Marketing & Vertrieb",
    metaTitle: 'Conversion Rate Rechner – Konversionsrate für E-Commerce',
    metaDescription: 'Berechnen Sie die Conversion Rate in Prozent für Webshops und Landingpages: Besucher zu Leads, Warenkörbe zu Käufen und Lead-to-Customer Rate.',
    h1: 'Conversion Rate Rechner – Konversionsrate für Shop & Leads ermitteln',
    shortDescription: 'Berechnet die Conversion Rate aus Besucherzahlen und Abschlüssen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["conversion rate rechner formel prozent shop","konversionsrate berechnen besucher kunden","lead to customer conversion rate rechner","durchschnittliche ecommerce conversion rate 2 bis 3 prozent"],
    inputs: [
          {
                "id": "totalVisitors",
                "label": "Gesamtzahl Besucher / Kontakte (Traffic)",
                "type": "number",
                "defaultValue": 10000,
                "min": 1,
                "max": 100000000,
                "step": 250,
                "unit": "Besucher"
          },
          {
                "id": "conversionsCount",
                "label": "Anzahl erfolgreicher Aktionen (Bestellungen / Leads)",
                "type": "number",
                "defaultValue": 250,
                "min": 0,
                "max": 10000000,
                "step": 5,
                "unit": "Conversions"
          },
          {
                "id": "avgCartValue",
                "label": "Durchschnittlicher Umsatz pro Abschluss (optional)",
                "type": "number",
                "defaultValue": 65,
                "min": 0,
                "max": 100000,
                "step": 5,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const visitors = Number(inputs.totalVisitors) || 1;
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
      };
    },
    formula: "Conversion Rate (%) = (Anzahl Conversions / Anzahl Besucher) × 100; Revenue per Visitor (RPV) = Umsatz / Besucher",
    formulaExplanation: "Die Conversion Rate misst die Effizienz, mit der eine Website Besucher zu einer gewünschten Handlung (Kauf, Newsletter-Anmeldung, Kontaktanfrage) führt.",
    workedExample: {
          "title": "Beispiel: 10.000 Shop-Besucher führen zu 250 Bestellungen (Warenkorb 65 €)",
          "inputValues": [
                {
                      "label": "Besucher",
                      "value": "10.000"
                },
                {
                      "label": "Bestellungen",
                      "value": "250"
                }
          ],
          "steps": [
                "CR = (250 / 10.000) × 100 = 2,50 %",
                "Umsatz = 250 × 65 € = 16.250 €",
                "RPV = 16.250 € / 10.000 = 1,63 € pro Klick"
          ],
          "result": "2,50 % Conversion Rate (1,63 € RPV)"
    },
    content: {
      intro: 'Die Lead Conversion Rate misst den prozentualen Anteil von Interessenten (Leads), die zu aktiven Käufern oder Vertragsabschlüssen konvertiert werden.',
      details: 'Conversion Rate = (Erfolgreiche Abschlüsse / Gesamtzahl der generierten Leads) · 100. Die Conversion Rate analysiert Schwachstellen in den einzelnen Stufen des Marketing- und Vertriebs-Funnels.',
    },
    faqs: [
      { question: 'Welche Conversion Rates sind im deutschen E-Commerce typisch?', answer: 'Die durchschnittliche E-Commerce-Conversion-Rate im Online-Handel liegt in Deutschland bei ca. 1,5 bis 3,0 Prozent aller Website-Besucher.' },
      { question: 'Wie lässt sich die Conversion Rate im Checkout optimieren?', answer: 'Durch Anbieten beliebter lokaler Bezahlmethoden (PayPal, Klarna, Kauf auf Rechnung), Verzicht auf erzwungene Kundenkonto-Registrierung (Gast-Checkout) und transparente Versandkosten.' },
    ],
    relatedSlugs: ['roas-rechner', 'kundengewinnungskosten-cac-rechner', 'churn-rate-rechner'],
  },
  {
    id: "abschreibung-linear-degressiv-rechner",
    slug: "abschreibung-linear-degressiv-rechner",
    name: "AfA-Rechner: Lineare & degressive Abschreibung",
    shortName: "AfA-Rechner",
    category: "business",
    subcategory: "Steuern & Buchhaltung",
    metaTitle: 'AfA Rechner – Lineare – RechenHafen',
    metaDescription: 'Berechnen Sie die jährliche steuerliche Abschreibung (AfA) linear nach offizieller BMF-Nutzungsdauer oder degressiv (bis zu 20 % nach.',
    h1: 'AfA Rechner – Lineare & Degressive Abschreibung ermitteln',
    shortDescription: 'Berechnet jährliche Abschreibungsbeträge und Restbuchwerte mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["afa rechner lineare degressive abschreibung formel","abschreibungstabelle bmf nutzungsdauer jahre","degressive afa 2024 wachstumschancengesetz 20 prozent","restbuchwert abschreibungsplan berechnen"],
    inputs: [
          {
                "id": "assetCost",
                "label": "Anschaffungskosten netto (ohne Vorsteuer)",
                "type": "number",
                "defaultValue": 12000,
                "min": 1,
                "max": 100000000,
                "step": 250,
                "unit": "€"
          },
          {
                "id": "usefulLifeYears",
                "label": "Betriebsgewöhnliche Nutzungsdauer (AfA-Tabelle)",
                "type": "number",
                "defaultValue": 5,
                "min": 1,
                "max": 50,
                "step": 1,
                "unit": "Jahre"
          },
          {
                "id": "afaMethod",
                "label": "Abschreibungsmethode",
                "type": "select",
                "defaultValue": "linear",
                "options": [
                      {
                            "value": "linear",
                            "label": "Lineare Abschreibung (gleichbleibende Jahresbeträge)"
                      },
                      {
                            "value": "degressive20",
                            "label": "Degressive AfA (max. 20 % p.a. – Wachstumschancengesetz)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cost = Number(inputs.assetCost) || 0;
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
      };
    },
    formula: "Linear: AfA = Anschaffungskosten / Nutzungsdauer; Degressiv: AfA_t = Buchwert_(t-1) × AfA-Satz",
    formulaExplanation: "Wirtschaftsgüter des Anlagevermögens dürfen nicht sofort komplett als Betriebsausgabe abgesetzt werden, sondern müssen über ihre steuerliche Nutzungsdauer verteilt abgeschrieben werden.",
    workedExample: {
          "title": "Beispiel: Firmenwagen für 40.000 € netto über 6 Jahre Nutzungsdauer",
          "inputValues": [
                {
                      "label": "Kosten",
                      "value": "40.000 €"
                },
                {
                      "label": "Dauer",
                      "value": "6 Jahre"
                },
                {
                      "label": "Methode",
                      "value": "Linear"
                }
          ],
          "steps": [
                "AfA-Satz = 100 / 6 = 16,67 % p.a.",
                "Jährliche AfA = 40.000 € / 6 = 6.666,67 € Betriebsausgabe"
          ],
          "result": "6.666,67 € jährliche Abschreibung"
    },
    content: {
      intro: 'Dieser AfA-Rechner kalkuliert die steuerliche Abschreibung betrieblicher Wirtschaftsgüter nach den amtlichen AfA-Tabellen des Bundesfinanzministeriums.',
      details: 'Lineare AfA = Anschaffungskosten / Nutzungsdauer in Jahren. Degressive AfA (nach § 7 Abs. 2 EStG bei befristeter Zulassung) wendet einen festen Prozentsatz auf den jeweiligen Restbuchwert an; der Wechsel zur linearen AfA erfolgt, sobald die lineare Rest-AfA höher ausfällt.',
    },
    faqs: [
      { question: 'Was sind geringwertige Wirtschaftsgüter (GWG nach § 6 Abs. 2 EStG)?', answer: 'Bewegliche, selbstständig nutzbare Wirtschaftsgüter bis zu 800 Euro Netto-Anschaffungskosten können im Jahr der Anschaffung sofort zu 100 % als Betriebsausgabe voll abgeschrieben werden.' },
      { question: 'Wie lang ist die offizielle Nutzungsdauer eines Laptops für die Steuer?', answer: 'Nach dem BMF-Schreiben von 2021 können Computer, Laptops und Software steuerlich über eine betriebsgewöhnliche Nutzungsdauer von nur 1 Jahr voll abgeschrieben werden.' },
    ],
    relatedSlugs: ['ebit-ebitda-rechner', 'cashflow-rechner', 'mwst-rechner'],
  },
  {
    id: "skonto-jahreszins-rechner",
    slug: "skonto-jahreszins-rechner",
    name: "Skonto-Jahreszins-Rechner: Effektiver Zins & Skonto-Vergleich",
    shortName: "Skonto Jahreszins",
    category: "business",
    subcategory: "Kostenrechnung & Controlling",
    metaTitle: 'Skonto Jahreszins Rechner – Effektiven Skontozins p.a. bere...',
    metaDescription: 'Berechnen Sie den effektiven Jahreszinssatz bei Skontonutzung (z. B. 2 % oder 3 % Skonto bei Zahlung binnen 10 Tagen statt 30 Tagen Nettoziel) im.',
    h1: 'Skonto Jahreszins Rechner – Lohnt sich Skonto auch auf Pump?',
    shortDescription: 'Berechnet den enormen effektiven Jahreszins von Skontoangeboten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["skonto effektiver jahreszins rechner formel","skonto ausnutzen dispo kredit zinsvergleich","skontosatz tage zahlungsziel kaufmaennisch","skonto vorteil berechnen bwl"],
    inputs: [
          {
                "id": "invoiceGross",
                "label": "Rechnungsbetrag brutto",
                "type": "number",
                "defaultValue": 5000,
                "min": 10,
                "max": 10000000,
                "step": 100,
                "unit": "€"
          },
          {
                "id": "skontoPercent",
                "label": "Skontosatz",
                "type": "number",
                "defaultValue": 3,
                "min": 0.5,
                "max": 10,
                "step": 0.5,
                "unit": "%"
          },
          {
                "id": "skontoDays",
                "label": "Skontofrist",
                "type": "number",
                "defaultValue": 10,
                "min": 1,
                "max": 60,
                "step": 1,
                "unit": "Tage"
          },
          {
                "id": "netDays",
                "label": "Reguläres Zahlungsziel (netto Kasse)",
                "type": "number",
                "defaultValue": 30,
                "min": 2,
                "max": 180,
                "step": 5,
                "unit": "Tage"
          },
          {
                "id": "creditInterestPct",
                "label": "Eigener Kontokorrent- / Dispozins p.a.",
                "type": "number",
                "defaultValue": 9.5,
                "min": 0,
                "max": 30,
                "step": 0.5,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const inv = Number(inputs.invoiceGross) || 0;
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
      };
    },
    formula: "Effektiver Jahreszins (%) = (Skontosatz / (100 - Skontosatz)) × (360 / (Zahlungsziel - Skontofrist)) × 100",
    formulaExplanation: "Wer Skonto nicht zieht, nimmt beim Lieferanten einen extrem teuren Kredit in Anspruch – meist zu einem Zinssatz von 30 % bis 60 % p.a.!",
    workedExample: {
          "title": "Beispiel: 3 % Skonto bei Zahlung in 10 Tagen statt 30 Tagen Nettoziel",
          "inputValues": [
                {
                      "label": "Skonto",
                      "value": "3 %"
                },
                {
                      "label": "Skontofrist",
                      "value": "10 Tage"
                },
                {
                      "label": "Nettoziel",
                      "value": "30 Tage"
                }
          ],
          "steps": [
                "Kreditzeit = 30 - 10 = 20 Tage",
                "Zins = (3 / 97) × (360 / 20) × 100 = 0,03093 × 18 × 100 ≈ 55,67 % p.a."
          ],
          "result": "55,7 % effektiver Jahreszins"
    },
    content: {
      intro: 'Dieser Zinsrechner ermittelt den effektiven Jahreszinssatz, der sich hinter einer Skontovereinbarung (z. B. 2 % Skonto bei Zahlung binnen 10 Tagen statt 30 Tagen netto) verbirgt.',
      details: 'Effektiver Jahreszins ≈ [Skontosatz / (100 - Skontosatz)] · [360 / (Nettozahlungsziel - Skontofrist)]. Ein Skonto von 2 % bei 20 Tagen Fristvorteil entspricht einem atemberaubenden Jahreszins von über 36,7 Prozent!',
    },
    faqs: [
      { question: 'Warum gewähren Lieferanten so teures Skonto?', answer: 'Weil Lieferanten dadurch sofortige Liquidität erhalten, Mahnverfahren und Ausfallrisiken (Delkredere) drastisch reduzieren und Buchhaltungskosten sparen.' },
      { question: 'Was sollte man tun, wenn die Bank keine Kreditlinie für Skonto gewährt?', answer: 'Verhandeln Sie mit der Hausbank: Banken finanzieren Skontolinien gerne, da sie die wirtschaftliche Rentabilität für das Unternehmen unmittelbar einsehen.' },
    ],
    relatedSlugs: ['skontorechner', 'liquiditaetsgrad-rechner', 'rabattrechner'],
  },
  {
    id: "wareneinsatzquote-rechner",
    slug: "wareneinsatzquote-rechner",
    name: "Wareneinsatzquote-Rechner (Wareneinsatz in %)",
    shortName: "Wareneinsatzquote",
    category: "business",
    subcategory: "Kostenrechnung & Controlling",
    metaTitle: 'Wareneinsatzquote Rechner – Food Cost',
    metaDescription: 'Berechnen Sie die Wareneinsatzquote / Food Cost in % aus Wareneinsatz und Netto-Umsatz für Restaurants, Bäckereien, Cafés und Einzelhandel.',
    h1: 'Wareneinsatzquote Rechner – Food Cost & Wareneinsatz in % ermitteln',
    shortDescription: 'Berechnet die Wareneinsatzquote und Food Cost für Gastronomie und Handel.',
    searchKeywords: ["wareneinsatzquote rechner formel gastronomie food cost","wieviel prozent wareneinsatz restaurant baeckerei","wareneinsatzquote berechnen netto umsatz","wareneinsatz kalkulieren speisekarte"],
    inputs: [
          {
                "id": "revenueNet",
                "label": "Netto-Umsatzerlöse",
                "type": "number",
                "defaultValue": 50000,
                "min": 100,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "costOfGoods",
                "label": "Wareneinsatz (Einkauf Lebensmittel / Handelsware)",
                "type": "number",
                "defaultValue": 14000,
                "min": 0,
                "max": 100000000,
                "step": 500,
                "unit": "€"
          },
          {
                "id": "sectorType",
                "label": "Branche / Richtwert",
                "type": "select",
                "defaultValue": "gastroFood",
                "options": [
                      {
                            "value": "gastroFood",
                            "label": "Speisegastronomie / Restaurant (Richtwert 25 % bis 30 %)"
                      },
                      {
                            "value": "gastroDrinks",
                            "label": "Getränke / Bar (Richtwert 15 % bis 20 %)"
                      },
                      {
                            "value": "bakery",
                            "label": "Bäckerei / Konditorei (Richtwert 20 % bis 25 %)"
                      },
                      {
                            "value": "retail",
                            "label": "Einzelhandel (Richtwert 60 % bis 75 %)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const rev = Number(inputs.revenueNet) || 1;
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
      };
    },
    formula: "Wareneinsatzquote (%) = (Wareneinsatz / Nettoumsatz) × 100; Rohertrag = Nettoumsatz - Wareneinsatz",
    formulaExplanation: "In der Gastronomie ist die Food-Cost-Quote neben den Personalkosten die wichtigste Steuerungsgröße. Eine Quote über 30 % deutet meist auf zu hohe Einkäufe, Portionierungsfehler oder Schwund hin.",
    workedExample: {
          "title": "Beispiel: Restaurant mit 50.000 € Nettoumsatz und 14.000 € Wareneinsatz",
          "inputValues": [
                {
                      "label": "Umsatz",
                      "value": "50.000 €"
                },
                {
                      "label": "Wareneinsatz",
                      "value": "14.000 €"
                }
          ],
          "steps": [
                "Quote = (14.000 / 50.000) × 100 = 28,0 %",
                "Rohertrag = 50.000 € - 14.000 € = 36.000 € (72 %)"
          ],
          "result": "28,0 % Food Cost (perfekt im Zielkorridor)"
    },
    content: {
      intro: 'Die Wareneinsatzquote (Cost of Goods Sold Ratio, COGS-Quote) beziffert das prozentuale Verhältnis der eingekauften Rohstoffe und Handelswaren zum Umsatzerlös.',
      details: 'Wareneinsatzquote = (Wareneinsatz / Umsatzerlöse) · 100. In der Gastronomie gilt traditionell die Faustformel: Wareneinsatz ca. 25 bis 30 %, Personalkosten ca. 30 bis 35 %, Gemeinkosten ca. 20 bis 25 %, Gewinnmarge ca. 10 %.',
    },
    faqs: [
      { question: 'Wie berechnet man den Wareneinsatz der Periode?', answer: 'Anfangsbestand an Vorräten + Wareneinkäufe der Periode - Endbestand laut Inventur = tatsächlicher Wareneinsatz.' },
      { question: 'Was signalisiert ein plötzlicher Anstieg der Wareneinsatzquote?', answer: 'Steigende Einkaufspreise der Lieferanten, erhöhten Verderb/Bruch, Diebstahl im Lager oder verdeckte Rabatte beim Verkauf.' },
    ],
    relatedSlugs: ['marge-rechner', 'deckungsbeitrag-rechner', 'lagerumschlagshaeufigkeit-rechner'],
  },
  {
    id: "lagerumschlagshaeufigkeit-rechner",
    slug: "lagerumschlagshaeufigkeit-rechner",
    name: "Lagerumschlag-Rechner: Umschlagshäufigkeit & Lagerdauer",
    shortName: "Lagerumschlag-Rechner",
    category: "business",
    subcategory: "Kostenrechnung & Controlling",
    metaTitle: 'Lagerumschlag Rechner – Umschlagshäufigkeit',
    metaDescription: 'Berechnen Sie die Lagerumschlagshäufigkeit (Wareneinsatz / Ø Lagerbestand) und die durchschnittliche Lagerdauer in Tagen zur Optimierung des gebundenen.',
    h1: 'Lagerumschlag Rechner – Umschlagshäufigkeit & Verweildauer berechnen',
    shortDescription: 'Ermittelt wie oft sich das Lager pro Jahr dreht und die Lagerdauer.',
    searchKeywords: ["lagerumschlagshaeufigkeit rechner formel wareneinsatz lagerbestand","durchschnittliche lagerdauer tage 360 durch umschlag","lagerbestand optimieren bwl kennzahl","kapitalbindung lager reduzieren"],
    inputs: [
          {
                "id": "costOfGoodsSold",
                "label": "Jährlicher Wareneinsatz (Wareneinkauf zu Einstandspreisen)",
                "type": "number",
                "defaultValue": 600000,
                "min": 1000,
                "max": 1000000000,
                "step": 5000,
                "unit": "€/Jahr"
          },
          {
                "id": "avgInventoryValue",
                "label": "Durchschnittlicher Lagerbestand (Ø Inventurwert)",
                "type": "number",
                "defaultValue": 100000,
                "min": 100,
                "max": 100000000,
                "step": 1000,
                "unit": "€"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const cogs = Number(inputs.costOfGoodsSold) || 0;
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
      };
    },
    formula: "Umschlagshäufigkeit = Wareneinsatz / Ø Lagerbestand; Lagerdauer (Tage) = 360 / Umschlagshäufigkeit",
    formulaExplanation: "Je höher die Umschlagshäufigkeit, desto schneller werden Waren verkauft, desto weniger Kapital ist zinslos im Lager gebunden und desto geringer ist das Risiko von Verderb oder Veralterung.",
    workedExample: {
          "title": "Beispiel: 600.000 € Jahres-Wareneinsatz bei 100.000 € mittlerem Lagerbestand",
          "inputValues": [
                {
                      "label": "Wareneinsatz",
                      "value": "600.000 €"
                },
                {
                      "label": "Lager",
                      "value": "100.000 €"
                }
          ],
          "steps": [
                "Umschlagshäufigkeit = 600.000 / 100.000 = 6,0-mal",
                "Lagerdauer = 360 / 6 = 60 Tage"
          ],
          "result": "6 Umschläge / Jahr (60 Tage Lagerdauer)"
    },
    content: {
      intro: 'Die Lagerumschlagshäufigkeit misst, wie oft der durchschnittliche Lagerbestand innerhalb eines Geschäftsjahres vollständig verkauft und ersetzt wird.',
      details: 'Umschlagshäufigkeit = Wareneinsatz / durchschnittlicher Lagerbestand zu Einstandspreisen. Durchschnittliche Lagerdauer in Tagen = 360 / Lagerumschlagshäufigkeit.',
    },
    faqs: [
      { question: 'Welche Vorteile hat eine hohe Lagerumschlagshäufigkeit?', answer: 'Geringere Kapitalbindung im Lager, niedrigere Lagerhaltungs- und Versicherungskosten, geringeres Risiko von Veralterung, Verderb und Abschreibungen auf Ladenhüter.' },
      { question: 'Welche Gefahr birgt ein zu schneller Lagerumschlag?', answer: 'Die Gefahr von Lieferengpässen (Stockouts): Wenn Sicherheitsbestände zu knapp bemessen sind, führen minimale Lieferverzögerungen sofort zu Umsatzausfällen.' },
    ],
    relatedSlugs: ['wareneinsatzquote-rechner', 'working-capital-rechner', 'liquiditaetsgrad-rechner'],
  },
  {
    id: "stundensatz-kalkulation-freiberufler-rechner",
    slug: "stundensatz-kalkulation-freiberufler-rechner",
    name: "Stundensatz-Rechner für Freiberufler & Selbstständige",
    shortName: "Stundensatz-Rechner",
    category: "business",
    subcategory: "Kostenrechnung & Controlling",
    metaTitle: 'Stundensatz Rechner – Honorar für Freiberufler',
    metaDescription: 'Berechnen Sie Ihren Mindest-Stundensatz netto nach Wunsch-Nettoeinkommen, Betriebsausgaben, Krankenversicherung, Steuern, Urlaub',
    h1: 'Stundensatz Rechner – Honorar für Selbstständige & Freelancer',
    shortDescription: 'Kalkuliert den benötigten Stundensatz nach Lebenshaltungskosten und Auslastung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["stundensatz kalkulation freiberufler rechner","freelancer stundensatz berechnen formel urlaub krankheit","wieviel stundensatz als selbststaendiger verlangen","honorar berechnen netto zielgehalt"],
    inputs: [
          {
                "id": "desiredNetAnnual",
                "label": "Gewünschtes Nettoeinkommen pro Jahr",
                "type": "number",
                "defaultValue": 45000,
                "min": 10000,
                "max": 500000,
                "step": 2500,
                "unit": "€ Netto"
          },
          {
                "id": "businessExpensesAnnual",
                "label": "Betriebsausgaben pro Jahr (Software, Büro, Steuerberater)",
                "type": "number",
                "defaultValue": 12000,
                "min": 0,
                "max": 500000,
                "step": 1000,
                "unit": "€"
          },
          {
                "id": "vacationAndSickDays",
                "label": "Nicht fakturierbare Tage (Urlaub, Feiertage, Krankheit)",
                "type": "number",
                "defaultValue": 45,
                "min": 20,
                "max": 100,
                "step": 5,
                "unit": "Tage"
          },
          {
                "id": "billableRatioPct",
                "label": "Fakturierbare Arbeitszeit (Auslastung – Rest ist Akquise/Admin)",
                "type": "number",
                "defaultValue": 60,
                "min": 20,
                "max": 95,
                "step": 5,
                "unit": "%"
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      const net = Number(inputs.desiredNetAnnual) || 45000;
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
      };
    },
    formula: "Stundensatz = (Bruttoeinkommen + Vorsorge + Betriebskosten) / (Arbeitstage × 8h × Fakturierbarkeitsquote)",
    formulaExplanation: "Freelancer können selten mehr als 50 % bis 65 % ihrer Arbeitszeit direkt abrechnen. Der Rest entfällt auf Buchhaltung, Akquise, Kundenberatung und Fortbildung.",
    workedExample: {
          "title": "Beispiel: 45.000 € Wunsch-Netto bei 12.000 € Kosten und 60 % Auslastung",
          "inputValues": [
                {
                      "label": "Netto",
                      "value": "45.000 €"
                },
                {
                      "label": "Kosten",
                      "value": "12.000 €"
                },
                {
                      "label": "Auslastung",
                      "value": "60 %"
                }
          ],
          "steps": [
                "Umsatzbedarf = (45.000 € × 1,65) + 12.000 € = 86.250 €",
                "Arbeitstage = 260 - 45 = 215 Tage",
                "Fakturierbare Stunden = 215 × 8 × 0,60 = 1.032 Stunden",
                "Stundensatz = 86.250 € / 1.032 h ≈ 83,58 € / Stunde"
          ],
          "result": "84,00 € / Stunde (Tagessatz ca. 670 €)"
    },
    content: {
      intro: 'Dieser betriebswirtschaftliche Stundensatzkalkulator ermittelt den erforderlichen Netto-Verrechnungssatz pro Stunde für Freiberufler, Berater und Agenturen.',
      details: 'Kalkulation: (Privater Lebensunterhalt + Vorsorgeaufwand + betriebliche Fixkosten + Risikogewinnaufschlag) / (Verfügbare Jahresarbeitstage · fakturierbare Stunden pro Tag).',
    },
    faqs: [
      { question: 'Wie viele Stunden pro Tag kann ein Dienstleister durchschnittlich fakturieren?', answer: 'In der Realität selten mehr als 5 bis 6 Stunden pro Tag; die restliche Zeit entfällt zwingend auf Akquise, Kundenberatung, Buchhaltung, Weiterbildung und Büroorganisation.' },
      { question: 'Warum führt die Formel "Gehalt durch 160 Stunden" bei Selbstständigen in den Ruin?', answer: 'Weil sie ignoriert, dass Selbstständige keinen Arbeitgeberzuschuss zur Kranken- und Rentenversicherung erhalten, Urlaub und Feiertage unbezahlt sind und administrative Zeiten nicht abgerechnet werden können.' },
    ],
    relatedSlugs: ['brutto-stundensatz-freiberufler-rechner', 'teilzeit-gehaltsrechner', 'deckungsbeitrag-rechner', 'umsatzrentabilitaet-rechner'],
  },
  {
    id: "mittelwert-median-modus-rechner",
    slug: "mittelwert-median-modus-rechner",
    name: "Mittelwert-, Median- & Modus-Rechner",
    shortName: "Lageparameter-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Deskriptive Statistik",
    metaTitle: 'Mittelwert, Median & Modus Rechner – Lageparameter',
    metaDescription: 'Berechnen Sie arithmetisches Mittel, Median (Zentralwert), Modus (Modalwert) und Spannweite für Ihre Messreihe schnell und unkompliziert.',
    h1: 'Mittelwert, Median & Modus Rechner',
    shortDescription: 'Ermittelt die zentralen statistischen Lagemaße und Spannweite einer beliebigen Datenreihe.',
    searchKeywords: ["mittelwert rechner","median berechnen","modus statistik","lageparameter rechner","zentralwert online"],
    inputs: [
          {
                "id": "val1",
                "label": "Wert 1",
                "type": "number",
                "defaultValue": 10,
                "step": 0.1
          },
          {
                "id": "val2",
                "label": "Wert 2",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1
          },
          {
                "id": "val3",
                "label": "Wert 3",
                "type": "number",
                "defaultValue": 20,
                "step": 0.1
          },
          {
                "id": "val4",
                "label": "Wert 4",
                "type": "number",
                "defaultValue": 20,
                "step": 0.1
          },
          {
                "id": "val5",
                "label": "Wert 5",
                "type": "number",
                "defaultValue": 35,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const v1 = Number(inputs.val1) || 0;
            const v2 = Number(inputs.val2) || 0;
            const v3 = Number(inputs.val3) || 0;
            const v4 = Number(inputs.val4) || 0;
            const v5 = Number(inputs.val5) || 0;
            const arr = [v1, v2, v3, v4, v5].sort((a, b) => a - b);
            const sum = arr.reduce((acc, val) => acc + val, 0);
            const mean = sum / arr.length;
            const median = arr[2];
            const counts: Record<number, number> = {};
            let maxCount = 0;
            let mode = arr[0];
            arr.forEach(n => {
              counts[n] = (counts[n] || 0) + 1;
              if (counts[n] > maxCount) {
                maxCount = counts[n];
                mode = n;
              }
            });
            const range = arr[4] - arr[0];
            return {
              primary: { label: 'Arithmetisches Mittel', value: mean, formattedValue: formatNumber(mean, 2), unit: '' },
              details: [
                { label: 'Median (Zentralwert)', value: median, formattedValue: formatNumber(median, 2) },
                { label: 'Modus (Modalwert)', value: maxCount > 1 ? mode : 0, formattedValue: maxCount > 1 ? formatNumber(mode, 2) : 'Kein eindeutiger Modus' },
                { label: 'Spannweite (Max - Min)', value: range, formattedValue: formatNumber(range, 2) },
                { label: 'Summe aller Werte', value: sum, formattedValue: formatNumber(sum, 2) },
                { label: 'Sortierte Reihe', value: arr.join(', '), formattedValue: arr.map(n => formatNumber(n, 1)).join(', ') },
              ],
            };
          
    },
    formula: "Mittelwert = Σx / n | Median = Zentraler Wert der sortierten Reihe | Modus = Häufigster Wert",
    formulaExplanation: "Das arithmetische Mittel summiert alle Werte und teilt durch die Anzahl. Der Median teilt die sortierte Verteilung in zwei gleich große Hälften und ist resistent gegen Ausreißer.",
    workedExample: {
          "title": "Beispiel: 10, 15, 20, 20, 35",
          "description": "Summe = 100, Anzahl = 5. Mittelwert = 20,00. Median = 20,00. Modus = 20,00 (2-mal vorhanden). Spannweite = 35 - 10 = 25,00.",
          "inputs": {
                "val1": 10,
                "val2": 15,
                "val3": 20,
                "val4": 20,
                "val5": 35
          },
          "resultSummary": "Mittelwert: 20,00 | Median: 20,00"
    },
    content: {
      intro: 'Dieser Lagemaß-Rechner ermittelt die drei klassischen Kennzahlen einer Verteilung: arithmetisches Mittel, Median (Zentralwert) und Modus (häufigster Wert).',
      details: 'Der Median halbiert die sortierte Datenreihe exakt: 50 % der Werte liegen darunter, 50 % darüber. Bei schiefen Verteilungen (z. B. Gehälter oder Vermögen) ist der Median extrem robust gegenüber Milliardärs-Ausreißern.',
    },
    faqs: [
      { question: 'Wann sind Mittelwert und Median exakt identisch?', answer: 'Bei perfekt symmetrischen Verteilungen, wie beispielsweise der Gaußschen Glockenkurve (Normalverteilung).' },
      { question: 'Was ist ein multimodaler Datensatz?', answer: 'Ein Datensatz, bei dem zwei oder mehr verschiedene Werte gleich oft mit der höchsten Häufigkeit auftreten (z. B. bimodal mit zwei Peaks).' },
    ],
    relatedSlugs: ['standardabweichung-rechner', 'notendurchschnitt-rechner', 'variationskoeffizient-rechner', 'geometrisches-mittel-rechner', 'harmonisches-mittel-rechner'],
  },
  {
    id: "varianz-standardabweichung-stichprobe-rechner",
    slug: "varianz-standardabweichung-stichprobe-rechner",
    name: "Varianz- & Standardabweichungs-Rechner",
    shortName: "Varianz & Streuung",
    category: "statistik-wissenschaft",
    subcategory: "Deskriptive Statistik",
    metaTitle: 'Stichprobenvarianz Rechner – Standardabweichung s (n-1)',
    metaDescription: 'Ermitteln Sie die erwartungstreue Stichprobenvarianz s² und Standardabweichung s mit Bessel-Korrektur (n-1) für empirische Studien.',
    h1: 'Stichprobenvarianz Rechner – Bessel-Korrektur (n-1) nutzen',
    shortDescription: 'Ermittelt die empirische Stichprobenvarianz und Standardabweichung mit Bessel-Korrektur (n-1) für wissenschaftliche Datensätze.',
    searchKeywords: ['stichprobenvarianz rechner', 'varianz rechner', 'stichprobenvarianz', 'populationsvarianz berechnen', 'streuungsmaße formel', 'standardabweichung stichprobe'],
    inputs: [
          {
                "id": "v1",
                "label": "Messwert 1",
                "type": "number",
                "defaultValue": 12,
                "step": 0.1
          },
          {
                "id": "v2",
                "label": "Messwert 2",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1
          },
          {
                "id": "v3",
                "label": "Messwert 3",
                "type": "number",
                "defaultValue": 18,
                "step": 0.1
          },
          {
                "id": "v4",
                "label": "Messwert 4",
                "type": "number",
                "defaultValue": 21,
                "step": 0.1
          },
          {
                "id": "v5",
                "label": "Messwert 5",
                "type": "number",
                "defaultValue": 24,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const arr = [
              Number(inputs.v1) || 0,
              Number(inputs.v2) || 0,
              Number(inputs.v3) || 0,
              Number(inputs.v4) || 0,
              Number(inputs.v5) || 0,
            ];
            const n = arr.length;
            const mean = arr.reduce((a, b) => a + b, 0) / n;
            const ss = arr.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);
            const varSample = ss / (n - 1);
            const sdSample = Math.sqrt(varSample);
            const varPop = ss / n;
            const sdPop = Math.sqrt(varPop);
            return {
              primary: { label: 'Stichproben-Standardabweichung (s)', value: sdSample, formattedValue: formatNumber(sdSample, 3), unit: '' },
              details: [
                { label: 'Stichprobenvarianz (s²)', value: varSample, formattedValue: formatNumber(varSample, 3) },
                { label: 'Populations-Standardabweichung (σ)', value: sdPop, formattedValue: formatNumber(sdPop, 3) },
                { label: 'Populationsvarianz (σ²)', value: varPop, formattedValue: formatNumber(varPop, 3) },
                { label: 'Mittelwert (x̄)', value: mean, formattedValue: formatNumber(mean, 2) },
                { label: 'Quadratsumme (SS)', value: ss, formattedValue: formatNumber(ss, 2) },
              ],
            };
          
    },
    formula: "s² = Σ(xi - x̄)² / (n - 1) | σ² = Σ(xi - μ)² / n",
    formulaExplanation: "Die Stichprobenvarianz teilt durch n - 1 (Bessel-Korrektur), um eine unverzerrte Schätzung der wahren Varianz der Grundgesamtheit zu liefern.",
    workedExample: {
          "title": "Beispiel: 12, 15, 18, 21, 24",
          "description": "Mittelwert = 18,0. Quadratsumme = 90,0. Stichprobenvarianz s² = 90/4 = 22,50. s = 4,743. Populationsvarianz σ² = 90/5 = 18,00. σ = 4,243.",
          "inputs": {
                "v1": 12,
                "v2": 15,
                "v3": 18,
                "v4": 21,
                "v5": 24
          },
          "resultSummary": "s = 4,743 | s² = 22,500"
    },
    content: {
      intro: 'Dieser Streumaßrechner berechnet die Varianz (mittlere quadratische Abweichung) und Standardabweichung für Grundgesamtheiten (Teilung durch N) und Stichproben (Teilung durch n-1).',
      details: 'Varianz s² = (1 / (n-1)) · Summe(x_i - Mittelwert)². Die Varianz hat die quadrierte Einheit der Messgröße (z. B. Euro²); erst das Ziehen der Quadratwurzel liefert die Standardabweichung in der ursprünglichen Maßeinheit (z. B. Euro).',
    },
    faqs: [
      { question: 'Warum quadriert man die Differenzen bei der Varianz?', answer: 'Damit sich positive und negative Abweichungen vom Mittelwert nicht gegenseitig zu null aufheben und größere Ausreißer mathematisch stärker gewichtet werden.' },
      { question: 'Was misst die empirische Varianz im Portfolio-Management?', answer: 'Die Volatilität (Schwankungsintensität) der Kursrenditen und bildet das fundamentale Risikomaß in der modernen Portfoliotheorie nach Markowitz.' },
    ],
    relatedSlugs: ['standardabweichung-rechner', 'mittelwert-median-modus-rechner', 'konfidenzintervall-rechner'],
  },
  {
    id: "korrelationskoeffizient-rechner",
    slug: "korrelationskoeffizient-rechner",
    name: "Korrelationskoeffizient-Rechner (Pearson r)",
    shortName: "Korrelation r",
    category: "statistik-wissenschaft",
    subcategory: "Zusammenhangsmaße",
    metaTitle: 'Korrelationskoeffizient Rechner – Pearson r linearer Zusamm...',
    metaDescription: 'Ermitteln Sie den Korrelationskoeffizienten nach Pearson (r) sowie das Bestimmtheitsmaß (R²) für bivariate Datenpaare online.',
    h1: 'Korrelationskoeffizient Rechner (Pearson r)',
    shortDescription: 'Berechnet die lineare Korrelation zwischen zwei Merkmalen X und Y.',
    searchKeywords: ["korrelationskoeffizient rechner","pearson r berechnen","korrelation online","bestimmtheitsmaß r2","bivariate statistik"],
    inputs: [
          {
                "id": "x1",
                "label": "X1",
                "type": "number",
                "defaultValue": 1,
                "step": 0.1
          },
          {
                "id": "y1",
                "label": "Y1",
                "type": "number",
                "defaultValue": 2,
                "step": 0.1
          },
          {
                "id": "x2",
                "label": "X2",
                "type": "number",
                "defaultValue": 2,
                "step": 0.1
          },
          {
                "id": "y2",
                "label": "Y2",
                "type": "number",
                "defaultValue": 3,
                "step": 0.1
          },
          {
                "id": "x3",
                "label": "X3",
                "type": "number",
                "defaultValue": 3,
                "step": 0.1
          },
          {
                "id": "y3",
                "label": "Y3",
                "type": "number",
                "defaultValue": 5,
                "step": 0.1
          },
          {
                "id": "x4",
                "label": "X4",
                "type": "number",
                "defaultValue": 4,
                "step": 0.1
          },
          {
                "id": "y4",
                "label": "Y4",
                "type": "number",
                "defaultValue": 7,
                "step": 0.1
          },
          {
                "id": "x5",
                "label": "X5",
                "type": "number",
                "defaultValue": 5,
                "step": 0.1
          },
          {
                "id": "y5",
                "label": "Y5",
                "type": "number",
                "defaultValue": 8,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const xs = [Number(inputs.x1)||0, Number(inputs.x2)||0, Number(inputs.x3)||0, Number(inputs.x4)||0, Number(inputs.x5)||0];
            const ys = [Number(inputs.y1)||0, Number(inputs.y2)||0, Number(inputs.y3)||0, Number(inputs.y4)||0, Number(inputs.y5)||0];
            const n = 5;
            const meanX = xs.reduce((a, b) => a + b, 0) / n;
            const meanY = ys.reduce((a, b) => a + b, 0) / n;
            let num = 0, denX = 0, denY = 0;
            for (let i = 0; i < n; i++) {
              const dx = xs[i] - meanX;
              const dy = ys[i] - meanY;
              num += dx * dy;
              denX += dx * dx;
              denY += dy * dy;
            }
            const denom = Math.sqrt(denX * denY);
            const r = denom === 0 ? 0 : num / denom;
            const r2 = r * r;
            let interpretation = 'Sehr schwach oder keine Korrelation';
            const absR = Math.abs(r);
            if (absR >= 0.8) interpretation = 'Sehr starke lineare Korrelation';
            else if (absR >= 0.5) interpretation = 'Mittlere bis starke Korrelation';
            else if (absR >= 0.3) interpretation = 'Schwache Korrelation';
            return {
              primary: { label: 'Korrelationskoeffizient (r)', value: r, formattedValue: formatNumber(r, 4), unit: '' },
              details: [
                { label: 'Bestimmtheitsmaß (R²)', value: r2 * 100, formattedValue: formatPercent(r2 * 100, 2) },
                { label: 'Interpretation', value: interpretation, formattedValue: interpretation },
                { label: 'Richtung', value: r > 0 ? 'Positiver Zusammenhang' : (r < 0 ? 'Negativer Zusammenhang' : 'Kein Zusammenhang'), formattedValue: r > 0 ? 'Positiver Zusammenhang' : (r < 0 ? 'Negativer Zusammenhang' : 'Kein Zusammenhang') },
                { label: 'Mittelwert X', value: meanX, formattedValue: formatNumber(meanX, 2) },
                { label: 'Mittelwert Y', value: meanY, formattedValue: formatNumber(meanY, 2) },
              ],
            };
          
    },
    formula: "r = Σ((xi - x̄)(yi - ȳ)) / √[ Σ(xi - x̄)² · Σ(yi - ȳ)² ]",
    formulaExplanation: "Pearson r liegt immer zwischen -1 (perfekt negativ linear) und +1 (perfekt positiv linear). 0 bedeutet kein linearer Zusammenhang.",
    workedExample: {
          "title": "Beispiel: 5 Wertepaare (1|2), (2|3), (3|5), (4|7), (5|8)",
          "description": "r = 0,9932. Bestimmtheitsmaß R² = 98,64 %. Es besteht ein sehr starker positiver linearer Zusammenhang.",
          "inputs": {
                "x1": 1,
                "y1": 2,
                "x2": 2,
                "y2": 3,
                "x3": 3,
                "y3": 5,
                "x4": 4,
                "y4": 7,
                "x5": 5,
                "y5": 8
          },
          "resultSummary": "r = 0,9932 | R² = 98,64 %"
    },
    content: {
      intro: 'Der Pearson-Korrelationskoeffizient (r) quantifiziert die Stärke und Richtung eines linearen Zusammenhangs zwischen zwei metrischen Merkmalen X und Y.',
      details: 'Wertebereich: -1,0 ≤ r ≤ +1,0. Ein Wert von +1 bedeutet perfekten positiven linearen Zusammenhang; 0 bedeutet keinen linearen Zusammenhang; -1 bedeutet perfekten gegenläufigen Zusammenhang. Korrelation impliziert niemals automatisch Kausalität!',
    },
    faqs: [
      { question: 'Was ist Scheinkorrelation (Spurious Correlation)?', answer: 'Wenn zwei Variablen statistisch hoch korrelieren, ohne inhaltlich ursächlich verknüpft zu sein (z. B. Storchenpopulation und Geburtenrate korrelieren scheinbar, weil beide von ländlicher Struktur abhängen).' },
      { question: 'Ab welchem r-Wert spricht man von starker Korrelation?', answer: 'Nach Cohen gilt: |r| ab 0,10 als schwacher, ab 0,30 als mittlerer und ab 0,50 als starker linearer Zusammenhang.' },
    ],
    relatedSlugs: ['lineare-regression-rechner', 'kovarianz-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "z-score-normalverteilung-rechner",
    slug: "z-score-normalverteilung-rechner",
    name: "Z-Score-Rechner (Standardnormalverteilung)",
    shortName: "Z-Score-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Wahrscheinlichkeitsverteilung",
    metaTitle: 'Z-Score Rechner – Standardnormalverteilung & Perzentil online',
    metaDescription: 'Berechnen Sie den Z-Wert, die Standardabweichungsdistanz und die kumulierte Wahrscheinlichkeit P(Z <= z) online.',
    h1: 'Z-Score Rechner (Normalverteilung)',
    shortDescription: 'Standardisiert Rohdatenwerte anhand von Mittelwert und Standardabweichung mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["z score rechner","z wert berechnen","standardnormalverteilung","z transformation","standardisierung statistik"],
    inputs: [
          {
                "id": "x",
                "label": "Messwert (X)",
                "type": "number",
                "defaultValue": 115,
                "step": 0.1
          },
          {
                "id": "mean",
                "label": "Mittelwert (μ)",
                "type": "number",
                "defaultValue": 100,
                "step": 0.1
          },
          {
                "id": "sd",
                "label": "Standardabweichung (σ)",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1,
                "min": 0.0001
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const x = Number(inputs.x) || 0;
            const mean = Number(inputs.mean) || 0;
            const sd = Number(inputs.sd) || 1;
            if (sd <= 0) return { primary: { label: 'Fehler', value: 'σ muss > 0 sein', unit: '' }, details: [] };
            const z = (x - mean) / sd;
            // Approximation for standard normal CDF (Abramowitz and Stegun)
            const t = 1 / (1 + 0.2316419 * Math.abs(z));
            const d = 0.3989422804014327 * Math.exp(-z * z / 2);
            let prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
            if (z > 0) prob = 1 - prob;
            const pPercent = prob * 100;
            return {
              primary: { label: 'Z-Wert (Standardwert)', value: z, formattedValue: formatNumber(z, 3), unit: '' },
              details: [
                { label: 'Kumulierte Wahrscheinlichkeit P(X ≤ x)', value: pPercent, formattedValue: formatPercent(pPercent, 2) },
                { label: 'Gegenwahrscheinlichkeit P(X > x)', value: 100 - pPercent, formattedValue: formatPercent(100 - pPercent, 2) },
                { label: 'Perzentil-Rang', value: pPercent, formattedValue: formatNumber(pPercent, 1) + '. Perzentil' },
                { label: 'Abstand zum Mittelwert', value: x - mean, formattedValue: formatNumber(x - mean, 2) },
              ],
            };
          
    },
    formula: "z = (x - μ) / σ",
    formulaExplanation: "Der Z-Score drückt den Abstand eines Werts vom Mittelwert in Einheiten der Standardabweichung aus.",
    workedExample: {
          "title": "Beispiel: IQ-Wert 115 (Mittelwert 100, Standardabweichung 15)",
          "description": "z = (115 - 100) / 15 = 1,000. Rund 84,13 % der Population haben einen IQ von höchstens 115.",
          "inputs": {
                "x": 115,
                "mean": 100,
                "sd": 15
          },
          "resultSummary": "z = 1,000 | 84,13 %"
    },
    content: {
      intro: 'Der Z-Score (Standardwert) normiert Messwerte auf eine Standardnormalverteilung mit Mittelwert mu = 0 und Standardabweichung sigma = 1.',
      details: 'Formel: z = (x - mu) / sigma. Ein Z-Score von +2,0 besagt, dass der individuelle Messwert genau zwei Standardabweichungen über dem Mittelwert der Gesamtstichprobe liegt (Perzentil ca. 97,7 %).',
    },
    faqs: [
      { question: 'Wie liest man Wahrscheinlichkeiten aus der Z-Tabelle ab?', answer: 'Die Standardnormalverteilungstabelle (Phi(z)) gibt die Wahrscheinlichkeit an, dass eine Standardnormalvariable einen Wert kleiner oder gleich z annimmt.' },
      { question: 'Welchem IQ-Wert entspricht ein Z-Score von +1,0?', answer: 'Bei Standard-IQ-Tests (Mittelwert 100, Standardabweichung 15) entspricht z = +1,0 einem IQ von genau 115 (überdurchschnittlich).' },
    ],
    relatedSlugs: ['standardabweichung-rechner', 'konfidenzintervall-rechner', 'p-wert-hypothesentest-rechner'],
  },
  {
    id: "p-wert-hypothesentest-rechner",
    slug: "p-wert-hypothesentest-rechner",
    name: "p-Wert-Rechner (Hypothesentest & Z-Test)",
    shortName: "p-Wert-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Inferenzstatistik",
    metaTitle: 'p-Wert Rechner – Z-Statistik & Signifikanzniveau online',
    metaDescription: 'Berechnen Sie den einseitigen und zweiseitigen p-Wert aus einer Z-Prüfgröße und prüfen Sie statistische Signifikanz (α = 0,05).',
    h1: 'p-Wert Rechner (Hypothesenprüfung)',
    shortDescription: 'Ermittelt den p-Wert für ein- und zweiseitige Tests und prüft die Nullhypothese.',
    searchKeywords: ["p wert rechner","p value berechnen","hypothesentest signifikant","z test p wert","alpha fehler"],
    inputs: [
          {
                "id": "zStat",
                "label": "Z-Prüfgröße (Teststatistik)",
                "type": "number",
                "defaultValue": 1.96,
                "step": 0.01
          },
          {
                "id": "alpha",
                "label": "Signifikanzniveau α (%)",
                "type": "number",
                "defaultValue": 5,
                "step": 1,
                "min": 0.1,
                "max": 20
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const z = Math.abs(Number(inputs.zStat) || 0);
            const alpha = (Number(inputs.alpha) || 5) / 100;
            const t = 1 / (1 + 0.2316419 * z);
            const d = 0.3989422804014327 * Math.exp(-z * z / 2);
            const tail = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
            const pTwoSided = Math.min(1, 2 * tail);
            const pOneSided = tail;
            const isSigTwo = pTwoSided < alpha;
            return {
              primary: { label: 'p-Wert (zweiseitig)', value: pTwoSided, formattedValue: formatNumber(pTwoSided, 4), unit: '' },
              details: [
                { label: 'p-Wert (einseitig)', value: pOneSided, formattedValue: formatNumber(pOneSided, 4) },
                { label: 'Signifikanz bei α = ' + formatPercent(alpha * 100, 1), value: isSigTwo ? 'Statistisch signifikant' : 'Nicht signifikant', formattedValue: isSigTwo ? 'Statistisch signifikant (H0 ablehnen)' : 'Nicht signifikant (H0 beibehalten)' },
                { label: 'Kritischer Z-Wert (zweiseitig)', value: 1.96, formattedValue: '± 1,960' },
                { label: 'Kritischer Z-Wert (einseitig)', value: 1.645, formattedValue: '1,645' },
              ],
            };
          
    },
    formula: "p = 2 · (1 - Φ(|z|)) für zweiseitigen Test",
    formulaExplanation: "Der p-Wert beziffert die Wahrscheinlichkeit, ein mindestens so extremes Ergebnis wie das beobachtete zu erhalten, falls die Nullhypothese wahr ist.",
    workedExample: {
          "title": "Beispiel: Z = 1,96 bei α = 5 %",
          "description": "p-Wert (zweiseitig) = 0,0500. Das Ergebnis liegt genau an der Schwelle der statistischen Signifikanz.",
          "inputs": {
                "zStat": 1.96,
                "alpha": 5
          },
          "resultSummary": "p = 0,0500"
    },
    content: {
      intro: 'Der p-Wert beziffert die Wahrscheinlichkeit, die beobachteten Daten (oder noch extremere) zu erhalten, wenn die Nullhypothese H0 in Wahrheit zutrifft.',
      details: 'Liegt der p-Wert unter dem vorab festgelegten Signifikanzniveau alpha (typisch alpha = 0,05 oder 0,01), wird die Nullhypothese verworfen und das Ergebnis gilt als statistisch signifikant.',
    },
    faqs: [
      { question: 'Bedeutet ein p-Wert von 0,03, dass die Hypothese zu 97 % wahr ist?', answer: 'Nein, das ist der häufigste Fehlschluss: Der p-Wert ist nicht die Wahrscheinlichkeit der Hypothese, sondern P(Daten | H0), also die Wahrscheinlichkeit der Daten unter der Annahme, H0 stimme.' },
      { question: 'Was ist ein Fehler 1. Art (Alpha-Fehler)?', answer: 'Die irrtümliche Ablehnung einer in Wahrheit richtigen Nullhypothese (falsch-positiver Befund); die Wahrscheinlichkeit dafür wird durch das Signifikanzniveau alpha gedeckelt.' },
    ],
    relatedSlugs: ['chi-quadrat-unabhaengigkeitstest-rechner', 'z-score-normalverteilung-rechner', 't-test-rechner', 'konfidenzintervall-rechner', 'stichprobengroesse-rechner'],
  },
  {
    id: "t-test-rechner",
    slug: "t-test-rechner",
    name: "t-Test-Rechner (Einstichproben-t-Test)",
    shortName: "t-Test-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Inferenzstatistik",
    metaTitle: 't-Test Rechner – Einstichproben-t-Test & Prüfgröße berechnen',
    metaDescription: 'Ermitteln Sie die empirische t-Prüfgröße, Standardfehler und Freiheitsgrade für einen Einstichproben-Mittelwertsvergleich.',
    h1: 'Einstichproben-t-Test Rechner',
    shortDescription: 'Prüft, ob der Stichprobenmittelwert signifikant von einem theoretischen Erwartungswert abweicht.',
    searchKeywords: ["t test rechner","einstichproben t test","students t test","t prüfgröße berechnen","freiheitsgrade statistik"],
    inputs: [
          {
                "id": "sampleMean",
                "label": "Stichprobenmittelwert (x̄)",
                "type": "number",
                "defaultValue": 104,
                "step": 0.1
          },
          {
                "id": "hypoMean",
                "label": "Referenzwert (μ0)",
                "type": "number",
                "defaultValue": 100,
                "step": 0.1
          },
          {
                "id": "sampleSd",
                "label": "Stichproben-Streuung (s)",
                "type": "number",
                "defaultValue": 8,
                "step": 0.1,
                "min": 0.001
          },
          {
                "id": "sampleN",
                "label": "Stichprobenumfang (n)",
                "type": "number",
                "defaultValue": 25,
                "step": 1,
                "min": 2
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const xbar = Number(inputs.sampleMean) || 0;
            const mu0 = Number(inputs.hypoMean) || 0;
            const s = Number(inputs.sampleSd) || 1;
            const n = Math.max(2, Math.floor(Number(inputs.sampleN) || 2));
            const se = s / Math.sqrt(n);
            const t = (xbar - mu0) / se;
            const df = n - 1;
            return {
              primary: { label: 't-Prüfgröße', value: t, formattedValue: formatNumber(t, 3), unit: '' },
              details: [
                { label: 'Standardfehler (SE)', value: se, formattedValue: formatNumber(se, 3) },
                { label: 'Freiheitsgrade (df)', value: df, formattedValue: String(df) },
                { label: 'Differenz (x̄ - μ0)', value: xbar - mu0, formattedValue: formatNumber(xbar - mu0, 2) },
                { label: 'Faustregel-Signifikanz (|t| > 2)', value: Math.abs(t) >= 2 ? 'Wahrscheinlich signifikant' : 'Nicht signifikant', formattedValue: Math.abs(t) >= 2 ? 'Wahrscheinlich signifikant (p < 0,05)' : 'Nicht signifikant' },
              ],
            };
          
    },
    formula: "t = (x̄ - μ0) / (s / √n) | df = n - 1",
    formulaExplanation: "Die t-Verteilung berücksichtigt die zusätzliche Unsicherheit, die durch die Schätzung der Populationsvarianz aus der Stichprobe entsteht.",
    workedExample: {
          "title": "Beispiel: x̄ = 104, μ0 = 100, s = 8, n = 25",
          "description": "Standardfehler SE = 8 / √25 = 1,60. t = (104 - 100) / 1,60 = 2,500 bei df = 24.",
          "inputs": {
                "sampleMean": 104,
                "hypoMean": 100,
                "sampleSd": 8,
                "sampleN": 25
          },
          "resultSummary": "t = 2,500 | df = 24"
    },
    content: {
      intro: 'Der Student-t-Test prüft, ob sich die Mittelwerte zweier Stichproben statistisch signifikant voneinander unterscheiden.',
      details: 'Man unterscheidet den unverbundenen (zweistichproben-) t-Test für unabhängige Gruppen (z. B. Kontrollgruppe vs. Medikamentengruppe) und den gepaarten t-Test für Messwiederholungen an denselben Probanden (Vorher-Nachher-Vergleich).',
    },
    faqs: [
      { question: 'Wann nutzt man den t-Test statt des Z-Tests?', answer: 'Immer dann, wenn die wahre Varianz der Grundgesamtheit unbekannt ist und aus den Daten der Stichprobe geschätzt werden muss (insbesondere bei kleineren Stichprobengrößen n < 30).' },
      { question: 'Was ist der Welch-t-Test?', answer: 'Eine robuste Variante des unverbundenen t-Tests, die angewendet wird, wenn die Varianzen beider Gruppen ungleich sind (Varianzheterogenität).' },
    ],
    relatedSlugs: ['p-wert-hypothesentest-rechner', 'konfidenzintervall-rechner', 'effektstaerke-cohens-d-rechner'],
  },
  {
    id: "konfidenzintervall-rechner",
    slug: "konfidenzintervall-rechner",
    name: "Konfidenzintervall-Rechner (Vertrauensbereich)",
    shortName: "Konfidenzintervall",
    category: "statistik-wissenschaft",
    subcategory: "Inferenzstatistik",
    metaTitle: 'Konfidenzintervall Rechner – 90 %, 95 %',
    metaDescription: 'Ermitteln Sie die untere und obere Grenze des Konfidenzintervalls für Ihren Mittelwert und die Fehlerspanne (Margin of Error).',
    h1: 'Konfidenzintervall Rechner (Vertrauensintervall)',
    shortDescription: 'Berechnet den Vertrauensbereich für den wahren Populationsmittelwert mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["konfidenzintervall rechner","vertrauensbereich berechnen","margin of error rechner","95 prozent konfidenz","fehlerspanne"],
    inputs: [
          {
                "id": "mean",
                "label": "Mittelwert (x̄)",
                "type": "number",
                "defaultValue": 50,
                "step": 0.1
          },
          {
                "id": "sd",
                "label": "Standardabweichung (s)",
                "type": "number",
                "defaultValue": 10,
                "step": 0.1,
                "min": 0.001
          },
          {
                "id": "n",
                "label": "Stichprobengröße (n)",
                "type": "number",
                "defaultValue": 100,
                "step": 1,
                "min": 2
          },
          {
                "id": "confLevel",
                "label": "Konfidenzniveau",
                "type": "select",
                "defaultValue": "95",
                "options": [
                      {
                            "value": "90",
                            "label": "90 % (z = 1,645)"
                      },
                      {
                            "value": "95",
                            "label": "95 % (z = 1,960)"
                      },
                      {
                            "value": "99",
                            "label": "99 % (z = 2,576)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const mean = Number(inputs.mean) || 0;
            const sd = Number(inputs.sd) || 1;
            const n = Math.max(2, Math.floor(Number(inputs.n) || 2));
            const cl = inputs.confLevel || '95';
            let z = 1.960;
            if (cl === '90') z = 1.645;
            else if (cl === '99') z = 2.576;
            const se = sd / Math.sqrt(n);
            const margin = z * se;
            const lower = mean - margin;
            const upper = mean + margin;
            return {
              primary: { label: cl + ' % Konfidenzintervall', value: '[' + lower.toFixed(2) + ' ; ' + upper.toFixed(2) + ']', formattedValue: '[' + formatNumber(lower, 2) + ' ; ' + formatNumber(upper, 2) + ']', unit: '' },
              details: [
                { label: 'Fehlerspanne (± Margin of Error)', value: margin, formattedValue: '± ' + formatNumber(margin, 2) },
                { label: 'Untere Grenze', value: lower, formattedValue: formatNumber(lower, 2) },
                { label: 'Obere Grenze', value: upper, formattedValue: formatNumber(upper, 2) },
                { label: 'Standardfehler (SE)', value: se, formattedValue: formatNumber(se, 3) },
                { label: 'Z-Multiplikator', value: z, formattedValue: formatNumber(z, 3) },
              ],
            };
          
    },
    formula: "CI = x̄ ± z · (s / √n)",
    formulaExplanation: "Das Konfidenzintervall überdeckt bei wiederholter Stichprobenziehung mit der vorgegebenen Wahrscheinlichkeit den wahren Populationsparameter.",
    workedExample: {
          "title": "Beispiel: x̄ = 50, s = 10, n = 100 bei 95 % Konfidenz",
          "description": "Standardfehler SE = 1,00. Fehlerspanne = 1,96 × 1,00 = 1,96. Intervall = [48,04 ; 51,96].",
          "inputs": {
                "mean": 50,
                "sd": 10,
                "n": 100,
                "confLevel": "95"
          },
          "resultSummary": "[48,04 ; 51,96]"
    },
    content: {
      intro: 'Ein Konfidenzintervall (Vertrauensbereich, meist 95 % CI) grenzt den Bereich ein, der den wahren, unbekannten Parameter der Grundgesamtheit mit hoher Wahrscheinlichkeit überdeckt.',
      details: '95 % Konfidenzintervall = Stichprobenmittelwert ± z_(1 - alpha/2) · (s / Wurzel(n)). Bei Verzehnfachung der Stichprobengröße n halbiert sich die Breite des Fehlerbereichs (Wurzel-n-Gesetz).',
    },
    faqs: [
      { question: 'Was bedeutet ein 95-%-Konfidenzintervall wissenschaftlich korrekt?', answer: 'Würde man das Experiment unendlich oft wiederholen und jedes Mal ein Intervall berechnen, würden 95 Prozent aller berechneten Intervalle den wahren Populationsmittelwert enthalten.' },
      { question: 'Wie beeinflusst die Streuung s das Intervall?', answer: 'Je größer die Streuung in den Daten, desto ungenauer ist die Schätzung und desto breiter muss das Konfidenzintervall sein.' },
    ],
    relatedSlugs: ['stichprobengroesse-rechner', 'p-wert-hypothesentest-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "stichprobengroesse-rechner",
    slug: "stichprobengroesse-rechner",
    name: "Stichprobengrößen-Rechner (Umfragen & Studien)",
    shortName: "Stichprobengröße",
    category: "statistik-wissenschaft",
    subcategory: "Stichprobenplanung",
    metaTitle: 'Stichprobengröße Rechner – Stichprobenumfang für Umfragen b...',
    metaDescription: 'Ermitteln Sie die nötige Stichprobengröße n nach Cochran für Umfragen, Marktforschung und wissenschaftliche Erhebungen.',
    h1: 'Stichprobengröße Rechner (Cochran-Formel)',
    shortDescription: 'Berechnet den erforderlichen Stichprobenumfang bei gewünschter Fehlerspanne und Konfidenz mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["stichprobengröße rechner","stichprobenumfang berechnen","cochran formel online","fehlertoleranz umfrage","repräsentative stichprobe"],
    inputs: [
          {
                "id": "popSize",
                "label": "Grundgesamtheit (0 = unendlich groß)",
                "type": "number",
                "defaultValue": 10000,
                "step": 1000,
                "min": 0
          },
          {
                "id": "marginError",
                "label": "Gewünschte Fehlerspanne (± %)",
                "type": "number",
                "defaultValue": 3,
                "step": 0.5,
                "min": 0.5,
                "max": 20
          },
          {
                "id": "confLevel",
                "label": "Konfidenzniveau",
                "type": "select",
                "defaultValue": "95",
                "options": [
                      {
                            "value": "90",
                            "label": "90 % (z = 1,645)"
                      },
                      {
                            "value": "95",
                            "label": "95 % (z = 1,960)"
                      },
                      {
                            "value": "99",
                            "label": "99 % (z = 2,576)"
                      }
                ]
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const N = Number(inputs.popSize) || 0;
            const e = (Number(inputs.marginError) || 3) / 100;
            const cl = inputs.confLevel || '95';
            let z = 1.960;
            if (cl === '90') z = 1.645;
            else if (cl === '99') z = 2.576;
            const p = 0.5; // Worst-case Varianz (50/50)
            const n0 = (z * z * p * (1 - p)) / (e * e);
            let nFinal = n0;
            if (N > 0) {
              nFinal = n0 / (1 + (n0 - 1) / N);
            }
            const requiredN = Math.ceil(nFinal);
            return {
              primary: { label: 'Empfohlene Stichprobengröße (n)', value: requiredN, formattedValue: formatNumber(requiredN, 0) + ' Teilnehmer', unit: 'Teilnehmer' },
              details: [
                { label: 'Fehlerspanne (Margin of Error)', value: e * 100, formattedValue: '± ' + formatPercent(e * 100, 1) },
                { label: 'Konfidenzniveau', value: cl, formattedValue: cl + ' %' },
                { label: 'Grundgesamtheit (N)', value: N, formattedValue: N > 0 ? formatNumber(N, 0) : 'Sehr groß / Unendlich' },
                { label: 'Unendliche Grundgesamtheit (n0)', value: Math.ceil(n0), formattedValue: formatNumber(Math.ceil(n0), 0) },
              ],
            };
          
    },
    formula: "n = (z² · p · (1 - p)) / e² | Korrektur für endliche Population: n = n0 / (1 + (n0 - 1)/N)",
    formulaExplanation: "Mit p = 0,5 wird der konservativste Fall mit maximaler Streuung angenommen, was die statistische Aussagekraft garantiert.",
    workedExample: {
          "title": "Beispiel: Grundgesamtheit 10.000, 3 % Fehlerspanne bei 95 % Konfidenz",
          "description": "n0 = 1.067. Nach Korrektur für N = 10.000 ergibt sich n = 965 Teilnehmer.",
          "inputs": {
                "popSize": 10000,
                "marginError": 3,
                "confLevel": "95"
          },
          "resultSummary": "n = 965 Teilnehmer"
    },
    content: {
      intro: 'Dieser Stichprobenplaner kalkuliert den mathematisch notwendigen Stichprobenumfang n für empirische Studien, Umfragen und A/B-Tests bei vorgegebener Fehlertoleranz.',
      details: 'Formel nach Cochran: n = [z² · p · (1-p)] / e², wobei z das Konfidenzniveau (1,96 für 95 %), e die maximale Fehlermarge (z. B. 3 %) und p der erwartete Anteil (0,5 für konservatives Maximum) ist.',
    },
    faqs: [
      { question: 'Wie viele Teilnehmer benötigt eine repräsentative Wahlumfrage in Deutschland?', answer: 'Für eine Fehlermarge von ca. ±2,5 bis 3 Prozent bei 95 % Konfidenz genügen ca. 1.000 bis 1.500 repräsentativ ausgewählte Personen – unabhängig davon, ob die Gesamtbevölkerung 1 Million oder 84 Millionen beträgt!' },
      { question: 'Was ist die Endlichkeitskorrektur?', answer: 'Macht die Stichprobe mehr als 5 Prozent der gesamten Grundgesamtheit aus (z. B. bei Befragung aller Mitarbeiter einer Firma), verringert die Endlichkeitskorrektur die benötigte Probandenzahl.' },
    ],
    relatedSlugs: ['konfidenzintervall-rechner', 'p-wert-hypothesentest-rechner', 'prozentrechner'],
  },
  {
    id: "quartile-box-plot-rechner",
    slug: "quartile-box-plot-rechner",
    name: "Quartile- & Box-Plot-Rechner (IQR)",
    shortName: "Quartile-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Deskriptive Statistik",
    metaTitle: 'Quartile & Box-Plot Rechner – Q1, Median, Q3 & IQR berechnen',
    metaDescription: 'Ermitteln Sie das 1. Quartil, Median (Q2), 3. Quartil und den Interquartilsabstand (IQR) für Ihre Datenreihe online.',
    h1: 'Quartile & Interquartilsabstand Rechner',
    shortDescription: 'Berechnet die Quartile Q1, Q2, Q3 sowie den IQR für Boxplot-Analysen.',
    searchKeywords: ["quartile rechner","interquartilsabstand iqr","q1 q2 q3 berechnen","boxplot rechner online","spannweite statistik"],
    inputs: [
          {
                "id": "w1",
                "label": "Wert 1",
                "type": "number",
                "defaultValue": 12,
                "step": 0.1
          },
          {
                "id": "w2",
                "label": "Wert 2",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1
          },
          {
                "id": "w3",
                "label": "Wert 3",
                "type": "number",
                "defaultValue": 18,
                "step": 0.1
          },
          {
                "id": "w4",
                "label": "Wert 4",
                "type": "number",
                "defaultValue": 24,
                "step": 0.1
          },
          {
                "id": "w5",
                "label": "Wert 5",
                "type": "number",
                "defaultValue": 30,
                "step": 0.1
          },
          {
                "id": "w6",
                "label": "Wert 6",
                "type": "number",
                "defaultValue": 35,
                "step": 0.1
          },
          {
                "id": "w7",
                "label": "Wert 7",
                "type": "number",
                "defaultValue": 42,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const arr = [
              Number(inputs.w1) || 0,
              Number(inputs.w2) || 0,
              Number(inputs.w3) || 0,
              Number(inputs.w4) || 0,
              Number(inputs.w5) || 0,
              Number(inputs.w6) || 0,
              Number(inputs.w7) || 0,
            ].sort((a, b) => a - b);
            const min = arr[0];
            const max = arr[arr.length - 1];
            const q1 = arr[1]; // 25% rank in 7 items
            const q2 = arr[3]; // Median
            const q3 = arr[5]; // 75% rank in 7 items
            const iqr = q3 - q1;
            const lowerWhisker = Math.max(min, q1 - 1.5 * iqr);
            const upperWhisker = Math.min(max, q3 + 1.5 * iqr);
            return {
              primary: { label: 'Interquartilsabstand (IQR)', value: iqr, formattedValue: formatNumber(iqr, 2), unit: '' },
              details: [
                { label: 'Unteres Quartil (Q1, 25 %)', value: q1, formattedValue: formatNumber(q1, 2) },
                { label: 'Median (Q2, 50 %)', value: q2, formattedValue: formatNumber(q2, 2) },
                { label: 'Oberes Quartil (Q3, 75 %)', value: q3, formattedValue: formatNumber(q3, 2) },
                { label: 'Minimum', value: min, formattedValue: formatNumber(min, 2) },
                { label: 'Maximum', value: max, formattedValue: formatNumber(max, 2) },
                { label: 'Unterer Antennen-Grenzwert', value: lowerWhisker, formattedValue: formatNumber(lowerWhisker, 2) },
                { label: 'Oberer Antennen-Grenzwert', value: upperWhisker, formattedValue: formatNumber(upperWhisker, 2) },
              ],
            };
          
    },
    formula: "IQR = Q3 - Q1 | Ausreißergrenzen: [Q1 - 1,5·IQR ; Q3 + 1,5·IQR]",
    formulaExplanation: "Quartile unterteilen die sortierte Datenmenge in vier gleich große Viertel. Der Interquartilsabstand (IQR) umfasst die mittleren 50 % aller Daten.",
    workedExample: {
          "title": "Beispiel: 12, 15, 18, 24, 30, 35, 42",
          "description": "Q1 = 15,00, Q2 = 24,00, Q3 = 35,00. IQR = 35 - 15 = 20,00.",
          "inputs": {
                "w1": 12,
                "w2": 15,
                "w3": 18,
                "w4": 24,
                "w5": 30,
                "w6": 35,
                "w7": 42
          },
          "resultSummary": "IQR = 20,00 | Median = 24,00"
    },
    content: {
      intro: 'Dieser Rechner ermittelt Minimum, 1. Quartil (Q1), Median (Q2), 3. Quartil (Q3) und Maximum (Fünf-Punkte-Zusammenfassung) für Box-Plot-Diagramme.',
      details: 'Der Interquartilsabstand (IQR = Q3 - Q1) umfasst die mittleren 50 Prozent aller Messwerte. Nach der Tukey-Regel gelten Werte außerhalb von [Q1 - 1,5·IQR; Q3 + 1,5·IQR] als statistische Ausreißer.',
    },
    faqs: [
      { question: 'Was zeigt die "Box" in einem Box-Plot?', answer: 'Die Box visualisiert den Interquartilsabstand (IQR): Der untere Rand ist das 25-%-Quartil, der Strich in der Mitte der Median und der obere Rand das 75-%-Quartil.' },
      { question: 'Was sind die Whiskers (Antennen) am Box-Plot?', answer: 'Die Linien reichen bis zum kleinsten bzw. größten Datenwert, der noch kein extremer Ausreißer ist (maximal 1,5-facher IQR).' },
    ],
    relatedSlugs: ['mittelwert-median-modus-rechner', 'perzentil-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "binomialverteilung-rechner",
    slug: "binomialverteilung-rechner",
    name: "Binomialverteilungs-Rechner (Bernoulli-Kette)",
    shortName: "Binomialverteilung",
    category: "statistik-wissenschaft",
    subcategory: "Wahrscheinlichkeitsverteilung",
    metaTitle: 'Binomialverteilung Rechner – P – RechenHafen',
    metaDescription: 'Berechnen Sie Einzelwahrscheinlichkeit P(X=k), P(X<=k), Erwartungswert und Varianz einer Bernoulli-Kette online.',
    h1: 'Binomialverteilung Rechner (B(n, p))',
    shortDescription: 'Berechnet Wahrscheinlichkeiten für Bernoulli-Versuchsreihen mit Trefferquote p mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["binomialverteilung rechner","bernoulli kette berechnen","n über k wahrscheinlichkeit","p x gleich k","kumulierte binomialverteilung"],
    inputs: [
          {
                "id": "trials",
                "label": "Anzahl der Versuche (n)",
                "type": "number",
                "defaultValue": 10,
                "step": 1,
                "min": 1,
                "max": 100
          },
          {
                "id": "prob",
                "label": "Trefferwahrscheinlichkeit p (%)",
                "type": "number",
                "defaultValue": 20,
                "step": 1,
                "min": 0.1,
                "max": 99.9
          },
          {
                "id": "successes",
                "label": "Gewünschte Treffer (k)",
                "type": "number",
                "defaultValue": 2,
                "step": 1,
                "min": 0,
                "max": 100
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const n = Math.floor(Number(inputs.trials) || 10);
            const p = (Number(inputs.prob) || 20) / 100;
            const k = Math.min(n, Math.max(0, Math.floor(Number(inputs.successes) || 0)));
            // Binomial coefficient
            function nCr(n: number, r: number) {
              if (r < 0 || r > n) return 0;
              if (r === 0 || r === n) return 1;
              let res = 1;
              for (let i = 1; i <= r; i++) {
                res = res * (n - i + 1) / i;
              }
              return res;
            }
            function binomPdf(n: number, p: number, k: number) {
              return nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
            }
            const pExact = binomPdf(n, p, k);
            let pCdf = 0;
            for (let i = 0; i <= k; i++) {
              pCdf += binomPdf(n, p, i);
            }
            const expVal = n * p;
            const variance = n * p * (1 - p);
            return {
              primary: { label: 'Genau ' + k + ' Treffer P(X = ' + k + ')', value: pExact * 100, formattedValue: formatPercent(pExact * 100, 2), unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Treffer P(X ≤ ' + k + ')', value: pCdf * 100, formattedValue: formatPercent(pCdf * 100, 2) },
                { label: 'Mindestens ' + k + ' Treffer P(X ≥ ' + k + ')', value: (1 - pCdf + pExact) * 100, formattedValue: formatPercent((1 - pCdf + pExact) * 100, 2) },
                { label: 'Erwartungswert E(X) = n · p', value: expVal, formattedValue: formatNumber(expVal, 2) },
                { label: 'Standardabweichung σ', value: Math.sqrt(variance), formattedValue: formatNumber(Math.sqrt(variance), 2) },
                { label: 'Varianz Var(X)', value: variance, formattedValue: formatNumber(variance, 2) },
              ],
            };
          
    },
    formula: "P(X = k) = (n über k) · p^k · (1 - p)^(n - k)",
    formulaExplanation: "Modelliert die Anzahl der Erfolge k in einer Serie von n unabhängigen Ja/Nein-Experimenten mit konstanter Erfolgswahrscheinlichkeit p.",
    workedExample: {
          "title": "Beispiel: n = 10 Versuche, p = 20 %, k = 2 Treffer",
          "description": "P(X = 2) = (10 über 2) · 0,2² · 0,8⁸ = 45 · 0,04 · 0,1678 = 30,20 %.",
          "inputs": {
                "trials": 10,
                "prob": 20,
                "successes": 2
          },
          "resultSummary": "P(X = 2) = 30,20 %"
    },
    content: {
      intro: 'Die Binomialverteilung B(n, p) modelliert die Wahrscheinlichkeit für exakt k Erfolge in n unabhängigen Bernoulli-Versuchen mit konstanter Erfolgswahrscheinlichkeit p.',
      details: 'Formel nach Bernoulli: P(X = k) = (n über k) · p^k · (1 - p)^(n - k). Erwartungswert E(X) = n · p; Varianz Var(X) = n · p · (1 - p). Typisch für Qualitätskontrollen und Münzwürfe.',
    },
    faqs: [
      { question: 'Wie hoch ist die Wahrscheinlichkeit für genau 3 Sechsen bei 5 Würfelwürfen?', answer: 'n = 5, k = 3, p = 1/6: (5 über 3) · (1/6)³ · (5/6)² = 10 · (1/216) · (25/36) ≈ 3,22 Prozent.' },
      { question: 'Wann lässt sich die Binomialverteilung durch die Normalverteilung approximieren?', answer: 'Wenn die Laplace-Bedingung erfüllt ist: Varianz sigma² = n · p · (1 - p) > 9 (Satz von Moivre-Laplace mit Stetigkeitskorrektur ±0,5).' },
    ],
    relatedSlugs: ['poisson-verteilung-rechner', 'kombinatorik-n-ueber-k-rechner', 'wahrscheinlichkeit-wuerfel-muenze-rechner'],
  },
  {
    id: "poisson-verteilung-rechner",
    slug: "poisson-verteilung-rechner",
    name: "Poisson-Verteilungs-Rechner (Ereignisrate λ)",
    shortName: "Poisson-Verteilung",
    category: "statistik-wissenschaft",
    subcategory: "Wahrscheinlichkeitsverteilung",
    metaTitle: 'Poisson-Verteilung Rechner – P(X = k) für seltene Ereignisse',
    metaDescription: 'Berechnen Sie Poisson-Wahrscheinlichkeiten für Callcenter-Anrufe, Kundenankünfte, Serveranfragen oder Fehlerraten online.',
    h1: 'Poisson-Verteilung Rechner (Ereignishäufigkeit)',
    shortDescription: 'Berechnet die Wahrscheinlichkeit für das Eintreffen von k Ereignissen bei gegebener Rate λ.',
    searchKeywords: ["poisson verteilung rechner","ereignisrate lambda","warteschlangentheorie rechner","poisson wahrscheinlichkeit formel","seltene ereignisse statistik"],
    inputs: [
          {
                "id": "lambdaRate",
                "label": "Durchschnittliche Ereignisrate (λ)",
                "type": "number",
                "defaultValue": 4,
                "step": 0.1,
                "min": 0.01
          },
          {
                "id": "kEvents",
                "label": "Beobachtete Ereignisse (k)",
                "type": "number",
                "defaultValue": 4,
                "step": 1,
                "min": 0
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const lambda = Number(inputs.lambdaRate) || 4;
            const k = Math.max(0, Math.floor(Number(inputs.kEvents) || 0));
            function fact(n: number) {
              if (n <= 1) return 1;
              let res = 1;
              for (let i = 2; i <= n; i++) res *= i;
              return res;
            }
            function poissonPdf(lam: number, kVal: number) {
              return (Math.pow(lam, kVal) * Math.exp(-lam)) / fact(kVal);
            }
            const pExact = poissonPdf(lambda, k);
            let pCdf = 0;
            for (let i = 0; i <= k; i++) {
              pCdf += poissonPdf(lambda, i);
            }
            return {
              primary: { label: 'Genau ' + k + ' Ereignisse P(X = ' + k + ')', value: pExact * 100, formattedValue: formatPercent(pExact * 100, 2), unit: '' },
              details: [
                { label: 'Höchstens ' + k + ' Ereignisse P(X ≤ ' + k + ')', value: pCdf * 100, formattedValue: formatPercent(pCdf * 100, 2) },
                { label: 'Mindestens ' + k + ' Ereignisse P(X ≥ ' + k + ')', value: (1 - pCdf + pExact) * 100, formattedValue: formatPercent((1 - pCdf + pExact) * 100, 2) },
                { label: 'Erwartungswert E(X) = λ', value: lambda, formattedValue: formatNumber(lambda, 2) },
                { label: 'Standardabweichung σ = √λ', value: Math.sqrt(lambda), formattedValue: formatNumber(Math.sqrt(lambda), 2) },
              ],
            };
          
    },
    formula: "P(X = k) = (λ^k · e^(-λ)) / k!",
    formulaExplanation: "Die Poisson-Verteilung modelliert die Häufigkeit seltener, unabhängiger Ereignisse in einem festen Zeitintervall oder Raumgebiet.",
    workedExample: {
          "title": "Beispiel: Durchschnittlich 4 Anrufe pro Stunde (λ = 4), gesucht k = 4",
          "description": "P(X = 4) = (4⁴ · e^(-4)) / 24 = 256 · 0,0183156 / 24 = 19,54 %.",
          "inputs": {
                "lambdaRate": 4,
                "kEvents": 4
          },
          "resultSummary": "P(X = 4) = 19,54 %"
    },
    content: {
      intro: 'Die Poisson-Verteilung modelliert seltene, unabhängig voneinander auftretende Ereignisse in einem festen Zeit- oder Raumintervall mit bekannter Durchschnittsrate Lambda.',
      details: 'Formel: P(X = k) = (Lambda^k · e^(-Lambda)) / k!. Erwartungswert und Varianz sind bei der Poisson-Verteilung identisch: E(X) = Var(X) = Lambda. Typisch für Server-Anfragen pro Sekunde oder Notrufeinteilungen.',
    },
    faqs: [
      { question: 'Welche Voraussetzungen müssen für einen Poisson-Prozess gelten?', answer: 'Die Ereignisse müssen unabhängig voneinander auftreten, die durchschnittliche Rate Lambda muss konstant sein und zwei Ereignisse dürfen nicht exakt im selben winzigen Moment stattfinden.' },
      { question: 'Wie hängen Poisson-Verteilung und Exponentialverteilung zusammen?', answer: 'Die Poisson-Verteilung zählt die Anzahl der Ereignisse in fester Zeit; die Exponentialverteilung modelliert die kontinuierliche Wartezeit zwischen zwei aufeinanderfolgenden Ereignissen.' },
    ],
    relatedSlugs: ['binomialverteilung-rechner', 'kombinatorik-n-ueber-k-rechner', 'wahrscheinlichkeit-wuerfel-muenze-rechner'],
  },
  {
    id: "kombinatorik-n-ueber-k-rechner",
    slug: "kombinatorik-n-ueber-k-rechner",
    name: "Kombinatorik-Rechner (n über k & Permutationen)",
    shortName: "Kombinatorik-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Diskrete Mathematik",
    metaTitle: 'Kombinatorik Rechner – Binomialkoeffizient',
    metaDescription: 'Berechnen Sie Kombinationen (Lotto), Permutationen und Variationen mit oder ohne Zurücklegen / Reihenfolge online.',
    h1: 'Kombinatorik Rechner (n über k)',
    shortDescription: 'Ermittelt Möglichkeiten für Kombinationen, Variationen und Permutationen mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["kombinatorik rechner","n über k berechnen","binomialkoeffizient rechner","lotto kombinationen","fakultät rechner"],
    inputs: [
          {
                "id": "totalN",
                "label": "Gesamtzahl Elemente (n)",
                "type": "number",
                "defaultValue": 49,
                "step": 1,
                "min": 1,
                "max": 100
          },
          {
                "id": "chooseK",
                "label": "Auswahl Elemente (k)",
                "type": "number",
                "defaultValue": 6,
                "step": 1,
                "min": 1,
                "max": 100
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const n = Math.floor(Number(inputs.totalN) || 49);
            const k = Math.min(n, Math.floor(Number(inputs.chooseK) || 6));
            function nCr(nVal: number, rVal: number) {
              if (rVal < 0 || rVal > nVal) return 0;
              if (rVal === 0 || rVal === nVal) return 1;
              let res = 1;
              for (let i = 1; i <= rVal; i++) {
                res = res * (nVal - i + 1) / i;
              }
              return res;
            }
            // Variations without replacement: n! / (n-k)!
            let variations = 1;
            for (let i = 0; i < k; i++) variations *= (n - i);
            const combinations = nCr(n, k);
            return {
              primary: { label: 'Kombinationen ohne Reihenfolge (n über k)', value: combinations, formattedValue: formatNumber(combinations, 0) + ' Möglichkeiten', unit: 'Möglichkeiten' },
              details: [
                { label: 'Variationen mit Reihenfolge', value: variations, formattedValue: formatNumber(variations, 0) },
                { label: 'Lotto-Wahrscheinlichkeit (1 zu ...)', value: combinations, formattedValue: '1 zu ' + formatNumber(combinations, 0) },
                { label: 'Kombinationen mit Zurücklegen', value: nCr(n + k - 1, k), formattedValue: formatNumber(nCr(n + k - 1, k), 0) },
                { label: 'Formel', value: n + '! / (' + k + '! · ' + (n - k) + '!)', formattedValue: n + '! / (' + k + '! · ' + (n - k) + '!)' },
              ],
            };
          
    },
    formula: "(n über k) = n! / (k! · (n - k)!)",
    formulaExplanation: "Der Binomialkoeffizient gibt an, auf wie viele verschiedene Arten man k Objekte aus einer Menge von n verschiedenen Objekten auswählen kann (ohne Beachtung der Reihenfolge).",
    workedExample: {
          "title": "Beispiel: 6 aus 49 (deutsches Lotto)",
          "description": "(49 über 6) = 49! / (6! · 43!) = 13.983.816 mögliche Zahlenkombinationen.",
          "inputs": {
                "totalN": 49,
                "chooseK": 6
          },
          "resultSummary": "13.983.816 Kombinationen"
    },
    content: {
      intro: 'Der Binomialkoeffizient "n über k" ermittelt die Anzahl der Möglichkeiten, k Elemente aus einer Menge von n Elementen ohne Zurücklegen und ohne Beachtung der Reihenfolge auszuwählen.',
      details: 'Formel: (n über k) = n! / [k! · (n - k)!]. Im Lotto "6 aus 49" gibt es exakt (49 über 6) = 13.983.816 mögliche Zahlenkombinationen.',
    },
    faqs: [
      { question: 'Was ist der Unterschied zwischen Permutation und Kombination?', answer: 'Bei Permutationen spielt die Reihenfolge eine Rolle (z. B. PIN-Codes oder Zieleinlauf); bei Kombinationen ist die Reihenfolge der gezogenen Elemente irrelevant (z. B. Handkarten beim Poker).' },
      { question: 'Warum gilt immer (n über k) = (n über n-k)?', answer: 'Wegen der Symmetrie: Die Auswahl von k Elementen, die man mitnimmt, ist mathematisch vollkommen identisch mit der Auswahl der (n - k) Elemente, die man zurücklässt.' },
    ],
    relatedSlugs: ['binomialverteilung-rechner', 'wahrscheinlichkeit-wuerfel-muenze-rechner', 'poisson-verteilung-rechner'],
  },
  {
    id: "lineare-regression-rechner",
    slug: "lineare-regression-rechner",
    name: "Lineare-Regression-Rechner (y = mx + b & R²)",
    shortName: "Lineare Regression",
    category: "statistik-wissenschaft",
    subcategory: "Regressionsanalyse",
    metaTitle: 'Lineare Regression Rechner – Regressionsgerade',
    metaDescription: 'Ermitteln Sie Regressionsgerade (y = ax + b), Achsenabschnitt, Steigung und Bestimmtheitsmaß R² für Wertepaare online.',
    h1: 'Lineare Regression Rechner (Methode der kleinsten Quadrate)',
    shortDescription: 'Berechnet die optimale Trendlinie nach der Methode der kleinsten Quadrate (OLS).',
    searchKeywords: ["lineare regression rechner","regressionsgerade berechnen","methode kleinste quadrate","steigung achsenabschnitt r2","trendlinie formel"],
    inputs: [
          {
                "id": "x1",
                "label": "X1",
                "type": "number",
                "defaultValue": 1,
                "step": 0.1
          },
          {
                "id": "y1",
                "label": "Y1",
                "type": "number",
                "defaultValue": 2.5,
                "step": 0.1
          },
          {
                "id": "x2",
                "label": "X2",
                "type": "number",
                "defaultValue": 2,
                "step": 0.1
          },
          {
                "id": "y2",
                "label": "Y2",
                "type": "number",
                "defaultValue": 4.8,
                "step": 0.1
          },
          {
                "id": "x3",
                "label": "X3",
                "type": "number",
                "defaultValue": 3,
                "step": 0.1
          },
          {
                "id": "y3",
                "label": "Y3",
                "type": "number",
                "defaultValue": 6.9,
                "step": 0.1
          },
          {
                "id": "x4",
                "label": "X4",
                "type": "number",
                "defaultValue": 4,
                "step": 0.1
          },
          {
                "id": "y4",
                "label": "Y4",
                "type": "number",
                "defaultValue": 9.1,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const xs = [Number(inputs.x1)||0, Number(inputs.x2)||0, Number(inputs.x3)||0, Number(inputs.x4)||0];
            const ys = [Number(inputs.y1)||0, Number(inputs.y2)||0, Number(inputs.y3)||0, Number(inputs.y4)||0];
            const n = 4;
            const sumX = xs.reduce((a, b) => a + b, 0);
            const sumY = ys.reduce((a, b) => a + b, 0);
            const meanX = sumX / n;
            const meanY = sumY / n;
            let num = 0, den = 0, ssTot = 0;
            for (let i = 0; i < n; i++) {
              num += (xs[i] - meanX) * (ys[i] - meanY);
              den += Math.pow(xs[i] - meanX, 2);
              ssTot += Math.pow(ys[i] - meanY, 2);
            }
            const slope = den === 0 ? 0 : num / den;
            const intercept = meanY - slope * meanX;
            let ssRes = 0;
            for (let i = 0; i < n; i++) {
              const pred = slope * xs[i] + intercept;
              ssRes += Math.pow(ys[i] - pred, 2);
            }
            const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - (ssRes / ssTot));
            return {
              primary: { label: 'Regressionsgleichung', value: 'y = ' + slope.toFixed(3) + ' · x + ' + intercept.toFixed(3), formattedValue: 'y = ' + formatNumber(slope, 3) + ' · x + ' + formatNumber(intercept, 3), unit: '' },
              details: [
                { label: 'Steigung (a)', value: slope, formattedValue: formatNumber(slope, 3) },
                { label: 'Y-Achsenabschnitt (b)', value: intercept, formattedValue: formatNumber(intercept, 3) },
                { label: 'Bestimmtheitsmaß (R²)', value: r2 * 100, formattedValue: formatPercent(r2 * 100, 2) },
                { label: 'Reststreuung (SS Residuals)', value: ssRes, formattedValue: formatNumber(ssRes, 3) },
                { label: 'Mittelwert X / Y', value: meanX, formattedValue: formatNumber(meanX, 2) + ' / ' + formatNumber(meanY, 2) },
              ],
            };
          
    },
    formula: "y = a · x + b | a = Cov(X,Y) / Var(X) | b = ȳ - a · x̄",
    formulaExplanation: "Die Regressionsgerade minimiert die Summe der quadrierten vertikalen Abweichungen zwischen Messpunkten und Modellgerade.",
    workedExample: {
          "title": "Beispiel: (1|2,5), (2|4,8), (3|6,9), (4|9,1)",
          "description": "Steigung a = 2,20, Achsenabschnitt b = 0,32. Gleichung: y = 2,20x + 0,32 mit R² = 99,94 %.",
          "inputs": {
                "x1": 1,
                "y1": 2.5,
                "x2": 2,
                "y2": 4.8,
                "x3": 3,
                "y3": 6.9,
                "x4": 4,
                "y4": 9.1
          },
          "resultSummary": "y = 2,200 · x + 0,320"
    },
    content: {
      intro: 'Die lineare Einfachregression (Methode der kleinsten Quadrate, OLS) legt die bestmögliche Trendgerade y = a · x + b durch eine Punktewolke von Messwerten.',
      details: 'Steigung a = Kovarianz(X,Y) / Varianz(X); Achsenabschnitt b = Mittelwert(Y) - a · Mittelwert(X). Das Bestimmtheitsmaß R² (0 ≤ R² ≤ 1) beziffert den Anteil der durch das Modell erklärten Varianz.',
    },
    faqs: [
      { question: 'Was bedeutet ein Bestimmtheitsmaß von R² = 0,85?', answer: 'Es bedeutet, dass 85 Prozent der beobachteten Streuung der Zielgröße Y durch den linearen Zusammenhang mit der Variablen X statistisch erklärt werden.' },
      { question: 'Was sind Residuen in der Regression?', answer: 'Die vertikalen Differenzen zwischen den real gemessenen Y-Werten und den durch die Regressionsgerade prognostizierten Werten (Residuum = y_i - y_dach).' },
    ],
    relatedSlugs: ['korrelationskoeffizient-rechner', 'kovarianz-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "kovarianz-rechner",
    slug: "kovarianz-rechner",
    name: "Kovarianz-Rechner (Cov(X, Y))",
    shortName: "Kovarianz-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Zusammenhangsmaße",
    metaTitle: 'Kovarianz Rechner – Stichprobenkovarianz',
    metaDescription: 'Berechnen Sie die Kovarianz Cov(X, Y) zwischen zwei Datensätzen zur Messung der gemeinsamen Streuung online.',
    h1: 'Kovarianz Rechner (Cov(X, Y))',
    shortDescription: 'Misst den unstandardisierten linearen Zusammenhang zweier Merkmale mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["kovarianz rechner","cov x y berechnen","stichprobenkovarianz","kovarianz formel","gemeinsame streuung"],
    inputs: [
          {
                "id": "x1",
                "label": "X1",
                "type": "number",
                "defaultValue": 10,
                "step": 0.1
          },
          {
                "id": "y1",
                "label": "Y1",
                "type": "number",
                "defaultValue": 12,
                "step": 0.1
          },
          {
                "id": "x2",
                "label": "X2",
                "type": "number",
                "defaultValue": 20,
                "step": 0.1
          },
          {
                "id": "y2",
                "label": "Y2",
                "type": "number",
                "defaultValue": 22,
                "step": 0.1
          },
          {
                "id": "x3",
                "label": "X3",
                "type": "number",
                "defaultValue": 30,
                "step": 0.1
          },
          {
                "id": "y3",
                "label": "Y3",
                "type": "number",
                "defaultValue": 35,
                "step": 0.1
          },
          {
                "id": "x4",
                "label": "X4",
                "type": "number",
                "defaultValue": 40,
                "step": 0.1
          },
          {
                "id": "y4",
                "label": "Y4",
                "type": "number",
                "defaultValue": 41,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const xs = [Number(inputs.x1)||0, Number(inputs.x2)||0, Number(inputs.x3)||0, Number(inputs.x4)||0];
            const ys = [Number(inputs.y1)||0, Number(inputs.y2)||0, Number(inputs.y3)||0, Number(inputs.y4)||0];
            const n = 4;
            const meanX = xs.reduce((a, b) => a + b, 0) / n;
            const meanY = ys.reduce((a, b) => a + b, 0) / n;
            let sumProd = 0;
            for (let i = 0; i < n; i++) {
              sumProd += (xs[i] - meanX) * (ys[i] - meanY);
            }
            const covSample = sumProd / (n - 1);
            const covPop = sumProd / n;
            return {
              primary: { label: 'Stichproben-Kovarianz s_xy', value: covSample, formattedValue: formatNumber(covSample, 2), unit: '' },
              details: [
                { label: 'Populations-Kovarianz σ_xy', value: covPop, formattedValue: formatNumber(covPop, 2) },
                { label: 'Vorzeichen-Bedeutung', value: covSample > 0 ? 'Positiv' : (covSample < 0 ? 'Negativ' : 'Unkorreliert'), formattedValue: covSample > 0 ? 'Gleichgerichteter Zusammenhang (positiv)' : (covSample < 0 ? 'Gegenläufiger Zusammenhang (negativ)' : 'Unkorreliert') },
                { label: 'Mittelwert X', value: meanX, formattedValue: formatNumber(meanX, 2) },
                { label: 'Mittelwert Y', value: meanY, formattedValue: formatNumber(meanY, 2) },
                { label: 'Summe der Kreuzprodukte', value: sumProd, formattedValue: formatNumber(sumProd, 2) },
              ],
            };
          
    },
    formula: "Cov(X, Y) = Σ((xi - x̄) · (yi - ȳ)) / (n - 1)",
    formulaExplanation: "Ein positiver Kovarianzwert zeigt, dass überdurchschnittliche Werte von X tendenziell mit überdurchschnittlichen Werten von Y einhergehen.",
    workedExample: {
          "title": "Beispiel: 4 Punkte (10|12), (20|22), (30|35), (40|41)",
          "description": "Mittelwert X = 25,0, Y = 27,5. Stichproben-Kovarianz = 163,33. Es liegt ein starker positiver Gleichlauf vor.",
          "inputs": {
                "x1": 10,
                "y1": 12,
                "x2": 20,
                "y2": 22,
                "x3": 30,
                "y3": 35,
                "x4": 40,
                "y4": 41
          },
          "resultSummary": "Cov = 163,33"
    },
    content: {
      intro: 'Die Kovarianz misst den gemeinsamen monotonen Trend zweier metrischer Zufallsvariablen X und Y.',
      details: 'Formel: Cov(X,Y) = (1 / (n-1)) · Summe[ (x_i - x_quer) · (y_i - y_quer) ]. Eine positive Kovarianz zeigt an, dass überdurchschnittliche Werte von X tendenziell mit überdurchschnittlichen Werten von Y einhergehen.',
    },
    faqs: [
      { question: 'Warum lässt sich die Stärke des Zusammenhangs an der Kovarianz allein schwer ablesen?', answer: 'Weil die Kovarianz nicht normiert ist und von den Einheiten der Messdaten abhängt; teilt man die Kovarianz durch das Produkt der Standardabweichungen, erhält man den normierten Pearson-Korrelationskoeffizienten r.' },
      { question: 'Was ist eine Kovarianzmatrix?', answer: 'Eine quadratische Matrix im multivariaten Datenraum, die alle paarweisen Kovarianzen zwischen mehreren Variablen systematisch anordnet (Hauptdiagonale = Varianzen).' },
    ],
    relatedSlugs: ['korrelationskoeffizient-rechner', 'lineare-regression-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "variationskoeffizient-rechner",
    slug: "variationskoeffizient-rechner",
    name: "Variationskoeffizient-Rechner (CV in %)",
    shortName: "Variationskoeffizient",
    category: "statistik-wissenschaft",
    subcategory: "Deskriptive Statistik",
    metaTitle: 'Variationskoeffizient Rechner – Relative Streuung (CV)',
    metaDescription: 'Ermitteln Sie den Variationskoeffizienten (CV = s / x̄) zur Beurteilung der relativen Streuung unabhängig von der Maßeinheit.',
    h1: 'Variationskoeffizient Rechner (Relative Standardabweichung)',
    shortDescription: 'Vergleicht die relative Streuung verschiedener Datensätze maßstabsunabhängig mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["variationskoeffizient rechner","relative standardabweichung","coefficient of variation","cv statistik formel","streuung vergleich"],
    inputs: [
          {
                "id": "meanVal",
                "label": "Mittelwert (x̄)",
                "type": "number",
                "defaultValue": 120,
                "step": 0.1,
                "min": 0.0001
          },
          {
                "id": "sdVal",
                "label": "Standardabweichung (s)",
                "type": "number",
                "defaultValue": 18,
                "step": 0.1,
                "min": 0
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const mean = Number(inputs.meanVal) || 1;
            const sd = Number(inputs.sdVal) || 0;
            if (mean === 0) return { primary: { label: 'Fehler', value: 'Mittelwert darf nicht 0 sein', unit: '' }, details: [] };
            const cv = (sd / Math.abs(mean)) * 100;
            return {
              primary: { label: 'Variationskoeffizient (CV)', value: cv, formattedValue: formatPercent(cv, 2), unit: '' },
              details: [
                { label: 'Dezimalwert (s / x̄)', value: cv / 100, formattedValue: formatNumber(cv / 100, 4) },
                { label: 'Eingegebener Mittelwert', value: mean, formattedValue: formatNumber(mean, 2) },
                { label: 'Eingegebene Standardabweichung', value: sd, formattedValue: formatNumber(sd, 2) },
                { label: 'Beurteilung', value: cv < 10 ? 'Sehr geringe Streuung' : (cv < 25 ? 'Moderate Streuung' : 'Hohe relative Streuung'), formattedValue: cv < 10 ? 'Sehr geringe Streuung (< 10 %)' : (cv < 25 ? 'Moderate Streuung' : 'Hohe relative Streuung (> 25 %)') },
              ],
            };
          
    },
    formula: "CV = (s / x̄) · 100 %",
    formulaExplanation: "Der Variationskoeffizient (auch relative Standardabweichung RSD genannt) drückt die Standardabweichung als Prozentsatz des Mittelwerts aus.",
    workedExample: {
          "title": "Beispiel: Mittelwert = 120, Standardabweichung = 18",
          "description": "CV = (18 / 120) × 100 % = 15,00 %.",
          "inputs": {
                "meanVal": 120,
                "sdVal": 18
          },
          "resultSummary": "CV = 15,00 %"
    },
    content: {
      intro: 'Der Variationskoeffizient (CV, relative Standardabweichung) setzt die Standardabweichung ins Verhältnis zum arithmetischen Mittelwert.',
      details: 'Formel: CV = (s / Mittelwert) · 100 %. Als dimensionslose Prozentzahl ermöglicht der Variationskoeffizient den direkten Vergleich von Streuungen zwischen Datensätzen mit völlig unterschiedlichen Größenordnungen oder Einheiten.',
    },
    faqs: [
      { question: 'Kann man die Streuung von Elefanten- und Mäusegewichten fair vergleichen?', answer: 'Ja, über den Variationskoeffizienten: Während die absolute Standardabweichung bei Elefanten in hunderten Kilogramm und bei Mäusen in Gramm gemessen wird, zeigt der CV das relative Risiko unabhängig vom Maßstab.' },
      { question: 'Wann darf der Variationskoeffizient nicht angewendet werden?', answer: 'Er ist nur für verhältnisskalierte Daten mit absolutem Nullpunkt sinnvoll; bei Intervallskalen (wie Celsius-Temperaturen, wo der Nullpunkt willkürlich ist) verliert der CV seine mathematische Gültigkeit.' },
    ],
    relatedSlugs: ['standardabweichung-rechner', 'mittelwert-median-modus-rechner', 'varianz-standardabweichung-stichprobe-rechner'],
  },
  {
    id: "geometrisches-mittel-rechner",
    slug: "geometrisches-mittel-rechner",
    name: "Geometrisches-Mittel-Rechner (Wachstumsraten)",
    shortName: "Geometrisches Mittel",
    category: "statistik-wissenschaft",
    subcategory: "Mittelwerte",
    metaTitle: 'Geometrisches Mittel Rechner – Durchschnittliche Wachstumsr...',
    metaDescription: 'Berechnen Sie das geometrische Mittel für Renditen, Zuwachsraten, Zinseszinsen und Multiplikatoren online.',
    h1: 'Geometrisches Mittel Rechner',
    shortDescription: 'Ermittelt das geometrische Mittel zur korrekten Durchschnittsberechnung prozentualer Wachstumsraten mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["geometrisches mittel rechner","durchschnittliches wachstum berechnen","geometrischer durchschnitt","zinseszins durchschnitt","wachstumsfaktor rechner"],
    inputs: [
          {
                "id": "f1",
                "label": "Wachstumsfaktor Jahr 1 (z.B. 1.10 für +10 %)",
                "type": "number",
                "defaultValue": 1.1,
                "step": 0.01,
                "min": 0.0001
          },
          {
                "id": "f2",
                "label": "Wachstumsfaktor Jahr 2 (z.B. 1.25 für +25 %)",
                "type": "number",
                "defaultValue": 1.25,
                "step": 0.01,
                "min": 0.0001
          },
          {
                "id": "f3",
                "label": "Wachstumsfaktor Jahr 3 (z.B. 0.90 für -10 %)",
                "type": "number",
                "defaultValue": 0.9,
                "step": 0.01,
                "min": 0.0001
          },
          {
                "id": "f4",
                "label": "Wachstumsfaktor Jahr 4 (z.B. 1.15 für +15 %)",
                "type": "number",
                "defaultValue": 1.15,
                "step": 0.01,
                "min": 0.0001
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const f1 = Number(inputs.f1) || 1;
            const f2 = Number(inputs.f2) || 1;
            const f3 = Number(inputs.f3) || 1;
            const f4 = Number(inputs.f4) || 1;
            const prod = f1 * f2 * f3 * f4;
            if (prod <= 0) return { primary: { label: 'Fehler', value: 'Werte müssen positiv sein', unit: '' }, details: [] };
            const geomMean = Math.pow(prod, 1 / 4);
            const avgRate = (geomMean - 1) * 100;
            const totalGrowth = (prod - 1) * 100;
            return {
              primary: { label: 'Geometrisches Mittel (Faktor)', value: geomMean, formattedValue: formatNumber(geomMean, 4), unit: '' },
              details: [
                { label: 'Durchschnittliche Wachstumsrate', value: avgRate, formattedValue: (avgRate >= 0 ? '+' : '') + formatPercent(avgRate, 2) + ' p.a.' },
                { label: 'Gesamtes Wachstum über 4 Perioden', value: totalGrowth, formattedValue: (totalGrowth >= 0 ? '+' : '') + formatPercent(totalGrowth, 2) },
                { label: 'Gesamtprodukt aller Faktoren', value: prod, formattedValue: formatNumber(prod, 4) },
                { label: 'Arithmetischer Vergleichswert', value: ((f1 + f2 + f3 + f4) / 4 - 1) * 100, formattedValue: formatPercent(((f1 + f2 + f3 + f4) / 4 - 1) * 100, 2) },
              ],
            };
          
    },
    formula: "x̄_geom = (x1 · x2 · ... · xn)^(1/n)",
    formulaExplanation: "Das geometrische Mittel ist die n-te Wurzel aus dem Produkt von n Faktoren und liefert das einzig mathematisch exakte mittlere Wachstum.",
    workedExample: {
          "title": "Beispiel: Faktoren 1,10, 1,25, 0,90, 1,15",
          "description": "Produkt = 1,423125. 4. Wurzel = 1,0922. Die durchschnittliche Rendite beträgt +9,22 % pro Periode.",
          "inputs": {
                "f1": 1.1,
                "f2": 1.25,
                "f3": 0.9,
                "f4": 1.15
          },
          "resultSummary": "+9,22 % p.a."
    },
    content: {
      intro: 'Das geometrische Mittel ist der einzig mathematisch exakte Mittelwert für proportionale Wachstumsraten, Zinseszinsen, Inflationsreihen und Indexziffern.',
      details: 'Formel: Geometrisches Mittel = n-te Wurzel aus dem Produkt aller Werte (x1 · x2 · ... · xn). Liegen Wachstumsfaktoren vor (z. B. +10 % und +30 %), rechnet man mit den Faktoren 1,10 und 1,30.',
    },
    faqs: [
      { question: 'Warum ist das geometrische Mittel immer kleiner oder gleich dem arithmetischen Mittel?', answer: 'Dies besagt die fundamentale Ungleichung vom arithmetischen und geometrischen Mittel (AM-GM-Ungleichung); beide sind nur dann exakt gleich, wenn alle Einzelwerte identisch sind.' },
      { question: 'Wie berechnet man die durchschnittliche jährliche Aktienrendite bei +50 % im 1. Jahr und -50 % im 2. Jahr?', answer: 'Wachstumsfaktoren: 1,50 und 0,50. Produkt = 0,75. Quadratwurzel(0,75) ≈ 0,866. Reale jährliche Durchschnittsrendite: -13,4 % p.a. (das arithmetische Mittel von 0 % wäre trügerisch!).' },
    ],
    relatedSlugs: ['harmonisches-mittel-rechner', 'mittelwert-median-modus-rechner', 'prozentrechner', 'durchschnittsrechner'],
  },
  {
    id: "harmonisches-mittel-rechner",
    slug: "harmonisches-mittel-rechner",
    name: "Harmonisches-Mittel-Rechner (Geschwindigkeiten & Kurse)",
    shortName: "Harmonisches Mittel",
    category: "statistik-wissenschaft",
    subcategory: "Mittelwerte",
    metaTitle: 'Harmonisches Mittel Rechner – Durchschnittsgeschwindigkeit...',
    metaDescription: 'Berechnen Sie das harmonische Mittel für Geschwindigkeiten (km/h), Dichten und Wechselkurse nach der exakten Formel.',
    h1: 'Harmonisches Mittel Rechner',
    shortDescription: 'Berechnet den physikalisch korrekten Durchschnitt für Verhältnisgrößen wie Geschwindigkeit (km/h).',
    searchKeywords: ["harmonisches mittel rechner","durchschnittsgeschwindigkeit berechnen","harmonischer durchschnitt","hin und rückfahrt geschwindigkeit","verhältnisgrößen mittel"],
    inputs: [
          {
                "id": "valA",
                "label": "Geschwindigkeit Hinfahrt (km/h)",
                "type": "number",
                "defaultValue": 60,
                "step": 1,
                "min": 1
          },
          {
                "id": "valB",
                "label": "Geschwindigkeit Rückfahrt (km/h)",
                "type": "number",
                "defaultValue": 120,
                "step": 1,
                "min": 1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const v1 = Number(inputs.valA) || 60;
            const v2 = Number(inputs.valB) || 120;
            if (v1 <= 0 || v2 <= 0) return { primary: { label: 'Fehler', value: 'Werte müssen > 0 sein', unit: '' }, details: [] };
            const harmMean = (2 * v1 * v2) / (v1 + v2);
            const arithMean = (v1 + v2) / 2;
            return {
              primary: { label: 'Harmonisches Mittel', value: harmMean, formattedValue: formatNumber(harmMean, 2) + ' km/h', unit: 'km/h' },
              details: [
                { label: 'Physikalisch korrekte Durchschnittsgeschwindigkeit', value: harmMean, formattedValue: formatNumber(harmMean, 2) + ' km/h' },
                { label: 'Falscher arithmetischer Durchschnitt', value: arithMean, formattedValue: formatNumber(arithMean, 2) + ' km/h' },
                { label: 'Unterschied (Verzerrung)', value: arithMean - harmMean, formattedValue: formatNumber(arithMean - harmMean, 2) + ' km/h' },
                { label: 'Formel', value: '2 / (1/' + v1 + ' + 1/' + v2 + ')', formattedValue: '2 / (1/' + v1 + ' + 1/' + v2 + ')' },
              ],
            };
          
    },
    formula: "x̄_harm = n / Σ(1 / xi)",
    formulaExplanation: "Das harmonische Mittel ist der Kehrwert des arithmetischen Mittels der Kehrwerte der Messdaten.",
    workedExample: {
          "title": "Beispiel: Hinfahrt 60 km/h, Rückfahrt 120 km/h über gleiche Strecke",
          "description": "x̄_harm = 2 / (1/60 + 1/120) = 2 / (3/120) = 80,00 km/h. (Arithmetisch 90 km/h wäre physikalisch falsch).",
          "inputs": {
                "valA": 60,
                "valB": 120
          },
          "resultSummary": "80,00 km/h"
    },
    content: {
      intro: 'Das harmonische Mittel ist der zwingend vorgeschriebene Mittelwert für Verhältnisgrößen und Quotienten wie Geschwindigkeiten (km/h) oder Preise pro Einheit.',
      details: 'Formel: H = n / Summe(1 / x_i). Fährt man eine feste Strecke mit 100 km/h hin und dieselbe Strecke mit 50 km/h zurück, beträgt die Durchschnittsgeschwindigkeit exakt 2 / (1/100 + 1/50) = 66,67 km/h (nicht 75 km/h!).',
    },
    faqs: [
      { question: 'Warum versagt das arithmetische Mittel bei Durchschnittsgeschwindigkeiten auf fester Distanz?', answer: 'Weil man bei niedriger Geschwindigkeit mehr Zeit auf der Strecke verbringt und die langsame Phase daher zeitlich überproportional stark ins Gewicht fällt.' },
      { question: 'Wann verwendet man das harmonische Mittel in der Finanzwelt?', answer: 'Beim Berechnen des durchschnittlichen Kurs-Gewinn-Verhältnisses (KGV) eines Aktienindex (P/E-Ratio), um Verzerrungen durch extrem hohe Einzelwerte zu eliminieren.' },
    ],
    relatedSlugs: ['geometrisches-mittel-rechner', 'mittelwert-median-modus-rechner', 'notendurchschnitt-rechner', 'durchschnittsrechner'],
  },
  {
    id: "bayes-theorem-rechner",
    slug: "bayes-theorem-rechner",
    name: "Bayes-Theorem-Rechner (Bedingte Wahrscheinlichkeit)",
    shortName: "Bayes-Theorem-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Wahrscheinlichkeitsrechnung",
    metaTitle: 'Bayes-Theorem Rechner – Bedingte Wahrscheinlichkeit P berec...',
    metaDescription: 'Berechnen Sie A-posteriori-Wahrscheinlichkeiten für medizinische Tests, Schnelltests, Diagnose-Sensitivität und Spezifität.',
    h1: 'Satz von Bayes Rechner (Bedingte Wahrscheinlichkeit)',
    shortDescription: 'Berechnet die A-posteriori-Wahrscheinlichkeit P(A|B) nach dem Satz von Bayes mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["bayes theorem rechner","satz von bayes berechnen","bedingte wahrscheinlichkeit","sensitivität spezifität rechner","positiver vorhersagewert"],
    inputs: [
          {
                "id": "priorA",
                "label": "Basisrate / Prävalenz P(A) (%)",
                "type": "number",
                "defaultValue": 1,
                "step": 0.1,
                "min": 0.001,
                "max": 99.9
          },
          {
                "id": "sensitivity",
                "label": "Sensitivität P(B|A) (%) – Richtig-Positiv",
                "type": "number",
                "defaultValue": 95,
                "step": 0.5,
                "min": 0.1,
                "max": 100
          },
          {
                "id": "specificity",
                "label": "Spezifität P(¬B|¬A) (%) – Richtig-Negativ",
                "type": "number",
                "defaultValue": 95,
                "step": 0.5,
                "min": 0.1,
                "max": 100
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const pA = (Number(inputs.priorA) || 1) / 100;
            const sens = (Number(inputs.sensitivity) || 95) / 100;
            const spec = (Number(inputs.specificity) || 95) / 100;
            const pNotA = 1 - pA;
            const falsePositiveRate = 1 - spec;
            // Total probability of positive test P(B) = P(B|A)*P(A) + P(B|¬A)*P(¬A)
            const pB = (sens * pA) + (falsePositiveRate * pNotA);
            // Posterior P(A|B)
            const posterior = pB === 0 ? 0 : (sens * pA) / pB;
            return {
              primary: { label: 'Tatsächlich krank bei positivem Test P(A|B)', value: posterior * 100, formattedValue: formatPercent(posterior * 100, 2), unit: '' },
              details: [
                { label: 'Positiver Vorhersagewert (PPV)', value: posterior * 100, formattedValue: formatPercent(posterior * 100, 2) },
                { label: 'Falsch-Positiv-Wahrscheinlichkeit', value: (1 - posterior) * 100, formattedValue: formatPercent((1 - posterior) * 100, 2) },
                { label: 'Gesamtwahrscheinlichkeit positiver Test P(B)', value: pB * 100, formattedValue: formatPercent(pB * 100, 2) },
                { label: 'Falsch-Positiv-Rate des Tests (1 - Spezifität)', value: (1 - spec) * 100, formattedValue: formatPercent((1 - spec) * 100, 2) },
              ],
            };
          
    },
    formula: "P(A|B) = [ P(B|A) · P(A) ] / [ P(B|A) · P(A) + P(B|¬A) · P(¬A) ]",
    formulaExplanation: "Der Satz von Bayes aktualisiert die Ausgangswahrscheinlichkeit (Prior) auf Basis neuer Evidenz zur A-posteriori-Wahrscheinlichkeit.",
    workedExample: {
          "title": "Beispiel: 1 % Krankheitsprävalenz, 95 % Sensitivität, 95 % Spezifität",
          "description": "Obwohl der Test zu 95 % genau ist, ist eine positiv getestete Person nur mit 16,10 % Wahrscheinlichkeit tatsächlich erkrankt (Prävalenzfehler).",
          "inputs": {
                "priorA": 1,
                "sensitivity": 95,
                "specificity": 95
          },
          "resultSummary": "P(A|B) = 16,10 %"
    },
    content: {
      intro: 'Der Satz von Bayes berechnet die bedingte Wahrscheinlichkeit eines Ereignisses unter Berücksichtigung von neuem Vorwissen oder Testergebnissen (A-posteriori-Wahrscheinlichkeit).',
      details: 'Formel: P(A|B) = [P(B|A) · P(A)] / P(B). Fundamental in der Medizin: Selbst bei einem zu 99 % zuverlässigen Test ist ein positives Testergebnis bei seltenen Krankheiten (niedrige Prävalenz P(A)) oft zu über 80 % ein Fehlalarm!',
    },
    faqs: [
      { question: 'Was ist der Base-Rate-Fallacy (Prävalenzfehler)?', answer: 'Die menschliche Neigung, die extrem niedrige Grundwahrscheinlichkeit (Basisrate) einer seltenen Erkrankung in der Bevölkerung zu ignorieren und die Aussagekraft eines positiven Tests drastisch zu überschätzen.' },
      { question: 'Wo wird Bayes-Theorem in der Informatik eingesetzt?', answer: 'In selbstlernenden Spam-Filtern (Bayes-Filter), künstlicher Intelligenz (Bayessche Netze) und prädiktiver Text- und Spracherkennung.' },
    ],
    relatedSlugs: ['chi-quadrat-unabhaengigkeitstest-rechner', 'wahrscheinlichkeit-wuerfel-muenze-rechner', 'binomialverteilung-rechner', 'prozentrechner'],
  },
  {
    id: "wahrscheinlichkeit-wuerfel-muenze-rechner",
    slug: "wahrscheinlichkeit-wuerfel-muenze-rechner",
    name: "Würfel & Münze Wahrscheinlichkeitsrechner",
    shortName: "Würfel & Münze",
    category: "statistik-wissenschaft",
    subcategory: "Wahrscheinlichkeitsrechnung",
    metaTitle: 'Würfel & Münze Wahrscheinlichkeitsrechner – Würfe',
    metaDescription: 'Berechnen Sie Trefferchancen für Mehrfach-Würfe mit 6-seitigen Würfeln und Münzwürfe (mindestens eine 6, Pasch, Augensumme).',
    h1: 'Würfel & Münzwurf Wahrscheinlichkeitsrechner',
    shortDescription: 'Ermittelt Chancen und Gegenwahrscheinlichkeiten für mehrfache Würfel- und Münzwürfe mit präziser Formelberechnung und verlässlichen Ergebnissen für Ihre Planung.',
    searchKeywords: ["würfel wahrscheinlichkeit rechner","münzwurf wahrscheinlichkeit","mindestens eine sechs rechner","pasch chance berechnen","laplace wahrscheinlichkeit"],
    inputs: [
          {
                "id": "diceCount",
                "label": "Anzahl Würfel (W6)",
                "type": "number",
                "defaultValue": 3,
                "step": 1,
                "min": 1,
                "max": 10
          },
          {
                "id": "targetRoll",
                "label": "Mindestens einmal Augenzahl 6 gewünscht",
                "type": "number",
                "defaultValue": 1,
                "step": 1,
                "min": 1,
                "max": 6
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const n = Math.max(1, Math.min(10, Math.floor(Number(inputs.diceCount) || 3)));
            const pSingleFail = 5 / 6;
            const pAllFail = Math.pow(pSingleFail, n);
            const pAtLeastOne = (1 - pAllFail) * 100;
            const pAllExact = Math.pow(1 / 6, n) * 100;
            const totalOutcomes = Math.pow(6, n);
            return {
              primary: { label: 'Chance auf mindestens eine 6 bei ' + n + ' Würfeln', value: pAtLeastOne, formattedValue: formatPercent(pAtLeastOne, 2), unit: '' },
              details: [
                { label: 'Chance, dass alle Würfel eine 6 zeigen', value: pAllExact, formattedValue: formatPercent(pAllExact, 4) },
                { label: 'Gegenwahrscheinlichkeit (keine einzige 6)', value: pAllFail * 100, formattedValue: formatPercent(pAllFail * 100, 2) },
                { label: 'Gesamtzahl möglicher Wurfergebnisse', value: totalOutcomes, formattedValue: formatNumber(totalOutcomes, 0) },
                { label: 'Münzwurf-Vergleich: n-mal Kopf in Folge', value: Math.pow(0.5, n) * 100, formattedValue: formatPercent(Math.pow(0.5, n) * 100, 2) },
              ],
            };
          
    },
    formula: "P(mindestens 1 Treffer) = 1 - (5/6)^n",
    formulaExplanation: "Über die Gegenwahrscheinlichkeit (kein einziger Treffer in n unabhängigen Versuchen) lässt sich die Gesamtwahrscheinlichkeit exakt berechnen.",
    workedExample: {
          "title": "Beispiel: 3 Würfel, mindestens eine 6",
          "description": "P(keine 6) = (5/6)³ = 125 / 216 = 57,87 %. P(mindestens eine 6) = 1 - 0,5787 = 42,13 %.",
          "inputs": {
                "diceCount": 3,
                "targetRoll": 1
          },
          "resultSummary": "42,13 %"
    },
    content: {
      intro: 'Dieser Stochastik-Rechner ermittelt Eintrittswahrscheinlichkeiten, Augensummen und Trefferfolgen bei fairen Münzen und mehrfachen Würfelwürfen.',
      details: 'Klassische Laplace-Wahrscheinlichkeit: P(E) = Günstige Ergebnisse / Mögliche Ergebnisse. Bei zwei 6-seitigen Würfeln gibt es 6² = 36 mögliche Würfelpaare; die Augensumme 7 ist mit 6 günstigen Paaren (Wahrscheinlichkeit 6/36 = 16,67 %) am wahrscheinlichsten.',
    },
    faqs: [
      { question: 'Wie hoch ist die Wahrscheinlichkeit, bei 10 Münzwürfen mindestens einmal "Kopf" zu werfen?', answer: 'Über das Gegenereignis: 1 - P(zehnmal Zahl) = 1 - (0,5)¹⁰ = 1 - (1/1024) ≈ 99,90 Prozent.' },
      { question: 'Was ist der Spielerfehlschluss (Gambler\'s Fallacy)?', answer: 'Der Irrglaube, dass nach einer langen Serie von "Rot" beim Roulette die Chance auf "Schwarz" gestiegen sei; die Kugel hat kein Gedächtnis, jede Runde bleibt stochastisch unabhängig.' },
    ],
    relatedSlugs: ['binomialverteilung-rechner', 'kombinatorik-n-ueber-k-rechner', 'bayes-theorem-rechner'],
  },
  {
    id: "perzentil-rechner",
    slug: "perzentil-rechner",
    name: "Perzentil-Rechner (Rang & Quantil)",
    shortName: "Perzentil-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Deskriptive Statistik",
    metaTitle: 'Perzentil Rechner – Quantile & Perzentil-Rang online ermitteln',
    metaDescription: 'Berechnen Sie das p-te Perzentil für eine Zahlenreihe oder den relativen Perzentil-Rang eines Werts.',
    h1: 'Perzentil & Quantil Rechner',
    shortDescription: 'Ermittelt Quantile und Perzentile zur relativen Einordnung von Testergebnissen und Kennzahlen.',
    searchKeywords: ["perzentil rechner","quantil berechnen","perzentilrang formel","90 perzentil berechnen","dezile statistik"],
    inputs: [
          {
                "id": "pRank",
                "label": "Gesuchtes Perzentil P (z.B. 90 für 90. Perzentil)",
                "type": "number",
                "defaultValue": 90,
                "step": 1,
                "min": 1,
                "max": 99
          },
          {
                "id": "d1",
                "label": "Messwert 1",
                "type": "number",
                "defaultValue": 10,
                "step": 0.1
          },
          {
                "id": "d2",
                "label": "Messwert 2",
                "type": "number",
                "defaultValue": 25,
                "step": 0.1
          },
          {
                "id": "d3",
                "label": "Messwert 3",
                "type": "number",
                "defaultValue": 40,
                "step": 0.1
          },
          {
                "id": "d4",
                "label": "Messwert 4",
                "type": "number",
                "defaultValue": 55,
                "step": 0.1
          },
          {
                "id": "d5",
                "label": "Messwert 5",
                "type": "number",
                "defaultValue": 70,
                "step": 0.1
          },
          {
                "id": "d6",
                "label": "Messwert 6",
                "type": "number",
                "defaultValue": 85,
                "step": 0.1
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const p = Math.max(1, Math.min(99, Number(inputs.pRank) || 90));
            const arr = [
              Number(inputs.d1) || 0,
              Number(inputs.d2) || 0,
              Number(inputs.d3) || 0,
              Number(inputs.d4) || 0,
              Number(inputs.d5) || 0,
              Number(inputs.d6) || 0,
            ].sort((a, b) => a - b);
            const n = arr.length;
            // Linear interpolation method for percentile
            const index = (p / 100) * (n - 1);
            const lowerIndex = Math.floor(index);
            const fraction = index - lowerIndex;
            let val = arr[lowerIndex];
            if (fraction > 0 && lowerIndex + 1 < n) {
              val = arr[lowerIndex] + fraction * (arr[lowerIndex + 1] - arr[lowerIndex]);
            }
            return {
              primary: { label: p + '. Perzentil (P' + p + ')', value: val, formattedValue: formatNumber(val, 2), unit: '' },
              details: [
                { label: 'Sortierte Reihe', value: arr.join(' ; '), formattedValue: arr.map(x => formatNumber(x, 1)).join(' ; ') },
                { label: 'Bedeutung', value: p, formattedValue: p + ' % aller Messwerte sind kleiner oder gleich ' + formatNumber(val, 2) },
                { label: 'Perzentil-Rang Index', value: index + 1, formattedValue: formatNumber(index + 1, 2) + ' von ' + n },
                { label: 'Median (50. Perzentil)', value: (arr[2] + arr[3]) / 2, formattedValue: formatNumber((arr[2] + arr[3]) / 2, 2) },
              ],
            };
          
    },
    formula: "Index = (p / 100) · (n - 1) mit linearer Interpolation",
    formulaExplanation: "Ein Perzentil gibt an, welcher Prozentsatz der Beobachtungen unterhalb eines bestimmten Werts liegt.",
    workedExample: {
          "title": "Beispiel: 90. Perzentil für 10, 25, 40, 55, 70, 85",
          "description": "Index = 0,90 × 5 = 4,5. Interpolation zwischen 70 und 85 = 77,50.",
          "inputs": {
                "pRank": 90,
                "d1": 10,
                "d2": 25,
                "d3": 40,
                "d4": 55,
                "d5": 70,
                "d6": 85
          },
          "resultSummary": "P90 = 77,50"
    },
    content: {
      intro: 'Das p-te Perzentil teilt eine sortierte Stichprobe so, dass mindestens p Prozent der Messwerte kleiner oder gleich diesem Schwellenwert sind.',
      details: 'Das 50. Perzentil ist der Median. Das 90. Perzentil markiert den Wert, den 90 % der Probanden unterschreiten und nur 10 % übertreffen (Standardmaß bei Gehaltstabellen, Server-Antwortzeiten und Kinderperzentilen).',
    },
    faqs: [
      { question: 'Was bedeuten Perzentilkurven im gelben Kinderuntersuchungsheft (U-Heft)?', answer: 'Liegt das Körpergewicht eines Babys auf der 75. Perzentilkurve, wiegen genau 75 Prozent aller gesunden gleichaltrigen Kinder weniger und 25 Prozent wiegen mehr.' },
      { question: 'Was ist die 95th-Percentile-Regel bei Internet-Providern?', answer: 'Provider schneiden die obersten 5 Prozent der monatlichen Datenverkehrsspitzen ab und rechnen die verbleibende maximale Bandbreite ab, um kurzzeitige Lastspitzen fair zu behandeln.' },
    ],
    relatedSlugs: ['quartile-box-plot-rechner', 'mittelwert-median-modus-rechner', 'z-score-normalverteilung-rechner'],
  },
  {
    id: "effektstaerke-cohens-d-rechner",
    slug: "effektstaerke-cohens-d-rechner",
    name: "Effektstärke-Rechner (Cohen's d)",
    shortName: "Cohen's d-Rechner",
    category: "statistik-wissenschaft",
    subcategory: "Inferenzstatistik",
    metaTitle: 'Effektstärke Rechner – Cohen\'s d für Mittelwertunterschiede',
    metaDescription: 'Berechnen Sie die standardisierte Effektstärke Cohen\'s d für zwei Gruppen und interpretieren Sie praktische Relevanz (klein/mittel/groß).',
    h1: 'Effektstärke Rechner (Cohen\'s d)',
    shortDescription: 'Quantifiziert die praktische Bedeutsamkeit eines Mittelwertunterschieds unabhängig von der Stichprobengröße.',
    searchKeywords: ["cohens d rechner","effektstärke berechnen","effektmaß statistik","praktische signifikanz","pooled standard deviation"],
    inputs: [
          {
                "id": "m1",
                "label": "Mittelwert Gruppe 1 (x̄1)",
                "type": "number",
                "defaultValue": 105,
                "step": 0.1
          },
          {
                "id": "sd1",
                "label": "Standardabweichung Gruppe 1 (s1)",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1,
                "min": 0.001
          },
          {
                "id": "m2",
                "label": "Mittelwert Gruppe 2 (x̄2)",
                "type": "number",
                "defaultValue": 95,
                "step": 0.1
          },
          {
                "id": "sd2",
                "label": "Standardabweichung Gruppe 2 (s2)",
                "type": "number",
                "defaultValue": 15,
                "step": 0.1,
                "min": 0.001
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const m1 = Number(inputs.m1) || 0;
            const sd1 = Number(inputs.sd1) || 1;
            const m2 = Number(inputs.m2) || 0;
            const sd2 = Number(inputs.sd2) || 1;
            const sPooled = Math.sqrt((sd1 * sd1 + sd2 * sd2) / 2);
            if (sPooled === 0) return { primary: { label: 'Fehler', value: 'Streuung darf nicht 0 sein', unit: '' }, details: [] };
            const d = (m1 - m2) / sPooled;
            const absD = Math.abs(d);
            let interp = 'Kein relevanter Effekt';
            if (absD >= 0.8) interp = 'Großer Effekt (d ≥ 0,8)';
            else if (absD >= 0.5) interp = 'Mittlerer Effekt (d ≥ 0,5)';
            else if (absD >= 0.2) interp = 'Kleiner Effekt (d ≥ 0,2)';
            return {
              primary: { label: "Effektstärke (Cohen's d)", value: d, formattedValue: formatNumber(d, 3), unit: '' },
              details: [
                { label: 'Interpretation nach Cohen', value: interp, formattedValue: interp },
                { label: 'Gepoolte Standardabweichung (s_pooled)', value: sPooled, formattedValue: formatNumber(sPooled, 2) },
                { label: 'Absoluter Mittelwertunterschied', value: m1 - m2, formattedValue: formatNumber(m1 - m2, 2) },
              ],
            };
          
    },
    formula: "d = (x̄1 - x̄2) / s_pooled | s_pooled = √[ (s1² + s2²) / 2 ]",
    formulaExplanation: "Cohen's d standardisiert den Mittelwertunterschied an der gemeinsamen Streuung und zeigt die wahre Stärke eines Interventionserfolgs.",
    workedExample: {
          "title": "Beispiel: Gruppe 1 = 105 (s = 15), Gruppe 2 = 95 (s = 15)",
          "description": "s_pooled = 15,00. d = (105 - 95) / 15,00 = 0,667 (mittlerer bis starker Effekt).",
          "inputs": {
                "m1": 105,
                "sd1": 15,
                "m2": 95,
                "sd2": 15
          },
          "resultSummary": "d = 0,667"
    },
    content: {
      intro: 'Cohens d misst die praktische Relevanz und relative Effektstärke eines Unterschieds zwischen zwei Gruppen unabhängig von der reinen Stichprobengröße.',
      details: 'Formel: d = (Mittelwert1 - Mittelwert2) / gepoolte Standardabweichung. Da bei riesigen Stichproben selbst minimale, irrelevante Unterschiede statistisch signifikant werden (p < 0,05), ist Cohens d unverzichtbar zur Beurteilung echter wissenschaftlicher Wirksamkeit.',
    },
    faqs: [
      { question: 'Wie interpretiert man Cohens d nach Standardkonventionen?', answer: 'd = 0,20 gilt als kleiner Effekt; d = 0,50 als mittlerer Effekt; ab d = 0,80 spricht man von einem starken Effekt.' },
      { question: 'Was bedeutet Cohens d = 1,0 ganz anschaulich?', answer: 'Dass sich die beiden Verteilungen um eine volle Standardabweichung unterscheiden; rund 84 Prozent der Behandlungsgruppe liegen über dem Mittelwert der Kontrollgruppe.' },
    ],
    relatedSlugs: ['t-test-rechner', 'p-wert-hypothesentest-rechner', 'standardabweichung-rechner'],
  },
  {
    id: "chi-quadrat-unabhaengigkeitstest-rechner",
    slug: "chi-quadrat-unabhaengigkeitstest-rechner",
    name: "Chi-Quadrat-Rechner (2x2-Kontingenztafel)",
    shortName: "Chi-Quadrat Test",
    category: "statistik-wissenschaft",
    subcategory: "Inferenzstatistik",
    metaTitle: 'Chi-Quadrat Rechner – 2x2 Vierfeldertafel Test auf Unabhäng...',
    metaDescription: 'Berechnen Sie die Chi-Quadrat-Prüfgröße (χ²), Freiheitsgrade und Scheinkorrelation für 2x2 Vierfeldertafeln online.',
    h1: 'Chi-Quadrat Test Rechner (Vierfeldertafel)',
    shortDescription: 'Prüft nominalskalierte Merkmale in einer 2x2 Kontingenztafel auf stochastische Unabhängigkeit.',
    searchKeywords: ["chi quadrat rechner","vierfeldertafel rechner","unabhängigkeitstest statistik","chi square test online","kontingenzkoeffizient"],
    inputs: [
          {
                "id": "cellA",
                "label": "Zelle A (Merkmal 1 Ja / Merkmal 2 Ja)",
                "type": "number",
                "defaultValue": 30,
                "step": 1,
                "min": 0
          },
          {
                "id": "cellB",
                "label": "Zelle B (Merkmal 1 Ja / Merkmal 2 Nein)",
                "type": "number",
                "defaultValue": 20,
                "step": 1,
                "min": 0
          },
          {
                "id": "cellC",
                "label": "Zelle C (Merkmal 1 Nein / Merkmal 2 Ja)",
                "type": "number",
                "defaultValue": 15,
                "step": 1,
                "min": 0
          },
          {
                "id": "cellD",
                "label": "Zelle D (Merkmal 1 Nein / Merkmal 2 Nein)",
                "type": "number",
                "defaultValue": 35,
                "step": 1,
                "min": 0
          }
    ],
    calculate: (inputs: Record<string, any>) => {
      
            const a = Number(inputs.cellA) || 0;
            const b = Number(inputs.cellB) || 0;
            const c = Number(inputs.cellC) || 0;
            const d = Number(inputs.cellD) || 0;
            const n = a + b + c + d;
            if (n === 0) return { primary: { label: 'Fehler', value: 'Summe muss > 0 sein', unit: '' }, details: [] };
            const row1 = a + b;
            const row2 = c + d;
            const col1 = a + c;
            const col2 = b + d;
            const denom = row1 * row2 * col1 * col2;
            if (denom === 0) return { primary: { label: 'Fehler', value: 'Randsummen dürfen nicht 0 sein', unit: '' }, details: [] };
            const chi2 = (n * Math.pow(Math.abs(a * d - b * c), 2)) / denom;
            const phi = Math.sqrt(chi2 / n);
            return {
              primary: { label: 'Chi-Quadrat Prüfgröße (χ²)', value: chi2, formattedValue: formatNumber(chi2, 3), unit: '' },
              details: [
                { label: 'Freiheitsgrade (df)', value: 1, formattedValue: '1' },
                { label: 'Kritischer Wert (α = 5 %)', value: 3.841, formattedValue: '3,841' },
                { label: 'Signifikanz (bei α = 5 %)', value: chi2 > 3.841 ? 'Statistisch signifikant' : 'Keine signifikante Abhängigkeit', formattedValue: chi2 > 3.841 ? 'Statistisch signifikante Abhängigkeit' : 'Keine signifikante Abhängigkeit' },
                { label: 'Phi-Koeffizient (Effektmaß)', value: phi, formattedValue: formatNumber(phi, 3) },
                { label: 'Gesamte Stichprobengröße (n)', value: n, formattedValue: formatNumber(n, 0) },
              ],
            };
          
    },
    formula: "χ² = n · (a·d - b·c)² / [ (a + b)·(c + d)·(a + c)·(b + d) ]",
    formulaExplanation: "Misst den Abstand zwischen den beobachteten Zellhäufigkeiten und den bei Unabhängigkeit theoretisch erwarteten Häufigkeiten.",
    workedExample: {
          "title": "Beispiel: A=30, B=20, C=15, D=35 (n = 100)",
          "description": "χ² = 9,000 > 3,841. Die beiden Merkmale sind auf dem 5 %-Niveau signifikant voneinander abhängig (Phi = 0,300).",
          "inputs": {
                "cellA": 30,
                "cellB": 20,
                "cellC": 15,
                "cellD": 35
          },
          "resultSummary": "χ² = 9,000 (signifikant)"
    },
    content: {
      intro: 'Der Chi-Quadrat-Unabhängigkeitstest (Chi²-Test) prüft in einer Kontingenztafel, ob zwei kategoriale Merkmale (z. B. Geschlecht und Wahlpräferenz) stochastisch unabhängig sind.',
      details: 'Teststatistik: Chi² = Summe[ (Beobachtete Häufigkeit f_o - Erwartete Häufigkeit f_e)² / f_e ]. Erwartete Häufigkeit f_e = (Zeilensumme · Spaltensumme) / Gesamtstichprobe. Freiheitsgrade df = (Zeilen - 1) · (Spalten - 1).',
    },
    faqs: [
      { question: 'Welche Mindesthäufigkeit verlangt der Chi-Quadrat-Test?', answer: 'In jeder Zelle der Kontingenztafel sollte die erwartete Häufigkeit f_e mindestens 5 betragen; bei kleineren Zahlen greift der exakte Fisher-Test.' },
      { question: 'Was ist der Unterschied zwischen Chi²-Unabhängigkeitstest und Chi²-Anpassungstest?', answer: 'Der Anpassungstest prüft, ob eine beobachtete Häufigkeitsverteilung einer theoretischen Verteilung (z. B. den Mendelschen Vererbungsregeln) folgt; der Unabhängigkeitstest prüft den Zusammenhang zweier Merkmale.' },
    ],
    relatedSlugs: ['p-wert-hypothesentest-rechner', 'bayes-theorem-rechner', 'korrelationskoeffizient-rechner'],
  },
];
