import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { Check, Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
          Chọn thời gian để xuất báo cáo lương và lịch tiệc.
        </p>

        {/* Chọn năm */}
        <div className="flex justify-between items-center px-2 py-2">
          <button
            type="button"
            onClick={() => setSelectedYear((prev) => (prev === 0 ? currentYear : prev - 1))}
            aria-label="Năm trước"
            className={`flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
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
            className={`flex h-10 w-10 items-center justify-center rounded-sm hover:bg-surface-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
          >
            <ChevronRight size={18} className="text-ink-soft" />
          </button>
        </div>

        {/* Chỉ xuất công nợ */}
        <button
          type="button"
          onClick={() => setOnlyDebt(!onlyDebt)}
          aria-pressed={onlyDebt}
          className={`w-full flex items-center justify-between p-3 rounded-md border transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses} ${
            onlyDebt ? 'border-accent bg-surface-2' : 'border-line bg-surface-2'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-sm border transition-colors duration-fast ease-standard ${
                onlyDebt
                  ? 'bg-surface border-line text-accent-ink'
                  : 'bg-surface border-line text-ink-muted'
              }`}
            >
              <Calendar size={18} />
            </div>
            <div className="text-left">
              <p className={`text-body-sm font-semibold text-ink`}>Chỉ xuất sự kiện còn nợ</p>
              <p className="text-label text-ink-muted">Lọc các sự kiện chưa thanh toán hết</p>
            </div>
          </div>
          <div
            className={`w-5 h-5 shrink-0 rounded-xs border-2 flex items-center justify-center transition-colors duration-fast ease-standard ${
              onlyDebt ? 'bg-accent border-accent' : 'border-ink-muted'
            }`}
          >
            {onlyDebt && <Check size={12} className="text-on-accent" strokeWidth={3} />}
          </div>
        </button>

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
                           col-span-3 py-2.5 rounded-sm text-body-sm font-semibold transition-colors duration-fast ease-standard border
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
                            py-2.5 rounded-sm text-body-sm font-semibold transition-colors duration-fast ease-standard border
                            ${
                              isSelected
                                ? 'bg-accent text-on-accent border-accent'
                                : `bg-surface-2 hover:bg-surface border-line text-ink-soft ${
                                    isCurrentMonth ? 'border-accent/45 text-accent-ink' : ''
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
