import { ContentSection, FAQItem, WorkedExample } from '@/types/calculator';

/**
 * Hand-written, page-specific additions for one calculator.
 * Everything here must be about THIS calculator only: no sentence may be reused on another page.
 * Numbers in texts and tables must come from the calculator's own engine (computed, not typed in).
 */
export interface PageContentOverlay {
  /** Appended after the calculator's own sections. */
  sections?: ContentSection[];
  /** Appended after the calculator's own FAQs. */
  faqs?: FAQItem[];
  /** Appended after the calculator's own worked examples. */
  workedExamples?: WorkedExample[];
}

export type PageContentMap = Record<string, PageContentOverlay>;
