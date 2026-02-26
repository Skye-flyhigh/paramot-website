'use client';

import { useMemo } from 'react';
import { ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import {
  calculateGroupDifferentials,
  summarizeGroups,
  getToleranceMm,
  parseLineLengthEntries,
  parseGroupMappings,
  type MeasuredLine,
} from '@/lib/workshop/trim-calculations';

interface TrimComparisonProps {
  lineLengths: unknown;
  groupMappings: unknown;
  aspectRatio: number | null;
  initialMeasurements: MeasuredLine[];
  correctedMeasurements: MeasuredLine[];
}

export default function TrimComparison({
  lineLengths,
  groupMappings,
  aspectRatio,
  initialMeasurements,
  correctedMeasurements,
}: TrimComparisonProps) {
  const refLengths = useMemo(() => parseLineLengthEntries(lineLengths), [lineLengths]);
  const mappings = useMemo(() => parseGroupMappings(groupMappings), [groupMappings]);
  const tolerance = getToleranceMm(aspectRatio);

  const comparison = useMemo(() => {
    if (initialMeasurements.length === 0 || correctedMeasurements.length === 0)
      return null;

    const initialDiffs = calculateGroupDifferentials(
      refLengths,
      initialMeasurements,
      mappings,
    );
    const correctedDiffs = calculateGroupDifferentials(
      refLengths,
      correctedMeasurements,
      mappings,
    );
    const initialSummaries = summarizeGroups(initialDiffs, tolerance);
    const correctedSummaries = summarizeGroups(correctedDiffs, tolerance);

    // Build comparison data
    const groups = new Map<
      string,
      {
        group: string;
        initialMax: number;
        correctedMax: number;
        initialInTol: boolean;
        correctedInTol: boolean;
        improvement: number;
      }
    >();

    for (const s of initialSummaries) {
      groups.set(s.group, {
        group: s.group,
        initialMax: s.maxDeviation,
        correctedMax: 0,
        initialInTol: s.inTolerance,
        correctedInTol: true,
        improvement: 0,
      });
    }

    for (const s of correctedSummaries) {
      const existing = groups.get(s.group);

      if (existing) {
        existing.correctedMax = s.maxDeviation;
        existing.correctedInTol = s.inTolerance;
        existing.improvement = existing.initialMax - s.maxDeviation;
      }
    }

    return Array.from(groups.values());
  }, [refLengths, initialMeasurements, correctedMeasurements, mappings, tolerance]);

  if (!comparison) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400">
        Both initial and corrected measurements are needed for comparison. Enter corrected
        measurements on the Trim Analysis page.
      </div>
    );
  }

  const allInTolerance = comparison.every((c) => c.correctedInTol);
  const improved = comparison.filter((c) => c.improvement > 0);
  const regressed = comparison.filter((c) => c.improvement < 0);

  return (
    <div className="space-y-4">
      {/* Overall status */}
      <div
        className={`rounded-lg border p-4 ${
          allInTolerance ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
        }`}
      >
        <p
          className={`font-semibold ${allInTolerance ? 'text-green-700' : 'text-amber-700'}`}
        >
          {allInTolerance
            ? 'All groups within tolerance after corrections'
            : `${comparison.filter((c) => !c.correctedInTol).length} group(s) still out of tolerance`}
        </p>
        <div className="mt-1 flex gap-4 text-sm">
          {improved.length > 0 && (
            <span className="text-green-600">{improved.length} improved</span>
          )}
          {regressed.length > 0 && (
            <span className="text-red-600">{regressed.length} regressed</span>
          )}
          <span className="text-zinc-500">
            {comparison.filter((c) => c.improvement === 0).length} unchanged
          </span>
        </div>
      </div>

      {/* Group comparison table */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50">
              <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                Group
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                Initial
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-zinc-500" />
              <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                Corrected
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                Change
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-zinc-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((c) => (
              <tr key={c.group} className="border-t border-zinc-100">
                <td className="px-3 py-2 font-mono font-bold text-zinc-700">{c.group}</td>
                <td
                  className={`px-3 py-2 text-right font-mono ${
                    c.initialInTol ? 'text-zinc-600' : 'text-red-600 font-medium'
                  }`}
                >
                  ±{c.initialMax.toFixed(0)}mm
                </td>
                <td className="px-3 py-2 text-center text-zinc-300">
                  <ArrowRight className="inline h-4 w-4" />
                </td>
                <td
                  className={`px-3 py-2 text-right font-mono ${
                    c.correctedInTol ? 'text-green-600' : 'text-red-600 font-medium'
                  }`}
                >
                  ±{c.correctedMax.toFixed(0)}mm
                </td>
                <td className="px-3 py-2 text-right">
                  {c.improvement > 0 ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <TrendingDown className="h-3 w-3" />
                      <span className="font-mono text-xs">
                        -{c.improvement.toFixed(0)}
                      </span>
                    </span>
                  ) : c.improvement < 0 ? (
                    <span className="inline-flex items-center gap-1 text-red-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="font-mono text-xs">
                        +{Math.abs(c.improvement).toFixed(0)}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Minus className="h-3 w-3" />
                      <span className="font-mono text-xs">0</span>
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {c.correctedInTol ? (
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  ) : (
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-400">
        Tolerance: ±{tolerance}mm (AR: {aspectRatio ?? 'unknown'})
      </p>
    </div>
  );
}
