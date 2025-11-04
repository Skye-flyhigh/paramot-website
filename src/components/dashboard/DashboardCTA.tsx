'use client';

import { Customer, Equipment } from '@/lib/schema';
import { useState } from 'react';
import { EquipmentPicker } from './EquipmentPicker';
import { getCustomerEquipment } from '@/lib/mockData';
import BookingModal from './BookingModal';
import { Button } from '../ui/button';
import { useModal } from '@/hooks/useModal';
import CustomerDetails from '../customer/CustomerDetails';

export function DashboardCTA(customer: Customer) {
  const { modalState, openModal, closeModal } = useModal();
  const [newEquipment, setNewEquipment] = useState<Equipment | null>(null);
  const [openContact, setOpenContact] = useState<boolean>(false);

  const equipmentList = getCustomerEquipment(customer.id);

  return (
    <>
      <div className="mt-6 flex gap-3 space-around">
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
      {openContact && <CustomerDetails customer={customer} />}
    </>
  );
}
