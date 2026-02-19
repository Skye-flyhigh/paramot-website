import { notFound } from 'next/navigation';

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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">
        {session.equipmentType === 'GLIDER'
          ? 'Intake & Visual Diagnosis'
          : 'Intake & Checklist'}
      </h3>

      {session.equipmentType === 'GLIDER' ? (
        <IntakeForm sessionId={session.id} existingDiagnosis={session.diagnosis} />
      ) : (
        <ChecklistView
          sessionId={session.id}
          equipmentType={session.equipmentType}
          checklist={session.checklist}
        />
      )}
    </div>
  );
}

function ChecklistView({
  sessionId,
  equipmentType,
  checklist,
}: {
  sessionId: string;
  equipmentType: string;
  checklist: Array<{
    id: string;
    stepNumber: number;
    description: string;
    completed: boolean;
    notes: string | null;
  }>;
}) {
  if (checklist.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        No checklist steps loaded for this {equipmentType.toLowerCase()} session.
        Checklist templates will be loaded when the session is properly configured.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {checklist.map((step) => (
        <div
          key={step.id}
          className={`flex items-start gap-3 rounded-lg border p-3 ${
            step.completed ? 'border-green-200 bg-green-50' : 'border-zinc-200 bg-white'
          }`}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
            {step.completed ? (
              <span className="text-green-600">✓</span>
            ) : (
              <span className="text-zinc-400">{step.stepNumber}</span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm ${step.completed ? 'text-green-800' : 'text-zinc-700'}`}
            >
              {step.description}
            </p>
            {step.notes && <p className="mt-1 text-xs text-zinc-400">{step.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
