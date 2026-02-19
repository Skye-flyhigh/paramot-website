import { ensureTechnician } from '@/lib/security/workshop-auth';
import SessionCreateForm from '@/components/workshop/SessionCreateForm';

interface NewSessionPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function NewSessionPage({ searchParams }: NewSessionPageProps) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const { bookingId } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">New Session</h2>
      <SessionCreateForm bookingId={bookingId} />
    </div>
  );
}
