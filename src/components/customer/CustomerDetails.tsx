'use client';

import { useActionState, useEffect } from 'react';

import type { Customer } from '@/lib/schema';
import type { CustomerFormState } from '@/lib/validation/customerSchema';

import submitCustomerDetails from '@/lib/submit/submitCustomerDetails';

import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SubmitButton } from '../ui/submit-button';
import { Textarea } from '../ui/textarea';

export default function CustomerDetails({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose?: () => void;
}) {
  const initialValues: Customer = {
    id: customer.id,
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    createdAt: customer.createdAt || '',
    updatedAt: customer.updatedAt || new Date(),
    serviceHistory: customer.serviceHistory || [],
    communicationPreferences: customer.communicationPreferences || {},
  };

  const initialState: CustomerFormState = {
    data: initialValues,
    errors: null,
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    submitCustomerDetails,
    initialState,
  );

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

  return (
    <form id="customer-form" action={formAction} className="my-4">
      {/* Success Message */}
      {state.success && (
        <Alert variant="success">
          <AlertDescription>Details saved. Closing in 5 seconds...</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {state.errors && !state.success && (
        <Alert variant="error">
          <AlertDescription>{state.errors}</AlertDescription>
        </Alert>
      )}
      <section className="grid grid-cols-2 gap-4 my-2">
        <div className="flex gap-2 flex-col" id="customer-name-group">
          <Label className="label" htmlFor="name" id="customer-name">
            Name
          </Label>
          <Input id="name" name="name" defaultValue={customer.name} />
        </div>
        <div className="flex gap-2 flex-col" id="customer-email-group">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" defaultValue={customer.email} />
        </div>
        <div className="flex gap-2 flex-col" id="customer-address-group">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" name="address" defaultValue={customer.address} />
        </div>
        <div className="flex gap-2 flex-col" id="customer-phone-group">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={customer.phone} />
        </div>
      </section>

      <div id="button-container" className="w-full flex justify-end">
        {/* Cancel Button */}
        <Button type="button" variant="ghost" onClick={onClose} className="mr-3">
          Cancel
        </Button>
        {/* Submit Button */}
        <SubmitButton isPending={isPending}>Save details</SubmitButton>
      </div>
    </form>
  );
}
