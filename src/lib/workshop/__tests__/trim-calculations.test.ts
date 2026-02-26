import { describe, it, expect } from 'vitest';
import {
  extractGroups,
  getGroupPositions,
  getGroupRows,
  calculateGroupDifferentials,
  summarizeGroups,
  detectProfileShape,
  suggestCorrections,
  getToleranceMm,
  parseRefLengths,
  parseGroupMappings,
  parseLineLengthEntries,
  type LineLengthMap,
  type GroupMapping,
  type MeasuredLine,
} from '../trim-calculations';

// =============================================================================
// FIXTURES — Skyman Rock 2 XS reference data
// =============================================================================

const ROCK2_REF: LineLengthMap = {
  A: [
    6425, 6395, 6385, 6400, 6380, 6360, 6355, 6370, 6360, 6310, 6275, 6210, 6230, 5910,
    5775,
  ],
  B: [
    6345, 6315, 6305, 6325, 6310, 6295, 6295, 6315, 6310, 6270, 6235, 6180, 6205, 5870,
    5770,
  ],
  C: [
    6470, 6435, 6425, 6445, 6420, 6400, 6395, 6415, 6385, 6335, 6295, 6235, 6245, 5920,
    5800,
  ],
  D: [
    6590,
    6555,
    6540,
    6555,
    6530,
    6505,
    6495,
    6500,
    6470,
    6405,
    6365,
    6290,
    6285,
    null,
    5880,
  ],
  K: [
    6895,
    6650,
    6495,
    null,
    6420,
    6285,
    6290,
    null,
    6220,
    6110,
    6145,
    null,
    6045,
    6045,
    6100,
  ],
};

const ROCK2_GROUPS: GroupMapping = {
  A: [
    'G1A',
    'G1A',
    'G1A',
    'G1A',
    'G2A',
    'G2A',
    'G2A',
    'G2A',
    'G3A',
    'G3A',
    'G3A',
    'G3A',
    'G3A',
    'STA',
    'STA',
  ],
  B: [
    'G1B',
    'G1B',
    'G1B',
    'G1B',
    'G2B',
    'G2B',
    'G2B',
    'G2B',
    'G3B',
    'G3B',
    'G3B',
    'G3B',
    'G3B',
    'STB',
    'STB',
  ],
  C: [
    'G1C',
    'G1C',
    'G1C',
    'G1C',
    'G2C',
    'G2C',
    'G2C',
    'G2C',
    'G3C',
    'G3C',
    'G3C',
    'G3C',
    'G3C',
    'STC',
    'STC',
  ],
  D: [
    'G1C',
    'G1C',
    'G1C',
    'G1C',
    'G2C',
    'G2C',
    'G2C',
    'G2C',
    'G3C',
    'G3C',
    'G3C',
    'G3C',
    'G3C',
    null,
    'STC',
  ],
  K: [
    'G1K',
    'G1K',
    'G1K',
    null,
    'G2K',
    'G2K',
    'G2K',
    null,
    'G3K',
    'G3K',
    'G3K',
    null,
    'G4K',
    'G4K',
    'G4K',
  ],
};

/** Create measured lines matching reference (perfect trim) */
function perfectMeasurements(): MeasuredLine[] {
  const measurements: MeasuredLine[] = [];

  for (const [row, lengths] of Object.entries(ROCK2_REF)) {
    for (let i = 0; i < lengths.length; i++) {
      const val = lengths[i];

      if (val !== null) {
        measurements.push({ lineRow: row, position: i + 1, measuredLength: val });
      }
    }
  }

  return measurements;
}

/** Create measurements with B row elongated by deltaMm */
function elongatedBMeasurements(deltaMm: number): MeasuredLine[] {
  const measurements = perfectMeasurements();

  return measurements.map((m) =>
    m.lineRow === 'B' ? { ...m, measuredLength: m.measuredLength + deltaMm } : m,
  );
}

/** Create measurements with C row shortened by deltaMm */
function shortenedCMeasurements(deltaMm: number): MeasuredLine[] {
  const measurements = perfectMeasurements();

  return measurements.map((m) =>
    m.lineRow === 'C' ? { ...m, measuredLength: m.measuredLength - deltaMm } : m,
  );
}

// =============================================================================
// TESTS
// =============================================================================

