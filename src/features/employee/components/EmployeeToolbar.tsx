import React, { memo } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { Dropdown } from '@/components/ui/Dropdown';

export type EmployeeSort = 'name' | 'shifts' | 'recent';

interface EmployeeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sortBy: EmployeeSort;
  onSortChange: (value: EmployeeSort) => void;
  loading?: boolean;
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Tên A–Z' },
  { value: 'shifts', label: 'Nhiều ca chưa trả' },
  { value: 'recent', label: 'Mới nhất' },
];

const EmployeeToolbar: React.FC<EmployeeToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange,
  loading = false,
}) => (
  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
    <div>
      <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Tìm kiếm</p>
      <SearchInput
        aria-label="Tìm nhân viên"
        placeholder="Tên hoặc số điện thoại"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        onClear={onClearSearch}
        disabled={loading}
      />
    </div>

    <div className="sm:max-w-56">
      <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Sắp xếp</p>
      <Dropdown
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={(value) => {
          if (value === 'name' || value === 'shifts' || value === 'recent') {
            onSortChange(value);
          }
        }}
        ariaLabel="Sắp xếp nhân viên"
        disabled={loading}
        className="w-full"
        minWidth="min-w-[190px]"
      />
    </div>
  </div>
);

export default memo(EmployeeToolbar);
