import { describe, it, expect } from 'vitest';
import { getCalculatorBySlug } from '@/data/calculators';
import { RETIRED_CALCULATORS, isCalculatorRetired } from '@/data/seo/retired-calculators';
import { TAX_CONFIG_2025 } from '@/data/regulated/tax';
import { calculateNettoBrutto } from '@/lib/calculators/steuernGehalt';
import type { CalculationResult, CalculatorDefinition } from '@/types/calculator';

/**
 * Merge of duplicate calculators (5 Nov 2026):
 *  sozialabgaben-rechner         → brutto-netto-rechner
 *  solidaritaetszuschlag-rechner → einkommensteuerrechner
 *  kraftstoffverbrauch-umrechner → kraftstoffverbrauch-rechner
 *  fahrtkostenrechner            → spritkostenrechner
 *  fahrtenbuch-vs-1-prozent-rechner → dienstwagen-1-prozent-rechner
 * All expected values below are independent hand calculations.
 */

const calc = (slug: string): CalculatorDefinition => {
  const c = getCalculatorBySlug(slug);
  if (!c) throw new Error(`missing calculator ${slug}`);
  return c;
};
const item = (res: CalculationResult, id: string) => res.secondary?.find((s) => s.id === id);
const val = (res: CalculationResult, id: string) => Number(item(res, id)?.value);

const MERGES: Record<string, string> = {
  'sozialabgaben-rechner': 'brutto-netto-rechner',
  'solidaritaetszuschlag-rechner': 'einkommensteuerrechner',
  'kraftstoffverbrauch-umrechner': 'kraftstoffverbrauch-rechner',
  fahrtkostenrechner: 'spritkostenrechner',
  'fahrtenbuch-vs-1-prozent-rechner': 'dienstwagen-1-prozent-rechner',
};
const TARGETS = Object.values(MERGES);

