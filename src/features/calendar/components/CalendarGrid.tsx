import React, { memo, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { Event, Location, Shift } from '@/types/index';
import CalendarDay from '@/features/calendar/components/CalendarDay';
import { toDateKey } from '@/utils/format';

interface CalendarGridProps {
  daysInMonth: Date[];
  displayDate: Date;
  eventsByDate: Record<string, Event[]>;
  shiftsByEvent: Record<string, Shift[]>;
  selectedDate: string | null;
  locations: Location[];
  loading?: boolean;
  onDateClick: (date: Date) => void;
}

const WEEKDAYS = [
  { short: 'T2', full: 'Thứ hai' },
  { short: 'T3', full: 'Thứ ba' },
  { short: 'T4', full: 'Thứ tư' },
  { short: 'T5', full: 'Thứ năm' },
  { short: 'T6', full: 'Thứ sáu' },
  { short: 'T7', full: 'Thứ bảy' },
  { short: 'CN', full: 'Chủ nhật' },
];

const CalendarGrid: React.FC<CalendarGridProps> = ({
  daysInMonth,
  displayDate,
  eventsByDate,
  shiftsByEvent,
  selectedDate,
  locations,
  loading = false,
  onDateClick,
}) => {
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const monthKey = `${displayDate.getMonth()}-${displayDate.getFullYear()}`;
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const dayKeys = useMemo(() => new Set(daysInMonth.map((date) => toDateKey(date))), [daysInMonth]);
  const defaultKey = useMemo(() => {
    const currentMonthDay =
      daysInMonth.find((date) => date.getMonth() === displayDate.getMonth()) ?? daysInMonth[0];
    return currentMonthDay ? toDateKey(currentMonthDay) : '';
  }, [daysInMonth, displayDate]);
  const activeKey =
    focusedKey && dayKeys.has(focusedKey)
      ? focusedKey
      : selectedDate && dayKeys.has(selectedDate)
        ? selectedDate
        : defaultKey;

  const weeks = useMemo(
    () => Array.from({ length: 6 }, (_, index) => daysInMonth.slice(index * 7, index * 7 + 7)),
    [daysInMonth]
  );

  const focusDay = (index: number) => {
    const nextIndex = Math.max(0, Math.min(daysInMonth.length - 1, index));
    const nextDate = daysInMonth[nextIndex];
    if (!nextDate) return;
    const nextKey = toDateKey(nextDate);
    setFocusedKey(nextKey);
    buttonRefs.current[nextKey]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = index - 1;
        break;
      case 'ArrowRight':
        nextIndex = index + 1;
        break;
      case 'ArrowUp':
        nextIndex = index - 7;
        break;
      case 'ArrowDown':
        nextIndex = index + 7;
        break;
      case 'Home':
        nextIndex = index - (index % 7);
        break;
      case 'End':
        nextIndex = index + (6 - (index % 7));
        break;
      default:
        return;
    }

    event.preventDefault();
    focusDay(nextIndex);
  };

  const handleSelect = (date: Date) => {
    setFocusedKey(toDateKey(date));
    onDateClick(date);
  };

  if (loading) {
    return (
      <div aria-busy="true" aria-label="Đang tải lịch">
        <div aria-hidden="true" className="grid grid-cols-7 border-b border-line">
          {WEEKDAYS.map((day) => (
            <div
              key={day.short}
              className="py-2 text-center font-mono text-mono-label text-ink-muted"
            >
              {day.short}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 42 }, (_, index) => (
            <div
              key={index}
              className={cn(
                'min-h-11 p-1.5 md:min-h-[112px]',
                index % 7 !== 0 && 'border-l border-line',
                Math.floor(index / 7) < 5 && 'border-b border-line'
              )}
            >
              <Skeleton className="h-5 w-6 md:h-6 md:w-7" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="grid"
      aria-label={`Lịch tháng ${displayDate.getMonth() + 1}/${displayDate.getFullYear()}`}
    >
      <div role="row" className="grid grid-cols-7 border-b border-line">
        {WEEKDAYS.map((day) => (
          <div
            key={day.short}
            role="columnheader"
            aria-label={day.full}
            className="py-2 text-center font-mono text-mono-label text-ink-muted"
          >
            {day.short}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div
          key={`${monthKey}-${weekIndex}`}
          role="row"
          className={cn('grid grid-cols-7', weekIndex < 5 && 'border-b border-line')}
        >
          {week.map((date, dayIndex) => {
            const index = weekIndex * 7 + dayIndex;
            const dateStr = toDateKey(date);
            const dayEvents = eventsByDate[dateStr] ?? [];

            return (
              <CalendarDay
                key={dateStr}
                date={date}
                events={dayEvents}
                shiftsByEvent={shiftsByEvent}
                locations={locations}
                isSelected={selectedDate === dateStr}
                isToday={todayKey === dateStr}
                isCurrentMonth={date.getMonth() === displayDate.getMonth()}
                isFirstColumn={dayIndex === 0}
                tabIndex={activeKey === dateStr ? 0 : -1}
                onSelect={handleSelect}
                onKeyDown={(event) => handleKeyDown(event, index)}
                registerRef={(element) => {
                  buttonRefs.current[dateStr] = element;
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default memo(CalendarGrid);
