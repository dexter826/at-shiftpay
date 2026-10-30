import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

interface PayrollMonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterDate: string;
  setFilterDate: (date: string) => void;
  viewYear: number;
  setViewYear: React.Dispatch<React.SetStateAction<number>>;
}

const PayrollMonthPickerModal: React.FC<PayrollMonthPickerModalProps> = ({
  isOpen,
  onClose,
  filterDate,
  setFilterDate,
  viewYear,
  setViewYear,
}) => (
  <Modal
    title="Chọn tháng"
    isOpen={isOpen}
    onClose={onClose}
    footer={
      <Button
        variant="secondary"
        fullWidth
        onClick={() => {
          setFilterDate('');
          onClose();
        }}
      >
        Bỏ lọc tháng
      </Button>
    }
  >
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => setViewYear((previous) => previous - 1)}
          aria-label="Năm trước"
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-sm text-ink-soft transition-colors duration-fast ease-standard hover:bg-surface-2',
            focusRingOnSurfaceClasses
          )}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <span className="font-mono text-body font-semibold text-ink tabular-nums">{viewYear}</span>
        <button
          type="button"
          onClick={() => setViewYear((previous) => previous + 1)}
          aria-label="Năm sau"
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-sm text-ink-soft transition-colors duration-fast ease-standard hover:bg-surface-2',
            focusRingOnSurfaceClasses
          )}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
          const value = `${viewYear}-${String(month).padStart(2, '0')}`;
          const isSelected = filterDate === value;
          const isCurrentMonth =
            new Date().getMonth() + 1 === month && new Date().getFullYear() === viewYear;

          return (
            <button
              key={month}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                setFilterDate(value);
                onClose();
              }}
              className={cn(
                'min-h-11 rounded-sm border text-body-sm font-semibold tabular-nums transition-colors duration-fast ease-standard',
                isSelected
                  ? 'border-accent bg-accent text-on-accent'
                  : 'border-line bg-surface text-ink-soft hover:bg-surface-2',
                isCurrentMonth && !isSelected && 'border-accent text-ink',
                focusRingOnSurfaceClasses
              )}
            >
              Tháng {month}
            </button>
          );
        })}
      </div>
    </div>
  </Modal>
);

export default memo(PayrollMonthPickerModal);
