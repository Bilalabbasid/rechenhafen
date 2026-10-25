import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { TAX_CONFIG_2025, TAX_CONFIG_2026 } from '@/data/regulated/tax';
import {
  calculateArbeitgeberkosten,
  calculateBruttoNetto,
  calculateSolidaritaetszuschlag,
  calculateSozialabgaben,
  computeSolZ,
} from '@/lib/calculators/steuernGehalt';

/**
 * Regression tests for the 2026 tax config values verified on 2026-10-25. Expected numbers use
 * literal constants and the statutory formulas, not the config:
 *  - Ø-Zusatzbeitrag 2026 = 2,9 % (BMG-Bekanntmachung vom 07.11.2025, BAnz AT 10.11.2025 B7)
 *  - Kindergeld 2026 = 259 € (§ 66 Abs. 1 EStG), Kinderfreibetrag 2 × 3.414 € + BEA 2 × 1.464 € (§ 32 Abs. 6 EStG)
 *  - SolZ-Freigrenze 2026 = 20.350 € / 40.700 € (§ 3 Abs. 3 SolzG)
 *  - Insolvenzgeldumlage 0,15 % (§ 360 SGB III)
 *  - Minijob-Zentrale 2026: KV 13 + RV 15 + Pauschsteuer 2 + U1 0,8 + U2 0,22 + Insolvenzgeldumlage 0,15 = 31,17 %
 */
const val = (res: ReturnType<typeof calculateBruttoNetto>, id: string) => Number(res.secondary?.find((s) => s.id === id)?.value);

// § 32a Abs. 1 EStG 2026, Zone 3 (17.800 € bis 69.878 €)
const est2026Zone3 = (zvE: number) => {
  const z = (Math.floor(zvE) - 17799) / 10000;
  return Math.floor((173.1 * z + 2397) * z + 1034.87);
};

describe('2026 tax config values', () => {
  it('uses the official average Zusatzbeitrag 2026 of 2,9 % (2025: 2,5 %)', () => {
    expect(TAX_CONFIG_2026.zusatzbeitragKrankenversicherungDurchschnitt).toBe(0.029);
    expect(TAX_CONFIG_2025.zusatzbeitragKrankenversicherungDurchschnitt).toBe(0.025);
  });

  it('adds up to the 42,3 % Gesamtsozialversicherungsbeitragssatz behind Faktor F 0,6619', () => {
    const c = TAX_CONFIG_2026;
    const total = c.beitragssatzRentenversicherung + c.beitragssatzArbeitslosenversicherung
      + c.beitragssatzKrankenversicherungAllgemein + c.zusatzbeitragKrankenversicherungDurchschnitt + c.beitragssatzPflegeversicherung;
    expect(total * 100).toBeCloseTo(18.6 + 2.6 + 14.6 + 2.9 + 3.6, 10);
    expect(Math.round((0.28 / total) * 10000) / 10000).toBe(c.midijobFaktorF);
  });

  it('uses Kindergeld 259 € and Kinderfreibetrag + BEA 9.756 € for 2026', () => {
    expect(TAX_CONFIG_2026.kindergeldMonat).toBe(259);
    expect(TAX_CONFIG_2026.kinderfreibetragGesamt).toBe(2 * 3414 + 2 * 1464);
    expect(TAX_CONFIG_2026.kinderfreibetragGesamt).toBe(9756);
  });

  it('uses the SolZ-Freigrenze 2026 of 20.350 € / 40.700 €', () => {
    expect(TAX_CONFIG_2026.solzFreigrenzeSingle).toBe(20350);
    expect(TAX_CONFIG_2026.solzFreigrenzeMarried).toBe(40700);
    expect(computeSolZ(20350, false, TAX_CONFIG_2026)).toBe(0);
    // 1 € über der Freigrenze: 11,9 % von 1 € = 0,119 € → 0,12 €
    expect(computeSolZ(20351, false, TAX_CONFIG_2026)).toBeCloseTo(0.12, 2);
    // Milderungszone endet bei ESt × 5,5 % = (ESt − 20.350) × 11,9 % → ESt = 20.350 × 11,9 / 6,4 = 37.838,28 €
    expect(computeSolZ(40000, false, TAX_CONFIG_2026)).toBeCloseTo(40000 * 0.055, 2);
  });

  it('uses the statutory Insolvenzgeldumlage of 0,15 % and the Minijob-Zentrale rates', () => {
    const c = TAX_CONFIG_2026;
    expect(c.umlageU3Insolvenzgeld).toBe(0.0015);
    expect(c.minijobUmlageU1).toBe(0.008);
    expect(c.minijobUmlageU2).toBe(0.0022);
    expect(c.minijobInsolvenzgeldumlage).toBe(0.0015);
    const minijobTotal = c.minijobPauschaleKv + c.minijobPauschaleRv + c.minijobPauschsteuer
      + c.minijobUmlageU1 + c.minijobUmlageU2 + c.minijobInsolvenzgeldumlage;
    expect(minijobTotal * 100).toBeCloseTo(31.17, 10);
    expect(c.minijobRvEigenanteil * 100).toBeCloseTo(18.6 - 15, 10);
  });
});

