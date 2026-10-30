import React, { memo } from 'react';
import { focusRingOnSurfaceClasses } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface CalendarHeaderProps {
  displayDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onNavigateToReviews?: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onNavigateToReviews,
}) => {
  const monthLabel = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(
    displayDate
  );

  return (
    <div className={`flex items-center justify-between px-4 py-3 border-b border-line`}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onGoToToday}
          className={`min-h-10 px-3 text-label font-medium rounded-sm border border-line hover:bg-surface-2 transition-colors duration-fast ease-standard mr-1 flex items-center gap-1 ${focusRingOnSurfaceClasses}`}
        >
          <Calendar size={12} />
          Hôm nay
        </button>
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Tháng trước"
          className={`flex h-10 w-10 items-center justify-center text-ink-muted hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Tháng sau"
          className={`flex h-10 w-10 items-center justify-center text-ink-muted hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <h3 className={`text-body-sm font-medium text-ink capitalize`}>{monthLabel}</h3>
      <div className="flex items-center gap-1">
        {onNavigateToReviews && (
          <button
            type="button"
            onClick={onNavigateToReviews}
            aria-label="Quản lý địa điểm"
            className={`flex h-10 w-10 items-center justify-center hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard text-accent-ink ${focusRingOnSurfaceClasses}`}
          >
            <MapPin size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(CalendarHeader);
