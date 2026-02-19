import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText } from 'lucide-react';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import ReportForm from '@/components/workshop/ReportForm';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  const report = session.report;
  const isGlider = session.equipmentType === 'GLIDER';
  const isCompleted = session.status === 'COMPLETED' || session.status === 'ARCHIVED';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">Report & Sign-off</h3>

      {isCompleted && report ? (
        <>
          <Link
            href={`/workshop/session/${session.id}/report/view`}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <FileText className="h-4 w-4" />
            View Full Report
          </Link>
          <CompletedReport report={report} isGlider={isGlider} />
        </>
      ) : (
        <ReportForm
          sessionId={session.id}
          isGlider={isGlider}
          technicianEmail={auth.email}
          existingReport={report}
        />
      )}
    </div>
  );
}

function CompletedReport({
  report,
  isGlider,
}: {
  report: {
    airworthy: boolean;
    nextControlHours: number | null;
    nextControlMonths: number | null;
    technicianOpinion: string | null;
    technicianSignature: string | null;
    signedAt: Date | null;
    canopyRepaired: boolean;
    canopyRepairNotes: string | null;
    additionalJobs: string | null;
  };
  isGlider: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Airworthiness determination */}
      <div
        className={`rounded-lg border p-4 ${
          report.airworthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}
      >
        <p className="text-lg font-bold">
          {report.airworthy ? (
            <span className="text-green-800">AIRWORTHY</span>
          ) : (
            <span className="text-red-800">NOT AIRWORTHY</span>
          )}
        </p>
        {report.technicianOpinion && (
          <p className="mt-1 text-sm text-zinc-700">{report.technicianOpinion}</p>
        )}
      </div>

      {/* Next control */}
      <div className="grid gap-4 sm:grid-cols-2">
        {report.nextControlHours != null && (
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-400">Next Control</p>
            <p className="text-lg font-semibold text-zinc-900">
              {report.nextControlHours} hours
            </p>
          </div>
        )}
        {report.nextControlMonths != null && (
          <div className="rounded-lg border border-zinc-200 bg-white p-3">
            <p className="text-xs font-medium text-zinc-400">Next Control</p>
            <p className="text-lg font-semibold text-zinc-900">
              {report.nextControlMonths} months
            </p>
          </div>
        )}
      </div>

      {/* Sign-off details */}
      {report.technicianSignature && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm">
          <p className="text-zinc-500">
            Signed by{' '}
            <span className="font-medium text-zinc-900">
              {report.technicianSignature}
            </span>
            {report.signedAt && <> on {new Date(report.signedAt).toLocaleDateString()}</>}
          </p>
        </div>
      )}

      {/* Canopy repair (glider only) */}
      {isGlider && report.canopyRepaired && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-700">Canopy Repaired</p>
          {report.canopyRepairNotes && (
            <p className="mt-1 text-sm text-zinc-500">{report.canopyRepairNotes}</p>
          )}
        </div>
      )}

      {/* Additional jobs */}
      {report.additionalJobs && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm font-medium text-zinc-700">Additional Work</p>
          <p className="mt-1 text-sm text-zinc-500">{report.additionalJobs}</p>
        </div>
      )}
    </div>
  );
}
