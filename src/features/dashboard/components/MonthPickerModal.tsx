import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onChange: (date: Date) => void;
}

/**
 * Hộp thoại chọn tháng và năm trực quan
 */
export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onChange,
}) => {
  const [tempYear, setTempYear] = useState<number>(selectedDate.getFullYear());

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- form state initialized from props when the modal opens
      setTempYear(selectedDate.getFullYear());
    }
  }, [isOpen, selectedDate]);

  const handleSelectMonth = (monthIndex: number) => {
    onChange(new Date(tempYear, monthIndex, 1));
    onClose();
  };

  const handleGoToCurrentMonth = () => {
    const now = new Date();
    onChange(new Date(now.getFullYear(), now.getMonth(), 1));
    onClose();
  };

  const months = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  return (
    <Modal
      title="Chọn thời gian hiển thị"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Đóng
          </Button>
          <Button variant="primary" onClick={handleGoToCurrentMonth} className="flex-1 gap-1.5">
            <Calendar size={16} className="text-white" />
            Tháng hiện tại
          </Button>
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* Chọn năm */}
        <div className="flex justify-between items-center px-4 py-2 bg-surface-2 rounded-lg border border-dashed border-line">
          <button
            onClick={() => setTempYear((prev) => prev - 1)}
            className={`p-2 rounded-lg hover:bg-surface-2 transition-colors`}
          >
            <ChevronLeft size={18} className="text-ink-soft" />
          </button>
          <span className={`text-base font-bold text-ink`}>Năm {tempYear}</span>
          <button
            onClick={() => setTempYear((prev) => prev + 1)}
            className={`p-2 rounded-lg hover:bg-surface-2 transition-colors`}
          >
            <ChevronRight size={18} className="text-ink-soft" />
          </button>
        </div>

        {/* Chọn tháng */}
        <div className="grid grid-cols-3 gap-2.5">
          {months.map((monthLabel, index) => {
            const isSelected =
              selectedDate.getMonth() === index && selectedDate.getFullYear() === tempYear;
            const isCurrentMonth =
              new Date().getMonth() === index && new Date().getFullYear() === tempYear;

            return (
              <button
                key={index}
                onClick={() => handleSelectMonth(index)}
                className={`
                                    py-3 rounded-lg text-xs font-semibold transition-all border
                                    ${
                                      isSelected
                                        ? 'bg-accent text-on-accent border-accent shadow-sm shadow-accent/20 scale-[0.98]'
                                        : `
                                            ${'bg-surface-2 hover:bg-surface border-line text-ink-soft'}
                                            ${isCurrentMonth ? 'border-accent/45 text-accent-ink' : ''}
                                        `
                                    }
                                `}
              >
                {monthLabel}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
