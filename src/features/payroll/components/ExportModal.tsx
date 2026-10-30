import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
        <p className={`text-sm text-ink-soft`}>
          Chọn thời gian để xuất báo cáo lương và lịch tiệc.
        </p>

        {/* Chọn năm */}
        <div className="flex justify-between items-center px-2 py-2">
          <button
            onClick={() => setSelectedYear((prev) => (prev === 0 ? currentYear : prev - 1))}
            className={`p-1 rounded-full hover:bg-line`}
          >
            <ChevronLeft size={20} className="text-ink-soft" />
          </button>
          <span className={`text-lg font-bold text-ink`}>
            {selectedYear === 0 ? 'Tất cả các năm' : `Năm ${selectedYear}`}
          </span>
          <button
            onClick={() => setSelectedYear((prev) => (prev === 0 ? currentYear : prev + 1))}
            className={`p-1 rounded-full hover:bg-line`}
          >
            <ChevronRight size={20} className="text-ink-soft" />
          </button>
        </div>

        {/* Chỉ xuất công nợ */}
        <div
          onClick={() => setOnlyDebt(!onlyDebt)}
          className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                        ${
                          onlyDebt
                            ? 'border-accent bg-accent/5 ring-1 ring-accent/20'
                            : `border-line bg-surface-2`
                        }
                    `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                            p-2 rounded-lg border transition-colors
                            ${
                              onlyDebt
                                ? 'bg-accent/10 border-accent/30 text-accent-ink'
                                : 'bg-surface border-line text-slate-400'
                            }
                        `}
            >
              <Calendar size={18} />
            </div>
            <div>
              <p className={`text-sm font-bold ${onlyDebt ? 'text-accent-ink' : 'text-ink'}`}>
                Chỉ xuất sự kiện còn nợ
              </p>
              <p className="text-xs text-slate-500">Lọc các sự kiện chưa thanh toán hết</p>
            </div>
          </div>
          <div
            className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${onlyDebt ? 'border-accent bg-accent' : 'border-slate-300'}
                    `}
          >
            {onlyDebt && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* Lưới chọn tháng */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedYear(0);
              } else {
                setSelectedMonth(0);
              }
            }}
            className={`
                           col-span-3 py-3 rounded-lg text-sm font-medium transition-colors border
                           ${
                             isAllSelected
                               ? 'bg-accent text-on-accent border-accent'
                               : `
                                  bg-surface-2 hover:bg-line
                                  border-line text-ink-soft
                               `
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
                onClick={() => {
                  setSelectedMonth(month);
                  if (selectedYear === 0) {
                    setSelectedYear(currentYear);
                  }
                }}
                className={`
                            py-3 rounded-lg text-sm font-medium transition-colors border
                            ${
                              isSelected
                                ? 'bg-accent text-on-accent border-accent'
                                : `
                                  bg-surface-2 hover:bg-line
                                  border-line text-ink-soft
                                  ${isCurrentMonth ? 'border-accent/50 text-accent-ink' : ''}
                               `
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
