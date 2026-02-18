'use client';

import { Save } from 'lucide-react';
import { useActionState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/ui/submit-button';
import { useCustomer } from '@/contexts/CustomerContext';
import submitSettingsForm, {
  type SettingsFormState,
} from '@/lib/submit/submitSettingsForm';
import { Card } from '../ui/card';

interface SettingsFormProps {
  onClose?: () => void;
}

export default function SettingsForm({ onClose }: SettingsFormProps) {
  const customer = useCustomer();

  const initialState: SettingsFormState = {
    formData: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone ?? '',
      street: customer.address?.street ?? '',
      city: customer.address?.city ?? '',
      county: customer.address?.county ?? '',
      postcode: customer.address?.postcode ?? '',
    },
    errors: {},
    success: false,
  };

  const [state, formAction, isPending] = useActionState(submitSettingsForm, initialState);

  useEffect(() => {
    if (state.success && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <Card className="bg-white border-sky-100 shadow-xl p-6">
      <form action={formAction} className="space-y-6">
        {/* Success Message */}
        {state.success && (
          <Alert variant="success">
            <AlertDescription>
              Your settings have been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        {/* General Error */}
        {state.errors?.general && (
          <Alert variant="error">
            <AlertDescription>{state.errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                required
                defaultValue={state.formData?.firstName ?? customer.firstName}
                className={state.errors?.firstName ? 'border-red-300' : ''}
              />
              {state.errors?.firstName && (
                <p className="text-sm text-red-600">{state.errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                required
                defaultValue={state.formData?.lastName ?? customer.lastName}
                className={state.errors?.lastName ? 'border-red-300' : ''}
              />
              {state.errors?.lastName && (
                <p className="text-sm text-red-600">{state.errors.lastName}</p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={customer.email}
                disabled
                className="bg-sky-50 text-sky-500"
              />
              <p className="text-xs text-sky-500">
                Email is managed through your login provider
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder="07700 900000"
                defaultValue={state.formData?.phone ?? customer.phone ?? ''}
                className={state.errors?.phone ? 'border-red-300' : ''}
              />
              {state.errors?.phone && (
                <p className="text-sm text-red-600">{state.errors.phone}</p>
              )}
            </div>
          </div>
        </section>

        {/* Address */}
        <section>
          <h3 className="text-lg font-semibold text-sky-900 mb-4">Address</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                type="text"
                id="street"
                name="street"
                placeholder="123 High Street"
                defaultValue={state.formData?.street ?? customer.address?.street ?? ''}
                className={state.errors?.street ? 'border-red-300' : ''}
              />
              {state.errors?.street && (
                <p className="text-sm text-red-600">{state.errors.street}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="London"
                  defaultValue={state.formData?.city ?? customer.address?.city ?? ''}
                  className={state.errors?.city ? 'border-red-300' : ''}
                />
                {state.errors?.city && (
                  <p className="text-sm text-red-600">{state.errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input
                  type="text"
                  id="county"
                  name="county"
                  placeholder="Greater London"
                  defaultValue={state.formData?.county ?? customer.address?.county ?? ''}
                />
              </div>
            </div>

            <div className="sm:w-1/2">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  type="text"
                  id="postcode"
                  name="postcode"
                  placeholder="SW1A 1AA"
                  defaultValue={
                    state.formData?.postcode ?? customer.address?.postcode ?? ''
                  }
                  className={state.errors?.postcode ? 'border-red-300' : ''}
                />
                {state.errors?.postcode && (
                  <p className="text-sm text-red-600">{state.errors.postcode}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-sky-100">
          <SubmitButton isPending={isPending} loadingText="Saving...">
            <Save className="w-4 h-4" />
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
