import React, { useState, useRef, useEffect } from 'react';
import '@ncdai/react-wheel-picker/style.css';
import * as WheelPickerPrimitive from '@ncdai/react-wheel-picker';
import { focusRingClasses, cn } from '@/lib/utils';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption;
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

/**
 * Wrapper cho bộ chọn vòng xoay.
 */
function WheelPickerWrapper({
  className,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        'rounded-sm border border-line px-1',
        'bg-surface',
        '[&>[data-rwp]]:first:[&>[data-rwp-highlight-wrapper]]:rounded-s-xs',
        '[&>[data-rwp]]:last:[&>[data-rwp-highlight-wrapper]]:rounded-e-xs',
        className
      )}
      {...props}
    />
  );
}

/**
 * Component bộ chọn vòng xoay đơn lẻ.
 */
function WheelPicker({
  classNames,
  ...props
}: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn('text-body', 'text-ink-muted'),
        highlightWrapper: cn('font-semibold text-title', 'bg-surface-2', 'text-ink'),
        ...classNames,
      }}
      {...props}
    />
  );
}

interface TimePickerProps {
  value: string; // Định dạng HH:mm
  onChange: (value: string) => void;
  className?: string;
}

const hoursOptions = Array.from({ length: 24 }, (_, i) => ({
  label: i.toString().padStart(2, '0'),
  value: i,
}));

const minutesOptions = Array.from({ length: 60 }, (_, i) => ({
  label: i.toString().padStart(2, '0'),
  value: i,
}));

/**
 * Component chọn giờ chính.
 */
export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [hours, minutes] = value ? value.split(':').map(Number) : [7, 30];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  const handleHourChange = (newHour: string | number) => {
    onChange(`${formatNumber(Number(newHour))}:${formatNumber(minutes)}`);
  };

  const handleMinuteChange = (newMinute: string | number) => {
    onChange(`${formatNumber(hours)}:${formatNumber(Number(newMinute))}`);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Chọn giờ ${formatNumber(hours)}:${formatNumber(minutes)}`}
        className={cn(
          'w-full px-3.5 py-2.5 border rounded-sm text-body-sm flex items-center justify-between transition-colors duration-fast ease-standard bg-surface-2 border-line text-ink hover:border-ink-muted focus:outline-none',
          focusRingClasses
        )}
      >
        <span className="flex items-center gap-2">
          <Clock size={14} className="text-ink-muted" />
          {formatNumber(hours)}:{formatNumber(minutes)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        >
          <ChevronDown size={14} className="text-ink-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { type: 'spring', damping: 20, stiffness: 300 }
            }
            className={cn(
              'absolute top-full left-0 right-0 mt-1 p-3 border rounded-sm z-50 bg-surface border-line'
            )}
          >
            <div className="flex justify-center">
              <WheelPickerWrapper className="w-full h-40">
                <WheelPicker
                  options={hoursOptions}
                  value={hours}
                  onValueChange={handleHourChange}
                />
                <div className={cn('flex items-center px-1 font-bold', 'text-ink-muted')}>:</div>
                <WheelPicker
                  options={minutesOptions}
                  value={minutes}
                  onValueChange={handleMinuteChange}
                />
              </WheelPickerWrapper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };
