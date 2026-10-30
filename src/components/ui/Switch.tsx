import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn, focusRingClasses } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled,
  label,
  id,
  className,
  'aria-label': ariaLabel,
}) => {
  const switchControl = (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-sm border border-line transition-colors duration-fast ease-standard',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        'data-[state=unchecked]:bg-surface-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        focusRingClasses,
        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-xs border border-line bg-canvas transition-transform duration-fast ease-standard',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label) return switchControl;

  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer select-none items-center gap-2.5">
      {switchControl}
      <span className="text-body-sm text-ink">{label}</span>
    </label>
  );
};

export default Switch;
