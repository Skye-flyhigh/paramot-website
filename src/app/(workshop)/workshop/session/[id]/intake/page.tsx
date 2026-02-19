import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClipboardCheck } from 'lucide-react';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import IntakeForm from '@/components/workshop/IntakeForm';

interface IntakePageProps {
  params: Promise<{ id: string }>;
}

export default async function IntakePage({ params }: IntakePageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id);

  if (!session || session.technician !== auth.email) notFound();

  const isGlider = session.equipmentType === 'GLIDER';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">
        {isGlider ? 'Intake & Visual Diagnosis' : 'Intake'}
      </h3>

      {isGlider ? (
        <IntakeForm sessionId={session.id} existingDiagnosis={session.diagnosis} />
      ) : (
        <div className="space-y-4">
          {/* Session summary for non-glider intake */}
          <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {session.statedHours != null && (
                <div>
                  <p className="text-xs font-medium text-zinc-400">Stated Use</p>
                  <p className="text-sm text-zinc-700">
                    {session.statedHours}{' '}
                    {session.equipmentType === 'RESERVE' ? 'years' : 'hours'}
                  </p>
                </div>
              )}
              {session.clientObservations && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-zinc-400">Client Observations</p>
                  <p className="text-sm text-zinc-700">{session.clientObservations}</p>
                </div>
              )}
            </div>
          </div>

          {/* Link to checklist */}
          <Link
            href={`/workshop/session/${session.id}/checklist`}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-sm"
          >
            <ClipboardCheck className="h-5 w-5 text-zinc-400" />
            <div>
              <p className="text-sm font-medium text-zinc-700">
                {session.equipmentType === 'RESERVE'
                  ? 'Start Repack Procedure'
                  : 'Start Inspection Checklist'}
              </p>
              <p className="text-xs text-zinc-400">
                {session.checklist.filter((c) => c.completed).length}/
                {session.checklist.length} steps completed
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
