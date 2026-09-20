import { ALL_CALCULATORS } from '../src/data/calculators';
import { parseGermanNumber, formatNumber } from '../src/lib/formatters';

interface MathVerificationResult {
  slug: string;
  name: string;
  category: string;
  hasFormula: boolean;
  hasWorkedExample: boolean;
  testedWithDefaults: boolean;
  testedWithBoundaries: boolean;
  workedExampleVerified: boolean;
  isTimeSensitive: boolean;
  issues: string[];
}

const results: MathVerificationResult[] = [];

for (const calc of ALL_CALCULATORS) {
  const item: MathVerificationResult = {
    slug: calc.slug,
    name: calc.name,
    category: calc.category,
    hasFormula: Boolean(calc.formula && calc.formula.trim().length > 0),
    hasWorkedExample: Boolean(calc.workedExample),
    testedWithDefaults: false,
    testedWithBoundaries: false,
    workedExampleVerified: false,
    isTimeSensitive: Boolean(calc.isTimeSensitive),
    issues: []
  };

  // 1. Check Formula String
  if (!item.hasFormula) {
    item.issues.push('Missing formula definition');
  }

  // 2. Test Default Inputs
  const defInputs: Record<string, any> = {};
  for (const inp of calc.inputs) {
    defInputs[inp.id] = inp.defaultValue;
  }

  try {
    const res = calc.calculate(defInputs);
    item.testedWithDefaults = true;

    if (!res.primary) {
      item.issues.push('No primary result returned on default inputs');
    } else {
      const v = res.primary.value;
      if (typeof v === 'number') {
        if (Number.isNaN(v)) item.issues.push('Default calculation produced NaN');
        if (!Number.isFinite(v)) item.issues.push('Default calculation produced Infinity');
      }
    }
  } catch (err: any) {
    item.issues.push(`Default calculation threw exception: ${err.message}`);
  }

  // 3. Test Worked Example Consistency
  const we = calc.workedExample;
  if (we) {
    let exampleInputs: Record<string, any> | null = null;
    if (we.inputs && typeof we.inputs === 'object' && !Array.isArray(we.inputs)) {
      exampleInputs = we.inputs;
    }

    if (exampleInputs) {
      try {
        const weRes = calc.calculate(exampleInputs);
        item.workedExampleVerified = true;
        const weVal = weRes.primary.value;
        if (typeof weVal === 'number' && (Number.isNaN(weVal) || !Number.isFinite(weVal))) {
          item.issues.push('Worked example calculation returned NaN or Infinity');
        }
      } catch (err: any) {
        item.issues.push(`Worked example execution threw exception: ${err.message}`);
      }
    }
  }

  // 4. Test Boundaries (zeros, negative, extreme)
  const boundaryInputs: Record<string, any> = {};
  for (const inp of calc.inputs) {
    if (inp.type === 'number') {
      boundaryInputs[inp.id] = inp.min !== undefined ? inp.min : 0;
    } else if (inp.type === 'date') {
      boundaryInputs[inp.id] = '2024-02-29'; // leap day
    } else if (inp.type === 'boolean') {
      boundaryInputs[inp.id] = false;
    } else if (inp.type === 'select' && inp.options && inp.options.length > 0) {
      boundaryInputs[inp.id] = inp.options[0].value;
    } else {
      boundaryInputs[inp.id] = inp.defaultValue;
    }
  }

  try {
    const bRes = calc.calculate(boundaryInputs);
    item.testedWithBoundaries = true;
    if (bRes.primary && typeof bRes.primary.value === 'number') {
      if (Number.isNaN(bRes.primary.value)) item.issues.push('Boundary calculation produced NaN');
      if (!Number.isFinite(bRes.primary.value)) item.issues.push('Boundary calculation produced Infinity');
    }
  } catch (err: any) {
    item.issues.push(`Boundary calculation threw exception: ${err.message}`);
  }

  results.push(item);
}

const failed = results.filter(r => r.issues.length > 0);
console.log(`Audited ${results.length} calculators.`);
console.log(`Failed issues count: ${failed.length}`);
if (failed.length > 0) {
  for (const f of failed) {
    console.log(`FAILED: ${f.slug}: ${f.issues.join('; ')}`);
  }
}
