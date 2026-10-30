import React, { memo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface CalendarHeaderProps {
  displayDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onAddEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayDate,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onAddEvent,
}) => {
  const monthLabel = `Tháng ${displayDate.getMonth() + 1} · ${displayDate.getFullYear()}`;

  return (
    <header className="flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p aria-live="polite" className="font-mono text-mono-label text-ink-muted">
            {monthLabel}
          </p>
          <h1 className="mt-1 text-display text-ink">Lịch sự kiện</h1>
        </div>
        <Button onClick={onAddEvent} icon={<Plus size={16} />} className="md:hidden">
          Thêm sự kiện
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="w-11 px-0"
            onClick={onPrevMonth}
            aria-label="Tháng trước"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          <Button variant="outline" onClick={onGoToToday}>
            Hôm nay
          </Button>
          <Button
            variant="outline"
            className="w-11 px-0"
            onClick={onNextMonth}
            aria-label="Tháng sau"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <Button onClick={onAddEvent} icon={<Plus size={16} />} className="hidden md:inline-flex">
          Thêm sự kiện
        </Button>
      </div>
    </header>
  );
};

export default memo(CalendarHeader);
