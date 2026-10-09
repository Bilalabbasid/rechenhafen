import { describe, it, expect } from 'vitest';
import { EXTRA_BAUEN_GEOMETRIE } from '../data/calculators/extra/bauenGeometrie';

describe('Schalungssteine Rechner (schalungssteine-rechner)', () => {
  const calc = EXTRA_BAUEN_GEOMETRIE.find((c) => c.slug === 'schalungssteine-rechner')!;

  it('calculates straight wall (8 m × 1.5 m) correctly', () => {
    const result = calc.calculate({
      wallType: 'straight',
      wallLength: 8,
      wallHeight: 1.5,
      fillMode: 'preset_delfing24',
      stoneReserve: 5,
      concreteReserve: 0,
    });

    expect(result.error).toBeUndefined();
    // 8 m * 1.5 m = 12 m² net wall area
    // 12 * 8 = 96 base stones
    // 96 * 1.05 = 100.8 -> 101 stones with 5% reserve
    expect(result.primary.value).toBe(101);
    expect(result.primary.formattedValue).toBe('101 Stück');

    // 1.5 m height / 0.25 m = 6 courses (layers)
    const courses = result.secondary?.find((s) => s.id === 'courses');
    expect(courses?.value).toBe(6);

    // 0 corners, 2 open ends -> 2 ends * 6 courses = 12 end blocks
    const cornerEnd = result.secondary?.find((s) => s.id === 'cornerEndBlocks');
    expect(cornerEnd?.value).toBe(12);

    // Standard blocks: 96 - 12 = 84
    const standard = result.secondary?.find((s) => s.id === 'standardBlocks');
    expect(standard?.value).toBe(84);

    // Concrete: 12 m² * 130 l/m² = 1.56 m³
    const concrete = result.secondary?.find((s) => s.id === 'concreteM3');
    expect(concrete?.value).toBe(1.56);

    // Safety disclaimer
    expect(result.qualifications?.[0]).toBe(
      'Sicherheitshinweis: Der Rechner ermittelt Materialmengen. Er ersetzt keine Statik, Bewehrungsplanung oder Herstellervorgaben.'
    );
  });

  it('calculates L-shaped wall (6 m + 4 m × 1.0 m) correctly', () => {
    const result = calc.calculate({
      wallType: 'l_shape',
      wallLength: 6,
      wallLengthB: 4,
      wallHeight: 1.0,
      fillMode: 'preset_delfing24',
      stoneReserve: 5,
      concreteReserve: 0,
    });

    expect(result.error).toBeUndefined();
    // Total length = 6 + 4 = 10 m
    // Gross area = 10 * 1.0 = 10 m²
    // Base stones = 10 * 8 = 80 stones
    // 80 * 1.05 = 84 stones with 5% reserve
    expect(result.primary.value).toBe(84);

    // Courses = 1.0 / 0.25 = 4 courses
    const courses = result.secondary?.find((s) => s.id === 'courses');
    expect(courses?.value).toBe(4);

    // L-shape: 1 corner, 2 open ends -> (1 corner + 2 ends) * 4 courses = 12 corner/end blocks
    const cornerEnd = result.secondary?.find((s) => s.id === 'cornerEndBlocks');
    expect(cornerEnd?.value).toBe(12);

    // Standard blocks: 80 - 12 = 68
    const standard = result.secondary?.find((s) => s.id === 'standardBlocks');
    expect(standard?.value).toBe(68);

    // Concrete: 10 m² * 130 l/m² = 1.30 m³
    const concrete = result.secondary?.find((s) => s.id === 'concreteM3');
    expect(concrete?.value).toBe(1.3);
  });

  it('calculates wall with opening (8 m × 2.0 m wall with 1.0 m × 2.0 m door opening)', () => {
    const result = calc.calculate({
      wallType: 'straight',
      wallLength: 8,
      wallHeight: 2.0,
      openingWidth: 1.0,
      openingHeight: 2.0,
      fillMode: 'preset_delfing24',
      stoneReserve: 5,
      concreteReserve: 0,
    });

    expect(result.error).toBeUndefined();
    // Gross area = 8 * 2.0 = 16 m²
    // Opening area = 1.0 * 2.0 = 2 m²
    // Net area = 14 m²
    const wallArea = result.secondary?.find((s) => s.id === 'wallArea');
    expect(wallArea?.value).toBe(14);

    // Base stones = 14 * 8 = 112
    const baseStones = result.secondary?.find((s) => s.id === 'baseStones');
    expect(baseStones?.value).toBe(112);

    // 112 * 1.05 = 117.6 -> 118 stones
    expect(result.primary.value).toBe(118);

    // 2.0 / 0.25 = 8 courses
    const courses = result.secondary?.find((s) => s.id === 'courses');
    expect(courses?.value).toBe(8);

    // Concrete = 14 * 0.130 = 1.82 m³
    const concrete = result.secondary?.find((s) => s.id === 'concreteM3');
    expect(concrete?.value).toBe(1.82);
  });

  it('handles zero waste reserve (stoneReserve: 0, concreteReserve: 0)', () => {
    const result = calc.calculate({
      wallType: 'straight',
      wallLength: 8,
      wallHeight: 1.5,
      fillMode: 'preset_delfing24',
      stoneReserve: 0,
      concreteReserve: 0,
    });

    expect(result.error).toBeUndefined();
    // Base stones = 96
    const baseStones = result.secondary?.find((s) => s.id === 'baseStones');
    expect(baseStones?.value).toBe(96);

    // With 0% reserve, primary equals baseStones
    expect(result.primary.value).toBe(96);
    expect(result.primary.formattedValue).toBe('96 Stück');

    const reserveSec = result.secondary?.find((s) => s.id === 'stoneReserveAmount');
    expect(reserveSec?.value).toBe(0);
    expect(reserveSec?.formattedValue).toBe('0 % (+0 Steine)');

    const concreteReserveSec = result.secondary?.find((s) => s.id === 'concreteReserveAmount');
    expect(concreteReserveSec?.value).toBe(0);
  });

  it('calculates closed rectangle / pool wall correctly', () => {
    const result = calc.calculate({
      wallType: 'rectangle_pool',
      wallLength: 6,
      wallLengthB: 3,
      wallHeight: 1.5,
      fillMode: 'preset_delfing24',
      stoneReserve: 5,
      concreteReserve: 0,
    });

    expect(result.error).toBeUndefined();
    // Perimeter = 2 * (6 + 3) = 18 m
    // Area = 18 * 1.5 = 27 m²
    // Base stones = 27 * 8 = 216
    const baseStones = result.secondary?.find((s) => s.id === 'baseStones');
    expect(baseStones?.value).toBe(216);

    // 4 corners, 0 open ends -> 4 * 6 courses = 24 corner blocks
    const cornerEnd = result.secondary?.find((s) => s.id === 'cornerEndBlocks');
    expect(cornerEnd?.value).toBe(24);

    // Standard blocks = 216 - 24 = 192
    const standard = result.secondary?.find((s) => s.id === 'standardBlocks');
    expect(standard?.value).toBe(192);
  });
});
