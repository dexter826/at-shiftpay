import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import XIcon from '@/components/ui/icons/XIcon';
import { AnimatedIconHandle } from '@/components/ui/icons/types';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, EASE_STANDARD } from '@/lib/motion';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// Đếm số modal đang mở để quản lý scroll
let openModalCount = 0;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, footer }) => {
  const closeIconRef = React.useRef<AnimatedIconHandle>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();
  const transition = {
    duration: prefersReducedMotion ? 0 : DURATION_BASE,
    ease: EASE_STANDARD,
  };

  useEffect(() => {
    if (!isOpen) return;

    openModalCount++;
    document.body.style.overflow = 'hidden';

    return () => {
      openModalCount--;
      if (openModalCount === 0) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    if (dialog && !dialog.contains(document.activeElement)) {
      const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? dialog).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-scrim/70 p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`bg-surface w-full md:max-w-md md:rounded-md rounded-t-md max-h-[85vh] flex flex-col border border-line outline-none`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={transition}
          >
            {/* Tiêu đề */}
            <div
              className={`px-4 py-3 border-b border-line flex justify-between items-center flex-shrink-0`}
            >
              <h3 id={titleId} className={`text-title text-ink`}>
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                onMouseEnter={() => closeIconRef.current?.startAnimation()}
                onMouseLeave={() => closeIconRef.current?.stopAnimation()}
                aria-label="Đóng"
                className={`flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
              >
                <XIcon ref={closeIconRef} size={18} />
              </button>
            </div>

            {/* Nội dung */}
            <div className="overflow-y-auto p-4 flex-1">{children}</div>

            {/* Chân trang */}
            {footer && (
              <div className={`px-4 py-3 border-t border-line flex-shrink-0`}>{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
