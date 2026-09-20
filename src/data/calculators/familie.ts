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
    metaTitle: 'Geburtstermin Rechner – Voraussichtlichen Entbindungstermin (ET) berechnen',
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
      intro: 'Wann erblickt Ihr Baby das Licht der Welt? Unser Geburtsterminrechner nutzt die in der Gynäkologie anerkannte erweiterte Naegele-Formel.',
      details: 'Nur etwa 4 % aller Kinder kommen exakt am errechneten Termin zur Welt – die meisten werden innerhalb von zwei Wochen vor oder nach dem Termin geboren.',
    },
    faqs: [
      { question: 'Wie lang dauert eine normale Schwangerschaft?', answer: 'Gerechnet ab dem ersten Tag der letzten Regelblutung dauert eine menschliche Schwangerschaft im Schnitt 280 Tage bzw. 40 Wochen (post menstruationem).' },
    ],
    relatedSlugs: ['fruchtbare-tage-rechner', 'altersrechner'],
  },
  {
    id: 'fruchtbare-tage-rechner',
    slug: 'fruchtbare-tage-rechner',
    name: 'Fruchtbare-Tage-Rechner (Eisprung & Zyklus)',
    shortName: 'Fruchtbare Tage',
    category: 'familie-schwangerschaft',
    subcategory: 'Zyklus & Fruchtbarkeit',
    metaTitle: 'Fruchtbare Tage Rechner – Eisprung & fruchtbares Fenster online ermitteln',
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
      intro: 'Bei Kinderwunsch ist das Timing entscheidend: Da Samenzellen bis zu 5 Tage im weiblichen Körper überleben können, beginnt die fruchtbare Phase bereits vor dem eigentlichen Eisprung.',
      details: 'Die höchste Empfängniswahrscheinlichkeit besteht am Tag vor der Ovulation und am Tag des Eisprungs selbst.',
    },
    faqs: [
      { question: 'Kann dieser Rechner zur natürlichen Verhütung genutzt werden?', answer: 'Nein! Da der Eisprung durch Stress, Reisen oder Hormone schwanken kann, ist ein Kalenderrechner keinesfalls als Verhütungsmethode geeignet.' },
    ],
    relatedSlugs: ['geburtstermin-rechner', 'altersrechner'],
  },
];
