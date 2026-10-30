import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'danger' | 'secondary' | 'outline' | 'success' | 'warning';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:brightness-110',
  danger: 'bg-danger text-on-accent hover:bg-danger/90',
  secondary: 'bg-surface-2 text-ink border border-line hover:brightness-110',
  outline: 'bg-transparent text-ink border border-line hover:bg-surface-2',
  success: 'bg-success text-on-accent hover:bg-success/90',
  warning: 'bg-warning text-on-accent hover:bg-warning/90',
};

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  className = '',
  fullWidth = false,
  variant = 'primary',
  disabled,
  loading = false,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-[14px] py-[9px] text-body-sm font-semibold rounded-sm transition-all duration-fast active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-60 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
