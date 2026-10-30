import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn, focusRingClasses } from '@/lib/utils';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-1', className)} {...props} />
));
RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-ink-muted bg-transparent transition-colors duration-fast ease-standard',
      'hover:border-ink data-[state=checked]:border-accent',
      'disabled:cursor-not-allowed disabled:opacity-50',
      focusRingClasses,
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex h-2 w-2 rounded-full bg-accent" />
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = 'RadioGroupItem';
