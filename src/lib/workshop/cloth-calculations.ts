/**
 * APPI cloth assessment calculations.
 * Porosity (permeability) and tear resistance thresholds.
 */

// =============================================================================
// TYPES
// =============================================================================

export type ClothResult = 'pass' | 'warning' | 'fail';

export interface PorosityEvaluation {
  result: ClothResult;
  label: string;
  detail: string;
}

export interface TearEvaluation {
  result: ClothResult;
  label: string;
  detail: string;
}

export interface ClothSummary {
  totalTests: number;
  passCount: number;
  warningCount: number;
  failCount: number;
  overallResult: ClothResult;
  porosityAvg: number | null;
  tearAvg: number | null;
}

// =============================================================================
// POROSITY EVALUATION
// =============================================================================

/**
 * Evaluate porosity based on APPI thresholds.
 *
 * Porosimeter (L/m²/min): higher = more permeable = worse
 *   - <360: Pass
 *   - 360-540: Warning (loss of fabric stiffness)
 *   - >540: Investigation required
 *
 * JDC (seconds): lower = more permeable = worse (inverse scale)
 *   - >15s: Pass
 *   - 10-15s: Warning
 *   - <10s: Investigation required
 */
export function evaluatePorosity(value: number, method: string): PorosityEvaluation {
  if (method === 'jdc') {
    // JDC: seconds (higher = better)
    if (value > 15) {
      return { result: 'pass', label: 'Pass', detail: `${value}s > 15s threshold` };
    }
    if (value >= 10) {
      return {
        result: 'warning',
        label: 'Warning',
        detail: `${value}s in 10-15s warning range — fabric stiffness may be degrading`,
      };
    }

    return {
      result: 'fail',
      label: 'Investigation',
      detail: `${value}s < 10s — high permeability, airworthiness investigation required`,
    };
  }

  // Porosimeter / Porotest: L/m²/min (lower = better)
  if (value < 360) {
    return { result: 'pass', label: 'Pass', detail: `${value} L/m²/min < 360 threshold` };
  }
  if (value <= 540) {
    return {
      result: 'warning',
      label: 'Warning',
      detail: `${value} L/m²/min in 360-540 warning range — fabric stiffness may be degrading`,
    };
  }

  return {
    result: 'fail',
    label: 'Investigation',
    detail: `${value} L/m²/min > 540 — high permeability, airworthiness investigation required`,
  };
}

// =============================================================================
// TEAR RESISTANCE EVALUATION
// =============================================================================

/**
 * Evaluate tear resistance based on APPI/Bettsometer thresholds.
 *
 * Measured in grams force:
 *   - >800g: Good
 *   - 600-800g: Used (serviceable but degraded)
 *   - <600g: Not airworthy
 *
 * Note: the spec uses grams but the form captures daN.
 * 1 daN = 1000g, so threshold in daN: >0.8 pass, 0.6-0.8 warning, <0.6 fail.
 * However, tear resistance is typically reported in grams in the APPI context,
 * so we accept the raw value and let the caller specify the unit.
 */
export function evaluateTearResistance(valueGrams: number): TearEvaluation {
  if (valueGrams > 800) {
    return {
      result: 'pass',
      label: 'Good',
      detail: `${valueGrams}g > 800g — cloth in good condition`,
    };
  }
  if (valueGrams >= 600) {
    return {
      result: 'warning',
      label: 'Used',
      detail: `${valueGrams}g in 600-800g range — cloth showing wear`,
    };
  }

  return {
    result: 'fail',
    label: 'Not Airworthy',
    detail: `${valueGrams}g < 600g — structural integrity compromised`,
  };
}

// =============================================================================
// AUTO-RESULT CALCULATION
// =============================================================================

/**
 * Auto-determine the overall result for a cloth test point.
 * Takes the worst result between porosity and tear resistance.
 */
export function autoClothResult(
  porosityValue: number | null,
  porosityMethod: string | null,
  tearResistance: number | null,
): ClothResult | null {
  const results: ClothResult[] = [];

  if (porosityValue != null && porosityMethod) {
    results.push(evaluatePorosity(porosityValue, porosityMethod).result);
  }

  if (tearResistance != null) {
    results.push(evaluateTearResistance(tearResistance).result);
  }

  if (results.length === 0) return null;

  // Return worst result
  if (results.includes('fail')) return 'fail';
  if (results.includes('warning')) return 'warning';

  return 'pass';
}

// =============================================================================
// SUMMARY
// =============================================================================

/**
 * Summarize all cloth test results for a session.
 */
export function summarizeClothTests(
  tests: Array<{
    porosityValue: number | null;
    porosityMethod: string | null;
    tearResistance: number | null;
    result: string | null;
  }>,
): ClothSummary {
  let passCount = 0;
  let warningCount = 0;
  let failCount = 0;

  const porosityValues: number[] = [];
  const tearValues: number[] = [];

  for (const test of tests) {
    // Use the stored result, or compute it
    const result =
      (test.result as ClothResult) ??
      autoClothResult(test.porosityValue, test.porosityMethod, test.tearResistance);

    if (result === 'pass') passCount++;
    else if (result === 'warning') warningCount++;
    else if (result === 'fail') failCount++;

    if (test.porosityValue != null) porosityValues.push(test.porosityValue);
    if (test.tearResistance != null) tearValues.push(test.tearResistance);
  }

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  let overallResult: ClothResult = 'pass';

  if (failCount > 0) overallResult = 'fail';
  else if (warningCount > 0) overallResult = 'warning';

  return {
    totalTests: tests.length,
    passCount,
    warningCount,
    failCount,
    overallResult,
    porosityAvg: avg(porosityValues),
    tearAvg: avg(tearValues),
  };
}
