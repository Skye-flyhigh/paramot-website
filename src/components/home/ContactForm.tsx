'use client';

import { Send } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

import type {
  ContactFormData,
  ContactFormState,
  ContactFormVariant,
} from '@/lib/validation/contactForm';
import type { Equipment } from '@/lib/validation/equipmentSchema';

import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import submitContactForm from '@/lib/submit/submitContactForm';

import { SubmitButton } from '../ui/submit-button';

interface ContactFormProps {
  variant: ContactFormVariant;
  equipment?: Equipment;
  onClose?: () => void;
}

export default function ContactForm({ variant, equipment, onClose }: ContactFormProps) {
  const [alert, setAlert] = useState<boolean>(false);

  const equipmentContext = equipment
    ? `Equipment: ${equipment.manufacturer} ${equipment.model} ${equipment.size} (Serial: ${equipment.serialNumber})`
    : '';

  const initialFormData: ContactFormData = {
    name: '',
    email: '',
    message: '',
    equipmentContext,
    variant,
    title: '',
  };
  const initialState: ContactFormState = {
    formData: initialFormData,
    errors: {},
    success: false,
  };
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  useEffect(() => {
    if (state.success && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  // timer for the alerts
  useEffect(() => {
    if (state.success) {
      setAlert(true);

      const timer = setTimeout(() => {
        setAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border-sky-100 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-sky-900">
            Send us a {variant === 'feedback' ? 'feedback' : 'message'}
          </CardTitle>
          {variant !== 'feedback' && (
            <CardDescription className="text-sky-700">
              We'll get back to you within 24 hours
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {/* Success Message */}
            {alert && (
              <Alert variant="success">
                <AlertDescription>
                  Thank you! Your message has been sent successfully. We'll get back to
                  you within 24 hours.
                </AlertDescription>
              </Alert>
            )}

            {/* General Error */}
            {alert && state.errors.general && (
              <Alert variant="error">
                <AlertDescription>{state.errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Hidden equipment context */}
            {equipmentContext && (
              <input type="hidden" name="equipmentContext" value={equipmentContext} />
            )}
            {variant && <input type="hidden" name="variant" value={variant} />}
            <input
              type="text"
              name="title"
              value={state.formData.title}
              className="hidden"
              aria-hidden={true}
            />

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your full name"
                aria-describedby={state.errors.name ? 'name-error' : undefined}
                className={
                  state.errors.name
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                    : ''
                }
                defaultValue={state.formData.name}
              />
              {state.errors.name && (
                <p id="name-error" className="text-sm text-red-600">
                  {state.errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your.email@example.com"
                aria-describedby={state.errors.email ? 'email-error' : undefined}
                className={
                  state.errors.email
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                    : ''
                }
                defaultValue={state.formData.email}
              />
              {state.errors.email && (
                <p id="email-error" className="text-sm text-red-600">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                placeholder={
                  variant === 'feedback'
                    ? 'Tell us how we can improve our services...'
                    : 'Tell us about your paraglider service needs...'
                }
                rows={5}
                aria-describedby={state.errors.message ? 'message-error' : undefined}
                className={
                  state.errors.message
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                    : ''
                }
                defaultValue={state.formData.message}
              />
              {state.errors.message && (
                <p id="message-error" className="text-sm text-red-600">
                  {state.errors.message}
                </p>
              )}
            </div>
            <div className="flex w-full justify-end">
              <SubmitButton isPending={isPending} loadingText="Sending...">
                <Send />
                Send {variant === 'feedback' ? 'Feedback' : 'Message'}
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
