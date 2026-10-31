import React, { memo, useMemo, useRef, useState } from 'react';
import { Event, Shift, Employee, UserSettings, Location } from '@/types/index';
import { eventService } from '@/lib/api/eventService';
import { useToast } from '@/components/ui/ToastProvider';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { parseDateOnly, toDateKey } from '@/utils/format';
import { EventModal } from '@/features/calendar/components/EventModal';
import { EventDetailModal } from '@/features/calendar/components/EventDetailModal';
import CalendarHeader from '@/features/calendar/components/CalendarHeader';
import CalendarGrid from '@/features/calendar/components/CalendarGrid';
import DayAgenda from '@/features/calendar/components/DayAgenda';

interface CalendarViewProps {
  events: Event[];
  shifts: Shift[];
  employees: Employee[];
  locations: Location[];
  settings: UserSettings;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  loading?: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  shifts,
  employees,
  locations,
  settings,
  currentDate: propDate,
  onDateChange,
  loading = false,
}) => {
  const { showToast } = useToast();

  const [localDate, setLocalDate] = useState(() => new Date());
  const displayDate = propDate ?? localDate;

  const [selectedDate, setSelectedDate] = useState(() => toDateKey(propDate ?? new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [blockedDelete, setBlockedDelete] = useState<{ name: string; count: number } | null>(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const agendaRef = useRef<HTMLDivElement>(null);

  const daysInMonth = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;

    return Array.from(
      { length: 42 },
      (_, index) => new Date(year, month, 1 - firstDayOffset + index)
    );
  }, [displayDate]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((event) => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [events]);

  const shiftsByEvent = useMemo(() => {
    const map: Record<string, Shift[]> = {};
    shifts.forEach((shift) => {
      if (!map[shift.eventId]) map[shift.eventId] = [];
      map[shift.eventId].push(shift);
    });
    return map;
  }, [shifts]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  const setMonth = (monthStart: Date) => {
    if (onDateChange) onDateChange(monthStart);
    else setLocalDate(monthStart);
  };

  const clampSelectionToMonth = (monthStart: Date) => {
    const day = parseDateOnly(selectedDate).getDate();
    const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    setSelectedDate(
      toDateKey(new Date(monthStart.getFullYear(), monthStart.getMonth(), Math.min(day, lastDay)))
    );
  };

  const changeMonth = (offset: number) => {
    const monthStart = new Date(displayDate.getFullYear(), displayDate.getMonth() + offset, 1);
    setMonth(monthStart);
    clampSelectionToMonth(monthStart);
  };

  const goToToday = () => {
    const today = new Date();
    const sameMonth =
      displayDate.getFullYear() === today.getFullYear() &&
      displayDate.getMonth() === today.getMonth();

    if (!sameMonth) setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(toDateKey(today));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(toDateKey(date));

    if (
      date.getMonth() !== displayDate.getMonth() ||
      date.getFullYear() !== displayDate.getFullYear()
    ) {
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }

    // Below xl the agenda stacks under the whole month grid; bring it into view.
    agendaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((item) => item.id === eventId);
    if (!event) return;

    const settledShifts = (shiftsByEvent[eventId] ?? []).filter(
      (shift) => shift.status !== 'unpaid'
    );
    if (settledShifts.length > 0) {
      setBlockedDelete({
        name: event.title || 'Tiệc',
        count: settledShifts.length,
      });
      return;
    }

    setDeleteTarget(event);
  };

  const confirmDeleteEvent = async () => {
    if (!deleteTarget || isDeletingEvent) return;

    setIsDeletingEvent(true);
    try {
      const eventShifts = shiftsByEvent[deleteTarget.id] ?? [];
      await eventService.deleteEventWithShifts(
        deleteTarget.id,
        eventShifts.map((shift) => shift.id)
      );
      showToast('Đã xóa sự kiện.', 'success');
      setDeleteTarget(null);
    } catch (error) {
      console.error('Delete event failed:', error);
      showToast('Không thể xóa sự kiện. Thử lại.', 'error');
    } finally {
      setIsDeletingEvent(false);
    }
  };

  const deleteShiftCount = deleteTarget ? (shiftsByEvent[deleteTarget.id]?.length ?? 0) : 0;

  return (
    <div className="min-h-dynamic bg-canvas">
      <div className="mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
        <CalendarHeader
          displayDate={displayDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onGoToToday={goToToday}
          onAddEvent={handleAddEvent}
        />

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0 border border-line bg-surface">
            <CalendarGrid
              daysInMonth={daysInMonth}
              displayDate={displayDate}
              eventsByDate={eventsByDate}
              shiftsByEvent={shiftsByEvent}
              selectedDate={selectedDate}
              locations={locations}
              loading={loading}
              onDateClick={handleDateClick}
            />
          </section>

          <div ref={agendaRef} className="min-w-0">
            <DayAgenda
              selectedDate={selectedDate}
              events={selectedEvents}
              shiftsByEvent={shiftsByEvent}
              locations={locations}
              loading={loading}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onViewEvent={setViewingEvent}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <EventModal
          isOpen
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          date={selectedDate}
          existingEvent={editingEvent}
          existingShifts={editingEvent ? (shiftsByEvent[editingEvent.id] ?? []) : []}
          employees={employees}
          locations={locations}
          settings={settings}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

      <Modal
        title="Xóa sự kiện?"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
              disabled={isDeletingEvent}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteEvent}
              className="flex-1"
              loading={isDeletingEvent}
            >
              Xóa sự kiện
            </Button>
          </div>
        }
      >
        {deleteTarget && (
          <p className="text-body-sm text-ink-soft">
            Sự kiện “{deleteTarget.title || 'Tiệc'}”
            {deleteShiftCount > 0
              ? ` và ${deleteShiftCount} ca liên quan sẽ bị xóa.`
              : ' sẽ bị xóa.'}{' '}
            Không thể hoàn tác.
          </p>
        )}
      </Modal>

      <Modal
        title="Không thể xóa sự kiện"
        isOpen={!!blockedDelete}
        onClose={() => setBlockedDelete(null)}
        footer={
          <Button variant="secondary" onClick={() => setBlockedDelete(null)} fullWidth>
            Đã hiểu
          </Button>
        }
      >
        {blockedDelete && (
          <p className="text-body-sm text-ink-soft">
            “{blockedDelete.name}” có {blockedDelete.count} ca đã trả hoặc đã ứng. Không thể xóa để
            giữ lịch sử lương.
          </p>
        )}
      </Modal>

      <EventDetailModal
        event={viewingEvent}
        shifts={shifts}
        locations={locations}
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default memo(CalendarView);
