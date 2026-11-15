import { CalculatorDefinition } from '@/types/calculator';
import { resolveCalculatorLegalMetadata } from './legalMetadata';
import { PAGE_CONTENT, PAGE_CONTENT_UPDATED_AT } from './page-content';

/**
 * Completes a calculator definition with its legal metadata and its page-specific content overlay.
 *
 * Earlier versions padded every page under 440 words with the same category paragraphs and FAQs
 * and appended a generic "Ist das Ergebnis verbindlich?" FAQ. That put identical text on 200+ pages
 * (scaled, low-value content). It is gone on purpose: every text on a calculator page is now unique
 * to that page. The non-binding hint lives in the ResultDisclaimer under each result.
 */
export function enrichCalculator(calc: CalculatorDefinition): CalculatorDefinition {
  const legalMeta = resolveCalculatorLegalMetadata(calc);
  const overlay = PAGE_CONTENT[calc.slug];
  const ownSections = calc.content?.sections || [];
  const extraSections = (overlay?.sections || []).filter((s) => !ownSections.some((o) => o.title === s.title));
  const ownFaqs = calc.faqs || [];
  const extraFaqs = (overlay?.faqs || []).filter((f) => !ownFaqs.some((o) => o.question === f.question));

  return {
    ...calc,
    disclaimerType: calc.disclaimerType || legalMeta.disclaimerType,
    rechtsstand: calc.rechtsstand || legalMeta.rechtsstand,
    legalBasis: calc.legalBasis && calc.legalBasis.length > 0 ? calc.legalBasis : legalMeta.legalBasis,
    assumptions: calc.assumptions && calc.assumptions.length > 0 ? calc.assumptions : legalMeta.assumptions,
    content: extraSections.length > 0 ? { ...(calc.content || {}), sections: [...ownSections, ...extraSections] } : calc.content,
    faqs: [...ownFaqs, ...extraFaqs],
    contentUpdatedAt: overlay ? PAGE_CONTENT_UPDATED_AT : calc.contentUpdatedAt,
    workedExamples:
      overlay?.workedExamples && overlay.workedExamples.length > 0
        ? [
            // the page shows workedExamples instead of workedExample once the list exists, so keep the original first
            ...(calc.workedExamples && calc.workedExamples.length > 0 ? calc.workedExamples : calc.workedExample ? [calc.workedExample] : []),
            ...overlay.workedExamples,
          ]
        : calc.workedExamples,
  };
}
