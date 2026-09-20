/**
 * Scripts to build the full suite of 400 calculators.
 * Each of the 16 categories will have exactly 25 calculators.
 */

import * as fs from 'fs';
import * as path from 'path';

// Define the structure of items to generate
interface CalcItemSpec {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subcategory: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDescription: string;
  searchKeywords: string[];
  inputs: Array<{
    id: string;
    label: string;
    type: 'number' | 'text' | 'select' | 'boolean' | 'date';
    defaultValue: any;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  formula: string;
  formulaExplanation: string;
  workedExample: {
    title: string;
    description: string;
    inputs: Record<string, any>;
    resultSummary: string;
  };
  intro: string;
  details: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
  calcBody: string; // JavaScript body returning CalculationResult
}

// Function to generate the typescript code for an item
function serializeCalc(c: CalcItemSpec): string {
  const inputsStr = JSON.stringify(c.inputs, null, 2);
  const keywordsStr = JSON.stringify(c.searchKeywords);
  const workedExampleStr = JSON.stringify(c.workedExample, null, 2);
  const faqsStr = JSON.stringify(c.faqs, null, 2);
  const relatedSlugsStr = JSON.stringify(c.relatedSlugs);

  return `  {
    id: ${JSON.stringify(c.id)},
    slug: ${JSON.stringify(c.id)},
    name: ${JSON.stringify(c.name)},
    shortName: ${JSON.stringify(c.shortName)},
    category: ${JSON.stringify(c.category)},
    subcategory: ${JSON.stringify(c.subcategory)},
    metaTitle: ${JSON.stringify(c.metaTitle)},
    metaDescription: ${JSON.stringify(c.metaDescription)},
    h1: ${JSON.stringify(c.h1)},
    shortDescription: ${JSON.stringify(c.shortDescription)},
    searchKeywords: ${keywordsStr},
    inputs: ${inputsStr},
    calculate: (inputs: Record<string, any>): CalculationResult => {
      ${c.calcBody}
    },
    formula: ${JSON.stringify(c.formula)},
    formulaExplanation: ${JSON.stringify(c.formulaExplanation)},
    workedExample: ${workedExampleStr},
    content: {
      intro: ${JSON.stringify(c.intro)},
      details: ${JSON.stringify(c.details)},
    },
    faqs: ${faqsStr},
    relatedSlugs: ${relatedSlugsStr},
  }`;
}

export type { CalcItemSpec };
export { serializeCalc };

