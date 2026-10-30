import type { Event, Location, Shift, ShiftSession } from '@/types/index';

export interface WeekDay {
  date: Date;
  key: string;
  dayLabel: string;
  dateLabel: string;
  isToday: boolean;
}

export interface WeekRange {
  start: Date;
  startKey: string;
  end: Date;
  endKey: string;
  weekNumber: number;
  label: string;
  days: WeekDay[];
}

export interface DashboardEventTile {
  id: string;
  event: Event;
  session: ShiftSession;
  locationName: string;
  staffCount: number;
  amount: number;
  time?: string;
  assigned: boolean;
}

export interface DashboardDay extends WeekDay {
  morning: DashboardEventTile[];
  afternoon: DashboardEventTile[];
}

export interface WeekBoard {
  week: WeekRange;
  days: DashboardDay[];
  weeklyEvents: Event[];
  weeklyShifts: Shift[];
  unassignedEvents: Event[];
  kpis: {
    events: number;
    shifts: number;
    amount: number;
    unassigned: number;
  };
}

export interface LocationSummaryRow {
  id: string;
  name: string;
  events: number;
  shifts: number;
}

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatDayMonth = (date: Date) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date);

const getIsoWeekNumber = (date: Date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const getWeekRange = (viewDate: Date): WeekRange => {
  const todayKey = toDateKey(new Date());
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
  const offset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - offset);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = toDateKey(date);
    return {
      date,
      key,
      dayLabel: DAY_LABELS[date.getDay()],
      dateLabel: formatDayMonth(date),
      isToday: key === todayKey,
    };
  });

  return {
    start,
    startKey: toDateKey(start),
    end,
    endKey: toDateKey(end),
    weekNumber: getIsoWeekNumber(start),
    label: `Tuần ${getIsoWeekNumber(start)} · ${formatDayMonth(start)} – ${formatDayMonth(end)}/${end.getFullYear()}`,
    days,
  };
};

export const getMonthLabel = (viewDate: Date) =>
  new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(viewDate);

export const filterByMonth = <T extends { date: string }>(items: T[], viewDate: Date) => {
  const prefix = `${viewDate.getFullYear()}-${pad(viewDate.getMonth() + 1)}`;
  return items.filter((item) => item.date.startsWith(prefix));
};

const inferSession = (event: Event): ShiftSession => {
  const hour = Number(event.time?.split(':')[0]);
  return Number.isFinite(hour) && hour < 12 ? 'morning' : 'afternoon';
};

export const buildWeekBoard = (
  events: Event[],
  shifts: Shift[],
  locations: Location[],
  week: WeekRange
): WeekBoard => {
  const inWeek = (date: string) => date >= week.startKey && date <= week.endKey;
  const weeklyEvents = events.filter((event) => inWeek(event.date));
  const weeklyShifts = shifts.filter((shift) => inWeek(shift.date));
  const locationById = new Map(locations.map((location) => [location.id, location]));
  const shiftsByEvent = new Map<string, Shift[]>();

  weeklyShifts.forEach((shift) => {
    const current = shiftsByEvent.get(shift.eventId) || [];
    current.push(shift);
    shiftsByEvent.set(shift.eventId, current);
  });

  const tilesByDay = new Map<string, DashboardEventTile[]>();
  const unassignedEvents: Event[] = [];

  weeklyEvents.forEach((event) => {
    const eventShifts = shiftsByEvent.get(event.id) || [];
    const locationName = event.locationId
      ? locationById.get(event.locationId)?.name || 'Chưa gán'
      : 'Chưa gán';

    if (eventShifts.length === 0) {
      unassignedEvents.push(event);
      const tile: DashboardEventTile = {
        id: `${event.id}-${inferSession(event)}`,
        event,
        session: inferSession(event),
        locationName,
        staffCount: 0,
        amount: 0,
        time: event.time,
        assigned: false,
      };
      const current = tilesByDay.get(event.date) || [];
      current.push(tile);
      tilesByDay.set(event.date, current);
      return;
    }

    const sessions = new Set(eventShifts.map((shift) => shift.session));
    sessions.forEach((session) => {
      const sessionShifts = eventShifts.filter((shift) => shift.session === session);
      const staffCount = new Set(sessionShifts.map((shift) => shift.employeeId)).size;
      const amount = sessionShifts.reduce((total, shift) => total + shift.amount, 0);
      const tile: DashboardEventTile = {
        id: `${event.id}-${session}`,
        event,
        session,
        locationName,
        staffCount,
        amount,
        time: event.time,
        assigned: true,
      };
      const current = tilesByDay.get(event.date) || [];
      current.push(tile);
      tilesByDay.set(event.date, current);
    });
  });

  const days: DashboardDay[] = week.days.map((day) => {
    const tiles = (tilesByDay.get(day.key) || []).sort((a, b) =>
      (a.time || '').localeCompare(b.time || '')
    );
    return {
      ...day,
      morning: tiles.filter((tile) => tile.session === 'morning'),
      afternoon: tiles.filter((tile) => tile.session === 'afternoon'),
    };
  });

  return {
    week,
    days,
    weeklyEvents,
    weeklyShifts,
    unassignedEvents,
    kpis: {
      events: weeklyEvents.length,
      shifts: weeklyShifts.length,
      amount: weeklyShifts.reduce((total, shift) => total + shift.amount, 0),
      unassigned: unassignedEvents.length,
    },
  };
};

export const buildLocationSummary = (
  locations: Location[],
  events: Event[],
  shifts: Shift[],
  week: WeekRange
): LocationSummaryRow[] => {
  const inWeek = (date: string) => date >= week.startKey && date <= week.endKey;
  const weeklyEvents = events.filter((event) => inWeek(event.date));
  const weeklyShifts = shifts.filter((shift) => inWeek(shift.date));
  const eventById = new Map(weeklyEvents.map((event) => [event.id, event]));
  const rows = new Map<string, LocationSummaryRow>();

  const ensure = (id: string, name: string) => {
    if (!rows.has(id)) rows.set(id, { id, name, events: 0, shifts: 0 });
    return rows.get(id)!;
  };

  locations.forEach((location) => ensure(location.id, location.name));

  weeklyEvents.forEach((event) => {
    const location = locations.find((item) => item.id === event.locationId);
    const row = ensure(location?.id || '__unassigned', location?.name || 'Chưa gán');
    row.events += 1;
  });

  weeklyShifts.forEach((shift) => {
    const event = eventById.get(shift.eventId);
    const location = event ? locations.find((item) => item.id === event.locationId) : undefined;
    const row = ensure(location?.id || '__unassigned', location?.name || 'Chưa gán');
    row.shifts += 1;
  });

  return Array.from(rows.values())
    .filter((row) => row.events > 0 || row.shifts > 0)
    .sort((a, b) => b.events - a.events || b.shifts - a.shifts);
};
