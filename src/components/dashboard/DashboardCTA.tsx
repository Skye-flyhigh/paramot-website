'use client';

import { useState } from 'react';

import type { Customer } from '@/lib/schema';
import type { Equipment } from '@/lib/validation/equipmentSchema';

import { useCustomer } from '@/contexts/CustomerContext';
import { useBookingModal } from '@/hooks/useBookingModal';
import { getCustomerEquipment } from '@/lib/mockData';

import CustomerDetails from '../customer/CustomerDetails';
import { Button } from '../ui/button';
import BookingModal from './BookingModal';
import { EquipmentPicker } from './EquipmentPicker';

export function DashboardCTA() {
  const { modalState, openModal, closeModal } = useBookingModal();
  const [newEquipment, setNewEquipment] = useState<Equipment | null>(null);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const customer: Customer = useCustomer();

  const equipmentList = getCustomerEquipment(customer.id);

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
          onClick={() => setOpenContact(!openContact)}
          variant={openContact ? 'default' : 'outline'}
        >
          Update contact details
        </Button>
      </div>
      {openContact && (
        <CustomerDetails customer={customer} onClose={() => setOpenContact(false)} />
      )}
    </>
  );
}