// ---------------------------------------------------------------------------
// 1. Brutto-Netto-Rechner ← Sozialabgaben-Rechner
// ---------------------------------------------------------------------------
describe('brutto-netto-rechner absorbs sozialabgaben-rechner', () => {
  const bn = calc('brutto-netto-rechner');
  const base = { grossSalary: 3800, taxClass: '1', children: '0', age: 30, taxYear: '2026', federalState: 'other', churchTax: 'no', healthInsuranceType: 'statutory', kvZusatzbeitrag: 2.9 };

  it('shows every AN contribution separately incl. Zusatzbeitrag and Kinderlosenzuschlag', () => {
    const res = bn.calculate(base);
    expect(res.error).toBeUndefined();
    // KV: 7,3 % + 1,45 % Zusatzbeitrag
    expect(val(res, 'krankenversicherung')).toBeCloseTo(3800 * 0.0875, 8);
    expect(val(res, 'kvZusatzbeitrag')).toBeCloseTo(3800 * 0.0145, 8);
    // PV: 1,8 % + 0,6 % Kinderlosenzuschlag
    expect(val(res, 'pflegeversicherung')).toBeCloseTo(3800 * 0.024, 8);
    expect(val(res, 'pvKinderAnpassung')).toBeCloseTo(3800 * 0.006, 8);
    expect(val(res, 'rentenversicherung')).toBeCloseTo(3800 * 0.093, 8);
    expect(val(res, 'arbeitslosenversicherung')).toBeCloseTo(3800 * 0.013, 8);
    expect(val(res, 'socialTotal')).toBeCloseTo(826.5, 8);
    expect(Number(res.primary.value)).toBeCloseTo(2492.25, 8);
    expect(item(res, 'krankenversicherung')?.helpText).toContain('Zusatzbeitrag');
    expect(item(res, 'pflegeversicherung')?.helpText).toContain('Kinderlosenzuschlag');
    // AG details stay hidden by default, AG total is always shown
    expect(item(res, 'agKrankenversicherung')).toBeUndefined();
    expect(item(res, 'employerTotal')).toBeDefined();
  });

  it('shows the employer share and total employer cost when requested', () => {
    const res = bn.calculate({ ...base, showEmployerShare: true });
    expect(val(res, 'agKrankenversicherung')).toBeCloseTo(332.5, 8);
    expect(val(res, 'agPflegeversicherung')).toBeCloseTo(3800 * 0.018, 8); // ohne Kinderlosenzuschlag
    expect(val(res, 'agRentenversicherung')).toBeCloseTo(353.4, 8);
    expect(val(res, 'agArbeitslosenversicherung')).toBeCloseTo(49.4, 8);
    expect(val(res, 'agSocialTotal')).toBeCloseTo(803.7, 8);
    // Umlagen: U1 1,1 % + U2 0,35 % + U3 0,15 % + BG 1,3 %
    expect(val(res, 'agUmlagen')).toBeCloseTo(3800 * 0.029, 8);
    expect(val(res, 'svGesamt')).toBeCloseTo(826.5 + 803.7, 8);
    expect(val(res, 'employerTotal')).toBeCloseTo(3800 + 803.7 + 110.2, 8);
    expect(val(res, 'employerTotalYear')).toBeCloseTo(4713.9 * 12, 6);
    // Netto unverändert durch den Schalter
    expect(Number(res.primary.value)).toBeCloseTo(2492.25, 8);
    // String 'true' from URL state works too
    expect(item(bn.calculate({ ...base, showEmployerShare: 'true' }), 'agSocialTotal')).toBeDefined();
  });

  it('applies the Kinderabschlag from the 2nd child and the Sachsen PV split (4.000 €, 3 Kinder, Sachsen)', () => {
    const res = bn.calculate({ grossSalary: 4000, taxClass: '4', children: '3', age: 38, taxYear: '2026', federalState: 'sachsen', churchTax: 'no', healthInsuranceType: 'statutory', kvZusatzbeitrag: 2.9, showEmployerShare: true });
    expect(val(res, 'pflegeversicherung')).toBeCloseTo(4000 * (0.023 - 2 * 0.0025), 8); // 72 €
    expect(val(res, 'pvKinderAnpassung')).toBeCloseTo(-20, 8);
    expect(val(res, 'agPflegeversicherung')).toBeCloseTo(4000 * 0.013, 8);
    // Lohnsteuer: VSP = 48.000 × (9,3 % + 8,6 % + 2,3 %) = 9.696 €; zvE = 48.000 − 1.230 − 36 − 9.696 = 37.038 €
    const z = (37038 - 17799) / 10000;
    const est = Math.floor((173.1 * z + 2397) * z + 1034.87);
    expect(est).toBe(6287);
    const lst = Math.round((est / 12) * 100) / 100;
    expect(val(res, 'lohnsteuer')).toBeCloseTo(lst, 8);
    expect(Number(res.primary.value)).toBeCloseTo(4000 - (350 + 72 + 372 + 52) - lst, 8);
    expect(Number(res.primary.value)).toBeCloseTo(2630.08, 8);
  });

  it('caps the PV Kinderabschlag at four children (5 Kinder → 0,8 %) and handles 1 child / under 23', () => {
    const five = bn.calculate({ grossSalary: 4000, taxClass: '1', children: '5', age: 40, taxYear: '2026' });
    expect(val(five, 'pflegeversicherung')).toBeCloseTo(4000 * 0.008, 8);
    const six = bn.calculate({ grossSalary: 4000, taxClass: '1', children: '6', age: 40, taxYear: '2026' });
    expect(val(six, 'pflegeversicherung')).toBeCloseTo(4000 * 0.008, 8);
    const one = bn.calculate({ grossSalary: 4000, taxClass: '1', children: '1', age: 40, taxYear: '2026' });
    expect(val(one, 'pflegeversicherung')).toBeCloseTo(4000 * 0.018, 8);
    expect(item(one, 'pvKinderAnpassung')).toBeUndefined();
    const young = bn.calculate({ grossSalary: 4000, taxClass: '1', children: '0', age: 22, taxYear: '2026' });
    expect(val(young, 'pflegeversicherung')).toBeCloseTo(4000 * 0.018, 8);
  });

  it('respects the 2026 Beitragsbemessungsgrenzen (KV/PV 5.812,50 €, RV/AV 8.450 €)', () => {
    const res = bn.calculate({ grossSalary: 10000, taxClass: '1', children: '0', age: 40, taxYear: '2026', kvZusatzbeitrag: 2.9 });
    expect(val(res, 'krankenversicherung')).toBeCloseTo(5812.5 * 0.0875, 8);
    expect(val(res, 'pflegeversicherung')).toBeCloseTo(5812.5 * 0.024, 8);
    expect(val(res, 'rentenversicherung')).toBeCloseTo(8450 * 0.093, 8);
    expect(val(res, 'arbeitslosenversicherung')).toBeCloseTo(8450 * 0.013, 8);
  });

  it('shows Kirchensteuer with the Sonderausgaben refund (Kirchensteuer-Rechner merged in too)', () => {
    const res = bn.calculate({ grossSalary: 4000, taxClass: '1', children: '0', age: 40, taxYear: '2026', federalState: 'bayern', churchTax: 'yes' });
    const lst = val(res, 'lohnsteuer');
    expect(val(res, 'kirchensteuer')).toBeCloseTo(lst * 0.08, 1);
    const refund = val(res, 'kirchensteuerErstattung');
    // Erstattung = KiSt × Grenzsteuersatz, Grenzsteuersatz in Zone 3 zwischen 24 % und 42 %
    expect(refund).toBeGreaterThan(val(res, 'kirchensteuer') * 12 * 0.24);
    expect(refund).toBeLessThan(val(res, 'kirchensteuer') * 12 * 0.42);
    expect(item(bn.calculate(base), 'kirchensteuerErstattung')).toBeUndefined();
  });

  it('private KV: no KV/PV, AG zuschuss note', () => {
    const res = bn.calculate({ ...base, healthInsuranceType: 'private', showEmployerShare: true });
    expect(val(res, 'krankenversicherung')).toBe(0);
    expect(val(res, 'pflegeversicherung')).toBe(0);
    expect(item(res, 'krankenversicherung')?.helpText).toContain('PKV');
  });

  it('handles edge cases without throwing', () => {
    expect(bn.calculate({ ...base, grossSalary: '' }).error).toMatch(/Bruttogehalt/);
    expect(bn.calculate({ ...base, grossSalary: -100 }).error).toMatch(/ab 0/);
    expect(bn.calculate({ ...base, grossSalary: 'abc' }).error).toBeDefined();
    expect(bn.calculate({}).error).toBeDefined();
    const zero = bn.calculate({ ...base, grossSalary: 0 });
    expect(zero.error).toBeUndefined();
    expect(zero.primary.value).toBe(0);
    const huge = bn.calculate({ ...base, grossSalary: 10_000_000 });
    expect(Number.isFinite(Number(huge.primary.value))).toBe(true);
    // Leerer Zusatzbeitrag → amtlicher Durchschnitt
    expect(Number(bn.calculate({ ...base, kvZusatzbeitrag: '' }).primary.value)).toBeCloseTo(2492.25, 8);
    // Netto-Brutto-Inversion nutzt dieselbe Engine weiter
    const inv = calculateNettoBrutto({ desiredNet: 2500, taxClass: '1', taxYear: '2026' });
    expect(Number(inv.primary.value)).toBeCloseTo(3814.28, 0);
  });
});

