import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Eye,
  TestTube,
  Zap,
  Ruler,
  Wrench,
  FileText,
  ClipboardCheck,
} from 'lucide-react';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';

interface SessionHubProps {
  params: Promise<{ id: string }>;
}

export default async function SessionHub({ params }: SessionHubProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  const basePath = `/workshop/session/${session.id}`;
  const isGlider = session.equipmentType === 'GLIDER';

  // Compute progress stats
  const checklistTotal = session.checklist.length;
  const checklistDone = session.checklist.filter((c) => c.completed).length;
  const hasDiagnosis = !!session.diagnosis;
  const clothCount = session.clothTests.length;
  const trimCount = session.trimMeasurements.length;
  const correctionCount = session.corrections.length;
  const hasReport = !!session.report;
  const serviceTypes = Array.isArray(session.serviceTypes)
    ? (session.serviceTypes as string[])
    : [];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">Session Overview</h3>

      {/* Quick stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Checklist" value={`${checklistDone}/${checklistTotal}`} />
        {isGlider && (
          <>
            <StatCard label="Cloth Tests" value={String(clothCount)} />
            <StatCard label="Trim Measurements" value={String(trimCount)} />
            <StatCard label="Corrections" value={String(correctionCount)} />
          </>
        )}
      </div>

      {/* Service types */}
      {serviceTypes.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-zinc-500">Service Types</h4>
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((st) => (
              <span
                key={st}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
              >
                {st.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Session details */}
      <div className="grid gap-4 sm:grid-cols-2">
        {session.statedHours != null && (
          <Detail label="Stated Hours" value={`${session.statedHours}h`} />
        )}
        {session.hoursSinceLast != null && (
          <Detail label="Hours Since Last Check" value={`${session.hoursSinceLast}h`} />
        )}
        {session.lastInspection && (
          <Detail
            label="Last Inspection"
            value={new Date(session.lastInspection).toLocaleDateString()}
          />
        )}
        {session.measureMethod && (
          <Detail label="Measurement Method" value={session.measureMethod} />
        )}
        {session.clientObservations && (
          <Detail label="Client Observations" value={session.clientObservations} />
        )}
      </div>

      {/* Step links */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-zinc-500">Workflow Steps</h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {isGlider ? (
            <>
              <StepLink
                href={`${basePath}/intake`}
                icon={<Eye className="h-4 w-4" />}
                label="Intake & Diagnosis"
                done={hasDiagnosis}
              />
              <StepLink
                href={`${basePath}/cloth`}
                icon={<TestTube className="h-4 w-4" />}
                label="Cloth Testing"
                count={clothCount}
              />
              <StepLink
                href={`${basePath}/strength`}
                icon={<Zap className="h-4 w-4" />}
                label="Line Strength"
                done={checklistDone > 0}
              />
              <StepLink
                href={`${basePath}/trim`}
                icon={<Ruler className="h-4 w-4" />}
                label="Trim Analysis"
                count={trimCount}
              />
              <StepLink
                href={`${basePath}/correct`}
                icon={<Wrench className="h-4 w-4" />}
                label="Corrections"
                count={correctionCount}
              />
              <StepLink
                href={`${basePath}/report`}
                icon={<FileText className="h-4 w-4" />}
                label="Report"
                done={hasReport}
              />
            </>
          ) : (
            <>
              <StepLink
                href={`${basePath}/intake`}
                icon={<Eye className="h-4 w-4" />}
                label="Intake"
                done={hasDiagnosis}
              />
              <StepLink
                href={`${basePath}/checklist`}
                icon={<ClipboardCheck className="h-4 w-4" />}
                label={
                  session.equipmentType === 'RESERVE'
                    ? 'Repack Procedure'
                    : 'Inspection Checklist'
                }
                count={checklistDone}
              />
              <StepLink
                href={`${basePath}/report`}
                icon={<FileText className="h-4 w-4" />}
                label="Report"
                done={hasReport}
              />
            </>
          )}
        </div>
      </div>

      {/* Reference data */}
      {session.gliderSize && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <h4 className="mb-1 text-sm font-medium text-zinc-500">Reference Data</h4>
          <p className="text-sm text-zinc-700">
            {session.gliderSize.gliderModel.manufacturer.name}{' '}
            {session.gliderSize.gliderModel.name} — {session.gliderSize.sizeLabel}
          </p>
          <p className="text-xs text-zinc-400">
            {session.gliderSize.minWeight}–{session.gliderSize.maxWeight} kg
            {session.gliderSize.wingArea && ` · ${session.gliderSize.wingArea} m²`}
            {session.gliderSize.numLinesPerSide &&
              ` · ${session.gliderSize.numLinesPerSide} lines/side`}
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <p className="text-xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      <p className="text-sm text-zinc-700">{value}</p>
    </div>
  );
}

interface StepLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  done?: boolean;
  count?: number;
}

function StepLink({ href, icon, label, done, count }: StepLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-sm"
    >
      <span className="text-zinc-400">{icon}</span>
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      {done && (
        <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Done
        </span>
      )}
      {count != null && count > 0 && (
        <span className="ml-auto text-xs text-zinc-400">{count}</span>
      )}
    </Link>
  );
}
