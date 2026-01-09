'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Equipment,
  getServicePrice,
  getServicesList,
  ServiceRecords,
} from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { isTandemGlider } from '@/lib/utils';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  existingBooking?: ServiceRecords;
}

interface BookingFormData {
  serviceType: string;
  preferredDate: string;
  deliveryMethod: string;
  specialInstructions: string;
  contactMethod: string;
}

const serviceTypeInit = '';

export default function BookingModal({
  isOpen,
  onClose,
  equipment,
  existingBooking,
}: BookingModalProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: existingBooking?.service || serviceTypeInit,
    preferredDate: '',
    deliveryMethod: 'drop-off',
    specialInstructions: '',
    contactMethod: 'email',
  });

  const serviceList = getServicesList();

  // Filter services based on equipment type
  const applicableServices = serviceList.filter((service) => {
    switch (equipment.type) {
      case 'glider':
        // Gliders can have servicing, trimming, and repairs

        const isTandem = isTandemGlider(equipment);
        if (isTandem) {
          return ['SVC-002', 'SVC-012', 'REP-001'].includes(service.code);
        } else {
          return ['SVC-001', 'SVC-011', 'REP-001'].includes(service.code);
        }
      case 'reserve':
        // Reserves need repacking and repairs
        return ['PACK-001', 'PACK-002', 'REP-001'].includes(service.code);
      case 'harness':
        // Harnesses only need servicing
        return ['SVC-031'].includes(service.code);
      default:
        return false;
    }
  });

  const hasNoService: boolean =
    applicableServices.filter((service) => service.available === true).length === 0;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Handle form submission
      console.log(
        `📩 Equipment ${equipment.manufacturer} ${equipment.model} has been booked. id ${equipment.id}`,
      );
      onClose();
    },
    [equipment, onClose],
  );

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Event listening for pressing enter to submit the modal
  useEffect(() => {
    if (!isOpen) return;

    const pressEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    };

    window.addEventListener('keydown', pressEnter);

    return () => {
      window.removeEventListener('keydown', pressEnter);
    };
  }, [isOpen, handleSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <dialog
        open={isOpen}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-0"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Modify Booking</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </header>

        {/* Equipment Context */}
        <section className="p-6 bg-gray-50 border-b" id="equipment-context">
          <h3 className="font-medium text-gray-900 mb-2">Equipment Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Model:</span>
              <span className="ml-2 font-medium">
                {equipment.manufacturer} {equipment.model} {equipment.size}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Serial:</span>
              <span className="ml-2 font-medium">{equipment.serialNumber}</span>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium capitalize">{equipment.type}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium capitalize">{equipment.status}</span>
            </div>
          </div>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" id="booking-form">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Type
            </label>
            <div className="space-y-3">
              {hasNoService ? (
                <span>No available services</span>
              ) : (
                applicableServices.map((service) => {
                  const price = getServicePrice(service);
                  return (
                    <label
                      key={service.code}
                      className="flex items-start space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="serviceType"
                        value={service.code}
                        disabled={!service.available}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">
                            {service.title}
                          </span>
                          <span className="text-sm font-semibold text-sky-700">
                            {typeof price === 'number' ? `£${price}` : price}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">{service.description}</div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={hasNoService}
              className={
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            />
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </label>
            <select
              disabled={hasNoService}
              value={formData.deliveryMethod}
              onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
              className={
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            >
              <option value="drop-off">Drop off in person</option>
              <option value="post">Post/Courier</option>
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              disabled={hasNoService}
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={3}
              placeholder="Any specific concerns, damage, or requirements..."
              className={
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            />
          </div>

          {/* Contact Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </label>
            <select
              disabled={hasNoService}
              value={formData.contactMethod}
              onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              className={
                'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            >
              <option value="email">Email</option>
              <option value="phone">Phone call</option>
              <option value="text">Text message</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={hasNoService}>
              Update Booking
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
