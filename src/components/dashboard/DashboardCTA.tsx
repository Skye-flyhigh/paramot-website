'use client';

import { useState } from 'react';

import type { Equipment, EquipmentType } from '@/lib/validation/equipmentSchema';

import { useCustomer } from '@/contexts/CustomerContext';
import { useBookingModal } from '@/hooks/useBookingModal';

import { redirect } from 'next/navigation';
import { Button } from '../ui/button';
import BookingModal from './BookingModal';
import { EquipmentPicker } from './EquipmentPicker';

export function DashboardCTA() {
  const { modalState, openModal, closeModal } = useBookingModal();
  const [newEquipment, setNewEquipment] = useState<Equipment | null>(null);
  const customer = useCustomer();

  // Equipment list from customer context (already loaded with relations)
  const equipmentList: Equipment[] = customer.customerEquipment.map((e) => ({
    ...e.equipment,
    type: e.equipment.type as EquipmentType,
    status: e.equipment.status as Equipment['status'],
  }));

  return (
    <>
      <div className="mt-6 flex gap-3 space-around flex-wrap" id="dashboard-CTA">
        <Button onClick={() => openModal('picker')} variant="default" type="button">
          Schedule New Service
        </Button>
        {(modalState.mode === 'picker' && (
          <EquipmentPicker
            isOpen={modalState.isOpen}
            onClose={() => closeModal()}
            equipmentList={equipmentList}
            onEquipmentSelected={(equipment) => {
              // Handle equipment selection
              setNewEquipment(equipment);
              openModal('booking');
            }}
          />
        )) ||
          (modalState.mode === 'booking' && newEquipment && (
            <BookingModal
              isOpen={modalState.isOpen}
              onClose={closeModal}
              equipment={newEquipment}
            />
          ))}
        <Button
          type="button"
          onClick={() => redirect('/dashboard/settings')}
          variant={'outline'}
        >
          Update contact details
        </Button>
      </div>
    </>
  );
}
