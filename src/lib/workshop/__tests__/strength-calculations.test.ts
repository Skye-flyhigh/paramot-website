import { describe, it, expect } from 'vitest';
import {
  calculateLoadDistribution,
  calculateStrengthThresholds,
  evaluateDestructiveTest,
  classifyLineMaterial,
  getTestGuidance,
} from '../strength-calculations';

describe('calculateLoadDistribution', () => {
  it('distributes load for 4-row glider', () => {
    const dist = calculateLoadDistribution(4, 100);

    expect(dist).toHaveLength(4);
    expect(dist[0]).toEqual({ row: 'A', percentage: 40, loadKg: 40 });
    expect(dist[1]).toEqual({ row: 'B', percentage: 35, loadKg: 35 });
    expect(dist[2]).toEqual({ row: 'C', percentage: 20, loadKg: 20 });
    expect(dist[3]).toEqual({ row: 'D', percentage: 5, loadKg: 5 });
  });

  it('distributes load for 3-row glider', () => {
    const dist = calculateLoadDistribution(3, 85);

    expect(dist).toHaveLength(3);
    expect(dist[0].loadKg).toBeCloseTo(42.5);
    expect(dist[1].loadKg).toBeCloseTo(34);
    expect(dist[2].loadKg).toBeCloseTo(8.5);
  });

  it('distributes load for 2-row glider', () => {
    const dist = calculateLoadDistribution(2, 80);

    expect(dist).toHaveLength(2);
    expect(dist[0].percentage).toBe(65);
    expect(dist[1].percentage).toBe(35);
  });

  it('returns empty for unsupported row count', () => {
    expect(calculateLoadDistribution(5, 100)).toEqual([]);
  });
});

describe('calculateStrengthThresholds', () => {
  it('calculates warning and reject thresholds', () => {
    const thresholds = calculateStrengthThresholds([
      { lineRow: 'A', cascadeLevel: 1, strengthNew: 190 },
    ]);

    expect(thresholds).toHaveLength(1);
    expect(thresholds[0].warningThreshold).toBeCloseTo(38); // 20% of 190
    expect(thresholds[0].rejectThreshold).toBeCloseTo(19); // 10% of 190
  });

  it('skips materials with null strength', () => {
    const thresholds = calculateStrengthThresholds([
      { lineRow: 'A', cascadeLevel: 1, strengthNew: null },
    ]);

    expect(thresholds).toHaveLength(0);
  });
});

describe('evaluateDestructiveTest', () => {
  it('passes when above 20% of original', () => {
    const result = evaluateDestructiveTest(50, 190);

    expect(result.result).toBe('pass');
    expect(result.percentRemaining).toBeCloseTo(26.3, 0);
  });

  it('warns between 10-20% of original', () => {
    const result = evaluateDestructiveTest(30, 190);

    expect(result.result).toBe('warning');
  });

  it('rejects below 10% of original', () => {
    const result = evaluateDestructiveTest(15, 190);

    expect(result.result).toBe('reject');
  });
});

describe('classifyLineMaterial', () => {
  it('classifies Elderid as unknown', () => {
    expect(classifyLineMaterial('Elderid', '8000 190 222 0')).toBe('unknown');
  });

  it('classifies Vectran lines', () => {
    expect(classifyLineMaterial('Liros', 'Vectran 120')).toBe('vectran');
  });

  it('classifies Dyneema lines', () => {
    expect(classifyLineMaterial('Edelrid', 'SK99 1.0mm')).toBe('dyneema');
  });

  it('classifies Aramid lines', () => {
    expect(classifyLineMaterial('Cousin', 'Technora 1.1')).toBe('aramid');
  });
});

describe('getTestGuidance', () => {
  it('returns guidance for each material type', () => {
    expect(getTestGuidance('vectran')).toContain('50h');
    expect(getTestGuidance('dyneema')).toContain('not tested');
    expect(getTestGuidance('aramid')).toContain('Full-length');
    expect(getTestGuidance('unknown')).toContain('Unknown');
  });
});
