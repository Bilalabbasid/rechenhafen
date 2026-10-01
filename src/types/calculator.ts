export type InputType = 'number' | 'date' | 'select' | 'boolean' | 'text';

export interface SelectOption {
  value: string;
  label: string;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  helpText?: string;
  options?: SelectOption[];
  dependsOn?: { field: string; value: any | any[] };
}

export interface ResultItem {
  id?: string;
  label: string;
  value: number | string;
  formattedValue?: string;
  unit?: string;
  highlight?: boolean;
  helpText?: string;
}

export interface CalculationBreakdownRow {
  period: string | number;
  values: Record<string, string | number>;
}

export interface CalculationResult {
  primary: ResultItem;
  secondary?: ResultItem[];
  details?: ResultItem[];
  breakdown?: {
    columns: { key: string; label: string }[];
    rows: CalculationBreakdownRow[];
  };
  summaryText?: string;
  error?: string;
  warning?: string;
  [key: string]: any;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WorkedExample {
  title?: string;
  description?: string;
  inputs?: Record<string, any>;
  inputValues?: Record<string, any>;
  steps?: any;
  resultSummary?: string;
  result?: string;
  [key: string]: any;
}

export type CalculationFunction = (inputs: Record<string, any>) => CalculationResult;

export interface LegalFootnote {
  index?: number;
  citation: string;
  text: string;
  url?: string;
  effectiveDate: string;
  reviewedDate: string;
}

export interface TrustMetadata {
  methodology?: string;
  assumptions?: string[];
  limitations?: string[];
  legalBasis?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastReviewed?: string;
}

export interface ContentSection {
  title: string;
  content: string;
}

export interface CalculatorDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  subcategory?: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  shortDescription: string;
  searchKeywords: string[];
  inputs: CalculatorInput[];
  calculate: CalculationFunction;
  formula: string;
  formulaExplanation: string;
  workedExample: WorkedExample;
  workedExamples?: WorkedExample[];
  content?: {
    intro?: string;
    details?: string;
    tips?: string[];
    sections?: ContentSection[];
  };
  faqs: FAQItem[];
  relatedSlugs: string[];
  isTimeSensitive?: boolean;
  timeSensitiveMeta?: {
    year: number;
    source: string;
    sourceUrl?: string;
    lastVerified: string;
  };
  trustMeta?: TrustMetadata;
  legalFootnotes?: LegalFootnote[];
}

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  subcategories: string[];
  metaTitle: string;
  metaDescription: string;
}
