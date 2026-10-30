import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { focusRingOnSurfaceClasses } from '@/lib/utils';

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
}) => {
  return (
    <Modal
      title="Chọn thời gian"
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
          Xem tất cả lịch sử
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-4 py-2 bg-surface-2 rounded-md border border-dashed border-line">
          <button
            type="button"
            onClick={() => setViewYear((prev) => prev - 1)}
            aria-label="Năm trước"
            className={`flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          >
            <ChevronLeft size={18} className="text-ink-soft" />
          </button>
          <span className={`text-body font-semibold text-ink tabular-nums`}>Năm {viewYear}</span>
          <button
            type="button"
            onClick={() => setViewYear((prev) => prev + 1)}
            aria-label="Năm sau"
            className={`flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          >
            <ChevronRight size={18} className="text-ink-soft" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const monthStr = month.toString().padStart(2, '0');
            const value = `${viewYear}-${monthStr}`;
            const isSelected = filterDate === value;
            const isCurrentMonth =
              new Date().getMonth() + 1 === month && new Date().getFullYear() === viewYear;

            return (
              <button
                key={month}
                type="button"
                onClick={() => {
                  setFilterDate(value);
                  onClose();
                }}
                className={`py-2.5 rounded-sm text-body-sm font-semibold transition-colors duration-fast ease-standard border ${focusRingOnSurfaceClasses} ${
                  isSelected
                    ? 'bg-accent text-on-accent border-accent'
                    : `bg-surface-2 hover:bg-surface border-line text-ink-soft ${isCurrentMonth ? 'border-accent/45 text-accent-ink' : ''}`
                }`}
              >
                Tháng {month}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default memo(PayrollMonthPickerModal);
