import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';

describe('Bindingness FAQ on Legal Calculators (Phase 6)', () => {
  it('ensures every calculator with a rechtsstand has the bindingness FAQ', () => {
    const legalCalcs = ALL_CALCULATORS.filter((c) => Boolean(c.rechtsstand));
    expect(legalCalcs.length).toBeGreaterThan(50);

    const missingBindingFaq: string[] = [];

    for (const calc of legalCalcs) {
      const bindingFaq = calc.faqs?.find((f) =>
        f.question.toLowerCase().includes('verbindlich')
      );

      if (!bindingFaq) {
        missingBindingFaq.push(`${calc.slug} (${calc.category})`);
        continue;
      }

      expect(bindingFaq.question).toBe('Ist das Ergebnis dieses Rechners verbindlich?');
      expect(bindingFaq.answer).toContain('Nein. Der Rechner nutzt die allgemeinen gesetzlichen Werte für');
      expect(bindingFaq.answer).toContain(calc.rechtsstand);
      expect(bindingFaq.answer).toContain('Für eine verbindliche Auskunft wenden Sie sich an');
    }

    expect(missingBindingFaq).toEqual([]);
  });
});

