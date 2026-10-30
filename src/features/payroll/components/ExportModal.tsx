import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Checkbox from '@/components/ui/Checkbox';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isExporting?: boolean;
  onExport: (month: number, year: number, onlyDebt: boolean) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  isExporting = false,
  onExport,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [onlyDebt, setOnlyDebt] = useState(true);

  const handleExport = () => {
    onExport(selectedMonth, selectedYear, onlyDebt);
  };

  const isAllSelected = selectedMonth === 0;

  return (
    <Modal
      title="Xuất báo cáo chi tiết"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isExporting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            className="flex-1"
            disabled={isExporting}
          >
            <Download size={16} className="text-on-accent" />
            {isExporting ? 'Đang xuất...' : 'Xuất CSV'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className={`text-body-sm text-ink-soft`}>
          Chọn thời gian để xuất báo cáo lương và lịch sự kiện.
        </p>

        {/* Chọn năm */}
        <div className="flex justify-between items-center px-2 py-2">
          <button
            type="button"
            onClick={() => setSelectedYear((prev) => (prev === 0 ? currentYear : prev - 1))}
            aria-label="Năm trước"
            className={`flex h-11 w-11 items-center justify-center rounded-sm hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          >
            <ChevronLeft size={18} className="text-ink-soft" />
          </button>
          <span className={`text-body font-semibold text-ink tabular-nums`}>
            {selectedYear === 0 ? 'Tất cả các năm' : `Năm ${selectedYear}`}
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear((prev) => (prev === 0 ? currentYear : prev + 1))}
            aria-label="Năm sau"
            className={`flex h-11 w-11 items-center justify-center rounded-sm hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          >
            <ChevronRight size={18} className="text-ink-soft" />
          </button>
        </div>

        {/* Chỉ xuất công nợ */}
        <div
          className={`w-full rounded-sm border p-3 transition-colors duration-fast ease-standard ${
            onlyDebt ? 'border-accent bg-surface-2' : 'border-line bg-surface-2'
          }`}
        >
          <Checkbox checked={onlyDebt} onChange={setOnlyDebt}>
            <span className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line bg-surface ${
                  onlyDebt ? 'text-accent-ink' : 'text-ink-muted'
                }`}
              >
                <Calendar size={18} aria-hidden="true" />
              </span>
              <span className="text-left">
                <span className="block text-body-sm font-semibold text-ink">
                  Chỉ xuất sự kiện còn nợ
                </span>
                <span className="block text-label font-medium text-ink-muted">
                  Lọc các sự kiện chưa thanh toán hết
                </span>
              </span>
            </span>
          </Checkbox>
        </div>

        {/* Lưới chọn tháng */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedYear(0);
              } else {
                setSelectedMonth(0);
              }
            }}
            className={`
                           col-span-3 min-h-11 py-2.5 rounded-sm text-body-sm font-semibold transition-colors duration-fast ease-standard border ${focusRingOnSurfaceClasses}
                           ${
                             isAllSelected
                               ? 'bg-accent text-on-accent border-accent'
                               : 'bg-surface-2 hover:bg-surface border-line text-ink-soft'
                           }
                        `}
          >
            {selectedYear === 0 ? 'Tất cả thời gian' : `Cả năm ${selectedYear}`}
          </button>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
            const isSelected = selectedMonth === month;
            const isCurrentMonth =
              new Date().getMonth() + 1 === month && new Date().getFullYear() === selectedYear;

            return (
              <button
                key={month}
                type="button"
                onClick={() => {
                  setSelectedMonth(month);
                  if (selectedYear === 0) {
                    setSelectedYear(currentYear);
                  }
                }}
                className={`
                          min-h-11 py-2.5 rounded-sm text-body-sm font-semibold tabular-nums transition-colors duration-fast ease-standard border ${focusRingOnSurfaceClasses}
                            ${
                              isSelected
                                ? 'bg-accent text-on-accent border-accent'
                                : `bg-surface-2 hover:bg-surface border-line text-ink-soft ${
                                    isCurrentMonth ? 'border-accent text-ink' : ''
                                  }`
                            }
                        `}
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
