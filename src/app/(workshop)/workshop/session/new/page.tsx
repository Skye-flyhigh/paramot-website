import { ensureTechnician } from '@/lib/security/workshop-auth';
import { findServiceById } from '@/lib/db/serviceRecords';
import SessionCreateForm from '@/components/workshop/SessionCreateForm';

interface NewSessionPageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function NewSessionPage({ searchParams }: NewSessionPageProps) {
  const auth = await ensureTechnician();

  if (!auth.authorized) return null;

  const { bookingId } = await searchParams;

  // Pre-populate from booking if provided
  let prefillEquipment = undefined;

  if (bookingId) {
    const booking = await findServiceById(bookingId);

    if (booking?.equipment) {
      prefillEquipment = {
        id: booking.equipment.id,
        serialNumber: booking.equipment.serialNumber,
        type: booking.equipment.type as 'GLIDER' | 'RESERVE' | 'HARNESS',
        manufacturer: booking.equipment.manufacturer,
        model: booking.equipment.model,
        size: booking.equipment.size,
      };
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-zinc-900">New Session</h2>
      <SessionCreateForm bookingId={bookingId} prefillEquipment={prefillEquipment} />
    </div>
  );
}
