import { CalculatorDefinition } from '@/types/calculator';
import { EXTRA_DATUM_MATH } from './datumMath';
import { EXTRA_FINANZEN_KREDIT } from './finanzenKredit';
import { EXTRA_WOHNEN_HAUSHALT } from './wohnenHaushalt';
import { EXTRA_AUTO_ARBEIT } from './autoArbeit';
import { EXTRA_GESUNDHEIT_FAMILIE } from './gesundheitFamilie';
import { EXTRA_BAUEN_GEOMETRIE } from './bauenGeometrie';
import { EXTRA_EINHEITEN_KOCHEN } from './einheitenKochen';
import { EXTRA_BUSINESS_STATISTIK } from './businessStatistik';

export {
  EXTRA_DATUM_MATH,
  EXTRA_FINANZEN_KREDIT,
  EXTRA_WOHNEN_HAUSHALT,
  EXTRA_AUTO_ARBEIT,
  EXTRA_GESUNDHEIT_FAMILIE,
  EXTRA_BAUEN_GEOMETRIE,
  EXTRA_EINHEITEN_KOCHEN,
  EXTRA_BUSINESS_STATISTIK,
};

export const EXTRA_CALCULATORS: CalculatorDefinition[] = [
  ...EXTRA_DATUM_MATH,
  ...EXTRA_FINANZEN_KREDIT,
  ...EXTRA_WOHNEN_HAUSHALT,
  ...EXTRA_AUTO_ARBEIT,
  ...EXTRA_GESUNDHEIT_FAMILIE,
  ...EXTRA_BAUEN_GEOMETRIE,
  ...EXTRA_EINHEITEN_KOCHEN,
  ...EXTRA_BUSINESS_STATISTIK,
];
