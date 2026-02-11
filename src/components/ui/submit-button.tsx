'use client';

import { LoaderCircle } from 'lucide-react';

import { Button } from './button';

export function SubmitButton({
  isPending,
  type = 'submit',
  variant = 'default',
  children = 'Submit',
  loadingText = 'Saving...',
}: {
  isPending: boolean;
  type?: 'button' | 'submit';
  variant?: 'default' | 'ghost';
  children?: React.ReactNode;
  loadingText?: string;
}) {
  return (
    <Button type={type} variant={variant} disabled={isPending}>
      {isPending ? (
        <>
          <LoaderCircle className="w-5 h-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
