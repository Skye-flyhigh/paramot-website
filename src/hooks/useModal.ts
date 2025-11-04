import { useState } from 'react';
import { ServiceRecords } from '../lib/schema';

interface ModalState<T> {
  isOpen: boolean;
  mode: 'picker' | 'booking' | null;
  selectedService?: ServiceRecords;
}

export function useModal<T = undefined>() {
  const [modalState, setModalState] = useState<ModalState<T>>({
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
