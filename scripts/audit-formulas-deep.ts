import { ALL_CALCULATORS } from '../src/data/calculators';

interface AuditFinding {
  slug: string;
  name: string;
  category: string;
  formula: string;
  issueType: 'FORMULA' | 'UNIT' | 'ROUNDING' | 'PERCENT' | 'CONVERSION' | 'BOUNDARY' | 'EXAMPLE_MISMATCH';
  description: string;
  inputUsed: Record<string, any>;
  expected: any;
  actual: any;
}

const findings: AuditFinding[] = [];

// Let's inspect worked examples and verify if they match calc.calculate()
for (const c of ALL_CALCULATORS) {
  const we = c.workedExample;
  if (!we) continue;

  // Check 1: If workedExample has inputs object, run it
  if (we.inputs && typeof we.inputs === 'object' && !Array.isArray(we.inputs)) {
    try {
      const res = c.calculate(we.inputs);
      const summary = we.resultSummary || we.result || '';
      // check if any numbers in res.primary.value or res.primary.formattedValue appear in summary
      const primaryVal = res.primary.value;
      const primaryFormatted = res.primary.formattedValue || '';
      
      // Let's log if there's any obvious discrepancy
    } catch (e: any) {
      findings.push({
        slug: c.slug,
        name: c.name,
        category: c.category,
        formula: c.formula,
        issueType: 'BOUNDARY',
        description: `Worked example inputs threw error: ${e.message}`,
        inputUsed: we.inputs,
        expected: 'Valid result',
        actual: e.message
      });
    }
  }
}

console.log(`Initial worked example execution check completed. Findings: ${findings.length}`);
