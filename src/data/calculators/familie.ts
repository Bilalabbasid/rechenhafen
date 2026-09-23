import { CalculatorDefinition } from '@/types/calculator';
import {
  calculatePregnancyDueDate,
  calculateFertileDays,
} from '@/lib/calculators/familie';

export const FAMILIE_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'geburtstermin-rechner',
    slug: 'geburtstermin-rechner',
    name: 'Geburtstermin-Rechner (Naegele-Regel)',
    shortName: 'Geburtstermin',
    category: 'familie-schwangerschaft',
    subcategory: 'Schwangerschaft & Geburt',
    metaTitle: 'Geburtstermin Rechner – Voraussichtlichen Entbindungstermin...',
    metaDescription: 'Berechnen Sie Ihren Geburtstermin und die aktuelle Schwangerschaftswoche (SSW) nach der erweiterten Naegele-Regel online.',
    h1: 'Geburtstermin Rechner nach der Naegele-Regel',
    shortDescription: 'Ermittelt den voraussichtlichen Entbindungstermin (ET) und die aktuelle SSW mit Zykluslängen-Korrektur.',
    searchKeywords: ['geburtstermin rechner', 'et berechnen', 'naegele regel rechner', 'wann kommt mein baby', 'schwangerschaftswoche berechnen'],
    inputs: [
      { id: 'lastPeriodDate', label: 'Erster Tag der letzten Monatsblutung', type: 'date', defaultValue: '2026-01-01' },
      { id: 'cycleLength', label: 'Durchschnittliche Zykluslänge (in Tagen)', type: 'number', defaultValue: 28, min: 21, max: 45, step: 1, unit: 'Tage', helpText: 'Normalbereich: 26–32 Tage' },
    ],
    calculate: calculatePregnancyDueDate,
    formula: 'ET = 1. Tag der letzten Periode + 7 Tage - 3 Monate + 1 Jahr + (Zyklusdauer - 28 Tage)',
    formulaExplanation: 'Die erweiterte Naegele-Regel geht von einer durchschnittlichen Schwangerschaftsdauer von 280 Tagen (40 Wochen) aus und korrigiert Abweichungen vom 28-Tage-Normzyklus.',
    workedExample: {
      title: 'Beispiel: Letzte Periode am 01.01.2026 bei 28 Tagen Zyklus',
      description: 'Errechneter Geburtstermin: 08.10.2026.',
      inputs: { lastPeriodDate: '2026-01-01', cycleLength: 28 },
      resultSummary: '08.10.2026',
    },
    content: {
      intro: 'Die erweiterte Naegele-Regel berechnet den voraussichtlichen Entbindungstermin (ET) ausgehend vom ersten Tag der letzten Periode und der individuellen Zyklusdauer.',
      details: 'Klassische Naegele-Formel: Erster Tag der letzten Periode + 7 Tage - 3 Monate + 1 Jahr. Weicht der Zyklus von 28 Tagen ab, wird die Differenz (Zykluslänge - 28) taggenau addiert oder subtrahiert. Nur ca. 4 Prozent aller Babys kommen exakt am errechneten Termin zur Welt.',
    },
    faqs: [
      { question: 'Wie berechnet man den Termin bei bekanntem Empfängnisdatum (Zeugungstag)?', answer: 'Bei bekanntem Eisprung oder Inseminationstag rechnet man: Empfängnistag + 266 Tage (38 Wochen reale Tragzeit).' },
      { question: 'Ab wann gilt ein Baby medizinisch als termingerecht geboren?', answer: 'Alle Geburten zwischen der vollendeten 37. Schwangerschaftswoche (37+0 SSW) und der 42. Woche (41+6 SSW) gelten als voll ausgetragene Reifgeburten.' },
    ],
    relatedSlugs: ['chinesischer-empfaengniskalender-rechner', 'fruchtbare-tage-rechner', 'altersrechner'],
  },
  {
    id: 'fruchtbare-tage-rechner',
    slug: 'fruchtbare-tage-rechner',
    name: 'Fruchtbare-Tage-Rechner (Eisprung & Zyklus)',
    shortName: 'Fruchtbare Tage',
    category: 'familie-schwangerschaft',
    subcategory: 'Zyklus & Fruchtbarkeit',
    metaTitle: 'Fruchtbare Tage Rechner – Eisprung & fruchtbares Fenster',
    metaDescription: 'Ermitteln Sie die fruchtbaren Tage und den voraussichtlichen Tag des Eisprungs bei Kinderwunsch. Zyklusgenaue Berechnung.',
    h1: 'Fruchtbare Tage & Eisprung berechnen',
    shortDescription: 'Berechnet den voraussichtlichen Tag des Eisprungs (Ovulation) und das fruchtbare Zeitfenster.',
    searchKeywords: ['fruchtbare tage rechner', 'eisprung berechnen kinderwunsch', 'ovulationsrechner', 'wann ist mein eisprung'],
    inputs: [
      { id: 'lastPeriodDate', label: 'Erster Tag der letzten Periode', type: 'date', defaultValue: '2026-03-01' },
      { id: 'cycleLength', label: 'Durchschnittliche Zyklusdauer in Tagen', type: 'number', defaultValue: 28, min: 21, max: 45, unit: 'Tage' },
    ],
    calculate: calculateFertileDays,
    formula: 'Eisprung = Erster Tag nächster Periode - 14 Tage',
    formulaExplanation: 'Die Lutealphase (Gelbkörperphase) zwischen Eisprung und nächster Blutung ist mit ca. 14 Tagen relativ konstant. Das fruchtbare Fenster umfasst 5 Tage vor bis 1 Tag nach dem Eisprung.',
    workedExample: {
      title: 'Beispiel: Letzte Periode am 01.03.2026 bei 28-Tage-Zyklus',
      description: 'Eisprung voraussichtlich am 15.03.2026. Fruchtbare Tage: 10.03. bis 16.03.2026.',
      inputs: { lastPeriodDate: '2026-03-01', cycleLength: 28 },
      resultSummary: 'Eisprung: ca. 15.03.2026',
    },
    content: {
      intro: 'Dieser Fruchtbarkeitskalender grenzt das fruchtbare Zeitfenster rund um den Eisprung (Ovulation) für den optimalen Empfängniszeitpunkt ein.',
      details: 'Männliche Samenzellen können im weiblichen Genitaltrakt bis zu 5 Tage überleben; die Eizelle ist nach dem Eisprung etwa 12 bis 24 Stunden befruchtungsfähig. Das hochfruchtbare Fenster umfasst somit ca. 6 Tage (5 Tage vor bis 1 Tag nach dem Eisprung).',
    },
    faqs: [
      { question: 'Wann findet der Eisprung bei unregelmäßigem Zyklus statt?', answer: 'Der Eisprung findet biologisch recht stabil 14 Tage vor dem Einsetzen der nächsten Menstruation (Lutealphase) statt; variiert die Zykluslänge, verschiebt sich die Follikelphase vor dem Eisprung.' },
      { question: 'Welche Körpersymptome bestätigen die fruchtbaren Tage (NFP)?', answer: 'Spinnbarer, glasiger Zervixschleim, ein Anstieg der Basaltemperatur um ca. 0,2 °C nach dem Eisprung und ein weicher, leicht geöffneter Muttermund.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'altersrechner', 'elterngeld-basis-plus-rechner'],
  },
];
