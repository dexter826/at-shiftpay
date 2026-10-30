import React from 'react';
import { cn } from '@/lib/utils';

type TagVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'highlight';

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  neutral: 'border-line bg-surface-2 text-ink-soft',
  success: 'border-success/35 bg-success/10 text-success',
  warning: 'border-warning/35 bg-warning/10 text-warning',
  danger: 'border-danger/35 bg-danger/10 text-danger',
  info: 'border-info/35 bg-info/10 text-info',
  highlight: 'border-highlight-ink/25 bg-highlight text-highlight-ink',
};

export const Tag: React.FC<TagProps> = ({ variant = 'neutral', children, icon, className }) => (
  <span
    className={cn(
      'inline-flex min-h-6 items-center gap-1 rounded-sm border px-2 py-0.5 font-mono text-mono-label font-medium leading-none',
      variantStyles[variant],
      className
    )}
  >
    {icon && <span aria-hidden="true">{icon}</span>}
    {children}
  </span>
);
