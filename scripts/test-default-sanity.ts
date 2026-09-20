import { ALL_CALCULATORS } from '../src/data/calculators';

console.log('Testing all 405 calculators default execution and result sanity...');

const issues: string[] = [];

for (const calc of ALL_CALCULATORS) {
  const inputs: Record<string, any> = {};
  for (const inp of calc.inputs) {
    inputs[inp.id] = inp.defaultValue;
  }

  try {
    const res = calc.calculate(inputs);
    if (!res || !res.primary) {
      issues.push(`${calc.slug}: No primary result returned`);
      continue;
    }

    const val = res.primary.value;
    if (typeof val === 'number') {
      if (Number.isNaN(val)) issues.push(`${calc.slug}: Primary value is NaN`);
      if (!Number.isFinite(val)) issues.push(`${calc.slug}: Primary value is Infinite`);
    }

    if (!res.primary.label || res.primary.label.trim() === '') {
      issues.push(`${calc.slug}: Empty primary label`);
    }

    // Check secondary results
    if (res.secondary) {
      for (const s of res.secondary) {
        if (typeof s.value === 'number' && Number.isNaN(s.value)) {
          issues.push(`${calc.slug}: Secondary ${s.id} is NaN`);
        }
      }
    }
  } catch (err: any) {
    issues.push(`${calc.slug}: Threw exception: ${err.message}`);
  }
}

console.log(`Execution finished. Found ${issues.length} issues.`);
if (issues.length > 0) {
  console.log('Issues:', issues);
}
