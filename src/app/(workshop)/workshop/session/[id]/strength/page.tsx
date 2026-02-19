import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';

interface StrengthPageProps {
  params: Promise<{ id: string }>;
}

export default async function StrengthPage({ params }: StrengthPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Line strength testing only applies to gliders.
      </div>
    );
  }

  // Strength is tracked via checklist steps for now (per spec)
  const strengthChecklist = session.checklist.filter(
    (c) => c.serviceType === 'strength_check',
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">Line Strength Testing</h3>

      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
        <p className="text-sm text-zinc-500">
          Record line strength test results. If any line fails, it must be replaced before
          trim analysis.
        </p>

        {strengthChecklist.length === 0 ? (
          <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
            No strength check steps loaded. Make sure &quot;Lines Strength Check&quot; was
            selected as a service type when creating this session.
          </div>
        ) : (
          <div className="space-y-2">
            {strengthChecklist.map((step) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  step.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-zinc-200 bg-white'
                }`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                  {step.completed ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-zinc-400">{step.stepNumber}</span>
                  )}
                </span>
                <div>
                  <p
                    className={`text-sm ${step.completed ? 'text-green-800' : 'text-zinc-700'}`}
                  >
                    {step.description}
                  </p>
                  {step.notes && (
                    <p className="mt-1 text-xs text-zinc-400">{step.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Placeholder for future dedicated strength data model */}
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400">
        Dedicated line strength data entry will be added in a future phase. Currently
        tracked via the service checklist above.
      </div>
    </div>
  );
}
