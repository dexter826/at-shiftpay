import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex min-h-11 w-full rounded-sm border border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-ink-muted',
        'transition-colors duration-fast ease-standard hover:border-line-strong',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