describe('extractGroups', () => {
  it('extracts unique group base names from Rock 2 XS', () => {
    const groups = extractGroups(ROCK2_GROUPS);

    expect(groups).toEqual(['G1', 'G2', 'G3', 'G4', 'ST']);
  });

  it('returns empty for empty mappings', () => {
    expect(extractGroups({})).toEqual([]);
  });
});

describe('getGroupPositions', () => {
  it('returns correct positions for G1, row A', () => {
    // G1A is at positions 0,1,2,3 (0-indexed)
    const positions = getGroupPositions(ROCK2_GROUPS, 'G1', 'A');

    expect(positions).toEqual([0, 1, 2, 3]);
  });

  it('returns correct positions for G3, row B', () => {
    // G3B is at positions 8,9,10,11,12 (0-indexed)
    const positions = getGroupPositions(ROCK2_GROUPS, 'G3', 'B');

    expect(positions).toEqual([8, 9, 10, 11, 12]);
  });

  it('returns correct positions for ST, row A', () => {
    // STA is at positions 13,14 (0-indexed)
    const positions = getGroupPositions(ROCK2_GROUPS, 'ST', 'A');

    expect(positions).toEqual([13, 14]);
  });

  it('returns empty for non-existent group+row', () => {
    expect(getGroupPositions(ROCK2_GROUPS, 'G4', 'A')).toEqual([]);
  });
});

describe('getGroupRows', () => {
  it('returns rows participating in G1', () => {
    const rows = getGroupRows(ROCK2_GROUPS, 'G1');

    // G1 has A, B, C, D (D maps to G1C), K
    expect(rows).toContain('A');
    expect(rows).toContain('B');
    expect(rows).toContain('C');
    expect(rows).toContain('K');
  });

  it('returns rows for ST group', () => {
    const rows = getGroupRows(ROCK2_GROUPS, 'ST');

    expect(rows).toContain('A');
    expect(rows).toContain('B');
    expect(rows).toContain('C');
    // D row's stabilo positions map to STC (C's cascade), not STD
    // So D does NOT appear as a separate ST row
    expect(rows).not.toContain('D');
  });
});

describe('getToleranceMm', () => {
  it('returns 20mm for AR <= 5', () => {
    expect(getToleranceMm(4.5)).toBe(20);
    expect(getToleranceMm(5)).toBe(20);
  });

  it('returns 15mm for AR <= 6', () => {
    expect(getToleranceMm(5.5)).toBe(15);
    expect(getToleranceMm(6)).toBe(15);
  });

  it('returns 10mm for AR > 6', () => {
    expect(getToleranceMm(6.5)).toBe(10);
    expect(getToleranceMm(7)).toBe(10);
  });

  it('returns 20mm for null AR', () => {
    expect(getToleranceMm(null)).toBe(20);
  });
});

describe('calculateGroupDifferentials', () => {
  it('returns zero deviations for perfect measurements', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      perfectMeasurements(),
      ROCK2_GROUPS,
    );

    expect(diffs.length).toBeGreaterThan(0);

    for (const diff of diffs) {
      expect(diff.deviation).toBeCloseTo(0, 0);
    }
  });

  it('detects positive deviation when B elongates', () => {
    // If B gets 20mm longer, A-B differential should decrease by 20mm
    // deviation = measuredDiff - refDiff = (refDiff - 20) - refDiff = -20
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      elongatedBMeasurements(20),
      ROCK2_GROUPS,
    );

    const abDiffs = diffs.filter((d) => d.rowB === 'B');

    expect(abDiffs.length).toBeGreaterThan(0);

    for (const diff of abDiffs) {
      expect(diff.deviation).toBeCloseTo(-20, 0);
    }
  });

  it('computes differential for all expected groups', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      perfectMeasurements(),
      ROCK2_GROUPS,
    );

    const groups = new Set(diffs.map((d) => d.group));

    // Should have G1, G2, G3, ST at minimum
    expect(groups.has('G1')).toBe(true);
    expect(groups.has('G2')).toBe(true);
    expect(groups.has('G3')).toBe(true);
    expect(groups.has('ST')).toBe(true);
  });
});

describe('summarizeGroups', () => {
  it('all groups in tolerance for perfect measurements', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      perfectMeasurements(),
      ROCK2_GROUPS,
    );
    const summaries = summarizeGroups(diffs, 20);

    for (const summary of summaries) {
      expect(summary.inTolerance).toBe(true);
      expect(summary.maxDeviation).toBeCloseTo(0, 0);
    }
  });

  it('detects out-of-tolerance groups', () => {
    // B elongated by 25mm should be out of 20mm tolerance
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      elongatedBMeasurements(25),
      ROCK2_GROUPS,
    );
    const summaries = summarizeGroups(diffs, 20);

    const outOfTolerance = summaries.filter((s) => !s.inTolerance);

    expect(outOfTolerance.length).toBeGreaterThan(0);
  });
});

