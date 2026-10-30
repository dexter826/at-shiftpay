import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, leadingIcon, trailingAction, type = 'text', ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={cn(
          'flex min-h-11 w-full rounded-sm border border-line bg-surface py-2 text-base text-ink placeholder:text-ink-muted',
          'transition-colors duration-fast ease-standard hover:border-line-strong',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
          leadingIcon ? 'pl-9' : 'pl-3',
          trailingAction ? 'pr-12' : 'pr-3',
          className
        )}
        {...props}
      />
    );

    if (!leadingIcon && !trailingAction) return input;

    return (
      <div className="relative w-full">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
            {leadingIcon}
          </span>
        )}
        {input}
        {trailingAction && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-1">
            {trailingAction}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
