import type { CalculationResult, CalculatorInput } from '@/types/calculator';

/**
 * Cleans the answer sentences of a calculation result for German readers:
 *  - a decimal point in a number becomes a comma ("30.5 Min." -> "30,5 Min."); German
 *    thousands separators (3 digits) and dates ("01.03.2026", "01.03.") are left alone;
 *  - upper-cased unit codes that some converters print ("3 PA", "10,5 KG") become the
 *    proper symbol, using the calculator's own unitFromField maps.
 * Written without regex look-behind so it also runs on older Safari versions.
 */
export function normalizeResultText<T extends CalculationResult>(result: T, defs: CalculatorInput[]): T {
  const unitPairs: [RegExp, string][] = [];
  for (const def of defs) {
    if (!def.unitFromField) continue;
    for (const [code, symbol] of Object.entries(def.unitFromField.units)) {
      const upper = code.toUpperCase();
      if (upper === symbol) continue;
      const escaped = upper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      unitPairs.push([new RegExp(`(\\d) ${escaped}(?![A-Za-zÄÖÜäöüß0-9])`, 'g'), `$1 ${symbol}`]);
    }
  }

  const fix = (text?: string): string | undefined => {
    if (!text) return text;
    let out = text.replace(/(^|[^\d.,])(\d+)\.(\d{1,2})(?![\d.])/g, '$1$2,$3');
    for (const [re, replacement] of unitPairs) out = out.replace(re, replacement);
    return out;
  };

  const summaryText = fix(result.summaryText);
  const directAnswer = fix(result.directAnswer);
  if (summaryText === result.summaryText && directAnswer === result.directAnswer) return result;
  return { ...result, summaryText, directAnswer };
}
