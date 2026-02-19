import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import { findSizeById } from '@/lib/db/reference';
import TrimGrid from '@/components/workshop/TrimGrid';

interface TrimPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrimPage({ params }: TrimPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Trim analysis only applies to gliders.
      </div>
    );
  }

  // Load reference data for the grid
  const gliderSize = session.gliderSizeId
    ? await findSizeById(session.gliderSizeId)
    : null;

  if (!gliderSize) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-900">Trim Analysis</h3>
        <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
          No reference data linked to this session. The glider size must be linked to load
          manufacturer reference lengths for trim analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">Trim Analysis</h3>
        <span className="text-sm text-zinc-400">{session.measureMethod} method</span>
      </div>

      <TrimGrid
        sessionId={session.id}
        gliderSize={gliderSize}
        existingMeasurements={session.trimMeasurements}
        measureMethod={session.measureMethod ?? 'differential'}
      />
    </div>
  );
}
