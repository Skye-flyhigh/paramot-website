'use client';

import { Button } from './button';
import { LoaderCircle } from 'lucide-react';

export function SubmitButton({
  isPending,
  children = 'Submit',
  loadingText = 'Saving...',
}: {
  isPending: boolean;
  children?: React.ReactNode;
  loadingText?: string;
}) {
  return (
    <Button type="submit" disabled={isPending}>
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
