import { CalculatorDefinition } from '@/types/calculator';
import { calculatePqFormel } from '@/lib/calculators/pqFormel';

// Beispiele werden mit derselben Funktion berechnet wie das Ergebnis im Rechner.
const ex1 = calculatePqFormel({ mode: 'pq', p: -2, q: -8 });
const ex2 = calculatePqFormel({ mode: 'abc', a: 2, b: -8, c: 6 });
const ex3 = calculatePqFormel({ mode: 'pq', p: 2, q: 5 });

export const SCHULMATHE_CALCULATORS: CalculatorDefinition[] = [
  {
    id: 'pq-formel-rechner',
    slug: 'pq-formel-rechner',
    name: 'pq-Formel-Rechner (quadratische Gleichungen lösen)',
    shortName: 'pq-Formel',
    category: 'mathematik',
    subcategory: 'Gleichungen',
    metaTitle: 'pq-Formel Rechner – quadratische Gleichungen mit Rechenweg',
    metaDescription: 'pq-Formel online: Quadratische Gleichungen x² + px + q = 0 oder ax² + bx + c = 0 lösen – mit Diskriminante, Rechenweg, Scheitelpunkt und Probe.',
    h1: 'pq-Formel Rechner: Quadratische Gleichungen lösen mit Rechenweg',
    shortDescription: 'Löst quadratische Gleichungen mit der pq-Formel und zeigt jeden Rechenschritt, die Diskriminante und den Scheitelpunkt.',
    searchKeywords: [
      'pq formel',
      'pq formel rechner',
      'pq-formel',
      'pq formel online',
      'quadratische gleichung lösen',
      'quadratische gleichungen rechner',
      'nullstellen berechnen',
      'mitternachtsformel rechner',
      'abc formel rechner',
      'diskriminante berechnen',
    ],
    inputs: [
      {
        id: 'mode',
        label: 'Form der Gleichung',
        type: 'select',
        defaultValue: 'pq',
        options: [
          { value: 'pq', label: 'Normalform: x² + px + q = 0' },
          { value: 'abc', label: 'Allgemeine Form: ax² + bx + c = 0' },
        ],
      },
      { id: 'p', label: 'p (Zahl vor dem x)', type: 'number', defaultValue: -2, step: 0.1, helpText: 'Vorzeichen mitnehmen: Bei x² − 2x − 8 = 0 ist p = −2.', dependsOn: { field: 'mode', value: 'pq' } },
      { id: 'q', label: 'q (Zahl ohne x)', type: 'number', defaultValue: -8, step: 0.1, helpText: 'Bei x² − 2x − 8 = 0 ist q = −8.', dependsOn: { field: 'mode', value: 'pq' } },
      { id: 'a', label: 'a (Zahl vor dem x²)', type: 'number', defaultValue: 2, step: 0.1, helpText: 'Darf nicht 0 sein.', dependsOn: { field: 'mode', value: 'abc' } },
      { id: 'b', label: 'b (Zahl vor dem x)', type: 'number', defaultValue: -8, step: 0.1, dependsOn: { field: 'mode', value: 'abc' } },
      { id: 'c', label: 'c (Zahl ohne x)', type: 'number', defaultValue: 6, step: 0.1, dependsOn: { field: 'mode', value: 'abc' } },
    ],
    calculate: calculatePqFormel,
    formula: 'x₁,₂ = −p/2 ± √((p/2)² − q)',
    formulaExplanation: 'Die pq-Formel löst quadratische Gleichungen in der Normalform x² + px + q = 0. Der Ausdruck unter der Wurzel heißt Diskriminante D = (p/2)² − q. Ist D größer als 0, gibt es zwei Lösungen, bei D = 0 genau eine, bei D kleiner als 0 keine reelle Lösung. Steht vor dem x² eine Zahl a, teilen Sie die ganze Gleichung zuerst durch a.',
    workedExample: {
      title: 'Beispiel: x² − 2x − 8 = 0',
      description: ex1.summaryText ?? '',
      inputs: { mode: 'pq', p: -2, q: -8 },
      resultSummary: ex1.primary.formattedValue ?? '',
    },
    workedExamples: [
      {
        title: 'Zwei Lösungen: x² − 2x − 8 = 0',
        description: 'Hier ist p = −2 und q = −8.',
        inputs: { mode: 'pq', p: -2, q: -8 },
        steps: ['x₁,₂ = −(−2)/2 ± √((−2/2)² − (−8))', 'x₁,₂ = 1 ± √(1 + 8) = 1 ± √9 = 1 ± 3', 'x₁ = 4, x₂ = −2'],
        resultSummary: ex1.primary.formattedValue ?? '',
      },
      {
        title: 'Mit Faktor vor x²: 2x² − 8x + 6 = 0',
        description: 'Erst durch 2 teilen: x² − 4x + 3 = 0, also p = −4 und q = 3.',
        inputs: { mode: 'abc', a: 2, b: -8, c: 6 },
        steps: ['x² − 4x + 3 = 0', 'x₁,₂ = 2 ± √(4 − 3) = 2 ± 1', 'x₁ = 3, x₂ = 1'],
        resultSummary: ex2.primary.formattedValue ?? '',
      },
      {
        title: 'Keine reelle Lösung: x² + 2x + 5 = 0',
        description: 'Die Diskriminante ist negativ.',
        inputs: { mode: 'pq', p: 2, q: 5 },
        steps: ['D = (2/2)² − 5 = 1 − 5 = −4', 'D < 0 → keine reelle Lösung'],
        resultSummary: ex3.summaryText ?? '',
      },
    ],
    content: {
      intro: 'Mit diesem pq-Formel-Rechner lösen Sie quadratische Gleichungen Schritt für Schritt. Geben Sie p und q aus der Normalform ein – oder a, b und c, wenn vor dem x² noch eine Zahl steht. Der Rechner zeigt die Diskriminante, beide Lösungen, den Rechenweg, die faktorisierte Form, den Scheitelpunkt der Parabel und eine Probe mit dem Satz von Vieta.',
      sections: [
        {
          title: 'So wenden Sie die pq-Formel an',
          content:
            '1. **Normalform herstellen:** Die Gleichung muss die Form x² + px + q = 0 haben. Steht vor dem x² eine Zahl, teilen Sie alles durch diese Zahl. Alles muss auf einer Seite stehen, auf der anderen Seite 0.\n' +
            '2. **p und q ablesen – mit Vorzeichen:** Bei x² − 6x + 5 = 0 ist p = −6 und q = 5.\n' +
            '3. **Einsetzen:** x₁,₂ = −p/2 ± √((p/2)² − q) = 3 ± √(9 − 5) = 3 ± 2.\n' +
            '4. **Beide Lösungen ausrechnen:** x₁ = 5, x₂ = 1.\n' +
            '5. **Probe:** x₁ + x₂ = −p und x₁ · x₂ = q (Satz von Vieta): 5 + 1 = 6, 5 · 1 = 5.',
        },
        {
          title: 'Die Diskriminante entscheidet über die Anzahl der Lösungen',
          content:
            '- **D > 0:** zwei Lösungen – die Parabel schneidet die x-Achse zweimal.\n' +
            '- **D = 0:** genau eine Lösung (doppelte Nullstelle) – die Parabel berührt die x-Achse im Scheitelpunkt.\n' +
            '- **D < 0:** keine reelle Lösung – die Parabel liegt ganz über oder unter der x-Achse.',
        },
        {
          title: 'pq-Formel oder Mitternachtsformel?',
          content:
            'Beide liefern dieselben Lösungen. Die Mitternachtsformel (abc-Formel) x₁,₂ = (−b ± √(b² − 4ac)) / (2a) arbeitet direkt mit a, b und c. Die pq-Formel braucht die Normalform, ist dafür kürzer. Der Rechner nimmt Ihnen das Umformen ab: Wählen Sie „Allgemeine Form“ und geben Sie a, b und c ein.',
        },
      ],
    },
    faqs: [
      { question: 'Wie lautet die pq-Formel?', answer: 'x₁,₂ = −p/2 ± √((p/2)² − q). Sie gilt für quadratische Gleichungen in der Normalform x² + px + q = 0.' },
      { question: 'Wann kann ich die pq-Formel anwenden?', answer: 'Immer, wenn die Gleichung quadratisch ist und vor dem x² eine 1 steht. Steht dort eine andere Zahl a, teilen Sie die ganze Gleichung durch a. Bei 3x² + 6x − 9 = 0 wird daraus x² + 2x − 3 = 0.' },
      { question: 'Was mache ich, wenn unter der Wurzel eine negative Zahl steht?', answer: 'Dann hat die Gleichung keine reelle Lösung, die Parabel schneidet die x-Achse nicht. In der Oberstufe schreibt man die Lösungen als komplexe Zahlen, zum Beispiel x = −1 ± 2i bei x² + 2x + 5 = 0.' },
      { question: 'Was ist der Unterschied zwischen pq-Formel und Mitternachtsformel?', answer: 'Die Mitternachtsformel x₁,₂ = (−b ± √(b² − 4ac)) / (2a) funktioniert auch ohne Normalform. Die pq-Formel ist kürzer, verlangt aber, dass vor dem x² eine 1 steht. Beide ergeben dieselben Lösungen.' },
      { question: 'Wie mache ich die Probe?', answer: 'Setzen Sie die Lösungen in die Gleichung ein, es muss 0 herauskommen. Schneller geht es mit dem Satz von Vieta: Die Summe der Lösungen ist −p, das Produkt ist q.' },
      { question: 'Wie berechne ich mit der pq-Formel Nullstellen?', answer: 'Setzen Sie die Funktion gleich 0: Aus f(x) = x² − 2x − 8 wird x² − 2x − 8 = 0. Die Lösungen x₁ = 4 und x₂ = −2 sind die Nullstellen, also die Schnittpunkte mit der x-Achse.' },
    ],
    relatedSlugs: ['quadratwurzel-rechner', 'bruchrechner', 'dreisatzrechner', 'prozentrechner', 'kgv-rechner'],
  },
];
