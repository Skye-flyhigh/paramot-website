'use client';

import { useEffect, useActionState, useState } from 'react';

import type { BookingFormData, BookingFormState } from '@/lib/validation/bookingForm';
import type { Equipment } from '@/lib/validation/equipmentSchema';

import { Button } from '@/components/ui/button';
import { ServiceRecords, getServicePrice, getServicesList } from '@/lib/schema';
import submitBookingForm from '@/lib/submit/submitBookingForm';
import { isTandemGlider } from '@/lib/utils';

import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import XButton from '../ui/x-button';

// type BookingType =

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  existingBooking?: ServiceRecords;
}

const serviceTypeInit = '';

export default function BookingModal({
  isOpen,
  onClose,
  equipment,
  existingBooking,
}: BookingModalProps) {
  const initialValue: BookingFormData = {
    serviceType: existingBooking?.service || serviceTypeInit,
    preferredDate: '',
    deliveryMethod: 'drop-off',
    specialInstructions: '',
    contactMethod: 'email',
    equipmentId: equipment.id,
  };

  const initialState: BookingFormState = {
    data: initialValue,
    success: false,
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(submitBookingForm, initialState);

  // Local state for shadcn components (they don't have name attributes)
  const [serviceType, setServiceType] = useState(state.data.serviceType);
  const [deliveryMethod, setDeliveryMethod] = useState(state.data.deliveryMethod);
  const [contactMethod, setContactMethod] = useState(state.data.contactMethod);

  useEffect(() => {
    if (state.success && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.success, onClose]);

  // Event listening for pressing enter to submit the modal
  useEffect(() => {
    if (!isOpen) return;

    const pressEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', pressEnter);

    return () => {
      window.removeEventListener('keydown', pressEnter);
    };
  }, [isOpen]);

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
        <form action={formAction} className="p-6 space-y-6" id="booking-form">
          {/* Service Type */}
          <div>
            {/* Success Message */}
            {state.success && (
              <Alert variant="success">
                <AlertDescription>
                  Booking successfully submitted. Closing in 5 seconds...
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {state.errors.general && (
              <Alert variant="error">
                <AlertDescription>{state.errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Hidden Equipment data */}
            <input type="hidden" name="equipment-id" value={equipment.id} />

            <Label className="block text-sm font-medium text-gray-700 mb-3">
              Service Type
            </Label>
            <div className="space-y-3">
              {hasNoService ? (
                <span>No available services</span>
              ) : (
                <>
                  <RadioGroup value={serviceType} onValueChange={setServiceType}>
                    {applicableServices.map((service) => {
                      const price = getServicePrice(service.code);

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
                  {/* Hidden input for FormData */}
                  <input type="hidden" name="serviceType" value={serviceType} />
                </>
              )}
            </div>
            {state.errors.serviceType && (
              <p className="text-sm text-red-600 mt-1">{state.errors.serviceType}</p>
            )}
          </div>

          {/* Preferred Date */}
          <div>
            <Label htmlFor="preferredDate">Preferred Delivery Date</Label>
            <Input
              type="date"
              id="preferredDate"
              name="preferredDate"
              defaultValue={state.data.preferredDate}
              min={new Date().toISOString().split('T')[0]}
              disabled={hasNoService || isPending}
            />
            {state.errors.preferredDate && (
              <p className="text-sm text-red-600 mt-1">{state.errors.preferredDate}</p>
            )}
          </div>

          {/* Delivery Method */}
          <div>
            <Label>Delivery Method</Label>
            <Select
              value={deliveryMethod}
              onValueChange={setDeliveryMethod}
              disabled={hasNoService || isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a delivery method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drop-off">Drop off in person</SelectItem>
                <SelectItem value="post">Post/Courier</SelectItem>
              </SelectContent>
            </Select>
            {/* Hidden input for FormData */}
            <input type="hidden" name="deliveryMethod" value={deliveryMethod} />
            {state.errors.deliveryMethod && (
              <p className="text-sm text-red-600 mt-1">{state.errors.deliveryMethod}</p>
            )}
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="specialInstructions">History and Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              name="specialInstructions"
              defaultValue={state.data.specialInstructions}
              rows={3}
              placeholder="Please tell us about number of hours/years. Any specific concerns, damage, or requirements..."
              disabled={hasNoService || isPending}
            />
            {state.errors.specialInstructions && (
              <p className="text-sm text-red-600 mt-1">
                {state.errors.specialInstructions}
              </p>
            )}
          </div>

          {/* Contact Method */}
          <div>
            <Label>Preferred Contact Method</Label>
            <Select
              value={contactMethod}
              onValueChange={setContactMethod}
              disabled={hasNoService || isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone call</SelectItem>
                <SelectItem value="text">Text message</SelectItem>
              </SelectContent>
            </Select>
            {/* Hidden input for FormData */}
            <input type="hidden" name="contactMethod" value={contactMethod} />
            {state.errors.contactMethod && (
              <p className="text-sm text-red-600 mt-1">{state.errors.contactMethod}</p>
            )}
          </div>

          {/* Hidden equipment data */}
          <input type="hidden" name="equipmentId" value={equipment.id} />

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={hasNoService || isPending}>
              {isPending ? 'Submitting...' : 'Update Booking'}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
