'use client';
import { useState } from 'react';

import type { ServiceStatus } from '@/lib/db';
import type { Equipment } from '@/lib/validation/equipmentSchema';

import { useBookingModal } from '@/hooks/useBookingModal';

import BookingModal from '../dashboard/BookingModal';
import ContactForm from '../home/ContactForm';
import { Button } from '../ui/button';
import XButton from '../ui/x-button';

export default function ServiceActionButtons({
  status,
  equipment,
  isOwner = false,
}: {
  status: ServiceStatus;
  equipment: Equipment;
  isOwner?: boolean;
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
          {status === 'COMPLETED' && (
            <Button type="button" variant="default" className="w-full">
              Download Service Report
            </Button>
          )}
          {isOwner && (
            <>
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

      {/* Support Modal */}
      {openSupport && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <dialog
            open={openSupport}
            className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-0"
          >
            {/* Header */}
            <header className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Contact support</h2>
              <XButton onClose={() => setOpenSupport(false)} />
            </header>
            <ContactForm
              variant="equipment"
              equipment={equipment}
              onClose={() => setOpenSupport(false)}
            />
          </dialog>
        </div>
      )}
    </div>
  );
}
