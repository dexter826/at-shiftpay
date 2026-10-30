import React, { memo } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { Dropdown } from '@/components/ui/Dropdown';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';

export type LocationFilter = 'all' | 'high' | 'none' | 'low';
export type LocationSort = 'name' | 'count' | 'newest';

interface LocationToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filterType: LocationFilter;
  onFilterChange: (value: LocationFilter) => void;
  sortBy: LocationSort;
  onSortChange: (value: LocationSort) => void;
}

const FILTERS: Array<{ value: LocationFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'high', label: 'Tốt' },
  { value: 'none', label: 'Thường' },
  { value: 'low', label: 'Kém' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name', label: 'Tên A–Z' },
  { value: 'count', label: 'Nhiều sự kiện nhất' },
];

const LocationToolbar: React.FC<LocationToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filterType,
  onFilterChange,
  sortBy,
  onSortChange,
}) => (
  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
    <div>
      <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Tìm kiếm</p>
      <SearchInput
        aria-label="Tìm địa điểm"
        placeholder="Tìm địa điểm"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        onClear={onClearSearch}
      />
    </div>

    <div>
      <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Đánh giá</p>
      <div role="group" aria-label="Lọc theo đánh giá" className="flex flex-wrap gap-1">
        {FILTERS.map((filter) => {
          const isActive = filterType === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                'min-h-11 rounded-sm border px-3 text-body-sm font-medium transition-colors duration-fast ease-standard',
                isActive
                  ? 'border-accent bg-accent-soft text-accent-ink'
                  : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
                focusRingOnSurfaceClasses
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="sm:max-w-56">
      <p className="mb-1.5 font-mono text-mono-label text-ink-muted">Sắp xếp</p>
      <Dropdown
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={(value) => {
          if (value === 'newest' || value === 'name' || value === 'count') {
            onSortChange(value);
          }
        }}
        ariaLabel="Sắp xếp địa điểm"
        className="w-full"
        minWidth="min-w-[190px]"
      />
    </div>
  </div>
);

export default memo(LocationToolbar);
