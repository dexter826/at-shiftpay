import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn, focusRingClasses } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('flex items-center gap-1 border-b border-line', className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex min-h-11 items-center justify-center border-b-2 border-transparent px-3 text-body-sm font-medium text-ink-muted transition-colors duration-fast ease-standard',
      'hover:text-ink data-[state=active]:border-accent data-[state=active]:text-ink',
      'disabled:cursor-not-allowed disabled:opacity-50',
      focusRingClasses,
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
