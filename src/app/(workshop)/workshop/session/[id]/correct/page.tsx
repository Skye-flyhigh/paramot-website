import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import {
  buildLoopMatrix,
  parseLineLengthEntries,
  parseGroupMappings,
  calculateGroupDifferentials,
  summarizeGroups,
  getToleranceMm,
  computeSymmetry,
  type MeasuredLine,
} from '@/lib/workshop/trim-calculations';
import CorrectionForm from '@/components/workshop/CorrectionForm';
import TrimComparison from '@/components/workshop/TrimComparison';
import OffsetInputs from '@/components/workshop/OffsetInputs';

interface CorrectPageProps {
  params: Promise<{ id: string }>;
}

export default async function CorrectPage({ params }: CorrectPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Corrections only apply to gliders.
      </div>
    );
  }

  // Load reference data
  const gliderSize = session.gliderSizeId
    ? await findSizeById(session.gliderSizeId)
    : null;

  const numLineRows = gliderSize?.gliderModel?.numLineRows ?? 3;
  const lineRows = ['A', 'B', 'C', 'D'].slice(0, numLineRows);
  const loopGroups = ['G1', 'G2', 'G3', 'ST'];

  // Get available line rows from reference data
  let availableRows = ['A', 'B', 'C', 'D', 'K'];

  if (gliderSize) {
    const lineLengths = gliderSize.lineLengths as Array<{ row: string }> | null;

    if (Array.isArray(lineLengths)) {
      const rows = new Set(lineLengths.map((l) => l.row));
      const rowOrder = ['A', 'B', 'C', 'D', 'E', 'K'];

      availableRows = Array.from(rows).sort(
        (a, b) => rowOrder.indexOf(a) - rowOrder.indexOf(b),
      );
    }
  }

  // Split measurements by phase and side
  const initialMeasurements = session.trimMeasurements
    .filter((m) => m.phase === 'initial' && m.measuredLength != null)
    .map((m) => ({
      lineRow: m.lineRow,
      position: m.position,
      side: m.side,
      measuredLength: m.measuredLength!,
    }));

  const correctedMeasurements = session.trimMeasurements
    .filter((m) => m.phase === 'corrected' && m.measuredLength != null)
    .map((m) => ({
      lineRow: m.lineRow,
      position: m.position,
      side: m.side,
      measuredLength: m.measuredLength!,
    }));

  // COR-2: Loop matrix — initial vs. corrected
  const initialLoopsLeft = (session.initialLoopsLeft ?? {}) as Record<
    string,
    Record<string, number>
  >;
  const initialLoopsRight = (session.initialLoopsRight ?? {}) as Record<
    string,
    Record<string, number>
  >;

  const finalLoopsLeft = buildLoopMatrix(initialLoopsLeft, session.corrections);
  const finalLoopsRight = buildLoopMatrix(initialLoopsRight, session.corrections);

  const hasLoopData =
    Object.keys(initialLoopsLeft).length > 0 ||
    Object.keys(initialLoopsRight).length > 0 ||
    session.corrections.length > 0;

  // COR-5: Differential comparison (initial vs corrected)
  const tolerance = gliderSize ? getToleranceMm(gliderSize.aspectRatio) : 20;
  let initialDiffSummary: ReturnType<typeof summarizeGroups> | null = null;
  let correctedDiffSummary: ReturnType<typeof summarizeGroups> | null = null;

  if (gliderSize) {
    const refLengths = parseLineLengthEntries(gliderSize.lineLengths);
    const mappings = parseGroupMappings(gliderSize.groupMappings);

    const rightInitial = initialMeasurements
      .filter((m) => m.side === 'right')
      .map(
        ({ lineRow, position, measuredLength }): MeasuredLine => ({
          lineRow,
          position,
          measuredLength,
        }),
      );

    if (rightInitial.length > 0) {
      const initDiffs = calculateGroupDifferentials(refLengths, rightInitial, mappings);

      initialDiffSummary = summarizeGroups(initDiffs, tolerance);
    }

    const rightCorrected = correctedMeasurements
      .filter((m) => m.side === 'right')
      .map(
        ({ lineRow, position, measuredLength }): MeasuredLine => ({
          lineRow,
          position,
          measuredLength,
        }),
      );

    if (rightCorrected.length > 0) {
      const corrDiffs = calculateGroupDifferentials(refLengths, rightCorrected, mappings);

      correctedDiffSummary = summarizeGroups(corrDiffs, tolerance);
    }
  }

  // COR-7: Symmetry
  const leftInitial: MeasuredLine[] = initialMeasurements
    .filter((m) => m.side === 'left')
    .map(({ lineRow, position, measuredLength }) => ({
      lineRow,
      position,
      measuredLength,
    }));
  const rightInitialML: MeasuredLine[] = initialMeasurements
    .filter((m) => m.side === 'right')
    .map(({ lineRow, position, measuredLength }) => ({
      lineRow,
      position,
      measuredLength,
    }));

  const symmetry =
    leftInitial.length > 0 && rightInitialML.length > 0
      ? computeSymmetry(leftInitial, 'left', rightInitialML)
      : [];

  return (
    <div className="space-y-6">
      {/* COR-1: Renamed heading */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Trim Correction</h3>
        <span className="text-sm text-zinc-400">
          {session.corrections.length} correction
          {session.corrections.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* COR-3 + COR-4: Offset inputs */}
      <OffsetInputs
        sessionId={session.id}
        gliderOffset={session.gliderOffset}
        brakeOffset={session.brakeOffset}
      />

      {/* Trim deviation summary if measurements exist */}
      {session.trimMeasurements.length > 0 && (
        <TrimDeviationSummary measurements={session.trimMeasurements} />
      )}

      {/* COR-5: Before/After differential comparison */}
      {initialDiffSummary && correctedDiffSummary && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-zinc-600">
            Differential Comparison: Initial vs Corrected
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-2 text-left text-zinc-500">Group</th>
                  <th className="px-2 py-2 text-right text-zinc-500">Initial Dev.</th>
                  <th className="px-2 py-2 text-right text-zinc-500">Corrected Dev.</th>
                  <th className="px-2 py-2 text-right text-zinc-500">Delta</th>
                </tr>
              </thead>
              <tbody>
                {initialDiffSummary.map((initGroup) => {
                  const corrGroup = correctedDiffSummary!.find(
                    (g) => g.group === initGroup.group,
                  );
                  const delta = corrGroup
                    ? initGroup.maxDeviation - corrGroup.maxDeviation
                    : null;

                  return (
                    <tr key={initGroup.group} className="border-b border-zinc-50">
                      <td className="py-1.5 pr-2 font-medium text-zinc-700">
                        {initGroup.group}
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right font-mono ${
                          !initGroup.inTolerance ? 'text-amber-600' : 'text-zinc-500'
                        }`}
                      >
                        {initGroup.maxDeviation.toFixed(1)}mm
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right font-mono ${
                          corrGroup && !corrGroup.inTolerance
                            ? 'text-amber-600'
                            : 'text-zinc-500'
                        }`}
                      >
                        {corrGroup ? `${corrGroup.maxDeviation.toFixed(1)}mm` : '—'}
                      </td>
                      <td
                        className={`px-2 py-1.5 text-right font-mono font-medium ${
                          delta != null && delta > 0
                            ? 'text-green-600'
                            : delta != null && delta < 0
                              ? 'text-red-600'
                              : 'text-zinc-400'
                        }`}
                      >
                        {delta != null
                          ? `${delta > 0 ? '-' : '+'}${Math.abs(delta).toFixed(1)}mm`
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CorrectionForm
        sessionId={session.id}
        existingCorrections={session.corrections}
        lineRows={availableRows}
      />

      {/* COR-2: Loop matrix comparison */}
      {hasLoopData && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-zinc-600">
            Loop Matrix: Initial → After Corrections
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['Left', 'Right'] as const).map((side) => {
              const initial = side === 'Left' ? initialLoopsLeft : initialLoopsRight;
              const final_ = side === 'Left' ? finalLoopsLeft : finalLoopsRight;

              return (
                <div key={side}>
                  <p className="mb-1 text-xs font-medium text-zinc-500">{side}</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="py-1 pr-2 text-left text-zinc-400">Row</th>
                        {loopGroups.map((g) => (
                          <th key={g} className="px-2 py-1 text-center text-zinc-400">
                            {g}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lineRows.map((row) => (
                        <tr key={row} className="border-b border-zinc-50">
                          <td className="py-1 pr-2 font-medium text-zinc-600">{row}</td>
                          {loopGroups.map((g) => {
                            const initVal = initial[row]?.[g] ?? 0;
                            const finalVal = final_[row]?.[g] ?? 0;
                            const changed = initVal !== finalVal;

                            return (
                              <td
                                key={g}
                                className={`px-2 py-1 text-center ${
                                  changed ? 'font-medium text-sky-700' : 'text-zinc-500'
                                }`}
                              >
                                {changed ? (
                                  <>
                                    <span className="text-zinc-400">{initVal}</span>
                                    <span className="text-zinc-300"> → </span>
                                    {finalVal}
                                  </>
                                ) : (
                                  initVal
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COR-7: Symmetry table */}
      {symmetry.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-zinc-600">
            Symmetry (Left − Right)
          </h4>
          <p className="mb-2 text-xs text-zinc-400">
            Negative = left side shorter. Values in mm.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="py-1.5 pr-2 text-left text-zinc-500">Row</th>
                  <th className="px-2 py-1.5 text-left text-zinc-500">Pos</th>
                  <th className="px-2 py-1.5 text-right text-zinc-500">Diff (mm)</th>
                </tr>
              </thead>
              <tbody>
                {symmetry
                  .sort(
                    (a, b) =>
                      a.lineRow.localeCompare(b.lineRow) || a.position - b.position,
                  )
                  .map((s) => (
                    <tr
                      key={`${s.lineRow}-${s.position}`}
                      className="border-b border-zinc-50"
                    >
                      <td className="py-1 pr-2 font-medium text-zinc-700">{s.lineRow}</td>
                      <td className="px-2 py-1 text-zinc-500">{s.position}</td>
                      <td
                        className={`px-2 py-1 text-right font-mono ${
                          Math.abs(s.diff) > 15
                            ? 'text-amber-600 font-medium'
                            : 'text-zinc-500'
                        }`}
                      >
                        {s.diff > 0 ? '+' : ''}
                        {s.diff.toFixed(1)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Before/After trim comparison */}
      {gliderSize && correctedMeasurements.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Before / After Comparison
          </h4>
          <TrimComparison
            lineLengths={gliderSize.lineLengths}
            groupMappings={gliderSize.groupMappings}
            aspectRatio={gliderSize.aspectRatio}
            initialMeasurements={initialMeasurements}
            correctedMeasurements={correctedMeasurements}
          />
        </div>
      )}

      {/* Link back to trim for corrected measurements */}
      {session.corrections.length > 0 && correctedMeasurements.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
          After making corrections, go back to{' '}
          <a
            href={`/workshop/session/${session.id}/trim`}
            className="font-medium text-zinc-900 underline"
          >
            Trim Analysis
          </a>{' '}
          and enter corrected measurements (switch to &quot;Corrected&quot; phase) to
          verify the corrections worked.
        </div>
      )}
    </div>
  );
}

function TrimDeviationSummary({
  measurements,
}: {
  measurements: Array<{
    lineRow: string;
    position: number;
    side: string;
    phase: string;
    deviation: number | null;
  }>;
}) {
  const initialDeviations = measurements
    .filter((m) => m.phase === 'initial' && m.deviation !== null)
    .sort((a, b) => Math.abs(b.deviation!) - Math.abs(a.deviation!));

  const outOfTolerance = initialDeviations.filter((m) => Math.abs(m.deviation!) > 15);

  if (outOfTolerance.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h4 className="text-sm font-medium text-amber-800 mb-2">
        Lines Out of Tolerance ({outOfTolerance.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {outOfTolerance.slice(0, 10).map((m) => (
          <span
            key={`${m.lineRow}-${m.position}-${m.side}`}
            className="rounded bg-amber-100 px-2 py-1 text-xs font-mono text-amber-800"
          >
            {m.lineRow}
            {m.position} {m.side}: {m.deviation! > 0 ? '+' : ''}
            {m.deviation!.toFixed(0)}mm
          </span>
        ))}
        {outOfTolerance.length > 10 && (
          <span className="text-xs text-amber-600">
            +{outOfTolerance.length - 10} more
          </span>
        )}
      </div>
    </div>
  );
}
