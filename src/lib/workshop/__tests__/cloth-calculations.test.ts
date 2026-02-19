import { describe, it, expect } from 'vitest';
import {
  evaluatePorosity,
  evaluateTearResistance,
  autoClothResult,
  summarizeClothTests,
} from '../cloth-calculations';

describe('evaluatePorosity', () => {
  // Porosimeter (L/m²/min) — lower is better
  it('passes for low porosimeter values', () => {
    expect(evaluatePorosity(200, 'bettsometer').result).toBe('pass');
    expect(evaluatePorosity(359, 'bettsometer').result).toBe('pass');
  });

  it('warns for moderate porosimeter values', () => {
    expect(evaluatePorosity(360, 'bettsometer').result).toBe('warning');
    expect(evaluatePorosity(450, 'bettsometer').result).toBe('warning');
    expect(evaluatePorosity(540, 'bettsometer').result).toBe('warning');
  });

  it('fails for high porosimeter values', () => {
    expect(evaluatePorosity(541, 'bettsometer').result).toBe('fail');
    expect(evaluatePorosity(800, 'bettsometer').result).toBe('fail');
  });

  // JDC (seconds) — higher is better (inverse scale)
  it('passes for high JDC values', () => {
    expect(evaluatePorosity(20, 'jdc').result).toBe('pass');
    expect(evaluatePorosity(16, 'jdc').result).toBe('pass');
  });

  it('warns for moderate JDC values', () => {
    expect(evaluatePorosity(15, 'jdc').result).toBe('warning');
    expect(evaluatePorosity(12, 'jdc').result).toBe('warning');
    expect(evaluatePorosity(10, 'jdc').result).toBe('warning');
  });

  it('fails for low JDC values', () => {
    expect(evaluatePorosity(9, 'jdc').result).toBe('fail');
    expect(evaluatePorosity(5, 'jdc').result).toBe('fail');
  });
});

describe('evaluateTearResistance', () => {
  it('passes for good cloth', () => {
    expect(evaluateTearResistance(900).result).toBe('pass');
    expect(evaluateTearResistance(801).result).toBe('pass');
  });

  it('warns for used cloth', () => {
    expect(evaluateTearResistance(800).result).toBe('warning');
    expect(evaluateTearResistance(700).result).toBe('warning');
    expect(evaluateTearResistance(600).result).toBe('warning');
  });

  it('fails for degraded cloth', () => {
    expect(evaluateTearResistance(599).result).toBe('fail');
    expect(evaluateTearResistance(400).result).toBe('fail');
  });
});

describe('autoClothResult', () => {
  it('returns null when no data provided', () => {
    expect(autoClothResult(null, null, null)).toBeNull();
  });

  it('uses porosity when only porosity provided', () => {
    expect(autoClothResult(200, 'bettsometer', null)).toBe('pass');
    expect(autoClothResult(600, 'bettsometer', null)).toBe('fail');
  });

  it('uses tear when only tear provided', () => {
    expect(autoClothResult(null, null, 900)).toBe('pass');
    expect(autoClothResult(null, null, 500)).toBe('fail');
  });

  it('returns worst result when both provided', () => {
    // Porosity pass, tear fail → fail
    expect(autoClothResult(200, 'bettsometer', 500)).toBe('fail');
    // Porosity warning, tear pass → warning
    expect(autoClothResult(400, 'bettsometer', 900)).toBe('warning');
    // Both pass → pass
    expect(autoClothResult(200, 'bettsometer', 900)).toBe('pass');
  });
});

describe('summarizeClothTests', () => {
  it('summarizes multiple tests correctly', () => {
    const summary = summarizeClothTests([
      {
        porosityValue: 200,
        porosityMethod: 'bettsometer',
        tearResistance: 900,
        result: null,
      },
      {
        porosityValue: 400,
        porosityMethod: 'bettsometer',
        tearResistance: 700,
        result: null,
      },
      {
        porosityValue: 600,
        porosityMethod: 'bettsometer',
        tearResistance: 500,
        result: null,
      },
    ]);

    expect(summary.totalTests).toBe(3);
    expect(summary.passCount).toBe(1);
    expect(summary.warningCount).toBe(1);
    expect(summary.failCount).toBe(1);
    expect(summary.overallResult).toBe('fail');
    expect(summary.porosityAvg).toBe(400);
    expect(summary.tearAvg).toBe(700);
  });

  it('uses stored result when available', () => {
    const summary = summarizeClothTests([
      {
        porosityValue: 200,
        porosityMethod: 'bettsometer',
        tearResistance: 900,
        result: 'warning',
      },
    ]);

    expect(summary.warningCount).toBe(1);
  });
});