// ---------------------------------------------------------------------------
// 2. Einkommensteuerrechner ← Solidaritätszuschlag-Rechner
// ---------------------------------------------------------------------------
describe('einkommensteuerrechner absorbs solidaritaetszuschlag-rechner', () => {
  const est = calc('einkommensteuerrechner');

  it('zvE mode: 45.000 € → 8.835 € ESt, no Soli, Freigrenze shown', () => {
    const res = est.calculate({ taxableIncome: 45000, taxYear: '2026', tariffType: 'single' });
    expect(res.primary.value).toBe(8835);
    expect(val(res, 'solz')).toBe(0);
    expect(val(res, 'solzFreigrenze')).toBe(20350);
    expect(item(res, 'solz')?.helpText).toMatch(/Kein Soli/);
  });

  it('zvE mode: 90.000 € → Milderungszone and 9 % Kirchensteuer', () => {
    const res = est.calculate({ mode: 'zve', taxableIncome: 90000, taxYear: '2026', tariffType: 'single', churchTaxRate: '9' });
    const e = Math.floor(0.42 * 90000 - 11135.63); // Zone 4
    expect(res.primary.value).toBe(e);
    expect(e).toBe(26664);
    const soli = Math.round((e - 20350) * 0.119 * 100) / 100;
    expect(soli).toBeLessThan(e * 0.055);
    expect(val(res, 'solz')).toBeCloseTo(751.37, 2);
    expect(val(res, 'solz')).toBeCloseTo(soli, 2);
    expect(item(res, 'solz')?.helpText).toMatch(/Milderungszone/);
    expect(val(res, 'kirchensteuer')).toBeCloseTo(e * 0.09, 2);
    expect(val(res, 'totalTax')).toBeCloseTo(26664 + 751.37 + 2399.76, 2);
  });

  it('zvE mode: splitting uses the doubled Freigrenze (200.000 € zvE)', () => {
    const res = est.calculate({ taxableIncome: 200000, taxYear: '2026', tariffType: 'splitting' });
    const e = 2 * Math.floor(0.42 * 100000 - 11135.63);
    expect(res.primary.value).toBe(e);
    expect(val(res, 'solz')).toBeCloseTo(Math.min(e * 0.055, (e - 40700) * 0.119), 2);
    expect(val(res, 'solzFreigrenze')).toBe(40700);
  });

  it('Soli mode: 25.000 € ESt → 553,35 € in der Milderungszone', () => {
    const res = est.calculate({ mode: 'soli', incomeTax: 25000, taxYear: '2026', tariffType: 'single' });
    expect(res.primary.id).toBe('solz');
    expect(Number(res.primary.value)).toBeCloseTo((25000 - 20350) * 0.119, 2);
    expect(String(item(res, 'solzStatus')?.value)).toMatch(/Milderungszone/);
    expect(val(res, 'solzFreigrenze')).toBe(20350);
    expect(val(res, 'solzMilderungEnde')).toBeCloseTo((20350 * 0.119) / (0.119 - 0.055), 6);
    expect(val(res, 'solzMilderungVorteil')).toBeCloseTo(1375 - 553.35, 2);
    expect(val(res, 'solzEffectiveRate')).toBeCloseTo((553.35 / 25000) * 100, 4);
    expect(val(res, 'totalTax')).toBeCloseTo(25553.35, 2);
  });

  it('Soli mode: below Freigrenze, full Soli, married, Kirchensteuer and 2025 values', () => {
    const free = est.calculate({ mode: 'soli', incomeTax: 15000, taxYear: '2026', tariffType: 'single' });
    expect(free.primary.value).toBe(0);
    expect(String(item(free, 'solzStatus')?.value)).toMatch(/Kein Soli/);
    expect(est.calculate({ mode: 'soli', incomeTax: 20350, taxYear: '2026' }).primary.value).toBe(0);

    const full = est.calculate({ mode: 'soli', incomeTax: 100000, taxYear: '2026', tariffType: 'single' });
    expect(full.primary.value).toBe(5500);
    expect(String(item(full, 'solzStatus')?.value)).toMatch(/Voller Soli/);

    const married = est.calculate({ mode: 'soli', incomeTax: 41700, taxYear: '2026', tariffType: 'splitting' });
    expect(Number(married.primary.value)).toBeCloseTo(119, 2);

    const church = est.calculate({ mode: 'soli', incomeTax: 25000, taxYear: '2026', churchTaxRate: '8' });
    expect(val(church, 'kirchensteuer')).toBeCloseTo(2000, 2);

    const fg2025 = TAX_CONFIG_2025.solzFreigrenzeSingle;
    const y2025 = est.calculate({ mode: 'soli', incomeTax: fg2025 + 1000, taxYear: '2025' });
    expect(Number(y2025.primary.value)).toBeCloseTo(119, 2);
    expect(val(y2025, 'solzFreigrenze')).toBe(fg2025);
  });

  it('handles edge cases without throwing', () => {
    expect(est.calculate({ mode: 'soli', incomeTax: '' }).error).toMatch(/Einkommensteuer/);
    expect(est.calculate({ mode: 'soli', incomeTax: -1 }).error).toMatch(/ab 0/);
    expect(est.calculate({ mode: 'soli', incomeTax: 'abc' }).error).toBeDefined();
    expect(est.calculate({ taxableIncome: '' }).error).toMatch(/zu versteuerndes Einkommen/);
    expect(est.calculate({ taxableIncome: -5 }).error).toBeDefined();
    expect(est.calculate({}).error).toBeDefined();
    expect(est.calculate({ taxableIncome: 0 }).primary.value).toBe(0);
    expect(est.calculate({ mode: 'soli', incomeTax: 0 }).primary.value).toBe(0);
    const huge = est.calculate({ taxableIncome: 1e9 });
    expect(Number.isFinite(Number(huge.primary.value))).toBe(true);
    expect(val(huge, 'solz')).toBeCloseTo(Number(huge.primary.value) * 0.055, 0);
    // Komma-Eingabe
    expect(est.calculate({ taxableIncome: '45000,00' }).primary.value).toBe(8835);
  });
});

