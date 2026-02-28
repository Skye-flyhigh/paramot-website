'use client';

import { useState } from 'react';

import ContactForm from '@/components/home/ContactForm';
import type { ContactFormVariant } from '@/lib/validation/contactForm';
import type { Equipment } from '@/lib/validation/equipmentSchema';

import XButton from './x-button';

interface ContactModalProps {
  /** Button label */
  children: React.ReactNode;
  /** Button style classes */
  className?: string;
  /** Form variant — determines heading/placeholder text */
  variant?: ContactFormVariant;
  /** Optional equipment context for equipment-specific enquiries */
  equipment?: Equipment;
}

const TITLES: Record<ContactFormVariant, string> = {
  contact: 'Get in touch',
  feedback: 'Send feedback',
  equipment: 'Contact support',
};

export default function ContactModal({
  children,
  className,
  variant = 'contact',
  equipment,
}: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <dialog
            open
            className="relative m-0 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
          >
            <header className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-sky-900">{TITLES[variant]}</h2>
              <XButton onClose={() => setIsOpen(false)} />
            </header>
            <ContactForm
              variant={variant}
              equipment={equipment}
              onClose={() => setIsOpen(false)}
            />
          </dialog>
        </div>
      )}
    </>
  );
}
