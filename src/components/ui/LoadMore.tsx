import React from 'react';
import { Plus } from 'lucide-react';
import { focusRingClasses } from '@/lib/utils';

interface LoadMoreProps {
  currentCount: number;
  totalCount: number;
  onLoadMore: () => void;
  unit: string;
  className?: string;
}

export const LoadMore: React.FC<LoadMoreProps> = ({
  currentCount,
  totalCount,
  onLoadMore,
  unit,
  className = '',
}) => {
  if (currentCount >= totalCount) return null;

  return (
    <div className={`col-span-full flex flex-col items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onLoadMore}
        className={`flex items-center gap-2 px-[14px] py-2.5 rounded-sm text-body-sm font-semibold transition-all duration-fast ease-standard border border-line bg-surface text-ink hover:border-ink-muted active:scale-[0.98] ${focusRingClasses}`}
      >
        <span>Xem thêm</span>
        <Plus size={14} />
      </button>
      <div className="text-label text-ink-muted tabular-nums">
        {Math.min(currentCount, totalCount)} / {totalCount} {unit}
      </div>
    </div>
  );
};
