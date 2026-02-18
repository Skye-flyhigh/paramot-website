import { useState } from 'react';

// Minimal type for booking modal - works with both Prisma and validation schema types
interface ExistingBooking {
  serviceCode: string;
  preferredDate: string;
  deliveryMethod: string;
  contactMethod: string;
  specialInstructions?: string | null;
}

interface ModalState {
  isOpen: boolean;
  mode: 'picker' | 'booking' | null;
  selectedService?: ExistingBooking;
}

export function useBookingModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: null,
    selectedService: undefined,
  });

  const openModal = (mode: 'picker' | 'booking', service?: ExistingBooking) => {
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
