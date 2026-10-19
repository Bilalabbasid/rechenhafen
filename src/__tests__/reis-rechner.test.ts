import { describe, it, expect } from 'vitest';
import { EXTRA_EINHEITEN_KOCHEN } from '@/data/calculators/extra/einheitenKochen';

describe('Reis-Wasser-Rechner (wasser-reis-verhaeltnis-rechner)', () => {
  const riceCalc = EXTRA_EINHEITEN_KOCHEN.find((c) => c.slug === 'wasser-reis-verhaeltnis-rechner');

  it('exists with expected URL and clean title without manual truncation ellipses', () => {
    expect(riceCalc).toBeDefined();
    expect(riceCalc?.slug).toBe('wasser-reis-verhaeltnis-rechner');
    expect(riceCalc?.metaTitle).toBe('Reis-Wasser-Rechner: Menge nach Reissorte berechnen');
    expect(riceCalc?.metaTitle).not.toContain('...');
    expect(riceCalc?.metaDescription).not.toContain('...');
  });

  describe('Ratio consistency across options, formulas, and content', () => {
    it('Basmati rice: ratio 1 : 1,5, unambiguous ml Wasser', () => {
      const res = riceCalc?.calculate({
        riceGrams: 200,
        riceType: 'basmati',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(300); // 200 * 1.5 = 300 ml
      expect(res?.primary.formattedValue).toBe('300 ml Wasser'); // NOT ambiguous "300 ml (g)"
      expect(res?.secondary?.find((s) => s.id === 'cookedYield')?.formattedValue).toContain('490 g');
    });

    it('Jasmin rice: ratio 1 : 1,3 agrees with formula and option label', () => {
      const res = riceCalc?.calculate({
        riceGrams: 200,
        riceType: 'jasmine',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(260); // 200 * 1.3 = 260 ml
      expect(res?.primary.formattedValue).toBe('260 ml Wasser');
      expect(res?.summaryText).toContain('1 : 1,3');
    });

    it('Sushi rice: ratio 1 : 1,2 agrees with closed-pot Quellmethode and resting time', () => {
      const res = riceCalc?.calculate({
        riceGrams: 250,
        riceType: 'sushi',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(300); // 250 * 1.2 = 300 ml
      expect(res?.primary.formattedValue).toBe('300 ml Wasser');
      expect(res?.secondary?.find((s) => s.id === 'cookTime')?.formattedValue).toContain('15 (+ 10 Min. Ruhen)');
    });

    it('Vollkornreis (wholegrain): ratio 1 : 2,0 agrees across options and explanation', () => {
      const res = riceCalc?.calculate({
        riceGrams: 150,
        riceType: 'wholegrain',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(300); // 150 * 2.0 = 300 ml
      expect(res?.primary.formattedValue).toBe('300 ml Wasser');
      expect(res?.secondary?.find((s) => s.id === 'cookTime')?.formattedValue).toContain('35–45 Minuten');
    });

    it('Risotto: ratio 1 : 3,0 hot broth, explicitly distinguishes open-pot from Quellmethode', () => {
      const res = riceCalc?.calculate({
        riceGrams: 200,
        riceType: 'risotto',
      });

      expect(res?.error).toBeUndefined();
      expect(res?.primary.value).toBe(600); // 200 * 3.0 = 600 ml
      expect(res?.primary.formattedValue).toBe('600 ml heiße Gemüse- oder Fleischbrühe');
      expect(res?.qualifications?.[0]).toContain('Offener Topf');
      expect(res?.qualifications?.[0]).toContain('nicht im geschlossenen Topf gedämpft');
    });
  });

  describe('Edge cases and safety', () => {
    it('handles blank or non-positive rice inputs gracefully', () => {
      const resEmpty = riceCalc?.calculate({ riceGrams: '' });
      expect(resEmpty?.error).toBeDefined();

      const resZero = riceCalc?.calculate({ riceGrams: 0 });
      expect(resZero?.error).toBeDefined();

      const resNeg = riceCalc?.calculate({ riceGrams: -100 });
      expect(resNeg?.error).toBeDefined();
    });

    it('explains that package instructions take priority and salt is optional', () => {
      const res = riceCalc?.calculate({ riceGrams: 200, riceType: 'basmati' });
      const qualText = res?.qualifications?.join(' ');
      expect(qualText).toContain('Packungsangaben des Herstellers haben Vorrang');

      const saltSec = res?.secondary?.find((s) => s.id === 'saltGuidance');
      expect(saltSec?.formattedValue).toContain('optional');
    });

    it('scales salt grams and teaspoon equivalents dynamically at 1,000 g rice', () => {
      // Confirmed live defect: at 1000g rice, salt was 15g but text was hardcoded to "1/2 gestr. TL"
      const res = riceCalc?.calculate({ riceGrams: 1000, riceType: 'basmati' });
      const saltSec = res?.secondary?.find((s) => s.id === 'saltGuidance');
      expect(saltSec?.value).toBe(15);
      expect(saltSec?.formattedValue).toContain('15 g');
      expect(saltSec?.formattedValue).toContain('3 gestr. TL'); // 15g / 5g = 3.0 gestr. TL
      expect(saltSec?.formattedValue).not.toContain('1/2 gestr. TL');
    });

    it('handles already salted risotto broth appropriately', () => {
      const res = riceCalc?.calculate({ riceGrams: 300, riceType: 'risotto' });
      const saltSec = res?.secondary?.find((s) => s.id === 'saltGuidance');
      expect(saltSec?.formattedValue).toContain('Brühe');
      expect(saltSec?.formattedValue).toContain('gesalzen');
    });

    it('handles small rice quantities without artificially claiming a full serving', () => {
      const res = riceCalc?.calculate({ riceGrams: 30, riceType: 'basmati' });
      const portionSec = res?.secondary?.find((s) => s.id === 'portions');
      expect(portionSec?.formattedValue).toContain('0,5 Portionen');
    });
  });
});
