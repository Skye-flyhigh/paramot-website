/**
 * Pure calculation functions for APPI trim analysis.
 * No DB or server dependencies — fully testable with Vitest.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface GroupMapping {
  [row: string]: (string | null)[]; // row -> array of group labels per position
}

export interface LineLengthMap {
  [row: string]: (number | null)[]; // row -> array of lengths per position (mm)
}

/** A single measured line value keyed by row + position */
export interface MeasuredLine {
  lineRow: string;
  position: number; // 1-indexed
  measuredLength: number;
}

/** Differential between two rows within a group */
export interface GroupDifferential {
  group: string; // e.g. "G1"
  rowA: string; // primary row (always "A")
  rowB: string; // comparison row (B, C, D)
  refDiff: number; // manufacturer reference differential (mm)
  measuredDiff: number; // measured differential (mm)
  deviation: number; // measured - ref (mm)
  positionsUsed: number; // how many line positions contributed
}

/** Summary per group across all row combinations */
export interface GroupSummary {
  group: string;
  differentials: GroupDifferential[];
  maxDeviation: number; // largest absolute deviation across all diffs
  inTolerance: boolean;
}

/** Profile shape classification */
export type ProfileShape = 'reflex' | 'accelerated' | 'stable' | 'unstable' | 'unknown';

export interface ProfileAnalysis {
  shape: ProfileShape;
  description: string;
  details: string;
}

/** Correction suggestion for a group */
export interface CorrectionSuggestion {
  group: string;
  row: string;
  direction: 'shorten' | 'lengthen';
  deviationMm: number;
  suggestedLoops: number;
  loopType: number; // 1-5 scale
  estimatedShorteningMm: number;
  positions: number[];
}

// =============================================================================
// TOLERANCE
// =============================================================================

/** APPI tolerance based on flat aspect ratio */
export function getToleranceMm(aspectRatio: number | null): number {
  if (!aspectRatio) return 20;
  if (aspectRatio <= 5) return 20;
  if (aspectRatio <= 6) return 15;
  if (aspectRatio <= 6.5) return 10;

  return 10;
}

// =============================================================================
// GROUP EXTRACTION
// =============================================================================

/**
 * Extract unique group base names (without row suffix) from group mappings.
 * e.g. "G1A" -> "G1", "STA" -> "ST"
 */
export function extractGroups(mappings: GroupMapping): string[] {
  const groups = new Set<string>();

  for (const row of Object.keys(mappings)) {
    const labels = mappings[row];

    if (!labels) continue;

    for (const label of labels) {
      if (label) {
        // Strip the row suffix (last char) to get group base
        const base = label.slice(0, -1);

        groups.add(base);
      }
    }
  }

  // Sort: G1, G2, G3... then ST
  return Array.from(groups).sort((a, b) => {
    const aIsStab = a.startsWith('ST');
    const bIsStab = b.startsWith('ST');

    if (aIsStab && !bIsStab) return 1;
    if (!aIsStab && bIsStab) return -1;

    return a.localeCompare(b, undefined, { numeric: true });
  });
}

/**
 * Get position indices (0-based) that belong to a group+row combination.
 * e.g. for group "G1", row "A", returns positions where mappings.A[i] === "G1A"
 */
export function getGroupPositions(
  mappings: GroupMapping,
  group: string,
  row: string,
): number[] {
  const labels = mappings[row];

  if (!labels) return [];

  const target = `${group}${row}`;
  const positions: number[] = [];

  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === target) {
      positions.push(i);
    }
  }

  return positions;
}

/**
 * Get rows that participate in a given group.
 * e.g. for group "G1", might return ["A", "B", "C", "D"]
 */
export function getGroupRows(mappings: GroupMapping, group: string): string[] {
  const rows: string[] = [];

  for (const row of Object.keys(mappings)) {
    const labels = mappings[row];

    if (!labels) continue;

    const target = `${group}${row}`;

    if (labels.some((l) => l === target)) {
      rows.push(row);
    }
  }

  const rowOrder = ['A', 'B', 'C', 'D', 'E', 'K'];

  return rows.sort((a, b) => rowOrder.indexOf(a) - rowOrder.indexOf(b));
}

// =============================================================================
// DIFFERENTIAL CALCULATIONS
// =============================================================================

/**
 * Compute average length for a set of positions within a row.
 * Uses reference data (LineLengthMap) where values are arrays indexed by position.
 */
