import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn, focusRingClasses } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id, disabled }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex min-h-11 cursor-pointer select-none items-center gap-2.5 py-1.5',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <CheckboxPrimitive.Root
        id={inputId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(value === true)}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-fast ease-standard',
          'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
          'data-[state=unchecked]:border-ink-muted data-[state=unchecked]:bg-transparent',
          'hover:border-ink',
          focusRingClasses
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-on-accent">
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <span className="text-label font-medium text-ink-muted">{label}</span>}
    </label>
  );
};

export default Checkbox;
