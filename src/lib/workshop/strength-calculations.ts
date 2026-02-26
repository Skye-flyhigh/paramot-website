/**
 * APPI line strength assessment calculations.
 * Load distribution, destructive/non-destructive test thresholds.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface LoadDistribution {
  row: string;
  percentage: number;
  loadKg: number;
}

export interface StrengthThreshold {
  lineRow: string;
  cascadeLevel: number;
  strengthNew: number; // daN
  warningThreshold: number; // 20% loss = 80% of new
  rejectThreshold: number; // 10% remaining = 10% of new
}

export interface NonDestructiveLoad {
  lineRow: string;
  maxFlyingWeightKg: number;
  loadTestDaN: number; // 8G × max weight contribution + 20% line strength
}

// =============================================================================
// LOAD DISTRIBUTION
// =============================================================================

/** APPI load distribution percentages by number of rows */
const LOAD_TABLES: Record<number, { row: string; pct: number }[]> = {
  2: [
    { row: 'A', pct: 65 },
    { row: 'B', pct: 35 },
  ],
  3: [
    { row: 'A', pct: 50 },
    { row: 'B', pct: 40 },
    { row: 'C', pct: 10 },
  ],
  4: [
    { row: 'A', pct: 40 },
    { row: 'B', pct: 35 },
    { row: 'C', pct: 20 },
    { row: 'D', pct: 5 },
  ],
};

/**
 * Calculate load distribution per row based on max weight and number of rows.
 * Stabilo lines are not counted in load distribution.
 */
export function calculateLoadDistribution(
  numRows: number,
  maxWeightKg: number,
): LoadDistribution[] {
  const table = LOAD_TABLES[numRows];

  if (!table) return [];

  return table.map(({ row, pct }) => ({
    row,
    percentage: pct,
    loadKg: (maxWeightKg * pct) / 100,
  }));
}

// =============================================================================
// DESTRUCTIVE TEST THRESHOLDS
// =============================================================================

/**
 * Calculate strength thresholds for destructive testing.
 *
 * - Warning: remaining strength < 20% of original → recheck in 50h or 100 flights
 * - Reject: remaining strength < 10% of original
 *
 * Note: "< 20% of original strength" means the LINE has lost >80% of its strength.
 * The spec says: "Warning: <20% of original strength → recheck"
 * This means if measured strength < 20% of strengthNew, it's a warning.
 * If measured strength < 10% of strengthNew, it's rejected.
 */
export function calculateStrengthThresholds(
  materials: Array<{
    lineRow: string;
    cascadeLevel: number;
    strengthNew: number | null;
  }>,
): StrengthThreshold[] {
  return materials
    .filter((m) => m.strengthNew != null)
    .map((m) => ({
      lineRow: m.lineRow,
      cascadeLevel: m.cascadeLevel,
      strengthNew: m.strengthNew!,
      warningThreshold: m.strengthNew! * 0.2,
      rejectThreshold: m.strengthNew! * 0.1,
    }));
}

/**
 * Evaluate a destructive test result against thresholds.
 */
export function evaluateDestructiveTest(
  measuredStrength: number,
  originalStrength: number,
): { result: 'pass' | 'warning' | 'reject'; percentRemaining: number; detail: string } {
  const pct = (measuredStrength / originalStrength) * 100;

  if (pct < 10) {
    return {
      result: 'reject',
      percentRemaining: pct,
      detail: `${pct.toFixed(0)}% remaining — below 10% reject threshold`,
    };
  }
  if (pct < 20) {
    return {
      result: 'warning',
      percentRemaining: pct,
      detail: `${pct.toFixed(0)}% remaining — recheck in 50h or 100 flights`,
    };
  }

  return {
    result: 'pass',
    percentRemaining: pct,
    detail: `${pct.toFixed(0)}% remaining — above 20% threshold`,
  };
}

// =============================================================================
// NON-DESTRUCTIVE TEST
// =============================================================================

/**
 * Calculate non-destructive load test value for a specific row.
 * Load test = 8G × (max weight × row load percentage / number of lines in row)
 *             + 20% of line usable strength range
 *
 * Returns the load and a human-readable breakdown.
 */
export function calculateNonDestructiveLoad(
  maxWeightKg: number,
  numRows: number,
  strengthNew: number,
  linesInRow: number,
  lineRow?: string,
): number {
  const table = LOAD_TABLES[numRows];

  if (!table) return 0;

  const rowEntry = lineRow ? table.find((r) => r.row === lineRow) : table[0];
  const rowPct = rowEntry ? rowEntry.pct / 100 : 1 / numRows;

  const perLineLoad8G = (maxWeightKg * 8 * rowPct) / linesInRow;
  const strengthMargin = strengthNew * 0.2;

  return perLineLoad8G + strengthMargin;
}

/**
 * Build a breakdown string for non-destructive load calculation.
 */
export function getNonDestructiveBreakdown(
  maxWeightKg: number,
  numRows: number,
  strengthNew: number,
  linesInRow: number,
  lineRow: string,
  side: string,
): { loadDaN: number; breakdown: string } {
  const table = LOAD_TABLES[numRows];

  if (!table) return { loadDaN: 0, breakdown: 'No load table' };

  const rowEntry = table.find((r) => r.row === lineRow);
  const rowPct = rowEntry ? rowEntry.pct / 100 : 1 / numRows;

  const perLineLoad8G = (maxWeightKg * 8 * rowPct) / linesInRow;
  const strengthMargin = strengthNew * 0.2;
  const total = perLineLoad8G + strengthMargin;

  return {
    loadDaN: Math.round(total * 10) / 10,
    breakdown: `${lineRow} ${side}: test at ${total.toFixed(0)} daN (8G × ${perLineLoad8G.toFixed(1)} daN per-line + 20% of ${strengthNew} daN)`,
  };
}

// =============================================================================
// LINE TYPE GUIDANCE
// =============================================================================

export type LineMaterialType = 'vectran' | 'dyneema' | 'aramid' | 'unknown';

export function classifyLineMaterial(
  brand: string,
  materialRef: string,
): LineMaterialType {
  const combined = `${brand} ${materialRef}`.toLowerCase();

  if (combined.includes('vectran')) return 'vectran';
  if (
    combined.includes('dyneema') ||
    combined.includes('sk99') ||
    combined.includes('sk78')
  )
    return 'dyneema';
  if (
    combined.includes('aramid') ||
    combined.includes('kevlar') ||
    combined.includes('technora')
  )
    return 'aramid';

  return 'unknown';
}

export function getTestGuidance(materialType: LineMaterialType): string {
  switch (materialType) {
    case 'vectran':
      return 'Recheck every 50h or 100 flights.';
    case 'dyneema':
      return 'Generally not tested unless suspicious. Very resistant to UV degradation.';
    case 'aramid':
      return 'Full-length test recommended. Tracked per line type. Sensitive to UV.';
    default:
      return 'Unknown material — test as per manufacturer recommendations.';
  }
}
