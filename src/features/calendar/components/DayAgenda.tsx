import React, { memo } from 'react';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';
import { Event, Location, Shift, ShiftSession } from '@/types/index';
import { formatDate } from '@/utils/format';

interface DayAgendaProps {
  selectedDate: string;
  events: Event[];
  shiftsByEvent: Record<string, Shift[]>;
  locations: Location[];
  loading?: boolean;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewEvent: (event: Event) => void;
}

const SESSION_LABELS: Record<ShiftSession, string> = {
  morning: 'Sáng',
  afternoon: 'Chiều',
};

const DayAgenda: React.FC<DayAgendaProps> = ({
  selectedDate,
  events,
  shiftsByEvent,
  locations,
  loading = false,
  onEditEvent,
  onDeleteEvent,
  onViewEvent,
}) => (
  <section className="flex min-w-0 flex-col border border-line bg-surface">
    <div className="border-b border-line px-4 py-3">
      <p className="font-mono text-mono-label text-ink-muted">Ngày đã chọn</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h2 className="text-title text-ink">{formatDate(selectedDate)}</h2>
        <span className="font-mono text-mono-label text-ink-muted">
          {loading ? 'Đang tải' : `${events.length} sự kiện`}
        </span>
      </div>
    </div>

    {loading ? (
      <div className="space-y-3 p-4" aria-busy="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-2 border-b border-line pb-3 last:border-b-0">
            <Skeleton width="62%" height={16} />
            <Skeleton width="42%" height={12} />
            <Skeleton width="28%" height={20} />
          </div>
        ))}
      </div>
    ) : events.length === 0 ? (
      <EmptyState
        icon={<CalendarDays size={24} aria-hidden="true" />}
        title="Ngày này chưa có sự kiện"
        description="Chọn ngày khác hoặc thêm sự kiện mới."
        className="min-h-[260px]"
      />
    ) : (
      <div>
        {events.map((event) => {
          const eventShifts = shiftsByEvent[event.id] ?? [];
          const hasShifts = eventShifts.length > 0;
          const location = locations.find((item) => item.id === event.locationId);
          const sessionCounts = (['morning', 'afternoon'] as const)
            .map((session) => ({
              session,
              count: eventShifts.filter((shift) => shift.session === session).length,
            }))
            .filter((row) => row.count > 0);

          return (
            <article key={event.id} className="border-b border-line last:border-b-0">
              <div
                className={cn(
                  'flex items-start gap-2 border-l-2 px-3 py-2',
                  hasShifts ? 'border-accent' : 'border-highlight-ink'
                )}
              >
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onViewEvent(event)}
                    className={cn(
                      'flex min-h-11 w-full items-center rounded-sm text-left text-body-sm font-semibold text-ink transition-colors duration-fast ease-standard hover:text-accent-ink',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <span className="line-clamp-2">{event.title || 'Tiệc'}</span>
                  </button>
                  <p className="font-mono text-label leading-relaxed text-ink-muted">
                    {event.time || '--:--'} · {location?.name ?? 'Chưa có địa điểm'}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {hasShifts ? (
                      sessionCounts.map(({ session, count }) => (
                        <Tag key={session}>
                          {SESSION_LABELS[session]} · {count} ca
                        </Tag>
                      ))
                    ) : (
                      <Tag variant="highlight">Cần xếp</Tag>
                    )}
                  </div>
                  {event.note && (
                    <p className="mt-1.5 line-clamp-2 text-label text-ink-muted">{event.note}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center">
                  <button
                    type="button"
                    onClick={() => onEditEvent(event)}
                    aria-label={`Sửa sự kiện ${event.title || 'Tiệc'}`}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-2 hover:text-ink',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(event.id)}
                    aria-label={`Xóa sự kiện ${event.title || 'Tiệc'}`}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:bg-danger/10 hover:text-danger',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )}
  </section>
);

export default memo(DayAgenda);
