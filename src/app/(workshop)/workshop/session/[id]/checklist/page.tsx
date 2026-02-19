import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import ChecklistPanel from '@/components/workshop/ChecklistPanel';

interface ChecklistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id);

  if (!session || session.technician !== auth.email) notFound();

  const isReserve = session.equipmentType === 'RESERVE';
  const isHarness = session.equipmentType === 'HARNESS';

  const typeLabel = isReserve
    ? 'Reserve Repack'
    : isHarness
      ? 'Harness Inspection'
      : 'Checklist';

  if (session.checklist.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-zinc-900">{typeLabel}</h3>
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
          No checklist steps loaded. This may indicate the session was created without
          selecting service types.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-zinc-900">{typeLabel}</h3>

      {isReserve && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Reserve repack follows a sequential procedure. Steps should be completed in
          order. Steps 18-19 require force measurements (handle pull &gt;2 daN, extraction
          &lt;7 daN).
        </div>
      )}

      {isHarness && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-700">
          Harness check covers structural safety, passive protection, reserve integration,
          and functional testing. Step 17 requires force measurements. Step 19 may not
          apply to non-reversible harnesses.
        </div>
      )}

      <ChecklistPanel steps={session.checklist} sequential={isReserve} />
    </div>
  );
}
