import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  size = 'md',
}) => {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-scrim/60 data-[state=open]:animate-overlay-in"
          onClick={onClose}
        />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4">
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className={cn(
              'pointer-events-auto flex max-h-[85dvh] w-full flex-col overflow-hidden border border-line bg-surface outline-none',
              'rounded-t-sm md:rounded-sm',
              size === 'lg' ? 'md:max-w-2xl' : 'md:max-w-md',
              'data-[state=open]:animate-content-in'
            )}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
              <DialogPrimitive.Title className="text-title text-ink">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  aria-label="Đóng"
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
                    focusRingOnSurfaceClasses
                  )}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex-1 overflow-y-auto p-4">{children}</div>

            {footer && <div className="shrink-0 border-t border-line px-4 py-3">{footer}</div>}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
