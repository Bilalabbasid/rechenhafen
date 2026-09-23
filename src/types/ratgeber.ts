export interface RatgeberWorkedExample {
  title: string;
  scenario: string;
  formula: string;
  steps: {
    label: string;
    calculation: string;
    note?: string;
  }[];
  resultSummary: string;
}

export interface RatgeberFaq {
  question: string;
  answer: string;
}

export interface RatgeberSection {
  id: string;
  title: string;
  contentHtml?: string;
  paragraphs?: string[];
  subsections?: {
    title: string;
    paragraphs: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    callout?: {
      type: 'tip' | 'warning' | 'info';
      title: string;
      text: string;
    };
  }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  callout?: {
    type: 'tip' | 'warning' | 'info';
    title: string;
    text: string;
  };
}

export interface RatgeberOfficialSource {
  title: string;
  citation: string;
  url?: string;
}

export interface RatgeberCalculatorLink {
  slug: string;
  title: string;
  ctaText: string;
  description: string;
  badge?: string;
}

export interface RatgeberArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  category: string;
  categoryName: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMin: number;
  author: {
    name: string;
    role: string;
  };
  reviewer?: {
    name: string;
    role: string;
  };
  summary: string;
  keyTakeaways: string[];
  primaryCalculator: RatgeberCalculatorLink;
  secondaryCalculators?: RatgeberCalculatorLink[];
  sections: RatgeberSection[];
  workedExample: RatgeberWorkedExample;
  commonMistakes?: {
    mistake: string;
    correction: string;
  }[];
  faqs: RatgeberFaq[];
  officialSources: RatgeberOfficialSource[];
  relatedArticleSlugs: string[];
}
