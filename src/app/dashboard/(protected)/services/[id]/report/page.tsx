import { notFound, redirect } from 'next/navigation';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ensureCustomer } from '@/lib/security/auth-check';
import { findSessionForCustomerReport } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import { summarizeClothTests } from '@/lib/workshop/cloth-calculations';
import {
  calculateGroupDifferentials,
  summarizeGroups,
  detectProfileShape,
  parseLineLengthEntries,
  parseGroupMappings,
  getToleranceMm,
} from '@/lib/workshop/trim-calculations';

interface CustomerReportProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerReportPage({ params }: CustomerReportProps) {
  const { id: serviceRecordId } = await params;

  const authResult = await ensureCustomer();

  if (!authResult.authorized) {
    redirect('/dashboard/login');
  }

  const result = await findSessionForCustomerReport(
    serviceRecordId,
    authResult.customer.id,
  );

  if (!result || !result.session.report) notFound();

  const { session, bookingReference } = result;
  const report = session.report!;
  const isGlider = session.equipmentType === 'GLIDER';

  // Load reference data for trim analysis
  const gliderSize =
    isGlider && session.gliderSizeId ? await findSizeById(session.gliderSizeId) : null;

  // Compute trim analysis
  let trimProfile: ReturnType<typeof detectProfileShape> | null = null;

