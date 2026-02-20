import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionWithFullData } from '@/lib/db/sessions';
import ClothTestForm from '@/components/workshop/ClothTestForm';

interface ClothPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClothPage({ params }: ClothPageProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionWithFullData(id, auth.email);

  if (!session || session.technician !== auth.email) notFound();

  if (session.equipmentType !== 'GLIDER') {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-zinc-400">
        Cloth testing only applies to gliders.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">
          Cloth Porosity and Strength
        </h3>
        <span className="text-sm text-zinc-400">
          {session.clothTests.length} test point
          {session.clothTests.length !== 1 ? 's' : ''}
        </span>
      </div>

      <ClothTestForm sessionId={session.id} existingTests={session.clothTests} />
    </div>
  );
}