function averageRefLength(
  refLengths: LineLengthMap,
  row: string,
  positions: number[],
): number | null {
  const rowLengths = refLengths[row];

  if (!rowLengths) return null;

  const valid = positions
    .map((i) => rowLengths[i])
    .filter((v): v is number => v !== null && v !== undefined);

  if (valid.length === 0) return null;

  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

/**
 * Compute average measured length for a set of positions within a row.
 * Positions here are 0-indexed (matching groupMappings array indices).
 * MeasuredLine.position is 1-indexed, so we convert.
 */
function averageMeasuredLength(
  measurements: MeasuredLine[],
  row: string,
  positions: number[],
): number | null {
  // Convert 0-based group positions to 1-based measurement positions
  const posSet = new Set(positions.map((p) => p + 1));

  const valid = measurements
    .filter((m) => m.lineRow === row && posSet.has(m.position))
    .map((m) => m.measuredLength);

  if (valid.length === 0) return null;

  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

/**
 * Calculate group differentials for all groups.
 * Compares each non-A row against A within the same group.
 *
 * Differential = mean(A positions) - mean(B positions) for the same group.
 * Positive differential means A is longer than B.
 */
export function calculateGroupDifferentials(
  refLengths: LineLengthMap,
  measurements: MeasuredLine[],
  mappings: GroupMapping,
): GroupDifferential[] {
  const groups = extractGroups(mappings);
  const results: GroupDifferential[] = [];

  for (const group of groups) {
    const rows = getGroupRows(mappings, group);
    const aRow = rows.find((r) => r === 'A');

    if (!aRow) continue;

    // Get A positions for this group
    const aPositions = getGroupPositions(mappings, group, 'A');

    if (aPositions.length === 0) continue;

    const refA = averageRefLength(refLengths, 'A', aPositions);
    const measA = averageMeasuredLength(measurements, 'A', aPositions);

    // Compare A against each other row in the group
    for (const otherRow of rows) {
      if (otherRow === 'A') continue;

      const otherPositions = getGroupPositions(mappings, group, otherRow);

      if (otherPositions.length === 0) continue;

      const refOther = averageRefLength(refLengths, otherRow, otherPositions);
      const measOther = averageMeasuredLength(measurements, otherRow, otherPositions);

      if (refA === null || refOther === null) continue;
      if (measA === null || measOther === null) continue;

      const refDiff = refA - refOther;
      const measuredDiff = measA - measOther;
      const deviation = measuredDiff - refDiff;

      results.push({
        group,
        rowA: 'A',
        rowB: otherRow,
        refDiff: Math.round(refDiff * 10) / 10,
        measuredDiff: Math.round(measuredDiff * 10) / 10,
        deviation: Math.round(deviation * 10) / 10,
        positionsUsed: Math.min(aPositions.length, otherPositions.length),
      });
    }
  }

  return results;
}

/**
 * Summarize differentials per group, computing max deviation and tolerance status.
 */
export function summarizeGroups(
  differentials: GroupDifferential[],
  toleranceMm: number,
): GroupSummary[] {
  const groupMap = new Map<string, GroupDifferential[]>();

  for (const diff of differentials) {
    const existing = groupMap.get(diff.group) ?? [];

    existing.push(diff);
    groupMap.set(diff.group, existing);
  }

  return Array.from(groupMap.entries()).map(([group, diffs]) => {
    const maxDeviation = Math.max(...diffs.map((d) => Math.abs(d.deviation)));

    return {
      group,
      differentials: diffs,
      maxDeviation,
      inTolerance: maxDeviation <= toleranceMm,
    };
  });
}

// =============================================================================
// PROFILE SHAPE DETECTION
// =============================================================================

/**
 * Detect the trim profile shape based on A-B and A-C differentials.
 *
 * Logic from business-logic-spec:
 * - Reflex: C longest relative to A (A-C differential more negative than ref)
 * - Accelerated: B/C longer than A (differentials more negative)
 * - Slowed: B/C shorter (differentials more positive)
 * - Unstable: B longer, C shorter (mixed pattern — dangerous)
 *
 * We look at the median deviation across non-stabilo groups.
 */
export function detectProfileShape(differentials: GroupDifferential[]): ProfileAnalysis {
  // Filter out stabilo groups (they don't define profile shape)
  const mainDiffs = differentials.filter((d) => !d.group.startsWith('ST'));

  if (mainDiffs.length === 0) {
    return {
      shape: 'unknown',
      description: 'Insufficient data',
      details: 'No main group differentials available.',
    };
  }

  // Separate A-B and A-C diffs
  const abDiffs = mainDiffs.filter((d) => d.rowB === 'B');
  const acDiffs = mainDiffs.filter((d) => d.rowB === 'C');

  const abMedian = median(abDiffs.map((d) => d.deviation));
  const acMedian = median(acDiffs.map((d) => d.deviation));

  // Thresholds for classification (mm)
  const SIGNIFICANT = 5; // deviation > 5mm is meaningful

  if (abMedian === null && acMedian === null) {
    return {
      shape: 'unknown',
      description: 'Insufficient data',
      details: 'No A-B or A-C differentials calculated.',
    };
  }

  const abSignificant = abMedian !== null && Math.abs(abMedian) > SIGNIFICANT;
  const acSignificant = acMedian !== null && Math.abs(acMedian) > SIGNIFICANT;

  // No significant deviations → stable (within spec)
  if (!abSignificant && !acSignificant) {
    return {
      shape: 'stable',
      description: 'Trim is within specification',
      details: `A-B deviation: ${fmt(abMedian)}mm, A-C deviation: ${fmt(acMedian)}mm. Both within ${SIGNIFICANT}mm threshold.`,
    };
  }

  // Unstable: B longer (A-B deviation negative) AND C shorter (A-C deviation positive)
  // This is the dangerous pattern
  if (
    abMedian !== null &&
    abMedian < -SIGNIFICANT &&
    acMedian !== null &&
    acMedian > SIGNIFICANT
  ) {
    return {
      shape: 'unstable',
      description: 'Unstable profile — B longer, C shorter than specification',
      details: `A-B deviation: ${fmt(abMedian)}mm (B elongated), A-C deviation: ${fmt(acMedian)}mm (C shortened). This pattern can cause pitch instability.`,
    };
  }

  // Accelerated: B and/or C longer than spec (A-B and A-C deviations negative)
  // Meaning measured diff < ref diff → the other row got longer relative to A
  if (
    (abMedian !== null && abMedian < -SIGNIFICANT) ||
    (acMedian !== null && acMedian < -SIGNIFICANT)
  ) {
    return {
      shape: 'accelerated',
      description: 'Accelerated profile — rear lines elongated',
      details: `A-B deviation: ${fmt(abMedian)}mm, A-C deviation: ${fmt(acMedian)}mm. Rear lines have stretched relative to front lines.`,
    };
  }

  // Reflex/Slowed: B and/or C shorter than spec (deviations positive)
  if (
    (abMedian !== null && abMedian > SIGNIFICANT) ||
    (acMedian !== null && acMedian > SIGNIFICANT)
  ) {
    return {
      shape: 'reflex',
      description: 'Reflex profile — rear lines shortened',
      details: `A-B deviation: ${fmt(abMedian)}mm, A-C deviation: ${fmt(acMedian)}mm. Rear lines are shorter relative to front lines.`,
    };
  }

  return {
    shape: 'unknown',
    description: 'Mixed profile',
    details: `A-B deviation: ${fmt(abMedian)}mm, A-C deviation: ${fmt(acMedian)}mm. Pattern does not clearly match a standard profile.`,
  };
}

function fmt(v: number | null): string {
  if (v === null) return 'N/A';

  return v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1);
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

// =============================================================================
// CORRECTION SUGGESTIONS
// =============================================================================

/** Loop type shortening estimates (mm) — from business-logic-spec */
const LOOP_SHORTENING: Record<number, number> = {
  1: 10, // simple loop
  2: 15, // lark's foot
  3: 25, // lark's foot + maillon loop
  4: 35, // lark's foot + extra upper loop
  5: 45, // lark's foot + maillon + upper loop
};

/**
 * Suggest corrections based on group differentials.
 *
 * When a group's A-B differential deviates beyond tolerance, we suggest
 * shortening or lengthening the appropriate row to bring it back.
 *
 * Positive deviation (measured diff > ref diff) → row B is too short → shorten A or lengthen B
 * In practice: we shorten by adding loops. So if B is too short relative to A,
 * we add loops on A to shorten it. If B is too long, add loops on B.
 */
export function suggestCorrections(
  differentials: GroupDifferential[],
  mappings: GroupMapping,
  toleranceMm: number,
): CorrectionSuggestion[] {
  const suggestions: CorrectionSuggestion[] = [];

  for (const diff of differentials) {
    const absDeviation = Math.abs(diff.deviation);

    if (absDeviation <= toleranceMm) continue;

    // Determine which row to correct and direction
    // Positive deviation: measured A-B > ref A-B → B has shortened → shorten A (or lengthen B if possible)
    // Negative deviation: measured A-B < ref A-B → B has elongated → shorten B
    const targetRow = diff.deviation > 0 ? diff.rowA : diff.rowB;
    const direction = 'shorten' as const; // We always shorten via loops

    // Find best loop type
    const { loopType, loops, shortening } = selectLoopCorrection(absDeviation);

    // Get the positions that need correction
    const positions = getGroupPositions(mappings, diff.group, targetRow);

    suggestions.push({
      group: diff.group,
      row: targetRow,
      direction,
      deviationMm: diff.deviation,
      suggestedLoops: loops,
      loopType,
      estimatedShorteningMm: shortening,
      positions: positions.map((p) => p + 1), // convert to 1-indexed
    });
  }

  return suggestions;
}

/**
 * Select the most appropriate loop type and count to achieve a target shortening.
 * Prefers fewer, larger corrections over many small ones.
 */
function selectLoopCorrection(targetMm: number): {
  loopType: number;
  loops: number;
  shortening: number;
} {
  // Try each loop type from largest to smallest
  for (const type of [5, 4, 3, 2, 1]) {
    const perLoop = LOOP_SHORTENING[type];

    if (perLoop <= targetMm) {
      const loops = Math.round(targetMm / perLoop);

      return { loopType: type, loops: Math.max(1, loops), shortening: loops * perLoop };
    }
  }

  // Default: single simple loop
  return { loopType: 1, loops: 1, shortening: LOOP_SHORTENING[1] };
}

// =============================================================================
// CONVERSION HELPERS
// =============================================================================

/**
 * Convert reference data from the DB/JSON format (array per row) to LineLengthMap.
 * The ACT parser outputs: { "A": [6425, 6395, ...], "B": [...] }
 */
export function parseRefLengths(raw: unknown): LineLengthMap {
  if (!raw || typeof raw !== 'object') return {};

  const result: LineLengthMap = {};
  const obj = raw as Record<string, unknown>;

  for (const [row, lengths] of Object.entries(obj)) {
    if (Array.isArray(lengths)) {
      result[row] = lengths.map((v) => (typeof v === 'number' ? v : null));
    }
  }

  return result;
}

/**
 * Convert reference data from the DB lineLengths format (flat array of entries)
 * to LineLengthMap. The seed script stores it as:
 * [{ lineId, row, position, cascade, lengthMm }, ...]
 */
export function parseLineLengthEntries(raw: unknown): LineLengthMap {
  if (!Array.isArray(raw)) return {};

  const entries = raw as Array<{
    row: string;
    position: number;
    cascade: number;
    lengthMm: number;
  }>;

  // Only use cascade 1 (primary cascade)
  const cascade1 = entries.filter((e) => e.cascade === 1);

  // Find max position per row
  const maxPos = new Map<string, number>();

  for (const e of cascade1) {
    const current = maxPos.get(e.row) ?? 0;

    if (e.position > current) maxPos.set(e.row, e.position);
  }

  const result: LineLengthMap = {};

  for (const [row, max] of maxPos.entries()) {
    // Initialize array with nulls
    result[row] = new Array(max).fill(null);

    for (const e of cascade1.filter((x) => x.row === row)) {
      // position is 1-indexed in DB, convert to 0-indexed for array
      result[row][e.position - 1] = e.lengthMm;
    }
  }

  return result;
}

/**
 * Parse group mappings from raw JSON.
 * ACT parser format: { "A": ["G1A", "G1A", ...], "B": [...] }
 */
export function parseGroupMappings(raw: unknown): GroupMapping {
  if (!raw || typeof raw !== 'object') return {};

  const result: GroupMapping = {};
  const obj = raw as Record<string, unknown>;

  for (const [row, mappings] of Object.entries(obj)) {
    if (Array.isArray(mappings)) {
      result[row] = mappings.map((v) => (typeof v === 'string' ? v : null));
    }
  }

  return result;
}