  if (gliderSize && session.trimMeasurements.length > 0) {
    const refLengths = parseLineLengthEntries(gliderSize.lineLengths);
    const mappings = parseGroupMappings(gliderSize.groupMappings);

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

      trimProfile = detectProfileShape(diffs);
    }
  }

  // Cloth summary
  const clothSummary =
    session.clothTests.length > 0 ? summarizeClothTests(session.clothTests) : null;

  // Checklist groups
  const checklistGroups = groupChecklist(session.checklist);

  // Strength summary
  const strengthPassed = session.strengthTests.filter((t) => t.result === 'pass').length;
  const strengthFailed = session.strengthTests.filter(
    (t) => t.result === 'fail' || t.result === 'reject',
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/services"
        className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-sky-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sky-900">Service Report</h1>
            <p className="mt-1 text-sm text-sky-600">
              Ref: {bookingReference} ·{' '}
              {new Date(session.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
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

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InfoField
            label="Equipment"
            value={`${session.equipment?.manufacturer ?? ''} ${session.equipment?.model ?? ''}`}
          />
          <InfoField label="Size" value={session.equipment?.size ?? '—'} />
          <InfoField
            label="Serial Number"
            value={session.equipment?.serialNumber ?? '—'}
          />
        </div>
      </div>

      {/* Checklist summary */}
      {checklistGroups.size > 0 && (
        <Section title="Inspection Summary">
          <div className="space-y-3">
            {Array.from(checklistGroups.entries()).map(([type, group]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-sky-800">{type.replace(/_/g, ' ')}</span>
                <span
                  className={`text-xs font-medium ${
                    group.done === group.total ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {group.done}/{group.total} completed
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Glider-specific summaries */}
      {isGlider && (
        <>
          {/* Visual Diagnosis */}
          {session.diagnosis && (
            <Section title="Visual Diagnosis">
              <div className="grid gap-3 sm:grid-cols-2">
                {session.diagnosis.linesetCondition && (
                  <ConditionField
                    label="Lineset"
                    value={session.diagnosis.linesetCondition}
                  />
                )}
                {session.diagnosis.risersCondition && (
                  <ConditionField
                    label="Risers"
                    value={session.diagnosis.risersCondition}
                  />
                )}
                {session.diagnosis.canopyCondition && (
                  <ConditionField
                    label="Canopy"
                    value={session.diagnosis.canopyCondition}
                  />
                )}
                {session.diagnosis.clothCondition && (
                  <ConditionField
                    label="Cloth"
                    value={session.diagnosis.clothCondition}
                  />
                )}
              </div>
            </Section>
          )}

          {/* Cloth result */}
          {clothSummary && (
            <Section title="Cloth Assessment">
              <ResultCard
                result={clothSummary.overallResult}
                label={
                  clothSummary.overallResult === 'fail'
                    ? 'Cloth Failure'
                    : clothSummary.overallResult === 'warning'
                      ? 'Cloth Warning'
                      : 'Cloth OK'
                }
                detail={`${clothSummary.passCount} pass, ${clothSummary.warningCount} warning, ${clothSummary.failCount} fail`}
              />
            </Section>
          )}

          {/* Strength result */}
          {session.strengthTests.length > 0 && (
            <Section title="Line Strength">
              <ResultCard
                result={strengthFailed > 0 ? 'fail' : 'pass'}
                label={`${session.strengthTests.length} line${session.strengthTests.length !== 1 ? 's' : ''} tested`}
                detail={`${strengthPassed} pass${strengthFailed > 0 ? `, ${strengthFailed} fail` : ''}`}
              />
            </Section>
          )}

          {/* Trim profile */}
          {trimProfile && (
            <Section title="Trim Profile">
              <ResultCard
                result={
                  trimProfile.shape === 'stable'
                    ? 'pass'
                    : trimProfile.shape === 'unstable'
                      ? 'fail'
                      : 'warning'
                }
                label={
                  trimProfile.shape.charAt(0).toUpperCase() +
                  trimProfile.shape.slice(1) +
                  ' Profile'
                }
                detail={trimProfile.description}
              />
            </Section>
          )}

          {/* Corrections summary */}
          {session.corrections.length > 0 && (
            <Section title="Corrections Applied">
              <p className="text-sm text-sky-700">
                {session.corrections.length} correction
                {session.corrections.length !== 1 ? 's' : ''} made during service.
              </p>
            </Section>
          )}

          {/* Canopy repair */}
          {report.canopyRepaired && (
            <Section title="Canopy Repair">
              <p className="text-sm text-sky-700">Canopy was repaired during service.</p>
              {report.canopyRepairNotes && (
                <p className="mt-1 text-sm text-sky-500">{report.canopyRepairNotes}</p>
              )}
            </Section>
          )}
        </>
      )}

      {/* Additional work */}
      {report.additionalJobs && (
        <Section title="Additional Work">
          <p className="text-sm text-sky-700">{report.additionalJobs}</p>
        </Section>
      )}

      {/* Technician opinion */}
      {report.technicianOpinion && (
        <Section title="Technician's Assessment">
          <p className="text-sm text-sky-700">{report.technicianOpinion}</p>
        </Section>
      )}

      {/* Next control */}
      {(report.nextControlHours != null || report.nextControlMonths != null) && (
        <Section title="Next Control">
          <div className="flex gap-6">
            {report.nextControlHours != null && (
              <div>
                <p className="text-xs font-medium text-sky-400">Hours</p>
                <p className="text-lg font-semibold text-sky-900">
                  {report.nextControlHours}h
                </p>
              </div>
            )}
            {report.nextControlMonths != null && (
              <div>
                <p className="text-xs font-medium text-sky-400">Months</p>
                <p className="text-lg font-semibold text-sky-900">
                  {report.nextControlMonths}m
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Signature */}
      {report.technicianSignature && (
        <div className="border-t border-sky-200 pt-4">
          <p className="text-sm text-sky-500">
            Signed by{' '}
            <span className="font-medium text-sky-900">{report.technicianSignature}</span>
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

      <div className="border-t border-sky-100 pt-4 text-center text-xs text-sky-400">
        <p>paraMOT · APPI-certified inspection</p>
      </div>
    </div>
  );
}

// =============================================================================
// HELPERS
// =============================================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-sky-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-sky-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-sky-400">{label}</p>
      <p className="text-sm font-medium text-sky-800">{value}</p>
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
    <div className="flex items-center justify-between rounded-lg border border-sky-100 p-2">
      <span className="text-sm text-sky-600">{label}</span>
      <span
        className={`rounded px-2 py-0.5 text-xs font-medium ${colors[value] ?? 'bg-sky-100 text-sky-600'}`}
      >
        {value.replace(/_/g, ' ')}
      </span>
    </div>
  );
}

function ResultCard({
  result,
  label,
  detail,
}: {
  result: string;
  label: string;
  detail: string;
}) {
  const styles: Record<string, string> = {
    pass: 'border-green-200 bg-green-50 text-green-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    fail: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <div className={`rounded-lg border p-3 ${styles[result] ?? ''}`}>
      <p className="font-semibold">{label}</p>
      <p className="text-sm opacity-80">{detail}</p>
    </div>
  );
}

function groupChecklist(
  checklist: Array<{
    serviceType: string;
    completed: boolean;
    description: string;
  }>,
): Map<string, { total: number; done: number }> {
  const groups = new Map<string, { total: number; done: number }>();

  for (const item of checklist) {
    const g = groups.get(item.serviceType) ?? { total: 0, done: 0 };

    g.total++;
    if (item.completed) g.done++;
    groups.set(item.serviceType, g);
  }

  return groups;
}
