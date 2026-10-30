import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}) => {
  const generatedId = useId();
  const fieldId = htmlFor ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = errorId ?? hintId;

  const control = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="block text-body-sm font-medium text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {control}
      {error ? (
        <p id={errorId} role="alert" className="text-label text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-label text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