// ---------------------------------------------------------------------------
// 3. Kraftstoffverbrauch-Rechner ← Kraftstoffverbrauch-Umrechner
// ---------------------------------------------------------------------------
describe('kraftstoffverbrauch-rechner absorbs kraftstoffverbrauch-umrechner', () => {
  const kv = calc('kraftstoffverbrauch-rechner');
  const US = (100 * 3.785411784) / 1.609344; // 235,2146
  const UK = (100 * 4.54609) / 1.609344; // 282,4809

  it('Tankmethode: 42,5 l auf 620 km → 6,85 l/100 km plus MPG', () => {
    const res = kv.calculate({ distanceKm: 620, litersFueled: 42.5 });
    const l = (42.5 / 620) * 100;
    expect(Number(res.primary.value)).toBeCloseTo(l, 10);
    expect(res.primary.formattedValue).toBe('6,85 l/100 km');
    expect(val(res, 'kmPerLiter')).toBeCloseTo(620 / 42.5, 10);
    expect(val(res, 'usmpg')).toBeCloseTo(US / l, 8);
    expect(val(res, 'ukmpg')).toBeCloseTo(UK / l, 8);
    expect(val(res, 'usmpg')).toBeCloseTo(34.31, 2);
  });

  it('Umrechnen: 30 MPG (US) → 7,84 l/100 km', () => {
    const res = kv.calculate({ mode: 'umrechnen', inputValue: 30, inputUnit: 'usmpg' });
    expect(res.primary.id).toBe('l100km');
    expect(Number(res.primary.value)).toBeCloseTo(US / 30, 10);
    expect(res.primary.formattedValue).toBe('7,84 l/100 km');
    expect(val(res, 'kml')).toBeCloseTo(100 / (US / 30), 8);
    expect(val(res, 'ukmpg')).toBeCloseTo(30 * (UK / US), 8);
    expect(item(res, 'usmpg')).toBeUndefined(); // Eingabeeinheit wird nicht wiederholt
  });

  it('Umrechnen: 6,5 l/100 km → MPG (US) as primary, UK and km/l as secondary', () => {
    const res = kv.calculate({ mode: 'umrechnen', inputValue: 6.5, inputUnit: 'l100km' });
    expect(res.primary.id).toBe('usmpg');
    expect(Number(res.primary.value)).toBeCloseTo(US / 6.5, 10);
    expect(res.primary.formattedValue).toBe('36,2 MPG (US)');
    expect(val(res, 'ukmpg')).toBeCloseTo(43.46, 2);
    expect(val(res, 'kml')).toBeCloseTo(15.3846, 4);
    expect(item(res, 'l100km')).toBeUndefined();
  });

  it('Umrechnen: UK-MPG and km/l inputs', () => {
    expect(Number(kv.calculate({ mode: 'umrechnen', inputValue: 40, inputUnit: 'ukmpg' }).primary.value)).toBeCloseTo(UK / 40, 10);
    expect(Number(kv.calculate({ mode: 'umrechnen', inputValue: 20, inputUnit: 'kml' }).primary.value)).toBeCloseTo(5, 10);
    // 40 MPG (US) = 5,88 l/100 km (FAQ)
    expect(Number(kv.calculate({ mode: 'umrechnen', inputValue: 40, inputUnit: 'usmpg' }).primary.value)).toBeCloseTo(5.88, 2);
  });

  it('handles edge cases without throwing', () => {
    for (const bad of [0, -3, 'abc']) {
      expect(kv.calculate({ mode: 'umrechnen', inputValue: bad, inputUnit: 'usmpg' }).error).toMatch(/größer als 0/);
      expect(kv.calculate({ distanceKm: bad, litersFueled: 40 }).error).toMatch(/größer als 0/);
      expect(kv.calculate({ distanceKm: 500, litersFueled: bad }).error).toBeDefined();
    }
    expect(kv.calculate({ mode: 'umrechnen', inputValue: '' }).error).toMatch(/Verbrauchswert/);
    expect(kv.calculate({ distanceKm: '', litersFueled: '' }).error).toBeDefined();
    expect(kv.calculate({}).error).toBeDefined();
    const huge = kv.calculate({ mode: 'umrechnen', inputValue: 1e9, inputUnit: 'l100km' });
    expect(Number.isFinite(Number(huge.primary.value))).toBe(true);
    // Unbekannte Einheit fällt auf l/100 km zurück
    expect(kv.calculate({ mode: 'umrechnen', inputValue: 6.5, inputUnit: 'xyz' }).primary.id).toBe('usmpg');
  });
});

