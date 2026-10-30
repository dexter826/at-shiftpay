import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn, focusRingClasses } from '@/lib/utils';

type ButtonVariant = 'primary' | 'danger' | 'secondary' | 'outline' | 'success' | 'warning';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:brightness-110 border border-accent',
  danger: 'bg-danger text-on-accent hover:brightness-110 border border-danger',
  secondary: 'bg-surface-2 text-ink border border-line hover:border-line-strong',
  outline: 'bg-transparent text-ink border border-line-strong hover:bg-surface-2',
  success: 'bg-success text-on-accent hover:brightness-110 border border-success',
  warning: 'bg-warning text-on-accent hover:brightness-110 border border-warning',
};

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  className = '',
  fullWidth = false,
  variant = 'primary',
  disabled,
  loading = false,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-body-sm font-semibold transition-all duration-fast ease-standard active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        focusRingClasses,
        fullWidth && 'w-full',
        variantStyles[variant],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          <span className="sr-only">{children}</span>
        </>
      ) : (
        <>
          {icon && <span aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
