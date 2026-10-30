import React, { memo } from 'react';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';
import { Event, Location, Shift } from '@/types/index';

interface CalendarDayProps {
  date: Date;
  events: Event[];
  shiftsByEvent: Record<string, Shift[]>;
  locations: Location[];
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  isFirstColumn: boolean;
  tabIndex: number;
  onSelect: (date: Date) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLButtonElement>;
  registerRef: (element: HTMLButtonElement | null) => void;
}

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  shiftsByEvent,
  locations,
  isSelected,
  isToday,
  isCurrentMonth,
  isFirstColumn,
  tabIndex,
  onSelect,
  onKeyDown,
  registerRef,
}) => {
  const eventCount = events.length;
  const needsStaffing = events.some((event) => (shiftsByEvent[event.id]?.length ?? 0) === 0);
  const dateLabel = `${WEEKDAYS[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
  const eventLabel =
    eventCount === 0
      ? 'chưa có sự kiện'
      : `${eventCount} sự kiện${needsStaffing ? ', cần xếp' : ''}`;
  const ariaLabel = `${dateLabel}${isCurrentMonth ? '' : ' (tháng khác)'}, ${eventLabel}`;

  return (
    <button
      ref={registerRef}
      type="button"
      role="gridcell"
      aria-label={ariaLabel}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
      tabIndex={tabIndex}
      onClick={() => onSelect(date)}
      onKeyDown={onKeyDown}
      className={cn(
        'relative flex h-full w-full flex-col gap-1 p-1.5 text-center transition-colors duration-fast ease-standard',
        'min-h-11 md:min-h-[112px] md:items-stretch md:text-left',
        isFirstColumn ? '' : 'border-l border-line',
        isSelected
          ? 'bg-accent-soft'
          : isToday
            ? 'bg-accent-soft/40'
            : isCurrentMonth
              ? 'bg-surface hover:bg-surface-2'
              : 'bg-surface-2/40 hover:bg-surface-2',
        focusRingOnSurfaceClasses
      )}
    >
      <span
        className={cn(
          'mx-auto inline-flex h-6 min-w-6 items-center justify-center rounded-sm px-1 font-mono text-label md:mx-0 md:h-7 md:min-w-7 md:text-body-sm',
          isSelected
            ? 'bg-accent font-semibold text-on-accent'
            : isToday
              ? 'border border-accent text-accent-ink'
              : isCurrentMonth
                ? 'text-ink'
                : 'text-ink-muted'
        )}
      >
        {date.getDate()}
      </span>

      <span className="hidden w-full min-w-0 flex-1 flex-col gap-1 md:flex">
        {events.slice(0, 2).map((event) => {
          const hasShifts = (shiftsByEvent[event.id]?.length ?? 0) > 0;
          const locationName = locations.find((item) => item.id === event.locationId)?.name;
          const meta = [event.time, locationName].filter(Boolean).join(' · ');

          return (
            <span
              key={event.id}
              className={cn(
                'flex min-w-0 flex-col gap-0.5 border-l-2 px-1.5 py-1',
                hasShifts
                  ? 'border-accent bg-surface text-ink'
                  : 'border-highlight-ink bg-highlight text-highlight-ink'
              )}
            >
              <span className="line-clamp-1 text-[11px] font-semibold leading-tight">
                {event.title || 'Tiệc'}
              </span>
              {(meta || !hasShifts) && (
                <span
                  className={cn(
                    'line-clamp-1 font-mono text-[9px] leading-tight',
                    hasShifts ? 'text-ink-muted' : 'font-semibold text-highlight-ink'
                  )}
                >
                  {!hasShifts && 'Cần xếp'}
                  {!hasShifts && meta ? ' · ' : ''}
                  {meta}
                </span>
              )}
            </span>
          );
        })}
        {eventCount > 2 && (
          <span className="font-mono text-[9px] text-ink-muted">+{eventCount - 2} sự kiện</span>
        )}
      </span>

      <span className="flex items-center justify-center gap-1 md:hidden">
        {events.slice(0, 3).map((event) => {
          const hasShifts = (shiftsByEvent[event.id]?.length ?? 0) > 0;
          return (
            <span
              key={event.id}
              aria-hidden="true"
              className={cn(
                'h-1.5 w-1.5 rounded-xs',
                hasShifts ? 'bg-accent' : 'border border-highlight-ink bg-transparent'
              )}
            />
          );
        })}
        {eventCount > 3 && (
          <span className="font-mono text-[9px] leading-none text-ink-muted">
            +{eventCount - 3}
          </span>
        )}
      </span>
    </button>
  );
};

export default memo(CalendarDay);
