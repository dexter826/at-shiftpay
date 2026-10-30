import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: 'neutral' | 'success';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  tone = 'neutral',
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-1.5 px-6 py-10 text-center',
      className
    )}
  >
    {icon && (
      <span className={cn('mb-1', tone === 'success' ? 'text-success' : 'text-ink-muted')}>
        {icon}
      </span>
    )}
    <p className="text-body-sm font-semibold text-ink">{title}</p>
    {description && <p className="max-w-sm text-label text-ink-muted">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