describe('brutto-netto-rechner with the 2026 Zusatzbeitrag', () => {
  it('3.800 € Steuerklasse 1, kinderlos, 30 Jahre → 2.492,25 € netto (published worked example)', () => {
    const gross = 3800;
    // SV AN: RV 9,3 %, AV 1,3 %, KV (14,6 + 2,9) / 2 = 8,75 %, PV 1,8 % + 0,6 % Kinderlosenzuschlag
    const kv = gross * 0.0875;
    const sv = gross * 0.093 + gross * 0.013 + kv + gross * 0.024;
    // Vorsorgepauschale: RV 9,3 % + KV (14,6 − 0,3 + 2,9) / 2 = 8,6 % + PV 1,8 % auf 45.600 €
    const vsp = Math.round(45600 * 0.093 + 45600 * 0.086 + 45600 * 0.018);
    const zvE = 45600 - 1230 - 36 - vsp;
    const lst = Math.round((est2026Zone3(zvE) / 12) * 100) / 100;

    expect(kv).toBeCloseTo(332.5, 10);
    expect(sv).toBeCloseTo(826.5, 10);
    expect(vsp).toBe(8983);
    expect(zvE).toBe(35351);
    expect(est2026Zone3(zvE)).toBe(5775);
    expect(lst).toBe(481.25);

    const inputs = { grossSalary: gross, taxClass: '1', children: '0', age: 30, taxYear: '2026', federalState: 'other', churchTax: 'no', healthInsuranceType: 'statutory' };
    // Default Zusatzbeitrag equals the official average, so leaving the field empty gives the same result
    for (const res of [calculateBruttoNetto(inputs), calculateBruttoNetto({ ...inputs, kvZusatzbeitrag: 2.9 })]) {
      expect(val(res, 'krankenversicherung')).toBeCloseTo(kv, 8);
      expect(val(res, 'lohnsteuer')).toBeCloseTo(lst, 8);
      expect(Number(res.primary.value)).toBeCloseTo(gross - sv - lst, 8);
      expect(Number(res.primary.value)).toBeCloseTo(2492.25, 8);
    }

    const calc = getCalculatorBySlug('brutto-netto-rechner')!;
    expect(calc.inputs.find((i) => i.id === 'kvZusatzbeitrag')?.defaultValue).toBe(2.9);
    expect(calc.workedExample?.resultSummary).toContain('2.492,25 €');
  });

  it('3.800 € in 2025 still uses 2,5 % → 2.489,35 € netto', () => {
    const res = calculateBruttoNetto({ grossSalary: 3800, taxClass: '1', children: '0', age: 30, taxYear: '2025', federalState: 'other', churchTax: 'no', healthInsuranceType: 'statutory' });
    expect(val(res, 'krankenversicherung')).toBeCloseTo(3800 * 0.0855, 8);
    expect(Number(res.primary.value)).toBeCloseTo(2489.35, 8);
  });

  it('employer total includes the 0,15 % Insolvenzgeldumlage', () => {
    const res = calculateBruttoNetto({ grossSalary: 3800, taxClass: '1', taxYear: '2026' });
    // AG: RV 9,3 % + AV 1,3 % + KV 8,75 % + PV 1,8 % + U1 1,1 % + U2 0,35 % + U3 0,15 % + BG 1,3 %
    expect(val(res, 'employerTotal')).toBeCloseTo(3800 * (1 + 0.093 + 0.013 + 0.0875 + 0.018 + 0.011 + 0.0035 + 0.0015 + 0.013), 8);
  });
});

