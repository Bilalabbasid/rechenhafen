import { EXTRA_BUSINESS_STATISTIK } from '../src/data/calculators/extra/businessStatistik';

console.log(`Testing ${EXTRA_BUSINESS_STATISTIK.length} calculators in EXTRA_BUSINESS_STATISTIK...`);

let errors = 0;

for (const calc of EXTRA_BUSINESS_STATISTIK) {
  const defaultInputs: Record<string, any> = {};
  for (const input of calc.inputs) {
    defaultInputs[input.id] = input.defaultValue;
  }

  try {
    const result = calc.calculate(defaultInputs);
    if (!result || !result.primary) {
      console.error(`[FAIL] ${calc.slug}: calculate() did not return primary result`);
      errors++;
      continue;
    }

    const primaryVal = String(result.primary.value);
    if (primaryVal.includes('NaN') || primaryVal.includes('Infinity')) {
      console.error(`[FAIL] ${calc.slug}: Primary result contains NaN or Infinity -> "${primaryVal}"`);
      errors++;
      continue;
    }

    if (result.details) {
      for (const d of result.details) {
        const dVal = String(d.value);
        if (dVal.includes('NaN') || dVal.includes('Infinity')) {
          console.error(`[FAIL] ${calc.slug}: Detail "${d.label}" contains NaN/Infinity -> "${dVal}"`);
          errors++;
        }
      }
    }
  } catch (err: any) {
    console.error(`[ERROR] ${calc.slug}: calculate() threw error:`, err?.message || err);
    errors++;
  }
}

if (errors === 0) {
  console.log(`[PASS] All ${EXTRA_BUSINESS_STATISTIK.length} calculators calculated successfully without errors!`);
} else {
  console.error(`[FAIL] Encountered ${errors} calculation errors.`);
  process.exit(1);
}
