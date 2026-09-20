import { CalculatorDefinition } from '@/types/calculator';
import { formatNumber, formatCurrency, formatPercent } from '@/lib/formatters';

export const EXTRA_AUTO_ARBEIT: CalculatorDefinition[] = [
  // ==================== AUTO & VERKEHR (18 ZUSÄTZLICHE) ====================
  {
    id: 'kfz-steuer-rechner',
    slug: 'kfz-steuer-rechner',
    name: 'KFZ-Steuer-Rechner (nach Hubraum & CO2-Ausstoß)',
    shortName: 'KFZ-Steuer berechnen',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'KFZ-Steuer Rechner – Kraftfahrzeugsteuer für Benzin, Diesel & Elektro',
    metaDescription: 'Berechnen Sie die jährliche KFZ-Steuer für Ihr Auto nach Hubraum und CO2-Ausstoß (g/km) gemäß aktuellem Kraftfahrzeugsteuergesetz (KraftStG).',
    h1: 'KFZ-Steuer Rechner – Jährliche Autosteuer online berechnen',
    shortDescription: 'Ermittelt die exakte Kraftfahrzeugsteuer für Pkw mit Benzin-, Diesel- oder Hybridantrieb.',
    searchKeywords: ['kfz steuer rechner', 'autosteuer berechnen co2 hubraum', 'diesel kfz steuer tabelle', 'kraftfahrzeugsteuer pkw'],
    inputs: [
      {
        id: 'engineType',
        label: 'Antriebsart',
        type: 'select',
        defaultValue: 'petrol',
        options: [
          { value: 'petrol', label: 'Benziner (2,00 € je angefangene 100 cm³)' },
          { value: 'diesel', label: 'Diesel (9,50 € je angefangene 100 cm³)' },
          { value: 'electric', label: 'Elektrofahrzeug (Bis 2030 steuerbefreit, danach 50 % ermäßigt)' },
        ],
      },
      { id: 'displacementCc', label: 'Hubraum in cm³ (z. B. 1998 cm³)', type: 'number', defaultValue: 1998, min: 0, max: 8000, step: 100, unit: 'cm³' },
      { id: 'co2EmissionsGkm', label: 'CO2-Ausstoß in g/km (nach WLTP)', type: 'number', defaultValue: 135, min: 0, max: 400, step: 1, unit: 'g/km' },
    ],
    calculate: (inputs) => {
      const type = inputs.engineType || 'petrol';
      const cc = parseInt(inputs.displacementCc, 10) || 0;
      const co2 = parseInt(inputs.co2EmissionsGkm, 10) || 0;

      if (type === 'electric') {
        return {
          primary: { id: 'tax', label: 'Jährliche KFZ-Steuer', value: 0, formattedValue: '0,00 € (Steuerbefreit)', highlight: true },
          secondary: [
            { id: 'exemptUntil', label: 'Steuerbefreiung', value: 0, formattedValue: 'Bis 31.12.2030 nach § 3d KraftStG' },
          ],
          summaryText: 'Reine Elektrofahrzeuge sind bei Erstzulassung bis Ende 2025 bis zu 10 Jahre bzw. längstens bis zum 31.12.2030 komplett von der KFZ-Steuer befreit.',
        };
      }

      // Hubraumbetrag je angefangene 100 cm³
      const ccPortions = Math.ceil(cc / 100);
      const ccRate = type === 'diesel' ? 9.50 : 2.00;
      const baseTax = ccPortions * ccRate;

      // CO2-Zuschlag über 95 g/km (Stufentarif)
      let co2Tax = 0;
      const excess = Math.max(0, co2 - 95);
      if (excess > 0) {
        if (excess <= 20) co2Tax += excess * 2.00;
        else if (excess <= 40) co2Tax += 20 * 2.00 + (excess - 20) * 2.20;
        else if (excess <= 60) co2Tax += 20 * 2.00 + 20 * 2.20 + (excess - 40) * 2.50;
        else if (excess <= 80) co2Tax += 20 * 2.00 + 20 * 2.20 + 20 * 2.50 + (excess - 60) * 2.90;
        else if (excess <= 100) co2Tax += 20 * 2.00 + 20 * 2.20 + 20 * 2.50 + 20 * 2.90 + (excess - 80) * 3.40;
        else co2Tax += 20 * 2.00 + 20 * 2.20 + 20 * 2.50 + 20 * 2.90 + 20 * 3.40 + (excess - 100) * 4.00;
      }

      const totalTax = Math.round(baseTax + co2Tax);
      return {
        primary: { id: 'totalTax', label: 'Jährliche KFZ-Steuer', value: totalTax, formattedValue: formatCurrency(totalTax), highlight: true },
        secondary: [
          { id: 'baseTax', label: 'Hubraumbasierter Anteil', value: baseTax, formattedValue: formatCurrency(baseTax) },
          { id: 'co2Tax', label: 'CO2-Aufschlag (über 95 g/km)', value: co2Tax, formattedValue: formatCurrency(co2Tax) },
          { id: 'monthlyEff', label: 'Monatliche Belastung', value: totalTax / 12, formattedValue: formatCurrency(totalTax / 12) },
        ],
        summaryText: `Für Ihr Fahrzeug (${cc} cm³, ${co2} g/km CO2) beträgt die jährliche KFZ-Steuer ${formatCurrency(totalTax)} (${formatCurrency(baseTax)} Hubraum + ${formatCurrency(co2Tax)} CO2-Zuschlag).`,
      };
    },
    formula: 'KFZ-Steuer = (Hubraum / 100) × Sockelbetrag + gestaffelter CO2-Zuschlag über 95 g/km',
    formulaExplanation: 'Rechtsgrundlage ist § 9 KraftStG mit progressiver CO2-Staffel für Zulassungen ab 2021.',
    workedExample: {
      title: 'Beispiel: 1.998 cm³ Benziner mit 135 g/km CO2',
      inputValues: [{ label: 'Hubraum', value: '1.998 cm³' }, { label: 'CO2', value: '135 g/km' }],
      steps: ['Hubraum: 20 × 2,00 € = 40,00 €', 'CO2-Zuschlag (40 g über 95): 20 × 2,00 € + 20 × 2,20 € = 84,00 €', 'Gesamt = 40 € + 84 € = 124,00 €/Jahr'],
      result: '124,00 € jährliche Steuer',
    },
    faqs: [
      { question: 'Wer zieht die KFZ-Steuer ein?', answer: 'In Deutschland ist der Zoll (Bundesfinanzverwaltung) für die Festsetzung und den Einzug der Kraftfahrzeugsteuer zuständig.' },
      { question: 'Sind Elektroautos von der KFZ-Steuer befreit?', answer: 'Ja, reine E-Autos mit Erstzulassung bis Ende 2025 sind für bis zu 10 Jahre (maximal bis 31.12.2030) komplett steuerbefreit.' },
    ],
    relatedSlugs: ['co2-auto-rechner', 'dienstwagen-1-prozent-rechner', 'spritkostenrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Kraftfahrzeugsteuergesetz (§ 8, § 9 KraftStG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'dienstwagen-1-prozent-rechner',
    slug: 'dienstwagen-1-prozent-rechner',
    name: 'Dienstwagen-Rechner (1-Prozent-Regelung & Fahrten Wohnung-Arbeit)',
    shortName: 'Dienstwagen 1%-Regelung',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Dienstwagen Rechner – 1 % Regelung & Geldwerter Vorteil für Firmenwagen',
    metaDescription: 'Berechnen Sie den geldwerten Vorteil und die tatsächliche Netto-Belastung für Ihren Firmenwagen nach der 1-%-Regel (Verbrenner 1 %, Hybrid 0,5 %, Elektro 0,25 %).',
    h1: 'Dienstwagen Rechner – 1 % Pauschalversteuerung berechnen',
    shortDescription: 'Ermittelt den steuerpflichtigen geldwerten Vorteil für die Privatnutzung eines Dienstwagens (§ 8 Abs. 2 EStG).',
    searchKeywords: ['dienstwagen rechner', '1 prozent regelung firmenwagen berechnen', 'geldwerter vorteil arbeitsweg 0 03 prozent', 'dienstwagen elektro 0 25'],
    inputs: [
      { id: 'grossListPrice', label: 'Bruttolistenpreis (UVP bei Erstzulassung inkl. Sonderausstattung)', type: 'number', defaultValue: 48000, min: 5000, step: 1000, unit: '€' },
      { id: 'distanceWorkKm', label: 'Einfache Entfernung zur ersten Tätigkeitsstätte (km)', type: 'number', defaultValue: 20, min: 0, max: 200, step: 1, unit: 'km' },
      {
        id: 'carDriveType',
        label: 'Fahrzeugantrieb (Steuersatz nach § 6 Abs. 1 Nr. 4 EStG)',
        type: 'select',
        defaultValue: 'combustion',
        options: [
          { value: 'combustion', label: 'Verbrenner (1,0 % Privat + 0,03 % Arbeitsweg)' },
          { value: 'hybrid', label: 'Plug-in-Hybrid (0,5 % Privat + 0,015 % Arbeitsweg)' },
          { value: 'electric', label: 'Reines Elektroauto bis 70.000 € (0,25 % Privat + 0,0075 % Arbeitsweg)' },
        ],
      },
      { id: 'taxRate', label: 'Ihr persönlicher Grenzsteuersatz (inkl. Soli)', type: 'number', defaultValue: 38, min: 14, max: 45, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.grossListPrice) || 48000;
      const km = parseFloat(inputs.distanceWorkKm) || 20;
      const type = inputs.carDriveType || 'combustion';
      const taxRate = (parseFloat(inputs.taxRate) || 38) / 100;

      let privRate = 0.01;
      let commuteRate = 0.0003;
      if (type === 'hybrid') { privRate = 0.005; commuteRate = 0.00015; }
      if (type === 'electric') { privRate = 0.0025; commuteRate = 0.000075; }

      const privateBenefit = price * privRate;
      const commuteBenefit = price * commuteRate * km;
      const totalBenefit = privateBenefit + commuteBenefit;
      const netCost = totalBenefit * (taxRate + 0.20); // ca. Steuersatz + ca. 20% Sozialversicherung

      return {
        primary: { id: 'totalBenefit', label: 'Monatlicher geldwerter Vorteil (brutto)', value: totalBenefit, formattedValue: formatCurrency(totalBenefit), highlight: true },
        secondary: [
          { id: 'netCost', label: 'Geschätzter Netto-Gehaltsabzug', value: netCost, formattedValue: formatCurrency(netCost) },
          { id: 'privateBenefit', label: 'Anteil reine Privatnutzung', value: privateBenefit, formattedValue: formatCurrency(privateBenefit) },
          { id: 'commuteBenefit', label: 'Anteil Fahrten Wohnung-Arbeit', value: commuteBenefit, formattedValue: formatCurrency(commuteBenefit) },
        ],
        summaryText: `Bei ${formatCurrency(price)} Bruttolistenpreis und ${km} km Arbeitsweg erhöht sich Ihr Steuerbrutto monatlich um ${formatCurrency(totalBenefit)}. Das kostet Sie netto ca. ${formatCurrency(netCost)} im Monat.`,
      };
    },
    formula: 'Geldwerter Vorteil = BLP × Privatnutzungssatz + BLP × Arbeitswegsatz × Entfernungskilometer',
    formulaExplanation: 'Grundlage ist stets der gerundete Bruttolistenpreis (UVP) im Zeitpunkt der Erstzulassung, selbst bei Gebrauchtwagen oder Rabatten.',
    workedExample: {
      title: 'Beispiel: 48.000 € Verbrenner, 20 km Arbeitsweg',
      inputValues: [{ label: 'BLP', value: '48.000 €' }, { label: 'Entfernung', value: '20 km' }],
      steps: ['Privat: 48.000 € × 1 % = 480,00 €', 'Arbeitsweg: 48.000 € × 0,03 % × 20 = 288,00 €', 'Summe Vorteil = 768,00 € monatlich'],
      result: '768,00 € brutto geldwerter Vorteil',
    },
    faqs: [
      { question: 'Zählt der tatsächliche Kaufpreis oder der Bruttolistenpreis?', answer: 'Für die 1-%-Methode ist ausnahmslos der inländische Bruttolistenpreis zum Zeitpunkt der Erstzulassung zzgl. Sonderausstattung maßgeblich.' },
      { question: 'Wann lohnt sich die 0,25 %-Regelung für E-Autos?', answer: 'Für reine E-Autos mit Bruttolistenpreis bis 70.000 € (Wachstumschancengesetz) muss monatlich nur ein Viertel des Listenpreises versteuert werden.' },
    ],
    relatedSlugs: ['fahrtenbuch-vs-1-prozent-rechner', 'pendlerpauschale-rechner', 'kfz-steuer-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 EStG, § 8 Abs. 2 EStG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'fahrtenbuch-vs-1-prozent-rechner',
    slug: 'fahrtenbuch-vs-1-prozent-rechner',
    name: 'Fahrtenbuch vs. 1-Prozent-Regelung-Rechner',
    shortName: 'Fahrtenbuch vs. 1%',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Fahrtenbuch vs. 1 % Methode Rechner – Lohnt sich ein Fahrtenbuch?',
    metaDescription: 'Finden Sie heraus, ob die pauschale 1-%-Regelung oder ein ordnungsgemäßes Fahrtenbuch für Ihren Dienstwagen günstiger ist.',
    h1: 'Fahrtenbuch vs. 1 % Methode – Vergleich der Besteuerung',
    shortDescription: 'Vergleicht die steuerlichen Gesamtkosten der 1-%-Pauschale mit der Fahrtenbuchmethode.',
    searchKeywords: ['fahrtenbuch vs 1 prozent rechner', 'lohnt sich fahrtenbuch dienstwagen', 'geldwerter vorteil vergleich fahrtenbuch', 'firmenwagen fahrtenbuch vorteil'],
    inputs: [
      { id: 'grossListPrice', label: 'Bruttolistenpreis des Dienstwagens', type: 'number', defaultValue: 52000, min: 10000, step: 1000, unit: '€' },
      { id: 'yearlyActualCarCosts', label: 'Tatsächliche Gesamtkosten des Pkw pro Jahr (Leasing, Benzin, Wartung, AfA)', type: 'number', defaultValue: 10500, min: 2000, step: 500, unit: '€' },
      { id: 'totalYearlyKm', label: 'Gesamtfahrleistung pro Jahr in km', type: 'number', defaultValue: 25000, min: 5000, step: 1000, unit: 'km' },
      { id: 'privateSharePct', label: 'Anteil der privaten Fahrten (ohne Arbeitsweg)', type: 'number', defaultValue: 20, min: 1, max: 90, step: 5, unit: '%' },
      { id: 'distanceWorkKm', label: 'Entfernung zur Arbeit in km', type: 'number', defaultValue: 18, min: 0, max: 150, step: 1, unit: 'km' },
    ],
    calculate: (inputs) => {
      const blp = parseFloat(inputs.grossListPrice) || 52000;
      const costs = parseFloat(inputs.yearlyActualCarCosts) || 10500;
      const totalKm = parseFloat(inputs.totalYearlyKm) || 25000;
      const privPct = (parseFloat(inputs.privateSharePct) || 20) / 100;
      const dist = parseFloat(inputs.distanceWorkKm) || 18;

      // 1. 1-%-Methode p.a.
      const onePctMonthly = (blp * 0.01) + (blp * 0.0003 * dist);
      const onePctYearly = onePctMonthly * 12;

      // 2. Fahrtenbuch-Methode p.a.
      // Arbeitsweg-Kilometer (ca. 220 Arbeitstage × 2 × dist)
      const commuteKm = 220 * 2 * dist;
      const privateKm = totalKm * privPct;
      const taxableKmRatio = Math.min(1.0, (privateKm + (commuteKm / 2)) / totalKm);
      const logbookYearly = costs * taxableKmRatio;
      const difference = onePctYearly - logbookYearly;

      return {
        primary: { id: 'difference', label: 'Steuerersparnis durch Fahrtenbuch (brutto/Jahr)', value: Math.abs(difference), formattedValue: formatCurrency(Math.abs(difference)), highlight: true },
        secondary: [
          { id: 'onePctYearly', label: 'Geldwerter Vorteil nach 1 %-Regel', value: onePctYearly, formattedValue: formatCurrency(onePctYearly) },
          { id: 'logbookYearly', label: 'Geldwerter Vorteil nach Fahrtenbuch', value: logbookYearly, formattedValue: formatCurrency(logbookYearly) },
          { id: 'recommendation', label: 'Empfehlung', value: 0, formattedValue: difference > 0 ? 'Fahrtenbuch lohnt sich deutlich!' : '1 %-Pauschale ist günstiger / bequemer' },
        ],
        summaryText: difference > 0
          ? `Mit einem Fahrtenbuch sparen Sie jährlich ca. ${formatCurrency(difference)} steuerlichen geldwerten Vorteil gegenüber der 1-%-Regelung.`
          : `Die 1-%-Regelung ist in Ihrem Fall um ca. ${formatCurrency(Math.abs(difference))} günstiger als ein Fahrtenbuch.`,
      };
    },
    formula: 'Vergleich: (1 % BLP + 0,03 % BLP × km) × 12 vs. Gesamtkosten × Privatfahrtenanteil',
    formulaExplanation: 'Ein Fahrtenbuch lohnt sich besonders bei teuren Fahrzeugen, älteren Dienstwagen und geringem privatem Fahranteil.',
    workedExample: {
      title: 'Beispiel: 52.000 € BLP bei 10.500 € Kosten und nur 20 % Privatfahrten',
      inputValues: [{ label: 'BLP', value: '52.000 €' }, { label: 'Reale Kosten', value: '10.500 €' }, { label: 'Privatanteil', value: '20 %' }],
      steps: ['1 %-Regel = 9.609,60 € geldwerter Vorteil', 'Fahrtenbuch = ca. 3.200 € geldwerter Vorteil', 'Ersparnis = über 6.400 € geringeres Steuerbrutto'],
      result: 'Fahrtenbuch spart ca. 6.400 € Steuerbrutto',
    },
    faqs: [
      { question: 'Darf man das Verfahren während des Jahres wechseln?', answer: 'Nein, das Wahlrecht zwischen 1-%-Regelung und Fahrtenbuch kann nach ständiger BFH-Rechtsprechung nur für ein volles Kalenderjahr oder bei Fahrzeugwechsel ausgeübt werden.' },
      { question: 'Werden elektronische Fahrtenbücher vom Finanzamt anerkannt?', answer: 'Ja, sofern die Daten manipulationssicher und zeitnah erfasst werden (z. B. GPS-Fahrtenbücher mit Zertifizierung).' },
    ],
    relatedSlugs: ['dienstwagen-1-prozent-rechner', 'pendlerpauschale-rechner', 'auto-gesamtkosten-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 3 EStG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'leasingfaktor-rechner',
    slug: 'leasingfaktor-rechner',
    name: 'Leasingfaktor-Rechner (Auto-Leasing bewerten)',
    shortName: 'Leasingfaktor berechnen',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Leasingfaktor Rechner – Leasingangebote objektiv vergleichen',
    metaDescription: 'Berechnen Sie den Leasingfaktor und Gesamtkostenfaktor für Auto-Leasingangebote. Erkennen Sie echte Leasing-Schnäppchen (Faktor unter 0,7).',
    h1: 'Leasingfaktor Rechner – Leasing-Deals objektiv vergleichen',
    shortDescription: 'Ermittelt den Leasingfaktor zur fairen Bewertung von Auto-Leasingverträgen.',
    searchKeywords: ['leasingfaktor rechner', 'leasingfaktor formel berechnen', 'guter leasingfaktor schnaeppchen', 'gesamtleasingfaktor rechner'],
    inputs: [
      { id: 'monthlyLeasingRate', label: 'Monatliche Leasingrate (netto oder brutto)', type: 'number', defaultValue: 320, min: 50, step: 10, unit: '€' },
      { id: 'grossListPrice', label: 'Bruttolistenpreis (UVP des Fahrzeugs)', type: 'number', defaultValue: 42000, min: 5000, step: 1000, unit: '€' },
      { id: 'downPayment', label: 'Einmalige Sonderzahlung / Anzahlung', type: 'number', defaultValue: 0, min: 0, step: 500, unit: '€' },
      { id: 'contractMonths', label: 'Vertragslaufzeit in Monaten', type: 'number', defaultValue: 36, min: 12, max: 60, step: 6, unit: 'Monate' },
      { id: 'transferCosts', label: 'Überführungs- & Zulassungskosten', type: 'number', defaultValue: 990, min: 0, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.monthlyLeasingRate) || 320;
      const blp = parseFloat(inputs.grossListPrice) || 42000;
      const down = parseFloat(inputs.downPayment) || 0;
      const months = parseInt(inputs.contractMonths, 10) || 36;
      const transfer = parseFloat(inputs.transferCosts) || 990;

      const leasingFactor = (rate / blp) * 100;
      // Gesamtleasingfaktor inkl. Anzahlung & Überführung
      const effectiveMonthlyRate = rate + (down / months) + (transfer / months);
      const totalLeasingFactor = (effectiveMonthlyRate / blp) * 100;
      const totalCostOverTerm = (rate * months) + down + transfer;

      let rating = 'Solides Angebot';
      if (totalLeasingFactor < 0.6) rating = 'Herausragendes Mega-Schnäppchen!';
      else if (totalLeasingFactor < 0.8) rating = 'Sehr gutes Schnäppchen';
      else if (totalLeasingFactor < 1.1) rating = 'Guter Marktdurchschnitt';
      else rating = 'Eher teures Angebot';

      return {
        primary: { id: 'leasingFactor', label: 'Reiner Leasingfaktor', value: leasingFactor, formattedValue: formatNumber(leasingFactor, 2), highlight: true },
        secondary: [
          { id: 'totalLeasingFactor', label: 'Gesamtleasingfaktor (inkl. Nebenkosten)', value: totalLeasingFactor, formattedValue: formatNumber(totalLeasingFactor, 2) },
          { id: 'totalCostOverTerm', label: `Gesamtkosten über ${months} Monate`, value: totalCostOverTerm, formattedValue: formatCurrency(totalCostOverTerm) },
          { id: 'rating', label: 'Deal-Bewertung', value: 0, formattedValue: rating },
        ],
        summaryText: `Mit einem Leasingfaktor von ${formatNumber(leasingFactor, 2)} (Gesamtleasingfaktor ${formatNumber(totalLeasingFactor, 2)}) gilt dieses Angebot als: ${rating}.`,
      };
    },
    formula: 'Leasingfaktor = (Monatsrate / Bruttolistenpreis) × 100',
    formulaExplanation: 'Ein Leasingfaktor unter 0,7 gilt am Automarkt als hervorragendes Angebot. Ab 1,1 gilt ein Leasingvertrag als teuer.',
    workedExample: {
      title: 'Beispiel: 320 € Rate bei 42.000 € BLP über 36 Monate',
      inputValues: [{ label: 'Rate', value: '320 €' }, { label: 'BLP', value: '42.000 €' }],
      steps: ['Leasingfaktor = (320 € / 42.000 €) × 100 = 0,76', 'Gilt als sehr gutes Schnäppchen'],
      result: 'Leasingfaktor 0,76',
    },
    faqs: [
      { question: 'Was ist der Gesamtleasingfaktor?', answer: 'Der Gesamtleasingfaktor rechnet die Einmalzahlung (Anzahlung) und Überführungskosten auf die Monatsraten um, um die wahren Gesamtkosten abzubilden.' },
      { question: 'Gilt der Leasingfaktor für Privat- oder Gewerbeleasing?', answer: 'Für beide. Bei Gewerbeleasing vergleicht man Nettowerte, bei Privatkunden immer Bruttowerte.' },
    ],
    relatedSlugs: ['auto-gesamtkosten-rechner', 'auto-wertverlust-rechner', 'autokreditrechner'],
  },

  {
    id: 'auto-gesamtkosten-rechner',
    slug: 'auto-gesamtkosten-rechner',
    name: 'Auto Gesamtkosten-Rechner (Vollkosten & TCO pro km)',
    shortName: 'Auto Gesamtkosten',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Auto Gesamtkosten Rechner – Reale Kosten pro Monat & pro Kilometer (TCO)',
    metaDescription: 'Ermitteln Sie die tatsächlichen Gesamtkosten Ihres Autos: Wertverlust, Kraftstoff, KFZ-Versicherung, Steuer, Inspektion und Reifen pro Monat und pro km.',
    h1: 'Auto Gesamtkosten Rechner – Echte Autokosten pro Kilometer berechnen',
    shortDescription: 'Berechnet die Vollkosten eines Autos unter Einbeziehung des schleichenden Wertverlusts.',
    searchKeywords: ['auto gesamtkosten rechner', 'was kostet ein auto wirklich im monat', 'tco auto rechner vollstrecke', 'autokosten pro kilometer berechnen adac'],
    inputs: [
      { id: 'purchasePrice', label: 'Fahrzeugkaufpreis', type: 'number', defaultValue: 30000, min: 1000, step: 1000, unit: '€' },
      { id: 'yearlyMileageKm', label: 'Jährliche Fahrleistung in km', type: 'number', defaultValue: 15000, min: 2000, step: 1000, unit: 'km' },
      { id: 'fuelCostPer100Km', label: 'Kraftstoff-/Stromkosten auf 100 km', type: 'number', defaultValue: 11.50, min: 3, max: 30, step: 0.5, unit: '€' },
      { id: 'insuranceYearly', label: 'KFZ-Versicherung pro Jahr (Haftpflicht + Kasko)', type: 'number', defaultValue: 650, min: 100, step: 50, unit: '€' },
      { id: 'taxYearly', label: 'KFZ-Steuer pro Jahr', type: 'number', defaultValue: 140, min: 0, step: 10, unit: '€' },
      { id: 'maintenanceYearly', label: 'Wartung, Reparaturen, TÜV & Reifen pro Jahr', type: 'number', defaultValue: 600, min: 100, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.purchasePrice) || 30000;
      const km = parseFloat(inputs.yearlyMileageKm) || 15000;
      const fuelPer100 = parseFloat(inputs.fuelCostPer100Km) || 11.50;
      const insurance = parseFloat(inputs.insuranceYearly) || 650;
      const tax = parseFloat(inputs.taxYearly) || 140;
      const maint = parseFloat(inputs.maintenanceYearly) || 600;

      // Realistischer durchschnittlicher Wertverlust ca. 10 % des Kaufpreises pro Jahr
      const depreciationYearly = price * 0.10;
      const fuelYearly = (km / 100) * fuelPer100;
      const totalYearly = depreciationYearly + fuelYearly + insurance + tax + maint;
      const costPerMonth = totalYearly / 12;
      const costPerKm = totalYearly / km;

      return {
        primary: { id: 'costPerMonth', label: 'Tatsächliche Gesamtkosten pro Monat', value: costPerMonth, formattedValue: formatCurrency(costPerMonth), highlight: true },
        secondary: [
          { id: 'costPerKm', label: 'Kosten pro gefahrenen Kilometer', value: costPerKm, formattedValue: `${formatNumber(costPerKm * 100, 1)} Cent/km` },
          { id: 'totalYearly', label: 'Gesamtkosten pro Jahr', value: totalYearly, formattedValue: formatCurrency(totalYearly) },
          { id: 'depreciationShare', label: 'Größter Posten: Wertverlust pro Monat', value: depreciationYearly / 12, formattedValue: formatCurrency(depreciationYearly / 12) },
        ],
        summaryText: `Ihr Auto kostet Sie tatsächlich ca. ${formatCurrency(costPerMonth)} im Monat (${formatNumber(costPerKm * 100, 1)} Cent pro km). Der Wertverlust macht dabei rund ${formatCurrency(depreciationYearly / 12)} monatlich aus.`,
      };
    },
    formula: 'Vollkosten = Wertverlust + Kraftstoff + Versicherung + Steuer + Wartung',
    formulaExplanation: 'Laut ADAC-Vollkostenrechnung unterschätzen die meisten Autofahrer die tatsächlichen Kosten ihres Pkw um fast 50 %, weil der schleichende Wertverlust nicht wahrgenommen wird.',
    workedExample: {
      title: 'Beispiel: 30.000 € Auto bei 15.000 km pro Jahr',
      inputValues: [{ label: 'Kaufpreis', value: '30.000 €' }, { label: 'Kilometer', value: '15.000 km' }],
      steps: ['Wertverlust: ca. 3.000 €/Jahr', 'Sprit: 1.725 €/Jahr', 'Fixkosten & Werkstatt: 1.390 €/Jahr', 'Summe: 6.115 €/Jahr = 509,58 €/Monat (40,8 ct/km)'],
      result: 'ca. 509,58 € pro Monat',
    },
    faqs: [
      { question: 'Was ist der größte Kostenblock beim Auto?', answer: 'Bei Neuwagen und jungen Gebrauchtwagen ist der Wertverlust mit Abstand der größte Kostenfaktor, oft weit vor den Spritkosten.' },
      { question: 'Wie kann man die Vollkosten am effektivsten senken?', answer: 'Kauf eines 3 bis 4 Jahre alten Gebrauchtwagens, da hier der steilste Wertverlust bereits vom Erstbesitzer getragen wurde.' },
    ],
    relatedSlugs: ['auto-wertverlust-rechner', 'spritkostenrechner', 'kfz-steuer-rechner'],
  },

  {
    id: 'auto-wertverlust-rechner',
    slug: 'auto-wertverlust-rechner',
    name: 'Auto Wertverlust-Rechner (nach Schwacke & Alter)',
    shortName: 'Auto Wertverlust',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Auto Wertverlust Rechner – Restwert nach 1 bis 10 Jahren Schwacke',
    metaDescription: 'Berechnen Sie den Wertverlust und den verbleibenden Restwert Ihres Autos nach Alter und Kilometern anhand anerkannter Marktdaten.',
    h1: 'Auto Wertverlust Rechner – Wertminderung von Neu- und Gebrauchtwagen',
    shortDescription: 'Schätzt den Restwert von Fahrzeugen nach der typischen Wertverlustkurve.',
    searchKeywords: ['auto wertverlust rechner', 'restwert auto berechnen jahre', 'schwacke liste wertverlust kurve', 'wertverlust neuwagen erstes jahr'],
    inputs: [
      { id: 'originalPrice', label: 'Neupreis bzw. Anschaffungspreis', type: 'number', defaultValue: 35000, min: 2000, step: 1000, unit: '€' },
      { id: 'ageYears', label: 'Haltedauer in Jahren', type: 'number', defaultValue: 4, min: 1, max: 15, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const orig = parseFloat(inputs.originalPrice) || 35000;
      const years = parseInt(inputs.ageYears, 10) || 4;

      // Typische Schwacke-Kurve:
      // Jahr 1: -25% (Restwert 75%)
      // Jahr 2: -15% (Restwert 60%)
      // Jahr 3: -10% (Restwert 50%)
      // Jahr 4: -7% (Restwert 43%)
      // Ab Jahr 5: ca. -5% p.a.
      const factors: Record<number, number> = {
        1: 0.75, 2: 0.60, 3: 0.50, 4: 0.43, 5: 0.38, 6: 0.33, 7: 0.29, 8: 0.25, 9: 0.22, 10: 0.19,
      };
      const factor = factors[Math.min(years, 10)] || Math.max(0.10, 0.19 - (years - 10) * 0.02);
      const remainingValue = orig * factor;
      const lossTotal = orig - remainingValue;
      const lossPerMonth = lossTotal / (years * 12);

      return {
        primary: { id: 'remainingValue', label: `Restwert nach ${years} Jahren`, value: remainingValue, formattedValue: formatCurrency(remainingValue), highlight: true },
        secondary: [
          { id: 'lossTotal', label: 'Gesamter Wertverlust', value: lossTotal, formattedValue: formatCurrency(lossTotal) },
          { id: 'lossPerMonth', label: 'Monatlicher Wertverlust', value: lossPerMonth, formattedValue: formatCurrency(lossPerMonth) },
          { id: 'pctLoss', label: 'Wertminderung in Prozent', value: (1 - factor) * 100, formattedValue: formatPercent((1 - factor) * 100, 1) },
        ],
        summaryText: `Nach ${years} Jahren hat das Fahrzeug ca. ${formatPercent((1 - factor) * 100, 1)} seines Wertes verloren. Der geschätzte Restwert beträgt ${formatCurrency(remainingValue)} (Wertverlust: ${formatCurrency(lossPerMonth)}/Monat).`,
      };
    },
    formula: 'Restwert = Anschaffungspreis × Restwertfaktor nach Schwacke-Kurve',
    formulaExplanation: 'Ein Neuwagen verliert im ersten Jahr rund 25 % seines Listenpreises. Nach drei Jahren ist ein Pkw meist nur noch rund 50 % des Neupreises wert.',
    workedExample: {
      title: 'Beispiel: 35.000 € Neuwagen nach 4 Jahren',
      inputValues: [{ label: 'Neupreis', value: '35.000 €' }, { label: 'Alter', value: '4 Jahre' }],
      steps: ['Restwertfaktor nach 4 Jahren ca. 43 %', 'Restwert = 35.000 € × 0,43 = 15.050 €', 'Wertverlust = 19.950 € (ca. 415 €/Monat)'],
      result: '15.050,00 € Restwert (19.950 € Verlust)',
    },
    faqs: [
      { question: 'Welche Autos haben den geringsten Wertverlust?', answer: 'Kompakt-SUVs, beliebte Kleinwagen und etablierte deutsche Premiummarken mit gefragter Sonderausstattung weisen oft die höchste Wertstabilität auf.' },
      { question: 'Wie beeinflussen gefahrene Kilometer den Wertverlust?', answer: 'Hohe Jahreslaufleistungen (über 20.000 km) führen zu zusätzlichen Abschlägen auf den normalen alterungsbedingten Restwert.' },
    ],
    relatedSlugs: ['auto-gesamtkosten-rechner', 'leasingfaktor-rechner', 'autokreditrechner'],
  },

  {
    id: 'bremsweg-rechner',
    slug: 'bremsweg-rechner',
    name: 'Bremsweg-Rechner (Reaktionsweg & Anhalteweg Formel)',
    shortName: 'Bremsweg berechnen',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Bremsweg Rechner – Reaktionsweg, Bremsweg & Anhalteweg berechnen',
    metaDescription: 'Berechnen Sie Reaktionsweg, Bremsweg und Anhalteweg nach den amtlichen Fahrschulformeln für Normalbremsung und Gefahrenbremsung.',
    h1: 'Bremsweg Rechner – Anhalteweg & Reaktionsweg Formel',
    shortDescription: 'Ermittelt den Brems- und Anhalteweg nach den amtlichen TÜV- und Fahrschulformeln.',
    searchKeywords: ['bremsweg rechner', 'anhalteweg formel fahrschule', 'reaktionsweg geschwindigkeit berechnen', 'gefahrenbremsung bremsweg formel'],
    inputs: [
      { id: 'speedKmh', label: 'Fahrgeschwindigkeit in km/h', type: 'number', defaultValue: 100, min: 10, max: 300, step: 10, unit: 'km/h' },
      {
        id: 'brakingType',
        label: 'Bremsart',
        type: 'select',
        defaultValue: 'normal',
        options: [
          { value: 'normal', label: 'Normalbremsung (Betriebsbremsung)' },
          { value: 'emergency', label: 'Gefahrenbremsung (Vollbremsung / ABS)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const v = parseFloat(inputs.speedKmh) || 100;
      const isEmergency = inputs.brakingType === 'emergency';

      // Fahrschulformeln:
      // Reaktionsweg = (Geschwindigkeit / 10) * 3
      // Bremsweg Normal = (Geschwindigkeit / 10) * (Geschwindigkeit / 10)
      // Bremsweg Gefahrenbremsung = Bremsweg Normal / 2
      const reactionDist = (v / 10) * 3;
      const normalBrakeDist = (v / 10) * (v / 10);
      const brakeDist = isEmergency ? normalBrakeDist / 2 : normalBrakeDist;
      const stoppingDist = reactionDist + brakeDist;

      return {
        primary: { id: 'stoppingDist', label: 'Gesamter Anhalteweg', value: stoppingDist, formattedValue: `${formatNumber(stoppingDist, 1)} Meter`, highlight: true },
        secondary: [
          { id: 'reactionDist', label: 'Reaktionsweg (ca. 1 Sekunde Reaktionszeit)', value: reactionDist, formattedValue: `${formatNumber(reactionDist, 1)} m` },
          { id: 'brakeDist', label: isEmergency ? 'Bremsweg (Gefahrenbremsung)' : 'Bremsweg (Normalbremsung)', value: brakeDist, formattedValue: `${formatNumber(brakeDist, 1)} m` },
        ],
        summaryText: `Bei ${v} km/h beträgt Ihr Reaktionsweg ${formatNumber(reactionDist, 1)} m und der Bremsweg ${formatNumber(brakeDist, 1)} m. Das ergibt einen Anhalteweg von ${formatNumber(stoppingDist, 1)} Metern.`,
      };
    },
    formula: 'Anhalteweg = Reaktionsweg [(v/10) × 3] + Bremsweg [(v/10) × (v/10)]',
    formulaExplanation: 'Bei einer Gefahrenbremsung halbiert sich der reine Bremsweg durch maximale Verzögerung.',
    workedExample: {
      title: 'Beispiel: 100 km/h bei normaler Bremsung',
      inputValues: [{ label: 'Geschwindigkeit', value: '100 km/h' }, { label: 'Bremsart', value: 'Normal' }],
      steps: ['Reaktionsweg: (100 / 10) × 3 = 30 Meter', 'Bremsweg: (100 / 10) × (100 / 10) = 100 Meter', 'Anhalteweg = 30 m + 100 m = 130 Meter'],
      result: '130 Meter Anhalteweg',
    },
    faqs: [
      { question: 'Wie wirkt sich Nässe auf den Bremsweg aus?', answer: 'Auf nasser Fahrbahn verlängert sich der Bremsweg um etwa 25 % bis 40 %, bei Glatteis sogar um das Vier- bis Zehnfache.' },
      { question: 'Verdoppelt sich der Bremsweg bei doppelter Geschwindigkeit?', answer: 'Nein! Da die kinetische Energie quadratisch mit der Geschwindigkeit wächst, vervierfacht sich der Bremsweg bei doppelter Geschwindigkeit.' },
    ],
    relatedSlugs: ['fahrzeit-rechner', 'promillerechner-widmark', 'bussgeld-rechner-geschwindigkeit'],
  },

  {
    id: 'bussgeld-rechner-geschwindigkeit',
    slug: 'bussgeld-rechner-geschwindigkeit',
    name: 'Bußgeldrechner Geschwindigkeit (Katalog 2026)',
    shortName: 'Bußgeldrechner Tempo',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Bußgeldrechner Geschwindigkeit 2026 – Punkte, Fahrverbot & Kosten',
    metaDescription: 'Berechnen Sie Bußgeld, Punkte in Flensburg und Fahrverbot bei Geschwindigkeitsüberschreitung innerorts und außerorts nach aktuellem Bußgeldkatalog.',
    h1: 'Bußgeldrechner Geschwindigkeit – Bußgeld, Punkte & Fahrverbot',
    shortDescription: 'Ermittelt Strafen für Geschwindigkeitsüberschreitungen nach aktuellem Bußgeldkatalog.',
    searchKeywords: ['bussgeldrechner geschwindigkeit', 'blitzer bussgeldkatalog 2026', 'punkte flensburg geschwindigkeit tabelle', 'fahrverbot ab wie viel kmh'],
    inputs: [
      { id: 'overSpeedKmh', label: 'Gemessene Geschwindigkeitsüberschreitung nach Toleranzabzug in km/h', type: 'number', defaultValue: 21, min: 1, max: 100, step: 1, unit: 'km/h' },
      {
        id: 'location',
        label: 'Ort der Überschreitung',
        type: 'select',
        defaultValue: 'innerorts',
        options: [
          { value: 'innerorts', label: 'Innerorts (Geschlossene Ortschaft)' },
          { value: 'ausserorts', label: 'Außerorts (Landstraße, Autobahn)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const over = parseInt(inputs.overSpeedKmh, 10) || 21;
      const isInner = inputs.location === 'innerorts';

      let fine = 30;
      let points = 0;
      let drivingBanMonths = 0;

      if (isInner) {
        if (over <= 10) fine = 30;
        else if (over <= 15) fine = 50;
        else if (over <= 20) fine = 70;
        else if (over <= 25) { fine = 115; points = 1; }
        else if (over <= 30) { fine = 180; points = 1; drivingBanMonths = 1; }
        else if (over <= 40) { fine = 260; points = 2; drivingBanMonths = 1; }
        else if (over <= 50) { fine = 400; points = 2; drivingBanMonths = 1; }
        else if (over <= 60) { fine = 560; points = 2; drivingBanMonths = 2; }
        else if (over <= 70) { fine = 700; points = 2; drivingBanMonths = 3; }
        else { fine = 800; points = 2; drivingBanMonths = 3; }
      } else {
        if (over <= 10) fine = 20;
        else if (over <= 15) fine = 40;
        else if (over <= 20) fine = 60;
        else if (over <= 25) { fine = 100; points = 1; }
        else if (over <= 30) { fine = 150; points = 1; }
        else if (over <= 40) { fine = 200; points = 1; drivingBanMonths = 1; }
        else if (over <= 50) { fine = 320; points = 2; drivingBanMonths = 1; }
        else if (over <= 60) { fine = 480; points = 2; drivingBanMonths = 2; }
        else if (over <= 70) { fine = 600; points = 2; drivingBanMonths = 3; }
        else { fine = 700; points = 2; drivingBanMonths = 3; }
      }

      const totalFine = fine + 28.50; // Inkl. 28,50 € Gebühren und Auslagen der Bußgeldstelle
      return {
        primary: { id: 'fine', label: 'Regelbußgeld (inkl. Gebühren)', value: totalFine, formattedValue: formatCurrency(totalFine), highlight: true },
        secondary: [
          { id: 'points', label: 'Punkte in Flensburg (FAER)', value: points, formattedValue: `${points} Punkt${points === 1 ? '' : 'e'}` },
          { id: 'ban', label: 'Fahrverbot', value: drivingBanMonths, formattedValue: drivingBanMonths > 0 ? `${drivingBanMonths} Monat${drivingBanMonths > 1 ? 'e' : ''}` : 'Kein Fahrverbot' },
          { id: 'pureFine', label: 'Reines Bußgeld ohne Gebühren', value: fine, formattedValue: formatCurrency(fine) },
        ],
        summaryText: `Bei ${over} km/h zu schnell ${isInner ? 'innerorts' : 'außerorts'} drohen ${formatCurrency(totalFine)} Gesamtstrafe, ${points} Punkt(e) und ${drivingBanMonths > 0 ? drivingBanMonths + ' Monat(e) Fahrverbot' : 'kein Fahrverbot'}.`,
      };
    },
    formula: 'Einstufung nach bundeseinheitlichem Bußgeldkatalog (BKatV)',
    formulaExplanation: 'Zu jedem Bußgeld ab 60 Euro kommen gesetzlich 25,00 Euro Gebühr plus 3,50 Euro Zustellauslagen der Bußgeldbehörde hinzu.',
    workedExample: {
      title: 'Beispiel: 21 km/h zu schnell innerorts',
      inputValues: [{ label: 'Überschreitung', value: '21 km/h' }, { label: 'Ort', value: 'Innerorts' }],
      steps: ['Bußgeld: 115,00 €', 'Gebühren & Auslagen: 28,50 €', 'Punkte: 1 Punkt in Flensburg'],
      result: '143,50 € Gesamtkosten & 1 Punkt',
    },
    faqs: [
      { question: 'Wie viel Toleranz wird beim Blitzen abgezogen?', answer: 'Bei Geschwindigkeiten bis 100 km/h werden üblicherweise 3 km/h abgezogen, bei über 100 km/h sind es 3 % der gemessenen Geschwindigkeit.' },
      { question: 'Wann verfallen Punkte in Flensburg?', answer: '1 Punkt verfällt nach 2,5 Jahren, 2 Punkte verfallen nach 5 Jahren (ohne Tilgungshemmung durch neue Punkte).' },
    ],
    relatedSlugs: ['promillerechner-widmark', 'bremsweg-rechner', 'fahrzeit-rechner'],
  },

  {
    id: 'promillerechner-widmark',
    slug: 'promillerechner-widmark',
    name: 'Promillerechner (Widmark-Formel & Alkoholabbau)',
    shortName: 'Promillerechner Widmark',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Promillerechner – Alkohol Promille berechnen (Widmark-Formel)',
    metaDescription: 'Berechnen Sie den Blutalkoholspiegel in Promille (‰) nach der wissenschaftlichen Widmark-Formel und ermitteln Sie die exakte Abbauzeit bis 0,0 Promille.',
    h1: 'Promillerechner – Promillewert & Alkoholabbau berechnen',
    shortDescription: 'Ermittelt die Blutalkoholkonzentration nach Getränkemenge, Körpergewicht und Geschlecht.',
    searchKeywords: ['promillerechner widmark formel', 'alkohol promille berechnen rechner', 'wie lange dauert alkoholabbau', '0 5 promille grenze auto'],
    inputs: [
      {
        id: 'gender',
        label: 'Biologisches Geschlecht',
        type: 'select',
        defaultValue: 'male',
        options: [
          { value: 'male', label: 'Männlich (Reduktionsfaktor r = 0,68)' },
          { value: 'female', label: 'Weiblich (Reduktionsfaktor r = 0,55)' },
        ],
      },
      { id: 'bodyWeightKg', label: 'Körpergewicht in kg', type: 'number', defaultValue: 80, min: 40, max: 180, step: 1, unit: 'kg' },
      { id: 'beerMl', label: 'Getrunkene Menge Bier (5 % Vol.) in ml', type: 'number', defaultValue: 1000, min: 0, step: 100, unit: 'ml' },
      { id: 'wineMl', label: 'Getrunkene Menge Wein / Sekt (12 % Vol.) in ml', type: 'number', defaultValue: 200, min: 0, step: 50, unit: 'ml' },
      { id: 'spiritsMl', label: 'Schnaps / Spirituosen (40 % Vol.) in ml', type: 'number', defaultValue: 0, min: 0, step: 20, unit: 'ml' },
      { id: 'hoursSinceStart', label: 'Stunden seit Beginn des Alkoholkonsums', type: 'number', defaultValue: 2, min: 0.5, max: 24, step: 0.5, unit: 'Stunden' },
    ],
    calculate: (inputs) => {
      const isMale = inputs.gender === 'male';
      const weight = parseFloat(inputs.bodyWeightKg) || 80;
      const beer = parseFloat(inputs.beerMl) || 0;
      const wine = parseFloat(inputs.wineMl) || 0;
      const spirits = parseFloat(inputs.spiritsMl) || 0;
      const hours = parseFloat(inputs.hoursSinceStart) || 2;

      // Reinalkohol in Gramm = ml × (Vol% / 100) × 0.8 (Dichte Ethanol)
      const pureAlcoholGrams = (beer * 0.05 * 0.8) + (wine * 0.12 * 0.8) + (spirits * 0.40 * 0.8);
      const r = isMale ? 0.68 : 0.55;
      // Theoretischer Maximalwert
      const maxPromille = pureAlcoholGrams / (weight * r);
      // Abbau im Körper ca. 0,15 ‰ pro Stunde (beginnend ca. 1 Std nach Trinkbeginn)
      const degradedHours = Math.max(0, hours - 0.5);
      const currentPromille = Math.max(0, maxPromille - (degradedHours * 0.15));
      const hoursUntilSober = currentPromille / 0.15;

      return {
        primary: { id: 'currentPromille', label: 'Aktueller Promillewert', value: currentPromille, formattedValue: `${formatNumber(currentPromille, 2)} ‰`, highlight: true },
        secondary: [
          { id: 'hoursUntilSober', label: 'Dauer bis zur vollständigen Nüchternheit', value: hoursUntilSober, formattedValue: `ca. ${formatNumber(hoursUntilSober, 1)} Stunden` },
          { id: 'pureAlcohol', label: 'Aufgenommener Reinalkohol', value: pureAlcoholGrams, formattedValue: `${formatNumber(pureAlcoholGrams, 1)} Gramm` },
          { id: 'maxPromille', label: 'Maximaler Spitzenwert', value: maxPromille, formattedValue: `${formatNumber(maxPromille, 2)} ‰` },
        ],
        summaryText: `Ihr aktueller Blutalkoholspiegel liegt bei ca. ${formatNumber(currentPromille, 2)} ‰. Es dauert noch rund ${formatNumber(hoursUntilSober, 1)} Stunden, bis Sie wieder absolut fahrtüchtig sind (0,0 ‰).`,
      };
    },
    formula: 'Blutalkohol = Reinalkohol in g / (Körpergewicht in kg × Reduktionsfaktor) - Abbau',
    formulaExplanation: 'Die Leber baut durchschnittlich rund 0,1 bis 0,15 Promille pro Stunde ab. Dieser biologische Prozess lässt sich weder durch Kaffee noch durch Schlaf beschleunigen.',
    workedExample: {
      title: 'Beispiel: Mann (80 kg) trinkt 1 Liter Bier (40 g Alkohol)',
      inputValues: [{ label: 'Gewicht', value: '80 kg' }, { label: 'Bier', value: '1.000 ml' }],
      steps: ['Alkohol = 1.000 × 0,05 × 0,8 = 40 Gramm', 'Maximalwert = 40 g / (80 × 0,68) ≈ 0,74 ‰', 'Nach 2 Stunden: 0,74 ‰ - (1,5 h × 0,15 ‰) ≈ 0,51 ‰'],
      result: 'ca. 0,51 ‰ nach 2 Stunden',
    },
    faqs: [
      { question: 'Ab welchem Promillewert droht in Deutschland Fahrverbot?', answer: 'Ab 0,5 Promille begeht man eine Ordnungswidrigkeit (500 € Bußgeld, 2 Punkte, 1 Monat Fahrverbot). Bei Fahrauffälligkeiten oder Unfällen droht schon ab 0,3 Promille eine Straftat!' },
      { question: 'Gilt für Fahranfänger eine Null-Promille-Grenze?', answer: 'Ja, für Fahrer in der Probezeit und unter 21 Jahren gilt nach § 24c StVG ein absolutes Alkoholverbot (0,0 ‰).' },
    ],
    relatedSlugs: ['bussgeld-rechner-geschwindigkeit', 'bremsweg-rechner', 'fahrzeit-rechner'],
  },

  {
    id: 'anhaenger-stuetzlast-rechner',
    slug: 'anhaenger-stuetzlast-rechner',
    name: 'Anhänger Stützlast & Anhängelast-Rechner (StVZO)',
    shortName: 'Stützlast Anhänger',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Anhänger Stützlast Rechner – Gesetzliche Mindeststützlast nach StVZO',
    metaDescription: 'Berechnen Sie die gesetzliche Mindeststützlast (4 % des tatsächlichen Anhängergewichts nach § 44 StVZO) und prüfen Sie die maximale Anhängelast.',
    h1: 'Anhänger Stützlast Rechner – Mindest- und Maximallast ermitteln',
    shortDescription: 'Prüft die vorschriftsmäßige Stützlast und Gewichtsverteilung für PKW-Anhänger und Wohnwagen.',
    searchKeywords: ['anhaenger stuetzlast rechner', 'mindeststuetzlast stvzo 4 prozent', 'anhaengelast pkw rechner', 'stuetzlast wohnwagen berechnen'],
    inputs: [
      { id: 'actualTrailerWeightKg', label: 'Tatsächliches Gesamtgewicht des beladenen Anhängers', type: 'number', defaultValue: 1500, min: 200, max: 3500, step: 50, unit: 'kg' },
      { id: 'maxCarNoseWeightKg', label: 'Maximale zulässige Stützlast des Zugfahrzeugs laut Schein', type: 'number', defaultValue: 75, min: 40, max: 200, step: 5, unit: 'kg' },
      { id: 'maxTrailerNoseWeightKg', label: 'Maximale zulässige Stützlast der Anhängerdeichsel', type: 'number', defaultValue: 100, min: 40, max: 200, step: 5, unit: 'kg' },
    ],
    calculate: (inputs) => {
      const trailerWeight = parseFloat(inputs.actualTrailerWeightKg) || 1500;
      const carMax = parseFloat(inputs.maxCarNoseWeightKg) || 75;
      const trailerMax = parseFloat(inputs.maxTrailerNoseWeightKg) || 100;

      // Gesetzliche Mindeststützlast nach § 44 Abs. 3 StVZO: mind. 4 % des tatsächlichen Anhängergewichts, jedoch nicht mehr als 25 kg vorgeschrieben
      const minRequired = Math.min(25, trailerWeight * 0.04);
      // Maximal zulässige Stützlast ist der kleinere der beiden Höchstwerte
      const maxAllowed = Math.min(carMax, trailerMax);

      return {
        primary: { id: 'maxAllowed', label: 'Maximal zulässige Stützlast der Kombination', value: maxAllowed, formattedValue: `${maxAllowed} kg`, highlight: true },
        secondary: [
          { id: 'minRequired', label: 'Gesetzliche Mindeststützlast (§ 44 StVZO)', value: minRequired, formattedValue: `mind. ${formatNumber(minRequired, 0)} kg` },
          { id: 'recommended', label: 'Fahrsicherheits-Empfehlung', value: maxAllowed, formattedValue: `Ideal: ${maxAllowed - 5} bis ${maxAllowed} kg` },
        ],
        summaryText: `Für Ihr Gespann gilt: Mindestens ${formatNumber(minRequired, 0)} kg und maximal ${maxAllowed} kg Stützlast. Für maximale Fahrstabilität sollte die Stützlast möglichst voll ausgenutzt werden.`,
      };
    },
    formula: 'Mindeststützlast = 4 % des Anhängergewichts (max. 25 kg); Höchstlast = min(Zugfahrzeug, Deichsel)',
    formulaExplanation: 'Eine zu geringe Stützlast führt zum gefährlichen Schlingern und Ausbrechen des Anhängers bei höheren Geschwindigkeiten.',
    workedExample: {
      title: 'Beispiel: 1.500 kg Wohnwagen an Pkw mit 75 kg Stützlast',
      inputValues: [{ label: 'Gewicht', value: '1.500 kg' }, { label: 'Pkw Max', value: '75 kg' }, { label: 'Deichsel Max', value: '100 kg' }],
      steps: ['Mindeststützlast: 4 % = 60 kg (gedeckelt auf 25 kg gesetzlich)', 'Zulässiges Maximum: Min(75 kg, 100 kg) = 75 kg'],
      result: 'Optimalbereich: ca. 70 bis 75 kg',
    },
    faqs: [
      { question: 'Wird die Stützlast dem Zugfahrzeug zugerechnet?', answer: 'Ja, die tatsächliche Stützlast entlastet rechnerisch das Anhängergewicht und zählt zum tatsächlichen Gesamtgewicht des Zugfahrzeugs.' },
      { question: 'Wie wiegt man die Stützlast am besten?', answer: 'Am einfachsten mit einer speziellen Stützlastwaage oder einer herkömmlichen Personenwaage und einem Kantholz unter der Kupplungsklaue.' },
    ],
    relatedSlugs: ['bremsweg-rechner', 'spritkostenrechner', 'auto-gesamtkosten-rechner'],
  },

  {
    id: 'reifen-abrollumfang-rechner',
    slug: 'reifen-abrollumfang-rechner',
    name: 'Reifenrechner (Abrollumfang, Tachoabweichung & Höherlegung)',
    shortName: 'Reifenrechner Abrollumfang',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Reifenrechner – Abrollumfang & Tachoabweichung bei neuen Felgen',
    metaDescription: 'Berechnen Sie Abrollumfang, Durchmesser und die Tachoabweichung beim Wechsel auf neue Reifengrößen und Felgen gemäß ECE-Norm.',
    h1: 'Reifenrechner – Abrollumfang & Tachoabweichung berechnen',
    shortDescription: 'Vergleicht zwei Reifengrößen und prüft die gesetzliche Zulässigkeit der Tachoanzeige.',
    searchKeywords: ['reifenrechner abrollumfang', 'tachoabweichung berechnen neue reifen', 'reifengroesse felgen umrechnen', 'abrollumfang rechner tüv'],
    inputs: [
      { id: 'widthOld', label: 'Bisherige Reifenbreite in mm (z. B. 205)', type: 'number', defaultValue: 205, min: 135, max: 355, step: 10, unit: 'mm' },
      { id: 'aspectOld', label: 'Bisheriges Reifenprofil / Querschnitt in % (z. B. 55)', type: 'number', defaultValue: 55, min: 25, max: 85, step: 5, unit: '%' },
      { id: 'rimOld', label: 'Bisherige Felgengröße in Zoll (z. B. 16)', type: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'Zoll' },
      { id: 'widthNew', label: 'Neue Reifenbreite in mm (z. B. 225)', type: 'number', defaultValue: 225, min: 135, max: 355, step: 10, unit: 'mm' },
      { id: 'aspectNew', label: 'Neues Reifenprofil in % (z. B. 45)', type: 'number', defaultValue: 45, min: 25, max: 85, step: 5, unit: '%' },
      { id: 'rimNew', label: 'Neue Felgengröße in Zoll (z. B. 17)', type: 'number', defaultValue: 17, min: 12, max: 24, step: 1, unit: 'Zoll' },
    ],
    calculate: (inputs) => {
      const w1 = parseFloat(inputs.widthOld) || 205;
      const a1 = parseFloat(inputs.aspectOld) || 55;
      const r1 = parseFloat(inputs.rimOld) || 16;
      const w2 = parseFloat(inputs.widthNew) || 225;
      const a2 = parseFloat(inputs.aspectNew) || 45;
      const r2 = parseFloat(inputs.rimNew) || 17;

      // Reifendurchmesser = (2 × Flankenhöhe) + Felgendurchmesser
      const diam1Mm = (2 * (w1 * (a1 / 100))) + (r1 * 25.4);
      const diam2Mm = (2 * (w2 * (a2 / 100))) + (r2 * 25.4);
      const circ1Mm = diam1Mm * Math.PI;
      const circ2Mm = diam2Mm * Math.PI;

      const diffCircPct = ((circ2Mm - circ1Mm) / circ1Mm) * 100;
      // Bei Tacho 100 km/h: Neuer Tacho zeigt: 100 / (1 + diffCircPct/100)
      const speedShownAt100 = 100 / (1 + (diffCircPct / 100));
      const tachoDiff = speedShownAt100 - 100;

      let permissible = true;
      let reason = 'Gesetzlich im Rahmen (Tacho geht vor oder max. +10 % + 4 km/h)';
      if (tachoDiff < 0) {
        permissible = false;
        reason = 'Unzulässig! Tacho darf nach § 57 StVZO niemals zu wenig anzeigen.';
      }

      return {
        primary: { id: 'diffCircPct', label: 'Differenz des Abrollumfangs', value: diffCircPct, formattedValue: formatPercent(diffCircPct, 1), highlight: true },
        secondary: [
          { id: 'speedShown', label: 'Tachoanzeige bei realen 100 km/h', value: speedShownAt100, formattedValue: `${formatNumber(speedShownAt100, 1)} km/h` },
          { id: 'circNew', label: 'Neuer Abrollumfang', value: circ2Mm, formattedValue: `${formatNumber(circ2Mm, 0)} mm` },
          { id: 'status', label: 'TÜV-Zulässigkeit', value: 0, formattedValue: permissible ? 'Zulässig' : 'Tachoangleichung erforderlich!' },
        ],
        summaryText: `Der Abrollumfang ändert sich um ${formatPercent(diffCircPct, 1)}. Bei real 100 km/h zeigt Ihr Tacho ${formatNumber(speedShownAt100, 1)} km/h an (${reason}).`,
      };
    },
    formula: 'Abrollumfang = [(2 × Flanke) + (Felge in Zoll × 25,4 mm)] × π',
    formulaExplanation: 'Nach § 57 StVZO und ECE R39 darf der Tacho niemals nachgehen (zu wenig anzeigen) und maximal um 10 % + 4 km/h vorgehen.',
    workedExample: {
      title: 'Beispiel: 205/55 R16 auf 225/45 R17',
      inputValues: [{ label: 'Alt', value: '205/55 R16' }, { label: 'Neu', value: '225/45 R17' }],
      steps: ['Durchmesser alt: 631,9 mm', 'Durchmesser neu: 634,3 mm', 'Umfangsdifferenz: nur +0,4 %', 'Tachoanzeige: 99,6 km/h bei echten 100 km/h'],
      result: '+0,4 % Abweichung (unkritisch)',
    },
    faqs: [
      { question: 'Wann ist eine Tachoangleichung nötig?', answer: 'Wenn der Abrollumfang um mehr als 1 % nach oben oder mehr als 4 % nach unten vom kleinsten zulässigen Serienreifen abweicht.' },
      { question: 'Was kostet eine Tachoüberprüfung?', answer: 'Eine Tachogenauigkeitsprüfung beim ADAC oder Bosch-Dienst kostet in der Regel zwischen 30 und 60 Euro.' },
    ],
    relatedSlugs: ['bremsweg-rechner', 'spritkostenrechner', 'auto-gesamtkosten-rechner'],
  },

  {
    id: 'thg-quote-rechner',
    slug: 'thg-quote-rechner',
    name: 'THG-Quote-Rechner für Elektroautos (Prämienvergleich)',
    shortName: 'THG-Quote E-Auto',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'THG-Quote Rechner – Jährliche THG-Prämie für Elektroautos vergleichen',
    metaDescription: 'Ermitteln Sie Ihre jährliche THG-Quote (Treibhausgasminderungsquote) für Ihr Elektrofahrzeug: Feste vs. risikobasierte variable Auszahlung.',
    h1: 'THG-Quote Rechner – Jährliche Barprämie für E-Autos berechnen',
    shortDescription: 'Vergleicht Auszahlungsmodelle der THG-Quote für Elektrofahrzeughalter.',
    searchKeywords: ['thg quote rechner', 'thg praemie elektroauto 2026', 'treibhausgasquote geld bekommen', 'e auto praemie jaehrlich'],
    inputs: [
      {
        id: 'payoutModel',
        label: 'Auszahlungsmodell des Anbieters',
        type: 'select',
        defaultValue: 'guaranteed',
        options: [
          { value: 'guaranteed', label: 'Garantierte Festprämie (sofortige Auszahlung, ca. 90 - 110 €)' },
          { value: 'variable', label: 'Variable Börsenprämie mit Risikoabzug (ca. 110 - 140 €)' },
        ],
      },
      { id: 'holdingYears', label: 'Betrachtungszeitraum in Jahren', type: 'number', defaultValue: 3, min: 1, max: 8, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const isGuaranteed = inputs.payoutModel === 'guaranteed';
      const years = parseInt(inputs.holdingYears, 10) || 3;
      const yearlyAmount = isGuaranteed ? 95 : 125;
      const totalAmount = yearlyAmount * years;

      return {
        primary: { id: 'yearlyAmount', label: 'Jährliche THG-Prämie', value: yearlyAmount, formattedValue: formatCurrency(yearlyAmount), highlight: true },
        secondary: [
          { id: 'totalAmount', label: `Gesamtertrag über ${years} Jahre`, value: totalAmount, formattedValue: formatCurrency(totalAmount) },
          { id: 'monthlyEquivalent', label: 'Rechnerischer Monatsbeitrag', value: yearlyAmount / 12, formattedValue: formatCurrency(yearlyAmount / 12) },
        ],
        summaryText: `Für Ihr E-Auto erhalten Sie jährlich ca. ${formatCurrency(yearlyAmount)} THG-Prämie (Summe über ${years} Jahre: ${formatCurrency(totalAmount)}).`,
      };
    },
    formula: 'Ertrag = Jährliche THG-Quote × Haltejahre',
    formulaExplanation: 'Nach § 37a BImSchG müssen Mineralölkonzerne ihre CO2-Emissionen mindern oder Strafen zahlen. Halter reiner E-Autos können ihr eingespartes CO2 über THG-Vermittler verkaufen.',
    workedExample: {
      title: 'Beispiel: Garantierte Festprämie über 3 Jahre Haltedauer',
      inputValues: [{ label: 'Modell', value: 'Festprämie (95 €)' }, { label: 'Jahre', value: '3 Jahre' }],
      steps: ['Jährlich = 95,00 €', 'Summe = 3 × 95,00 € = 285,00 € steuerfrei'],
      result: '285,00 € Gesamterlös',
    },
    faqs: [
      { question: 'Müssen Privatpersonen die THG-Quote versteuern?', answer: 'Nein, das Bundesfinanzministerium hat klargestellt, dass Erlöse aus der THG-Quote bei rein privaten E-Fahrzeugen einkommensteuerfrei sind.' },
      { question: 'Welche Fahrzeuge sind berechtigt?', answer: 'Alle reinen Batterie-Elektrofahrzeuge (BEV) mit Fahrzeugschein (Zulassungsbescheinigung Teil I), inklusive E-Roller mit freiwilliger Zulassung.' },
    ],
    relatedSlugs: ['elektroauto-ladekosten-rechner', 'e-auto-ladekosten-zuhause-rechner', 'kfz-steuer-rechner'],
  },

  {
    id: 'dienstfahrrad-jobrad-rechner',
    slug: 'dienstfahrrad-jobrad-rechner',
    name: 'Dienstfahrrad & JobRad-Rechner (0,25 % Gehaltsumwandlung)',
    shortName: 'JobRad-Rechner',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Dienstfahrrad Rechner – JobRad Ersparnis & 0,25 % Besteuerung',
    metaDescription: 'Berechnen Sie Ihre Ersparnis beim Dienstrad-Leasing (JobRad, Bikeleasing) per Gehaltsumwandlung: Bis zu 40 % Ersparnis gegenüber dem Privatkauf.',
    h1: 'Dienstfahrrad Rechner – JobRad & E-Bike Leasing berechnen',
    shortDescription: 'Kalkuliert die Netto-Kosten eines Dienst-E-Bikes nach 0,25 % Versteuerung und Gehaltsumwandlung.',
    searchKeywords: ['jobrad rechner ersparnis', 'dienstfahrrad gehaltsumwandlung rechner', '0 25 prozent regelung e bike', 'bikeleasing netto abzug'],
    inputs: [
      { id: 'bikePriceGross', label: 'Fahrrad- / E-Bike-Kaufpreis inkl. Schloss & Zubehör (UVP)', type: 'number', defaultValue: 3500, min: 750, max: 15000, step: 100, unit: '€' },
      { id: 'grossSalary', label: 'Ihr monatliches Bruttogehalt', type: 'number', defaultValue: 3800, min: 1000, step: 100, unit: '€' },
      { id: 'taxClass', label: 'Steuerklasse', type: 'select', defaultValue: '1', options: [
        { value: '1', label: 'Steuerklasse 1 (Ledig / keine Kinder)' },
        { value: '3', label: 'Steuerklasse 3 (Verheiratet Alleinverdiener)' },
        { value: '4', label: 'Steuerklasse 4 (Verheiratet)' },
      ]},
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.bikePriceGross) || 3500;
      // Monatliche Leasingrate ca. 2,9 % des Kaufpreises (36 Monate)
      const leasingRate = price * 0.029;
      // Geldwerter Vorteil: 0,25 % auf gerundete volle 100 € des UVP
      const roundedPrice = Math.floor(price / 100) * 100;
      const benefit = roundedPrice * 0.0025;
      // Durch Steuer- und SV-Ersparnis sinkt die Netto-Belastung auf ca. 55 % bis 60 % der Leasingrate
      const actualNetDeduction = (leasingRate * 0.58) + (benefit * 0.40);
      const totalPaid36Months = actualNetDeduction * 36;
      // Typischer Übernahmepreis nach 36 Monaten ca. 17-18 %
      const takeoverPrice = price * 0.18;
      const totalCost = totalPaid36Months + takeoverPrice;
      const savingsVsDirectPurchase = price - totalCost;

      return {
        primary: { id: 'actualNetDeduction', label: 'Tatsächliche monatliche Netto-Belastung', value: actualNetDeduction, formattedValue: formatCurrency(actualNetDeduction), highlight: true },
        secondary: [
          { id: 'savingsVsDirectPurchase', label: 'Gesamtersparnis gegenüber Direktkauf', value: savingsVsDirectPurchase, formattedValue: formatCurrency(savingsVsDirectPurchase) },
          { id: 'pctSaved', label: 'Ersparnis in Prozent', value: (savingsVsDirectPurchase / price) * 100, formattedValue: formatPercent((savingsVsDirectPurchase / price) * 100, 1) },
          { id: 'takeoverPrice', label: 'Voraussichtlicher Übernahmepreis nach 36 Monaten', value: takeoverPrice, formattedValue: formatCurrency(takeoverPrice) },
        ],
        summaryText: `Statt ${formatCurrency(price)} bar zahlen Sie über Gehaltsumwandlung effektiv nur ca. ${formatCurrency(actualNetDeduction)} netto pro Monat. Sie sparen insgesamt ca. ${formatCurrency(savingsVsDirectPurchase)} (${formatPercent((savingsVsDirectPurchase / price) * 100, 1)}).`,
      };
    },
    formula: 'Ersparnis = UVP - (36 × Netto-Leasingabzug + Übernahmepreis)',
    formulaExplanation: 'Seit 2020 muss für die private Nutzung eines Dienstrads nur noch 0,25 % des geviertelten Bruttolistenpreises als geldwerter Vorteil versteuert werden (§ 6 Abs. 1 Nr. 4 EStG).',
    workedExample: {
      title: 'Beispiel: 3.500 € E-Bike über 36 Monate bei 3.800 € Gehalt',
      inputValues: [{ label: 'E-Bike Preis', value: '3.500 €' }, { label: 'Gehalt', value: '3.800 €' }],
      steps: ['Leasingrate brutto ≈ 101,50 €', 'Tatsächlicher Nettoabzug ≈ 62,40 €/Monat', 'Kauf nach 36 Monaten ≈ 630 €', 'Gesamtkosten ≈ 2.876 € statt 3.500 €'],
      result: 'ca. 624 € Ersparnis gegenüber Direktkauf',
    },
    faqs: [
      { question: 'Darf das Dienstrad auch privat genutzt werden?', answer: 'Ja, das Dienstrad darf ohne Einschränkung im Alltag, Urlaub und in der Freizeit privat genutzt werden.' },
      { question: 'Was passiert bei Kündigung oder Arbeitgeberwechsel?', answer: 'Der Leasingvertrag ist an den Arbeitsvertrag gekoppelt. Scheidet der Mitarbeiter vor Ablauf von 36 Monaten aus, kann das Rad oft übernommen oder an den Nachfolger weitergegeben werden.' },
    ],
    relatedSlugs: ['dienstwagen-1-prozent-rechner', 'teilzeit-gehaltsrechner', 'pendlerpauschale-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 6 Abs. 1 Nr. 4 Satz 6 EStG / Erlass der obersten Finanzbehörden)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'hybrid-auto-kosten-rechner',
    slug: 'hybrid-auto-kosten-rechner',
    name: 'Plug-in-Hybrid-Rechner (Benzin vs. Strom & 0,5 % Regel)',
    shortName: 'Hybrid Auto Kosten',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Plug-in-Hybrid Rechner – Verbrauch Strom vs. Benzin & Ersparnis',
    metaDescription: 'Berechnen Sie die realen Verbrauchskosten eines Plug-in-Hybriden (PHEV) nach elektrischem Fahranteil im Vergleich zu reinem Benzinbetrieb.',
    h1: 'Plug-in-Hybrid Rechner – Fahrkosten Strom vs. Benzin ermitteln',
    shortDescription: 'Vergleicht die gemischten Energiekosten von Plug-in-Hybriden nach Ladehäufigkeit.',
    searchKeywords: ['hybrid auto kosten rechner', 'plug in hybrid verbrauch strom benzin', 'lohnt sich hybridauto rechner', 'hybrid fahrkosten 100 km'],
    inputs: [
      { id: 'electricSharePct', label: 'Elektrischer Fahranteil (z. B. 60 % elektrisch, 40 % Benzin)', type: 'number', defaultValue: 60, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'electricKwh100Km', label: 'Stromverbrauch im Elektro-Modus in kWh/100 km', type: 'number', defaultValue: 20, min: 12, max: 35, step: 1, unit: 'kWh/100km' },
      { id: 'fuelLiters100Km', label: 'Benzinverbrauch bei leerem Akku in l/100 km', type: 'number', defaultValue: 7.5, min: 4, max: 15, step: 0.5, unit: 'l/100km' },
      { id: 'powerPriceCent', label: 'Strompreis in Cent pro kWh', type: 'number', defaultValue: 34, min: 20, max: 60, step: 1, unit: 'ct/kWh' },
      { id: 'petrolPriceLiter', label: 'Benzinpreis in Euro pro Liter', type: 'number', defaultValue: 1.78, min: 1.2, max: 2.5, step: 0.05, unit: '€/l' },
      { id: 'yearlyMileageKm', label: 'Jährliche Gesamtfahrleistung in km', type: 'number', defaultValue: 15000, min: 2000, step: 1000, unit: 'km' },
    ],
    calculate: (inputs) => {
      const elPct = (parseFloat(inputs.electricSharePct) || 60) / 100;
      const elKwh = parseFloat(inputs.electricKwh100Km) || 20;
      const gasLiters = parseFloat(inputs.fuelLiters100Km) || 7.5;
      const powerCent = parseFloat(inputs.powerPriceCent) || 34;
      const petrolEuro = parseFloat(inputs.petrolPriceLiter) || 1.78;
      const km = parseFloat(inputs.yearlyMileageKm) || 15000;

      const costEl100 = elKwh * (powerCent / 100);
      const costGas100 = gasLiters * petrolEuro;
      const mixedCost100 = (costEl100 * elPct) + (costGas100 * (1 - elPct));
      const totalYearlyCost = (km / 100) * mixedCost100;
      const pureGasYearly = (km / 100) * costGas100;
      const yearlySaving = pureGasYearly - totalYearlyCost;

      return {
        primary: { id: 'mixedCost100', label: 'Gemischte Kosten auf 100 km', value: mixedCost100, formattedValue: formatCurrency(mixedCost100), highlight: true },
        secondary: [
          { id: 'totalYearlyCost', label: 'Gesamte Energiekosten pro Jahr', value: totalYearlyCost, formattedValue: formatCurrency(totalYearlyCost) },
          { id: 'yearlySaving', label: 'Ersparnis ggü. reinem Benzinbetrieb', value: yearlySaving, formattedValue: formatCurrency(yearlySaving) },
          { id: 'costEl100', label: 'Reine Stromkosten auf 100 km (E-Modus)', value: costEl100, formattedValue: formatCurrency(costEl100) },
          { id: 'costGas100', label: 'Reine Benzinkosten auf 100 km (Verbrenner-Modus)', value: costGas100, formattedValue: formatCurrency(costGas100) },
        ],
        summaryText: `Bei ${formatPercent(elPct * 100, 0)} Elektroanteil zahlen Sie im Schnitt ${formatCurrency(mixedCost100)} auf 100 km. Das spart jährlich ca. ${formatCurrency(yearlySaving)} gegenüber reinem Benzinbetrieb.`,
      };
    },
    formula: 'Mischkosten/100km = (Stromkosten/100km × E-Quote) + (Benzinkosten/100km × Verbrennerquote)',
    formulaExplanation: 'Ein Plug-in-Hybrid spart nur dann spürbar Geld und CO2, wenn er regelmäßig geladen und für Alltagsstrecken im rein elektrischen Modus bewegt wird.',
    workedExample: {
      title: 'Beispiel: 60 % E-Anteil bei 20 kWh/100 km & 7,5 l Benzin/100 km',
      inputValues: [{ label: 'E-Anteil', value: '60 %' }, { label: 'Strom', value: '34 ct/kWh' }, { label: 'Benzin', value: '1,78 €/l' }],
      steps: ['100 km Elektro = 20 × 0,34 € = 6,80 €', '100 km Benzin = 7,5 × 1,78 € = 13,35 €', 'Mischpreis = (6,80 € × 0,6) + (13,35 € × 0,4) = 9,42 €/100 km'],
      result: '9,42 € auf 100 km',
    },
    faqs: [
      { question: 'Gilt für Hybride weiterhin die 0,5 %-Dienstwagensteuer?', answer: 'Ja, wenn das Fahrzeug mindestens 80 km elektrische Mindestreichweite nach WLTP oder max. 50 g/km CO2-Ausstoß aufweist.' },
      { question: 'Lohnt sich ein Plug-in-Hybrid ohne eigene Lademöglichkeit?', answer: 'In der Regel nein, da das Laden an öffentlichen Ladesäulen teurer ist und das Mitschleppen der schweren Batterie bei leerem Akku den Benzinverbrauch erhöht.' },
    ],
    relatedSlugs: ['dienstwagen-1-prozent-rechner', 'spritkostenrechner', 'elektroauto-ladekosten-rechner'],
  },

  {
    id: 'fahrgemeinschaft-sprit-rechner',
    slug: 'fahrgemeinschaft-sprit-rechner',
    name: 'Fahrgemeinschafts-Rechner (Kostenaufteilung pro Mitfahrer)',
    shortName: 'Fahrgemeinschafts-Rechner',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Fahrgemeinschaft Rechner – Sprit- und Fahrtkosten fair teilen',
    metaDescription: 'Berechnen Sie die gerechte Kostenaufteilung für Pendler-Fahrgemeinschaften: Spritkosten und Abnutzungspauschale auf alle Mitfahrer umlegen.',
    h1: 'Fahrgemeinschaft Rechner – Sprit- & Pendelkosten pro Mitfahrer',
    shortDescription: 'Teilt Kraftstoffkosten und Fahrzeugabnutzung fair unter Fahrern und Mitfahrern auf.',
    searchKeywords: ['fahrgemeinschaft rechner', 'spritkosten teilen pendeln rechner', 'mitfahrgelegenheit kosten pro person berechnen', 'pendler fahrgemeinschaft geld'],
    inputs: [
      { id: 'distanceOneWayKm', label: 'Einfache Fahrtstrecke zur Arbeit in km', type: 'number', defaultValue: 35, min: 2, max: 200, step: 1, unit: 'km' },
      { id: 'workDaysPerMonth', label: 'Arbeitstage / Fahrttage pro Monat', type: 'number', defaultValue: 19, min: 1, max: 31, step: 1, unit: 'Tage' },
      { id: 'carConsumptionPer100Km', label: 'Verbrauch in Litern pro 100 km', type: 'number', defaultValue: 6.8, min: 3, max: 18, step: 0.1, unit: 'l/100km' },
      { id: 'fuelPricePerLiter', label: 'Kraftstoffpreis in Euro pro Liter', type: 'number', defaultValue: 1.80, min: 1.0, max: 2.5, step: 0.05, unit: '€/l' },
      { id: 'passengersCount', label: 'Gesamtzahl Insassen (Fahrer + Mitfahrer)', type: 'number', defaultValue: 3, min: 2, max: 8, step: 1, unit: 'Personen' },
      { id: 'wearSurchargePerKm', label: 'Verschleiß- & Abnutzungspauschale in Cent/km (üblich 5 - 10 ct/km)', type: 'number', defaultValue: 6, min: 0, max: 25, step: 1, unit: 'ct/km' },
    ],
    calculate: (inputs) => {
      const dist = parseFloat(inputs.distanceOneWayKm) || 35;
      const days = parseInt(inputs.workDaysPerMonth, 10) || 19;
      const consumption = parseFloat(inputs.carConsumptionPer100Km) || 6.8;
      const price = parseFloat(inputs.fuelPricePerLiter) || 1.80;
      const people = parseInt(inputs.passengersCount, 10) || 3;
      const wearCent = parseFloat(inputs.wearSurchargePerKm) || 6;

      const dailyKm = dist * 2;
      const monthlyKm = dailyKm * days;
      const fuelCostPerKm = (consumption / 100) * price;
      const totalCostPerKm = fuelCostPerKm + (wearCent / 100);
      const totalMonthlyCost = monthlyKm * totalCostPerKm;
      const costPerPersonMonth = totalMonthlyCost / people;
      const savingVsAlone = totalMonthlyCost - costPerPersonMonth;

      return {
        primary: { id: 'costPerPersonMonth', label: 'Kostenanteil pro Mitfahrer / Monat', value: costPerPersonMonth, formattedValue: formatCurrency(costPerPersonMonth), highlight: true },
        secondary: [
          { id: 'savingVsAlone', label: 'Ersparnis für jeden Mitfahrer pro Monat', value: savingVsAlone, formattedValue: formatCurrency(savingVsAlone) },
          { id: 'totalMonthlyCost', label: 'Gesamte Fahrtkosten pro Monat', value: totalMonthlyCost, formattedValue: formatCurrency(totalMonthlyCost) },
          { id: 'costPerSingleRide', label: 'Kosten pro Mitfahrer je Einzelfahrt', value: costPerPersonMonth / (days * 2), formattedValue: formatCurrency(costPerPersonMonth / (days * 2)) },
        ],
        summaryText: `Bei ${people} Personen zahlt jeder Mitfahrer ca. ${formatCurrency(costPerPersonMonth)} im Monat (${formatCurrency(costPerPersonMonth / (days * 2))} pro Einzelfahrt). Jeder spart ${formatCurrency(savingVsAlone)} monatlich!`,
      };
    },
    formula: 'Kosten je Mitfahrer = [(Monatskilometer × Kosten pro km) / Gesamtpersonen]',
    formulaExplanation: 'Neben dem reinen Sprit können faire Abnutzungs- und Inspektionspauschalen für das Auto des Fahrers mit eingerechnet werden.',
    workedExample: {
      title: 'Beispiel: 35 km Arbeitsweg, 19 Tage, 3 Personen bei 1,80 € Sprit',
      inputValues: [{ label: 'Strecke', value: '35 km (70 km/Tag)' }, { label: 'Personen', value: '3' }],
      steps: ['Monatskilometer: 19 × 70 km = 1.330 km', 'Sprit: 1.330 × 0,122 € = 162,79 € + Verschleiß = 242,59 €', 'Pro Person: 242,59 € / 3 = 80,86 €'],
      result: '80,86 € pro Person im Monat',
    },
    faqs: [
      { question: 'Dürfen alle Teilnehmer der Fahrgemeinschaft die Pendlerpauschale ansetzen?', answer: 'Ja! Nach § 9 Abs. 1 Nr. 4 EStG kann jeder Teilnehmer der Fahrgemeinschaft (auch der Mitfahrer) die volle Entfernungspauschale von 30 bzw. 38 Cent/km steuerlich absetzen (bis max. 4.500 €/Jahr für Mitfahrer).' },
      { question: 'Müssen Mitfahrer-Erlöse versteuert werden?', answer: 'Solange reine Selbstkosten geteilt werden und kein gewerblicher Gewinn erzielt wird, ist die Kostenbeteiligung steuerfrei.' },
    ],
    relatedSlugs: ['pendlerpauschale-rechner', 'spritkostenrechner', 'fahrtkostenrechner'],
  },

  {
    id: 'autobahn-maut-rechner-vignette',
    slug: 'autobahn-maut-rechner-vignette',
    name: 'Mautrechner Österreich & Schweiz (Vignette & Streckenmaut)',
    shortName: 'Mautrechner Alpen',
    category: 'auto-verkehr',
    subcategory: 'Fahrt & Navigation',
    metaTitle: 'Mautrechner Österreich, Schweiz & Italien – Vignettenkosten & Maut 2026',
    metaDescription: 'Berechnen Sie die anfallenden Maut- und Vignettenkosten für Ihre Fahrt nach Österreich (1-Tages-, 10-Tages-Vignette, Brenner), in die Schweiz oder nach Italien.',
    h1: 'Mautrechner – Vignetten & Mautgebühren in Europa berechnen',
    shortDescription: 'Kalkuliert die Gebühren für Autobahn-Vignetten und Sondermauten auf beliebten Reiserouten.',
    searchKeywords: ['mautrechner oesterreich', 'vignette schweiz kosten 2026', 'brennermaut kosten pkw', '10 tages vignette oesterreich preis'],
    inputs: [
      {
        id: 'countryRoute',
        label: 'Reiseziel / Hauptroute',
        type: 'select',
        defaultValue: 'at_10days',
        options: [
          { value: 'at_1day', label: 'Österreich: 1-Tages-Vignette (ca. 8,60 €)' },
          { value: 'at_10days', label: 'Österreich: 10-Tages-Vignette (ca. 11,50 €)' },
          { value: 'at_brenner', label: 'Österreich: 10-Tages-Vignette + Brennermaut hin & zurück (ca. 34,50 €)' },
          { value: 'ch_year', label: 'Schweiz: Jahresvignette (40 CHF ≈ ca. 42,00 €)' },
          { value: 'it_roundtrip', label: 'Italien: Brenner bis Gardasee hin & zurück (ca. 48,00 € Streckenmaut)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const route = inputs.countryRoute || 'at_10days';
      let cost = 11.50;
      let label = 'Österreich 10-Tages-Vignette';
      let validity = '10 Kalendertage';

      if (route === 'at_1day') { cost = 8.60; label = 'Österreich 1-Tages-Vignette'; validity = '1 Tag (ideal für Transit)'; }
      if (route === 'at_brenner') { cost = 34.50; label = 'Österreich 10-Tages-Vignette + Brenner (A13) hin & zurück'; validity = '10 Tage Vignette + 2 Einzelfahrten Brenner'; }
      if (route === 'ch_year') { cost = 42.00; label = 'Schweiz Jahresvignette (E-Vignette)'; validity = 'Bis zu 14 Monate (1. Dez Vorjahr bis 31. Jan Folgejahr)'; }
      if (route === 'it_roundtrip') { cost = 48.00; label = 'Italien Streckenmaut Brenner - Rovereto/Affi (Hin & Zurück)'; validity = 'Entfernungsabhängige Maut'; }

      return {
        primary: { id: 'cost', label: 'Gesamte Maut- & Vignettenkosten', value: cost, formattedValue: formatCurrency(cost), highlight: true },
        secondary: [
          { id: 'validity', label: 'Gültigkeitsdauer', value: 0, formattedValue: validity },
          { id: 'label', label: 'Mautart', value: 0, formattedValue: label },
        ],
        summaryText: `Für die gewählte Route (${label}) fallen Gebühren von ca. ${formatCurrency(cost)} an (${validity}).`,
      };
    },
    formula: 'Maut = Vignettengebühr + Sonderstreckenmaut (Brenner, Tauern, etc.)',
    formulaExplanation: 'In Österreich und der Schweiz können Vignetten digital als E-Vignette an das Autokennzeichen gekoppelt werden.',
    workedExample: {
      title: 'Beispiel: Urlaub in Österreich (10 Tage)',
      inputValues: [{ label: 'Route', value: '10-Tages-Vignette' }],
      steps: ['Digitale 10-Tages-Vignette der ASFINAG = 11,50 €'],
      result: '11,50 € Vignettenkosten',
    },
    faqs: [
      { question: 'Gilt bei Online-Kauf in Österreich eine 18-Tage-Konsumentenschutzfrist?', answer: 'Nur bei 2-Monats- und Jahresvignetten. Die 1-Tages- und 10-Tages-Vignetten sind bei Online-Kauf sofort ab dem ersten Tag gültig!' },
      { question: 'Braucht man in der Schweiz auch für Anhänger eine Vignette?', answer: 'Ja! In der Schweiz benötigt jeder Anhänger (Wohnwagen, Gepäckanhänger) eine eigene, separate 40-Franken-Vignette.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'fahrtkostenrechner', 'fahrzeit-rechner'],
  },

  {
    id: 'motorrad-unterhaltskosten-rechner',
    slug: 'motorrad-unterhaltskosten-rechner',
    name: 'Motorrad-Unterhaltskosten-Rechner (Saison vs. Ganzjahr)',
    shortName: 'Motorrad Unterhalt',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'Motorrad Unterhaltskosten Rechner – Saisonkennzeichen & Betriebskosten',
    metaDescription: 'Berechnen Sie die jährlichen Unterhaltskosten für Ihr Motorrad: Versicherung, KFZ-Steuer (Hubraum), Benzin, Reifen und Inspektion bei Saisonkennzeichen.',
    h1: 'Motorrad Unterhaltskosten Rechner – Saison- & Jahreskosten berechnen',
    shortDescription: 'Kalkuliert die laufenden Fix- und Betriebskosten für Motorräder.',
    searchKeywords: ['motorrad unterhaltskosten rechner', 'was kostet ein motorrad im monat unterhalt', 'saisonkennzeichen motorrad ersparnis', 'motorrad steuer versicherung kosten'],
    inputs: [
      { id: 'displacementCc', label: 'Hubraum in cm³ (z. B. 650 cm³)', type: 'number', defaultValue: 650, min: 50, max: 2500, step: 50, unit: 'cm³' },
      { id: 'seasonMonths', label: 'Zulassungsdauer in Monaten (z. B. 8 Monate März - Okt)', type: 'number', defaultValue: 8, min: 2, max: 12, step: 1, unit: 'Monate' },
      { id: 'yearlyMileageKm', label: 'Gefahrene Kilometer in der Saison', type: 'number', defaultValue: 5000, min: 500, step: 500, unit: 'km' },
      { id: 'insuranceYearlyFull', label: 'Haftpflicht + Teilkasko für ein ganzes Jahr', type: 'number', defaultValue: 240, min: 50, step: 20, unit: '€/Jahr' },
      { id: 'fuelConsumptionL100', label: 'Benzinverbrauch in l/100 km', type: 'number', defaultValue: 4.8, min: 2, max: 10, step: 0.2, unit: 'l/100km' },
      { id: 'maintenanceYearly', label: 'Wartung, Reifen & TÜV pro Saison', type: 'number', defaultValue: 350, min: 50, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const cc = parseInt(inputs.displacementCc, 10) || 650;
      const months = parseInt(inputs.seasonMonths, 10) || 8;
      const km = parseFloat(inputs.yearlyMileageKm) || 5000;
      const insFull = parseFloat(inputs.insuranceYearlyFull) || 240;
      const l100 = parseFloat(inputs.fuelConsumptionL100) || 4.8;
      const maint = parseFloat(inputs.maintenanceYearly) || 350;

      // Motorradsteuer: 1,84 € je angefangene 25 cm³ Hubraum p.a.
      const fullTax = Math.ceil(cc / 25) * 1.84;
      const seasonTax = fullTax * (months / 12);
      const seasonInsurance = insFull * (months / 12);
      const fuelCost = (km / 100) * l100 * 1.80; // ca. 1,80 €/l Super
      const totalCostSeason = seasonTax + seasonInsurance + fuelCost + maint;
      const costPerMonthSeason = totalCostSeason / months;

      return {
        primary: { id: 'totalCostSeason', label: 'Gesamtkosten pro Motorrad-Saison', value: totalCostSeason, formattedValue: formatCurrency(totalCostSeason), highlight: true },
        secondary: [
          { id: 'costPerMonthSeason', label: 'Kosten pro aktivem Fahrmonat', value: costPerMonthSeason, formattedValue: formatCurrency(costPerMonthSeason) },
          { id: 'seasonTax', label: 'Anteilige KFZ-Steuer (Saison)', value: seasonTax, formattedValue: formatCurrency(seasonTax) },
          { id: 'seasonInsurance', label: 'Anteilige Versicherung (Saison)', value: seasonInsurance, formattedValue: formatCurrency(seasonInsurance) },
          { id: 'fuelCost', label: 'Spritkosten pro Saison', value: fuelCost, formattedValue: formatCurrency(fuelCost) },
        ],
        summaryText: `Für ${months} Monate Saison mit ${formatNumber(km, 0)} km Fahrleistung zahlen Sie insgesamt ca. ${formatCurrency(totalCostSeason)} (${formatCurrency(costPerMonthSeason)} pro Saisonmonat).`,
      };
    },
    formula: 'Saisonkosten = (Steuer + Versicherung) × (Monate / 12) + Sprit + Wartung',
    formulaExplanation: 'Motorräder zahlen 1,84 € KFZ-Steuer je angefangene 25 cm³ Hubraum jährlich. Bei Saisonkennzeichen werden Steuer und Versicherung taggenau anteilig berechnet.',
    workedExample: {
      title: 'Beispiel: 650 cm³ Bike für 8 Monate Saison bei 5.000 km',
      inputValues: [{ label: 'Hubraum', value: '650 cm³' }, { label: 'Saison', value: '8 Monate' }, { label: 'Kilometer', value: '5.000 km' }],
      steps: ['Steuer voll = 47,84 € (anteilig 8 Monate ≈ 31,89 €)', 'Versicherung 8 Monate ≈ 160 €', 'Sprit (4,8 l/100 km) ≈ 432 €', 'Wartung ≈ 350 €', 'Summe ≈ 973,89 €'],
      result: 'ca. 973,89 € pro Saison',
    },
    faqs: [
      { question: 'Darf man das Motorrad außerhalb der Saison an der Straße parken?', answer: 'Nein! Außerhalb des auf dem Saisonkennzeichen eingeprägten Zeitraums darf das Fahrzeug weder gefahren noch auf öffentlichem Grund abgestellt werden.' },
      { question: 'Greift der Schadensfreiheitsrabatt (SF-Klasse) bei Saisonkennzeichen?', answer: 'Ja, sofern die Saison mindestens 6 Monate lang ist, rückt man in der SF-Klasse im Folgejahr eine Stufe besser.' },
    ],
    relatedSlugs: ['kfz-steuer-rechner', 'spritkostenrechner', 'bremsweg-rechner'],
  },

  {
    id: 'lkw-maut-deutschland-rechner',
    slug: 'lkw-maut-deutschland-rechner',
    name: 'LKW-Maut-Rechner Deutschland (Bundesfernstraßenmaut)',
    shortName: 'LKW-Maut Deutschland',
    category: 'auto-verkehr',
    subcategory: 'Kosten & Steuern',
    metaTitle: 'LKW-Maut Rechner Deutschland – Mautgebühren nach Euro-Klasse & CO2-Aufschlag',
    metaDescription: 'Berechnen Sie die deutsche LKW-Maut nach zulässiger Gesamtmasse (ab 3,5 t), Achszahl, Schadstoffklasse (Euro 6) und CO2-Emissionsklasse (Toll Collect).',
    h1: 'LKW-Maut Rechner Deutschland – Mautsätze & Streckenkosten berechnen',
    shortDescription: 'Ermittelt die Bundesfernstraßenmaut für schwere Nutzfahrzeuge ab 3,5 t.',
    searchKeywords: ['lkw maut rechner deutschland', 'toll collect mautsaetze pro kilometer', 'lkw maut ab 3 5 tonnen berechnen', 'co2 aufschlag lkw maut euro 6'],
    inputs: [
      { id: 'distanceKm', label: 'Mautpflichtige Fahrtstrecke in km', type: 'number', defaultValue: 350, min: 10, max: 2500, step: 10, unit: 'km' },
      {
        id: 'weightClass',
        label: 'Gewichtsklasse / Fahrzeugtyp',
        type: 'select',
        defaultValue: 'over18t_5axles',
        options: [
          { value: 'from3_5to7_5', label: '3,5 t bis unter 7,5 t (ca. 17,8 ct/km)' },
          { value: 'from7_5to12', label: '7,5 t bis unter 12 t (ca. 24,1 ct/km)' },
          { value: 'from12to18', label: '12 t bis 18 t (ca. 27,8 ct/km)' },
          { value: 'over18t_4axles', label: 'Über 18 t bis 3 Achsen (ca. 32,5 ct/km)' },
          { value: 'over18t_5axles', label: 'Über 18 t ab 4 Achsen / Standard-Sattelzug (ca. 34,8 ct/km)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const km = parseFloat(inputs.distanceKm) || 350;
      const type = inputs.weightClass || 'over18t_5axles';

      const rates: Record<string, number> = {
        from3_5to7_5: 0.178,
        from7_5to12: 0.241,
        from12to18: 0.278,
        over18t_4axles: 0.325,
        over18t_5axles: 0.348,
      };
      const rate = rates[type] || 0.348;
      const totalMaut = km * rate;

      return {
        primary: { id: 'totalMaut', label: 'Gesamte LKW-Maut für die Strecke', value: totalMaut, formattedValue: formatCurrency(totalMaut), highlight: true },
        secondary: [
          { id: 'ratePerKm', label: 'Mautsatz pro Kilometer', value: rate * 100, formattedValue: `${formatNumber(rate * 100, 1)} ct/km` },
          { id: 'distance', label: 'Mautstrecke', value: km, formattedValue: `${formatNumber(km, 0)} km` },
        ],
        summaryText: `Für die Fahrtstrecke von ${formatNumber(km, 0)} km fallen bei einem Mautsatz von ${formatNumber(rate * 100, 1)} ct/km Mautkosten in Höhe von ${formatCurrency(totalMaut)} an.`,
      };
    },
    formula: 'Maut = Mautpflichtige Kilometer × Mautsatz je km (nach BFStrMG)',
    formulaExplanation: 'Seit 1. Juli 2024 gilt die LKW-Maut in Deutschland bereits ab 3,5 Tonnen technisch zulässiger Gesamtmasse (tzGm). Handwerkerfahrzeuge können unter bestimmten Bedingungen befreit werden.',
    workedExample: {
      title: 'Beispiel: 350 km mit 40-Tonner Sattelzug (Euro 6)',
      inputValues: [{ label: 'Strecke', value: '350 km' }, { label: 'Typ', value: 'Über 18 t / ab 4 Achsen' }],
      steps: ['Mautsatz: 0,348 €/km', 'Kosten: 350 km × 0,348 € = 121,80 €'],
      result: '121,80 € Mautgebühren',
    },
    faqs: [
      { question: 'Gilt die Maut auch für Bundesstraßen?', answer: 'Ja, die LKW-Maut gilt auf allen Bundesautobahnen und Bundesstraßen in ganz Deutschland.' },
      { question: 'Gibt es eine Handwerkerbefreiung ab 3,5 Tonnen?', answer: 'Ja, Fahrzeuge zwischen 3,5 und 7,5 Tonnen, die von Handwerkern zur Beförderung von Material zur Arbeitsstätte gefahren werden, sind mautbefreit.' },
    ],
    relatedSlugs: ['spritkostenrechner', 'fahrtkostenrechner', 'autobahn-maut-rechner-vignette'],
  },

  // ==================== ARBEIT & GEHALT (21 ZUSÄTZLICHE) ====================
  {
    id: 'kurzarbeitergeld-rechner',
    slug: 'kurzarbeitergeld-rechner',
    name: 'Kurzarbeitergeld-Rechner (KUG 60 % / 67 % nach § 105 SGB III)',
    shortName: 'Kurzarbeitergeld-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Kurzarbeitergeld Rechner – KUG Höhe & Netto-Entgeltausfall berechnen',
    metaDescription: 'Berechnen Sie Ihr Kurzarbeitergeld (60 % für Kinderlose, 67 % mit Kindern) bei 20 %, 50 % oder 100 % Arbeitsausfall (Kurzarbeit Null) online.',
    h1: 'Kurzarbeitergeld Rechner – KUG & Gehalt bei Kurzarbeit ermitteln',
    shortDescription: 'Berechnet den Entgeltausfall und das staatliche Kurzarbeitergeld der Bundesagentur für Arbeit.',
    searchKeywords: ['kurzarbeitergeld rechner kug', 'kurzarbeit netto rechner 60 67 prozent', 'kurzarbeit null wie viel netto', 'arbeitsausfall gehalt berechnen'],
    inputs: [
      { id: 'regularGross', label: 'Reguläres monatliches Bruttogehalt (Soll-Entgelt)', type: 'number', defaultValue: 3500, min: 500, step: 100, unit: '€' },
      { id: 'workReductionPct', label: 'Arbeitsausfall in Prozent (z. B. 50 % = halbe Arbeitszeit)', type: 'number', defaultValue: 50, min: 10, max: 100, step: 10, unit: '%' },
      {
        id: 'hasChildren',
        label: 'Kinder / Leistungssatz',
        type: 'select',
        defaultValue: 'no_child',
        options: [
          { value: 'no_child', label: 'Ohne Kinder (Leistungssatz 1: 60 %)' },
          { value: 'with_child', label: 'Mindestens 1 Kind (Leistungssatz 2: 67 %)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.regularGross) || 3500;
      const reduction = (parseFloat(inputs.workReductionPct) || 50) / 100;
      const rate = inputs.hasChildren === 'with_child' ? 0.67 : 0.60;

      // Pauschaliertes Nettoentgelt ca. 62 % des Brutto
      const regularNet = gross * 0.62;
      const reducedGross = gross * (1 - reduction);
      const reducedNet = reducedGross * 0.62;
      const netDifference = Math.max(0, regularNet - reducedNet);
      const kug = netDifference * rate;
      const totalIncome = reducedNet + kug;

      return {
        primary: { id: 'totalIncome', label: 'Gesamtes Nettoeinkommen während Kurzarbeit', value: totalIncome, formattedValue: formatCurrency(totalIncome), highlight: true },
        secondary: [
          { id: 'kug', label: `Kurzarbeitergeld von der Agentur für Arbeit (${formatPercent(rate * 100, 0)})`, value: kug, formattedValue: formatCurrency(kug) },
          { id: 'reducedNet', label: 'Netto-Gehalt für tatsächlich geleistete Arbeit', value: reducedNet, formattedValue: formatCurrency(reducedNet) },
          { id: 'incomeDrop', label: 'Nettoverlust gegenüber Vollzeit', value: regularNet - totalIncome, formattedValue: formatCurrency(regularNet - totalIncome) },
        ],
        summaryText: `Bei ${formatPercent(reduction * 100, 0)} Arbeitsausfall erhalten Sie ${formatCurrency(reducedNet)} Arbeitslohn plus ${formatCurrency(kug)} KUG. Ihr Nettoeinkommen liegt bei ${formatCurrency(totalIncome)} (${formatCurrency(regularNet - totalIncome)} weniger als regulär).`,
      };
    },
    formula: 'KUG = Pauschalierte Nettoentgeltdifferenz × Leistungssatz (60 % oder 67 %)',
    formulaExplanation: 'Das Kurzarbeitergeld gleicht nach §§ 105, 106 SGB III den überwiegenden Teil des ausgefallenen Nettogehalts aus.',
    workedExample: {
      title: 'Beispiel: 3.500 € Brutto bei 50 % Kurzarbeit ohne Kinder (60 %)',
      inputValues: [{ label: 'Brutto', value: '3.500 €' }, { label: 'Ausfall', value: '50 %' }, { label: 'Satz', value: '60 %' }],
      steps: ['Reguläres Netto ca. 2.170 €', 'Restlohn-Netto ca. 1.085 €', 'Differenz = 1.085 € × 60 % = 651 € KUG', 'Gesamt-Netto = 1.085 € + 651 € = 1.736 €'],
      result: '1.736,00 € Gesamt-Netto',
    },
    faqs: [
      { question: 'Unterliegt das Kurzarbeitergeld dem Progressionsvorbehalt?', answer: 'Ja, KUG selbst ist steuerfrei, erhöht aber den Steuersatz für das übrige steuerpflichtige Einkommen (Pflicht zur Abgabe einer Steuererklärung nach § 46 EStG).' },
      { question: 'Wer zahlt die Sozialversicherungsbeiträge während Kurzarbeit?', answer: 'Für die tatsächlich geleistete Arbeit teilen sich Arbeitgeber und Arbeitnehmer die Beiträge. Für die Ausfallstunden trägt der Arbeitgeber die Beiträge zur Renten-, Kranken- und Pflegeversicherung allein auf Basis von 80 % des ausgefallenen Entgelts.' },
    ],
    relatedSlugs: ['arbeitslosengeld-1-rechner', 'teilzeit-gehaltsrechner', 'teilzeit-gehaltsrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundesagentur für Arbeit (§ 105 SGB III)',
      sourceUrl: 'https://www.arbeitsagentur.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'abfindung-fuenftelregelung-rechner',
    slug: 'abfindung-fuenftelregelung-rechner',
    name: 'Abfindungsrechner mit Fünftelregelung (§ 34 EStG)',
    shortName: 'Abfindungsrechner Fünftelregelung',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Abfindungsrechner Fünftelregelung – Steuerersparnis nach § 34 EStG berechnen',
    metaDescription: 'Berechnen Sie die Steuerlast auf Ihre Abfindung mit der ermäßigten Fünftelregelung nach § 34 EStG. Sehen Sie, wie viel Netto von der Abfindung bleibt.',
    h1: 'Abfindungsrechner – Abfindung versteuern mit Fünftelregelung',
    shortDescription: 'Ermittelt die Steuerersparnis bei Abfindungen durch die Fünftelregelung für außerordentliche Einkünfte.',
    searchKeywords: ['abfindungsrechner fuenftelregelung', 'paragraph 34 estg abfindung rechner', 'wie viel netto bleibt von abfindung', 'abfindung steuer optimieren'],
    inputs: [
      { id: 'regularYearlyIncome', label: 'Reguläres zu versteuerndes Jahreseinkommen (ohne Abfindung)', type: 'number', defaultValue: 45000, min: 10000, step: 2500, unit: '€' },
      { id: 'severancePay', label: 'Vereinbarte Brutto-Abfindung', type: 'number', defaultValue: 30000, min: 1000, step: 2500, unit: '€' },
    ],
    calculate: (inputs) => {
      const income = parseFloat(inputs.regularYearlyIncome) || 45000;
      const severance = parseFloat(inputs.severancePay) || 30000;

      // Vereinfachte Schätzung der Einkommensteuer-Tariffunktion ESt
      const est = (zvE: number) => {
        if (zvE <= 11784) return 0;
        if (zvE <= 17005) { const y = (zvE - 11784) / 10000; return (995.21 * y + 1400) * y; }
        if (zvE <= 66760) { const z = (zvE - 17005) / 10000; return (208.85 * z + 2397) * z + 1015; }
        if (zvE <= 277825) return 0.42 * zvE - 10632;
        return 0.45 * zvE - 18967;
      };

      const taxBase = est(income);
      // 1. Reguläre Besteuerung ohne Fünftelregelung
      const taxWithSeveranceFull = est(income + severance);
      const taxOnSeveranceRegular = taxWithSeveranceFull - taxBase;

      // 2. Fünftelregelung nach § 34 Abs. 1 EStG
      const taxWithOneFifth = est(income + (severance / 5));
      const taxOnOneFifth = taxWithOneFifth - taxBase;
      const taxSeveranceFünftel = taxOnOneFifth * 5;

      const taxSaving = Math.max(0, taxOnSeveranceRegular - taxSeveranceFünftel);
      const netSeverance = severance - taxSeveranceFünftel;

      return {
        primary: { id: 'netSeverance', label: 'Netto-Auszahlung der Abfindung', value: netSeverance, formattedValue: formatCurrency(netSeverance), highlight: true },
        secondary: [
          { id: 'taxSeveranceFünftel', label: 'Steuer auf Abfindung (mit Fünftelregelung)', value: taxSeveranceFünftel, formattedValue: formatCurrency(taxSeveranceFünftel) },
          { id: 'taxSaving', label: 'Steuerersparnis durch Fünftelregelung', value: taxSaving, formattedValue: formatCurrency(taxSaving) },
          { id: 'taxRegular', label: 'Steuer ohne Fünftelregelung (Vergleich)', value: taxOnSeveranceRegular, formattedValue: formatCurrency(taxOnSeveranceRegular) },
        ],
        summaryText: `Von ${formatCurrency(severance)} Abfindung bleiben dank der Fünftelregelung netto ca. ${formatCurrency(netSeverance)} übrig. Sie sparen dadurch rund ${formatCurrency(taxSaving)} Einkommensteuer.`,
      };
    },
    formula: 'Steuer = 5 × [Tarif(Einkommen + Abfindung/5) - Tarif(Einkommen)]',
    formulaExplanation: 'Die Fünftelregelung nach § 34 EStG mildert die Steuerprogression bei Einmalzahlungen, indem die Abfindung rechnerisch auf fünf Jahre verteilt besteuert wird.',
    workedExample: {
      title: 'Beispiel: 30.000 € Abfindung bei 45.000 € Grundgehalt',
      inputValues: [{ label: 'Jahreseinkommen', value: '45.000 €' }, { label: 'Abfindung', value: '30.000 €' }],
      steps: ['Steuer auf 1/5 (6.000 €) ermitteln', 'Differenz mit 5 multiplizieren', 'Ersparnis gegenüber Vollprogression: meist mehrere tausend Euro'],
      result: 'ca. 18.000 € bis 20.000 € Netto-Auszahlung',
    },
    faqs: [
      { question: 'Fallen auf Abfindungen Sozialversicherungsbeiträge an?', answer: 'Nein, echte Abfindungen wegen Beendigung des Arbeitsverhältnisses sind grundsätzlich sozialversicherungsfrei (keine Renten-, Kranken- oder Pflegeversicherung).' },
      { question: 'Wann ist die Fünftelregelung anwendbar?', answer: 'Voraussetzung ist eine Entlassungsentschädigung und eine sogenannte Zusammenballung von Einkünften im selben Kalenderjahr.' },
    ],
    relatedSlugs: ['kuendigungsfrist-arbeitnehmer-rechner', 'teilzeit-gehaltsrechner', 'urlaubsabgeltung-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 34 EStG Außerordentliche Einkünfte)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'minijob-midijob-rechner',
    slug: 'minijob-midijob-rechner',
    name: 'Minijob- & Midijob-Rechner (Übergangsbereich bis 2.000 €)',
    shortName: 'Minijob & Midijob',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Minijob & Midijob Rechner 2026 – Übergangsbereich 538 € bis 2.000 €',
    metaDescription: 'Berechnen Sie Abzüge und Nettoverdienst im Minijob (538 € Grenze) und im Midijob (Übergangsbereich bis 2.000 €) nach § 20 SGB IV.',
    h1: 'Minijob & Midijob Rechner – Abzüge im Übergangsbereich berechnen',
    shortDescription: 'Ermittelt die gleitenden Sozialversicherungsbeiträge im Übergangsbereich (Midijob).',
    searchKeywords: ['minijob rechner 538 euro netto', 'midijob rechner uebergangsbereich 2000 euro', 'paragraph 20 sgb iv gleitzone rechner', 'sozialversicherung midijob abzug'],
    inputs: [
      { id: 'monthlyGross', label: 'Monatlicher Bruttolohn', type: 'number', defaultValue: 850, min: 100, max: 2500, step: 25, unit: '€' },
      {
        id: 'pensionOptOut',
        label: 'Rentenversicherungspflicht im Minijob (nur relevant bis 538 €)',
        type: 'select',
        defaultValue: 'keep',
        options: [
          { value: 'keep', label: 'Beitragspflichtig bleiben (3,6 % Eigenanteil zur Rentenversicherung)' },
          { value: 'exempt', label: 'Befreiungsantrag stellen (0 % Abzug)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 850;
      const optOut = inputs.pensionOptOut === 'exempt';

      // 1. Minijob (bis 538 €)
      if (gross <= 538) {
        const rvDeduction = optOut ? 0 : gross * 0.036;
        const net = gross - rvDeduction;
        return {
          primary: { id: 'net', label: 'Nettolohn im Minijob', value: net, formattedValue: formatCurrency(net), highlight: true },
          secondary: [
            { id: 'rvDeduction', label: 'Eigenanteil Rentenversicherung', value: rvDeduction, formattedValue: formatCurrency(rvDeduction) },
            { id: 'jobType', label: 'Beschäftigungsart', value: 0, formattedValue: 'Geringfügige Beschäftigung (Minijob)' },
            { id: 'employerCosts', label: 'Pauschale Arbeitgeberabgaben (ca. 31,5 %)', value: gross * 0.315, formattedValue: formatCurrency(gross * 0.315) },
          ],
          summaryText: `Bei ${formatCurrency(gross)} Brutto im Minijob erhalten Sie ${formatCurrency(net)} netto ausgezahlt (${optOut ? 'ohne Abzüge' : 'abzgl. 3,6 % Rentenbeitrag zur Sicherung von Rentenansprüchen'}).`,
        };
      }

      // 2. Midijob / Übergangsbereich (538,01 € bis 2.000,00 €)
      if (gross <= 2000) {
        // Gleitende Beitragsberechnung nach § 20 Abs. 2 SGB IV
        // Arbeitnehmerbeitrag steigt von ca. 0 % progressiv auf den regulären Satz von ca. 20,5 % bei 2.000 €
        const factor = (gross - 538) / (2000 - 538);
        const employeeRate = 0.08 + (factor * 0.125); // ca. 8 % bis 20,5 %
        const svDeduction = gross * employeeRate;
        const net = gross - svDeduction; // in Steuerklasse 1 bis ca. 1.200 € steuerfrei

        return {
          primary: { id: 'net', label: 'Nettolohn im Midijob', value: net, formattedValue: formatCurrency(net), highlight: true },
          secondary: [
            { id: 'svDeduction', label: 'Ermäßigte Sozialversicherungsbeiträge', value: svDeduction, formattedValue: formatCurrency(svDeduction) },
            { id: 'rateEffective', label: 'Effektiver SV-Beitragssatz Arbeitnehmer', value: employeeRate * 100, formattedValue: formatPercent(employeeRate * 100, 1) },
            { id: 'jobType', label: 'Beschäftigungsart', value: 0, formattedValue: 'Übergangsbereich (Midijob)' },
          ],
          summaryText: `Im Midijob bei ${formatCurrency(gross)} Brutto zahlen Sie ermäßigte Sozialversicherungsbeiträge von nur ${formatPercent(employeeRate * 100, 1)} (${formatCurrency(svDeduction)}). Sie erhalten ca. ${formatCurrency(net)} netto.`,
        };
      }

      // 3. Regulärer Job (> 2.000 €)
      const svNormal = gross * 0.205;
      const taxNormal = Math.max(0, (gross - 1200) * 0.25);
      const netNormal = gross - svNormal - taxNormal;
      return {
        primary: { id: 'netNormal', label: 'Nettolohn (reguläre Beschäftigung)', value: netNormal, formattedValue: formatCurrency(netNormal), highlight: true },
        secondary: [
          { id: 'svNormal', label: 'Volle Sozialversicherungsbeiträge (ca. 20,5 %)', value: svNormal, formattedValue: formatCurrency(svNormal) },
          { id: 'taxNormal', label: 'Geschätzte Lohnsteuer', value: taxNormal, formattedValue: formatCurrency(taxNormal) },
        ],
        summaryText: `Über 2.000 € greift der reguläre Sozialversicherungssatz. Bei ${formatCurrency(gross)} Brutto verbleiben ca. ${formatCurrency(netNormal)} netto.`,
      };
    },
    formula: 'Midijob-Beitrag nach amtlicher Übergangsbereichs-Formel (§ 20 SGB IV)',
    formulaExplanation: 'Im Übergangsbereich (früher Gleitzone) zwischen 538,01 € und 2.000,00 € zahlen Arbeitnehmer reduzierte Sozialversicherungsbeiträge, erwerben aber dennoch volle Rentenansprüche.',
    workedExample: {
      title: 'Beispiel: 850 € Midijob',
      inputValues: [{ label: 'Brutto', value: '850 €' }],
      steps: ['Übergangsbereich greift (538 € bis 2.000 €)', 'Ermäßigter SV-Satz ca. 10,7 %', 'Nettoauszahlung: ca. 759 €'],
      result: 'ca. 759,00 € Netto',
    },
    faqs: [
      { question: 'Erwirbt man im Midijob volle Rentenansprüche?', answer: 'Ja! Seit 2019 führen die ermäßigten Beiträge des Arbeitnehmers nicht mehr zu Rentenkürzungen – die Rentenansprüche werden aus dem vollen Bruttogehalt berechnet.' },
      { question: 'Gilt die Minijob-Grenze für mehrere Minijobs zusammen?', answer: 'Ja, mehrere Minijobs bei verschiedenen Arbeitgebern werden zusammengerechnet. Übersteigt die Summe 538 €, werden alle Jobs sozialversicherungspflichtig.' },
    ],
    relatedSlugs: ['teilzeit-gehaltsrechner', 'teilzeit-gehaltsrechner', 'arbeitgeberanteil-sozialversicherung-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Minijob-Zentrale / BMAS (§ 8, § 20 SGB IV)',
      sourceUrl: 'https://www.minijob-zentrale.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'arbeitgeberanteil-sozialversicherung-rechner',
    slug: 'arbeitgeberanteil-sozialversicherung-rechner',
    name: 'Arbeitgeber-Gesamtkosten-Rechner (Lohnnebenkosten)',
    shortName: 'Arbeitgeberbelastung',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Arbeitgeberanteil Rechner – Lohnnebenkosten & Personalkosten 2026',
    metaDescription: 'Berechnen Sie die echten Gesamtkosten eines Mitarbeiters für Arbeitgeber: Bruttogehalt zzgl. AG-Anteile zur Sozialversicherung (ca. 21 %) und Umlagen U1, U2, U3.',
    h1: 'Arbeitgeberanteil Rechner – Gesamte Personalkosten berechnen',
    shortDescription: 'Ermittelt den Arbeitgeber-Gesamtaufwand inklusive Sozialversicherungsbeiträgen und gesetzlichen Umlagen.',
    searchKeywords: ['arbeitgeberanteil rechner', 'lohnnebenkosten arbeitgeber prozent 2026', 'personalkosten rechner brutto', 'arbeitgeberanteil sozialversicherung formel'],
    inputs: [
      { id: 'monthlyGross', label: 'Vereinbartes monatliches Bruttogehalt des Mitarbeiters', type: 'number', defaultValue: 4000, min: 500, step: 100, unit: '€' },
      { id: 'healthAddOnPct', label: 'Zusatzbeitrag der Krankenkasse (gesamt, z. B. 1,7 %)', type: 'number', defaultValue: 1.7, min: 0.5, max: 3.5, step: 0.1, unit: '%' },
      { id: 'umlagenPct', label: 'Umlagen U1 (Krankheit), U2 (Mutterschaft), U3 (Insolvenzgeld) ca.', type: 'number', defaultValue: 2.2, min: 0.5, max: 5.0, step: 0.1, unit: '%' },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 4000;
      const addOn = parseFloat(inputs.healthAddOnPct) || 1.7;
      const umlagen = parseFloat(inputs.umlagenPct) || 2.2;

      // Beitragsbemessungsgrenzen 2026 beachten (grob):
      const bbzKv = 5175; // KV/PV
      const bbzRv = 7550; // RV/AV

      const kvGross = Math.min(gross, bbzKv);
      const rvGross = Math.min(gross, bbzRv);

      // AG-Beitragssätze:
      const agKv = kvGross * ((14.6 + addOn) / 2 / 100); // 7,3% + halber Zusatzbeitrag
      const agPv = kvGross * 0.022; // 2,2%
      const agRv = rvGross * 0.093; // 9,3%
      const agAv = rvGross * 0.013; // 1,3%
      const agUmlagen = gross * (umlagen / 100);

      const agSocialTotal = agKv + agPv + agRv + agAv;
      const totalAgCost = gross + agSocialTotal + agUmlagen;
      const markupPct = ((totalAgCost - gross) / gross) * 100;

      return {
        primary: { id: 'totalAgCost', label: 'Monatliche Arbeitgeber-Gesamtkosten', value: totalAgCost, formattedValue: formatCurrency(totalAgCost), highlight: true },
        secondary: [
          { id: 'agSocialTotal', label: 'Arbeitgeberanteil Sozialversicherung', value: agSocialTotal, formattedValue: formatCurrency(agSocialTotal) },
          { id: 'agUmlagen', label: 'Umlagen U1, U2, U3 & Berufsgenossenschaft', value: agUmlagen, formattedValue: formatCurrency(agUmlagen) },
          { id: 'markupPct', label: 'Lohnnebenkosten-Aufschlag', value: markupPct, formattedValue: formatPercent(markupPct, 1) },
          { id: 'yearlyAgCost', label: 'Gesamtkosten pro Jahr', value: totalAgCost * 12, formattedValue: formatCurrency(totalAgCost * 12) },
        ],
        summaryText: `Ein Mitarbeiter mit ${formatCurrency(gross)} Bruttogehalt kostet den Arbeitgeber insgesamt ca. ${formatCurrency(totalAgCost)} monatlich (Aufschlag von ${formatPercent(markupPct, 1)} Lohnnebenkosten).`,
      };
    },
    formula: 'AG-Kosten = Bruttolohn + AG-KV + AG-PV + AG-RV + AG-AV + Umlagen (U1/U2/U3)',
    formulaExplanation: 'Arbeitgeber tragen rund 21 % des Bruttolohns zusätzlich für Sozialversicherungen sowie verpflichtende Umlagen für Entgeltfortzahlung und Mutterschutz.',
    workedExample: {
      title: 'Beispiel: 4.000 € Bruttogehalt',
      inputValues: [{ label: 'Brutto', value: '4.000 €' }],
      steps: ['AG-Sozialversicherung ≈ 804 € (20,1 %)', 'Umlagen U1-U3 ≈ 88 € (2,2 %)', 'Gesamtkosten = 4.892 € monatlich'],
      result: 'ca. 4.892,00 € Arbeitgeberkosten',
    },
    faqs: [
      { question: 'Was ist die U1-Umlage?', answer: 'Die U1 ist die Umlage für Entgeltfortzahlung im Krankheitsfall. Nur Betriebe mit maximal 30 Mitarbeitern nehmen daran teil und erhalten bis zu 80 % der Lohnfortzahlung erstattet.' },
      { question: 'Kommen noch Berufsgenossenschaftsbeiträge hinzu?', answer: 'Ja, Beiträge zur gesetzlichen Unfallversicherung (Berufsgenossenschaft) variieren je nach Gefahrenklasse der Branche und werden zu 100 % vom Arbeitgeber getragen.' },
    ],
    relatedSlugs: ['teilzeit-gehaltsrechner', 'minijob-midijob-rechner', 'stundenlohnrechner'],
  },

  {
    id: 'kuendigungsfrist-arbeitnehmer-rechner',
    slug: 'kuendigungsfrist-arbeitnehmer-rechner',
    name: 'Kündigungsfrist-Rechner (§ 622 BGB Arbeitsrecht)',
    shortName: 'Kündigungsfrist-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Urlaub & Arbeitszeit',
    metaTitle: 'Kündigungsfrist Rechner – Gesetzliche Fristen nach § 622 BGB',
    metaDescription: 'Ermitteln Sie die genaue Kündigungsfrist für Arbeitnehmer und Arbeitgeber nach Betriebszugehörigkeit und Kündigungstermin gemäß § 622 BGB.',
    h1: 'Kündigungsfrist Rechner – Kündigungstermin nach § 622 BGB ermitteln',
    shortDescription: 'Berechnet das frühestmögliche Vertragsende nach Betriebszugehörigkeit und Kündigungsdatum.',
    searchKeywords: ['kuendigungsfrist rechner bgb', 'gesetzliche kuendigungsfrist arbeitnehmer paragraph 622', 'kuendigungsfristen tabelle betriebszugehoerigkeit', 'kuendigung zum 15 oder monatsende'],
    inputs: [
      { id: 'yearsEmployed', label: 'Dauer der Betriebszugehörigkeit in vollendeten Jahren', type: 'number', defaultValue: 5, min: 0, max: 40, step: 1, unit: 'Jahre' },
      {
        id: 'initiator',
        label: 'Wer kündigt das Arbeitsverhältnis?',
        type: 'select',
        defaultValue: 'employer',
        options: [
          { value: 'employer', label: 'Kündigung durch den Arbeitgeber (Staffelung nach Dienstjahren)' },
          { value: 'employee', label: 'Kündigung durch den Arbeitnehmer (Grundkündigungsfrist 4 Wochen)' },
          { value: 'probation', label: 'Kündigung während der Probezeit (max. 6 Monate)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const years = parseInt(inputs.yearsEmployed, 10) || 5;
      const type = inputs.initiator || 'employer';

      if (type === 'probation') {
        return {
          primary: { id: 'term', label: 'Kündigungsfrist in der Probezeit', value: 14, formattedValue: '2 Wochen', highlight: true },
          secondary: [
            { id: 'endRule', label: 'Endtermin', value: 0, formattedValue: 'Zu jedem beliebigen Tag (taggenau 2 Wochen)' },
            { id: 'law', label: 'Rechtsgrundlage', value: 0, formattedValue: '§ 622 Abs. 3 BGB' },
          ],
          summaryText: 'In der vereinbarten Probezeit (bis zu 6 Monate) kann das Arbeitsverhältnis mit einer Frist von zwei Wochen zu jedem beliebigen Kalendertag gekündigt werden.',
        };
      }

      if (type === 'employee') {
        return {
          primary: { id: 'term', label: 'Gesetzliche Kündigungsfrist für Arbeitnehmer', value: 28, formattedValue: '4 Wochen (28 Tage)', highlight: true },
          secondary: [
            { id: 'endRule', label: 'Möglicher Beendigungstermin', value: 0, formattedValue: 'Zum 15. oder zum Ende eines Kalendermonats' },
            { id: 'note', label: 'Vertragsklausel beachten', value: 0, formattedValue: 'Gilt, sofern der Arbeitsvertrag nicht die längeren Fristen des Arbeitgebers vereinbart' },
          ],
          summaryText: 'Nach § 622 Abs. 1 BGB beträgt die Grundkündigungsfrist für Arbeitnehmer 4 Wochen zum Fünfzehnten oder zum Ende eines Kalendermonats.',
        };
      }

      // Kündigung durch Arbeitgeber nach § 622 Abs. 2 BGB:
      let months = 1;
      if (years >= 20) months = 7;
      else if (years >= 15) months = 6;
      else if (years >= 12) months = 5;
      else if (years >= 10) months = 4;
      else if (years >= 8) months = 3;
      else if (years >= 5) months = 2;
      else if (years >= 2) months = 1;

      const termText = years < 2 ? '4 Wochen zum 15. oder Monatsende' : `${months} Monat${months > 1 ? 'e' : ''} zum Ende eines Kalendermonats`;

      return {
        primary: { id: 'term', label: 'Gesetzliche Kündigungsfrist des Arbeitgebers', value: months, formattedValue: termText, highlight: true },
        secondary: [
          { id: 'years', label: 'Berücksichtigte Betriebszugehörigkeit', value: years, formattedValue: `${years} Jahre` },
          { id: 'law', label: 'Rechtsgrundlage', value: 0, formattedValue: '§ 622 Abs. 2 BGB' },
        ],
        summaryText: `Bei ${years} Jahren Betriebszugehörigkeit muss der Arbeitgeber eine gesetzliche Kündigungsfrist von ${termText} einhalten.`,
      };
    },
    formula: 'Frist nach Staffelung des § 622 Abs. 2 BGB (von 4 Wochen bis zu 7 Monaten)',
    formulaExplanation: 'Mit zunehmender Betriebszugehörigkeit verlängert sich die Kündigungsfrist des Arbeitgebers von 1 Monat (ab 2 Jahren) bis zu 7 Monaten (ab 20 Jahren) jeweils zum Monatsende.',
    workedExample: {
      title: 'Beispiel: Arbeitgeber kündigt nach 5 Jahren Betriebszugehörigkeit',
      inputValues: [{ label: 'Betriebszugehörigkeit', value: '5 Jahre' }, { label: 'Initiator', value: 'Arbeitgeber' }],
      steps: ['Nach 5 Jahren greift § 622 Abs. 2 Nr. 2 BGB: 2 Monate zum Ende eines Kalendermonats'],
      result: '2 Monate zum Monatsende',
    },
    faqs: [
      { question: 'Darf der Arbeitsvertrag längere Fristen vorsehen?', answer: 'Ja, längere Kündigungsfristen können vereinbart werden. Allerdings darf die Frist für den Arbeitnehmer nicht länger sein als für den Arbeitgeber (§ 622 Abs. 5 BGB).' },
      { question: 'Zählen Beschäftigungsjahre vor dem 25. Lebensjahr mit?', answer: 'Ja! Die alte gesetzliche Regelung, wonach Zeiten vor dem 25. Lebensjahr nicht zählten, wurde vom Europäischen Gerichtshof (EuGH) wegen Altersdiskriminierung für unanwendbar erklärt.' },
    ],
    relatedSlugs: ['abfindung-fuenftelregelung-rechner', 'urlaubsabgeltung-rechner', 'arbeitslosengeld-1-rechner'],
  },

  {
    id: 'ueberstunden-auszahlung-rechner',
    slug: 'ueberstunden-auszahlung-rechner',
    name: 'Überstunden-Auszahlungs-Rechner (Brutto / Netto & Zuschläge)',
    shortName: 'Überstunden Auszahlung',
    category: 'arbeit-gehalt',
    subcategory: 'Urlaub & Arbeitszeit',
    metaTitle: 'Überstunden Auszahlung Rechner – Wie viel Netto bleibt von Überstunden?',
    metaDescription: 'Berechnen Sie den Auszahlungsbetrag für Überstunden: Regulärer Stundenlohn, Überstundenzuschlag (z. B. 25 %) und voraussichtliche Nettoauszahlung.',
    h1: 'Überstunden Auszahlung Rechner – Überstundenvergütung berechnen',
    shortDescription: 'Ermittelt den finanziellen Wert geleisteter Mehrarbeit in Brutto und Netto.',
    searchKeywords: ['ueberstunden auszahlung rechner', 'wie viel netto bleibt von ueberstunden', 'ueberstundenzuschlag 25 prozent berechnen', 'stundenlohn ueberstunden formel'],
    inputs: [
      { id: 'monthlyGross', label: 'Monatliches Grundgehalt brutto', type: 'number', defaultValue: 3400, min: 800, step: 100, unit: '€' },
      { id: 'weeklyHours', label: 'Vertragliche Wochenarbeitszeit in Stunden', type: 'number', defaultValue: 40, min: 10, max: 50, step: 1, unit: 'Std./Woche' },
      { id: 'overtimeHours', label: 'Auszuzahlende Überstunden', type: 'number', defaultValue: 25, min: 1, max: 200, step: 1, unit: 'Stunden' },
      { id: 'bonusPct', label: 'Vereinbarter Überstundenzuschlag (z. B. 25 %)', type: 'number', defaultValue: 25, min: 0, max: 100, step: 5, unit: '%' },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 3400;
      const hoursWeek = parseFloat(inputs.weeklyHours) || 40;
      const otHours = parseFloat(inputs.overtimeHours) || 25;
      const bonusPct = (parseFloat(inputs.bonusPct) || 25) / 100;

      // Stundenlohn = Monatsgehalt / (Wochenstunden × 4,348) bzw. 3 Monate / 13 Wochen
      const monthlyHours = (hoursWeek * 13) / 3;
      const hourlyBase = gross / monthlyHours;
      const hourlyWithBonus = hourlyBase * (1 + bonusPct);
      const grossPayout = otHours * hourlyWithBonus;
      // Bei Auszahlung greift meist der persönliche Grenzsteuersatz + SV (ca. 45-50% Abzug)
      const estimatedNetPayout = grossPayout * 0.52;

      return {
        primary: { id: 'grossPayout', label: 'Brutto-Überstundenvergütung', value: grossPayout, formattedValue: formatCurrency(grossPayout), highlight: true },
        secondary: [
          { id: 'estimatedNetPayout', label: 'Geschätzte Nettoauszahlung', value: estimatedNetPayout, formattedValue: formatCurrency(estimatedNetPayout) },
          { id: 'hourlyWithBonus', label: 'Stundenlohn inkl. Zuschlag', value: hourlyWithBonus, formattedValue: `${formatCurrency(hourlyWithBonus)}/Std.` },
          { id: 'hourlyBase', label: 'Grundstundenlohn', value: hourlyBase, formattedValue: `${formatCurrency(hourlyBase)}/Std.` },
        ],
        summaryText: `Für ${otHours} Überstunden bei ${formatCurrency(hourlyWithBonus)}/Std. erhalten Sie brutto ${formatCurrency(grossPayout)}. Nach Abzug von Steuern und Abgaben verbleiben ca. ${formatCurrency(estimatedNetPayout)} netto.`,
      };
    },
    formula: 'Auszahlung = Überstunden × [Monatsbrutto / (Wochenstunden × 4,348)] × (1 + Zuschlag)',
    formulaExplanation: 'Überstundenvergütungen unterliegen der normalen Lohnsteuer- und Sozialversicherungspflicht. Reine Überstundenzuschläge sind im Gegensatz zu Sonntags- oder Nachtzuschlägen nicht steuerfrei.',
    workedExample: {
      title: 'Beispiel: 25 Überstunden bei 3.400 € Gehalt (40h-Woche) mit 25 % Zuschlag',
      inputValues: [{ label: 'Monatsgehalt', value: '3.400 €' }, { label: 'Überstunden', value: '25 h' }, { label: 'Zuschlag', value: '25 %' }],
      steps: ['Grundstundenlohn: 3.400 € / 173,33 h = 19,62 €/h', 'Mit 25 % Zuschlag: 19,62 € × 1,25 = 24,52 €/h', 'Brutto = 25 × 24,52 € = 613,00 €', 'Netto ca. 318,76 €'],
      result: '613,00 € brutto (ca. 319 € netto)',
    },
    faqs: [
      { question: 'Ist der Arbeitgeber verpflichtet, Überstunden auszuzahlen?', answer: 'Sofern im Arbeits- oder Tarifvertrag kein vorrangiger Freizeitausgleich (Abfeiern) vereinbart ist, muss angeordnete oder geduldete Mehrarbeit vergütet werden.' },
      { question: 'Sind pauschale Klauseln wie "Überstunden sind mit dem Gehalt abgegolten" wirksam?', answer: 'Nach ständiger BAG-Rechtsprechung sind solche Klauseln in Standard-Arbeitsverträgen intransparent und unwirksam, es sei denn, eine konkrete Stundenzahl (z. B. max. 10 % der Arbeitszeit) wird genannt.' },
    ],
    relatedSlugs: ['stundenlohnrechner', 'teilzeit-gehaltsrechner', 'teilzeit-gehaltsrechner'],
  },

  {
    id: 'firmenwagen-geldwerter-vorteil-rechner',
    slug: 'firmenwagen-geldwerter-vorteil-rechner',
    name: 'Firmenwagen-Rechner (Geldwerter Vorteil) (Lohnabrechnung)',
    shortName: 'Geldwerter Vorteil Dienstwagen',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Geldwerter Vorteil Firmenwagen Rechner – Auswirkung auf Lohnabrechnung',
    metaDescription: 'Ermitteln Sie die genaue Auswirkung des Dienstwagens auf Ihr Nettogehalt: Geldwerter Vorteil für Privatnutzung und Fahrten zwischen Wohnung und erster Tätigkeitsstätte.',
    h1: 'Geldwerter Vorteil Rechner – Firmenwagen auf der Gehaltsabrechnung',
    shortDescription: 'Zeigt die exakten steuerlichen Auswirkungen des Dienstwagens auf dem monatlichen Gehaltszettel.',
    searchKeywords: ['geldwerter vorteil firmenwagen rechner lohnabrechnung', 'firmenwagen netto abzug berechnen', '1 prozent regelung gehaltszettel', 'dienstwagen geldwerter vorteil'],
    inputs: [
      { id: 'monthlyGross', label: 'Monatliches Grundgehalt (vor Firmenwagen)', type: 'number', defaultValue: 4500, min: 1500, step: 100, unit: '€' },
      { id: 'grossListPrice', label: 'Bruttolistenpreis des Autos (UVP)', type: 'number', defaultValue: 45000, min: 10000, step: 1000, unit: '€' },
      { id: 'distanceWorkKm', label: 'Einfache Entfernung zur Arbeit in km', type: 'number', defaultValue: 15, min: 0, max: 150, step: 1, unit: 'km' },
      {
        id: 'engineType',
        label: 'Antriebsart des Firmenwagens',
        type: 'select',
        defaultValue: 'combustion',
        options: [
          { value: 'combustion', label: 'Verbrenner (1 % + 0,03 % je km)' },
          { value: 'hybrid', label: 'Plug-in-Hybrid (0,5 % + 0,015 % je km)' },
          { value: 'electric', label: 'Elektroauto (0,25 % + 0,0075 % je km)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 4500;
      const blp = parseFloat(inputs.grossListPrice) || 45000;
      const km = parseFloat(inputs.distanceWorkKm) || 15;
      const type = inputs.engineType || 'combustion';

      let pRate = 0.01;
      let cRate = 0.0003;
      if (type === 'hybrid') { pRate = 0.005; cRate = 0.00015; }
      if (type === 'electric') { pRate = 0.0025; cRate = 0.000075; }

      const vorteilPrivat = blp * pRate;
      const vorteilArbeitsweg = blp * cRate * km;
      const totalVorteil = vorteilPrivat + vorteilArbeitsweg;
      const newGrossForTax = gross + totalVorteil;

      // Netto ohne Firmenwagen (ca. 60 %) vs. Netto mit Firmenwagen
      const oldNet = gross * 0.60;
      // Steuer und SV auf neues Steuerbrutto, danach Abzug des Sachbezugs
      const estimatedDeduction = totalVorteil * 0.45;
      const newNet = oldNet - estimatedDeduction;

      return {
        primary: { id: 'estimatedDeduction', label: 'Tatsächliche monatliche Netto-Minderung', value: estimatedDeduction, formattedValue: formatCurrency(estimatedDeduction), highlight: true },
        secondary: [
          { id: 'totalVorteil', label: 'Geldwerter Vorteil gesamt (Hinzurechnungsbetrag)', value: totalVorteil, formattedValue: formatCurrency(totalVorteil) },
          { id: 'newGrossForTax', label: 'Neues Steuerbrutto auf dem Gehaltszettel', value: newGrossForTax, formattedValue: formatCurrency(newGrossForTax) },
          { id: 'newNet', label: 'Verbleibendes Netto nach Firmenwagen', value: newNet, formattedValue: formatCurrency(newNet) },
        ],
        summaryText: `Durch den Firmenwagen erhöht sich Ihr Steuerbrutto um ${formatCurrency(totalVorteil)}. Ihr monatliches Nettogehalt sinkt um ca. ${formatCurrency(estimatedDeduction)} auf ${formatCurrency(newNet)}.`,
      };
    },
    formula: 'Geldwerter Vorteil = 1 % BLP + (0,03 % BLP × Entfernungskilometer)',
    formulaExplanation: 'Der geldwerte Vorteil wird auf der Gehaltsabrechnung dem Brutto zugerechnet, versteuert und anschließend als Sachbezug wieder vom Netto abgezogen.',
    workedExample: {
      title: 'Beispiel: 4.500 € Gehalt, 45.000 € Verbrenner, 15 km Arbeitsweg',
      inputValues: [{ label: 'Gehalt', value: '4.500 €' }, { label: 'BLP', value: '45.000 €' }, { label: 'Entfernung', value: '15 km' }],
      steps: ['Privatanteil: 450,00 €', 'Arbeitsweganteil: 45.000 € × 0,0003 × 15 = 202,50 €', 'Vorteil gesamt: 652,50 €', 'Nettominderung ≈ 293,63 €/Monat'],
      result: 'ca. 293,63 € Netto-Minderung',
    },
    faqs: [
      { question: 'Zahlt der Arbeitgeber auch Sprit und Reparaturen?', answer: 'Im Regelfall übernimmt der Arbeitgeber bei Gestellung eines Dienstwagens sämtliche Kosten für Kraftstoff, Versicherung, Wartung und Reifen.' },
      { question: 'Kann man eine Zuzahlung des Arbeitnehmers anrechnen?', answer: 'Ja, leistet der Arbeitnehmer eine monatliche Zuzahlung oder eine Einmalzahlung zum Kaufpreis, mindert dies den geldwerten Vorteil Euro für Euro.' },
    ],
    relatedSlugs: ['dienstwagen-1-prozent-rechner', 'teilzeit-gehaltsrechner', 'pendlerpauschale-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 8 Abs. 2 EStG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'krankengeld-rechner',
    slug: 'krankengeld-rechner',
    name: 'Krankengeld-Rechner (70 % Brutto / 90 % Netto nach § 47 SGB V)',
    shortName: 'Krankengeld berechnen',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Krankengeld Rechner – Gesetzliches Krankengeld nach 6 Wochen Krankheit',
    metaDescription: 'Berechnen Sie Ihr Krankengeld der gesetzlichen Krankenkasse nach § 47 SGB V: 70 % des Bruttoentgelts, begrenzt auf 90 % des Nettoentgelts und Beitragsbemessungsgrenze.',
    h1: 'Krankengeld Rechner – Gesetzliches Krankengeld online ermitteln',
    shortDescription: 'Kalkuliert die Höhe des Krankengeldes nach Ablauf der 6-wöchigen Entgeltfortzahlung.',
    searchKeywords: ['krankengeld rechner', 'wie viel krankengeld nach 6 wochen', 'paragraph 47 sgb v krankengeld formel', 'krankengeld abzug sozialversicherung'],
    inputs: [
      { id: 'monthlyGross', label: 'Monatliches Bruttogehalt vor der Erkrankung', type: 'number', defaultValue: 3600, min: 500, step: 100, unit: '€' },
      { id: 'monthlyNet', label: 'Monatliches Nettogehalt vor der Erkrankung', type: 'number', defaultValue: 2350, min: 400, step: 50, unit: '€' },
      { id: 'hasChildren', label: 'Haben Sie Kinder? (relevant für Pflegeversicherungsbeitrag)', type: 'select', defaultValue: 'yes', options: [
        { value: 'yes', label: 'Ja (regulärer Pflegeversicherungsbeitrag)' },
        { value: 'no', label: 'Nein (Kinderlosenzuschlag in der Pflegeversicherung)' },
      ]},
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 3600;
      const net = parseFloat(inputs.monthlyNet) || 2350;
      const hasKids = inputs.hasChildren === 'yes';

      // Regelkrankengeldberechnung nach § 47 SGB V:
      // Kalendertägliches Brutto (geteilt durch 30)
      const dailyGross = gross / 30;
      const dailyNet = net / 30;

      // Gesetzliche Grenze: 70 % vom Brutto, maximal 90 % vom Netto
      const rule1 = dailyGross * 0.70;
      const rule2 = dailyNet * 0.90;
      const rawDailyKrankengeld = Math.min(rule1, rule2);

      // Gesetzliches Höchstkrankengeld 2026 (ca. 120,75 € / Tag)
      const cappedDailyKrankengeld = Math.min(rawDailyKrankengeld, 120.75);

      // Vom Krankengeld gehen Arbeitnehmeranteile zu RV (9,3%), ALV (1,3%) und PV (ca. 2,2% bzw. 2,8%) ab:
      const pvRate = hasKids ? 0.022 : 0.028;
      const svDeductionRate = 0.093 + 0.013 + pvRate;
      const netDailyKrankengeld = cappedDailyKrankengeld * (1 - svDeductionRate);
      const monthlyNetKrankengeld = netDailyKrankengeld * 30;
      const monthlyIncomeDrop = net - monthlyNetKrankengeld;

      return {
        primary: { id: 'monthlyNetKrankengeld', label: 'Monatliches Netto-Krankengeld', value: monthlyNetKrankengeld, formattedValue: formatCurrency(monthlyNetKrankengeld), highlight: true },
        secondary: [
          { id: 'netDailyKrankengeld', label: 'Tägliches Netto-Krankengeld', value: netDailyKrankengeld, formattedValue: formatCurrency(netDailyKrankengeld) },
          { id: 'monthlyIncomeDrop', label: 'Monatliche Einkommenslücke', value: monthlyIncomeDrop, formattedValue: formatCurrency(monthlyIncomeDrop) },
          { id: 'grossDaily', label: 'Brutto-Krankengeld pro Tag', value: cappedDailyKrankengeld, formattedValue: formatCurrency(cappedDailyKrankengeld) },
        ],
        summaryText: `Nach der 6. Krankheitswoche erhalten Sie ca. ${formatCurrency(monthlyNetKrankengeld)} Netto-Krankengeld pro Monat. Ihre Einkommenslücke beträgt ${formatCurrency(monthlyIncomeDrop)} monatlich.`,
      };
    },
    formula: 'Krankengeld = min(70 % Brutto, 90 % Netto) abzüglich Sozialversicherungsbeiträge',
    formulaExplanation: 'Krankengeld wird für maximal 78 Wochen innerhalb von drei Jahren für dieselbe Krankheit gezahlt (§ 48 SGB V).',
    workedExample: {
      title: 'Beispiel: 3.600 € Brutto / 2.350 € Netto',
      inputValues: [{ label: 'Brutto', value: '3.600 €' }, { label: 'Netto', value: '2.350 €' }],
      steps: ['70 % vom Brutto = 84,00 €/Tag', '90 % vom Netto = 70,50 €/Tag (Begrenzung greift!)', 'Brutto-Krankengeld = 70,50 €/Tag', 'Abzgl. SV-Beiträge ≈ 61,48 € netto/Tag = 1.844,40 €/Monat'],
      result: 'ca. 1.844,40 € Netto-Krankengeld/Monat',
    },
    faqs: [
      { question: 'Wer zahlt in den ersten 6 Wochen das Gehalt?', answer: 'In den ersten sechs Wochen zahlt der Arbeitgeber nach dem Entgeltfortzahlungsgesetz (EFZG) 100 % des regulären Gehalts weiter.' },
      { question: 'Ist Krankengeld steuerfrei?', answer: 'Krankengeld ist steuerfrei, unterliegt aber dem Progressionsvorbehalt und muss in der Einkommensteuererklärung angegeben werden.' },
    ],
    relatedSlugs: ['arbeitslosengeld-1-rechner', 'teilzeit-gehaltsrechner', 'kurzarbeitergeld-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Sozialgesetzbuch Fünftes Buch (§ 47 SGB V)',
      sourceUrl: 'https://www.gkv-spitzenverband.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'mutterschaftsgeld-rechner',
    slug: 'mutterschaftsgeld-rechner',
    name: 'Mutterschaftsgeld-Rechner (Krankenkasse & Arbeitgeberzuschuss)',
    shortName: 'Mutterschaftsgeld berechnen',
    category: 'arbeit-gehalt',
    subcategory: 'Familie & Freizeit',
    metaTitle: 'Mutterschaftsgeld Rechner – Krankenkasse (13 €) & Arbeitgeberzuschuss',
    metaDescription: 'Berechnen Sie das Mutterschaftsgeld während der Mutterschutzfrist: 13 Euro kalendertäglich von der Krankenkasse plus Zuschuss des Arbeitgebers zum vollen Netto.',
    h1: 'Mutterschaftsgeld Rechner – Leistungen während des Mutterschutzes',
    shortDescription: 'Ermittelt das Mutterschaftsgeld und den Arbeitgeberzuschuss während der 14-wöchigen Schutzfrist.',
    searchKeywords: ['mutterschaftsgeld rechner', 'arbeitgeberzuschuss mutterschaftsgeld berechnen', '13 euro krankenkasse mutterschutz', 'paragraph 19 muschg rechner'],
    inputs: [
      { id: 'avgNetIncome', label: 'Durchschnittliches monatliches Nettogehalt der letzten 3 Monate', type: 'number', defaultValue: 2400, min: 400, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.avgNetIncome) || 2400;
      // Mutterschutzfrist: 6 Wochen vor der Geburt + 8 Wochen nach der Geburt = 14 Wochen = 98 Tage
      const dailyNet = net / 30;
      const dailyHealthFund = 13.00; // Gesetzlich fest 13 € pro Kalendertag
      const dailyEmployerShare = Math.max(0, dailyNet - dailyHealthFund);
      const totalDaily = dailyHealthFund + dailyEmployerShare;
      const totalOver98Days = totalDaily * 98;
      const totalEmployer98Days = dailyEmployerShare * 98;
      const totalKk98Days = dailyHealthFund * 98;

      return {
        primary: { id: 'totalDaily', label: 'Volles tägliches Mutterschaftsgeld (netto)', value: totalDaily, formattedValue: formatCurrency(totalDaily), highlight: true },
        secondary: [
          { id: 'totalOver98Days', label: 'Gesamtauszahlung über 14 Wochen Mutterschutz', value: totalOver98Days, formattedValue: formatCurrency(totalOver98Days) },
          { id: 'dailyHealthFund', label: 'Zahlung der Krankenkasse pro Tag', value: dailyHealthFund, formattedValue: '13,00 €' },
          { id: 'dailyEmployerShare', label: 'Arbeitgeberzuschuss pro Tag', value: dailyEmployerShare, formattedValue: formatCurrency(dailyEmployerShare) },
          { id: 'totalKk', label: 'Anteil Krankenkasse gesamt (98 Tage)', value: totalKk98Days, formattedValue: formatCurrency(totalKk98Days) },
        ],
        summaryText: `Während der Schutzfrist erhalten Sie Ihr volles bisheriges Nettogehalt von ${formatCurrency(net)} monatlich weiter (${formatCurrency(totalOver98Days)} über 14 Wochen, davon ${formatCurrency(totalEmployer98Days)} vom Arbeitgeber und ${formatCurrency(totalKk98Days)} von der Kasse).`,
      };
    },
    formula: 'Mutterschaftsgeld = 13 €/Tag (Krankenkasse) + (Kalendertägliches Netto - 13 €) Arbeitgeberzuschuss',
    formulaExplanation: 'Nach § 19 MuSchG und § 24i SGB V wird das durchschnittliche Nettoentgelt der letzten drei abgerechneten Kalendermonate zu 100 % fortgezahlt.',
    workedExample: {
      title: 'Beispiel: 2.400 € Nettogehalt',
      inputValues: [{ label: 'Nettogehalt', value: '2.400 €' }],
      steps: ['Tägliches Netto = 2.400 € / 30 = 80,00 €', 'Krankenkasse zahlt 13,00 €/Tag', 'Arbeitgeber zahlt Differenz von 67,00 €/Tag', 'Kein finanzieller Einkommensverlust während des Mutterschutzes'],
      result: '80,00 €/Tag (volles bisheriges Netto)',
    },
    faqs: [
      { question: 'Erhält der Arbeitgeber den Zuschuss erstattet?', answer: 'Ja, über das U2-Umlageverfahren der Krankenkassen bekommt der Arbeitgeber 100 % seines Zuschusses erstattet.' },
      { question: 'Wie lange dauert die Mutterschutzfrist bei Früh- oder Mehrlingsgeburten?', answer: 'Bei Frühgeburten, Mehrlingen oder Kindern mit Behinderung verlängert sich die Schutzfrist nach der Entbindung von 8 auf 12 Wochen.' },
    ],
    relatedSlugs: ['elternzeit-teilzeit-rechner', 'teilzeit-gehaltsrechner', 'urlaubstage-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Mutterschutzgesetz (§ 19 MuSchG) / GKV-Spitzenverband',
      sourceUrl: 'https://www.bmfsfj.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'elternzeit-teilzeit-rechner',
    slug: 'elternzeit-teilzeit-rechner',
    name: 'Elternzeit-Teilzeit-Rechner (Teilzeit in Elternzeit & Verdienst)',
    shortName: 'Elternzeit Teilzeit',
    category: 'arbeit-gehalt',
    subcategory: 'Familie & Freizeit',
    metaTitle: 'Elternzeit Teilzeit Rechner – Stunden & Nettoverdienst (bis 32h/Woche)',
    metaDescription: 'Berechnen Sie Ihr Teilzeitgehalt während der Elternzeit (bis zu 32 Wochenstunden nach BEEG) und sehen Sie die Auswirkungen auf das Elterngeld Plus.',
    h1: 'Elternzeit Teilzeit Rechner – Arbeiten während der Elternzeit',
    shortDescription: 'Kalkuliert Gehalt und Arbeitszeit für Elternteilzeit bis maximal 32 Stunden pro Woche.',
    searchKeywords: ['elternzeit teilzeit rechner', 'teilzeit in elternzeit 32 stunden rechner', 'beeg elternteilzeit gehalt', 'elterngeld plus zuverdienst rechner'],
    inputs: [
      { id: 'fulltimeGross', label: 'Bisheriges Vollzeit-Bruttogehalt', type: 'number', defaultValue: 3800, min: 1000, step: 100, unit: '€' },
      { id: 'fulltimeHours', label: 'Bisherige Vollzeit-Wochenstunden', type: 'number', defaultValue: 40, min: 30, max: 45, step: 1, unit: 'Std./Woche' },
      { id: 'parttimeHours', label: 'Geplante Teilzeit-Wochenstunden in Elternzeit (max. 32 h)', type: 'number', defaultValue: 24, min: 5, max: 32, step: 1, unit: 'Std./Woche' },
    ],
    calculate: (inputs) => {
      const ftGross = parseFloat(inputs.fulltimeGross) || 3800;
      const ftHours = parseFloat(inputs.fulltimeHours) || 40;
      const ptHours = Math.min(32, parseFloat(inputs.parttimeHours) || 24);

      const ratio = ptHours / ftHours;
      const ptGross = ftGross * ratio;
      // Schätzung Netto (ca. 65 % bei Teilzeit)
      const ptNet = ptGross * 0.65;

      return {
        primary: { id: 'ptGross', label: 'Teilzeit-Bruttogehalt in Elternzeit', value: ptGross, formattedValue: formatCurrency(ptGross), highlight: true },
        secondary: [
          { id: 'ptNet', label: 'Geschätztes Teilzeit-Netto', value: ptNet, formattedValue: formatCurrency(ptNet) },
          { id: 'hours', label: 'Vereinbarte Wochenarbeitszeit', value: ptHours, formattedValue: `${ptHours} Stunden / Woche` },
          { id: 'ratio', label: 'Anteil an Vollzeit', value: ratio * 100, formattedValue: formatPercent(ratio * 100, 1) },
        ],
        summaryText: `Bei ${ptHours} Wochenstunden verdienen Sie ${formatCurrency(ptGross)} brutto (ca. ${formatCurrency(ptNet)} netto).`,
      };
    },
    formula: 'Teilzeitbrutto = Vollzeitbrutto × (Teilzeitstunden / Vollzeitstunden)',
    formulaExplanation: 'Nach dem Bundeselterngeld- und Elternzeitgesetz (BEEG) haben Arbeitnehmer in Betrieben mit mehr als 15 Beschäftigten einen Rechtsanspruch auf Teilzeitarbeit zwischen 15 und 32 Wochenstunden.',
    workedExample: {
      title: 'Beispiel: 24 Stunden statt 40 Stunden bei 3.800 € Vollzeit',
      inputValues: [{ label: 'Vollzeit', value: '3.800 € (40 h)' }, { label: 'Teilzeit', value: '24 h' }],
      steps: ['Quote = 24 / 40 = 60 %', 'Teilzeitbrutto = 3.800 € × 0,60 = 2.280,00 €', 'Netto ca. 1.482 €'],
      result: '2.280,00 € Brutto (ca. 1.482 € Netto)',
    },
    faqs: [
      { question: 'Wie viele Stunden darf man in Elternzeit maximal arbeiten?', answer: 'Für Geburten ab dem 01.09.2021 liegt die Obergrenze bei maximal 32 Wochenstunden im Monatsdurchschnitt.' },
      { question: 'Wird das Teilzeitgehalt auf das Elterngeld angerechnet?', answer: 'Beim Basiselterngeld mindert der Verdienst das Elterngeld spürbar. Beim Elterngeld Plus lässt sich Teilzeitarbeit ideal mit dem Elterngeld kombinieren.' },
    ],
    relatedSlugs: ['teilzeit-gehaltsrechner', 'mutterschaftsgeld-rechner', 'teilzeit-gehaltsrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundeselterngeld- und Elternzeitgesetz (§ 15 BEEG)',
      sourceUrl: 'https://www.bmfsfj.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'sabbatical-rechner',
    slug: 'sabbatical-rechner',
    name: 'Sabbatical-Rechner (Gehaltsverzicht & Ansparmodell)',
    shortName: 'Sabbatical-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Urlaub & Arbeitszeit',
    metaTitle: 'Sabbatical Rechner – Gehaltsreduktion & Freistellungsphase berechnen',
    metaDescription: 'Berechnen Sie Ihr reduziertes Gehalt im Sabbatical-Blockmodell: Vorarbeitsphase mit Gehaltsverzicht und voll bezahlte Freistellungsphase.',
    h1: 'Sabbatical Rechner – Auszeit planen & Gehalt berechnen',
    shortDescription: 'Kalkuliert die monatliche Gehaltsreduktion im Blockmodell für eine bezahlte berufliche Auszeit.',
    searchKeywords: ['sabbatical rechner gehaltsverzicht', 'auszeit nehmen gehalt berechnen blockmodell', 'sabbatjahr finanzierung rechner', 'sabbatical sozialversicherung'],
    inputs: [
      { id: 'regularNet', label: 'Bisheriges monatliches Nettogehalt', type: 'number', defaultValue: 2800, min: 800, step: 100, unit: '€' },
      { id: 'workMonths', label: 'Dauer der Arbeitsphase / Ansparphase in Monaten', type: 'number', defaultValue: 24, min: 6, max: 60, step: 6, unit: 'Monate' },
      { id: 'leaveMonths', label: 'Dauer der Freistellungsphase (Sabbatical) in Monaten', type: 'number', defaultValue: 6, min: 1, max: 24, step: 1, unit: 'Monate' },
    ],
    calculate: (inputs) => {
      const net = parseFloat(inputs.regularNet) || 2800;
      const workM = parseInt(inputs.workMonths, 10) || 24;
      const leaveM = parseInt(inputs.leaveMonths, 10) || 6;
      const totalMonths = workM + leaveM;

      // Gehaltsquote über den gesamten Zeitraum
      const salaryRatio = workM / totalMonths;
      const continuousNetSalary = net * salaryRatio;
      const monthlySacrifice = net - continuousNetSalary;

      return {
        primary: { id: 'continuousNetSalary', label: 'Fortlaufendes monatliches Nettogehalt', value: continuousNetSalary, formattedValue: formatCurrency(continuousNetSalary), highlight: true },
        secondary: [
          { id: 'monthlySacrifice', label: 'Monatlicher Gehaltsverzicht', value: monthlySacrifice, formattedValue: formatCurrency(monthlySacrifice) },
          { id: 'salaryRatio', label: 'Auszahlungsquote', value: salaryRatio * 100, formattedValue: formatPercent(salaryRatio * 100, 1) },
          { id: 'totalModelMonths', label: 'Gesamtlaufzeit des Modells', value: totalMonths, formattedValue: `${totalMonths} Monate (${workM} Arb. + ${leaveM} Freistellung)` },
        ],
        summaryText: `Sie arbeiten ${workM} Monate voll und erhalten über die gesamten ${totalMonths} Monate durchgehend ${formatCurrency(continuousNetSalary)} netto (Verzicht von ${formatCurrency(monthlySacrifice)}/Monat). Während der ${leaveM} Monate Auszeit bleibt der volle Sozialversicherungsschutz bestehen!`,
      };
    },
    formula: 'Fortlaufendes Gehalt = Bisheriges Gehalt × [Arbeitsmonate / (Arbeitsmonate + Freistellungsmonate)]',
    formulaExplanation: 'Im Blockmodell wird das Gehalt über die gesamte Laufzeit gleichmäßig gekürzt. Dadurch bleibt der Arbeitnehmer auch während der Freistellung voll versichert und erhält monatlich Gehalt.',
    workedExample: {
      title: 'Beispiel: 2.800 € Netto, 24 Monate Ansparphase für 6 Monate Sabbatical',
      inputValues: [{ label: 'Gehalt', value: '2.800 €' }, { label: 'Ansparzeit', value: '24 Monate' }, { label: 'Freistellung', value: '6 Monate' }],
      steps: ['Gesamtdauer = 30 Monate', 'Gehaltsquote = 24 / 30 = 80 %', 'Monatliches Gehalt durchgehend: 2.800 € × 0,80 = 2.240 €'],
      result: '2.240,00 € durchgehendes Nettogehalt',
    },
    faqs: [
      { question: 'Ist man während des Sabbaticals krankenversichert?', answer: 'Ja, beim Blockmodell mit Wertguthaben nach § 7b SGB IV besteht die sozialversicherungspflichtige Beschäftigung nahtlos fort.' },
      { question: 'Gibt es einen gesetzlichen Anspruch auf ein Sabbatical?', answer: 'In der Privatwirtschaft gibt es keinen allgemeinen gesetzlichen Anspruch; das Sabbatical erfordert eine Vereinbarung mit dem Arbeitgeber. Im öffentlichen Dienst und bei Beamten existieren teils landesrechtliche Regelungen.' },
    ],
    relatedSlugs: ['urlaubstage-rechner', 'teilzeit-gehaltsrechner', 'teilzeit-gehaltsrechner'],
  },

  {
    id: 'nachtzuschlag-sonntagszuschlag-rechner',
    slug: 'nachtzuschlag-sonntagszuschlag-rechner',
    name: 'Zuschläge-Rechner (Steuerfreie Nacht-, Sonntags- & Feiertagsarbeit)',
    shortName: 'Zuschläge-Rechner § 3b EStG',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Zuschläge Rechner § 3b EStG – Steuerfreie Sonntags- & Nachtzuschläge',
    metaDescription: 'Berechnen Sie steuer- und beitragsfreie Zuschläge für Nachtarbeit (25 % / 40 %), Sonntagsarbeit (50 %) und Feiertagsarbeit (125 % / 150 %) nach § 3b EStG.',
    h1: 'Zuschläge Rechner – Steuerfreie Nacht- & Sonntagszuschläge berechnen',
    shortDescription: 'Ermittelt die steuer- und sozialversicherungsfreien Zuschläge nach § 3b EStG.',
    searchKeywords: ['zuschlaege rechner paragraph 3b estg', 'nachtzuschlag steuerfrei berechnen', 'sonntagszuschlag 50 prozent rechner', 'feiertagszuschlag 125 prozent netto'],
    inputs: [
      { id: 'hourlyWage', label: 'Grundstundenlohn in Euro (maximal 50 €/Std. steuerlich begünstigt)', type: 'number', defaultValue: 18.50, min: 12, max: 80, step: 0.5, unit: '€/Std.' },
      {
        id: 'surchargeType',
        label: 'Art des Zuschlags nach § 3b EStG',
        type: 'select',
        defaultValue: 'sunday',
        options: [
          { value: 'night_standard', label: 'Nachtarbeit 20:00 - 06:00 Uhr (25 % steuerfrei)' },
          { value: 'night_core', label: 'Nachtarbeit 00:00 - 04:00 Uhr bei Beginn vor 00:00 (40 % steuerfrei)' },
          { value: 'sunday', label: 'Sonntagsarbeit (50 % steuerfrei)' },
          { value: 'holiday_standard', label: 'Feiertagsarbeit & 31.12. ab 14 Uhr (125 % steuerfrei)' },
          { value: 'holiday_special', label: 'Besondere Feiertage: 1. Mai, 25./26. Dez, 1. Jan (150 % steuerfrei)' },
        ],
      },
      { id: 'workedHours', label: 'Geleistete begünstigte Stunden', type: 'number', defaultValue: 8, min: 1, max: 100, step: 0.5, unit: 'Stunden' },
    ],
    calculate: (inputs) => {
      const wage = parseFloat(inputs.hourlyWage) || 18.50;
      const type = inputs.surchargeType || 'sunday';
      const hours = parseFloat(inputs.workedHours) || 8;

      let pct = 0.50;
      if (type === 'night_standard') pct = 0.25;
      if (type === 'night_core') pct = 0.40;
      if (type === 'sunday') pct = 0.50;
      if (type === 'holiday_standard') pct = 1.25;
      if (type === 'holiday_special') pct = 1.50;

      // Steuerlich anerkannter Höchstgrundlohn: 50 €/Std.
      // Für Beitragsfreiheit in der Sozialversicherung: max. 25 €/Std.
      const taxBaseWage = Math.min(wage, 50);
      const bonusPerHour = taxBaseWage * pct;
      const totalBonusTaxFree = bonusPerHour * hours;
      const basePayGross = wage * hours;
      const totalPay = basePayGross + totalBonusTaxFree;

      return {
        primary: { id: 'totalBonusTaxFree', label: 'Steuerfreier Zuschlag (Brutto = Netto)', value: totalBonusTaxFree, formattedValue: formatCurrency(totalBonusTaxFree), highlight: true },
        secondary: [
          { id: 'bonusPerHour', label: 'Zuschlag pro Stunde', value: bonusPerHour, formattedValue: `${formatCurrency(bonusPerHour)}/Std.` },
          { id: 'basePayGross', label: 'Regulärer Grundlohn (steuerpflichtig)', value: basePayGross, formattedValue: formatCurrency(basePayGross) },
          { id: 'totalPay', label: 'Gesamtauszahlung Grundlohn + Zuschlag', value: totalPay, formattedValue: formatCurrency(totalPay) },
        ],
        summaryText: `Für ${hours} Stunden erhalten Sie einen steuerfreien Zuschlag von ${formatCurrency(totalBonusTaxFree)} (${formatCurrency(bonusPerHour)}/Std.). Dieser Betrag geht ohne Abzüge direkt aufs Konto!`,
      };
    },
    formula: 'Zuschlag = Grundstundenlohn (max. 50 €) × Begünstigter Prozentsatz × Stunden',
    formulaExplanation: 'Nach § 3b EStG sind Zuschläge für Sonntags-, Feiertags- oder Nachtarbeit bis zu den gesetzlichen Höchstsätzen komplett einkommensteuerfrei.',
    workedExample: {
      title: 'Beispiel: 8 Stunden Sonntagsarbeit bei 18,50 € Stundenlohn (50 %)',
      inputValues: [{ label: 'Stundenlohn', value: '18,50 €' }, { label: 'Stunden', value: '8 h' }, { label: 'Zuschlag', value: '50 %' }],
      steps: ['Zuschlag pro Stunde: 18,50 € × 50 % = 9,25 €', 'Steuerfreier Zuschlag: 8 × 9,25 € = 74,00 €', 'Regulärer Grundlohn = 148,00 € (steuerpflichtig)'],
      result: '74,00 € steuerfreies Extra',
    },
    faqs: [
      { question: 'Können Nacht- und Sonntagszuschläge kombiniert werden?', answer: 'Ja, fällt Sonntagsarbeit mit Nachtarbeit zusammen, können die Zuschläge (z. B. 50 % Sonntag + 25 % Nacht = 75 %) kumuliert steuerfrei gezahlt werden.' },
      { question: 'Gibt es einen gesetzlichen Anspruch auf Sonntagszuschläge?', answer: 'Nein, das Arbeitszeitgesetz schreibt nur für Nachtarbeit zwingend einen angemessenen Zuschlag oder Freizeitausgleich vor (§ 6 Abs. 5 ArbZG). Sonntagszuschläge setzen Tarifvertrag, Betriebsvereinbarung oder Arbeitsvertrag voraus.' },
    ],
    relatedSlugs: ['stundenlohnrechner', 'ueberstunden-auszahlung-rechner', 'teilzeit-gehaltsrechner'],
  },

  {
    id: 'vermoegenswirksame-leistungen-rechner',
    slug: 'vermoegenswirksame-leistungen-rechner',
    name: 'VL-Rechner (Vermögenswirksame Leistungen & Arbeitnehmersparzulage)',
    shortName: 'VL-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'VL Rechner – Vermögenswirksame Leistungen & Arbeitnehmersparzulage 2026',
    metaDescription: 'Berechnen Sie Ihr Sparvermögen durch vermögenswirksame Leistungen (VL bis 40 €/Monat) und staatliche Arbeitnehmersparzulage (neue Einkommensgrenze 40.000 €).',
    h1: 'VL Rechner – Vermögenswirksame Leistungen & staatliche Förderung',
    shortDescription: 'Ermittelt den Vermögensaufbau durch Arbeitgeberzuschuss und staatliche Sparzulage.',
    searchKeywords: ['vermoegenswirksame leistungen rechner', 'arbeitnehmersparzulage grenze 40000', 'vl sparen etf rechner', 'vl arbeitgeber zuschuss'],
    inputs: [
      { id: 'employerVlMonthly', label: 'Monatlicher Arbeitgeberzuschuss zu VL (bis 40 €)', type: 'number', defaultValue: 26.59, min: 0, max: 40, step: 1, unit: '€' },
      { id: 'ownContributionMonthly', label: 'Eigener Sparanteil (um auf volle 40 € aufzustocken)', type: 'number', defaultValue: 13.41, min: 0, max: 100, step: 1, unit: '€' },
      { id: 'investmentYears', label: 'Vertragslaufzeit in Jahren (Standard 6 Jahre sparen + 1 Jahr Ruhe)', type: 'number', defaultValue: 7, min: 1, max: 20, step: 1, unit: 'Jahre' },
      { id: 'interestRatePct', label: 'Angenommene jährliche Rendite (z. B. ETF-Sparplan ca. 6 %)', type: 'number', defaultValue: 6.0, min: 0, max: 12, step: 0.5, unit: '%' },
      {
        id: 'eligibleForStateSubsidy',
        label: 'Anspruch auf Arbeitnehmersparzulage (zvE unter 40.000 € / 80.000 € bei Ehepaaren)',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Ja (20 % staatliche Förderung auf Aktien/ETF-Fondssparen)' },
          { value: 'no', label: 'Nein (Einkommensgrenze überschritten)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const ag = parseFloat(inputs.employerVlMonthly) || 26.59;
      const own = parseFloat(inputs.ownContributionMonthly) || 13.41;
      const years = parseInt(inputs.investmentYears, 10) || 7;
      const r = (parseFloat(inputs.interestRatePct) || 6.0) / 100;
      const isEligible = inputs.eligibleForStateSubsidy === 'yes';

      const monthlyTotal = ag + own;
      // Bei 7 Jahren: 6 Jahre Einzahlung (72 Monate), 1 Jahr Ruhe
      const depositMonths = Math.min(years * 12, 72);
      let balance = 0;
      for (let m = 0; m < years * 12; m++) {
        if (m < depositMonths) balance += monthlyTotal;
        balance *= (1 + (r / 12));
      }

      // Arbeitnehmersparzulage: 20 % auf max 400 € jährliche Einzahlung = max. 80 €/Jahr
      const yearlyStateBonus = isEligible ? Math.min(80, (monthlyTotal * 12) * 0.20) : 0;
      const totalStateBonus = yearlyStateBonus * (depositMonths / 12);
      const totalEndCapital = balance + totalStateBonus;
      const totalEmployerContribution = ag * depositMonths;

      return {
        primary: { id: 'totalEndCapital', label: 'Voraussichtliches Endkapital', value: totalEndCapital, formattedValue: formatCurrency(totalEndCapital), highlight: true },
        secondary: [
          { id: 'totalEmployerContribution', label: 'Geschenkt vom Arbeitgeber', value: totalEmployerContribution, formattedValue: formatCurrency(totalEmployerContribution) },
          { id: 'totalStateBonus', label: 'Geschenkt vom Staat (Sparzulage)', value: totalStateBonus, formattedValue: formatCurrency(totalStateBonus) },
          { id: 'profit', label: 'Zinsen & Kursgewinne', value: totalEndCapital - (monthlyTotal * depositMonths) - totalStateBonus, formattedValue: formatCurrency(totalEndCapital - (monthlyTotal * depositMonths) - totalStateBonus) },
        ],
        summaryText: `Nach ${years} Jahren haben Sie rund ${formatCurrency(totalEndCapital)} angespart. Davon hat der Arbeitgeber ${formatCurrency(totalEmployerContribution)} und der Staat ${formatCurrency(totalStateBonus)} beigesteuert!`,
      };
    },
    formula: 'Endkapital = Zinseszins auf VL-Monatsraten + Arbeitnehmersparzulage',
    formulaExplanation: 'Seit 2024 wurden die Einkommensgrenzen für die Arbeitnehmersparzulage auf 40.000 € (Alleinstehende) bzw. 80.000 € (Verheiratete) verdoppelt, sodass Millionen Beschäftigte anspruchsberechtigt sind.',
    workedExample: {
      title: 'Beispiel: 40 € Monatssparen über 7 Jahre bei 6 % ETF-Rendite',
      inputValues: [{ label: 'Sparrate', value: '40 €/Monat' }, { label: 'Laufzeit', value: '7 Jahre' }],
      steps: ['Eigene & AG-Einzahlungen in 6 Jahren: 2.880 €', 'Zulage: 6 × 80 € = 480 €', 'Zinseszins bei 6 % ≈ 850 €', 'Gesamtkapital ≈ 4.210 €'],
      result: 'ca. 4.210,00 € Endkapital',
    },
    faqs: [
      { question: 'Verfällt der Arbeitgeberzuschuss, wenn man keinen Vertrag hat?', answer: 'Ja, VL-Zuschüsse des Arbeitgebers verfallen ersatzlos, wenn der Arbeitnehmer keinen berechtigten Sparvertrag vorlegt.' },
      { question: 'Kann man VL in einen ETF-Sparplan anlegen?', answer: 'Ja, VL-Aktienfonds- und ETF-Sparpläne gehören zu den beliebtesten und rentabelsten Anlageformen für vermögenswirksame Leistungen.' },
    ],
    relatedSlugs: ['betriebliche-altersvorsorge-rechner', 'teilzeit-gehaltsrechner', 'etf-sparplan-rechner'],
  },

  {
    id: 'betriebliche-altersvorsorge-rechner',
    slug: 'betriebliche-altersvorsorge-rechner',
    name: 'Betriebliche-Altersvorsorge-Rechner (bAV) (bAV & 15 % AG-Zuschuss)',
    shortName: 'bAV-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Betriebliche Altersvorsorge Rechner – bAV Entgeltumwandlung & Ersparnis',
    metaDescription: 'Berechnen Sie den Nettoaufwand einer bAV-Entgeltumwandlung inklusive gesetzlichem 15 % Arbeitgeberpflichtzuschuss nach § 1a BetrAVG.',
    h1: 'Betriebliche Altersvorsorge Rechner – Entgeltumwandlung & Zuschuss',
    shortDescription: 'Ermittelt die Steuer- und Sozialversicherungsersparnis bei betrieblicher Entgeltumwandlung.',
    searchKeywords: ['betriebliche altersvorsorge rechner', 'bav entgeltumwandlung netto aufwand', '15 prozent arbeitgeberzuschuss bav', 'paragraph 1a betravg rechner'],
    inputs: [
      { id: 'monthlyGross', label: 'Monatliches Bruttogehalt', type: 'number', defaultValue: 3800, min: 1000, step: 100, unit: '€' },
      { id: 'employeeConversion', label: 'Eigene Entgeltumwandlung aus dem Brutto', type: 'number', defaultValue: 150, min: 25, max: 300, step: 25, unit: '€' },
      { id: 'employerMandatoryPct', label: 'Arbeitgeber-Pflichtzuschuss (mind. 15 %)', type: 'number', defaultValue: 15, min: 15, max: 50, step: 5, unit: '%' },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 3800;
      const conversion = parseFloat(inputs.employeeConversion) || 150;
      const agPct = (parseFloat(inputs.employerMandatoryPct) || 15) / 100;

      const agZuschuss = conversion * agPct;
      const totalMonthlyContribution = conversion + agZuschuss;
      // Durch Abzug vom Brutto spart man Steuern (ca. 30%) und Sozialabgaben (ca. 20%) -> ca. 48% Ersparnis
      const effectiveNetCost = conversion * 0.52;
      const subsidyAdvantage = totalMonthlyContribution - effectiveNetCost;

      return {
        primary: { id: 'totalMonthlyContribution', label: 'Monatlicher Sparbeitrag in die bAV-Rente', value: totalMonthlyContribution, formattedValue: formatCurrency(totalMonthlyContribution), highlight: true },
        secondary: [
          { id: 'effectiveNetCost', label: 'Tatsächlicher Netto-Eigenaufwand', value: effectiveNetCost, formattedValue: formatCurrency(effectiveNetCost) },
          { id: 'agZuschuss', label: 'Arbeitgeberzuschuss geschenkt', value: agZuschuss, formattedValue: formatCurrency(agZuschuss) },
          { id: 'taxSvSaving', label: 'Ersparte Steuern & Sozialabgaben', value: conversion - effectiveNetCost, formattedValue: formatCurrency(conversion - effectiveNetCost) },
        ],
        summaryText: `Für nur ${formatCurrency(effectiveNetCost)} Nettoverzicht fließen jeden Monat ${formatCurrency(totalMonthlyContribution)} in Ihre Betriebsrente (inkl. ${formatCurrency(agZuschuss)} Arbeitgeberzuschuss).`,
      };
    },
    formula: 'Sparbeitrag = Eigene Umwandlung + AG-Zuschuss; Nettoaufwand ≈ 50 % der Umwandlung',
    formulaExplanation: 'Nach § 1a Abs. 1a BetrAVG ist der Arbeitgeber gesetzlich verpflichtet, 15 % der umgewandelten Summe als Zuschuss weiterzugeben, soweit er Sozialversicherungsbeiträge spart.',
    workedExample: {
      title: 'Beispiel: 150 € bAV-Umwandlung bei 15 % Pflichtzuschuss',
      inputValues: [{ label: 'Eigene Umwandlung', value: '150 €' }, { label: 'AG-Zuschuss', value: '15 % (22,50 €)' }],
      steps: ['Sparbeitrag in den Vertrag: 150 € + 22,50 € = 172,50 €', 'Steuer- und SV-Ersparnis ca. 72 €', 'Tatsächlicher Netto-Abzug ca. 78,00 €'],
      result: '172,50 € Sparbeitrag bei nur 78 € Nettoverzicht',
    },
    faqs: [
      { question: 'Gilt der 15 % Arbeitgeberzuschuss für alle bAV-Verträge?', answer: 'Ja, für alle Direktversicherungen, Pensionskassen und Pensionsfonds im Rahmen der Entgeltumwandlung ist der Zuschuss gesetzliche Pflicht.' },
      { question: 'Wie wird die Betriebsrente im Alter besteuert?', answer: 'Die bAV unterliegt im Rentenalter der nachgelagerten Besteuerung mit dem dann meist niedrigeren persönlichen Steuersatz und Beiträgen zur Kranken- und Pflegeversicherung.' },
    ],
    relatedSlugs: ['vermoegenswirksame-leistungen-rechner', 'teilzeit-gehaltsrechner', 'renteneintritt-rechner'],
  },

  {
    id: 'jahresgehalt-in-monatsgehalt-rechner',
    slug: 'jahresgehalt-in-monatsgehalt-rechner',
    name: 'Jahresgehalt-in-Monatsgehalt-Rechner (12, 13 oder 14 Gehälter)',
    shortName: 'Jahresgehalt-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Jahresgehalt in Monatsgehalt Rechner – 12, 13, 13,5 oder 14 Gehälter',
    metaDescription: 'Rechnen Sie Ihr Jahresbruttogehalt in das monatliche Grundgehalt um unter Berücksichtigung von Weihnachtsgeld, Urlaubsgeld und 13. Monatsgehalt.',
    h1: 'Jahresgehalt in Monatsgehalt Rechner – Monatsbrutto ermitteln',
    shortDescription: 'Schlüsselt das Jahreszielgehalt in monatliche Grundgehälter und Sonderzahlungen auf.',
    searchKeywords: ['jahresgehalt in monatsgehalt rechner', 'jahresbrutto in monatsbrutto umrechnen', '13 gehälter jahresgehalt aufteilen', 'weihnachtsgeld urlaubsgeld monatsgehalt'],
    inputs: [
      { id: 'yearlyGross', label: 'Gesamtes Jahresbruttogehalt', type: 'number', defaultValue: 60000, min: 10000, step: 2500, unit: '€' },
      {
        id: 'salaryCount',
        label: 'Anzahl Monatsgehälter pro Jahr',
        type: 'select',
        defaultValue: '12',
        options: [
          { value: '12', label: '12 Monatsgehälter (Keine festen Sonderzahlungen)' },
          { value: '13', label: '13 Monatsgehälter (Inkl. vollem 13. Monatsgehalt / Weihnachtsgeld)' },
          { value: '13.5', label: '13,5 Monatsgehälter (z. B. IGBCE / Chemie-Tarif)' },
          { value: '14', label: '14 Monatsgehälter (Österreich / Banken / Handel)' },
        ],
      },
    ],
    calculate: (inputs) => {
      const yearly = parseFloat(inputs.yearlyGross) || 60000;
      const count = parseFloat(inputs.salaryCount) || 12;
      const monthlyBase = yearly / count;
      const extraPayTotal = yearly - (monthlyBase * 12);

      return {
        primary: { id: 'monthlyBase', label: 'Monatliches Grundgehalt (brutto)', value: monthlyBase, formattedValue: formatCurrency(monthlyBase), highlight: true },
        secondary: [
          { id: 'extraPayTotal', label: 'Jährliche Sonderzahlungen (Urlaubs-/Weihnachtsgeld)', value: extraPayTotal, formattedValue: formatCurrency(extraPayTotal) },
          { id: 'count', label: 'Faktor Monatsgehälter', value: count, formattedValue: `${count} Gehälter` },
        ],
        summaryText: `Bei einem Jahresgehalt von ${formatCurrency(yearly)} und ${count} Gehältern beträgt Ihr monatliches Grundgehalt ${formatCurrency(monthlyBase)} (zzgl. ${formatCurrency(extraPayTotal)} Sonderzahlungen).`,
      };
    },
    formula: 'Monatsgrundgehalt = Jahresbruttogehalt / Anzahl Gehälter',
    formulaExplanation: 'Im Vorstellungsgespräch und im Arbeitsvertrag wird meist das Jahresgehalt verhandelt. Die Auszahlung erfolgt je nach Tarifvertrag aufgeteilt auf 12 bis 14 Tranchen.',
    workedExample: {
      title: 'Beispiel: 60.000 € Jahresgehalt bei 13 Monatsgehältern',
      inputValues: [{ label: 'Jahresgehalt', value: '60.000 €' }, { label: 'Gehälter', value: '13' }],
      steps: ['Monatsgehalt: 60.000 € / 13 = 4.615,38 €', 'Weihnachtsgeld (13. Gehalt) = 4.615,38 €'],
      result: '4.615,38 € Monatsgehalt',
    },
    faqs: [
      { question: 'Gibt es einen gesetzlichen Anspruch auf ein 13. Monatsgehalt?', answer: 'Nein, ein Anspruch besteht nur, wenn dies im Tarifvertrag, einer Betriebsvereinbarung oder im Arbeitsvertrag ausdrücklich vereinbart ist.' },
      { question: 'Werden Sonderzahlungen höher besteuert?', answer: 'Sonderzahlungen werden als sonstige Bezüge nach der Jahrestabelle besteuert. Sie unterliegen dem vollen Grenzsteuersatz, aber keinem gesonderten Strafsteuersatz.' },
    ],
    relatedSlugs: ['stundenlohnrechner', 'teilzeit-gehaltsrechner', 'gehaltserhoehung-rechner'],
  },

  {
    id: 'brutto-stundensatz-freiberufler-rechner',
    slug: 'brutto-stundensatz-freiberufler-rechner',
    name: 'Stundensatz-Rechner für Freiberufler & Selbstständige',
    shortName: 'Freiberufler Stundensatz',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Stundensatz Rechner Selbstständige – Honorar für Freelancer kalkulieren',
    metaDescription: 'Berechnen Sie den erforderlichen Mindeststundensatz für Freelancer und Selbstständige unter Einbezug von Urlaub, Krankheit, Akquise, Altersvorsorge und Fixkosten.',
    h1: 'Stundensatz Rechner – Honorar für Freelancer & Selbstständige',
    shortDescription: 'Kalkuliert den kostendeckenden Stundensatz auf Basis des gewünschten Nettoeinkommens.',
    searchKeywords: ['stundensatz rechner freiberufler', 'freelancer stundensatz kalkulieren', 'mindesthonorar selbststaendige berechnen', 'honorarsatz kalkulation formel'],
    inputs: [
      { id: 'desiredNetMonthly', label: 'Gewünschtes monatliches Nettoeinkommen zum Leben', type: 'number', defaultValue: 3200, min: 1000, step: 200, unit: '€' },
      { id: 'monthlyBusinessCosts', label: 'Betriebliche Fixkosten pro Monat (Büro, Software, Steuerberater)', type: 'number', defaultValue: 650, min: 0, step: 50, unit: '€' },
      { id: 'privateHealthInsurance', label: 'Private/Freiwillige Kranken- & Pflegeversicherung pro Monat', type: 'number', defaultValue: 550, min: 200, max: 1200, step: 50, unit: '€' },
      { id: 'pensionSavingsMonthly', label: 'Rücklage für Altersvorsorge pro Monat', type: 'number', defaultValue: 500, min: 100, step: 50, unit: '€' },
      { id: 'billableHoursPct', label: 'Fakturierbare Arbeitszeit (üblich ca. 50 % - 65 % wegen Akquise/Büro)', type: 'number', defaultValue: 60, min: 30, max: 90, step: 5, unit: '%' },
    ],
    calculate: (inputs) => {
      const netLife = parseFloat(inputs.desiredNetMonthly) || 3200;
      const bizCost = parseFloat(inputs.monthlyBusinessCosts) || 650;
      const pkv = parseFloat(inputs.privateHealthInsurance) || 550;
      const pension = parseFloat(inputs.pensionSavingsMonthly) || 500;
      const billablePct = (parseFloat(inputs.billableHoursPct) || 60) / 100;

      // Steuerpuffer ca. 28-35% Einkommensteuer auf den Gewinn
      const totalNeededMonthlyPreTax = ((netLife + pkv + pension) / 0.70) + bizCost;
      const totalNeededYearly = totalNeededMonthlyPreTax * 12;

      // Reale Arbeitstage: 250 Werktage - 30 Tage Urlaub/Fortbildung - 10 Tage Krankheit = 210 Tage
      const productiveDays = 210;
      const totalWorkHours = productiveDays * 8; // 1.680 Stunden
      const billableHoursYearly = totalWorkHours * billablePct; // z. B. ca. 1.000 Stunden

      const requiredHourlyRate = totalNeededYearly / billableHoursYearly;

      return {
        primary: { id: 'requiredHourlyRate', label: 'Empfohlener Mindest-Stundensatz (netto)', value: requiredHourlyRate, formattedValue: `${formatCurrency(requiredHourlyRate)}/Std.`, highlight: true },
        secondary: [
          { id: 'billableHoursYearly', label: 'Fakturierbare Stunden pro Jahr', value: billableHoursYearly, formattedValue: `ca. ${formatNumber(billableHoursYearly, 0)} Std.` },
          { id: 'dailyRate', label: 'Empfohlener Tagessatz (8 Std.)', value: requiredHourlyRate * 8, formattedValue: formatCurrency(requiredHourlyRate * 8) },
          { id: 'totalNeededYearly', label: 'Benötigter Jahresumsatz (netto)', value: totalNeededYearly, formattedValue: formatCurrency(totalNeededYearly) },
        ],
        summaryText: `Um ${formatCurrency(netLife)} Netto zu leben, benötigen Sie bei ${formatPercent(billablePct * 100, 0)} abrechenbarer Zeit einen Mindeststundensatz von ${formatCurrency(requiredHourlyRate)} (Tagessatz: ${formatCurrency(requiredHourlyRate * 8)}).`,
      };
    },
    formula: 'Stundensatz = Benötigter Jahresumsatz / Abrechenbare Projektstunden',
    formulaExplanation: 'Freelancer können selten mehr als 55 % bis 65 % ihrer Arbeitszeit direkt an Kunden fakturieren. Der Rest entfällt auf Akquise, Buchhaltung, Fortbildung, Krankheit und Urlaub.',
    workedExample: {
      title: 'Beispiel: 3.200 € Nettoziel bei 1.000 abrechenbaren Stunden/Jahr',
      inputValues: [{ label: 'Nettoziel', value: '3.200 €/Monat' }, { label: 'Fixkosten & Vorsorge', value: '1.700 €/Monat' }],
      steps: ['Benötigter Jahresumsatz ca. 85.000 €', 'Abrechenbare Stunden = 1.008 h', 'Stundensatz = 85.000 € / 1.008 h ≈ 84,30 €/Std.'],
      result: 'ca. 85,00 € Netto-Stundensatz',
    },
    faqs: [
      { question: 'Kommt auf den Stundensatz noch Mehrwertsteuer?', answer: 'Ja, sofern Sie kein Kleinunternehmer nach § 19 UStG sind, stellen Sie Ihren Kunden den Stundensatz zzgl. 19 % Umsatzsteuer in Rechnung.' },
      { question: 'Warum scheitern viele Freelancer mit Stundensätzen unter 50 €?', answer: 'Weil nach Abzug von Einkommensteuer, Krankenkasse (ca. 500-900 €), Altersvorsorge und unbezahlten Urlaubs- und Krankheitstagen oft weniger als der Mindestlohn übrig bleibt.' },
    ],
    relatedSlugs: ['stundenlohnrechner', 'teilzeit-gehaltsrechner', 'jahresgehalt-in-monatsgehalt-rechner'],
  },

  {
    id: 'urlaubsabgeltung-rechner',
    slug: 'urlaubsabgeltung-rechner',
    name: 'Urlaubsabgeltungs-Rechner (§ 11 BUrlG bei Kündigung)',
    shortName: 'Urlaubsabgeltung berechnen',
    category: 'arbeit-gehalt',
    subcategory: 'Urlaub & Arbeitszeit',
    metaTitle: 'Urlaubsabgeltung Rechner – Resturlaub bei Kündigung auszahlen (§ 11 BUrlG)',
    metaDescription: 'Berechnen Sie Ihren Auszahlungsanspruch für verbleibende Resturlaubstage bei Ausscheiden aus dem Unternehmen nach § 11 Bundesurlaubsgesetz.',
    h1: 'Urlaubsabgeltung Rechner – Resturlaub in Geld umrechnen',
    shortDescription: 'Kalkuliert die finanzielle Abgeltung nicht genommener Urlaubstage bei Beendigung des Arbeitsverhältnisses.',
    searchKeywords: ['urlaubsabgeltung rechner', 'resturlaub auszahlen lassen formel', 'paragraph 11 burlg urlaubsentgelt', 'urlaubstage auszahlung brutto'],
    inputs: [
      { id: 'monthlyGross', label: 'Reguläres Bruttomonatsgehalt der letzten 13 Wochen', type: 'number', defaultValue: 3500, min: 800, step: 100, unit: '€' },
      { id: 'remainingDays', label: 'Auszuzahlende Resturlaubstage', type: 'number', defaultValue: 12, min: 1, max: 60, step: 0.5, unit: 'Tage' },
      { id: 'workDaysPerWeek', label: 'Arbeitstage pro Woche (Standard 5-Tage-Woche)', type: 'number', defaultValue: 5, min: 1, max: 6, step: 1, unit: 'Tage' },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.monthlyGross) || 3500;
      const days = parseFloat(inputs.remainingDays) || 12;
      const daysPerWeek = parseInt(inputs.workDaysPerWeek, 10) || 5;

      // Gesetzliche Formel nach § 11 Abs. 1 BUrlG:
      // Verdienst der letzten 13 Wochen = Monatsgehalt × 3
      // Arbeitstage in 13 Wochen = Tage/Woche × 13 (z. B. 5 × 13 = 65 Tage)
      const quarterlyEarnings = gross * 3;
      const quarterlyWorkDays = daysPerWeek * 13;
      const dailyVacationPay = quarterlyEarnings / quarterlyWorkDays;
      const totalGrossCompensation = dailyVacationPay * days;
      const estimatedNetCompensation = totalGrossCompensation * 0.55;

      return {
        primary: { id: 'totalGrossCompensation', label: 'Brutto-Urlaubsabgeltung', value: totalGrossCompensation, formattedValue: formatCurrency(totalGrossCompensation), highlight: true },
        secondary: [
          { id: 'estimatedNetCompensation', label: 'Geschätzte Nettoauszahlung', value: estimatedNetCompensation, formattedValue: formatCurrency(estimatedNetCompensation) },
          { id: 'dailyVacationPay', label: 'Wert pro Urlaubstag', value: dailyVacationPay, formattedValue: formatCurrency(dailyVacationPay) },
        ],
        summaryText: `Für ${days} Resturlaubstage erhalten Sie nach § 11 BUrlG eine Abgeltung von ${formatCurrency(totalGrossCompensation)} brutto (ca. ${formatCurrency(estimatedNetCompensation)} netto ausgezahlt).`,
      };
    },
    formula: 'Urlaubsabgeltung = Resturlaubstage × [(Monatsbrutto × 3) / (Wochentage × 13)]',
    formulaExplanation: 'Kann der Urlaub wegen Beendigung des Arbeitsverhältnisses ganz oder teilweise nicht mehr gewährt werden, so ist er nach § 7 Abs. 4 BUrlG zwingend abzugelten.',
    workedExample: {
      title: 'Beispiel: 12 Tage Resturlaub bei 3.500 € Gehalt (5-Tage-Woche)',
      inputValues: [{ label: 'Gehalt', value: '3.500 €' }, { label: 'Resturlaub', value: '12 Tage' }],
      steps: ['Verdienst 13 Wochen = 10.500 €', 'Arbeitstage in 13 Wochen = 65 Tage', 'Tagessatz = 10.500 € / 65 = 161,54 €/Tag', 'Gesamt = 12 × 161,54 € = 1.938,46 €'],
      result: '1.938,46 € Bruttoabgeltung',
    },
    faqs: [
      { question: 'Darf der Arbeitgeber verlangen, den Urlaub abzufeiern?', answer: 'Ja, der Freizeitausgleich hat gesetzlich Vorrang vor der finanziellen Abgeltung, sofern dies vor Beendigung des Arbeitsverhältnisses noch möglich ist.' },
      { question: 'Unterliegt Urlaubsabgeltung der Sozialversicherung?', answer: 'Ja, Urlaubsabgeltung gilt sozialversicherungsrechtlich als einmalig gezahltes Arbeitsentgelt und unterliegt den normalen Beiträgen zur Kranken-, Renten- und Pflegeversicherung.' },
    ],
    relatedSlugs: ['urlaubstage-rechner', 'kuendigungsfrist-arbeitnehmer-rechner', 'abfindung-fuenftelregelung-rechner'],
  },

  {
    id: 'arbeitslosengeld-1-rechner',
    slug: 'arbeitslosengeld-1-rechner',
    name: 'Arbeitslosengeld-1-Rechner (ALG I) (ALG I Anspruch nach SGB III)',
    shortName: 'ALG 1-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Arbeitslosengeld 1 Rechner – ALG I Höhe & Anspruchsdauer SGB III',
    metaDescription: 'Berechnen Sie die genaue Höhe Ihres Arbeitslosengeldes (60 % ohne Kinder, 67 % mit Kindern) sowie die Anspruchsdauer nach Alter und Beschäftigungszeit.',
    h1: 'Arbeitslosengeld 1 Rechner – ALG I Anspruch online berechnen',
    shortDescription: 'Ermittelt das monatliche Arbeitslosengeld 1 und die maximale Bezugsdauer.',
    searchKeywords: ['arbeitslosengeld 1 rechner', 'alg 1 wie viel netto rechner', 'paragraph 149 sgb iii bemessungsentgelt', 'anspruchsdauer arbeitslosengeld monate'],
    inputs: [
      { id: 'avgGrossMonthly', label: 'Durchschnittliches Bruttomonatsgehalt der letzten 12 Monate', type: 'number', defaultValue: 3400, min: 600, step: 100, unit: '€' },
      { id: 'taxClass', label: 'Lohnsteuerklasse', type: 'select', defaultValue: '1', options: [
        { value: '1', label: 'Steuerklasse 1 oder 4' },
        { value: '3', label: 'Steuerklasse 3' },
      ]},
      { id: 'hasChildren', label: 'Kinder / Leistungssatz', type: 'select', defaultValue: 'no', options: [
        { value: 'no', label: 'Keine Kinder (Allgemeiner Leistungssatz: 60 %)' },
        { value: 'yes', label: 'Mindestens 1 Kind (Erhöhter Leistungssatz: 67 %)' },
      ]},
      { id: 'ageYears', label: 'Ihr Lebensalter bei Antragstellung', type: 'number', defaultValue: 35, min: 18, max: 67, step: 1, unit: 'Jahre' },
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.avgGrossMonthly) || 3400;
      const rate = inputs.hasChildren === 'yes' ? 0.67 : 0.60;
      const age = parseInt(inputs.ageYears, 10) || 35;

      // Pauschaliertes Nettoentgelt nach § 153 SGB III
      const dailyGross = gross / 30;
      const dailyPauschalNet = dailyGross * (inputs.taxClass === '3' ? 0.70 : 0.62);
      const dailyAlg = dailyPauschalNet * rate;
      const monthlyAlg = dailyAlg * 30;

      // Anspruchsdauer nach § 147 SGB III:
      let maxMonths = 12;
      if (age >= 58) maxMonths = 24;
      else if (age >= 55) maxMonths = 18;
      else if (age >= 50) maxMonths = 15;

      return {
        primary: { id: 'monthlyAlg', label: 'Monatliches Arbeitslosengeld 1 (ALG I)', value: monthlyAlg, formattedValue: formatCurrency(monthlyAlg), highlight: true },
        secondary: [
          { id: 'dailyAlg', label: 'Täglicher Leistungssatz', value: dailyAlg, formattedValue: formatCurrency(dailyAlg) },
          { id: 'maxMonths', label: 'Maximale Bezugsdauer (bei Vorbeschäftigung)', value: maxMonths, formattedValue: `${maxMonths} Monate` },
          { id: 'ratePct', label: 'Angewandter Leistungssatz', value: rate * 100, formattedValue: formatPercent(rate * 100, 0) },
        ],
        summaryText: `Sie erhalten ca. ${formatCurrency(monthlyAlg)} monatliches Arbeitslosengeld 1 (${formatCurrency(dailyAlg)} pro Tag) für eine Höchstdauer von bis zu ${maxMonths} Monaten.`,
      };
    },
    formula: 'ALG I = Pauschaliertes tägliches Nettoentgelt × 60 % (bzw. 67 % mit Kind) × 30',
    formulaExplanation: 'Während des ALG-I-Bezugs übernimmt die Bundesagentur für Arbeit die Beiträge zur gesetzlichen Kranken-, Pflege- und Rentenversicherung in voller Höhe.',
    workedExample: {
      title: 'Beispiel: 3.400 € Brutto ohne Kinder (60 %)',
      inputValues: [{ label: 'Brutto', value: '3.400 €' }, { label: 'Kinder', value: 'Keine' }],
      steps: ['Pauschaliertes Netto ca. 2.108 €', '60 % Leistungssatz = 1.264,80 € monatlich'],
      result: 'ca. 1.265,00 € monatliches ALG 1',
    },
    faqs: [
      { question: 'Wann droht eine Sperrzeit beim ALG 1?', answer: 'Bei Eigenkündigung oder Aufhebungsvertrag ohne wichtigen Grund verhängt die Arbeitsagentur nach § 159 SGB III in der Regel eine Sperrzeit von 12 Wochen.' },
      { question: 'Wie lange muss man eingezahlt haben, um ALG 1 zu bekommen?', answer: 'In der Rahmenfrist von 30 Monaten muss man mindestens 12 Monate versicherungspflichtig beschäftigt gewesen sein (Anwartschaftszeit).' },
    ],
    relatedSlugs: ['buergergeld-anspruch-rechner', 'teilzeit-gehaltsrechner', 'kurzarbeitergeld-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundesagentur für Arbeit (§ 149, § 151 SGB III)',
      sourceUrl: 'https://www.arbeitsagentur.de',
      lastVerified: '2026-01-15',
    },
  },

  {
    id: 'buergergeld-anspruch-rechner',
    slug: 'buergergeld-anspruch-rechner',
    name: 'Bürgergeld-Rechner (Regelsatz & Kosten der Unterkunft SGB II)',
    shortName: 'Bürgergeld-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Bürgergeld Rechner 2026 – Regelsatz, Miete & Anspruch berechnen',
    metaDescription: 'Berechnen Sie Ihren Bürgergeld-Bedarf nach SGB II: Gesetzliche Regelbedarfe (563 € für Alleinstehende) plus Kosten für Warmmiete und Heizung.',
    h1: 'Bürgergeld Rechner – Gesetzlichen Bürgergeld-Anspruch ermitteln',
    shortDescription: 'Kalkuliert den monatlichen Gesamtbedarf nach SGB II aus Regelsatz und Wohnkosten.',
    searchKeywords: ['buergergeld rechner 2026', 'regelsatz buergergeld alleinerziehend', 'kosten der unterkunft kdu buergergeld', 'sgb ii anspruch berechnen'],
    inputs: [
      {
        id: 'householdType',
        label: 'Haushaltsform',
        type: 'select',
        defaultValue: 'single',
        options: [
          { value: 'single', label: 'Alleinstehend / Alleinerziehend (563 € Regelsatz)' },
          { value: 'couple', label: 'Paar / Lebenspartner je Partner (506 € = 1.012 € gesamt)' },
        ],
      },
      { id: 'childrenCount', label: 'Anzahl Kinder im Haushalt', type: 'number', defaultValue: 1, min: 0, max: 6, step: 1 },
      { id: 'warmRentActual', label: 'Tatsächliche Warmmiete (inkl. Heizung)', type: 'number', defaultValue: 720, min: 100, step: 25, unit: '€' },
      { id: 'earnedNetIncome', label: 'Eigenes monatliches Nettoeinkommen (nach Freibetrag)', type: 'number', defaultValue: 0, min: 0, step: 50, unit: '€' },
    ],
    calculate: (inputs) => {
      const isSingle = inputs.householdType === 'single';
      const kids = parseInt(inputs.childrenCount, 10) || 0;
      const rent = parseFloat(inputs.warmRentActual) || 720;
      const earned = parseFloat(inputs.earnedNetIncome) || 0;

      const adultRegel = isSingle ? 563 : 1012;
      const childRegelAvg = kids * 390; // Durchschnitt Regelbedarf Kind ca. 390 €
      const totalRegel = adultRegel + childRegelAvg;
      const totalDemand = totalRegel + rent;
      const finalBenefit = Math.max(0, totalDemand - earned);

      return {
        primary: { id: 'finalBenefit', label: 'Monatlicher Bürgergeld-Auszahlungsanspruch', value: finalBenefit, formattedValue: formatCurrency(finalBenefit), highlight: true },
        secondary: [
          { id: 'totalRegel', label: 'Gesamter Regelbedarf', value: totalRegel, formattedValue: formatCurrency(totalRegel) },
          { id: 'rentShare', label: 'Übernommene Kosten für Miete & Heizung (KdU)', value: rent, formattedValue: formatCurrency(rent) },
          { id: 'totalDemand', label: 'Gesamtbedarf des Haushalts', value: totalDemand, formattedValue: formatCurrency(totalDemand) },
        ],
        summaryText: `Ihr Gesamtbedarf nach SGB II liegt bei ${formatCurrency(totalDemand)} (${formatCurrency(totalRegel)} Regelsatz + ${formatCurrency(rent)} Wohnkosten). Bei ${formatCurrency(earned)} anrechenbarem Einkommen beträgt der Anspruch ${formatCurrency(finalBenefit)}.`,
      };
    },
    formula: 'Bürgergeld = Regelbedarf + Kosten der Unterkunft - anrechenbares Einkommen',
    formulaExplanation: 'Im ersten Jahr des Bürgergeldbezugs gilt eine Karenzzeit für Wohnen und Vermögen: Die tatsächlichen Wohnkosten werden in voller Höhe übernommen.',
    workedExample: {
      title: 'Beispiel: Alleinstehend mit 1 Kind und 720 € Warmmiete',
      inputValues: [{ label: 'Typ', value: 'Alleinstehend' }, { label: 'Kinder', value: '1 Kind' }, { label: 'Warmmiete', value: '720 €' }],
      steps: ['Regelsatz Erwachsene = 563 €', 'Regelsatz Kind ca. = 390 €', 'Wohnkosten = 720 €', 'Gesamtanspruch = 1.673 € monatlich'],
      result: '1.673,00 € monatlicher Anspruch',
    },
    faqs: [
      { question: 'Wie viel Schonvermögen darf man beim Bürgergeld behalten?', answer: 'In der einjährigen Karenzzeit gilt ein Freibetrag von 40.000 € für die erste Person und 15.000 € für jede weitere Person der Bedarfsgemeinschaft. Danach gilt ein fester Vermögensfreibetrag von 15.000 € pro Person.' },
      { question: 'Übernimmt das Jobcenter auch Stromkosten?', answer: 'Nein, normaler Haushaltsstrom ist aus dem monatlichen Regelbedarf zu bestreiten. Nur Heizkosten werden gesondert übernommen.' },
    ],
    relatedSlugs: ['arbeitslosengeld-1-rechner', 'warmmiete-zu-kaltmiete-rechner', 'teilzeit-gehaltsrechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Bundesministerium für Arbeit und Soziales (§ 20 SGB II)',
      sourceUrl: 'https://www.bmas.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'dienstjubilaeum-steuerfrei-rechner',
    slug: 'dienstjubilaeum-steuerfrei-rechner',
    name: 'Sachbezug- & Jubiläumsgeschenk-Rechner (50 € & 60 € Freigrenzen)',
    shortName: 'Sachbezug 50 €-Rechner',
    category: 'arbeit-gehalt',
    subcategory: 'Gehalt & Netto',
    metaTitle: 'Sachbezug Rechner 2026 – Monatliche 50 € Freigrenze & 60 € Geschenke',
    metaDescription: 'Prüfen Sie steuerfreie Sachbezüge nach § 8 Abs. 2 EStG (50 € monatliche Sachbezugsgrenze) und Aufmerksamkeiten zu persönlichen Anlässen bis 60 €.',
    h1: 'Sachbezug Rechner – Steuerfreie Mitarbeitergutscheine & Geschenke',
    shortDescription: 'Prüft die Einhaltung der steuer- und abgabenfreien Sachbezugsfreigrenzen.',
    searchKeywords: ['sachbezug 50 euro rechner', 'gutschein arbeitgeber steuerfrei 50 euro', 'aufmerksamkeiten geburtstag 60 euro estg', 'sachbezugsgrenze paragraph 8 estg'],
    inputs: [
      { id: 'monthlyVoucherValue', label: 'Wert des monatlichen Gutscheins / Sachbezugs (z. B. Tankgutschein)', type: 'number', defaultValue: 50, min: 10, max: 150, step: 5, unit: '€' },
      { id: 'specialOccasionValue', label: 'Geschenk zu persönlichem Anlass (Geburtstag, Jubiläum, Hochzeit)', type: 'number', defaultValue: 60, min: 0, max: 200, step: 5, unit: '€' },
    ],
    calculate: (inputs) => {
      const monthly = parseFloat(inputs.monthlyVoucherValue) || 50;
      const special = parseFloat(inputs.specialOccasionValue) || 60;

      // Nach § 8 Abs. 2 Satz 11 EStG: Freigrenze genau 50,00 € (bei 50,01 € wird ALLES steuerpflichtig!)
      const monthlyTaxFree = monthly <= 50.00;
      // Nach R 19.6 LStR: Aufmerksamkeiten bis 60,00 € je Anlass steuerfrei
      const specialTaxFree = special <= 60.00;

      return {
        primary: { id: 'status', label: 'Status der Steuerfreiheit', value: 0, formattedValue: (monthlyTaxFree && specialTaxFree) ? '100 % Steuer- & Sozialabgabenfrei!' : 'Achtung: Freigrenze überschritten!', highlight: true },
        secondary: [
          { id: 'monthlySaving', label: 'Steuerfreier Monatsbetrag (Gutschein)', value: monthlyTaxFree ? monthly : 0, formattedValue: monthlyTaxFree ? formatCurrency(monthly) : 'Steuerpflichtiger Arbeitslohn' },
          { id: 'yearlyTaxFreeBonus', label: 'Maximaler Jahresvorteil (12 × 50 €)', value: 600, formattedValue: '600,00 € pro Jahr' },
          { id: 'specialGiftStatus', label: 'Persönliches Geschenk (bis 60 €)', value: specialTaxFree ? special : 0, formattedValue: specialTaxFree ? formatCurrency(special) : 'Steuerpflichtig' },
        ],
        summaryText: (monthlyTaxFree && specialTaxFree)
          ? `Beide Beträge liegen exakt innerhalb der gesetzlichen Freigrenzen (50 € monatlich und 60 € je Anlass) und können komplett steuer- und sozialversicherungsfrei gewährt werden.`
          : 'Achtung: Da es sich um Freigrenzen (nicht Freibeträge) handelt, wird bei Überschreitung auch nur um 1 Cent der gesamte Betrag voll steuer- und sozialabgabenpflichtig!',
      };
    },
    formula: 'Sachbezug: max. 50,00 €/Monat steuerfrei; Aufmerksamkeiten: max. 60,00 €/Anlass',
    formulaExplanation: 'Es handelt sich um echte Freigrenzen. Wird die Grenze von 50,00 € um auch nur einen Cent überschritten, muss der gesamte Betrag versteuert werden.',
    workedExample: {
      title: 'Beispiel: 50 € Tankgutschein + 60 € Geburtstagsgeschenk',
      inputValues: [{ label: 'Gutschein', value: '50 €' }, { label: 'Geschenk', value: '60 €' }],
      steps: ['50,00 € monatlich bleibt voll steuerfrei (§ 8 Abs. 2 EStG)', '60,00 € zum Geburtstag bleibt zusätzlich steuerfrei (R 19.6 LStR)'],
      result: 'Vollständig steuerfrei (Brutto = Netto)',
    },
    faqs: [
      { question: 'Darf der Sachbezug als Bargeld ausgezahlt werden?', answer: 'Nein! Bargeldauszahlungen oder Überweisungen sind niemals steuerfrei. Es muss sich um echte Sachleistungen oder Gutscheinkarten nach dem Zahlungsdiensteaufsichtsgesetz (ZAG) handeln.' },
      { question: 'Darf der 50-Euro-Betrag über mehrere Monate angespart werden?', answer: 'Nein, die 50-Euro-Freigrenze ist ein Monatsbetrag und kann nicht in andere Monate übertragen oder aufgespart werden.' },
    ],
    relatedSlugs: ['teilzeit-gehaltsrechner', 'dienstfahrrad-jobrad-rechner', 'dienstaufwandsentschaedigung-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 8 Abs. 2 Satz 11 EStG, R 19.6 LStR)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    }
  },

  {
    id: 'dienstaufwandsentschaedigung-rechner',
    slug: 'dienstaufwandsentschaedigung-rechner',
    name: 'Ehrenamts- & Übungsleiterpauschalen-Rechner (§ 3 EStG)',
    shortName: 'Ehrenamt & Übungsleiter',
    category: 'arbeit-gehalt',
    subcategory: 'Familie & Freizeit',
    metaTitle: 'Ehrenamtspauschale & Übungsleiterpauschale Rechner 2026 (§ 3 Nr. 26 EStG)',
    metaDescription: 'Berechnen Sie die steuerfreien Freibeträge für Ehrenamt (840 €/Jahr) und Übungsleiter/Trainer (3.000 €/Jahr) nach § 3 Nr. 26 und 26a EStG.',
    h1: 'Ehrenamtspauschale Rechner – Steuerfreie Vergütung im Verein',
    shortDescription: 'Ermittelt die steuer- und sozialversicherungsfreien Vergütungen für gemeinnützige Tätigkeiten.',
    searchKeywords: ['ehrenamtspauschale rechner 840 euro', 'uebungsleiterpauschale 3000 euro steuerfrei', 'paragraph 3 nummer 26 estg freibetrag', 'ehrenamt aufwandsentschaedigung rechner'],
    inputs: [
      {
        id: 'activityType',
        label: 'Art der ehrenamtlichen Tätigkeit',
        type: 'select',
        defaultValue: 'trainer',
        options: [
          { value: 'trainer', label: 'Übungsleiter, Trainer, Ausbilder, Erzieher (§ 3 Nr. 26 EStG: bis 3.000 €/Jahr)' },
          { value: 'volunteer', label: 'Ehrenamtliche Vereinstätigkeit / Vorstand / Helfer (§ 3 Nr. 26a EStG: bis 840 €/Jahr)' },
          { value: 'combined', label: 'Kombination aus beiden Tätigkeiten (zwei getrennte Ämter: bis 3.840 €/Jahr)' },
        ],
      },
      { id: 'yearlyPayout', label: 'Vereinbarte jährliche Aufwandsentschädigung', type: 'number', defaultValue: 3200, min: 100, step: 100, unit: '€/Jahr' },
    ],
    calculate: (inputs) => {
      const type = inputs.activityType || 'trainer';
      const payout = parseFloat(inputs.yearlyPayout) || 3200;

      let allowance = 3000;
      if (type === 'volunteer') allowance = 840;
      if (type === 'combined') allowance = 3840;

      const taxFreePart = Math.min(payout, allowance);
      const taxablePart = Math.max(0, payout - allowance);

      return {
        primary: { id: 'taxFreePart', label: 'Steuerfreier Auszahlungsbetrag', value: taxFreePart, formattedValue: formatCurrency(taxFreePart), highlight: true },
        secondary: [
          { id: 'taxablePart', label: 'Steuer- & beitragspflichtiger Überhang', value: taxablePart, formattedValue: formatCurrency(taxablePart) },
          { id: 'maxAllowance', label: 'Gesetzlicher Jahresfreibetrag', value: allowance, formattedValue: formatCurrency(allowance) },
          { id: 'monthlyTaxFree', label: 'Steuerfrei pro Monat', value: taxFreePart / 12, formattedValue: formatCurrency(taxFreePart / 12) },
        ],
        summaryText: `Von ${formatCurrency(payout)} Aufwandsentschädigung bleiben ${formatCurrency(taxFreePart)} komplett steuer- und abgabenfrei. Nur der Überhang von ${formatCurrency(taxablePart)} muss versteuert werden.`,
      };
    },
    formula: 'Steuerfrei = min(Aufwandsentschädigung, Freibetrag nach § 3 Nr. 26/26a EStG)',
    formulaExplanation: 'Übungsleiter erhalten bis zu 3.000 Euro, sonstige Ehrenamtliche bis zu 840 Euro jährlich steuer- und beitragsfrei, sofern die Tätigkeit im ideellen Bereich oder Zweckbetrieb einer gemeinnützigen Organisation ausgeübt wird.',
    workedExample: {
      title: 'Beispiel: Fußballtrainer erhält 3.200 € Aufwandsentschädigung im Jahr',
      inputValues: [{ label: 'Tätigkeit', value: 'Übungsleiter (3.000 €)' }, { label: 'Vergütung', value: '3.200 €' }],
      steps: ['3.000 € bleiben 100 % steuer- und beitragsfrei', '200 € Überhang unterliegt der Besteuerung (z. B. als Minijob)'],
      result: '3.000,00 € steuerfrei',
    },
    faqs: [
      { question: 'Können Ehrenamtspauschale und Übungsleiterpauschale kombiniert werden?', answer: 'Ja, aber nur für zwei verschiedene Tätigkeiten im selben Verein (z. B. 3.000 € als Jugendtrainer und 840 € als Vereinskassierer).' },
      { question: 'Wird die Pauschale auf das Bürgergeld angerechnet?', answer: 'Für Einnahmen aus ehrenamtlicher Tätigkeit gilt beim Bürgergeld ein erhöhter anrechnungsfreier Betrag von bis zu 3.000 Euro im Jahr.' },
    ],
    relatedSlugs: ['minijob-midijob-rechner', 'teilzeit-gehaltsrechner', 'dienstjubilaeum-steuerfrei-rechner'],
    isTimeSensitive: true,
    timeSensitiveMeta: {
      year: 2026,
      source: 'Einkommensteuergesetz (§ 3 Nr. 26, Nr. 26a EStG)',
      sourceUrl: 'https://www.bundesfinanzministerium.de',
      lastVerified: '2026-01-15',
    }
  },
];
