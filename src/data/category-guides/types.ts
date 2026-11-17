import type { FAQItem } from '@/types/calculator';

/** Page-specific guide content for a category hub page (/[kategorie]/). */
export interface CategoryGuide {
  /** "Welcher Rechner passt zu Ihrer Frage?": a real question and the calculator that answers it. */
  questions: { question: string; slug: string; hint?: string }[];
  /** Optional reference table, e.g. key 2026 values; values must come from verified repo data. */
  keyFacts?: { title: string; intro?: string; rows: { label: string; value: string; note?: string }[]; source?: string };
  /** Category-specific FAQs; answers must not repeat calculator-page FAQs. */
  faqs: FAQItem[];
}

export type CategoryGuideMap = Record<string, CategoryGuide>;
