import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'flex min-h-24 w-full resize-y rounded-sm border border-line bg-surface px-3 py-2 text-base text-ink placeholder:text-ink-muted',
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
Textarea.displayName = 'Textarea';

export { Textarea };
