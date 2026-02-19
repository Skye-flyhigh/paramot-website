import { notFound } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

import { PrintButton } from '@/components/workshop/PrintButton';
import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import {
  summarizeClothTests,
  evaluatePorosity,
  evaluateTearResistance,
} from '@/lib/workshop/cloth-calculations';
import {
  calculateGroupDifferentials,
  summarizeGroups,
  detectProfileShape,
  parseLineLengthEntries,
  parseGroupMappings,
  getToleranceMm,
} from '@/lib/workshop/trim-calculations';

interface ReportViewProps {
  params: Promise<{ id: string }>;
}

export default async function ReportViewPage({ params }: ReportViewProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();
  if (!session.report) notFound();

  const report = session.report;
  const isGlider = session.equipmentType === 'GLIDER';

  // Load reference data for trim analysis
  const gliderSize =
    isGlider && session.gliderSizeId ? await findSizeById(session.gliderSizeId) : null;

  // Compute trim analysis
  let trimAnalysis = null;

  if (gliderSize && session.trimMeasurements.length > 0) {
    const refLengths = parseLineLengthEntries(gliderSize.lineLengths);
    const mappings = parseGroupMappings(gliderSize.groupMappings);
    const tolerance = getToleranceMm(gliderSize.aspectRatio);

    const initialMeasurements = session.trimMeasurements
      .filter((m) => m.phase === 'initial' && m.measuredLength != null)
      .map((m) => ({
        lineRow: m.lineRow,
        position: m.position,
        measuredLength: m.measuredLength!,
      }));

    if (initialMeasurements.length > 0) {
      const diffs = calculateGroupDifferentials(
        refLengths,
        initialMeasurements,
        mappings,
      );
      const summaries = summarizeGroups(diffs, tolerance);
      const profile = detectProfileShape(diffs);

      trimAnalysis = { summaries, profile, tolerance };
    }
  }

  // Compute cloth summary
  const clothSummary =
    session.clothTests.length > 0 ? summarizeClothTests(session.clothTests) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-8 print:space-y-6">
      {/* Print button — hidden in print */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-bold text-zinc-900">Service Report</h2>
        <PrintButton />
      </div>

      {/* Header */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 print:border-none print:p-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 print:text-3xl">
              paraMOT Service Report
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {session.equipmentType} ·{' '}
              {new Date(session.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          {/* Airworthiness badge */}
          <div
            className={`rounded-lg border-2 p-4 text-center ${
              report.airworthy
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50'
            }`}
          >
            {report.airworthy ? (
              <CheckCircle className="mx-auto h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="mx-auto h-8 w-8 text-red-600" />
            )}
            <p
              className={`mt-1 text-sm font-bold ${
                report.airworthy ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {report.airworthy ? 'AIRWORTHY' : 'NOT AIRWORTHY'}
            </p>
          </div>
        </div>

        {/* Equipment info */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
          <InfoField
            label="Equipment"
            value={`${session.equipment?.manufacturer ?? ''} ${session.equipment?.model ?? ''}`}
          />
          <InfoField label="Size" value={session.equipment?.size ?? '—'} />
          <InfoField
            label="Serial Number"
            value={session.equipment?.serialNumber ?? '—'}
          />
          {session.statedHours != null && (
            <InfoField label="Stated Hours" value={`${session.statedHours}h`} />
          )}
          <InfoField label="Technician" value={session.technician} />
          <InfoField label="Session ID" value={session.id.slice(0, 8)} />
        </div>
      </div>

      {/* Visual Diagnosis */}
      {session.diagnosis && (
        <ReportSection title="Visual Diagnosis">
          <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2">
            {session.diagnosis.linesetCondition && (
              <ConditionField
                label="Lineset"
                value={session.diagnosis.linesetCondition}
              />
            )}
            {session.diagnosis.risersCondition && (
              <ConditionField label="Risers" value={session.diagnosis.risersCondition} />
            )}
            {session.diagnosis.canopyCondition && (
              <ConditionField label="Canopy" value={session.diagnosis.canopyCondition} />
            )}
            {session.diagnosis.clothCondition && (
              <ConditionField label="Cloth" value={session.diagnosis.clothCondition} />
            )}
          </div>
          {session.diagnosis.linesetNotes && (
            <p className="mt-2 text-sm text-zinc-600">
              Lineset: {session.diagnosis.linesetNotes}
            </p>
          )}
          {session.diagnosis.canopyNotes && (
            <p className="text-sm text-zinc-600">
              Canopy: {session.diagnosis.canopyNotes}
            </p>
          )}
        </ReportSection>
      )}

      {/* Cloth Test Results */}
      {clothSummary && (
        <ReportSection title="Cloth Assessment">
          <div
            className={`rounded-lg border p-3 ${
              clothSummary.overallResult === 'fail'
                ? 'border-red-200 bg-red-50'
                : clothSummary.overallResult === 'warning'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
            }`}
          >
            <p
              className={`font-semibold ${
                clothSummary.overallResult === 'fail'
                  ? 'text-red-700'
                  : clothSummary.overallResult === 'warning'
                    ? 'text-amber-700'
                    : 'text-green-700'
              }`}
            >
              {clothSummary.overallResult === 'fail'
                ? 'Cloth Failure'
                : clothSummary.overallResult === 'warning'
                  ? 'Cloth Warning'
                  : 'Cloth OK'}
              {' — '}
              {clothSummary.passCount} pass, {clothSummary.warningCount} warning,{' '}
              {clothSummary.failCount} fail
            </p>
          </div>

          {session.clothTests.length > 0 && (
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-medium text-zinc-500">
                  <th className="pb-1">Surface</th>
                  <th className="pb-1">Zone</th>
                  <th className="pb-1">Porosity</th>
                  <th className="pb-1">Tear</th>
                  <th className="pb-1">Result</th>
                </tr>
              </thead>
              <tbody>
                {session.clothTests.map((test) => {
                  const pEval =
                    test.porosityValue != null && test.porosityMethod
                      ? evaluatePorosity(test.porosityValue, test.porosityMethod)
                      : null;
                  const tEval =
                    test.tearResistance != null
                      ? evaluateTearResistance(test.tearResistance)
                      : null;

                  return (
                    <tr key={test.id} className="border-b border-zinc-100">
                      <td className="py-1 text-zinc-700">{test.surface}</td>
                      <td className="py-1 text-zinc-500">{test.panelZone ?? '—'}</td>
                      <td className="py-1">
                        {pEval ? (
                          <span
                            className={
                              pEval.result !== 'pass' ? 'text-amber-600' : 'text-zinc-600'
                            }
                          >
                            {test.porosityValue} ({test.porosityMethod})
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-1">
                        {tEval ? (
                          <span
                            className={
                              tEval.result === 'fail'
                                ? 'text-red-600 font-medium'
                                : 'text-zinc-600'
                            }
                          >
                            {test.tearResistance}g
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-1">
                        <ResultBadge result={test.result} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </ReportSection>
      )}

      {/* Trim Analysis */}
      {trimAnalysis && (
        <ReportSection title="Trim Analysis">
          <div
            className={`rounded-lg border p-3 ${
              trimAnalysis.profile.shape === 'stable'
                ? 'border-green-200 bg-green-50'
                : trimAnalysis.profile.shape === 'unstable'
                  ? 'border-red-200 bg-red-50'
                  : 'border-amber-200 bg-amber-50'
            }`}
          >
            <p
              className={`font-semibold ${
                trimAnalysis.profile.shape === 'stable'
                  ? 'text-green-700'
                  : trimAnalysis.profile.shape === 'unstable'
                    ? 'text-red-700'
                    : 'text-amber-700'
              }`}
            >
              {trimAnalysis.profile.shape.charAt(0).toUpperCase() +
                trimAnalysis.profile.shape.slice(1)}{' '}
              Profile
            </p>
            <p className="text-sm text-zinc-600">{trimAnalysis.profile.description}</p>
          </div>

          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-zinc-500">
                <th className="pb-1">Group</th>
                <th className="pb-1">Comparison</th>
                <th className="pb-1 text-right">Ref</th>
                <th className="pb-1 text-right">Measured</th>
                <th className="pb-1 text-right">Deviation</th>
                <th className="pb-1 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {trimAnalysis.summaries.flatMap((s) =>
                s.differentials.map((d) => (
                  <tr key={`${d.group}-${d.rowB}`} className="border-b border-zinc-100">
                    <td className="py-1 font-mono font-medium">{d.group}</td>
                    <td className="py-1 font-mono">
                      {d.rowA}–{d.rowB}
                    </td>
                    <td className="py-1 text-right font-mono text-zinc-500">
                      {d.refDiff.toFixed(1)}
                    </td>
                    <td className="py-1 text-right font-mono">
                      {d.measuredDiff.toFixed(1)}
                    </td>
                    <td
                      className={`py-1 text-right font-mono font-medium ${
                        Math.abs(d.deviation) > trimAnalysis.tolerance
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {d.deviation > 0 ? '+' : ''}
                      {d.deviation.toFixed(1)}
                    </td>
                    <td className="py-1 text-center">
                      {Math.abs(d.deviation) <= trimAnalysis.tolerance ? '✓' : '✗'}
                    </td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
          <p className="mt-1 text-xs text-zinc-400">
            Tolerance: ±{trimAnalysis.tolerance}mm
          </p>
        </ReportSection>
      )}

      {/* Corrections */}
      {session.corrections.length > 0 && (
        <ReportSection title={`Corrections Applied (${session.corrections.length})`}>
          <div className="space-y-2">
            {session.corrections.map((c) => (
              <div key={c.id} className="flex items-center gap-3 text-sm">
                <span className="font-mono font-medium text-zinc-700">
                  {c.lineRow}
                  {c.position} {c.side}
                </span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {c.correctionType?.replace(/_/g, ' ')}
                </span>
                {c.loopsBefore != null && c.loopsAfter != null && (
                  <span className="text-xs text-zinc-500">
                    Loops: {c.loopsBefore} → {c.loopsAfter}
                  </span>
                )}
                {c.shorteningMm != null && (
                  <span className="text-xs text-zinc-500">{c.shorteningMm}mm</span>
                )}
              </div>
            ))}
          </div>
        </ReportSection>
      )}

      {/* Canopy Repair */}
      {report.canopyRepaired && (
        <ReportSection title="Canopy Repair">
          <p className="text-sm text-zinc-700">Canopy was repaired during service.</p>
          {report.canopyRepairNotes && (
            <p className="text-sm text-zinc-500">{report.canopyRepairNotes}</p>
          )}
        </ReportSection>
      )}

      {/* Additional Jobs */}
      {report.additionalJobs && (
        <ReportSection title="Additional Work">
          <p className="text-sm text-zinc-700">{report.additionalJobs}</p>
        </ReportSection>
      )}

      {/* Technician Opinion */}
      {report.technicianOpinion && (
        <ReportSection title="Technician Opinion">
          <p className="text-sm text-zinc-700">{report.technicianOpinion}</p>
        </ReportSection>
      )}

      {/* Next Control */}
      <ReportSection title="Next Control">
        <div className="flex gap-6">
          {report.nextControlHours != null && (
            <div>
              <p className="text-xs font-medium text-zinc-400">Hours</p>
              <p className="text-lg font-semibold text-zinc-900">
                {report.nextControlHours}h
              </p>
            </div>
          )}
          {report.nextControlMonths != null && (
            <div>
              <p className="text-xs font-medium text-zinc-400">Months</p>
              <p className="text-lg font-semibold text-zinc-900">
                {report.nextControlMonths}m
              </p>
            </div>
          )}
        </div>
      </ReportSection>

      {/* Signature */}
      {report.technicianSignature && (
        <div className="border-t border-zinc-200 pt-4 print:mt-8">
          <p className="text-sm text-zinc-500">
            Signed by{' '}
            <span className="font-medium text-zinc-900">
              {report.technicianSignature}
            </span>
            {report.signedAt && (
              <>
                {' '}
                on{' '}
                {new Date(report.signedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </>
            )}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-zinc-100 pt-4 text-center text-xs text-zinc-400 print:mt-8">
        <p>Generated by paraMOT Workshop · APPI-certified inspection</p>
        <p>Report ID: {session.id}</p>
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function ReportSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 print:border-none print:p-0 print:break-inside-avoid">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-700 print:text-base">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <p className="text-sm font-medium text-zinc-800">{value}</p>
    </div>
  );
}

function ConditionField({ label, value }: { label: string; value: string }) {
  const colors: Record<string, string> = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-green-50 text-green-600',
    average: 'bg-amber-50 text-amber-600',
    used: 'bg-amber-100 text-amber-700',
    worn_out: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-2">
      <span className="text-sm text-zinc-600">{label}</span>
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${colors[value] ?? 'bg-zinc-100 text-zinc-600'}`}
      >
        {value.replace(/_/g, ' ')}
      </span>
    </div>
  );
}

function ResultBadge({ result }: { result: string | null }) {
  if (!result) return <span className="text-zinc-400">—</span>;

  const styles: Record<string, string> = {
    pass: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    fail: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[result] ?? ''}`}>
      {result}
    </span>
  );
}
