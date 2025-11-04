'use client';
import { Equipment, ServiceStatus } from '@/lib/schema';
import { Button } from '../ui/button';
import { useBookingModal } from '@/hooks/useBookingModal';
import { useState } from 'react';
import { Session } from 'next-auth';
import BookingModal from './BookingModal';

export default function ServiceActionButtons({
  status,
  equipment,
  session,
}: {
  status: ServiceStatus;
  equipment: Equipment;
  session: Session | null;
}) {
  const { modalState, openModal, closeModal } = useBookingModal();
  const [openSupport, setOpenSupport] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sky-200">
      <div className="p-6 border-b border-sky-100">
        <h2 className="text-xl font-bold text-sky-900">Actions</h2>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {session && ( // FIXME: check if the user own this kit for these actions
            <>
              {status === 'COMPLETED' && (
                <Button type="button" variant="default" className="w-full">
                  Download Service Report
                </Button>
              )}
              {(status === 'PENDING' ||
                status === 'CANCELLED' ||
                status === 'IN_PROGRESS') && (
                <Button
                  type="button"
                  variant="default"
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => openModal('booking')}
                >
                  Modify Booking
                </Button>
              )}
            </>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setOpenSupport(!openSupport)}
          >
            Contact Support
          </Button>
        </div>
      </div>
      <BookingModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        equipment={equipment}
      />
    </div>
  );
}
