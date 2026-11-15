import { CalculationResult } from '@/types/calculator';
import { calculatePricePerSquareMeter } from '@/lib/calculators/wohnen';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import { EXTRA_WOHNEN_HAUSHALT } from '../extra/wohnenHaushalt';
import { PageContentMap, PageContentOverlay } from './types';

// Every number below is computed with the calculators' own engines at module load.

function run(slug: string, inputs: Record<string, unknown>): CalculationResult {
  const def = EXTRA_WOHNEN_HAUSHALT.find((c) => c.slug === slug);
  if (!def) throw new Error(`page-content/wohnen: Rechner ${slug} nicht gefunden`);
  return def.calculate(inputs as Record<string, any>);
}

function sec(r: CalculationResult, id: string): number {
  const item = r.secondary?.find((s) => s.id === id);
  if (!item) throw new Error(`page-content/wohnen: Wert ${id} fehlt`);
  return Number(item.value);
}

const eur = (v: number) => formatCurrency(v);
const pct = (v: number, digits = 2) => formatPercent(v, digits);

// ---------------------------------------------------------------------------
// quadratmeterpreis-rechner
// ---------------------------------------------------------------------------
function quadratmeterpreis(): PageContentOverlay {
  const ppm = (total: number, area: number) => Number(calculatePricePerSquareMeter({ totalPrice: total, livingArea: area }).primary.value);
  const price = 360000;
  const rent = 950;
  const balcony = 8;
  const areaWoflv = 82.5; // Balkon zu 25 % enthalten
  const areaHalf = areaWoflv - balcony * 0.25 + balcony * 0.5;
  const areaFull = areaWoflv - balcony * 0.25 + balcony;
  const rows = ([
    ['WoFlV, Balkon zu einem Viertel', areaWoflv],
    ['Balkon zur Hälfte angerechnet', areaHalf],
    ['Balkon voll mitgezählt', areaFull],
  ] as Array<[string, number]>)
    .map(([label, a]) => `| ${label} | ${formatNumber(a, 1)} m² | ${eur(ppm(price, a))} | ${eur(ppm(rent, a))} |`)
    .join('\n');
  const gap = ppm(price, areaWoflv) - ppm(price, areaFull);

  const parking = 20000;
  const withParking = ppm(price, areaWoflv);
  const withoutParking = ppm(price - parking, areaWoflv);
  const warm = 1180;

  return {
    sections: [
      {
        title: 'Wie die Flächenangabe den Quadratmeterpreis verschiebt',
        content: `Der Quadratmeterpreis ist nur so genau wie die Fläche, durch die Sie teilen. Ein Balkon zählt nach der Wohnflächenverordnung in der Regel zu einem Viertel, höchstens zur Hälfte. Manche Exposés rechnen ihn voll ein und machen die Wohnung damit auf dem Papier größer. Beispiel: ${formatNumber(price, 0)} € Kaufpreis oder ${formatNumber(rent, 0)} € Kaltmiete, ${balcony} m² Balkon.\n\n| Flächenangabe | Fläche | Kaufpreis je m² | Kaltmiete je m² |\n| --- | --- | --- | --- |\n${rows}\n\nMit voll gezähltem Balkon wirkt dieselbe Wohnung um ${eur(gap)} je m² günstiger. Bitten Sie deshalb um die Wohnflächenberechnung und vergleichen Sie Angebote nur auf derselben Flächenbasis. Die anrechenbare Fläche ermitteln Sie mit dem [Wohnflächenrechner](/rechner/wohnflaeche-din-rechner/).`,
      },
    ],
    faqs: [
      {
        question: 'Rechnet man den Quadratmeterpreis einer Mietwohnung mit Kaltmiete oder Warmmiete?',
        answer: `Mit der Nettokaltmiete, denn darauf beziehen sich Mietspiegel und die meisten Inserate. ${formatNumber(rent, 0)} € kalt auf ${formatNumber(areaWoflv, 1)} m² ergeben ${eur(ppm(rent, areaWoflv))} je m². Teilen Sie stattdessen eine Warmmiete von beispielsweise ${formatNumber(warm, 0)} €, kommen ${eur(ppm(warm, areaWoflv))} je m² heraus. Dieser Wert hängt vom Heizverhalten und den Nebenkosten ab und eignet sich nicht für den Vergleich mit dem Mietspiegel.`,
      },
      {
        question: 'Muss ich Stellplatz oder Einbauküche vor der Berechnung abziehen?',
        answer: `Ja, wenn sie im Kaufpreis stecken, sonst ist der Quadratmeterpreis zu hoch. Enthält ein Kaufpreis von ${formatNumber(price, 0)} € einen Tiefgaragenstellplatz für ${formatNumber(parking, 0)} €, liegt die Wohnung bei ${eur(withoutParking)} statt ${eur(withParking)} je m². Kellerräume zählen nicht zur Wohnfläche und gehören deshalb nicht in die Fläche, durch die Sie teilen.`,
      },
    ],
    workedExamples: [
      {
        title: `Beispiel: ${formatNumber(rent, 0)} € Kaltmiete für ${formatNumber(areaWoflv, 1)} m²`,
        description: `${formatNumber(rent, 0)} € / ${formatNumber(areaWoflv, 1)} m² = ${eur(ppm(rent, areaWoflv))} pro m². Diesen Wert können Sie direkt mit dem örtlichen Mietspiegel vergleichen.`,
        inputs: { totalPrice: rent, livingArea: areaWoflv },
        resultSummary: `${eur(ppm(rent, areaWoflv))} / m²`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// mietrendite-brutto-netto-rechner
// ---------------------------------------------------------------------------
function mietrendite(): PageContentOverlay {
  const rent = 950;
  const nonApp = 1400;
  const rows = [200000, 250000, 300000]
    .map((price) => {
      const r = run('mietrendite-brutto-netto-rechner', { purchasePrice: price, closingCosts: price * 0.1, monthlyColdRent: rent, yearlyNonApportionable: nonApp });
      return `| ${eur(price)} | ${formatNumber(sec(r, 'multiplier'), 1)} | ${pct(sec(r, 'grossYield'))} | ${pct(Number(r.primary.value))} |`;
    })
    .join('\n');

  const base = run('mietrendite-brutto-netto-rechner', { purchasePrice: 250000, closingCosts: 25000, monthlyColdRent: rent, yearlyNonApportionable: nonApp });
  const vacancy = run('mietrendite-brutto-netto-rechner', { purchasePrice: 250000, closingCosts: 25000, monthlyColdRent: rent, yearlyNonApportionable: nonApp + rent });

  const targetNet = 4;
  const neededRent = Math.ceil(((targetNet / 100) * 275000 + nonApp) / 12);
  const check = run('mietrendite-brutto-netto-rechner', { purchasePrice: 250000, closingCosts: 25000, monthlyColdRent: neededRent, yearlyNonApportionable: nonApp });

  return {
    sections: [
      {
        title: 'Derselbe Mieter, drei Kaufpreise',
        content: `Wie stark der Kaufpreis die Rendite bestimmt, zeigt eine Wohnung mit ${eur(rent)} Kaltmiete und ${eur(nonApp)} nicht umlagefähigen Kosten im Jahr. Als Kaufnebenkosten sind jeweils 10 % des Kaufpreises angesetzt (Beispielwert, je nach Bundesland und Makler mehr oder weniger).\n\n| Kaufpreis | Kaufpreisfaktor | Bruttorendite | Nettorendite |\n| --- | --- | --- | --- |\n${rows}\n\nMiete und Kosten sind in allen drei Zeilen gleich, trotzdem fallen beide Renditen mit jedem Preisschritt. Verhandeln Sie deshalb über den Kaufpreis und rechnen Sie die Rendite-Angabe im Exposé mit Ihren eigenen Zahlen nach.`,
      },
      {
        title: 'Was die Nettomietrendite noch nicht enthält',
        content: `Der Rechner bildet den Ertrag der Immobilie ab, nicht Ihren persönlichen Gewinn. Nicht enthalten sind:\n\n- **Finanzierung:** Kreditzinsen senken die Rendite auf Ihr Eigenkapital, solange der Zins über der Nettorendite liegt.\n- **Steuern:** Mieteinnahmen sind einkommensteuerpflichtig, die Gebäudeabschreibung mindert die Steuer. Die Wirkung zeigt der [AfA-Rechner](/rechner/abschreibung-immobilien-rechner/).\n- **Leerstand:** Die Jahresmiete wird mit zwölf vollen Monaten angesetzt. Ein Monat ohne Mieter senkt die Nettorendite im Beispiel mit 250.000 € Kaufpreis von ${pct(Number(base.primary.value))} auf ${pct(Number(vacancy.primary.value))}. Tragen Sie ein Leerstandsrisiko deshalb bei den nicht umlagefähigen Kosten ein.\n- **Wertentwicklung:** Ob die Immobilie beim Verkauf mehr oder weniger wert ist, steckt in keiner Mietrendite.`,
      },
    ],
    faqs: [
      {
        question: 'Wie viel Kaltmiete brauche ich für 4 % Nettomietrendite?',
        answer: `Stellen Sie die Formel um: Jahresmiete = Zielrendite × Gesamtinvestition + nicht umlagefähige Kosten. Bei 250.000 € Kaufpreis, 25.000 € Nebenkosten und ${eur(nonApp)} Kosten im Jahr sind das gerundet ${eur(neededRent)} im Monat. Der Rechner bestätigt damit eine Nettorendite von ${pct(Number(check.primary.value))}.`,
      },
      {
        question: 'Warum rechnet die Bruttorendite nur mit dem Kaufpreis?',
        answer: `Weil sie ein schneller Vergleichswert für Angebote sein soll und dem Kehrwert des Kaufpreisfaktors entspricht: Faktor ${formatNumber(sec(base, 'multiplier'), 1)} bedeutet ${pct(sec(base, 'grossYield'))} Bruttorendite. Für die Kaufentscheidung ist die Nettorendite aussagekräftiger, weil sie Grunderwerbsteuer, Notar, Makler und laufende Eigentümerkosten einbezieht.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// grundsteuer-reform-rechner
// ---------------------------------------------------------------------------
function grundsteuer(): PageContentOverlay {
  const values = [150000, 280000, 450000];
  const rates = [350, 480, 650];
  const header = `| Grundsteuerwert | ${rates.map((h) => `Hebesatz ${h} %`).join(' | ')} |`;
  const rows = values
    .map((v) => `| ${eur(v)} | ${rates.map((h) => eur(Number(run('grundsteuer-reform-rechner', { propertyValue: v, measureRate: 0.031, hebesatz: h }).primary.value))).join(' | ')} |`)
    .join('\n');

  const normal = run('grundsteuer-reform-rechner', { propertyValue: 280000, measureRate: 0.031, hebesatz: 480 });
  const monumentRate = 0.031 * 0.9;
  const subsidizedRate = 0.031 * 0.75;
  const monument = run('grundsteuer-reform-rechner', { propertyValue: 280000, measureRate: monumentRate, hebesatz: 480 });
  const subsidized = run('grundsteuer-reform-rechner', { propertyValue: 280000, measureRate: subsidizedRate, hebesatz: 480 });

  return {
    sections: [
      {
        title: 'Jahresgrundsteuer nach Grundsteuerwert und Hebesatz',
        content: `Gerechnet mit der Steuermesszahl des Bundesmodells für Wohngrundstücke (0,31 Promille = 0,031 %). Die Hebesätze sind **Beispielwerte**, den gültigen Satz Ihrer Gemeinde finden Sie in deren Hebesatzsatzung oder auf dem Grundsteuerbescheid.\n\n${header}\n| --- | --- | --- | --- |\n${rows}\n\nSo lesen Sie Ihre Unterlagen: Der **Grundsteuerwertbescheid** des Finanzamts liefert den Wert für das erste Feld. Der **Grundsteuermessbescheid** zeigt den Messbetrag, also Wert × Messzahl. Erst der **Grundsteuerbescheid** der Gemeinde multipliziert den Messbetrag mit dem Hebesatz. Liegt Ihnen der Messbescheid vor, genügt diese letzte Rechnung: ${eur(sec(normal, 'messbetrag'))} Messbetrag × 480 % = ${eur(Number(normal.primary.value))} im Jahr.`,
      },
      {
        title: 'Ermäßigte Messzahl für Baudenkmäler und geförderten Wohnraum',
        content: `§ 15 GrStG senkt die Messzahl von 0,31 Promille auf Antrag: um 10 % bei Baudenkmälern nach Landesdenkmalrecht und um 25 % bei Wohnraum mit Förderzusage nach dem Wohnraumförderungsgesetz. Tragen Sie dann die gekürzte Messzahl ein. Für 280.000 € Grundsteuerwert bei einem Beispiel-Hebesatz von 480 %:\n\n| Fall | Messzahl | Grundsteuer pro Jahr |\n| --- | --- | --- |\n| Regelfall | 0,031 % | ${eur(Number(normal.primary.value))} |\n| Baudenkmal (−10 %) | ${formatNumber(monumentRate, 4)} % | ${eur(Number(monument.primary.value))} |\n| Geförderter Wohnraum (−25 %) | ${formatNumber(subsidizedRate, 5)} % | ${eur(Number(subsidized.primary.value))} |\n\nEntfallen die Voraussetzungen später, müssen Sie das dem Finanzamt anzeigen.`,
      },
    ],
    faqs: [
      {
        question: 'Wann wird die Grundsteuer fällig?',
        answer: `Nach § 28 GrStG in vier gleichen Raten am 15. Februar, 15. Mai, 15. August und 15. November. Bei ${eur(Number(normal.primary.value))} Jahressteuer sind das ${eur(sec(normal, 'grundsteuerQuarter'))} je Termin. Auf Antrag, der bis zum 30. September des Vorjahres gestellt sein muss, zahlen Sie den Jahresbetrag in einer Summe zum 1. Juli. Gemeinden können kleine Beträge bis 15 € bzw. 30 € seltener einziehen.`,
      },
      {
        question: 'Passt der Rechner auch für Bayern oder Baden-Württemberg?',
        answer: 'Nur eingeschränkt. Das Bundesmodell (Wert × Messzahl × Hebesatz mit 0,31 Promille) gilt nicht in Ländern mit eigenem Grundsteuergesetz, etwa Baden-Württemberg, Bayern, Hamburg, Hessen und Niedersachsen. Auch das Saarland und Sachsen weichen bei den Messzahlen vom Bund ab. Unabhängig vom Land gilt aber immer der letzte Schritt: Messbetrag laut Messbescheid × Hebesatz der Gemeinde ergibt die Jahressteuer.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// notar-grundbuch-kosten-rechner
// ---------------------------------------------------------------------------
function notar(): PageContentOverlay {
  const calc = (price: number, mortgage: number) => run('notar-grundbuch-kosten-rechner', { purchasePrice: price, mortgageAmount: mortgage });
  const cases: Array<[number, number]> = [
    [300000, 0],
    [300000, 240000],
    [500000, 0],
    [500000, 400000],
  ];
  const rows = cases
    .map(([p, m]) => {
      const r = calc(p, m);
      return `| ${eur(p)} | ${m === 0 ? 'keine' : eur(m)} | ${eur(sec(r, 'notaryShare'))} | ${eur(sec(r, 'registryShare'))} | ${eur(Number(r.primary.value))} | ${pct(sec(r, 'pctOfPrice'))} |`;
    })
    .join('\n');

  // Shares the engine assumes, derived from a reference run (no Grundschuld vs. Grundschuld only).
  const refPrice = calc(100000, 0);
  const notaryPct = sec(refPrice, 'notaryShare') / 1000;
  const registryPct = sec(refPrice, 'registryShare') / 1000;
  const mortgagePct = Number(calc(0, 100000).primary.value) / 1000;

  const cash = calc(300000, 0);
  const financed = calc(300000, 240000);
  const big = calc(500000, 400000);

  return {
    sections: [
      {
        title: 'Notar- und Grundbuchkosten für 300.000 € und 500.000 €',
        content: `Gerechnet mit den Ansätzen dieses Rechners, mit und ohne Grundschuld über 80 % des Kaufpreises:\n\n| Kaufpreis | Grundschuld | Notar | Grundbuchamt | Summe | Anteil am Kaufpreis |\n| --- | --- | --- | --- | --- | --- |\n${rows}\n\nDer Rechner schätzt mit festen Anteilen: ${pct(notaryPct)} des Kaufpreises für den Notar, ${pct(registryPct)} für das Grundbuchamt und ${pct(mortgagePct)} der Grundschuld für deren Bestellung und Eintragung. Das GNotKG rechnet dagegen mit Gebührentabellen, deren Gebühren langsamer steigen als der Geschäftswert. Bei hohen Kaufpreisen liegt die echte Rechnung deshalb eher unter dem geschätzten Prozentsatz, bei kleinen Kaufpreisen eher darüber.`,
      },
      {
        title: 'Wofür Notar und Grundbuchamt bezahlt werden',
        content: '- **Kaufvertrag:** Entwurf und Beurkundung, dazu der Vollzug, etwa das Einholen von Löschungsunterlagen der Verkäuferbank und die Mitteilung an den Käufer, wann der Kaufpreis fällig ist.\n- **Auflassungsvormerkung:** sichert Ihren Anspruch im Grundbuch, bevor Sie zahlen.\n- **Eigentumsumschreibung:** Eintragung als neuer Eigentümer, erst nach Zahlung der Grunderwerbsteuer.\n- **Grundschuld:** Bestellung beim Notar und Eintragung durch das Grundbuchamt, damit die Bank den Kredit auszahlt.\n- **Löschung alter Rechte:** betrifft meist Belastungen des Verkäufers und wird nach Vereinbarung im Kaufvertrag verteilt.\n\nDie Rechnung des Grundbuchamts kommt getrennt und oft erst Wochen nach der Notarrechnung.',
      },
    ],
    faqs: [
      {
        question: 'Wie viel spart ein Kauf ohne Kredit bei Notar und Grundbuch?',
        answer: `Es entfällt die Grundschuld. Bei 300.000 € Kaufpreis schätzt der Rechner ohne Grundschuld ${eur(Number(cash.primary.value))}, mit 240.000 € Grundschuld ${eur(Number(financed.primary.value))}. Der Unterschied beträgt ${eur(Number(financed.primary.value) - Number(cash.primary.value))}. Bei 500.000 € Kaufpreis und 400.000 € Grundschuld kommen insgesamt ${eur(Number(big.primary.value))} zusammen.`,
      },
      {
        question: 'Kann ich Notar- und Grundbuchkosten von der Steuer absetzen?',
        answer: 'Bei einer selbst genutzten Immobilie nicht. Bei einer vermieteten Immobilie gehören die Kosten für Kaufvertrag und Eigentumsumschreibung zu den Anschaffungskosten: Der auf das Gebäude entfallende Teil wird über die AfA abgeschrieben. Die Kosten für die Grundschuld sind dagegen Finanzierungskosten und im Jahr der Zahlung als Werbungskosten abziehbar.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// hausgeld-rechner
// ---------------------------------------------------------------------------
function hausgeld(): PageContentOverlay {
  const areas = [50, 80, 110];
  const rates = [3.5, 4.2, 5.0];
  const rows = areas
    .map((a) => `| ${a} m² | ${rates.map((s) => eur(Number(run('hausgeld-rechner', { livingArea: a, avgHausgeldPerSqm: s, apportionablePct: 65 }).primary.value))).join(' | ')} |`)
    .join('\n');
  const vacant = run('hausgeld-rechner', { livingArea: 80, avgHausgeldPerSqm: 4.2, apportionablePct: 0 });
  const rented = run('hausgeld-rechner', { livingArea: 80, avgHausgeldPerSqm: 4.2, apportionablePct: 65 });

  return {
    sections: [
      {
        title: 'Monatliches Hausgeld nach Wohnungsgröße',
        content: `Die Sätze pro m² sind **Beispielwerte**. Maßgeblich ist allein der beschlossene Wirtschaftsplan Ihrer Eigentümergemeinschaft, der Ihren Anteil meist nach Miteigentumsanteilen oder Wohnfläche verteilt.\n\n| Wohnfläche | 3,50 €/m² | 4,20 €/m² | 5,00 €/m² |\n| --- | --- | --- | --- |\n${rows}\n\nEin Aufzug, eine Tiefgarage oder ein Hausmeister treiben den Satz nach oben, ebenso eine hohe Zuführung zur Erhaltungsrücklage.`,
      },
      {
        title: 'Hausgeld vor dem Wohnungskauf prüfen',
        content: '- **Wirtschaftsplan:** zeigt die geplanten Vorschüsse für das laufende Jahr und deren Aufteilung.\n- **Jahresabrechnungen der letzten zwei bis drei Jahre:** Nachzahlungen deuten auf zu knapp kalkulierte Vorschüsse hin.\n- **Protokolle der Eigentümerversammlungen:** Hier stehen beschlossene Sonderumlagen und anstehende Sanierungen, etwa an Dach, Fassade oder Heizung.\n- **Stand der Erhaltungsrücklage:** Eine kleine Rücklage bei älterem Gebäude macht Sonderumlagen wahrscheinlicher.\n\nRechnen Sie das Hausgeld zur Kreditrate hinzu. Für die Bank und für Ihr Budget ist es eine feste monatliche Ausgabe, auch wenn ein Teil später vom Mieter erstattet wird.',
      },
    ],
    faqs: [
      {
        question: 'Wer zahlt das Hausgeld, wenn die Wohnung leer steht?',
        answer: `Der Eigentümer in voller Höhe, denn ohne Mieter lässt sich nichts umlegen. Bei 80 m² und 4,20 €/m² sind das ${eur(Number(vacant.primary.value))} im Monat statt ${eur(sec(rented, 'ownerShare'))} Eigenanteil bei einer Vermietung mit 65 % Umlagequote. Stellen Sie im Rechner den umlagefähigen Anteil auf 0 %, um die Leerstandskosten zu sehen.`,
      },
      {
        question: 'Ist das Hausgeld steuerlich absetzbar?',
        answer: `Für vermietete Wohnungen ja, als Werbungskosten bei den Einkünften aus Vermietung. Die Betriebskostenvorauszahlungen des Mieters zählen im Gegenzug zu Ihren Einnahmen. Eine Ausnahme ist die Zuführung zur Erhaltungsrücklage: Sie wird erst abziehbar, wenn die Gemeinschaft das Geld tatsächlich für Erhaltung ausgibt. Bei Selbstnutzung können Sie allenfalls Handwerker- und haushaltsnahe Dienstleistungen aus der Jahresabrechnung geltend machen.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// untermiete-rechner
// ---------------------------------------------------------------------------
function untermiete(): PageContentOverlay {
  const total = 80;
  const warmTotal = 1200;
  const common = 20;
  const calc = (room: number, occupants: number) =>
    run('untermiete-rechner', { totalWarmRent: warmTotal, totalApartmentArea: total, subletRoomArea: room, commonArea: common, occupants, furnishingSurcharge: 0 });
  const rows = [12, 16, 20, 25]
    .map((m) => {
      const two = calc(m, 2);
      const three = calc(m, 3);
      return `| ${m} m² | ${pct(sec(two, 'subRatio'), 1)} | ${eur(sec(two, 'baseSubRent'))} | ${eur(sec(three, 'baseSubRent'))} |`;
    })
    .join('\n');
  const ref = calc(20, 2);
  const ratio = sec(ref, 'subRatio') / 100;
  const small = calc(12, 2);
  const smallRatio = sec(small, 'subRatio') / 100;
  const nachzahlung = 240;

  return {
    sections: [
      {
        title: 'Mietanteil nach Zimmergröße und Zahl der Bewohner',
        content: `Der Untermieter zahlt für sein Zimmer und seinen Kopfanteil an Küche, Bad und Flur. Die übrigen Zimmer des Hauptmieters bleiben beim Hauptmieter. Beispiel: ${total}-m²-Wohnung, ${eur(warmTotal)} Warmmiete, ${common} m² Gemeinschaftsfläche, ohne Möblierungszuschlag.\n\n| Zimmer des Untermieters | Anteil bei 2 Bewohnern | Warmmiete bei 2 Bewohnern | Warmmiete bei 3 Bewohnern |\n| --- | --- | --- | --- |\n${rows}\n\nWohnen drei Personen in der Wohnung, verteilt sich die Gemeinschaftsfläche auf mehr Köpfe und der Anteil jedes Untermieters sinkt. Messen Sie Küche, Bad und Flur nach, statt sie zu schätzen: Schon wenige Quadratmeter Unterschied verschieben den Mietanteil spürbar. Den Möblierungszuschlag rechnet der Rechner nur beim Untermieter hinzu.`,
      },
      {
        title: 'Untervermietung in fünf Schritten',
        content: '1. **Erlaubnis einholen:** Schreiben Sie dem Vermieter, an wen Sie welchen Teil der Wohnung ab wann überlassen wollen und warum. Ein nach Vertragsschluss entstandenes berechtigtes Interesse, etwa ein Auslandsaufenthalt oder weniger Einkommen, begründet nach § 553 BGB einen Anspruch.\n2. **Zuschlag klären:** Ist dem Vermieter die Untervermietung nur gegen eine höhere Miete zumutbar, darf er sie von einer angemessenen Erhöhung abhängig machen.\n3. **Untermietvertrag schließen:** Zimmer, Mitbenutzung von Küche und Bad, Miete, Nebenkosten und Kaution schriftlich festhalten.\n4. **Wohnungsgeberbestätigung ausstellen:** Ihr Untermieter braucht sie für die Anmeldung, bei Untermiete stellen Sie als Hauptmieter sie aus.\n5. **Einnahmen notieren:** Untermieteinnahmen gehören in die Steuererklärung.',
      },
    ],
    faqs: [
      {
        question: 'Was kann ich tun, wenn der Vermieter die Untervermietung ablehnt?',
        answer: 'Haben Sie einen Anspruch auf Erlaubnis nach § 553 BGB, können Sie ihn einklagen. Verweigert der Vermieter die Erlaubnis, ohne dass in der Person des Untermieters ein wichtiger Grund vorliegt, dürfen Sie außerdem nach § 540 Abs. 1 BGB außerordentlich mit der gesetzlichen Frist kündigen. Vermieten Sie ohne Erlaubnis unter, riskieren Sie eine Abmahnung und im Wiederholungsfall die Kündigung.',
      },
      {
        question: 'Wie verteile ich eine Nebenkostennachzahlung auf den Untermieter?',
        answer: `Mit demselben Flächenanteil, den Sie für die Miete verwenden, sofern Ihr Untermietvertrag Nebenkosten als Vorauszahlung vorsieht. Beim 20-m²-Zimmer aus der Tabelle oben sind das ${pct(ratio * 100, 1)}: Von ${eur(nachzahlung)} Nachzahlung trägt der Untermieter ${eur(nachzahlung * ratio)}, beim 12-m²-Zimmer (${pct(smallRatio * 100, 1)}) ${eur(nachzahlung * smallRatio)}. Haben Sie eine Pauschale vereinbart, ist eine Nachforderung ausgeschlossen.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// staffelmiete-rechner
// ---------------------------------------------------------------------------
function staffelmiete(): PageContentOverlay {
  const start = 750;
  const years = 10;
  const variants: Array<[number, number]> = [
    [20, 12],
    [35, 12],
    [50, 24],
  ];
  const describe = (inc: number, interval: number) => {
    const end = Number(run('staffelmiete-rechner', { startRent: start, increaseAmount: inc, intervalMonths: interval, totalYears: years }).primary.value);
    const after5 = Number(run('staffelmiete-rechner', { startRent: start, increaseAmount: inc, intervalMonths: interval, totalYears: 5 }).primary.value);
    let extra = 0;
    for (let y = 2; y <= years; y++) {
      const before = run('staffelmiete-rechner', { startRent: start, increaseAmount: inc, intervalMonths: interval, totalYears: y - 1 });
      extra += sec(before, 'totalIncrease') * 12;
    }
    const avg = (Math.pow(end / start, 1 / years) - 1) * 100;
    return { end, after5, extra, avg };
  };
  const rows = variants
    .map(([inc, interval]) => {
      const d = describe(inc, interval);
      return `| +${inc} € alle ${interval} Monate | ${eur(d.after5)} | ${eur(d.end)} | ${eur(d.extra)} | ${pct(d.avg, 1)} |`;
    })
    .join('\n');
  const main = describe(35, 12);

  return {
    sections: [
      {
        title: 'Drei Staffelvarianten über zehn Jahre',
        content: `Ausgangspunkt jeweils ${eur(start)} Kaltmiete. Die Mehrkosten zeigen, wie viel Sie in zehn Jahren insgesamt über der Anfangsmiete zahlen, wenn jede Staffel zum Jahrestag greift.\n\n| Staffel | Miete nach 5 Jahren | Miete nach 10 Jahren | Mehrkosten in 10 Jahren | Ø Steigerung pro Jahr |\n| --- | --- | --- | --- | --- |\n${rows}\n\nFeste Euro-Beträge wirken mit der Zeit schwächer: Die erste Staffel von +35 € entspricht ${pct((35 / start) * 100, 1)} der Miete, die zehnte nur noch ${pct((35 / (main.end - 35)) * 100, 1)}. Ob das günstig ist, hängt davon ab, wie sich Inflation und Vergleichsmieten in dieser Zeit entwickeln.`,
      },
      {
        title: 'Staffelmietvertrag prüfen',
        content: '- **Schriftform:** Die Vereinbarung muss schriftlich getroffen sein (§ 557a Abs. 1 BGB).\n- **Betrag in Euro:** Jede Staffel nennt die neue Miete oder den Erhöhungsbetrag als Geldbetrag.\n- **Mindestens ein Jahr:** Zwischen zwei Stufen bleibt die Miete mindestens zwölf Monate gleich.\n- **Mietpreisbremse je Stufe:** Wo sie gilt, wird jede spätere Staffel an der zulässigen Miete zum Zeitpunkt ihrer Fälligkeit gemessen.\n- **Betriebskosten:** Ausgeschlossen sind nur Erhöhungen nach §§ 558 bis 559b BGB. Höhere Nebenkostenvorauszahlungen bleiben möglich.',
      },
    ],
    faqs: [
      {
        question: 'Kann ich einen Staffelmietvertrag vorzeitig kündigen?',
        answer: 'Ja, mit der normalen Kündigungsfrist für Mieter, sofern der Vertrag keinen Kündigungsverzicht enthält. Ein solcher Verzicht ist bei Staffelmiete nach § 557a Abs. 3 BGB nur für höchstens vier Jahre seit Abschluss der Vereinbarung wirksam. Danach können Sie kündigen, auch wenn noch weitere Staffeln vereinbart sind.',
      },
      {
        question: 'Wie viel Prozent im Jahr entspricht eine Staffel von 35 € auf 750 €?',
        answer: `Im ersten Jahr ${pct((35 / start) * 100, 1)}. Über zehn Jahre steigt die Kaltmiete auf ${eur(main.end)}, das entspricht durchschnittlich ${pct(main.avg, 1)} pro Jahr. Insgesamt zahlen Sie in diesem Zeitraum ${eur(main.extra)} mehr als bei unveränderter Anfangsmiete.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// indexmiete-rechner
// ---------------------------------------------------------------------------
function indexmiete(): PageContentOverlay {
  const rent = 850;
  const rows = [2, 5, 8]
    .map((p) => {
      const r = run('indexmiete-rechner', { currentRent: rent, oldVpi: 100, newVpi: 100 + p });
      return `| +${p} % | ${eur(Number(r.primary.value))} | ${eur(sec(r, 'diff'))} | ${eur(sec(r, 'yearlyDiff'))} |`;
    })
    .join('\n');
  const oldI = 105.8;
  const newI = 118.5;
  const correct = run('indexmiete-rechner', { currentRent: rent, oldVpi: oldI, newVpi: newI });
  const points = newI - oldI;
  const wrongIncrease = rent * (points / 100);

  return {
    sections: [
      {
        title: 'Indexpunkte sind keine Prozent',
        content: `Der häufigste Fehler in Erhöhungsschreiben: Die Differenz der Indexstände wird als Prozentsatz behandelt. Steigt der VPI von ${formatNumber(oldI, 1)} auf ${formatNumber(newI, 1)}, sind das ${formatNumber(points, 1)} Punkte, aber nur ${pct(sec(correct, 'pctChange'))} Steigerung. Bei ${eur(rent)} Kaltmiete ergibt die falsche Rechnung ${eur(wrongIncrease)} mehr, richtig sind ${eur(sec(correct, 'diff'))}. Beide Indexwerte müssen außerdem aus derselben Basisreihe stammen (derzeit 2020 = 100).\n\n| Indexanstieg | Neue Kaltmiete | Mehr pro Monat | Mehr pro Jahr |\n| --- | --- | --- | --- |\n${rows}`,
      },
      {
        title: 'So läuft eine Indexmieterhöhung ab',
        content: 'Nach § 557b Abs. 3 BGB muss der Vermieter die Anpassung in Textform erklären, also etwa per Brief oder E-Mail. Darin müssen die Änderung des Preisindex sowie die neue Miete oder die Erhöhung als Geldbetrag stehen. Die höhere Miete ist ab Beginn des übernächsten Monats nach Zugang zu zahlen: Geht das Schreiben am 10. März zu, gilt sie ab 1. Mai. Zwischen zwei Anpassungen muss die Miete mindestens ein Jahr unverändert bleiben. Eine Erhöhung auf die ortsübliche Vergleichsmiete nach § 558 BGB ist während der Indexvereinbarung ausgeschlossen.',
      },
    ],
    faqs: [
      {
        question: 'Kann der Vermieter eine Indexerhöhung rückwirkend verlangen?',
        answer: 'Nein. Die neue Miete gilt frühestens ab dem übernächsten Monat nach Zugang der Erklärung. Hat der Vermieter mehrere Jahre nicht angepasst, darf er beim nächsten Mal zwar den gesamten Indexanstieg seit der letzten Anpassung zugrunde legen, für die vergangenen Monate schulden Sie aber keine Nachzahlung.',
      },
      {
        question: 'Welcher Index ist für die Indexmiete maßgeblich?',
        answer: 'Der vom Statistischen Bundesamt ermittelte Verbraucherpreisindex für Deutschland, so schreibt es § 557b Abs. 1 BGB vor. Andere Indizes, etwa der harmonisierte Verbraucherpreisindex oder regionale Werte, sind dafür nicht vorgesehen. Verwenden Sie die Monatswerte, die im Vertrag oder in der letzten Anpassung genannt sind.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// mietminderung-rechner
// ---------------------------------------------------------------------------
function mietminderung(): PageContentOverlay {
  const warm = 950;
  const quota = 20;
  const rows = [5, 10, 15, 30]
    .map((d) => {
      const r = run('mietminderung-rechner', { warmRent: warm, defectPct: quota, defectDays: d });
      return `| ${d} Tage | ${eur(Number(r.primary.value))} | ${eur(sec(r, 'reducedRent'))} |`;
    })
    .join('\n');
  const nov = run('mietminderung-rechner', { warmRent: warm, defectPct: quota, defectDays: 10 });
  const dec = run('mietminderung-rechner', { warmRent: warm, defectPct: quota, defectDays: 10 });
  const sum = Number(nov.primary.value) + Number(dec.primary.value);
  const tooHigh = run('mietminderung-rechner', { warmRent: warm, defectPct: 50, defectDays: 30 });
  const fair = run('mietminderung-rechner', { warmRent: warm, defectPct: quota, defectDays: 30 });

  return {
    sections: [
      {
        title: 'Teilmonate und monatsübergreifende Mängel',
        content: `Die Minderung gilt nur für die Tage, an denen der Mangel bestand. Mit ${eur(warm)} Warmmiete und einer Beispielquote von ${quota} %:\n\n| Dauer im Monat | Minderung | Zu zahlende Miete |\n| --- | --- | --- |\n${rows}\n\nZieht sich ein Mangel über den Monatswechsel, rechnen Sie jeden Monat getrennt. Fällt die Heizung vom 21. November bis 10. Dezember aus, sind es je 10 Tage: ${eur(Number(nov.primary.value))} im November und ${eur(Number(dec.primary.value))} im Dezember, zusammen ${eur(sum)}.\n\nDie Quote selbst steht in keinem Gesetz. Gerichte legen sie im Einzelfall nach Art, Ausmaß und Dauer der Beeinträchtigung fest. Orientieren Sie sich an Urteilen zu möglichst ähnlichen Mängeln und lassen Sie die Quote im Zweifel vom Mieterverein einschätzen.`,
      },
      {
        title: 'Vorgehen bei einem Mangel',
        content: '1. **Mangel sofort melden:** § 536c BGB verlangt eine unverzügliche Anzeige. Eine Form schreibt das Gesetz nicht vor, für den Nachweis ist ein Schreiben mit Datum und Fotos aber sinnvoll.\n2. **Minderung tritt automatisch ein:** Nach § 536 Abs. 1 BGB ist die Miete kraft Gesetzes gemindert, solange die Tauglichkeit eingeschränkt ist. Unerhebliche Beeinträchtigungen bleiben außer Betracht.\n3. **Ausnahme energetische Modernisierung:** Bei Bauarbeiten für eine energetische Modernisierung ist eine Minderung für drei Monate ausgeschlossen (§ 536 Abs. 1a BGB).\n4. **Unter Vorbehalt zahlen:** Wer sich bei der Quote unsicher ist, zahlt die volle Miete ausdrücklich unter Vorbehalt und fordert den Minderungsbetrag später zurück.',
      },
    ],
    faqs: [
      {
        question: 'Was passiert, wenn ich die Miete zu stark mindere?',
        answer: `Den zu viel einbehaltenen Betrag schulden Sie weiter, er läuft als Mietrückstand auf. Mindern Sie bei ${eur(warm)} Warmmiete einen ganzen Monat um 50 % statt um ${quota} %, fehlen ${eur(Number(tooHigh.primary.value) - Number(fair.primary.value))} pro Monat. Über mehrere Monate kann sich daraus ein Rückstand ergeben, der eine fristlose Kündigung nach § 543 BGB rechtfertigt. Die Zahlung unter Vorbehalt vermeidet dieses Risiko.`,
      },
      {
        question: 'Kann ich nachträglich mindern, wenn ich die volle Miete schon gezahlt habe?',
        answer: 'Grundsätzlich ja, die zu viel gezahlte Miete können Sie zurückfordern. Problematisch wird es, wenn Sie trotz Kenntnis des Mangels lange vorbehaltlos weitergezahlt haben, weil der Vermieter dann einwenden kann, Sie hätten bewusst auf eine Rückforderung verzichtet. Kannten Sie den Mangel schon bei Vertragsschluss, sind die Rechte nach § 536b BGB in der Regel ausgeschlossen.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// abschreibung-immobilien-rechner
// ---------------------------------------------------------------------------
function abschreibung(): PageContentOverlay {
  const total = 380000;
  const types: Array<[string, string, string]> = [
    ['before1925', 'Fertigstellung vor 1925', '40 Jahre'],
    ['after1925', 'Fertigstellung 1925 bis 2022', '50 Jahre'],
    ['newBuild', 'Fertigstellung ab 2023', '33⅓ Jahre'],
  ];
  const rows = types
    .map(([type, label, span]) => {
      const r = run('abschreibung-immobilien-rechner', { totalCost: total, landSharePct: 25, afaType: type, taxRate: 42 });
      return `| ${label} | ${span} | ${eur(sec(r, 'yearlyAfa'))} | ${eur(Number(r.primary.value))} |`;
    })
    .join('\n');
  const landRows = [20, 30, 40]
    .map((l) => {
      const r = run('abschreibung-immobilien-rechner', { totalCost: total, landSharePct: l, afaType: 'after1925', taxRate: 42 });
      return `| ${l} % | ${eur(sec(r, 'buildingValue'))} | ${eur(sec(r, 'yearlyAfa'))} |`;
    })
    .join('\n');
  const base = run('abschreibung-immobilien-rechner', { totalCost: total, landSharePct: 25, afaType: 'after1925', taxRate: 42 });
  const firstYearMonths = 3;

  return {
    sections: [
      {
        title: 'AfA nach Baujahr für 380.000 € Kaufpreis',
        content: `Gerechnet mit 25 % Grundstücksanteil und 42 % Grenzsteuersatz. Die Spalte Abschreibungsdauer zeigt, nach wie vielen Jahren das Gebäude bei linearer AfA vollständig abgeschrieben ist.\n\n| Baujahr (§ 7 Abs. 4 EStG) | Abschreibungsdauer | AfA pro Jahr | Steuerersparnis pro Jahr |\n| --- | --- | --- | --- |\n${rows}\n\nFür neue Wohngebäude mit Baubeginn zwischen dem 1. Oktober 2023 und dem 30. September 2029 erlaubt § 7 Abs. 5a EStG statt der 3 % eine degressive AfA von 5 % des jeweiligen Restwerts. Ein späterer Wechsel zur linearen AfA ist möglich.`,
      },
      {
        title: 'Der Grundstücksanteil entscheidet mit',
        content: `Weil nur das Gebäude abgeschrieben wird, verschiebt jeder Prozentpunkt Bodenanteil die AfA. Bei 380.000 € Gesamtkosten und 2 % AfA:\n\n| Grundstücksanteil | Abschreibbarer Gebäudewert | AfA pro Jahr |\n| --- | --- | --- |\n${landRows}\n\nIn Großstädten mit hohen Bodenrichtwerten fällt der Grundstücksanteil oft deutlich höher aus als in ländlichen Lagen. Eine im Kaufvertrag vereinbarte Aufteilung übernimmt das Finanzamt nur, wenn sie wirtschaftlich plausibel ist.`,
      },
    ],
    faqs: [
      {
        question: 'Wie hoch ist die AfA im Jahr des Kaufs?',
        answer: `Nur anteilig für die Monate ab dem Monat des Übergangs von Nutzen und Lasten. Geht die Wohnung im Oktober über, zählen Oktober bis Dezember, also ${firstYearMonths} Monate: Aus ${eur(sec(base, 'yearlyAfa'))} Jahres-AfA werden im ersten Jahr ${eur((sec(base, 'yearlyAfa') * firstYearMonths) / 12)}. Ab dem zweiten Jahr gilt der volle Betrag.`,
      },
      {
        question: 'Gehören Grunderwerbsteuer, Notar und Makler zur AfA-Bemessungsgrundlage?',
        answer: 'Ja, sie sind Anschaffungsnebenkosten und werden im selben Verhältnis wie der Kaufpreis auf Gebäude und Grundstück verteilt. Nur der Gebäudeteil wird abgeschrieben. Tragen Sie deshalb im Rechner den Kaufpreis einschließlich dieser Nebenkosten ein. Notar- und Grundbuchkosten für die Grundschuld gehören nicht dazu, sie sind sofort abziehbare Finanzierungskosten.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// abstandszahlung-rechner
// ---------------------------------------------------------------------------
function abstandszahlung(): PageContentOverlay {
  const price = 6000;
  const rows = [1, 2, 4, 6, 8, 10]
    .map((age) => {
      const r15 = run('abstandszahlung-rechner', { originalPrice: price, ageYears: age, totalLifespan: 15 });
      const r10 = run('abstandszahlung-rechner', { originalPrice: price, ageYears: age, totalLifespan: 10 });
      return `| ${age} ${age === 1 ? 'Jahr' : 'Jahre'} | ${eur(Number(r15.primary.value))} (${pct(sec(r15, 'pctRemaining'), 0)}) | ${eur(Number(r10.primary.value))} (${pct(sec(r10, 'pctRemaining'), 0)}) |`;
    })
    .join('\n');
  const asked = 4500;
  const r4 = run('abstandszahlung-rechner', { originalPrice: price, ageYears: 4, totalLifespan: 15 });

  return {
    sections: [
      {
        title: 'Zeitwert einer 6.000-€-Küche nach Alter',
        content: `Der Rechner zieht im ersten Jahr 24 % ab und verteilt den Rest gleichmäßig auf die übrige Nutzungsdauer. Welche Gesamtdauer Sie ansetzen, verändert das Ergebnis deutlich:\n\n| Alter | Nutzungsdauer 15 Jahre | Nutzungsdauer 10 Jahre |\n| --- | --- | --- |\n${rows}\n\nFür eine hochwertige Küche mit Markengeräten ist eine längere Dauer vertretbar, für eine einfache Küche mit stark beanspruchter Arbeitsplatte eine kürzere. Schäden, fehlende Teile oder veraltete Geräte mindern den Wert zusätzlich.`,
      },
      {
        title: 'Was das Gesetz zur Ablöse sagt',
        content: 'Maßgeblich ist § 4a des Gesetzes zur Regelung der Wohnungsvermittlung:\n\n- **Geld fürs Ausziehen ist unwirksam:** Eine Vereinbarung, nach der Sie dem Vormieter etwas dafür zahlen, dass er die Wohnung freimacht, ist unwirksam. Erlaubt ist nur die Erstattung nachgewiesener Umzugskosten des Vormieters.\n- **Ablöse gilt nur mit Mietvertrag:** Ein Kaufvertrag über Küche oder Möbel, den Sie im Zusammenhang mit der Wohnung schließen, steht im Zweifel unter der Bedingung, dass der Mietvertrag zustande kommt.\n- **Kein Wucherpreis:** Die Preisabrede ist unwirksam, soweit der Preis in einem auffälligen Missverhältnis zum Wert der Einrichtung steht. Einen festen Prozentsatz nennt das Gesetz nicht.',
      },
    ],
    faqs: [
      {
        question: 'Wie verhandle ich eine überhöhte Ablöse für die Küche?',
        answer: `Legen Sie den errechneten Zeitwert und die Rechnung des Neukaufs zugrunde. Verlangt der Vormieter für eine vier Jahre alte Küche mit ${eur(price)} Neupreis ${eur(asked)}, liegt das um ${eur(asked - Number(r4.primary.value))} über dem Zeitwert von ${eur(Number(r4.primary.value))} bei 15 Jahren Nutzungsdauer. Bitten Sie um Belege zum Kaufpreis und prüfen Sie Geräte und Arbeitsplatte vor Ort.`,
      },
      {
        question: 'Kann ich eine zu hohe Abstandszahlung zurückfordern?',
        answer: 'Ja, soweit der Preis in einem auffälligen Missverhältnis zum Wert stand, ist die Preisabrede unwirksam und der überhöhte Teil kann zurückgefordert werden. Eine Zahlung nur dafür, dass der Vormieter auszieht, ist ganz unwirksam, ausgenommen nachgewiesene Umzugskosten. Bewahren Sie Quittungen, Fotos und den Schriftverkehr auf.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// erbbaurecht-erbbauzins-rechner
// ---------------------------------------------------------------------------
function erbbaurecht(): PageContentOverlay {
  const lands = [120000, 180000, 300000];
  const rates = [3, 4, 5];
  const rows = lands
    .map((l) => `| ${eur(l)} | ${rates.map((z) => {
      const r = run('erbbaurecht-erbbauzins-rechner', { landValue: l, interestRate: z, leaseYears: 99 });
      return `${eur(Number(r.primary.value))} (${eur(sec(r, 'monthly'))}/Monat)`;
    }).join(' | ')} |`)
    .join('\n');
  const remaining = run('erbbaurecht-erbbauzins-rechner', { landValue: 180000, interestRate: 4, leaseYears: 40 });
  const yearly = Number(remaining.primary.value);
  const indexed = run('indexmiete-rechner', { currentRent: yearly, oldVpi: 100, newVpi: 106 });

  return {
    sections: [
      {
        title: 'Erbbauzins nach Bodenwert und Zinssatz',
        content: `Die Zinssätze sind **Beispielwerte**. Der tatsächliche Satz steht im Erbbaurechtsvertrag und wird zwischen Grundstückseigentümer und Erbbauberechtigtem frei vereinbart.\n\n| Bodenwert | 3 % | 4 % | 5 % |\n| --- | --- | --- | --- |\n${rows}\n\nBeim Kauf eines bestehenden Erbbaurechts zählt die Restlaufzeit: Bei ${eur(180000)} Bodenwert und 4 % summieren sich 40 verbleibende Jahre auf ${eur(sec(remaining, 'totalOverTerm'))} ohne spätere Anpassungen. Je kürzer die Restlaufzeit, desto wichtiger ist die Regelung zur Entschädigung bei Vertragsende, und desto schwieriger wird oft die Finanzierung.`,
      },
      {
        title: 'Diese Punkte sollte der Erbbaurechtsvertrag regeln',
        content: '- **Wertsicherung:** Bei Wohnnutzung begrenzt § 9a ErbbauRG Erhöhungen. Sie dürfen nicht unbillig sein, also in der Regel nicht über die Änderung der allgemeinen wirtschaftlichen Verhältnisse hinausgehen, und frühestens drei Jahre nach Vertragsschluss oder der letzten Erhöhung verlangt werden.\n- **Entschädigung bei Zeitablauf:** Höhe und Zahlungsweise können vereinbart oder ganz ausgeschlossen werden (§ 27 ErbbauRG). Dient das Erbbaurecht der Wohnversorgung minderbemittelter Bevölkerungskreise, sind mindestens zwei Drittel des gemeinen Werts zu zahlen.\n- **Zustimmungsvorbehalte:** Häufig braucht ein Verkauf oder die Belastung mit einer Grundschuld die Zustimmung des Grundstückseigentümers.\n- **Heimfall:** Er regelt die vorzeitige Rückübertragung, etwa bei Zahlungsverzug, und ist vom Ende durch Zeitablauf zu unterscheiden.',
      },
    ],
    faqs: [
      {
        question: 'Um wie viel darf der Erbbauzins steigen?',
        answer: `Bei Wohnnutzung grundsätzlich höchstens im Umfang der Änderung der allgemeinen wirtschaftlichen Verhältnisse seit Vertragsschluss, Änderungen des Bodenwerts bleiben dabei regelmäßig außer Betracht. Ist der Zins an den Verbraucherpreisindex gekoppelt und dieser um 6 % gestiegen, wird aus ${eur(yearly)} ein Jahreszins von ${eur(Number(indexed.primary.value))}. Eine neue Anpassung ist frühestens drei Jahre nach der letzten möglich.`,
      },
      {
        question: 'Kann der Grundstückseigentümer die Entschädigung am Vertragsende vermeiden?',
        answer: 'Ja, nach § 27 Abs. 3 ErbbauRG, indem er das Erbbaurecht vor Ablauf für die voraussichtliche Standdauer des Gebäudes verlängert. Lehnt der Erbbauberechtigte die Verlängerung ab, erlischt sein Anspruch auf Entschädigung. Die Verlängerung kann auch mehrfach angeboten werden.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// spekulationssteuer-immobilien-rechner
// ---------------------------------------------------------------------------
function spekulationssteuer(): PageContentOverlay {
  const rows = [0, 25000, 50000]
    .map((afa) => {
      const r = run('spekulationssteuer-immobilien-rechner', { salePrice: 420000, purchaseCost: 310000, claimedDepreciation: afa, taxRate: 35 });
      return `| ${eur(afa)} | ${eur(sec(r, 'taxableProfit'))} | ${eur(Number(r.primary.value))} |`;
    })
    .join('\n');
  const atLimit = run('spekulationssteuer-immobilien-rechner', { salePrice: 301000, purchaseCost: 300000, claimedDepreciation: 0, taxRate: 35 });

  return {
    sections: [
      {
        title: 'Die Zehnjahresfrist richtig berechnen',
        content: `Steuerpflichtig ist der Gewinn, wenn zwischen Anschaffung und Veräußerung nicht mehr als zehn Jahre liegen (§ 23 Abs. 1 Nr. 1 EStG). Für beide Zeitpunkte zählt das Datum des notariellen Kaufvertrags, nicht die Eintragung im Grundbuch und nicht die Schlüsselübergabe. Wer am 15. März 2016 gekauft hat, sollte den Verkaufsvertrag frühestens nach dem 15. März 2026 beurkunden lassen.\n\nDie Ausnahme für Selbstnutzung verlangt keine drei vollen Jahre: Es genügt, die Immobilie im Verkaufsjahr und in den beiden Kalenderjahren davor zu eigenen Wohnzwecken genutzt zu haben. Nur das mittlere Jahr muss vollständig abgedeckt sein, im ersten Jahr und im Verkaufsjahr reicht ein Teil, solange die Nutzung zusammenhängend ist.\n\nIn Vermietungsjahren geltend gemachte AfA mindert die Anschaffungskosten (§ 23 Abs. 3 EStG) und erhöht damit den Gewinn. Verkauf für 420.000 € nach Kauf für 310.000 €, 35 % Grenzsteuersatz:\n\n| Bisherige AfA | Steuerpflichtiger Gewinn | Steuer |\n| --- | --- | --- |\n${rows}\n\nSolidaritätszuschlag und Kirchensteuer sind im Ergebnis nicht enthalten.`,
      },
    ],
    faqs: [
      {
        question: 'Gibt es einen Freibetrag für private Veräußerungsgewinne?',
        answer: `Es gibt eine Freigrenze, keinen Freibetrag: Liegt der Gesamtgewinn aus allen privaten Veräußerungsgeschäften eines Kalenderjahres unter 1.000 €, bleibt er steuerfrei. Wird die Grenze erreicht, ist der gesamte Gewinn steuerpflichtig. Bei 900 € Gewinn zahlen Sie also nichts, bei genau 1.000 € Gewinn und 35 % Steuersatz dagegen ${eur(Number(atLimit.primary.value))}. Der Rechner prüft die Freigrenze nicht automatisch, ein Ergebnis unter dieser Schwelle müssen Sie selbst auf 0 € setzen.`,
      },
      {
        question: 'Kann ich einen Verlust aus dem Immobilienverkauf mit meinem Gehalt verrechnen?',
        answer: 'Nein. Verluste aus privaten Veräußerungsgeschäften dürfen nur mit Gewinnen aus solchen Geschäften im selben Jahr ausgeglichen werden. Was übrig bleibt, können Sie ins Vorjahr zurücktragen oder in spätere Jahre vortragen, aber wieder nur gegen private Veräußerungsgewinne. Dazu muss der Verlust in der Steuererklärung angegeben werden.',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// maklerprovision-rechner
// ---------------------------------------------------------------------------
function maklerprovision(): PageContentOverlay {
  const prices = [300000, 500000];
  const rates = [7.14, 5.95];
  const rows = prices
    .flatMap((p) =>
      rates.map((t) => {
        const r = run('maklerprovision-rechner', { purchasePrice: p, totalBrokerPct: t });
        return `| ${eur(p)} | ${pct(t)} (${pct(t / 2, 3)} je Seite) | ${eur(Number(r.primary.value))} | ${eur(sec(r, 'totalCost'))} | ${eur(sec(r, 'vat'))} |`;
      }),
    )
    .join('\n');
  const a = run('maklerprovision-rechner', { purchasePrice: 400000, totalBrokerPct: 7.14 });
  const b = run('maklerprovision-rechner', { purchasePrice: 400000, totalBrokerPct: 5.95 });

  return {
    sections: [
      {
        title: 'Käuferanteil bei 300.000 € und 500.000 €',
        content: `Die Sätze 7,14 % und 5,95 % entsprechen 3 % bzw. 2,5 % netto je Seite zuzüglich 19 % Umsatzsteuer. Sie sind übliche Größenordnungen, aber gesetzlich nicht festgelegt.\n\n| Kaufpreis | Gesamtprovision | Anteil Käufer | Gesamt beide Seiten | darin Umsatzsteuer |\n| --- | --- | --- | --- | --- |\n${rows}`,
      },
      {
        title: 'Welche Regel für Ihren Fall gilt',
        content: '- **Kauf einer Wohnung oder eines Einfamilienhauses durch einen Verbraucher:** Für Maklerverträge ab dem 23. Dezember 2020 gelten §§ 656a bis 656d BGB. Der Maklervertrag braucht Textform. Arbeitet der Makler für beide Seiten, müssen Käufer und Verkäufer gleich viel zahlen. Hat nur der Verkäufer den Makler beauftragt, darf er höchstens die Hälfte an den Käufer weitergeben.\n- **Mehrfamilienhaus, Baugrundstück, Gewerbe oder Käufer als Unternehmer:** Die Halbteilung gilt nicht, die Verteilung ist frei verhandelbar.\n- **Mietwohnung:** Hier gilt das Bestellerprinzip. Wohnungssuchende zahlen nur, wenn der Makler die Wohnung ausschließlich wegen ihres Suchauftrags beschafft hat, und dann höchstens zwei Monatsmieten ohne gesondert abgerechnete Nebenkosten, zuzüglich Umsatzsteuer (§§ 2, 3 WoVermRG).',
      },
    ],
    faqs: [
      {
        question: 'Muss ich als Käufer zahlen, bevor der Verkäufer seinen Anteil beglichen hat?',
        answer: 'Nein, wenn nur der Verkäufer den Makler beauftragt hat und einen Teil der Provision auf Sie abwälzt. Nach § 656d BGB wird Ihr Anteil erst fällig, wenn der Verkäufer seine Provision gezahlt und er oder der Makler das nachgewiesen hat. Zudem muss der Verkäufer mindestens denselben Betrag tragen wie Sie.',
      },
      {
        question: 'Ist die Maklerprovision verhandelbar?',
        answer: `Ja. Gesetzlich geregelt ist beim Wohnungs- und Hauskauf nur die gleiche Verteilung, nicht die Höhe. Bei 400.000 € Kaufpreis macht der Unterschied zwischen 7,14 % und 5,95 % für den Käufer ${eur(Number(a.primary.value) - Number(b.primary.value))} aus. Erlässt der Makler einer Seite ihren Anteil, wirkt das bei einem Doppelauftrag nach § 656c BGB auch zugunsten der anderen Seite.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// mietkaution-zinsen-rechner
// ---------------------------------------------------------------------------
function mietkaution(): PageContentOverlay {
  const deposit = 1800;
  const rates = [0.5, 1, 2];
  const rows = [3, 6, 10]
    .map((y) => `| ${y} Jahre | ${rates.map((z) => eur(sec(run('mietkaution-zinsen-rechner', { depositAmount: deposit, rentalYears: y, avgInterestRate: z }), 'totalInterest'))).join(' | ')} |`)
    .join('\n');
  const coldRent = 600;
  const maxDeposit = coldRent * 3;
  const instalment = maxDeposit / 3;

  return {
    sections: [
      {
        title: 'Zinsertrag einer Kaution von 1.800 €',
        content: `Wie viel Zins sich ansammelt, hängt vor allem von der Mietdauer ab. Die Zinssätze sind **Beispielwerte**, maßgeblich ist der übliche Satz für Spareinlagen mit dreimonatiger Kündigungsfrist bei der Bank, auf der die Kaution liegt.\n\n| Mietdauer | 0,5 % | 1 % | 2 % |\n| --- | --- | --- | --- |\n${rows}\n\nAuf dem Kautionskonto sind die Zinsen Ihre Kapitalerträge, auch wenn Sie erst beim Auszug an das Geld kommen.`,
      },
      {
        title: 'Kaution zahlen, anlegen und zurückbekommen',
        content: `- **Obergrenze:** höchstens drei Monatsmieten ohne Betriebskostenvorauszahlung oder -pauschale (§ 551 Abs. 1 BGB). Bei ${eur(coldRent)} Kaltmiete sind das ${eur(maxDeposit)}.\n- **Ratenzahlung:** Eine Geldkaution dürfen Sie in drei gleichen Monatsraten zahlen, hier je ${eur(instalment)}. Die erste ist zu Beginn des Mietverhältnisses fällig, die beiden weiteren mit den folgenden Mieten.\n- **Getrennte Anlage:** Der Vermieter muss das Geld getrennt von seinem Vermögen bei einem Kreditinstitut anlegen. Andere Anlageformen sind nur nach Vereinbarung möglich.\n- **Zinsen:** Sie stehen dem Mieter zu und erhöhen die Sicherheit. Nur bei Studenten- und Jugendwohnheimen entfällt die Verzinsungspflicht.\n- **Rückgabe:** Fordern Sie die Kaution nach dem Auszug schriftlich mit Kontoverbindung zurück und lassen Sie sich die Zinsabrechnung zeigen.`,
      },
    ],
    faqs: [
      {
        question: 'Darf ich die Kaution mit den letzten Mieten verrechnen?',
        answer: 'Grundsätzlich nicht. Die Kaution sichert auch Ansprüche, die erst nach dem Auszug feststehen, etwa Schäden an der Wohnung oder eine Nachzahlung aus der Betriebskostenabrechnung. Wer die letzten Mieten einfach nicht zahlt, gerät in Zahlungsverzug und muss mit Mahnkosten und Verzugszinsen rechnen.',
      },
      {
        question: 'Was passiert mit den Zinsen, wenn der Vermieter die Kaution nicht angelegt hat?',
        answer: `Sie haben trotzdem Anspruch auf die Zinsen, die eine gesetzeskonforme Anlage erbracht hätte. Rechnen Sie sie mit dem Rechner und dem damals üblichen Sparzins nach: ${eur(deposit)} über 6 Jahre bei 1 % ergeben ${eur(sec(run('mietkaution-zinsen-rechner', { depositAmount: deposit, rentalYears: 6, avgInterestRate: 1 }), 'totalInterest'))} Zinsen. Sie können außerdem verlangen, dass der Vermieter die getrennte Anlage nachweist.`,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// modernisierungsumlage-rechner
// ---------------------------------------------------------------------------
function modernisierungsumlage(): PageContentOverlay {
  const area = 75;
  const cases: Array<[number, number, number]> = [
    [25000, 6000, 8.5],
    [45000, 6000, 8.5],
    [45000, 6000, 6.5],
    [60000, 0, 8.5],
  ];
  const rows = cases
    .map(([cost, maint, rentSqm]) => {
      const r = run('modernisierungsumlage-rechner', { modernizationCosts: cost, maintenanceShare: maint, livingArea: area, currentRentSqm: rentSqm });
      return `| ${eur(cost)} | ${eur(maint)} | ${eur(rentSqm)} | ${eur(sec(r, 'uncappedMonthly'))} | ${eur(Number(r.primary.value))} |`;
    })
    .join('\n');
  const simpleCost = 10000;
  const simple = run('modernisierungsumlage-rechner', { modernizationCosts: simpleCost, maintenanceShare: simpleCost * 0.3, livingArea: area, currentRentSqm: 8.5 });

  return {
    sections: [
      {
        title: 'Wann die Kappungsgrenze greift',
        content: `Beispiel für eine ${area}-m²-Wohnung. Ohne Kappung wären 8 % der umlagefähigen Kosten auf die Jahresmiete umzulegen. § 559 Abs. 3a BGB begrenzt die monatliche Erhöhung innerhalb von sechs Jahren auf 3 €/m², bei einer bisherigen Miete unter 7 €/m² auf 2 €/m².\n\n| Kosten | Erhaltungsanteil | Miete bisher je m² | Erhöhung ohne Kappung | Zulässige Erhöhung |\n| --- | --- | --- | --- | --- |\n${rows}\n\nDer Rechner prüft eine einzelne Maßnahme. Hat der Vermieter in den vergangenen sechs Jahren schon wegen Modernisierung erhöht, wird diese Erhöhung auf die Kappungsgrenze angerechnet. Für bestimmte Heizungsmaßnahmen gilt zusätzlich eine eigene Grenze von 0,50 €/m².`,
      },
      {
        title: 'Vereinfachtes Verfahren bis 10.000 €',
        content: `Bei Kosten bis 10.000 € je Wohnung darf der Vermieter das vereinfachte Verfahren nach § 559c BGB nutzen. Statt den Erhaltungsanteil einzeln nachzuweisen, zieht er pauschal 30 % ab. Bei ${eur(simpleCost)} und ${area} m² bleiben ${eur(sec(simple, 'eligibleCosts'))} umlagefähig, die Miete steigt um ${eur(Number(simple.primary.value))} im Monat. Wählt er dieses Verfahren, muss er das in der Erhöhungserklärung angeben und kann danach in der Regel fünf Jahre lang keine weitere Modernisierungsumlage verlangen. Kosten, die in den letzten fünf Jahren bereits im vereinfachten Verfahren oder nach § 559 BGB geltend gemacht wurden, mindern den Höchstbetrag.`,
      },
    ],
    faqs: [
      {
        question: 'Fällt die Modernisierungsumlage nach einigen Jahren wieder weg?',
        answer: 'Nein. Die Erhöhung wird Teil der regulären Miete und bleibt auch dann bestehen, wenn die Kosten rechnerisch längst abbezahlt sind. Bei einer späteren Mieterhöhung auf die ortsübliche Vergleichsmiete wird die modernisierte Ausstattung ebenfalls berücksichtigt.',
      },
      {
        question: 'Wie mache ich eine finanzielle Härte gegen die Umlage geltend?',
        answer: 'Die Mieterhöhung ist ausgeschlossen, soweit sie für Sie unter Berücksichtigung der voraussichtlichen künftigen Betriebskosten eine nicht zu rechtfertigende Härte wäre (§ 559 Abs. 4 BGB). Diese Härte müssen Sie in Textform bis zum Ablauf des Monats mitteilen, der auf den Zugang der Modernisierungsankündigung folgt. Liegt die tatsächliche Erhöhung später um mehr als 10 % über der angekündigten, gilt diese Frist nicht.',
      },
    ],
  };
}

export const WOHNEN_PAGE_CONTENT: PageContentMap = {
  'quadratmeterpreis-rechner': quadratmeterpreis(),
  'mietrendite-brutto-netto-rechner': mietrendite(),
  'grundsteuer-reform-rechner': grundsteuer(),
  'notar-grundbuch-kosten-rechner': notar(),
  'hausgeld-rechner': hausgeld(),
  'untermiete-rechner': untermiete(),
  'staffelmiete-rechner': staffelmiete(),
  'indexmiete-rechner': indexmiete(),
  'mietminderung-rechner': mietminderung(),
  'abschreibung-immobilien-rechner': abschreibung(),
  'abstandszahlung-rechner': abstandszahlung(),
  'erbbaurecht-erbbauzins-rechner': erbbaurecht(),
  'spekulationssteuer-immobilien-rechner': spekulationssteuer(),
  'maklerprovision-rechner': maklerprovision(),
  'mietkaution-zinsen-rechner': mietkaution(),
  'modernisierungsumlage-rechner': modernisierungsumlage(),
};