describe('detectProfileShape', () => {
  it('detects stable profile for perfect measurements', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      perfectMeasurements(),
      ROCK2_GROUPS,
    );
    const profile = detectProfileShape(diffs);

    expect(profile.shape).toBe('stable');
  });

  it('detects accelerated profile when B elongates', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      elongatedBMeasurements(15),
      ROCK2_GROUPS,
    );
    const profile = detectProfileShape(diffs);

    expect(profile.shape).toBe('accelerated');
  });

  it('detects unstable profile when B elongates and C shortens', () => {
    // Both B longer AND C shorter
    let measurements = perfectMeasurements();

    measurements = measurements.map((m) => {
      if (m.lineRow === 'B') return { ...m, measuredLength: m.measuredLength + 15 };
      if (m.lineRow === 'C') return { ...m, measuredLength: m.measuredLength - 15 };

      return m;
    });

    const diffs = calculateGroupDifferentials(ROCK2_REF, measurements, ROCK2_GROUPS);
    const profile = detectProfileShape(diffs);

    expect(profile.shape).toBe('unstable');
  });

  it('detects reflex profile when C shortens', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      shortenedCMeasurements(15),
      ROCK2_GROUPS,
    );
    const profile = detectProfileShape(diffs);

    expect(profile.shape).toBe('reflex');
  });
});

describe('suggestCorrections', () => {
  it('returns no suggestions for perfect measurements', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      perfectMeasurements(),
      ROCK2_GROUPS,
    );
    const suggestions = suggestCorrections(diffs, ROCK2_GROUPS, 20);

    expect(suggestions).toHaveLength(0);
  });

  it('suggests corrections when B is 25mm out', () => {
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      elongatedBMeasurements(25),
      ROCK2_GROUPS,
    );
    const suggestions = suggestCorrections(diffs, ROCK2_GROUPS, 20);

    expect(suggestions.length).toBeGreaterThan(0);

    for (const s of suggestions) {
      expect(s.suggestedLoops).toBeGreaterThanOrEqual(1);
      expect(s.estimatedShorteningMm).toBeGreaterThan(0);
    }
  });

  it('targets correct row for positive deviation', () => {
    // B elongated → deviation negative → should target B for shortening
    const diffs = calculateGroupDifferentials(
      ROCK2_REF,
      elongatedBMeasurements(25),
      ROCK2_GROUPS,
    );
    const suggestions = suggestCorrections(diffs, ROCK2_GROUPS, 20);

    const bSuggestions = suggestions.filter((s) => s.row === 'B');

    expect(bSuggestions.length).toBeGreaterThan(0);
  });
});

describe('parseRefLengths', () => {
  it('parses ACT parser format correctly', () => {
    const raw = { A: [100, 200, null], B: [150, 250, 350] };
    const result = parseRefLengths(raw);

    expect(result.A).toEqual([100, 200, null]);
    expect(result.B).toEqual([150, 250, 350]);
  });

  it('handles null/undefined gracefully', () => {
    expect(parseRefLengths(null)).toEqual({});
    expect(parseRefLengths(undefined)).toEqual({});
  });
});

describe('parseLineLengthEntries', () => {
  it('converts flat entry format to LineLengthMap', () => {
    const entries = [
      { row: 'A', position: 1, cascade: 1, lengthMm: 6425 },
      { row: 'A', position: 2, cascade: 1, lengthMm: 6395 },
      { row: 'A', position: 1, cascade: 2, lengthMm: 3200 }, // cascade 2 should be ignored
      { row: 'B', position: 1, cascade: 1, lengthMm: 6345 },
    ];

    const result = parseLineLengthEntries(entries);

    expect(result.A).toEqual([6425, 6395]);
    expect(result.B).toEqual([6345]);
  });
});

describe('parseGroupMappings', () => {
  it('parses ACT parser format', () => {
    const raw = { A: ['G1A', 'G2A', null] };
    const result = parseGroupMappings(raw);

    expect(result.A).toEqual(['G1A', 'G2A', null]);
  });
});
