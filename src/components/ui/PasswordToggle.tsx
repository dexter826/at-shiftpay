import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface PasswordToggleProps {
  visible: boolean;
  onToggle: () => void;
  label: string;
}

export const PasswordToggle: React.FC<PasswordToggleProps> = ({ visible, onToggle, label }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={label}
    className={cn(
      'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:text-ink',
      focusRingOnSurfaceClasses
    )}
  >
    {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
  </button>
);