// ---------------------------------------------------------------------------
// 4. Spritkostenrechner ← Fahrtkostenrechner
// ---------------------------------------------------------------------------
describe('spritkostenrechner absorbs fahrtkostenrechner', () => {
  const sp = calc('spritkostenrechner');

  it('keeps the plain fuel-cost result when the extras switch is off', () => {
    const res = sp.calculate({ distance: 100, consumption: 6, pricePerLiter: 1.8, tripsCount: 1, includeExtraCosts: false, tollCosts: 50, parkingCosts: 20, vehicleAllowancePerKm: 0.1, tripsPerMonth: 10 });
    expect(Number(res.primary.value)).toBeCloseTo(10.8, 10);
    expect(item(res, 'tollCosts')).toBeUndefined();
    expect(item(res, 'monthlyTrips')).toBeUndefined();
  });

  it('former Fahrtkosten example: 450 km zu dritt mit Maut, Parken & Verschleiß → 103,69 €', () => {
    const res = sp.calculate({ distance: 225, tripType: 'roundtrip', consumption: 6.5, pricePerLiter: 1.75, tripsCount: 1, passengers: 3, includeExtraCosts: true, tollCosts: 20, parkingCosts: 10, vehicleAllowancePerKm: 0.05 });
    const fuel = 450 * 6.5 / 100 * 1.75; // 51,1875
    const total = fuel + 20 + 10 + 450 * 0.05;
    expect(Number(res.primary.value)).toBeCloseTo(total, 10);
    expect(res.primary.formattedValue).toMatch(/103,69/);
    expect(val(res, 'costPerPerson')).toBeCloseTo(total / 3, 10);
    expect(val(res, 'fuelCost')).toBeCloseTo(fuel, 10);
    expect(val(res, 'tollCosts')).toBe(20);
    expect(val(res, 'parkingCosts')).toBe(10);
    expect(val(res, 'vehicleCost')).toBeCloseTo(22.5, 10);
    expect(val(res, 'totalCostPerKm')).toBeCloseTo(total / 450, 10);
  });

  it('multiplies extras by the number of trips and projects monthly costs', () => {
    const two = sp.calculate({ distance: 100, consumption: 6, pricePerLiter: 2, tripsCount: 2, includeExtraCosts: true, tollCosts: 5, parkingCosts: 3, vehicleAllowancePerKm: 0.1 });
    expect(Number(two.primary.value)).toBeCloseTo((12 + 5 + 3 + 10) * 2, 10);

    const commute = sp.calculate({ distance: 30, tripType: 'roundtrip', consumption: 6.8, pricePerLiter: 1.78, tripsCount: 1, passengers: 2, includeExtraCosts: true, tollCosts: 0, parkingCosts: 3, vehicleAllowancePerKm: 0, tripsPerMonth: 20 });
    const perTrip = 60 * 6.8 / 100 * 1.78 + 3;
    expect(Number(commute.primary.value)).toBeCloseTo(perTrip, 10);
    expect(val(commute, 'monthlyTrips')).toBeCloseTo(perTrip * 20, 10);
    expect(val(commute, 'yearlyTrips')).toBeCloseTo(perTrip * 240, 8);
    expect(item(commute, 'monthlyTrips')?.helpText).toContain('102,62');
  });

  it('API callers without the switch still get extras when they pass them', () => {
    const res = sp.calculate({ distance: 100, consumption: 6, pricePerLiter: 2, tollCosts: 8 });
    expect(Number(res.primary.value)).toBeCloseTo(20, 10);
  });

  it('handles edge cases without throwing', () => {
    const on = { distance: 100, consumption: 6, pricePerLiter: 2, includeExtraCosts: true };
    expect(sp.calculate({ ...on, tollCosts: -1 }).error).toMatch(/Maut/);
    expect(sp.calculate({ ...on, parkingCosts: 'abc' }).error).toMatch(/Park/);
    expect(sp.calculate({ ...on, vehicleAllowancePerKm: -0.1 }).error).toMatch(/Verschleiß/);
    expect(sp.calculate({ ...on, tripsPerMonth: 1.5 }).error).toMatch(/Fahrten pro Monat/);
    expect(sp.calculate({ ...on, tollCosts: '', parkingCosts: '', vehicleAllowancePerKm: '', tripsPerMonth: '' }).primary.value).toBe(12);
    expect(sp.calculate({ ...on, distance: 0 }).primary.value).toBe(0);
    expect(sp.calculate({ ...on, distance: -5 }).error).toBeDefined();
    expect(sp.calculate({}).error).toBeDefined();
    const huge = sp.calculate({ ...on, distance: 1e7, tollCosts: 1e6, tripsPerMonth: 1000 });
    expect(Number.isFinite(Number(huge.primary.value))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. Dienstwagen-Rechner ← Fahrtenbuch vs. 1-%-Rechner
// ---------------------------------------------------------------------------
describe('dienstwagen-1-prozent-rechner absorbs fahrtenbuch-vs-1-prozent-rechner', () => {
  const dw = calc('dienstwagen-1-prozent-rechner');

  it('1-%-Regelung for combustion, hybrid and electric', () => {
    const c = dw.calculate({ grossListPrice: 48000, distanceWorkKm: 20, carDriveType: 'combustion', taxRate: 38 });
    expect(Number(c.primary.value)).toBeCloseTo(480 + 288, 10);
    expect(val(c, 'netCost')).toBeCloseTo(768 * 0.58, 10);
    expect(val(c, 'annualBenefit')).toBeCloseTo(768 * 12, 10);
    const h = dw.calculate({ grossListPrice: 60000, distanceWorkKm: 25, carDriveType: 'hybrid', taxRate: 38 });
    expect(Number(h.primary.value)).toBeCloseTo(300 + 60000 * 0.00015 * 25, 10);
    const e = dw.calculate({ grossListPrice: 50000, distanceWorkKm: 10, carDriveType: 'electric', taxRate: 38 });
    expect(Number(e.primary.value)).toBeCloseTo(125 + 37.5, 10);
  });

  it('rounds the Bruttolistenpreis down to full 100 € and uses full km', () => {
    const res = dw.calculate({ grossListPrice: 48099, distanceWorkKm: 20.9, carDriveType: 'combustion', taxRate: 38 });
    expect(Number(res.primary.value)).toBeCloseTo(768, 10);
    expect(val(res, 'blpRounded')).toBe(48000);
  });

  it('Vergleich: Fahrtenbuch günstiger (52.000 € BLP, 10.500 € Kosten, 20 % privat)', () => {
    const res = dw.calculate({ grossListPrice: 52000, distanceWorkKm: 18, carDriveType: 'combustion', taxRate: 38, compareLogbook: true, yearlyActualCarCosts: 10500, totalYearlyKm: 25000, privateSharePct: 20, workDays: 220 });
    const onePct = (52000 * 0.01 + 52000 * 0.0003 * 18) * 12; // 9.609,60
    const logbook = (10500 / 25000) * (25000 * 0.2 + 220 * 2 * 18); // 0,42 × 12.920 = 5.426,40
    expect(res.primary.id).toBe('cheaperMethod');
    expect(res.primary.label).toContain('Fahrtenbuch');
    expect(Number(res.primary.value)).toBeCloseTo(onePct - logbook, 8);
    expect(Number(res.primary.value)).toBeCloseTo(4183.2, 8);
    expect(val(res, 'onePctYearly')).toBeCloseTo(onePct, 8);
    expect(val(res, 'logbookYearly')).toBeCloseTo(logbook, 8);
    expect(val(res, 'netSaving')).toBeCloseTo((onePct - logbook) * 0.58, 8);
    expect(val(res, 'taxableShare')).toBeCloseTo((12920 / 25000) * 100, 8);
    expect(res.summaryText).toMatch(/Günstiger ist das Fahrtenbuch/);
    expect(res.warning).toBeUndefined();
  });

  it('Vergleich: 1-%-Regelung günstiger (30.000 € BLP, hohe Kosten, 50 % privat)', () => {
    const res = dw.calculate({ grossListPrice: 30000, distanceWorkKm: 15, carDriveType: 'combustion', taxRate: 38, compareLogbook: true, yearlyActualCarCosts: 12000, totalYearlyKm: 20000, privateSharePct: 50, workDays: 200 });
    const onePct = (300 + 30000 * 0.0003 * 15) * 12; // 5.220
    const logbook = 0.6 * (10000 + 200 * 2 * 15); // 9.600
    expect(res.primary.label).toContain('1-%-Regelung');
    expect(Number(res.primary.value)).toBeCloseTo(logbook - onePct, 8);
    expect(Number(res.primary.value)).toBeCloseTo(4380, 8);
    expect(res.summaryText).toMatch(/Günstiger ist die 1-%-Regelung/);
  });

  it('Vergleich: Kostendeckelung when the Pauschale exceeds the total costs', () => {
    const res = dw.calculate({ grossListPrice: 60000, distanceWorkKm: 30, carDriveType: 'combustion', taxRate: 42, compareLogbook: true, yearlyActualCarCosts: 8000, totalYearlyKm: 30000, privateSharePct: 10, workDays: 220 });
    expect(val(res, 'onePctYearly')).toBe(8000);
    expect(val(res, 'logbookYearly')).toBeCloseTo((8000 / 30000) * (3000 + 13200), 8);
    expect(Number(res.primary.value)).toBeCloseTo(8000 - 4320, 8);
    expect(res.warning).toMatch(/Gesamtkosten/);
  });

  it('handles edge cases without throwing', () => {
    const cmp = { grossListPrice: 52000, distanceWorkKm: 18, carDriveType: 'combustion', taxRate: 38, compareLogbook: true, yearlyActualCarCosts: 10500, totalYearlyKm: 25000, privateSharePct: 20, workDays: 220 };
    expect(dw.calculate({ ...cmp, privateSharePct: 90 }).error).toMatch(/Jahresfahrleistung/);
    expect(dw.calculate({ ...cmp, yearlyActualCarCosts: 0 }).error).toMatch(/Gesamtkosten/);
    expect(dw.calculate({ ...cmp, totalYearlyKm: '' }).error).toMatch(/Jahresfahrleistung/);
    expect(dw.calculate({ ...cmp, privateSharePct: 120 }).error).toMatch(/0 und 100/);
    expect(dw.calculate({ ...cmp, workDays: -1 }).error).toBeDefined();
    expect(dw.calculate({ ...cmp, grossListPrice: 0 }).error).toMatch(/Bruttolistenpreis/);
    expect(dw.calculate({ ...cmp, grossListPrice: '' }).error).toMatch(/Bruttolistenpreis/);
    expect(dw.calculate({ ...cmp, distanceWorkKm: -1 }).error).toMatch(/Entfernung/);
    expect(dw.calculate({ ...cmp, taxRate: 150 }).error).toMatch(/Grenzsteuersatz/);
    expect(dw.calculate({}).error).toBeDefined();
    // Vergleich ausgeschaltet: Fahrtenbuch-Eingaben werden ignoriert
    expect(dw.calculate({ ...cmp, compareLogbook: false, yearlyActualCarCosts: -5 }).primary.id).toBe('totalBenefit');
    // 0 km Arbeitsweg (Homeoffice) und 0 % privat
    const zero = dw.calculate({ ...cmp, distanceWorkKm: 0, privateSharePct: 0 });
    expect(val(zero, 'logbookYearly')).toBe(0);
    const huge = dw.calculate({ ...cmp, grossListPrice: 1e9 });
    expect(Number.isFinite(Number(huge.primary.value))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Page content and links for all five targets
// ---------------------------------------------------------------------------
describe('merged target pages: content, keywords and links', () => {
  const FORBIDDEN = [/präzise Formelberechnung/i, /verlässliche(n)? Ergebnisse?n?/i, /für Ihre Planung/i, /umfassend/i, /ultimativ/i, /im Handumdrehen/i];
  const SOURCE_KEYWORDS: Record<string, string[]> = {
    'brutto-netto-rechner': ['sozialabgaben rechner'],
    einkommensteuerrechner: ['soli rechner', 'solidaritätszuschlag rechner'],
    'kraftstoffverbrauch-rechner': ['mpg umrechnen'],
    spritkostenrechner: ['fahrtkosten berechnen', 'fahrtkostenrechner'],
    'dienstwagen-1-prozent-rechner': ['fahrtenbuch oder 1 prozent'],
  };

  it('every merged source is retired and redirects to its target', () => {
    for (const [source, target] of Object.entries(MERGES)) {
      expect(RETIRED_CALCULATORS[source], source).toBe(`/rechner/${target}/`);
      expect(getCalculatorBySlug(source), source).toBeUndefined();
    }
  });

  for (const slug of TARGETS) {
    it(`${slug}: metadata, examples, FAQs and sections meet the bar`, () => {
      const c = calc(slug);
      expect(c.metaTitle.length, c.metaTitle).toBeLessThanOrEqual(60);
      expect(c.metaTitle).not.toMatch(/RechenHafen/);
      expect(c.metaDescription.length, c.metaDescription).toBeLessThanOrEqual(155);
      expect(c.metaDescription).toMatch(/kostenlos/i);
      for (const kw of SOURCE_KEYWORDS[slug]) expect(c.searchKeywords, kw).toContain(kw);
      expect(c.workedExamples?.length ?? 0).toBeGreaterThanOrEqual(2);
      // The registry appends the generic "Ist das Ergebnis … verbindlich?" FAQ to legal pages
      const authoredFaqs = c.faqs.filter((f) => !f.question.includes('verbindlich'));
      expect(authoredFaqs.length).toBeGreaterThanOrEqual(4);
      expect(authoredFaqs.length).toBeLessThanOrEqual(6);
      const sections = c.content?.sections ?? [];
      expect(sections.length).toBeGreaterThanOrEqual(2);
      expect(sections.length).toBeLessThanOrEqual(4);

      const { calculate: _calculate, ...data } = c;
      const text = JSON.stringify(data);
      for (const re of FORBIDDEN) expect(text, String(re)).not.toMatch(re);

      // Every worked example runs without error
      for (const ex of c.workedExamples ?? []) {
        if (!ex.inputs) continue;
        const res = c.calculate(ex.inputs);
        expect(res.error, ex.title).toBeUndefined();
      }
    });

    it(`${slug}: related slugs and in-content links point to live calculators only`, () => {
      const c = calc(slug);
      const { calculate: _calculate, ...data } = c;
      const linked = [...JSON.stringify(data).matchAll(/\/rechner\/([a-z0-9-]+)\//g)].map((m) => m[1]);
      for (const s of [...c.relatedSlugs, ...linked]) {
        expect(isCalculatorRetired(s), `${slug} → ${s}`).toBe(false);
        expect(getCalculatorBySlug(s), `${slug} → ${s}`).toBeDefined();
      }
      expect(c.relatedSlugs).not.toContain(slug);
    });
  }

  it('worked example summaries match the calculator output', () => {
    const ex = (slug: string, i: number) => {
      const c = calc(slug);
      const e = c.workedExamples![i];
      const res = c.calculate(e.inputs!);
      // Intl formats "1,00 €" with a no-break space; compare on normal spaces
      const norm = (x: unknown) => String(x).replace(/ /g, ' ');
      for (const it of [res.primary, ...(res.secondary ?? [])]) it.formattedValue = norm(it.formattedValue);
      return { res, summary: norm(e.resultSummary) };
    };
    let r = ex('brutto-netto-rechner', 2);
    expect(r.summary).toContain(String(item(r.res, 'employerTotal')?.formattedValue));
    r = ex('brutto-netto-rechner', 3);
    expect(r.summary).toContain(String(r.res.primary.formattedValue));
    for (const i of [0, 2, 3]) {
      r = ex('einkommensteuerrechner', i);
      expect(r.summary).toContain(String(r.res.primary.formattedValue));
    }
    r = ex('einkommensteuerrechner', 1);
    expect(r.summary).toContain(String(item(r.res, 'totalTax')?.formattedValue));
    for (const i of [0, 1]) {
      r = ex('kraftstoffverbrauch-rechner', i);
      expect(r.summary).toContain(String(r.res.primary.formattedValue));
    }
    for (const i of [2, 3]) {
      r = ex('spritkostenrechner', i);
      expect(r.summary).toContain(String(r.res.primary.formattedValue));
    }
    for (const i of [0, 1, 2, 3]) {
      r = ex('dienstwagen-1-prozent-rechner', i);
      expect(r.summary).toContain(String(r.res.primary.formattedValue));
    }
  });
});