describe('sozialabgaben-rechner and arbeitgeberkosten-rechner', () => {
  it('4.000 € kinderlos with the default Zusatzbeitrag → 870 € AN-Sozialabgaben', () => {
    const res = calculateSozialabgaben({ monthlyGross: 4000, taxYear: '2026', children: '0' });
    expect(val(res, 'anKv')).toBeCloseTo(4000 * 0.0875, 8);
    expect(Number(res.primary.value)).toBeCloseTo(4000 * (0.093 + 0.013 + 0.0875 + 0.024), 8);
    expect(Number(res.primary.value)).toBeCloseTo(870, 8);
  });

  it('3.500 € → 4.341,75 € Arbeitgeber-Gesamtkosten', () => {
    const res = calculateArbeitgeberkosten({ monthlyGross: 3500, taxYear: '2026' });
    expect(val(res, 'svTotal')).toBeCloseTo(3500 * (0.093 + 0.013 + 0.0875 + 0.018), 8);
    expect(val(res, 'umlagen')).toBeCloseTo(3500 * (0.011 + 0.0035 + 0.0015 + 0.013), 8);
    expect(Number(res.primary.value)).toBeCloseTo(4341.75, 8);
  });
});

describe('solidaritaetszuschlag-rechner', () => {
  it('shows the 2026 Freigrenze and no stale 19.100 € copy', () => {
    const res = calculateSolidaritaetszuschlag({ incomeTax: 21000, maritalStatus: 'single', taxYear: '2026' });
    expect(val(res, 'freigrenze')).toBe(20350);
    expect(Number(res.primary.value)).toBeCloseTo((21000 - 20350) * 0.119, 2);
    const married = calculateSolidaritaetszuschlag({ incomeTax: 40700, maritalStatus: 'married', taxYear: '2026' });
    expect(Number(married.primary.value)).toBe(0);
    const { calculate: _calculate, ...data } = getCalculatorBySlug('solidaritaetszuschlag-rechner')!;
    expect(JSON.stringify(data)).not.toMatch(/19\.100|38\.200/);
  });
});

describe('kindergeld-rechner-2026', () => {
  const calc = getCalculatorBySlug('kindergeld-rechner-2026')!;

  it('pays 259 € per child: 2 Kinder → 518 €/Monat, 6.216 €/Jahr', () => {
    const res = calc.calculate({ childrenCount: 2, taxableIncomeYearly: 65000 });
    expect(Number(res.primary.value)).toBe(2 * 259);
    expect(Number(res.secondary?.find((s) => s.id === 'yearlyKindergeld')?.value)).toBe(2 * 259 * 12);
    // Schätzung der Steuerersparnis: 2 × 9.756 € × 30 % Grenzsteuersatz-Schätzung (zvE 50.001–85.000 €)
    expect(Number(res.secondary?.find((s) => s.id === 'taxSavings')?.value)).toBeCloseTo(2 * 9756 * 0.3, 8);
  });

  it('shows no outdated Kindergeld amounts in page copy', () => {
    const { calculate: _calculate, ...data } = calc;
    const copy = JSON.stringify(data);
    expect(copy).not.toMatch(/\b250 €|\b255 € ab/);
    expect(copy).toContain('518,00 €');
    expect(calc.timeSensitiveMeta?.lastVerified).toBe('2026-10-25');
  });
});
