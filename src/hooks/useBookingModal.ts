import { useState } from 'react';

import type { ServiceRecords } from '../lib/schema';

interface ModalState {
  isOpen: boolean;
  mode: 'picker' | 'booking' | null;
  selectedService?: ServiceRecords;
}

export function useBookingModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
    selectedService: undefined,
  });

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

  return {
    modalState,
    openModal,
    closeModal,
  };
}
