import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import IntakeForm from '@/components/workshop/IntakeForm';
import ChecklistPanel from '@/components/workshop/ChecklistPanel';

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
        {isGlider ? 'Intake & Visual Diagnosis' : 'Intake & Checklist'}
      </h3>

      {isGlider ? (
        <IntakeForm sessionId={session.id} existingDiagnosis={session.diagnosis} />
      ) : session.checklist.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No checklist steps loaded for this {session.equipmentType.toLowerCase()}{' '}
          session.
        </div>
      ) : (
        <ChecklistPanel
          steps={session.checklist}
          sequential={session.equipmentType === 'RESERVE'}
        />
      )}
    </div>
  );
}
