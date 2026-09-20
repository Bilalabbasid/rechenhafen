import { ALL_CALCULATORS } from '../src/data/calculators';

interface AuditIssue {
  slug: string;
  name: string;
  category: string;
  type: 'UNFORMATTED_DOT' | 'MISSING_FORMATTED_VALUE' | 'FORMULA_MISMATCH' | 'UNIT_MISMATCH' | 'ROUNDING_ERROR' | 'EXCEPTION';
  detail: string;
}

const issues: AuditIssue[] = [];

for (const calc of ALL_CALCULATORS) {
  const inputs: Record<string, any> = {};
  for (const inp of calc.inputs) {
    inputs[inp.id] = inp.defaultValue;
  }

  try {
    const res = calc.calculate(inputs);
    
    // Check if primary formattedValue has unlocalized dot decimal e.g. "20.00" instead of "20,00"
    if (res.primary) {
      if (res.primary.formattedValue) {
        if (/^\d+\.\d+$/.test(res.primary.formattedValue.trim())) {
          issues.push({
            slug: calc.slug,
            name: calc.name,
            category: calc.category,
            type: 'UNFORMATTED_DOT',
            detail: `formattedValue is '${res.primary.formattedValue}' (unformatted English dot decimal)`
          });
        }
      } else {
        issues.push({
          slug: calc.slug,
          name: calc.name,
          category: calc.category,
          type: 'MISSING_FORMATTED_VALUE',
          detail: `primary.formattedValue is undefined (fallback to raw value: ${res.primary.value})`
        });
      }
    }

    // Check secondary / details
    const list = (res.secondary && res.secondary.length > 0) ? res.secondary : (res.details || []);
    for (const item of list) {
      if (item.formattedValue) {
        if (/^\d+\.\d+$/.test(item.formattedValue.trim())) {
          issues.push({
            slug: calc.slug,
            name: calc.name,
            category: calc.category,
            type: 'UNFORMATTED_DOT',
            detail: `secondary/detail '${item.label}' formattedValue is '${item.formattedValue}'`
          });
        }
      }
    }
  } catch (err: any) {
    issues.push({
      slug: calc.slug,
      name: calc.name,
      category: calc.category,
      type: 'EXCEPTION',
      detail: `calculate() crashed: ${err.message}`
    });
  }
}

console.log(`Found ${issues.length} formatting/formatting-value issues across ${ALL_CALCULATORS.length} calculators:`);
const byType: Record<string, number> = {};
for (const iss of issues) {
  byType[iss.type] = (byType[iss.type] || 0) + 1;
}
console.log(byType);

// Print first 20 issues
issues.slice(0, 20).forEach(i => console.log(`[${i.type}] ${i.slug}: ${i.detail}`));
