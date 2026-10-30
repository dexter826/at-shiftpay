import React, { memo } from 'react';
import { Calendar } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import { Dropdown } from '@/components/ui/Dropdown';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

export type PayrollTab = 'debt' | 'history';
export type PayrollSort = 'amount' | 'shifts' | 'name';

interface PayrollFiltersProps {
  activeTab: PayrollTab;
  loading?: boolean;
  payrollSearchTerm: string;
  onPayrollSearchChange: (value: string) => void;
  payrollSortBy: PayrollSort;
  onPayrollSortChange: (value: PayrollSort) => void;
  historySearchTerm: string;
  onHistorySearchChange: (value: string) => void;
  filterDate: string;
  historySince: number;
  onOpenMonthPicker: () => void;
}

const SORT_OPTIONS = [
  { value: 'amount', label: 'Số tiền còn trả' },
  { value: 'shifts', label: 'Nhiều ca chưa trả' },
  { value: 'name', label: 'Tên A–Z' },
];

const formatMonthYear = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  activeTab,
  loading = false,
  payrollSearchTerm,
  onPayrollSearchChange,
  payrollSortBy,
  onPayrollSortChange,
  historySearchTerm,
  onHistorySearchChange,
  filterDate,
  historySince,
  onOpenMonthPicker,
}) => {
  if (activeTab === 'debt') {
    return (
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Tìm kiếm</p>
          <SearchInput
            aria-label="Tìm nhân viên"
            placeholder="Tên hoặc số điện thoại"
            value={payrollSearchTerm}
            onChange={(event) => onPayrollSearchChange(event.target.value)}
            onClear={() => onPayrollSearchChange('')}
            disabled={loading}
          />
        </div>
        <div className="sm:max-w-56">
          <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Sắp xếp</p>
          <Dropdown
            options={SORT_OPTIONS}
            value={payrollSortBy}
            onChange={(value) => {
              if (value === 'amount' || value === 'shifts' || value === 'name') {
                onPayrollSortChange(value);
              }
            }}
            ariaLabel="Sắp xếp công nợ"
            disabled={loading}
            className="w-full"
            minWidth="min-w-[190px]"
          />
        </div>
      </div>
    );
  }

  const periodLabel = filterDate
    ? `Tháng ${filterDate.split('-')[1]}/${filterDate.split('-')[0]}`
    : `Từ tháng ${formatMonthYear(historySince)}`;

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div>
        <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Tìm kiếm</p>
        <SearchInput
          aria-label="Tìm giao dịch theo nhân viên"
          placeholder="Tên nhân viên"
          value={historySearchTerm}
          onChange={(event) => onHistorySearchChange(event.target.value)}
          onClear={() => onHistorySearchChange('')}
          disabled={loading}
        />
      </div>
      <div>
        <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Thời gian</p>
        <button
          type="button"
          onClick={onOpenMonthPicker}
          disabled={loading}
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-sm border border-line bg-surface px-3 text-body-sm text-ink transition-colors duration-fast ease-standard hover:border-line-strong disabled:cursor-not-allowed disabled:opacity-50',
            focusRingOnSurfaceClasses
          )}
        >
          <Calendar
            size={15}
            aria-hidden="true"
            className={filterDate ? 'text-accent-ink' : 'text-ink-muted'}
          />
          <span className="tabular-nums">{periodLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default memo(PayrollFilters);
