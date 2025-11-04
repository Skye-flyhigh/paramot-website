'use client';

import { Customer, Equipment, ServiceRecords } from '@/lib/schema';
import { useState } from 'react';
import { EquipmentPicker } from './EquipmentPicker';
import { getCustomerEquipment } from '@/lib/mockData';
import BookingModal from './BookingModal';
import { Button } from '../ui/button';

interface ModalState {
  isOpen: boolean;
  mode: 'picker' | 'booking' | null;
  selectedService?: ServiceRecords;
}

export function DashboardCTA(customer: Customer) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
  });

  const [newEquipment, setNewEquipment] = useState<Equipment | null>(null);

  const equipmentList = getCustomerEquipment(customer.id);
  // const newEquipement: Equipment = {}

  const openModal = (mode: 'picker' | 'booking', service?: ServiceRecords) => {
    setModalState({
      isOpen: true,
      mode,
      selectedService: service,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: null,
    });
  };

  return (
    <div className="mt-6 flex gap-3 space-around">
      <Button onClick={() => openModal('picker')} variant="default">
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
    </div>
  );
}
