import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl',
      outline:
        'border-2 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300',
      ghost: 'text-sky-700 hover:bg-sky-50',
      link: 'text-sky-600 underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-12 px-6 py-3',
      sm: 'h-10 px-4 py-2 text-sm',
      lg: 'h-14 px-8 py-4 text-lg',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
