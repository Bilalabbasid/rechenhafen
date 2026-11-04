import { CalculatorDefinition } from '@/types/calculator';
import {
  calculatePaintAmount,
  calculateFlooring,
  calculateConcreteVolume,
} from '@/lib/calculators/bauen';
import { formatNumber } from '@/lib/formatters';

export const BAUEN_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'farbmengen-rechner',
    slug: 'farbmengen-rechner',
    name: 'Farbmengen-Rechner (Wandfarbe berechnen)',
    shortName: 'Wandfarbe berechnen',
    category: 'bauen-renovieren',
    subcategory: 'Wand & Decke',
    metaTitle: 'Farbmengen Rechner – Wie viel Wandfarbe brauche ich?',
    metaDescription: 'Berechnen Sie die benötigte Menge Wandfarbe in Litern und Eimern für Ihre Raumgröße. Berücksichtigt Fenster, Türen & Anstriche.',
    h1: 'Farbmengen Rechner für Wandfarbe & Renovierung',
    shortDescription: 'Ermittelt den genauen Farbbedarf in Litern und Farbeimern für Wände und Decken.',
    searchKeywords: ['farbmengen rechner', 'wandfarbe berechnen', 'wieviel farbe brauche ich für 50 qm', 'farbbedarf berechnen'],
    inputs: [
      { id: 'roomLength', label: 'Raumlänge in Metern', type: 'number', defaultValue: 5.0, min: 1, step: 0.1, unit: 'm' },
      { id: 'roomWidth', label: 'Raumbreite in Metern', type: 'number', defaultValue: 4.0, min: 1, step: 0.1, unit: 'm' },
      { id: 'roomHeight', label: 'Raumhöhe in Metern', type: 'number', defaultValue: 2.5, min: 1, step: 0.05, unit: 'm' },
      {
        id: 'includeCeiling',
        label: 'Zusätzlich Zimmerdecke streichen',
        type: 'select',
        defaultValue: 'no',
        options: [
          { value: 'no', label: 'Nein (nur Wände streichen)' },
          { value: 'yes', label: 'Ja (+ Deckenfläche einrechnen)' },
        ],
      },
      {
        id: 'deductOpenings',
        label: 'Fenster & Türen abziehen',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Ja, Öffnungen abziehen' },
          { value: 'no', label: 'Nein, gesamte Wandfläche voll berechnen' },
        ],
      },
      { id: 'openingDeductionSqm', label: 'Abzuziehende Fenster- & Türfläche', type: 'number', defaultValue: 5.0, min: 0, step: 0.5, unit: 'm²', helpText: 'Beispielwert. 0 m² eingeben, falls keine Fenster oder Türen abgezogen werden sollen.' },
      { id: 'coats', label: 'Anzahl der Anstriche', type: 'number', defaultValue: 2, min: 1, max: 4, step: 1 },
      { id: 'coveragePerLiter', label: 'Ergiebigkeit der Farbe', type: 'number', defaultValue: 7.0, min: 4, max: 15, step: 0.5, unit: 'm²/Liter', helpText: 'Angabe auf dem Farbeimer, meist 6 bis 8 m²/l' },
      {
        id: 'wasteReservePercent',
        label: 'Sicherheitsreserve (Verlust & Ausbesserung)',
        type: 'select',
        defaultValue: '10',
        options: [
          { value: '0', label: '0 % (exakt berechnet)' },
          { value: '5', label: '5 % Reserve' },
          { value: '10', label: '10 % Reserve (empfohlen)' },
          { value: '15', label: '15 % Reserve (stark saugender Untergrund)' },
        ],
      },
    ],
    calculate: calculatePaintAmount,
    formula: 'Farbe in Liter = ((2 × (Länge + Breite) × Höhe - Fenster/Türen) × Anstriche) / Ergiebigkeit',
    formulaExplanation: 'Berechnung der gesamten Netto-Wandfläche geteilt durch die Herstellerangabe der Deckkraft in m² je Liter.',
    workedExample: {
      title: 'Beispiel: Raum 5m × 4m mit 2,5m Höhe und 5m² Fensterabzug',
      description: 'Netto-Wandfläche: 40 m². Bei 2 Anstrichen und 7 m²/l Deckkraft = ca. 11,4 Liter Farbe (2 × 10L Eimer).',
      inputs: { roomLength: 5.0, roomWidth: 4.0, roomHeight: 2.5, openingDeductionSqm: 5.0, coats: 2, coveragePerLiter: 7.0 },
      resultSummary: '11,4 Liter Farbe',
    },
    content: {
      intro: 'Dieser Farbrechner kalkuliert den genauen Farbbedarf in Litern für Wand- und Deckenanstriche aus Raummaßen, Deckkraft und Untergrundsaugfähigkeit.',
      details: 'Wandfläche = 2 · (Länge + Breite) · Raumhöhe abzüglich Fenster- und Türöffnungen. Bei durchschnittlicher Ergiebigkeit (ca. 6 bis 7 m² pro Liter) und stark saugendem Untergrund (Putz, Raufaser) sind meist zwei Anstriche erforderlich.',
    },
    faqs: [
      { question: 'Wie viel Prozent Verschnitt bzw. Sicherheitsreserve sollte man bei Farbe einplanen?', answer: 'Planen Sie ca. 10 bis 15 Prozent Reserve für Ecken, Kanten, Walzenverluste und spätere Ausbesserungsarbeiten ein.' },
      { question: 'Was bedeuten die Deckkraftklassen (Klasse 1 bis 4 nach DIN EN 13300)?', answer: 'Klasse 1 deckt bei vorgegebener Ergiebigkeit mindestens 99,5 % des Untergrunds ab (oft reicht 1 Anstrich); Klasse 2 deckt 98 bis 99,5 %; Klasse 3 und 4 erfordern fast immer Mehrfachanstrich.' },
    ],
    relatedSlugs: ['tapetenrollen-rechner', 'fassadenfarbe-rechner', 'trockenbau-gipskarton-rechner', 'bodenbelag-rechner', 'betonrechner', 'rechteckrechner', 'brennholz-raummeter-rechner'],
  },
  {
    id: 'bodenbelag-rechner',
    slug: 'bodenbelag-rechner',
    name: 'Bodenbelag- & Laminatrechner (mit Verschnitt)',
    shortName: 'Laminatrechner',
    category: 'bauen-renovieren',
    subcategory: 'Bodenbeläge',
    metaTitle: 'Laminatrechner – Quadratmeter Bodenbelag',
    metaDescription: 'Berechnen Sie den Materialbedarf für Laminat, Parkett oder Vinyl inklusive 5–10 % Verschnitt, Sockelleisten und Paketanzahl.',
    h1: 'Bodenbelag- & Laminatrechner mit Verschnitt',
    shortDescription: 'Ermittelt benötigte Quadratmeter und Paketmengen für Laminat, Parkett und Fliesen.',
    searchKeywords: ['laminatrechner', 'bodenbelag rechner verschnitt', 'wie viel laminat brauche ich', 'parkett quadratmeter berechnen'],
    inputs: [
      { id: 'length', label: 'Raumlänge in Metern', type: 'number', defaultValue: 5.5, step: 0.1, unit: 'm' },
      { id: 'width', label: 'Raumbreite in Metern', type: 'number', defaultValue: 4.2, step: 0.1, unit: 'm' },
      { id: 'wastePercent', label: 'Verschnittzuschlag', type: 'number', defaultValue: 10, min: 0, max: 25, unit: '%', helpText: 'Gerade Verlegung: 5–10 %, Diagonal: 10–15 %' },
      { id: 'packSizeSqm', label: 'Paketinhalt laut Hersteller', type: 'number', defaultValue: 2.22, step: 0.01, unit: 'm²/Paket' },
    ],
    calculate: calculateFlooring,
    formula: 'Bedarf = (Länge × Breite) × (1 + Verschnitt / 100)',
    formulaExplanation: 'Die Grundfläche wird mit dem Verschnittfaktor multipliziert und durch den Paketinhalt geteilt (stets aufgerundet auf ganze Pakete).',
    workedExample: {
      title: 'Beispiel: 5,5m × 4,2m Raum mit 10 % Verschnitt',
      description: 'Reine Fläche: 23,10 m². Inkl. Verschnitt: 25,41 m² (12 Pakete à 2,22 m²).',
      inputs: { length: 5.5, width: 4.2, wastePercent: 10, packSizeSqm: 2.22 },
      resultSummary: '25,41 m² (12 Pakete)',
    },
    content: {
      intro: 'Dieser Mengenrechner bestimmt den Quadratmeterbedarf für Laminat, Parkett, Vinyl oder Fliesen inklusive maßgeschneidertem Verschnittaufschlag. Mehr erfahren: [Wie viel Laminat brauche ich? Pakete, Gewicht und Verschnitt berechnen](/ratgeber/laminat-bedarf-gewicht-verschnitt/)',
      details: 'Raumfläche = Länge · Breite. Für rechtwinklige Räume im Standardverband genügen ca. 5 bis 7 Prozent Verschnitt; bei diagonalem Verlegemuster, unregelmäßigen Winkeln oder Erkern sollten 10 bis 12 Prozent eingerechnet werden.',
    },
    faqs: [
      { question: 'Muss Bodenbelag vor der Verlegung akklimatisiert werden?', answer: 'Ja, Parkett, Laminat und Klick-Vinyl sollten mindestens 48 Stunden ungeöffnet flach liegend im Verlegeraum bei normaler Raumtemperatur gelagert werden.' },
      { question: 'Wie rechnet man die benötigte Paketanzahl aus?', answer: 'Teilen Sie die Gesamtfläche inklusive Verschnitt durch den m²-Inhalt eines Pakets und runden Sie immer auf die nächste volle Packung auf.' },
    ],
    relatedSlugs: ['tapetenrollen-rechner', 'farbmengen-rechner', 'betonrechner', 'rechteckrechner', 'brennholz-raummeter-rechner'],
  },
  {
    id: 'betonrechner',
    slug: 'betonrechner',
    name: 'Betonrechner (Volumen, Fertigbeton-Säcke & Mischungsverhältnis)',
    shortName: 'Beton berechnen',
    category: 'bauen-renovieren',
    subcategory: 'Baustoffe & Beton',
    metaTitle: 'Betonrechner: Menge in m³, Säcke & Mischverhältnis',
    metaDescription: 'Betonmenge kostenlos berechnen: Kubikmeter, Fertigbeton-Säcke oder Zement, Kies und Wasser zum Selbstmischen – mit Reserve für Verdichtung.',
    h1: 'Betonrechner: Wie viel Beton brauche ich?',
    shortDescription: 'Berechnet das Betonvolumen für Fundament, Platte oder Sockel und zeigt, wie viele Fertigbeton-Säcke oder wie viel Zement, Kies und Wasser Sie brauchen.',
    searchKeywords: [
      'betonrechner',
      'betonvolumen berechnen',
      'wie viel beton brauche ich',
      'wieviel fertigbeton säcke brauche ich',
      'beton mischungsverhältnis',
      'beton selber mischen verhältnis',
      'zement kies wasser verhältnis',
      'wie viel zement für 1 m3 beton',
    ],
    inputs: [
      { id: 'lengthM', label: 'Länge', type: 'number', defaultValue: 3.0, min: 0.1, step: 0.1, unit: 'm' },
      { id: 'widthM', label: 'Breite', type: 'number', defaultValue: 2.0, min: 0.1, step: 0.1, unit: 'm' },
      { id: 'depthCm', label: 'Dicke bzw. Tiefe', type: 'number', defaultValue: 15, min: 1, step: 1, unit: 'cm' },
      {
        id: 'reservePercent',
        label: 'Reserve für Verdichtung & Unebenheiten',
        type: 'select',
        defaultValue: '5',
        options: [
          { value: '0', label: 'Keine Reserve' },
          { value: '5', label: '5 % (ebener, verdichteter Untergrund)' },
          { value: '10', label: '10 % (Erdreich, unebene Baugrube)' },
        ],
      },
      {
        id: 'supplyMode',
        label: 'Wie möchten Sie betonieren?',
        type: 'select',
        defaultValue: 'bags',
        options: [
          { value: 'bags', label: 'Fertigbeton aus Säcken (Trockenbeton)' },
          { value: 'mix', label: 'Selbst mischen (Zement + Betonkies)' },
          { value: 'transport', label: 'Transportbeton bestellen' },
        ],
      },
      { id: 'bagWeightKg', label: 'Sackgewicht', type: 'number', defaultValue: 25, min: 1, step: 5, unit: 'kg', dependsOn: { field: 'supplyMode', value: 'bags' } },
      {
        id: 'mixRatio',
        label: 'Betonsorte',
        type: 'select',
        defaultValue: 'standard',
        dependsOn: { field: 'supplyMode', value: 'mix' },
        options: [
          { value: 'standard', label: 'Normalbeton C20/25 – Zement : Kies ≈ 1 : 4' },
          { value: 'strong', label: 'Höhere Festigkeit C25/30 – Zement : Kies ≈ 1 : 3' },
          { value: 'lean', label: 'Magerbeton / Sauberkeitsschicht – ≈ 1 : 7' },
        ],
      },
    ],
    calculate: (inputs) => {
      const base = calculateConcreteVolume(inputs);
      if (base.error) return base;

      const reservePct = Math.max(0, parseFloat(String(inputs.reservePercent ?? '0')) || 0);
      const netM3 = Number(base.primary.value);
      const m3 = netM3 * (1 + reservePct / 100);
      const mode = inputs.supplyMode === 'mix' || inputs.supplyMode === 'transport' ? inputs.supplyMode : 'bags';
      const fmtM3 = (v: number) => `${formatNumber(v, 2)} m³ (${formatNumber(v * 1000, 0)} Liter)`;
      const area = base.secondary?.find((x) => x.id === 'area');

      const primary = {
        id: 'volume',
        label: reservePct > 0 ? `Betonmenge inkl. ${reservePct} % Reserve` : 'Benötigtes Betonvolumen',
        value: m3,
        formattedValue: fmtM3(m3),
        highlight: true,
      };
      const netItem = { id: 'netVolume', label: 'Reines Volumen ohne Reserve', value: netM3, formattedValue: fmtM3(netM3) };
      const transportHint =
        m3 >= 1.5 && mode !== 'transport'
          ? 'Ab etwa 1,5 m³ ist Transportbeton aus dem Fahrmischer meist günstiger und gleichmäßiger als Sackware oder Selbstmischen.'
          : undefined;

      if (mode === 'mix') {
        const MIX = {
          standard: { cement: 300, gravel: 1800, water: 165, shovels: 4, label: 'C20/25 (1 : 4)' },
          strong: { cement: 350, gravel: 1750, water: 175, shovels: 3, label: 'C25/30 (1 : 3)' },
          lean: { cement: 180, gravel: 1950, water: 140, shovels: 7, label: 'Magerbeton (≈ 1 : 7)' },
        } as const;
        const mix = MIX[(inputs.mixRatio as keyof typeof MIX) in MIX ? (inputs.mixRatio as keyof typeof MIX) : 'standard'];
        const cementKg = Math.round(m3 * mix.cement);
        const gravelKg = Math.round(m3 * mix.gravel);
        const waterL = Math.round(m3 * mix.water);
        const sacks = Math.ceil(cementKg / 25);
        return {
          primary,
          secondary: [
            { id: 'cementSacks', label: 'Zement (25-kg-Säcke)', value: sacks, formattedValue: `${sacks} Säcke (${formatNumber(cementKg, 0)} kg)`, highlight: true },
            { id: 'gravelKg', label: 'Betonkies 0/16 mm', value: gravelKg, formattedValue: `${formatNumber(gravelKg, 0)} kg (${formatNumber(gravelKg / 1000, 2)} t)` },
            { id: 'waterL', label: 'Anmachwasser ca.', value: waterL, formattedValue: `${formatNumber(waterL, 0)} Liter` },
            { id: 'shovelRatio', label: 'Faustregel in Schaufeln', value: mix.shovels, formattedValue: `1 Schaufel Zement auf ${mix.shovels} Schaufeln Kies` },
          ],
          details: [netItem, ...(area ? [area] : [])],
          summaryText: `Für ${formatNumber(m3, 2)} m³ ${mix.label} brauchen Sie ${sacks} Säcke Zement, rund ${formatNumber(gravelKg / 1000, 2)} t Betonkies und etwa ${formatNumber(waterL, 0)} Liter Wasser.`,
          warning: transportHint,
        };
      }

      if (mode === 'transport') {
        return {
          primary,
          secondary: [
            { id: 'freshWeight', label: 'Gewicht Frischbeton (ca. 2,4 t/m³)', value: m3 * 2400, formattedValue: `ca. ${formatNumber((m3 * 2400) / 1000, 2)} t` },
            netItem,
            ...(area ? [area] : []),
          ],
          summaryText: `Bestellen Sie rund ${formatNumber(m3, 2)} m³ Transportbeton. Mindestmengen, Lieferpauschale und Pumpenkosten erfragen Sie beim Betonwerk.`,
        };
      }

      const bagWeightKg = parseFloat(String(inputs.bagWeightKg)) > 0 ? parseFloat(String(inputs.bagWeightKg)) : 25;
      const dryKg = m3 * 2100;
      const bags = Math.ceil(dryKg / bagWeightKg);
      return {
        primary,
        secondary: [
          { id: 'bags', label: `Fertigbeton-Säcke à ${formatNumber(bagWeightKg, 0)} kg`, value: bags, formattedValue: `${bags} Säcke`, highlight: true },
          { id: 'weight', label: 'Trockenbeton gesamt', value: dryKg, formattedValue: `ca. ${formatNumber(dryKg, 0)} kg (${formatNumber(dryKg / 1000, 2)} t)` },
          netItem,
          ...(area ? [area] : []),
        ],
        summaryText: `Für ${formatNumber(m3, 2)} m³ Beton brauchen Sie etwa ${bags} Säcke Fertigbeton à ${formatNumber(bagWeightKg, 0)} kg.`,
        warning: transportHint,
      };
    },
    formula: 'Volumen (m³) = Länge × Breite × Dicke (m) × (1 + Reserve)',
    formulaExplanation: 'Aus dem Volumen ergibt sich die Menge: Trockenbeton wiegt rund 2.100 kg pro m³ fertigen Beton. Zum Selbstmischen braucht 1 m³ Normalbeton C20/25 etwa 300 kg Zement, 1.800 kg Betonkies und 165 Liter Wasser.',
    workedExample: {
      title: 'Bodenplatte 3 × 2 m, 15 cm dick, aus Säcken',
      description: '3 m × 2 m × 0,15 m = 0,90 m³. Mit 5 % Reserve sind es 0,945 m³, also rund 1.985 kg Trockenbeton – 80 Säcke à 25 kg.',
      inputs: { lengthM: 3, widthM: 2, depthCm: 15, reservePercent: '5', supplyMode: 'bags', bagWeightKg: 25 },
      resultSummary: '0,95 m³ – 80 Säcke à 25 kg',
      },
    workedExamples: [
      {
        title: 'Bodenplatte 3 × 2 m, 15 cm dick, aus Säcken',
        description: '3 m × 2 m × 0,15 m = 0,90 m³. Mit 5 % Reserve sind es 0,945 m³, also rund 1.985 kg Trockenbeton – 80 Säcke à 25 kg.',
        inputs: { lengthM: 3, widthM: 2, depthCm: 15, reservePercent: '5', supplyMode: 'bags', bagWeightKg: 25 },
        resultSummary: '0,95 m³ – 80 Säcke à 25 kg',
      },
      {
        title: 'Fundament 2 × 0,5 m, 50 cm tief, selbst gemischt',
        description: '2 m × 0,5 m × 0,5 m = 0,50 m³, mit 5 % Reserve 0,525 m³. Für C20/25: 158 kg Zement (7 Säcke), rund 945 kg Kies und 87 Liter Wasser.',
        inputs: { lengthM: 2, widthM: 0.5, depthCm: 50, reservePercent: '5', supplyMode: 'mix', mixRatio: 'standard' },
        resultSummary: '7 Säcke Zement, 0,95 t Kies, 87 l Wasser',
      },
    ],
    content: {
      intro: 'Der Betonrechner ermittelt aus Länge, Breite und Dicke, wie viel Beton Sie für eine Bodenplatte, ein Fundament oder einen Sockel brauchen – und übersetzt das Volumen in Fertigbeton-Säcke oder in Zement, Kies und Wasser zum Selbstmischen. Für Streifen- und Punktfundamente mit Frosttiefe nutzen Sie den [Fundament-Rechner](/rechner/fundament-rechner/).',
      sections: [
        {
          title: 'Säcke, selbst mischen oder Transportbeton?',
          content: '- **Fertigbeton aus Säcken** ist bequem für kleine Mengen bis etwa 0,5 m³, zum Beispiel für Zaunpfosten oder eine kleine Platte.\n- **Selbst mischen** aus Zement und Betonkies ist bei mittleren Mengen deutlich günstiger, braucht aber einen Mischer und etwas Übung.\n- **Transportbeton** lohnt sich meist ab 1 bis 1,5 m³. Er kommt gleichmäßig gemischt in der bestellten Festigkeitsklasse.',
        },
        {
          title: 'Das richtige Mischungsverhältnis',
          content: 'Für Normalbeton C20/25 gilt die Faustregel 1 : 4 – eine Schaufel Zement auf vier Schaufeln Betonkies 0/16. Für stärker belastete Bauteile nehmen Sie mehr Zement (etwa 1 : 3), für eine Sauberkeitsschicht genügt Magerbeton (etwa 1 : 7). Geben Sie Wasser nach und nach zu: Der Wasser-Zement-Wert sollte zwischen 0,50 und 0,60 liegen. Zu viel Wasser macht den Beton schwach und rissanfällig.',
        },
        {
          title: 'Warum eine Reserve sinnvoll ist',
          content: 'Beim Verdichten und durch Unebenheiten im Untergrund geht Volumen verloren. Auf ebenem, verdichtetem Schotter reichen 5 %, in einer Baugrube im Erdreich eher 10 %. Ein halber Sack zu viel ist billiger als eine Betonierfuge, weil das Material ausgeht.',
        },
      ],
    },
    faqs: [
      { question: 'Wie viel Beton brauche ich für 1 m² Bodenplatte?', answer: 'Das hängt von der Dicke ab: Bei 10 cm sind es 0,1 m³, bei 15 cm 0,15 m³ pro Quadratmeter. Rechnen Sie 5 bis 10 % Reserve für Verdichtung dazu.' },
      { question: 'Wie viele Säcke Fertigbeton ergeben 1 m³?', answer: 'Für 1 m³ fertigen Beton brauchen Sie rund 2.100 kg Trockenbeton, also etwa 84 Säcke à 25 kg oder 53 Säcke à 40 kg. Die genaue Ergiebigkeit steht auf dem Sack.' },
      { question: 'Wie viel Zement brauche ich für 1 m³ Beton?', answer: 'Für Normalbeton C20/25 etwa 300 kg Zement – das sind 12 Säcke à 25 kg. Dazu kommen rund 1.800 kg Betonkies und 165 Liter Wasser.' },
      { question: 'Was ist das Mischungsverhältnis für Beton?', answer: 'Für die meisten Arbeiten im Garten und am Haus gilt 1 Teil Zement auf 4 Teile Betonkies. Das entspricht etwa einem Beton der Klasse C20/25.' },
      { question: 'Ab wann lohnt sich Transportbeton?', answer: 'Meist ab 1 bis 1,5 m³. Darunter fallen die Lieferpauschalen stark ins Gewicht. Darüber sparen Sie viel Arbeit, und der Beton ist gleichmäßiger gemischt.' },
    ],
    relatedSlugs: ['fundament-rechner', 'estrich-rechner', 'schalungssteine-rechner', 'kies-splitt-rechner', 'zaun-pfosten-rechner', 'aushub-erdarbeiten-rechner'],
  },
];
