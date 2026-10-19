import { describe, it, expect } from 'vitest';
import { ALL_CALCULATORS } from '@/data/calculators';

describe('Alter-in-Monaten-Rechner (alter-in-monaten)', () => {
  const calc = ALL_CALCULATORS.find((c) => c.slug === 'alter-in-monaten')!;

  it('exists in the registry with valid metadata and url preservation', () => {
    expect(calc).toBeDefined();
    expect(calc.slug).toBe('alter-in-monaten');
  });

  it('calculates birth 15 January to reference 15 March as 2 completed months and running 3rd month', () => {
    const res = calc.calculate({
      birthDate: '2026-01-15',
      targetDate: '2026-03-15',
    });

    expect(res.primary.value).toBe(2);
    expect(res.primary.formattedValue).toBe('2 Monate, 0 Tage');

    const running = res.secondary?.find((s) => s.id === 'runningMonth');
    const rest = res.secondary?.find((s) => s.id === 'restDays');

    expect(running?.value).toBe(3);
    expect(running?.formattedValue).toBe('3. Lebensmonat');
    expect(rest?.value).toBe(0);
    expect(res.summaryText).toContain('15.01.2026');
    expect(res.summaryText).toContain('15.03.2026');
    expect(res.summaryText).toContain('3. Lebensmonat');
  });

  it('calculates 1 day before anniversary (15 Jan to 14 March) as 1 completed month, 27 days and running 2nd month', () => {
    const res = calc.calculate({
      birthDate: '2026-01-15',
      targetDate: '2026-03-14',
    });

    expect(res.primary.value).toBe(1);
    expect(res.primary.formattedValue).toBe('1 Monate, 27 Tage');

    const running = res.secondary?.find((s) => s.id === 'runningMonth');
    const rest = res.secondary?.find((s) => s.id === 'restDays');

    expect(running?.value).toBe(2);
    expect(running?.formattedValue).toBe('2. Lebensmonat');
    expect(rest?.value).toBe(27);
  });

  it('handles month-end convention for 31 January in non-leap year (28 Feb -> 1 completed month)', () => {
    const res = calc.calculate({
      birthDate: '2025-01-31',
      targetDate: '2025-02-28',
    });

    expect(res.primary.value).toBe(1);
    expect(res.primary.formattedValue).toBe('1 Monate, 0 Tage');
    const running = res.secondary?.find((s) => s.id === 'runningMonth');
    expect(running?.value).toBe(2);
  });

  it('handles month-end convention for 31 January in leap year (29 Feb 2024 -> 1 completed month)', () => {
    const res = calc.calculate({
      birthDate: '2024-01-31',
      targetDate: '2024-02-29',
    });

    expect(res.primary.value).toBe(1);
    expect(res.primary.formattedValue).toBe('1 Monate, 0 Tage');
  });

  it('rejects target date earlier than birth date with clean error', () => {
    const res = calc.calculate({
      birthDate: '2026-05-10',
      targetDate: '2026-01-10',
    });

    expect(res.error).toBe('Das Geburtsdatum darf nicht nach dem Stichtag liegen.');
  });

  it('does not contain holiday law or labor law boilerplate', () => {
    const text = JSON.stringify(calc.content || {});
    expect(text).not.toContain('Feiertagsgesetz');
    expect(text).not.toContain('Arbeitsruhe');
    expect(text).not.toContain('Kündigungsfrist nach § 622');
  });
});
