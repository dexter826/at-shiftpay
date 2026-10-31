import React, { useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn, focusRingClasses } from '@/lib/utils';
import type { DashboardEventTile, WeekBoard } from '@/features/dashboard/dashboardData';

const EventTile: React.FC<{
  tile: DashboardEventTile;
  onOpenCalendar: () => void;
}> = ({ tile, onOpenCalendar }) => (
  <button
    type="button"
    onClick={onOpenCalendar}
    className={cn(
      'flex w-full flex-col gap-0.5 border-l-2 px-1.5 py-1 text-left transition-colors duration-fast ease-standard',
      'min-h-16',
      tile.assigned
        ? 'border-accent bg-accent-soft text-ink hover:bg-accent-soft/70'
        : 'border-highlight-ink/40 bg-highlight text-highlight-ink hover:brightness-95',
      focusRingClasses
    )}
  >
    <span className="line-clamp-2 text-[10px] font-semibold leading-tight">{tile.event.title}</span>
    <span
      className={cn(
        'mt-auto line-clamp-1 font-mono text-[10px]',
        tile.assigned ? 'text-accent-ink' : 'text-highlight-ink/70'
      )}
    >
      {tile.locationName}
      {tile.time ? ` · ${tile.time}` : ''}
    </span>
    <span
      className={cn(
        'flex items-center gap-1 font-mono text-[10px]',
        tile.assigned ? 'text-ink-muted' : 'text-highlight-ink/70'
      )}
    >
      <Users size={10} aria-hidden="true" />
      {tile.assigned ? `${tile.staffCount} người` : 'Cần xếp'}
    </span>
  </button>
);

const SessionList: React.FC<{
  title: string;
  tiles: DashboardEventTile[];
  onOpenCalendar: () => void;
}> = ({ title, tiles, onOpenCalendar }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <p className="font-mono text-mono-label text-ink-muted">{title}</p>
      <span className="font-mono text-mono-label text-ink-muted">{tiles.length}</span>
    </div>
    <div className="space-y-1.5">
      {tiles.length > 0 ? (
        tiles.map((tile) => <EventTile key={tile.id} tile={tile} onOpenCalendar={onOpenCalendar} />)
      ) : (
        <p className="border border-dashed border-line px-2 py-3 text-center text-label text-ink-muted">
          Chưa có sự kiện
        </p>
      )}
    </div>
  </div>
);

const WeekBoard: React.FC<{ board: WeekBoard; onOpenCalendar: () => void }> = ({
  board,
  onOpenCalendar,
}) => {
  const defaultKey =
    board.week.days.find((day) => day.isToday)?.key ?? board.week.days[0]?.key ?? '';
  const [userSelectedKey, setUserSelectedKey] = useState<string | null>(null);
  const selectedKey = board.week.days.some((day) => day.key === userSelectedKey)
    ? (userSelectedKey as string)
    : defaultKey;
  const selectedDay = board.days.find((day) => day.key === selectedKey) ?? board.days[0];

  return (
    <section className="min-w-0 border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-3">
        <h2 className="text-title text-ink">Lịch phân ca</h2>
        <button
          type="button"
          onClick={onOpenCalendar}
          className={cn(
            'inline-flex min-h-11 items-center px-1 text-label font-medium text-accent-ink hover:underline',
            focusRingClasses
          )}
        >
          Mở lịch
        </button>
      </div>

      {board.weeklyEvents.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={24} aria-hidden="true" />}
          title="Tuần này chưa có sự kiện"
          description="Thêm sự kiện để bắt đầu xếp ca."
          className="min-h-[280px]"
        />
      ) : (
        <>
          <div className="hidden grid-cols-[52px_repeat(7,minmax(0,1fr))] md:grid">
            <div className="border-b border-line bg-surface-2" />
            {board.week.days.map((day) => (
              <div
                key={day.key}
                className={cn(
                  'border-b border-l border-line px-1.5 py-1.5',
                  day.isToday && 'bg-accent-soft'
                )}
              >
                <p className="text-[10px] font-semibold text-ink">{day.dayLabel}</p>
                <p className="font-mono text-[8.5px] text-ink-muted">{day.dateLabel}</p>
              </div>
            ))}

            {(['morning', 'afternoon'] as const).map((session) => (
              <React.Fragment key={session}>
                <div className="flex items-start justify-center border-b border-line bg-surface-2 pt-2">
                  <span className="font-mono text-[8.5px] text-ink-muted">
                    {session === 'morning' ? 'Sáng' : 'Chiều'}
                  </span>
                </div>
                {board.days.map((day) => (
                  <div
                    key={`${day.key}-${session}`}
                    className={cn(
                      'min-h-[78px] border-b border-l border-line p-1',
                      day.isToday && 'bg-accent-soft/30'
                    )}
                  >
                    <div className="flex h-full flex-col gap-1">
                      {day[session].map((tile) => (
                        <EventTile key={tile.id} tile={tile} onOpenCalendar={onOpenCalendar} />
                      ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="md:hidden">
            <div className="grid grid-cols-7 gap-0.5 border-b border-line p-1">
              {board.week.days.map((day) => {
                const isSelected = day.key === selectedKey;
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setUserSelectedKey(day.key)}
                    aria-pressed={isSelected}
                    aria-label={`${day.dayLabel} ${day.dateLabel}`}
                    className={cn(
                      'flex min-h-11 flex-col items-center justify-center rounded-sm text-[9px]',
                      isSelected
                        ? 'bg-highlight text-highlight-ink'
                        : 'text-ink-muted hover:bg-surface-2',
                      day.isToday && !isSelected && 'text-accent',
                      focusRingClasses
                    )}
                  >
                    <b className="text-[13px] font-medium">{day.date.getDate()}</b>
                    <span>{day.dayLabel}</span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-3 p-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-body-sm font-semibold text-ink">
                  {selectedDay.dayLabel}, {selectedDay.dateLabel}
                </h3>
                <span className="font-mono text-mono-label text-ink-muted">
                  {selectedDay.morning.length + selectedDay.afternoon.length} sự kiện
                </span>
              </div>
              <SessionList
                title="Sáng"
                tiles={selectedDay.morning}
                onOpenCalendar={onOpenCalendar}
              />
              <SessionList
                title="Chiều"
                tiles={selectedDay.afternoon}
                onOpenCalendar={onOpenCalendar}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default WeekBoard;
