import { describe, it, expect } from 'vitest';
import { LEGAL_VALUES_2026, LEGAL_VALUES_2025, getLegalValues, GermanLegalValues, LegalConstant } from '@/legal/de';
import { TAX_CONFIG_2026, TAX_CONFIG_2025 } from '@/data/regulated/tax';

describe('Legal Values Guard Test (Rechtsstand-Sicherheit)', () => {
  const configs: Array<{ name: string; values: GermanLegalValues }> = [
    { name: '2026', values: LEGAL_VALUES_2026 },
    { name: '2025', values: LEGAL_VALUES_2025 },
  ];

  configs.forEach(({ name, values }) => {
    describe(`Legal Values ${name}`, () => {
      const keys = Object.keys(values).filter((k) => k !== 'year') as Array<
        keyof Omit<GermanLegalValues, 'year'>
      >;

      it('should have all constants marked verified: true and contain official sources with deep links', () => {
        const failures: string[] = [];

        for (const key of keys) {
          const constant = values[key] as LegalConstant<unknown>;

          if (!constant || typeof constant !== 'object') {
            failures.push(`${key}: is not an object`);
            continue;
          }

          if (constant.verified !== true) {
            failures.push(`${key}: verified is false or not set to true`);
          }

          if (!constant.sourceUrl || typeof constant.sourceUrl !== 'string' || !constant.sourceUrl.startsWith('https://')) {
            failures.push(`${key}: sourceUrl '${constant.sourceUrl}' is missing or not a secure HTTPS URL`);
          }

          if (!constant.law || typeof constant.law !== 'string' || constant.law.trim().length === 0) {
            failures.push(`${key}: law specification is missing`);
          }

          if (!constant.validFrom || !/^\d{4}-\d{2}-\d{2}$/.test(constant.validFrom)) {
            failures.push(`${key}: validFrom '${constant.validFrom}' is not a valid YYYY-MM-DD date`);
          }

          if (!constant.checkedAt || !/^\d{4}-\d{2}-\d{2}$/.test(constant.checkedAt)) {
            failures.push(`${key}: checkedAt '${constant.checkedAt}' is not a valid YYYY-MM-DD date`);
          }

          if (typeof constant.value !== 'number' && typeof constant.value !== 'string') {
            failures.push(`${key}: value is neither number nor string`);
          }
        }

        expect(failures, `Unverified or improperly documented legal constants in ${name}: \n${failures.join('\n')}`).toEqual([]);
      });

      it('should match TAX_CONFIG values for backward compatibility and accuracy', () => {
        const taxConfig = name === '2026' ? TAX_CONFIG_2026 : TAX_CONFIG_2025;

        expect(taxConfig.grundfreibetrag).toBe(values.grundfreibetrag.value);
        expect(taxConfig.zone2Limit).toBe(values.zone2Limit.value);
        expect(taxConfig.zone3Limit).toBe(values.zone3Limit.value);
        expect(taxConfig.zone4Limit).toBe(values.zone4Limit.value);
        expect(taxConfig.zone5Limit).toBe(values.zone5Limit.value);

        expect(taxConfig.solzFreigrenzeSingle).toBe(values.solzFreigrenzeSingle.value);
        expect(taxConfig.solzFreigrenzeMarried).toBe(values.solzFreigrenzeMarried.value);
        expect(taxConfig.kinderfreibetragGesamt).toBe(values.kinderfreibetragGesamt.value);
        expect(taxConfig.kindergeldMonat).toBe(values.kindergeldMonat.value);

        expect(taxConfig.bbgRentenversicherungMonat).toBe(values.bbgRentenversicherungMonat.value);
        expect(taxConfig.bbgKrankenversicherungMonat).toBe(values.bbgKrankenversicherungMonat.value);
        expect(taxConfig.minijobGrenze).toBe(values.minijobGrenze.value);
        expect(taxConfig.midijobObergrenze).toBe(values.midijobObergrenze.value);
      });
    });
  });

  it('getLegalValues returns 2026 by default or when specified', () => {
    expect(getLegalValues().year).toBe(2026);
    expect(getLegalValues(2026).year).toBe(2026);
    expect(getLegalValues('2026').year).toBe(2026);
    expect(getLegalValues(2025).year).toBe(2025);
    expect(getLegalValues('2025').year).toBe(2025);
  });
});

