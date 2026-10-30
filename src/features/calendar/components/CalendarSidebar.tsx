import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Pencil, Plus, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Event, Shift, Location } from '@/types/index';
import { formatDate } from '@/utils/format';

interface CalendarSidebarProps {
  selectedDate: string | null;
  events: Event[];
  shifts: Shift[]; // Need full shifts to filter by eventId and session
  locations: Location[];
  loading?: boolean;
  onAddEvent: () => void;
  onEditEvent: (evt: Event) => void;
  onDeleteEvent: (id: string) => void;
  onViewEvent: (evt: Event) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  selectedDate,
  events,
  shifts,
  locations,
  loading = false,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onViewEvent,
}) => {
  return (
    <div className={`bg-surface border border-line rounded-lg lg:h-full flex flex-col`}>
      {selectedDate ? (
        <div className="flex flex-col h-full">
          <div className={`px-4 py-3 border-b border-line flex justify-between items-center`}>
            <div>
              <p className={`text-[11px] text-ink-muted uppercase tracking-wide`}>Ngày chọn</p>
              <h3 className={`text-sm font-medium text-ink mt-0.5`}>{formatDate(selectedDate)}</h3>
            </div>
            <button
              onClick={onAddEvent}
              className={`p-2 rounded-lg bg-accent hover:bg-accent/90 text-on-accent shadow-sm shadow-accent/30 transition-all active:scale-95`}
            >
              <Plus size={16} className="text-on-accent" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-sidebar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`p-3 border border-line rounded-lg bg-surface-2`}>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Skeleton variant="circular" width={14} height={14} />
                        <div className="flex-1">
                          <Skeleton width="60%" height={16} className="mb-2" />
                          <Skeleton width="90%" height={12} />
                        </div>
                      </div>
                      <Skeleton width="30%" height={20} className="ml-5" />
                    </div>
                  ))}
                </motion.div>
              ) : events.length === 0 ? (
                <motion.div
                  key="empty-sidebar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col items-center justify-center py-12 text-ink-muted text-sm`}
                >
                  <p>Chưa có sự kiện</p>
                  <button
                    onClick={onAddEvent}
                    className="text-accent-ink mt-1 hover:underline text-xs flex items-center justify-center gap-1"
                  >
                    <Plus size={12} />
                    Tạo mới
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="content-sidebar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  {events.map((evt) => {
                    const loc = locations.find((l) => l.id === evt.locationId);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onViewEvent(evt)}
                        className={`group p-3 bg-surface-2 border border-line rounded-lg hover:border-accent/50 transition-colors cursor-pointer`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <Calendar size={14} className="text-accent-ink mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <h4 className={`text-sm font-medium text-ink truncate`}>
                                  {evt.title}
                                </h4>
                                {loc?.review === 'high' && (
                                  <ThumbsUp size={12} className="text-success flex-shrink-0" />
                                )}
                                {loc?.review === 'low' && (
                                  <ThumbsDown size={12} className="text-danger flex-shrink-0" />
                                )}
                              </div>
                              {loc && (
                                <p
                                  className={`text-[11px] text-info mt-0.5 flex items-center gap-1 min-w-0`}
                                >
                                  <MapPin size={12} className="flex-shrink-0" />
                                  <span className="truncate">{loc.name}</span>
                                </p>
                              )}
                              {evt.note && (
                                <p className={`text-xs text-ink-muted mt-1 line-clamp-2`}>
                                  {evt.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className="flex gap-1 flex-shrink-0"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => onEditEvent(evt)}
                              className="p-2 rounded-lg text-ink-muted hover:text-accent-ink hover:bg-accent/5 transition-colors"
                              title="Sửa"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteEvent(evt.id)}
                              className="p-2 rounded-lg text-ink-muted hover:text-danger hover:bg-danger/5 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 ml-5">
                          {(['morning', 'afternoon'] as const).map((session) => {
                            const count = shifts.filter(
                              (s: Shift) => s.eventId === evt.id && s.session === session
                            ).length;
                            if (count === 0) return null;
                            return (
                              <span
                                key={session}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${session === 'morning' ? 'bg-warning/10 text-warning' : 'bg-surface-2 text-accent-ink'}`}
                              >
                                {session === 'morning' ? 'Sáng' : 'Chiều'}: {count} công
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center h-64 text-ink-muted text-sm`}>
          <p>Chọn ngày để xem</p>
        </div>
      )}
    </div>
  );
};

export default memo(CalendarSidebar);
