'use client';

import { useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  calculateGroupDifferentials,
  summarizeGroups,
  detectProfileShape,
  suggestCorrections,
  parseLineLengthEntries,
  parseGroupMappings,
  getToleranceMm,
  type MeasuredLine,
  type ProfileShape,
} from '@/lib/workshop/trim-calculations';

interface TrimAnalysisProps {
  lineLengths: unknown; // GliderSize.lineLengths JSON
  groupMappings: unknown; // GliderSize.groupMappings JSON
  aspectRatio: number | null;
  measurements: MeasuredLine[];
}

const PROFILE_CONFIG: Record<
  ProfileShape,
  { color: string; bg: string; border: string; icon: typeof Activity }
> = {
  stable: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
  },
  reflex: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: TrendingUp,
  },
  accelerated: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: TrendingDown,
  },
  unstable: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertTriangle,
  },
  unknown: {
    color: 'text-zinc-700',
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    icon: Activity,
  },
};

export default function TrimAnalysis({
  lineLengths,
  groupMappings,
  aspectRatio,
  measurements,
}: TrimAnalysisProps) {
  const refLengths = useMemo(() => parseLineLengthEntries(lineLengths), [lineLengths]);
  const mappings = useMemo(() => parseGroupMappings(groupMappings), [groupMappings]);
  const tolerance = getToleranceMm(aspectRatio);

  const analysis = useMemo(() => {
    if (measurements.length === 0 || Object.keys(mappings).length === 0) return null;

    const differentials = calculateGroupDifferentials(refLengths, measurements, mappings);
    const summaries = summarizeGroups(differentials, tolerance);
    const profile = detectProfileShape(differentials);
    const corrections = suggestCorrections(differentials, mappings, tolerance);

    return { differentials, summaries, profile, corrections };
  }, [refLengths, measurements, mappings, tolerance]);

  if (!analysis || analysis.differentials.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-400">
        Enter measurements above to see group differential analysis.
      </div>
    );
  }

  const { summaries, profile, corrections } = analysis;
  const profileCfg = PROFILE_CONFIG[profile.shape];
  const ProfileIcon = profileCfg.icon;
  const outOfTolerance = summaries.filter((s) => !s.inTolerance);

  return (
    <div className="space-y-4">
      {/* Profile Shape */}
      <div className={`rounded-lg border p-4 ${profileCfg.bg} ${profileCfg.border}`}>
        <div className="flex items-center gap-2">
          <ProfileIcon className={`h-5 w-5 ${profileCfg.color}`} />
          <h4 className={`font-semibold ${profileCfg.color}`}>
            {profile.shape.charAt(0).toUpperCase() + profile.shape.slice(1)} Profile
          </h4>
        </div>
        <p className={`mt-1 text-sm ${profileCfg.color}`}>{profile.description}</p>
        <p className="mt-1 text-xs text-zinc-500">{profile.details}</p>
      </div>

      {/* Group Differential Table */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Group Differentials
        </h4>
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50">
                <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                  Group
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">
                  Comparison
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Ref Diff
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Measured
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">
                  Deviation
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-zinc-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) =>
                summary.differentials.map((diff, idx) => (
                  <tr
                    key={`${diff.group}-${diff.rowB}`}
                    className={`border-t border-zinc-100 ${
                      Math.abs(diff.deviation) > tolerance ? 'bg-red-50/50' : ''
                    }`}
                  >
                    {idx === 0 && (
                      <td
                        className="px-3 py-2 font-mono font-bold text-zinc-700"
                        rowSpan={summary.differentials.length}
                      >
                        {diff.group}
                      </td>
                    )}
                    <td className="px-3 py-2 font-mono text-zinc-600">
                      {diff.rowA}–{diff.rowB}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-zinc-500">
                      {diff.refDiff.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-zinc-700">
                      {diff.measuredDiff.toFixed(1)}
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-mono font-medium ${deviationColor(diff.deviation, tolerance)}`}
                    >
                      {diff.deviation > 0 ? '+' : ''}
                      {diff.deviation.toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {Math.abs(diff.deviation) <= tolerance ? (
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                      ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Tolerance: ±{tolerance}mm (AR: {aspectRatio ?? 'unknown'})
        </p>
      </div>

      {/* Out of tolerance summary */}
      {outOfTolerance.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h4 className="text-sm font-semibold text-red-700">
              {outOfTolerance.length} group{outOfTolerance.length > 1 ? 's' : ''} out of
              tolerance
            </h4>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {outOfTolerance.map((s) => (
              <span
                key={s.group}
                className="rounded bg-red-100 px-2 py-1 font-mono text-xs font-medium text-red-800"
              >
                {s.group}: ±{s.maxDeviation.toFixed(0)}mm
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Correction Suggestions */}
      {corrections.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Suggested Corrections
          </h4>
          <div className="space-y-2">
            {corrections.map((s, i) => (
              <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-zinc-700">
                      {s.group} – Row {s.row}
                    </span>
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                      {s.direction}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">
                    deviation: {s.deviationMm > 0 ? '+' : ''}
                    {s.deviationMm.toFixed(1)}mm
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  Add <strong>{s.suggestedLoops}</strong> loop
                  {s.suggestedLoops > 1 ? 's' : ''} (type {s.loopType}) on positions{' '}
                  {s.positions.join(', ')} — est. shortening: {s.estimatedShorteningMm}mm
                </p>
                {s.loopType >= 3 && (
                  <p className="mt-1 text-xs text-amber-600">
                    Complex loop type — shortening estimate is approximate for soft-link
                    connections.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function deviationColor(dev: number, tolerance: number): string {
  const abs = Math.abs(dev);

  if (abs <= tolerance * 0.5) return 'text-green-600';
  if (abs <= tolerance) return 'text-amber-600';

  return 'text-red-600';
}
