import { notFound } from 'next/navigation';

import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findSessionById } from '@/lib/db/sessions';
import SessionHeader from '@/components/workshop/SessionHeader';
import StepNavigation from '@/components/workshop/StepNavigation';

interface SessionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function SessionLayout({ children, params }: SessionLayoutProps) {
  const { id } = await params;

  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const session = await findSessionById(id);

  if (!session) notFound();

  // Verify technician owns this session
  if (session.technician !== auth.email) notFound();

  const equipment = session.equipment;

  return (
    <div className="space-y-4">
      <SessionHeader
        sessionId={session.id}
        equipmentType={session.equipmentType}
        manufacturer={equipment?.manufacturer ?? 'Unknown'}
        model={equipment?.model ?? 'Unknown'}
        size={equipment?.size ?? ''}
        serialNumber={session.serialNumber}
        customerName={null}
        bookingReference={null}
        status={session.status}
      />

      <div className="flex gap-6">
        <aside className="w-48 shrink-0">
          <StepNavigation sessionId={session.id} equipmentType={session.equipmentType} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
