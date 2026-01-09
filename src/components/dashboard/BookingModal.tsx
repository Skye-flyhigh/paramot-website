'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Equipment,
  getServicePrice,
  getServicesList,
  ServiceRecords,
} from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { isTandemGlider } from '@/lib/utils';
import XButton from '../ui/x-button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// type BookingType =

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
        id="booking-modal"
        open={isOpen}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-0"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Modify Booking</h2>
          <XButton onClose={onClose} />
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
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Service Type
            </Label>
            <div className="space-y-3">
              {hasNoService ? (
                <span>No available services</span>
              ) : (
                <RadioGroup
                  onValueChange={(value) => handleInputChange('serviceType', value)}
                >
                  {applicableServices.map((service) => {
                    const price = getServicePrice(service);
                    return (
                      <div className="grid grid-cols-[30px_1fr]" key={service.code}>
                        <RadioGroupItem
                          id={service.code}
                          value={service.code}
                          disabled={!service.available}
                          className={'mt-1 col-start-1 bg-blue-100'}
                        />
                        <Label
                          className="grid-col-2 flex cursor-pointer"
                          htmlFor={service.code}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-medium ${service.available ? 'text-gray-900' : 'text-gray-400 cursor-not-allowed'}`}
                            >
                              {service.title}
                            </span>
                            <span
                              className={`text-sm font-semibold ${service.available ? 'text-sky-700' : 'text-sky-200 cursor-not-allowed'}`}
                            >
                              {typeof price === 'number' ? `£${price}` : price}
                            </span>
                          </div>
                        </Label>
                        <div
                          className={`text-sm text-gray-700 col-span-full ${service.available ? 'text-gray-900' : 'text-gray-100 cursor-not-allowed'}`}
                        >
                          {service.description}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <Label className="">Preferred Delivery Date</Label>
            <Input
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={hasNoService}
              className={
                'w-full px-3 py-2 border ' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            />
          </div>

          {/* Delivery Method */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Method
            </Label>
            <Select
              disabled={hasNoService}
              value={formData.deliveryMethod}
              onValueChange={(value) => handleInputChange('deliveryMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Delivery Method</SelectLabel>
                  <SelectItem value="drop-off">Drop off in person</SelectItem>
                  <SelectItem value="post">Post/Courier</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Special Instructions */}
          <div>
            <Label>History and Special Instructions</Label>
            <Textarea
              disabled={hasNoService}
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={3}
              placeholder="Please tell us about number of hours/years. Any specific concerns, damage, or requirements..."
              className={
                'w-full' +
                (hasNoService ? 'bg-gray-300 cursor-not-allowed text-gray-400' : '')
              }
            />
          </div>

          {/* Contact Method */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Method
            </Label>
            <Select
              disabled={hasNoService}
              value={formData.contactMethod}
              onValueChange={(value) => handleInputChange('contactMethod', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Contact Method</SelectLabel>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone call</SelectItem>
                  <SelectItem value="text">Text message</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
