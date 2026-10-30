import React, { memo } from 'react';
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
          onClick={onGoToToday}
          className={`px-2.5 py-1.5 text-label font-medium rounded border border-line hover:bg-line transition-colors mr-1 flex items-center gap-1`}
        >
          <Calendar size={12} />
          Hôm nay
        </button>
        <button
          onClick={onPrevMonth}
          aria-label="Tháng trước"
          className={`p-2 text-ink-muted hover:bg-line rounded transition-colors`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNextMonth}
          aria-label="Tháng sau"
          className={`p-2 text-ink-muted hover:bg-line rounded transition-colors`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <h3 className={`text-sm font-medium text-ink capitalize`}>{monthLabel}</h3>
      <div className="flex items-center gap-1">
        {onNavigateToReviews && (
          <button
            onClick={onNavigateToReviews}
            title="Quản lý địa điểm"
            className={`h-9 w-9 flex items-center justify-center hover:bg-line rounded transition-colors text-accent-ink`}
          >
            <MapPin size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(CalendarHeader);
