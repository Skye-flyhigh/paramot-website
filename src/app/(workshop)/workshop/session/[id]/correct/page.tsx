import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';

interface CorrectPageProps {
  params: Promise<{ id: string }>;
}

export default async function CorrectPage({ params }: CorrectPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Corrections only apply to gliders.
      </div>
    );
  }

  const corrections = session.corrections;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Corrections & Repairs</h3>
        <span className="text-sm text-zinc-400">
          {corrections.length} correction{corrections.length !== 1 ? 's' : ''}
        </span>
      </div>

      {corrections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No corrections recorded yet. Complete trim analysis first to see suggested
          corrections.
        </div>
      ) : (
        <div className="space-y-3">
          {corrections.map((c) => (
            <div key={c.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono font-medium text-zinc-900">
                  {c.lineRow}
                  {c.position} {c.side}
                </span>
                {c.groupLabel && (
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                    {c.groupLabel}
                  </span>
                )}
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                  {c.correctionType?.replace(/_/g, ' ')}
                </span>
              </div>
              {(c.loopsBefore != null || c.loopsAfter != null) && (
                <p className="mt-1 text-xs text-zinc-500">
                  Loops: {c.loopsBefore ?? '?'} → {c.loopsAfter ?? '?'}
                  {c.shorteningMm != null && ` · ${c.shorteningMm}mm shortening`}
                </p>
              )}
              {c.notes && <p className="mt-1 text-sm text-zinc-600">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Placeholder for correction entry form */}
      <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400">
        Correction entry form with loop calculation suggestions will be built in Phase 5.
      </div>
    </div>
  );
}
