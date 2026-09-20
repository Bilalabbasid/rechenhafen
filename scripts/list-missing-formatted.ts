import { ALL_CALCULATORS } from '../src/data/calculators';

for (const calc of ALL_CALCULATORS) {
  const inputs: Record<string, any> = {};
  for (const inp of calc.inputs) inputs[inp.id] = inp.defaultValue;
  const res = calc.calculate(inputs);
  if (res.primary && !res.primary.formattedValue) {
    console.log(`Missing formattedValue: [${calc.category}] ${calc.slug}`);
  }
}
